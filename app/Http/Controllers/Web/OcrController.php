<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\OcrService;
use App\Services\InvoiceAuditService;
use Illuminate\Http\Request;

class OcrController extends Controller
{
    protected $ocrService;
    protected $auditService;

    public function __construct(OcrService $ocrService, InvoiceAuditService $auditService)
    {
        $this->ocrService = $ocrService;
        $this->auditService = $auditService;
    }

    public function scanRuhsat(Request $request)
    {
        $request->validate([
            'gorsel' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $file = $request->file('gorsel');
        $result = $this->ocrService->parseRuhsat($file->getRealPath());

        return response()->json($result);
    }

    public function scanFatura(Request $request)
    {
        $request->validate([
            'gorsel' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
            'arac_id' => 'nullable|integer',
        ]);

        $file = $request->file('gorsel');
        $result = $this->ocrService->parseFatura($file->getRealPath());

        // Eğer fatura başarıyla ayrıştırıldıysa ve arac_id varsa AI Denetimini çalıştır
        if (!empty($result['success']) && !empty($result['data']['parcalar']) && $request->filled('arac_id')) {
            $vehicleId = (int) $request->input('arac_id');
            $invoiceDate = $result['data']['tarih'] ?? null;
            $invoiceKm = $result['data']['islem_km'] ?? null;

            $items = array_map(function($p) {
                return [
                    'parca' => $p['ad'] ?? $p['parca'] ?? '',
                    'fiyat' => $p['fiyat'] ?? 0,
                    'adet' => $p['adet'] ?? 1,
                ];
            }, $result['data']['parcalar']);

            $auditedItems = $this->auditService->auditInvoiceItems($vehicleId, $items, $invoiceDate, $invoiceKm);
            $result['data']['parcalar'] = $auditedItems;

            // Özet sayımları
            $duplicates = count(array_filter($auditedItems, fn($i) => ($i['audit']['status'] ?? '') === 'duplicate' || ($i['audit']['status'] ?? '') === 'invalid'));
            $early = count(array_filter($auditedItems, fn($i) => ($i['audit']['status'] ?? '') === 'early'));

            $result['data']['audit_summary'] = [
                'has_warnings' => ($duplicates > 0 || $early > 0),
                'duplicates_count' => $duplicates,
                'early_count' => $early,
            ];
        }

        return response()->json($result);
    }

    /**
     * Manuel girilen fatura kalemleri için anlık AI Denetimi
     */
    public function auditItems(Request $request)
    {
        $request->validate([
            'arac_id' => 'required|integer',
            'items' => 'required|array',
            'tarih' => 'nullable|date',
            'km' => 'nullable|integer',
        ]);

        $auditedItems = $this->auditService->auditInvoiceItems(
            (int) $request->input('arac_id'),
            $request->input('items'),
            $request->input('tarih'),
            $request->input('km')
        );

        $duplicates = count(array_filter($auditedItems, fn($i) => ($i['audit']['status'] ?? '') === 'duplicate' || ($i['audit']['status'] ?? '') === 'invalid'));
        $early = count(array_filter($auditedItems, fn($i) => ($i['audit']['status'] ?? '') === 'early'));

        return response()->json([
            'success' => true,
            'items' => $auditedItems,
            'summary' => [
                'has_warnings' => ($duplicates > 0 || $early > 0),
                'duplicates_count' => $duplicates,
                'early_count' => $early,
            ],
        ]);
    }
}
