import React, { useState, useEffect } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import OcrModal from '@/Components/OcrModal';
import CustomVehicleSelect from '@/Components/CustomVehicleSelect';
import CustomSelect from '@/Components/CustomSelect';
import BodyworkRepairMap from '@/Components/BodyworkRepairMap';
import { generateSmartMaintenanceDescription } from '@/Utils/maintenanceAiEnhancer';
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
    ChevronUp,
    Filter,
    Boxes,
    Layers,
    Paintbrush,
    Sparkle,
    Cpu,
    CheckCheck
} from 'lucide-react';

export const ENHANCED_OPERATION_CATEGORIES = [
    {
        id: 'periyodik_sivi',
        name: 'Periyodik & Sıvı Bakımı',
        icon: '🛢️',
        isOilRelated: true,
        isBodyworkRelated: false,
        desc: 'Motor yağı, filtreler, antifriz, hidrolik sıvıları',
        items: [
            'Standart Periyodik Bakım (Yağ + Tüm Filtreler)',
            'Motor Yağı & Yağ Filtresi Değişimi',
            'Hava & Polen (Kabin) Filtresi Değişimi',
            'Yakıt (Mazot / Benzin) Filtresi Değişimi',
            'Antifriz / Radyatör Soğutma Sıvısı Yenileme',
            'Fren Hidroliği (DOT4/DOT5.1) Değişimi',
            'Direksiyon Hidroliği Değişimi',
            'Diferansiyel & Şanzıman Sıvı Değişimi',
        ]
    },
    {
        id: 'fren_guvenlik',
        name: 'Fren & Güvenlik Sistemi',
        icon: '🛑',
        isOilRelated: false,
        isBodyworkRelated: false,
        desc: 'Fren balataları, diskler, kaliper ve el freni',
        items: [
            'Ön Fren Balatası Değişimi',
            'Arka Fren Balatası Değişimi',
            'Ön & Arka Fren Diskleri Değişimi',
            'Fren Diski Tornalama & Taşlama',
            'Fren Kaliperi & Hortumları Yenileme',
            'Elektronik / Mekanik El Freni Bakımı',
            'Fren Ana Merkezi & Vakum Pompası',
            'ABS / ESP Sensör Değişimi',
        ]
    },
    {
        id: 'motor_triger',
        name: 'Motor, Mekanik & Triger',
        icon: '⚙️',
        isOilRelated: false,
        isBodyworkRelated: false,
        desc: 'Triger seti, devirdaim, debriyaj, buji, turbo',
        items: [
            'Ağır Bakım: Triger Seti & Devirdaim (Su Pompası)',
            'V Kayışı & Gergi Rulmanları Değişimi',
            'Baskı Balata (Debriyaj Seti) & Volan',
            'Buji & Ateşleme Bobinleri Değişimi',
            'Şanzıman / Şanzıman Yağı & Filtresi Değişimi',
            'Turbo Revizyonu / Turbo Değişimi',
            'Enjektör Temizliği & Revizyonu',
            'EGR & DPF (Dizel Partikül Filtresi) Temizliği',
            'Subap Ayarı & Silindir Kapak Contası',
            'Termostat & Su Radyatörü Değişimi',
        ]
    },
    {
        id: 'suspansiyon_yuruyen',
        name: 'Yürüyen Aksam & Lastik',
        icon: '🛞',
        isOilRelated: false,
        isBodyworkRelated: false,
        desc: 'Amortisör, salıncak, rot başı, lastik & balans',
        items: [
            'Ön / Arka Amortisör & Takoz Değişimi',
            'Salıncak, Rotil & Rot Başı Değişimi',
            'Z-Rot & Viraj Demir Lastikleri',
            'Tekerlek Porya Rulmanı Değişimi',
            'Aks & Aks Körüğü Yenileme',
            'Rot & Ön Düzen Geometri Ayarı',
            'Lastik Değişimi, Rotasyon & Balans',
            'Direksiyon Kutusu / Mafsal Onarımı',
        ]
    },
    {
        id: 'kaporta_boya_detailing',
        name: 'Kaporta, Boya & Detailing',
        icon: '🎨',
        isOilRelated: false,
        isBodyworkRelated: true,
        desc: 'Boyasız göçük (PDR), kuru çekiç, lokal boya, pasta cila',
        items: [
            'Kaporta Onarımı & Boyasız Göçük Düzeltme (PDR)',
            'Lokal / Parça Boya Uygulaması',
            'Rötüş & Çizik Onarımı',
            'Kaporta Parça Değişimi & Montaj',
            'Pasta Cila, Çizik Giderme & Boya Koruma',
            'Seramik Kaplama / PPF Koruma Folyosu',
            'Far Temizleme & Cam Çatlak Onarımı',
            'Detaylı İç Kuaför & Ozon Dezenfeksiyon',
        ]
    },
    {
        id: 'elektrik_aku_klima',
        name: 'Elektrik, Akü & Klima',
        icon: '🔋',
        isOilRelated: false,
        isBodyworkRelated: false,
        desc: 'Akü değişimi, klima gazı, aydınlatma, alternatör',
        items: [
            'Akü Değişimi & Şarj Ölçümü',
            'Klima Gazı Dolumu & Kaçak Testi',
            'Klima Kompresörü & Evaporatör Temizliği',
            'Şarj Dinamosu (Alternatör) Revizyonu',
            'Marş Motoru Onarımı / Kömür Değişimi',
            'Far / Stop / LED / Xenon Ampul Değişimi',
            'Sigorta Kutusu & Elektrik Tesisat Kontrolü',
            'Silecek Motoru & Silecek Lastikleri',
        ]
    },
    {
        id: 'muayene_ekspertiz',
        name: 'Muayene & Ekspertiz',
        icon: '🔍',
        isOilRelated: false,
        isBodyworkRelated: false,
        desc: 'TÜVTÜRK hazırlık, arıza teşhisi, genel kontrol',
        items: [
            'TÜVTÜRK Muayene Öncesi Genel Kontrol',
            '101 Nokta Detaylı Mekanik Ekspertiz',
            'Bilgisayarlı OBD-II Arıza Tespiti & Diagnostik',
            'Egzoz Gazı Emisyon Ölçümü',
            'Fren Test Cihazı ile Ölçüm',
        ]
    },
    {
        id: 'diger_ozel',
        name: 'Diğer & Özel İşlemler',
        icon: '🔧',
        isOilRelated: false,
        isBodyworkRelated: false,
        desc: 'Özel projeler, cam/kilit, döşeme, egzoz',
        items: [
            'Egzoz & Susturucu / Katalizör Onarımı',
            'Oto Cam & Kilit Mekanizması Tamiri',
            'Döşeme & Koltuk / Tavan Onarımı',
            'Ses Yalıtımı & İzolasyon Uygulaması',
            'Özel İsteğe Bağlı Diğer Mekanik İşlem',
        ]
    }
];

const OIL_VISCOSITIES = ['0W-20', '0W-30', '5W-30', '5W-40', '10W-40', '10W-30', '15W-40', '0W-16', '5W-20', '10W-60'];

const OIL_BRANDS_MODELS = [
    {
        brand: 'Castrol',
        models: ['EDGE Titanium FST', 'Magnatec Stop-Start', 'GTX Ultraclean', 'EDGE Supercar']
    },
    {
        brand: 'Mobil 1',
        models: ['ESP Formula (Tam Sentetik)', 'Super 3000 XE', 'FS 0W-40', 'Super 2000 (Yarı Sentetik)']
    },
    {
        brand: 'Motul',
        models: ['8100 X-clean Gen2', '8100 X-cess', 'Specific LL-04 / 504 507', '300V Motorsport Factory Line', '6100 Synergie+']
    },
    {
        brand: 'Liqui Moly',
        models: ['Top Tec 4200', 'Top Tec 4600', 'Special Tec F / LL', 'Molygen New Generation', 'Leichtlauf High Tech']
    },
    {
        brand: 'Shell',
        models: ['Helix Ultra ECT C3', 'Helix Ultra Professional', 'Helix HX8 Synthetic', 'Helix HX7']
    },
    {
        brand: 'Total / Elf',
        models: ['Quartz Ineo MC3', 'Quartz Ineo Long Life', 'Evolution Full-Tech FE', 'Evolution 900 SXR']
    },
    {
        brand: 'Petronas',
        models: ['Syntium 5000 DM', 'Syntium 3000 E', 'Syntium 7000 Hybrid']
    },
    {
        brand: 'Valvoline',
        models: ['SynPower MST C3', 'All-Climate', 'MaxLife']
    },
    {
        brand: 'Orijinal OEM Yağ',
        models: ['BMW TwinPower Turbo', 'Mercedes-Benz MB 229.52', 'VAG Longlife III (VW/Audi/Seat/Skoda)', 'Ford-Castrol Magnatec Professional', 'Renault Castrol GTX RN720', 'Toyota Genuine Motor Oil']
    },
    {
        brand: 'Diğer / Yerli Marka',
        models: ['Petrol Ofisi Maxima', 'Opet Fullmax', 'Lukoil Genesis', 'PO Maxima CX']
    }
];

const SPARE_PARTS_CATEGORIES = [
    {
        name: 'Filtre Grubu (Yağ, Hava, Polen, Yakıt)',
        brands: [
            { name: 'Mann-Filter', desc: 'Alman Orijinal Ekipman Filtre Lideri' },
            { name: 'Mahle / Knecht', desc: 'Alman OEM Üst Düzey Filtre' },
            { name: 'Bosch Filtre', desc: 'Premium Orijinal Kalite Filtreler' },
            { name: 'Filtron', desc: 'Mann+Hummel Güvencesinde Kalite' },
            { name: 'Hengst', desc: 'Alman Üretici Orijinal Filtresi' },
            { name: 'Purflux', desc: 'Fransız Orijinal Ekipman Filtresi' },
            { name: 'Champion Filtre', desc: 'OEM Standartlarında Filtre Grubu' },
            { name: 'Sardes / Fil Filtre', desc: 'Yerli Üretim Kaliteli Filtre' },
        ]
    },
    {
        name: 'Fren Sistemi (Balata, Disk, Hidrolik, Kaliper)',
        brands: [
            { name: 'Ferodo', desc: 'Eco-Friction Premium Balata & Disk' },
            { name: 'Brembo', desc: 'İtalyan Yüksek Performans Fren Sistemleri' },
            { name: 'ATE', desc: 'Alman OEM Fren Parçaları & Seramik Balata' },
            { name: 'TRW (ZF)', desc: 'Dünya Lideri Fren & Güvenlik Donanımı' },
            { name: 'Bosch Fren', desc: 'Güvenilir Sessiz Fren Balata & Disk' },
            { name: 'Textar', desc: 'TMD Friction Alman Orijinal Balata' },
            { name: 'Zimmermann', desc: 'Alman Delikli & Spor Fren Diskleri' },
            { name: 'Valeo Fren', desc: 'Orijinal Fransız Fren Grubu' },
            { name: 'Beşer Balata', desc: 'Yerli Güvenilir Fren Balatası' },
        ]
    },
    {
        name: 'Süspansiyon & Yürüyen Aksam (Amortisör, Salıncak, Rotil)',
        brands: [
            { name: 'Sachs', desc: 'Alman OEM Amortisör & Yay' },
            { name: 'Bilstein', desc: 'B4/B6/B8 Efsanevi Süspansiyon' },
            { name: 'Monroe', desc: 'OESpectrum Akıllı Süspansiyon' },
            { name: 'KYB (Kayaba)', desc: 'Japon Lideri Excel-G Amortisör' },
            { name: 'Lemförder (ZF)', desc: 'Orijinal Salıncak, Rotil & Burç' },
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
        islem_turu: 'Standart Periyodik Bakım (Yağ + Tüm Filtreler)',
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

    // Operation category active tab
    const [activeCategoryTab, setActiveCategoryTab] = useState('periyodik_sivi');

    // Bodywork map state
    const [bodyworkParts, setBodyworkParts] = useState([]);
    const [showBodyworkMap, setShowBodyworkMap] = useState(false);

    // Collapsible spare parts & brands state (collapsed by default)
    const [isPartsCatalogOpen, setIsPartsCatalogOpen] = useState(false);
    const [selectedParts, setSelectedParts] = useState([]);
    const [customPartInput, setCustomPartInput] = useState('');
    const [partSearchTerm, setPartSearchTerm] = useState('');
    const [activePartCatalogCat, setActivePartCatalogCat] = useState('all');

    // AI Generation animation state
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [aiSuccessMessage, setAiSuccessMessage] = useState(false);

    // Modal OCR
    const [isOcrOpen, setIsOcrOpen] = useState(false);
    const [showOilSection, setShowOilSection] = useState(true);

    // Automatically expand/show oil or bodywork sections based on selected operation
    useEffect(() => {
        const opLower = (data.islem_turu || '').toLowerCase();
        const isOil = opLower.includes('yağ') || opLower.includes('periyodik') || opLower.includes('filtre');
        setShowOilSection(isOil);

        const isBodywork = opLower.includes('kaporta') || opLower.includes('boya') || opLower.includes('göçük') || opLower.includes('rötüş') || opLower.includes('pasta') || opLower.includes('ppf');
        if (isBodywork) {
            setShowBodyworkMap(true);
        }
    }, [data.islem_turu]);

    const handleVehicleChange = (newId) => {
        const v = vehicles.find(item => String(item.id) === String(newId));
        setData(prev => ({
            ...prev,
            arac_id: newId,
            islem_km: v ? v.guncel_km : prev.islem_km,
        }));
    };

    const handleSelectOperation = (opItem, cat) => {
        setData('islem_turu', opItem);
        if (cat.isBodyworkRelated) {
            setShowBodyworkMap(true);
        }
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

    // AI Description Enhancer Handler
    const handleEnhanceWithAi = () => {
        setIsGeneratingAi(true);
        setAiSuccessMessage(false);

        setTimeout(() => {
            const enhancedText = generateSmartMaintenanceDescription({
                vehicle: activeVehicle,
                operationType: data.islem_turu,
                km: data.islem_km,
                parts: selectedParts,
                bodyworkParts: bodyworkParts,
                oilInfo: {
                    brand: data.yag_markasi,
                    model: data.yag_modeli,
                    viscosity: data.yag_viskozite,
                    liters: data.yag_litresi,
                    filterChanged: data.yag_filtresi_degisti,
                },
                serviceInfo: {
                    type: data.servis_turu,
                    serviceName: data.servis_adi || data.sanayi_sitesi,
                    mechanicName: data.usta_adi,
                },
                userNotes: data.aciklama,
            });

            setData('aciklama', enhancedText);
            setIsGeneratingAi(false);
            setAiSuccessMessage(true);

            setTimeout(() => setAiSuccessMessage(false), 4000);
        }, 600);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let finalDescription = data.aciklama ? data.aciklama.trim() : '';

        // Append spare parts block if not already included
        if (selectedParts.length > 0) {
            const partsBlock = `[Değişen OEM Parçalar: ${selectedParts.join(', ')}]`;
            if (!finalDescription.includes('Değişen OEM Parçalar') && !finalDescription.includes(selectedParts[0])) {
                finalDescription = finalDescription ? `${finalDescription}\n\n${partsBlock}` : partsBlock;
            }
        }

        // Append bodywork parts summary if any
        if (bodyworkParts.length > 0) {
            const bodyworkSummary = bodyworkParts.map(bp => `${bp.parca} (${bp.islem}${bp.not ? `: ${bp.not}` : ''})`).join(' | ');
            const bodyworkBlock = `[Kaporta/Boya Onarımı: ${bodyworkSummary}]`;
            if (!finalDescription.includes('Kaporta/Boya Onarımı')) {
                finalDescription = finalDescription ? `${finalDescription}\n\n${bodyworkBlock}` : bodyworkBlock;
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
    const currentCategoryConfig = ENHANCED_OPERATION_CATEGORIES.find(c => c.id === activeCategoryTab) || ENHANCED_OPERATION_CATEGORIES[0];

    const filteredPartCategories = SPARE_PARTS_CATEGORIES.filter((cat, idx) => {
        if (activePartCatalogCat === 'all') return true;
        return String(idx) === String(activePartCatalogCat);
    }).map(cat => ({
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
                            Yetkili servis, sanayi ustası veya kendi garajınızda yapılan motor yağı, parça, kaporta ve mekanik işlemlerini akıllıca kaydedin.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOcrOpen(true)}
                        className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2.5 cursor-pointer self-start md:self-auto"
                    >
                        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>AI ile Fatura Tara & Otomatik Doldur</span>
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
                                    className="w-full h-11 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
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
                                    className="w-full h-11 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-xs font-black font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Categorized Operation Type Selection */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center space-x-2.5">
                                <SlidersHorizontal className="w-5 h-5 text-purple-500" />
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                                        2. Yapılan Bakım & İşlem Kategorisi
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        İşlem türünü kategoriler arasından kolayca seçin veya özel başlık girin.
                                    </p>
                                </div>
                            </div>

                            {/* Kaporta Toggle button */}
                            <button
                                type="button"
                                onClick={() => setShowBodyworkMap(!showBodyworkMap)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                                    showBodyworkMap 
                                        ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-500/20' 
                                        : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20'
                                }`}
                            >
                                <Paintbrush className="w-3.5 h-3.5" />
                                <span>{showBodyworkMap ? 'Kaporta Şemasını Gizle' : '🎨 Kaporta / Göçük Şeması Aç'}</span>
                            </button>
                        </div>

                        {/* Category Selector Tabs */}
                        <div className="space-y-3">
                            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Bakım Kategorisi Seçin:
                            </div>
                            
                            {/* Horizontal scrollable category pills */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                {ENHANCED_OPERATION_CATEGORIES.map((cat) => {
                                    const isCatActive = activeCategoryTab === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setActiveCategoryTab(cat.id)}
                                            className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition-all shrink-0 cursor-pointer border ${
                                                isCatActive
                                                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]'
                                                    : 'bg-slate-50 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-base leading-none">{cat.icon}</span>
                                            <span>{cat.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Operations belonging to active category */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span>{currentCategoryConfig.icon}</span>
                                        <span>{currentCategoryConfig.name}</span>
                                        <span className="text-slate-400 font-normal">({currentCategoryConfig.desc})</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                    {currentCategoryConfig.items.map((op, idx) => {
                                        const isSelected = data.islem_turu === op;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSelectOperation(op, currentCategoryConfig)}
                                                className={`p-3 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer border ${
                                                    isSelected
                                                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black'
                                                        : 'bg-white dark:bg-[#161824] border-slate-200 dark:border-white/[0.06] hover:border-amber-500/40 text-slate-800 dark:text-slate-200'
                                                }`}
                                            >
                                                <span className="truncate pr-1">{op}</span>
                                                {isSelected && <Check className="w-4 h-4 shrink-0 text-slate-950" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selected / Custom Title Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Seçilen / Özel İşlem Başlığı:
                                </label>
                                <input
                                    type="text"
                                    value={data.islem_turu}
                                    onChange={(e) => setData('islem_turu', e.target.value)}
                                    placeholder="Örn: 120.000 KM Ağır Bakımı + Ön Balata"
                                    className="w-full h-11 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-xs font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2.5: Interactive Bodywork Repair Map (Auto-shown on bodywork or on demand) */}
                    {showBodyworkMap && (
                        <div className="animate-fadeIn">
                            <BodyworkRepairMap
                                value={bodyworkParts}
                                onChange={(newParts) => setBodyworkParts(newParts)}
                            />
                        </div>
                    )}

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
                                        Viskozite Derecesi:
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {OIL_VISCOSITIES.map((vis) => {
                                            const isSelected = data.yag_viskozite === vis;
                                            return (
                                                <button
                                                    key={vis}
                                                    type="button"
                                                    onClick={() => setData('yag_viskozite', vis)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                                                            : 'bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-amber-400'
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
                                            Motor Yağı Markası
                                        </label>
                                        <CustomSelect
                                            options={OIL_BRANDS_MODELS.map(b => ({ value: b.brand, label: b.brand }))}
                                            value={data.yag_markasi}
                                            onChange={(val) => {
                                                setData(prev => ({
                                                    ...prev,
                                                    yag_markasi: val,
                                                    yag_modeli: OIL_BRANDS_MODELS.find(b => b.brand === val)?.models[0] || ''
                                                }));
                                            }}
                                        />
                                    </div>

                                    {/* Oil Model / Series */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Yağ Serisi / Modeli
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
                                            className="w-full h-11 bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 text-xs font-bold text-slate-900 dark:text-white font-mono"
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

                    {/* Section 4: Collapsible Spare Parts & OEM Brands Catalog */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center space-x-2.5">
                                <Boxes className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>4. Değişen Parçalar & Marka Kataloğu</span>
                                        {selectedParts.length > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                                                {selectedParts.length} Parça Eklendi
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        Kullanılan OEM parçaları (Ferodo, Bosch, Brembo, Mann, Gates vb.) seçin.
                                    </p>
                                </div>
                            </div>

                            {/* Collapse / Expand Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setIsPartsCatalogOpen(!isPartsCatalogOpen)}
                                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 text-xs font-black flex items-center space-x-2 transition-all cursor-pointer self-start sm:self-auto"
                            >
                                <span>{isPartsCatalogOpen ? 'Kataloğu Kapat' : '📦 Marka Kataloğunu Aç'}</span>
                                {isPartsCatalogOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Selected Parts Chips - ALWAYS VISIBLE AT THE TOP */}
                        {selectedParts.length > 0 && (
                            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                                <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                    <span>Seçilen Parçalar ({selectedParts.length})</span>
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
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs font-black shadow-sm"
                                        >
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
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

                        {/* Custom Part Input Bar - Always accessible */}
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
                                placeholder="Özel marka / parça adı yazın (örn: Ferodo Ön Balata, Gates Triger, Mann Yağ Filtresi)..."
                                className="flex-1 h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddPartTag(customPartInput)}
                                className="px-5 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Parça Ekle</span>
                            </button>
                        </div>

                        {/* COLLAPSIBLE BRAND CATALOG ACCORDION */}
                        {isPartsCatalogOpen && (
                            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] animate-fadeIn">
                                {/* Search & Category Filters */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                    {/* Catalog Category Filter */}
                                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                                        <button
                                            type="button"
                                            onClick={() => setActivePartCatalogCat('all')}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
                                                activePartCatalogCat === 'all'
                                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                                    : 'bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                            }`}
                                        >
                                            Tüm Kategoriler
                                        </button>
                                        {SPARE_PARTS_CATEGORIES.map((c, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setActivePartCatalogCat(String(i))}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
                                                    activePartCatalogCat === String(i)
                                                        ? 'bg-emerald-500 text-white border-emerald-500'
                                                        : 'bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                                                }`}
                                            >
                                                {c.name.split('(')[0]}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Search Inside Catalog */}
                                    <div className="relative w-full sm:w-64 shrink-0">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            value={partSearchTerm}
                                            onChange={(e) => setPartSearchTerm(e.target.value)}
                                            placeholder="Marka ara (Ferodo, Brembo, Mann)..."
                                            className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Category Brands Grid */}
                                <div className="space-y-4 max-h-96 overflow-y-auto p-1">
                                    {filteredPartCategories.map((cat, catIdx) => (
                                        <div key={catIdx} className="space-y-2">
                                            <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {cat.name}
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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
                                                                    : 'bg-slate-50/60 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5 hover:border-emerald-500/40'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                                                                    {b.name}
                                                                </span>
                                                                {isAdded ? (
                                                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                                                                ) : (
                                                                    <Plus className="w-3 h-3 text-slate-400 opacity-60 shrink-0 ml-1" />
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
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
                        )}
                    </div>

                    {/* Section 5: Service Provider Information */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
                        <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <Building2 className="w-5 h-5 text-blue-500" />
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                5. Servis & Usta Bilgileri
                            </h3>
                        </div>

                        {/* Service Type Selection Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { id: 'yetkili_servis', label: 'Yetkili Servis', icon: Building2, desc: 'Doğuş, Borusan, Otokoç vb.' },
                                { id: 'ozel_servis', label: 'Özel Servis', icon: Store, desc: 'Marka odaklı bağımsız servis' },
                                { id: 'sanayi', label: 'Sanayi Ustası', icon: Hammer, desc: 'Oto sanayi mekanik atölyesi' },
                                { id: 'kendi_garajimiz', label: 'Kendi Garajım (DIY)', icon: Home, desc: 'Bireysel el emeği bakım' },
                            ].map((st) => {
                                const isSelected = data.servis_turu === st.id;
                                const Icon = st.icon;
                                return (
                                    <button
                                        key={st.id}
                                        type="button"
                                        onClick={() => setData('servis_turu', st.id)}
                                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500 shadow-sm'
                                                : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
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
                                        className="w-full h-11 bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                                            className="w-full h-11 bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white"
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
                                            className="w-full h-11 bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white"
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
                                            className="w-full h-11 bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 text-xs font-bold text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 6: Total Cost & Smart AI Description */}
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
                                    className="w-full h-12 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-base font-black font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                    required
                                />
                            </div>

                            {/* Additional Notes & AI Magic Enhancer */}
                            <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Açıklama & Servis Notları</span>
                                    </label>

                                    {/* AI Smart Auto-Enhance Button */}
                                    <button
                                        type="button"
                                        onClick={handleEnhanceWithAi}
                                        disabled={isGeneratingAi}
                                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                        <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isGeneratingAi ? 'animate-spin' : 'animate-pulse'}`} />
                                        <span>{isGeneratingAi ? 'AI Metni Oluşturuyor...' : '✨ AI ile Açıklamayı Tamamla'}</span>
                                    </button>
                                </div>

                                {aiSuccessMessage && (
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                                        <CheckCheck className="w-4 h-4 text-emerald-500" />
                                        <span>Servis açıklaması seçilen parça, kaporta ve motor detaylarıyla profesyonelce tamamlandı!</span>
                                    </div>
                                )}

                                <textarea
                                    value={data.aciklama}
                                    onChange={(e) => setData('aciklama', e.target.value)}
                                    rows="4"
                                    placeholder="Değişen parçalar, ustanın tavsiyeleri veya bir sonraki bakım notları... (Yukarıdaki 'AI ile Açıklamayı Tamamla' butonuna basarak otomatik profesyonel metin oluşturabilirsiniz)"
                                    className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none leading-relaxed"
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
