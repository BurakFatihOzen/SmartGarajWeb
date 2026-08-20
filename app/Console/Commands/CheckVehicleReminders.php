<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CheckVehicleReminders extends Command
{
    protected $signature = 'garaj:check-reminders';
    protected $description = 'Günlük muayene, sigorta ve kasko vadelerini tarayıp kullanıcılara bildirim ve e-posta iletir.';

    public function handle()
    {
        $this->info('SmartGaraj Günlük Hatırlatıcı Taraması Başlıyor...');

        $today = Carbon::today();
        $vehicles = Vehicle::with('user')->get();
        $sentCount = 0;

        foreach ($vehicles as $v) {
            $user = $v->user;
            if (!$user) continue;

            $alerts = [];

            // 1. Muayene Kontrolü
            if ($v->muayene_bitis) {
                $mDate = Carbon::parse($v->muayene_bitis)->startOfDay();
                $diff = (int) $today->diffInDays($mDate, false);

                if ($diff <= 30 && $diff >= 0) {
                    $alerts[] = [
                        'tur' => 'muayene',
                        'baslik' => "{$v->plaka} Muayene Hatırlatması",
                        'mesaj' => "{$v->plaka} ({$v->marka} {$v->model}) aracınızın TÜVTÜRK muayenesine {$diff} gün kaldı! Bitiş: " . $mDate->format('d.m.Y'),
                    ];
                } elseif ($diff < 0) {
                    $alerts[] = [
                        'tur' => 'muayene',
                        'baslik' => "⚠️ {$v->plaka} Muayenesi Geçti!",
                        'mesaj' => "{$v->plaka} aracınızın muayene tarihi " . abs($diff) . " gün önce doldu.",
                    ];
                }
            }

            // 2. Sigorta Kontrolü
            if ($v->sigorta_bitis) {
                $sDate = Carbon::parse($v->sigorta_bitis)->startOfDay();
                $diff = (int) $today->diffInDays($sDate, false);

                if ($diff <= 15 && $diff >= 0) {
                    $alerts[] = [
                        'tur' => 'sigorta',
                        'baslik' => "{$v->plaka} Trafik Sigortası Uyarısı",
                        'mesaj' => "{$v->plaka} aracınızın zorunlu trafik sigortasına {$diff} gün kaldı! Bitiş: " . $sDate->format('d.m.Y'),
                    ];
                }
            }

            // 3. Kasko Kontrolü
            if ($v->kasko_bitis) {
                $kDate = Carbon::parse($v->kasko_bitis)->startOfDay();
                $diff = (int) $today->diffInDays($kDate, false);

                if ($diff <= 15 && $diff >= 0) {
                    $alerts[] = [
                        'tur' => 'kasko',
                        'baslik' => "{$v->plaka} Kasko Yenileme",
                        'mesaj' => "{$v->plaka} aracınızın kasko poliçesi bitimine {$diff} gün kaldı.",
                    ];
                }
            }

            // Bildirimleri Veritabanına ve E-Postaya İlet
            foreach ($alerts as $alert) {
                // Son 24 saatte aynı bildirim atıldı mı kontrolü
                $already = DB::table('bildirimler')
                    ->where('kullanici_id', $user->id)
                    ->where('arac_id', $v->id)
                    ->where('tur', $alert['tur'])
                    ->where('olusturma_tarihi', '>=', Carbon::now()->subHours(24))
                    ->exists();

                if (!$already) {
                    DB::table('bildirimler')->insert([
                        'kullanici_id' => $user->id,
                        'arac_id' => $v->id,
                        'baslik' => $alert['baslik'],
                        'mesaj' => $alert['mesaj'],
                        'tur' => $alert['tur'],
                        'okundu' => false,
                        'olusturma_tarihi' => Carbon::now(),
                    ]);

                    // Brevo E-Posta Gönderimi
                    $this->sendBrevoAlert($user->email, $user->ad_soyad, $alert['baslik'], $alert['mesaj']);
                    $sentCount++;
                }
            }
        }

        $this->info("Tarama tamamlandı. Toplam {$sentCount} adet bildirim gönderildi.");
        return 0;
    }

    private function sendBrevoAlert($email, $userName, $title, $message)
    {
        $brevoKey = env('BREVO_API_KEY');
        if (empty($brevoKey)) return;

        try {
            Http::withHeaders([
                'api-key' => $brevoKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.brevo.com/v3/smtp/email', [
                'sender' => [
                    'name' => 'SmartGaraj Hatırlatıcı',
                    'email' => 'brkfatih2016@gmail.com',
                ],
                'to' => [
                    ['email' => $email, 'name' => $userName]
                ],
                'subject' => '🔔 SmartGaraj Hatırlatması: ' . $title,
                'htmlContent' => "
                    <div style='font-family: sans-serif; background: #0f1015; color: #fff; padding: 24px; border-radius: 12px;'>
                        <h2 style='color: #f59e0b;'>🛠️ SmartGaraj Hatırlatıcı</h2>
                        <p>Merhaba <strong>{$userName}</strong>,</p>
                        <div style='background: #181920; border-left: 4px solid #f59e0b; padding: 14px; margin: 16px 0; border-radius: 4px;'>
                            <h3 style='margin: 0 0 6px 0; color: #fff;'>{$title}</h3>
                            <p style='margin: 0; color: #cbd5e1; font-size: 14px;'>{$message}</p>
                        </div>
                        <a href='http://smartgarajweb.test/dashboard' style='background: #f59e0b; color: #000; font-weight: bold; text-decoration: none; padding: 10px 18px; border-radius: 8px; display: inline-block;'>Garajıma Git & İncele</a>
                    </div>
                "
            ]);
        } catch (\Exception $e) {
            Log::error('Reminder mail error: ' . $e->getMessage());
        }
    }
}
