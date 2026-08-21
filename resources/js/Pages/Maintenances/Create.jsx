import React, { useState } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import OcrModal from '@/Components/OcrModal';
import CustomVehicleSelect from '@/Components/CustomVehicleSelect';
import CustomSelect from '@/Components/CustomSelect';
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
    PackageCheck,
    Building2,
    Store,
    Hammer,
    Home,
    Droplets,
    Phone,
    MapPin,
    AlertCircle
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

const OIL_VISCOSITIES = ['0W-20', '0W-30', '5W-30', '5W-40', '10W-40', '10W-30', '15W-40', '0W-16', '5W-20', '10W-60'];

const OIL_BRANDS_MODELS = [
    {
        brand: 'Castrol',
        models: ['EDGE Titanium FST', 'Magnatec Stop-Start / Dualock', 'GTX Ultraclean', 'VECTON (Ağır Vasıta)', 'Transmax (Şanzıman)']
    },
    {
        brand: 'Liqui Moly',
        models: ['Top Tec 4200 (LongLife III)', 'Top Tec 4600', 'Top Tec 6200 (0W-20)', 'Molygen New Generation', 'Special Tec F / LL', 'Leichtlauf High Tech']
    },
    {
        brand: 'Mobil 1',
        models: ['ESP Formula 5W-30 / 0W-30', 'FS x1 Peak Life (5W-50 / 0W-40)', 'Super 3000 Formula V / XE', 'Super 2000 X1', 'Delvac 1 (Dizel)']
    },
    {
        brand: 'Motul',
        models: ['8100 X-cess Gen2', '8100 X-clean EFE / +', '300V Motorsport', 'Specific 504 00 / 507 00', 'Specific Dexos2', '6100 Synergie+']
    },
    {
        brand: 'Shell',
        models: ['Helix Ultra (PurePlus)', 'Helix HX8 ECT', 'Helix HX7', 'Rimula R6 / R5 (Ağır Hizmet)']
    },
    {
        brand: 'TotalEnergies / Elf',
        models: ['Quartz Ineo First / Long Life', 'Quartz Ineo MC3', 'Quartz 9000 Energy', 'Evolution Full-Tech FE (Dizel)']
    },
    {
        brand: 'Petrol Ofisi',
        models: ['Maxima Ultra', 'Maxima Pro', 'Maxima Diesel LA', 'Maximus HD']
    },
    {
        brand: 'Opet / Fuchs',
        models: ['Fullmax 5W-30 / 0W-20', 'Fullpro HT LS', 'Fulllife DPF / LPG', 'Titan GT1 PRO C-3']
    },
    {
        brand: 'Valvoline',
        models: ['SynPower MST C3 / FE', 'MaxLife (Yüksek KM Bakım)', 'All-Climate']
    },
    {
        brand: 'Diğer / OEM Yağ',
        models: ['Orijinal Marka Yağı (BMW / VAG / Mercedes / Ford)', 'Özel Motor Yağı']
    }
];

const SANAYI_PRESETS = [
    'Maslak Atatürk Oto Sanayi Sitesi (İstanbul)',
    'İkitelli Güngören / Bağcılar Sanayi Sitesi (İstanbul)',
    'Bostancı Oto Sanayi Sitesi (İstanbul)',
    'Ümraniye Kadosan Oto Sanayi (İstanbul)',
    'Kartal Oto Sanayi Sitesi (İstanbul)',
    'Şaşmaz Oto Sanayi Sitesi (Ankara)',
    'İvedik Organize Sanayi Bölgesi (Ankara)',
    '1. & 2. Sanayi Sitesi (İzmir / Bornova)',
    'Bursa Nilüfer Küçük Sanayi Sitesi',
    'Antalya Akdeniz Sanayi Sitesi',
    'Adana Metal Sanayi Sitesi',
    'Konya Motorlu Sanayi Sitesi',
    'Diğer Sanayi Sitesi / Bağımsız Dükkan'
];

export default function MaintenanceCreate({ vehicles = [], selected_vehicle_id = null }) {
    const defaultVehicleId = selected_vehicle_id || (vehicles.length > 0 ? vehicles[0].id : '');
    const activeVehicle = vehicles.find(v => String(v.id) === String(defaultVehicleId));

    const { data, setData, post, processing, errors } = useForm({
        arac_id: defaultVehicleId,
        islem_tarihi: new Date().toISOString().split('T')[0],
        islem_turu: 'Standart Periyodik Bakım (Yağ + Filtreler)',
        servis_turu: 'yetkili_servis', // yetkili_servis, ozel_servis, sanayi, kendi_garajimiz
        servis_adi: '',
        sanayi_sitesi: '',
        usta_adi: '',
        usta_tel: '',
        yag_markasi: 'Castrol',
        yag_modeli: 'EDGE Titanium FST',
        yag_viskozite: '5W-30',
        yag_litresi: '4.5',
        yag_filtresi_degisti: true,
        islem_km: activeVehicle ? activeVehicle.guncel_km : '',
        maliyet_tl: '',
        aciklama: '',
    });

    const [selectedParts, setSelectedParts] = useState([]);
    const [customPartInput, setCustomPartInput] = useState('');
    const [isCustomOperation, setIsCustomOperation] = useState(false);
    const [isOcrOpen, setIsOcrOpen] = useState(false);
    const [showOilSection, setShowOilSection] = useState(true);

    const handleVehicleChange = (newId) => {
        const v = vehicles.find(item => String(item.id) === String(newId));
        setData(prev => ({
            ...prev,
            arac_id: newId,
            islem_km: v ? v.guncel_km : prev.islem_km,
        }));
    };

    const [auditResults, setAuditResults] = useState([]);
    const [auditSummary, setAuditSummary] = useState(null);

    const handleOcrExtracted = (extracted) => {
        if (extracted.tarih) setData('islem_tarihi', extracted.tarih);
        if (extracted.islem_km) setData('islem_km', extracted.islem_km);
        if (extracted.toplam_tutar) setData('maliyet_tl', extracted.toplam_tutar);
        if (extracted.servis_adi) setData('servis_adi', extracted.servis_adi);
        if (extracted.islem_turu) {
            setData('islem_turu', extracted.islem_turu);
            setIsCustomOperation(true);
        }
        
        let aciklamaMetni = "";
        if (extracted.aciklama) {
            aciklamaMetni += `${extracted.aciklama}\n`;
        }

        if (extracted.audit_summary) {
            setAuditSummary(extracted.audit_summary);
        }

        if (extracted.parcalar && extracted.parcalar.length > 0) {
            setAuditResults(extracted.parcalar);
            const newParts = [...selectedParts];
            extracted.parcalar.forEach((p) => {
                const partName = p.parca || p.ad || '';
                const partLabel = `${partName} (${p.adet || 1} Adet)`;
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

    const activeBrandConfig = OIL_BRANDS_MODELS.find(b => b.brand === data.yag_markasi) || OIL_BRANDS_MODELS[0];

    return (
        <AppLayout activeMode="individual" title="Yeni Bakım & Servis Kaydı">
            <Head title="Yeni Bakım & Servis Kaydı — SmartGaraj" />

            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <Link 
                            href="/dashboard" 
                            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                            Garaj Paneline Dön
                        </Link>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <Wrench className="w-6 h-6 stroke-[2.5]" />
                            </span>
                            <span>Bakım & Servis <span className="text-amber-500">Kaydı İşle</span></span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                            Yetkili servis, sanayi ustası veya kendi garajınızda yapılan motor yağı, parça ve mekanik işlemlerini akıllıca arşivleyin.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOcrOpen(true)}
                        className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2.5 cursor-pointer self-start md:self-auto"
                    >
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>AI ile Fatura Tara & Denetle</span>
                    </button>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Vehicle & Basic Stats */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <Car className="w-5 h-5 text-amber-500" />
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                1. Araç & Temel Bilgiler
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Vehicle Select */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    İşlem Yapılan Araç *
                                </label>
                                <CustomVehicleSelect
                                    vehicles={vehicles}
                                    value={data.arac_id}
                                    onChange={(newId) => handleVehicleChange(newId)}
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                    <span>İşlem Tarihi *</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.islem_tarihi}
                                    onChange={(e) => setData('islem_tarihi', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* KM */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                    <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>İşlem Yapıldığı Kilometre (KM)</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.islem_km}
                                    onChange={(e) => setData('islem_km', e.target.value)}
                                    placeholder="145000"
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs font-black font-mono text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Service Provider (Yetkili Servis vs. Sanayi / Usta) */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center space-x-2.5">
                                <Building2 className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        2. İşlem Yapılan Yer & Servis Sağlayıcı
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        İşlemin yetkili bayide mi, özel serviste mi yoksa sanayideki ustanızda mı yapıldığını belirtin.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service Type Selection Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { key: 'yetkili_servis', label: 'Yetkili Servis', icon: Building2, desc: 'Markanın resmi bayisi (Doğuş, Otokoç vb.)', color: 'text-blue-500 border-blue-500' },
                                { key: 'ozel_servis', label: 'Özel Servis', icon: Store, desc: 'Markaya özel bağımsız teknik servis', color: 'text-purple-500 border-purple-500' },
                                { key: 'sanayi', label: 'Sanayi / Usta', icon: Hammer, desc: 'Oto Sanayi Sitesi & Mekanik Dükkanı', color: 'text-amber-500 border-amber-500' },
                                { key: 'kendi_garajimiz', label: 'Kendi Garajım', icon: Home, desc: 'Kendim / Kendi şirket garajımız', color: 'text-emerald-500 border-emerald-500' },
                            ].map(st => {
                                const Icon = st.icon;
                                const isSelected = data.servis_turu === st.key;
                                return (
                                    <button
                                        key={st.key}
                                        type="button"
                                        onClick={() => setData('servis_turu', st.key)}
                                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                            isSelected 
                                                ? `bg-slate-50 dark:bg-white/[0.08] ring-2 ring-indigo-500 border-indigo-500`
                                                : `bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300`
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`} />
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-slate-900 dark:text-white">
                                                {st.label}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">
                                                {st.desc}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Detailed Fields based on Service Type */}
                        {data.servis_turu === 'yetkili_servis' && (
                            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Yetkili Servis & Bayi Adı</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.servis_adi}
                                        onChange={(e) => setData('servis_adi', e.target.value)}
                                        placeholder="Örn: Doğuş Oto Maslak / Otokoç İstinye / Borusan Oto Avcılar"
                                        className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        )}

                        {(data.servis_turu === 'sanayi' || data.servis_turu === 'ozel_servis') && (
                            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Sanayi Sitesi Preset / Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Sanayi Sitesi / Bölge</span>
                                        </label>
                                        <input
                                            list="sanayi-list"
                                            value={data.sanayi_sitesi}
                                            onChange={(e) => setData('sanayi_sitesi', e.target.value)}
                                            placeholder="Örn: Maslak Atatürk Oto Sanayi"
                                            className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                        />
                                        <datalist id="sanayi-list">
                                            {SANAYI_PRESETS.map((s, idx) => (
                                                <option key={idx} value={s} />
                                            ))}
                                        </datalist>
                                    </div>

                                    {/* Usta / Firma Adı */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                            <Hammer className="w-3.5 h-3.5 text-purple-500" />
                                            <span>Özel Servis / Usta Adı</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.usta_adi}
                                            onChange={(e) => setData('usta_adi', e.target.value)}
                                            placeholder="Örn: Özkan Usta - Güven Oto Mekanik"
                                            className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                        />
                                    </div>

                                    {/* Usta Telefonu */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>Usta İletişim Telefonu</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.usta_tel}
                                            onChange={(e) => setData('usta_tel', e.target.value)}
                                            placeholder="0532 123 45 67"
                                            className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Comprehensive Motor Oil & Viscosity Specifications */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center space-x-2.5">
                                <Droplets className="w-5 h-5 text-amber-500" />
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        3. Motor Yağı & Yağ Filtresi Spesifikasyonları
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        Viskozite (5W-30, 0W-20 vb.), yağ markası, özel serisi ve dolum miktarı
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowOilSection(!showOilSection)}
                                className="text-xs font-bold text-amber-500 hover:text-amber-600 cursor-pointer"
                            >
                                {showOilSection ? 'Gizle' : 'Göster & Düzenle'}
                            </button>
                        </div>

                        {showOilSection && (
                            <div className="space-y-5">
                                {/* Viscosity Quick Pick Badges */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Yağ Viskozite Derecesi:
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {OIL_VISCOSITIES.map(vis => {
                                            const isSelected = data.yag_viskozite === vis;
                                            return (
                                                <button
                                                    key={vis}
                                                    type="button"
                                                    onClick={() => setData('yag_viskozite', vis)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                                            : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08]'
                                                    }`}
                                                >
                                                    {vis}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Oil Brand */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Yağ Markası
                                        </label>
                                        <CustomSelect
                                            options={OIL_BRANDS_MODELS.map(b => ({ value: b.brand, label: b.brand }))}
                                            value={data.yag_markasi}
                                            onChange={(bName) => {
                                                const brandCfg = OIL_BRANDS_MODELS.find(b => b.brand === bName);
                                                setData(prev => ({
                                                    ...prev,
                                                    yag_markasi: bName,
                                                    yag_modeli: brandCfg ? brandCfg.models[0] : ''
                                                }));
                                            }}
                                        />
                                    </div>

                                    {/* Oil Model / Series */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Markanın Özel Modeli / Serisi
                                        </label>
                                        <CustomSelect
                                            options={activeBrandConfig.models.map(m => ({ value: m, label: m }))}
                                            value={data.yag_modeli}
                                            onChange={(mVal) => setData('yag_modeli', mVal)}
                                        />
                                    </div>

                                    {/* Liters & Filter checkbox */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Yağ Dolum Miktarı (Litre)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={data.yag_litresi}
                                            onChange={(e) => setData('yag_litresi', e.target.value)}
                                            placeholder="4.5"
                                            className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id="yag_filtresi_check"
                                        checked={data.yag_filtresi_degisti}
                                        onChange={(e) => setData('yag_filtresi_degisti', e.target.checked)}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                                    />
                                    <label htmlFor="yag_filtresi_check" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                        Yağ Filtresi sıfır orijinal parça ile yenilendi
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 4: Operation Type & Financials */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <SlidersHorizontal className="w-5 h-5 text-purple-500" />
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                4. Yapılan İşlem & Maliyet
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    İşlem Başlığı / Türü *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                                    {OPERATION_CATEGORIES.flatMap(c => c.items).map((op, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setData('islem_turu', op);
                                                setIsCustomOperation(false);
                                            }}
                                            className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors flex items-center justify-between cursor-pointer ${
                                                data.islem_turu === op && !isCustomOperation
                                                    ? 'bg-amber-500 text-slate-950'
                                                    : 'hover:bg-slate-200/60 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <span className="truncate">{op}</span>
                                            {data.islem_turu === op && !isCustomOperation && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Total Cost */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                    <Coins className="w-4 h-4 text-amber-500" />
                                    <span>Toplam Bakım / Servis Tutarı (₺) *</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.maliyet_tl}
                                    onChange={(e) => setData('maliyet_tl', e.target.value)}
                                    placeholder="4850.00"
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-black font-mono text-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Açıklama & Servis Notları
                                </label>
                                <textarea
                                    value={data.aciklama}
                                    onChange={(e) => setData('aciklama', e.target.value)}
                                    rows="3"
                                    placeholder="Değişen parçalar, ustanın tavsiyeleri veya bir sonraki bakım notları..."
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 text-xs font-medium text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end space-x-3 pt-2">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors"
                        >
                            İptal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{processing ? 'Kaydediliyor...' : 'Bakım Kaydını Sisteme İşle'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* AI Vision OCR Modal */}
            <OcrModal
                isOpen={isOcrOpen}
                onClose={() => setIsOcrOpen(false)}
                type="fatura"
                vehicleId={data.arac_id}
                onExtracted={handleOcrExtracted}
            />
        </AppLayout>
    );
}
