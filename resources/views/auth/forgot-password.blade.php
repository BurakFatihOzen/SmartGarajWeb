<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartGaraj - Şifremi Unuttum</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --bg-main: #121212; --card-bg: #1e1e24; --text-main: #ffffff; 
            --text-muted: #8a8a93; --border-color: #333338; 
            --accent-color: #ff8c00; --input-bg: #2a2a32;
        }

        body { 
            background-color: var(--bg-main); 
            color: var(--text-main); 
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 20px;
            background-image: radial-gradient(circle at 50% 0%, rgba(255,140,0,0.1), var(--bg-main) 60%);
        }

        .login-card { 
            background-color: var(--card-bg); 
            border: 1px solid var(--border-color); 
            border-radius: 16px; 
            padding: 3rem; 
            width: 100%; 
            max-width: 420px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
        }

        .form-control { 
            background-color: var(--input-bg) !important; 
            border: 1px solid var(--border-color) !important; 
            color: var(--text-main) !important; 
            border-radius: 8px; 
            padding: 12px 15px !important; 
        }
        .form-control:focus { 
            border-color: var(--accent-color) !important; 
            box-shadow: 0 0 0 3px rgba(255,140,0,0.1) !important; 
        }

        .btn-glow { 
            background: linear-gradient(45deg, #ff8c00, #ffb347); 
            color: #121212; 
            font-weight: 800; 
            border: none; 
            padding: 14px; 
            border-radius: 8px;
            width: 100%;
        }
        .btn-glow:hover { 
            box-shadow: 0 8px 20px rgba(255, 140, 0, 0.4); 
            color: #000;
        }

        .alert-success-custom {
            background-color: rgba(25, 135, 84, 0.1); 
            color: #47d18a; 
            border: 1px solid rgba(25, 135, 84, 0.3); 
            border-radius: 8px;
        }
        .alert-custom { 
            background-color: rgba(220, 53, 69, 0.1); 
            color: #ff6b6b; 
            border: 1px solid rgba(220, 53, 69, 0.3); 
            border-radius: 8px;
        }
    </style>
</head>
<body>

<div class="login-card text-center">
    <div class="mb-4">
        <h2 class="fw-bold mb-0" style="color: var(--accent-color);">
            <i class="bi bi-key me-2"></i>Şifre Sıfırlama
        </h2>
        <div class="text-muted small mt-2">Kayıtlı e-posta adresinize sıfırlama bağlantısı göndereceğiz.</div>
    </div>

    @if(session('status'))
        <div class="alert alert-success-custom small py-3 mb-4 text-start">
            <i class="bi bi-check-circle-fill me-2"></i>{{ session('status') }}
        </div>
    @endif

    @if($errors->any())
        <div class="alert alert-custom small py-2 mb-4 text-start">
            <i class="bi bi-exclamation-triangle me-1"></i>
            @foreach($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif

    <form action="{{ route('password.email') }}" method="POST" class="text-start">
        @csrf
        <div class="mb-4">
            <label class="form-label text-muted small">E-Posta Adresiniz</label>
            <input type="email" name="email" class="form-control" placeholder="adiniz@example.com" value="{{ old('email') }}" required autofocus>
        </div>

        <button type="submit" class="btn btn-glow mb-3">
            <i class="bi bi-send me-2"></i>Sıfırlama Bağlantısı Gönder
        </button>

        <div class="text-center">
            <a href="{{ route('login') }}" class="text-decoration-none small text-warning">
                <i class="bi bi-arrow-left me-1"></i>Giriş Ekranına Dön
            </a>
        </div>
    </form>
</div>

</body>
</html>
