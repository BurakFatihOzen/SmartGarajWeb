<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleApiController;
use App\Http\Controllers\Api\MaintenanceApiController;
use App\Http\Controllers\Api\FuelLogApiController;

/*
|--------------------------------------------------------------------------
| SmartGaraj REST API Routes (v1)
|--------------------------------------------------------------------------
| Bu uç noktalar Mobil Uygulama (Flutter / React Native) ve 
| harici entegrasyonlar tarafından Bearer Token (Sanctum) ile tüketilir.
*/

Route::prefix('v1')->group(function () {

    // --- 1. AÇIK UÇ NOKTALAR (Public Auth) ---
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // --- 2. KORUMALI UÇ NOKTALAR (Sanctum Bearer Token) ---
    Route::middleware('auth:sanctum')->group(function () {
        
        // Kullanıcı Profili & Çıkış
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Araç Yönetimi (CRUD + AI Teşhis)
        Route::get('/vehicles', [VehicleApiController::class, 'index']);
        Route::post('/vehicles', [VehicleApiController::class, 'store']);
        Route::get('/vehicles/{id}', [VehicleApiController::class, 'show']);
        Route::put('/vehicles/{id}', [VehicleApiController::class, 'update']);
        Route::delete('/vehicles/{id}', [VehicleApiController::class, 'destroy']);
        Route::get('/vehicles/{id}/diagnosis', [VehicleApiController::class, 'diagnosis']);

        // Bakım Kayıtları Yönetimi
        Route::get('/vehicles/{vehicleId}/maintenances', [MaintenanceApiController::class, 'index']);
        Route::post('/vehicles/{vehicleId}/maintenances', [MaintenanceApiController::class, 'store']);
        Route::delete('/maintenances/{id}', [MaintenanceApiController::class, 'destroy']);

        // Yakıt Takibi Yönetimi
        Route::get('/vehicles/{vehicleId}/fuel-logs', [FuelLogApiController::class, 'index']);
        Route::post('/vehicles/{vehicleId}/fuel-logs', [FuelLogApiController::class, 'store']);
    });
});
