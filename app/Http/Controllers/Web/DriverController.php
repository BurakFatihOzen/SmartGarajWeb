<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\VehicleAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DriverController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Bireysel kullanıcı filo sürücü portalına girmeye çalışırsa yönlendir
        if ($user && !$user->isFleet()) {
            return redirect()->route('dashboard')->with('info', 'Sürücü ve zimmet yönetimi kurumsal filo hesapları içindir.');
        }

        // Otomatik Senkronizasyon: Filonuzdaki araçlarda zimmetli personel varsa ve sürücü listesinde henüz yoksa otomatik oluştur & zimmetle
        $vehicles = Vehicle::where('kullanici_id', $user->id)->get();
        foreach ($vehicles as $v) {
            $driverName = trim((string) $v->zimmet_surucu_adi);
            if (!empty($driverName)) {
                $driver = Driver::firstOrCreate(
                    [
                        'kullanici_id' => $user->id, 
                        'ad_soyad' => $driverName
                    ],
                    [
                        'ehliyet_sinifi' => 'B',
                        'departman' => $v->departman ?? 'Genel Filo',
                        'durum' => 'aktif',
                    ]
                );

                // Eğer araçta durum 'gorevde' ise aktif zimmet oluştur
                if ($v->durum === 'gorevde') {
                    VehicleAssignment::where('arac_id', $v->id)
                        ->where('durum', 'aktif')
                        ->where('surucu_id', '!=', $driver->id)
                        ->update(['durum' => 'tamamlandi', 'iade_tarihi' => now()]);

                    VehicleAssignment::firstOrCreate(
                        [
                            'arac_id' => $v->id,
                            'surucu_id' => $driver->id,
                            'durum' => 'aktif',
                        ],
                        [
                            'kullanici_id' => $user->id,
                            'teslim_tarihi' => now(),
                            'baslangic_km' => (int) ($v->guncel_km ?? 0),
                            'yakit_seviyesi' => 'Dolu Depo',
                            'teslim_notu' => 'Araç kaydı ile birlikte otomatik zimmetlendi.',
                        ]
                    );
                }
            }
        }

        $drivers = Driver::where('kullanici_id', $user->id)
            ->with(['activeAssignment.vehicle', 'assignments.vehicle', 'fines', 'fuelLogs'])
            ->orderBy('ad_soyad', 'asc')
            ->get();

        // KPI Metrikleri
        $totalDrivers = $drivers->count();
        $assignedDrivers = $drivers->filter(fn($d) => $d->activeAssignment !== null)->count();
        $idleDrivers = max(0, $totalDrivers - $assignedDrivers);
        
        $today = Carbon::today();
        $licenseExpiringSoon = $drivers->filter(function($d) use ($today) {
            if (!$d->ehliyet_gecerlilik_tarihi) return false;
            $diff = $today->diffInDays($d->ehliyet_gecerlilik_tarihi, false);
            return $diff >= 0 && $diff <= 60;
        })->count();

        return Inertia::render('Fleet/Drivers', [
            'drivers' => $drivers,
            'vehicles' => $vehicles,
            'kpis' => [
                'totalDrivers' => $totalDrivers,
                'assignedDrivers' => $assignedDrivers,
                'idleDrivers' => $idleDrivers,
                'licenseExpiringSoon' => $licenseExpiringSoon,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ad_soyad' => 'required|string|max:150',
            'tc_no' => 'nullable|string|size:11',
            'telefon' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'ehliyet_sinifi' => 'required|string|max:30',
            'ehliyet_verilis_tarihi' => 'nullable|date',
            'ehliyet_gecerlilik_tarihi' => 'nullable|date',
            'departman' => 'nullable|string|max:100',
            'gorev_unvani' => 'nullable|string|max:100',
            'notlar' => 'nullable|string',
        ]);

        $validated['kullanici_id'] = $user->id;
        $validated['durum'] = 'aktif';

        $driver = Driver::create($validated);

        return back()->with('success', "{$driver->ad_soyad} isimli sürücü filoya başarıyla kaydedildi.");
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $driver = Driver::where('kullanici_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'ad_soyad' => 'required|string|max:150',
            'tc_no' => 'nullable|string|size:11',
            'telefon' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'ehliyet_sinifi' => 'required|string|max:30',
            'ehliyet_verilis_tarihi' => 'nullable|date',
            'ehliyet_gecerlilik_tarihi' => 'nullable|date',
            'departman' => 'nullable|string|max:100',
            'gorev_unvani' => 'nullable|string|max:100',
            'durum' => 'required|string|in:aktif,pasif',
            'notlar' => 'nullable|string',
        ]);

        $driver->update($validated);

        return back()->with('success', "{$driver->ad_soyad} bilgileri başarıyla güncellendi.");
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $driver = Driver::where('kullanici_id', $user->id)->findOrFail($id);

        // Aktif zimmeti varsa aracı boşa çıkar
        $activeAssignment = $driver->activeAssignment;
        if ($activeAssignment) {
            $vehicle = $activeAssignment->vehicle;
            if ($vehicle) {
                $vehicle->update([
                    'durum' => 'aktif',
                    'zimmet_surucu_adi' => null,
                ]);
            }
            $activeAssignment->update([
                'durum' => 'tamamlandi',
                'iade_tarihi' => Carbon::now(),
            ]);
        }

        $name = $driver->ad_soyad;
        $driver->delete();

        return back()->with('success', "{$name} isimli sürücü filodan silindi.");
    }

    public function assign(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'arac_id' => 'required|exists:araclar,id',
            'surucu_id' => 'required|exists:suruculer,id',
            'teslim_tarihi' => 'required|date',
            'baslangic_km' => 'required|integer|min:0',
            'yakit_seviyesi' => 'nullable|string|max:30',
            'teslim_notu' => 'nullable|string',
        ]);

        $vehicle = Vehicle::where('kullanici_id', $user->id)->findOrFail($validated['arac_id']);
        $driver = Driver::where('kullanici_id', $user->id)->findOrFail($validated['surucu_id']);

        // Eğer aracın veya sürücünün önceki aktif zimmeti varsa kapat
        VehicleAssignment::where('arac_id', $vehicle->id)
            ->where('durum', 'aktif')
            ->update([
                'durum' => 'tamamlandi',
                'iade_tarihi' => Carbon::parse($validated['teslim_tarihi']),
            ]);

        VehicleAssignment::where('surucu_id', $driver->id)
            ->where('durum', 'aktif')
            ->update([
                'durum' => 'tamamlandi',
                'iade_tarihi' => Carbon::parse($validated['teslim_tarihi']),
            ]);

        $tutanakNo = 'ZMM-' . date('Ymd') . '-' . rand(100, 999);

        // Yeni zimmet oluştur
        $assignment = VehicleAssignment::create([
            'arac_id' => $vehicle->id,
            'surucu_id' => $driver->id,
            'kullanici_id' => $user->id,
            'teslim_tarihi' => $validated['teslim_tarihi'],
            'baslangic_km' => $validated['baslangic_km'],
            'yakit_seviyesi' => $validated['yakit_seviyesi'] ?? '%100',
            'tutanak_no' => $tutanakNo,
            'durum' => 'aktif',
            'teslim_notu' => $validated['teslim_notu'] ?? null,
        ]);

        // Araç durumunu ve zimmetli sürücüyü güncelle
        $vehicle->update([
            'durum' => 'gorevde',
            'zimmet_surucu_adi' => $driver->ad_soyad,
            'guncel_km' => max($vehicle->guncel_km, (int) $validated['baslangic_km']),
            'departman' => $driver->departman ?: $vehicle->departman,
        ]);

        return back()->with('success', "{$vehicle->plaka} plakalı araç {$driver->ad_soyad} adına başarıyla zimmetlendi. (Tutanak No: {$tutanakNo})");
    }

    public function release(Request $request, $id)
    {
        $user = Auth::user();
        $assignment = VehicleAssignment::where('kullanici_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'iade_tarihi' => 'required|date',
            'bitis_km' => 'required|integer|min:' . $assignment->baslangic_km,
            'iade_notu' => 'nullable|string',
        ]);

        $assignment->update([
            'iade_tarihi' => $validated['iade_tarihi'],
            'bitis_km' => $validated['bitis_km'],
            'durum' => 'tamamlandi',
            'iade_notu' => $validated['iade_notu'] ?? null,
        ]);

        // Aracı boşa çıkar ve son KM'yi güncelle
        $vehicle = $assignment->vehicle;
        if ($vehicle) {
            $vehicle->update([
                'durum' => 'aktif',
                'zimmet_surucu_adi' => null,
                'guncel_km' => max($vehicle->guncel_km, (int) $validated['bitis_km']),
            ]);
        }

        $katEdilenKm = (int) $validated['bitis_km'] - $assignment->baslangic_km;

        return back()->with('success', "Zimmet teslim alındı. Araç filoda aktif/boşta durumuna geçti. (Kat edilen yol: {$katEdilenKm} KM)");
    }
}
