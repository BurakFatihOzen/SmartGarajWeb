<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\TrafficFine;
use App\Models\Vehicle;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class TrafficFineController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $fines = TrafficFine::where('kullanici_id', $user->id)
            ->with(['vehicle', 'driver'])
            ->orderBy('ceza_tarihi', 'desc')
            ->get();

        $vehicles = Vehicle::where('kullanici_id', $user->id)->get();
        $drivers = Driver::where('kullanici_id', $user->id)->get();

        $totalCount = $fines->count();
        $unpaidCount = $fines->where('durum', 'odenmedi')->count();
        $totalAmount = (float) $fines->sum('tutar');
        $unpaidAmount = (float) $fines->where('durum', 'odenmedi')->sum('tutar');
        $discountedPotential = (float) $fines->where('durum', 'odenmedi')->sum('indirimli_tutar');
        $hgsCount = $fines->where('ceza_tipi', 'hgs_ihlal')->count();
        $hgsUnpaidAmount = (float) $fines->where('ceza_tipi', 'hgs_ihlal')->where('durum', 'odenmedi')->sum('tutar');

        return Inertia::render('Fleet/Fines', [
            'fines' => $fines,
            'vehicles' => $vehicles,
            'drivers' => $drivers,
            'kpis' => [
                'totalCount' => $totalCount,
                'unpaidCount' => $unpaidCount,
                'totalAmount' => $totalAmount,
                'unpaidAmount' => $unpaidAmount,
                'discountedPotential' => $discountedPotential,
                'hgsCount' => $hgsCount,
                'hgsUnpaidAmount' => $hgsUnpaidAmount,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'arac_id' => 'required|exists:araclar,id',
            'surucu_id' => 'nullable|exists:suruculer,id',
            'ceza_tipi' => 'nullable|string|in:trafik_cezasi,hgs_ihlal',
            'otoyol_kopru' => 'nullable|string|max:150',
            'gecis_ucreti' => 'nullable|numeric|min:0',
            'ihlal_kat_sayisi' => 'nullable|integer|min:1|max:10',
            'hgs_etiket_no' => 'nullable|string|max:50',
            'giris_istasyonu' => 'nullable|string|max:100',
            'cikis_istasyonu' => 'nullable|string|max:100',
            'ceza_tarihi' => 'required|date',
            'ceza_maddesi' => 'required|string|max:150',
            'tutar' => 'required|numeric|min:0',
            'durum' => 'required|string|in:odendi,odenmedi,itiraz_edildi',
            'odeme_tarihi' => 'nullable|date',
            'aciklama' => 'nullable|string',
            'tutanak' => 'nullable|image|mimes:jpeg,png,jpg,webp,pdf|max:10240',
        ]);

        $cezaTipi = $validated['ceza_tipi'] ?? 'trafik_cezasi';
        $tutar = (float) $validated['tutar'];
        
        // HGS veya Trafik cezası erken ödeme indirimi
        $indirimliTutar = round($tutar * 0.75, 2); // %25 indirim
        
        $cezaTarihi = Carbon::parse($validated['ceza_tarihi']);
        $sonOdemeTarihi = $cezaTarihi->copy()->addDays(30);

        $tutanakUrl = null;
        if ($request->hasFile('tutanak')) {
            $path = $request->file('tutanak')->store('fines', 'public');
            $tutanakUrl = '/storage/' . $path;
        }

        TrafficFine::create([
            'arac_id' => $validated['arac_id'],
            'kullanici_id' => $user->id,
            'surucu_id' => $validated['surucu_id'] ?? null,
            'ceza_tipi' => $cezaTipi,
            'otoyol_kopru' => $validated['otoyol_kopru'] ?? null,
            'gecis_ucreti' => !empty($validated['gecis_ucreti']) ? (float) $validated['gecis_ucreti'] : null,
            'ihlal_kat_sayisi' => (int) ($validated['ihlal_kat_sayisi'] ?? 4),
            'hgs_etiket_no' => $validated['hgs_etiket_no'] ?? null,
            'giris_istasyonu' => $validated['giris_istasyonu'] ?? null,
            'cikis_istasyonu' => $validated['cikis_istasyonu'] ?? null,
            'ceza_tarihi' => $validated['ceza_tarihi'],
            'ceza_maddesi' => $validated['ceza_maddesi'],
            'tutar' => $tutar,
            'indirimli_tutar' => $indirimliTutar,
            'son_odeme_tarihi' => $sonOdemeTarihi->toDateString(),
            'durum' => $validated['durum'],
            'odeme_tarihi' => $validated['durum'] === 'odendi' ? ($validated['odeme_tarihi'] ?? Carbon::now()) : null,
            'tutanak_url' => $tutanakUrl,
            'aciklama' => $validated['aciklama'] ?? null,
        ]);

        $msgTitle = $cezaTipi === 'hgs_ihlal' ? "HGS / OGS Geçiş İhlali" : "Trafik Cezası";
        return back()->with('success', "{$msgTitle} başarıyla kaydedildi. (%25 indirimli tutar: ₺" . number_format($indirimliTutar, 2, ',', '.') . ")");
    }

    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        $fine = TrafficFine::where('kullanici_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'durum' => 'required|string|in:odendi,odenmedi,itiraz_edildi',
            'odeme_tarihi' => 'nullable|date',
        ]);

        $fine->update([
            'durum' => $validated['durum'],
            'odeme_tarihi' => $validated['durum'] === 'odendi' ? ($validated['odeme_tarihi'] ?? Carbon::now()->toDateString()) : null,
        ]);

        return back()->with('success', "Ceza durumu başarıyla güncellendi.");
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $fine = TrafficFine::where('kullanici_id', $user->id)->findOrFail($id);
        $fine->delete();

        return back()->with('success', "Ceza kaydı silindi.");
    }
}
