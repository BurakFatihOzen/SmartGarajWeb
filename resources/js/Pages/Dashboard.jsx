import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AiDiagnosisModal from '@/Components/AiDiagnosisModal';
import Chart from 'react-apexcharts';
import { 
    Car, 
    Wrench, 
    PlusCircle, 
    Sparkles, 
    Calendar, 
    Shield, 
    FileText, 
    Gauge, 
    Trash2, 
    ChevronDown, 
    CheckCircle2, 
    AlertCircle, 
    AlertTriangle, 
    Coins, 
    TrendingUp,
    Clock, 
    Activity, 
    Camera, 
    Search, 
    HeartPulse, 
    Eye,
    ArrowUpRight,
    Zap,
    SlidersHorizontal,
    QrCode,
    Share2,
    Fuel
} from 'lucide-react';

export default function Dashboard({ 
    vehicles = [], 
    activeVehicle = null, 
    maintenances = [], 
    totalSpent = 0, 
    allVehiclesCount = 0, 
    monthlyStats = [], 
    categoryStats = [],
    healthScore = 90, 
    healthStatusLabel = 'Mükemmel',
    upcomingAlertsCount = 0 
}) {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedOperationFilter, setSelectedOperationFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);
    const [vehicleFilterQuery, setVehicleFilterQuery] = useState('');
    const vehicleDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (vehicleDropdownRef.current && !vehicleDropdownRef.current.contains(event.target)) {
                setIsVehicleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVehicleChange = (vehicleId) => {
        setIsVehicleDropdownOpen(false);
        router.get('/dashboard', { arac_id: vehicleId }, { preserveState: true, preserveScroll: true });
    };

    const handleDeleteMaintenance = (id) => {
        if (confirm('Bu bakım kaydını silmek istediğinizden emin misiniz?')) {
            router.delete(`/maintenances/${id}`, { preserveScroll: true });
        }
    };

    const getDaysRemaining = (dateString) => {
        if (!dateString) return null;
        const target = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
            const parts = cleanStr.split('-');
            if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
            return cleanStr;
        } catch { return dateStr; }
    };

    const filteredMaintenances = useMemo(() => {
        return maintenances.filter((item) => {
            const matchesFilter = selectedOperationFilter === 'all' || 
                item.islem_turu?.toLowerCase().includes(selectedOperationFilter.toLowerCase());
            const matchesSearch = searchQuery === '' || 
                item.islem_turu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.aciklama?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [maintenances, selectedOperationFilter, searchQuery]);

    // Monthly Area Chart
    const chartCategories = monthlyStats.length > 0 ? monthlyStats.map(s => s.month) : ['Ock', 'Şbt', 'Mrt', 'Nsn', 'Mys', 'Hzr'];
    const chartSeriesData = monthlyStats.length > 0 ? monthlyStats.map(s => s.total) : [0, 0, 0, 0, 0, totalSpent];

    const areaChartOptions = {
        chart: { 
            type: 'area', 
            height: 290, 
            toolbar: { show: false }, 
            background: 'transparent',
            animations: { enabled: true, easing: 'easeinout', speed: 700 },
            fontFamily: 'Plus Jakarta Sans, sans-serif'
        },
        colors: ['#f59e0b'],
        fill: { 
            type: 'gradient', 
            gradient: { 
                shadeIntensity: 1, 
                opacityFrom: 0.45, 
                opacityTo: 0.02, 
                stops: [0, 90, 100] 
            } 
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3.5, lineCap: 'round' },
        grid: { 
            borderColor: 'rgba(148, 163, 184, 0.12)', 
            strokeDashArray: 4, 
            xaxis: { lines: { show: false } }, 
            yaxis: { lines: { show: true } }, 
            padding: { top: 10, right: 10, left: 10 } 
        },
        xaxis: { 
            categories: chartCategories, 
            labels: { 
                style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } 
            }, 
            axisBorder: { show: false }, 
            axisTicks: { show: false } 
        },
        yaxis: { 
            labels: { 
                style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 }, 
                formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺` 
            } 
        },
        tooltip: { 
            theme: 'dark', 
            y: { formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺` } 
        },
    };

    // Category Donut Chart
    const donutLabels = categoryStats.length > 0 ? categoryStats.map(c => c.category) : ['Kategori Yok'];
    const donutSeries = categoryStats.length > 0 ? categoryStats.map(c => c.amount) : [1];
    const donutColors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#06b6d4'];

    const donutChartOptions = {
        chart: { 
            type: 'donut', 
            height: 250, 
            background: 'transparent',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
        },
        labels: donutLabels, 
        colors: donutColors,
        plotOptions: { 
            pie: { 
                donut: { 
                    size: '76%', 
                    labels: { 
                        show: true,
                        name: { show: true, fontSize: '11px', fontWeight: 600, color: '#94a3b8', offsetY: -4 },
                        value: { 
                            show: true, 
                            fontSize: '18px', 
                            fontWeight: 800, 
                            formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺` 
                        },
                        total: { 
                            show: true, 
                            label: 'Toplam Harcama', 
                            color: '#94a3b8', 
                            fontSize: '10px', 
                            fontWeight: 700, 
                            formatter: () => `${Number(totalSpent).toLocaleString('tr-TR')} ₺` 
                        }
                    } 
                } 
            } 
        },
        dataLabels: { enabled: false }, 
        stroke: { show: false }, 
        legend: { show: false },
        tooltip: { 
            theme: 'dark', 
            y: { formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺` } 
        }
    };

    // AI Insight summary
    const aiInsight = useMemo(() => {
        if (!activeVehicle) return { text: "Garajınıza araç ekleyerek akıllı takip sistemini başlatın.", type: 'info', title: 'Hoş Geldiniz' };
        const dM = getDaysRemaining(activeVehicle.muayene_bitis);
        const dS = getDaysRemaining(activeVehicle.sigorta_bitis);
        if (dM !== null && dM <= 0) return { text: `${activeVehicle.plaka} aracınızın TÜVTÜRK muayene süresi doldu! Ceza yememek için randevu alın.`, type: 'danger', title: 'Muayene Uyarısı' };
        if (dM !== null && dM <= 30) return { text: `Muayene vadesine ${dM} gün kaldı. Randevunuzu erkenden planlamanızı öneririz.`, type: 'warning', title: 'Vade Yaklaşıyor' };
        if (dS !== null && dS <= 30) return { text: `Zorunlu Trafik Sigortası bitimine ${dS} gün var. Poliçe yenileme tekliflerini inceleyin.`, type: 'warning', title: 'Sigorta Vadesi' };
        if (healthScore < 60) return { text: `${activeVehicle.marka} ${activeVehicle.model} için kritik bakım uyarıları var! AI sağlık teşhisini inceleyin.`, type: 'danger', title: healthStatusLabel || 'Kritik Dikkat Gerektiriyor' };
        if (maintenances.length > 0) return { text: `Son işlem: "${maintenances[0].islem_turu}". Araç kondisyonu ve servis takvimi güncel.`, type: 'success', title: healthStatusLabel || 'Kondisyon Mükemmel' };
        return { text: `${activeVehicle.marka} ${activeVehicle.model} için henüz bakım kaydı girilmedi. Fatura ve periyodik bakım ekleyin.`, type: 'info', title: 'İlk Bakımı Ekleyin' };
    }, [activeVehicle, maintenances, healthScore, healthStatusLabel]);

    return (
        <AppLayout title="Ana Sayfa">
            <Head title="Ana Sayfa — SmartGaraj" />
            
            <div className="space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">

                {/* ═══════════════════════════════════════════════════════════════
                    1. AI COPILOT HERO BANNER (Light & Dark mode responsive)
                ═══════════════════════════════════════════════════════════════ */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/[0.08] via-orange-500/[0.03] to-purple-500/[0.05] bg-white dark:bg-gradient-to-r dark:from-[#0f111a] dark:via-[#161a29] dark:to-[#221733] border border-amber-500/25 dark:border-amber-500/20 shadow-md dark:shadow-2xl p-5 sm:p-7 md:p-8">
                    {/* Glowing background shapes */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
                        {/* Left: AI message & branding */}
                        <div className="space-y-2.5 sm:space-y-3 min-w-0 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase">
                                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                                    <span>SmartGaraj AI Asistan</span>
                                </span>
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Canlı Teşhis Aktif</span>
                                </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug break-words">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 dark:from-amber-400 dark:via-orange-400 dark:to-amber-200">
                                    {activeVehicle ? `${activeVehicle.marka} ${activeVehicle.model}` : 'SmartGaraj Filo Portalı'}
                                </span>
                            </h2>
                            
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold shrink-0 ${
                                    aiInsight.type === 'danger' 
                                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
                                        : aiInsight.type === 'warning' 
                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                }`}>
                                    {aiInsight.title}
                                </span>
                                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                                    {aiInsight.text}
                                </p>
                            </div>
                        </div>

                        {/* Right: AI Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
                            {activeVehicle && (
                                <button
                                    onClick={() => setIsAiModalOpen(true)}
                                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer border border-purple-400/30"
                                >
                                    <Sparkles className="w-4 h-4 text-purple-200" />
                                    <span>AI Sağlık Teşhisi</span>
                                </button>
                            )}

                            <Link
                                href="/maintenances/create"
                                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-2"
                            >
                                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                                <span>Hızlı Bakım İşle</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    2. KPI STAT CARDS (CarFin / Velo Style)
                ═══════════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                    {/* Card 1: Toplam Harcama */}
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] p-5 sm:p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Toplam Harcama
                            </span>
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Coins className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                            {Number(totalSpent).toLocaleString('tr-TR')} <span className="text-lg text-amber-500">₺</span>
                        </div>
                        <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{maintenances.length} servis kaydı</span>
                        </div>
                    </div>

                    {/* Card 2: Araç Sağlık Skoru */}
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] p-5 sm:p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Kondisyon Skoru
                            </span>
                            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                                healthScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' : healthScore >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                                <HeartPulse className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-1">
                            <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                                healthScore >= 80 ? 'text-emerald-500' : healthScore >= 60 ? 'text-amber-500' : 'text-red-500'
                            }`}>
                                %{healthScore}
                            </span>
                        </div>
                        <div className={`flex items-center space-x-1.5 mt-2 text-xs font-semibold ${
                            healthScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : healthScore >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                            {healthScore >= 80 ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                            <span className="truncate">{healthStatusLabel || (healthScore >= 80 ? 'Kondisyon Mükemmel' : healthScore >= 60 ? 'Orta / Bakım Yaklaşıyor' : 'Kritik Dikkat Gerektiriyor')}</span>
                        </div>
                    </div>

                    {/* Card 3: Kilometre Göstergesi */}
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] p-5 sm:p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Güncel Sayaç
                            </span>
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Gauge className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight truncate">
                            {activeVehicle ? Number(activeVehicle.guncel_km || 0).toLocaleString('tr-TR') : '0'} <span className="text-sm font-bold text-slate-400">KM</span>
                        </div>
                        <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                            <Car className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">{activeVehicle ? activeVehicle.plaka : 'Araç Seçilmedi'}</span>
                        </div>
                    </div>

                    {/* Card 4: Filo Durumu */}
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] p-5 sm:p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Kayıtlı Filo
                            </span>
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                            {allVehiclesCount} <span className="text-sm font-bold text-slate-400">Araç</span>
                        </div>
                        <div className="flex items-center space-x-1.5 mt-2 text-xs font-semibold">
                            {upcomingAlertsCount > 0 ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center space-x-1 truncate" title="Filodaki araçlarda muayene veya sigorta süresi yaklaşan / dolmuş işlem sayısı">
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{upcomingAlertsCount} Muayene/Sigorta Vadesi Yakın</span>
                                </span>
                            ) : (
                                <span className="text-emerald-500 flex items-center space-x-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>Tüm vadeler güncel</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    3. ACTIVE VEHICLE HERO SHOWCASE (GoDrive & CarFin)
                ═══════════════════════════════════════════════════════════════ */}
                {activeVehicle ? (
                    <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden">
                        {/* Header: Selector & Quick Action Bar */}
                        <div className="px-5 sm:px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/[0.01]">
                            <div className="flex items-center space-x-2">
                                <Car className="w-5 h-5 text-amber-500" />
                                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Aktif Araç Kartı
                                </span>
                            </div>

                            {/* Custom Vehicle Selector Dropdown */}
                            <div className="relative w-full sm:w-auto" ref={vehicleDropdownRef}>
                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">Araç Değiştir:</span>
                                    
                                    {/* Trigger Button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                                        className="w-full sm:w-auto flex items-center justify-between space-x-3 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#1a1d29] hover:bg-slate-50 dark:hover:bg-[#202433] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white shadow-sm transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center space-x-2 truncate">
                                            <span className="badge-plate text-[10px] px-1.5 py-0.5 rounded shrink-0">
                                                {activeVehicle.plaka}
                                            </span>
                                            <span className="truncate">{activeVehicle.marka} {activeVehicle.model}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isVehicleDropdownOpen ? 'rotate-180 text-amber-500' : ''}`} />
                                    </button>
                                </div>

                                {/* Floating Dropdown Menu */}
                                {isVehicleDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-full sm:w-80 rounded-2xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/10 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                                        {/* Search Filter Input */}
                                        <div className="relative mb-2">
                                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                            <input
                                                type="text"
                                                value={vehicleFilterQuery}
                                                onChange={(e) => setVehicleFilterQuery(e.target.value)}
                                                placeholder="Plaka veya model ara..."
                                                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                autoFocus
                                            />
                                        </div>

                                        {/* Scrollable Vehicle List */}
                                        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                                            {vehicles
                                                .filter(v => 
                                                    (v.marka + ' ' + v.model + ' ' + v.plaka)
                                                        .toLowerCase()
                                                        .includes(vehicleFilterQuery.toLowerCase())
                                                )
                                                .map((v) => {
                                                    const isSelected = v.id === activeVehicle.id;
                                                    return (
                                                        <button
                                                            key={v.id}
                                                            type="button"
                                                            onClick={() => handleVehicleChange(v.id)}
                                                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-black'
                                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04] font-medium'
                                                            }`}
                                                        >
                                                            <div className="flex items-center space-x-2.5 min-w-0">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                                                                    <Car className="w-4 h-4 text-amber-500" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-xs truncate font-bold text-slate-900 dark:text-white">
                                                                        {v.marka} {v.model}
                                                                    </div>
                                                                    <div className="flex items-center space-x-1.5 mt-0.5">
                                                                        <span className="badge-plate text-[9px] px-1 py-0.5 rounded font-mono font-bold">
                                                                            {v.plaka}
                                                                        </span>
                                                                        {v.yil && (
                                                                            <span className="text-[10px] text-slate-400">
                                                                                • {v.yil}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {isSelected && (
                                                                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                        </div>

                                        {/* Footer Add Vehicle Link */}
                                        <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/[0.06]">
                                            <Link
                                                href="/vehicles/create"
                                                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                                            >
                                                <PlusCircle className="w-3.5 h-3.5" />
                                                <span>+ Yeni Araç Ekle</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Hero Content */}
                        <div className="p-5 sm:p-7 md:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch">
                            {/* Left: Vehicle Image with Plate Badge */}
                            <div className="lg:w-[380px] shrink-0 flex flex-col">
                                <label className="relative flex-1 min-h-[200px] sm:min-h-[220px] rounded-2xl bg-slate-100 dark:bg-[#161824] border border-slate-200 dark:border-white/[0.06] overflow-hidden group cursor-pointer flex items-center justify-center">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file && activeVehicle) {
                                                const fd = new FormData();
                                                fd.append('fotograf', file);
                                                router.post(`/vehicles/${activeVehicle.id}/upload-photo`, fd, { forceFormData: true, preserveScroll: true });
                                            }
                                        }} 
                                        className="hidden" 
                                    />
                                    {activeVehicle.fotograf_url ? (
                                        <div className="relative w-full h-full min-h-[220px] sm:min-h-[250px] flex items-center justify-center overflow-hidden bg-slate-900/60 dark:bg-black/60 rounded-2xl">
                                            {/* Subtle Ambient Blurred Backdrop */}
                                            <img 
                                                src={activeVehicle.fotograf_url} 
                                                alt="" 
                                                aria-hidden="true"
                                                className="absolute inset-0 w-full h-full object-cover blur-lg opacity-35 scale-110" 
                                            />
                                            {/* Main sharp full vehicle photo with object-contain */}
                                            <img 
                                                src={activeVehicle.fotograf_url} 
                                                alt={`${activeVehicle.marka} ${activeVehicle.model}`} 
                                                className="relative z-10 w-full h-full max-h-[270px] object-contain group-hover:scale-105 transition-transform duration-500 p-1" 
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
                                            <Car className="w-16 h-16 mb-2 opacity-50" />
                                            <span className="text-xs font-bold">Fotoğraf Yüklemek İçin Tıklayın</span>
                                        </div>
                                    )}
                                    
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1">
                                        <Camera className="w-7 h-7 text-amber-400" />
                                        <span className="text-xs font-bold">Fotoğrafı Güncelle</span>
                                    </div>

                                    {/* Floating Plate Badge */}
                                    <div className="absolute bottom-3 left-3 z-10">
                                        <div className="badge-plate text-xs shadow-xl">
                                            {activeVehicle.plaka}
                                        </div>
                                    </div>
                                </label>
                            </div>

                            {/* Right: Specs, Deadlines and CTAs */}
                            <div className="flex-1 flex flex-col justify-between space-y-5 sm:space-y-6">
                                <div>
                                    {/* Tag Pills */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                            {activeVehicle.ruhsat_tipi || 'Otomobil (Hususi)'}
                                        </span>
                                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                            Model: {activeVehicle.yil || '-'}
                                        </span>
                                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                            Motor: {activeVehicle.motor || 'Belirtilmedi'}
                                        </span>
                                    </div>

                                    {/* Vehicle Name */}
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                                        {activeVehicle.marka} {activeVehicle.model}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                                        Şasi No (VIN): <span className="font-mono text-slate-600 dark:text-slate-300">{activeVehicle.sasi_no || 'Kayıt Edilmedi'}</span>
                                    </p>
                                </div>

                                {/* Deadline Countdown Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                                    {[
                                        { label: 'TÜVTÜRK Muayene', date: activeVehicle.muayene_bitis, icon: Shield },
                                        { label: 'Trafik Sigortası', date: activeVehicle.sigorta_bitis, icon: FileText },
                                        { label: 'Kasko Poliçesi', date: activeVehicle.kasko_bitis, icon: Sparkles },
                                    ].map((d, i) => {
                                        const days = getDaysRemaining(d.date);
                                        const isExpired = days !== null && days <= 0;
                                        const isWarning = days !== null && days > 0 && days <= 30;
                                        
                                        const colorClass = days === null 
                                            ? 'text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.04]'
                                            : isExpired 
                                                ? 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
                                                : isWarning 
                                                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
                                                    : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';

                                        return (
                                            <div key={i} className={`p-3.5 rounded-2xl border ${colorClass} transition-all`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                        {d.label}
                                                    </span>
                                                    <d.icon className="w-3.5 h-3.5 opacity-60" />
                                                </div>
                                                <div className="text-sm sm:text-base font-black font-mono">
                                                    {days === null ? 'Girilmedi' : isExpired ? 'Süresi Doldu!' : `${days} Gün Kaldı`}
                                                </div>
                                                <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                                                    {formatDate(d.date)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Quick Action Button Toolbar */}
                                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                                    <Link
                                        href={`/maintenances/create?arac_id=${activeVehicle.id}`}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                                    >
                                        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                                        <span>Bakım Ekle</span>
                                    </Link>

                                    <a
                                        href={activeVehicle.qr_token ? `/verify/${activeVehicle.qr_token}` : `/vehicles/${activeVehicle.id}/print-report`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                                    >
                                        <QrCode className="w-4 h-4 text-amber-500" />
                                        <span>Dijital Pasaport</span>
                                    </a>

                                    <Link
                                        href="/vehicles"
                                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                                    >
                                        <Eye className="w-4 h-4 text-blue-500" />
                                        <span>Tüm Garaj</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] p-8 sm:p-12 text-center shadow-sm">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                            <Car className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1.5">Garajınız Henüz Boş</h3>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 max-w-sm mx-auto mb-6">
                            İlk aracınızı ekleyerek ruhsat tarama, bakım takibi ve AI teşhis sisteminden faydalanın.
                        </p>
                        <Link
                            href="/vehicles/create"
                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95 transition-all"
                        >
                            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                            <span>İlk Aracını Ekle</span>
                        </Link>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    4. ANALYTICS & CHARTS SECTION (Velo & Car Rent AI)
                ═══════════════════════════════════════════════════════════════ */}
                {activeVehicle && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
                        {/* Area Chart: Monthly spending (3 cols) */}
                        <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] p-5 sm:p-6 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                                        <TrendingUp className="w-4 h-4 text-amber-500" />
                                        <span>Aylık Masraf Eğrisi</span>
                                    </h4>
                                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                        Son 6 aylık harcamalar
                                    </p>
                                </div>
                                <span className="text-xs font-mono font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-amber-500/20">
                                    {Number(totalSpent).toLocaleString('tr-TR')} ₺
                                </span>
                            </div>
                            <Chart 
                                options={areaChartOptions} 
                                series={[{ name: 'Servis Masrafı', data: chartSeriesData }]} 
                                type="area" 
                                height={290} 
                            />
                        </div>

                        {/* Donut Chart: Category breakdown (2 cols) */}
                        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] p-5 sm:p-6 shadow-sm flex flex-col justify-between overflow-hidden">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center space-x-2">
                                        <Coins className="w-4 h-4 text-blue-500" />
                                        <span>Masraf Dağılımı</span>
                                    </h4>
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                        Kategoriye Göre
                                    </span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Chart 
                                        options={donutChartOptions} 
                                        series={donutSeries} 
                                        type="donut" 
                                        height={240} 
                                    />
                                </div>
                            </div>

                            {/* Category Percentages List */}
                            {categoryStats.length > 0 && (
                                <div className="space-y-2 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] mt-4">
                                    {categoryStats.slice(0, 4).map((c, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center space-x-2 min-w-0">
                                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: donutColors[i % donutColors.length] }} />
                                                <span className="text-slate-600 dark:text-slate-300 font-semibold truncate max-w-[130px] sm:max-w-[160px]">{c.category}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 shrink-0">
                                                <span className="font-mono text-slate-400 dark:text-slate-500">{Number(c.amount).toLocaleString('tr-TR')} ₺</span>
                                                <span className="font-mono font-extrabold text-slate-900 dark:text-white">%{c.percentage}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    5. SERVICE & MAINTENANCE HISTORY LOG (GoDrive & Velo)
                ═══════════════════════════════════════════════════════════════ */}
                {activeVehicle && (
                    <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden">
                        {/* Table Header Controls */}
                        <div className="p-5 sm:p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01]">
                            <div>
                                <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                                    <Wrench className="w-4 h-4 text-amber-500" />
                                    <span>Servis & Bakım Kayıtları</span>
                                </h4>
                                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                                    {activeVehicle.plaka} — Toplam {filteredMaintenances.length} işlem listeleniyor
                                </p>
                            </div>

                            {/* Search & Add action */}
                            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-60">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                                    <input 
                                        type="text" 
                                        value={searchQuery} 
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="İşlem veya parça ara..."
                                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm" 
                                    />
                                </div>
                                <Link 
                                    href={`/maintenances/create?arac_id=${activeVehicle.id}`}
                                    className="shrink-0 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-md hover:-translate-y-0.5 active:scale-95 transition-all flex items-center space-x-1.5"
                                >
                                    <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                                    <span>Ekle</span>
                                </Link>
                            </div>
                        </div>

                        {/* Filter category tabs */}
                        <div className="px-5 sm:px-6 py-3 bg-slate-50/30 dark:bg-transparent flex flex-wrap gap-1.5 sm:gap-2 border-b border-slate-200/80 dark:border-white/[0.06]">
                            {[
                                { id: 'all', label: 'Tüm Kayıtlar' },
                                { id: 'yağ', label: 'Periyodik & Yağ' },
                                { id: 'fren', label: 'Fren & Balata' },
                                { id: 'ağır', label: 'Ağır Bakım / Triger' },
                                { id: 'filtre', label: 'Filtre Değişimi' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => setSelectedOperationFilter(f.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        selectedOperationFilter === f.id
                                            ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                                            : 'bg-white dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.06]'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* Data Table */}
                        {filteredMaintenances.length > 0 ? (
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-xs min-w-[580px]">
                                    <thead className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.06]">
                                        <tr>
                                            <th className="px-5 sm:px-6 py-4">Tarih</th>
                                            <th className="px-5 sm:px-6 py-4">İşlem Türü</th>
                                            <th className="px-5 sm:px-6 py-4">Sayaç (KM)</th>
                                            <th className="px-5 sm:px-6 py-4">Tutar (TL)</th>
                                            <th className="px-5 sm:px-6 py-4">Açıklama / Parça</th>
                                            <th className="px-5 sm:px-6 py-4 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {filteredMaintenances.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-bold">
                                                    {formatDate(item.islem_tarihi)}
                                                </td>
                                                <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                        {item.islem_turu}
                                                    </span>
                                                </td>
                                                <td className="px-5 sm:px-6 py-4 whitespace-nowrap font-mono font-bold text-slate-600 dark:text-slate-300">
                                                    {item.islem_km ? `${Number(item.islem_km).toLocaleString('tr-TR')} KM` : '-'}
                                                </td>
                                                <td className="px-5 sm:px-6 py-4 whitespace-nowrap font-mono font-black text-slate-900 dark:text-white">
                                                    {Number(item.maliyet_tl || 0).toLocaleString('tr-TR')} ₺
                                                </td>
                                                <td className="px-5 sm:px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate font-medium">
                                                    {item.aciklama || '-'}
                                                </td>
                                                <td className="px-5 sm:px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteMaintenance(item.id)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                                        title="Kaydı Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-16 text-center text-slate-400 dark:text-slate-600">
                                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Kayıt bulunamadı</p>
                                <p className="text-xs text-slate-400 mt-1">Arama kriterini değiştirin veya yeni bakım kaydı ekleyin.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Diagnosis Modal */}
            {activeVehicle && (
                <AiDiagnosisModal 
                    isOpen={isAiModalOpen} 
                    onClose={() => setIsAiModalOpen(false)} 
                    vehicleId={activeVehicle.id} 
                    vehiclePlate={activeVehicle.plaka}
                    vehicleName={`${activeVehicle.marka} ${activeVehicle.model}`} 
                />
            )}
        </AppLayout>
    );
}
