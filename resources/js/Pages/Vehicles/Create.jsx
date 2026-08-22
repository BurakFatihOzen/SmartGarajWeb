import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, Link, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { BRANDS_LIST, CAR_CATALOG } from '@/data/carData';
import OcrModal from '@/Components/OcrModal';
import CustomDropdown from '@/Components/CustomDropdown';
import { 
    FLEET_STATUS_OPTIONS, 
    FLEET_OWNERSHIP_OPTIONS, 
    FLEET_DEPARTMENT_OPTIONS 
} from '@/Utils/fleetConstants';
import { 
    Car, 
    ArrowLeft, 
    CheckCircle2, 
    Calendar, 
    Shield, 
    Gauge, 
    Search, 
    ChevronDown, 
    Edit3,
    Sparkles,
    FileCheck,
    Upload,
    Camera,
    X,
    Scan,
    Zap,
    Image as ImageIcon,
    FileText,
    Fuel,
    Info,
    Check,
    HelpCircle,
    ShieldCheck,
    ShieldAlert,
    Building2,
    UserCheck,
    Truck,
    Layers,
    Hash
} from 'lucide-react';

export const RUHSAT_TIPLERI = [
    { id: 'Otomobil (Hususi)', label: 'Otomobil (Hususi)', desc: 'İlk 3 yıl muaf, sonra 2 yılda bir', cycleYears: 2, newCarFreeYears: 3 },
    { id: 'Kamyonet (Ticari / Panelvan)', label: 'Kamyonet (Ticari / Panelvan)', desc: 'Her 1 yılda bir muayene (Doblo, Transit, Caddy vb.)', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Motosiklet / Scooter', label: 'Motosiklet / Scooter (2-3 Tekerlekli)', desc: 'İlk 3 yıl muaf, sonra 2 yılda bir', cycleYears: 2, newCarFreeYears: 3 },
    { id: 'Ticari Taksi / Dolmuş', label: 'Ticari Taksi / Dolmuş', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Kamyon / Çekici / Tır', label: 'Kamyon / Çekici / Tır', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Otobüs / Minibüs / Servis', label: 'Otobüs / Minibüs / Servis', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Traktör (Tarımsal)', label: 'Traktör (Tarımsal)', desc: 'İlk 3 yıl muaf, sonra 3 yılda bir', cycleYears: 3, newCarFreeYears: 3 },
    { id: 'Römork / Karavan', label: 'Römork / Karavan (750 kg üzeri)', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
];

export default function VehicleCreate() {
    const [isOcrOpen, setIsOcrOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [brandSearch, setBrandSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isMotorDropdownOpen, setIsMotorDropdownOpen] = useState(false);

    const [isCustomBrand, setIsCustomBrand] = useState(false);
    const [isCustomModel, setIsCustomModel] = useState(false);
    const [isCustomMotor, setIsCustomMotor] = useState(false);

    const [availableModels, setAvailableModels] = useState([]);
    const [availableMotors, setAvailableMotors] = useState([]);
    const [yearLimits, setYearLimits] = useState({ min: 1950, max: new Date().getFullYear() + 1, placeholder: 'Örn: 2020' });
    const [hasKasko, setHasKasko] = useState(false);

    const handleKaskoToggle = (status) => {
        setHasKasko(status);
        if (!status) {
            setData('kasko_bitis', '');
        }
    };

    const brandDropdownRef = useRef(null);
    const modelDropdownRef = useRef(null);
    const motorDropdownRef = useRef(null);

    const { auth } = usePage().props;
    const isFleet = auth?.user?.hesap_turu === 'filo' || auth?.user?.rol === 'filo';

    const { data, setData, post, processing, errors } = useForm({
        plaka: '',
        marka: '',
        model: '',
        motor: '',
        vites_turu: 'Manuel',
        yakit_turu: 'Benzin',
        yil: '',
        guncel_km: '',
        ruhsat_tipi: 'Otomobil (Hususi)',
        muayene_bitis: '',
        sigorta_bitis: '',
        kasko_bitis: '',
        sasi_no: '',
        notlar: '',
        fotograf: null,
        durum: 'aktif',
        zimmet_surucu_adi: '',
        departman: '',
        sozlesme_turu: 'Özmal',
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('fotograf', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleOcrExtracted = (extracted) => {
        if (extracted.plaka) setData('plaka', extracted.plaka);
        if (extracted.marka) {
            setData('marka', extracted.marka);
            setIsCustomBrand(true);
        }
        if (extracted.model) {
            setData('model', extracted.model);
            setIsCustomModel(true);
        }
        if (extracted.motor) {
            setData('motor', extracted.motor);
            setIsCustomMotor(true);
        }
        if (extracted.yil) setData('yil', String(extracted.yil));
        if (extracted.sasi_no) setData('sasi_no', extracted.sasi_no);
        if (extracted.muayene_tarihi) setData('muayene_bitis', extracted.muayene_tarihi);
        if (extracted.ruhsat_tipi) setData('ruhsat_tipi', extracted.ruhsat_tipi);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target)) {
                setIsBrandDropdownOpen(false);
            }
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target)) {
                setIsModelDropdownOpen(false);
            }
            if (motorDropdownRef.current && !motorDropdownRef.current.contains(e.target)) {
                setIsMotorDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format TR License plate
    const handlePlateChange = (e) => {
        let val = e.target.value.toLocaleUpperCase('tr-TR').replace(/[^A-Z0-9]/g, '');
        let city = "";
        let letters = "";
        let numbers = "";

        let cityMatch = val.match(/^\d{1,2}/);
        if (cityMatch) {
            city = cityMatch[0];
            if (city.length === 1 && parseInt(city) > 8) city = "";
            if (city.length === 2) {
                let num = parseInt(city, 10);
                if (num > 81 || num === 0) city = city.substring(0, 1);
            }
            val = val.substring(city.length);
        } else {
            val = "";
        }

        if (city.length === 2) {
            let lettersMatch = val.match(/^[A-Z]{1,3}/);
            if (lettersMatch) {
                letters = lettersMatch[0];
                val = val.substring(letters.length);
            }
        }

        if (letters.length > 0) {
            let numMatch = val.match(/^\d{1,5}/);
            if (numMatch) {
                numbers = numMatch[0];
            }
        }

        let formatted = city;
        if (letters) formatted += " " + letters;
        if (numbers) formatted += " " + numbers;

        setData('plaka', formatted);
    };

    const handleSelectBrand = (brand) => {
        setData(prev => ({
            ...prev,
            marka: brand.ad,
            model: '',
            motor: '',
        }));
        setIsCustomBrand(false);
        setIsCustomModel(false);
        setIsCustomMotor(false);
        setIsBrandDropdownOpen(false);

        const catalog = CAR_CATALOG[brand.ad];
        if (catalog) {
            const modelsList = Object.keys(catalog).map(modelName => {
                const yearMatch = modelName.match(/\((\d{4})[^\d]*(\d{4})?\)/);
                let years = null;
                if (yearMatch) {
                    const startYear = parseInt(yearMatch[1], 10);
                    const endYear = yearMatch[2] ? parseInt(yearMatch[2], 10) : new Date().getFullYear() + 1;
                    years = [startYear, endYear];
                }
                return {
                    name: modelName,
                    motors: catalog[modelName],
                    years: years
                };
            });
            setAvailableModels(modelsList);
        } else {
            setAvailableModels([]);
        }
        setAvailableMotors([]);
    };

    const handleSelectModel = (modelObj) => {
        setData(prev => ({
            ...prev,
            model: modelObj.name,
            motor: '',
        }));
        setIsCustomModel(false);
        setIsCustomMotor(false);
        setIsModelDropdownOpen(false);

        if (modelObj.motors) {
            setAvailableMotors(modelObj.motors);
        } else {
            setAvailableMotors([]);
        }

        if (modelObj.years) {
            setYearLimits({
                min: modelObj.years[0],
                max: modelObj.years[1],
                placeholder: `${modelObj.years[0]} - ${modelObj.years[1]}`
            });
        }
    };

    const handleSelectMotor = (motorName) => {
        let detectedTransmission = data.vites_turu || 'Manuel';
        if (/dsg|edc|dct|ddct|eat6|eat8|7g|9g|zf|cvt|s-tronic|powershift|tiptronic|pdk|otomatik|elektrik|ev|blade|e-cvt/i.test(motorName)) {
            detectedTransmission = 'Otomatik';
        } else if (/6mt|5mt|düz|manuel/i.test(motorName)) {
            detectedTransmission = 'Manuel';
        }

        let detectedFuel = data.yakit_turu || 'Benzin';
        if (/dci|tdi|multijet|dizel|diesel|crdi|bluehdi|hdi|tdci|cdti|jtd|jtdm|cdi|d-4d|di-d|mz-cd|ddis/i.test(motorName)) {
            detectedFuel = 'Dizel';
        } else if (/elektrik|elettrica|electric|ev|kwh|bev|blade/i.test(motorName) || /t10x|tesla|taycan|byd|seal/i.test(data.model)) {
            detectedFuel = 'Elektrik';
        } else if (/phev|plug-in|hybrid|hibrit|mhev|ibrida|e-tech|e:hev|e-power|mild hybrid/i.test(motorName)) {
            detectedFuel = 'Hibrit';
        } else if (/lpg|eco-g|eko|autogas/i.test(motorName)) {
            detectedFuel = 'LPG & Benzin';
        } else {
            detectedFuel = 'Benzin';
        }

        setData(prev => ({
            ...prev,
            motor: motorName,
            vites_turu: detectedTransmission,
            yakit_turu: detectedFuel
        }));
        setIsCustomMotor(false);
        setIsMotorDropdownOpen(false);
    };

    // Calculate allowed fuel types based on selected motor & model
    const allowedFuels = useMemo(() => {
        const m = (data.motor || '').toLowerCase();
        const model = (data.model || '').toLowerCase();
        
        if (/dci|tdi|multijet|dizel|diesel|crdi|bluehdi|hdi|tdci|cdti|jtd|jtdm|cdi|d-4d|di-d|mz-cd|ddis/i.test(m)) {
            return ['Dizel'];
        }
        if (/elektrik|elettrica|electric|ev|kwh|bev|blade/i.test(m) || /t10x|tesla|taycan|byd|seal|atto|dolphin|ioniq/i.test(model)) {
            return ['Elektrik'];
        }
        if (/phev|plug-in|hybrid|hibrit|mhev|ibrida|e-tech|e:hev|e-power|mild hybrid/i.test(m)) {
            return ['Hibrit', 'Benzin'];
        }
        if (/lpg|eco-g|eko|autogas/i.test(m)) {
            return ['LPG & Benzin', 'Benzin'];
        }
        if (m.length > 0) {
            return ['Benzin', 'LPG & Benzin'];
        }
        return ['Benzin', 'Dizel', 'Hibrit', 'Elektrik', 'LPG & Benzin'];
    }, [data.motor, data.model]);

    useEffect(() => {
        if (allowedFuels.length > 0 && !allowedFuels.includes(data.yakit_turu)) {
            setData('yakit_turu', allowedFuels[0]);
        }
    }, [allowedFuels]);

    // Calculate smart TÜVTÜRK inspection deadline
    const calculateSmartMuayene = (yearStr, licenseType) => {
        const yearNum = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();
        const ruhsat = RUHSAT_TIPLERI.find(r => r.id === licenseType) || RUHSAT_TIPLERI[0];
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');

        if (yearNum && yearNum >= currentYear) {
            const targetYear = yearNum + ruhsat.newCarFreeYears;
            return `${targetYear}-${mm}-${dd}`;
        }
        return '';
    };

    const handleYearChange = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
        setData(prev => {
            const calculated = calculateSmartMuayene(val, prev.ruhsat_tipi);
            return {
                ...prev,
                yil: val,
                muayene_bitis: calculated ? calculated : prev.muayene_bitis,
            };
        });
    };

    const handleRuhsatChange = (newType) => {
        setData(prev => {
            const calculated = calculateSmartMuayene(prev.yil, newType);
            return {
                ...prev,
                ruhsat_tipi: newType,
                muayene_bitis: calculated ? calculated : prev.muayene_bitis,
            };
        });
    };

    const applyQuickDate = (field, yearsToAdd) => {
        const today = new Date();
        const targetYear = today.getFullYear() + yearsToAdd;
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setData(field, `${targetYear}-${mm}-${dd}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/vehicles');
    };

    const filteredBrands = BRANDS_LIST.filter(b => 
        b.ad.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const filteredModels = availableModels.filter(m => 
        m.name.toLowerCase().includes(modelSearch.toLowerCase())
    );

    return (
        <AppLayout title="Yeni Araç Ekle">
            <Head title="Yeni Araç Ekle — SmartGaraj" />
            
            <OcrModal 
                isOpen={isOcrOpen} 
                onClose={() => setIsOcrOpen(false)} 
                type="ruhsat"
                onDataExtracted={handleOcrExtracted} 
                onExtracted={handleOcrExtracted} 
            />

            <div className="space-y-6 w-full max-w-full overflow-x-hidden">
                
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
                                Yeni Araç Kaydı
                            </h2>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                Garajınıza yeni bir araç ekleyin veya ruhsat fotoğrafı ile otomatik tarayın.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOcrOpen(true)}
                        className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                        <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                        <span>🧠 Vision AI ile Ruhsat Tara</span>
                    </button>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    MAIN 2-COLUMN FULL-WIDTH GRID (Form on Left, Live Card on Right)
                ═══════════════════════════════════════════════════════════════ */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT FORM AREA (7 Columns on Large Screens) */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                            
                            {/* SECTION 1: TEMEL ARAÇ BİLGİLERİ */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
                                <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.04]">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xs">
                                        1
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                        Temel Araç Bilgileri
                                    </h3>
                                </div>

                                {/* Photo Dropzone */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Araç Görseli (Opsiyonel)
                                    </label>
                                    {!photoPreview ? (
                                        <label className="border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 dark:bg-white/[0.02] hover:bg-amber-50/20 group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Camera className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                Fotoğraf Seçin veya Sürükleyin
                                            </span>
                                            <span className="text-[10px] text-slate-400 mt-0.5">
                                                PNG, JPG, WEBP formatları desteklenir
                                            </span>
                                        </label>
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-56 bg-slate-900 flex items-center justify-center group">
                                            <img src={photoPreview} alt="Araç Önizleme" className="max-h-56 w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setData('fotograf', null); setPhotoPreview(null); }}
                                                className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/70 text-white hover:bg-red-500 transition-colors shadow-lg cursor-pointer"
                                                title="Fotoğrafı Kaldır"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Plaka Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Plaka <span className="text-amber-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.plaka}
                                            onChange={handlePlateChange}
                                            placeholder="34 ABC 123"
                                            maxLength={11}
                                            className="w-full uppercase font-mono font-black tracking-wider bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                                            required
                                            autoFocus
                                        />
                                        <span className="text-[10px] font-semibold text-slate-400 mt-1 block">Örnek: 06 ABC 1234</span>
                                        {errors.plaka && <p className="text-red-500 text-xs mt-1">{errors.plaka}</p>}
                                    </div>

                                    {/* Marka Dropdown */}
                                    <div ref={brandDropdownRef} className="relative">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Marka <span className="text-amber-500">*</span>
                                        </label>
                                        
                                        {!isCustomBrand ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                                                    className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-left text-slate-900 dark:text-white flex items-center justify-between hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-2.5 min-w-0">
                                                        {data.marka && (
                                                            <div className="w-5 h-5 rounded-md bg-white dark:bg-white/[0.08] flex items-center justify-center p-0.5 shrink-0 overflow-hidden border border-slate-200/60 dark:border-white/10">
                                                                <img
                                                                    src={`https://www.google.com/s2/favicons?domain=${BRANDS_LIST.find(b => b.ad === data.marka)?.domain || 'google.com'}&sz=64`}
                                                                    alt={data.marka}
                                                                    className="w-4 h-4 object-contain"
                                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                />
                                                            </div>
                                                        )}
                                                        <span className={data.marka ? "font-bold text-slate-900 dark:text-white" : "text-slate-400"}>
                                                            {data.marka || 'Marka Seçin...'}
                                                        </span>
                                                    </div>
                                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isBrandDropdownOpen ? 'rotate-180 text-amber-500' : ''}`} />
                                                </button>

                                                {isBrandDropdownOpen && (
                                                    <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-2 max-h-72 flex flex-col">
                                                        <div className="relative">
                                                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                                            <input
                                                                type="text"
                                                                value={brandSearch}
                                                                onChange={(e) => setBrandSearch(e.target.value)}
                                                                placeholder="Marka filtrele..."
                                                                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1f2232] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                                                            {filteredBrands.map((b) => (
                                                                <button
                                                                    key={b.ad}
                                                                    type="button"
                                                                    onClick={() => handleSelectBrand(b)}
                                                                    className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-500/10 hover:text-amber-500 transition-colors flex items-center justify-between cursor-pointer group"
                                                                >
                                                                    <div className="flex items-center space-x-2.5 min-w-0">
                                                                        <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center p-0.5 shrink-0 overflow-hidden border border-slate-200/80 dark:border-white/10">
                                                                            <img
                                                                                src={`https://www.google.com/s2/favicons?domain=${b.domain}&sz=64`}
                                                                                alt={b.ad}
                                                                                className="w-4 h-4 object-contain"
                                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                            />
                                                                        </div>
                                                                        <span className="truncate">{b.ad}</span>
                                                                    </div>
                                                                    {data.marka === b.ad && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-2" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setIsCustomBrand(true); setIsBrandDropdownOpen(false); }}
                                                            className="text-left text-[11px] font-bold text-amber-500 hover:underline pt-2 border-t border-slate-100 dark:border-white/5"
                                                        >
                                                            + Listede yok, manuel yaz
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={data.marka}
                                                    onChange={(e) => setData('marka', e.target.value)}
                                                    placeholder="Markayı yazın (Örn: Togg, Audi)"
                                                    className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCustomBrand(false)}
                                                    className="absolute right-3 top-3 text-[11px] font-bold text-amber-500 hover:underline"
                                                >
                                                    Listeye Dön
                                                </button>
                                            </div>
                                        )}
                                        {errors.marka && <p className="text-red-500 text-xs mt-1">{errors.marka}</p>}
                                    </div>

                                    {/* Model Selection */}
                                    <div ref={modelDropdownRef} className="relative">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Model <span className="text-amber-500">*</span>
                                        </label>
                                        
                                        {!isCustomModel && availableModels.length > 0 ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                                    className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-left text-slate-900 dark:text-white flex items-center justify-between hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
                                                >
                                                    <span className={data.model ? "font-bold text-slate-900 dark:text-white" : "text-slate-400"}>
                                                        {data.model || 'Model Seçin...'}
                                                    </span>
                                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isModelDropdownOpen ? 'rotate-180 text-amber-500' : ''}`} />
                                                </button>

                                                {isModelDropdownOpen && (
                                                    <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-2 max-h-72 flex flex-col">
                                                        <div className="relative">
                                                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                                            <input
                                                                type="text"
                                                                value={modelSearch}
                                                                onChange={(e) => setModelSearch(e.target.value)}
                                                                placeholder="Model filtrele (örn: Golf, Touran, Passat)..."
                                                                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1f2232] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                                                            {filteredModels.map((m) => (
                                                                <button
                                                                    key={m.name}
                                                                    type="button"
                                                                    onClick={() => handleSelectModel(m)}
                                                                    className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-500/10 hover:text-amber-500 transition-colors flex items-center justify-between cursor-pointer group"
                                                                >
                                                                    <span className="truncate">{m.name}</span>
                                                                    {data.model === m.name && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-2" />}
                                                                </button>
                                                            ))}
                                                            {filteredModels.length === 0 && (
                                                                <div className="text-center py-3 text-[11px] text-slate-400">
                                                                    Eşleşen model bulunamadı
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setIsCustomModel(true); setIsModelDropdownOpen(false); }}
                                                            className="text-left text-[11px] font-bold text-amber-500 hover:underline pt-2 border-t border-slate-100 dark:border-white/5 block w-full"
                                                        >
                                                            + Özel Model Yaz
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <input
                                                type="text"
                                                value={data.model}
                                                onChange={(e) => setData('model', e.target.value)}
                                                placeholder="Model (Örn: Megane IV, Tonale, Corolla)"
                                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                required
                                            />
                                        )}
                                        {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
                                    </div>

                                    {/* Motor / Yakıt Paketi */}
                                    <div ref={motorDropdownRef} className="relative">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Motor & Paket
                                        </label>
                                        
                                        {!isCustomMotor && availableMotors.length > 0 ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsMotorDropdownOpen(!isMotorDropdownOpen)}
                                                    className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-left text-slate-900 dark:text-white flex items-center justify-between hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
                                                >
                                                    <span className={data.motor ? "font-bold text-slate-900 dark:text-white truncate" : "text-slate-400"}>
                                                        {data.motor || 'Motor / Paket Seçin...'}
                                                    </span>
                                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isMotorDropdownOpen ? 'rotate-180 text-amber-500' : ''}`} />
                                                </button>

                                                {isMotorDropdownOpen && (
                                                    <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/10 shadow-2xl p-3 space-y-1 max-h-60 overflow-y-auto">
                                                        {availableMotors.map((motor) => (
                                                            <button
                                                                key={motor}
                                                                type="button"
                                                                onClick={() => handleSelectMotor(motor)}
                                                                className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-500/10 hover:text-amber-500 transition-colors flex items-center justify-between cursor-pointer"
                                                            >
                                                                <span className="truncate">{motor}</span>
                                                                {data.motor === motor && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1" />}
                                                            </button>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => { setIsCustomMotor(true); setIsMotorDropdownOpen(false); }}
                                                            className="text-left text-[11px] font-bold text-amber-500 hover:underline pt-2 border-t border-slate-100 dark:border-white/5 block w-full"
                                                        >
                                                            + Manuel Motor Bilgisi Yaz
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <input
                                                type="text"
                                                value={data.motor}
                                                onChange={(e) => setData('motor', e.target.value)}
                                                placeholder="Örn: 1.5 Blue dCi (115 HP) / 1.6 TDI"
                                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            />
                                        )}
                                    </div>

                                    {/* Şanzıman (Vites Türü) & Yakıt Türü */}
                                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05]">
                                        {/* Vites Türü */}
                                        <div className="flex flex-col justify-between">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Şanzıman / Vites
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Otomatik', 'Manuel'].map((v) => (
                                                    <button
                                                        key={v}
                                                        type="button"
                                                        onClick={() => setData('vites_turu', v)}
                                                        className={`h-11 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                                                            data.vites_turu === v
                                                                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                                                                : 'bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <span className="text-sm">{v === 'Otomatik' ? '⚡' : '🕹️'}</span>
                                                        <span>{v}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Yakıt Türü */}
                                        <div className="flex flex-col justify-between">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Yakıt Türü
                                            </label>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {[
                                                    { id: 'Benzin', label: 'Benzin', icon: '⛽' },
                                                    { id: 'Dizel', label: 'Dizel', icon: '🛢️' },
                                                    { id: 'Hibrit', label: 'Hibrit', icon: '🔋' },
                                                    { id: 'Elektrik', label: 'Elektrik', icon: '⚡' },
                                                    { id: 'LPG & Benzin', label: 'LPG', icon: '🔥' },
                                                ].map((f) => {
                                                    const isAllowed = allowedFuels.includes(f.id);
                                                    const isSelected = data.yakit_turu === f.id;
                                                    return (
                                                        <button
                                                            key={f.id}
                                                            type="button"
                                                            disabled={!isAllowed}
                                                            onClick={() => isAllowed && setData('yakit_turu', f.id)}
                                                            title={!isAllowed ? 'Seçilen motor seçeneğiyle uyumlu değil' : f.label}
                                                            className={`h-11 px-1 rounded-xl border text-[11px] font-bold transition-all flex flex-col items-center justify-center ${
                                                                !isAllowed
                                                                    ? 'opacity-25 bg-slate-100 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-400 cursor-not-allowed'
                                                                    : isSelected
                                                                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black cursor-pointer'
                                                                        : 'bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300 cursor-pointer'
                                                            }`}
                                                        >
                                                            <span className="text-xs leading-none mb-0.5">{f.icon}</span>
                                                            <span className="truncate text-[10px] leading-tight">{f.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Model Yılı, Güncel KM & Şasi No (3 Columns in Section 1) */}
                                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                                        {/* Model Yılı */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Model Yılı <span className="text-amber-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.yil}
                                                onChange={handleYearChange}
                                                placeholder={yearLimits.placeholder}
                                                maxLength={4}
                                                className="w-full font-mono font-bold bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                required
                                            />
                                        </div>

                                        {/* Güncel KM */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Güncel Sayaç (KM)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.guncel_km}
                                                onChange={(e) => setData('guncel_km', e.target.value)}
                                                placeholder="Örn: 125000"
                                                className="w-full font-mono font-bold bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>

                                        {/* Şasi Numarası VIN (Opsiyonel) */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                                Şasi No / VIN <span className="text-[10px] text-slate-400 font-normal">(Opsiyonel)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.sasi_no}
                                                onChange={(e) => setData('sasi_no', e.target.value.toUpperCase())}
                                                placeholder="Örn: VF1RFB00862XXXXXX"
                                                maxLength={17}
                                                className="w-full font-mono uppercase bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: RUHSAT TÜRÜ & YASAL SÜRELER (MUAYENE, SİGORTA, KASKO) */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-6">
                                <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.04]">
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-xs">
                                        2
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                        Ruhsat Cinsi & Yasal Süreler
                                    </h3>
                                </div>

                                {/* Ruhsat Tipi Seçim Kartları (Tüm Türkiye TÜVTÜRK Araç Sınıfları) */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Ruhsat Cinsi (TÜVTÜRK Muayene Periyodunu Belirler)
                                        </label>
                                        <span className="text-[10px] text-slate-400 font-semibold">
                                            Resmi TÜVTÜRK Mevzuatı
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {RUHSAT_TIPLERI.map((r) => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => handleRuhsatChange(r.id)}
                                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                    data.ruhsat_tipi === r.id
                                                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-amber-500'
                                                        : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="text-xs font-extrabold truncate">{r.label}</div>
                                                <div className="text-[10px] text-slate-400 mt-1">{r.cycleYears} Yılda Bir</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Yasal Süreler: Muayene, Sigorta, Kasko */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                                    
                                    {/* 1. Muayene Bitiş Tarihi */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                                                <Shield className="w-3.5 h-3.5 text-blue-500" />
                                                <span>TÜVTÜRK Muayene</span>
                                            </label>
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    type="button"
                                                    onClick={() => applyQuickDate('muayene_bitis', 1)}
                                                    className="text-[10px] font-bold text-amber-500 hover:underline cursor-pointer"
                                                >
                                                    +1Y
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => applyQuickDate('muayene_bitis', 2)}
                                                    className="text-[10px] font-bold text-amber-500 hover:underline cursor-pointer"
                                                >
                                                    +2Y
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="date"
                                            value={data.muayene_bitis}
                                            onChange={(e) => setData('muayene_bitis', e.target.value)}
                                            className="w-full font-mono font-bold bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>

                                    {/* 2. Trafik Sigortası Bitiş */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                <span>Trafik Sigortası</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => applyQuickDate('sigorta_bitis', 1)}
                                                className="text-[10px] font-bold text-emerald-500 hover:underline cursor-pointer"
                                            >
                                                +1Y
                                            </button>
                                        </div>
                                        <input
                                            type="date"
                                            value={data.sigorta_bitis}
                                            onChange={(e) => setData('sigorta_bitis', e.target.value)}
                                            className="w-full font-mono font-bold bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>

                                    {/* 3. Kasko Poliçesi Toggle & Date */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                                                <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                                                <span>Kasko Poliçesi</span>
                                            </label>
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleKaskoToggle(true)}
                                                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                                                        hasKasko 
                                                            ? 'bg-purple-500 text-white shadow-2xs' 
                                                            : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                                                    }`}
                                                >
                                                    Var
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleKaskoToggle(false)}
                                                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                                                        !hasKasko 
                                                            ? 'bg-slate-700 text-white' 
                                                            : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                                                    }`}
                                                >
                                                    Yok
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {hasKasko ? (
                                            <input
                                                type="date"
                                                value={data.kasko_bitis}
                                                onChange={(e) => setData('kasko_bitis', e.target.value)}
                                                className="w-full font-mono font-bold bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        ) : (
                                            <div className="w-full rounded-2xl px-3.5 py-2.5 text-[11px] font-semibold text-slate-400 bg-slate-100/70 dark:bg-white/[0.03] border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center text-center">
                                                Kasko takibi yapılmayacak
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: KURUMSAL FİLO & ZİMMET BİLGİLERİ (Sadece Kurumsal Hesaplarda) */}
                            {isFleet && (
                                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-blue-500/20 dark:border-blue-500/30 shadow-sm space-y-6">
                                    <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-white/[0.04]">
                                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-xs">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                                <Building2 className="w-4 h-4 text-blue-500" />
                                                <span>Filo & Zimmet Yönetim Bilgileri</span>
                                            </h3>
                                            <p className="text-[11px] text-slate-400">Şirket filonuzdaki araç durumu, zimmet ve departman ataması</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Filo Durumu */}
                                        <CustomDropdown
                                            label="Filo Durumu"
                                            icon={Building2}
                                            value={data.durum || 'aktif'}
                                            options={FLEET_STATUS_OPTIONS}
                                            onChange={(val) => setData('durum', val)}
                                        />

                                        {/* Sözleşme / Mülkiyet Türü */}
                                        <CustomDropdown
                                            label="Mülkiyet / Sözleşme Türü"
                                            icon={FileCheck}
                                            value={data.sozlesme_turu || 'Özmal'}
                                            options={FLEET_OWNERSHIP_OPTIONS}
                                            onChange={(val) => setData('sozlesme_turu', val)}
                                        />

                                        {/* Zimmetli Sürücü */}
                                        <div>
                                            <div className="h-5 flex items-center mb-1.5">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                                                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Zimmetli Sürücü / Personel</span>
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                value={data.zimmet_surucu_adi}
                                                onChange={(e) => setData('zimmet_surucu_adi', e.target.value)}
                                                placeholder="Örn: Ahmet Yılmaz"
                                                className="w-full h-11 bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Departman / Birim */}
                                        <CustomDropdown
                                            label="Departman / Saha Birimi"
                                            icon={Layers}
                                            value={data.departman || 'Saha Satış & Pazarlama'}
                                            options={FLEET_DEPARTMENT_OPTIONS}
                                            onChange={(val) => setData('departman', val)}
                                            allowCustom={true}
                                            customPlaceholder="Örn: AR-GE, Özel Proje, Kalite Kontrol"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: LIVE PREVIEW & ACTIONS (5 Columns on Large Screens) */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
                            
                            {/* Live Vehicle Card Preview (GoDrive style) */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                        Canlı Garaj Kartı Önizleme
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </div>

                                {/* Preview Image / Plate */}
                                <div className="relative h-44 rounded-2xl bg-slate-100 dark:bg-[#161824] border border-slate-200 dark:border-white/[0.06] overflow-hidden flex items-center justify-center">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-slate-400">
                                            <Car className="w-12 h-12 mx-auto mb-1 opacity-40" />
                                            <span className="text-[11px] font-bold">Fotoğraf Eklenmedi</span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3">
                                        <div className="badge-plate text-xs shadow-md">
                                            {data.plaka || '34 PLK 001'}
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-slate-950/70 backdrop-blur-sm text-white">
                                            {data.yil || new Date().getFullYear()}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white truncate">
                                        {data.marka || 'Marka'} {data.model || 'Model Belirtilmedi'}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
                                        {data.motor || 'Standart Motor'} &bull; {data.vites_turu} &bull; {data.yakit_turu}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs">
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04]">
                                        <span className="text-[10px] font-bold text-slate-400 block">Sayaç:</span>
                                        <span className="font-mono font-black text-slate-900 dark:text-white">
                                            {data.guncel_km ? `${Number(data.guncel_km).toLocaleString('tr-TR')} KM` : '-'}
                                        </span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04]">
                                        <span className="text-[10px] font-bold text-slate-400 block">Kasko Durumu:</span>
                                        <span className={`font-bold ${hasKasko ? 'text-purple-500' : 'text-slate-400'}`}>
                                            {hasKasko ? 'Poliçe Var' : 'Yok'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2.5 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                                        <span>{processing ? 'Araç Kaydediliyor...' : 'Aracı Garaja Kaydet'}</span>
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
