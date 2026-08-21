<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\VehicleController;
use App\Http\Controllers\Web\MaintenanceController;
use App\Http\Controllers\Web\ReportController;
use App\Http\Controllers\Web\OcrController;
use App\Http\Controllers\Web\FleetController;
use App\Http\Controllers\Web\AccidentController;
use App\Http\Controllers\Web\DriverController;
use App\Http\Controllers\Web\TrafficFineController;
use App\Http\Controllers\Web\FuelController;
use App\Http\Controllers\Web\DocumentController;

/*
|--------------------------------------------------------------------------
| Web Routes (SmartGaraj Dashboard & Auth)
|--------------------------------------------------------------------------
*/

// Ana Sayfa Yönlendirmesi
Route::get('/', function () {
    if (auth()->check()) {
        return auth()->user()->isFleet() ? redirect()->route('fleet.index') : redirect()->route('dashboard');
    }
    return redirect()->route('login');
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

    // Kaza & Hasar Yönetimi
    Route::get('/accidents', [AccidentController::class, 'index'])->name('accidents.index');
    Route::post('/accidents', [AccidentController::class, 'store'])->name('accidents.store');
    Route::post('/accidents/{id}/status', [AccidentController::class, 'updateStatus'])->name('accidents.status');
    Route::delete('/accidents/{id}', [AccidentController::class, 'destroy'])->name('accidents.destroy');

    // SmartFilo — Filo Yönetimi
    Route::get('/fleet', [FleetController::class, 'index'])->name('fleet.index');
    Route::post('/fleet/vehicles/{id}/status', [FleetController::class, 'updateStatus'])->name('fleet.vehicles.status');
    Route::get('/fleet/accidents', [AccidentController::class, 'index'])->name('fleet.accidents.index');

    // SmartFilo — Sürücü & Zimmet Yönetimi
    Route::get('/fleet/drivers', [DriverController::class, 'index'])->name('fleet.drivers.index');
    Route::post('/fleet/drivers', [DriverController::class, 'store'])->name('fleet.drivers.store');
    Route::put('/fleet/drivers/{id}', [DriverController::class, 'update'])->name('fleet.drivers.update');
    Route::delete('/fleet/drivers/{id}', [DriverController::class, 'destroy'])->name('fleet.drivers.destroy');
    Route::post('/fleet/assignments', [DriverController::class, 'assign'])->name('fleet.assignments.assign');
    Route::post('/fleet/assignments/{id}/release', [DriverController::class, 'release'])->name('fleet.assignments.release');

    // Trafik Cezaları & İhlaller
    Route::get('/fleet/fines', [TrafficFineController::class, 'index'])->name('fleet.fines.index');
    Route::post('/fines', [TrafficFineController::class, 'store'])->name('fines.store');
    Route::post('/fines/{id}/status', [TrafficFineController::class, 'updateStatus'])->name('fines.status');
    Route::delete('/fines/{id}', [TrafficFineController::class, 'destroy'])->name('fines.destroy');

    // Yakıt Tüketim & Gider Yönetimi
    Route::get('/fleet/fuel', [FuelController::class, 'index'])->name('fleet.fuel.index');
    Route::post('/fuel', [FuelController::class, 'store'])->name('fuel.store');
    Route::delete('/fuel/{id}', [FuelController::class, 'destroy'])->name('fuel.destroy');

    // Dijital Belge Kasası
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // PDF Raporu & Pasaport Yazdırma
    Route::get('/vehicles/{id}/passport', [ReportController::class, 'showPassport'])->name('vehicles.passport');
    Route::get('/vehicles/{id}/print-report', [ReportController::class, 'printReport'])->name('vehicles.print');

    // AI Vision OCR & Fatura Denetim Servisleri
    Route::post('/api/ocr/ruhsat', [OcrController::class, 'scanRuhsat'])->name('ocr.ruhsat');
    Route::post('/api/ocr/fatura', [OcrController::class, 'scanFatura'])->name('ocr.fatura');
    Route::post('/api/ocr/audit-items', [OcrController::class, 'auditItems'])->name('ocr.audit');

    // Profil & Şifre
    Route::post('/profile', [AuthController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/password', [AuthController::class, 'changePassword'])->name('profile.password');
});
