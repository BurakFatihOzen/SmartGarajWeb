<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FuelLog;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class FuelLogApiController extends Controller
{
    /**
     * Yakıt Kayıtlarını Listele
     */
    public function index(Request $request, $vehicleId)
    {
        $vehicle = $request->user()->vehicles()->find($vehicleId);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        $logs = $vehicle->fuelLogs()->get();

        return response()->json([
            'status' => 'success',
            'count' => $logs->count(),
            'total_liters' => (float) $logs->sum('litre'),
            'total_fuel_cost' => (float) $logs->sum('toplam_tutar'),
            'data' => $logs,
        ]);
    }

    /**
     * Yakıt Kaydı Ekle
     */
    public function store(Request $request, $vehicleId)
    {
        $vehicle = $request->user()->vehicles()->find($vehicleId);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        $validated = $request->validate([
            'tarih' => 'nullable|date',
            'km' => 'required|integer|min:0',
            'litre' => 'required|numeric|min:0.1',
            'birim_fiyat' => 'required|numeric|min:0.1',
            'toplam_tutar' => 'nullable|numeric|min:0.1',
            'depo_doldu' => 'nullable|boolean',
            'yakit_turu' => 'nullable|string|max:50',
            'notlar' => 'nullable|string',
        ]);

        if (empty($validated['toplam_tutar'])) {
            $validated['toplam_tutar'] = $validated['litre'] * $validated['birim_fiyat'];
        }
        $validated['tarih'] = $validated['tarih'] ?? date('Y-m-d');
        $validated['arac_id'] = $vehicle->id;

        $fuelLog = FuelLog::create($validated);

        if ($validated['km'] > $vehicle->guncel_km) {
            $vehicle->update(['guncel_km' => $validated['km']]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Yakıt kaydı başarıyla eklendi.',
            'data' => $fuelLog,
        ], 201);
    }
}
