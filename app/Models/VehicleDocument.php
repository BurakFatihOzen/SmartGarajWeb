<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleDocument extends Model
{
    use HasFactory;

    protected $table = 'arac_belgeleri';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = 'guncelleme_tarihi';

    protected $fillable = [
        'arac_id',
        'kullanici_id',
        'belge_turu',
        'belge_adi',
        'dosya_url',
        'gecerlilik_tarihi',
        'aciklama',
    ];

    protected $casts = [
        'gecerlilik_tarihi' => 'date',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'arac_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'kullanici_id');
    }
}
