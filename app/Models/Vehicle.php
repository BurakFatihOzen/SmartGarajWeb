<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Vehicle extends Model
{
    use HasFactory;

    protected $table = 'araclar';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = 'guncelleme_tarihi';

    protected $fillable = [
        'kullanici_id',
        'plaka',
        'marka',
        'model',
        'motor',
        'yil',
        'guncel_km',
        'ruhsat_tipi',
        'vites_turu',
        'yakit_turu',
        'muayene_bitis',
        'sigorta_bitis',
        'kasko_bitis',
        'sasi_no',
        'notlar',
        'fotograf_url',
        'qr_token',
        'durum',
        'zimmet_surucu_adi',
        'departman',
        'sozlesme_turu',
    ];

    protected $casts = [
        'yil' => 'integer',
        'guncel_km' => 'integer',
        'muayene_bitis' => 'date',
        'sigorta_bitis' => 'date',
        'kasko_bitis' => 'date',
    ];

    /**
     * İlişki: Araç Sahibi (Kullanıcı)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'kullanici_id');
    }

    /**
     * İlişki: Bakımlar
     */
    public function maintenances()
    {
        return $this->hasMany(Maintenance::class, 'arac_id')->orderBy('islem_tarihi', 'desc')->orderBy('id', 'desc');
    }

    public function bakimlar()
    {
        return $this->maintenances();
    }

    /**
     * İlişki: Kaza ve Hasar Kayıtları
     */
    public function accidents()
    {
        return $this->hasMany(Accident::class, 'arac_id')->orderBy('kaza_tarihi', 'desc')->orderBy('id', 'desc');
    }

    public function kazalar()
    {
        return $this->accidents();
    }

    /**
     * İlişki: Yakıt Kayıtları
     */
    public function fuelLogs()
    {
        return $this->hasMany(FuelLog::class, 'arac_id')->orderBy('tarih', 'desc');
    }

    /**
     * İlişki: Hatırlatıcılar
     */
    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'arac_id');
    }

    /**
     * Toplam Bakım Harcaması Hesabı
     */
    public function getTotalSpentAttribute()
    {
        return (float) $this->maintenances()->sum('maliyet_tl');
    }

    /**
     * Toplam Hasar / Onarım Tutarı
     */
    public function getTotalDamageAttribute()
    {
        return (float) $this->accidents()->sum('hasar_tutari');
    }

    /**
     * Toplam Tramer Kaydı Tutarı
     */
    public function getTramerTotalAttribute()
    {
        return (float) $this->accidents()->where('tramer_kaydi', true)->sum('tramer_tutari');
    }

    /**
     * Toplam Bakım Kaydı Sayısı
     */
    public function getMaintenanceCountAttribute()
    {
        return $this->maintenances()->count();
    }

    /**
     * Toplam Kaza Kaydı Sayısı
     */
    public function getAccidentCountAttribute()
    {
        return $this->accidents()->count();
    }

    /**
     * Tarih Kalan Gün Rozeti Yardımcısı
     */
    public function getDateBadge($dateValue, $label)
    {
        if (empty($dateValue)) {
            return [
                'color' => 'secondary',
                'badge_class' => 'bg-secondary',
                'text' => 'Belirtilmedi',
                'days' => null,
                'icon' => 'bi-dash-circle'
            ];
        }

        $target = Carbon::parse($dateValue)->startOfDay();
        $today = Carbon::today();
        $diffDays = (int) $today->diffInDays($target, false);

        if ($diffDays < 0) {
            return [
                'color' => 'danger',
                'badge_class' => 'bg-danger',
                'text' => abs($diffDays) . ' gün geçti!',
                'days' => $diffDays,
                'icon' => 'bi-exclamation-triangle-fill'
            ];
        } elseif ($diffDays <= 30) {
            return [
                'color' => 'warning',
                'badge_class' => 'bg-warning text-dark',
                'text' => $diffDays . ' gün kaldı',
                'days' => $diffDays,
                'icon' => 'bi-exclamation-circle-fill'
            ];
        } else {
            return [
                'color' => 'success',
                'badge_class' => 'bg-success',
                'text' => $diffDays . ' gün var',
                'days' => $diffDays,
                'icon' => 'bi-check-circle-fill'
            ];
        }
    }

    public function assignments()
    {
        return $this->hasMany(VehicleAssignment::class, 'arac_id')->orderBy('teslim_tarihi', 'desc');
    }

    public function activeAssignment()
    {
        return $this->hasOne(VehicleAssignment::class, 'arac_id')->where('durum', 'aktif')->with('driver');
    }

    public function fines()
    {
        return $this->hasMany(TrafficFine::class, 'arac_id')->orderBy('ceza_tarihi', 'desc');
    }

    public function documents()
    {
        return $this->hasMany(VehicleDocument::class, 'arac_id')->orderBy('kayit_tarihi', 'desc');
    }

    public function getTotalFuelExpenseAttribute()
    {
        return (float) $this->fuelLogs()->sum('toplam_tutar');
    }

    public function getTotalFinesAttribute()
    {
        return (float) $this->fines()->sum('tutar');
    }

    public function getUnpaidFinesTotalAttribute()
    {
        return (float) $this->fines()->where('durum', 'odenmedi')->sum('tutar');
    }

    public function getInspectionBadgeAttribute()
    {
        return $this->getDateBadge($this->muayene_bitis, 'Muayene');
    }

    public function getInsuranceBadgeAttribute()
    {
        return $this->getDateBadge($this->sigorta_bitis, 'Sigorta');
    }

    public function getKaskoBadgeAttribute()
    {
        return $this->getDateBadge($this->kasko_bitis, 'Kasko');
    }
}
