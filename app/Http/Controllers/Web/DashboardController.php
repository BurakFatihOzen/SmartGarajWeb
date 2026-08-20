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

        if ($activeVehicle) {
            $maintenances = $activeVehicle->maintenances()->orderBy('islem_tarihi', 'desc')->get();
            $totalSpent = (float) $activeVehicle->maintenances()->sum('maliyet_tl');

            // Son 6 ayın harcama dağılımı (ApexCharts için)
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
        }

        return Inertia::render('Dashboard', [
            'vehicles' => $vehicles,
            'activeVehicle' => $activeVehicle,
            'maintenances' => $maintenances,
            'totalSpent' => $totalSpent,
            'allVehiclesCount' => $allVehiclesCount,
            'monthlyStats' => $monthlyStats,
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
