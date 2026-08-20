<?php

namespace App\Services;

use App\Models\Vehicle;
use Carbon\Carbon;

class SmartDiagnosisService
{
    /**
     * Araç için dinamik, motor, yakıt ve şanzıman türüne özel yapay zeka teşhis raporu üretir.
     */
    public function analyze(Vehicle $vehicle): array
    {
        $maintenances = $vehicle->maintenances;
        $currentKm = (int) ($vehicle->guncel_km ?? 0);
        $year = (int) ($vehicle->yil ?? date('Y'));
        $age = max(0, (int) date('Y') - $year);
        $motorStr = mb_strtolower($vehicle->motor ?? '', 'UTF-8');
        $modelStr = mb_strtolower($vehicle->model ?? '', 'UTF-8');
        $brandStr = mb_strtolower($vehicle->marka ?? '', 'UTF-8');
        $vitesTuru = $vehicle->vites_turu ?? 'Manuel';

        // ═══════════════════════════════════════════════════════════════
        // 1. YAKIT VE MOTOR TİPİNİ DERİNLEMESİNE TESPİT ET
        // ═══════════════════════════════════════════════════════════════
        $fuelType = 'Benzin';
        if (preg_match('/elektrik|elettrica|electric|ev|kwh|bev|blade/i', $motorStr) || 
            preg_match('/t10x|t10f|tesla|model y|model 3|model s|model x|taycan|ioniq|byd|seal|atto|dolphin|zoe|spring|e-tron|eq[abcde]/i', $modelStr . ' ' . $brandStr)) {
            $fuelType = 'Elektrik';
        } elseif (preg_match('/phev|plug-in|hybrid|hibrit|mhev|ibrida|e-tech|e:hev|e-power|mild hybrid/i', $motorStr . ' ' . $modelStr)) {
            $fuelType = 'Hibrit';
        } elseif (preg_match('/lpg|eco-g|eko|autogas/i', $motorStr . ' ' . $modelStr)) {
            $fuelType = 'LPG & Benzin';
        } elseif (preg_match('/dci|tdi|multijet|dizel|diesel|crdi|bluehdi|hdi|tdci|cdti|jtd|jtdm|cdi|d-4d|di-d|mz-cd|ddis/i', $motorStr)) {
            $fuelType = 'Dizel';
        }

        // ═══════════════════════════════════════════════════════════════
        // 2. ŞANZIMAN TİPİNİ TESPİT ET
        // ═══════════════════════════════════════════════════════════════
        $isAutomatic = false;
        if (strcasecmp($vitesTuru, 'Otomatik') === 0 || 
            preg_match('/dsg|edc|dct|ddct|eat6|eat8|7g|9g|s-tronic|tiptronic|powershift|cvt|e-cvt|multidrive|steptronic|zf/i', $motorStr)) {
            $isAutomatic = true;
            $transmissionLabel = 'Otomatik (Çift Kavrama / Tork Konvertörlü / CVT)';
        } else {
            $transmissionLabel = 'Manuel (Düz Vites)';
        }

        $score = 100;
        $criticalWarnings = [];
        $routineAdvices = [];
        $completedChecks = [];

        // ═══════════════════════════════════════════════════════════════
        // 3. SIVI VE MOTOR YAĞI ANALİZİ (Elektrikli Araçlar Hariç)
        // ═══════════════════════════════════════════════════════════════
        if ($fuelType !== 'Elektrik') {
            $lastOil = $maintenances->first(function ($m) {
                $type = mb_strtolower($m->islem_turu, 'UTF-8');
                return str_contains($type, 'periyodik') || str_contains($type, 'yağ') || str_contains($type, 'yag') || str_contains($type, 'filtre');
            });

            if (!$lastOil) {
                $score -= 25;
                $criticalWarnings[] = "Sistemde motor yağı ve filtre değişim kaydı bulunamadı. Yağlama filmi kaybı motor ömrünü riske atar.";
            } else {
                $diffKm = $currentKm - (int) $lastOil->islem_km;
                if ($diffKm > 15000) {
                    $score -= 30;
                    $criticalWarnings[] = "Motor yağı değişim periyodu " . number_format($diffKm - 10000, 0, ',', '.') . " KM aşıldı! Viskozite kaybı kritik seviyede.";
                } elseif ($diffKm > 10000) {
                    $score -= 10;
                    $routineAdvices[] = "Motor yağı ve hava/yağ filtrelerinin servis ömrü dolmak üzere (" . number_format($diffKm, 0, ',', '.') . " KM oldu), periyodik bakım planlanmalı.";
                } else {
                    $completedChecks[] = "Motor yağı ve filtre kondisyonu ideal seviyede. (Son Değişim: " . number_format($lastOil->islem_km, 0, ',', '.') . " KM)";
                }
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // 4. YAKIT TÜRÜNE ÖZEL ANALİZ VE ÖNERİLER
        // ═══════════════════════════════════════════════════════════════
        if ($fuelType === 'Dizel') {
            // Dizel Yakıt Filtresi & DPF
            $lastFuelFilter = $maintenances->first(function ($m) {
                return preg_match('/mazot|yakıt filtresi|yakit filtresi/i', $m->islem_turu);
            });
            if (!$lastFuelFilter && $currentKm > 30000) {
                $routineAdvices[] = "Dizel Yakıt Sistemi: Mazot filtresi değişimi ve su tahliyesi yapılmalıdır (Yüksek basınç pompası koruması).";
            }

            if ($currentKm > 80000) {
                $routineAdvices[] = "Emisyon & DPF: Dizel Partikül Filtresi (DPF) kurum doluluk oranı ve EGR valfi kirliliği diyagnostik cihazla taranmalı.";
            }
            if ($currentKm > 130000) {
                $criticalWarnings[] = "Enjeksiyon Analizi: Common-rail enjektör geri dönüş debileri ve kızdırma bujisi rezistans değerleri kontrol edilmelidir.";
            }
        } elseif ($fuelType === 'Benzin') {
            // Benzinli Buji & Ateşleme
            $lastSpark = $maintenances->first(function ($m) {
                return preg_match('/buji|ateşleme|bobin/i', $m->islem_turu);
            });
            if (!$lastSpark && $currentKm > 45000) {
                $score -= 10;
                $routineAdvices[] = "Benzinli Ateşleme Sistemi: Buji ve ateşleme bobinlerinin elektrot aralığı ölçülmeli (TSI/TCe/PureTech misfire önleme).";
            } elseif ($lastSpark) {
                $completedChecks[] = "Ateşleme sistemi buji bakımları güncel kayıtlı.";
            }

            if ($currentKm > 70000) {
                $routineAdvices[] = "Yakıt Besleme: Direkt enjeksiyonlu motorlarda emme sübaplarında ve boğaz kelebeğinde karbon temizliği önerilir.";
            }
        } elseif ($fuelType === 'LPG & Benzin') {
            // LPG Özel
            $lastLpg = $maintenances->first(function ($m) {
                return preg_match('/lpg|gaz filtresi/i', $m->islem_turu);
            });
            if (!$lastLpg && $currentKm > 10000) {
                $routineAdvices[] = "LPG Sistemi: Sıvı ve gaz fazı LPG filtre değişimi ile gaz regülatörü sızdırmazlık testi yapılmalıdır.";
            }
            $routineAdvices[] = "Sübap Boşluğu: LPG kuru yanma yaptığından sübap erimesine karşı sübap boşluk toleransları ölçülmelidir.";
        } elseif ($fuelType === 'Hibrit') {
            // Hibrit Özel
            $routineAdvices[] = "Hibrit Batarya: Yüksek voltaj bataryası soğutma fanı ızgarası toz temizliği ve invertör soğutma sıvısı kontrol edilmeli.";
            $completedChecks[] = "Hibrit çift motorlu güç aktarım sistemi aktif analiz ediliyor.";
        } elseif ($fuelType === 'Elektrik') {
            // Tam Elektrikli Özel
            $routineAdvices[] = "Batarya Sağlığı (SOH): Yüksek voltaj batarya paketi hücre voltaj dengesi ve State of Health yüzdesi diyagnoz edilmeli.";
            $routineAdvices[] = "Termal Yönetim: Batarya ve elektrik motoru termal soğutma sıvı seviyeleri kontrol edilmeli.";
            $routineAdvices[] = "Redüktör Sıvısı: Elektrik motoru dişli redüktör yağı kondisyonu kontrol edilmeli.";
            $completedChecks[] = "Sıfır emisyonlu tam elektrikli tahrik sistemi (Motor yağı, buji, DPF ve triger ihtiyacı yok).";
        }

        // ═══════════════════════════════════════════════════════════════
        // 5. ŞANZIMAN TÜRÜNE ÖZEL AKILLI KONTROLLER
        // ═══════════════════════════════════════════════════════════════
        if ($isAutomatic) {
            $lastGearbox = $maintenances->first(function ($m) {
                return preg_match('/şanzıman|sanziman|dsg|edc|yağ.*şanzıman|atf|mekatronik/i', $m->islem_turu);
            });

            if (!$lastGearbox && $currentKm > 60000) {
                $score -= 10;
                $routineAdvices[] = "Otomatik Şanzıman: Şanzıman hidrolik yağı (ATF/DSG) ve mekatronik filtresi değişim periyodu yaklaşmış / aşıldı (Kavrama ömrü için 60.000 KM'de bir önerilir).";
            } elseif ($lastGearbox) {
                $completedChecks[] = "Otomatik şanzıman yağ ve mekatronik bakımı sisteme işlenmiş.";
            } else {
                $completedChecks[] = "Otomatik şanzıman çalışma toleransı nominal.";
            }
        } else {
            // Manuel Şanzıman
            $lastClutch = $maintenances->first(function ($m) {
                return preg_match('/baskı|baski|balata.*debriyaj|debriyaj/i', $m->islem_turu);
            });

            if (!$lastClutch && $currentKm > 90000) {
                $routineAdvices[] = "Manuel Şanzıman & Debriyaj: Baskı balata seti kavrama noktası, debriyaj rulmanı ve şanzıman dişli yağı kontrol edilmeli.";
            } elseif ($lastClutch) {
                $completedChecks[] = "Debriyaj baskı balata seti değişimi güncel.";
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // 6. AĞIR BAKIM (TRİGER / ZAMANLAMA ZİNCİRİ - Elektrikli Hariç)
        // ═══════════════════════════════════════════════════════════════
        if ($currentKm > 90000 && $fuelType !== 'Elektrik') {
            $timingBelt = $maintenances->first(function ($m) {
                return preg_match('/ağır|agir|triger|zincir|zamanlama/i', $m->islem_turu);
            });
            if (!$timingBelt) {
                $score -= 20;
                $criticalWarnings[] = "Ağır Bakım: Triger kayışı / eksantrik zinciri değişim kaydı yok. Kopma durumunda sübap eğilmesi ve ağır motor hasarı riski!";
            } else {
                $completedChecks[] = "Ağır bakım (Triger/Zamanlama seti) güncel kayıtlı.";
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // 7. FREN SİSTEMİ
        // ═══════════════════════════════════════════════════════════════
        $lastBrake = $maintenances->first(function ($m) {
            return preg_match('/fren|balata|disk|hidrolik/i', $m->islem_turu);
        });
        if (!$lastBrake && $currentKm > 40000) {
            $score -= 10;
            $routineAdvices[] = "Fren Sistemi: Ön/arka fren balata et kalınlıkları ve fren hidrolik sıvısı nem oranı ölçülmelidir.";
        } elseif ($lastBrake) {
            $completedChecks[] = "Fren balata ve sürtünme yüzeyleri bakımı sisteme işlenmiş.";
        }

        // ═══════════════════════════════════════════════════════════════
        // 8. YAŞ VE ALT TAKIM YORGUNLUĞU
        // ═══════════════════════════════════════════════════════════════
        if ($age > 7 || $currentKm > 100000) {
            $score -= 5;
            $routineAdvices[] = "Yürüyen Aksam: Amortisör takozları, salıncak burçları, z-rotlar ve kauçuk hortumlar kontrol edilmelidir.";
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
            'fuel_type' => $fuelType,
            'motor_type' => $fuelType,
            'transmission' => $transmissionLabel,
            'is_automatic' => $isAutomatic,
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
