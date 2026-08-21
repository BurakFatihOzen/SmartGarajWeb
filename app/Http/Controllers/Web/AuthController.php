<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\ResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            $user = Auth::user();
            return $user->isFleet() ? redirect()->route('fleet.index') : redirect()->route('dashboard');
        }
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'sifre' => 'required|string',
        ], [
            'email.required' => 'E-posta adresi zorunludur.',
            'email.email' => 'Geçerli bir e-posta adresi giriniz.',
            'sifre.required' => 'Şifre alanı zorunludur.',
        ]);

        $user = User::where('email', trim($credentials['email']))->first();

        if ($user) {
            $matched = Hash::check($credentials['sifre'], $user->sifre) 
                || password_verify($credentials['sifre'], $user->sifre)
                || $user->sifre === $credentials['sifre'];

            if ($matched) {
                // Eğer şifre düz metin kalmışsa otomatik bcrypt ile güncelle
                if ($user->sifre === $credentials['sifre']) {
                    $user->update(['sifre' => $credentials['sifre']]);
                }

                $selectedMode = $request->input('mode', 'personal');

                // Portal Eşleşme Kontrolü
                if ($selectedMode === 'fleet' && !$user->isFleet()) {
                    return back()->withErrors([
                        'email' => 'Bu hesap "Bireysel Garaj" olarak kayıtlıdır. Lütfen yukarıdaki "🚗 Bireysel Garaj" sekmesinden giriş yapın.',
                    ])->withInput($request->only('email'));
                }

                if ($selectedMode === 'personal' && $user->isFleet()) {
                    return back()->withErrors([
                        'email' => 'Bu hesap "SmartFilo Kurumsal" olarak kayıtlıdır. Lütfen yukarıdaki "🏢 SmartFilo Pro" sekmesinden giriş yapın.',
                    ])->withInput($request->only('email'));
                }

                Auth::login($user, true);
                $request->session()->regenerate();

                // Kullanıcının kayıtlı hesap türüne göre kesin yönlendirme
                if ($user->isFleet()) {
                    return redirect()->route('fleet.index');
                }

                return redirect()->route('dashboard');
            }
        }

        return back()->withErrors([
            'email' => 'Girdiğiniz e-posta veya şifre hatalı.',
        ])->withInput($request->only('email'));
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'ad_soyad' => 'required|string|max:150',
            'email' => 'required|string|email|max:150|unique:kullanicilar,email',
            'sifre' => 'required|string|min:6',
            'sirket_adi' => 'nullable|string|max:200',
            'mode' => 'nullable|string|in:personal,fleet',
        ], [
            'email.unique' => 'Bu e-posta adresiyle kayıtlı bir hesap zaten var. Lütfen giriş yapın veya farklı bir e-posta adresi kullanın.',
            'email.required' => 'E-posta adresi zorunludur.',
            'email.email' => 'Lütfen geçerli bir e-posta adresi giriniz.',
            'ad_soyad.required' => 'Ad ve soyad alanı zorunludur.',
            'sifre.required' => 'Şifre alanı zorunludur.',
            'sifre.min' => 'Şifreniz en az 6 karakter olmalıdır.',
        ]);

        $hesapTuru = ($request->input('mode') === 'fleet') ? 'filo' : 'bireysel';

        $user = User::create([
            'ad_soyad' => $validated['ad_soyad'],
            'email' => $validated['email'],
            'sifre' => Hash::make($validated['sifre']),
            'rol' => 'kullanici',
            'hesap_turu' => $hesapTuru,
            'sirket_adi' => $validated['sirket_adi'] ?? null,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        if ($user->isFleet()) {
            return redirect()->route('fleet.index')->with('success', 'SmartFilo kurumsal filo hesabınız başarıyla oluşturuldu! Hoş geldiniz.');
        }

        return redirect()->route('dashboard')->with('success', 'SmartGaraj bireysel hesabınız başarıyla oluşturuldu! Hoş geldiniz.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('info', 'Oturum kapatıldı.');
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ad_soyad' => 'required|string|max:150',
            'email' => 'required|email|max:150|unique:kullanicilar,email,' . $user->id,
            'telefon' => 'nullable|string|max:30',
            'sehir' => 'nullable|string|max:100',
            'ehliyet_sinifi' => 'nullable|string|max:50',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profil bilgileriniz başarıyla güncellendi.');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'eski_sifre' => 'required',
            'yeni_sifre' => 'required|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->eski_sifre, $user->sifre)) {
            return back()->withErrors(['eski_sifre' => 'Mevcut şifreniz hatalı.']);
        }

        $user->update([
            'sifre' => Hash::make($request->yeni_sifre),
        ]);

        return back()->with('success', 'Şifreniz başarıyla değiştirildi.');
    }

    // ==========================================
    // ŞİFREMİ UNUTTUM & SIFIRLAMA İŞLEMLERİ
    // ==========================================

    public function showForgotPassword()
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'targetEmail' => session('target_email'),
        ]);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $email = trim($request->email);

        $user = User::where('email', $email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'Bu e-posta adresine (' . $email . ') ait kayıtlı bir hesap bulunamadı.']);
        }

        $token = Str::random(64);

        // Eski token varsa sil ve yenisini kaydet
        DB::table('password_reset_tokens')->where('email', $email)->delete();
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now(),
        ]);

        $resetUrl = route('password.reset', ['token' => $token, 'email' => $email]);

        try {
            $brevoKey = env('BREVO_API_KEY');

            $htmlContent = view('emails.password-reset', [
                'resetUrl' => $resetUrl,
                'userName' => $user->ad_soyad,
            ])->render();

            if (!empty($brevoKey)) {
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'api-key' => $brevoKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post('https://api.brevo.com/v3/smtp/email', [
                    'sender' => [
                        'name' => 'SmartGaraj',
                        'email' => 'brkfatih2016@gmail.com',
                    ],
                    'to' => [
                        [
                            'email' => $email,
                            'name' => $user->ad_soyad,
                        ],
                    ],
                    'subject' => '🛠️ SmartGaraj - Şifre Sıfırlama Talebiniz',
                    'htmlContent' => $htmlContent,
                ]);

                if (!$response->successful()) {
                    $err = $response->json('message') ?? $response->body();
                    \Illuminate\Support\Facades\Log::error('Brevo API error: ' . $err);
                    return back()->withErrors(['email' => 'E-posta servisi hatası: ' . $err]);
                }
            } else {
                Mail::to($email)->send(new ResetPasswordMail($resetUrl, $user->ad_soyad));
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Password reset mail send failed: ' . $e->getMessage());
            return back()->withErrors(['email' => 'E-posta gönderilemedi: ' . $e->getMessage()]);
        }

        return back()->with([
            'status' => 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
            'target_email' => $email,
        ]);
    }

    public function showResetPassword(Request $request, $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email')
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'sifre' => 'required|string|min:6|confirmed',
        ]);

        $email = trim($request->email);
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record) {
            return back()->withErrors(['email' => 'Geçersiz veya süresi dolmuş sıfırlama talebi.']);
        }

        // 60 dakika süre kontrolü
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return back()->withErrors(['email' => 'Şifre sıfırlama bağlantısının süresi dolmuş. Lütfen tekrar talep edin.']);
        }

        // Token doğrulama
        if (!Hash::check($request->token, $record->token)) {
            return back()->withErrors(['email' => 'Geçersiz sıfırlama anahtarı.']);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return back()->withErrors(['email' => 'Kullanıcı bulunamadı.']);
        }

        $user->update([
            'sifre' => Hash::make($request->sifre),
        ]);

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard')->with('success', 'Şifreniz başarıyla güncellendi ve oturumunuz açıldı!');
    }
}
