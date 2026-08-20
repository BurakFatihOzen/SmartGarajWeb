<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>SmartGaraj Servis Pasaportu - {{ $vehicle->plaka }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; background-color: #0b0c10; color: #f1f5f9; padding: 24px; }
        .page-container { max-width: 900px; margin: 0 auto; background: #13151b; border: 1px solid #2a2e3d; border-radius: 16px; padding: 32px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px; }
        .logo-title { font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; }
        .logo-title span { color: #f59e0b; }
        .badge-verified { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        
        .vehicle-hero { display: flex; gap: 24px; background: #181b24; border: 1px solid #232736; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
        .vehicle-img { width: 220px; height: 140px; border-radius: 10px; object-fit: cover; background: #0e1017; border: 1px solid #33384a; }
        .vehicle-info { flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .info-item { background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .info-label { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
        .info-val { font-size: 14px; font-weight: bold; color: #ffffff; margin-top: 2px; }
        
        .status-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .status-card { background: #181b24; border: 1px solid #232736; padding: 14px; border-radius: 12px; text-align: center; }
        .status-title { font-size: 11px; color: #94a3b8; font-weight: bold; text-transform: uppercase; }
        .status-date { font-size: 15px; font-weight: 900; color: #f59e0b; margin-top: 4px; }

        .section-title { font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #1c202d; color: #cbd5e1; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #33384a; }
        td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #232736; color: #e2e8f0; }
        tr:nth-child(even) { background: rgba(255,255,255,0.01); }

        .footer-qr { display: flex; justify-content: space-between; align-items: center; background: #181b24; border: 1px solid #232736; border-radius: 12px; padding: 16px; margin-top: 24px; }
        .qr-info { max-width: 60%; }
        .qr-info h4 { color: #f59e0b; font-size: 14px; font-weight: bold; }
        .qr-info p { font-size: 11px; color: #94a3b8; margin-top: 4px; line-height: 1.5; }
        .qr-box img { width: 90px; height: 90px; border-radius: 8px; background: white; padding: 4px; }

        .no-print-bar { position: fixed; top: 12px; right: 12px; display: flex; gap: 8px; z-index: 100; }
        .btn-print { background: #f59e0b; color: #000; font-weight: bold; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-size: 13px; box-shadow: 0 4px 12px rgba(245,158,11,0.3); }

        @media print {
            body { background: #ffffff; color: #000000; padding: 0; }
            .page-container { background: #ffffff; border: none; padding: 0; max-width: 100%; }
            .no-print-bar { display: none; }
            .header { border-bottom: 2px solid #000000; }
            .logo-title { color: #000000; }
            .logo-title span { color: #d97706; }
            .vehicle-hero, .status-card, .footer-qr, .info-item { background: #f8fafc; border: 1px solid #cbd5e1; }
            .info-val, .status-date, .section-title { color: #000000; }
            .info-label, .status-title, .qr-info p { color: #64748b; }
            th { background: #f1f5f9; color: #0f172a; border-bottom: 1px solid #94a3b8; }
            td { color: #0f172a; border-bottom: 1px solid #e2e8f0; }
            .badge-verified { background: #ecfdf5; color: #047857; border: 1px solid #10b981; }
        }
    </style>
</head>
<body>
    <div class="no-print-bar">
        <button class="btn-print" onclick="window.print()">🖨️ PDF Olarak Kaydet / Yazdır</button>
    </div>

    <div class="page-container">
        <!-- Header -->
        <div class="header">
            <div>
                <div class="logo-title">🛠️ Smart<span>Garaj</span></div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Resmi Dijital Araç Servis & Bakım Pasaportu</div>
            </div>
            <div class="badge-verified">
                ✓ Doğrulanmış Araç Kaydı
            </div>
        </div>

        <!-- Vehicle Hero Info -->
        <div class="vehicle-hero">
            @if($vehicle->fotograf_url)
                <img src="{{ asset($vehicle->fotograf_url) }}" class="vehicle-img" alt="{{ $vehicle->plaka }}">
            @else
                <div class="vehicle-img" style="display: flex; align-items: center; justify-content: center; font-size: 40px;">
                    🚘
                </div>
            @endif
            <div class="vehicle-info">
                <div class="info-item">
                    <div class="info-label">Plaka</div>
                    <div class="info-val" style="color: #f59e0b;">{{ $vehicle->plaka }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Marka / Model</div>
                    <div class="info-val">{{ $vehicle->marka }} {{ $vehicle->model }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Model Yılı</div>
                    <div class="info-val">{{ $vehicle->yil ?: 'Belirtilmedi' }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Güncel Kilometre</div>
                    <div class="info-val">{{ number_format($vehicle->guncel_km, 0, ',', '.') }} KM</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Motor & Paket</div>
                    <div class="info-val">{{ $vehicle->motor ?: 'Standart' }}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Şasi Numarası</div>
                    <div class="info-val" style="font-family: monospace; font-size: 12px;">{{ $vehicle->sasi_no ?: 'Kayıtlı Değil' }}</div>
                </div>
            </div>
        </div>

        <!-- Status Cards -->
        <div class="status-grid">
            <div class="status-card">
                <div class="status-title">TÜVTÜRK Muayene</div>
                <div class="status-date">{{ $vehicle->muayene_bitis ? \Carbon\Carbon::parse($vehicle->muayene_bitis)->format('d.m.Y') : 'Yok' }}</div>
            </div>
            <div class="status-card">
                <div class="status-title">Trafik Sigortası</div>
                <div class="status-date">{{ $vehicle->sigorta_bitis ? \Carbon\Carbon::parse($vehicle->sigorta_bitis)->format('d.m.Y') : 'Yok' }}</div>
            </div>
            <div class="status-card">
                <div class="status-title">Kasko Poliçesi</div>
                <div class="status-date">{{ $vehicle->kasko_bitis ? \Carbon\Carbon::parse($vehicle->kasko_bitis)->format('d.m.Y') : 'Yok' }}</div>
            </div>
        </div>

        <!-- Maintenance History Table -->
        <div class="section-title">
            <span>🔧 Servis & Bakım Geçmişi Dökümü ({{ $vehicle->maintenances->count() }} Kayıt)</span>
            <span style="font-size: 13px; color: #10b981;">Toplam Harcama: {{ number_format($vehicle->maintenances->sum('maliyet_tl'), 2, ',', '.') }} TL</span>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Tarih</th>
                    <th>İşlem Türü / Açıklama</th>
                    <th>Servis KM</th>
                    <th>Maliyet (TL)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($vehicle->maintenances as $m)
                    <tr>
                        <td style="white-space: nowrap; font-weight: bold;">{{ \Carbon\Carbon::parse($m->islem_tarihi)->format('d.m.Y') }}</td>
                        <td>
                            <strong>{{ $m->islem_turu }}</strong>
                            @if($m->aciklama)
                                <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">{{ $m->aciklama }}</div>
                            @endif
                        </td>
                        <td style="font-family: monospace;">{{ number_format($m->islem_km, 0, ',', '.') }} KM</td>
                        <td style="font-weight: bold; color: #10b981; white-space: nowrap;">₺{{ number_format($m->maliyet_tl, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align: center; color: #64748b; padding: 24px;">Henüz kayıtlı bir bakım geçmişi bulunmamaktadır.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- QR Verification Footer -->
        <div class="footer-qr">
            <div class="qr-info">
                <h4>🛡️ QR Kodlu Resmi Doğrulama</h4>
                <p>Bu raporun orijinalliği ve gerçek servis kayıtları SmartGaraj güvenli veri tabanı ile mühürlenmiştir. Yan taraftaki QR kodu telefonunuzun kamerasıyla okutarak raporun güncelliğini anında teyit edebilirsiniz.</p>
                <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Oluşturulma Tarihi: {{ now()->format('d.m.Y H:i') }} &bull; Belge No: SG-{{ strtoupper(substr($vehicle->qr_token, 0, 8)) }}</div>
            </div>
            <div class="qr-box">
                <img src="{{ $qrCodeUrl }}" alt="SmartGaraj QR Doğrulama">
            </div>
        </div>
    </div>
</body>
</html>
