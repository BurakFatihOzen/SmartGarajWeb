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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-3xl bg-[#13151b] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 shrink-0">
                        <Scan className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <span>{type === 'ruhsat' ? 'AI Ruhsat Tarayıcı' : 'AI Fatura & İş Emri Tarayıcı'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-extrabold border border-purple-500/30">
                                Vision AI
                            </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {type === 'ruhsat' 
                                ? 'Araç ruhsatının fotoğrafını yükleyin, plaka, şasi ve muayene otomatik dolsun.' 
                                : 'Servis faturasını yükleyin, parça kalemleri ve maliyet tek tıkla işlensin.'}
                        </p>
                    </div>
                </div>

                {/* Upload Zone */}
                {!preview ? (
                    <label className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#181b24]/50 hover:bg-[#181b24] group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7" />
                        </div>
                        <span className="text-sm font-bold text-white">Fotoğraf Seçin veya Sürükleyin</span>
                        <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Maks 10MB)</span>
                    </label>
                ) : (
                    <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-56 bg-slate-950 flex items-center justify-center">
                            <img src={preview} alt="Önizleme" className="max-h-56 object-contain" />
                            {loading && (
                                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-purple-300 space-y-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                                    <span className="text-xs font-bold animate-pulse">Vision AI Belgeyi Okuyor...</span>
                                </div>
                            )}
                        </div>

                        {!result && (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setFile(null); setPreview(null); }}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all cursor-pointer"
                                >
                                    Farklı Görsel Seç
                                </button>
                                <button
                                    type="button"
                                    onClick={handleScan}
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>{loading ? 'Taranıyor...' : '🧠 AI ile Analiz Et'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Result Preview */}
                {result && result.data && (
                    <div className="space-y-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Bilgiler Başarıyla Ayıklandı ({result.engine})
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {type === 'ruhsat' ? (
                                <>
                                    <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5">
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Plaka</div>
                                        <div className="font-bold font-mono text-amber-400 text-sm mt-0.5">{result.data.plaka || '-'}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5">
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Marka / Model</div>
                                        <div className="font-bold text-white text-sm mt-0.5">{result.data.marka} {result.data.model}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5">
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Model Yılı / Motor</div>
                                        <div className="font-bold text-white text-sm mt-0.5">{result.data.yil || '-'} {result.data.motor ? `(${result.data.motor})` : ''}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5">
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Muayene Tarihi</div>
                                        <div className="font-bold text-emerald-400 text-sm mt-0.5">{result.data.muayene_tarihi || '-'}</div>
                                    </div>
                                    {result.data.sasi_no && (
                                        <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5 col-span-2">
                                            <div className="text-[10px] text-slate-400 font-semibold uppercase">Şasi Numarası (VIN)</div>
                                            <div className="font-bold font-mono text-white text-xs mt-0.5">{result.data.sasi_no}</div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5">
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Servis / İşlem</div>
                                        <div className="font-bold text-white text-sm mt-0.5">{result.data.islem_turu}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5">
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Toplam Tutar</div>
                                        <div className="font-bold font-mono text-emerald-400 text-sm mt-0.5">₺{Number(result.data.toplam_tutar || 0).toLocaleString('tr-TR')}</div>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-[#181b24] border border-white/5 col-span-2">
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Parça Listesi</div>
                                        <div className="font-bold text-white text-xs mt-0.5">{result.data.parcalar?.length || 0} Adet Kalem Ayrıştırıldı</div>
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleApply}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                            <Zap className="w-4 h-4" />
                            <span>✓ Formu Bu Bilgilerle Otomatik Doldur</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
