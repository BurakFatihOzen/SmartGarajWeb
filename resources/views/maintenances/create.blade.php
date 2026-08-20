@extends('layouts.app')

@section('title', 'SmartGaraj - Yeni Bakım Kaydı Ekle')

@section('content')
<div class="container py-4">
    <div class="row justify-content-center">
        <div class="col-lg-7">
            <div class="card-custom p-4 p-md-5">
                <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                    <div class="p-3 rounded-4 bg-warning bg-opacity-10 text-warning fs-3">
                        <i class="bi bi-wrench-adjustable"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold mb-1">Yeni Bakım & Servis Kaydı</h3>
                        <p class="text-muted small mb-0">Aracınıza yapılan işlemleri ve parça/işçilik maliyetlerini kaydedin.</p>
                    </div>
                </div>

                <form action="{{ route('maintenances.store') }}" method="POST">
                    @csrf

                    <!-- 1. ARAÇ SEÇİMİ -->
                    <div class="mb-4">
                        <label class="form-label fw-semibold">Araç <span class="text-danger">*</span></label>
                        <select name="arac_id" class="form-select" required>
                            @foreach($tumAraclar as $a)
                                <option value="{{ $a->id }}" {{ (isset($seciliAracId) && $seciliAracId == $a->id) ? 'selected' : '' }}>
                                    {{ $a->marka }} {{ $a->model }} — {{ $a->plaka }} (Güncel: {{ number_format($a->guncel_km, 0, ',', '.') }} KM)
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <!-- 2. İŞLEM TÜRÜ -->
                    <div class="mb-4">
                        <label class="form-label fw-semibold">Yapılan İşlem / Bakım Türü <span class="text-danger">*</span></label>
                        <select name="bakim_turu" id="bakim_turu" class="form-select" required onchange="toggleCustomBakim()">
                            <option value="Periyodik Bakım (Yağ + Filtreler)" selected>Periyodik Bakım (Yağ + Filtreler)</option>
                            <option value="Ağır Bakım (Triger Seti / Zincir Değişimi)">Ağır Bakım (Triger Seti / Zincir Değişimi)</option>
                            <option value="Fren Balatası & Disk Değişimi">Fren Balatası & Disk Değişimi</option>
                            <option value="Baskı Balata (Debriyaj Seti) Değişimi">Baskı Balata (Debriyaj Seti) Değişimi</option>
                            <option value="Alt Takım & Süspansiyon (Rot/Salıncak/Amortisör)">Alt Takım & Süspansiyon (Rot/Salıncak/Amortisör)</option>
                            <option value="Ateşleme Sistemi (Buji / Bobin Değişimi)">Ateşleme Sistemi (Buji / Bobin Değişimi)</option>
                            <option value="Akü Değişimi">Akü Değişimi</option>
                            <option value="Lastik Değişimi / Rot-Balans">Lastik Değişimi / Rot-Balans</option>
                            <option value="Klima Gazı / Radyatör Bakımı">Klima Gazı / Radyatör Bakımı</option>
                            <option value="diger">Diğer (Özel İşlem)</option>
                        </select>
                        <input type="text" name="bakim_turu_diger" id="bakim_turu_diger" class="form-control mt-2 d-none" placeholder="İşlem Adını Yazınız">
                    </div>

                    <!-- 3. KİLOMETRE, MALİYET, TARİH -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">İşlem Kilometresi <span class="text-danger">*</span></label>
                            <input type="number" name="bakim_km" class="form-control" placeholder="Örn: 90000" min="0" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Maliyet (₺) <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" name="bakim_maliyet" class="form-control" placeholder="Örn: 4500.00" min="0" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">İşlem Tarihi <span class="text-danger">*</span></label>
                            <input type="date" name="bakim_tarihi" class="form-control" value="{{ date('Y-m-d') }}" required>
                        </div>
                    </div>

                    <!-- 4. AÇIKLAMA -->
                    <div class="mb-4">
                        <label class="form-label fw-semibold">Açıklama / Değişen Parçalar (Opsiyonel)</label>
                        <textarea name="bakim_aciklama" class="form-control" rows="3" placeholder="Örn: Motul 5W-30 motor yağı, Mann filtre seti ve Bosch buji takımı takıldı."></textarea>
                    </div>

                    <div class="d-flex justify-content-end gap-3 pt-3 border-top border-secondary border-opacity-25">
                        <a href="{{ route('dashboard') }}" class="btn btn-outline-custom">İptal</a>
                        <button type="submit" class="btn-glow px-4">
                            <i class="bi bi-check2-circle me-1"></i>Bakım Kaydını Ekle
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
function toggleCustomBakim() {
    const select = document.getElementById('bakim_turu');
    const input = document.getElementById('bakim_turu_diger');
    if (select.value === 'diger') {
        input.classList.remove('d-none');
        input.setAttribute('required', 'required');
    } else {
        input.classList.add('d-none');
        input.removeAttribute('required');
    }
}
</script>
@endsection
