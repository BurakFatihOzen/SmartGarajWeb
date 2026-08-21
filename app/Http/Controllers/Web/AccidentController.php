<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use App\Models\Vehicle;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AccidentController extends Controller
{
    /**
     * Kaza & Hasar Yönetim Portalı
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $vehicleId = $request->query('arac_id');

        $query = Accident::where('kullanici_id', $user->id)
            ->with(['vehicle'])
            ->orderBy('kaza_tarihi', 'desc');

        if ($vehicleId) {
            $query->where('arac_id', $vehicleId);
        }

        $accidents = $query->get();
        $vehicles = Vehicle::where('kullanici_id', $user->id)->get();
        $drivers = Driver::where('kullanici_id', $user->id)->get();

        if ($request->wantsJson()) {
            return response()->json($accidents);
        }

        // KPI Metrikleri
        $totalCount = $accidents->count();
        $totalDamage = (float) $accidents->sum('hasar_tutari');
        $totalTramer = (float) $accidents->where('tramer_kaydi', true)->sum('tramer_tutari');
        $openCases = $accidents->whereNotIn('dosya_durumu', ['kapandi'])->count();
        $closedCases = $accidents->where('dosya_durumu', 'kapandi')->count();

        return Inertia::render('Fleet/Accidents', [
            'accidents' => $accidents,
            'vehicles' => $vehicles,
            'drivers' => $drivers,
            'kpis' => [
                'totalCount' => $totalCount,
                'totalDamage' => $totalDamage,
                'totalTramer' => $totalTramer,
                'openCases' => $openCases,
                'closedCases' => $closedCases,
            ],
        ]);
    }

    /**
     * Yeni Kaza / Hasar & Sigorta Dosyası Ekle
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'arac_id' => 'required|exists:araclar,id',
            'kaza_tarihi' => 'required|date',
            'kaza_km' => 'nullable|numeric|min:0',
            'kaza_turu' => 'required|string',
            'hasar_tutari' => 'nullable|numeric|min:0',
            'tramer_kaydi' => 'nullable|boolean',
            'tramer_tutari' => 'nullable|numeric|min:0',
            'kusur_orani' => 'nullable|integer|min:0|max:100',
            'sigorta_sirketi' => 'nullable|string|max:255',
            'dosya_no' => 'nullable|string|max:255',
            'dosya_durumu' => 'nullable|string|in:dosya_acildi,eksper_incelemesinde,onarimda,tramer_onaylandi,kapandi',
            'eksper_adi' => 'nullable|string|max:150',
            'eksper_tel' => 'nullable|string|max:30',
            'rucu_durumu' => 'nullable|string|max:100',
            'tazminat_tutari' => 'nullable|numeric|min:0',
            'karsi_taraf_plaka' => 'nullable|string|max:255',
            'surucu_adi' => 'nullable|string|max:255',
            'aciklama' => 'nullable|string',
            'hasarli_parcalar' => 'nullable|array',
            'tutanak' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:10240',
            'fotograflar.*' => 'nullable|image|max:10240',
        ]);

        $vehicle = Vehicle::where('id', $validated['arac_id'])
            ->where('kullanici_id', $user->id)
            ->firstOrFail();

        $tutanakUrl = null;
        if ($request->hasFile('tutanak')) {
            $path = $request->file('tutanak')->store('tutanaklar', 'public');
            $tutanakUrl = Storage::url($path);
        }

        $fotoUrls = [];
        if ($request->hasFile('fotograflar')) {
            foreach ($request->file('fotograflar') as $file) {
                $p = $file->store('hasar_fotograflari', 'public');
                $fotoUrls[] = Storage::url($p);
            }
        }

        Accident::create([
            'arac_id' => $vehicle->id,
            'kullanici_id' => $user->id,
            'kaza_tarihi' => $validated['kaza_tarihi'],
            'kaza_km' => $validated['kaza_km'] ?? null,
            'kaza_turu' => $validated['kaza_turu'],
            'hasar_tutari' => $validated['hasar_tutari'] ?? 0,
            'tramer_kaydi' => $request->boolean('tramer_kaydi'),
            'tramer_tutari' => $request->boolean('tramer_kaydi') ? ($validated['tramer_tutari'] ?? $validated['hasar_tutari'] ?? 0) : null,
            'kusur_orani' => $validated['kusur_orani'] ?? 0,
            'sigorta_sirketi' => $validated['sigorta_sirketi'] ?? null,
            'dosya_no' => $validated['dosya_no'] ?? null,
            'dosya_durumu' => $validated['dosya_durumu'] ?? 'dosya_acildi',
            'eksper_adi' => $validated['eksper_adi'] ?? null,
            'eksper_tel' => $validated['eksper_tel'] ?? null,
            'rucu_durumu' => $validated['rucu_durumu'] ?? null,
            'tazminat_tutari' => $validated['tazminat_tutari'] ?? null,
            'karsi_taraf_plaka' => $validated['karsi_taraf_plaka'] ?? null,
            'surucu_adi' => $validated['surucu_adi'] ?? null,
            'aciklama' => $validated['aciklama'] ?? null,
            'hasarli_parcalar' => $validated['hasarli_parcalar'] ?? [],
            'fotograflar' => $fotoUrls,
            'tutanak_url' => $tutanakUrl,
        ]);

        return redirect()->back()->with('success', 'Kaza ve sigorta hasar dosyası başarıyla oluşturuldu.');
    }

    /**
     * Sigorta Dosya Aşaması Güncelleme
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        $accident = Accident::where('kullanici_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'dosya_durumu' => 'required|string|in:dosya_acildi,eksper_incelemesinde,onarimda,tramer_onaylandi,kapandi',
            'tazminat_tutari' => 'nullable|numeric|min:0',
            'rucu_durumu' => 'nullable|string|max:100',
        ]);

        $accident->update($validated);

        return redirect()->back()->with('success', 'Hasar dosyası aşaması başarıyla güncellendi.');
    }

    /**
     * Kaza Kaydını Sil
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $accident = Accident::where('kullanici_id', $user->id)->findOrFail($id);
        $accident->delete();

        return redirect()->back()->with('success', 'Hasar kaydı silindi.');
    }
}
