<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory;

    protected $table = 'suruculer';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = 'guncelleme_tarihi';

    protected $fillable = [
        'kullanici_id',
        'ad_soyad',
        'tc_no',
        'telefon',
        'email',
        'ehliyet_sinifi',
        'ehliyet_verilis_tarihi',
        'ehliyet_gecerlilik_tarihi',
        'departman',
        'gorev_unvani',
        'durum',
        'notlar',
    ];

    protected $casts = [
        'ehliyet_verilis_tarihi' => 'date',
        'ehliyet_gecerlilik_tarihi' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'kullanici_id');
    }

    public function assignments()
    {
        return $this->hasMany(VehicleAssignment::class, 'surucu_id')->orderBy('teslim_tarihi', 'desc');
    }

    public function activeAssignment()
    {
        return $this->hasOne(VehicleAssignment::class, 'surucu_id')->where('durum', 'aktif');
    }

    public function fines()
    {
        return $this->hasMany(TrafficFine::class, 'surucu_id')->orderBy('ceza_tarihi', 'desc');
    }

    public function fuelLogs()
    {
        return $this->hasMany(FuelLog::class, 'surucu_id')->orderBy('tarih', 'desc');
    }

    public function accidents()
    {
        return $this->hasMany(Accident::class, 'surucu_adi', 'ad_soyad');
    }
}
