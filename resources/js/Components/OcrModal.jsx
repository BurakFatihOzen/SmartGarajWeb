import React, { useState } from 'react';
import axios from 'axios';
import { 
    Sparkles, 
    Upload, 
    FileText, 
    Camera, 
    CheckCircle2, 
    AlertCircle, 
    AlertTriangle,
    X, 
    Loader2, 
    Zap, 
    Scan,
    ShieldAlert
} from 'lucide-react';

export default function OcrModal({ isOpen, onClose, type = 'ruhsat', vehicleId = null, onDataExtracted, onExtracted }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setError(null);
            setResult(null);
        }
    };

    const handleScan = async () => {
        if (!file) {
            setError('Lütfen önce bir fotoğraf veya belge seçin.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('gorsel', file);
        if (vehicleId) {
            formData.append('arac_id', vehicleId);
        }

        const endpoint = type === 'ruhsat' ? '/api/ocr/ruhsat' : '/api/ocr/fatura';

        try {
            const res = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (res.data && res.data.success && res.data.data) {
                setResult(res.data);
            } else {
                setError(res.data?.message || 'Belge analiz edilemedi.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Tarama sırasında bağlantı hatası oluştu.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (result && result.data) {
            if (typeof onDataExtracted === 'function') {
                onDataExtracted(result.data);
            } else if (typeof onExtracted === 'function') {
                onExtracted(result.data);
            }
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/10 p-5 sm:p-7 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 pr-8">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 shrink-0">
                        <Scan className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{type === 'ruhsat' ? 'AI Ruhsat Tarayıcı' : 'AI Fatura & Mükerrer Parça Denetimi'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold border border-purple-500/20">
                                Vision AI + Audit
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {type === 'ruhsat' 
                                ? 'Ruhsat görselini yükleyin, araç bilgileri otomatik form alanlarına aktarılsın.'
                                : 'Servis faturasını yükleyin; kalemler aktarılırken mükerrer ve hatalı parçalar otomatik denetlenir.'}
                        </p>
                    </div>
                </div>

                {/* Upload & Preview Area */}
                {!preview ? (
                    <label className="border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-purple-500/50 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 dark:bg-white/[0.02] hover:bg-purple-50/20 group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            Belge Görselini Yükleyin veya Sürükleyin
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                            Fotoğrafın net ve yazıların okunur olduğundan emin olun
                        </span>
                    </label>
                ) : (
                    <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-52 bg-slate-950 flex items-center justify-center">
                            <img src={preview} alt="Belge Önizleme" className="max-h-52 w-full object-contain" />
                            <button
                                onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-slate-950/70 text-white hover:bg-red-500 transition-colors shadow-md"
                                title="Görseli Değiştir"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {!result && (
                            <button
                                onClick={handleScan}
                                disabled={loading}
                                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Vision AI & Geçmiş Kayıtlar Taranıyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        <span>Yapay Zeka ile Analiz Et & Denetle</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Error Box */}
                {error && (
                    <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center space-x-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Extracted Data Result */}
                {result && result.data && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-extrabold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Belge Bilgileri Ayrıştırıldı</span>
                            </div>
                            {result.data.audit_summary?.has_warnings && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[10px]">
                                    <AlertTriangle className="w-3 h-3" />
                                    {result.data.audit_summary.duplicates_count > 0 && `${result.data.audit_summary.duplicates_count} Mükerrer Uyarısı`}
                                </span>
                            )}
                        </div>

                        {/* Summary Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs p-3 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200/80 dark:border-white/5">
                            {type === 'ruhsat' ? (
                                <>
                                    {result.data.plaka && <div><span className="text-slate-400">Plaka:</span> <strong className="text-slate-800 dark:text-white font-mono block">{result.data.plaka}</strong></div>}
                                    {result.data.marka && <div><span className="text-slate-400">Marka:</span> <strong className="text-slate-800 dark:text-white block">{result.data.marka}</strong></div>}
                                    {result.data.model && <div><span className="text-slate-400">Model:</span> <strong className="text-slate-800 dark:text-white block">{result.data.model}</strong></div>}
                                    {result.data.yil && <div><span className="text-slate-400">Model Yılı:</span> <strong className="text-slate-800 dark:text-white block">{result.data.yil}</strong></div>}
                                </>
                            ) : (
                                <>
                                    {result.data.islem_turu && <div className="col-span-2"><span className="text-slate-400">İşlem:</span> <strong className="text-slate-800 dark:text-white block">{result.data.islem_turu}</strong></div>}
                                    {result.data.toplam_tutar && <div><span className="text-slate-400">Tutar:</span> <strong className="text-amber-500 font-black font-mono block">₺{Number(result.data.toplam_tutar).toLocaleString('tr-TR')}</strong></div>}
                                    {result.data.tarih && <div><span className="text-slate-400">Tarih:</span> <strong className="text-slate-800 dark:text-white font-mono block">{result.data.tarih}</strong></div>}
                                    {result.data.islem_km && <div><span className="text-slate-400">KM:</span> <strong className="text-slate-800 dark:text-white font-mono block">{Number(result.data.islem_km).toLocaleString('tr-TR')} KM</strong></div>}
                                </>
                            )}
                        </div>

                        {/* Scanned & Audited Parts Table (Faz 3) */}
                        {type === 'fatura' && result.data.parcalar && result.data.parcalar.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                                    <span>Taranan Kalemler & AI Denetimi</span>
                                    <span className="text-purple-400">{result.data.parcalar.length} Kalem</span>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    {result.data.parcalar.map((p, idx) => {
                                        const pName = p.parca || p.ad || '';
                                        const audit = p.audit;
                                        const isWarning = audit?.status === 'duplicate' || audit?.status === 'invalid';
                                        const isEarly = audit?.status === 'early';

                                        return (
                                            <div 
                                                key={idx}
                                                className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                                                    isWarning 
                                                        ? 'bg-red-500/5 border-red-500/30' 
                                                        : isEarly 
                                                            ? 'bg-amber-500/5 border-amber-500/30' 
                                                            : 'bg-white dark:bg-[#151824] border-slate-200/80 dark:border-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between font-bold">
                                                    <span className="text-slate-900 dark:text-white">{pName}</span>
                                                    <div className="flex items-center space-x-2">
                                                        {p.fiyat > 0 && (
                                                            <span className="font-mono text-slate-500">₺{Number(p.fiyat).toLocaleString('tr-TR')}</span>
                                                        )}
                                                        {audit?.badge && (
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                                                                isWarning 
                                                                    ? 'bg-red-500/20 text-red-500' 
                                                                    : isEarly 
                                                                        ? 'bg-amber-500/20 text-amber-500' 
                                                                        : 'bg-emerald-500/10 text-emerald-500'
                                                            }`}>
                                                                {audit.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {audit?.message && (isWarning || isEarly) && (
                                                    <p className={`text-[11px] font-medium leading-relaxed ${isWarning ? 'text-red-500' : 'text-amber-500'}`}>
                                                        {audit.message}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleApply}
                            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Bilgileri Forma Aktar</span>
                        </button>
                    </div>
                )}

                {/* Development Sample Fill Option */}
                {!result && (
                    <div className="pt-2 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                const sample = type === 'ruhsat' ? {
                                    plaka: '34 SG 2026',
                                    sasi_no: 'WBA3A5C50DF819283',
                                    marka: 'Volkswagen',
                                    model: 'Passat 1.5 TSI Elegance',
                                    motor: '1.5 TSI 150 HP ACT',
                                    yil: 2022,
                                    ruhsat_tipi: 'Otomobil (Hususi)',
                                    muayene_tarihi: '2027-04-18'
                                } : {
                                    tarih: new Date().toISOString().split('T')[0],
                                    servis_adi: 'Bosch Car Service',
                                    islem_km: 45000,
                                    toplam_tutar: 5450.00,
                                    islem_turu: 'Periyodik Bakım & Filtre Seti',
                                    aciklama: 'Yıllık periyodik bakım yapıldı, motor yağı ve tüm filtreler orijinal parça ile yenilendi.',
                                    parcalar: [
                                        { 
                                            ad: 'Motul 8100 X-Clean+ 5W-30 (5L)', 
                                            adet: 1, 
                                            fiyat: 2100.00,
                                            audit: { status: 'duplicate', severity: 'danger', badge: '🚨 Mükerrer Değişim', message: 'Bu parça en son 2.100 KM önce değiştirilmişti! Tekrar faturalandırılması şüpheli/mükerrer masraf olabilir.' }
                                        },
                                        { 
                                            ad: 'Mann Orijinal Yağ Filtresi', 
                                            adet: 1, 
                                            fiyat: 420.00,
                                            audit: { status: 'duplicate', severity: 'danger', badge: '🚨 Mükerrer Değişim', message: 'Yağ filtresi 14.05.2026 tarihinde değiştirilmişti.' }
                                        },
                                        { 
                                            ad: 'Mann Karbonlu Polen Filtresi', 
                                            adet: 1, 
                                            fiyat: 580.00,
                                            audit: { status: 'normal', severity: 'success', badge: '✅ Normal Periyot', message: 'Normal periyot.' }
                                        },
                                        { 
                                            ad: 'Mann Hava Filtresi', 
                                            adet: 1, 
                                            fiyat: 550.00,
                                            audit: { status: 'normal', severity: 'success', badge: '✅ Normal Periyot', message: 'Normal periyot.' }
                                        },
                                        { 
                                            ad: 'Periyodik Bakım İşçilik Bedeli', 
                                            adet: 1, 
                                            fiyat: 1800.00,
                                            audit: { status: 'normal', severity: 'success', badge: '✅ Standart İşçilik', message: 'Standart periyodik bakım işçiliği.' }
                                        }
                                    ],
                                    audit_summary: { has_warnings: true, duplicates_count: 2, early_count: 0 }
                                };
                                setResult({ success: true, data: sample });
                            }}
                            className="text-[11px] font-bold text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 hover:underline transition-colors cursor-pointer"
                        >
                            ⚡ Test için örnek {type === 'ruhsat' ? 'ruhsat' : 'fatura (Mükerrer Parça Denetimli)'} verisi yükle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
