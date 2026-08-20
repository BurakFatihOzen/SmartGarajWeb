import React, { useState } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import OcrModal from '@/Components/OcrModal';
import { 
    Wrench, 
    ArrowLeft, 
    Calendar, 
    Gauge, 
    Coins, 
    CheckCircle2, 
    Tag, 
    Search,
    Sparkles,
    Scan
} from 'lucide-react';

const OPERATION_CATEGORIES = [
    {
        name: 'Periyodik & Rutin Bakım',
        items: [
            'Standart Periyodik Bakım (Yağ + Filtreler)',
            'Motor Yağı Değişimi',
            'Yağ Filtresi Değişimi',
            'Hava Filtresi Değişimi',
            'Polen (Kabin) Filtresi Değişimi',
            'Yakıt (Mazot/Benzin) Filtresi Değişimi',
            'Buji / Isıtma Bujisi Değişimi',
            'Antifriz / Soğutma Sıvısı Yenileme',
            'Fren Hidroliği Değişimi',
        ]
    },
    {
        name: 'Ağır Bakım & Motor Grubu',
        items: [
            'Ağır Bakım (Triger Seti / Zincir Değişimi)',
            'V Kayışı / Gergi Rulmanı Değişimi',
            'Devirdaim (Su Pompası) Değişimi',
            'Baskı Balata (Debriyaj Seti) Değişimi',
            'Volant Değişimi / Taşlama',
            'Şanzıman Yağı Değişimi',
            'Turbo Revizyonu / Değişimi',
            'Enjektör Temizliği / Revizyonu',
            'EGR / DPF Temizliği & İptali',
            'Subap Ayarı & Silindir Kapak Contası',
        ]
    },
    {
        name: 'Fren & Yürüyen Aksam',
        items: [
            'Fren Balatası Değişimi (Ön/Arka)',
            'Fren Diski Değişimi / Torna İşlemi',
            'Amortisör / Helezon Yay Değişimi',
            'Salıncak / Rot / Rotil / Z-Rot Değişimi',
            'Tekerlek Rulmanı (Porya) Değişimi',
            'Aks / Aks Körüğü Değişimi',
            'Direksiyon Kutusu / Pompası Tamiri',
        ]
    },
    {
        name: 'Elektrik, Akü & Konfor',
        items: [
            'Akü Değişimi',
            'Şarj / Marş Dinamosu Revizyonu',
            'Klima Gazı / Radyatör İşlemleri',
            'Far / Stop / Aydınlatma Ampul Değişimi',
            'Silecek Takımı Değişimi',
            'Lastik Değişimi / Balans Ayarı',
            'Detaylı Kuaför / Pasta Cila & Boya Koruma',
            'TÜVTÜRK Muayene Hazırlığı & Ücreti',
        ]
    }
];

const SPARE_PARTS_CATEGORIES = [
    {
        name: 'Motor Yağları & Katkılar',
        brands: [
            { name: 'Motul', desc: '8100 X-Clean / Eco-nergy' },
            { name: 'Castrol', desc: 'EDGE / Magnatec' },
            { name: 'Liqui Moly', desc: 'Top Tec / Molygen' },
            { name: 'Mobil 1', desc: 'ESP / Super 3000' },
            { name: 'Shell', desc: 'Helix Ultra ECT' },
            { name: 'TotalEnergies', desc: 'Quartz Ineo' },
            { name: 'Petronas', desc: 'Syntium' },
            { name: 'Luqui Moly Katkı', desc: 'Cera Tec / Motor Clean' },
        ]
    },
    {
        name: 'Filtre Üreticileri (OEM & Premium)',
        brands: [
            { name: 'Mann Filter', desc: 'Alman Orijinal Kalite' },
            { name: 'Bosch Filter', desc: 'Premium Filtre Seti' },
            { name: 'Mahle / Knecht', desc: 'Alman OEM Standart' },
            { name: 'Filtron', desc: 'Mann Hummel Grubu' },
            { name: 'Purflux', desc: 'Fransız OEM Kalite' },
            { name: 'Ufi Filters', desc: 'İtalyan OEM Üretici' },
            { name: 'Wunder Filter', desc: 'Geniş Ürün Gamı' },
        ]
    },
    {
        name: 'Fren Sistemleri & Balata',
        brands: [
            { name: 'Brembo', desc: 'Yüksek Performans Fren' },
            { name: 'Ferodo', desc: 'Premier Balata Serisi' },
            { name: 'ATE', desc: 'Alman Fren Teknolojisi' },
            { name: 'TRW', desc: 'Orijinal Ekipman Fren' },
            { name: 'Textar', desc: 'TMD Friction Grubu' },
            { name: 'Valeo Fren', desc: 'Fransız OEM Kalite' },
        ]
    },
    {
        name: 'Triger & Debriyaj (Şanzıman)',
        brands: [
            { name: 'Gates', desc: 'PowerGrip Triger Seti' },
            { name: 'Continental (ContiTech)', desc: 'Kayış & Rulman Seti' },
            { name: 'Dayco', desc: 'OEM Zamanlama Kayışı' },
            { name: 'LuK', desc: 'Baskı Balata & Volant' },
            { name: 'Sachs', desc: 'Debriyaj & Amortisör' },
            { name: 'Valeo Debriyaj', desc: 'Debriyaj & Rulman' },
            { name: 'INA', desc: 'Gergi & Triger Rulmanı' },
            { name: 'SKF', desc: 'Porya, Rulman & Kayış' },
        ]
    },
    {
        name: 'Akü & Elektrik Aksamı',
        brands: [
            { name: 'Varta', desc: 'Silver / Blue Dynamic AGM' },
            { name: 'Mutlu Akü', desc: 'SFB / EFB Start-Stop' },
            { name: 'Bosch Akü', desc: 'S4 / S5 AGM Serisi' },
            { name: 'İnci Akü', desc: 'Formul A / AGM' },
            { name: 'NGK', desc: 'Buji & Oksijen Sensörü' },
            { name: 'Denso', desc: 'Buji & İklimlendirme' },
        ]
    }
];

export default function MaintenanceCreate({ vehicles = [], selected_vehicle_id = null }) {
    const defaultVehicleId = selected_vehicle_id || (vehicles.length > 0 ? vehicles[0].id : '');
    
    const activeVehicle = vehicles.find(v => String(v.id) === String(defaultVehicleId));

    const { data, setData, post, processing, errors } = useForm({
        arac_id: defaultVehicleId,
        islem_tarihi: new Date().toISOString().split('T')[0],
        islem_turu: 'Standart Periyodik Bakım (Yağ + Filtreler)',
        islem_km: activeVehicle ? activeVehicle.guncel_km : '',
        maliyet_tl: '',
        aciklama: '',
    });

    const [isCustomOperation, setIsCustomOperation] = useState(false);
    const [partBrandSearch, setPartBrandSearch] = useState('');
    const [isOcrOpen, setIsOcrOpen] = useState(false);

    const handleOcrExtracted = (extracted) => {
        if (extracted.tarih) setData('islem_tarihi', extracted.tarih);
        if (extracted.islem_km) setData('islem_km', extracted.islem_km);
        if (extracted.toplam_tutar) setData('maliyet_tl', extracted.toplam_tutar);
        if (extracted.islem_turu) {
            setData('islem_turu', extracted.islem_turu);
            setIsCustomOperation(true);
        }
        
        // Parça açıklamalarını oluştur
        let aciklamaMetni = "";
        if (extracted.servis_adi) {
            aciklamaMetni += `Servis: ${extracted.servis_adi}\n`;
        }
        if (extracted.aciklama) {
            aciklamaMetni += `${extracted.aciklama}\n`;
        }
        if (extracted.parcalar && extracted.parcalar.length > 0) {
            aciklamaMetni += "\n--- Faturadaki Kalemler & Parçalar ---\n";
            extracted.parcalar.forEach((p, idx) => {
                aciklamaMetni += `${idx + 1}. ${p.ad} (${p.adet} Adet) - ₺${p.fiyat}\n`;
            });
        }

        if (aciklamaMetni) {
            setData('aciklama', aciklamaMetni.trim());
        }
    };

    const handleCarSelectChange = (carId) => {
        const car = vehicles.find(v => String(v.id) === String(carId));
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
                type="fatura"
                onDataExtracted={handleOcrExtracted} 
                onExtracted={handleOcrExtracted} 
            />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/dashboard"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Yeni Servis & Bakım Kaydı</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aracınıza yapılan işlemleri ve masrafları sisteme işleyin.</p>
                        </div>
                    </div>
                </div>

                {/* AI FATURA OCR BANNER */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-500/15 dark:via-indigo-500/10 dark:to-transparent border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center space-x-3.5 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white">Servis Faturası veya Fişiniz mi Var?</div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
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
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-xl space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* SECTION 1: ARAÇ SEÇİMİ */}
                        <div>
                            <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                                1. İşlem Yapılan Araç
                            </label>
                            <select
                                value={data.arac_id}
                                onChange={(e) => handleCarSelectChange(e.target.value)}
                                className="w-full bg-white dark:bg-[#1a1d27] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer font-bold shadow-2xs"
                                required
                            >
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id} className="bg-white dark:bg-[#13151b] text-slate-900 dark:text-white">
                                        {v.marka} {v.model} - {v.plaka} (Güncel: {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM)
                                    </option>
                                ))}
                            </select>
                            {errors.arac_id && <p className="text-red-500 text-xs mt-1">{errors.arac_id}</p>}
                        </div>

                        {/* SECTION 2: İŞLEM KATEGORİLERİ & HIZLI SEÇİM */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider">
                                    2. Yapılan Bakım / Onarım Türü
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCustomOperation(true);
                                        setData('islem_turu', '');
                                    }}
                                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                                >
                                    + Farklı / Özel İşlem Yaz
                                </button>
                            </div>

                            {/* Category Accordion / Grid */}
                            <div className="space-y-3">
                                {OPERATION_CATEGORIES.map((cat) => (
                                    <div key={cat.name} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
                                        <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">
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
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer shadow-2xs ${
                                                            isSelected
                                                                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                                                                : 'bg-white hover:bg-slate-100 dark:bg-[#1a1d27] text-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/5'
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
                                    <label className="block text-xs font-bold text-amber-500">
                                        Özel İşlem Tanımı Yazın:
                                    </label>
                                    <input
                                        type="text"
                                        value={data.islem_turu}
                                        onChange={(e) => setData('islem_turu', e.target.value)}
                                        placeholder="Örn: Kaporta boya koruma, Seramik kaplama, LPG filtre değişimi..."
                                        className="w-full bg-white dark:bg-[#1a1d27] border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                                        required
                                        autoFocus
                                    />
                                </div>
                            )}

                            {errors.islem_turu && <p className="text-red-500 text-xs mt-1">{errors.islem_turu}</p>}
                        </div>

                        {/* SECTION 3: TARİH, KM & MALİYET */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    İşlem Tarihi <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.islem_tarihi}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setData('islem_tarihi', e.target.value)}
                                    className="w-full bg-white dark:bg-[#1a1d27] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all font-mono font-bold shadow-2xs"
                                    required
                                />
                                {errors.islem_tarihi && <p className="text-red-500 text-xs mt-1">{errors.islem_tarihi}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    İşlem Anındaki KM <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="2000000"
                                    value={data.islem_km}
                                    onChange={(e) => setData('islem_km', e.target.value)}
                                    placeholder="Örn: 165000"
                                    className="w-full bg-white dark:bg-[#1a1d27] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all font-mono font-bold shadow-2xs"
                                    required
                                />
                                {activeVehicle && Number(data.islem_km) > Number(activeVehicle.guncel_km) && (
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 block font-medium">
                                        ⚡ Aracın güncel KM'si otomatik güncellenecek ({Number(data.islem_km).toLocaleString('tr-TR')} KM).
                                    </span>
                                )}
                                {errors.islem_km && <p className="text-red-500 text-xs mt-1">{errors.islem_km}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Toplam Tutar (TL) <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.maliyet_tl}
                                    onChange={(e) => setData('maliyet_tl', e.target.value)}
                                    placeholder="Örn: 4500"
                                    className="w-full bg-white dark:bg-[#1a1d27] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 font-mono font-black focus:outline-none focus:border-amber-500 transition-all shadow-2xs"
                                    required
                                />
                                {errors.maliyet_tl && <p className="text-red-500 text-xs mt-1">{errors.maliyet_tl}</p>}
                            </div>
                        </div>

                        {/* SECTION 4: YEDEK PARÇA & YAĞ MARKALARI KATALOĞU */}
                        <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center space-x-1.5">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span>Yedek Parça, Yağ & OEM Markası Seçici</span>
                                    </label>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
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
                                        className="w-full bg-white dark:bg-[#1a1d27] border border-slate-300 dark:border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-2xs"
                                    />
                                </div>
                            </div>

                            {/* Categorized Spare Parts Brand Pills */}
                            <div className="max-h-60 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#161821] border border-slate-200 dark:border-white/[0.06]">
                                {filteredPartCategories.map((cat) => (
                                    <div key={cat.name} className="space-y-1.5">
                                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                                            {cat.name}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {cat.brands.map((brand) => (
                                                <button
                                                    key={brand.name}
                                                    type="button"
                                                    onClick={() => handleAddBrandTag(brand.name)}
                                                    title={brand.desc}
                                                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-500 hover:text-black dark:bg-[#1e212c] dark:hover:bg-amber-500 dark:hover:text-black border border-slate-200 dark:border-white/5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center space-x-1.5 group cursor-pointer shadow-2xs"
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
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Açıklama, Kullanılan Parçalar ve Yağ Detayları
                            </label>
                            <textarea
                                value={data.aciklama}
                                onChange={(e) => setData('aciklama', e.target.value)}
                                rows="3"
                                placeholder="Örn: Motul 8100 X-Clean 5W-30 Motor Yağı (4.5 Litre), Mann Yağ & Hava Filtresi, Bosch Ön Balata değişimi yapıldı."
                                className="w-full bg-white dark:bg-[#1a1d27] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-sans shadow-2xs"
                            />
                            {errors.aciklama && <p className="text-red-500 text-xs mt-1">{errors.aciklama}</p>}
                        </div>

                        {/* SUBMIT BUTTONS */}
                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-200/80 dark:border-white/10">
                            <Link
                                href="/dashboard"
                                className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-xs font-semibold transition-colors"
                            >
                                İptal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer"
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
