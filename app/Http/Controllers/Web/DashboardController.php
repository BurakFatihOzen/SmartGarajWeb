<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Services\SmartDiagnosisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $vehicles = $user->vehicles;
        $allVehiclesCount = $vehicles->count();

        // Aktif Seçili Araç (arac_id veya secili_arac)
        $selectedId = $request->query('arac_id', $request->query('secili_arac'));
        $activeVehicle = null;

        if ($selectedId) {
            $activeVehicle = $vehicles->firstWhere('id', (int) $selectedId);
        }

        if (!$activeVehicle && $vehicles->isNotEmpty()) {
            $activeVehicle = $vehicles->first();
        }

        $maintenances = collect();
        $totalSpent = 0;
        $monthlyStats = [];
        $categoryStats = [];
        $healthScore = 85;
        $upcomingAlertsCount = 0;

        if ($activeVehicle) {
            $maintenances = $activeVehicle->maintenances()->orderBy('islem_tarihi', 'desc')->get();
            $totalSpent = (float) $activeVehicle->maintenances()->sum('maliyet_tl');

            // Son 6 ayın harcama dağılımı (ApexCharts Trend için)
            $months = [
                '01' => 'Ocak', '02' => 'Şubat', '03' => 'Mart', '04' => 'Nisan',
                '05' => 'Mayıs', '06' => 'Haziran', '07' => 'Temmuz', '08' => 'Ağustos',
                '09' => 'Eylül', '10' => 'Ekim', '11' => 'Kasım', '12' => 'Aralık'
            ];

            for ($i = 5; $i >= 0; $i--) {
                $date = Carbon::now()->subMonths($i);
                $yearMonth = $date->format('Y-m');
                $monthKey = $date->format('m');
                $monthName = $months[$monthKey] ?? $date->format('M');

                $monthTotal = (float) $activeVehicle->maintenances()
                    ->whereRaw("TO_CHAR(islem_tarihi, 'YYYY-MM') = ?", [$yearMonth])
                    ->sum('maliyet_tl');

                $monthlyStats[] = [
                    'month' => $monthName,
                    'total' => $monthTotal,
                ];
            }

            // Kategori bazlı harcama dağılımı (Donut Grafik için)
            $catSummary = [];
            foreach ($maintenances as $m) {
                $type = $m->islem_turu ?: 'Genel Bakım';
                if (stripos($type, 'yağ') !== false || stripos($type, 'filtre') !== false || stripos($type, 'periyodik') !== false) {
                    $group = 'Periyodik Sıvı & Filtre';
                } elseif (stripos($type, 'fren') !== false || stripos($type, 'balata') !== false || stripos($type, 'disk') !== false) {
                    $group = 'Fren & Yürüyen Aksam';
                } elseif (stripos($type, 'triger') !== false || stripos($type, 'debriyaj') !== false || stripos($type, 'ağır') !== false) {
                    $group = 'Ağır Bakım & Motor';
                } elseif (stripos($type, 'muayene') !== false || stripos($type, 'sigorta') !== false) {
                    $group = 'Yasal Vadeler & Harç';
                } else {
                    $group = 'Diğer Onarımlar';
                }
                $catSummary[$group] = ($catSummary[$group] ?? 0) + (float) $m->maliyet_tl;
            }

            foreach ($catSummary as $catName => $amount) {
                $categoryStats[] = [
                    'category' => $catName,
                    'amount' => round($amount, 2),
                    'percentage' => $totalSpent > 0 ? round(($amount / $totalSpent) * 100, 1) : 0
                ];
            }

            // Sağlık Skoru Hesaplama (0-100)
            $score = 100;
            $now = Carbon::now();
            if ($activeVehicle->muayene_bitis && Carbon::parse($activeVehicle->muayene_bitis)->lt($now)) {
                $score -= 20;
            }
            if ($activeVehicle->sigorta_bitis && Carbon::parse($activeVehicle->sigorta_bitis)->lt($now)) {
                $score -= 15;
            }
            if ($maintenances->isEmpty()) {
                $score -= 15;
            } else {
                $lastMaintenance = $maintenances->first();
                if (Carbon::parse($lastMaintenance->islem_tarihi)->diffInMonths($now) > 12) {
                    $score -= 10;
                }
            }
            $healthScore = max(35, min(100, $score));
        }

        // Tüm filodaki yaklaşan veya süresi dolmuş yasal süre uyarıları (Muayene & Sigorta)
        foreach ($vehicles as $v) {
            $now = Carbon::now()->startOfDay();
            if ($v->muayene_bitis) {
                $mDate = Carbon::parse($v->muayene_bitis)->startOfDay();
                $diffDays = $now->diffInDays($mDate, false); // Pozitif: Gelecek gün, Negatif: Geçmiş gün
                if ($diffDays <= 30) {
                    $upcomingAlertsCount++;
                }
            }
            if ($v->sigorta_bitis) {
                $sDate = Carbon::parse($v->sigorta_bitis)->startOfDay();
                $diffDays = $now->diffInDays($sDate, false);
                if ($diffDays <= 30) {
                    $upcomingAlertsCount++;
                }
            }
        }

        return Inertia::render('Dashboard', [
            'vehicles' => $vehicles,
            'activeVehicle' => $activeVehicle,
            'maintenances' => $maintenances,
            'totalSpent' => $totalSpent,
            'allVehiclesCount' => $allVehiclesCount,
            'monthlyStats' => $monthlyStats,
            'categoryStats' => $categoryStats,
            'healthScore' => $healthScore,
            'upcomingAlertsCount' => $upcomingAlertsCount,
        ]);
    }

    public function diagnosis(Request $request, $id, SmartDiagnosisService $diagnosisService)
    {
        $vehicle = Auth::user()->vehicles()->with('maintenances')->findOrFail($id);
        $report = $diagnosisService->analyze($vehicle);

        return response()->json([
            'status' => 'success',
            'data' => $report,
        ]);
    }
}
