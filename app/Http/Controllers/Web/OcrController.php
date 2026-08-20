<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\OcrService;
use Illuminate\Http\Request;

class OcrController extends Controller
{
    protected $ocrService;

    public function __construct(OcrService $ocrService)
    {
        $this->ocrService = $ocrService;
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
        ]);

        $file = $request->file('gorsel');
        $result = $this->ocrService->parseFatura($file->getRealPath());

        return response()->json($result);
    }
}
