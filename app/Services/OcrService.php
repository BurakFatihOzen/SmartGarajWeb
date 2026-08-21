<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OcrService
{
    /**
     * Ruhsat Fotoğrafını Analiz Edip JSON Döndürür
     */
    public function parseRuhsat($imagePath)
    {
        $prompt = "Görseli incele. ÖNCELİKLE bu görselin bir Türkiye Araç Tescil Belgesi (Ruhsat) olup olmadığını kontrol et.

ÖNEMLİ KURAL:
Eğer görsel bir araç ruhsat belgesi DEĞİLSE (örneğin su faturası, elektrik faturası, market fişi, kimlik kartı, manzara veya ilgisiz herhangi bir belge ise) KESİNLİKLE uydurma araç verisi ÜRETME!
Şu formatta JSON yanıtı ver:
{
    \"is_valid\": false,
    \"error_message\": \"Yüklenen görsel bir Araç Tescil Belgesi (Ruhsat) değildir. Lütfen geçerli ve okunaklı bir araç ruhsatı yükleyin.\"
}

Eğer görsel gerçekten bir araç ruhsatı ise:
{
    \"is_valid\": true,
    \"plaka\": \"06ABC123\",
    \"sasi_no\": \"WBA3A...\",
    \"marka\": \"BMW\",
    \"model\": \"320i ED\",
    \"motor\": \"1.6 TwinPower 170 HP\",
    \"yil\": 2015,
    \"ruhsat_tipi\": \"otomobil\",
    \"muayene_tarihi\": \"2026-05-15\"
}
Sadece JSON yanıtı ver, markdown veya ek açıklama yazma.";

        return $this->callVisionAi($imagePath, $prompt, 'ruhsat');
    }

    /**
     * Servis / Parça Faturasını Analiz Edip JSON Döndürür
     */
    public function parseFatura($imagePath)
    {
        $prompt = "Görseli incele. ÖNCELİKLE bu görselin bir Araç/Otomotiv Servis Faturası, Oto Tamir İş Emri, Yedek Parça veya Oto Bakım Faturası olup olmadığını kontrol et.

ÖNEMLİ VE KESİN KURAL:
Eğer görsel bir su faturası (İSKİ, ASKİ vb.), elektrik faturası (Enerjisa, CK vb.), doğalgaz faturası, market alışveriş fişi (BİM, Migros, A101 vb.), restoran adisyonu veya otomotivle ilgisi olmayan bir belge ise KESİNLİKLE uydurma araç/bakım verisi ÜRETME!
Şu formatta JSON yanıtı ver:
{
    \"is_valid\": false,
    \"error_message\": \"Yüklenen görsel bir araç servis veya bakım faturası değildir (Su/Elektrik/Alışveriş faturası veya ilgisiz belge tespit edildi). Lütfen geçerli bir oto servis veya yedek parça faturası yükleyin.\"
}

Eğer görsel gerçekten bir otomotiv servis, bakım, onarım veya yedek parça faturası ise:
{
    \"is_valid\": true,
    \"tarih\": \"2026-04-12\",
    \"servis_adi\": \"Örnek Bosch Car Service\",
    \"plaka\": \"34XYZ789\",
    \"islem_km\": 95000,
    \"toplam_tutar\": 4850.00,
    \"islem_turu\": \"Periyodik Bakım\",
    \"aciklama\": \"Motor yağı, filtreler ve ön balata değişimi yapıldı.\",
    \"parcalar\": [
        {\"ad\": \"Castrol Edge 5W-30 Motor Yağı\", \"adet\": 1, \"fiyat\": 1800.00},
        {\"ad\": \"Mann Yağ Filtresi\", \"adet\": 1, \"fiyat\": 350.00},
        {\"ad\": \"Mann Hava Filtresi\", \"adet\": 1, \"fiyat\": 450.00},
        {\"ad\": \"Ön Fren Balata Takımı\", \"adet\": 1, \"fiyat\": 1450.00},
        {\"ad\": \"Periyodik Bakım İşçiliği\", \"adet\": 1, \"fiyat\": 800.00}
    ]
}
Tarih YYYY-MM-DD formatında olmalı. Tutarlar sadece sayı olmalı. Sadece JSON yanıtı ver.";

        return $this->callVisionAi($imagePath, $prompt, 'fatura');
    }

    /**
     * Vision AI Servis Çağrısı
     */
    private function callVisionAi($imagePath, $prompt, $type)
    {
        $apiKey = env('GEMINI_API_KEY') ?: env('GOOGLE_AI_KEY');

        if (!empty($apiKey) && file_exists($imagePath)) {
            $imageData = file_get_contents($imagePath);
            $base64 = base64_encode($imageData);
            $mimeType = mime_content_type($imagePath) ?: 'image/jpeg';
            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->timeout(25)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data' => $base64
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.1,
                        'response_mime_type' => 'application/json'
                    ]
                ]);

                if ($response->successful()) {
                    $jsonText = $response->json('candidates.0.content.parts.0.text');
                    $clean = trim(str_replace(['```json', '```'], '', $jsonText));
                    $data = json_decode($clean, true);

                    if (is_array($data)) {
                        if (isset($data['is_valid']) && $data['is_valid'] === false) {
                            return [
                                'success' => false,
                                'message' => $data['error_message'] ?? 'Yüklenen görsel geçerli bir araç bakım faturası veya ruhsat olarak doğrulanamadı.'
                            ];
                        }

                        unset($data['is_valid']);
                        return [
                            'success' => true,
                            'engine' => 'Gemini 1.5 Flash Vision AI',
                            'data' => $data
                        ];
                    }
                } else {
                    Log::error('Gemini Vision OCR Response Error: ' . $response->body());
                }
            } catch (\Exception $e) {
                Log::error('Gemini Vision OCR Exception: ' . $e->getMessage());
            }
        }

        // Eğer API key yoksa veya bağlantı başarısızsa sahte uydurma veri üretilmez, kullanıcıya net bilgi verilir
        return [
            'success' => false,
            'message' => 'Vision AI görsel analizini tamamlayamadı. Görselin net bir araç faturası/ruhsatı olduğundan emin olun veya gerçek yapay zeka okuma için .env dosyasına GEMINI_API_KEY tanımlayın.'
        ];
    }
}
