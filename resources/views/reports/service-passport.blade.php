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

        @php
            $partsStatus = [];
            if ($vehicle->accidents) {
                foreach ($vehicle->accidents as $acc) {
                    if (!empty($acc->hasarli_parcalar) && is_array($acc->hasarli_parcalar)) {
                        foreach ($acc->hasarli_parcalar as $p) {
                            if (!empty($p['parca'])) {
                                $pName = $p['parca'];
                                $pStatus = $p['durum'] ?? 'Boyalı';
                                $curr = $partsStatus[$pName] ?? null;
                                if (!$curr || $pStatus === 'Değişen' || ($pStatus === 'Boyalı' && $curr === 'Lokal Boyalı')) {
                                    $partsStatus[$pName] = $pStatus;
                                }
                            }
                        }
                    }
                }
            }

            $getColor = function($partName) use ($partsStatus) {
                $st = $partsStatus[$partName] ?? null;
                if ($st === 'Değişen') return '#ef4444';
                if ($st === 'Boyalı') return '#3b82f6';
                if ($st === 'Lokal Boyalı') return '#f59e0b';
                return '#ffffff';
            };

            $getStroke = function($partName) use ($partsStatus) {
                $st = $partsStatus[$partName] ?? null;
                if ($st === 'Değişen') return '#b91c1c';
                if ($st === 'Boyalı') return '#1d4ed8';
                if ($st === 'Lokal Boyalı') return '#d97706';
                return '#94a3b8';
            };

            $getTextColor = function($partName) use ($partsStatus) {
                $st = $partsStatus[$partName] ?? null;
                return $st ? '#ffffff' : '#64748b';
            };

            $getBadge = function($partName) use ($partsStatus) {
                $st = $partsStatus[$partName] ?? null;
                if ($st === 'Değişen') return 'D';
                if ($st === 'Boyalı') return 'B';
                if ($st === 'Lokal Boyalı') return 'L';
                return '';
            };

            $processedPartsCount = count($partsStatus);
        @endphp

        <!-- Kaporta Ekspertiz Durumu & Şeması -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
                <div>
                    <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                        🎨 Kaporta Ekspertiz Durumu (Boya & Değişen Şeması)
                    </h3>
                    <p style="font-size: 11px; color: #64748b; margin-top: 2px;">TSE standartlarında kuşbakışı boyalı ve değişen parça dağılımı</p>
                </div>
                <div>
                    @if($processedPartsCount > 0)
                        <span style="background: #fef3c7; color: #d97706; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800;">
                            {{ $processedPartsCount }} Parçada İşlem Var
                        </span>
                    @else
                        <span style="background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800;">
                            ✓ Hatasız / Boyasız / Orijinal
                        </span>
                    @endif
                </div>
            </div>

            <div style="display: flex; flex-direction: row; gap: 24px; align-items: center; justify-content: center;">
                <!-- Car Schematic SVG -->
                <div style="width: 170px; flex-shrink: 0; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px; display: flex; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <svg viewBox="0 0 260 520" style="width: 150px; height: 300px; overflow: visible;">
                        <!-- Wheels Background -->
                        <circle cx="48" cy="115" r="20" fill="#334155" />
                        <circle cx="212" cy="115" r="20" fill="#334155" />
                        <circle cx="48" cy="405" r="20" fill="#334155" />
                        <circle cx="212" cy="405" r="20" fill="#334155" />

                        <!-- Wheel Rims -->
                        <circle cx="48" cy="115" r="11" fill="#64748b" />
                        <circle cx="212" cy="115" r="11" fill="#64748b" />
                        <circle cx="48" cy="405" r="11" fill="#64748b" />
                        <circle cx="212" cy="405" r="11" fill="#64748b" />

                        <!-- Front Bumper -->
                        <path d="M 68 35 C 95 18, 165 18, 192 35 L 186 52 C 158 40, 102 40, 74 52 Z" fill="{{ $getColor('Ön Tampon') }}" stroke="{{ $getStroke('Ön Tampon') }}" stroke-width="2" />
                        @if($getBadge('Ön Tampon'))
                            <text x="130" y="42" text-anchor="middle" font-size="12" font-weight="900" fill="{{ $getTextColor('Ön Tampon') }}">{{ $getBadge('Ön Tampon') }}</text>
                        @endif

                        <!-- Rear Bumper -->
                        <path d="M 74 472 C 102 484, 158 484, 186 472 L 192 490 C 165 504, 95 504, 68 490 Z" fill="{{ $getColor('Arka Tampon') }}" stroke="{{ $getStroke('Arka Tampon') }}" stroke-width="2" />
                        @if($getBadge('Arka Tampon'))
                            <text x="130" y="487" text-anchor="middle" font-size="12" font-weight="900" fill="{{ $getTextColor('Arka Tampon') }}">{{ $getBadge('Arka Tampon') }}</text>
                        @endif

                        <!-- Sol Ön Çamurluk -->
                        <path d="M 68 55 C 65 80, 48 95, 48 135 L 75 135 L 75 62 Z" fill="{{ $getColor('Sol Ön Çamurluk') }}" stroke="{{ $getStroke('Sol Ön Çamurluk') }}" stroke-width="2" />
                        @if($getBadge('Sol Ön Çamurluk'))
                            <text x="61" y="105" text-anchor="middle" font-size="12" font-weight="900" fill="{{ $getTextColor('Sol Ön Çamurluk') }}">{{ $getBadge('Sol Ön Çamurluk') }}</text>
                        @endif

                        <!-- Sağ Ön Çamurluk -->
                        <path d="M 192 55 C 195 80, 212 95, 212 135 L 185 135 L 185 62 Z" fill="{{ $getColor('Sağ Ön Çamurluk') }}" stroke="{{ $getStroke('Sağ Ön Çamurluk') }}" stroke-width="2" />
                        @if($getBadge('Sağ Ön Çamurluk'))
                            <text x="199" y="105" text-anchor="middle" font-size="12" font-weight="900" fill="{{ $getTextColor('Sağ Ön Çamurluk') }}">{{ $getBadge('Sağ Ön Çamurluk') }}</text>
                        @endif

                        <!-- Motor Kaputu -->
                        <path d="M 78 57 L 182 57 L 182 135 L 78 135 Z" fill="{{ $getColor('Motor Kaputu') }}" stroke="{{ $getStroke('Motor Kaputu') }}" stroke-width="2" />
                        @if($getBadge('Motor Kaputu'))
                            <text x="130" y="102" text-anchor="middle" font-size="16" font-weight="900" fill="{{ $getTextColor('Motor Kaputu') }}">{{ $getBadge('Motor Kaputu') }}</text>
                        @endif

                        <!-- Sol Ön Kapı -->
                        <path d="M 44 140 L 73 140 L 73 245 L 40 245 C 38 210, 40 175, 44 140 Z" fill="{{ $getColor('Sol Ön Kapı') }}" stroke="{{ $getStroke('Sol Ön Kapı') }}" stroke-width="2" />
                        @if($getBadge('Sol Ön Kapı'))
                            <text x="56" y="198" text-anchor="middle" font-size="14" font-weight="900" fill="{{ $getTextColor('Sol Ön Kapı') }}">{{ $getBadge('Sol Ön Kapı') }}</text>
                        @endif

                        <!-- Sağ Ön Kapı -->
                        <path d="M 216 140 L 187 140 L 187 245 L 220 245 C 222 210, 220 175, 216 140 Z" fill="{{ $getColor('Sağ Ön Kapı') }}" stroke="{{ $getStroke('Sağ Ön Kapı') }}" stroke-width="2" />
                        @if($getBadge('Sağ Ön Kapı'))
                            <text x="204" y="198" text-anchor="middle" font-size="14" font-weight="900" fill="{{ $getTextColor('Sağ Ön Kapı') }}">{{ $getBadge('Sağ Ön Kapı') }}</text>
                        @endif

                        <!-- Tavan -->
                        <path d="M 76 140 L 184 140 L 184 355 L 76 355 Z" fill="{{ $getColor('Tavan') }}" stroke="{{ $getStroke('Tavan') }}" stroke-width="2" />
                        @if($getBadge('Tavan'))
                            <text x="130" y="253" text-anchor="middle" font-size="18" font-weight="900" fill="{{ $getTextColor('Tavan') }}">{{ $getBadge('Tavan') }}</text>
                        @endif

                        <!-- Sol Arka Kapı -->
                        <path d="M 40 250 L 73 250 L 73 355 L 44 355 C 40 320, 38 285, 40 250 Z" fill="{{ $getColor('Sol Arka Kapı') }}" stroke="{{ $getStroke('Sol Arka Kapı') }}" stroke-width="2" />
                        @if($getBadge('Sol Arka Kapı'))
                            <text x="56" y="308" text-anchor="middle" font-size="14" font-weight="900" fill="{{ $getTextColor('Sol Arka Kapı') }}">{{ $getBadge('Sol Arka Kapı') }}</text>
                        @endif

                        <!-- Sağ Arka Kapı -->
                        <path d="M 220 250 L 187 250 L 187 355 L 216 355 C 220 320, 222 285, 220 250 Z" fill="{{ $getColor('Sağ Arka Kapı') }}" stroke="{{ $getStroke('Sağ Arka Kapı') }}" stroke-width="2" />
                        @if($getBadge('Sağ Arka Kapı'))
                            <text x="204" y="308" text-anchor="middle" font-size="14" font-weight="900" fill="{{ $getTextColor('Sağ Arka Kapı') }}">{{ $getBadge('Sağ Arka Kapı') }}</text>
                        @endif

                        <!-- Sol Arka Çamurluk -->
                        <path d="M 48 360 C 48 400, 65 415, 68 440 L 75 433 L 75 360 Z" fill="{{ $getColor('Sol Arka Çamurluk') }}" stroke="{{ $getStroke('Sol Arka Çamurluk') }}" stroke-width="2" />
                        @if($getBadge('Sol Arka Çamurluk'))
                            <text x="61" y="405" text-anchor="middle" font-size="12" font-weight="900" fill="{{ $getTextColor('Sol Arka Çamurluk') }}">{{ $getBadge('Sol Arka Çamurluk') }}</text>
                        @endif

                        <!-- Sağ Arka Çamurluk -->
                        <path d="M 212 360 C 212 400, 195 415, 192 440 L 185 433 L 185 360 Z" fill="{{ $getColor('Sağ Arka Çamurluk') }}" stroke="{{ $getStroke('Sağ Arka Çamurluk') }}" stroke-width="2" />
                        @if($getBadge('Sağ Arka Çamurluk'))
                            <text x="199" y="405" text-anchor="middle" font-size="12" font-weight="900" fill="{{ $getTextColor('Sağ Arka Çamurluk') }}">{{ $getBadge('Sağ Arka Çamurluk') }}</text>
                        @endif

                        <!-- Bagaj Kapağı -->
                        <path d="M 78 360 L 182 360 L 182 438 L 78 438 Z" fill="{{ $getColor('Bagaj Kapağı') }}" stroke="{{ $getStroke('Bagaj Kapağı') }}" stroke-width="2" />
                        @if($getBadge('Bagaj Kapağı'))
                            <text x="130" y="405" text-anchor="middle" font-size="16" font-weight="900" fill="{{ $getTextColor('Bagaj Kapağı') }}">{{ $getBadge('Bagaj Kapağı') }}</text>
                        @endif
                    </svg>
                </div>

                <!-- Legend & Detailed Breakdown -->
                <div style="flex: 1;">
                    <!-- Legend Badges -->
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;">
                        <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; background: #fee2e2; color: #b91c1c; font-size: 11px; font-weight: 800; border: 1px solid #fca5a5;">
                            <span style="width: 8px; height: 8px; border-radius: 2px; background: #ef4444;"></span> Değişen (D)
                        </span>
                        <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 800; border: 1px solid #93c5fd;">
                            <span style="width: 8px; height: 8px; border-radius: 2px; background: #3b82f6;"></span> Boyalı (B)
                        </span>
                        <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 800; border: 1px solid #fcd34d;">
                            <span style="width: 8px; height: 8px; border-radius: 2px; background: #f59e0b;"></span> Lokal Boyalı (L)
                        </span>
                        <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 800; border: 1px solid #cbd5e1;">
                            <span style="width: 8px; height: 8px; border-radius: 2px; background: #ffffff; border: 1px solid #94a3b8;"></span> Orijinal
                        </span>
                    </div>

                    <!-- Processed Parts List -->
                    @if($processedPartsCount > 0)
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px;">
                            <div style="font-size: 11px; font-weight: 800; color: #475569; margin-bottom: 6px; text-transform: uppercase;">İşlem Gören Parçalar:</div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                                @foreach($partsStatus as $pName => $pDurum)
                                    <div style="font-size: 12px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                                        @if($pDurum === 'Değişen')
                                            <span style="color: #ef4444;">●</span> {{ $pName }}: <span style="color: #dc2626; font-weight: 800;">Değişen</span>
                                        @elseif($pDurum === 'Boyalı')
                                            <span style="color: #3b82f6;">●</span> {{ $pName }}: <span style="color: #2563eb; font-weight: 800;">Boyalı</span>
                                        @else
                                            <span style="color: #f59e0b;">●</span> {{ $pName }}: <span style="color: #d97706; font-weight: 800;">Lokal</span>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @else
                        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px; text-align: center;">
                            <p style="font-size: 12px; font-weight: 800; color: #059669;">
                                🛡️ Araç üzerinde herhangi bir boyalı veya değişen kaporta parçası bulunmamaktadır.
                            </p>
                        </div>
                    @endif
                </div>
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
