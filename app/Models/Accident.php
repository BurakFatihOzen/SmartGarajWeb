<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accident extends Model
{
    use HasFactory;

    protected $table = 'kazalar';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = null;

    protected $fillable = [
        'arac_id',
        'kullanici_id',
        'kaza_tarihi',
        'kaza_km',
        'kaza_turu',
        'hasar_tutari',
        'tramer_kaydi',
        'tramer_tutari',
        'kusur_orani',
        'sigorta_sirketi',
        'dosya_no',
        'karsi_taraf_plaka',
        'surucu_adi',
        'aciklama',
        'hasarli_parcalar',
        'fotograflar',
        'tutanak_url',
        'dosya_durumu',
        'eksper_adi',
        'eksper_tel',
        'rucu_durumu',
        'tazminat_tutari',
    ];

    protected $casts = [
        'kaza_tarihi' => 'date',
        'kaza_km' => 'integer',
        'hasar_tutari' => 'float',
        'tramer_kaydi' => 'boolean',
        'tramer_tutari' => 'float',
        'kusur_orani' => 'integer',
        'hasarli_parcalar' => 'array',
        'fotograflar' => 'array',
        'tazminat_tutari' => 'float',
    ];

    public function getFileStatusBadgeAttribute()
    {
        return match($this->dosya_durumu) {
            'dosya_acildi' => ['label' => 'Dosya Açıldı (Kayıt)', 'color' => 'bg-blue-500/10 text-blue-500 border-blue-500/20'],
            'eksper_incelemesinde' => ['label' => 'Eksper İncelemesinde', 'color' => 'bg-amber-500/10 text-amber-500 border-amber-500/20'],
            'onarimda' => ['label' => 'Serviste / Onarımda', 'color' => 'bg-purple-500/10 text-purple-500 border-purple-500/20'],
            'tramer_onaylandi' => ['label' => 'Tramer Onaylandı', 'color' => 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'],
            'kapandi' => ['label' => 'Dosya Kapandı (Ödendi)', 'color' => 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'],
            default => ['label' => 'Açık', 'color' => 'bg-slate-500/10 text-slate-400 border-slate-500/20'],
        };
    }

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

    /**
     * İlişki: Kaydeden Kullanıcı
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'kullanici_id');
    }
}
