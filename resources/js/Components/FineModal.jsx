import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    X, 
    AlertTriangle, 
    Car, 
    User, 
    Calendar, 
    ShieldAlert, 
    CheckCircle2, 
    Upload, 
    FileText, 
    DollarSign,
    Road,
    Layers,
    Info,
    Clock,
    Check
} from 'lucide-react';
import CustomVehicleSelect from './CustomVehicleSelect';
import CustomSelect from './CustomSelect';

const FINE_PRESETS = [
    { value: '51/2-a', label: '51/2-a — Hız sınırını %10 - %30 aşmak', amount: 1506, badge: '₺1.506' },
    { value: '51/2-b', label: '51/2-b — Hız sınırını %30 - %50 aşmak', amount: 3135, badge: '₺3.135' },
    { value: '51/2-c', label: '51/2-c — Hız sınırını %50 üzerinde aşmak', amount: 6439, badge: '₺6.439' },
    { value: '47/1-b', label: '47/1-b — Kırmızı ışık kuralına uymamak', amount: 1506, badge: '₺1.506' },
    { value: '73/c', label: '73/c — Seyir halinde cep telefonu kullanmak', amount: 1506, badge: '₺1.506' },
    { value: '78/1-a', label: '78/1-a — Emniyet kemeri takmamak', amount: 690, badge: '₺690' },
    { value: '61/1-o', label: '61/1-o — Yasak yere park etmek / Duraklama', amount: 690, badge: '₺690' },
    { value: '48/5', label: '48/5 — Alkollü araç kullanmak (1. Defa)', amount: 6439, badge: '₺6.439' },
    { value: '34/a', label: '34/a — Muayenesiz araçla trafiğe çıkmak', amount: 1506, badge: '₺1.506' },
    { value: 'DIGER', label: 'Diğer / Özel Trafik Ceza Maddesi', amount: 0, badge: 'Serbest' },
];

const HIGHWAY_PRESETS = [
    { value: '15 Temmuz Şehitler Köprüsü (Boğaziçi)', label: '15 Temmuz Şehitler Köprüsü', fee: 33, badge: '₺33' },
    { value: 'Fatih Sultan Mehmet Köprüsü (FSM)', label: 'Fatih Sultan Mehmet Köprüsü (FSM)', fee: 33, badge: '₺33' },
    { value: 'Yavuz Sultan Selim Köprüsü (3. Köprü)', label: 'Yavuz Sultan Selim Köprüsü', fee: 70, badge: '₺70' },
    { value: 'Osmangazi Köprüsü (İzmit Körfez)', label: 'Osmangazi Köprüsü', fee: 555, badge: '₺555' },
    { value: '1915 Çanakkale Köprüsü', label: '1915 Çanakkale Köprüsü', fee: 585, badge: '₺585' },
    { value: 'Avrasya Tüneli', label: 'Avrasya Tüneli (Gündüz/Gece)', fee: 156, badge: '₺156' },
    { value: 'Kuzey Marmara Otoyolu (KMO)', label: 'Kuzey Marmara Otoyolu (KMO)', fee: 180, badge: '₺180' },
    { value: 'Gebze - Orhangazi - İzmir Otoyolu (O-5)', label: 'Gebze - İzmir Otoyolu (O-5)', fee: 420, badge: '₺420' },
    { value: 'Ankara - Niğde Otoyolu (ERG)', label: 'Ankara - Niğde Otoyolu', fee: 260, badge: '₺260' },
    { value: 'KGM Devlet Otoyolu (TEM / Anadolu)', label: 'KGM Devlet Otoyolu (TEM)', fee: 85, badge: '₺85' },
];

const STATUS_OPTIONS = [
    { value: 'odenmedi', label: 'Ödenmedi (Bekliyor)', icon: <Clock className="w-3.5 h-3.5 text-red-500" /> },
    { value: 'odendi', label: 'Ödendi', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
    { value: 'itiraz_edildi', label: 'İtiraz Edildi', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> },
];

export default function FineModal({ isOpen, onClose, vehicles = [], drivers = [], preselectedVehicle = null }) {
    if (!isOpen) return null;

    const [cezaTipi, setCezaTipi] = useState('trafik_cezasi');
    const [selectedPresetCode, setSelectedPresetCode] = useState(FINE_PRESETS[0].value);

    const { data, setData, post, processing, errors, reset } = useForm({
        arac_id: preselectedVehicle?.id || (vehicles[0]?.id || ''),
        surucu_id: '',
        ceza_tipi: 'trafik_cezasi',
        otoyol_kopru: '',
        gecis_ucreti: '',
        ihlal_kat_sayisi: 4,
        hgs_etiket_no: '',
        giris_istasyonu: '',
        cikis_istasyonu: '',
        ceza_tarihi: new Date().toISOString().split('T')[0],
        ceza_maddesi: FINE_PRESETS[0].label,
        tutar: FINE_PRESETS[0].amount,
        durum: 'odenmedi',
        odeme_tarihi: '',
        aciklama: '',
        tutanak: null,
    });

    const handleTypeSwitch = (type) => {
        setCezaTipi(type);
        if (type === 'hgs_ihlal') {
            const defaultHw = HIGHWAY_PRESETS[0];
            setData(prev => ({
                ...prev,
                ceza_tipi: 'hgs_ihlal',
                otoyol_kopru: defaultHw.value,
                gecis_ucreti: defaultHw.fee,
                tutar: defaultHw.fee * 4,
                ceza_maddesi: `HGS İhlali: ${defaultHw.label}`,
            }));
        } else {
            const defaultPreset = FINE_PRESETS[0];
            setData(prev => ({
                ...prev,
                ceza_tipi: 'trafik_cezasi',
                ceza_maddesi: defaultPreset.label,
                tutar: defaultPreset.amount,
            }));
        }
    };

    const handlePresetChange = (code) => {
        setSelectedPresetCode(code);
        const preset = FINE_PRESETS.find(p => p.value === code);
        if (preset) {
            if (code === 'DIGER') {
                setData(prev => ({
                    ...prev,
                    ceza_maddesi: '',
                    tutar: '',
                }));
            } else {
                setData(prev => ({
                    ...prev,
                    ceza_maddesi: preset.label,
                    tutar: preset.amount,
                }));
            }
        }
    };

    const handleHighwayChange = (hwValue) => {
        const hw = HIGHWAY_PRESETS.find(h => h.value === hwValue);
        if (hw) {
            setData(prev => ({
                ...prev,
                otoyol_kopru: hw.value,
                gecis_ucreti: hw.fee,
                tutar: hw.fee * 4,
                ceza_maddesi: `HGS İhlali: ${hw.label}`,
            }));
        }
    };

    const handleGecisUcretiChange = (feeVal) => {
        const fee = parseFloat(feeVal) || 0;
        const totalPenalty = fee * (data.ihlal_kat_sayisi || 4);
        setData(prev => ({
            ...prev,
            gecis_ucreti: feeVal,
            tutar: totalPenalty > 0 ? totalPenalty : prev.tutar
        }));
    };

    const discountedAmount = data.tutar ? +(Math.round((parseFloat(data.tutar) * 0.75) + "e+2") + "e-2") : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/fines', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const driverOptions = [
        { value: '', label: 'Plakaya Kesildi (Sürücü Belirtilmedi)' },
        ...drivers.map(d => ({
            value: d.id,
            label: `${d.ad_soyad} (${d.departman || 'Genel'})`,
            icon: <User className="w-3.5 h-3.5 text-blue-500" />
        }))
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-black">
                            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                Ceza & İhlal Kaydı Ekle
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold">
                                Trafik kuralları veya HGS / OGS kaçak geçiş takibi
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    
                    {/* Modern Pill Switcher (No ugly emojis) */}
                    <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => handleTypeSwitch('trafik_cezasi')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                cezaTipi === 'trafik_cezasi'
                                    ? 'bg-white dark:bg-[#1f2230] text-red-600 dark:text-red-400 shadow-sm border border-slate-200/60 dark:border-white/10'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <ShieldAlert className="w-4 h-4" />
                            <span>Trafik Cezası</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTypeSwitch('hgs_ihlal')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                cezaTipi === 'hgs_ihlal'
                                    ? 'bg-white dark:bg-[#1f2230] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-white/10'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                            }`}
                        >
                            <Road className="w-4 h-4" />
                            <span>HGS / OGS Geçiş İhlali</span>
                        </button>
                    </div>

                    {/* Vehicle Selection with Luxury Badge & Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <Car className="w-3.5 h-3.5 text-amber-500" />
                            <span>İhlal / Ceza Alan Araç *</span>
                        </label>
                        <CustomVehicleSelect
                            vehicles={vehicles}
                            value={data.arac_id}
                            onChange={(vId) => setData('arac_id', vId)}
                        />
                    </div>

                    {/* Driver Selection */}
                    {drivers.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <User className="w-3.5 h-3.5 text-blue-500" />
                                <span>İhlal Yapan Sürücü (Opsiyonel)</span>
                            </label>
                            <CustomSelect
                                options={driverOptions}
                                value={data.surucu_id}
                                onChange={(val) => setData('surucu_id', val)}
                                placeholder="Sürücü seçiniz..."
                            />
                        </div>
                    )}

                    {/* HGS vs Trafik Detayları */}
                    {cezaTipi === 'hgs_ihlal' ? (
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                    <Road className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Geçiş Yapılan Köprü / Otoyol</span>
                                </label>
                                <CustomSelect
                                    options={HIGHWAY_PRESETS}
                                    value={data.otoyol_kopru}
                                    onChange={handleHighwayChange}
                                    placeholder="Otoyol veya köprü seçin..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Asıl Geçiş Ücreti (₺)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.gecis_ucreti}
                                        onChange={(e) => handleGecisUcretiChange(e.target.value)}
                                        placeholder="180.00"
                                        className="w-full font-mono bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        HGS Etiket No (Opsiyonel)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.hgs_etiket_no}
                                        onChange={(e) => setData('hgs_etiket_no', e.target.value)}
                                        placeholder="1029384756"
                                        className="w-full bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-semibold flex items-start gap-1.5">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>15 gün içinde bakiye yüklenirse sadece geçiş bedeli, süre aşılırsa 4 katı idari ceza uygulanır.</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Trafik Ceza Maddesi Şablonu
                            </label>
                            <CustomSelect
                                options={FINE_PRESETS}
                                value={selectedPresetCode}
                                onChange={handlePresetChange}
                                placeholder="Ceza maddesi seçin..."
                            />
                        </div>
                    )}

                    {/* Fine Description / Custom Input */}
                    <div>
                        <input
                            type="text"
                            value={data.ceza_maddesi}
                            onChange={(e) => setData('ceza_maddesi', e.target.value)}
                            placeholder="Ceza maddesi veya ihlal detayı..."
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Fine Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                <span>İhlal / Ceza Tarihi *</span>
                            </label>
                            <input
                                type="date"
                                value={data.ceza_tarihi}
                                onChange={(e) => setData('ceza_tarihi', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                required
                            />
                        </div>

                        {/* Fine Amount */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-red-500" />
                                <span>Toplam Ceza Tutarı (₺) *</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.tutar}
                                onChange={(e) => setData('tutar', e.target.value)}
                                placeholder="1506"
                                className="w-full font-mono bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-black text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* %25 Discount Highlight Box */}
                    {data.tutar > 0 && (
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                💡 %25 Erken Ödeme İndirimli:
                            </span>
                            <span className="font-black font-mono text-sm text-emerald-600 dark:text-emerald-400">
                                ₺{Number(discountedAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    )}

                    {/* Status & Payment Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Ödeme Durumu
                            </label>
                            <CustomSelect
                                options={STATUS_OPTIONS}
                                value={data.durum}
                                onChange={(val) => setData('durum', val)}
                            />
                        </div>

                        {data.durum === 'odendi' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Ödendiği Tarih
                                </label>
                                <input
                                    type="date"
                                    value={data.odeme_tarihi}
                                    onChange={(e) => setData('odeme_tarihi', e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                        )}
                    </div>

                    {/* File Upload (Tutanak) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <Upload className="w-3.5 h-3.5 text-blue-500" />
                            <span>Ceza Makbuzu / İhlal Tebligatı (Opsiyonel)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setData('tutanak', e.target.files[0])}
                            className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 dark:file:bg-white/[0.06] file:text-slate-700 dark:file:text-slate-200 hover:file:bg-amber-500/20 cursor-pointer"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/25 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{processing ? 'Kaydediliyor...' : 'Kaydet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
