@extends('layouts.app')

@section('title', 'SmartGaraj - Yeni Araç Ekle')

@section('content')
<div class="container py-4">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card-custom p-4 p-md-5">
                <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                    <div class="p-3 rounded-4 bg-warning bg-opacity-10 text-warning fs-3">
                        <i class="bi bi-car-front-fill"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold mb-1">Yeni Araç Ekle</h3>
                        <p class="text-muted small mb-0">Aracınızın teknik özelliklerini ve muayene/sigorta tarihlerini kaydedin.</p>
                    </div>
                </div>

                <form action="{{ route('vehicles.store') }}" method="POST">
                    @csrf

                    <!-- 1. PLAKA VE RUHSAT TİPİ -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Plaka <span class="text-danger">*</span></label>
                            <input type="text" name="arac_plaka" class="form-control text-uppercase" placeholder="34 ABC 123" required autofocus>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Ruhsat Tipi</label>
                            <select name="ruhsat_tipi" class="form-select">
                                <option value="otomobil" selected>Otomobil (Bireysel)</option>
                                <option value="ticari">Ticari / Kamyonet</option>
                                <option value="motosiklet">Motosiklet</option>
                                <option value="diger">Diğer</option>
                            </select>
                        </div>
                    </div>

                    <!-- 2. MARKA, MODEL, MOTOR -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Marka <span class="text-danger">*</span></label>
                            <select name="arac_marka" id="arac_marka" class="form-select" required onchange="toggleCustomFields()">
                                <option value="">Marka Seçiniz...</option>
                                @foreach($markalar as $m)
                                    <option value="{{ $m['ad'] }}">{{ $m['ad'] }}</option>
                                @endforeach
                                <option value="diger">Diğer (Listede Yok)</option>
                            </select>
                            <input type="text" name="arac_marka_diger" id="arac_marka_diger" class="form-control mt-2 d-none" placeholder="Marka Adı Yazınız">
                        </div>

                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Model <span class="text-danger">*</span></label>
                            <input type="text" name="arac_model" class="form-control" placeholder="Örn: Megane IV / Corolla" required>
                        </div>

                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Motor / Paket</label>
                            <input type="text" name="arac_motor" class="form-control" placeholder="Örn: 1.5 Blue dCi / 1.6 VVT-i">
                        </div>
                    </div>

                    <!-- 3. YIL VE KİLOMETRE -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Model Yılı</label>
                            <input type="number" name="arac_yil" class="form-control" placeholder="Örn: 2020" min="1950" max="{{ date('Y') + 1 }}">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Güncel Kilometre (KM) <span class="text-danger">*</span></label>
                            <input type="number" name="arac_guncel_km" class="form-control" placeholder="Örn: 85000" min="0" required>
                        </div>
                    </div>

                    <!-- 4. YASAL SÜREÇLER (MUAYENE, SİGORTA, KASKO) -->
                    <h5 class="fw-bold text-warning mt-4 mb-3"><i class="bi bi-calendar-event me-2"></i>Yasal Süreç & Hatırlatıcı Tarihleri</h5>

                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label small text-muted">TÜVTÜRK Muayene Bitiş</label>
                            <input type="date" name="muayene_bitis" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small text-muted">Trafik Sigortası Bitiş</label>
                            <input type="date" name="sigorta_bitis" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small text-muted">Kasko Bitiş</label>
                            <input type="date" name="kasko_bitis" class="form-control">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top border-secondary border-opacity-25">
                        <a href="{{ route('dashboard') }}" class="btn btn-outline-custom">İptal</a>
                        <button type="submit" class="btn-glow px-4">
                            <i class="bi bi-check2-circle me-1"></i>Aracı Garaja Ekle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
function toggleCustomFields() {
    const markaSelect = document.getElementById('arac_marka');
    const digerInput = document.getElementById('arac_marka_diger');
    if (markaSelect.value === 'diger') {
        digerInput.classList.remove('d-none');
        digerInput.setAttribute('required', 'required');
    } else {
        digerInput.classList.add('d-none');
        digerInput.removeAttribute('required');
    }
}
</script>
@endsection
