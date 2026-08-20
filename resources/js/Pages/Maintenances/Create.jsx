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
    Scan,
    Car,
    FileText,
    Check,
    Plus,
    X,
    Clock,
    Shield,
    SlidersHorizontal,
    PackageCheck
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
            'Detaylı Kuaför / Boya Koruma',
            'TÜVTÜRK Muayene Harcı',
        ]
    },
    {
        name: 'Diğer & Özel İşlemler',
        items: [
            'Kaporta & Boya Onarımı',
            'Rot & Balans Ayarı',
            'Cam / Kilit / Döşeme Tamiri',
            'Kaza & Hasar Onarımı',
            'Egzoz / Katalitik Konvertör Onarımı',
            'Genel Mekanik Kontrol & Ekspertiz',
            'Özel İsteğe Bağlı Diğer İşlem',
        ]
    }
];

const SPARE_PARTS_CATEGORIES = [
    {
        name: 'Motor Yağları & Sıvılar (Sentetik / Madeni)',
        brands: [
            { name: 'Motul', desc: '8100 X-Clean / 300V / Eco-nergy' },
            { name: 'Castrol', desc: 'EDGE / Magnatec / GTX' },
            { name: 'Liqui Moly', desc: 'Top Tec / Molygen / Special Tec' },
            { name: 'Mobil 1', desc: 'ESP 5W-30 / Super 3000' },
            { name: 'Shell Helix', desc: 'Ultra ECT C3 / HX8' },
            { name: 'TotalEnergies', desc: 'Quartz Ineo ECS / Long Life' },
            { name: 'Petronas', desc: 'Syntium 3000 / 5000' },
            { name: 'Petrol Ofisi', desc: 'Maxima / Maximus' },
            { name: 'Opet Fuchs', desc: 'Fullmax / Fulllife' },
            { name: 'Valvoline', desc: 'SynPower / All Climate' },
            { name: 'Eni (Agip)', desc: 'i-Sint 5W-30 / 5W-40' },
            { name: 'Selenia', desc: 'K Pure Energy / WR Diesel' },
            { name: 'Würth Katkı', desc: 'Enjektör & Motor Temizleyici' },
            { name: 'Liqui Moly Cera Tec', desc: 'Seramik Motor Koruma Katkısı' },
        ]
    },
    {
        name: 'Filtre Üreticileri (Hava, Yağ, Polen, Yakıt)',
        brands: [
            { name: 'Mann Filter', desc: 'Orijinal Alman OEM Filtre Seti' },
            { name: 'Bosch Filter', desc: 'Premium Hava / Yağ / Polen' },
            { name: 'Mahle / Knecht', desc: 'Alman OEM Standart Kalite' },
            { name: 'Filtron', desc: 'Mann+Hummel Güvencesi' },
            { name: 'Purflux', desc: 'Fransız Orijinal Ekipman' },
            { name: 'Ufi Filters', desc: 'İtalyan OEM Üretici' },
            { name: 'Hengst Filter', desc: 'Alman Endüstriyel & Oto Filtre' },
            { name: 'Wunder Filter', desc: 'Yerli Kaliteli Filtre Grubu' },
            { name: 'Meyle Filter', desc: 'Alman Kalite Filtre Kiti' },
            { name: 'Sardes Filter', desc: 'Yerli Üretim Filtre' },
            { name: 'Champion Filter', desc: 'Filtre & Servis Ekipmanı' },
        ]
    },
    {
        name: 'Fren Balata, Disk & Hidrolik Grubu',
        brands: [
            { name: 'Brembo', desc: 'Yüksek Performans Disk & Balata' },
            { name: 'TRW', desc: 'Orijinal Ekipman Fren & Salıncak' },
            { name: 'ATE', desc: 'Alman Fren Hidroliği & Seramik Balata' },
            { name: 'Ferodo', desc: 'Premier & Eco-Friction Balata' },
            { name: 'Textar', desc: 'TMD Friction Alman Kalitesi' },
            { name: 'Bosch Fren', desc: 'Disk, Balata & Fren Pabucu' },
            { name: 'Valeo Fren', desc: 'Fren Balata & Hidrolik Merkez' },
            { name: 'Bendix', desc: 'Fren Kaliperi & Balata' },
            { name: 'Mintex', desc: 'İngiliz Fren Sürtünme Grubu' },
            { name: 'Hella Pagid', desc: 'Braking Systems' },
            { name: 'LPR / Roadhouse', desc: 'İtalyan / İspanyol Fren Balatası' },
        ]
    },
    {
        name: 'Yürüyen Aksam, Süspansiyon & Direksiyon',
        brands: [
            { name: 'Sachs', desc: 'Orijinal Gazlı Amortisör' },
            { name: 'Monroe', desc: 'OESpectrum / Reflex Amortisör' },
            { name: 'Bilstein', desc: 'B4 / B6 Spor & Standart Amortisör' },
            { name: 'KYB (Kayaba)', desc: 'Japon Orijinal Amortisör' },
            { name: 'Lemförder', desc: 'ZF Grubu Salıncak & Rotil' },
            { name: 'Meyle-HD', desc: 'Güçlendirilmiş Z-Rot & Burç' },
            { name: 'Febi Bilstein', desc: 'Alman Alt Takım & Sensör' },
            { name: 'Delphi', desc: 'Rot, Rotil, Salıncak & Kol' },
            { name: 'Moog', desc: 'Direksiyon & Süspansiyon' },
            { name: 'AYD / Formpart', desc: 'Yerli Kalite Alt Takım Grubu' },
            { name: 'Ruville / Swag', desc: 'Teker Rulmanı & Askı Rotu' },
        ]
    },
    {
        name: 'Debriyaj, Şanzıman & Aktarma',
        brands: [
            { name: 'Luk (Schaeffler)', desc: 'Orijinal Baskı Balata & Çift Kütleli Volant' },
            { name: 'Sachs Debriyaj', desc: 'Debriyaj Kiti & Rulman' },
            { name: 'Valeo Debriyaj', desc: 'Orijinal Debriyaj & Hidrolik Bilye' },
            { name: 'Aisin', desc: 'Japon Debriyaj & Şanzıman' },
            { name: 'Exedy', desc: 'Japon Performans Debriyajı' },
            { name: 'SKF / FAG', desc: 'Porya Rulmanı & Aks Başlığı' },
            { name: 'GKN / Spidan', desc: 'Aks, Şaft & Aks Körükleri' },
        ]
    },
    {
        name: 'Triger, V Kayışı, Rulman & Devirdaim',
        brands: [
            { name: 'Gates', desc: 'PowerGrip Triger & V Kayış Seti' },
            { name: 'Continental / ContiTech', desc: 'Alman Triger & Devirdaimli Kit' },
            { name: 'Dayco', desc: 'Triger Kayışı & Gergi Rulmanı' },
            { name: 'INA (Schaeffler)', desc: 'Gergi Kütüğü, Rulman & Zincir' },
            { name: 'SKF Zamanlama', desc: 'Devirdaimli Triger Seti' },
            { name: 'Graf / Dolz', desc: 'İtalyan / İspanyol Devirdaim Su Pompası' },
            { name: 'Optibelt', desc: 'Endüstriyel & Oto Kayışları' },
            { name: 'Hutchinson', desc: 'Fransız Kayış & Kasnak' },
        ]
    },
    {
        name: 'Akü, Ateşleme & Elektrik Aksamı',
        brands: [
            { name: 'Varta Akü', desc: 'Silver Dynamic / AGM / EFB' },
            { name: 'Mutlu Akü', desc: 'SFB / EFB Start-Stop Serisi' },
            { name: 'Bosch Akü', desc: 'S4 / S5 AGM Akü Serisi' },
            { name: 'İnci Akü', desc: 'Formul A / Maxim A Goriller' },
            { name: 'Yiğit Akü', desc: 'Prestige / EFB Start-Stop' },
            { name: 'Exide Akü', desc: 'Start-Stop AGM / EFB' },
            { name: 'NGK', desc: 'Laser Iridium / V-Line Buji & O2 Sensörü' },
            { name: 'Denso', desc: 'İridyum TT Buji & Ateşleme Bobini' },
            { name: 'Bosch Buji / Bobin', desc: 'Double Platinum Buji & Ateşleme' },
            { name: 'Beru / Champion', desc: 'Kızdırma Bujisi & Modülü' },
            { name: 'Delphi Bobin', desc: 'Ateşleme Bobinleri & Sensörler' },
        ]
    },
    {
        name: 'Soğutma, Radyatör & İklimlendirme',
        brands: [
            { name: 'Kale Radyatör', desc: 'Yerli Orijinal Su & Klima Radyatörü' },
            { name: 'Behr Hella', desc: 'Alman Termostat & Radyatör' },
            { name: 'Nissens', desc: 'Danimarka Radyatör & Intercooler' },
            { name: 'Valeo Termal', desc: 'Klima Kompresörü & Radyatör' },
            { name: 'NRF', desc: 'Hollanda Soğutma & Klima Parçaları' },
            { name: 'Mahle Termal', desc: 'Termostat & Soğutma Sistemi' },
        ]
    },
    {
        name: 'Lastik Markaları (Yaz / Kış / 4 Mevsim)',
        brands: [
            { name: 'Michelin', desc: 'Primacy 4 / CrossClimate / Pilot Sport' },
            { name: 'Continental Lastik', desc: 'PremiumContact / WinterContact' },
            { name: 'Goodyear', desc: 'Eagle F1 / Vector 4Seasons / EfficientGrip' },
            { name: 'Pirelli', desc: 'P Zero / Cinturato P7 / Scorpion' },
            { name: 'Bridgestone', desc: 'Turanza / Weather Control / Blizzak' },
            { name: 'Lassa', desc: 'Driveways / Competus / Multiways' },
            { name: 'Petlas', desc: 'Velox Sport / Imperium / Explero' },
            { name: 'Hankook', desc: 'Ventus Prime / Kinergy / Winter i*cept' },
            { name: 'Nokian', desc: 'Seasonproof / WR Snowproof Kış Lastiği' },
            { name: 'Kumho / Falken', desc: 'Ecsta / Azenis / Ziex' },
        ]
    },
    {
        name: 'Aydınlatma, Silecek & Detailing',
        brands: [
            { name: 'Osram', desc: 'Night Breaker LED / Xenarc / Halojen' },
            { name: 'Philips Aydınlatma', desc: 'X-tremeVision / Ultinon LED' },
            { name: 'Bosch Aerotwin', desc: 'Muz Tipi Premium Silecek' },
            { name: 'Valeo Silencio', desc: 'Orijinal Sessiz Silecek Takımı' },
            { name: 'Hella Aydınlatma', desc: 'Far, Stop & Röle Grubu' },
            { name: 'Meguiar\'s / Sonax', desc: 'Pasta Cila & Boya Koruma' },
            { name: 'Koch Chemie / Menzerna', desc: 'Profesyonel Detailing Kimyasalları' },
            { name: '3M / Würth', desc: 'Cam Filmi, İzolasyon & Bakım Spreyleri' },
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

    const [selectedParts, setSelectedParts] = useState([]);
    const [customPartInput, setCustomPartInput] = useState('');
    const [isCustomOperation, setIsCustomOperation] = useState(false);
    const [partBrandSearch, setPartBrandSearch] = useState('');
    const [isOcrOpen, setIsOcrOpen] = useState(false);

    const handleVehicleChange = (newId) => {
        const v = vehicles.find(item => String(item.id) === String(newId));
        setData(prev => ({
            ...prev,
            arac_id: newId,
            islem_km: v ? v.guncel_km : prev.islem_km,
        }));
    };

    const handleOcrExtracted = (extracted) => {
        if (extracted.tarih) setData('islem_tarihi', extracted.tarih);
        if (extracted.islem_km) setData('islem_km', extracted.islem_km);
        if (extracted.toplam_tutar) setData('maliyet_tl', extracted.toplam_tutar);
        if (extracted.islem_turu) {
            setData('islem_turu', extracted.islem_turu);
            setIsCustomOperation(true);
        }
        
        let aciklamaMetni = "";
        if (extracted.servis_adi) {
            aciklamaMetni += `Servis: ${extracted.servis_adi}\n`;
        }
        if (extracted.aciklama) {
            aciklamaMetni += `${extracted.aciklama}\n`;
        }

        if (extracted.parcalar && extracted.parcalar.length > 0) {
            const newParts = [...selectedParts];
            extracted.parcalar.forEach((p) => {
                const partLabel = `${p.ad} (${p.adet || 1} Adet)`;
                if (!newParts.includes(partLabel)) {
                    newParts.push(partLabel);
                }
            });
            setSelectedParts(newParts);
        }

        if (aciklamaMetni) {
            setData('aciklama', aciklamaMetni.trim());
        }
    };

    // Add / Remove structured spare part tags
    const handleAddPartTag = (partName) => {
        if (!partName.trim()) return;
        if (!selectedParts.includes(partName.trim())) {
            setSelectedParts([...selectedParts, partName.trim()]);
        }
        setCustomPartInput('');
    };

    const handleRemovePartTag = (indexToRemove) => {
        setSelectedParts(selectedParts.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Compile parts into description if parts were selected
        let finalDescription = data.aciklama ? data.aciklama.trim() : '';
        if (selectedParts.length > 0) {
            const partsBlock = `Kullanılan Parçalar: ${selectedParts.join(', ')}`;
            if (!finalDescription.includes(partsBlock)) {
                finalDescription = finalDescription ? `${finalDescription}\n\n${partsBlock}` : partsBlock;
            }
        }

        post('/maintenances', {
            data: {
                ...data,
                aciklama: finalDescription
            }
        });
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
            <Head title="Bakım Kaydı Ekle — SmartGaraj" />
            
            <OcrModal 
                isOpen={isOcrOpen} 
                onClose={() => setIsOcrOpen(false)} 
                type="fatura"
                onDataExtracted={handleOcrExtracted} 
                onExtracted={handleOcrExtracted} 
            />

            <div className="space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">
                
                {/* ═══════════════════════════════════════════════════════════════
                    PAGE HEADER & BREADCRUMB
                ═══════════════════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3.5">
                        <Link
                            href="/dashboard"
                            className="p-2.5 rounded-2xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Servis & Bakım Girişi
                            </h2>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                Aracınıza yapılan periyodik bakım, onarım veya muayene faturasını kaydedin.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOcrOpen(true)}
                        className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer border border-purple-400/30 shrink-0"
                    >
                        <Sparkles className="w-4 h-4 text-purple-200" />
                        <span>🧠 Vision AI ile Fatura / Fiş Tara</span>
                    </button>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    AI VISION OCR PROMPT BANNER
                ═══════════════════════════════════════════════════════════════ */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-500/15 dark:via-indigo-500/10 dark:to-transparent border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
                            <Scan className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>Fatura veya Servis Fişiniz mi Var?</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-600 dark:text-purple-300">
                                    AI Fatura Okuma
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                Servis fişi veya fatura görselini yükleyin; tarih, kilometre, tutar ve parça dökümü saniyeler içinde otomatik eklensin.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOcrOpen(true)}
                        className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-500 transition-all shrink-0 cursor-pointer shadow-md"
                    >
                        Faturayı Tara
                    </button>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    MAIN 2-COLUMN FULL-WIDTH GRID (Form on Left, Catalog on Right)
                ═══════════════════════════════════════════════════════════════ */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT FORM AREA (7 Columns on Large Screens) */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                            
                            {/* SECTION 1: VEHICLE & TIMELINE */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
                                <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.04]">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">
                                        1
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                        Araç & Servis Zamanı
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Araç Seçimi */}
                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            İşlemin Yapıldığı Araç <span className="text-amber-500">*</span>
                                        </label>
                                        <select
                                            value={data.arac_id}
                                            onChange={(e) => handleVehicleChange(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm"
                                            required
                                        >
                                            {vehicles.map((v) => (
                                                <option key={v.id} value={v.id}>
                                                    {v.marka} {v.model} ({v.plaka}) - Güncel: {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* İşlem Tarihi */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            İşlem Tarihi <span className="text-amber-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.islem_tarihi}
                                            onChange={(e) => setData('islem_tarihi', e.target.value)}
                                            className="w-full font-mono font-bold bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            required
                                        />
                                    </div>

                                    {/* Sayaç KM */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Servis Anındaki Sayaç (KM)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.islem_km}
                                            onChange={(e) => setData('islem_km', e.target.value)}
                                            placeholder="Örn: 165000"
                                            className="w-full font-mono font-bold bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>

                                    {/* Toplam Maliyet TL */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Toplam Masraf (TL) <span className="text-amber-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.maliyet_tl}
                                                onChange={(e) => setData('maliyet_tl', e.target.value)}
                                                placeholder="0.00"
                                                className="w-full font-mono font-black text-base bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl pl-4 pr-9 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                required
                                            />
                                            <span className="absolute right-3.5 top-3.5 text-sm font-black text-amber-500">₺</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: OPERATION SELECTION */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.04]">
                                    <div className="flex items-center space-x-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-xs">
                                            2
                                        </div>
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                            Yapılan İşlem / Kategori
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomOperation(!isCustomOperation)}
                                        className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                                    >
                                        {isCustomOperation ? 'Katalogdan Seç' : '+ Özel İşlem Yaz'}
                                    </button>
                                </div>

                                {!isCustomOperation ? (
                                    <div className="space-y-4">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Hızlı Standart İşlem Seçin:
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {OPERATION_CATEGORIES.map((cat, catIdx) => (
                                                <div key={catIdx} className={`p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] space-y-2 ${catIdx === 4 ? 'sm:col-span-2' : ''}`}>
                                                    <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block">
                                                        {cat.name}
                                                    </span>
                                                    <div className="space-y-1">
                                                        {cat.items.map((item) => (
                                                            <button
                                                                key={item}
                                                                type="button"
                                                                onClick={() => setData('islem_turu', item)}
                                                                className={`w-full px-3 py-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                                                    data.islem_turu === item
                                                                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                                                                        : 'bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.06]'
                                                                }`}
                                                            >
                                                                <span className="truncate">{item}</span>
                                                                {data.islem_turu === item && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Özel İşlem Adı
                                        </label>
                                        <input
                                            type="text"
                                            value={data.islem_turu}
                                            onChange={(e) => setData('islem_turu', e.target.value)}
                                            placeholder="Örn: Sağ Ön Aks Revizyonu & Şanzıman Kulağı Değişimi"
                                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            {/* SECTION 3: STRUCTURED SPARE PARTS & NOTES */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-5">
                                <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100 dark:border-white/[0.04]">
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black text-xs">
                                        3
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                        Kullanılan Parçalar & Servis Notları
                                    </h3>
                                </div>

                                {/* Interactive Selected Parts Tag Cloud */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Seçilen & Eklenen Yedek Parçalar
                                    </label>
                                    
                                    {selectedParts.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]">
                                            {selectedParts.map((part, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-extrabold shadow-2xs"
                                                >
                                                    <PackageCheck className="w-3.5 h-3.5 text-amber-500" />
                                                    <span>{part}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePartTag(index)}
                                                        className="hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                                                        title="Kaldır"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-xs text-slate-400 text-center">
                                            Henüz parça eklenmedi. Sağdaki katalogdan marka seçebilir veya aşağıdaki kutudan parça adı yazıp ekleyebilirsiniz.
                                        </div>
                                    )}

                                    {/* Manual Part Add Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customPartInput}
                                            onChange={(e) => setCustomPartInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddPartTag(customPartInput);
                                                }
                                            }}
                                            placeholder="Örn: 5W-30 Castrol Edge Yağ, Ön Balata..."
                                            className="flex-1 bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddPartTag(customPartInput)}
                                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all cursor-pointer flex items-center space-x-1 shrink-0"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Ekle</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Genel Servis Notları (Opsiyonel)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.aciklama}
                                        onChange={(e) => setData('aciklama', e.target.value)}
                                        placeholder="Servis adı, garanti durumu veya ustaya dair notlar..."
                                        className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SPARE PARTS CATALOG & SUMMARY */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
                            
                            {/* Spare Parts Quick Selector */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-4">
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                                        <span>Yedek Parça & Marka Kataloğu</span>
                                        <Tag className="w-4 h-4 text-amber-500" />
                                    </h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Tıkladığınız marka/parça otomatik olarak sol taraftaki parça listesine eklenir:
                                    </p>
                                </div>

                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        value={partBrandSearch}
                                        onChange={(e) => setPartBrandSearch(e.target.value)}
                                        placeholder="Marka filtrele (Bosch, Motul...)"
                                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                    {filteredPartCategories.map((cat, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500">
                                                {cat.name}
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {cat.brands.map((b) => (
                                                    <button
                                                        key={b.name}
                                                        type="button"
                                                        onClick={() => handleAddPartTag(`${b.name} (${b.desc})`)}
                                                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-white/[0.04] dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-white/[0.06] transition-all cursor-pointer flex items-center space-x-1"
                                                    >
                                                        <span>{b.name}</span>
                                                        <Plus className="w-3 h-3 opacity-60" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary & Submit Card */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-4">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                    Kayıt Özeti
                                </span>

                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.04] space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">İşlem:</span>
                                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">{data.islem_turu}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Tarih:</span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">{data.islem_tarihi}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Sayaç:</span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">{data.islem_km ? `${Number(data.islem_km).toLocaleString('tr-TR')} KM` : '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Parça Sayısı:</span>
                                        <span className="font-bold text-amber-500">{selectedParts.length} Kalem</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-white/5">
                                        <span className="text-slate-900 dark:text-white font-extrabold">Toplam Masraf:</span>
                                        <span className="font-mono font-black text-amber-500 text-base">
                                            {data.maliyet_tl ? `${Number(data.maliyet_tl).toLocaleString('tr-TR')} ₺` : '0.00 ₺'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                                        <span>{processing ? 'Bakım İşleniyor...' : 'Bakım Kaydını Kaydet'}</span>
                                    </button>

                                    <Link
                                        href="/dashboard"
                                        className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-400 font-bold text-xs flex items-center justify-center transition-all text-center"
                                    >
                                        İptal Et ve Geri Dön
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
