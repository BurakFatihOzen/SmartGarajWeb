import React, { useState } from 'react';
import axios from 'axios';
import { 
    Sparkles, 
    Upload, 
    FileText, 
    Camera, 
    CheckCircle2, 
    AlertCircle, 
    X, 
    Loader2, 
    Zap, 
    Scan 
} from 'lucide-react';

export default function OcrModal({ isOpen, onClose, type = 'ruhsat', onDataExtracted, onExtracted }) {
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
                            <span>{type === 'ruhsat' ? 'AI Ruhsat Tarayıcı' : 'AI Fatura Tarayıcı'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold border border-purple-500/20">
                                Vision AI
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {type === 'ruhsat' 
                                ? 'Ruhsat görselini yükleyin, araç bilgileri otomatik form alanlarına aktarılsın.'
                                : 'Servis faturası veya fiş görselini yükleyin, harcama kalemleri ve tutar aktarılsın.'}
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
                                        <span>Vision AI Belgeyi Okuyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        <span>Yapay Zeka ile Analiz Et</span>
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
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-3">
                        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Bilgiler Başarıyla Ayıklandı!</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {type === 'ruhsat' ? (
                                <>
                                    {result.data.plaka && <div><span className="text-slate-400">Plaka:</span> <strong className="text-slate-800 dark:text-white font-mono">{result.data.plaka}</strong></div>}
                                    {result.data.marka && <div><span className="text-slate-400">Marka:</span> <strong className="text-slate-800 dark:text-white">{result.data.marka}</strong></div>}
                                    {result.data.model && <div><span className="text-slate-400">Model:</span> <strong className="text-slate-800 dark:text-white">{result.data.model}</strong></div>}
                                    {result.data.yil && <div><span className="text-slate-400">Model Yılı:</span> <strong className="text-slate-800 dark:text-white">{result.data.yil}</strong></div>}
                                </>
                            ) : (
                                <>
                                    {result.data.islem_turu && <div className="col-span-2"><span className="text-slate-400">İşlem:</span> <strong className="text-slate-800 dark:text-white">{result.data.islem_turu}</strong></div>}
                                    {result.data.toplam_tutar && <div><span className="text-slate-400">Tutar:</span> <strong className="text-amber-500 font-black">{result.data.toplam_tutar} ₺</strong></div>}
                                    {result.data.tarih && <div><span className="text-slate-400">Tarih:</span> <strong className="text-slate-800 dark:text-white font-mono">{result.data.tarih}</strong></div>}
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleApply}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Bilgileri Forma Aktar</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
