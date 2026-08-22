import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CustomSelect from './CustomSelect';
import { FLEET_STATUS_OPTIONS, OWNERSHIP_OPTIONS, CORPORATE_DEPARTMENTS } from '@/constants/fleet';
import { 
    X, 
    Car, 
    Calendar, 
    Gauge, 
    Shield, 
    FileText, 
    Camera, 
    CheckCircle2, 
    AlertCircle,
    Hash,
    Layers,
    Fuel,
    Cog,
    Sparkles,
    Building2,
    UserCheck,
    Briefcase
} from 'lucide-react';

export default function EditVehicleModal({ isOpen, onClose, vehicle }) {
    if (!isOpen || !vehicle) return null;

    const { auth } = usePage().props || {};
    const isFleet = auth?.user?.rol === 'filo' || vehicle.durum !== undefined;

    const { data, setData, post, processing, errors, reset } = useForm({
        plaka: vehicle.plaka || '',
        marka: vehicle.marka || '',
        model: vehicle.model || '',
        yil: vehicle.yil || '',
        guncel_km: vehicle.guncel_km || '',
        motor: vehicle.motor || '',
        ruhsat_tipi: vehicle.ruhsat_tipi || 'Otomobil (Hususi)',
        vites_turu: vehicle.vites_turu || 'Manuel',
        yakit_turu: vehicle.yakit_turu || 'Dizel',
        muayene_bitis: vehicle.muayene_bitis ? vehicle.muayene_bitis.split('T')[0] : '',
        sigorta_bitis: vehicle.sigorta_bitis ? vehicle.sigorta_bitis.split('T')[0] : '',
        kasko_bitis: vehicle.kasko_bitis ? vehicle.kasko_bitis.split('T')[0] : '',
        sasi_no: vehicle.sasi_no || '',
        notlar: vehicle.notlar || '',
        durum: vehicle.durum || 'aktif',
        zimmet_surucu_adi: vehicle.zimmet_surucu_adi || '',
        departman: vehicle.departman || '',
        sozlesme_turu: vehicle.sozlesme_turu || '',
        fotograf: null,
    });

    const [previewUrl, setPreviewUrl] = useState(vehicle.fotograf_url || null);

    useEffect(() => {
        if (vehicle) {
            setData({
                plaka: vehicle.plaka || '',
                marka: vehicle.marka || '',
                model: vehicle.model || '',
                yil: vehicle.yil || '',
                guncel_km: vehicle.guncel_km || '',
                motor: vehicle.motor || '',
                ruhsat_tipi: vehicle.ruhsat_tipi || 'Otomobil (Hususi)',
                vites_turu: vehicle.vites_turu || 'Manuel',
                yakit_turu: vehicle.yakit_turu || 'Dizel',
                muayene_bitis: vehicle.muayene_bitis ? vehicle.muayene_bitis.split('T')[0] : '',
                sigorta_bitis: vehicle.sigorta_bitis ? vehicle.sigorta_bitis.split('T')[0] : '',
                kasko_bitis: vehicle.kasko_bitis ? vehicle.kasko_bitis.split('T')[0] : '',
                sasi_no: vehicle.sasi_no || '',
                notlar: vehicle.notlar || '',
                durum: vehicle.durum || 'aktif',
                zimmet_surucu_adi: vehicle.zimmet_surucu_adi || '',
                departman: vehicle.departman || '',
                sozlesme_turu: vehicle.sozlesme_turu || '',
                fotograf: null,
            });
            setPreviewUrl(vehicle.fotograf_url || null);
        }
    }, [vehicle]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('fotograf', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/vehicles/${vehicle.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
                            <Car className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>Araç Bilgilerini Düzenle</span>
                                <span className="badge-plate text-xs">{vehicle.plaka}</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {vehicle.marka} {vehicle.model} detaylarını ve teknik özelliklerini güncelleyin
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                    {/* Error Alerts */}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs space-y-1">
                            <div className="font-bold flex items-center space-x-1.5">
                                <AlertCircle className="w-4 h-4" />
                                <span>Lütfen formdaki hataları kontrol edin:</span>
                            </div>
                            <ul className="list-disc list-inside pl-1 space-y-0.5">
                                {Object.entries(errors).map(([field, err]) => (
                                    <li key={field}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Section 1: Temel Bilgiler */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                            <Car className="w-3.5 h-3.5 text-amber-500" />
                            <span>1. Temel Tanımlama & Plaka</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Plaka <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.plaka}
                                    onChange={(e) => setData('plaka', e.target.value.toUpperCase())}
                                    required
                                    placeholder="34 ABC 123"
                                    className="w-full font-mono uppercase font-bold text-sm px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Marka <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.marka}
                                    onChange={(e) => setData('marka', e.target.value)}
                                    required
                                    placeholder="Örn: Volkswagen, Renault"
                                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Model <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    required
                                    placeholder="Örn: Touran, Megane, Passat"
                                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Model Yılı
                                </label>
                                <input
                                    type="number"
                                    value={data.yil}
                                    onChange={(e) => setData('yil', e.target.value)}
                                    placeholder="2020"
                                    min="1950"
                                    max="2035"
                                    className="w-full font-mono text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                                    <span>Güncel Kilometre (KM)</span>
                                </label>
                                <div className="relative">
                                    <Gauge className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                    <input
                                        type="number"
                                        value={data.guncel_km}
                                        onChange={(e) => setData('guncel_km', e.target.value)}
                                        placeholder="150000"
                                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Motor & Güç
                                </label>
                                <input
                                    type="text"
                                    value={data.motor}
                                    onChange={(e) => setData('motor', e.target.value)}
                                    placeholder="1.6 TDI (115 HP)"
                                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Donanım & Ruhsat Tipi */}
                    <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-500" />
                            <span>2. Tip & Donanım Detayları</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Ruhsat Cinsi
                                </label>
                                <select
                                    value={data.ruhsat_tipi}
                                    onChange={(e) => setData('ruhsat_tipi', e.target.value)}
                                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                                >
                                    <option value="Otomobil (Hususi)">Otomobil (Hususi)</option>
                                    <option value="Otomobil (Ticari)">Otomobil (Ticari)</option>
                                    <option value="Kamyonet (Kapalı Kasa)">Kamyonet (Kapalı Kasa)</option>
                                    <option value="Panelvan">Panelvan</option>
                                    <option value="Minibüs">Minibüs</option>
                                    <option value="Motosiklet">Motosiklet</option>
                                    <option value="Çekici / Tır">Çekici / Tır</option>
                                    <option value="Diğer">Diğer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Yakıt Türü
                                </label>
                                <select
                                    value={data.yakit_turu}
                                    onChange={(e) => setData('yakit_turu', e.target.value)}
                                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                                >
                                    <option value="Dizel">Dizel</option>
                                    <option value="Benzin">Benzin</option>
                                    <option value="Benzin & LPG">Benzin & LPG</option>
                                    <option value="Hibrit (Mild / Plug-in)">Hibrit (Mild / Plug-in)</option>
                                    <option value="Tam Elektrikli (EV)">Tam Elektrikli (EV)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Vites Türü
                                </label>
                                <select
                                    value={data.vites_turu}
                                    onChange={(e) => setData('vites_turu', e.target.value)}
                                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                                >
                                    <option value="Manuel">Manuel</option>
                                    <option value="Otomatik">Otomatik</option>
                                    <option value="Yarı Otomatik">Yarı Otomatik</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Şasi No (VIN)
                            </label>
                            <input
                                type="text"
                                value={data.sasi_no}
                                onChange={(e) => setData('sasi_no', e.target.value.toUpperCase())}
                                placeholder="17 Haneli Şasi Numarası (WBA... / VF1...)"
                                className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none uppercase"
                            />
                        </div>
                    </div>

                    {/* Section 3: Resmi Tarihler & Sigorta */}
                    <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                            <Shield className="w-3.5 h-3.5 text-emerald-500" />
                            <span>3. Resmi Tarihler & Sigortalar</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    TÜVTÜRK Muayene Bitiş
                                </label>
                                <input
                                    type="date"
                                    value={data.muayene_bitis}
                                    onChange={(e) => setData('muayene_bitis', e.target.value)}
                                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Trafik Sigortası Bitiş
                                </label>
                                <input
                                    type="date"
                                    value={data.sigorta_bitis}
                                    onChange={(e) => setData('sigorta_bitis', e.target.value)}
                                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Kasko Poliçe Bitiş
                                </label>
                                <input
                                    type="date"
                                    value={data.kasko_bitis}
                                    onChange={(e) => setData('kasko_bitis', e.target.value)}
                                    className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Araç Fotoğrafı */}
                    <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                            <Camera className="w-3.5 h-3.5 text-purple-500" />
                            <span>4. Araç Fotoğrafı</span>
                        </h4>

                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Araç Önizleme"
                                    className="w-28 h-20 object-cover rounded-xl border border-slate-200 dark:border-white/10 shadow-sm shrink-0"
                                />
                            ) : (
                                <div className="w-28 h-20 rounded-xl bg-slate-200 dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                    <Car className="w-8 h-8 opacity-40" />
                                </div>
                            )}

                            <div className="flex-1 space-y-1 text-center sm:text-left">
                                <label className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-sm">
                                    <Camera className="w-4 h-4" />
                                    <span>{previewUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Seç'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-[11px] text-slate-400">
                                    JPG, PNG veya WEBP formatında maksimum 10MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Kurumsal Filo & Zimmet (Sadece Filo Araçlarında) */}
                    {isFleet && (
                        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                            <h4 className="text-xs font-black uppercase tracking-wider text-blue-500 flex items-center space-x-1.5">
                                <Building2 className="w-3.5 h-3.5" />
                                <span>5. Filo, Zimmet & Departman</span>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Filo Durumu
                                    </label>
                                    <CustomSelect
                                        options={FLEET_STATUS_OPTIONS}
                                        value={data.durum}
                                        onChange={(val) => setData('durum', val)}
                                        placeholder="Filo Durumu Seçiniz..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Mülkiyet / Sözleşme Türü
                                    </label>
                                    <CustomSelect
                                        options={OWNERSHIP_OPTIONS}
                                        value={data.sozlesme_turu}
                                        onChange={(val) => setData('sozlesme_turu', val)}
                                        placeholder="Mülkiyet Türü Seçiniz..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Zimmetli Sürücü / Personel</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.zimmet_surucu_adi}
                                        onChange={(e) => setData('zimmet_surucu_adi', e.target.value)}
                                        placeholder="Örn: Ahmet Yılmaz"
                                        className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>Departman / Saha Birimi</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.departman}
                                        onChange={(e) => setData('departman', e.target.value)}
                                        placeholder="Örn: Saha Satış & Pazarlama"
                                        className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Quick Corporate Department Tags */}
                            <div className="pt-1">
                                <span className="block text-[11px] font-bold text-slate-400 mb-1.5">
                                    Hızlı Departman Seçimi:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {CORPORATE_DEPARTMENTS.slice(0, 8).map(d => (
                                        <button
                                            key={d.name}
                                            type="button"
                                            onClick={() => setData('departman', d.name)}
                                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                                                data.departman === d.name
                                                    ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                                            }`}
                                        >
                                            <span className="mr-1">{d.icon}</span>
                                            <span>{d.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 6: Notlar */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Özel Notlar & Hatırlatmalar
                        </label>
                        <textarea
                            value={data.notlar}
                            onChange={(e) => setData('notlar', e.target.value)}
                            rows={3}
                            placeholder="Araçla ilgili özel notlar, yedek anahtar yeri, kışlık lastik durumu vb."
                            className="w-full text-xs font-medium p-3 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{processing ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
