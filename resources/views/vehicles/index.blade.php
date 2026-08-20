@extends('layouts.app')

@section('title', 'SmartGaraj - Garajımdaki Araçlar')

@section('content')
<div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
            <h2 class="fw-bold mb-1"><i class="bi bi-car-front text-warning me-2"></i>Garajımdaki Araçlar</h2>
            <p class="text-muted small mb-0">Tüm araçlarınızın güncel kilometrelerini ve bakım geçmişini buradan yönetin.</p>
        </div>
        <a href="{{ route('vehicles.create') }}" class="btn-glow text-decoration-none">
            <i class="bi bi-plus-lg me-1"></i>Yeni Araç Ekle
        </a>
    </div>

    <div class="row g-4">
        @forelse($araclar as $arac)
            <div class="col-md-6 col-lg-4">
                <div class="card-custom h-100 d-flex flex-column justify-content-between">
                    <div>
                        <!-- Üst Bar: Plaka & Ruhsat -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge-plate">{{ $arac->plaka }}</span>
                            <span class="badge bg-dark border border-secondary border-opacity-25 text-muted">
                                {{ $arac->yil ? $arac->yil . ' Model' : 'Model Yılı Yok' }}
                            </span>
                        </div>

                        <!-- Araç Başlığı -->
                        <h4 class="fw-bold mb-1 text-white">{{ $arac->marka }} {{ $arac->model }}</h4>
                        <div class="text-muted small mb-3">
                            <i class="bi bi-cpu text-info me-1"></i>{{ $arac->motor ?: 'Standart Motor' }}
                        </div>

                        <!-- Kilometre & Harcama Bilgisi -->
                        <div class="p-3 rounded-3 mb-3" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color);">
                            <div class="row text-center">
                                <div class="col-6 border-end border-secondary border-opacity-25">
                                    <span class="small text-muted d-block">GÜNCEL KM</span>
                                    <strong class="text-white fs-6">{{ number_format($arac->guncel_km, 0, ',', '.') }}</strong>
                                </div>
                                <div class="col-6">
                                    <span class="small text-muted d-block">TOPLAM BAKIM</span>
                                    <strong class="text-warning fs-6">{{ number_format($arac->total_spent, 2, ',', '.') }} ₺</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Tarih Rozetleri -->
                        @php 
                            $mBadge = $arac->inspection_badge;
                            $sBadge = $arac->insurance_badge;
                        @endphp
                        <div class="d-flex flex-column gap-2 mb-4">
                            <div class="d-flex justify-content-between small">
                                <span class="text-muted"><i class="bi bi-shield-check me-1"></i>TÜVTÜRK Muayene:</span>
                                <span class="badge {{ $mBadge['badge_class'] }}">{{ $mBadge['text'] }}</span>
                            </div>
                            <div class="d-flex justify-content-between small">
                                <span class="text-muted"><i class="bi bi-file-earmark-text me-1"></i>Sigorta:</span>
                                <span class="badge {{ $sBadge['badge_class'] }}">{{ $sBadge['text'] }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Alt Butonlar -->
                    <div class="d-flex gap-2 pt-3 border-top border-secondary border-opacity-25">
                        <a href="{{ route('dashboard', ['secili_arac' => $arac->id]) }}" class="btn btn-outline-custom btn-sm flex-fill text-center">
                            <i class="bi bi-speedometer2 me-1"></i>İncele
                        </a>
                        <a href="{{ route('maintenances.create', ['arac_id' => $arac->id]) }}" class="btn btn-warning btn-sm fw-bold flex-fill text-center text-dark">
                            <i class="bi bi-wrench me-1"></i>Bakım Ekle
                        </a>
                        <form action="{{ route('vehicles.destroy', $arac->id) }}" method="POST" onsubmit="return confirm('{{ $arac->plaka }} plakalı aracı ve tüm bakım kayıtlarını silmek istediğinize emin misiniz?');" class="m-0 p-0">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-outline-danger btn-sm" title="Aracı Sil">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12">
                <div class="card-custom text-center py-5">
                    <i class="bi bi-car-front fs-1 text-warning d-block mb-3"></i>
                    <h3 class="fw-bold">Henüz Aracınız Yok</h3>
                    <p class="text-muted">Garajınıza ilk aracınızı ekleyerek başlayabilirsiniz.</p>
                    <a href="{{ route('vehicles.create') }}" class="btn-glow text-decoration-none mt-2">
                        <i class="bi bi-plus-lg me-1"></i>Araç Ekle
                    </a>
                </div>
            </div>
        @endforelse
    </div>

</div>
@endsection
