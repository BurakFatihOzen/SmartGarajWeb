<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'kullanicilar';

    const CREATED_AT = 'kayit_tarihi';
    const UPDATED_AT = 'guncelleme_tarihi';

    protected $fillable = [
        'ad_soyad',
        'email',
        'sifre',
        'telefon',
        'sehir',
        'ehliyet_sinifi',
        'rol',
        'hesap_turu',
        'sirket_adi',
    ];

    /**
     * Kurumsal Filo Hesabı mı?
     */
    public function isFleet(): bool
    {
        return $this->hesap_turu === 'filo';
    }

    /**
     * Bireysel Hesap mı?
     */
    public function isIndividual(): bool
    {
        return $this->hesap_turu !== 'filo';
    }

    protected $hidden = [
        'sifre',
        'remember_token',
    ];

    /**
     * Laravel Auth için şifre kolonunu belirle
     */
    public function getAuthPasswordName()
    {
        return 'sifre';
    }

    public function getAuthPassword()
    {
        return $this->sifre;
    }

    /**
     * ad_soyad için 'name' alias (Laravel standartlarına uyum)
     */
    public function getNameAttribute()
    {
        return $this->ad_soyad;
    }

    public function setNameAttribute($value)
    {
        $this->attributes['ad_soyad'] = $value;
    }

    /**
     * password mutator -> sifre
     */
    public function setPasswordAttribute($value)
    {
        $this->setSifreAttribute($value);
    }

    public function setSifreAttribute($value)
    {
        $this->attributes['sifre'] = (str_starts_with($value, '$2y$') || str_starts_with($value, '$2a$')) 
            ? $value 
            : bcrypt($value);
    }

    public function getPasswordAttribute()
    {
        return $this->attributes['sifre'] ?? null;
    }

    /**
     * İlişki: Kullanıcının Araçları
     */
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'kullanici_id')->orderBy('id', 'desc');
    }

    public function araclar()
    {
        return $this->vehicles();
    }
}
