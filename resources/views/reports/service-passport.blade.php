<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartGaraj Servis Pasaportu — {{ $vehicle->plaka }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            background-color: #f1f5f9; 
            color: #0f172a; 
            padding: 32px 16px; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        .page-container { 
            max-width: 860px; 
            margin: 0 auto; 
            background: #ffffff; 
            border: 1px solid #e2e8f0; 
            border-radius: 20px; 
            padding: 36px 40px; 
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
        }
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: 2px solid #f59e0b; 
            padding-bottom: 20px; 
            margin-bottom: 24px; 
        }
        .logo-title { 
            font-size: 24px; 
            font-weight: 900; 
            color: #0f172a; 
            letter-spacing: -0.5px; 
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .logo-title span { color: #d97706; }
        .header-sub { font-size: 12px; color: #64748b; margin-top: 3px; font-weight: 500; }
        .badge-verified { 
            background: #ecfdf5; 
            color: #059669; 
            border: 1px solid #a7f3d0; 
            padding: 6px 14px; 
            border-radius: 9999px; 
            font-size: 12px; 
            font-weight: 800; 
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .vehicle-hero { 
            display: flex; 
            gap: 24px; 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 16px; 
            padding: 20px; 
            margin-bottom: 24px; 
            align-items: center;
        }
        .vehicle-img-container { 
            width: 220px; 
            height: 150px; 
            border-radius: 12px; 
            position: relative;
            background: #0f172a; 
            border: 1px solid #cbd5e1; 
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .vehicle-img-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            object-fit: cover;
            filter: blur(8px);
            opacity: 0.4;
            transform: scale(1.1);
        }
        .vehicle-img-main {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 4px;
        }
        
        .vehicle-info { flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .info-item { background: #ffffff; padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .info-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
        .info-val { font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px; }
        .info-val.plate { 
            display: inline-flex;
            align-items: center;
            background: #0f172a;
            color: #ffffff;
            font-family: monospace;
            padding: 2px 8px;
            border-radius: 6px;
            border-left: 5px solid #2563eb;
            font-size: 13px;
        }
        
        .status-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .status-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px 16px; border-radius: 14px; text-align: left; }
        .status-title { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; }
        .status-date { font-size: 16px; font-weight: 900; color: #d97706; margin-top: 4px; font-family: monospace; }
        .status-date.blue { color: #2563eb; }
        .status-date.indigo { color: #4f46e5; }

        .section-header { 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            margin-bottom: 12px; 
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        .section-title { font-size: 15px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px; }
        .total-spent { font-size: 13px; font-weight: 800; color: #059669; }

        table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        th { background: #f8fafc; color: #475569; text-align: left; padding: 12px 14px; font-size: 11px; text-transform: uppercase; font-weight: 800; border-bottom: 1px solid #e2e8f0; }
        td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) td { background: #fafbfc; }

        .footer-qr { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 16px; 
            padding: 18px 20px; 
            margin-top: 24px; 
            gap: 20px;
        }
        .qr-info { flex: 1; }
        .qr-info h4 { color: #d97706; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 6px; }
        .qr-info p { font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.5; }
        .qr-meta { font-size: 10px; color: #94a3b8; margin-top: 6px; font-family: monospace; }
        .qr-box { 
            width: 100px; 
            height: 100px; 
            border-radius: 10px; 
            background: #ffffff; 
            border: 1px solid #cbd5e1; 
            padding: 4px; 
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .qr-box img { width: 100%; height: 100%; object-fit: contain; }

        .no-print-bar { 
            position: fixed; 
            top: 16px; 
            right: 20px; 
            display: flex; 
            gap: 10px; 
            z-index: 100; 
        }
        .btn-print { 
            background: #f59e0b; 
            color: #000000; 
            font-weight: 800; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 12px; 
            cursor: pointer; 
            font-size: 13px; 
            box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35); 
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .btn-print:hover { background: #d97706; color: #ffffff; }

        @media print {
            body { background: #ffffff; color: #000000; padding: 0; }
            .page-container { background: #ffffff; border: none; padding: 0; max-width: 100%; box-shadow: none; }
            .no-print-bar { display: none !important; }
            .header { border-bottom: 2px solid #000000; }
            .vehicle-hero, .status-card, .footer-qr, .info-item, table { border: 1px solid #cbd5e1; }
            th { background: #f1f5f9; color: #0f172a; }
            td { color: #0f172a; }
        }
    </style>
</head>
<body>
    <div class="no-print-bar">
        <button class="btn-print" onclick="window.print()">
            <span>🖨️ PDF Olarak Kaydet / Yazdır</span>
        </button>
    </div>

    <div class="page-container">
        <!-- Header -->
        <div class="header">
            <div>
                <div class="logo-title">
                    🛠️ Smart<span>Garaj</span>
                </div>
                <div class="header-sub">Resmi Dijital Araç Servis & Bakım Pasaportu</div>
            </div>
            <div class="badge-verified">
                ✓ Doğrulanmış Araç Kaydı
            </div>
        </div>

        <!-- Vehicle Hero Info -->
        <div class="vehicle-hero">
            <div class="vehicle-img-container">
                @if($vehicle->fotograf_url)
                    <img src="{{ asset($vehicle->fotograf_url) }}" class="vehicle-img-bg" alt="">
                    <img src="{{ asset($vehicle->fotograf_url) }}" class="vehicle-img-main" alt="{{ $vehicle->plaka }}">
                @else
                    <div style="font-size: 36px; color: #94a3b8;">🚘</div>
                @endif
            </div>
            <div class="vehicle-info">
                <div class="info-item">
                    <div class="info-label">Plaka</div>
                    <div class="info-val">
                        <span class="plate">{{ $vehicle->plaka }}</span>
                    </div>
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
                    <div class="info-val">{{ $vehicle->motor ?: 'Standart Motor' }}</div>
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
                <div class="status-date blue">{{ $vehicle->sigorta_bitis ? \Carbon\Carbon::parse($vehicle->sigorta_bitis)->format('d.m.Y') : 'Yok' }}</div>
            </div>
            <div class="status-card">
                <div class="status-title">Kasko Poliçesi</div>
                <div class="status-date indigo">{{ $vehicle->kasko_bitis ? \Carbon\Carbon::parse($vehicle->kasko_bitis)->format('d.m.Y') : 'Yok' }}</div>
            </div>
        </div>

        <!-- Maintenance History Table -->
        <div class="section-header">
            <div class="section-title">
                🔧 Servis & Bakım Geçmişi ({{ $vehicle->maintenances->count() }} Kayıt)
            </div>
            <div class="total-spent">
                Toplam Harcama: ₺{{ number_format($vehicle->maintenances->sum('maliyet_tl'), 2, ',', '.') }}
            </div>
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
                        <td style="white-space: nowrap; font-weight: 700; font-family: monospace;">{{ \Carbon\Carbon::parse($m->islem_tarihi)->format('d.m.Y') }}</td>
                        <td>
                            <strong>{{ $m->islem_turu }}</strong>
                            @if($m->aciklama)
                                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">{{ $m->aciklama }}</div>
                            @endif
                        </td>
                        <td style="font-family: monospace; font-weight: 600;">{{ number_format($m->islem_km, 0, ',', '.') }} KM</td>
                        <td style="font-weight: 800; color: #059669; white-space: nowrap; font-family: monospace;">₺{{ number_format($m->maliyet_tl, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" style="text-align: center; color: #94a3b8; padding: 24px;">Henüz kayıtlı bir bakım geçmişi bulunmamaktadır.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Kaza & Hasar Geçmişi (Tramer) -->
        <div class="section-header" style="margin-top: 24px;">
            <div class="section-title">
                💥 Hasar & Kaza Geçmişi / Tramer Kayıtları ({{ $vehicle->accidents ? $vehicle->accidents->count() : 0 }} Kayıt)
            </div>
            <div class="total-spent" style="color: #dc2626;">
                Tramer Toplamı: ₺{{ number_format($vehicle->accidents ? $vehicle->accidents->where('tramer_kaydi', true)->sum('tramer_tutari') : 0, 2, ',', '.') }}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Olay Tarihi</th>
                    <th>Kaza Türü / Dosya</th>
                    <th>Kusur</th>
                    <th>Hasarlı Parçalar</th>
                    <th>Hasar Tutarı</th>
                </tr>
            </thead>
            <tbody>
                @if($vehicle->accidents && $vehicle->accidents->count() > 0)
                    @foreach($vehicle->accidents as $acc)
                        <tr>
                            <td style="white-space: nowrap; font-weight: 700; font-family: monospace;">{{ \Carbon\Carbon::parse($acc->kaza_tarihi)->format('d.m.Y') }}</td>
                            <td>
                                <strong>{{ $acc->kaza_turu }}</strong>
                                @if($acc->sigorta_sirketi)
                                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">{{ $acc->sigorta_sirketi }} {{ $acc->dosya_no ? "({$acc->dosya_no})" : '' }}</div>
                                @endif
                            </td>
                            <td style="font-weight: 700;">%{{ $acc->kusur_orani ?? 0 }}</td>
                            <td>
                                @if(!empty($acc->hasarli_parcalar) && is_array($acc->hasarli_parcalar))
                                    @foreach($acc->hasarli_parcalar as $p)
                                        <span style="display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: 700; border-radius: 4px; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; margin: 1px;">
                                            {{ $p['parca'] ?? '' }} ({{ $p['durum'] ?? '' }})
                                        </span>
                                    @endforeach
                                @else
                                    <span style="color: #94a3b8; font-size: 11px;">Belirtilmedi</span>
                                @endif
                            </td>
                            <td style="font-weight: 800; color: #dc2626; white-space: nowrap; font-family: monospace;">
                                ₺{{ number_format($acc->hasar_tutari, 2, ',', '.') }}
                                @if($acc->tramer_kaydi)
                                    <div style="font-size: 10px; color: #d97706; font-weight: 700;">(Tramer Kayıtlı)</div>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="5" style="text-align: center; color: #059669; font-weight: 700; padding: 18px;">
                            🛡️ Bu araca ait kayıtlı kaza veya tramer hasar kaydı bulunmamaktadır (Hatasız / Boyasız).
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>

        <!-- QR Verification Footer -->
        <div class="footer-qr">
            <div class="qr-info">
                <h4>🛡️ QR Kodlu Resmi Doğrulama</h4>
                <p>Bu raporun orijinalliği ve gerçek servis kayıtları SmartGaraj veri tabanı ile mühürlenmiştir. Yan taraftaki QR kodu telefonunuzun kamerasıyla okutarak güncel dijital pasaportu anında doğrulayabilirsiniz.</p>
                <div class="qr-meta">Oluşturulma Tarihi: {{ now()->format('d.m.Y H:i') }} &bull; Belge No: SG-{{ strtoupper(substr($vehicle->qr_token, 0, 8)) }}</div>
            </div>
            <div class="qr-box">
                <img src="{{ $qrCodeUrl }}" alt="SmartGaraj QR Doğrulama">
            </div>
        </div>
    </div>
</body>
</html>
