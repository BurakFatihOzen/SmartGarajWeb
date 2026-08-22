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
            'islem_turu' => 'required|string|max:500',
            'servis_turu' => 'nullable|string|in:yetkili_servis,ozel_servis,sanayi,kendi_garajimiz',
            'servis_adi' => 'nullable|string|max:200',
            'sanayi_sitesi' => 'nullable|string|max:200',
            'usta_adi' => 'nullable|string|max:150',
            'usta_tel' => 'nullable|string|max:50',
            'yag_markasi' => 'nullable|string|max:100',
            'yag_modeli' => 'nullable|string|max:100',
            'yag_viskozite' => 'nullable|string|max:50',
            'yag_litresi' => 'nullable|numeric|min:0|max:99',
            'yag_filtresi_degisti' => 'nullable|boolean',
            'islem_km' => 'nullable|integer|min:0',
            'maliyet_tl' => 'required|numeric|min:0',
            'aciklama' => 'nullable|string',
        ]);

        $maintenance = Maintenance::create([
            'arac_id' => $vehicle->id,
            'islem_tarihi' => $validated['islem_tarihi'],
            'islem_turu' => $validated['islem_turu'],
            'servis_turu' => $validated['servis_turu'] ?? null,
            'servis_adi' => $validated['servis_adi'] ?? null,
            'sanayi_sitesi' => $validated['sanayi_sitesi'] ?? null,
            'usta_adi' => $validated['usta_adi'] ?? null,
            'usta_tel' => $validated['usta_tel'] ?? null,
            'yag_markasi' => $validated['yag_markasi'] ?? null,
            'yag_modeli' => $validated['yag_modeli'] ?? null,
            'yag_viskozite' => $validated['yag_viskozite'] ?? null,
            'yag_litresi' => !empty($validated['yag_litresi']) ? (float) $validated['yag_litresi'] : null,
            'yag_filtresi_degisti' => (bool) ($validated['yag_filtresi_degisti'] ?? false),
            'islem_km' => max(0, (int) ($validated['islem_km'] ?? 0)),
            'maliyet_tl' => max(0.00, (float) $validated['maliyet_tl']),
            'aciklama' => $validated['aciklama'] ?? null,
        ]);

        // Eğer girilen bakım KM'si aracın güncel KM'sinden büyükse otomatik güncelle
        if (!empty($validated['islem_km']) && $validated['islem_km'] > $vehicle->guncel_km) {
            $vehicle->update(['guncel_km' => (int) $validated['islem_km']]);
        }

        $redirectUrl = ($user->hesap_turu === 'filo' || (method_exists($user, 'isFleet') && $user->isFleet()))
            ? route('fleet.index')
            : route('dashboard', ['arac_id' => $vehicle->id]);

        return redirect($redirectUrl)->with('success', 'Bakım kaydı başarıyla eklendi!');
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $maintenance = Maintenance::whereHas('vehicle', function ($q) use ($user) {
            $q->where('kullanici_id', $user->id);
        })->findOrFail($id);

        $validated = $request->validate([
            'islem_tarihi' => 'required|date',
            'islem_turu' => 'required|string|max:500',
            'servis_turu' => 'nullable|string|in:yetkili_servis,ozel_servis,sanayi,kendi_garajimiz',
            'servis_adi' => 'nullable|string|max:200',
            'sanayi_sitesi' => 'nullable|string|max:200',
            'usta_adi' => 'nullable|string|max:150',
            'usta_tel' => 'nullable|string|max:50',
            'yag_markasi' => 'nullable|string|max:100',
            'yag_modeli' => 'nullable|string|max:100',
            'yag_viskozite' => 'nullable|string|max:50',
            'yag_litresi' => 'nullable|numeric|min:0|max:99',
            'yag_filtresi_degisti' => 'nullable|boolean',
            'islem_km' => 'nullable|integer|min:0',
            'maliyet_tl' => 'required|numeric|min:0',
            'aciklama' => 'nullable|string',
        ]);

        $maintenance->update([
            'islem_tarihi' => $validated['islem_tarihi'],
            'islem_turu' => $validated['islem_turu'],
            'servis_turu' => $validated['servis_turu'] ?? null,
            'servis_adi' => $validated['servis_adi'] ?? null,
            'sanayi_sitesi' => $validated['sanayi_sitesi'] ?? null,
            'usta_adi' => $validated['usta_adi'] ?? null,
            'usta_tel' => $validated['usta_tel'] ?? null,
            'yag_markasi' => $validated['yag_markasi'] ?? null,
            'yag_modeli' => $validated['yag_modeli'] ?? null,
            'yag_viskozite' => $validated['yag_viskozite'] ?? null,
            'yag_litresi' => !empty($validated['yag_litresi']) ? (float) $validated['yag_litresi'] : null,
            'yag_filtresi_degisti' => (bool) ($validated['yag_filtresi_degisti'] ?? false),
            'islem_km' => max(0, (int) ($validated['islem_km'] ?? 0)),
            'maliyet_tl' => max(0.00, (float) $validated['maliyet_tl']),
            'aciklama' => $validated['aciklama'] ?? null,
        ]);

        $vehicle = $maintenance->vehicle;
        if ($vehicle && !empty($validated['islem_km']) && $validated['islem_km'] > $vehicle->guncel_km) {
            $vehicle->update(['guncel_km' => (int) $validated['islem_km']]);
        }

        return back()->with('success', 'Bakım kaydı başarıyla güncellendi!');
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
