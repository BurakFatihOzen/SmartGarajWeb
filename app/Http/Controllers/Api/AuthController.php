<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Mobil & SPA Kullanıcı Kaydı
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'ad_soyad' => 'required|string|max:150',
            'email' => 'required|string|email|max:150|unique:kullanicilar,email',
            'sifre' => 'required|string|min:6',
            'telefon' => 'nullable|string|max:30',
            'device_name' => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'ad_soyad' => $validated['ad_soyad'],
            'email' => $validated['email'],
            'sifre' => Hash::make($validated['sifre']),
            'telefon' => $validated['telefon'] ?? null,
            'rol' => 'kullanici',
        ]);

        $deviceName = $request->input('device_name', 'Mobile App');
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Kayıt başarıyla oluşturuldu.',
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'ad_soyad' => $user->ad_soyad,
                    'email' => $user->email,
                    'telefon' => $user->telefon,
                    'rol' => $user->rol,
                ]
            ]
        ], 201);
    }

    /**
     * Mobil & SPA Giriş (Sanctum Token Üretimi)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'sifre' => 'required|string',
            'device_name' => 'nullable|string|max:100',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->sifre, $user->sifre)) {
            return response()->json([
                'status' => 'error',
                'message' => 'E-posta veya şifre hatalı.',
            ], 401);
        }

        $deviceName = $request->input('device_name', 'Mobile App');
        // İsteğe bağlı eski tokenları temizleyip yeni tekil token verebiliriz
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Giriş başarılı.',
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'ad_soyad' => $user->ad_soyad,
                    'email' => $user->email,
                    'telefon' => $user->telefon,
                    'rol' => $user->rol,
                ]
            ]
        ]);
    }

    /**
     * Profil Bilgileri
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $totalVehicles = $user->vehicles()->count();
        $totalSpent = (float) $user->vehicles()->with('maintenances')->get()->sum(function ($v) {
            return $v->maintenances->sum('maliyet_tl');
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'ad_soyad' => $user->ad_soyad,
                    'email' => $user->email,
                    'telefon' => $user->telefon,
                    'rol' => $user->rol,
                    'kayit_tarihi' => $user->kayit_tarihi,
                ],
                'stats' => [
                    'total_vehicles' => $totalVehicles,
                    'total_spent' => $totalSpent,
                ]
            ]
        ]);
    }

    /**
     * Çıkış (Token İptali)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Oturum başarıyla kapatıldı.'
        ]);
    }
}
