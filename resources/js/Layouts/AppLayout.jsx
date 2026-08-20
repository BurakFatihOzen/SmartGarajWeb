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
    Moon,
    Sparkles
} from 'lucide-react';
import ProfileModal from '@/Components/ProfileModal';

export default function AppLayout({ children, title }) {
    const { auth, flash, url } = usePage().props;
    const currentUrl = usePage().url;
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

    const isPanelActive = currentUrl === '/dashboard' || currentUrl === '/';
    const isGarageActive = currentUrl.startsWith('/vehicles') && currentUrl !== '/vehicles/create';
    const isAddVehicleActive = currentUrl === '/vehicles/create';

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#0b0c10] text-slate-900 dark:text-[#f1f5f9] flex flex-col selection:bg-amber-500 selection:text-black transition-colors duration-200">
            {/* Top Glowing Ambient Line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70" />

            {/* Navigation Header */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0f1117]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Main Nav */}
                        <div className="flex items-center space-x-8">
                            <Link href="/dashboard" className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                                    <Wrench className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                                        Smart<span className="text-amber-500">Garaj</span>
                                    </span>
                                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase -mt-1">
                                        AI Destekli Araç Portalı
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Nav Links */}
                            <nav className="hidden md:flex items-center space-x-1.5">
                                <Link
                                    href="/dashboard"
                                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
                                        isPanelActive 
                                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs' 
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                                    }`}
                                >
                                    <LayoutDashboard className="w-4 h-4 text-amber-500" />
                                    <span>Panel</span>
                                </Link>

                                <Link
                                    href="/vehicles"
                                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
                                        isGarageActive 
                                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-xs' 
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                                    }`}
                                >
                                    <Car className="w-4 h-4 text-blue-500" />
                                    <span>Garajım</span>
                                </Link>

                                <Link
                                    href="/vehicles/create"
                                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
                                        isAddVehicleActive 
                                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs' 
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                                    }`}
                                >
                                    <PlusCircle className="w-4 h-4 text-emerald-500" />
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
                                className="p-2.5 rounded-xl bg-slate-100 dark:bg-amber-500/10 border border-slate-300 dark:border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/25 active:scale-90 transition-all duration-200 cursor-pointer shadow-2xs"
                            >
                                {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
                            </button>

                            <Link
                                href="/maintenances/create"
                                className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Bakım Ekle</span>
                            </Link>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.1] hover:border-amber-500/40 hover:bg-amber-500/5 active:scale-95 transition-all shadow-2xs cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xs font-black text-black uppercase shadow-xs">
                                        {user?.ad_soyad?.charAt(0) || 'U'}
                                    </div>
                                    <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200">
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
                                        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#13151b] border border-slate-200 dark:border-white/10 shadow-2xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                                            <div className="px-4 py-2 border-b border-slate-200 dark:border-white/10 mb-1">
                                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.ad_soyad}</div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    setIsProfileOpen(true);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 hover:bg-amber-500/10 flex items-center space-x-2.5 transition-all cursor-pointer"
                                            >
                                                <User className="w-4 h-4 text-amber-500" />
                                                <span>Profil & Güvenlik</span>
                                            </button>

                                            <div className="border-t border-slate-200 dark:border-white/10 my-1" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 flex items-center space-x-2.5 transition-all cursor-pointer"
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
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center justify-between shadow-lg">
                            <div className="flex items-center space-x-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="p-1 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {flash.error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold flex items-center justify-between shadow-lg">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="p-1 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0c0d12] py-6 pb-24 md:pb-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div>
                        SmartGaraj &copy; {new Date().getFullYear()} &bull; Kurumsal Araç & Bakım Yönetim Portalı
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span>PostgreSQL 18 &bull; Laravel 11 &bull; React SPA</span>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Navigation Bar (App-Like) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#13151b]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl transition-all ${
                        isPanelActive ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-[10px]">Panel</span>
                </Link>

                <Link
                    href="/vehicles"
                    className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl transition-all ${
                        isGarageActive ? 'text-blue-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Car className="w-5 h-5" />
                    <span className="text-[10px]">Garajım</span>
                </Link>

                <Link
                    href="/vehicles/create"
                    className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl transition-all ${
                        isAddVehicleActive ? 'text-emerald-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="text-[10px]">Araç Ekle</span>
                </Link>

                <Link
                    href="/maintenances/create"
                    className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl transition-all ${
                        currentUrl.startsWith('/maintenances') ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Wrench className="w-5 h-5" />
                    <span className="text-[10px]">Bakım Ekle</span>
                </Link>

                <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl text-slate-400 hover:text-amber-500 transition-all cursor-pointer"
                >
                    <User className="w-5 h-5" />
                    <span className="text-[10px]">Profil</span>
                </button>
            </div>

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
            />
        </div>
    );
}
