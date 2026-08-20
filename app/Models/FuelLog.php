<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelLog extends Model
{
    use HasFactory;

    protected $table = 'yakit_kayitlari';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = null;

    protected $fillable = [
        'arac_id',
        'tarih',
        'km',
        'litre',
        'birim_fiyat',
        'toplam_tutar',
        'depo_doldu',
        'yakit_turu',
        'notlar',
    ];

    protected $casts = [
        'tarih' => 'date',
        'km' => 'integer',
        'litre' => 'float',
        'birim_fiyat' => 'float',
        'toplam_tutar' => 'float',
        'depo_doldu' => 'boolean',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'arac_id');
    }
}
