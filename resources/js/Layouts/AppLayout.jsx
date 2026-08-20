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
    Home,
    ChevronLeft,
    Sun,
    Moon,
    Sparkles,
    Menu,
    Shield,
    FileText,
    Bell,
    Layers,
    Search,
    Clock,
    Activity,
    QrCode
} from 'lucide-react';
import ProfileModal from '@/Components/ProfileModal';

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const currentUrl = usePage().url;
    const user = auth?.user;
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [isDark, setIsDark] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [headerSearch, setHeaderSearch] = useState('');

    // Initialize theme
    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light-mode');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            setIsDark(false);
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light-mode');
        } else {
            setIsDark(true);
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light-mode');
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
    const isMaintenanceActive = currentUrl.startsWith('/maintenances');

    const navItems = [
        { 
            href: '/dashboard', 
            label: 'Ana Sayfa', 
            desc: 'Genel bakış & AI analiz',
            icon: Home, 
            active: isPanelActive,
            gradient: 'from-amber-500 to-orange-500',
            badgeColor: 'text-amber-500'
        },
        { 
            href: '/vehicles', 
            label: 'Garajım (Filo)', 
            desc: 'Kayıtlı tüm araçlar',
            icon: Car, 
            active: isGarageActive,
            gradient: 'from-blue-500 to-indigo-600',
            badgeColor: 'text-blue-500'
        },
        { 
            href: '/vehicles/create', 
            label: 'Yeni Araç Ekle', 
            desc: 'Ruhsat ile hızlı kayıt',
            icon: PlusCircle, 
            active: isAddVehicleActive,
            gradient: 'from-emerald-500 to-teal-600',
            badgeColor: 'text-emerald-500'
        },
        { 
            href: '/maintenances/create', 
            label: 'Bakım Kaydı İşle', 
            desc: 'Servis ve masraf girişi',
            icon: Wrench, 
            active: isMaintenanceActive,
            gradient: 'from-purple-500 to-pink-600',
            badgeColor: 'text-purple-500'
        },
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full bg-white dark:bg-[#0c0d14] text-slate-800 dark:text-slate-200 transition-colors duration-200">
            {/* Logo Area */}
            <div className={`flex items-center h-[72px] sm:h-[76px] px-5 border-b border-slate-200/80 dark:border-white/[0.06] ${
                sidebarCollapsed && !isMobile ? 'justify-center px-2' : 'space-x-3.5'
            }`}>
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 shrink-0">
                    <Wrench className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c0d14]"></span>
                </div>
                {(!sidebarCollapsed || isMobile) && (
                    <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                            <span className="text-[17px] font-black tracking-tight text-slate-900 dark:text-white leading-none">
                                Smart<span className="text-amber-500">Garaj</span>
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase block mt-1">
                            Akıllı Araç Portalı
                        </span>
                    </div>
                )}
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 px-3.5 py-5 space-y-2 overflow-y-auto">
                {(!sidebarCollapsed || isMobile) && (
                    <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        YÖNETİM MENÜSÜ
                    </div>
                )}
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                        className={`group relative flex items-center rounded-2xl transition-all duration-200 ${
                            sidebarCollapsed && !isMobile ? 'justify-center p-3' : 'px-3.5 py-3 space-x-3.5'
                        } ${
                            item.active
                                ? 'bg-amber-50 dark:bg-gradient-to-r dark:from-amber-500/[0.12] dark:to-orange-500/[0.04] text-slate-900 dark:text-white border border-amber-200 dark:border-amber-500/20 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                        }`}
                        title={sidebarCollapsed ? item.label : undefined}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                            item.active
                                ? `bg-gradient-to-tr ${item.gradient} text-white shadow-md shadow-amber-500/20 scale-105`
                                : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 group-hover:scale-105 group-hover:bg-slate-200 dark:group-hover:bg-white/[0.08]'
                        }`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        {(!sidebarCollapsed || isMobile) && (
                            <div className="flex-1 text-left min-w-0">
                                <div className={`text-[13px] font-bold truncate ${item.active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {item.label}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-medium">
                                    {item.desc}
                                </div>
                            </div>
                        )}
                        {item.active && (!sidebarCollapsed || isMobile) && (
                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* AI Assistant Quick Card (Only if expanded) */}
            {(!sidebarCollapsed || isMobile) && (
                <div className="p-3.5 mx-3 mb-4 rounded-2xl bg-gradient-to-br from-amber-500/[0.08] via-orange-500/[0.04] to-transparent border border-amber-500/20">
                    <div className="flex items-center space-x-2 mb-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                            Akıllı Teşhis Aktif
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Arıza belirtisi veya bakım ihtiyacı durumunda anında teşhis alın.
                    </p>
                </div>
            )}

            {/* User Profile & Theme Toggle footer */}
            <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.06] space-y-2 bg-slate-50/50 dark:bg-white/[0.01]">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center rounded-xl p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition-all cursor-pointer ${
                        sidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between px-3.5'
                    }`}
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/[0.06] flex items-center justify-center text-amber-500">
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
                        </div>
                        {(!sidebarCollapsed || isMobile) && (
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {isDark ? 'Açık Mod\'a Geç' : 'Koyu Mod\'a Geç'}
                            </span>
                        )}
                    </div>
                    {(!sidebarCollapsed || isMobile) && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400">
                            {isDark ? 'Dark' : 'Light'}
                        </span>
                    )}
                </button>

                {/* User Menu */}
                <button
                    onClick={() => { setIsProfileOpen(true); isMobile && setMobileMenuOpen(false); }}
                    className={`w-full flex items-center rounded-xl p-2.5 text-left hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition-all cursor-pointer group ${
                        sidebarCollapsed && !isMobile ? 'justify-center' : 'space-x-3 px-3'
                    }`}
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xs font-black text-slate-950 uppercase shrink-0 shadow-md">
                        {user?.ad_soyad?.charAt(0) || 'U'}
                    </div>
                    {(!sidebarCollapsed || isMobile) && (
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                                {user?.ad_soyad || 'Kullanıcı'}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                {user?.email}
                            </div>
                        </div>
                    )}
                </button>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer ${
                        sidebarCollapsed && !isMobile ? 'justify-center' : 'space-x-2.5 px-3'
                    }`}
                >
                    <LogOut className="w-4 h-4" />
                    {(!sidebarCollapsed || isMobile) && (
                        <span className="text-xs font-semibold">Çıkış Yap</span>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 flex transition-colors duration-200 selection:bg-amber-500 selection:text-black">
            
            {/* ===== DESKTOP SIDEBAR ===== */}
            <aside className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-slate-200 dark:border-white/[0.06] shadow-xl dark:shadow-2xl transition-all duration-300 ${
                sidebarCollapsed ? 'w-[78px]' : 'w-[268px]'
            }`}>
                <SidebarContent />
                
                {/* Collapse / Expand Toggle Button */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-white dark:bg-[#161822] border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-500/50 transition-all shadow-md cursor-pointer z-50"
                    title={sidebarCollapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
                >
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </aside>

            {/* ===== MOBILE DRAWER SIDEBAR ===== */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div 
                        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
                        onClick={() => setMobileMenuOpen(false)} 
                    />
                    <aside className="relative w-[285px] max-w-[85vw] h-full shadow-2xl z-50">
                        <SidebarContent isMobile />
                    </aside>
                </div>
            )}

            {/* ===== MAIN CONTENT WRAPPER ===== */}
            <div className={`flex-1 flex flex-col min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-all duration-300 ${
                sidebarCollapsed ? 'md:ml-[78px]' : 'md:ml-[268px]'
            }`}>
                
                {/* ═══════════════════════════════════════════════════════════════
                    TOP HEADER BAR (Clean, non-repetitive, high-utility)
                ═══════════════════════════════════════════════════════════════ */}
                <header className="sticky top-0 z-30 h-[68px] sm:h-[76px] bg-white/80 dark:bg-[#090a0f]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between px-4 sm:px-6 md:px-8">
                    {/* Left: Mobile Toggle & Page Title */}
                    <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer shrink-0"
                            title="Menüyü Aç"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                                {title || 'Ana Sayfa'}
                            </h1>
                            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden sm:block">
                                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Right: Informative AI Status & Direct Digital Passport Link */}
                    <div className="flex items-center space-x-3 shrink-0">
                        {/* Live Status Badge */}
                        <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Sistem Çevrimiçi</span>
                        </div>

                        {/* Garajım Quick Link */}
                        <Link
                            href="/vehicles"
                            className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                        >
                            <Car className="w-3.5 h-3.5 text-amber-500" />
                            <span>Garaj Filosu</span>
                        </Link>
                    </div>
                </header>

                {/* Flash Messages */}
                {showFlash && (flash?.success || flash?.error || flash?.info) && (
                    <div className="px-4 sm:px-6 md:px-8 pt-4">
                        {flash.success && (
                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span>{flash.success}</span>
                                </div>
                                <button onClick={() => setShowFlash(false)} className="p-1 hover:opacity-75 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {flash.error && (
                            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300 text-sm font-semibold flex items-center justify-between shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                    <span>{flash.error}</span>
                                </div>
                                <button onClick={() => setShowFlash(false)} className="p-1 hover:opacity-75 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Page Main Content */}
                <main className="flex-1 w-full max-w-full px-3.5 sm:px-6 md:px-8 py-5 sm:py-6 pb-24 md:pb-8">
                    {children}
                </main>
            </div>

            {/* ===== MOBILE BOTTOM TAB BAR ===== */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.08] px-2 py-2 flex items-center justify-around shadow-lg">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center space-y-1 px-3 py-1.5 rounded-xl transition-all ${
                            item.active
                                ? 'text-amber-500 font-bold scale-105'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] tracking-tight">{item.label.split(' ')[0]}</span>
                    </Link>
                ))}
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
