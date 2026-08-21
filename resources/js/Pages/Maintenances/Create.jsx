import React, { useState, useEffect } from 'react';
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
    AlertCircle,
    ChevronDown,
    Filter,
    Boxes,
    Layers,
    Sparkle
} from 'lucide-react';

const OPERATION_CATEGORIES = [
    {
        name: 'Periyodik & Rutin Bakım',
        isOilRelated: true,
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
        isOilRelated: false,
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
        isOilRelated: false,
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
        isOilRelated: false,
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
        isOilRelated: false,
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

const SPARE_PARTS_CATEGORIES = [
    {
        name: 'Filtre Üreticileri (Hava, Yağ, Polen, Yakıt)',
        brands: [
            { name: 'Mann Filter', desc: 'Alman Orijinal OEM Filtre Seti' },
            { name: 'Bosch Filter', desc: 'Premium Hava / Yağ / Polen' },
            { name: 'Mahle / Knecht', desc: 'Alman OEM Standart Kalite' },
            { name: 'Filtron', desc: 'Mann+Hummel Güvencesi' },
            { name: 'Purflux', desc: 'Fransız Orijinal Ekipman' },
            { name: 'Ufi Filters', desc: 'İtalyan OEM Üretici' },
            { name: 'Hengst Filter', desc: 'Alman Endüstriyel Filtre' },
            { name: 'Wunder Filter', desc: 'Yerli Kaliteli Filtre Grubu' },
            { name: 'Meyle Filter', desc: 'Alman Kalite Filtre Kiti' },
            { name: 'Sardes Filter', desc: 'Yerli Üretim Filtre' },
        ]
    },
    {
        name: 'Fren Balata, Disk & Hidrolik Grubu',
        brands: [
            { name: 'Brembo', desc: 'Yüksek Performans Disk & Balata' },
            { name: 'TRW', desc: 'Orijinal Ekipman Fren & Salıncak' },
            { name: 'ATE', desc: 'Alman Seramik Balata & Hidrolik' },
            { name: 'Ferodo', desc: 'Premier & Eco-Friction Balata' },
            { name: 'Textar', desc: 'TMD Friction Alman Kalitesi' },
            { name: 'Bosch Fren', desc: 'Disk, Balata & Fren Pabucu' },
            { name: 'Valeo Fren', desc: 'Fren Balata & Hidrolik Merkez' },
            { name: 'Bendix', desc: 'Fren Kaliperi & Balata' },
            { name: 'Mintex', desc: 'İngiliz Fren Sürtünme Grubu' },
            { name: 'Hella Pagid', desc: 'Braking Systems' },
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
            { name: 'Febi Bilstein', desc: 'Alman Alt Takım Grubu' },
            { name: 'Delphi', desc: 'Rot, Rotil, Salıncak Kolu' },
            { name: 'Moog', desc: 'Direksiyon & Süspansiyon' },
            { name: 'AYD / Formpart', desc: 'Yerli Kalite Alt Takım' },
        ]
    },
    {
        name: 'Debriyaj, Şanzıman & Aktarma (Volant, Aks)',
        brands: [
            { name: 'Luk (Schaeffler)', desc: 'Orijinal Baskı Balata & Volant' },
            { name: 'Sachs Debriyaj', desc: 'Debriyaj Kiti & Rulman' },
            { name: 'Valeo Debriyaj', desc: 'Orijinal Debriyaj & Bilye' },
            { name: 'Aisin', desc: 'Japon Debriyaj & Şanzıman' },
            { name: 'Exedy', desc: 'Japon Performans Debriyajı' },
            { name: 'SKF / FAG', desc: 'Porya Rulmanı & Aks Başlığı' },
            { name: 'GKN / Spidan', desc: 'Aks, Şaft & Aks Körükleri' },
        ]
    },
    {
        name: 'Triger, V Kayışı, Rulman & Devirdaim (Su Pompası)',
        brands: [
            { name: 'Gates', desc: 'PowerGrip Triger & V Kayış Seti' },
            { name: 'Continental / ContiTech', desc: 'Alman Triger & Devirdaimli Kit' },
            { name: 'Dayco', desc: 'Triger Kayışı & Gergi Rulmanı' },
            { name: 'INA (Schaeffler)', desc: 'Gergi Kütüğü, Rulman & Zincir' },
            { name: 'SKF Zamanlama', desc: 'Devirdaimli Triger Seti' },
            { name: 'Graf / Dolz', desc: 'Devirdaim Su Pompası' },
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
            { name: 'İnci Akü', desc: 'Formul A / Maxim A Serisi' },
            { name: 'Yiğit Akü', desc: 'Prestige / EFB Start-Stop' },
            { name: 'Exide Akü', desc: 'Start-Stop AGM / EFB' },
            { name: 'NGK', desc: 'Laser Iridium / V-Line Buji & O2' },
            { name: 'Denso', desc: 'İridyum TT Buji & Ateşleme Bobini' },
            { name: 'Bosch Buji / Bobin', desc: 'Double Platinum Buji & Ateşleme' },
            { name: 'Beru / Champion', desc: 'Kızdırma Bujisi & Modülü' },
            { name: 'Delphi Bobin', desc: 'Ateşleme Bobinleri & Sensörler' },
        ]
    },
    {
        name: 'Soğutma, Radyatör & İklimlendirme (Klima)',
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
            { name: 'Goodyear', desc: 'Eagle F1 / Vector 4Seasons' },
            { name: 'Pirelli', desc: 'P Zero / Cinturato P7 / Scorpion' },
            { name: 'Bridgestone', desc: 'Turanza / Weather Control / Blizzak' },
            { name: 'Lassa', desc: 'Driveways / Competus / Multiways' },
            { name: 'Petlas', desc: 'Velox Sport / Imperium / Explero' },
            { name: 'Hankook', desc: 'Ventus Prime / Kinergy / Winter' },
            { name: 'Nokian', desc: 'Seasonproof / WR Snowproof' },
            { name: 'Kumho / Falken', desc: 'Ecsta / Azenis / Ziex' },
        ]
    },
    {
        name: 'Aydınlatma, Silecek & Detailing Kimyasalları',
        brands: [
            { name: 'Osram', desc: 'Night Breaker LED / Xenarc / Halojen' },
            { name: 'Philips Aydınlatma', desc: 'X-tremeVision / Ultinon LED' },
            { name: 'Bosch Aerotwin', desc: 'Muz Tipi Premium Silecek' },
            { name: 'Valeo Silencio', desc: 'Orijinal Sessiz Silecek Takımı' },
            { name: 'Hella Aydınlatma', desc: 'Far, Stop & Röle Grubu' },
            { name: 'Meguiar\'s / Sonax', desc: 'Pasta Cila & Boya Koruma' },
            { name: 'Koch Chemie / Menzerna', desc: 'Profesyonel Detailing Kimyasalları' },
            { name: '3M / Würth', desc: 'Cam Filmi, İzolasyon & Spreyler' },
        ]
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
    const [partSearchTerm, setPartSearchTerm] = useState('');
    const [selectedPartCategory, setSelectedPartCategory] = useState(0);
    const [isOcrOpen, setIsOcrOpen] = useState(false);
    const [showOilSection, setShowOilSection] = useState(true);

    // Automatically expand/show oil section if user chooses an oil/periodic maintenance operation
    useEffect(() => {
        const isOil = data.islem_turu.toLowerCase().includes('yağ') || 
                      data.islem_turu.toLowerCase().includes('periyodik') ||
                      data.islem_turu.toLowerCase().includes('bakım');
        setShowOilSection(isOil);
    }, [data.islem_turu]);

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
        if (extracted.servis_adi) setData('servis_adi', extracted.servis_adi);
        if (extracted.islem_turu) setData('islem_turu', extracted.islem_turu);
        
        let aciklamaMetni = "";
        if (extracted.aciklama) {
            aciklamaMetni += `${extracted.aciklama}\n`;
        }

        if (extracted.parcalar && extracted.parcalar.length > 0) {
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
            const partsBlock = `Değişen / Kullanılan Parçalar: ${selectedParts.join(', ')}`;
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

    const filteredCategories = SPARE_PARTS_CATEGORIES.map(cat => ({
        ...cat,
        brands: cat.brands.filter(b => 
            b.name.toLowerCase().includes(partSearchTerm.toLowerCase()) ||
            b.desc.toLowerCase().includes(partSearchTerm.toLowerCase())
        )
    })).filter(cat => cat.brands.length > 0);

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
                            {/* Vehicle Select with Luxury Plate Badge */}
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
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* KM */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                    <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>İşlem Kilometresi (KM)</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.islem_km}
                                    onChange={(e) => setData('islem_km', e.target.value)}
                                    placeholder="145000"
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-black font-mono text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Operation Type */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center space-x-2.5">
                                <SlidersHorizontal className="w-5 h-5 text-purple-500" />
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        2. Yapılan Bakım & İşlem Türü
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        Periyodik bakım, ağır bakım veya mekanik onarım kategorisini seçin.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Hızlı İşlem Seçimi:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-200 dark:border-white/5">
                                    {OPERATION_CATEGORIES.flatMap(c => c.items).map((op, idx) => {
                                        const isSelected = data.islem_turu === op;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setData('islem_turu', op)}
                                                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors flex items-center justify-between cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                                                        : 'hover:bg-slate-200/60 dark:hover:bg-white/[0.06] text-slate-700 dark:text-slate-300'
                                                }`}
                                            >
                                                <span className="truncate">{op}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Seçilen / Özel İşlem Başlığı:
                                </label>
                                <input
                                    type="text"
                                    value={data.islem_turu}
                                    onChange={(e) => setData('islem_turu', e.target.value)}
                                    placeholder="Örn: 120.000 KM Ağır Bakımı + Ön Balata"
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-slate-900 dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Comprehensive Motor Oil & Viscosity (Auto-expanded on Periodic/Oil Maintenance) */}
                    {showOilSection && (
                        <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border border-amber-500/20 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between pb-4 border-b border-amber-500/15">
                                <div className="flex items-center space-x-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                        <Droplets className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            <span>3. Motor Yağı & Filtre Spesifikasyonları</span>
                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">
                                                YAĞ BAKIMI
                                            </span>
                                        </h3>
                                        <p className="text-xs text-slate-400 font-semibold">
                                            Viskozite derecesi, kullanılan yağ markası, özel serisi ve dolum miktarı
                                        </p>
                                    </div>
                                </div>
                            </div>

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
                                                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                                                            : 'bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10'
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
                                            className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white font-mono"
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
                        </div>
                    )}

                    {/* Section 4: Categorized Spare Parts & OEM Brands Catalog */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center space-x-2.5">
                                <Boxes className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        4. Değişen Parçalar & Marka Kataloğu
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        Kullanılan OEM parçaları (Filtre, Balata, Triger, Akü vb.) kataloğumuzdan seçin veya serbest yazın.
                                    </p>
                                </div>
                            </div>

                            {/* Search inside catalog */}
                            <div className="relative w-full sm:w-64">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={partSearchTerm}
                                    onChange={(e) => setPartSearchTerm(e.target.value)}
                                    placeholder="Marka / parça ara (örn: Mann, Brembo)..."
                                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400"
                                />
                            </div>
                        </div>

                        {/* Selected Parts Chips */}
                        {selectedParts.length > 0 && (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2">
                                <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                    <span>Seçilen / Değişen Parça Listesi ({selectedParts.length})</span>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedParts([])}
                                        className="text-[11px] text-red-500 hover:underline font-bold"
                                    >
                                        Tümünü Temizle
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedParts.map((part, pIdx) => (
                                        <span
                                            key={pIdx}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold"
                                        >
                                            <Check className="w-3 h-3 text-emerald-500" />
                                            <span>{part}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePartTag(pIdx)}
                                                className="hover:text-red-500 transition-colors ml-1 cursor-pointer"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Part Input Bar */}
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
                                placeholder="Özel parça adı yazın (örn: Sağ Ön Salıncak, V Kayışı)..."
                                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddPartTag(customPartInput)}
                                className="px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Parça Ekle</span>
                            </button>
                        </div>

                        {/* Category Brands Grid */}
                        <div className="space-y-4 pt-2">
                            {filteredCategories.map((cat, catIdx) => (
                                <div key={catIdx} className="space-y-2">
                                    <div className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        {cat.name}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                        {cat.brands.map((b, bIdx) => {
                                            const isAdded = selectedParts.some(p => p.includes(b.name));
                                            return (
                                                <button
                                                    key={bIdx}
                                                    type="button"
                                                    onClick={() => handleAddPartTag(b.name)}
                                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                        isAdded 
                                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                                                            : 'bg-slate-50/60 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                                            {b.name}
                                                        </span>
                                                        {isAdded ? (
                                                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                        ) : (
                                                            <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0 opacity-60" />
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-medium line-clamp-1">
                                                        {b.desc}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 5: Service Provider (Yetkili Servis vs. Sanayi / Usta) */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <Building2 className="w-5 h-5 text-indigo-500" />
                            <div>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">
                                    5. İşlem Yapılan Yer & Servis Sağlayıcı
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold">
                                    İşlemin yetkili bayide mi, özel serviste mi yoksa sanayideki ustanızda mı yapıldığını belirtin.
                                </p>
                            </div>
                        </div>

                        {/* Service Type Selection Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { key: 'yetkili_servis', label: 'Yetkili Servis', icon: Building2, desc: 'Markanın resmi bayisi (Doğuş, Otokoç vb.)' },
                                { key: 'ozel_servis', label: 'Özel Servis', icon: Store, desc: 'Markaya özel bağımsız teknik servis' },
                                { key: 'sanayi', label: 'Sanayi / Usta', icon: Hammer, desc: 'Oto Sanayi Sitesi & Mekanik Dükkanı' },
                                { key: 'kendi_garajimiz', label: 'Kendi Garajım', icon: Home, desc: 'Kendim / Kendi şirket garajımız' },
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
                                                ? `bg-indigo-500/10 dark:bg-indigo-500/20 ring-2 ring-indigo-500 border-indigo-500`
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
                                        className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
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
                                            className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
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
                                            className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
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
                                            className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 6: Total Cost & Notes */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <Coins className="w-5 h-5 text-amber-500" />
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                6. Maliyet & Servis Notları
                            </h3>
                        </div>

                        <div className="space-y-4">
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
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-base font-black font-mono text-slate-900 dark:text-white"
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
