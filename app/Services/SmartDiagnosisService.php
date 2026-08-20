<?php

namespace App\Services;

use App\Models\Vehicle;
use Carbon\Carbon;

class SmartDiagnosisService
{
    /**
     * Araç için dinamik akıllı teşhis raporu üretir.
     */
    public function analyze(Vehicle $vehicle): array
    {
        $maintenances = $vehicle->maintenances;
        $currentKm = (int) ($vehicle->guncel_km ?? 0);
        $year = (int) ($vehicle->yil ?? date('Y'));
        $age = (int) date('Y') - $year;
        $motorStr = strtolower($vehicle->motor ?? '');
        $modelStr = strtolower($vehicle->model ?? '');

        // 1. Motor Tipini Belirle
        $motorType = 'Benzinli';
        if (preg_match('/dci|tdi|multijet|dizel|crdi|bluehdi|tdci|cdti|jtd/i', $motorStr)) {
            $motorType = 'Dizel';
        } elseif (preg_match('/elektrik|ev|kw/i', $motorStr) || preg_match('/t10x|tesla|taycan|ionic|byd/i', $modelStr)) {
            $motorType = 'Elektrik';
        } elseif (preg_match('/hybrid|hibrit|mhev|phev/i', $motorStr)) {
            $motorType = 'Hibrit';
        }

        $score = 100;
        $criticalWarnings = [];
        $routineAdvices = [];
        $completedChecks = [];

        // 2. Sıvı ve Filtre Kontrolü (Elektrikli hariç)
        if ($motorType !== 'Elektrik') {
            $lastOil = $maintenances->first(function ($m) {
                $type = strtolower($m->islem_turu);
                return str_contains($type, 'periyodik') || str_contains($type, 'yağ') || str_contains($type, 'yag');
            });

            if (!$lastOil) {
                $score -= 25;
                $criticalWarnings[] = "Sistemde yağ değişim kaydı yok. Yağlama performansı kaybı motor ömrünü riske atar.";
            } else {
                $diffKm = $currentKm - $lastOil->islem_km;
                if ($diffKm > 15000) {
                    $score -= 30;
                    $criticalWarnings[] = "Yağ ömrü " . ($diffKm - 10000) . " KM aşıldı! Viskozite kaybı kritik seviyede.";
                } elseif ($diffKm > 10000) {
                    $score -= 10;
                    $routineAdvices[] = "Motor yağının ömrü dolmak üzere, periyodik bakım planlanmalı.";
                } else {
                    $completedChecks[] = "Sıvı ve filtre kondisyonu nominal seviyede. (Son Değişim: " . number_format($lastOil->islem_km, 0, ',', '.') . " KM)";
                }
            }
        }

        // 3. Dizel Özel Kontroller
        if ($motorType === 'Dizel') {
            if ($currentKm > 90000) {
                $routineAdvices[] = "Partikül Filtresi (DPF) doluluk oranı ve EGR valfi kurum seviyesi kontrol edilmeli.";
            }
            if ($currentKm > 130000) {
                $criticalWarnings[] = "Yüksek Basınç Analizi: Enjektör püskürtme değerleri ve kızdırma bujileri test edilmelidir.";
            }
        }

        // 4. Benzinli & Hibrit Özel
        if (in_array($motorType, ['Benzinli', 'Hibrit'])) {
            if ($currentKm > 60000) {
                $sparkPlug = $maintenances->first(function ($m) {
                    return preg_match('/buji|ateşleme/i', $m->islem_turu);
                });
                if (!$sparkPlug) {
                    $score -= 10;
                    $routineAdvices[] = "Ateşleme Sistemi: Buji ve bobinlerin elektriksel direnci ölçülmeli (Misfire riski).";
                } else {
                    $completedChecks[] = "Ateşleme sistemi bakımları güncel.";
                }
            }
        }

        // 5. Elektrikli Özel
        if ($motorType === 'Elektrik') {
            $routineAdvices[] = "Batarya SOH (State of Health) yüzdesi ve hücreler arası voltaj dengesi ölçülmeli.";
            $routineAdvices[] = "Elektrik motoru redüktör yağı ve batarya termal soğutma sıvıları kontrol edilmeli.";
            $completedChecks[] = "Sıfır emisyon ve elektrikli tahrik sistemi nominal.";
        }

        // 6. Ağır Bakım (Triger / Zincir)
        if ($currentKm > 90000 && $motorType !== 'Elektrik') {
            $timingBelt = $maintenances->first(function ($m) {
                return preg_match('/ağır|triger|zincir/i', $m->islem_turu);
            });
            if (!$timingBelt) {
                $score -= 20;
                $criticalWarnings[] = "Ağır Bakım: Triger kayışı/zinciri değişim periyodu belirsiz. Kopma riski!";
            } else {
                $completedChecks[] = "Ağır bakım (Zamanlama sistemi) güncel.";
            }
        }

        // 7. Fren Sistemi
        $lastBrake = $maintenances->first(function ($m) {
            return preg_match('/fren|balata|disk/i', $m->islem_turu);
        });
        if (!$lastBrake && $currentKm > 40000) {
            $score -= 10;
            $routineAdvices[] = "Fren Sistemi: Disk ve balata et kalınlıkları fiziki olarak ölçülmeli.";
        } elseif ($lastBrake) {
            $completedChecks[] = "Fren hidrolik ve sürtünme yüzeyleri bakımı sisteme işlenmiş.";
        }

        // 8. Yaş ve Alt Takım Yorgunluğu
        if ($age > 8 || $currentKm > 100000) {
            $score -= 5;
            $routineAdvices[] = "Yaş/KM Yorgunluğu: Kauçuk hortumlar, motor takozları ve alt takım burçları kontrol edilmeli.";
        }

        // Skor Sınırlandırma
        $score = max(0, min(100, $score));

        $statusLabel = 'Mükemmel';
        $statusColor = 'success';
        if ($score < 60) {
            $statusLabel = 'Kritik Dikkat Gerektiriyor';
            $statusColor = 'danger';
        } elseif ($score < 80) {
            $statusLabel = 'Orta / Bakım Yaklaşıyor';
            $statusColor = 'warning';
        }

        return [
            'vehicle_id' => $vehicle->id,
            'plate' => $vehicle->plaka,
            'brand_model' => "{$vehicle->marka} {$vehicle->model}",
            'motor_type' => $motorType,
            'current_km' => $currentKm,
            'age' => $age,
            'health_score' => $score,
            'status_label' => $statusLabel,
            'status_color' => $statusColor,
            'completed_checks' => $completedChecks,
            'critical_warnings' => $criticalWarnings,
            'routine_advices' => $routineAdvices,
            'analyzed_at' => Carbon::now()->toIso8601String(),
        ];
    }
}
