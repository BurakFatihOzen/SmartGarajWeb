<?php
include 'baglan.php';
session_start();

if (isset($_GET['islem'])) {
    $islem = $_GET['islem'];

    // ==========================================
    // 1. KAYIT OLMA İŞLEMİ
    // ==========================================
    if ($islem == 'kayit') {
        // trim() ile başta veya sonda yanlışlıkla bırakılan boşlukları temizliyoruz
        $ad = htmlspecialchars(trim($_POST['ad_soyad']));
        $email = trim($_POST['email']);
        $sifre = $_POST['sifre'];

        // GÜVENLİK ADIMI 1: E-posta formatı gerçekten geçerli mi?
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header("Location: login.php?durum=gecersiz_email");
            exit;
        }

        // GÜVENLİK ADIMI 2: Bu e-posta adresi sistemde zaten var mı?
        // GÜVENLİK ADIMI 2: Bu e-posta adresi sistemde zaten var mı?
        $eposta_kontrol = $db->prepare("SELECT id FROM kullanicilar WHERE email = ?");  
        $eposta_kontrol->execute([$email]);
        $kayitli_mi = $eposta_kontrol->fetch(PDO::FETCH_ASSOC);

        if ($kayitli_mi) { // Eğer veri döndüyse (yani true ise) kayıtlıdır
            header("Location: login.php?durum=mukerrer");
            exit;
        }

        // Kontrollerden başarıyla geçildiyse şifreyi hash'le ve kaydet
        $sifre_hash = password_hash($sifre, PASSWORD_DEFAULT);
        $sorgu = $db->prepare("INSERT INTO kullanicilar (ad_soyad, email, sifre) VALUES (?, ?, ?)");
        $kaydet = $sorgu->execute([$ad, $email, $sifre_hash]);
        
        if ($kaydet) {
            header("Location: login.php?durum=kayitok");
        } else {
            header("Location: login.php?durum=hata");
        }
        exit;
    }

    // ==========================================
    // 2. GİRİŞ YAPMA İŞLEMİ
    // ==========================================
    if ($islem == 'giris') {
        $email = trim($_POST['email']);
        $sifre = $_POST['sifre'];

        $sorgu = $db->prepare("SELECT * FROM kullanicilar WHERE email = ?");
        $sorgu->execute([$email]);
        $user = $sorgu->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($sifre, $user['sifre'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['ad_soyad'];
            header("Location: index.php");
        } else {
            header("Location: login.php?durum=hata");
        }
        exit;
    }

    // ==========================================
    // 3. ÇIKIŞ YAPMA İŞLEMİ
    // ==========================================
    if ($islem == 'cikis') {
        session_destroy();
        header("Location: login.php");
        exit;
    }

    // GÜVENLİK NOTU: Aşağıdaki işlemler için giriş yapılmış olması şarttır!
    if(!isset($_SESSION['user_id'])) {
        header("Location: login.php");
        exit;
    }
    $user_id = $_SESSION['user_id'];
    // ==========================================

    // 4. ARAÇ EKLEME İŞLEMİ

    // ==========================================

    if ($islem == 'arac_ekle') {

        try {

            // Eski veriler

            $plaka = trim($_POST['arac_plaka']);

            $marka = ($_POST['arac_marka'] == 'diger') ? trim($_POST['arac_marka_diger']) : $_POST['arac_marka'];

            $model = ($_POST['arac_model'] == 'diger') ? trim($_POST['arac_model_diger']) : $_POST['arac_model'];

            $motor = ($_POST['arac_motor'] == 'diger') ? trim($_POST['arac_motor_diger']) : $_POST['arac_motor'];

            $yil = $_POST['arac_yil'];

            $km = $_POST['arac_guncel_km'];



            // Yeni eklenen veriler (Eğer boşlarsa veritabanına NULL olarak gönderiyoruz ki 500 vermesin)

            $ruhsat_tipi = $_POST['ruhsat_tipi'] ?? 'otomobil';

            $muayene_bitis = !empty($_POST['muayene_bitis']) ? $_POST['muayene_bitis'] : null;

            $sigorta_bitis = !empty($_POST['sigorta_bitis']) ? $_POST['sigorta_bitis'] : null;

            $kasko_bitis = !empty($_POST['kasko_bitis']) ? $_POST['kasko_bitis'] : null;



            // Formdaki yeni eklediğin "Kasko Durumu" kontrolü!

            // Eğer "Yok" seçilmişse, formda tarih yazsa bile kasko_bitis'i zorla iptal (null) ediyoruz.

            if(isset($_POST['kasko_durumu']) && $_POST['kasko_durumu'] == 'Yok') {

                $kasko_bitis = null;

            }



            // Sorgu (Toplam 11 Sütun)

            $sorgu = $db->prepare("INSERT INTO araclar (plaka, marka, model, motor, yil, guncel_km, kullanici_id, ruhsat_tipi, muayene_bitis, sigorta_bitis, kasko_bitis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $kaydet = $sorgu->execute([$plaka, $marka, $model, $motor, $yil, $km, $user_id, $ruhsat_tipi, $muayene_bitis, $sigorta_bitis, $kasko_bitis]);



            if ($kaydet) {

                header("Location: index.php?durum=ok");

            } else {

                header("Location: index.php?durum=hata");

            }

            exit;



        } catch (PDOException $e) {

            // SİHİRLİ DOKUNUŞ: Eğer sistem yine çökerse sana 500 beyaz ekranı vermek yerine, sorunun tam kaynağını söyleyecek.

            die("<div style='background:#f8d7da; color:#721c24; padding:20px; font-family:sans-serif; border-radius:5px;'>

                    <b>Veritabanı Hatası Yakalandı! (500 Hatası Engellendi)</b><br><br>

                    MySQL'in verdiği hata: <i>" . $e->getMessage() . "</i><br><br>

                    Bu hatanın ekran görüntüsünü alırsan sorunu saniyeler içinde çözeriz.

                 </div>");

        }

    }

    // ==========================================
    // 5. BAKIM EKLEME İŞLEMİ (GÜVENLİ & AÇIKLAMALI)
    // ==========================================
    if ($islem == 'bakim_ekle') {
        $arac_id = $_POST['arac_id']; 
        
        // GÜVENLİK KONTROLÜ: Araç gerçekten bu kullanıcının mı?
        $kontrol = $db->prepare("SELECT id FROM araclar WHERE id = ? AND kullanici_id = ?");
        $kontrol->execute([$arac_id, $user_id]);
        if(!$kontrol->fetch()) { header("Location: index.php?durum=yetkisiz"); exit; }

        $tarih = $_POST['bakim_tarihi'];
        $km = $_POST['bakim_km'];
        $maliyet = $_POST['bakim_maliyet'];
        $turu = ($_POST['bakim_turu'] == 'diger') ? trim($_POST['bakim_turu_diger']) : $_POST['bakim_turu'];
        
        // YENİ: Açıklama alanını temizleyip al
        $aciklama = htmlspecialchars(trim($_POST['bakim_aciklama']));

        $sorgu = $db->prepare("INSERT INTO bakimlar (arac_id, islem_tarihi, islem_turu, islem_km, maliyet_tl, aciklama) VALUES (?, ?, ?, ?, ?, ?)");
        $kaydet = $sorgu->execute([$arac_id, $tarih, $turu, $km, $maliyet, $aciklama]);

        header("Location: index.php?durum=" . ($kaydet ? "ok" : "hata"));
        exit;
    }

    // ==========================================
    // 6. ARAÇ SİLME İŞLEMİ (GÜVENLİ)
    // ==========================================
    if ($islem == 'arac_sil') {
        $id = (int)$_GET['id'];
        
        // GÜVENLİK KONTROLÜ: Sadece kendi aracını silebilir!
        $arac_sil = $db->prepare("DELETE FROM araclar WHERE id = ? AND kullanici_id = ?");
        $kaydet = $arac_sil->execute([$id, $user_id]);

        if ($arac_sil->rowCount() > 0) { 
            // Araç silindiyse bakımlarını da temizle
            $bakim_sil = $db->prepare("DELETE FROM bakimlar WHERE arac_id = ?");
            $bakim_sil->execute([$id]);
            header("Location: araclar.php?durum=silindi"); 
        } else { 
            header("Location: araclar.php?durum=hata"); 
        }
        exit;
    }

    // ==========================================
    // 7. PROFİL GÜNCELLEME İŞLEMİ
    // ==========================================
    if ($islem == 'profil_guncelle') {
        $ad_soyad = htmlspecialchars(trim($_POST['ad_soyad']));
        $email = htmlspecialchars(trim($_POST['email']));
        
        $sorgu = $db->prepare("UPDATE kullanicilar SET ad_soyad = ?, email = ? WHERE id = ?");
        $guncelle = $sorgu->execute([$ad_soyad, $email, $user_id]);
        
        if ($guncelle) {
            $_SESSION['user_name'] = $ad_soyad; // Sağ üstteki ismin anında değişmesi için
            header("Location: index.php?durum=profil_ok");
        } else {
            header("Location: index.php?durum=hata");
        }
        exit;
    }

    // ==========================================
    // 8. ŞİFRE DEĞİŞTİRME İŞLEMİ
    // ==========================================
    if ($islem == 'sifre_degistir') {
        $eski_sifre = $_POST['eski_sifre'];
        $yeni_sifre = password_hash($_POST['yeni_sifre'], PASSWORD_DEFAULT);
        
        // Önce mevcut şifreyi doğrula ki başkası değiştiremesin
        $sorgu = $db->prepare("SELECT sifre FROM kullanicilar WHERE id = ?");
        $sorgu->execute([$user_id]);
        $user = $sorgu->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify($eski_sifre, $user['sifre'])) {
            $guncelle = $db->prepare("UPDATE kullanicilar SET sifre = ? WHERE id = ?");
            $guncelle->execute([$yeni_sifre, $user_id]);
            header("Location: index.php?durum=sifre_ok");
        } else {
            // Eski şifre yanlışsa
            header("Location: index.php?durum=sifre_hata");
        }
        exit;
    }


}
?>