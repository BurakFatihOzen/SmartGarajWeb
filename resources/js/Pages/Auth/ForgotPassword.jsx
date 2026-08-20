import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { 
    KeyRound, 
    ArrowLeft, 
    Send, 
    CheckCircle2, 
    AlertCircle, 
    Mail, 
    ShieldCheck, 
    Inbox
} from 'lucide-react';

export default function ForgotPassword({ status, targetEmail }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
            <Head title="Şifre Sıfırlama - SmartGaraj" />

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-transparent blur-3xl rounded-full" />
            </div>

            <div className="w-full max-w-[440px] rounded-3xl bg-[#13151b] border border-white/[0.08] p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
                
                {/* Header & Logo */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25">
                        <KeyRound className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white">Şifrenizi mi Unuttunuz?</h2>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Hesabınıza kayıtlı e-posta adresinizi girin, sıfırlama bağlantısını güvenle gelen kutunuza gönderelim.
                        </p>
                    </div>
                </div>

                {/* Status / Success Box */}
                {status && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                        <div className="flex items-start space-x-2.5">
                            <Inbox className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block text-white text-sm mb-0.5">Sıfırlama E-Postası Gönderildi</span>
                                <p className="text-slate-300 leading-relaxed">
                                    <strong className="text-amber-400">{targetEmail || data.email}</strong> adresine tek kullanımlık güvenli bağlantı yollandı.
                                </p>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-slate-400 flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Lütfen gelen kutunuzu (ve gerekiyorsa spam klasörünü) kontrol ederek e-postadaki bağlantıya tıklayın.</span>
                        </div>
                    </div>
                )}

                {/* Error Box */}
                {errors.email && (
                    <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center space-x-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.email}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            Kayıtlı E-Posta Adresiniz
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Örn: ornek@mail.com"
                                className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-semibold"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                        <span>{processing ? 'E-Posta Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}</span>
                    </button>

                    <div className="text-center pt-2">
                        <Link
                            href="/login"
                            className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Giriş Ekranına Geri Dön</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
