<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class MaintenanceApiController extends Controller
{
    /**
     * Araca ait bakımları listele
     */
    public function index(Request $request, $vehicleId)
    {
        $vehicle = $request->user()->vehicles()->find($vehicleId);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        $maintenances = $vehicle->maintenances()->get();

        return response()->json([
            'status' => 'success',
            'count' => $maintenances->count(),
            'total_cost' => (float) $maintenances->sum('maliyet_tl'),
            'data' => $maintenances,
        ]);
    }

    /**
     * Bakım Kaydı Ekle
     */
    public function store(Request $request, $vehicleId)
    {
        $vehicle = $request->user()->vehicles()->find($vehicleId);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        $validated = $request->validate([
            'islem_tarihi' => 'required|date',
            'islem_turu' => 'required|string|max:150',
            'islem_km' => 'required|integer|min:0',
            'maliyet_tl' => 'required|numeric|min:0',
            'aciklama' => 'nullable|string',
            'fatura_url' => 'nullable|string|max:255',
        ]);

        $validated['arac_id'] = $vehicle->id;
        $maintenance = Maintenance::create($validated);

        // Eğer girilen bakım KM'si aracın güncel KM'sinden büyükse araç güncel KM'sini güncelle
        if ($validated['islem_km'] > $vehicle->guncel_km) {
            $vehicle->update(['guncel_km' => $validated['islem_km']]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Bakım kaydı başarıyla eklendi.',
            'data' => $maintenance,
        ], 201);
    }

    /**
     * Bakım Kaydı Sil
     */
    public function destroy(Request $request, $id)
    {
        $maintenance = Maintenance::whereHas('vehicle', function ($q) use ($request) {
            $q->where('kullanici_id', $request->user()->id);
        })->find($id);

        if (!$maintenance) {
            return response()->json(['status' => 'error', 'message' => 'Bakım kaydı bulunamadı veya yetkiniz yok.'], 404);
        }

        $maintenance->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Bakım kaydı başarıyla silindi.',
        ]);
    }
}
