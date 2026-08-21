<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleAssignment extends Model
{
    use HasFactory;

    protected $table = 'arac_zimmetleri';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = 'guncelleme_tarihi';

    protected $fillable = [
        'arac_id',
        'surucu_id',
        'kullanici_id',
        'teslim_tarihi',
        'iade_tarihi',
        'baslangic_km',
        'bitis_km',
        'yakit_seviyesi',
        'tutanak_no',
        'durum',
        'teslim_notu',
        'iade_notu',
    ];

    protected $casts = [
        'teslim_tarihi' => 'datetime',
        'iade_tarihi' => 'datetime',
        'baslangic_km' => 'integer',
        'bitis_km' => 'integer',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'arac_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'surucu_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'kullanici_id');
    }
}
