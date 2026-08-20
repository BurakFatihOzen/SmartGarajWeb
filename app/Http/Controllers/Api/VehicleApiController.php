<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Services\SmartDiagnosisService;
use Illuminate\Http\Request;

class VehicleApiController extends Controller
{
    /**
     * Kullanıcının araçlarını listele
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $vehicles = $user->vehicles()->with(['maintenances' => function ($q) {
            $q->latest('islem_tarihi')->limit(5);
        }])->get();

        $data = $vehicles->map(function ($v) {
            return [
                'id' => $v->id,
                'plaka' => $v->plaka,
                'marka' => $v->marka,
                'model' => $v->model,
                'motor' => $v->motor,
                'yil' => $v->yil,
                'guncel_km' => $v->guncel_km,
                'ruhsat_tipi' => $v->ruhsat_tipi,
                'muayene_bitis' => $v->muayene_bitis?->format('Y-m-d'),
                'sigorta_bitis' => $v->sigorta_bitis?->format('Y-m-d'),
                'kasko_bitis' => $v->kasko_bitis?->format('Y-m-d'),
                'badges' => [
                    'inspection' => $v->inspection_badge,
                    'insurance' => $v->insurance_badge,
                    'kasko' => $v->kasko_badge,
                ],
                'stats' => [
                    'total_spent' => $v->total_spent,
                    'maintenance_count' => $v->maintenance_count,
                ],
                'recent_maintenances' => $v->maintenances,
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $data->count(),
            'data' => $data,
        ]);
    }

    /**
     * Tekil Araç Detayı
     */
    public function show(Request $request, $id)
    {
        $vehicle = $request->user()->vehicles()->with(['maintenances', 'fuelLogs'])->find($id);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'vehicle' => $vehicle,
                'badges' => [
                    'inspection' => $vehicle->inspection_badge,
                    'insurance' => $vehicle->insurance_badge,
                    'kasko' => $vehicle->kasko_badge,
                ],
                'stats' => [
                    'total_spent' => $vehicle->total_spent,
                    'maintenance_count' => $vehicle->maintenance_count,
                ],
            ]
        ]);
    }

    /**
     * Yeni Araç Ekle
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'plaka' => 'required|string|max:30',
            'marka' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'motor' => 'nullable|string|max:120',
            'yil' => 'nullable|integer|min:1900|max:2100',
            'guncel_km' => 'required|integer|min:0',
            'ruhsat_tipi' => 'nullable|string|max:50',
            'muayene_bitis' => 'nullable|date',
            'sigorta_bitis' => 'nullable|date',
            'kasko_bitis' => 'nullable|date',
            'sasi_no' => 'nullable|string|max:50',
            'notlar' => 'nullable|string',
        ]);

        $validated['kullanici_id'] = $request->user()->id;
        $vehicle = Vehicle::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Araç başarıyla eklendi.',
            'data' => $vehicle,
        ], 201);
    }

    /**
     * Araç Güncelle
     */
    public function update(Request $request, $id)
    {
        $vehicle = $request->user()->vehicles()->find($id);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        $validated = $request->validate([
            'plaka' => 'sometimes|required|string|max:30',
            'marka' => 'sometimes|required|string|max:100',
            'model' => 'sometimes|required|string|max:100',
            'motor' => 'nullable|string|max:120',
            'yil' => 'nullable|integer|min:1900|max:2100',
            'guncel_km' => 'sometimes|required|integer|min:0',
            'ruhsat_tipi' => 'nullable|string|max:50',
            'muayene_bitis' => 'nullable|date',
            'sigorta_bitis' => 'nullable|date',
            'kasko_bitis' => 'nullable|date',
            'sasi_no' => 'nullable|string|max:50',
            'notlar' => 'nullable|string',
        ]);

        $vehicle->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Araç başarıyla güncellendi.',
            'data' => $vehicle,
        ]);
    }

    /**
     * Araç Sil
     */
    public function destroy(Request $request, $id)
    {
        $vehicle = $request->user()->vehicles()->find($id);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        $vehicle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Araç ve ilişkili tüm kayıtlar başarıyla silindi.',
        ]);
    }

    /**
     * AI Akıllı Diagnostik Sağlık Raporu
     */
    public function diagnosis(Request $request, $id, SmartDiagnosisService $diagnosisService)
    {
        $vehicle = $request->user()->vehicles()->with('maintenances')->find($id);

        if (!$vehicle) {
            return response()->json(['status' => 'error', 'message' => 'Araç bulunamadı.'], 404);
        }

        $report = $diagnosisService->analyze($vehicle);

        return response()->json([
            'status' => 'success',
            'data' => $report,
        ]);
    }
}
