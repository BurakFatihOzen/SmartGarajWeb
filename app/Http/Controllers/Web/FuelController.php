<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\FuelLog;
use App\Models\Vehicle;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class FuelController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $fuelLogs = FuelLog::where('kullanici_id', $user->id)
            ->with(['vehicle', 'driver'])
            ->orderBy('tarih', 'desc')
            ->orderBy('km', 'desc')
            ->get();

        $vehicles = Vehicle::where('kullanici_id', $user->id)->get();
        $drivers = Driver::where('kullanici_id', $user->id)->get();

        $totalSpent = (float) $fuelLogs->sum('toplam_tutar');
        $totalLiters = (float) $fuelLogs->sum('litre');
        $avgUnitPrice = $totalLiters > 0 ? round($totalSpent / $totalLiters, 2) : 0;
        $totalFills = $fuelLogs->count();

        // 30 Günlük Yakıt Tüketimi
        $last30DaysSpent = (float) $fuelLogs->filter(function($f) {
            return Carbon::parse($f->tarih)->isAfter(Carbon::now()->subDays(30));
        })->sum('toplam_tutar');

        return Inertia::render('Fleet/Fuel', [
            'fuelLogs' => $fuelLogs,
            'vehicles' => $vehicles,
            'drivers' => $drivers,
            'kpis' => [
                'totalSpent' => $totalSpent,
                'totalLiters' => $totalLiters,
                'avgUnitPrice' => $avgUnitPrice,
                'totalFills' => $totalFills,
                'last30DaysSpent' => $last30DaysSpent,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'arac_id' => 'required|exists:araclar,id',
            'surucu_id' => 'nullable|exists:suruculer,id',
            'tarih' => 'required|date',
            'km' => 'required|integer|min:0',
            'litre' => 'required|numeric|min:0.01',
            'birim_fiyat' => 'nullable|numeric|min:0',
            'toplam_tutar' => 'required|numeric|min:0',
            'yakit_turu' => 'required|string|max:50',
            'istasyon' => 'nullable|string|max:150',
            'tam_depo_mu' => 'boolean',
            'notlar' => 'nullable|string',
            'fis' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $litre = (float) $validated['litre'];
        $toplamTutar = (float) $validated['toplam_tutar'];
        $birimFiyat = $validated['birim_fiyat'] ? (float) $validated['birim_fiyat'] : ($litre > 0 ? round($toplamTutar / $litre, 2) : 0);

        $fisUrl = null;
        if ($request->hasFile('fis')) {
            $path = $request->file('fis')->store('fuel_receipts', 'public');
            $fisUrl = '/storage/' . $path;
        }

        $log = FuelLog::create([
            'arac_id' => $validated['arac_id'],
            'kullanici_id' => $user->id,
            'surucu_id' => $validated['surucu_id'] ?? null,
            'tarih' => $validated['tarih'],
            'km' => (int) $validated['km'],
            'litre' => $litre,
            'birim_fiyat' => $birimFiyat,
            'toplam_tutar' => $toplamTutar,
            'yakit_turu' => $validated['yakit_turu'],
            'istasyon' => $validated['istasyon'] ?? null,
            'tam_depo_mu' => $validated['tam_depo_mu'] ?? true,
            'fis_url' => $fisUrl,
            'notlar' => $validated['notlar'] ?? null,
        ]);

        // Aracın güncel KM'si bu değerden küçükse otomatik güncelle
        $vehicle = Vehicle::where('kullanici_id', $user->id)->find($validated['arac_id']);
        if ($vehicle && $vehicle->guncel_km < (int) $validated['km']) {
            $vehicle->update(['guncel_km' => (int) $validated['km']]);
        }

        return back()->with('success', "Yakıt alım fişi başarıyla kaydedildi. (₺" . number_format($toplamTutar, 2, ',', '.') . " — {$litre} Litre)");
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $log = FuelLog::where('kullanici_id', $user->id)->findOrFail($id);
        $log->delete();

        return back()->with('success', "Yakıt kaydı silindi.");
    }
}
