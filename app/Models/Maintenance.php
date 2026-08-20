<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory;

    protected $table = 'bakimlar';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = null; // No updated_at in bakimlar table

    protected $fillable = [
        'arac_id',
        'islem_tarihi',
        'islem_turu',
        'islem_km',
        'maliyet_tl',
        'aciklama',
        'fatura_url',
    ];

    protected $casts = [
        'islem_tarihi' => 'date',
        'islem_km' => 'integer',
        'maliyet_tl' => 'float',
    ];

    /**
     * İlişki: Ait Olduğu Araç
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'arac_id');
    }

    public function arac()
    {
        return $this->vehicle();
    }
}
