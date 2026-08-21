import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, UserCheck, Car, Calendar, Gauge, Fuel, FileText, CheckCircle2 } from 'lucide-react';

export default function AssignmentModal({ isOpen, onClose, vehicles = [], drivers = [], preselectedVehicle = null, preselectedDriver = null }) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        arac_id: preselectedVehicle?.id || (vehicles[0]?.id || ''),
        surucu_id: preselectedDriver?.id || (drivers[0]?.id || ''),
        teslim_tarihi: new Date().toISOString().split('T')[0],
        baslangic_km: preselectedVehicle?.guncel_km || 0,
        yakit_seviyesi: '%100 (Dolu Depo)',
        teslim_notu: '',
    });

    const handleVehicleChange = (vehicleId) => {
        const v = vehicles.find(item => item.id === parseInt(vehicleId));
        setData(prev => ({
            ...prev,
            arac_id: vehicleId,
            baslangic_km: v?.guncel_km || 0,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/fleet/assignments', {
            preserveScroll: true,
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
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">
                            <UserCheck className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                Araca Sürücü Zimmetle
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold">
                                Resmi teslim-tesellüm kaydı oluşturun
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
                            <span>Zimmetlenecek Araç *</span>
                        </label>
                        <select
                            value={data.arac_id}
                            onChange={(e) => handleVehicleChange(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.plaka} — {v.marka} {v.model} ({v.guncel_km ? `${Number(v.guncel_km).toLocaleString('tr-TR')} KM` : '0 KM'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Driver Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span>Zimmet Edilecek Sürücü / Personel *</span>
                        </label>
                        <select
                            value={data.surucu_id}
                            onChange={(e) => setData('surucu_id', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            {drivers.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.ad_soyad} {d.departman ? `(${d.departman})` : ''} — Ehliyet: {d.ehliyet_sinifi}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Delivery Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Teslim Tarihi *</span>
                            </label>
                            <input
                                type="date"
                                value={data.teslim_tarihi}
                                onChange={(e) => setData('teslim_tarihi', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                required
                            />
                        </div>

                        {/* Starting KM */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                                <Gauge className="w-3.5 h-3.5 text-purple-500" />
                                <span>Teslim Anındaki KM *</span>
                            </label>
                            <input
                                type="number"
                                value={data.baslangic_km}
                                onChange={(e) => setData('baslangic_km', e.target.value)}
                                className="w-full font-mono bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Fuel Level */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <Fuel className="w-3.5 h-3.5 text-amber-500" />
                            <span>Teslim Anındaki Yakıt Seviyesi</span>
                        </label>
                        <select
                            value={data.yakit_seviyesi}
                            onChange={(e) => setData('yakit_seviyesi', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
                        >
                            <option value="%100 (Dolu Depo)">%100 (Dolu Depo)</option>
                            <option value="%75 (3/4 Depo)">%75 (3/4 Depo)</option>
                            <option value="%50 (Yarım Depo)">%50 (Yarım Depo)</option>
                            <option value="%25 (Çeyrek Depo)">%25 (Çeyrek Depo)</option>
                            <option value="Çeyrek Altı (Rezerv)">Çeyrek Altı (Rezerv)</option>
                        </select>
                    </div>

                    {/* Delivery Notes */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Teslim Notları & Aksesuar Durumu (Opsiyonel)</span>
                        </label>
                        <textarea
                            rows={2}
                            value={data.teslim_notu}
                            onChange={(e) => setData('teslim_notu', e.target.value)}
                            placeholder="Örn: Yedek anahtar, yangın tüpü ve ilk yardım seti teslim edildi."
                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-3 text-xs text-slate-900 dark:text-white"
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
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{processing ? 'Zimmetleniyor...' : 'Zimmeti Onayla & Kaydet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
