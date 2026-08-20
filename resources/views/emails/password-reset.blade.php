<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f1015; color: #f8fafc; margin: 0; padding: 30px 15px; }
        .email-container { max-width: 540px; margin: 0 auto; background-color: #181920; border: 1px solid #262938; border-radius: 16px; padding: 36px 30px; }
        .logo-title { color: #f59e0b; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
        .content { color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 30px; }
        .btn-reset { display: block; width: 220px; margin: 25px auto; text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000000 !important; font-weight: bold; text-decoration: none; padding: 14px 20px; border-radius: 10px; font-size: 16px; }
        .footer { font-size: 12px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #262938; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo-title">🛠️ SmartGaraj</div>
        <div class="content">
            <p>Merhaba <strong>{{ $userName }}</strong>,</p>
            <p>SmartGaraj hesabınız için bir şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi hemen belirleyebilirsiniz:</p>
            <a href="{{ $resetUrl }}" class="btn-reset">Şifremi Sıfırla</a>
            <p style="font-size: 13px; color: #94a3b8;">Bu bağlantı güvenlik nedeniyle <strong>60 dakika</strong> boyunca geçerlidir. Eğer bu talebi siz yapmadıysanız bu e-postayı güvenle yok sayabilirsiniz.</p>
        </div>
        <div class="footer">
            SmartGaraj &bull; Akıllı Araç ve Bakım Takip Sistemi
        </div>
    </div>
</body>
</html>
