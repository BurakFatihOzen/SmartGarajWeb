<?php
session_start();
// Zaten giriş yapmışsa direkt ana sayfaya at
if(isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartGaraj - Giriş</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --bg-main: #121212; --card-bg: #1e1e24; --text-main: #ffffff; 
            --text-muted: #8a8a93; --border-color: #333338; 
            --accent-color: #ff8c00; --input-bg: #2a2a32;
        }
        
        body.light-mode {
            --bg-main: #f4f7f6; --card-bg: #ffffff; --text-main: #1a1a20; 
            --text-muted: #6c757d; --border-color: #dee2e6; --input-bg: #f8f9fa;
        }

        body { 
            background-color: var(--bg-main); 
            color: var(--text-main); 
            font-family: 'Segoe UI', sans-serif; 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            margin: 0; 
            padding: 20px;
            /* Arka plana çok hafif turuncu bir aydınlatma efekti (glow) */
            background-image: radial-gradient(circle at 50% 0%, rgba(255,140,0,0.1), var(--bg-main) 60%);
            transition: 0.3s;
        }
        
        /* Tema Butonu Tasarımı */
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
        .nav-btn:hover { background-color: var(--accent-color); color: #fff; }

        .login-card { 
            background-color: var(--card-bg); 
            border: 1px solid var(--border-color); 
            border-radius: 16px; 
            padding: 3rem; 
            width: 100%; 
            max-width: 420px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            transition: 0.3s;
        }

        .brand-subtitle {
            color: var(--text-muted); 
            font-size: 0.9rem; 
            letter-spacing: 1px;
            margin-top: 5px;
        }

        /* Sekmeler (Giriş / Kayıt) Tasarımı */
        .nav-pills {
            background-color: var(--input-bg);
            border-radius: 10px;
            padding: 5px;
            margin-bottom: 2rem;
            transition: 0.3s;
        }
        .nav-pills .nav-link {
            color: var(--text-muted);
            border-radius: 8px;
            padding: 10px;
            font-weight: 600;
            transition: 0.3s;
        }
        .nav-pills .nav-link:hover { color: var(--text-main); }
        .nav-pills .nav-link.active {
            background-color: var(--accent-color);
            color: #121212;
            box-shadow: 0 4px 10px rgba(255, 140, 0, 0.3);
        }

        /* Form Elemanları */
        .form-label { color: var(--text-main); opacity: 0.9; margin-bottom: 6px; font-size: 0.9rem;}
        .form-control { 
            background-color: var(--input-bg) !important; 
            border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; 
            border-radius: 8px; 
            padding: 12px 15px !important; 
            transition: 0.3s;
        }
        .form-control:focus { 
            border-color: var(--accent-color) !important; 
            box-shadow: 0 0 0 3px rgba(255,140,0,0.1) !important; 
            color: var(--text-main) !important;
        }
        .form-control::placeholder { color: var(--text-muted) !important; opacity: 0.5; }

        .btn-glow { 
            background: linear-gradient(45deg, #ff8c00, #ffb347); 
            color: #121212; 
            font-weight: 800; 
            border: none; 
            transition: 0.3s; 
            padding: 14px; 
            border-radius: 8px;
            letter-spacing: 0.5px;
        }
        .btn-glow:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(255, 140, 0, 0.4); 
        }

        .alert-custom { 
            background-color: rgba(220, 53, 69, 0.1); 
            color: #ff6b6b; 
            border: 1px solid rgba(220, 53, 69, 0.3); 
            border-radius: 8px;
        }
        .alert-success-custom {
            background-color: rgba(25, 135, 84, 0.1); 
            color: #47d18a; 
            border: 1px solid rgba(25, 135, 84, 0.3); 
            border-radius: 8px;
        }
        /* Telefonda giriş kutusunun iç boşluğunu biraz daraltarak ferahlatır */
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

    <button class="btn nav-btn btn-sm position-absolute top-0 end-0 m-4 px-3 py-2" onclick="toggleTheme()" title="Tema Değiştir">
        <i id="theme-icon" class="bi bi-moon-stars-fill"></i>
    </button>

    <div class="login-card text-center">
        <div class="mb-4">
            <h2 class="fw-bold mb-0" style="color: var(--accent-color);">
                <i class="bi bi-tools me-2"></i>SmartGaraj
            </h2>
            <div class="brand-subtitle">Dijital Garaj Yönetim Asistanı</div>
        </div>

        <?php if(isset($_GET['durum'])): ?>
            <?php if($_GET['durum'] == "hata"): ?>
                <div class="alert alert-custom small py-2 mb-4"><i class="bi bi-exclamation-triangle me-1"></i> Bilgiler hatalı veya eksik.</div>
            <?php elseif($_GET['durum'] == "kayitok"): ?>
                <div class="alert alert-success-custom small py-2 mb-4"><i class="bi bi-check-circle me-1"></i> Kayıt başarılı! Giriş yapabilirsiniz.</div>
            <?php elseif($_GET['durum'] == "mukerrer"): ?>
                <div class="alert alert-custom small py-2 mb-4"><i class="bi bi-shield-x me-1"></i> Bu e-posta adresi sistemde zaten kayıtlı! Lütfen giriş yapın.</div>
            <?php elseif($_GET['durum'] == "gecersiz_email"): ?>
                <div class="alert alert-custom small py-2 mb-4"><i class="bi bi-envelope-x me-1"></i> Lütfen geçerli bir e-posta adresi formatı girin!</div>
            <?php endif; ?>
        <?php endif; ?>

        <ul class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="pills-login-tab" data-bs-toggle="pill" data-bs-target="#pills-login" type="button" role="tab">Giriş Yap</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="pills-register-tab" data-bs-toggle="pill" data-bs-target="#pills-register" type="button" role="tab">Kayıt Ol</button>
            </li>
        </ul>

        <div class="tab-content text-start" id="pills-tabContent">
            
            <div class="tab-pane fade show active" id="pills-login" role="tabpanel">
                <form action="islem.php?islem=giris" method="POST">
                    <div class="mb-3">
                        <label class="form-label">E-Posta Adresi</label>
                        <input type="email" name="email" class="form-control" placeholder="ornek@mail.com" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Şifre</label>
                        <input type="password" name="sifre" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-glow w-100"><i class="bi bi-shield-lock me-2"></i>Güvenli Giriş</button>
                </form>
            </div>

            <div class="tab-pane fade" id="pills-register" role="tabpanel">
                <form action="islem.php?islem=kayit" method="POST">
                    <div class="mb-3">
                        <label class="form-label">Ad Soyad</label>
                        <input type="text" name="ad_soyad" class="form-control" placeholder="Adınız Soyadınız" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">E-Posta Adresi</label>
                        <input type="email" name="email" class="form-control" placeholder="ornek@mail.com" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Şifre Belirleyin</label>
                        <input type="password" name="sifre" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-glow w-100"><i class="bi bi-person-plus me-2"></i>Hesap Oluştur</button>
                </form>
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
    </script>
</body>
</html>