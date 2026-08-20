import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, X, Activity, RefreshCw } from 'lucide-react';

export default function AiDiagnosisModal({ isOpen, onClose, vehicleId, vehiclePlate, vehicleName }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchDiagnosis = async () => {
        if (!vehicleId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/dashboard/diagnosis/${vehicleId}`);
            const resultData = response.data?.data || response.data;
            if (resultData && resultData.health_score !== undefined) {
                setData(resultData);
            } else {
                setError('Teşhis verisi alınamadı.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Sunucu ile bağlantı kurulamadı.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && vehicleId) {
            fetchDiagnosis();
        }
    }, [isOpen, vehicleId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#13151b] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Glow accent header */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-amber-500/15 to-transparent blur-2xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/20 font-bold">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-bold text-white">Akıllı AI Diagnostik Raporu</h3>
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    V1.2 Engine
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                {vehiclePlate ? `${vehiclePlate} - ${vehicleName}` : 'Seçili Araç Sağlık Analizi'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={fetchDiagnosis}
                            disabled={loading}
                            title="Yeniden Analiz Et"
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
                    {loading ? (
                        <div className="py-16 text-center space-y-4">
                            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
                            <p className="text-sm font-semibold text-slate-300">Araç telemetri ve servis verileri analiz ediliyor...</p>
                            <p className="text-xs text-slate-500">Motor türü, sıvı ömrü ve periyodik kilometre eşikleri taranıyor.</p>
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center text-red-400 space-y-2">
                            <AlertTriangle className="w-10 h-10 mx-auto text-red-400" />
                            <p className="text-sm font-semibold">{error}</p>
                        </div>
                    ) : data ? (
                        <>
                            {/* Score Card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10">
                                <div className="flex items-center space-x-4 md:border-r md:border-white/10 md:pr-4">
                                    <div className="relative flex items-center justify-center">
                                        <div
                                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${
                                                data.health_score >= 80
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                    : data.health_score >= 60
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                            }`}
                                        >
                                            {data.health_score}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sağlık Skoru</div>
                                        <div className="text-sm font-bold text-white">{data.status_label}</div>
                                    </div>
                                </div>

                                <div className="space-y-1 md:px-2">
                                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Motor Türü</div>
                                    <div className="text-sm font-bold text-slate-200 flex items-center space-x-1.5">
                                        <Activity className="w-4 h-4 text-amber-400" />
                                        <span>{data.motor_type}</span>
                                    </div>
                                </div>

                                <div className="space-y-1 md:pl-2">
                                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mevcut Kilometre</div>
                                    <div className="text-sm font-mono font-bold text-white">
                                        {Number(data.current_km).toLocaleString('tr-TR')} KM
                                    </div>
                                </div>
                            </div>

                            {/* Critical Warnings */}
                            {data.critical_warnings?.length > 0 && (
                                <div className="space-y-2.5">
                                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span>Kritik Dikkat Gerektirenler</span>
                                    </div>
                                    <div className="space-y-2">
                                        {data.critical_warnings.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-medium leading-relaxed"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completed Checks */}
                            {data.completed_checks?.length > 0 && (
                                <div className="space-y-2.5">
                                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Onaylanan / Nominal Kontroller</span>
                                    </div>
                                    <div className="space-y-2">
                                        {data.completed_checks.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium leading-relaxed flex items-center space-x-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Routine Advices */}
                            {data.routine_advices?.length > 0 && (
                                <div className="space-y-2.5">
                                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                                        <Lightbulb className="w-4 h-4" />
                                        <span>Önerilen Rutin Bakım & Kontroller</span>
                                    </div>
                                    <div className="space-y-2">
                                        {data.routine_advices.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium leading-relaxed flex items-center space-x-2"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
                    <span>Veriler araç yaşı ve servis geçmişine göre hesaplanır.</span>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold transition-all"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}
