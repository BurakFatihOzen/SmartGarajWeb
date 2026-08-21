<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Herkese Açık Doğrulanabilir Araç Dijital Servis Pasaportu (QR Doğrulama)
     */
    public function verifyPassport($token)
    {
        $vehicle = Vehicle::where('qr_token', $token)
            ->with([
                'maintenances' => function($q) {
                    $q->orderBy('islem_tarihi', 'desc');
                },
                'accidents' => function($q) {
                    $q->orderBy('kaza_tarihi', 'desc');
                }
            ])
            ->firstOrFail();

        $verifyUrl = route('passport.verify', ['token' => $vehicle->qr_token]);
        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" . urlencode($verifyUrl);

        return Inertia::render('Public/VehiclePassport', [
            'vehicle' => $vehicle,
            'qrCodeUrl' => $qrCodeUrl,
            'verifyUrl' => $verifyUrl,
            'totalSpent' => $vehicle->total_spent,
            'totalDamage' => $vehicle->total_damage,
            'tramerTotal' => $vehicle->tramer_total,
            'maintenanceCount' => $vehicle->maintenance_count,
            'accidentCount' => $vehicle->accident_count,
        ]);
    }

    /**
     * PDF / Yazdırılabilir Servis Raporu Görünümü
     */
    public function printReport($id)
    {
        $vehicle = Vehicle::with([
            'maintenances' => function($q) {
                $q->orderBy('islem_tarihi', 'desc');
            },
            'accidents' => function($q) {
                $q->orderBy('kaza_tarihi', 'desc');
            }
        ])->findOrFail($id);

        if (empty($vehicle->qr_token)) {
            $vehicle->update(['qr_token' => bin2hex(random_bytes(16))]);
        }

        $verifyUrl = route('passport.verify', ['token' => $vehicle->qr_token]);
        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" . urlencode($verifyUrl);

        return view('reports.service-passport', [
            'vehicle' => $vehicle,
            'qrCodeUrl' => $qrCodeUrl,
            'verifyUrl' => $verifyUrl,
            'totalSpent' => $vehicle->total_spent,
            'totalDamage' => $vehicle->total_damage,
            'tramerTotal' => $vehicle->tramer_total,
        ]);
    }

    /**
     * Araç Dijital Pasaportuna Doğrudan Erişim
     */
    public function showPassport($id)
    {
        $vehicle = Vehicle::findOrFail($id);

        if (empty($vehicle->qr_token)) {
            $vehicle->update(['qr_token' => bin2hex(random_bytes(16))]);
        }

        return redirect()->route('passport.verify', ['token' => $vehicle->qr_token]);
    }
}
