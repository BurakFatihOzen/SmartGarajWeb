<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'SmartGaraj - Akıllı Araç & Bakım Takip')</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
    
    <!-- Bootstrap 5 & Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg-main: #0c0d12;
            --card-bg: #14161f;
            --card-hover: #1b1d28;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border-color: #262938;
            --accent-color: #f59e0b;
            --accent-hover: #d97706;
            --accent-glow: rgba(245, 158, 11, 0.25);
            --danger-glow: rgba(239, 68, 68, 0.2);
            --success-glow: rgba(16, 185, 129, 0.2);
            --input-bg: #191b26;
        }

        body {
            background-color: var(--bg-main);
            color: var(--text-main);
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Navbar */
        .navbar-custom {
            background-color: rgba(20, 22, 31, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .brand-logo {
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--text-main);
            text-decoration: none;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .brand-logo i {
            color: var(--accent-color);
            filter: drop-shadow(0 0 8px var(--accent-glow));
        }

        .nav-btn {
            background-color: transparent;
            color: var(--text-muted);
            border: 1px solid transparent;
            padding: 7px 14px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.875rem;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .nav-btn:hover, .nav-btn.active {
            color: var(--text-main);
            background-color: rgba(255, 255, 255, 0.05);
            border-color: var(--border-color);
        }

        .nav-btn-primary {
            background: linear-gradient(135deg, var(--accent-color), #ea580c);
            color: #000 !important;
            font-weight: 700;
            border: none;
            box-shadow: 0 4px 14px var(--accent-glow);
        }

        .nav-btn-primary:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        /* Cards */
        .card-custom {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 24px;
            transition: all 0.25s ease;
        }

        .card-custom:hover {
            border-color: rgba(245, 158, 11, 0.4);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .stat-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }

        .stat-label {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 800;
            color: var(--text-main);
            margin-top: 8px;
            letter-spacing: -0.5px;
        }

        /* Buttons */
        .btn-glow {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #000;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            padding: 10px 20px;
            box-shadow: 0 4px 18px var(--accent-glow);
            transition: all 0.2s ease;
        }

        .btn-glow:hover {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000;
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(245, 158, 11, 0.4);
        }

        .btn-outline-custom {
            background-color: transparent;
            color: var(--text-main);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 10px 18px;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .btn-outline-custom:hover {
            background-color: rgba(255, 255, 255, 0.06);
            border-color: var(--text-muted);
            color: #fff;
        }

        /* Table */
        .table-custom-container {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            overflow: hidden;
        }

        .table-custom {
            margin-bottom: 0;
            color: var(--text-main);
            border-color: var(--border-color);
        }

        .table-custom thead th {
            background-color: rgba(255, 255, 255, 0.02);
            color: var(--text-muted);
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color);
        }

        .table-custom tbody td {
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            font-size: 0.95rem;
            background-color: transparent;
        }

        .table-custom tbody tr:hover td {
            background-color: rgba(255, 255, 255, 0.03);
        }

        /* Modals */
        .modal-content {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            color: var(--text-main);
        }

        .form-control, .form-select {
            background-color: var(--input-bg);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            border-radius: 12px;
            padding: 12px 16px;
        }

        .form-control:focus, .form-select:focus {
            background-color: var(--input-bg);
            border-color: var(--accent-color);
            color: var(--text-main);
            box-shadow: 0 0 0 3px var(--accent-glow);
        }

        /* Badges */
        .badge-plate {
            background-color: #ffc107;
            color: #000;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 4px 10px;
            border-radius: 6px;
            border: 2px solid #000;
            display: inline-block;
        }

        .badge-status-box {
            padding: 10px 14px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.875rem;
            font-weight: 600;
        }
    </style>
    @yield('styles')
</head>
<body>

    <!-- ÜST NAVBAR -->
    <nav class="navbar-custom py-3">
        <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
            <!-- Logo -->
            <a href="{{ route('dashboard') }}" class="brand-logo">
                <i class="bi bi-tools"></i>
                <span>SmartGaraj</span>
                <span class="badge bg-warning text-dark px-2 py-1 ms-1" style="font-size: 0.65rem; border-radius: 6px;">PRO</span>
            </a>

            <!-- Orta/Sağ Menü Butonları -->
            @auth
            <div class="d-flex align-items-center gap-2 flex-wrap">
                <!-- Kullanıcı Profil Butonu (Modal Açar) -->
                <button class="nav-btn" data-bs-toggle="modal" data-bs-target="#profileModal">
                    <i class="bi bi-person-circle text-warning fs-5"></i>
                    <span class="d-none d-md-inline">{{ Auth::user()->ad_soyad }}</span>
                </button>

                <a href="{{ route('dashboard') }}" class="nav-btn {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                    <i class="bi bi-house-door"></i>
                    <span>Ana Sayfa</span>
                </a>

                <a href="{{ route('vehicles.index') }}" class="nav-btn {{ request()->routeIs('vehicles.index') ? 'active' : '' }}">
                    <i class="bi bi-car-front"></i>
                    <span>Araçlar</span>
                </a>

                <a href="{{ route('vehicles.create') }}" class="nav-btn {{ request()->routeIs('vehicles.create') ? 'active' : '' }}">
                    <i class="bi bi-plus-lg"></i>
                    <span>Araç Ekle</span>
                </a>

                <a href="{{ route('maintenances.create') }}" class="nav-btn nav-btn-primary">
                    <i class="bi bi-wrench"></i>
                    <span>Bakım Ekle</span>
                </a>

                <!-- Çıkış Formu -->
                <form action="{{ route('logout') }}" method="POST" class="d-inline m-0 p-0">
                    @csrf
                    <button type="submit" class="nav-btn text-danger border-0" title="Çıkış Yap">
                        <i class="bi bi-box-arrow-right"></i>
                        <span class="d-none d-sm-inline">Çıkış</span>
                    </button>
                </form>
            </div>
            @endauth
        </div>
    </nav>

    <!-- BİLDİRİM TOAST / ALERT MESAJLARI -->
    <div class="container mt-3">
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show rounded-4 border-0 bg-success bg-opacity-25 text-white" role="alert">
                <i class="bi bi-check-circle-fill me-2 text-success"></i>{{ session('success') }}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if(session('info'))
            <div class="alert alert-info alert-dismissible fade show rounded-4 border-0 bg-info bg-opacity-25 text-white" role="alert">
                <i class="bi bi-info-circle-fill me-2 text-info"></i>{{ session('info') }}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @if($errors->any())
            <div class="alert alert-danger alert-dismissible fade show rounded-4 border-0 bg-danger bg-opacity-25 text-white" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                <ul class="mb-0 ps-3">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        @endif
    </div>

    <!-- ANA İÇERİK -->
    <main class="flex-grow-1">
        @yield('content')
    </main>

    <!-- PROFİL DÜZENLEME & ŞİFRE DEĞİŞTİRME MODAL -->
    @auth
    <div class="modal fade" id="profileModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold"><i class="bi bi-person-gear me-2 text-warning"></i>Profil & Güvenlik</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <!-- Bilgi Güncelleme -->
                    <form action="{{ route('profile.update') }}" method="POST" class="mb-4">
                        @csrf
                        <h6 class="text-warning small fw-bold mb-3 text-uppercase">Kişisel Bilgiler</h6>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Ad Soyad</label>
                            <input type="text" name="ad_soyad" class="form-control" value="{{ Auth::user()->ad_soyad }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted">E-Posta Adresi</label>
                            <input type="email" name="email" class="form-control" value="{{ Auth::user()->email }}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Telefon</label>
                            <input type="text" name="telefon" class="form-control" value="{{ Auth::user()->telefon }}" placeholder="05XX XXX XX XX">
                        </div>
                        <button type="submit" class="btn btn-outline-custom w-100">Bilgileri Güncelle</button>
                    </form>

                    <hr class="border-secondary border-opacity-25 my-4">

                    <!-- Şifre Değiştirme -->
                    <form action="{{ route('profile.password') }}" method="POST">
                        @csrf
                        <h6 class="text-warning small fw-bold mb-3 text-uppercase">Şifre Değiştir</h6>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Mevcut Şifreniz</label>
                            <input type="password" name="eski_sifre" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Yeni Şifre</label>
                            <input type="password" name="yeni_sifre" class="form-control" required minlength="6">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-muted">Yeni Şifre (Tekrar)</label>
                            <input type="password" name="yeni_sifre_confirmation" class="form-control" required minlength="6">
                        </div>
                        <button type="submit" class="btn btn-glow w-100">Şifreyi Değiştir</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    @endauth

    <!-- FOOTER -->
    <footer class="py-4 mt-5 border-top border-secondary border-opacity-25 text-center text-muted small">
        <div class="container">
            <p class="mb-1">🚗 <strong>SmartGaraj</strong> &copy; {{ date('Y') }} — Akıllı Araç ve Bakım Takip Platformu</p>
            <p class="mb-0 opacity-75">Laravel 11 &bull; PostgreSQL 18 &bull; REST API Ready</p>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    @yield('scripts')
</body>
</html>
