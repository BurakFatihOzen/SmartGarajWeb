<?php 
session_start();

// 1. GÜVENLİK: Giriş kontrolü
if(!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

include 'baglan.php';
$user_id = $_SESSION['user_id'];

// Profil modalı için kullanıcı bilgisini çek
$kullanici_sorgu = $db->prepare("SELECT * FROM kullanicilar WHERE id = ?");
$kullanici_sorgu->execute([$user_id]);
$kullanici = $kullanici_sorgu->fetch(PDO::FETCH_ASSOC);

// Araç Markaları Listesi (PHP Tarafı - İkonlar İçin)
$markalar = [
    ['ad' => 'Alfa Romeo', 'domain' => 'alfaromeo.com'], ['ad' => 'Aston Martin', 'domain' => 'astonmartin.com'],
    ['ad' => 'Audi', 'domain' => 'audi.com'], ['ad' => 'Bentley', 'domain' => 'bentleymotors.com'],
    ['ad' => 'BMW', 'domain' => 'bmw.com'], ['ad' => 'BYD', 'domain' => 'byd.com'],
    ['ad' => 'Chery', 'domain' => 'chery.cn'], ['ad' => 'Chevrolet', 'domain' => 'chevrolet.com'],
    ['ad' => 'Citroën', 'domain' => 'citroen.com'], ['ad' => 'Cupra', 'domain' => 'cupraofficial.com'],
    ['ad' => 'Dacia', 'domain' => 'dacia.ro'], ['ad' => 'DFSK', 'domain' => 'dfsk.com'],
    ['ad' => 'DS Automobiles', 'domain' => 'dsautomobiles.com'], ['ad' => 'Ferrari', 'domain' => 'ferrari.com'],
    ['ad' => 'Fiat', 'domain' => 'fiat.com'], ['ad' => 'Ford', 'domain' => 'ford.com'],
    ['ad' => 'Geely', 'domain' => 'geely.com'], ['ad' => 'Honda', 'domain' => 'honda.com'],
    ['ad' => 'Hyundai', 'domain' => 'hyundai.com'], ['ad' => 'Isuzu', 'domain' => 'isuzu.co.jp'],
    ['ad' => 'Jaguar', 'domain' => 'jaguar.com'], ['ad' => 'Jeep', 'domain' => 'jeep.com'],
    ['ad' => 'Kia', 'domain' => 'kia.com'], ['ad' => 'Lada', 'domain' => 'lada.ru'],
    ['ad' => 'Lamborghini', 'domain' => 'lamborghini.com'], ['ad' => 'Land Rover', 'domain' => 'landrover.com'],
    ['ad' => 'Leapmotor', 'domain' => 'leapmotor.com'], ['ad' => 'Lexus', 'domain' => 'lexus.com'],
    ['ad' => 'Maserati', 'domain' => 'maserati.com'], ['ad' => 'Mazda', 'domain' => 'mazda.com'],
    ['ad' => 'Mercedes-Benz', 'domain' => 'mercedes-benz.com'], ['ad' => 'MG', 'domain' => 'mgmotor.eu'],
    ['ad' => 'Mini', 'domain' => 'mini.com'], ['ad' => 'Mitsubishi', 'domain' => 'mitsubishicars.com'],
    ['ad' => 'Nissan', 'domain' => 'nissan-global.com'], ['ad' => 'Opel', 'domain' => 'opel.com'],
    ['ad' => 'Peugeot', 'domain' => 'peugeot.com'], ['ad' => 'Porsche', 'domain' => 'porsche.com'],
    ['ad' => 'Proton', 'domain' => 'proton.com'], ['ad' => 'Renault', 'domain' => 'renault.com.tr'],
    ['ad' => 'Seat', 'domain' => 'seat.com'], ['ad' => 'Seres', 'domain' => 'seres.cn'],
    ['ad' => 'Skoda', 'domain' => 'skoda-auto.com'], ['ad' => 'Skywell', 'domain' => 'skywell.com'],
    ['ad' => 'SsangYong / KGM', 'domain' => 'kg-mobility.com'], ['ad' => 'Subaru', 'domain' => 'subaru.com'],
    ['ad' => 'Suzuki', 'domain' => 'suzuki.com'], ['ad' => 'Tata', 'domain' => 'tatamotors.com'],
    ['ad' => 'Tesla', 'domain' => 'tesla.com'], ['ad' => 'Tofas', 'domain' => 'fiat.com.tr'], 
    ['ad' => 'Togg', 'domain' => 'togg.com.tr'], ['ad' => 'Toyota', 'domain' => 'toyota.com'],
    ['ad' => 'Volkswagen', 'domain' => 'vw.com'], ['ad' => 'Volvo', 'domain' => 'volvocars.com'],
    ['ad' => 'Voyah', 'domain' => 'voyah.com.cn']
];

usort($markalar, function($a, $b) { return strcmp($a['ad'], $b['ad']); });
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>SmartGaraj - Araç Ekle</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>

        /* --- MARKA ARAMA KUTUSU --- */
        .dropdown-search-box {
            padding: 10px;
            position: sticky;
            top: 0;
            background: var(--card-bg);
            z-index: 10;
            border-bottom: 1px solid var(--border-color);
        }
        .dropdown-search-box input {
            width: 100%;
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            background: var(--input-bg);
            color: var(--text-main);
            outline: none;
            transition: 0.3s;
        }
        .dropdown-search-box input:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
        }


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
        
        /* FORM ELEMANLARI */
        .form-label { color: var(--text-main) !important; opacity: 0.8; margin-bottom: 8px; }
        .form-control { 
            background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; border-radius: 8px; padding: 12px 15px !important; width: 100%;
        }
        .form-control:focus { border-color: var(--accent-color) !important; box-shadow: none; color: var(--text-main) !important;}
        .form-control::placeholder { color: var(--text-muted) !important; opacity: 0.7; }

        /* ÖZEL AÇILIR KUTU OKU (Eksik Olan Kod) */
        .custom-select-box { 
            background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; border-radius: 8px; 
            padding: 12px 40px 12px 15px !important; 
            width: 100%; appearance: none; cursor: pointer;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff8c00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important; 
            background-repeat: no-repeat !important; background-position: right 15px center !important; background-size: 16px !important; 
        }
        .custom-select-box option { background-color: var(--card-bg) !important; color: var(--text-main) !important; }
        
        /* ŞIK AÇILIR MENÜLER (DROPDOWNS) */
        .custom-dropdown-btn { 
            background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; padding: 12px 15px; border-radius: 8px; width: 100%; 
            text-align: left; display: flex; justify-content: space-between; align-items: center; 
        }
        .custom-dropdown-menu { 
            background-color: var(--card-bg) !important; border: 1px solid var(--border-color) !important; 
            padding: 10px; max-height: 300px; overflow-y: auto;
        }
        .custom-dropdown-item { 
            color: var(--text-main) !important; display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 6px; 
        }
        .custom-dropdown-item:hover { background-color: var(--accent-color) !important; color: #000 !important; font-weight: bold;}
        .brand-icon { 
            width: 32px !important; height: 32px !important; min-width: 32px; 
            object-fit: contain; background-color: #ffffff !important; border-radius: 6px; padding: 4px; 
        }

        /* MODAL */
        .modal-content { background-color: var(--card-bg) !important; border: 1px solid var(--accent-color) !important; color: var(--text-main) !important; }
        .btn-glow { background: linear-gradient(45deg, #ff8c00, #ffb347); color: #121212; font-weight: 700; border: none; transition: 0.3s;}
        .btn-glow:hover { transform: scale(1.02); box-shadow: 0 0 15px rgba(255, 140, 0, 0.5); }

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

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <div class="form-card">
                    <h4 class="mb-4 text-warning fw-bold"><i class="bi bi-car-front-fill me-2"></i>Yeni Araç Kaydı</h4>
                    <form action="islem.php?islem=arac_ekle" method="POST">
                        
                        <div class="mb-4">
                            <label class="form-label opacity-75">Plaka</label>
                            <!-- Plaka (Sadece harf, rakam ve boşluk girilebilir, - veya * girilemez) -->
                            <input type="text" class="form-control fw-bold" id="plaka_input" name="arac_plaka" placeholder="Örn: 06 BG 2360" required style="text-transform: uppercase; font-size: 1.1rem; letter-spacing: 1px;" pattern="^(0[1-9]|[1-7][0-9]|8[01])\s([A-Z]{1,2}\s[0-9]{2,4}|[A-Z]{3}\s[0-9]{2,3})$" title="Lütfen geçerli bir Türkiye plakası girin (Örn: 06 BG 2360 veya 34 ABC 123)">
                        </div>

                        <div class="mb-4">
                            <label class="form-label opacity-75">Araç Markası</label>
                            <input type="hidden" name="arac_marka" id="gizli_marka_input" required>
                            <div class="dropdown w-100">
                                <button class="btn custom-dropdown-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" id="dropdown_buton">
                                    <span id="secilen_marka_metin"><i class="bi bi-list-ul me-2"></i>Marka Seçiniz...</span>
                                </button>
                                <ul class="dropdown-menu w-100 custom-dropdown-menu" id="markaMenu">
    <!-- YENİ: ARAMA KUTUSU BURAYA -->
    <li class="dropdown-search-box p-2" style="position: sticky; top: 0; background: var(--card-bg); z-index: 10; border-bottom: 1px solid var(--border-color);">
        <input type="text" id="markaSearchInput" class="form-control form-control-sm" 
               placeholder="🔍 Marka ara..." 
               onkeyup="markaFiltrele()" 
               onclick="event.stopPropagation()">
    </li>

    <?php foreach($markalar as $m): ?>
        <li class="marka-item" onclick="markaSec('<?php echo $m['ad']; ?>', 'https://www.google.com/s2/favicons?domain=<?php echo $m['domain']; ?>&sz=128')">
            <a class="dropdown-item custom-dropdown-item" style="cursor:pointer;">
                <img src="https://www.google.com/s2/favicons?domain=<?php echo $m['domain']; ?>&sz=128" class="brand-icon" alt="">
                <?php echo $m['ad']; ?>
            </a>
        </li>
    <?php endforeach; ?>
    
    <li><hr class="dropdown-divider border-secondary"></li>
    <li onclick="markaSec('diger', '')">
        <a class="dropdown-item custom-dropdown-item text-warning fw-bold" style="cursor:pointer;">
            <i class="bi bi-pencil-square me-2"></i> Diğer (Manuel Giriş)
        </a>
    </li>
</ul>
                            </div>
                            <input type="text" class="form-control mt-3 d-none" id="diger_marka_input" name="arac_marka_diger" placeholder="Marka adını yazınız...">
                        </div>

                        <div class="mb-4">
                            <label class="form-label opacity-75">Model (Kasa Yılı)</label>
                            <input type="hidden" name="arac_model" id="gizli_model_input" required>
                            <div class="dropdown w-100">
                                <button class="btn custom-dropdown-btn dropdown-toggle disabled" type="button" data-bs-toggle="dropdown" id="dropdown_model_buton">
                                    <span id="secilen_model_metin">Önce Marka Seçiniz...</span>
                                </button>
                                <ul class="dropdown-menu w-100 custom-dropdown-menu" id="model_dropdown_list">
                                    </ul>
                            </div>
                            <input type="text" class="form-control mt-3 d-none" id="diger_model_input" name="arac_model_diger" placeholder="Model adını yazınız...">
                        </div>

                        <div class="mb-4">
                            <label class="form-label opacity-75">Motor ve Donanım</label>
                            <input type="hidden" name="arac_motor" id="gizli_motor_input" required>
                            <div class="dropdown w-100">
                                <button class="btn custom-dropdown-btn dropdown-toggle disabled" type="button" data-bs-toggle="dropdown" id="dropdown_motor_buton">
                                    <span id="secilen_motor_metin">Önce Model Seçiniz...</span>
                                </button>
                                <ul class="dropdown-menu w-100 custom-dropdown-menu" id="motor_dropdown_list">
                                    </ul>
                            </div>
                            <input type="text" class="form-control mt-3 d-none" id="diger_motor_input" name="arac_motor_diger" placeholder="Örn: 1.6 Zetec CLX">
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="form-label opacity-75">Üretim Yılı</label>
                                <!-- Üretim Yılı (Varsayılan olarak en az 1900, en fazla bulunduğumuz yıl girilebilir) -->
                            <input type="number" class="form-control" name="arac_yil" placeholder="Örn: 2018" required min="1900" max="<?php echo date('Y'); ?>">
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="form-label opacity-75">Güncel Kilometre</label>
                                <!-- Güncel Kilometre (Sıfırın altına inemez) -->
                                <input type="number" class="form-control" name="arac_guncel_km" placeholder="125000" required min="0">
                            </div>
                        </div>

                        <div class="mb-3">
    <label class="form-label opacity-75 small mb-1">Kasko Durumu</label>
    <select name="kasko_durumu" class="form-control custom-select-box" required>
        <option value="Yok" selected>Yok</option>
        <option value="Var">Var</option>
    </select>
</div>

                        <!-- YENİ EKLENEN TARİH VE RUHSAT ALANLARI -->
<div class="row mt-3">
    <div class="col-md-6 mb-3">
    <label class="form-label fw-bold text-warning"><i class="bi bi-card-heading me-1"></i>Ruhsat Tipi</label>
    <!-- Buraya "custom-select-box" sınıfını ekledik -->
    <select class="form-select custom-select-box bg-dark text-light border-secondary" name="ruhsat_tipi" required>
        <option value="otomobil">Otomobil (Hususi - 2 Yılda Bir)</option>
        <option value="ticari">Kamyonet/Ticari (Yılda Bir)</option>
        <option value="motosiklet">Motosiklet (2 Yılda Bir)</option>
    </select>
</div>
    
    <div class="col-md-6 mb-3">
        <label class="form-label fw-bold text-warning"><i class="bi bi-calendar-check me-1"></i>Muayene Bitiş Tarihi</label>
        <input type="date" class="form-control bg-dark text-light border-secondary" name="muayene_bitis" required>
    </div>

    <div class="col-md-6 mb-3">
        <label class="form-label fw-bold text-warning"><i class="bi bi-shield-check me-1"></i>Trafik Sigortası Bitiş</label>
        <input type="date" class="form-control bg-dark text-light border-secondary" name="sigorta_bitis" required>
    </div>

    <div class="col-md-6 mb-3">
        <label class="form-label fw-bold text-warning"><i class="bi bi-shield-plus me-1"></i>Kasko Bitiş <span class="text-muted" style="font-size:0.8rem;">(Opsiyonel)</span></label>
        <input type="date" class="form-control bg-dark text-light border-secondary" name="kasko_bitis">
    </div>
</div>
<!-- YENİ EKLENEN ALANLARIN SONU -->
                        
                        <button type="submit" class="btn btn-glow w-100">Garaja Ekle</button>
                    </form>
                </div>
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
                            <input type="text" class="form-control" name="ad_soyad" value="<?php echo $kullanici['ad_soyad'] ?? ''; ?>" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label opacity-75 small mb-1">E-Posta Adresi</label>
                            <input type="email" class="form-control" name="email" value="<?php echo $kullanici['email'] ?? ''; ?>" required>
                        </div>
                        <button type="submit" class="btn btn-outline-warning btn-sm w-100">Bilgileri Güncelle</button>
                    </form>
                    <hr class="border-secondary opacity-25">
                    <form action="islem.php?islem=sifre_degistir" method="POST">
                        <h6 class="text-white-50 small mb-3">Şifre Değiştir</h6>
                        <div class="mb-3">
                            <label class="form-label opacity-75 small mb-1">Mevcut Şifre</label>
                            <input type="password" class="form-control" name="eski_sifre" required placeholder="••••••••">
                        </div>
                        <div class="mb-3">
                            <label class="form-label opacity-75 small mb-1">Yeni Şifre</label>
                            <input type="password" class="form-control" name="yeni_sifre" required placeholder="••••••••">
                        </div>
                        <button type="submit" class="btn btn-outline-danger btn-sm w-100">Şifremi Değiştir</button>
                    </form>
                </div>
                <div class="modal-footer border-0 pt-0 justify-content-center">
                    <span class="text-muted small"><i class="bi bi-clock-history me-1"></i>Garaja Katılım: <?php echo date('d.m.Y', strtotime($kullanici['kayit_tarihi'] ?? 'now')); ?></span>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>

        function markaFiltrele() {
    let input = document.getElementById('markaSearchInput');
    let filter = input.value.toLocaleUpperCase('tr-TR');
    let menu = document.getElementById('markaMenu');
    let items = menu.getElementsByClassName('marka-item'); // Döngü içindeki li'leri hedefliyoruz

    for (let i = 0; i < items.length; i++) {
        let textValue = items[i].textContent || items[i].innerText;
        if (textValue.toLocaleUpperCase('tr-TR').indexOf(filter) > -1) {
            items[i].style.display = ""; // Eşleşirse göster
        } else {
            items[i].style.display = "none"; // Eşleşmezse gizle
        }
    }
}

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

        // --- DEVASA ARAÇ VERİTABANI ---
        const aracVerileri = {
            'Renault': {
                'Clio I (1990-1998)': ['1.2', '1.4', '1.8', '1.8 16V', '1.9 D', '2.0 Williams'],
                'Clio II (1998-2012)': ['1.2 16V', '1.4 8V', '1.4 16V', '1.5 dCi', '1.6 16V', '2.0 RS'],
                'Clio III (2005-2013)': ['1.2 16V', '1.5 dCi 65', '1.5 dCi 85', '1.6 16V', '2.0 RS'],
                'Clio IV (2012-2019)': ['0.9 TCe', '1.2 16V', '1.2 TCe', '1.5 dCi 75', '1.5 dCi 90', '1.6 RS'],
                'Clio V (2019-)': ['1.0 SCe', '1.0 TCe', '1.0 TCe X-Tronic', '1.3 TCe', '1.5 Blue dCi', '1.6 E-Tech Hybrid'],
                'Espace I-II-III (1984-2002)': ['2.0', '2.2', '2.2 dCi', '3.0 V6'],
                'Espace IV (2002-2014)': ['1.9 dCi', '2.0', '2.0 T', '2.0 dCi', '2.2 dCi', '3.0 dCi V6', '3.5 V6'],
                'Espace V (2015-2023)': ['1.6 dCi', '1.6 TCe', '1.8 TCe', '2.0 Blue dCi'],
                'Fluence (2009-2016)': ['1.5 dCi 85', '1.5 dCi 90', '1.5 dCi 105', '1.5 dCi 110', '1.6 16V', '1.6 dCi', '2.0'],
                'Fluence Z.E. (2011-2014)': ['70 kW Elektrik (95 bg)'],
                'Grand Scenic II (2004-2009)': ['1.5 dCi', '1.6 16V', '1.9 dCi', '2.0'],
                'Grand Scenic III (2009-2016)': ['1.4 TCe', '1.5 dCi', '1.6 16V', '1.6 dCi', '1.9 dCi'],
                'Grand Modus (2008-2012)': ['1.2 16V', '1.2 TCe', '1.4 16V', '1.5 dCi', '1.6 16V'],
                'Laguna I (1994-2001)': ['1.6 16V', '1.8', '1.9 dTi', '2.0', '2.0 16V', '2.2 D', '3.0 V6'],
                'Laguna II (2001-2007)': ['1.6 16V', '1.8 16V', '1.9 dCi', '2.0 16V', '2.0 IDE', '2.0 T', '2.2 dCi', '3.0 V6'],
                'Laguna III (2007-2015)': ['1.5 dCi', '1.6 16V', '2.0 16V', '2.0 dCi', '2.0 T', '3.0 V6 dCi'],
                'Latitude (2010-2015)': ['1.5 dCi', '2.0 dCi', '3.0 V6 dCi'],
                'Megane I (1995-2002)': ['1.4 16V', '1.4 8V', '1.6 8V', '1.6 16V', '1.9 D', '1.9 dTi', '2.0 8V', '2.0 16V', '2.0 IDE'],
                'Megane II (2002-2008)': ['1.4 16V', '1.5 dCi 80', '1.5 dCi 85', '1.5 dCi 100', '1.6 16V', '1.9 dCi', '2.0 16V', '2.0 RS'],
                'Megane III (2008-2016)': ['1.2 TCe', '1.4 TCe', '1.5 dCi 90', '1.5 dCi 110', '1.6 16V', '1.6 dCi', '2.0 dCi', '2.0 T', '2.0 RS'],
                'Megane IV (2016-2022)': ['1.2 TCe', '1.3 TCe', '1.5 dCi', '1.5 Blue dCi', '1.6 16V', '1.6 dCi', '1.6 E-Tech Hybrid', '1.8 RS'],
                'Megane E-Tech (2022-)': ['EV40 130hp', 'EV60 220hp'],
                'Modus (2004-2012)': ['1.2 16V', '1.2 TCe', '1.4 16V', '1.5 dCi', '1.6 16V'],
                'Safrane (1992-2000)': ['2.0', '2.2', '2.2 dT', '2.5', '3.0 V6', 'Biturbo'],
                'Scenic I (1996-2003)': ['1.4 16V', '1.6 16V', '1.9 dCi', '1.9 dTi', '2.0 16V'],
                'Scenic RX4': ['1.9 dCi', '2.0 16V'],
                'Scenic II (2003-2009)': ['1.4 16V', '1.5 dCi', '1.6 16V', '1.9 dCi', '2.0 16V', '2.0 T'],
                'Scenic III (2009-2016)': ['1.2 TCe', '1.4 TCe', '1.5 dCi', '1.6 16V', '1.6 dCi', '1.9 dCi', '2.0 dCi'],
                'Scenic IV (2016-2022)': ['1.2 TCe', '1.3 TCe', '1.5 dCi', '1.6 dCi', '1.7 Blue dCi'],
                'Austral (2022-)': ['1.3 Mild Hybrid 160', '1.2 E-Tech Full Hybrid 200'],
                'Captur I (2013-2019)': ['0.9 TCe', '1.2 TCe', '1.5 dCi'],
                'Captur II (2020-)': ['1.0 TCe', '1.3 TCe', '1.5 Blue dCi', 'E-Tech Hybrid'],
                'Duster (Renault 2024-)': ['1.0 TCe', '1.2 Mild Hybrid 130hp', '1.2 E-Tech Full Hybrid 145hp', '1.5 Blue dCi'],
                'Kadjar (2015-2022)': ['1.2 TCe', '1.3 TCe', '1.5 dCi', '1.6 dCi'],
                'Koleos I (2008-2016)': ['2.0 dCi'],
                'Koleos II (2016-2023)': ['1.6 dCi', '2.0 dCi'],
                'Rafale (2024-)': ['1.2 E-Tech Full Hybrid 200hp', '4x4 300hp PHEV'],
                'Symbol I (1999-2008)': ['1.2 16V', '1.4 8V', '1.4 16V', '1.5 dCi'],
                'Symbol II (2008-2012)': ['1.2 16V', '1.4 8V', '1.5 dCi'],
                'Symbol III (2013-2021)': ['0.9 TCe', '1.0 SCe', '1.2 16V', '1.5 dCi'],
                'Taliant (2021-)': ['1.0 SCe', '1.0 TCe', '1.0 TCe X-Tronic'],
                'Talisman (2015-2022)': ['1.3 TCe', '1.5 dCi', '1.6 dCi', '1.6 TCe', '1.8 TCe', '2.0 Blue dCi'],
                'Twingo I (1993-2007)': ['1.2 8V', '1.2 16V'],
                'Twingo II (2007-2014)': ['1.2 8V', '1.2 16V', '1.2 TCe', '1.5 dCi', '1.6 RS'],
                'Twingo III (2014-)': ['0.9 TCe', '1.0 SCe', 'Z.E. Elektrik'],
                'Twizy': ['Elektrik (17 bg)'],
                'Vel Satis (2002-2009)': ['2.0 T', '2.2 dCi', '3.0 V6 dCi', '3.5 V6'],
                'ZOE': ['R90', 'R110', 'R135', 'Z.E. 40', 'Z.E. 50'],
                'R5 E-Tech (2024-)': ['EV40 120hp', 'EV52 150hp'],
                'Kangoo I (1997-2007)': ['1.2', '1.4', '1.5 dCi', '1.9 D'],
                'Kangoo II / Multix (2007-2021)': ['1.2 TCe', '1.5 dCi 75', '1.5 dCi 90', '1.5 dCi 110', '1.6 16V'],
                'Kangoo III (2021-)': ['1.3 TCe', '1.5 Blue dCi'],
                'Kangoo E-Tech': ['Elektrik (120 bg)', 'Elektrik (45 kWh)'],
                'Kangoo Express / Van': ['1.5 dCi 75', '1.5 dCi 90', '1.5 Blue dCi 95', '1.3 TCe'],
                'Express / Express Combi': ['1.3 TCe 100', '1.5 Blue dCi 75', '1.5 Blue dCi 95'],
                'Express Van': ['1.3 TCe', '1.5 Blue dCi'],
                'Master': ['2.3 dCi 130', '2.3 dCi 150', '2.3 dCi 165', 'E-Tech Elektrik'],
                'Trafic / Trafic Multix': ['1.6 dCi', '1.9 dCi', '2.0 dCi', '2.5 dCi', 'E-Tech Elektrik'],
                'R9 / R11 (Eski Nesil)': ['1.4 GTS', '1.4 Spring', '1.4 Broadway', '1.6 Fairway'],
                'R12 (Toros / GTS)': ['1.3', '1.4'],
                'R19 (Europa)': ['1.4', '1.6', '1.8', '1.9 D'],
                'R21 (Manager / Optima / Concorde)': ['1.7', '1.9 D', '2.0']
            },

            'Ford': {
                'B-Max (2012-2017)': ['1.0 EcoBoost', '1.4', '1.5 TDCi', '1.6 TDCi', '1.6 Ti-VCT'],
                'C-Max I (2003-2010)': ['1.6 TDCi', '1.6 Ti-VCT', '2.0 TDCi'],
                'C-Max II (2010-2019)': ['1.0 EcoBoost', '1.5 EcoBoost', '1.5 TDCi', '1.6 TDCi', '1.6 Ti-VCT'],
                'E-Tourneo Courier (2024-)': ['EV 100 kW'],
                'E-Transit (2022-)': ['EV 135 kW', 'EV 198 kW'],
                'EcoSport (2014-2023)': ['1.0 EcoBoost', '1.5 TDCi'],
                'Escort (1995-2000)': ['1.3', '1.6 CLX', '1.6 Zetec CLX', '1.8 XR3i'],
                'Fiesta (2002-2008)': ['1.4 TDCi', '1.4i 16V'],
                'Fiesta (2008-2017)': ['1.0 EcoBoost', '1.25i', '1.4 TDCi', '1.5 TDCi', '1.6 TDCi'],
                'Fiesta (2017-)': ['1.0 EcoBoost mHEV', '1.1', '1.5 TDCi'],
                'Focus I (1998-2004)': ['1.6 Ambiente', '1.6 Ghia', '1.6 Trend', '2.0 Sport Trend'],
                'Focus II (2004-2011)': ['1.4', '1.6 TDCi', '1.6 Ti-VCT', '1.6 TDCi Titanium', '2.5 ST'],
                'Focus III (2011-2018)': ['1.0 EcoBoost', '1.5 TDCi', '1.6 TDCi', '1.6 Ti-VCT', '2.0 ST'],
                'Focus IV (2018-)': ['1.0 EcoBoost mHEV', '1.5 EcoBlue', '1.5 Ti-VCT'],
                'Fusion (2002-2012)': ['1.4 TDCi', '1.4i', '1.6 TDCi', '1.6i'],
                'Galaxy (2006-2015)': ['2.0 TDCi'],
                'Galaxy (2015-)': ['1.5 EcoBoost', '2.0 TDCi'],
                'Grand C-Max (2010-2019)': ['1.5 TDCi', '1.6 TDCi', '1.6 Ti-VCT'],
                'Ka (1996-2008)': ['1.3i'],
                'Ka (2008-2016)': ['1.2'],
                'Kuga (2008-2012)': ['2.0 TDCi AWD'],
                'Kuga (2012-2019)': ['1.5 EcoBoost', '1.5 TDCi', '2.0 TDCi'],
                'Kuga (2020-)': ['1.5 EcoBlue', '1.5 EcoBoost', '2.5 PHEV'],
                'Mondeo (2007-2014)': ['1.6 Ti-VCT', '1.6 TDCi', '2.0 TDCi'],
                'Mondeo (2014-2022)': ['1.5 EcoBoost', '1.6 TDCi', '2.0 EcoBlue'],
                'Mustang (2015-)': ['2.3 EcoBoost', '5.0 V8 GT'],
                'Mustang Mach-E': ['Standart Range RWD', 'Extended Range AWD', 'GT'],
                'Puma (2019-)': ['1.0 EcoBoost', '1.0 EcoBoost mHEV', '1.5 EcoBlue'],
                'Puma-E (2024-)': ['EV 100 kW'],
                'Ranger (2012-2022)': ['2.2 TDCi', '3.2 TDCi', '2.0 EcoBlue'],
                'Ranger (2022-)': ['2.0 EcoBlue'],
                'Ranger Raptor (2019-)': ['2.0 EcoBlue Bi-Turbo', '3.0 V6 EcoBoost'],
                'S-Max (2006-2014)': ['1.6 TDCi', '2.0 TDCi'],
                'S-Max (2015-)': ['1.5 EcoBoost', '2.0 EcoBlue', '2.0 TDCi'],
                'Taunus (1980-1993)': ['1.6', '1.6 GTS', '2.0', '2.0 GTS'],
                'Tourneo Connect (2002-2013)': ['1.8 TDCi'],
                'Tourneo Connect (2014-2022)': ['1.5 TDCi', '1.6 TDCi'],
                'Tourneo Connect (2022-)': ['2.0 EcoBlue'],
                'Tourneo Courier (2014-2023)': ['1.0 EcoBoost', '1.5 TDCi', '1.6 TDCi'],
                'Tourneo Courier (2023-)': ['1.0 EcoBoost'],
                'Tourneo Custom (2012-2023)': ['2.0 EcoBlue', '2.2 TDCi'],
                'Tourneo Custom (2024-)': ['2.0 EcoBlue'],
                'Transit (2000-2014)': ['2.2 TDCi', '2.4 TDCi'],
                'Transit (2014-)': ['2.0 EcoBlue', '2.2 TDCi'],
                'Transit Connect (2002-2013)': ['1.8 TDCi'],
                'Transit Connect (2014-2022)': ['1.5 TDCi', '1.6 TDCi'],
                'Transit Courier': ['1.0 EcoBoost', '1.5 TDCi', '1.6 TDCi'],
                'Transit Custom': ['2.0 EcoBlue 105ps', '2.0 EcoBlue 130ps', '2.0 EcoBlue 170ps']
            },

            'Volkswagen': {
                'Golf 1 (1974-1983)': ['1.1', '1.3', '1.5', '1.6 D', '1.6 GTI'],
                'Golf 2 (1983-1992)': ['1.3', '1.6', '1.6 D', '1.6 TD', '1.8 GTI'],
                'Golf 3 (1992-1997)': ['1.4', '1.6', '1.8', '1.9 TDI', '2.0 GTI', '2.8 VR6'],
                'Golf 4 (1997-2003)': ['1.6 8V', '1.6 16V', '1.8 T', '1.9 TDI', 'R32'],
                'Golf 5 (2003-2008)': ['1.4 TSI', '1.6 FSI', '1.6 TDI', '1.9 TDI', '2.0 TDI', 'GTI'],
                'Golf 6 (2008-2012)': ['1.2 TSI', '1.4 TSI', '1.6 TDI', '2.0 TDI'],
                'Golf 7 / 7.5 (2012-2020)': ['1.0 TSI', '1.2 TSI', '1.4 TSI', '1.5 TSI', '1.6 TDI'],
                'Golf 8 (2020-)': ['1.0 eTSI', '1.0 TSI', '1.5 eTSI', '2.0 TDI'],
                'Passat B5 / B5.5 (1996-2005)': ['1.6', '1.8 T', '1.9 TDI', '2.0 TDI'],
                'Passat B6 (2005-2010)': ['1.4 TSI', '1.6 FSI', '2.0 TDI'],
                'Passat B7 (2010-2014)': ['1.4 TSI', '1.6 TDI', '2.0 TDI'],
                'Passat B8 (2015-2023)': ['1.4 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI'],
                'Passat B9 (2024-)': ['1.5 eTSI', '2.0 TDI'],
                'Arteon (2017-)': ['1.5 TSI', '2.0 TDI', '2.0 TSI R'],
                'Polo (2009-2017)': ['1.2 TSI', '1.4', '1.4 TDI', '1.6 TDI'],
                'Polo (2017-)': ['1.0 MPI', '1.0 TSI', 'GTI 2.0 TSI'],
                'Tiguan (2007-2016)': ['1.4 TSI', '2.0 TDI'],
                'Tiguan (2016-)': ['1.4 TSI', '1.5 TSI', '2.0 TDI'],
                'T-Roc (2017-)': ['1.5 TSI', '2.0 TDI'],
                'Caddy (2004-2020)': ['1.6 TDI', '1.9 TDI', '2.0 SDI', '2.0 TDI'],
                'Caddy (2020-)': ['2.0 TDI'],
                'Transporter T5/T6/T6.1': ['1.9 TDI', '2.0 TDI 114ps', '2.0 TDI 150ps', '2.5 TDI'],
                'Amarok': ['2.0 TDI', '2.0 BiTDI', '3.0 V6 TDI'],
                'Beetle (1998-2011)': ['1.6', '1.9 TDI'],
                'Beetle (2012-2019)': ['1.2 TSI', '1.4 TSI', '1.6 TDI'],
                'Bora (1998-2005)': ['1.6', '1.6 16V', '1.8 T', '1.9 TDI'],
                'EOS (2006-2015)': ['1.4 TSI', '1.6 FSI', '2.0 TDI', '2.0 TSI'],
                'ID.3 (2020-)': ['EV 110 kW', 'EV 150 kW'],
                'ID.7 (2023-)': ['EV 210 kW'],
                'Jetta (2005-2010)': ['1.4 TSI', '1.6', '1.6 FSI', '1.9 TDI', '2.0 TDI'],
                'Jetta (2010-2018)': ['1.2 TSI', '1.4 TSI', '1.6 TDI'],
                'Lupo (1998-2005)': ['1.2 TDI', '1.4', '1.4 TDI', '1.4 16V'],
                'Passat Alltrack (2012-2023)': ['2.0 TDI 4Motion'],
                'Passat Variant (2005-2014)': ['1.4 TSI', '1.6 TDI', '2.0 TDI'],
                'Passat Variant (2015-2023)': ['1.4 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI'],
                'Phaeton (2002-2016)': ['3.0 V6 TDI', '3.2 V6', '4.2 V8'],
                'Scirocco (2008-2017)': ['1.4 TSI', '2.0 TDI', '2.0 TSI'],
                'Sharan (1995-2010)': ['1.8 T', '1.9 TDI'],
                'Sharan (2010-2020)': ['1.4 TSI', '2.0 TDI'],
                'Touran (2003-2015)': ['1.4 TSI', '1.6 FSI', '1.6 TDI', '1.9 TDI', '2.0 TDI'],
                'VW CC (2012-2017)': ['1.4 TSI', '2.0 TDI']
            },

            'Fiat': {
                'Egea (2015-)': ['1.3 Multijet', '1.4 Fire', '1.6 Multijet', '1.5 T4 Hibrit', '1.0 Firefly'],
                'Linea (2007-2018)': ['1.3 Multijet', '1.4 Fire', '1.6 Multijet'],
                'Albea (2002-2012)': ['1.2 8V', '1.2 16V', '1.3 JTD', '1.4 8V'],
                'Fiorino (2007-)': ['1.3 Multijet', '1.4 Fire', '1.4 Eco'],
                'Doblo (2000-2010)': ['1.3 Multijet', '1.9 JTD'],
                'Doblo (2010-2023)': ['1.3 Multijet', '1.6 Multijet', '2.0 Multijet'],
                'Punto (2005-2018)': ['1.3 Multijet', '1.4 Fire', '1.4 MultiAir'],
                '500 / 500X / 500L': ['1.0 Hybrid', '1.2 Fire', '1.3 Multijet', '1.4 Fire', 'Elektrikli 500e'],
                'Uno (1989-2000)': ['1.4', '1.4 i.e.', '70 S'],
                'Tipo / Tempra (1990-1998)': ['1.4', '1.6', '2.0 i.e.', '2.0 16V'],
                'Bravo / Brava (1995-2001)': ['1.6 16V'],
                'Bravo (2007-2014)': ['1.4 T-Jet', '1.6 Multijet'],
                'Marea (1996-2007)': ['1.6 16V', '1.9 JTD', '2.0 20V'],
                'Stilo (2001-2007)': ['1.6 16V', '1.9 JTD'],
                'Scudo': ['1.6 Multijet', '2.0 Multijet'],
                'Ducato': ['2.2 Multijet', '2.3 Multijet']
            },

            'Toyota': {
                'Corolla (E120/130 2002-07)': ['1.4 VVT-i', '1.4 D-4D', '1.6 VVT-i'],
                'Corolla (E140/150 2007-13)': ['1.33 Dual VVT-i', '1.4 D-4D', '1.6 Dual VVT-i'],
                'Corolla (E160/170 2013-19)': ['1.33 Dual VVT-i', '1.4 D-4D', '1.6 Valvematic'],
                'Corolla (E210 2019-)': ['1.5 Dynamic Force', '1.8 Hybrid'],
                'Yaris (2005-2011)': ['1.0 VVT-i', '1.3 VVT-i', '1.4 D-4D'],
                'Yaris (2011-2020)': ['1.0 VVT-i', '1.33 Dual VVT-i', '1.5 Hybrid'],
                'Yaris (2020-)': ['1.0 VVT-i', '1.5 Hybrid', 'GR 1.6 Turbo'],
                'Auris (2007-2018)': ['1.33 Dual VVT-i', '1.4 D-4D', '1.6 Valvematic', '1.8 Hybrid'],
                'C-HR (2016-)': ['1.2 Turbo', '1.8 Hybrid', '2.0 Hybrid'],
                'RAV4': ['2.0 VVT-i', '2.2 D-4D', '2.5 Hybrid'],
                'Avensis': ['1.6 Valvematic', '1.8 Valvematic', '2.0 D-4D'],
                'Hilux': ['2.4 D-4D', '2.5 D-4D', '3.0 D-4D'],
                'Land Cruiser Prado': ['3.0 D-4D', '4.5 V8 D-4D', '2.8 D-4D'],
                'Proace City': ['1.5 D', '1.2 Turbo']
            },

            'Honda': {
                'Civic FD6 (2006-2012)': ['1.6 i-VTEC'],
                'Civic FB7 (2012-2016)': ['1.6 i-VTEC', '1.6 i-VTEC Eco (LPG)'],
                'Civic FC5 (2016-2021)': ['1.5 VTEC Turbo', '1.6 i-VTEC', '1.6 i-DTEC'],
                'Civic FE1 (2021-)': ['1.5 VTEC Turbo', '1.5 e:HEV Hybrid'],
                'CR-V (2007-2012)': ['2.0 i-VTEC', '2.2 i-DTEC'],
                'CR-V (2012-2018)': ['1.6 i-DTEC', '2.0 i-VTEC'],
                'CR-V (2018-)': ['1.5 VTEC Turbo', '2.0 e:HEV Hybrid'],
                'HR-V': ['1.5 i-VTEC', '1.5 e:HEV Hybrid'],
                'City': ['1.4 i-VTEC', '1.5 i-VTEC'],
                'Jazz': ['1.3 i-VTEC', '1.5 e:HEV Hybrid'],
                'Accord': ['1.5 VTEC Turbo', '2.0 i-VTEC', '2.4 i-VTEC'],
                'S2000 (1999-2009)': ['2.0 VTEC']
            },

            'Hyundai': {
                'Accent Era (2006-2012)': ['1.4', '1.5 CRDi VGT', '1.6'],
                'Accent Blue (2011-2018)': ['1.4 D-CVVT', '1.6 CRDi'],
                'i20 (2008-2014)': ['1.2 D-CVVT', '1.4 CRDi'],
                'i20 (2014-2020)': ['1.0 T-GDI', '1.2 MPI', '1.4 MPI', '1.4 CRDi'],
                'i20 (2020-)': ['1.0 T-GDI', '1.2 MPI', '1.4 MPI'],
                'i30': ['1.4 MPI', '1.6 CRDi', '1.6 T-GDI'],
                'Tucson (2015-2020)': ['1.6 GDI', '1.6 T-GDI', '1.6 CRDi', '2.0 CRDi'],
                'Tucson (2020-)': ['1.6 T-GDI', '1.6 CRDi Mild Hybrid', '1.6 T-GDI Hybrid'],
                'Elantra': ['1.6 D-CVVT', '1.6 CRDi', '1.6 MPI'],
                'Getz (2002-2011)': ['1.3', '1.4', '1.5 CRDi VGT'],
                'Bayon (2021-)': ['1.0 T-GDI', '1.4 MPI'],
                'Kona': ['1.0 T-GDI', '1.6 T-GDI', '1.6 CRDi', 'Elektrikli (64 kWh)'],
                'Ioniq 5 / Ioniq 6': ['125 kW (170 PS)', '168 kW (228 PS)', '239 kW (325 PS)'],
                'Santa Fe': ['2.0 CRDi', '2.2 CRDi'],
                'H-100 (Kamyonet)': ['2.5 D', '2.5 TCI'],
                'Starex': ['2.5 CRDi', '2.5 TCi']
            },

            'Opel': {
                'Astra G (1998-2009)': ['1.4 16V', '1.6 16V', '1.7 DTI', '2.0 16V'],
                'Astra H (2004-2014)': ['1.3 CDTI', '1.6 16V', '1.6 Twinport', '1.9 CDTI'],
                'Astra J (2009-2015)': ['1.3 CDTI', '1.4 Turbo', '1.6 16V', '1.6 CDTI'],
                'Astra K (2015-2021)': ['1.0 Turbo', '1.4 Turbo', '1.6 CDTI'],
                'Astra L (2021-)': ['1.2 Turbo', '1.5 Diesel'],
                'Corsa C (2000-2006)': ['1.0 12V', '1.2 16V', '1.3 CDTI', '1.4 16V'],
                'Corsa D (2006-2014)': ['1.2 Twinport', '1.3 CDTI', '1.4 Twinport'],
                'Corsa E (2014-2019)': ['1.2', '1.3 CDTI', '1.4'],
                'Corsa F (2019-)': ['1.2 Turbo', '1.5 Diesel', 'Corsa-e (Elektrik)'],
                'Insignia A (2008-2017)': ['1.4 Turbo', '1.6 CDTI', '1.6 Turbo', '2.0 CDTI'],
                'Insignia B (2017-)': ['1.5 Turbo', '1.6 CDTI', '2.0 CDTI'],
                'Mokka': ['1.2 Turbo', '1.5 Diesel', 'Mokka-e (Elektrik)'],
                'Crossland X / Crossland': ['1.2 Turbo', '1.5 Diesel', '1.6 CDTI'],
                'Vectra (A/B/C)': ['1.6 16V', '1.8 16V', '1.9 CDTI', '2.0 16V', '2.0 DTI'],
                'Omega': ['2.0 16V', '2.5 V6'],
                'Zafira': ['1.6 16V', '1.9 CDTI'],
                'Meriva': ['1.3 CDTI', '1.4', '1.6'],
                'Combo': ['1.3 CDTI', '1.5 Diesel', '1.7 DTI'],
                'Vivaro': ['1.9 DTI', '2.0 CDTI'],
                'Frontera': ['2.2 DTI', '3.2 V6']
            },

            'Peugeot': {
                '206 / 206+': ['1.4 HDi', '1.4i', '1.6 16V'],
                '207 (2006-2014)': ['1.4 HDi', '1.4 VTi', '1.6 HDi', '1.6 VTi'],
                '208 (2012-2019)': ['1.0 VTi', '1.2 PureTech', '1.4 HDi', '1.6 e-HDi'],
                '208 (2019-)': ['1.2 PureTech', '1.5 BlueHDi', 'e-208 (Elektrik)'],
                '301 (2012-)': ['1.2 PureTech', '1.5 BlueHDi', '1.6 HDi', '1.6 VTi'],
                '308 (2007-2013)': ['1.6 HDi', '1.6 VTi', '1.6 THP'],
                '308 (2013-2021)': ['1.2 PureTech', '1.6 BlueHDi'],
                '3008 (2009-2016)': ['1.6 HDi', '1.6 THP'],
                '3008 (2016-2023)': ['1.2 PureTech', '1.5 BlueHDi', '1.6 BlueHDi'],
                '508 (2010-2018)': ['1.6 e-HDi', '1.6 BlueHDi', '2.0 HDi'],
                'Partner Tepee / Rifter': ['1.2 PureTech', '1.5 BlueHDi', '1.6 HDi'],
                '106': ['1.0', '1.1', '1.4', '1.6 GTI'],
                '306': ['1.4', '1.6', '1.8', '2.0 GTI'],
                '406': ['1.6', '1.8', '2.0', '2.0 HDi'],
                '407': ['1.6 HDi', '2.0 HDi', '2.0'],
                '5008': ['1.2 PureTech', '1.5 BlueHDi', '1.6 BlueHDi', '1.6 HDi'],
                'Bipper': ['1.4 HDi'],
                'Expert': ['1.6 HDi', '2.0 HDi'],
                'Boxer': ['2.2 HDi', '2.0 BlueHDi']
            },

            'Dacia': {
                'Duster (2010-2017)': ['1.5 dCi 90', '1.5 dCi 110', '1.6 16V'],
                'Duster (2018-2023)': ['1.0 TCe', '1.0 TCe ECO-G', '1.3 TCe', '1.5 Blue dCi'],
                'Sandero (2008-2012)': ['1.2 16V', '1.4', '1.5 dCi'],
                'Sandero (2012-2020)': ['0.9 TCe', '1.0 SCe', '1.5 dCi'],
                'Sandero (2020-)': ['1.0 SCe', '1.0 TCe', '1.0 TCe ECO-G'],
                'Logan / Lodgy': ['1.5 dCi 90', '1.5 dCi 110', '1.6'],
                'Spring': ['65hp Elektrik', '45hp Elektrik'],
                'Jogger': ['1.0 TCe', '1.0 TCe ECO-G'],
                'Dokker': ['1.5 dCi', '1.6 MPI']
            },

            'Skoda': {
                'Octavia (2004-2013)': ['1.6 MPI', '1.6 TDI', '1.9 TDI', '2.0 TDI'],
                'Octavia (2013-2020)': ['1.0 TSI', '1.2 TSI', '1.4 TSI', '1.6 TDI'],
                'Octavia (2020-)': ['1.0 eTSI', '1.5 eTSI', '2.0 TDI'],
                'Superb (2008-2015)': ['1.4 TSI', '1.6 TDI', '2.0 TDI'],
                'Superb (2015-)': ['1.4 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI'],
                'Fabia': ['1.0 MPI', '1.0 TSI', '1.2 TSI', '1.4 TDI', '1.6 TDI'],
                'Karoq / Kodiaq': ['1.0 TSI', '1.5 TSI', '1.6 TDI', '2.0 TDI'],
                'Scala': ['1.0 TSI', '1.5 TSI'],
                'Kamiq': ['1.0 TSI', '1.5 TSI'],
                'Yeti': ['1.2 TSI', '1.4 TSI', '1.6 TDI'],
                'Roomster': ['1.2 TSI', '1.4 TDI', '1.6 TDI'],
                'Enyaq iV': ['iV 60', 'iV 80']
            },

            'BMW': {
                '1 Serisi (F20/F40)': ['116d', '116i', '118i', '120d'],
                '3 Serisi (E46/E90)': ['316i', '318i', '320i', '320d', '330d'],
                '3 Serisi (F30)': ['316i', '318i', '320i ED', '320d'],
                '3 Serisi (G20)': ['320i', '330e'],
                '5 Serisi (E60/F10)': ['520d', '520i', '525d', '530d'],
                '5 Serisi (G30)': ['520d', '520i', '530i'],
                'X1 / X3 / X5': ['sDrive 18i', 'xDrive 20d', 'xDrive 30d'],
                'i Serisi (Elektrik)': ['i3', 'i4 eDrive40', 'iX xDrive40', 'iX3'],
                '2 Serisi': ['216d', '218i', '220i'],
                '4 Serisi': ['418i', '420d', '420i', '430i'],
                '7 Serisi': ['730d', '740d', '740i'],
                'X2': ['sDrive 18i', 'sDrive 15d'],
                'X4': ['xDrive 20d'],
                'X6': ['xDrive 30d', 'xDrive 40d'],
                'Z4': ['sDrive 20i', 'sDrive 30i']
            },

            'Mercedes-Benz': {
                'A-Serisi (W176/W177)': ['A 180', 'A 180 d', 'A 200', 'A 200 d'],
                'C-Serisi (W204/W205)': ['C 180', 'C 200 d', 'C 220 d'],
                'E-Serisi (W212/W213)': ['E 180', 'E 200 d', 'E 220 d', 'E 250'],
                'S-Serisi': ['S 350 d', 'S 400 d', 'S 500'],
                'GLA / GLB / GLC': ['180 d', '200', '220 d 4MATIC'],
                'EQ (Elektrik)': ['EQA', 'EQB', 'EQC', 'EQE', 'EQS'],
                'B-Serisi': ['B 150', 'B 180', 'B 180 d'],
                'CLA': ['CLA 180 d', 'CLA 200', 'CLA 200 d'],
                'CLS': ['CLS 300 d', 'CLS 350 d'],
                'G-Serisi (G-Wagon)': ['G 350 d', 'G 400 d', 'G 500', 'G 63 AMG'],
                'Vito': ['111 CDI', '114 CDI', '116 CDI', '119 CDI'],
                'Sprinter': ['211 CDI', '315 CDI', '316 CDI', '415 CDI'],
                'Citan': ['108 CDI', '109 CDI', '111 CDI']
            },

            'Audi': {
                'A3 (8P/8V/8Y)': ['1.0 TFSI', '1.4 TFSI', '1.5 TFSI', '1.6', '1.6 TDI'],
                'A4 (B8/B9)': ['1.4 TFSI', '1.8 TFSI', '2.0 TDI', '2.0 TFSI'],
                'A6 (C7/C8)': ['2.0 TDI', '2.0 TFSI', '3.0 TDI Quattro'],
                'Q2 / Q3': ['1.4 TFSI', '1.5 TFSI', '35 TFSI'],
                'Q5 / Q7': ['2.0 TDI Quattro', '3.0 TDI Quattro'],
                'e-tron': ['50 Quattro', '55 Quattro', 'GT'],
                'A1': ['1.0 TFSI', '1.4 TFSI', '1.6 TDI'],
                'A5': ['1.4 TFSI', '2.0 TDI', '2.0 TFSI'],
                'A7': ['2.0 TFSI', '3.0 TDI Quattro'],
                'Q8': ['50 TDI Quattro', 'RS Q8'],
                'TT': ['1.8 T', '2.0 TFSI']
            },

            'Seat': {
                'Leon (2005-2012)': ['1.4 TSI', '1.6', '1.6 TDI', '1.9 TDI'],
                'Leon (2012-2020)': ['1.0 TSI', '1.2 TSI', '1.4 TSI', '1.6 TDI'],
                'Leon (2020-)': ['1.0 eTSI', '1.5 eTSI'],
                'Ibiza': ['1.0 EcoTSI', '1.2 TSI', '1.4', '1.4 TDI'],
                'Ateca / Arona': ['1.0 EcoTSI', '1.5 EcoTSI', '1.6 TDI'],
                'Toledo': ['1.2 TSI', '1.4 TSI', '1.6 TDI'],
                'Altea / Altea XL': ['1.4 TSI', '1.6', '1.6 TDI'],
                'Cordoba': ['1.4', '1.4 TDI', '1.9 TDI']
            },

            'Porsche': {
                'Macan': ['2.0', 'S 2.9', 'S 3.0', 'GTS', 'Turbo'],
                'Cayenne': ['3.0 V6', 'E-Hybrid', 'Turbo V8'],
                'Panamera': ['4 2.9 V6', '4S', 'GTS', 'Turbo S'],
                'Taycan': ['Taycan', '4S', 'Turbo', 'Turbo S', 'Cross Turismo'],
                '911 (991/992)': ['Carrera', 'Carrera S', 'Turbo', 'GT3'],
                'Boxster / Cayman (718)': ['2.0', 'S 2.5', 'GTS 4.0']
            },

            'Nissan': {
                'Qashqai (J10/J11)': ['1.2 DIG-T', '1.3 DIG-T', '1.5 dCi', '1.6 dCi'],
                'Qashqai (J12)': ['1.3 DIG-T mHEV', 'e-POWER'],
                'X-Trail': ['1.5 e-POWER', '1.6 dCi', '2.0 dCi'],
                'Juke': ['1.0 DIG-T', '1.2 DIG-T', '1.5 dCi', '1.6'],
                'Micra': ['1.0 IG-T', '1.2', '1.5 dCi'],
                'Navara': ['2.3 dCi 160', '2.3 dCi 190'],
                'Almera': ['1.5'],
                'Primera': ['1.6', '1.8', '2.0'],
                'Note': ['1.2', '1.5 dCi']
            },

            'Kia': {
                'Ceed': ['1.0 T-GDI', '1.4 CRDi', '1.4 MPI', '1.6 CRDi'],
                'Sportage (2010-2021)': ['1.6 GDI', '1.6 CRDi', '2.0 CRDi'],
                'Sportage (2022-)': ['1.6 T-GDI', '1.6 CRDi Mild Hybrid'],
                'Rio': ['1.25 CVVT', '1.4 CRDi'],
                'Stonic / XCeed': ['1.0 T-GDI', '1.4 MPI'],
                'EV6': ['Standard Range', 'Long Range AWD', 'GT'],
                'Picanto': ['1.0 MPI', '1.25 MPI'],
                'Cerato': ['1.5 CRDi', '1.6 CRDi', '1.6 MPI'],
                'Sorento': ['2.0 CRDi', '2.5 CRDi'],
                'Niro': ['1.6 GDI Hybrid', 'Elektrikli (64 kWh)'],
                'Bongo (Kamyonet)': ['2.5 CRDi', '2.7 D', '2.9 CRDi']
            },

            'Togg': {
                'T10X': ['V1 RWD Standart Menzil (314km)', 'V2 RWD Standart Menzil (314km)', 'V2 RWD Uzun Menzil (523km)']
            },

            'BYD': {
                'Atto 3': ['150 kW (204 PS) Elektrikli'],
                'Seal': ['82.5 kWh AWD (Elektrikli)', 'Seal U DM-i (PHEV)'],
                'Dolphin': ['150 kW Elektrikli']
            },

            'Chery': {
                'Tiggo 7 Pro': ['1.6 TGDI (183 HP)'],
                'Tiggo 8 Pro': ['1.6 TGDI (183 HP)'],
                'Omoda 5': ['1.6 TGDI (183 HP)']
            },

            'Tesla': {
                'Model 3': ['Standard Range Plus RWD', 'Long Range AWD', 'Performance'],
                'Model Y': ['Standard Range RWD', 'Long Range AWD', 'Performance AWD'],
                'Model S / X': ['Long Range', 'Plaid']
            },

            'Volvo': {
                'XC90': ['B5 AWD', 'B6 AWD', 'T8 Recharge', 'D5 AWD'],
                'XC60 / XC40': ['B4', 'B5 AWD', 'T8 Recharge', 'D4 AWD'],
                'S60 / S90': ['B4', 'B5 AWD', 'T8 Recharge', 'D4'],
                'EX30 / C40': ['Single Motor', 'Twin Motor AWD'],
                'S40': ['1.6 D', '1.6', '1.9 D', '2.0 D'],
                'S80': ['1.6 D', '2.0 T', '2.4 D5'],
                'V40': ['1.5 T3', '1.6 D2', '2.0 D4']
            },

            'Cupra': {
                'Formentor': ['1.5 TSI', '2.0 TSI (310hp)'],
                'Leon': ['1.4 eHybrid', '1.5 eTSI', '2.0 TSI']
            },

            'MG': {
                'ZS': ['1.0 T-GDI', '1.5 VTI-tech', 'ZS EV (Elektrik)'],
                'HS': ['1.5 T-GDI', '1.5 PHEV'],
                'MG4': ['125 kW (Standart)', '150 kW (Luxury)']
            },

            'SsangYong / KGM': {
                'Tivoli': ['1.5 T-GDI', '1.6 e-XDI'],
                'Korando': ['1.5 T-GDI', '1.6 e-XDI'],
                'Rexton': ['2.2 e-XDI'],
                'Musso Grand': ['2.2 e-XDI']
            },

            'Isuzu': {
                'D-Max': ['1.9 Ddi', '2.5 D']
            }, 

            'Lexus': {
                'UX': ['250h (Hybrid)', '300e (Elektrik)'],
                'NX (2014-2021)': ['200t', '300h (Hybrid)'],
                'NX (2022-)': ['350h (Hybrid)', '450h+ (PHEV)'],
                'RX': ['350', '400h', '450h', '500h (Hybrid)'],
                'ES': ['300h (Hybrid)'],
                'LS': ['500h (Hybrid)']
            },

            'DS Automobiles': {
                'DS 3 / Crossback': ['1.2 PureTech', '1.5 BlueHDi', 'E-Tense (Elektrik)'],
                'DS 4': ['1.2 PureTech', '1.5 BlueHDi', '1.6 PureTech'],
                'DS 7 / Crossback': ['1.5 BlueHDi', '1.6 PureTech', 'E-Tense (PHEV)'],
                'DS 9': ['1.6 PureTech', 'E-Tense (PHEV)']
            },

            'Jaguar': {
                'XE': ['2.0 D', '2.0 i4 Ti'],
                'XF': ['2.0 D', '2.0 i4 Ti', '3.0 D'],
                'F-Pace': ['2.0 D', '3.0 D'],
                'E-Pace': ['1.5 P200', '2.0 D'],
                'I-Pace': ['EV400 (Elektrik)'],
                'X-Type': ['2.0 D', '2.1 V6', '3.0 V6']
            },

            'Maserati': {
                'Ghibli': ['2.0 Hybrid', '3.0 Diesel', '3.0 V6 S Q4'],
                'Levante': ['2.0 Hybrid', '3.0 Diesel', '3.0 V6 S'],
                'Grecale': ['2.0 GT MHEV', '3.0 Modena']
            },

            'Lada': {
                'Niva / Samara 4x4': ['1.6', '1.7', '1.9 D'],
                'Samara': ['1.3', '1.5'],
                'Vega': ['1.5 8V', '1.5 16V']
            },

            'Tata': {
                'Indica': ['1.4 MPFI', '1.4 TDI'],
                'Marina': ['1.4 TDI'],
                'Telcoline': ['1.9 TD', '2.0 TDI'],
                'Xenon': ['2.2 DICOR']
            },

            'Proton': {
                'Savvy': ['1.2'],
                'Gen-2': ['1.6'],
                'Persona': ['1.6']
            },

            'Skywell': {
                'ET5': ['150 kW Elektrikli (650km Menzil)', '86 kWh Legend/Premium']
            },

            'Leapmotor': {
                'T03': ['80 kW Elektrikli']
            },

            'Seres': {
                'Seres 3': ['120 kW Elektrikli']
            },

            'Voyah': {
                'Free': ['360 kW AWD Elektrikli']
            },

            'Ferrari': {
                'F430': ['4.3 V8'],
                '458 Italia': ['4.5 V8'],
                '488 GTB': ['3.9 V8 Turbo'],
                'F8 Tributo': ['3.9 V8 Turbo'],
                'Roma': ['3.9 V8 Turbo'],
                '296 GTB': ['3.0 V6 PHEV']
            },

            'Lamborghini': {
                'Gallardo': ['5.0 V10', '5.2 V10'],
                'Huracan': ['5.2 V10'],
                'Aventador': ['6.5 V12'],
                'Urus': ['4.0 V8 Bi-Turbo']
            },

            'Bentley': {
                'Continental GT': ['4.0 V8', '6.0 W12'],
                'Bentayga': ['4.0 V8 Diesel', '4.0 V8 Petrol', '6.0 W12']
            },

            'Aston Martin': {
                'DB11': ['4.0 V8', '5.2 V12'],
                'Vantage': ['4.0 V8'],
                'DBX': ['4.0 V8']
            },

            'Geely': {
                'Echo': ['1.3'],
                'Familia': ['1.5'],
                'Emgrand': ['1.5']
            },

            'DFSK': {
                'Fengon 500': ['1.5 Benzine'],
                'Fengon 5': ['1.5 Turbo'],
                'EC35 (Elektrikli Van)': ['60 kW']
            },

            'Citroën': {
                'C3 (2002-2016)': ['1.4 HDi', '1.4i', '1.6 HDi'],
                'C3 (2017-)': ['1.2 PureTech', '1.5 BlueHDi'],
                'C4 (2004-2018)': ['1.6 HDi', '1.6 VTi', '1.6 THP'],
                'C4 / C4 X (2020-)': ['1.2 PureTech', '1.5 BlueHDi', 'ë-C4 (Elektrik)'],
                'C5 Aircross': ['1.2 PureTech', '1.5 BlueHDi', '1.6 PureTech'],
                'C-Elysee': ['1.2 PureTech', '1.5 BlueHDi', '1.6 HDi', '1.6 VTi'],
                'Berlingo': ['1.5 BlueHDi', '1.6 HDi', '1.9 D'],
                'Nemo': ['1.3 HDi', '1.4 HDi'],
                'Jumpy / SpaceTourer': ['1.5 BlueHDi', '2.0 BlueHDi'],
                'Jumper': ['2.0 BlueHDi', '2.2 HDi'],
                'Ami': ['Elektrik (8 bg)']
            },

            'Chevrolet': {
                'Cruze': ['1.6', '1.4 Turbo', '2.0 VCDi'],
                'Aveo / Kalos': ['1.2', '1.4', '1.3 Diesel'],
                'Captiva': ['2.0 D', '2.2 D'],
                'Lacetti': ['1.4', '1.6', '2.0 D']
            },

            'Alfa Romeo': {
                'Giulietta': ['1.4 TB MultiAir', '1.6 JTDm'],
                '159': ['1.9 JTDm', '2.4 JTDm'],
                'Tonale': ['1.5 VGT MHEV', '1.6 JTDm'],
                'Stelvio': ['2.0 Turbo', '2.2 JTDm']
            },

            'Jeep': {
                'Renegade': ['1.0 T3', '1.3 T4', '1.4 MultiAir', '1.6 Multijet'],
                'Compass': ['1.3 T4', '1.4 MultiAir', '1.6 Multijet'],
                'Cherokee': ['2.0 Multijet', '3.7 V6'],
                'Grand Cherokee': ['3.0 V6 CRD']
            },

            'Land Rover': {
                'Range Rover Evoque': ['1.5 PHEV', '2.0 D', '2.0 TD4'],
                'Range Rover Sport': ['2.0 SD4', '3.0 SDV6'],
                'Discovery / Sport': ['2.0 TD4', '3.0 SDV6'],
                'Defender': ['2.0 D', '3.0 D']
            },

            'Mazda': {
                'Mazda3': ['1.5 Skyactiv-G', '1.6', '1.6 MZ-CD'],
                'Mazda6': ['2.0 Skyactiv-G', '2.0'],
                'CX-5': ['2.0 Skyactiv-G', '2.2 Skyactiv-D']
            }
        };

        var seciliMarka = ""; 

        function markaSec(markaAd, logoUrl) {
            seciliMarka = markaAd;
            var gizliInput = document.getElementById('gizli_marka_input');
            var butonMetin = document.getElementById('secilen_marka_metin');
            var digerMarkaKutusu = document.getElementById('diger_marka_input');

            // Model ve Motor alanlarını sıfırla
            document.getElementById('gizli_model_input').value = "";
            document.getElementById('secilen_model_metin').innerText = "Model Seçiniz...";
            document.getElementById('dropdown_model_buton').classList.remove('disabled');
            var modelList = document.getElementById('model_dropdown_list');
            modelList.innerHTML = '';
            document.getElementById('diger_model_input').classList.add('d-none');

            document.getElementById('gizli_motor_input').value = "";
            document.getElementById('secilen_motor_metin').innerText = "Önce Model Seçiniz...";
            document.getElementById('dropdown_motor_buton').classList.add('disabled');
            document.getElementById('motor_dropdown_list').innerHTML = '';
            document.getElementById('diger_motor_input').classList.add('d-none');

            if(markaAd === 'diger') {
                gizliInput.value = 'diger';
                butonMetin.innerHTML = '<i class="bi bi-pencil-square me-2 text-warning"></i>Diğer (Manuel Giriş)';
                digerMarkaKutusu.classList.remove('d-none');
                digerMarkaKutusu.focus();
                modelSec('diger'); 
            } else {
                gizliInput.value = markaAd;
                butonMetin.innerHTML = `<img src="${logoUrl}" class="brand-icon me-2">${markaAd}`;
                digerMarkaKutusu.classList.add('d-none');
                
                // Modelleri şık menüye ekle
                if (aracVerileri[markaAd]) {
                    Object.keys(aracVerileri[markaAd]).forEach(function(m) {
                        modelList.innerHTML += `<li><a class="dropdown-item custom-dropdown-item" style="cursor:pointer;" onclick="modelSec('${m}')">${m}</a></li>`;
                    });
                }
                modelList.innerHTML += '<li><hr class="dropdown-divider border-secondary"></li>';
                modelList.innerHTML += `<li><a class="dropdown-item custom-dropdown-item text-warning fw-bold" style="cursor:pointer;" onclick="modelSec('diger')"><i class="bi bi-pencil-square me-2"></i>Diğer (Manuel Giriş)</a></li>`;
            }
        }

        function modelSec(modelAd) {
    document.getElementById('gizli_model_input').value = modelAd;
    var digerModelKutusu = document.getElementById("diger_model_input");
    var motorList = document.getElementById('motor_dropdown_list');
    var motorButon = document.getElementById('dropdown_motor_buton');
    var yilInput = document.querySelector('input[name="arac_yil"]');
    
    // Motor alanını sıfırla
    document.getElementById('gizli_motor_input').value = "";
    document.getElementById('secilen_motor_metin').innerText = "Motor Seçiniz...";
    motorButon.classList.remove('disabled');
    motorList.innerHTML = '';
    document.getElementById('diger_motor_input').classList.add('d-none');

    // --- YENİ EKLENEN AKILLI YIL KONTROLÜ ---
    // Eğer seçilen modelin adında (2012-2019) veya (2019-) gibi bir yıl varsa bunu tespit et
    var yilMatch = modelAd.match(/\((\d{4})(?:-(\d{4})?)?\)/);
    var currentYear = new Date().getFullYear();

    if (modelAd === "diger") {
        document.getElementById('secilen_model_metin').innerHTML = '<i class="bi bi-pencil-square me-2 text-warning"></i>Diğer (Manuel Giriş)';
        digerModelKutusu.classList.remove("d-none");
        digerModelKutusu.focus();
        motorSec('diger');
        
        // Diğer seçilirse sınırları serbest bırak
        yilInput.min = "1900";
        yilInput.max = currentYear;
        yilInput.placeholder = "Örn: 2018";
    } else {
        document.getElementById('secilen_model_metin').innerText = modelAd;
        digerModelKutusu.classList.add("d-none");
        
        // Akıllı yıl sınırlandırmasını uygula
        if (yilMatch) {
            yilInput.min = yilMatch[1]; // Başlangıç yılı
            yilInput.max = yilMatch[2] ? yilMatch[2] : currentYear; // Bitiş yılı (yoksa günümüz yılı)
            yilInput.placeholder = yilMatch[1] + " ile " + yilInput.max + " arası";
            yilInput.value = ""; // Kutuyu temizle ki hatalı bir sayı kalmasın
        } else {
            // Yıl bilgisi yoksa (Örn: ZOE) sınırları serbest bırak
            yilInput.min = "1900";
            yilInput.max = currentYear;
            yilInput.placeholder = "Örn: 2018";
        }
        
        // Motorları şık menüye ekle
        var motorlar = (seciliMarka && aracVerileri[seciliMarka]) ? aracVerileri[seciliMarka][modelAd] : [];
        if (motorlar && motorlar.length > 0) {
            motorlar.forEach(function(m) { 
                motorList.innerHTML += `<li><a class="dropdown-item custom-dropdown-item" style="cursor:pointer;" onclick="motorSec('${m}')">${m}</a></li>`;
            });
            motorList.innerHTML += '<li><hr class="dropdown-divider border-secondary"></li>';
            motorList.innerHTML += `<li><a class="dropdown-item custom-dropdown-item text-warning fw-bold" style="cursor:pointer;" onclick="motorSec('diger')"><i class="bi bi-pencil-square me-2"></i>Diğer (Manuel Giriş)</a></li>`;
        } else {
            motorSec('diger'); 
        }
    }
}

        function motorSec(motorAd) {
            document.getElementById('gizli_motor_input').value = motorAd;
            var kutu = document.getElementById("diger_motor_input");
            
            if (motorAd === "diger") { 
                document.getElementById('secilen_motor_metin').innerHTML = '<i class="bi bi-pencil-square me-2 text-warning"></i>Diğer (Manuel Giriş)';
                kutu.classList.remove("d-none"); 
                kutu.focus(); 
            } else { 
                document.getElementById('secilen_motor_metin').innerText = motorAd;
                kutu.classList.add("d-none"); 
            }
        }

        // --- AKILLI TÜRKİYE PLAKA FORMATLAYICI ---
        // --- AKILLI TÜRKİYE PLAKA FORMATLAYICI (GELİŞMİŞ) ---
        // --- AKILLI TÜRKİYE PLAKA FORMATLAYICI (V2 - KURŞUNGEÇİRMEZ) ---
        // --- AKILLI TÜRKİYE PLAKA FORMATLAYICI (V3 - TAM KONTROL) ---
        const plakaInput = document.getElementById('plaka_input');
        
        if (plakaInput) {
            plakaInput.addEventListener('input', function(e) {
                let val = this.value.toLocaleUpperCase('tr-TR')
                                    .replace(/[^A-Z0-9]/g, ''); 

                let city = "";
                let letters = "";
                let numbers = "";

                // 1. İL KODU KONTROLÜ
                let cityMatch = val.match(/^\d{1,2}/);
                if (cityMatch) {
                    city = cityMatch[0];
                    
                    // KRİTİK KONTROL: İlk rakam 9 olamaz!
                    if (city.length === 1 && parseInt(city) > 8) {
                        city = ""; // 9'a basarsa anında sil
                    }
                    
                    // 81 SINIRI VE 00 KONTROLÜ
                    if (city.length === 2) {
                        let cityNumber = parseInt(city, 10);
                        if (cityNumber > 81 || cityNumber === 0) {
                            city = city.substring(0, 1); 
                        }
                    }
                    val = val.substring(city.length);
                } else {
                    val = ""; 
                }

                // 2. ORTA HARF GRUBU
                if (city.length === 2 && val.length > 0) {
                    let letterMatch = val.match(/^[A-Z]{1,3}/);
                    if (letterMatch) {
                        letters = letterMatch[0];
                        val = val.substring(letters.length);
                    } else {
                        val = ""; 
                    }
                } else if (city.length < 2) {
                    val = ""; 
                }

                // 3. SON RAKAM GRUBU
                if (letters.length > 0 && val.length > 0) {
                    let numberMatch = val.match(/^\d+/);
                    if (numberMatch) {
                        numbers = numberMatch[0];
                        let maxNumbers = (letters.length === 3) ? 3 : 4;
                        if (numbers.length > maxNumbers) {
                            numbers = numbers.substring(0, maxNumbers);
                        }
                    }
                }

                let formatted = city;
                if (letters.length > 0) formatted += " " + letters;
                if (numbers.length > 0) formatted += " " + numbers;

                this.value = formatted;
            });
        }
    </script>
</body>
</html>
