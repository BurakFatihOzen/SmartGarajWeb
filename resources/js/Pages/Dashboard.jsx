import React, { useState, useMemo } from 'react';
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
    QrCode,
    Printer,
    Upload,
    ArrowUpRight,
    Search,
    SlidersHorizontal,
    HeartPulse,
    HelpCircle,
    ExternalLink
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
    upcomingAlertsCount = 0
}) {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedOperationFilter, setSelectedOperationFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const handleVehicleChange = (vehicleId) => {
        router.get('/dashboard', { arac_id: vehicleId }, { preserveState: true, preserveScroll: true });
    };

    const handleDeleteMaintenance = (id) => {
        if (confirm('Bu bakım kaydını ve faturasını silmek istediğinizden emin misiniz?')) {
            router.delete(`/maintenances/${id}`, { preserveScroll: true });
        }
    };

    // Helper: Days remaining calculator
    const getDaysRemaining = (dateString) => {
        if (!dateString) return null;
        const target = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Helper: Clean Turkish Date Formatter
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const cleanStr = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
            const parts = cleanStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}.${parts[1]}.${parts[0]}`;
            }
            return cleanStr;
        } catch {
            return dateStr;
        }
    };

    // Filtered Maintenance Records
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

    // Apex Area Chart (Monthly Spending Trend)
    const chartCategories = monthlyStats.length > 0 
        ? monthlyStats.map(s => s.month) 
        : ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
    
    const chartSeriesData = monthlyStats.length > 0 
        ? monthlyStats.map(s => s.total) 
        : [0, 0, 0, 0, 0, totalSpent];

    const areaChartOptions = {
        chart: {
            type: 'area',
            height: 240,
            toolbar: { show: false },
            background: 'transparent',
            animations: { enabled: true, easing: 'easeinout', speed: 600 },
        },
        colors: ['#f59e0b'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.02,
                stops: [0, 90, 100],
            },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3.5 },
        grid: {
            borderColor: 'rgba(150, 150, 150, 0.1)',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        xaxis: {
            categories: chartCategories,
            labels: { 
                style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif' } 
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif' },
                formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺`,
            },
        },
        tooltip: {
            theme: 'dark',
            y: { formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺` },
        },
    };

    const areaChartSeries = [
        {
            name: 'Bakım & Servis Masrafı',
            data: chartSeriesData,
        },
    ];

    // Apex Donut Chart (Category Distribution)
    const donutLabels = categoryStats.length > 0 
        ? categoryStats.map(c => c.category) 
        : ['Periyodik Bakım', 'Fren & Yürüyen', 'Ağır Bakım', 'Muayene & Harç'];
    
    const donutSeries = categoryStats.length > 0 
        ? categoryStats.map(c => c.amount) 
        : [totalSpent > 0 ? totalSpent : 1];

    const donutChartOptions = {
        chart: {
            type: 'donut',
            height: 240,
            background: 'transparent',
        },
        labels: donutLabels,
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899'],
        plotOptions: {
            pie: {
                donut: {
                    size: '72%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '12px', fontWeight: 600, color: '#94a3b8' },
                        value: { 
                            show: true, 
                            fontSize: '16px', 
                            fontWeight: 800, 
                            color: '#ffffff',
                            formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺`
                        },
                        total: {
                            show: true,
                            label: 'Toplam Harcama',
                            color: '#94a3b8',
                            fontSize: '11px',
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

    // AI Insight Generator
    const aiInsightText = useMemo(() => {
        if (!activeVehicle) return "Garajınızda henüz aktif bir araç tanımlanmadı. Yeni araç ekleyerek başlayabilirsiniz.";
        
        const daysToMuayene = getDaysRemaining(activeVehicle.muayene_bitis);
        const daysToSigorta = getDaysRemaining(activeVehicle.sigorta_bitis);
        
        if (daysToMuayene !== null && daysToMuayene <= 30) {
            return `Dikkat: ${activeVehicle.plaka} plakalı aracınızın TÜVTÜRK muayenesine ${daysToMuayene <= 0 ? 'günü geçti!' : `${daysToMuayene} gün kaldı!`}`;
        }
        if (daysToSigorta !== null && daysToSigorta <= 30) {
            return `Hatırlatma: ${activeVehicle.plaka} sigorta poliçenizin yenilenmesine ${daysToSigorta <= 0 ? 'günü geçti!' : `${daysToSigorta} gün kaldı.`}`;
        }
        if (maintenances.length > 0) {
            return `SmartGaraj AI: ${activeVehicle.marka} ${activeVehicle.model} aracınızın servis geçmişi düzenli. Son işlemde ${maintenances[0].islem_turu} yapıldı.`;
        }
        return `SmartGaraj AI: ${activeVehicle.marka} ${activeVehicle.model} için henüz bakım faturası işlenmedi. Faturanızı taratarak servis pasaportunu başlatın.`;
    }, [activeVehicle, maintenances]);

    return (
        <AppLayout title="Kontrol Paneli">
            <Head title="Kontrol Paneli - SmartGaraj" />

            <div className="space-y-6">
                
                {/* 1. TOP AI COPILOT GREETING BANNER (CarFin & Car Rent AI Style) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-purple-500/10 dark:from-amber-500/15 dark:via-purple-500/10 dark:to-transparent border border-amber-500/20 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl backdrop-blur-xs">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/25 shrink-0">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                    SmartGaraj AI Co-Pilot
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                                    Canlı Teşhis
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium leading-relaxed">
                                {aiInsightText}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto shrink-0">
                        {activeVehicle && (
                            <button
                                onClick={() => setIsAiModalOpen(true)}
                                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>🧠 AI Sağlık Teşhisi</span>
                            </button>
                        )}
                        <Link
                            href="/maintenances/create"
                            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Hızlı Bakım İşle</span>
                        </Link>
                    </div>
                </div>

                {/* 2. STATS KPI METRIC CARDS (Rondesignlab / CarFin Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total Spent */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Toplam Servis Masrafı
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                <Coins className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                                {Number(totalSpent).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                            </div>
                            <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="text-amber-500 font-bold">{activeVehicle ? activeVehicle.plaka : 'Garaj'}</span>
                                <span>&bull; {maintenances.length} işlem kaydı</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Vehicle Health Score */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Araç Sağlık Skoru
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                <HeartPulse className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline space-x-2">
                            <div className={`text-2xl font-black font-mono tracking-tight ${
                                healthScore >= 80 ? 'text-emerald-500 dark:text-emerald-400' : 
                                healthScore >= 60 ? 'text-amber-500' : 'text-red-500'
                            }`}>
                                %{healthScore}
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                {healthScore >= 85 ? 'Mükemmel Kondisyon' : healthScore >= 65 ? 'İyi Durumda' : 'Bakım Gerekli'}
                            </span>
                        </div>
                        <div className="mt-3 w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${
                                    healthScore >= 80 ? 'bg-emerald-500' : 
                                    healthScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${healthScore}%` }} 
                            />
                        </div>
                    </div>

                    {/* Card 3: Current Odometer (KM) */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Güncel Sayaç
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                <Gauge className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                                {activeVehicle ? Number(activeVehicle.guncel_km || 0).toLocaleString('tr-TR') : 0} <span className="text-sm font-semibold text-slate-500">KM</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>{activeVehicle ? `${activeVehicle.marka} ${activeVehicle.model}` : 'Araç Yok'}</span>
                                <span className="text-blue-500 font-bold">{activeVehicle?.yil || 'Model'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Fleet & Upcoming Alerts */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Filo & Kritik Vadeler
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <Car className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between">
                            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                                {allVehiclesCount} <span className="text-sm font-semibold text-slate-500">Araç</span>
                            </div>
                            {upcomingAlertsCount > 0 ? (
                                <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center space-x-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>{upcomingAlertsCount} Vade Yaklaştı</span>
                                </span>
                            ) : (
                                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                    Tüm Vadeler Güncel
                                </span>
                            )}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Tüm garaj yönetimi</span>
                            <Link href="/vehicles" className="text-purple-600 dark:text-purple-400 hover:underline font-bold">
                                Araçlar &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 3. HERO ACTIVE VEHICLE SHOWCASE (GoDrive & CarFin Style) */}
                {activeVehicle ? (
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-xl relative overflow-hidden">
                        {/* Background subtle radial ambient */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Vehicle Media & Core Info */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                <label 
                                    className="relative w-32 h-24 sm:w-40 sm:h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-md shrink-0 cursor-pointer group/photo bg-slate-100 dark:bg-[#181b24]"
                                    title="Fotoğrafı Değiştir / Yükle"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file && activeVehicle) {
                                                const formData = new FormData();
                                                formData.append('fotograf', file);
                                                router.post(`/vehicles/${activeVehicle.id}/upload-photo`, formData, {
                                                    forceFormData: true,
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    {activeVehicle.fotograf_url ? (
                                        <img
                                            src={activeVehicle.fotograf_url}
                                            alt={activeVehicle.plaka}
                                            className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                            <Car className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-1" />
                                            <span className="text-[10px] font-bold">Fotoğraf Ekle</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                        <Camera className="w-5 h-5 text-amber-400 mb-0.5" />
                                        <span>Fotoğrafı Değiştir</span>
                                    </div>
                                </label>

                                <div className="space-y-2.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Turkish License Plate Badge */}
                                        <span className="badge-plate text-sm">
                                            {activeVehicle.plaka}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                                            {activeVehicle.yil || 'Model Yılı Yok'}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                            {activeVehicle.ruhsat_tipi || 'Otomobil'}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {activeVehicle.marka} {activeVehicle.model}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-2 font-medium">
                                            <span>Motor: <strong className="text-slate-800 dark:text-slate-200">{activeVehicle.motor || 'Standart'}</strong></span>
                                            <span>&bull;</span>
                                            <span>Şasi (VIN): <strong className="font-mono text-slate-700 dark:text-slate-300">{activeVehicle.sasi_no || 'Belirtilmedi'}</strong></span>
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <Link
                                            href={`/maintenances/create?arac_id=${activeVehicle.id}`}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
                                        >
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            <span>Bakım Ekle</span>
                                        </Link>

                                        <a
                                            href={activeVehicle.qr_token ? `/verify/${activeVehicle.qr_token}` : `/vehicles/${activeVehicle.id}/print-report`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-500 hover:text-white transition-all flex items-center space-x-1.5 shadow-2xs"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>Dijital Pasaport</span>
                                        </a>

                                        <Link
                                            href="/vehicles"
                                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all shadow-2xs"
                                        >
                                            Garaj Listesi
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Quick Switcher & Deadlines */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[280px]">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                        Aktif Aracı Seçin
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={activeVehicle.id}
                                            onChange={(e) => handleVehicleChange(e.target.value)}
                                            className="w-full appearance-none bg-slate-50 dark:bg-[#1a1d27] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer pr-10 shadow-2xs"
                                        >
                                            {vehicles.map((v) => (
                                                <option key={v.id} value={v.id} className="bg-white dark:bg-[#13151b] text-slate-900 dark:text-white">
                                                    {v.marka} {v.model} ({v.plaka})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Yasal Süreç Sayaç Kutuları */}
                                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                                    {/* Muayene */}
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                                        <span className="block font-bold text-slate-500 dark:text-slate-400 uppercase">Muayene</span>
                                        {activeVehicle.muayene_bitis ? (
                                            (() => {
                                                const days = getDaysRemaining(activeVehicle.muayene_bitis);
                                                return (
                                                    <span className={`text-xs font-bold font-mono mt-0.5 block ${
                                                        days < 0 ? 'text-red-500' : days < 30 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                        {days < 0 ? 'Geçti' : `${days} Gün`}
                                                    </span>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-slate-400 font-medium">-</span>
                                        )}
                                    </div>

                                    {/* Sigorta */}
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                                        <span className="block font-bold text-slate-500 dark:text-slate-400 uppercase">Sigorta</span>
                                        {activeVehicle.sigorta_bitis ? (
                                            (() => {
                                                const days = getDaysRemaining(activeVehicle.sigorta_bitis);
                                                return (
                                                    <span className={`text-xs font-bold font-mono mt-0.5 block ${
                                                        days < 0 ? 'text-red-500' : days < 30 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                        {days < 0 ? 'Geçti' : `${days} Gün`}
                                                    </span>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-slate-400 font-medium">-</span>
                                        )}
                                    </div>

                                    {/* Kasko */}
                                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                                        <span className="block font-bold text-slate-500 dark:text-slate-400 uppercase">Kasko</span>
                                        {activeVehicle.kasko_bitis ? (
                                            (() => {
                                                const days = getDaysRemaining(activeVehicle.kasko_bitis);
                                                return (
                                                    <span className={`text-xs font-bold font-mono mt-0.5 block ${
                                                        days < 0 ? 'text-red-500' : days < 30 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                        {days < 0 ? 'Geçti' : `${days} Gün`}
                                                    </span>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-slate-400 font-medium">Yok</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/10 space-y-4 shadow-xl">
                        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
                            <Car className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Garajınızda henüz araç bulunmuyor</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bakımları ve yasal süreleri takip etmek için ilk aracınızı ekleyin.</p>
                        </div>
                        <Link
                            href="/vehicles/create"
                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>İlk Aracınızı Ekleyin</span>
                        </Link>
                    </div>
                )}

                {/* 4. DUAL ANALYTICS & VISUALIZATION (Velo & CarFin Style) */}
                {activeVehicle && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Monthly Spending Trend Area Chart */}
                        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aylık Harcama Trendi</h4>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Son 6 aylık servis harcama eğrisi</span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                    Toplam: {Number(totalSpent).toLocaleString('tr-TR')} ₺
                                </span>
                            </div>
                            <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={240} />
                        </div>

                        {/* Category Breakdown Donut Chart */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-lg flex flex-col justify-between space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Masraf Dağılımı</h4>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Kategori</span>
                                </div>

                                <Chart options={donutChartOptions} series={donutSeries} type="donut" height={200} />
                            </div>

                            {/* Category Percentages Pills */}
                            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
                                {categoryStats.slice(0, 3).map((c, i) => (
                                    <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                        <span className="truncate pr-2">{c.category}</span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">%{c.percentage}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. SERVICE & MAINTENANCE HISTORY HUB (GoDrive Style) */}
                {activeVehicle && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-xl space-y-6">
                        {/* Header & Filter Controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                                        Servis, Bakım & Fatura Geçmişi
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {activeVehicle.plaka} için sisteme işlenen tüm işlemler ve parçalar
                                    </p>
                                </div>
                            </div>

                            {/* Search & Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative w-full sm:w-64">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="İşlem veya parça ara..."
                                        className="w-full bg-slate-50 dark:bg-[#1a1d27] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                                    />
                                </div>

                                <Link
                                    href={`/maintenances/create?arac_id=${activeVehicle.id}`}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Yeni Bakım Ekle</span>
                                </Link>
                            </div>
                        </div>

                        {/* Quick Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-2">
                            {[
                                { id: 'all', label: 'Tüm Kayıtlar' },
                                { id: 'yağ', label: 'Periyodik Sıvı & Yağ' },
                                { id: 'fren', label: 'Fren & Balata' },
                                { id: 'ağır', label: 'Ağır Bakım / Triger' },
                                { id: 'filtre', label: 'Filtreler' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedOperationFilter(tab.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                                        selectedOperationFilter === tab.id
                                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1d27] text-slate-600 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/10'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        {filteredMaintenances.length > 0 ? (
                            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-white/[0.03] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                                        <tr>
                                            <th className="px-4 py-3.5">İşlem Tarihi</th>
                                            <th className="px-4 py-3.5">İşlem / Servis Türü</th>
                                            <th className="px-4 py-3.5">Servis Kilometresi</th>
                                            <th className="px-4 py-3.5">Toplam Tutar</th>
                                            <th className="px-4 py-3.5">Parça / Açıklama Detayları</th>
                                            <th className="px-4 py-3.5 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/80 dark:divide-white/[0.06]">
                                        {filteredMaintenances.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-900 dark:text-slate-200">
                                                    {formatDate(item.islem_tarihi)}
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                                        {item.islem_turu}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {item.islem_km ? `${Number(item.islem_km).toLocaleString('tr-TR')} KM` : '-'}
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap font-mono font-black text-slate-900 dark:text-white">
                                                    {Number(item.maliyet_tl || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 max-w-sm truncate font-medium">
                                                    {item.aciklama || '-'}
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteMaintenance(item.id)}
                                                        title="Kaydı Sil"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
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
                            <div className="py-12 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/10 space-y-2">
                                <FileText className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Kayıt bulunamadı</p>
                                <p className="text-xs text-slate-500">Arama kriterinize uygun veya henüz işlenmiş bir bakım kaydı yok.</p>
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
