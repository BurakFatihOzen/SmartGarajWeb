import React, { useState } from 'react';
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
    Coins, 
    TrendingUp,
    Clock,
    Activity,
    Camera,
    QrCode,
    Printer,
    Upload
} from 'lucide-react';

export default function Dashboard({ 
    vehicles = [], 
    activeVehicle = null, 
    maintenances = [], 
    totalSpent = 0, 
    allVehiclesCount = 0,
    monthlyStats = []
}) {
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedOperationFilter, setSelectedOperationFilter] = useState('all');

    const handleVehicleChange = (vehicleId) => {
        router.get('/dashboard', { arac_id: vehicleId }, { preserveState: true, preserveScroll: true });
    };

    const handleDeleteMaintenance = (id) => {
        if (confirm('Bu bakım kaydını silmek istediğinizden emin misiniz?')) {
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

    // Chart Configuration
    const chartCategories = monthlyStats.length > 0 
        ? monthlyStats.map(s => s.month) 
        : ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
    
    const chartSeriesData = monthlyStats.length > 0 
        ? monthlyStats.map(s => s.total) 
        : [0, 0, 0, 0, 0, totalSpent];

    const chartOptions = {
        chart: {
            type: 'area',
            height: 220,
            toolbar: { show: false },
            background: 'transparent',
            animations: { enabled: true, easing: 'easeinout', speed: 800 },
        },
        colors: ['#f59e0b'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [0, 95, 100],
            },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.06)',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        xaxis: {
            categories: chartCategories,
            labels: { style: { colors: '#94a3b8', fontSize: '11px', fontFamily: 'Plus Jakarta Sans' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: '#94a3b8', fontSize: '11px', fontFamily: 'Plus Jakarta Sans' },
                formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺`,
            },
        },
        tooltip: {
            theme: 'dark',
            y: { formatter: (val) => `${Number(val).toLocaleString('tr-TR')} ₺` },
        },
    };

    const chartSeries = [
        {
            name: 'Bakım Harcaması',
            data: chartSeriesData,
        },
    ];

    const filteredMaintenances = selectedOperationFilter === 'all'
        ? maintenances
        : maintenances.filter(m => m.islem_turu?.toLowerCase().includes(selectedOperationFilter.toLowerCase()));

    return (
        <AppLayout title="Kontrol Paneli">
            <Head title="Kontrol Paneli" />

            <div className="space-y-6">
                {/* 1. TOP STATS ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Active Vehicle Spent */}
                    <div className="p-5 rounded-2xl bg-[#13151b] border border-white/[0.08] relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Seçili Araç Harcaması
                                </span>
                                <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
                                    {Number(totalSpent).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                <Coins className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-400">
                            <span className="text-amber-400 font-semibold">{activeVehicle ? activeVehicle.plaka : 'Araç Seçilmedi'}</span>
                            <span>için toplam servis masrafı</span>
                        </div>
                    </div>

                    {/* Card 2: Total Vehicles */}
                    <div className="p-5 rounded-2xl bg-[#13151b] border border-white/[0.08] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Garajdaki Araçlar
                                </span>
                                <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
                                    {allVehiclesCount} <span className="text-sm font-normal text-slate-400">Araç</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                <Car className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Aktif filo yönetimi</span>
                            <Link href="/vehicles" className="text-blue-400 hover:underline font-semibold">Tümünü Gör &rarr;</Link>
                        </div>
                    </div>

                    {/* Card 3: Total Service Records */}
                    <div className="p-5 rounded-2xl bg-[#13151b] border border-white/[0.08] relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Toplam Servis Kaydı
                                </span>
                                <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                                    {maintenances.length} <span className="text-sm font-normal text-slate-400">İşlem</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                <Wrench className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] text-slate-400 flex items-center space-x-1">
                            <span className="text-emerald-400 font-semibold">PostgreSQL</span>
                            <span>üzerinde kayıtlı geçmiş</span>
                        </div>
                    </div>

                    {/* Card 4: AI & DB Status */}
                    <div className="p-5 rounded-2xl bg-[#13151b] border border-white/[0.08] relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Sistem & AI Motoru
                                </span>
                                <div className="text-sm font-bold text-white mt-2 flex items-center space-x-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Aktif & Nominal</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-3 text-[11px] text-slate-400">
                            SmartDiagnosis AI V1.2 hazır
                        </div>
                    </div>
                </div>

                {/* 2. HERO ACTIVE VEHICLE BANNER */}
                {activeVehicle ? (
                    <div className="hero-vehicle-card p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#161922] to-[#101217] border border-white/[0.1] shadow-2xl relative overflow-hidden">
                        {/* Glow accent */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Left: Plate, Photo & Vehicle Info */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                <label 
                                    className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg shrink-0 cursor-pointer group/photo bg-[#181b24]"
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
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                            <Car className="w-8 h-8 text-slate-600 mb-1" />
                                            <span className="text-[9px] font-bold">Fotoğraf Ekle</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                        <Camera className="w-5 h-5 text-amber-400 mb-0.5" />
                                        <span>Fotoğrafı Değiştir</span>
                                    </div>
                                </label>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {/* Turkish Plate Badge */}
                                        <span className="badge-plate text-sm sm:text-base">
                                            {activeVehicle.plaka}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] text-slate-300 border border-white/10">
                                            {activeVehicle.yil || 'Belirtilmedi'} Model
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            {activeVehicle.ruhsat_tipi || 'Otomobil'}
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                            {activeVehicle.marka} {activeVehicle.model}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex items-center space-x-2">
                                            <span>Motor: <strong className="text-slate-200">{activeVehicle.motor || 'Standart'}</strong></span>
                                            <span>&bull;</span>
                                            <span>KM: <strong className="text-amber-400 font-mono">{Number(activeVehicle.guncel_km || 0).toLocaleString('tr-TR')} KM</strong></span>
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                                        <Link
                                            href={`/maintenances/create?arac_id=${activeVehicle.id}`}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
                                        >
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            <span>Bakım Ekle</span>
                                        </Link>

                                        <button
                                            onClick={() => setIsAiModalOpen(true)}
                                            className="btn-ai-diagnosis px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-extrabold text-xs hover:bg-purple-600 hover:text-white active:scale-95 transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                            <span>AI Analiz</span>
                                        </button>

                                        <a
                                            href={activeVehicle.qr_token ? `/verify/${activeVehicle.qr_token}` : `/vehicles/${activeVehicle.id}/print-report`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs hover:bg-blue-500 hover:text-white transition-all flex items-center space-x-1.5 shadow-sm"
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            <span>QR Pasaport</span>
                                        </a>

                                        <Link
                                            href="/vehicles"
                                            className="px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 font-semibold text-xs hover:bg-white/10 transition-all"
                                        >
                                            Garaj
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Vehicle Switcher & Legal Badges */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:min-w-[280px]">
                                {/* Vehicle Switcher Dropdown */}
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                        Aktif Aracı Değiştir
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={activeVehicle.id}
                                            onChange={(e) => handleVehicleChange(e.target.value)}
                                            className="w-full appearance-none bg-[#1c202b] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer pr-10"
                                        >
                                            {vehicles.map((v) => (
                                                <option key={v.id} value={v.id} className="bg-[#13151b] text-white">
                                                    {v.marka} {v.model} ({v.plaka})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Yasal Süreç Sayaçları */}
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Muayene */}
                                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Muayene</span>
                                        {activeVehicle.muayene_bitis ? (
                                            (() => {
                                                const days = getDaysRemaining(activeVehicle.muayene_bitis);
                                                return (
                                                    <span className={`text-xs font-bold font-mono mt-0.5 block ${
                                                        days < 0 ? 'text-red-400' : days < 30 ? 'text-amber-400' : 'text-emerald-400'
                                                    }`}>
                                                        {days < 0 ? 'Günü Geçti' : `${days} Gün`}
                                                    </span>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-[11px] text-slate-500 font-medium">-</span>
                                        )}
                                    </div>

                                    {/* Sigorta */}
                                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Sigorta</span>
                                        {activeVehicle.sigorta_bitis ? (
                                            (() => {
                                                const days = getDaysRemaining(activeVehicle.sigorta_bitis);
                                                return (
                                                    <span className={`text-xs font-bold font-mono mt-0.5 block ${
                                                        days < 0 ? 'text-red-400' : days < 30 ? 'text-amber-400' : 'text-emerald-400'
                                                    }`}>
                                                        {days < 0 ? 'Günü Geçti' : `${days} Gün`}
                                                    </span>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-[11px] text-slate-500 font-medium">-</span>
                                        )}
                                    </div>

                                    {/* Kasko */}
                                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Kasko</span>
                                        {activeVehicle.kasko_bitis ? (
                                            (() => {
                                                const days = getDaysRemaining(activeVehicle.kasko_bitis);
                                                return (
                                                    <span className={`text-xs font-bold font-mono mt-0.5 block ${
                                                        days < 0 ? 'text-red-400' : days < 30 ? 'text-amber-400' : 'text-emerald-400'
                                                    }`}>
                                                        {days < 0 ? 'Günü Geçti' : `${days} Gün`}
                                                    </span>
                                                );
                                            })()
                                        ) : (
                                            <span className="text-[11px] text-slate-500 font-medium">-</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Garage State */
                    <div className="p-12 rounded-3xl bg-[#13151b] border border-white/10 text-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                            <Car className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Garajınızda henüz araç bulunmuyor</h3>
                            <p className="text-sm text-slate-400 mt-1">Bakımları ve yasal süreleri takip etmek için ilk aracınızı ekleyin.</p>
                        </div>
                        <Link
                            href="/vehicles/create"
                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Yeni Araç Ekle</span>
                        </Link>
                    </div>
                )}

                {/* 3. CHART & ANALYTICS SECTION */}
                {activeVehicle && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#13151b] border border-white/[0.08]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Aylık Masraf & Bakım Trendi</h4>
                                        <span className="text-[11px] text-slate-400">Son periyot harcama dağılımı</span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                    Toplam: {Number(totalSpent).toLocaleString('tr-TR')} ₺
                                </span>
                            </div>
                            <Chart options={chartOptions} series={chartSeries} type="area" height={220} />
                        </div>

                        {/* Quick Tips & Telemetry */}
                        <div className="p-6 rounded-3xl bg-[#13151b] border border-white/[0.08] flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white">Akıllı Asistan Notları</h4>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5 text-xs">
                                    <span className="font-bold text-slate-200">Periyodik Sıvı Bakımı</span>
                                    <p className="text-slate-400 leading-relaxed">
                                        Dizel ve benzinli motorlarda her 10.000 - 15.000 KM'de yağ ve filtre değişimi motor ömrünü 2 katına çıkarır.
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5 text-xs">
                                    <span className="font-bold text-slate-200">Muayene & Sigorta</span>
                                    <p className="text-slate-400 leading-relaxed">
                                        Yasal süre bitimine 15 gün kala sistem bildirim uyarısı üretmektedir.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAiModalOpen(true)}
                                className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-200 font-bold text-xs border border-white/10 transition-colors flex items-center justify-center space-x-2"
                            >
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span>Detaylı AI Teşhis Raporunu Aç</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. MAINTENANCE HISTORY TABLE */}
                {activeVehicle && (
                    <div className="p-6 rounded-3xl bg-[#13151b] border border-white/[0.08] space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white">Servis & Bakım Geçmişi</h4>
                                    <span className="text-xs text-slate-400">Bu araca ait tüm müdahaleler</span>
                                </div>
                            </div>

                            <Link
                                href={`/maintenances/create?arac_id=${activeVehicle.id}`}
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500 hover:text-black transition-all"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Yeni Kayıt Ekle</span>
                            </Link>
                        </div>

                        {/* Table */}
                        {filteredMaintenances.length > 0 ? (
                            <div className="overflow-x-auto rounded-2xl border border-white/10">
                                <table className="w-full text-left text-xs text-slate-300">
                                    <thead className="bg-white/[0.03] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                                        <tr>
                                            <th className="px-4 py-3.5">İşlem Tarihi</th>
                                            <th className="px-4 py-3.5">İşlem Türü</th>
                                            <th className="px-4 py-3.5">Kilometre</th>
                                            <th className="px-4 py-3.5">Maliyet</th>
                                            <th className="px-4 py-3.5">Açıklama / Parçalar</th>
                                            <th className="px-4 py-3.5 text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.06]">
                                        {filteredMaintenances.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-200">
                                                    {formatDate(item.islem_tarihi)}
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        {item.islem_turu}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                                                    {item.islem_km ? `${Number(item.islem_km).toLocaleString('tr-TR')} KM` : '-'}
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-white">
                                                    {Number(item.maliyet_tl || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                </td>
                                                <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">
                                                    {item.aciklama || '-'}
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteMaintenance(item.id)}
                                                        title="Kaydı Sil"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
                            <div className="py-12 text-center rounded-2xl bg-white/[0.01] border border-white/10 space-y-2">
                                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                                <p className="text-sm font-semibold text-slate-300">Henüz bakım veya servis kaydı bulunmuyor</p>
                                <p className="text-xs text-slate-500">Aracınıza yapılan işlemleri ekleyerek masraflarınızı takip edebilirsiniz.</p>
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
