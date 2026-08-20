<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MaintenanceController extends Controller
{
    public function create(Request $request)
    {
        $vehicles = Auth::user()->vehicles;
        $selectedVehicleId = $request->query('arac_id');

        return Inertia::render('Maintenances/Create', [
            'vehicles' => $vehicles,
            'selectedVehicleId' => $selectedVehicleId,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $vehicle = $user->vehicles()->findOrFail($request->arac_id);

        $validated = $request->validate([
            'arac_id' => 'required|integer',
            'islem_tarihi' => 'required|date',
            'islem_turu' => 'required|string|max:150',
            'islem_km' => 'nullable|integer|min:0',
            'maliyet_tl' => 'required|numeric|min:0',
            'aciklama' => 'nullable|string',
        ]);

        $maintenance = Maintenance::create([
            'arac_id' => $vehicle->id,
            'islem_tarihi' => $validated['islem_tarihi'],
            'islem_turu' => $validated['islem_turu'],
            'islem_km' => max(0, (int) ($validated['islem_km'] ?? 0)),
            'maliyet_tl' => max(0.00, (float) $validated['maliyet_tl']),
            'aciklama' => $validated['aciklama'] ?? null,
        ]);

        // Eğer girilen bakım KM'si aracın güncel KM'sinden büyükse otomatik güncelle
        if (!empty($validated['islem_km']) && $validated['islem_km'] > $vehicle->guncel_km) {
            $vehicle->update(['guncel_km' => (int) $validated['islem_km']]);
        }

        return redirect()->route('dashboard', ['arac_id' => $vehicle->id])
            ->with('success', 'Bakım kaydı başarıyla eklendi!');
    }

    public function destroy($id)
    {
        $maintenance = Maintenance::whereHas('vehicle', function ($q) {
            $q->where('kullanici_id', Auth::id());
        })->findOrFail($id);

        $aracId = $maintenance->arac_id;
        $maintenance->delete();

        return redirect()->route('dashboard', ['arac_id' => $aracId])
            ->with('success', 'Bakım kaydı başarıyla silindi.');
    }
}
