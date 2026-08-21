<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Models\Maintenance;
use Carbon\Carbon;

class InvoiceAuditService
{
    /**
     * Parça bazlı standart değişim periyotları (KM ve Ay cinsinden)
     */
    protected array $partThresholds = [
        'yağ' => ['km' => 10000, 'months' => 12, 'name' => 'Motor Yağı'],
        'filtre' => ['km' => 10000, 'months' => 12, 'name' => 'Filtreler'],
        'balata' => ['km' => 30000, 'months' => 24, 'name' => 'Fren Balataları'],
        'disk' => ['km' => 60000, 'months' => 36, 'name' => 'Fren Diskleri'],
        'buji' => ['km' => 40000, 'months' => 36, 'name' => 'Bujiler'],
        'triger' => ['km' => 80000, 'months' => 48, 'name' => 'Triger Seti'],
        'kayış' => ['km' => 60000, 'months' => 36, 'name' => 'V Kayışı'],
        'akü' => ['km' => 60000, 'months' => 36, 'name' => 'Akü'],
        'antifriz' => ['km' => 40000, 'months' => 24, 'name' => 'Antifriz'],
        'amortisör' => ['km' => 70000, 'months' => 48, 'name' => 'Amortisör'],
        'debriyaj' => ['km' => 80000, 'months' => 48, 'name' => 'Debriyaj / Baskı Balata'],
        'silecek' => ['km' => 20000, 'months' => 12, 'name' => 'Silecek Süpürgesi'],
    ];

    /**
     * Taranan fatura kalemlerini aracın geçmiş bakım verileriyle denetler
     */
    public function auditInvoiceItems(int $vehicleId, array $items, ?string $invoiceDate = null, ?int $invoiceKm = null): array
    {
        $vehicle = Vehicle::with('maintenances')->find($vehicleId);
        if (!$vehicle) {
            return array_map(fn($item) => $this->wrapItemWithAudit($item, 'normal', 'Araç kaydı bulunamadı, standart kontrol yapıldı.'), $items);
        }

        $pastMaintenances = $vehicle->maintenances->sortByDesc('islem_tarihi');
        $currentDate = $invoiceDate ? Carbon::parse($invoiceDate) : Carbon::today();
        $currentKm = $invoiceKm ?: $vehicle->guncel_km;

        $auditedItems = [];

        foreach ($items as $item) {
            $partName = is_array($item) ? ($item['parca'] ?? $item['kalem'] ?? '') : (string) $item;
            $normalizedPart = mb_strtolower(trim($partName), 'UTF-8');

            $auditResult = $this->checkPartHistory($normalizedPart, $pastMaintenances, $currentDate, $currentKm, $vehicle);

            if (is_array($item)) {
                $auditedItems[] = array_merge($item, ['audit' => $auditResult]);
            } else {
                $auditedItems[] = [
                    'parca' => $partName,
                    'audit' => $auditResult,
                ];
            }
        }

        return $auditedItems;
    }

    /**
     * Tekil parçanın geçmiş kayıtlarını analiz eder
     */
    protected function checkPartHistory(string $partName, $pastMaintenances, Carbon $currentDate, int $currentKm, Vehicle $vehicle): array
    {
        // 1. Yakıt Türü Uyumsuzluk Kontrolü
        $fuelType = mb_strtolower($vehicle->yakit_turu ?: '', 'UTF-8');
        if (str_contains($fuelType, 'benzin') && str_contains($partName, 'kızdırma bujisi')) {
            return [
                'status' => 'invalid',
                'severity' => 'danger',
                'badge' => '🚨 Uyumsuz Parça',
                'message' => 'Benzinli motorlarda kızdırma bujisi bulunmaz. Faturada hatalı/şüpheli parça kalemi tespit edildi!',
            ];
        }
        if (str_contains($fuelType, 'dizel') && (str_contains($partName, 'ateşleme bujisi') || $partName === 'buji')) {
            return [
                'status' => 'invalid',
                'severity' => 'danger',
                'badge' => '🚨 Uyumsuz Parça',
                'message' => 'Dizel motorlarda ateşleme bujisi bulunmaz. Faturada hatalı/şüpheli parça kalemi tespit edildi!',
            ];
        }

        // 2. Geçmiş Bakım Kayıtlarında Arama
        foreach ($pastMaintenances as $maint) {
            $pastDesc = mb_strtolower(($maint->aciklama ?? '') . ' ' . ($maint->islem_turu ?? ''), 'UTF-8');
            $pastDate = Carbon::parse($maint->islem_tarihi);
            $pastKm = (int) ($maint->km ?: 0);

            // Parça eşleşmesi kontrolü
            $matchedKeyword = $this->findMatchingKeyword($partName, $pastDesc);

            if ($matchedKeyword) {
                $daysDiff = $pastDate->diffInDays($currentDate, false);
                $kmDiff = max(0, $currentKm - $pastKm);

                $threshold = $this->partThresholds[$matchedKeyword] ?? ['km' => 15000, 'months' => 12];

                // Eğer son 6.000 KM veya 90 gün içinde değişmişse -> KESİN MÜKERRER
                if ($kmDiff > 0 && $kmDiff < ($threshold['km'] * 0.4) || ($daysDiff >= 0 && $daysDiff < 90)) {
                    $formattedDate = $pastDate->format('d.m.Y');
                    return [
                        'status' => 'duplicate',
                        'severity' => 'danger',
                        'badge' => '🚨 Mükerrer Değişim Uyarısı',
                        'message' => "Bu parça en son {$kmDiff} KM önce ({$formattedDate}) serviste değiştirilmişti! Tekrar faturalandırılması gereksiz/mükerrer masraf olabilir.",
                        'last_date' => $formattedDate,
                        'km_diff' => $kmDiff,
                    ];
                }

                // Eğer parçanın normal ömrünün %70'inden önce değişiyorsa -> ERKEN DEĞİŞİM
                if ($kmDiff > 0 && $kmDiff < ($threshold['km'] * 0.7)) {
                    $formattedDate = $pastDate->format('d.m.Y');
                    return [
                        'status' => 'early',
                        'severity' => 'warning',
                        'badge' => '⚠️ Erken Değişim',
                        'message' => "Bu parça {$formattedDate} tarihinde ({$kmDiff} KM önce) değiştirilmiş. Standart periyodundan daha erken değiştirilmektedir.",
                        'last_date' => $formattedDate,
                        'km_diff' => $kmDiff,
                    ];
                }
            }
        }

        return [
            'status' => 'normal',
            'severity' => 'success',
            'badge' => '✅ Normal Periyot',
            'message' => 'Geçmiş servis kayıtlarında yakın tarihli mükerrer değişime rastlanmadı.',
        ];
    }

    /**
     * Parça adları arasındaki anahtar kelimeleri eşleştirir
     */
    protected function findMatchingKeyword(string $needle, string $haystack): ?string
    {
        foreach (array_keys($this->partThresholds) as $kw) {
            if (str_contains($needle, $kw) && str_contains($haystack, $kw)) {
                return $kw;
            }
        }

        // Doğrudan kelime benzerliği
        $words = explode(' ', $needle);
        foreach ($words as $w) {
            if (mb_strlen($w, 'UTF-8') >= 4 && str_contains($haystack, $w)) {
                return 'genel';
            }
        }

        return null;
    }

    protected function wrapItemWithAudit($item, string $status, string $message): array
    {
        $audit = [
            'status' => $status,
            'severity' => $status === 'normal' ? 'success' : 'warning',
            'badge' => $status === 'normal' ? '✅ Onaylı' : '⚠️ Dikkat',
            'message' => $message,
        ];

        return is_array($item) ? array_merge($item, ['audit' => $audit]) : ['parca' => $item, 'audit' => $audit];
    }
}
