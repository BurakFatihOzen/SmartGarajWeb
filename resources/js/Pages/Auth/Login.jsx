import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Wrench, ShieldLock, UserPlus, Moon, Sun, AlertCircle } from 'lucide-react';

export default function Login() {
    const [activeTab, setActiveTab] = useState('login');
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
    });

    // Register Form
    const registerForm = useForm({
        ad_soyad: '',
        email: '',
        sifre: '',
    });

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

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative ${
            isLight 
                ? 'bg-[#f4f7f6] text-[#1a1a20]' 
                : 'bg-[#121212] text-white'
        }`}
        style={{
            backgroundImage: isLight 
                ? 'radial-gradient(circle at 50% 0%, rgba(255,140,0,0.08), #f4f7f6 65%)'
                : 'radial-gradient(circle at 50% 0%, rgba(255,140,0,0.12), #121212 65%)'
        }}>
            {/* Top Right Theme Toggle */}
            <button
                onClick={toggleTheme}
                title="Tema Değiştir"
                className="absolute top-6 right-6 p-2.5 rounded-xl border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-black transition-all shadow-md active:scale-95"
            >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Login Card */}
            <div className={`w-full max-w-[420px] rounded-2xl p-8 sm:p-10 shadow-2xl transition-all duration-300 border ${
                isLight 
                    ? 'bg-white border-slate-200 shadow-slate-200/50' 
                    : 'bg-[#1e1e24] border-[#333338] shadow-black/60'
            }`}>
                {/* Brand Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black mb-3 shadow-lg shadow-amber-500/25">
                        <Wrench className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-amber-500">SmartGaraj</h2>
                    <p className={`text-xs mt-1 tracking-wider uppercase font-medium ${
                        isLight ? 'text-slate-500' : 'text-[#8a8a93]'
                    }`}>
                        Dijital Garaj Yönetim Asistanı
                    </p>
                </div>

                {/* Nav Pills (Giriş Yap / Kayıt Ol) */}
                <div className={`flex rounded-xl p-1 mb-6 ${
                    isLight ? 'bg-slate-100' : 'bg-[#2a2a32]'
                }`}>
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                            activeTab === 'login'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20'
                                : isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Giriş Yap
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                            activeTab === 'register'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20'
                                : isLight ? 'text-slate-600 hover:text-black' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Kayıt Ol
                    </button>
                </div>

                {/* Errors Alert */}
                {(loginForm.errors.email || loginForm.errors.sifre || registerForm.errors.email || registerForm.errors.ad_soyad || registerForm.errors.sifre) && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <div>
                            {loginForm.errors.email || loginForm.errors.sifre || registerForm.errors.email || registerForm.errors.ad_soyad || registerForm.errors.sifre}
                        </div>
                    </div>
                )}

                {/* Tab 1: Giriş Yap Formu */}
                {activeTab === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5 opacity-90" htmlFor="login-email">
                                E-Posta Adresi
                            </label>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                autoComplete="username"
                                value={loginForm.data.email}
                                onChange={(e) => loginForm.setData('email', e.target.value)}
                                placeholder="ornek@mail.com"
                                className={`w-full rounded-lg px-3.5 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 border ${
                                    isLight
                                        ? 'bg-[#f8f9fa] border-slate-300 text-black placeholder-slate-400'
                                        : 'bg-[#2a2a32] border-[#333338] text-white placeholder-[#8a8a93]'
                                }`}
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold opacity-90" htmlFor="login-password">
                                    Şifre
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[11px] text-amber-500 hover:underline font-medium"
                                >
                                    Şifremi Unuttum?
                                </Link>
                            </div>
                            <input
                                type="password"
                                id="login-password"
                                name="sifre"
                                autoComplete="current-password"
                                value={loginForm.data.sifre}
                                onChange={(e) => loginForm.setData('sifre', e.target.value)}
                                placeholder="••••••••"
                                className={`w-full rounded-lg px-3.5 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 border ${
                                    isLight
                                        ? 'bg-[#f8f9fa] border-slate-300 text-black placeholder-slate-400'
                                        : 'bg-[#2a2a32] border-[#333338] text-white placeholder-[#8a8a93]'
                                }`}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginForm.processing}
                            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff8c00] to-[#ffb347] text-black font-extrabold text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2"
                        >
                            <ShieldLock className="w-4 h-4" />
                            <span>{loginForm.processing ? 'Giriş Yapılıyor...' : 'Güvenli Giriş'}</span>
                        </button>
                    </form>
                ) : (
                    /* Tab 2: Kayıt Ol Formu */
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5 opacity-90" htmlFor="reg-name">
                                Ad Soyad
                            </label>
                            <input
                                type="text"
                                id="reg-name"
                                name="ad_soyad"
                                autoComplete="name"
                                value={registerForm.data.ad_soyad}
                                onChange={(e) => registerForm.setData('ad_soyad', e.target.value)}
                                placeholder="Adınız Soyadınız"
                                className={`w-full rounded-lg px-3.5 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 border ${
                                    isLight
                                        ? 'bg-[#f8f9fa] border-slate-300 text-black placeholder-slate-400'
                                        : 'bg-[#2a2a32] border-[#333338] text-white placeholder-[#8a8a93]'
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold mb-1.5 opacity-90" htmlFor="reg-email">
                                E-Posta Adresi
                            </label>
                            <input
                                type="email"
                                id="reg-email"
                                name="email"
                                autoComplete="username"
                                value={registerForm.data.email}
                                onChange={(e) => registerForm.setData('email', e.target.value)}
                                placeholder="ornek@mail.com"
                                className={`w-full rounded-lg px-3.5 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 border ${
                                    isLight
                                        ? 'bg-[#f8f9fa] border-slate-300 text-black placeholder-slate-400'
                                        : 'bg-[#2a2a32] border-[#333338] text-white placeholder-[#8a8a93]'
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold mb-1.5 opacity-90" htmlFor="reg-password">
                                Şifre Belirleyin
                            </label>
                            <input
                                type="password"
                                id="reg-password"
                                name="sifre"
                                autoComplete="new-password"
                                value={registerForm.data.sifre}
                                onChange={(e) => registerForm.setData('sifre', e.target.value)}
                                placeholder="••••••••"
                                className={`w-full rounded-lg px-3.5 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 border ${
                                    isLight
                                        ? 'bg-[#f8f9fa] border-slate-300 text-black placeholder-slate-400'
                                        : 'bg-[#2a2a32] border-[#333338] text-white placeholder-[#8a8a93]'
                                }`}
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={registerForm.processing}
                            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ff8c00] to-[#ffb347] text-black font-extrabold text-sm tracking-wide shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>{registerForm.processing ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}</span>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
