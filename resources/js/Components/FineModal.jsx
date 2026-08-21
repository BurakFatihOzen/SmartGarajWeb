import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, AlertTriangle, Car, User, Calendar, ShieldAlert, CheckCircle2, Upload, FileText, DollarSign } from 'lucide-react';

const FINE_PRESETS = [
    { code: '51/2-a', title: 'Hız sınırını %10 - %30 aşmak', amount: 1506 },
    { code: '51/2-b', title: 'Hız sınırını %30 - %50 aşmak', amount: 3135 },
    { code: '51/2-c', title: 'Hız sınırını %50 üzerinde aşmak', amount: 6439 },
    { code: '47/1-b', title: 'Kırmızı ışık kuralına uymamak', amount: 1506 },
    { code: '73/c', title: 'Seyir halinde cep telefonu kullanmak', amount: 1506 },
    { code: '78/1-a', title: 'Emniyet kemeri takmamak', amount: 690 },
    { code: '61/1-o', title: 'Yasak yere park etmek / Duraklama', amount: 690 },
    { code: '48/5', title: 'Alkollü araç kullanmak (1. Defa)', amount: 6439 },
    { code: '34/a', title: 'Muayenesiz araçla trafiğe çıkmak', amount: 1506 },
    { code: 'DİĞER', title: 'Diğer / Özel Trafik Maddesi', amount: 0 },
];

export default function FineModal({ isOpen, onClose, vehicles = [], drivers = [], preselectedVehicle = null }) {
    if (!isOpen) return null;

    const [selectedPreset, setSelectedPreset] = useState(FINE_PRESETS[0].code);

    const { data, setData, post, processing, errors, reset } = useForm({
        arac_id: preselectedVehicle?.id || (vehicles[0]?.id || ''),
        surucu_id: '',
        ceza_tarihi: new Date().toISOString().split('T')[0],
        ceza_maddesi: `${FINE_PRESETS[0].code} — ${FINE_PRESETS[0].title}`,
        tutar: FINE_PRESETS[0].amount,
        durum: 'odenmedi',
        odeme_tarihi: '',
        aciklama: '',
        tutanak: null,
    });

    const handlePresetChange = (code) => {
        setSelectedPreset(code);
        const preset = FINE_PRESETS.find(p => p.code === code);
        if (preset) {
            if (code === 'DİĞER') {
                setData(prev => ({
                    ...prev,
                    ceza_maddesi: 'Özel Ceza Maddesi',
                    tutar: '',
                }));
            } else {
                setData(prev => ({
                    ...prev,
                    ceza_maddesi: `${preset.code} — ${preset.title}`,
                    tutar: preset.amount,
                }));
            }
        }
    };

    const discountedAmount = data.tutar ? roundToTwo(parseFloat(data.tutar) * 0.75) : 0;

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-red-500/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-black">
                            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                Trafik Cezası Kaydı Ekle
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold">
                                Ceza tutarı, indirim vadesi ve tutanak takibi
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Vehicle Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <Car className="w-3.5 h-3.5 text-amber-500" />
                            <span>Ceza Yiyen Araç *</span>
                        </label>
                        <select
                            value={data.arac_id}
                            onChange={(e) => setData('arac_id', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
                            required
                        >
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.plaka} — {v.marka} {v.model}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Driver Selection (Optional) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5 text-blue-500" />
                            <span>İhlal Yapan Sürücü / Personel (Opsiyonel)</span>
                        </label>
                        <select
                            value={data.surucu_id}
                            onChange={(e) => setData('surucu_id', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                        >
                            <option value="">-- Plakaya Yazılan / Sürücü Belirtilmedi --</option>
                            {drivers.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.ad_soyad} ({d.departman || 'Genel'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Violation Template Preset */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Trafik Ceza Maddesi Şablonu
                        </label>
                        <select
                            value={selectedPreset}
                            onChange={(e) => handlePresetChange(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
                        >
                            {FINE_PRESETS.map(p => (
                                <option key={p.code} value={p.code}>
                                    [{p.code}] {p.title} {p.amount > 0 ? `(₺${p.amount.toLocaleString('tr-TR')})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fine Description text */}
                    <div>
                        <input
                            type="text"
                            value={data.ceza_maddesi}
                            onChange={(e) => setData('ceza_maddesi', e.target.value)}
                            placeholder="Ceza maddesi ve detay..."
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
                                <span>Ceza Tutarı (₺) *</span>
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
                            <select
                                value={data.durum}
                                onChange={(e) => setData('durum', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                            >
                                <option value="odenmedi">❌ Ödenmedi (Bekliyor)</option>
                                <option value="odendi">✅ Ödendi</option>
                                <option value="itiraz_edildi">⚠️ İtiraz Edildi</option>
                            </select>
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
                            <span>Ceza Makbuzu / Tebligat Görseli (Opsiyonel)</span>
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
                            <span>{processing ? 'Kaydediliyor...' : 'Cezayı Kaydet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
