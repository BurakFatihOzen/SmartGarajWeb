import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { SPARE_PARTS_CATEGORIES } from '@/data/sparePartsData';
import OcrModal from '@/Components/OcrModal';
import { 
    Wrench, 
    ArrowLeft, 
    CheckCircle2, 
    Calendar, 
    Gauge, 
    FileText, 
    Tag, 
    Search, 
    Sparkles, 
    Layers,
    AlertCircle,
    Scan,
    Zap
} from 'lucide-react';

const OPERATION_CATEGORIES = [
    {
        name: 'Periyodik & Sıvı Bakımları',
        items: [
            'Standart Periyodik Bakım (Yağ + Filtreler)',
            'Sadece Yağ ve Yağ Filtresi Değişimi',
            'Antifriz / Soğutma Sıvısı Yenileme',
            'Şanzıman Yağı / Diferansiyel Yağı Değişimi'
        ]
    },
    {
        name: 'Motor & Mekanik (Ağır Bakım)',
        items: [
            'Ağır Bakım (Triger Seti / Zincir Değişimi)',
            'V Kayışı / Gergi Rulmanı Değişimi',
            'Devridaim Su Pompası & Termostat Değişimi',
            'Turbo Revizyonu / Değişimi',
            'Enjektör Temizliği & Yakıt Pompası Revizyonu',
            'Silindir Kapak Contası / Motor Revizyonu'
        ]
    },
    {
        name: 'Fren & Yürüyen Aksam',
        items: [
            'Fren Balatası Değişimi (Ön/Arka)',
            'Fren Diski & Balata Takımı Yenileme',
            'Alt Takım (Rotil, Salıncak, Z Rot, Burçlar)',
            'Amortisör / Helezon Yay / Takoz Değişimi',
            'Teker Bilyası / Porya Rulmanı Değişimi'
        ]
    },
    {
        name: 'Aktarma, Elektrik & İklimlendirme',
        items: [
            'Baskı Balata (Debriyaj Seti & Volan) Değişimi',
            'Buji & Ateşleme Bobini Değişimi',
            'Akü Değişimi & Şarj Dinamosu Revizyonu',
            'Klima Gazı Dolumu & Kompresör Bakımı',
            'Lastik Değişimi & Rot Balans Ayarı'
        ]
    }
];

export default function MaintenanceCreate({ vehicles = [], selectedVehicleId = null }) {
    const defaultCar = vehicles.find(v => v.id == selectedVehicleId) || vehicles[0] || null;

    const [isOcrOpen, setIsOcrOpen] = useState(false);
    const [selectedCategoryTab, setSelectedCategoryTab] = useState(0);
    const [partBrandSearch, setPartBrandSearch] = useState('');
    const [isCustomOperation, setIsCustomOperation] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        arac_id: defaultCar ? defaultCar.id : '',
        islem_tarihi: new Date().toISOString().split('T')[0],
        islem_turu: 'Standart Periyodik Bakım (Yağ + Filtreler)',
        islem_km: defaultCar ? defaultCar.guncel_km : 0,
        maliyet_tl: '',
        aciklama: '',
    });

    const handleOcrExtracted = (extracted) => {
        if (extracted.tarih) setData('islem_tarihi', extracted.tarih);
        if (extracted.islem_turu) setData('islem_turu', extracted.islem_turu);
        if (extracted.islem_km) setData('islem_km', extracted.islem_km);
        if (extracted.toplam_tutar) setData('maliyet_tl', String(extracted.toplam_tutar));
        
        let desc = extracted.aciklama || '';
        if (extracted.parcalar && extracted.parcalar.length > 0) {
            const partNames = extracted.parcalar.map(p => `${p.ad} (₺${p.fiyat || p.birim_fiyat || ''})`).join(', ');
            desc = desc ? `${desc} | Parçalar: ${partNames}` : `Kullanılan Parçalar: ${partNames}`;
        }
        if (desc) setData('aciklama', desc);
    };

    const activeVehicle = vehicles.find(v => v.id == data.arac_id) || defaultCar;

    const handleCarSelectChange = (carId) => {
        const car = vehicles.find(v => v.id == carId);
        setData(prev => ({
            ...prev,
            arac_id: carId,
            islem_km: car ? car.guncel_km : prev.islem_km,
        }));
    };

    const handleOperationSelect = (op) => {
        setIsCustomOperation(false);
        setData('islem_turu', op);
    };

    const handleAddBrandTag = (brandName) => {
        const currentDesc = data.aciklama ? data.aciklama.trim() : '';
        if (currentDesc.includes(brandName)) return; // Already added

        const newDesc = currentDesc 
            ? `${currentDesc}, ${brandName}`
            : `Kullanılan Parça/Marka: ${brandName}`;
        
        setData('aciklama', newDesc);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/maintenances');
    };

    const filteredPartCategories = SPARE_PARTS_CATEGORIES.map(cat => ({
        ...cat,
        brands: cat.brands.filter(b => 
            b.name.toLowerCase().includes(partBrandSearch.toLowerCase()) ||
            b.desc.toLowerCase().includes(partBrandSearch.toLowerCase())
        )
    })).filter(cat => cat.brands.length > 0);

    return (
        <AppLayout title="Bakım Kaydı Ekle">
            <Head title="Bakım Kaydı Ekle - SmartGaraj" />
            
            <OcrModal 
                isOpen={isOcrOpen} 
                onClose={() => setIsOcrOpen(false)} 
                onExtracted={handleOcrExtracted} 
            />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/dashboard"
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Yeni Servis & Bakım Kaydı</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Aracınıza yapılan işlemleri ve masrafları sisteme işleyin.</p>
                        </div>
                    </div>
                </div>

                {/* AI FATURA OCR BANNER */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center space-x-3.5 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-extrabold text-white">Servis Faturası veya Fişiniz mi Var?</div>
                            <div className="text-xs text-slate-300 mt-0.5">
                                Fatura fotoğrafını yükleyin; toplam maliyet, tarih, servis km ve parça listesi saniyeler içinde otomatik doldurulsun!
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOcrOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/25 transition-all shrink-0 cursor-pointer active:scale-95"
                    >
                        <Scan className="w-4 h-4" />
                        <span>🧠 Vision AI ile Faturayı Tara</span>
                    </button>
                </div>

                {/* Main Form Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#13151b] border border-white/[0.08] shadow-2xl space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* SECTION 1: ARAÇ SEÇİMİ */}
                        <div>
                            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                                1. İşlem Yapılan Araç
                            </label>
                            <select
                                value={data.arac_id}
                                onChange={(e) => handleCarSelectChange(e.target.value)}
                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer font-bold"
                                required
                            >
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id} className="bg-[#13151b] text-white">
                                        {v.marka} {v.model} - {v.plaka} (Güncel: {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM)
                                    </option>
                                ))}
                            </select>
                            {errors.arac_id && <p className="text-red-400 text-xs mt-1">{errors.arac_id}</p>}
                        </div>

                        {/* SECTION 2: İŞLEM KATEGORİLERİ & HIZLI SEÇİM */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                                    2. Yapılan Bakım / Onarım Türü
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCustomOperation(true);
                                        setData('islem_turu', '');
                                    }}
                                    className="text-xs text-amber-400 hover:underline font-semibold"
                                >
                                    + Farklı / Özel İşlem Yaz
                                </button>
                            </div>

                            {/* Category Accordion / Grid */}
                            <div className="space-y-3">
                                {OPERATION_CATEGORIES.map((cat, idx) => (
                                    <div key={cat.name} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                        <span className="block text-[11px] font-bold text-slate-400 uppercase mb-2">
                                            {cat.name}
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {cat.items.map((op) => {
                                                const isSelected = !isCustomOperation && data.islem_turu === op;
                                                return (
                                                    <button
                                                        key={op}
                                                        type="button"
                                                        onClick={() => handleOperationSelect(op)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all text-left ${
                                                            isSelected
                                                                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                                                                : 'bg-[#1a1d27] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                                                        }`}
                                                    >
                                                        {op}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Custom Operation Field */}
                            {isCustomOperation && (
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-2">
                                    <label className="block text-xs font-bold text-amber-400">
                                        Özel İşlem Tanımı Yazın:
                                    </label>
                                    <input
                                        type="text"
                                        value={data.islem_turu}
                                        onChange={(e) => setData('islem_turu', e.target.value)}
                                        placeholder="Örn: Kaporta boya koruma, Seramik kaplama, LPG filtre değişimi..."
                                        className="w-full bg-[#1a1d27] border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                        required
                                        autoFocus
                                    />
                                </div>
                            )}

                            {errors.islem_turu && <p className="text-red-400 text-xs mt-1">{errors.islem_turu}</p>}
                        </div>

                        {/* SECTION 3: TARİH, KM & MALİYET */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    İşlem Tarihi <span className="text-amber-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.islem_tarihi}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setData('islem_tarihi', e.target.value)}
                                    className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono font-bold"
                                    required
                                />
                                {errors.islem_tarihi && <p className="text-red-400 text-xs mt-1">{errors.islem_tarihi}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    İşlem Anındaki KM <span className="text-amber-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="2000000"
                                    value={data.islem_km}
                                    onChange={(e) => setData('islem_km', e.target.value)}
                                    placeholder="Örn: 165000"
                                    className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-mono font-bold"
                                    required
                                />
                                {activeVehicle && Number(data.islem_km) > Number(activeVehicle.guncel_km) && (
                                    <span className="text-[10px] text-amber-400 mt-1 block font-medium">
                                        ⚡ Aracın güncel KM'si otomatik güncellenecek ({Number(data.islem_km).toLocaleString('tr-TR')} KM).
                                    </span>
                                )}
                                {errors.islem_km && <p className="text-red-400 text-xs mt-1">{errors.islem_km}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                    Toplam Tutar (TL) <span className="text-amber-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.maliyet_tl}
                                    onChange={(e) => setData('maliyet_tl', e.target.value)}
                                    placeholder="Örn: 4500"
                                    className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-amber-400 font-mono font-black focus:outline-none focus:border-amber-500 transition-all"
                                    required
                                />
                                {errors.maliyet_tl && <p className="text-red-400 text-xs mt-1">{errors.maliyet_tl}</p>}
                            </div>
                        </div>

                        {/* SECTION 4: YEDEK PARÇA & YAĞ MARKALARI KATALOĞU */}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span>Yedek Parça, Yağ & OEM Markası Seçici</span>
                                    </label>
                                    <span className="text-[11px] text-slate-400">
                                        Kullandığınız parçaların markasına tıklayarak açıklamaya tek tıkla ekleyin.
                                    </span>
                                </div>

                                {/* Part Search */}
                                <div className="relative w-full sm:w-60">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        value={partBrandSearch}
                                        onChange={(e) => setPartBrandSearch(e.target.value)}
                                        placeholder="Parça markası ara... (Motul, Bosch)"
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            {/* Categorized Spare Parts Brand Pills */}
                            <div className="max-h-60 overflow-y-auto space-y-3 p-3 rounded-2xl bg-[#161821] border border-white/[0.06]">
                                {filteredPartCategories.map((cat) => (
                                    <div key={cat.name} className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                                            {cat.name}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {cat.brands.map((brand) => (
                                                <button
                                                    key={brand.name}
                                                    type="button"
                                                    onClick={() => handleAddBrandTag(brand.name)}
                                                    title={brand.desc}
                                                    className="px-2.5 py-1 rounded-lg bg-[#1e212c] hover:bg-amber-500 hover:text-black border border-white/5 text-[11px] font-semibold text-slate-300 transition-all flex items-center space-x-1.5 group"
                                                >
                                                    <span>{brand.name}</span>
                                                    <span className="text-[9px] opacity-60 group-hover:opacity-90">({brand.desc.split(' ')[0]})</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 5: AÇIKLAMA / PARÇA DETAYLARI */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Açıklama, Kullanılan Parçalar ve Yağ Detayları
                            </label>
                            <textarea
                                value={data.aciklama}
                                onChange={(e) => setData('aciklama', e.target.value)}
                                rows="3"
                                placeholder="Örn: Motul 8100 X-Clean 5W-30 Motor Yağı (4.5 Litre), Mann Yağ & Hava Filtresi, Bosch Ön Balata değişimi yapıldı."
                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-sans"
                            />
                            {errors.aciklama && <p className="text-red-400 text-xs mt-1">{errors.aciklama}</p>}
                        </div>

                        {/* SUBMIT BUTTONS */}
                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                            >
                                İptal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{processing ? 'Kaydediliyor...' : 'Bakım Kaydını Sisteme İşle'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
