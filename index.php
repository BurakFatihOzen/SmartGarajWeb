<?php 
session_start();

if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'http') {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit;
}

if(!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'baglan.php'; 

$user_id = $_SESSION['user_id'];

// --- YENİ EKLENDİ: Profil Modal'ı için kullanıcı bilgilerini çek ---
$kullanici_sorgu = $db->prepare("SELECT * FROM kullanicilar WHERE id = ?");
$kullanici_sorgu->execute([$user_id]);
$kullanici = $kullanici_sorgu->fetch(PDO::FETCH_ASSOC);

// Tüm araçları çek (Menü için)
$tum_araclar_sorgu = $db->prepare("SELECT * FROM araclar WHERE kullanici_id = ? ORDER BY id DESC");
$tum_araclar_sorgu->execute([$user_id]);
$tum_araclar = $tum_araclar_sorgu->fetchAll(PDO::FETCH_ASSOC);

// Aktif Aracı Belirle
if (isset($_GET['secili_arac'])) {
    $secili_id = (int)$_GET['secili_arac'];
    $arac_sorgu = $db->prepare("SELECT * FROM araclar WHERE id = ? AND kullanici_id = ?");
    $arac_sorgu->execute([$secili_id, $user_id]);
    $arac = $arac_sorgu->fetch(PDO::FETCH_ASSOC);
} else {
    $arac_sorgu = $db->prepare("SELECT * FROM araclar WHERE kullanici_id = ? ORDER BY id DESC LIMIT 1");
    $arac_sorgu->execute([$user_id]);
    $arac = $arac_sorgu->fetch(PDO::FETCH_ASSOC);
}
$aktif_arac_id = $arac ? $arac['id'] : 0;

// Özet Bilgiler (Seçili araca özel harcama)
if ($aktif_arac_id > 0) {
    $toplam_sorgu = $db->prepare("SELECT SUM(maliyet_tl) as toplam FROM bakimlar WHERE arac_id = ?");
    $toplam_sorgu->execute([$aktif_arac_id]);
    $toplam_harcama = number_format($toplam_sorgu->fetch(PDO::FETCH_ASSOC)['toplam'] ?? 0, 0, ',', '.');
} else {
    $toplam_harcama = "0";
}

// Toplam Kayıtlı Araç
$arac_sayisi_sorgu = $db->prepare("SELECT COUNT(*) as sayi FROM araclar WHERE kullanici_id = ?");
$arac_sayisi_sorgu->execute([$user_id]);
$arac_sayisi = $arac_sayisi_sorgu->fetch(PDO::FETCH_ASSOC)['sayi'] ?? 0;

// Seçili Aracın Bakımlarını Çek
if($aktif_arac_id > 0) {
    $bakim_sorgu = $db->prepare("SELECT * FROM bakimlar WHERE arac_id = ? ORDER BY islem_tarihi DESC");
    $bakim_sorgu->execute([$aktif_arac_id]);
    $bakimlar = $bakim_sorgu->fetchAll(PDO::FETCH_ASSOC);
} else {
    $bakimlar = [];
}

// =================================================================
// --- YENİ EKLENDİ: TARİH HESAPLAMALARI VE ROZET LOGİC (Adım 4) ---
// =================================================================
if ($arac) {
    $bugun = new DateTime();

    // 1. MUAYENE HESAPLAMA
    if (!empty($arac['muayene_bitis'])) {
        $muayene_tarihi = new DateTime($arac['muayene_bitis']);
        $mua_kalan = (int)$bugun->diff($muayene_tarihi)->format("%r%a");
        if ($mua_kalan < 0) { $mua_renk = "danger"; $mua_mesaj = "Süresi Geçti!"; $mua_ikon = "bi-x-circle-fill"; }
        elseif ($mua_kalan <= 30) { $mua_renk = "warning"; $mua_mesaj = $mua_kalan . " gün kaldı"; $mua_ikon = "bi-exclamation-triangle-fill"; }
        else { $mua_renk = "success"; $mua_mesaj = $mua_kalan . " gün var"; $mua_ikon = "bi-check-circle-fill"; }
    } else { $mua_renk = "secondary"; $mua_mesaj = "Veri Yok"; $mua_ikon = "bi-dash-circle"; }

    // 2. SİGORTA HESAPLAMA
    if (!empty($arac['sigorta_bitis'])) {
        $sigorta_tarihi = new DateTime($arac['sigorta_bitis']);
        $sig_kalan = (int)$bugun->diff($sigorta_tarihi)->format("%r%a");
        if ($sig_kalan < 0) { $sig_renk = "danger"; $sig_mesaj = "Süresi Geçti!"; $sig_ikon = "bi-x-circle-fill"; }
        elseif ($sig_kalan <= 30) { $sig_renk = "warning"; $sig_mesaj = $sig_kalan . " gün kaldı"; $sig_ikon = "bi-exclamation-triangle-fill"; }
        else { $sig_renk = "success"; $sig_mesaj = $sig_kalan . " gün var"; $sig_ikon = "bi-check-circle-fill"; }
    } else { $sig_renk = "secondary"; $sig_mesaj = "Veri Yok"; $sig_ikon = "bi-dash-circle"; }

    // 3. KASKO HESAPLAMA
    if (!empty($arac['kasko_bitis'])) {
        $kasko_tarihi = new DateTime($arac['kasko_bitis']);
        $kas_kalan = (int)$bugun->diff($kasko_tarihi)->format("%r%a");
        if ($kas_kalan < 0) { $kas_renk = "danger"; $kas_mesaj = "Süresi Geçti!"; $kas_ikon = "bi-x-circle-fill"; }
        elseif ($kas_kalan <= 30) { $kas_renk = "warning"; $kas_mesaj = $kas_kalan . " gün kaldı"; $kas_ikon = "bi-exclamation-triangle-fill"; }
        else { $kas_renk = "success"; $kas_mesaj = $kas_kalan . " gün var"; $kas_ikon = "bi-check-circle-fill"; }
    } else { $kas_renk = "secondary"; $kas_mesaj = "Yaptırılmamış"; $kas_ikon = "bi-shield-slash"; }
}
// =================================================================
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>SmartGaraj - Dashboard</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --bg-main: #121212; --card-bg: #1e1e24; --text-main: #ffffff; 
            --text-muted: #a0a0a0; --border-color: #404040; 
            --accent-color: #ff8c00; --input-bg: #2a2a32;
        }
        body.light-mode {
            --bg-main: #f4f7f6; --card-bg: #ffffff; --text-main: #1a1a20; 
            --text-muted: #6c757d; --border-color: #dee2e6; --input-bg: #f8f9fa;
        }
        body { background-color: var(--bg-main); color: var(--text-main); font-family: 'Segoe UI', sans-serif; transition: 0.3s; padding-bottom: 50px; }
        
        /* NAVBAR VE PROFİL */
        .navbar { background-color: var(--card-bg) !important; border-bottom: 2px solid var(--accent-color); transition: 0.3s; margin-bottom: 30px;}
        .navbar-brand { color: var(--accent-color) !important; font-weight: 800; z-index: 1051; position: relative;}
        .nav-btn { 
            border: 1px solid var(--accent-color); 
            color: var(--accent-color); 
            background: transparent; 
            transition: 0.3s; 
            white-space: nowrap; /* Yazının alt satıra kaymasını kesin engeller */
            display: inline-flex; 
            align-items: center; 
            justify-content: center;
            height: 40px; /* Tüm butonların boyunu eşitler */
        }
        .nav-btn:hover, .nav-btn.active { background-color: var(--accent-color); color: #fff; }
        .profile-btn { cursor: pointer; transition: 0.3s; background: transparent; border: none; text-align: left; }
        .profile-btn:hover { opacity: 0.8; }
        .u-name { color: var(--text-main) !important; font-weight: 700; }
        .u-title { color: var(--text-muted) !important; font-size: 0.75rem; }

        /* KARTLAR VE TABLOLAR */
        .garaj-card, .form-card { background-color: var(--card-bg) !important; border: 1px solid var(--border-color) !important; border-radius: 12px; color: var(--text-main) !important; padding: 2.5rem; }
        .card-title-muted { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; }
        
        .table-custom-container { background-color: var(--card-bg) !important; border: 1px solid var(--border-color) !important; border-radius: 12px; overflow: hidden; }
        .table { --bs-table-bg: transparent !important; --bs-table-color: var(--text-main) !important; margin-bottom: 0;}
        .table th { background-color: var(--input-bg) !important; color: var(--accent-color) !important; border-bottom: 2px solid var(--border-color) !important; }
        .table td { background-color: var(--card-bg) !important; color: var(--text-main) !important; border-bottom: 1px solid var(--border-color) !important; vertical-align: middle; }

        /* FORM ELEMANLARI DÜZELTME (Ölçüler ve Ok Çakışması) */
        .form-label { color: var(--text-main) !important; opacity: 0.8; margin-bottom: 8px; }
        .form-control { 
            background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; border-radius: 8px; padding: 12px 15px !important; width: 100%;
        }
        .form-control:focus { border-color: var(--accent-color) !important; box-shadow: none; color: var(--text-main) !important;}
        .form-control::placeholder { color: var(--text-muted) !important; opacity: 0.7; }
        
        .custom-select-box { 
            background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; border-radius: 8px; 
            padding: 12px 40px 12px 15px !important; /* Ok için sağdan geniş boşluk */
            width: 100%; appearance: none; cursor: pointer;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff8c00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important; 
            background-repeat: no-repeat !important; background-position: right 15px center !important; background-size: 16px !important; 
        }
        .custom-select-box option { background-color: var(--card-bg) !important; color: var(--text-main) !important; }

        /* MARKA DROPDOWN LİSTESİ DÜZELTME (Devasa logolar ve beyaz bloklar çözüldü) */
        .custom-dropdown-btn { 
            background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; padding: 12px 15px; border-radius: 8px; width: 100%; 
            text-align: left; display: flex; justify-content: space-between; align-items: center; 
        }
        .custom-dropdown-menu { background-color: var(--card-bg) !important; border: 1px solid var(--border-color) !important; padding: 10px; max-height: 300px; overflow-y: auto;}
        .custom-dropdown-item { color: var(--text-main) !important; display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 6px; }
        .custom-dropdown-item:hover { background-color: var(--accent-color) !important; color: #000 !important; font-weight: bold;}
        
        .brand-icon { 
            width: 32px !important; height: 32px !important; min-width: 32px; 
            object-fit: contain; background-color: #ffffff !important; border-radius: 6px; padding: 4px; 
        }

        /* MODAL */
        .modal-content { background-color: var(--card-bg) !important; border: 1px solid var(--accent-color) !important; color: var(--text-main) !important; }
        
        .btn-glow { background: linear-gradient(45deg, #ff8c00, #ffb347); color: #121212; font-weight: 700; border: none; transition: 0.3s;}
        .btn-glow:hover { transform: scale(1.02); box-shadow: 0 0 15px rgba(255, 140, 0, 0.5); }

        /* Beyaz modda modal kapatma çarpısını görünür yapma */
        body.light-mode .modal-header .btn-close {
        filter: invert(1) grayscale(100%) brightness(0); /* Çarpıyı tamamen siyah yapar */
        opacity: 0.8;
    }

    body.light-mode .modal-header .btn-close:hover {
        opacity: 1;
    }
    /* --- MOBİL EKRANLAR İÇİN KESİN ÇÖZÜM (RESPONSIVE FIX) --- */
/* --- MOBİL EKRANLAR İÇİN KESİN ÇÖZÜM (RESPONSIVE FIX) --- */
@media (max-width: 768px) {
    /* Container boşluklarını sıfırlayarak kenarlardan yer kazanıyoruz */
    .container {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }
    
    /* Kartların iç boşluklarını azaltıyoruz ki ekranı kaplamasın */
    .garaj-card, .form-card, .login-card { 
        padding: 1.5rem 1rem !important; 
        border-radius: 8px !important;
    }
    
    /* Fontları büyütüp mobil okunabilirliği artırıyoruz */
    .form-control, .custom-select-box {
        font-size: 1rem !important; /* Artık ufacık olmayacak */
        padding: 12px 15px !important;
    }
    
    /* Tablolardaki taşmaları engelleyip yatay kaydırma sağlıyoruz */
    .table-custom-container {
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
    }
    .table th, .table td {
        font-size: 0.9rem !important;
        white-space: nowrap !important; 
    }

    /* index.php Aktif Araç Kartı Hizalaması */
    .mobile-stack {
        flex-direction: column !important;
        text-align: center !important;
    }
    .mobile-w-100 {
        max-width: 100% !important;
        margin-top: 15px;
    }
}
/* --- AÇILIR MENÜ (DROPDOWN) YUKARI AÇILMA ENGELİ --- */
.custom-dropdown-menu {
    position: absolute !important;
    top: 100% !important;
    bottom: auto !important;
    transform: none !important;
    margin-top: 5px !important;
    max-height: 250px;
    overflow-y: auto;
}
    </style>
</head>
<body>
<!-- SADECE TELEFONDA GÖRÜNEN ÜST BAR -->
<nav class="navbar d-lg-none d-flex justify-content-between align-items-center" style="background-color: var(--card-bg) !important; border-bottom: 2px solid var(--accent-color); padding: 10px 20px; position: sticky; top: 0; z-index: 1050;">
  <a class="navbar-brand fw-bold m-0" href="index.php" style="font-size: 1.2rem; color: var(--accent-color);"><i class="bi bi-tools me-2"></i>SmartGaraj</a>
  
  <div class="d-flex align-items-center gap-3">
      <!-- Mobil Tema Butonu (Geri Geldi!) -->
      <button class="btn nav-btn btn-sm d-flex align-items-center justify-content-center" onclick="toggleTheme()" title="Tema Değiştir" style="height: 35px; width: 35px; padding: 0;">
          <i class="bi bi-moon-stars-fill theme-icon-class"></i>
      </button>
      <!-- Hamburger Menü (Kaybolma Sorunu Çözüldü) -->
      <button class="navbar-toggler p-0 border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilMenu" style="box-shadow: none;">
        <i class="bi bi-list text-warning" style="font-size: 2.2rem;"></i>
      </button>
  </div>
</nav>

<!-- SOLDAN KAYARAK AÇILAN PROFESYONEL MENÜ (OFFCANVAS) -->
<div class="offcanvas offcanvas-start" tabindex="-1" id="mobilMenu" style="background-color: var(--bg-main); border-right: 2px solid var(--accent-color); max-width: 280px;">
  
  <div class="offcanvas-header border-bottom border-secondary border-opacity-25 align-items-center justify-content-between">
      <!-- Başlık artık tıklanabilir ve ana sayfaya gidiyor -->
      <a class="offcanvas-title fw-bold m-0 fs-5 text-decoration-none" href="index.php" style="color: var(--accent-color);">🛠️ SmartGaraj</a>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" style="background-color: var(--input-bg);"></button>
  </div>
  
  <div class="offcanvas-body d-flex flex-column px-3 pt-4">
    
    <!-- Hesap bilgileri yazısı temaya duyarlı hale geldi -->
    <button class="bg-transparent border-0 text-start d-flex align-items-center p-0 mb-4 w-100" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#profileModal">
        <i class="bi bi-person-circle fs-1 text-warning"></i>
        <div class="ms-3">
            <span class="d-block" style="font-size: 0.8rem; color: var(--text-muted);">Hesap Bilgileri</span>
            <strong class="text-nowrap" style="color: var(--text-main);"><?php echo $_SESSION['user_name']; ?></strong>
        </div>
    </button>

    <ul class="nav flex-column gap-2 mb-auto">
      <li class="nav-item">
          <a class="nav-link p-3 rounded d-flex align-items-center" href="index.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-house text-warning me-3 fs-5"></i> Ana Sayfa</a>
      </li>
      <li class="nav-item">
          <a class="nav-link p-3 rounded d-flex align-items-center" href="araclar.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-car-front text-warning me-3 fs-5"></i> Araçlar</a>
      </li>
      <li class="nav-item">
        <a class="nav-link p-3 rounded d-flex align-items-center" href="arac_ekle.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-plus-circle text-warning me-3 fs-5"></i> Araç Ekle</a>
      </li>
      <li class="nav-item">
          <a class="nav-link p-3 rounded d-flex align-items-center" href="bakim_ekle.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-wrench-adjustable text-warning me-3 fs-5"></i> Bakım Ekle</a>
      </li>
    </ul>
    
    <div class="mt-4">
       <a href="islem.php?islem=cikis" class="btn btn-outline-danger w-100 p-2"><i class="bi bi-box-arrow-right me-2"></i> Çıkış</a>
    </div>
  </div>
</div>

    <nav class="navbar navbar-expand-lg navbar-dark py-3 d-none d-lg-flex">
    <div class="container">
        <!-- Logo Kısmı -->
        <a class="navbar-brand fw-bold" href="index.php"><i class="bi bi-tools me-2 text-warning"></i>SmartGaraj</a>
        
        <!-- İŞTE EKSİK OLAN KAHRAMAN: Mobilde Çıkacak Üç Çizgili Buton -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobilMenu" style="border-color: #ff9800; filter: invert(1) grayscale(100%) brightness(200%) sepia(100%) hue-rotate(0deg) saturate(500%);">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Açılır Kapanır Menü İçeriği -->
        <div class="collapse navbar-collapse justify-content-end" id="mobilMenu">
            <!-- flex-column (mobilde alt alta), flex-lg-row (masaüstünde yan yana) -->
            <div class="d-flex flex-column flex-lg-row gap-3 align-items-center mt-3 mt-lg-0">
                
                <!-- Profil Bilgisi -->
                <button class="profile-btn d-flex align-items-center gap-2 me-lg-2 bg-transparent border-0 text-light" data-bs-toggle="modal" data-bs-target="#profileModal">
                    <i class="bi bi-person-circle fs-3 text-warning"></i>
                    <span class="d-flex flex-column text-start">
                        <span class="u-title lh-1" style="font-size: 0.8rem; color: #aaa;">Hesap Bilgileri</span>
                        <span class="u-name lh-1 text-nowrap"><?php echo $_SESSION['user_name']; ?></span>
                    </span>
                </button>

                <!-- Tema Butonu ve Linkler -->
                <button class="btn nav-btn btn-sm px-3 py-2" onclick="toggleTheme()" title="Tema Değiştir">
                    <i id="theme-icon" class="bi bi-moon-stars-fill"></i>
                </button>
                <a href="index.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-house me-1"></i>Ana Sayfa</a>
                <a href="araclar.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-list-ul me-1"></i>Araçlar</a>
                <a href="arac_ekle.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-plus-lg me-1"></i>Araç Ekle</a>
                <a href="bakim_ekle.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-wrench-adjustable me-1"></i>Bakım Ekle</a>
                
                <!-- Çıkış Butonu -->
                <a href="islem.php?islem=cikis" class="btn btn-outline-danger btn-sm px-3 py-2 w-100 w-lg-auto" title="Çıkış Yap"><i class="bi bi-box-arrow-right"></i> Çıkış</a>
            </div>
        </div>
    </div>
    </nav>

    <div class="container mt-3">
        <?php if(isset($_GET['durum']) && $_GET['durum'] == "profil_ok"): ?>
            <div class="alert alert-success small py-2 border-0">Profil bilgileri başarıyla güncellendi.</div>
        <?php elseif(isset($_GET['durum']) && $_GET['durum'] == "sifre_ok"): ?>
            <div class="alert alert-success small py-2 border-0">Şifreniz başarıyla değiştirildi.</div>
        <?php elseif(isset($_GET['durum']) && $_GET['durum'] == "sifre_hata"): ?>
            <div class="alert alert-danger small py-2 border-0">Mevcut şifrenizi yanlış girdiniz!</div>
        <?php endif; ?>
    </div>

    <div class="container my-4">
        <div class="row g-4 mb-5">
            <div class="col-md-4">
                <div class="garaj-card p-4 h-100">
                    <h6 class="card-title-muted mb-2"><i class="bi bi-wallet2 me-2"></i>Araç Harcaması (Seçili)</h6>
                    <h2 class="fw-bold mb-0"><?php echo $toplam_harcama; ?> ₺</h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="garaj-card p-4 h-100">
                    <h6 class="card-title-muted mb-2">Toplam Kayıtlı Araç</h6>
                    <h2 class="fw-bold mb-0"><?php echo $arac_sayisi; ?></h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="garaj-card p-4 h-100 border-warning">
                    <h6 class="card-title-muted mb-2 text-warning">Durum</h6>
                    <h3 class="fw-bold mb-0 text-warning">Sistem Aktif</h3>
                </div>
            </div>
        </div>

        <div class="row mb-5">
    <div class="col-12">
        <div class="garaj-card p-4 p-md-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
                
                <!-- BURASI DEĞİŞTİ: Sonuna "mobile-stack" class'ı eklendi -->
                <div class="d-flex align-items-center gap-4 w-100 mobile-stack">
                    <div class="rounded-circle d-flex align-items-center justify-content-center border border-secondary flex-shrink-0" style="width: 80px; height: 80px; background-color: var(--input-bg);">
                        <i class="bi bi-car-front fs-1 text-secondary"></i>
                    </div>
                    <div>
                        <h5 class="mb-1">
                            Aktif Araç 
                            <?php if(!empty($arac['plaka'])): ?>
                                <span class="badge bg-warning text-dark ms-2"><?php echo strtoupper($arac['plaka']); ?></span>
                            <?php endif; ?>
                        </h5>
                        <h2 class="fw-bold mb-2">
                            <?php echo $arac ? $arac['yil']." ".$arac['marka']." ".$arac['model'] : "Garaj Boş"; ?>
                        </h2>
                        
                        <!-- YENİ EKLENEN: Hızlı Bakım Ekle Butonu BURADA -->
                        <span><i class="bi bi-speedometer2 me-1"></i> Güncel: <strong><?php echo $arac ? number_format($arac['guncel_km'], 0, ',', '.') : "0"; ?> KM</strong></span>
                        
                        <?php if($aktif_arac_id > 0): ?>
                        <div class="mt-3">
                            <a href="bakim_ekle.php?secili_arac=<?php echo $arac['id']; ?>" class="btn btn-outline-warning btn-sm px-3 rounded-pill" title="Bu araca hızlıca bakım ekle">
                                <i class="bi bi-wrench-adjustable me-1"></i> Hızlı Bakım Ekle
                            </a>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- BURASI DEĞİŞTİ: w-100 yanına "mobile-w-100" class'ı eklendi -->
                <div class="d-flex flex-column gap-3 w-100 mobile-w-100" style="max-width: 300px;">
                    <form action="index.php" method="GET" class="w-100">
                        <select name="secili_arac" class="custom-select-box" onchange="this.form.submit()">
                            <?php if($tum_araclar): foreach($tum_araclar as $a_opt): ?>
                                <option value="<?php echo $a_opt['id']; ?>" <?php echo ($aktif_arac_id == $a_opt['id']) ? 'selected' : ''; ?>>
                                    <?php echo $a_opt['marka'] . " " . $a_opt['model']; ?>
                                </option>
                            <?php endforeach; else: ?>
                                <option value="">Garaj Boş</option>
                            <?php endif; ?>
                        </select>
                    </form>
                    
                    <button class="btn btn-glow w-100" data-bs-toggle="modal" data-bs-target="#aiModal">
                        <span style="filter: drop-shadow(0 0 5px white) brightness(1.2); margin-right: 5px;">✨</span> Akıllı Analiz
                    </button>
                </div>
                
            </div>

            <?php if($arac): ?>
            <!-- ========================================================= -->
            <!-- YENİ EKLENEN TARİH/DURUM ROZETLERİ (Adım 4 GÖRSEL KISMI)  -->
            <!-- ========================================================= -->
            <div class="d-flex flex-column flex-md-row gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
                
                <!-- Muayene Durumu -->
                <div class="flex-fill p-2 rounded border border-<?php echo $mua_renk; ?> bg-<?php echo $mua_renk; ?> bg-opacity-10 d-flex justify-content-between align-items-center">
                    <span class="text-<?php echo $mua_renk; ?> fw-bold" style="font-size: 0.85rem;">
                        <i class="bi <?php echo $mua_ikon; ?> me-1"></i>TÜVTÜRK
                    </span>
                    <span class="badge bg-<?php echo $mua_renk; ?>"><?php echo $mua_mesaj; ?></span>
                </div>

                <!-- Sigorta Durumu -->
                <div class="flex-fill p-2 rounded border border-<?php echo $sig_renk; ?> bg-<?php echo $sig_renk; ?> bg-opacity-10 d-flex justify-content-between align-items-center">
                    <span class="text-<?php echo $sig_renk; ?> fw-bold" style="font-size: 0.85rem;">
                        <i class="bi bi-shield-check me-1"></i>Sigorta
                    </span>
                    <span class="badge bg-<?php echo $sig_renk; ?>"><?php echo $sig_mesaj; ?></span>
                </div>

                <!-- Kasko Durumu -->
                <div class="flex-fill p-2 rounded border border-<?php echo $kas_renk; ?> bg-<?php echo $kas_renk; ?> bg-opacity-10 d-flex justify-content-between align-items-center">
                    <span class="text-<?php echo $kas_renk; ?> fw-bold" style="font-size: 0.85rem;">
                        <i class="bi bi-shield-plus me-1"></i>Kasko
                    </span>
                    <span class="badge bg-<?php echo $kas_renk; ?>"><?php echo $kas_mesaj; ?></span>
                </div>

            </div>
            <?php endif; ?>

        </div>
    </div>
</div>

        <div class="row">
            <div class="col-12">
                <h4 class="mb-3 fw-semibold"><i class="bi bi-clock-history me-2 text-warning"></i>Son Bakımlar</h4>
                <div class="table-custom-container">
                    <div class="table-responsive">
                        <table class="table table-custom align-middle">
                            <thead>
                                <tr><th>Tarih</th><th>İşlem</th><th>Kilometre</th><th class="text-end">Maliyet</th></tr>
                            </thead>
                            <tbody>
                                <?php if ($bakimlar): foreach($bakimlar as $row): ?>
                                    <tr>
                                        <td><?php echo date('d.m.Y', strtotime($row['islem_tarihi'])); ?></td>
                                        <td><?php echo $row['islem_turu']; ?></td>
                                        <td><?php echo number_format($row['islem_km'], 0, ',', '.'); ?></td>
                                        <td class="text-end text-warning fw-bold"><?php echo number_format($row['maliyet_tl'], 2, ',', '.'); ?> ₺</td>
                                    </tr>
                                <?php endforeach; else: ?>
                                    <tr><td colspan="4" class="text-center py-4 text-muted">Kayıt bulunamadı.</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="aiModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title fw-bold text-warning"><i class="bi bi-robot me-2"></i>SmartGaraj Analiz</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-start py-4" id="ai-modal-body"></div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="profileModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold text-warning"><i class="bi bi-person-vcard me-2"></i>Hesap Ayarları</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body py-4">
                    
                    <form action="islem.php?islem=profil_guncelle" method="POST" class="mb-4">
                        <div class="mb-3">
                            <label class="form-label opacity-75 small mb-1">Ad Soyad</label>
                            <input type="text" class="form-control form-control-custom p-2" name="ad_soyad" value="<?php echo $kullanici['ad_soyad']; ?>" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label opacity-75 small mb-1">E-Posta Adresi</label>
                            <input type="email" class="form-control form-control-custom p-2" name="email" value="<?php echo $kullanici['email']; ?>" required>
                        </div>
                        <button type="submit" class="btn btn-outline-warning btn-sm w-100">Bilgileri Güncelle</button>
                    </form>

                    <hr class="border-secondary opacity-25">

                    <form action="islem.php?islem=sifre_degistir" method="POST">
                        <h6 class="text-white-50 small mb-3">Şifre Değiştir</h6>
                        <div class="mb-3">
                            <label class="form-label opacity-75 small mb-1">Mevcut Şifre</label>
                            <input type="password" class="form-control form-control-custom p-2" name="eski_sifre" required placeholder="••••••••">
                        </div>
                        <div class="mb-3">
                            <label class="form-label opacity-75 small mb-1">Yeni Şifre</label>
                            <input type="password" class="form-control form-control-custom p-2" name="yeni_sifre" required placeholder="••••••••">
                        </div>
                        <button type="submit" class="btn btn-outline-danger btn-sm w-100">Şifremi Değiştir</button>
                    </form>
                    
                </div>
                <div class="modal-footer border-0 pt-0 justify-content-center">
                    <span class="text-muted small"><i class="bi bi-clock-history me-1"></i>Garaja Katılım: <?php echo date('d.m.Y', strtotime($kullanici['kayit_tarihi'])); ?></span>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
    // --- TEMA MOTORU ---
    // --- YENİ TEMA MOTORU (Çoklu İkon Desteği) ---
        function toggleTheme() {
            const body = document.body;
            const isLight = body.classList.contains('light-mode');
            
            if (isLight) {
                body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            }
            updateThemeIcons();
        }

        function updateThemeIcons() {
            const isLight = document.body.classList.contains('light-mode');
            // Sayfadaki tüm tema ikonlarını bul ve değiştir
            const icons = document.querySelectorAll('.bi-moon-stars-fill, .bi-sun-fill, .theme-icon-class');
            icons.forEach(icon => {
                if (isLight) {
                    icon.classList.remove('bi-moon-stars-fill');
                    icon.classList.add('bi-sun-fill');
                } else {
                    icon.classList.remove('bi-sun-fill');
                    icon.classList.add('bi-moon-stars-fill');
                }
            });
        }

        // Sayfa ilk yüklendiğinde hafızayı kontrol et
        window.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('theme') === 'light') { 
                document.body.classList.add('light-mode'); 
            }
            updateThemeIcons();
        });

    // --- AKILLI TEŞHİS VE UZMAN SİSTEM MOTORU (PROFESYONEL V5) ---
    const expertModal = document.getElementById('aiModal');
    if(expertModal) {
        expertModal.addEventListener('show.bs.modal', event => {
            const modalBody = document.getElementById('ai-modal-body');
            
            // Araç kontrolü
            const aracVarMi = <?php echo $aktif_arac_id > 0 ? 'true' : 'false'; ?>;
            if (!aracVarMi) {
                modalBody.innerHTML = `<div class="text-center py-5"><h5 class="text-warning">Analiz Edilecek Araç Yok</h5></div>`;
                return; 
            }

            // Yükleme Ekranı (Metinler aydınlatıldı ve dili düzeltildi)
            modalBody.innerHTML = `
                <div class="text-center py-5">
                    <div class="spinner-grow text-warning mb-3"></div>
                    <h5 class="fw-bold text-white">SmartGaraj Analiz Motoru Çalışıyor...</h5>
                    <p class="small mt-2" style="color: #cccccc;">Motor spesifikasyonları, kilometre ve servis geçmişi parametreleri ayrıştırılıyor.</p>
                </div>`;
            
            setTimeout(() => {
                const bakimlar = [<?php 
                    if(!empty($bakimlar)) {
                        foreach($bakimlar as $b) { echo "{turu:'" . strtolower($b['islem_turu']) . "', km:" . $b['islem_km'] . "},"; }
                    }
                ?>];
                const guncelKM = <?php echo $arac['guncel_km'] ?? 0; ?>;
                const yas = new Date().getFullYear() - <?php echo $arac['yil'] ?? date('Y'); ?>;
                const motorStr = "<?php echo $arac['motor'] ?? ''; ?>".toLowerCase();
                const modelStr = "<?php echo $arac['model'] ?? ''; ?>".toLowerCase();

                // 1. MOTOR TİPİNİ BELİRLE
                let motorTipi = "Benzinli";
                if (motorStr.match(/dci|tdi|multijet|dizel|crdi|bluehdi|tdci|cdti|jtd/)) motorTipi = "Dizel";
                else if (motorStr.match(/elektrik|ev|kw/) || modelStr.match(/t10x|tesla|taycan|ionic|byd/)) motorTipi = "Elektrik";
                else if (motorStr.match(/hybrid|hibrit|mhev|phev/)) motorTipi = "Hibrit";

                let score = 100;
                let kritikUyarilar = [];
                let rutinTavsiyeler = [];
                let tamamlananlar = [];

                // --- 2. DETAYLI ANALİZ MANTIĞI (Tahminler Geri Getirildi) ---

                // A) SIVI VE FİLTRE KONTROLÜ
                if (motorTipi !== "Elektrik") {
                    const sonYag = bakimlar.find(b => b.turu.includes('periyodik') || b.turu.includes('yağ') || b.turu.includes('yag'));
                    if (!sonYag) {
                        score -= 25;
                        kritikUyarilar.push("Sistemde yağ değişim kaydı yok. Yağlama performansı kaybı motor ömrünü riske atar.");
                    } else {
                        const fark = guncelKM - sonYag.km;
                        if (fark > 15000) { score -= 30; kritikUyarilar.push(`Yağ ömrü ${fark-10000} KM aşıldı! Viskozite kaybı kritik seviyede.`); }
                        else if (fark > 10000) { score -= 10; rutinTavsiyeler.push("Motor yağının ömrü dolmak üzere, periyodik bakım planlanmalı."); }
                        else { tamamlananlar.push(`Sıvı ve filtre kondisyonu nominal seviyede. (Son: ${sonYag.km} KM)`); }
                    }
                }

                // B) DİZEL ÖZEL
                if (motorTipi === "Dizel") {
                    if (guncelKM > 90000) rutinTavsiyeler.push("Partikül Filtresi (DPF) doluluk oranı ve EGR valfi kurum seviyesi kontrol edilmeli.");
                    if (guncelKM > 130000) kritikUyarilar.push("Yüksek Basınç Analizi: Enjektör püskürtme değerleri ve kızdırma bujileri test edilmelidir.");
                }

                // C) BENZİNLİ / HİBRİT ÖZEL
                if (motorTipi === "Benzinli" || motorTipi === "Hibrit") {
                    if (guncelKM > 60000) {
                        const buji = bakimlar.find(b => b.turu.match(/buji|ateşleme/));
                        if (!buji) { score -= 10; rutinTavsiyeler.push("Ateşleme Sistemi: Buji ve bobinlerin elektriksel direnci ölçülmeli (Misfire riski)."); }
                        else { tamamlananlar.push("Ateşleme sistemi bakımları güncel."); }
                    }
                }

                // D) ELEKTRİKLİ ÖZEL
                if (motorTipi === "Elektrik") {
                    rutinTavsiyeler.push("Batarya SOH (State of Health) yüzdesi ve hücreler arası voltaj dengesi ölçülmeli.");
                    rutinTavsiyeler.push("Elektrik motoru redüktör yağı ve batarya termal soğutma sıvıları kontrol edilmeli.");
                }

                // E) AĞIR BAKIM (TRİGER)
                if (guncelKM > 90000 && motorTipi !== "Elektrik") {
                    const triger = bakimlar.find(b => b.turu.match(/ağır|triger|zincir/));
                    if (!triger) { score -= 20; kritikUyarilar.push("Ağır Bakım: Triger kayışı/zinciri değişim periyodu belirsiz. Kopma riski!"); }
                    else { tamamlananlar.push("Ağır bakım (Zamanlama sistemi) güncel."); }
                }

                // F) FREN SİSTEMİ (Tekrar Eklendi)
                const sonFren = bakimlar.find(b => b.turu.match(/fren|balata|disk/));
                if (!sonFren && guncelKM > 40000) {
                    score -= 10;
                    rutinTavsiyeler.push("Fren Sistemi: Disk ve balata et kalınlıkları fiziki olarak ölçülmeli.");
                } else if (sonFren) {
                    tamamlananlar.push("Fren hidrolik ve sürtünme yüzeyleri bakımı sisteme işlenmiş.");
                }
                
                // G) ALT TAKIM VE YAŞ (Tekrar Eklendi)
                if (yas > 8 || guncelKM > 100000) {
                    score -= 5;
                    rutinTavsiyeler.push(`Yaş/KM Yorgunluğu: Kauçuk hortumlar, motor takozları ve alt takım burçları kontrol edilmeli.`);
                }

                // Sonuç ekranını oluştur
                if (score < 0) score = 0;
                let scoreColor = score >= 80 ? "text-success" : (score >= 60 ? "text-warning" : "text-danger");
                
                modalBody.innerHTML = `
                    <div class="text-start">
                        <div class="p-3 rounded-4 mb-4" style="background: rgba(128,128,128,0.1); border: 1px solid var(--border-color);">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="small fw-bold text-muted">SİSTEM SAĞLIK ENDEKSİ</span>
                                <span class="fs-4 fw-bold ${scoreColor}">${score}/100</span>
                            </div>
                            <div class="progress" style="height: 8px; background: #333;"><div class="progress-bar" style="width: ${score}%; background: ${score >= 60 ? 'var(--accent-color)' : '#dc3545'};"></div></div>
                        </div>
                        <div class="mb-4">
                            <h6 class="text-warning small fw-bold mb-2"><i class="bi bi-cpu"></i> DIAGNOSTİK RAPORU (${motorTipi})</h6>
                            <div class="p-3 rounded-4 bg-dark-custom border border-secondary border-opacity-25">
                                <ul class="list-unstyled mb-0">
                                    ${tamamlananlar.map(t => `<li class="text-success small mb-2"><i class="bi bi-check-circle-fill me-2"></i>${t}</li>`).join('')}
                                    ${kritikUyarilar.map(u => `<li class="text-danger small mb-2"><i class="bi bi-exclamation-triangle-fill me-2"></i>${u}</li>`).join('')}
                                    ${rutinTavsiyeler.map(r => `<li class="opacity-75 small mb-2"><i class="bi bi-info-circle me-2 text-warning"></i>${r}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            }, 1200);
        });
    }
</script>
</body>
</html>