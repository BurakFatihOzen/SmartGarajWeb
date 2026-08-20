import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Sparkles, 
    CheckCircle2, 
    AlertTriangle, 
    AlertCircle,
    Lightbulb, 
    X, 
    Activity, 
    RefreshCw,
    Gauge,
    Calendar,
    Fuel,
    ShieldAlert,
    Check,
    Cpu
} from 'lucide-react';

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
                setError('Teşhis raporu oluşturulamadı.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Yapay zeka analiz sunucusuna bağlanılamadı.');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] shrink-0">
                    <div className="flex items-center space-x-3 pr-4 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                                    SmartGaraj AI Teşhis
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                    Canlı Motor
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {vehiclePlate ? `${vehiclePlate} — ${vehicleName}` : 'Seçili Araç Sağlık Analizi'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                            onClick={fetchDiagnosis}
                            disabled={loading}
                            title="Yeniden Analiz Et"
                            className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer disabled:opacity-40"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1">
                    {loading ? (
                        <div className="py-16 text-center space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto animate-spin">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Yapay Zeka Aracı Analiz Ediyor...
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    Muayene takvimi, motor tipi, servis aralıkları ve parça yorgunluğu taranıyor.
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : data ? (
                        <div className="space-y-5">
                            
                            {/* 1. HEALTH SCORE & VEHICLE SPECS BANNER */}
                            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/[0.08] via-transparent to-transparent bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                        GENEL KONDİSYON SKORU
                                    </span>
                                    <div className="flex items-baseline space-x-3">
                                        <div className={`text-4xl font-black font-mono ${
                                            data.health_score >= 80 ? 'text-emerald-500' : data.health_score >= 60 ? 'text-amber-500' : 'text-red-500'
                                        }`}>
                                            %{data.health_score}
                                        </div>
                                        <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${
                                            data.health_score >= 80 
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                                : data.health_score >= 60 
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                                                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                        }`}>
                                            {data.status_label || (data.health_score >= 80 ? 'Mükemmel Kondisyon' : 'Bakım Zamanı')}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Spec Badges */}
                                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 text-xs">
                                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                                        <Fuel className="w-3.5 h-3.5 text-amber-500" />
                                        <span>{data.fuel_type || data.motor_type || 'Benzin'}</span>
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                                        <Cpu className="w-3.5 h-3.5 text-purple-500" />
                                        <span className="truncate max-w-[170px]">{data.transmission || 'Manuel'}</span>
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                                        <Gauge className="w-3.5 h-3.5 text-blue-500" />
                                        <span>{Number(data.current_km || 0).toLocaleString('tr-TR')} KM</span>
                                    </span>
                                </div>
                            </div>

                            {/* 2. KRİTİK UYARILAR (CRITICAL WARNINGS) */}
                            {data.critical_warnings && data.critical_warnings.length > 0 && (
                                <div className="space-y-2.5">
                                    <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                                        <ShieldAlert className="w-4 h-4 text-red-500" />
                                        <span>Kritik Riskler & Acil Uyarılar ({data.critical_warnings.length})</span>
                                    </div>
                                    <div className="space-y-2">
                                        {data.critical_warnings.map((warn, idx) => (
                                            <div key={idx} className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/[0.08] border border-red-200 dark:border-red-500/20 text-xs font-semibold text-red-800 dark:text-red-300 flex items-start space-x-2.5 shadow-2xs">
                                                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">{warn}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. RUTİN TAVSİYELER & GELECEK BAKIMLAR (ROUTINE ADVICES) */}
                            {data.routine_advices && data.routine_advices.length > 0 && (
                                <div className="space-y-2.5">
                                    <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                        <span>Yapay Zeka Bakım & Kontrol Tavsiyeleri ({data.routine_advices.length})</span>
                                    </div>
                                    <div className="space-y-2">
                                        {data.routine_advices.map((adv, idx) => (
                                            <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-500/[0.06] border border-amber-200/80 dark:border-amber-500/15 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-start space-x-2.5 shadow-2xs">
                                                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">{adv}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 4. TAMAMLANMIŞ / NOMİNAL KONTROLLER (COMPLETED CHECKS) */}
                            {data.completed_checks && data.completed_checks.length > 0 && (
                                <div className="space-y-2.5">
                                    <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span>Sağlıklı & Güncel Sistemler ({data.completed_checks.length})</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {data.completed_checks.map((chk, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/[0.04] border border-emerald-200/60 dark:border-emerald-500/15 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                <span>{chk}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : null}
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                        Algoritma: SmartGaraj AI Diagnostic v1.2
                    </span>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}
