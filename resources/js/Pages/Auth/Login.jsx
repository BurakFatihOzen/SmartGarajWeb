import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { 
    Wrench, 
    ShieldLock, 
    UserPlus, 
    Moon, 
    Sun, 
    AlertCircle, 
    Building2, 
    Car, 
    CheckCircle2, 
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Truck,
    Layers
} from 'lucide-react';

export default function Login() {
    const [authMode, setAuthMode] = useState('personal'); // 'personal' | 'fleet'
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light') {
            setIsLight(true);
            document.documentElement.classList.remove('dark');
        } else {
            setIsLight(false);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isLight) {
            setIsLight(false);
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            setIsLight(true);
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
        }
    };

    // Login Form
    const loginForm = useForm({
        email: '',
        sifre: '',
        mode: 'personal',
    });

    // Register Form
    const registerForm = useForm({
        ad_soyad: '',
        email: '',
        sifre: '',
        sirket_adi: '',
        mode: 'personal',
    });

    useEffect(() => {
        loginForm.setData('mode', authMode);
        registerForm.setData('mode', authMode);
    }, [authMode]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        loginForm.post('/login', {
            preserveScroll: true,
        });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        registerForm.post('/register', {
            preserveScroll: true,
        });
    };

    const isFleet = authMode === 'fleet';

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative selection:bg-amber-500 selection:text-black ${
            isLight 
                ? 'bg-slate-100 text-slate-900' 
                : 'bg-[#090a0f] text-slate-100'
        }`}>
            {/* Background Ambient Glows */}
            <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
                isFleet 
                    ? 'bg-blue-600/15' 
                    : 'bg-amber-500/15'
            }`} />

            {/* Top Right Theme Toggle */}
            <button
                onClick={toggleTheme}
                title="Tema Değiştir"
                className="absolute top-5 right-5 sm:top-7 sm:right-7 p-2.5 rounded-2xl bg-white/80 dark:bg-white/[0.06] backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-all shadow-md active:scale-95 cursor-pointer z-20"
            >
                {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Main Auth Container */}
            <div className="relative z-10 w-full max-w-[460px] space-y-4 sm:space-y-5">
                
                {/* Portal Mode Switcher (Bireysel vs SmartFilo) */}
                <div className="p-1.5 rounded-3xl bg-white/80 dark:bg-[#11131c]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] shadow-lg flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => setAuthMode('personal')}
                        className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                            !isFleet
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Car className="w-4 h-4" />
                        <span>🚗 Bireysel Garaj</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setAuthMode('fleet')}
                        className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                            isFleet
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Building2 className="w-4 h-4" />
                        <span>🏢 SmartFilo Pro</span>
                    </button>
                </div>

                {/* Login / Register Card */}
                <div className="rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-[#11131c]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl space-y-6">
                    
                    {/* Brand Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 shrink-0">
                            {isFleet ? <Building2 className="w-7 h-7 stroke-[2.5]" /> : <Wrench className="w-7 h-7 stroke-[2.5]" />}
                        </div>

                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                Smart<span className={isFleet ? 'text-blue-500' : 'text-amber-500'}>{isFleet ? 'Filo' : 'Garaj'}</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                                {isFleet 
                                    ? '🏢 Kurumsal Filo, Zimmet & Operasyon Portalı' 
                                    : '🚗 Bireysel Araç & Bakım Yönetim Asistanı'}
                            </p>
                        </div>
                    </div>

                    {/* Mode Description Banner */}
                    <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center space-x-2.5 border ${
                        isFleet
                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20'
                    }`}>
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>
                            {isFleet
                                ? 'Şirket filonuzdaki tüm araçları, sürücü zimmetlerini ve filo masraflarını yönetin.'
                                : 'Şahsi araçlarınızın periyodik bakımını, masraflarını ve dijital pasaportunu takip edin.'}
                        </span>
                    </div>

                    {/* Nav Tabs (Giriş Yap / Kayıt Ol) */}
                    <div className="flex rounded-2xl p-1 bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                                activeTab === 'login'
                                    ? (isFleet ? 'bg-blue-600 text-white shadow-md' : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20')
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Giriş Yap
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('register')}
                            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                                activeTab === 'register'
                                    ? (isFleet ? 'bg-blue-600 text-white shadow-md' : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20')
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Hesap Oluştur
                        </button>
                    </div>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            {loginForm.errors.email && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center space-x-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{loginForm.errors.email}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    E-posta Adresi
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ornek@alanadi.com"
                                    value={loginForm.data.email}
                                    onChange={(e) => loginForm.setData('email', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        Şifre
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-[11px] font-bold text-amber-500 hover:underline"
                                    >
                                        Şifremi Unuttum?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={loginForm.data.sifre}
                                    onChange={(e) => loginForm.setData('sifre', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loginForm.processing}
                                className={`w-full py-3 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${
                                    isFleet
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25'
                                }`}
                            >
                                <span>{loginForm.processing ? 'Giriş Yapılıyor...' : (isFleet ? 'SmartFilo Portala Giriş Yap' : 'Garajıma Giriş Yap')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                            {Object.keys(registerForm.errors).length > 0 && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold space-y-1">
                                    {Object.values(registerForm.errors).map((err, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{err}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Adınız & Soyadınız
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ahmet Yılmaz"
                                    value={registerForm.data.ad_soyad}
                                    onChange={(e) => registerForm.setData('ad_soyad', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                                />
                            </div>

                            {isFleet && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Şirket / Kurum Adı (Opsiyonel)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Pro Lojistik A.Ş."
                                        value={registerForm.data.sirket_adi}
                                        onChange={(e) => registerForm.setData('sirket_adi', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    E-posta Adresi
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ornek@alanadi.com"
                                    value={registerForm.data.email}
                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Güvenli Şifre (En az 6 karakter)
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={registerForm.data.sifre}
                                    onChange={(e) => registerForm.setData('sifre', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-semibold"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={registerForm.processing}
                                className={`w-full py-3 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 ${
                                    isFleet
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/25'
                                }`}
                            >
                                <span>{registerForm.processing ? 'Oluşturuluyor...' : (isFleet ? 'SmartFilo Hesabı Aç' : 'Ücretsiz Garajımı Oluştur')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Security Badge */}
                <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>256-Bit SSL Uçtan Uca Şifrelenmiş Güvenli Portal</span>
                </div>
            </div>
        </div>
    );
}
