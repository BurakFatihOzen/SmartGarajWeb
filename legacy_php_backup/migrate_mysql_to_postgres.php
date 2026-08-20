<?php
/**
 * SmartGaraj - MySQL to PostgreSQL Data Migration Script
 */
try {
    echo "=== 1. Veritabanı Bağlantıları Kuruluyor... ===\n";
    
    // MySQL Kaynak Bağlantısı
    $mysql = new PDO("mysql:host=localhost;dbname=smartgaraj;charset=utf8mb4", "root", "");
    $mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "-> MySQL bağlantısı başarılı.\n";

    // PostgreSQL Hedef Bağlantısı
    $pg = new PDO("pgsql:host=localhost;port=5432;dbname=smartgaraj", "postgres", "1234");
    $pg->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "-> PostgreSQL bağlantısı başarılı.\n\n";

    $pg->beginTransaction();

    // ==========================================
    // 2. KULLANICILAR AKTARIMI
    // ==========================================
    echo "=== 2. Kullanıcılar Aktarılıyor... ===\n";
    $kullanicilar = $mysql->query("SELECT * FROM kullanicilar ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    $user_stmt = $pg->prepare("INSERT INTO kullanicilar (id, ad_soyad, email, sifre, kayit_tarihi) VALUES (?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING");
    
    $user_count = 0;
    foreach ($kullanicilar as $u) {
        $user_stmt->execute([
            $u['id'],
            $u['ad_soyad'],
            $u['email'],
            $u['sifre'],
            $u['kayit_tarihi'] ?? date('Y-m-d H:i:s')
        ]);
        $user_count++;
    }
    echo "-> Toplam $user_count kullanıcı PostgreSQL'e aktarıldı.\n\n";

    // ==========================================
    // 3. ARAÇLAR AKTARIMI
    // ==========================================
    echo "=== 3. Araçlar Aktarılıyor... ===\n";
    $araclar = $mysql->query("SELECT * FROM araclar ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    $arac_stmt = $pg->prepare("INSERT INTO araclar (id, kullanici_id, plaka, marka, model, motor, yil, guncel_km, ruhsat_tipi, muayene_bitis, sigorta_bitis, kasko_bitis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING");

    $arac_count = 0;
    foreach ($araclar as $a) {
        // Kontrol: Kullanıcı PostgreSQL'de var mı?
        $check_u = $pg->prepare("SELECT id FROM kullanicilar WHERE id = ?");
        $check_u->execute([$a['kullanici_id']]);
        if (!$check_u->fetch()) {
            echo "-> UYARI: {$a['plaka']} plakalı araç atlandı (Kullanıcı ID {$a['kullanici_id']} bulunamadı).\n";
            continue;
        }

        $km = max(0, (int)$a['guncel_km']);
        $yil = ($a['yil'] > 1900 && $a['yil'] <= 2100) ? (int)$a['yil'] : null;

        $arac_stmt->execute([
            $a['id'],
            $a['kullanici_id'],
            $a['plaka'] ?? 'Plakasız',
            $a['marka'] ?? 'Bilinmiyor',
            $a['model'] ?? 'Bilinmiyor',
            $a['motor'] ?? '',
            $yil,
            $km,
            $a['ruhsat_tipi'] ?? 'otomobil',
            !empty($a['muayene_bitis']) ? $a['muayene_bitis'] : null,
            !empty($a['sigorta_bitis']) ? $a['sigorta_bitis'] : null,
            !empty($a['kasko_bitis']) ? $a['kasko_bitis'] : null
        ]);
        $arac_count++;
    }
    echo "-> Toplam $arac_count araç PostgreSQL'e aktarıldı.\n\n";

    // ==========================================
    // 4. BAKIMLAR AKTARIMI
    // ==========================================
    echo "=== 4. Bakım Kayıtları Aktarılıyor... ===\n";
    $bakimlar = $mysql->query("SELECT * FROM bakimlar ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    $bakim_stmt = $pg->prepare("INSERT INTO bakimlar (id, arac_id, islem_tarihi, islem_turu, islem_km, maliyet_tl, aciklama) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO NOTHING");

    $bakim_count = 0;
    $orphan_count = 0;
    foreach ($bakimlar as $b) {
        // Kontrol: Araç PostgreSQL'de var mı?
        $check_a = $pg->prepare("SELECT id FROM araclar WHERE id = ?");
        $check_a->execute([$b['arac_id']]);
        if (!$check_a->fetch()) {
            $orphan_count++;
            continue; // Silinmiş araçların sahipsiz bakım kayıtları
        }

        $km = max(0, (int)$b['islem_km']);
        $maliyet = max(0.00, (float)$b['maliyet_tl']);
        $tarih = !empty($b['islem_tarihi']) ? $b['islem_tarihi'] : date('Y-m-d');

        $bakim_stmt->execute([
            $b['id'],
            $b['arac_id'],
            $tarih,
            $b['islem_turu'] ?? 'Genel Bakım',
            $km,
            $maliyet,
            $b['aciklama'] ?? ''
        ]);
        $bakim_count++;
    }
    echo "-> Toplam $bakim_count bakım kaydı aktarıldı ($orphan_count adet eski/silinmiş araç kaydı temizlendi).\n\n";

    // ==========================================
    // 5. SEQUENCE (AUTO-INCREMENT) SENKRONİZASYONU
    // ==========================================
    echo "=== 5. PostgreSQL ID Sayaçları Senkronize Ediliyor... ===\n";
    $pg->exec("SELECT setval('kullanicilar_id_seq', COALESCE((SELECT MAX(id) FROM kullanicilar), 1));");
    $pg->exec("SELECT setval('araclar_id_seq', COALESCE((SELECT MAX(id) FROM araclar), 1));");
    $pg->exec("SELECT setval('bakimlar_id_seq', COALESCE((SELECT MAX(id) FROM bakimlar), 1));");
    echo "-> ID sayaçları güncellendi.\n\n";

    $pg->commit();
    echo "🎉 TÜM VERİLER BAŞARIYLA POSTGRESQL'E AKTARILDI! 🎉\n";

} catch (Exception $e) {
    if (isset($pg) && $pg->inTransaction()) {
        $pg->rollBack();
    }
    echo "\n❌ HATA OLUŞTU: " . $e->getMessage() . "\n";
}
