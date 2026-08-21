<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\VehicleDocument;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'arac_id' => 'required|exists:araclar,id',
            'belge_turu' => 'required|string|max:50',
            'belge_adi' => 'required|string|max:150',
            'dosya' => 'required|file|mimes:jpeg,png,jpg,webp,pdf|max:15360',
            'gecerlilik_tarihi' => 'nullable|date',
            'aciklama' => 'nullable|string',
        ]);

        $vehicle = Vehicle::where('kullanici_id', $user->id)->findOrFail($validated['arac_id']);

        $path = $request->file('dosya')->store('documents', 'public');

        $doc = VehicleDocument::create([
            'arac_id' => $vehicle->id,
            'kullanici_id' => $user->id,
            'belge_turu' => $validated['belge_turu'],
            'belge_adi' => $validated['belge_adi'],
            'dosya_url' => '/storage/' . $path,
            'gecerlilik_tarihi' => $validated['gecerlilik_tarihi'] ?? null,
            'aciklama' => $validated['aciklama'] ?? null,
        ]);

        return back()->with('success', "{$doc->belge_adi} dijital evrak kasasına başarıyla yüklendi.");
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $doc = VehicleDocument::where('kullanici_id', $user->id)->findOrFail($id);
        $name = $doc->belge_adi;
        $doc->delete();

        return back()->with('success', "{$name} belgesi silindi.");
    }
}
