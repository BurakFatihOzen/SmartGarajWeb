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
    QrCode,
    Building2,
    ShieldAlert,
    Truck,
    UserCheck,
    Fuel
} from 'lucide-react';
import ProfileModal from '@/Components/ProfileModal';

export default function AppLayout({ children, title, activeMode }) {
    const { auth, flash } = usePage().props;
    const currentUrl = usePage().url;
    const user = auth?.user;
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [isDark, setIsDark] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Is current user a Fleet / Corporate account?
    const isFleetMode = user?.hesap_turu === 'filo' || user?.rol === 'filo' || activeMode === 'fleet';

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
    const isFleetActive = currentUrl === '/fleet';
    const isDriversActive = currentUrl.startsWith('/fleet/drivers');
    const isFinesActive = currentUrl.startsWith('/fleet/fines');
    const isFuelActive = currentUrl.startsWith('/fleet/fuel');
    const isAccidentsActive = currentUrl.startsWith('/fleet/accidents') || currentUrl === '/accidents';
    const isGarageActive = currentUrl.startsWith('/vehicles') && currentUrl !== '/vehicles/create';
    const isAddVehicleActive = currentUrl === '/vehicles/create';
    const isMaintenanceActive = currentUrl.startsWith('/maintenances');

    // Dynamic nav items based on user account type
    const navItems = isFleetMode ? [
        { 
            href: '/fleet', 
            label: 'Filo Portalı', 
            desc: 'KPI & Operasyon Paneli',
            icon: Building2, 
            active: isFleetActive,
            gradient: 'from-blue-600 to-indigo-600',
            badgeColor: 'text-blue-500'
        },
        { 
            href: '/vehicles', 
            label: 'Filo Araçları', 
            desc: 'Tüm araç listesi & durum',
            icon: Car, 
            active: isGarageActive,
            gradient: 'from-amber-500 to-orange-500',
            badgeColor: 'text-amber-500'
        },
        { 
            href: '/fleet/drivers', 
            label: 'Sürücüler & Zimmet', 
            desc: 'Ehliyet & zimmet takibi',
            icon: UserCheck, 
            active: isDriversActive,
            gradient: 'from-cyan-600 to-blue-600',
            badgeColor: 'text-cyan-500'
        },
        { 
            href: '/fleet/fines', 
            label: 'Trafik Cezaları', 
            desc: '%25 indirim & ihlal takibi',
            icon: ShieldAlert, 
            active: isFinesActive,
            gradient: 'from-red-600 to-rose-600',
            badgeColor: 'text-red-500'
        },
        { 
            href: '/fleet/fuel', 
            label: 'Yakıt & Tüketim', 
            desc: 'Fiş & litre başı analiz',
            icon: Fuel, 
            active: isFuelActive,
            gradient: 'from-emerald-600 to-teal-600',
            badgeColor: 'text-emerald-500'
        },
        { 
            href: '/fleet/accidents', 
            label: 'Kaza & Hasar Portalı', 
            desc: 'Sigorta, eksper & dosya',
            icon: ShieldAlert, 
            active: isAccidentsActive,
            gradient: 'from-rose-600 to-red-600',
            badgeColor: 'text-rose-500'
        },
        { 
            href: '/vehicles/create', 
            label: 'Yeni Araç Ekle', 
            desc: 'Ruhsat ile filo kaydı',
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
    ] : [
        { 
            href: '/dashboard', 
            label: 'Garajım (Ana Sayfa)', 
            desc: 'Genel bakış & AI analiz',
            icon: Home, 
            active: isPanelActive,
            gradient: 'from-amber-500 to-orange-500',
            badgeColor: 'text-amber-500'
        },
        { 
            href: '/vehicles', 
            label: 'Tüm Araçlarım', 
            desc: 'Kayıtlı araç listesi',
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
        { 
            href: '/fines', 
            label: 'Trafik & HGS Cezaları', 
            desc: '%25 indirim & ihlal takibi',
            icon: ShieldAlert, 
            active: isFinesActive,
            gradient: 'from-red-600 to-rose-600',
            badgeColor: 'text-red-500'
        },
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full bg-white dark:bg-[#0c0d14] text-slate-800 dark:text-slate-200 transition-colors duration-200">
            {/* Logo Area */}
            <Link 
                href={isFleetMode ? "/fleet" : "/dashboard"}
                onClick={() => isMobile && setMobileMenuOpen(false)}
                className={`flex items-center h-[72px] sm:h-[76px] px-5 border-b border-slate-200/80 dark:border-white/[0.06] hover:opacity-90 transition-opacity cursor-pointer group ${
                    sidebarCollapsed && !isMobile ? 'justify-center px-2' : 'space-x-3.5'
                }`}
                title="Ana Sayfaya Git"
            >
                <div className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl font-black shadow-lg shrink-0 group-hover:scale-105 transition-transform ${
                    isFleetMode
                        ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 text-white shadow-blue-600/25'
                        : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 shadow-amber-500/25'
                }`}>
                    {isFleetMode ? <Building2 className="w-5 h-5 stroke-[2.5]" /> : <Wrench className="w-5 h-5 text-slate-950 stroke-[2.5]" />}
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c0d14]"></span>
                </div>
                {(!sidebarCollapsed || isMobile) && (
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center space-x-1.5">
                            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">Smart</span>
                            <span className={`text-lg font-black tracking-tight leading-tight ${isFleetMode ? 'text-blue-500' : 'text-amber-500'}`}>
                                {isFleetMode ? 'Filo' : 'Garaj'}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold border ${
                                isFleetMode 
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            }`}>
                                {isFleetMode ? 'PRO' : 'v2.5'}
                            </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase truncate">
                            {isFleetMode ? (user?.sirket_adi || 'Kurumsal Filo Portalı') : 'Kişisel Araç Asistanı'}
                        </span>
                    </div>
                )}
            </Link>

            {/* Account Type Indicator Badge */}
            {(!sidebarCollapsed || isMobile) && (
                <div className="px-4 pt-3.5 pb-1">
                    <div className={`px-3 py-2 rounded-2xl border flex items-center justify-between text-xs ${
                        isFleetMode
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                    }`}>
                        <div className="flex items-center space-x-2 font-bold">
                            {isFleetMode ? <Building2 className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                            <span className="truncate">{isFleetMode ? (user?.sirket_adi || 'Kurumsal Filo') : 'Bireysel Hesap'}</span>
                        </div>
                        <span className="text-[10px] uppercase font-black tracking-wider opacity-80">
                            {isFleetMode ? 'PRO' : 'AKTİF'}
                        </span>
                    </div>
                </div>
            )}

            {/* Nav Menu */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = item.active;

                    return (
                        <Link
                            key={index}
                            href={item.href}
                            onClick={() => isMobile && setMobileMenuOpen(false)}
                            className={`group relative flex items-center rounded-2xl transition-all duration-200 ${
                                sidebarCollapsed && !isMobile ? 'justify-center p-3' : 'p-3 space-x-3.5'
                            } ${
                                isActive
                                    ? (isFleetMode 
                                        ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-950 dark:text-white font-extrabold border border-blue-500/30 shadow-sm'
                                        : 'bg-amber-500/10 dark:bg-amber-500/15 text-slate-950 dark:text-white font-extrabold border border-amber-500/30 shadow-sm')
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.04]'
                            }`}
                            title={sidebarCollapsed && !isMobile ? item.label : undefined}
                        >
                            <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all shrink-0 ${
                                isActive 
                                    ? `bg-gradient-to-tr ${item.gradient} text-white font-black shadow-md` 
                                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-500/10'
                            }`}>
                                <Icon className={`w-4 h-4 ${isActive && !isFleetMode ? 'text-slate-950' : ''}`} />
                            </div>

                            {(!sidebarCollapsed || isMobile) && (
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs tracking-tight ${isActive ? 'text-slate-950 dark:text-white font-black' : 'font-semibold'}`}>
                                        {item.label}
                                    </div>
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                        {item.desc}
                                    </div>
                                </div>
                            )}

                            {isActive && (
                                <div className={`absolute right-2 w-1.5 h-6 rounded-full ${isFleetMode ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* User & Controls Footer */}
            <div className="p-3 border-t border-slate-200/80 dark:border-white/[0.06] space-y-2 bg-slate-50/50 dark:bg-white/[0.01]">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer ${
                        sidebarCollapsed && !isMobile ? 'justify-center' : 'space-x-2.5 px-3'
                    }`}
                    title={isDark ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
                >
                    {isDark ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                        <Moon className="w-4 h-4 text-slate-700" />
                    )}
                    {(!sidebarCollapsed || isMobile) && (
                        <span className="text-xs font-bold">{isDark ? 'Açık Tema' : 'Koyu Tema'}</span>
                    )}
                </button>

                {/* Profile Card Button */}
                <button
                    onClick={() => setIsProfileOpen(true)}
                    className={`w-full flex items-center rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer group text-left ${
                        sidebarCollapsed && !isMobile ? 'justify-center' : 'space-x-2.5 px-3'
                    }`}
                >
                    <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs shrink-0 shadow-sm ${
                        isFleetMode
                            ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                            : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950'
                    }`}>
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
                
                {/* TOP HEADER BAR */}
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
                            <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-2">
                                <span>{title || (isFleetMode ? 'SmartFilo Operasyon Portalı' : 'Ana Sayfa')}</span>
                                {isFleetMode ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase">
                                        Kurumsal Filo
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase">
                                        Bireysel
                                    </span>
                                )}
                            </h1>
                            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden sm:block">
                                {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Right: Quick Controls & Theme Toggle */}
                    <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
                        {/* Live Status Badge */}
                        <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{isFleetMode ? 'Filo Telemetrisi Aktif' : 'Sistem Çevrimiçi'}</span>
                        </div>

                        {/* Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition-all cursor-pointer"
                            title={isDark ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
                        >
                            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                        </button>
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
                        {flash.info && (
                            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-800 dark:text-blue-300 text-sm font-semibold flex items-center justify-between shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span>{flash.info}</span>
                                </div>
                                <button onClick={() => setShowFlash(false)} className="p-1 hover:opacity-75 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    {children}
                </main>
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
