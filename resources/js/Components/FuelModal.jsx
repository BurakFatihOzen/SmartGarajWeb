import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Fuel, Car, User, Calendar, Gauge, DollarSign, Upload, CheckCircle2 } from 'lucide-react';

const STATIONS = ['Opet', 'Shell', 'Petrol Ofisi', 'BP', 'TotalEnergies', 'Aytemiz', 'TP (Türkiye Petrolleri)', 'Diğer'];

export default function FuelModal({ isOpen, onClose, vehicles = [], drivers = [], preselectedVehicle = null }) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        arac_id: preselectedVehicle?.id || (vehicles[0]?.id || ''),
        surucu_id: '',
        tarih: new Date().toISOString().split('T')[0],
        km: preselectedVehicle?.guncel_km || '',
        litre: '',
        birim_fiyat: '',
        toplam_tutar: '',
        yakit_turu: preselectedVehicle?.yakit_turu || 'Benzin',
        istasyon: 'Opet',
        tam_depo_mu: true,
        notlar: '',
        fis: null,
    });

    const handleLitreChange = (val) => {
        const l = parseFloat(val) || 0;
        setData(prev => {
            const tot = parseFloat(prev.toplam_tutar) || 0;
            const unit = l > 0 && tot > 0 ? (tot / l).toFixed(2) : prev.birim_fiyat;
            return { ...prev, litre: val, birim_fiyat: unit };
        });
    };

    const handleTotalChange = (val) => {
        const tot = parseFloat(val) || 0;
        setData(prev => {
            const l = parseFloat(prev.litre) || 0;
            const unit = l > 0 && tot > 0 ? (tot / l).toFixed(2) : prev.birim_fiyat;
            return { ...prev, toplam_tutar: val, birim_fiyat: unit };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/fuel', {
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
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-emerald-500/5">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">
                            <Fuel className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                Yakıt Alım Fişi Ekle
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold">
                                Tüketim maliyeti ve litre hesabı
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Vehicle Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <Car className="w-3.5 h-3.5 text-amber-500" />
                            <span>Yakıt Alan Araç *</span>
                        </label>
                        <select
                            value={data.arac_id}
                            onChange={(e) => {
                                const v = vehicles.find(item => item.id === parseInt(e.target.value));
                                setData(prev => ({
                                    ...prev,
                                    arac_id: e.target.value,
                                    km: v?.guncel_km || prev.km,
                                    yakit_turu: v?.yakit_turu || prev.yakit_turu,
                                }));
                            }}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
                            required
                        >
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.plaka} — {v.marka} {v.model} ({v.yakit_turu})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Driver Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5 text-blue-500" />
                            <span>Yakıtı Alan Sürücü (Opsiyonel)</span>
                        </label>
                        <select
                            value={data.surucu_id}
                            onChange={(e) => setData('surucu_id', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                        >
                            <option value="">-- Sürücü Belirtilmedi --</option>
                            {drivers.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.ad_soyad} ({d.departman || 'Genel'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Alım Tarihi *</span>
                            </label>
                            <input
                                type="date"
                                value={data.tarih}
                                onChange={(e) => setData('tarih', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                required
                            />
                        </div>

                        {/* Current KM */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <Gauge className="w-3.5 h-3.5 text-purple-500" />
                                <span>Sayaç KM *</span>
                            </label>
                            <input
                                type="number"
                                value={data.km}
                                onChange={(e) => setData('km', e.target.value)}
                                placeholder="Örn: 125000"
                                className="w-full font-mono bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Liter */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Alınan Litre *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.litre}
                                onChange={(e) => handleLitreChange(e.target.value)}
                                placeholder="Örn: 45.5"
                                className="w-full font-mono bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                required
                            />
                        </div>

                        {/* Total Amount */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Toplam Tutar (₺) *</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.toplam_tutar}
                                onChange={(e) => handleTotalChange(e.target.value)}
                                placeholder="Örn: 2000"
                                className="w-full font-mono bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-black text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Unit Price Display */}
                    {data.birim_fiyat && data.birim_fiyat > 0 && (
                        <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-bold">Hesaplanan Birim Fiyat:</span>
                            <span className="font-bold font-mono text-emerald-500">₺{data.birim_fiyat} / Litre</span>
                        </div>
                    )}

                    {/* Station & Fuel Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Akaryakıt İstasyonu
                            </label>
                            <select
                                value={data.istasyon}
                                onChange={(e) => setData('istasyon', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                            >
                                {STATIONS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Yakıt Türü
                            </label>
                            <select
                                value={data.yakit_turu}
                                onChange={(e) => setData('yakit_turu', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                            >
                                <option value="Benzin">Benzin</option>
                                <option value="Dizel (Motorin)">Dizel (Motorin)</option>
                                <option value="LPG / Otogaz">LPG / Otogaz</option>
                                <option value="Elektrik (kWh)">Elektrik (kWh)</option>
                                <option value="Hibrit">Hibrit</option>
                            </select>
                        </div>
                    </div>

                    {/* File Upload (Receipt) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <Upload className="w-3.5 h-3.5 text-blue-500" />
                            <span>Yakıt Fişi / Fatura Fotoğrafı (Opsiyonel)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('fis', e.target.files[0])}
                            className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 dark:file:bg-white/[0.06] file:text-slate-700 dark:file:text-slate-200 hover:file:bg-emerald-500/20 cursor-pointer"
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
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{processing ? 'Kaydediliyor...' : 'Yakıt Fişini Kaydet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
