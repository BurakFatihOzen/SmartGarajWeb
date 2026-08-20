<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\VehicleController;
use App\Http\Controllers\Web\MaintenanceController;
use App\Http\Controllers\Web\ReportController;
use App\Http\Controllers\Web\OcrController;

/*
|--------------------------------------------------------------------------
| Web Routes (SmartGaraj Dashboard & Auth)
|--------------------------------------------------------------------------
*/

// Ana Sayfa Yönlendirmesi
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Herkese Açık Doğrulanabilir Dijital Araç Pasaportu (QR Tarama)
Route::get('/verify/{token}', [ReportController::class, 'verifyPassport'])->name('passport.verify');

// Misafir Rotaları (Giriş & Kayıt & Şifre Sıfırlama)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');

    // Şifremi Unuttum Rotaları
    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
});

// Oturum Açmış Kullanıcı Rotaları
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/diagnosis/{id}', [DashboardController::class, 'diagnosis'])->name('dashboard.diagnosis');

    // Araçlar & Fotoğraf
    Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
    Route::get('/vehicles/create', [VehicleController::class, 'create'])->name('vehicles.create');
    Route::post('/vehicles', [VehicleController::class, 'store'])->name('vehicles.store');
    Route::post('/vehicles/{id}/upload-photo', [VehicleController::class, 'uploadPhoto'])->name('vehicles.upload-photo');
    Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');

    // Bakımlar
    Route::get('/maintenances/create', [MaintenanceController::class, 'create'])->name('maintenances.create');
    Route::post('/maintenances', [MaintenanceController::class, 'store'])->name('maintenances.store');
    Route::delete('/maintenances/{id}', [MaintenanceController::class, 'destroy'])->name('maintenances.destroy');

    // PDF Raporu & Pasaport Yazdırma
    Route::get('/vehicles/{id}/print-report', [ReportController::class, 'printReport'])->name('vehicles.print');

    // AI Vision OCR Servisleri
    Route::post('/api/ocr/ruhsat', [OcrController::class, 'scanRuhsat'])->name('ocr.ruhsat');
    Route::post('/api/ocr/fatura', [OcrController::class, 'scanFatura'])->name('ocr.fatura');

    // Profil & Şifre
    Route::post('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/password', [AuthController::class, 'changePassword'])->name('profile.password');
});
