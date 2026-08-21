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

        // Kullanıcıya ait tüm araçları ilişkileriyle çek
        $vehicles = Vehicle::where('kullanici_id', $user->id)
            ->with([
                'maintenances' => function($q) {
                    $q->orderBy('islem_tarihi', 'desc');
                },
                'accidents' => function($q) {
                    $q->orderBy('kaza_tarihi', 'desc');
                },
                'reminders'
            ])
            ->orderBy('id', 'asc')
            ->get();

        $today = Carbon::today();

        // Filo Metrik Hesaplamaları
        $totalVehicles = $vehicles->count();
        $activeCount = $vehicles->where('durum', 'aktif')->count() + $vehicles->whereNull('durum')->count();
        $onDutyCount = $vehicles->where('durum', 'gorevde')->count();
        $inServiceCount = $vehicles->where('durum', 'serviste')->count();
        $idleCount = $vehicles->where('durum', 'atil')->count();

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

            return [
                'id' => $v->id,
                'plaka' => $v->plaka,
                'marka' => $v->marka,
                'model' => $v->model,
                'yil' => $v->yil,
                'motor' => $v->motor,
                'ruhsat_tipi' => $v->ruhsat_tipi,
                'guncel_km' => $v->guncel_km,
                'fotograf_url' => $v->fotograf_url,
                'qr_token' => $v->qr_token,
                'durum' => $v->durum ?: 'aktif',
                'zimmet_surucu_adi' => $v->zimmet_surucu_adi,
                'departman' => $v->departman ?: 'Genel / Havuz',
                'sozlesme_turu' => $v->sozlesme_turu ?: 'oz_mal',
                'muayene_bitis' => $v->muayene_bitis ? $v->muayene_bitis->format('Y-m-d') : null,
                'muayene_days' => $muayeneDays,
                'sigorta_bitis' => $v->sigorta_bitis ? $v->sigorta_bitis->format('Y-m-d') : null,
                'sigorta_days' => $sigortaDays,
                'kasko_bitis' => $v->kasko_bitis ? $v->kasko_bitis->format('Y-m-d') : null,
                'kasko_days' => $kaskoDays,
                'total_spent' => $mCost,
                'total_damage' => $dCost,
                'tramer_total' => $tCost,
                'maintenance_count' => $v->maintenances->count(),
                'accident_count' => $v->accidents->count(),
                'last_maintenance' => $v->maintenances->first() ? [
                    'tarih' => $v->maintenances->first()->islem_tarihi ? $v->maintenances->first()->islem_tarihi->format('d.m.Y') : null,
                    'islem_turu' => $v->maintenances->first()->islem_turu,
                    'maliyet_tl' => $v->maintenances->first()->maliyet_tl,
                ] : null,
            ];
        });

        $avgKm = $totalVehicles > 0 ? round($totalKm / $totalVehicles) : 0;
        $totalFleetExpense = $totalMaintenanceExpense + $totalDamageExpense;

        return Inertia::render('Fleet/Dashboard', [
            'vehicles' => $formattedVehicles,
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
     * Araç Durumu & Zimmet Güncelleme
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        $vehicle = Vehicle::where('id', $id)->where('kullanici_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'durum' => 'required|string|in:aktif,serviste,gorevde,atil,satildi',
            'zimmet_surucu_adi' => 'nullable|string|max:255',
            'departman' => 'nullable|string|max:255',
            'guncel_km' => 'nullable|numeric|min:0',
        ]);

        $vehicle->update($validated);

        return redirect()->back()->with('success', 'Araç durumu ve bilgileri başarıyla güncellendi.');
    }
}
