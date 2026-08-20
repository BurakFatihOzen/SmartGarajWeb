<?php 
session_start();

// 1. Güvenlik Kontrolü
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

// 2. Filtreli Sorgu: Sadece bu kullanıcıya ait araçları getir
$sorgu = $db->prepare("SELECT * FROM araclar WHERE kullanici_id = ? ORDER BY id DESC");
$sorgu->execute([$user_id]);
$araclar = $sorgu->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>SmartGaraj - Araç Listesi</title>
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
            white-space: nowrap; 
            display: inline-flex; 
            align-items: center; 
            justify-content: center;
            height: 40px; 
        }
        .nav-btn:hover, .nav-btn.active { background-color: var(--accent-color); color: #fff; }
        .profile-btn { cursor: pointer; transition: 0.3s; background: transparent; border: none; text-align: left; }
        .profile-btn:hover { opacity: 0.8; }
        .u-name { color: var(--text-main) !important; font-weight: 700; }
        .u-title { color: var(--text-muted) !important; font-size: 0.75rem; }

        /* KARTLAR VE MODALLAR */
        .garaj-card, .form-card, .modal-content { background-color: var(--card-bg) !important; border: 1px solid var(--border-color) !important; border-radius: 12px; color: var(--text-main) !important; padding: 2.5rem; }
        .modal-content { padding: 0; border: 1px solid var(--accent-color) !important; } /* Modal için özel ayar */
        
        /* --- YENİ PROFESYONEL TABLO TASARIMI --- */
        .table-custom-container { 
            background-color: var(--card-bg) !important; 
            border: 1px solid var(--border-color) !important; 
            border-radius: 12px; 
            padding: 1.5rem; /* Tabloyu kenarlardan uzaklaştırır */
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .table { --bs-table-bg: transparent !important; --bs-table-color: var(--text-main) !important; margin-bottom: 0;}
        
        /* Başlıklar daha havadar ve okunaklı */
        .table th { 
            background-color: transparent !important; 
            color: var(--text-muted) !important; 
            border-bottom: 2px solid var(--border-color) !important; 
            padding: 1rem 1.5rem !important; 
            font-size: 0.85rem; 
            text-transform: uppercase; 
            letter-spacing: 0.5px;
        }
        
        /* Hücreler arası boşluk artırıldı */
        .table td { 
            background-color: transparent !important; 
            color: var(--text-main) !important; 
            border-bottom: 1px solid var(--border-color) !important; 
            vertical-align: middle; 
            padding: 1.2rem 1.5rem !important; 
        }

        /* Hover (Üzerine Gelme) Efekti */
        .table-hover tbody tr { transition: background-color 0.2s ease; }
        .table-hover tbody tr:hover td { background-color: rgba(255, 140, 0, 0.05) !important; }

        /* --- PLAKA ROZETİ (BADGE) --- */
        /* --- PLAKA ROZETİ (BADGE) --- */
        .badge-plaka {
            background-color: rgba(255, 140, 0, 0.15);
            color: var(--accent-color);
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: 700;
            border: 1px solid rgba(255, 140, 0, 0.3);
            font-family: monospace;
            font-size: 1rem;
            letter-spacing: 1px;
            display: inline-block;
            white-space: nowrap; /* BÜYÜK KAHRAMAN BU SATIR: Asla alt satıra inmez */
        }
        /* --- PARLAYAN YENİ ARAÇ BUTONU --- */
        .btn-glow { 
            background: linear-gradient(45deg, #ff8c00, #ffb347) !important; 
            color: #121212 !important; 
            font-weight: 700; 
            border: none; 
            transition: 0.3s;
        }
        .btn-glow:hover { 
            transform: scale(1.02); 
            box-shadow: 0 0 15px rgba(255, 140, 0, 0.5); 
            color: #000 !important;
        }

        /* --- MODERN ACTION BUTONLARI (SOFT UI) --- */
        .btn-action { 
            width: 38px; height: 38px; 
            display: inline-flex; align-items: center; justify-content: center; 
            border-radius: 8px; transition: 0.3s; text-decoration: none; font-size: 1.1rem;
        }
        .btn-view { background-color: rgba(13, 110, 253, 0.1); color: #0d6efd; }
        .btn-view:hover { background-color: #0d6efd; color: white; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(13, 110, 253, 0.2);}
        
        .btn-delete { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; }
        .btn-delete:hover { background-color: #dc3545; color: white; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);}

        /* MOBİL EKRANLAR İÇİN KESİN ÇÖZÜM */
        @media (max-width: 768px) {
            .container { padding-left: 10px !important; padding-right: 10px !important; }
            .table-custom-container { padding: 0.5rem !important; border-radius: 8px !important; }
            .table th, .table td { padding: 1rem !important; font-size: 0.9rem !important; white-space: nowrap !important; }
        }
    </style>
</head>
<body>

<!-- SADECE TELEFONDA GÖRÜNEN ÜST BAR -->
<nav class="navbar d-lg-none d-flex justify-content-between align-items-center" style="background-color: var(--card-bg) !important; border-bottom: 2px solid var(--accent-color); padding: 10px 20px; position: sticky; top: 0; z-index: 1050;">
  <a class="navbar-brand fw-bold m-0" href="index.php" style="font-size: 1.2rem; color: var(--accent-color);"><i class="bi bi-tools me-2"></i>SmartGaraj</a>
  
  <div class="d-flex align-items-center gap-3">
      <button class="btn nav-btn btn-sm d-flex align-items-center justify-content-center" onclick="toggleTheme()" title="Tema Değiştir" style="height: 35px; width: 35px; padding: 0;">
          <i class="bi bi-moon-stars-fill theme-icon-class"></i>
      </button>
      <button class="navbar-toggler p-0 border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilMenu" style="box-shadow: none;">
        <i class="bi bi-list text-warning" style="font-size: 2.2rem;"></i>
      </button>
  </div>
</nav>

<!-- SOLDAN KAYARAK AÇILAN PROFESYONEL MENÜ (OFFCANVAS) -->
<div class="offcanvas offcanvas-start" tabindex="-1" id="mobilMenu" style="background-color: var(--bg-main); border-right: 2px solid var(--accent-color); max-width: 280px;">
  <div class="offcanvas-header border-bottom border-secondary border-opacity-25 align-items-center justify-content-between">
      <a class="offcanvas-title fw-bold m-0 fs-5 text-decoration-none" href="index.php" style="color: var(--accent-color);">🛠️ SmartGaraj</a>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" style="background-color: var(--input-bg);"></button>
  </div>
  <div class="offcanvas-body d-flex flex-column px-3 pt-4">
    <button class="bg-transparent border-0 text-start d-flex align-items-center p-0 mb-4 w-100" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#profileModal">
        <i class="bi bi-person-circle fs-1 text-warning"></i>
        <div class="ms-3">
            <span class="d-block" style="font-size: 0.8rem; color: var(--text-muted);">Hesap Bilgileri</span>
            <strong class="text-nowrap" style="color: var(--text-main);"><?php echo $_SESSION['user_name']; ?></strong>
        </div>
    </button>
    <ul class="nav flex-column gap-2 mb-auto">
      <li class="nav-item"><a class="nav-link p-3 rounded d-flex align-items-center" href="index.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-house text-warning me-3 fs-5"></i> Ana Sayfa</a></li>
      <li class="nav-item"><a class="nav-link p-3 rounded d-flex align-items-center" href="araclar.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-car-front text-warning me-3 fs-5"></i> Araçlar</a></li>
      <li class="nav-item"><a class="nav-link p-3 rounded d-flex align-items-center" href="arac_ekle.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-plus-circle text-warning me-3 fs-5"></i> Araç Ekle</a></li>
      <li class="nav-item"><a class="nav-link p-3 rounded d-flex align-items-center" href="bakim_ekle.php" style="color: var(--text-main); border: 1px solid rgba(255,152,0,0.3);"><i class="bi bi-wrench-adjustable text-warning me-3 fs-5"></i> Bakım Ekle</a></li>
    </ul>
    <div class="mt-4"><a href="islem.php?islem=cikis" class="btn btn-outline-danger w-100 p-2"><i class="bi bi-box-arrow-right me-2"></i> Çıkış</a></div>
  </div>
</div>

<!-- EKSİK OLAN MASAÜSTÜ MENÜSÜ EKLENDİ -->
<nav class="navbar navbar-expand-lg navbar-dark py-3 d-none d-lg-flex">
    <div class="container">
        <a class="navbar-brand fw-bold" href="index.php"><i class="bi bi-tools me-2 text-warning"></i>SmartGaraj</a>
        <div class="collapse navbar-collapse justify-content-end" id="mobilMenuDesktop">
            <div class="d-flex align-items-center gap-3">
                <button class="profile-btn d-flex align-items-center gap-2 me-lg-2 bg-transparent border-0 text-light" data-bs-toggle="modal" data-bs-target="#profileModal">
                    <i class="bi bi-person-circle fs-3 text-warning"></i>
                    <span class="d-flex flex-column text-start">
                        <span class="u-title lh-1" style="font-size: 0.8rem; color: #aaa;">Hesap Bilgileri</span>
                        <span class="u-name lh-1 text-nowrap"><?php echo $_SESSION['user_name']; ?></span>
                    </span>
                </button>
                <button class="btn nav-btn btn-sm px-3 py-2" onclick="toggleTheme()" title="Tema Değiştir">
                    <i id="theme-icon" class="bi bi-moon-stars-fill theme-icon-class"></i>
                </button>
                <a href="index.php" class="btn nav-btn btn-sm px-3 py-2"><i class="bi bi-house me-1"></i>Ana Sayfa</a>
                <a href="araclar.php" class="btn nav-btn btn-sm px-3 py-2 active"><i class="bi bi-list-ul me-1"></i>Araçlar</a>
                <a href="arac_ekle.php" class="btn nav-btn btn-sm px-3 py-2"><i class="bi bi-plus-lg me-1"></i>Araç Ekle</a>
                <a href="bakim_ekle.php" class="btn nav-btn btn-sm px-3 py-2"><i class="bi bi-wrench-adjustable me-1"></i>Bakım Ekle</a>
                <a href="islem.php?islem=cikis" class="btn btn-outline-danger btn-sm px-3 py-2" title="Çıkış Yap"><i class="bi bi-box-arrow-right"></i> Çıkış</a>
            </div>
        </div>
    </div>
</nav>

    <div class="container my-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold m-0"><i class="bi bi-car-front-fill me-2 text-warning"></i>Garajdaki Araçlar</h3>
            <a href="arac_ekle.php" class="btn btn-glow px-4 py-2" style="font-size: 0.9rem;"><i class="bi bi-plus-lg me-2"></i>Yeni Araç</a>
        </div>

        <div class="table-custom-container">
            <div class="table-responsive">
                <!-- table-hover sınıfı eklendi -->
                <table class="table table-custom table-hover">
                    <thead>
                        <tr>
                            <th style="width: 160px;">Plaka</th>
                            <th>Araç Bilgisi</th>
                            <th>Detay / Motor</th>
                            <th>Kilometre</th>
                            <th class="text-end" style="width: 150px;">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if($araclar): foreach($araclar as $a): ?>
                        <tr>
                            <td>
                                <span class="badge-plaka">
                                    <?php echo !empty($a['plaka']) ? strtoupper($a['plaka']) : "PLAKASIZ"; ?>
                                </span>
                            </td>
                            <td>
                                <div class="fw-bold fs-5"><?php echo $a['marka']; ?></div>
                                <div class="opacity-50 small mt-1"><?php echo $a['yil'] . " " . $a['model']; ?></div>
                            </td>
                            <td>
                                <div class="small text-warning fw-bold"><i class="bi bi-cpu me-1"></i><?php echo !empty($a['motor']) ? $a['motor'] : "Motor Belirtilmedi"; ?></div>
                            </td>
                            <td>
                                <div class="fw-bold"><i class="bi bi-speedometer2 me-1 opacity-75"></i><?php echo number_format($a['guncel_km'], 0, ',', '.'); ?> KM</div>
                            </td>
                            <td class="text-end">
                                <div class="d-flex justify-content-end gap-2">
                                    <a href="index.php?secili_arac=<?php echo $a['id']; ?>" class="btn-action btn-view" title="Analiz ve Detay">
                                        <i class="bi bi-eye-fill"></i>
                                    </a>
                                    <a href="islem.php?islem=arac_sil&id=<?php echo $a['id']; ?>" 
                                       class="btn-action btn-delete" 
                                       onclick="return confirm('Bu aracı ve TÜM BAKIM geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!');" 
                                       title="Garajdan Sil">
                                        <i class="bi bi-trash3-fill"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; else: ?>
                        <tr>
                            <td colspan="5" class="text-center py-5">
                                <div class="opacity-50 mb-3"><i class="bi bi-inboxes" style="font-size: 3rem;"></i></div>
                                <h5 class="fw-bold">Garajınız şu an boş</h5>
                                <p class="small">Araç ekleyerek maliyet ve bakım takibine başlayın.</p>
                            </td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- HESAP AYARLARI MODALI -->
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

        window.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('theme') === 'light') { 
                document.body.classList.add('light-mode'); 
            }
            updateThemeIcons();
        });
    </script>
</body>
</html>