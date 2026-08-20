import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    Wrench, 
    Car, 
    PlusCircle, 
    LogOut, 
    User, 
    CheckCircle2, 
    AlertTriangle, 
    X,
    LayoutDashboard,
    ChevronDown,
    Sun,
    Moon
} from 'lucide-react';
import ProfileModal from '@/Components/ProfileModal';

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light') {
            setIsLight(true);
            document.documentElement.classList.add('light-mode');
            document.body.classList.add('light-mode');
            document.documentElement.classList.remove('dark');
        } else {
            setIsLight(false);
            document.documentElement.classList.remove('light-mode');
            document.body.classList.remove('light-mode');
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isLight) {
            setIsLight(false);
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.remove('light-mode');
            document.body.classList.remove('light-mode');
            document.documentElement.classList.add('dark');
        } else {
            setIsLight(true);
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.add('light-mode');
            document.body.classList.add('light-mode');
            document.documentElement.classList.remove('dark');
        }
    };

    useEffect(() => {
        if (flash?.success || flash?.error || flash?.info) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-[#0b0c10] text-[#f1f5f9] flex flex-col selection:bg-amber-500 selection:text-black">
            {/* Top Glowing Ambient Line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 bg-[#0f1117]/90 backdrop-blur-md border-b border-white/[0.08]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-8">
                            <Link href="/dashboard" className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                                    <Wrench className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black tracking-tight text-white flex items-center">
                                        Smart<span className="text-amber-400">Garaj</span>
                                    </span>
                                    <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                                        Araç & Bakım Portalı
                                    </span>
                                </div>
                            </Link>

                            {/* Nav Links */}
                            <nav className="hidden md:flex items-center space-x-1">
                                <Link
                                    href="/dashboard"
                                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center space-x-2"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                                    <span>Panel</span>
                                </Link>

                                <Link
                                    href="/vehicles"
                                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center space-x-2"
                                >
                                    <Car className="w-4 h-4 text-blue-400" />
                                    <span>Garajım</span>
                                </Link>

                                <Link
                                    href="/vehicles/create"
                                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center space-x-2"
                                >
                                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                                    <span>Araç Ekle</span>
                                </Link>
                            </nav>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                title={isLight ? 'Karanlık Moda Geç' : 'Aydınlık Moda Geç'}
                                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/25 active:scale-90 transition-all duration-200"
                            >
                                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </button>

                            <Link
                                href="/maintenances/create"
                                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs hover:bg-amber-500 hover:text-black transition-all shadow-sm active:scale-95"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Bakım Ekle</span>
                            </Link>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-amber-500/40 hover:bg-amber-500/5 active:scale-95 transition-all shadow-sm"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xs font-black text-black uppercase shadow">
                                        {user?.ad_soyad?.charAt(0) || 'U'}
                                    </div>
                                    <span className="hidden sm:inline text-xs font-bold text-slate-200">
                                        {user?.ad_soyad}
                                    </span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>

                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-20"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#13151b] border border-white/10 shadow-2xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                                            <div className="px-4 py-2 border-b border-white/10 mb-1">
                                                <div className="text-xs font-bold text-white truncate">{user?.ad_soyad}</div>
                                                <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    setIsProfileOpen(true);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 flex items-center space-x-2.5 transition-all"
                                            >
                                                <User className="w-4 h-4 text-amber-400" />
                                                <span>Profil & Güvenlik</span>
                                            </button>

                                            <div className="border-t border-white/10 my-1" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 flex items-center space-x-2.5 transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Çıkış Yap</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Flash Notifications */}
            {showFlash && (flash?.success || flash?.error || flash?.info) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
                    {flash.success && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-between shadow-lg">
                            <div className="flex items-center space-x-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="p-1 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {flash.error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold flex items-center justify-between shadow-lg">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="p-1 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] bg-[#0c0d12] py-6 text-center text-xs text-slate-500 mt-auto">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div>
                        SmartGaraj &copy; {new Date().getFullYear()} &bull; Kurumsal Araç & Bakım Yönetim Portalı
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span>PostgreSQL 18 &bull; Laravel 11 &bull; React SPA</span>
                    </div>
                </div>
            </footer>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
            />
        </div>
    );
}
