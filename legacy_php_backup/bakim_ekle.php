<?php 
session_start();

// 1. GÜVENLİK: Giriş yapmayan kullanıcıyı login'e fırlat
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

// 2. FİLTRELİ SORGU: Sadece BU kullanıcıya ait araçları çek
$arac_sorgu = $db->prepare("SELECT * FROM araclar WHERE kullanici_id = ? ORDER BY id DESC");
$arac_sorgu->execute([$user_id]);
$araclar = $arac_sorgu->fetchAll(PDO::FETCH_ASSOC);

// URL'den gelen secili_arac ID'sini yakala
$secili_arac_id = isset($_GET['secili_arac']) ? (int)$_GET['secili_arac'] : 0;
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>SmartGaraj - Bakım Ekle</title>
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
        body { background-color: var(--bg-main); color: var(--text-main); font-family: 'Segoe UI', sans-serif; transition: 0.3s; padding-bottom: 400px; }
        
        .navbar { background-color: var(--card-bg) !important; border-bottom: 2px solid var(--accent-color); transition: 0.3s; margin-bottom: 30px;}
        .navbar-brand { color: var(--accent-color) !important; font-weight: 800; z-index: 1051; position: relative;}
        .nav-btn { border: 1px solid var(--accent-color); color: var(--accent-color); background: transparent; transition: 0.3s; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; height: 40px; }
        .nav-btn:hover, .nav-btn.active { background-color: var(--accent-color); color: #fff; }
        .profile-btn { cursor: pointer; transition: 0.3s; background: transparent; border: none; text-align: left; }
        .profile-btn:hover { opacity: 0.8; }
        .u-name { color: var(--text-main) !important; font-weight: 700; }
        .u-title { color: var(--text-muted) !important; font-size: 0.75rem; }

        .garaj-card, .form-card { background-color: var(--card-bg) !important; border: 1px solid var(--border-color) !important; border-radius: 12px; color: var(--text-main) !important; padding: 2.5rem; margin-bottom: 5rem; }
        
        .form-label { color: var(--text-main) !important; opacity: 0.8; margin-bottom: 8px; }
        .form-control { background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; color: var(--text-main) !important; border-radius: 8px; padding: 12px 15px !important; width: 100%; }
        .form-control:focus { border-color: var(--accent-color) !important; box-shadow: none; color: var(--text-main) !important;}
        .form-control::placeholder { color: var(--text-muted) !important; opacity: 0.7; }
        
        .custom-select-box { background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; color: var(--text-main) !important; border-radius: 8px; padding: 12px 40px 12px 15px !important; width: 100%; appearance: none; cursor: pointer; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff8c00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") !important; background-repeat: no-repeat !important; background-position: right 15px center !important; background-size: 16px !important; }
        
        .custom-dropdown { position: relative; width: 100%; }
        .dropdown-trigger { 
            background-color: var(--input-bg) !important; border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; border-radius: 8px; padding: 12px 15px; width: 100%;
            text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: 0.3s;
        }
        .dropdown-trigger:hover { border-color: var(--accent-color) !important; }
        .dropdown-menu-custom { 
            position: absolute; top: 100%; left: 0; width: 100%; background: var(--card-bg); 
            border: 1px solid var(--accent-color); border-radius: 8px; margin-top: 5px; 
            max-height: 350px; overflow-y: auto; z-index: 2000; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .dropdown-menu-custom.show { display: block; animation: slideDown 0.2s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        .dropdown-group-title { padding: 10px 15px; color: var(--accent-color); font-weight: 800; font-size: 0.75rem; text-transform: uppercase; background: rgba(255,140,0,0.05); border-bottom: 1px solid rgba(255,140,0,0.1); }
        .dropdown-item-custom { padding: 10px 20px; color: var(--text-main); cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
        .dropdown-item-custom:hover { background-color: var(--accent-color); color: #000; font-weight: 600; }

        .modal-content { background-color: var(--card-bg) !important; border: 1px solid var(--accent-color) !important; color: var(--text-main) !important; }
        
        .btn-glow { background: linear-gradient(45deg, #ff8c00, #ffb347); color: #121212; font-weight: 700; border: none; transition: 0.3s;}
        .btn-glow:hover { transform: scale(1.02); box-shadow: 0 0 15px rgba(255, 140, 0, 0.5); }

        @media (max-width: 768px) {
            .container { padding-left: 10px !important; padding-right: 10px !important; }
            .garaj-card, .form-card, .login-card { padding: 1.5rem 1rem !important; border-radius: 8px !important; }
            .form-control, .custom-select-box, .dropdown-trigger { font-size: 1rem !important; padding: 12px 15px !important; }
        }
    </style>
</head>
<body>
<nav class="navbar navbar-dark d-lg-none" style="background-color: #1a1a1d; border-bottom: 1px solid #ff9800; padding: 10px 20px;">
  <a class="navbar-brand text-warning fw-bold m-0" href="index.php" style="font-size: 1.2rem;">🛠️ SmartGaraj</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilMenu" style="border: none; box-shadow: none;">
    <span class="navbar-toggler-icon"></span>
  </button>
</nav>

<div class="offcanvas offcanvas-start" tabindex="-1" id="mobilMenu" style="background-color: #1a1a1d; border-right: 1px solid #ff9800; max-width: 280px;">
  <div class="offcanvas-header border-bottom border-warning border-opacity-25 align-items-center">
      <h5 class="offcanvas-title text-warning fw-bold m-0 fs-5">🛠️ SmartGaraj</h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body d-flex flex-column px-3 pt-3">
    <button class="bg-transparent border-0 text-start d-flex align-items-center p-0 mb-4 w-100" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#profileModal">
        <i class="bi bi-person-circle fs-1 text-warning"></i>
        <div class="ms-3">
            <span class="d-block text-muted" style="font-size: 0.8rem;">Hesap Bilgileri</span>
            <strong class="text-white text-nowrap"><?php echo $_SESSION['user_name']; ?></strong>
        </div>
    </button>
    <ul class="nav flex-column gap-2 mb-auto">
      <li class="nav-item"><a class="nav-link text-white p-3 rounded" href="index.php" style="border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-house text-warning me-2"></i> Ana Sayfa</a></li>
      <li class="nav-item"><a class="nav-link text-white p-3 rounded" href="araclar.php" style="border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-car-front text-warning me-2"></i> Araçlar</a></li>
      <li class="nav-item"><a class="nav-link text-white p-3 rounded" href="arac_ekle.php" style="border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-plus-circle text-warning me-2"></i> Araç Ekle</a></li>
      <li class="nav-item"><a class="nav-link text-white p-3 rounded" href="bakim_ekle.php" style="border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-wrench-adjustable text-warning me-2"></i> Bakım Ekle</a></li>
    </ul>
    <div class="mt-4"><a href="islem.php?islem=cikis" class="btn btn-outline-danger w-100 p-2"><i class="bi bi-box-arrow-right me-2"></i> Çıkış</a></div>
  </div>
</div>

<nav class="navbar navbar-expand-lg navbar-dark py-3 d-none d-lg-flex">
    <div class="container">
        <a class="navbar-brand fw-bold" href="index.php"><i class="bi bi-tools me-2 text-warning"></i>SmartGaraj</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobilMenu" style="border-color: #ff9800; filter: invert(1) grayscale(100%) brightness(200%) sepia(100%) hue-rotate(0deg) saturate(500%);">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="mobilMenu">
            <div class="d-flex flex-column flex-lg-row gap-3 align-items-center mt-3 mt-lg-0">
                <button class="profile-btn d-flex align-items-center gap-2 me-lg-2 bg-transparent border-0 text-light" data-bs-toggle="modal" data-bs-target="#profileModal">
                    <i class="bi bi-person-circle fs-3 text-warning"></i>
                    <span class="d-flex flex-column text-start">
                        <span class="u-title lh-1" style="font-size: 0.8rem; color: #aaa;">Hesap Bilgileri</span>
                        <span class="u-name lh-1 text-nowrap"><?php echo $_SESSION['user_name']; ?></span>
                    </span>
                </button>
                <button class="btn nav-btn btn-sm px-3 py-2" onclick="toggleTheme()" title="Tema Değiştir"><i id="theme-icon" class="bi bi-moon-stars-fill"></i></button>
                <a href="index.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-house me-1"></i>Ana Sayfa</a>
                <a href="araclar.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-list-ul me-1"></i>Araçlar</a>
                <a href="arac_ekle.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-plus-lg me-1"></i>Araç Ekle</a>
                <a href="bakim_ekle.php" class="btn nav-btn btn-sm px-3 py-2 w-100 w-lg-auto text-start text-lg-center"><i class="bi bi-wrench-adjustable me-1"></i>Bakım Ekle</a>
                <a href="islem.php?islem=cikis" class="btn btn-outline-danger btn-sm px-3 py-2 w-100 w-lg-auto" title="Çıkış Yap"><i class="bi bi-box-arrow-right"></i> Çıkış</a>
            </div>
        </div>
    </div>
</nav>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <div class="form-card mb-5">
                    <h4 class="mb-4 text-warning fw-bold"><i class="bi bi-wrench-adjustable me-2"></i>Bakım Kaydı Ekle</h4>
                    
                    <form action="islem.php?islem=bakim_ekle" method="POST" onsubmit="return formHazirla()">
                        
                        <div class="mb-4">
                            <label class="form-label text-warning fw-bold">İşlem Yapılacak Araç</label>
                            <!-- YENİ: onchange km kontrolünü tetikler -->
                            <select class="custom-select-box" name="arac_id" id="arac_id_select" required onchange="kmSiniriGuncelle()">
                                <option value="" disabled <?php echo ($secili_arac_id == 0) ? 'selected' : ''; ?>>Araç Seçiniz...</option>
                                <?php 
                                $arac_km_verileri = []; // JS için KM haritası
                                if($araclar): 
                                    foreach($araclar as $a): 
                                        $arac_km_verileri[$a['id']] = $a['guncel_km'];
                                ?>
                                    <option value="<?php echo $a['id']; ?>" <?php echo ($a['id'] == $secili_arac_id) ? 'selected' : ''; ?>>
                                        <?php echo $a['yil']." ".$a['marka']." ".$a['model']; ?> 
                                        <?php echo !empty($a['plaka']) ? " | " . strtoupper($a['plaka']) : ''; ?>
                                    </option>
                                <?php endforeach; endif; ?>
                            </select>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label opacity-75">İşlem Tarihi</label>
                                <!-- YENİ: Gelecek tarihler engellendi -->
                                <input type="date" class="form-control" name="bakim_tarihi" required max="<?php echo date('Y-m-d'); ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label opacity-75">İşlem KM</label>
                                <!-- YENİ: ID eklendi ve min 0 sınırı kondu -->
                                <input type="number" class="form-control" name="bakim_km" id="bakim_km_input" placeholder="Örn: 125000" required min="0">
                                <div id="km_hata_mesaji" class="text-danger small mt-1 d-none"></div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label opacity-75">İşlem Türü Kategorisi</label>
                            <div class="custom-dropdown" id="islemDropdown">
                                <div class="dropdown-trigger" onclick="toggleDropdown('islemMenu')">
                                    <span id="islemLabel">Kategori Seçiniz...</span>
                                    <i class="bi bi-chevron-down text-warning"></i>
                                </div>
                                <div class="dropdown-menu-custom" id="islemMenu">
                                    <div class="dropdown-group-title">PERİYODİK & SIVI BAKIMLARI</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Standart Periyodik Bakım (Yağ + Filtreler)')">Standart Periyodik Bakım (Yağ + Filtreler)</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Sadece Yağ ve Yağ Filtresi Değişimi')">Sadece Yağ ve Yağ Filtresi Değişimi</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Antifriz / Soğutma Sıvısı Yenileme')">Antifriz / Soğutma Sıvısı Yenileme</div>
                                    
                                    <div class="dropdown-group-title">MOTOR & MEKANİK (AĞIR BAKIM)</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Ağır Bakım (Triger Seti / Zincir Değişimi)')">Ağır Bakım (Triger Seti / Zincir Değişimi)</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'V Kayışı / Gergi Rulmanı Değişimi')">V Kayışı / Gergi Rulmanı Değişimi</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Silindir Kapak Contası / Motor Revizyonu')">Silindir Kapak Contası / Motor Revizyonu</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Turbo Revizyonu / Değişimi')">Turbo Revizyonu / Değişimi</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Enjektör / Yakıt Pompası Revizyonu')">Enjektör / Yakıt Pompası Revizyonu</div>
                                    
                                    <div class="dropdown-group-title">FREN & YÜRÜYEN AKSAM</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Fren Balatası Değişimi (Ön/Arka)')">Fren Balatası Değişimi (Ön/Arka)</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Fren Diski Değişimi / Torna İşlemi')">Fren Diski Değişimi / Torna İşlemi</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Alt Takım (Rotil, Salıncak, Z Rot) Yenileme')">Alt Takım (Rotil, Salıncak, Z Rot) Yenileme</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Amortisör / Helezon Yay Değişimi')">Amortisör / Helezon Yay Değişimi</div>
                                    
                                    <div class="dropdown-group-title">AKTARMA, ELEKTRİK & İKLİMLENDİRME</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Baskı Balata (Debriyaj Seti) Değişimi')">Baskı Balata (Debriyaj Seti) Değişimi</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Buji / Ateşleme Bobini Değişimi')">Buji / Ateşleme Bobini Değişimi</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Akü / Şarj Dinamosu İşlemleri')">Akü / Şarj Dinamosu İşlemleri</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'Klima Gazı / Radyatör İşlemleri')">Klima Gazı / Radyatör İşlemleri</div>
                                    
                                    <div class="dropdown-group-title">DİĞER ÖZEL İŞLEMLER</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('islem', 'diger')">Farklı Bir İşlem Gireceğim</div>
                                </div>
                            </div>
                            <input type="hidden" name="bakim_turu" id="realIslemInput" required>
                            <input type="text" class="form-control mt-3 d-none" id="islem_diger_input" name="bakim_turu_diger" placeholder="Örn: Kaporta boya, Göçük düzeltme, Aksesuar montajı...">
                        </div>

                        <div class="mb-4">
                            <label class="form-label opacity-75">Kullanılan Parça Markası <span class="small text-muted">(Opsiyonel)</span></label>
                            <div class="custom-dropdown" id="markaDropdown">
                                <div class="dropdown-trigger" onclick="toggleDropdown('markaMenu')">
                                    <span id="markaLabel">Belirtilmedi / Orijinal (OEM)</span>
                                    <i class="bi bi-chevron-down text-warning"></i>
                                </div>
                                <div class="dropdown-menu-custom" id="markaMenu">
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Belirtilmedi / OEM')">Belirtilmedi / Orijinal (OEM)</div>
                                    <div class="dropdown-group-title">SIVI VE YAĞ GRUBU</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Liqui Moly')">Liqui Moly</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Motul')">Motul</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Castrol')">Castrol</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Mobil 1')">Mobil 1</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Shell')">Shell</div>
                                    <div class="dropdown-group-title">MEKANİK & DEBRİYAJ & TRİGER</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Sachs')">Sachs</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'LuK')">LuK</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Valeo')">Valeo</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'INA')">INA</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Gates')">Gates</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'SKF')">SKF</div>
                                    <div class="dropdown-group-title">ELEKTRONİK, SENSÖR & FİLTRE</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Bosch')">Bosch</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Delphi')">Delphi</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Mann Filter')">Mann Filter</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Mahle')">Mahle</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Varta / Mutlu (Akü)')">Varta / Mutlu (Akü)</div>
                                    <div class="dropdown-group-title">OEM MARKALAR & DİĞER</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Motorcraft (Ford OEM)')">Motorcraft (Ford OEM)</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Mais (Renault OEM)')">Mais (Renault OEM)</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'PSA Orijinal')">PSA Orijinal</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Inwells')">Inwells</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'Goodyear / Michelin')">Goodyear / Michelin</div>
                                    <div class="dropdown-group-title">FARKLI MARKA GİRİŞİ</div>
                                    <div class="dropdown-item-custom" onclick="selectItem('marka', 'diger')">Farklı Marka Yazacağım</div>
                                </div>
                            </div>
                            <input type="hidden" id="realMarkaInput" value="Belirtilmedi / OEM">
                            <input type="text" class="form-control mt-3 d-none" id="marka_diger_input" placeholder="Örn: Ustanın kendi getirdiği muadil parça markası...">
                        </div>

                        <div class="mb-4">
                            <label class="form-label opacity-75 text-warning fw-bold">Toplam Maliyet (TL)</label>
                            <input type="number" step="0.01" class="form-control fw-bold" name="bakim_maliyet" placeholder="Örn: 4500" required min="0">
                        </div>
                        
                        <button type="submit" class="btn btn-glow w-100 py-2 fs-5" id="garajaKaydetBtn">Garaja Kaydet</button>
                        <a href="index.php" class="btn btn-outline-secondary w-100 mt-2">İptal ve Geri Dön</a>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // PHP'den gelen KM verilerini JS objesine çeviriyoruz
        const aracKMVerileri = <?php echo json_encode($arac_km_verileri); ?>;

        function kmSiniriGuncelle() {
            const select = document.getElementById('arac_id_select');
            const kmInput = document.getElementById('bakim_km_input');
            const hataMesaji = document.getElementById('km_hata_mesaji');
            const btn = document.getElementById('garajaKaydetBtn');
            
            const secilenID = select.value;
            if(secilenID && aracKMVerileri[secilenID]) {
                const maxKM = parseInt(aracKMVerileri[secilenID]);
                kmInput.placeholder = "Max: " + maxKM + " KM";
                
                // Anlık kontrol fonksiyonu
                kmInput.oninput = function() {
                    const girilenKM = parseInt(this.value);
                    if(girilenKM > maxKM) {
                        hataMesaji.innerText = "⚠️ İşlem KM'si aracın güncel kilometresinden (" + maxKM + ") fazla olamaz.";
                        hataMesaji.classList.remove('d-none');
                        btn.disabled = true; // Butonu kilitle
                        this.classList.add('is-invalid');
                    } else {
                        hataMesaji.classList.add('d-none');
                        btn.disabled = false; // Kilidi aç
                        this.classList.remove('is-invalid');
                    }
                };
                // Tetikle
                kmInput.oninput();
            }
        }

        // Sayfa yüklendiğinde (örn URL'den araç seçili geldiyse) çalıştır
        window.addEventListener('DOMContentLoaded', kmSiniriGuncelle);

        function toggleTheme() {
            const body = document.body;
            const isLight = body.classList.contains('light-mode');
            if (isLight) { body.classList.remove('light-mode'); localStorage.setItem('theme', 'dark'); } 
            else { body.classList.add('light-mode'); localStorage.setItem('theme', 'light'); }
            updateThemeIcons();
        }

        function updateThemeIcons() {
            const isLight = document.body.classList.contains('light-mode');
            const icons = document.querySelectorAll('.bi-moon-stars-fill, .bi-sun-fill');
            icons.forEach(icon => {
                if (isLight) { icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill'); } 
                else { icon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill'); }
            });
        }

        function toggleDropdown(id) {
            document.querySelectorAll('.dropdown-menu-custom').forEach(menu => {
                if(menu.id !== id) menu.classList.remove('show');
            });
            document.getElementById(id).classList.toggle('show');
        }

        function selectItem(type, value) {
            if(type === 'islem') {
                document.getElementById('islemLabel').innerText = (value === 'diger') ? 'Farklı Bir İşlem' : value;
                document.getElementById('realIslemInput').value = value;
                document.getElementById('islemMenu').classList.remove('show');
                const diger = document.getElementById('islem_diger_input');
                if(value === 'diger') { diger.classList.remove('d-none'); diger.setAttribute('required', 'required'); diger.focus(); }
                else { diger.classList.add('d-none'); diger.removeAttribute('required'); }
            } else if(type === 'marka') {
                document.getElementById('markaLabel').innerText = (value === 'diger') ? 'Özel Marka' : value;
                document.getElementById('realMarkaInput').value = value;
                document.getElementById('markaMenu').classList.remove('show');
                const digerMarka = document.getElementById('marka_diger_input');
                if(value === 'diger') { digerMarka.classList.remove('d-none'); digerMarka.focus(); }
                else { digerMarka.classList.add('d-none'); }
            }
        }

        window.onclick = function(event) {
            if (!event.target.closest('.custom-dropdown')) {
                document.querySelectorAll('.dropdown-menu-custom').forEach(menu => menu.classList.remove('show'));
            }
        }

        function formHazirla() {
            let islem = document.getElementById('realIslemInput').value;
            let islemDiger = document.getElementById('islem_diger_input').value;
            let marka = document.getElementById('realMarkaInput').value;
            let markaDiger = document.getElementById('marka_diger_input').value;

            if (!islem) { alert("Lütfen bir işlem türü seçiniz!"); return false; }

            let finalIslem = (islem === 'diger') ? islemDiger : islem;
            let finalMarka = (marka === 'diger') ? markaDiger : marka;

            if (finalMarka !== "Belirtilmedi / OEM" && finalMarka.trim() !== "") {
                finalIslem += " (Parça: " + finalMarka + ")";
            }

            document.getElementById('realIslemInput').value = "diger";
            let digerInputBox = document.getElementById('islem_diger_input');
            digerInputBox.value = finalIslem;
            digerInputBox.classList.remove("d-none");

            return true;
        }
    </script>
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
</body>
</html>