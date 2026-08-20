@extends('layouts.app')

@section('title', 'SmartGaraj - Kontrol Paneli')

@section('content')
<div class="container py-4">

    <!-- ÜST İSTATİSTİK KARTLARI -->
    <div class="row g-3 mb-4">
        <!-- 1. KART: SEÇİLİ ARAÇ HARCAMASI -->
        <div class="col-md-4">
            <div class="card-custom stat-card">
                <div class="stat-label">
                    <i class="bi bi-wallet2 text-warning"></i>
                    <span>ARAÇ HARCAMASI (SEÇİLİ)</span>
                </div>
                <div class="stat-value text-warning">
                    {{ number_format($toplamHarcama, 2, ',', '.') }} ₺
                </div>
            </div>
        </div>

        <!-- 2. KART: TOPLAM KAYITLI ARAÇ -->
        <div class="col-md-4">
            <div class="card-custom stat-card">
                <div class="stat-label">
                    <i class="bi bi-car-front-fill text-info"></i>
                    <span>GARAJDAKİ TOPLAM ARAÇ</span>
                </div>
                <div class="stat-value text-info">
                    {{ $toplamArac }}
                </div>
            </div>
        </div>

        <!-- 3. KART: SİSTEM DURUMU -->
        <div class="col-md-4">
            <div class="card-custom stat-card">
                <div class="stat-label">
                    <i class="bi bi-shield-check text-success"></i>
                    <span>ALTYAPI DURUMU</span>
                </div>
                <div class="stat-value text-success fs-3 d-flex align-items-center gap-2">
                    <span class="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 py-2 px-3">
                        <i class="bi bi-activity me-1"></i>PostgreSQL & API Aktif
                    </span>
                </div>
            </div>
        </div>
    </div>

    @if($arac)
    <!-- AKTİF ARAÇ HERO KARTI -->
    <div class="card-custom mb-4 p-4">
        <div class="row align-items-center g-4">
            <!-- Sol: Araç İkonu ve Temel Bilgiler -->
            <div class="col-lg-7">
                <div class="d-flex align-items-start gap-3">
                    <div class="p-3 rounded-4 bg-dark bg-opacity-50 border border-secondary border-opacity-25 text-warning fs-1">
                        <i class="bi bi-car-front"></i>
                    </div>
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <span class="badge-plate">{{ $arac->plaka }}</span>
                            <span class="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-25">
                                {{ strtoupper($arac->ruhsat_tipi) }}
                            </span>
                            @if($arac->yil)
                                <span class="badge bg-dark border border-secondary border-opacity-25 text-muted">{{ $arac->yil }} Model</span>
                            @endif
                        </div>
                        <h2 class="fw-bold mb-1">{{ $arac->marka }} {{ $arac->model }}</h2>
                        <div class="d-flex align-items-center gap-3 text-muted small mt-2">
                            <span><i class="bi bi-speedometer2 text-warning me-1"></i><strong>{{ number_format($arac->guncel_km, 0, ',', '.') }}</strong> KM</span>
                            @if($arac->motor)
                                <span>&bull;</span>
                                <span><i class="bi bi-cpu text-info me-1"></i>{{ $arac->motor }}</span>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sağ: Araç Değiştirme Dropdown ve Butonlar -->
            <div class="col-lg-5">
                <div class="d-flex flex-column gap-2 ms-lg-auto" style="max-width: 320px;">
                    <!-- Araç Değiştirme Formu -->
                    <form action="{{ route('dashboard') }}" method="GET" class="w-100 mb-1">
                        <select name="secili_arac" class="form-select w-100" onchange="this.form.submit()">
                            @foreach($tumAraclar as $a_opt)
                                <option value="{{ $a_opt->id }}" {{ $arac->id == $a_opt->id ? 'selected' : '' }}>
                                    {{ $a_opt->marka }} {{ $a_opt->model }} ({{ $a_opt->plaka }})
                                </option>
                            @endforeach
                        </select>
                    </form>

                    <!-- Akıllı Analiz Butonu -->
                    <button class="btn-glow w-100 d-flex align-items-center justify-content-center gap-2" data-bs-toggle="modal" data-bs-target="#aiModal" onclick="loadDiagnosis({{ $arac->id }})">
                        <span>✨</span>
                        <span>Akıllı Analiz Motoru</span>
                    </button>

                    <!-- Hızlı Bakım Ekle Butonu -->
                    <a href="{{ route('maintenances.create', ['arac_id' => $arac->id]) }}" class="btn btn-outline-custom w-100 text-center">
                        <i class="bi bi-wrench me-1 text-warning"></i>Bu Araca Bakım Ekle
                    </a>
                </div>
            </div>
        </div>

        <!-- TARİH & YASAL ROZETLER (TÜVTÜRK / SİGORTA / KASKO) -->
        <div class="row g-3 mt-3 pt-3 border-top border-secondary border-opacity-25">
            <!-- 1. TÜVTÜRK Muayene -->
            @php $muaBadge = $arac->inspection_badge; @endphp
            <div class="col-md-4">
                <div class="badge-status-box border border-{{ $muaBadge['color'] }} border-opacity-50 bg-{{ $muaBadge['color'] }} bg-opacity-10">
                    <span class="text-{{ $muaBadge['color'] }} d-flex align-items-center gap-2">
                        <i class="bi {{ $muaBadge['icon'] }}"></i>TÜVTÜRK Muayene
                    </span>
                    <span class="badge {{ $muaBadge['badge_class'] }}">{{ $muaBadge['text'] }}</span>
                </div>
            </div>

            <!-- 2. Zorunlu Trafik Sigortası -->
            @php $sigBadge = $arac->insurance_badge; @endphp
            <div class="col-md-4">
                <div class="badge-status-box border border-{{ $sigBadge['color'] }} border-opacity-50 bg-{{ $sigBadge['color'] }} bg-opacity-10">
                    <span class="text-{{ $sigBadge['color'] }} d-flex align-items-center gap-2">
                        <i class="bi {{ $sigBadge['icon'] }}"></i>Trafik Sigortası
                    </span>
                    <span class="badge {{ $sigBadge['badge_class'] }}">{{ $sigBadge['text'] }}</span>
                </div>
            </div>

            <!-- 3. Kasko Poliçesi -->
            @php $kasBadge = $arac->kasko_badge; @endphp
            <div class="col-md-4">
                <div class="badge-status-box border border-{{ $kasBadge['color'] }} border-opacity-50 bg-{{ $kasBadge['color'] }} bg-opacity-10">
                    <span class="text-{{ $kasBadge['color'] }} d-flex align-items-center gap-2">
                        <i class="bi {{ $kasBadge['icon'] }}"></i>Kasko Poliçesi
                    </span>
                    <span class="badge {{ $kasBadge['badge_class'] }}">{{ $kasBadge['text'] }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- BAKIM GEÇMİŞİ TABLOSU -->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0">
            <i class="bi bi-clock-history text-warning me-2"></i>Son Bakım Kayıtları
        </h4>
        <a href="{{ route('maintenances.create', ['arac_id' => $arac->id]) }}" class="btn btn-outline-custom btn-sm">
            <i class="bi bi-plus-lg me-1"></i>Yeni Kayıt Ekle
        </a>
    </div>

    <div class="table-custom-container mb-4">
        <div class="table-responsive">
            <table class="table table-custom align-middle">
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>İşlem Türü & Detay</th>
                        <th>Kilometre</th>
                        <th class="text-end">Maliyet</th>
                        <th class="text-end">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($bakimlar as $row)
                        <tr>
                            <td class="fw-semibold text-muted">
                                <i class="bi bi-calendar3 me-1 text-warning"></i>
                                {{ $row->islem_tarihi ? $row->islem_tarihi->format('d.m.Y') : '-' }}
                            </td>
                            <td>
                                <div class="fw-bold text-white">{{ $row->islem_turu }}</div>
                                @if($row->aciklama)
                                    <small class="text-muted">{{ $row->aciklama }}</small>
                                @endif
                            </td>
                            <td>
                                <span class="badge bg-dark border border-secondary border-opacity-25 px-2 py-1 text-light">
                                    {{ number_format($row->islem_km, 0, ',', '.') }} KM
                                </span>
                            </td>
                            <td class="text-end text-warning fw-bold fs-6">
                                {{ number_format($row->maliyet_tl, 2, ',', '.') }} ₺
                            </td>
                            <td class="text-end">
                                <form action="{{ route('maintenances.destroy', $row->id) }}" method="POST" onsubmit="return confirm('Bu bakım kaydını silmek istediğinize emin misiniz?');" class="d-inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger border-0" title="Kaydı Sil">
                                        <i class="bi bi-trash3"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center py-5 text-muted">
                                <i class="bi bi-journal-x fs-1 d-block mb-2 text-secondary"></i>
                                Bu araca ait henüz bir bakım kaydı bulunmuyor.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    @else
    <!-- GARAJ BOŞ EKRANI -->
    <div class="card-custom text-center py-5 my-4">
        <i class="bi bi-car-front fs-1 text-warning d-block mb-3"></i>
        <h3 class="fw-bold">Garajınızda Henüz Kayıtlı Araç Yok</h3>
        <p class="text-muted">SmartGaraj'ın akıllı takip özelliklerini kullanmak için ilk aracınızı ekleyin.</p>
        <div class="mt-3">
            <a href="{{ route('vehicles.create') }}" class="btn-glow px-4 py-2 text-decoration-none">
                <i class="bi bi-plus-lg me-1"></i>İlk Aracınızı Ekleyin
            </a>
        </div>
    </div>
    @endif

</div>

<!-- AKILLI ANALİZ MODAL -->
<div class="modal fade" id="aiModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold text-warning d-flex align-items-center gap-2">
                    <i class="bi bi-cpu"></i>
                    <span>SmartGaraj Akıllı Diagnostik Raporu</span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4" id="ai-modal-body">
                <div class="text-center py-5">
                    <div class="spinner-border text-warning mb-3" style="width: 3rem; height: 3rem;"></div>
                    <h5 class="fw-bold">Araç Parametreleri Ayrıştırılıyor...</h5>
                    <p class="text-muted small">Kilometre, motor spesifikasyonları ve bakım geçmişi analiz ediliyor.</p>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script>
function loadDiagnosis(vehicleId) {
    const modalBody = document.getElementById('ai-modal-body');
    modalBody.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-warning mb-3" style="width: 3rem; height: 3rem;"></div>
            <h5 class="fw-bold">SmartGaraj Analiz Motoru Çalışıyor...</h5>
            <p class="text-muted small">Motor spesifikasyonları, kilometre ve servis geçmişi parametreleri ayrıştırılıyor.</p>
        </div>
    `;

    fetch(`/dashboard/diagnosis/${vehicleId}`)
        .then(response => response.json())
        .then(data => {
            let score = data.health_score;
            let scoreColor = data.status_color === 'success' ? 'text-success' : (data.status_color === 'warning' ? 'text-warning' : 'text-danger');
            let progressBg = data.status_color === 'success' ? '#10b981' : (data.status_color === 'warning' ? '#f59e0b' : '#ef4444');

            let completedHtml = data.completed_checks.map(c => `
                <li class="d-flex align-items-start gap-2 mb-2 text-success small">
                    <i class="bi bi-check-circle-fill mt-1"></i>
                    <span>${c}</span>
                </li>
            `).join('');

            let criticalHtml = data.critical_warnings.map(w => `
                <li class="d-flex align-items-start gap-2 mb-2 text-danger small">
                    <i class="bi bi-exclamation-triangle-fill mt-1"></i>
                    <span>${w}</span>
                </li>
            `).join('');

            let routineHtml = data.routine_advices.map(r => `
                <li class="d-flex align-items-start gap-2 mb-2 text-warning small">
                    <i class="bi bi-info-circle-fill mt-1"></i>
                    <span>${r}</span>
                </li>
            `).join('');

            modalBody.innerHTML = `
                <div>
                    <!-- Skor Kartı -->
                    <div class="p-4 rounded-4 mb-4" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color);">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <span class="small fw-bold text-muted text-uppercase d-block">SİSTEM SAĞLIK ENDEKSİ</span>
                                <h6 class="text-white mb-0 mt-1">${data.brand_model} &bull; <span class="badge bg-secondary">${data.motor_type}</span></h6>
                            </div>
                            <span class="fs-2 fw-bold ${scoreColor}">${score} / 100</span>
                        </div>
                        <div class="progress mt-3" style="height: 10px; background: #262938; border-radius: 6px;">
                            <div class="progress-bar" style="width: ${score}%; background: ${progressBg}; transition: width 0.8s ease;"></div>
                        </div>
                    </div>

                    <!-- Detay Listeleri -->
                    <div class="card-custom p-3">
                        <h6 class="text-warning small fw-bold mb-3 text-uppercase">
                            <i class="bi bi-list-check me-1"></i> Diagnostik Değerlendirme Raporu
                        </h6>
                        <ul class="list-unstyled mb-0">
                            ${completedHtml}
                            ${criticalHtml}
                            ${routineHtml}
                        </ul>
                    </div>
                </div>
            `;
        })
        .catch(err => {
            modalBody.innerHTML = `
                <div class="alert alert-danger">
                    Analiz yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
                </div>
            `;
        });
}
</script>
@endsection
