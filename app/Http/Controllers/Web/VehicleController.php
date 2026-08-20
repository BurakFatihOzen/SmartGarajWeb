<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Auth::user()->vehicles()->with('maintenances')->get();
        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Vehicles/Create');
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'plaka' => 'required|string|max:30',
            'marka' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'motor' => 'nullable|string|max:120',
            'yil' => 'nullable|integer|min:1900|max:2100',
            'guncel_km' => 'nullable|integer|min:0',
            'ruhsat_tipi' => 'nullable|string|max:50',
            'muayene_bitis' => 'nullable|date',
            'sigorta_bitis' => 'nullable|date',
            'kasko_bitis' => 'nullable|date',
            'notlar' => 'nullable|string',
        ]);

        $validated['kullanici_id'] = $user->id;
        $validated['plaka'] = trim(strtoupper($validated['plaka']));
        $validated['guncel_km'] = max(0, (int) ($validated['guncel_km'] ?? 0));

        $vehicle = Vehicle::create($validated);

        return redirect()->route('dashboard', ['arac_id' => $vehicle->id])
            ->with('success', "{$vehicle->plaka} plakalı aracınız garaja başarıyla eklendi!");
    }

    public function destroy($id)
    {
        $vehicle = Auth::user()->vehicles()->findOrFail($id);
        $plaka = $vehicle->plaka;
        $vehicle->delete();

        return redirect()->route('vehicles.index')->with('success', "{$plaka} plakalı araç ve tüm bakım kayıtları başarıyla silindi.");
    }
}
