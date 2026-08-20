import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Lock, 
    CheckCircle2, 
    AlertCircle, 
    Eye, 
    EyeOff, 
    Mail,
    ArrowRight
} from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        sifre: '',
        sifre_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    const isMatch = data.sifre && data.sifre_confirmation && data.sifre === data.sifre_confirmation;

    return (
        <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
            <Head title="Yeni Şifre Belirleyin - SmartGaraj" />

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-transparent blur-3xl rounded-full" />
            </div>

            <div className="w-full max-w-[440px] rounded-3xl bg-[#13151b] border border-white/[0.08] p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
                
                {/* Header & Logo */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white">Yeni Şifrenizi Belirleyin</h2>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Hesabınız için güçlü ve hatırlaması kolay yeni bir şifre tanımlayın.
                        </p>
                    </div>
                </div>

                {/* Errors Display */}
                {(errors.email || errors.token || errors.sifre) && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center space-x-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <div>{errors.sifre || errors.email || errors.token}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* E-Posta (Readonly) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Hesap E-Postası</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                            <input
                                type="email"
                                value={data.email}
                                readOnly
                                className="w-full bg-[#161821] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-400 cursor-not-allowed font-semibold"
                            />
                        </div>
                    </div>

                    {/* Yeni Şifre */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Yeni Şifre <span className="text-amber-400 font-normal">(En az 6 karakter)</span>
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.sifre}
                                onChange={(e) => setData('sifre', e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                                required
                                minLength={6}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Yeni Şifre Tekrar */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-slate-300">Yeni Şifre (Tekrar)</label>
                            {data.sifre_confirmation && (
                                <span className={`text-[10px] font-bold ${isMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isMatch ? '✓ Şifreler Eşleşti' : '✕ Eşleşmiyor'}
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.sifre_confirmation}
                                onChange={(e) => setData('sifre_confirmation', e.target.value)}
                                placeholder="••••••••"
                                className={`w-full bg-[#1a1d27] border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono ${
                                    data.sifre_confirmation 
                                        ? isMatch ? 'border-emerald-500/50' : 'border-red-500/50'
                                        : 'border-white/10 focus:border-amber-500'
                                }`}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing || (data.sifre_confirmation && !isMatch)}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{processing ? 'Şifre Güncelleniyor...' : 'Şifremi Güncelle ve Giriş Yap'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
