<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrafficFine extends Model
{
    use HasFactory;

    protected $table = 'trafik_cezalari';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = 'guncelleme_tarihi';

    protected $fillable = [
        'arac_id',
        'kullanici_id',
        'surucu_id',
        'ceza_tarihi',
        'ceza_maddesi',
        'tutar',
        'indirimli_tutar',
        'son_odeme_tarihi',
        'durum',
        'odeme_tarihi',
        'tutanak_url',
        'aciklama',
    ];

    protected $casts = [
        'ceza_tarihi' => 'date',
        'son_odeme_tarihi' => 'date',
        'odeme_tarihi' => 'date',
        'tutar' => 'decimal:2',
        'indirimli_tutar' => 'decimal:2',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'arac_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'kullanici_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'surucu_id');
    }
}
