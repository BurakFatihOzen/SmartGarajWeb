<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Accident;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class FleetController extends Controller
{
    /**
     * SmartFilo — Filo Yönetim Paneli Ana Görünümü
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Bireysel kullanıcı filo portalına girmeye çalışırsa kendi garajına yönlendir
        if ($user && !$user->isFleet()) {
            return redirect()->route('dashboard')->with('info', 'SmartFilo Operasyon Portalı yalnızca Kurumsal Filo hesapları içindir.');
        }

        $drivers = \App\Models\Driver::where('kullanici_id', $user->id)
            ->with(['activeAssignment.vehicle'])
            ->orderBy('ad_soyad', 'asc')
            ->get();

        // Kullanıcıya ait tüm araçları ilişkileriyle çek
        $vehicles = Vehicle::where('kullanici_id', $user->id)
            ->with([
                'maintenances' => function($q) {
                    $q->orderBy('islem_tarihi', 'desc');
                },
                'accidents' => function($q) {
                    $q->orderBy('kaza_tarihi', 'desc');
                },
                'assignments.driver',
                'activeAssignment.driver',
                'fines',
                'fuelLogs',
                'reminders'
            ])
            ->orderBy('id', 'asc')
            ->get();

        $today = Carbon::today();

        // Filo Metrik Hesaplamaları
        $totalVehicles = $vehicles->count();
        $activeCount = $vehicles->whereIn('durum', ['aktif', null])->count();
        $onDutyCount = $vehicles->where('durum', 'gorevde')->count();
        $inServiceCount = $vehicles->whereIn('durum', ['serviste', 'hasarli', 'muayenede'])->count();
        $idleCount = $vehicles->whereIn('durum', ['atil', 'satildi', 'kiralik_iade'])->count();

        $totalMaintenanceExpense = 0;
        $totalDamageExpense = 0;
        $totalTramer = 0;
        $totalKm = 0;
        $expiringInspections = 0;
        $expiringInsurances = 0;
        $expiringKaskos = 0;

        $departmentMap = [];
        $brandMap = [];

        $formattedVehicles = $vehicles->map(function ($v) use (
            $today,
            &$totalMaintenanceExpense,
            &$totalDamageExpense,
            &$totalTramer,
            &$totalKm,
            &$expiringInspections,
            &$expiringInsurances,
            &$expiringKaskos,
            &$departmentMap,
            &$brandMap
        ) {
            $mCost = (float) $v->maintenances->sum('maliyet_tl');
            $dCost = (float) $v->accidents->sum('hasar_tutari');
            $tCost = (float) $v->accidents->where('tramer_kaydi', true)->sum('tramer_tutari');
            $fuelCost = (float) $v->fuelLogs->sum('toplam_tutar');
            $finesCost = (float) $v->fines->sum('tutar');
            $unpaidFinesCost = (float) $v->fines->where('durum', 'odenmedi')->sum('tutar');

            $totalMaintenanceExpense += $mCost;
            $totalDamageExpense += $dCost;
            $totalTramer += $tCost;
            $totalKm += (int) $v->guncel_km;

            // Muayene süresi
            $muayeneDays = null;
            if ($v->muayene_bitis) {
                $muayeneDays = (int) $today->diffInDays(Carbon::parse($v->muayene_bitis)->startOfDay(), false);
                if ($muayeneDays <= 30) $expiringInspections++;
            }

            // Sigorta süresi
            $sigortaDays = null;
            if ($v->sigorta_bitis) {
                $sigortaDays = (int) $today->diffInDays(Carbon::parse($v->sigorta_bitis)->startOfDay(), false);
                if ($sigortaDays <= 30) $expiringInsurances++;
            }

            // Kasko süresi
            $kaskoDays = null;
            if ($v->kasko_bitis) {
                $kaskoDays = (int) $today->diffInDays(Carbon::parse($v->kasko_bitis)->startOfDay(), false);
                if ($kaskoDays <= 30) $expiringKaskos++;
            }

            // Departman ve Marka dağılımı
            $dept = $v->departman ?: 'Genel / Havuz';
            $departmentMap[$dept] = ($departmentMap[$dept] ?? 0) + 1;

            $brand = $v->marka ?: 'Diğer';
            $brandMap[$brand] = ($brandMap[$brand] ?? 0) + 1;

            // Son 5 bakım
            $recentMaintenances = $v->maintenances->take(5)->map(function($m) {
                return [
                    'id' => $m->id,
                    'islem_tarihi' => $m->islem_tarihi ? $m->islem_tarihi->format('Y-m-d') : null,
                    'islem_turu' => $m->islem_turu,
                    'islem_km' => $m->islem_km,
                    'maliyet_tl' => $m->maliyet_tl,
                    'servis_adi' => $m->servis_adi,
                    'aciklama' => $m->aciklama,
                ];
            });

            // Son 5 kaza
            $recentAccidents = $v->accidents->take(5)->map(function($a) {
                return [
                    'id' => $a->id,
                    'kaza_tarihi' => $a->kaza_tarihi ? $a->kaza_tarihi->format('Y-m-d') : null,
                    'kaza_km' => $a->kaza_km,
                    'kaza_turu' => $a->kaza_turu,
                    'hasar_tutari' => $a->hasar_tutari,
                    'tramer_kaydi' => (bool) $a->tramer_kaydi,
                    'tramer_tutari' => $a->tramer_tutari,
                    'kusur_orani' => $a->kusur_orani,
                    'sigorta_sirketi' => $a->sigorta_sirketi,
                    'dosya_no' => $a->dosya_no,
                    'dosya_durumu' => $a->dosya_durumu,
                    'aciklama' => $a->aciklama,
                    'hasarli_parcalar' => $a->hasarli_parcalar,
                ];
            });

            // Aktif Zimmet
            $activeAssn = $v->activeAssignment;
            $activeAssnData = $activeAssn ? [
                'id' => $activeAssn->id,
                'surucu_id' => $activeAssn->surucu_id,
                'surucu_adi' => $activeAssn->driver ? $activeAssn->driver->ad_soyad : $v->zimmet_surucu_adi,
                'surucu_telefon' => $activeAssn->driver ? $activeAssn->driver->telefon : null,
                'surucu_departman' => $activeAssn->driver ? $activeAssn->driver->departman : null,
                'teslim_tarihi' => $activeAssn->teslim_tarihi ? $activeAssn->teslim_tarihi->format('Y-m-d') : null,
                'baslangic_km' => $activeAssn->baslangic_km,
                'yakit_seviyesi' => $activeAssn->yakit_seviyesi,
                'tutanak_no' => $activeAssn->tutanak_no,
                'teslim_notu' => $activeAssn->teslim_notu,
            ] : null;

            return [
                'id' => $v->id,
                'plaka' => $v->plaka,
                'marka' => $v->marka,
                'model' => $v->model,
                'yil' => $v->yil,
                'motor' => $v->motor,
                'yakit_turu' => $v->yakit_turu,
                'vites_turu' => $v->vites_turu,
                'ruhsat_tipi' => $v->ruhsat_tipi,
                'sasi_no' => $v->sasi_no,
                'notlar' => $v->notlar,
                'guncel_km' => $v->guncel_km,
                'fotograf_url' => $v->fotograf_url,
                'qr_token' => $v->qr_token,
                'durum' => $v->durum ?: 'aktif',
                'zimmet_surucu_adi' => $v->zimmet_surucu_adi,
                'departman' => $v->departman ?: 'Genel / Havuz',
                'sozlesme_turu' => $v->sozlesme_turu ?: 'Özmal',
                'muayene_bitis' => $v->muayene_bitis ? $v->muayene_bitis->format('Y-m-d') : null,
                'muayene_days' => $muayeneDays,
                'sigorta_bitis' => $v->sigorta_bitis ? $v->sigorta_bitis->format('Y-m-d') : null,
                'sigorta_days' => $sigortaDays,
                'kasko_bitis' => $v->kasko_bitis ? $v->kasko_bitis->format('Y-m-d') : null,
                'kasko_days' => $kaskoDays,
                'total_spent' => $mCost,
                'total_damage' => $dCost,
                'tramer_total' => $tCost,
                'fuel_expense' => $fuelCost,
                'fines_total' => $finesCost,
                'unpaid_fines' => $unpaidFinesCost,
                'maintenance_count' => $v->maintenances->count(),
                'accident_count' => $v->accidents->count(),
                'recent_maintenances' => $recentMaintenances,
                'recent_accidents' => $recentAccidents,
                'active_assignment' => $activeAssnData,
                'last_maintenance' => $recentMaintenances->first() ?? null,
            ];
        });

        $avgKm = $totalVehicles > 0 ? round($totalKm / $totalVehicles) : 0;
        $totalFleetExpense = $totalMaintenanceExpense + $totalDamageExpense;

        return Inertia::render('Fleet/Dashboard', [
            'vehicles' => $formattedVehicles,
            'drivers' => $drivers,
            'kpis' => [
                'totalVehicles' => $totalVehicles,
                'activeCount' => $activeCount,
                'onDutyCount' => $onDutyCount,
                'inServiceCount' => $inServiceCount,
                'idleCount' => $idleCount,
                'totalFleetExpense' => $totalFleetExpense,
                'totalMaintenanceExpense' => $totalMaintenanceExpense,
                'totalDamageExpense' => $totalDamageExpense,
                'totalTramer' => $totalTramer,
                'avgKm' => $avgKm,
                'expiringInspections' => $expiringInspections,
                'expiringInsurances' => $expiringInsurances,
                'expiringKaskos' => $expiringKaskos,
            ],
            'departmentDistribution' => $departmentMap,
            'brandDistribution' => $brandMap,
        ]);
    }

    /**
     * Araç Durumu & Zimmet & Departman Güncelleme
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        $vehicle = Vehicle::where('id', $id)->where('kullanici_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'durum' => 'required|string|in:aktif,gorevde,serviste,hasarli,muayenede,atil,satildi,kiralik_iade',
            'surucu_id' => 'nullable|string', // numeric id, 'unassign', or empty
            'zimmet_surucu_adi' => 'nullable|string|max:255',
            'departman' => 'nullable|string|max:255',
            'sozlesme_turu' => 'nullable|string|max:255',
            'guncel_km' => 'nullable|numeric|min:0',
            'notlar' => 'nullable|string',
            'action_type' => 'nullable|string', // 'unassign', 'assign', 'update_status'
            'yakit_seviyesi' => 'nullable|string|max:30',
        ]);

        $status = $validated['durum'];
        $surucuId = $validated['surucu_id'] ?? null;
        $driverName = $validated['zimmet_surucu_adi'] ?? null;
        $km = isset($validated['guncel_km']) ? (int) $validated['guncel_km'] : $vehicle->guncel_km;

        // 1. ZİMMETTEN ÇIKARMA (HAVUZA ALMA)
        if ($validated['action_type'] === 'unassign' || $surucuId === 'unassign' || ($status === 'aktif' && $vehicle->durum === 'gorevde' && empty($surucuId))) {
            // Aktif zimmeti kapat
            $activeAssn = \App\Models\VehicleAssignment::where('arac_id', $vehicle->id)
                ->where('durum', 'aktif')
                ->first();

            if ($activeAssn) {
                $activeAssn->update([
                    'durum' => 'tamamlandi',
                    'iade_tarihi' => Carbon::now(),
                    'bitis_km' => $km,
                    'iade_notu' => 'Filo yönetim panelinden havuza iade edildi.',
                ]);
            }

            $vehicle->update([
                'durum' => 'aktif',
                'zimmet_surucu_adi' => null,
                'departman' => $validated['departman'] ?? $vehicle->departman,
                'sozlesme_turu' => $validated['sozlesme_turu'] ?? $vehicle->sozlesme_turu,
                'guncel_km' => $km,
                'notlar' => $validated['notlar'] ?? $vehicle->notlar,
            ]);

            return redirect()->back()->with('success', "{$vehicle->plaka} plakalı araç zimmetten çıkarıldı ve filoda aktif/havuz durumuna alındı.");
        }

        // 2. YENİ SÜRÜCÜYE ZİMMETLEME VEYA DEVRETME
        if (!empty($surucuId) && is_numeric($surucuId)) {
            $driver = \App\Models\Driver::where('kullanici_id', $user->id)->find($surucuId);

            if ($driver) {
                // Önceki zimmetleri kapat
                \App\Models\VehicleAssignment::where('arac_id', $vehicle->id)
                    ->where('durum', 'aktif')
                    ->update([
                        'durum' => 'tamamlandi',
                        'iade_tarihi' => Carbon::now(),
                        'bitis_km' => $km,
                    ]);

                \App\Models\VehicleAssignment::where('surucu_id', $driver->id)
                    ->where('durum', 'aktif')
                    ->update([
                        'durum' => 'tamamlandi',
                        'iade_tarihi' => Carbon::now(),
                        'bitis_km' => $km,
                    ]);

                $tutanakNo = 'ZMM-' . date('Ymd') . '-' . rand(100, 999);

                \App\Models\VehicleAssignment::create([
                    'arac_id' => $vehicle->id,
                    'surucu_id' => $driver->id,
                    'kullanici_id' => $user->id,
                    'teslim_tarihi' => Carbon::now(),
                    'baslangic_km' => $km,
                    'yakit_seviyesi' => $validated['yakit_seviyesi'] ?? '%100',
                    'tutanak_no' => $tutanakNo,
                    'durum' => 'aktif',
                    'teslim_notu' => 'Filo panelinden zimmetlendi / devredildi.',
                ]);

                $driverName = $driver->ad_soyad;
                $status = 'gorevde';
            }
        } elseif (!empty($driverName)) {
            $status = 'gorevde';
        }

        $vehicle->update([
            'durum' => $status,
            'zimmet_surucu_adi' => $driverName,
            'departman' => $validated['departman'] ?? $vehicle->departman,
            'sozlesme_turu' => $validated['sozlesme_turu'] ?? $vehicle->sozlesme_turu,
            'guncel_km' => $km,
            'notlar' => $validated['notlar'] ?? $vehicle->notlar,
        ]);

        return redirect()->back()->with('success', "{$vehicle->plaka} plakalı aracın filo durumu ve zimmet bilgileri başarıyla güncellendi.");
    }
}
