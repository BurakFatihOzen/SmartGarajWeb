import React, { useState, useEffect, useRef } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { BRANDS_LIST, CAR_CATALOG } from '@/data/carData';
import OcrModal from '@/Components/OcrModal';
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
    Image as ImageIcon
} from 'lucide-react';

export const RUHSAT_TIPLERI = [
    { id: 'Otomobil (Hususi)', label: 'Otomobil (Hususi / Şahsi)', desc: 'İlk 3 yıl muaf, sonra 2 yılda bir', cycleYears: 2, newCarFreeYears: 3 },
    { id: 'Kamyonet (Panelvan / Doblo / Transit)', label: 'Kamyonet (Panelvan / Doblo / Caddy / Transit)', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Motosiklet / Scooter', label: 'Motosiklet / Scooter (Hususi)', desc: 'İlk 3 yıl muaf, sonra 2 yılda bir', cycleYears: 2, newCarFreeYears: 3 },
    { id: 'Ticari Taksi / Dolmuş', label: 'Ticari Taksi / Dolmuş', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Kamyon / Çekici / Tır', label: 'Kamyon / Çekici / Tır', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Otobüs / Minibüs / Servis', label: 'Otobüs / Minibüs / Servis', desc: 'Her 1 yılda bir muayene', cycleYears: 1, newCarFreeYears: 1 },
    { id: 'Traktör (Tarımsal)', label: 'Traktör (Tarımsal Amaçlı)', desc: 'İlk 3 yıl muaf, sonra 3 yılda bir', cycleYears: 3, newCarFreeYears: 3 },
    { id: 'Karavan / Özel Amaçlı', label: 'Karavan / Özel Amaçlı Taşıt', desc: 'Ruhsata göre 1 veya 2 yılda bir', cycleYears: 1, newCarFreeYears: 1 },
];

export default function VehicleCreate() {
    const [isOcrOpen, setIsOcrOpen] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [brandSearch, setBrandSearch] = useState('');
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

    const { data, setData, post, processing, errors } = useForm({
        plaka: '',
        marka: '',
        model: '',
        motor: '',
        yil: '',
        guncel_km: '',
        ruhsat_tipi: 'Otomobil (Hususi)',
        muayene_bitis: '',
        sigorta_bitis: '',
        kasko_bitis: '',
        sasi_no: '',
        notlar: '',
        fotograf: null,
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

    // --- TÜRKİYE PLAKA FORMATLAYICI (KURŞUNGEÇİRMEZ V3) ---
    const handlePlateChange = (e) => {
        let val = e.target.value.toLocaleUpperCase('tr-TR').replace(/[^A-Z0-9]/g, '');

        let city = "";
        let letters = "";
        let numbers = "";

        // 1. İL KODU (01 - 81)
        let cityMatch = val.match(/^\d{1,2}/);
        if (cityMatch) {
            city = cityMatch[0];
            if (city.length === 1 && parseInt(city) > 8) {
                city = "";
            }
            if (city.length === 2) {
                let num = parseInt(city, 10);
                if (num > 81 || num === 0) {
                    city = city.substring(0, 1);
                }
            }
            val = val.substring(city.length);
        } else {
            val = "";
        }

        // 2. ORTA HARF GRUBU (1 ila 3 Harf)
        if (city.length === 2 && val.length > 0) {
            let letterMatch = val.match(/^[A-Z]{1,3}/);
            if (letterMatch) {
                letters = letterMatch[0];
                val = val.substring(letters.length);
            } else {
                val = "";
            }
        } else if (city.length < 2) {
            val = "";
        }

        // 3. SON RAKAM GRUBU
        if (letters.length > 0 && val.length > 0) {
            let numberMatch = val.match(/^\d+/);
            if (numberMatch) {
                numbers = numberMatch[0];
                let maxNumbers = (letters.length === 3) ? 3 : 4;
                if (numbers.length > maxNumbers) {
                    numbers = numbers.substring(0, maxNumbers);
                }
            }
        }

        let formatted = city;
        if (letters.length > 0) formatted += " " + letters;
        if (numbers.length > 0) formatted += " " + numbers;

        setData('plaka', formatted);
    };

    // --- MARKA SEÇİMİ ---
    const handleBrandSelect = (brand) => {
        setIsBrandDropdownOpen(false);
        setBrandSearch('');

        if (brand === 'diger') {
            setIsCustomBrand(true);
            setIsCustomModel(true);
            setIsCustomMotor(true);
            setData(prev => ({ ...prev, marka: '', model: '', motor: '' }));
            setAvailableModels([]);
            setAvailableMotors([]);
            setYearLimits({ min: 1950, max: new Date().getFullYear() + 1, placeholder: 'Örn: 2020' });
        } else {
            setIsCustomBrand(false);
            setIsCustomModel(false);
            setIsCustomMotor(false);
            setData(prev => ({ ...prev, marka: brand.ad, model: '', motor: '' }));
            
            const models = CAR_CATALOG[brand.ad] ? Object.keys(CAR_CATALOG[brand.ad]) : [];
            setAvailableModels(models);
            setAvailableMotors([]);
            setYearLimits({ min: 1950, max: new Date().getFullYear() + 1, placeholder: 'Örn: 2020' });
        }
    };

    // --- MODEL SEÇİMİ & AKILLI YIL AYARI ---
    const handleModelSelect = (model) => {
        setIsModelDropdownOpen(false);

        if (model === 'diger') {
            setIsCustomModel(true);
            setIsCustomMotor(true);
            setData(prev => ({ ...prev, model: '', motor: '' }));
            setAvailableMotors([]);
            setYearLimits({ min: 1950, max: new Date().getFullYear() + 1, placeholder: 'Örn: 2020' });
        } else {
            setIsCustomModel(false);
            setIsCustomMotor(false);
            setData(prev => ({ ...prev, model: model, motor: '' }));

            // Akıllı Yıl Tespiti (Örn: "Megane IV (2016-2022)" -> min: 2016, max: 2022)
            const currentYear = new Date().getFullYear();
            const match = model.match(/\((\d{4})(?:-(\d{4})?)?\)/);
            if (match) {
                const startY = parseInt(match[1], 10);
                const endY = match[2] ? parseInt(match[2], 10) : currentYear;
                setYearLimits({
                    min: startY,
                    max: endY,
                    placeholder: `${startY} - ${endY} arası`
                });
                setData(prev => ({ ...prev, yil: '' }));
            } else {
                setYearLimits({ min: 1950, max: currentYear + 1, placeholder: 'Örn: 2020' });
            }

            // Motorları Getir
            const motors = (CAR_CATALOG[data.marka] && CAR_CATALOG[data.marka][model])
                ? CAR_CATALOG[data.marka][model]
                : [];
            setAvailableMotors(motors);
        }
    };

    // --- MOTOR SEÇİMİ ---
    const handleMotorSelect = (motor) => {
        setIsMotorDropdownOpen(false);
        if (motor === 'diger') {
            setIsCustomMotor(true);
            setData(prev => ({ ...prev, motor: '' }));
        } else {
            setIsCustomMotor(false);
            setData(prev => ({ ...prev, motor: motor }));
        }
    };

    // --- AKILLI TÜVTÜRK MUAYENE HESAPLAYICI ---
    const calculateSmartMuayene = (yearStr, licenseType) => {
        const yearNum = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();
        const ruhsat = RUHSAT_TIPLERI.find(r => r.id === licenseType) || RUHSAT_TIPLERI[0];

        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');

        if (yearNum && yearNum >= currentYear) {
            // Sıfır km araç kuralı (Örn: 2026 model otomobilde 3 yıl muafiyet -> 2029)
            const targetYear = yearNum + ruhsat.newCarFreeYears;
            return `${targetYear}-${mm}-${dd}`;
        }
        return '';
    };

    // --- MODEL YILI GİRİŞ KONTROLÜ ---
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

    const applyQuickMuayeneYears = (yearsToAdd) => {
        const today = new Date();
        const targetYear = today.getFullYear() + yearsToAdd;
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setData('muayene_bitis', `${targetYear}-${mm}-${dd}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/vehicles');
    };

    const filteredBrands = BRANDS_LIST.filter(b => 
        b.ad.toLowerCase().includes(brandSearch.toLowerCase())
    );

    return (
        <AppLayout title="Yeni Araç Ekle">
            <Head title="Yeni Araç Ekle - SmartGaraj" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/vehicles"
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Yeni Araç Kaydı</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Garajınıza yeni bir araç tanımlayın ve takip etmeye başlayın.</p>
                        </div>
                    </div>
                </div>

                {/* AI OCR BANNER */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="flex items-center space-x-3.5 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-extrabold text-white">Ruhsatınız Yanınızda mı?</div>
                            <div className="text-xs text-slate-300 mt-0.5">
                                Fotoğrafını yükleyin; plaka, marka, model, şasi ve muayene bilgileri saniyeler içinde otomatik dolsun!
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOcrOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white font-black text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/25 transition-all shrink-0 cursor-pointer active:scale-95"
                    >
                        <Scan className="w-4 h-4" />
                        <span>🧠 Vision AI ile Ruhsatı Tara</span>
                    </button>
                </div>

                {/* Form Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#13151b] border border-white/[0.08] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* VEHICLE PHOTO UPLOAD DROPZONE */}
                        <div className="p-4 rounded-2xl bg-[#181b24] border border-white/10 space-y-3">
                            <label className="block text-xs font-bold text-slate-300 flex items-center space-x-2">
                                <ImageIcon className="w-4 h-4 text-amber-400" />
                                <span>Araç Fotoğrafı (Opsiyonel)</span>
                            </label>

                            {!photoPreview ? (
                                <label className="border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04] group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-white">Aracın Fotoğrafını Yükleyin veya Çekin</span>
                                    <span className="text-[10px] text-slate-500 mt-0.5">Garaj kartında ve PDF servis pasaportunda gösterilir</span>
                                </label>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-48 bg-black flex items-center justify-center group">
                                    <img src={photoPreview} alt="Araç Önizleme" className="max-h-48 w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setData('fotograf', null); setPhotoPreview(null); }}
                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-500 transition-colors"
                                        title="Fotoğrafı Kaldır"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* SECTION 1: TEMEL BİLGİLER */}
                        <div>
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                                <Car className="w-4 h-4" />
                                <span>1. Temel Araç Bilgileri</span>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                {/* 1. PLAKA (TR Standart Mask) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Plaka <span className="text-amber-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={data.plaka}
                                            onChange={handlePlateChange}
                                            placeholder="34 ABC 123"
                                            maxLength={11}
                                            className="w-full uppercase font-mono font-black tracking-wider bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <span className="text-[11px] text-slate-500 mt-1 block">Format: 01-81 İl Kodu + Harf + Rakam</span>
                                    {errors.plaka && <p className="text-red-400 text-xs mt-1">{errors.plaka}</p>}
                                </div>

                                {/* 2. MARKA (İnteraktif Logo Dropdown) */}
                                <div ref={brandDropdownRef} className="relative">
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Marka <span className="text-amber-400">*</span>
                                    </label>
                                    
                                    {!isCustomBrand ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-left text-white flex items-center justify-between hover:border-amber-500/50 transition-all"
                                            >
                                                {data.marka ? (
                                                    <div className="flex items-center space-x-2.5">
                                                        <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0">
                                                            <img
                                                                src={`https://www.google.com/s2/favicons?domain=${BRANDS_LIST.find(b => b.ad === data.marka)?.domain || 'auto.com'}&sz=64`}
                                                                alt={data.marka}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        </div>
                                                        <span className="font-bold text-white">{data.marka}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">Marka Seçiniz...</span>
                                                )}
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            </button>

                                            {isBrandDropdownOpen && (
                                                <div className="absolute left-0 right-0 top-full mt-1 bg-[#161821] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-72 flex flex-col">
                                                    {/* Search Input */}
                                                    <div className="p-2 border-b border-white/10 bg-[#12141c]">
                                                        <div className="relative">
                                                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                                            <input
                                                                type="text"
                                                                value={brandSearch}
                                                                onChange={(e) => setBrandSearch(e.target.value)}
                                                                placeholder="Marka ara... (Örn: Renault, Fiat, BMW)"
                                                                className="w-full bg-[#1e212c] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Brands List with Logos */}
                                                    <div className="overflow-y-auto p-1.5 space-y-1">
                                                        {filteredBrands.map((brand) => (
                                                            <button
                                                                key={brand.ad}
                                                                type="button"
                                                                onClick={() => handleBrandSelect(brand)}
                                                                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-amber-500 hover:text-black flex items-center space-x-3 transition-colors group"
                                                            >
                                                                <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center shrink-0 shadow-sm">
                                                                    <img
                                                                        src={`https://www.google.com/s2/favicons?domain=${brand.domain}&sz=64`}
                                                                        alt={brand.ad}
                                                                        className="w-full h-full object-contain"
                                                                        loading="lazy"
                                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                                    />
                                                                </div>
                                                                <span className="group-hover:font-bold">{brand.ad}</span>
                                                            </button>
                                                        ))}

                                                        <div className="border-t border-white/10 my-1" />

                                                        <button
                                                            type="button"
                                                            onClick={() => handleBrandSelect('diger')}
                                                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black flex items-center space-x-2 transition-colors"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                            <span>Diğer (Manuel Giriş)</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={data.marka}
                                                onChange={(e) => setData('marka', e.target.value)}
                                                placeholder="Marka adını yazın..."
                                                className="w-full bg-[#1a1d27] border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                                                required
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsCustomBrand(false)}
                                                className="px-3 py-2 text-xs text-slate-400 hover:text-white border border-white/10 rounded-xl bg-white/[0.03]"
                                            >
                                                Listeden Seç
                                            </button>
                                        </div>
                                    )}
                                    {errors.marka && <p className="text-red-400 text-xs mt-1">{errors.marka}</p>}
                                </div>

                                {/* 3. MODEL (Dinamik Liste & Manuel Giriş) */}
                                <div ref={modelDropdownRef} className="relative">
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Model <span className="text-amber-400">*</span>
                                    </label>

                                    {!isCustomModel && availableModels.length > 0 ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-left text-white flex items-center justify-between hover:border-amber-500/50 transition-all"
                                            >
                                                <span className={data.model ? 'font-bold text-white' : 'text-slate-400'}>
                                                    {data.model || 'Model Seçiniz...'}
                                                </span>
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            </button>

                                            {isModelDropdownOpen && (
                                                <div className="absolute left-0 right-0 top-full mt-1 bg-[#161821] border border-white/15 rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto p-1.5 space-y-1">
                                                    {availableModels.map((m) => (
                                                        <button
                                                            key={m}
                                                            type="button"
                                                            onClick={() => handleModelSelect(m)}
                                                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-amber-500 hover:text-black transition-colors"
                                                        >
                                                            {m}
                                                        </button>
                                                    ))}

                                                    <div className="border-t border-white/10 my-1" />

                                                    <button
                                                        type="button"
                                                        onClick={() => handleModelSelect('diger')}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black flex items-center space-x-2 transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        <span>Diğer (Manuel Model Yaz)</span>
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={data.model}
                                                onChange={(e) => setData('model', e.target.value)}
                                                placeholder="Örn: Megane IV, Corolla, Civic"
                                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                                required
                                            />
                                            {availableModels.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCustomModel(false)}
                                                    className="px-3 py-2 text-xs text-slate-400 hover:text-white border border-white/10 rounded-xl bg-white/[0.03]"
                                                >
                                                    Listeden Seç
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model}</p>}
                                </div>

                                {/* 4. MOTOR / YAKIT (Dinamik Liste & Manuel Giriş) */}
                                <div ref={motorDropdownRef} className="relative">
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Motor / Paket
                                    </label>

                                    {!isCustomMotor && availableMotors.length > 0 ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setIsMotorDropdownOpen(!isMotorDropdownOpen)}
                                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-left text-white flex items-center justify-between hover:border-amber-500/50 transition-all"
                                            >
                                                <span className={data.motor ? 'font-bold text-white' : 'text-slate-400'}>
                                                    {data.motor || 'Motor Seçiniz...'}
                                                </span>
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            </button>

                                            {isMotorDropdownOpen && (
                                                <div className="absolute left-0 right-0 top-full mt-1 bg-[#161821] border border-white/15 rounded-2xl shadow-2xl z-30 max-h-60 overflow-y-auto p-1.5 space-y-1">
                                                    {availableMotors.map((mot) => (
                                                        <button
                                                            key={mot}
                                                            type="button"
                                                            onClick={() => handleMotorSelect(mot)}
                                                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-amber-500 hover:text-black transition-colors"
                                                        >
                                                            {mot}
                                                        </button>
                                                    ))}

                                                    <div className="border-t border-white/10 my-1" />

                                                    <button
                                                        type="button"
                                                        onClick={() => handleMotorSelect('diger')}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black flex items-center space-x-2 transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                        <span>Diğer (Manuel Motor Yaz)</span>
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={data.motor}
                                                onChange={(e) => setData('motor', e.target.value)}
                                                placeholder="Örn: 1.5 Blue dCi (115 bg)"
                                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                            />
                                            {availableMotors.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCustomMotor(false)}
                                                    className="px-3 py-2 text-xs text-slate-400 hover:text-white border border-white/10 rounded-xl bg-white/[0.03]"
                                                >
                                                    Listeden Seç
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 5. MODEL YILI (Kısıtlı & 4 Basamaklı) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Model Yılı
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={data.yil}
                                        onChange={handleYearChange}
                                        placeholder={yearLimits.placeholder}
                                        maxLength={4}
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500 transition-all"
                                    />
                                    <span className="text-[11px] text-slate-500 mt-1 block">
                                        Geçerli aralık: {yearLimits.min} - {yearLimits.max}
                                    </span>
                                    {errors.yil && <p className="text-red-400 text-xs mt-1">{errors.yil}</p>}
                                </div>

                                {/* 6. GÜNCEL KİLOMETRE */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Güncel Kilometre (KM)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="2000000"
                                        value={data.guncel_km}
                                        onChange={(e) => setData('guncel_km', e.target.value)}
                                        placeholder="Örn: 95000"
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500 transition-all"
                                    />
                                    {errors.guncel_km && <p className="text-red-400 text-xs mt-1">{errors.guncel_km}</p>}
                                </div>

                                {/* 7. RUHSAT TİPİ / TAŞIT CİNSİ (TÜVTÜRK HESAPLAYICI) */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                                        <span className="flex items-center space-x-1.5">
                                            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Ruhsat Tipi & Kullanım Cinsi <span className="text-amber-400">*</span></span>
                                        </span>
                                        <span className="text-[11px] text-amber-400 font-semibold">
                                            💡 {RUHSAT_TIPLERI.find(r => r.id === data.ruhsat_tipi)?.desc}
                                        </span>
                                    </label>
                                    <select
                                        value={data.ruhsat_tipi}
                                        onChange={(e) => handleRuhsatChange(e.target.value)}
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all font-semibold cursor-pointer"
                                        required
                                    >
                                        {RUHSAT_TIPLERI.map((r) => (
                                            <option key={r.id} value={r.id} className="bg-[#13151b] text-white">
                                                {r.label} — ({r.desc})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: YASAL SÜREÇLER & SİGORTA */}
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>2. Yasal Süreç & Sigorta Bitiş Tarihleri</span>
                                </h4>
                                {parseInt(data.yil) >= new Date().getFullYear() && (
                                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Sıfır Araç: 3 Yıl TÜVTÜRK Muafiyeti Uygulandı</span>
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* 8. ŞASİ NUMARASI (VIN) */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Şasi Numarası (VIN) <span className="text-slate-500 font-normal">(17 Haneli - Opsiyonel)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sasi_no}
                                        onChange={(e) => setData('sasi_no', e.target.value.toUpperCase())}
                                        placeholder="Örn: WBA3A5C50DF819283"
                                        maxLength={17}
                                        className="w-full uppercase font-mono bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all tracking-wider"
                                    />
                                    {errors.sasi_no && <p className="text-red-400 text-xs mt-1">{errors.sasi_no}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: MUAYENE & SİGORTA & KASKO */}
                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>2. Yasal Vadeler & Poliçeler</span>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                                <div>
                                    <div className="h-7 flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">TÜVTÜRK Muayene Bitiş</label>
                                    </div>
                                    <input
                                        type="date"
                                        value={data.muayene_bitis}
                                        onChange={(e) => setData('muayene_bitis', e.target.value)}
                                        className="w-full h-10 bg-[#1a1d27] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-all"
                                    />
                                    
                                    {/* Hızlı Yıl Ekleme Butonları */}
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        <button
                                            type="button"
                                            onClick={() => applyQuickMuayeneYears(3)}
                                            className="px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500 hover:text-white border border-blue-500/20 text-[10px] font-bold text-blue-400 transition-all"
                                        >
                                            +3 Yıl (Sıfır)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => applyQuickMuayeneYears(2)}
                                            className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-slate-300 transition-all"
                                        >
                                            +2 Yıl
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => applyQuickMuayeneYears(1)}
                                            className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-slate-300 transition-all"
                                        >
                                            +1 Yıl (Ticari)
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className="h-7 flex items-center mb-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">Trafik Sigortası</label>
                                    </div>
                                    <input
                                        type="date"
                                        value={data.sigorta_bitis}
                                        onChange={(e) => setData('sigorta_bitis', e.target.value)}
                                        className="w-full h-10 bg-[#1a1d27] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <div className="h-7 flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold text-slate-300">Kasko Poliçesi</label>
                                        <div className="flex rounded-lg p-0.5 bg-[#1a1d27] border border-white/10 text-[11px] shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => handleKaskoToggle(false)}
                                                className={`px-3 py-0.5 rounded-md font-extrabold cursor-pointer transition-all duration-150 ${
                                                    !hasKasko 
                                                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-[1.03]' 
                                                        : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 active:scale-95'
                                                }`}
                                            >
                                                Yok
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleKaskoToggle(true)}
                                                className={`px-3 py-0.5 rounded-md font-extrabold cursor-pointer transition-all duration-150 ${
                                                    hasKasko 
                                                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25 scale-[1.03]' 
                                                        : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/15 active:scale-95'
                                                }`}
                                            >
                                                Var
                                            </button>
                                        </div>
                                    </div>

                                    {hasKasko ? (
                                        <input
                                            type="date"
                                            value={data.kasko_bitis}
                                            onChange={(e) => setData('kasko_bitis', e.target.value)}
                                            className="w-full h-10 bg-[#1a1d27] border border-blue-500/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    ) : (
                                        <div className="w-full h-10 bg-white/[0.02] border border-dashed border-white/10 rounded-xl px-3 py-2 text-xs text-slate-500 flex items-center justify-between">
                                            <span>Kasko poliçesi yok</span>
                                            <Shield className="w-3.5 h-3.5 text-slate-600" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: NOTLAR */}
                        <div className="pt-4 border-t border-white/10">
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Özel Notlar</label>
                            <textarea
                                value={data.notlar}
                                onChange={(e) => setData('notlar', e.target.value)}
                                rows="3"
                                placeholder="Araçla ilgili hatırlatıcı veya özel detaylar..."
                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                            />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
                            <Link
                                href="/vehicles"
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
                                <span>{processing ? 'Kaydediliyor...' : 'Aracı Garaja Ekle'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* AI Vision OCR Modal */}
            <OcrModal
                isOpen={isOcrOpen}
                onClose={() => setIsOcrOpen(false)}
                type="ruhsat"
                onDataExtracted={handleOcrExtracted}
            />
        </AppLayout>
    );
}
