<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    use HasFactory;

    protected $table = 'hatirlaticilar';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = null;

    protected $fillable = [
        'arac_id',
        'tur',
        'baslik',
        'hedef_tarih',
        'hedef_km',
        'bildirildi',
        'bildirim_tarihi',
    ];

    protected $casts = [
        'hedef_tarih' => 'date',
        'hedef_km' => 'integer',
        'bildirildi' => 'boolean',
        'bildirim_tarihi' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'arac_id');
    }
}
