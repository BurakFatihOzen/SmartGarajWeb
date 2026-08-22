import React, { useState, useMemo, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { 
    Car, 
    Wrench, 
    ShieldCheck, 
    AlertTriangle, 
    TrendingUp, 
    Building2, 
    UserCheck, 
    Search, 
    Filter, 
    PlusCircle, 
    Calendar, 
    Clock, 
    DollarSign, 
    FileText, 
    QrCode, 
    MoreVertical, 
    CheckCircle2, 
    ShieldAlert, 
    Sparkles, 
    Download,
    Edit3,
    Truck,
    Layers,
    User,
    Gauge,
    Fuel,
    Cog,
    Pencil,
    Eye,
    AlertCircle,
    UserPlus,
    UserMinus,
    ArrowRightLeft,
    Phone,
    ChevronDown,
    Shield
} from 'lucide-react';
import AccidentModal from '../../Components/AccidentModal';
import EditVehicleModal from '../../Components/EditVehicleModal';
import FleetOperationsModal from '../../Components/FleetOperationsModal';
import { 
    FLEET_STATUS_OPTIONS, 
    FLEET_OWNERSHIP_OPTIONS, 
    FLEET_DEPARTMENT_OPTIONS 
} from '@/Utils/fleetConstants';

export default function FleetDashboard({ 
    vehicles = [], 
    drivers = [], 
    kpis = {}, 
    departmentDistribution = {}, 
    brandDistribution = {} 
}) {
    const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedDept, setSelectedDept] = useState('all');

    // Modals state
    const [isFleetOpsOpen, setIsFleetOpsOpen] = useState(false);
    const [fleetOpsInitialTab, setFleetOpsInitialTab] = useState('status');
    const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
    const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);
    const [selectedVehicleForAccident, setSelectedVehicleForAccident] = useState(null);

    const showcaseRef = useRef(null);

    // Active vehicle computation
    const activeVehicle = useMemo(() => {
        if (!vehicles.length) return null;
        return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
    }, [vehicles, selectedVehicleId]);

    // Filtered Vehicles
    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const matchesSearch = 
                v.plaka.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${v.marka} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (v.zimmet_surucu_adi && v.zimmet_surucu_adi.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (v.departman && v.departman.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesStatus = selectedStatus === 'all' || v.durum === selectedStatus;
            const matchesDept = selectedDept === 'all' || v.departman === selectedDept;

            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [vehicles, searchTerm, selectedStatus, selectedDept]);

    const getStatusBadge = (durum) => {
        const found = FLEET_STATUS_OPTIONS.find(s => s.value === durum);
        return found || FLEET_STATUS_OPTIONS[0];
    };

    const getDaysRemaining = (dateString) => {
        if (!dateString) return null;
        const target = new Date(dateString);
        target.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Girilmedi';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('tr-TR');
    };

    const handleSelectVehicle = (vehicle) => {
        setSelectedVehicleId(vehicle.id);
        if (showcaseRef.current) {
            showcaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    const openOperationsModal = (tab = 'status', vehicleTarget = null) => {
        if (vehicleTarget) {
            setSelectedVehicleId(vehicleTarget.id);
        }
        setFleetOpsInitialTab(tab);
        setIsFleetOpsOpen(true);
    };

    return (
        <AppLayout activeMode="fleet">
            <Head title="SmartFilo — Kurumsal Filo Yönetim Portalı" />

            <div className="space-y-6 sm:space-y-8">
                {/* Fleet Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] text-slate-900 dark:text-white p-6 sm:p-8 md:p-10 border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-extrabold tracking-wide uppercase">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>SmartFilo Pro</span>
                                </span>
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Canlı Filo Telemetrisi</span>
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                Filo Yönetim & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 dark:from-amber-400 dark:via-orange-400 dark:to-amber-200">Operasyon Portalı</span>
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                Filonuzdaki {kpis.totalVehicles || 0} aracın zimmet durumlarını, sürücü atamalarını, bakım maliyetlerini ve muayene/kaza süreçlerini tek merkezden yönetin.
                            </p>
                        </div>

                        {/* Fleet Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <Link
                                href="/vehicles/create"
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                                <span>Filoya Araç Ekle</span>
                            </Link>

                            <Link
                                href="/fleet/drivers"
                                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center space-x-1.5"
                            >
                                <UserCheck className="w-4 h-4 text-blue-500" />
                                <span>Sürücüler & Zimmet</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedVehicleForAccident(activeVehicle);
                                    setIsAccidentModalOpen(true);
                                }}
                                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-extrabold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                            >
                                <ShieldAlert className="w-4 h-4" />
                                <span>Kaza / Hasar Bildir</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ACTIVE VEHICLE HERO SHOWCASE (Bireysel Paneldeki Aktif Aracım Gibi) */}
                {activeVehicle && (
                    <div ref={showcaseRef} className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden transition-all">
                        {/* Background glow effects */}
                        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

                        {/* Top Header & Switcher */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/[0.06] relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                        Aktif Seçili Filo Aracı Detayı
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                                        {activeVehicle.marka} {activeVehicle.model} ({activeVehicle.yil || '-'})
                                    </h2>
                                </div>
                            </div>

                            {/* Switch Vehicle Dropdown */}
                            {vehicles.length > 1 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-bold text-slate-400">Aracı Değiştir:</span>
                                    <select
                                        value={activeVehicle.id}
                                        onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                                        className="text-xs font-black px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.1] text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {vehicles.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.plaka} &bull; {v.marka} {v.model} ({v.durum})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6 relative z-10">
                            {/* Left: Cinematic Photo & Plates (5 Cols) */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                                <div className="relative group rounded-3xl overflow-hidden bg-slate-950 aspect-[16/10] border border-slate-200 dark:border-white/10 shadow-inner flex items-center justify-center">
                                    {activeVehicle.fotograf_url ? (
                                        <img
                                            src={activeVehicle.fotograf_url}
                                            alt={activeVehicle.plaka}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                                            <Car className="w-16 h-16 opacity-30 stroke-[1.5]" />
                                            <span className="text-xs font-bold opacity-60">Fotoğraf Yüklenmedi</span>
                                        </div>
                                    )}

                                    {/* Plate Badge - Top Left with z-20 so it never hides behind photo */}
                                    <div className="absolute top-4 left-4 z-20 pointer-events-none drop-shadow-lg">
                                        <div className="badge-plate text-sm font-black px-3.5 py-1">
                                            {activeVehicle.plaka}
                                        </div>
                                    </div>

                                    {/* Status Indicator Badge - Top Right with z-20 */}
                                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                                        {(() => {
                                            const status = getStatusBadge(activeVehicle.durum);
                                            return (
                                                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border shadow-md backdrop-blur-md flex items-center gap-1.5 ${status.badgeBg}`}>
                                                    <span className={`w-2 h-2 rounded-full ${status.dotColor} animate-pulse`}></span>
                                                    <span>{status.label}</span>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Model Year Badge - Bottom Left with z-20 */}
                                    <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
                                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-slate-950/80 backdrop-blur-md text-white border border-white/15">
                                            {activeVehicle.yil || 'Belirtilmedi'} Model
                                        </span>
                                    </div>
                                </div>

                                {/* Driver & Assignment Info Card */}
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                                            activeVehicle.zimmet_surucu_adi 
                                                ? 'bg-blue-500/10 text-blue-500' 
                                                : 'bg-slate-200 dark:bg-white/5 text-slate-400'
                                        }`}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                                Zimmetli Personel
                                            </div>
                                            <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                                {activeVehicle.zimmet_surucu_adi || 'Sürücü Atanmadı (Havuzda)'}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openOperationsModal(activeVehicle.zimmet_surucu_adi ? 'release' : 'assign')}
                                        className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs transition-colors cursor-pointer"
                                    >
                                        {activeVehicle.zimmet_surucu_adi ? 'Zimmeti Yönet' : '+ Sürücü Ata'}
                                    </button>
                                </div>
                            </div>

                            {/* Right: Specs, Deadlines, Metrics, and Action Buttons (7 Cols) */}
                            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                                <div>
                                    {/* Tag Pills */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                            {activeVehicle.departman || 'Genel Havuz'}
                                        </span>
                                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                            {activeVehicle.sozlesme_turu || 'Özmal'}
                                        </span>
                                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                            {activeVehicle.ruhsat_tipi || 'Otomobil (Hususi)'}
                                        </span>
                                        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                            Motor: {activeVehicle.motor || 'Standart'}
                                        </span>
                                    </div>

                                    {/* Vehicle Name & VIN */}
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                        {activeVehicle.marka} {activeVehicle.model}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                                        Şasi No (VIN): <span className="font-mono text-slate-600 dark:text-slate-300">{activeVehicle.sasi_no || 'Kayıt Edilmedi'}</span>
                                    </p>
                                </div>

                                {/* Live Countdown Cards */}
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

                                {/* Metric Summary Badges */}
                                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] text-xs">
                                    <div>
                                        <span className="text-[10px] font-extrabold uppercase text-slate-400">Güncel KM</span>
                                        <div className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white">
                                            {Number(activeVehicle.guncel_km || 0).toLocaleString('tr-TR')} KM
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-extrabold uppercase text-slate-400">Bakım Harcaması</span>
                                        <div className="text-sm sm:text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                                            ₺{Number(activeVehicle.total_spent || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-extrabold uppercase text-slate-400">Hasar / Tramer</span>
                                        <div className="text-sm sm:text-base font-black font-mono text-red-500">
                                            ₺{Number(activeVehicle.total_damage || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                </div>

                                {/* Comprehensive Action Toolbar */}
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                                    <button
                                        type="button"
                                        onClick={() => openOperationsModal(activeVehicle.zimmet_surucu_adi ? 'release' : 'assign')}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        <span>Zimmet & Sürücü</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openOperationsModal('status')}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                    >
                                        <Building2 className="w-4 h-4 text-blue-500" />
                                        <span>Durum & Departman</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsEditVehicleOpen(true)}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                    >
                                        <Pencil className="w-4 h-4 text-amber-500" />
                                        <span>Aracı Düzenle</span>
                                    </button>

                                    <Link
                                        href={`/maintenances/create?arac_id=${activeVehicle.id}`}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5"
                                    >
                                        <Wrench className="w-4 h-4" />
                                        <span>Bakım Ekle</span>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedVehicleForAccident(activeVehicle);
                                            setIsAccidentModalOpen(true);
                                        }}
                                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                    >
                                        <ShieldAlert className="w-4 h-4" />
                                        <span>Hasar Bildir</span>
                                    </button>

                                    <a
                                        href={`/vehicles/${activeVehicle.id}/passport`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center"
                                        title="Dijital Pasaport"
                                    >
                                        <QrCode className="w-4 h-4 text-amber-500" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Vehicles Card */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Toplam Filo Aracı
                            </span>
                            <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-500">
                                <Car className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            {kpis.totalVehicles || 0} <span className="text-xs font-normal text-slate-400">Araç</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] font-bold">
                            <span className="text-emerald-500">{kpis.activeCount || 0} Havuzda / Boşta</span>
                            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                            <span className="text-blue-500">{kpis.onDutyCount || 0} Görevde</span>
                        </div>
                    </div>

                    {/* Operational Status */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Servis & Risk Durumu
                            </span>
                            <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
                                <Wrench className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            {kpis.inServiceCount || 0} <span className="text-xs font-normal text-slate-400">Serviste</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] font-bold">
                            <span className="text-red-500">{kpis.idleCount || 0} Atıl / Yatıyor</span>
                            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                            <span className="text-amber-500">{(kpis.expiringInspections || 0) + (kpis.expiringInsurances || 0)} Yaklaşan İşlem</span>
                        </div>
                    </div>

                    {/* Total Fleet Expense */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Toplam Filo Harcaması
                            </span>
                            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            ₺{Number(kpis.totalFleetExpense || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] font-bold">
                            <span className="text-emerald-500">₺{Number(kpis.totalMaintenanceExpense || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} Bakım</span>
                            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                            <span className="text-red-500">₺{Number(kpis.totalDamageExpense || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} Hasar</span>
                        </div>
                    </div>

                    {/* Avg KM & Tramer */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Ortalama Kilometre
                            </span>
                            <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            {Number(kpis.avgKm || 0).toLocaleString('tr-TR')} <span className="text-xs font-normal text-slate-400">KM</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            <span>Tramer: ₺{Number(kpis.totalTramer || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Plaka, marka, model veya sürücü ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Status and Department Filter */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tüm Durumlar ({vehicles.length})</option>
                            {FLEET_STATUS_OPTIONS.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tüm Departmanlar</option>
                            {Object.keys(departmentDistribution).map((dept, idx) => (
                                <option key={idx} value={dept}>{dept} ({departmentDistribution[dept]})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fleet Vehicles Table */}
                <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
                    <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                            <Car className="w-5 h-5 text-blue-500" />
                            <span>Filo Araç Listesi ({filteredVehicles.length} Araç)</span>
                        </h3>
                        <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                            Detaylarını görmek için araç satırına tıklayın
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">
                                    <th className="py-3.5 px-4 sm:px-6">Araç & Plaka</th>
                                    <th className="py-3.5 px-4">Durum & Zimmet</th>
                                    <th className="py-3.5 px-4">Departman</th>
                                    <th className="py-3.5 px-4">Güncel KM</th>
                                    <th className="py-3.5 px-4">Muayene / Sigorta</th>
                                    <th className="py-3.5 px-4">Toplam Masraf</th>
                                    <th className="py-3.5 px-4 sm:px-6 text-right">Aksiyonlar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs">
                                {filteredVehicles.length > 0 ? (
                                    filteredVehicles.map((v) => {
                                        const statusBadge = getStatusBadge(v.durum);
                                        const isSelected = activeVehicle && activeVehicle.id === v.id;

                                        return (
                                            <tr 
                                                key={v.id} 
                                                onClick={() => handleSelectVehicle(v)}
                                                className={`cursor-pointer transition-all ${
                                                    isSelected 
                                                        ? 'bg-blue-500/10 dark:bg-blue-500/15 border-l-4 border-l-blue-500 shadow-sm' 
                                                        : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.02]'
                                                }`}
                                            >
                                                {/* Vehicle & Plate */}
                                                <td className="py-4 px-4 sm:px-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
                                                            {v.fotograf_url ? (
                                                                <img src={v.fotograf_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Car className="w-5 h-5 text-slate-500" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="badge-plate text-xs font-black px-2 py-0.5 inline-block">
                                                                    {v.plaka}
                                                                </div>
                                                                {isSelected && (
                                                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-500 text-white">
                                                                        Seçili
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="font-bold text-slate-900 dark:text-white mt-1">
                                                                {v.marka} {v.model}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">
                                                                {v.yil || '-'} &bull; {v.motor || 'Standart'} &bull; {v.sozlesme_turu || 'Özmal'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status & Assigned Driver */}
                                                <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() => openOperationsModal('status', v)}
                                                        className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform ${statusBadge.badgeBg}`}
                                                        title="Durumu ve zimmeti güncellemek için tıklayın"
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotColor}`}></span>
                                                        <span>{statusBadge.label}</span>
                                                        <Edit3 className="w-3 h-3 opacity-60 ml-0.5" />
                                                    </button>
                                                    <div className="text-slate-600 dark:text-slate-300 font-bold text-[11px] mt-1.5 flex items-center gap-1">
                                                        <User className="w-3 h-3 text-slate-400" />
                                                        <span>{v.zimmet_surucu_adi || 'Sürücü Atanmadı'}</span>
                                                    </div>
                                                </td>

                                                {/* Department */}
                                                <td className="py-4 px-4">
                                                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 font-bold text-[11px] border border-slate-200 dark:border-white/5">
                                                        {v.departman || 'Genel Havuz'}
                                                    </span>
                                                </td>

                                                {/* Current KM */}
                                                <td className="py-4 px-4">
                                                    <span className="font-black text-slate-900 dark:text-white font-mono">
                                                        {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM
                                                    </span>
                                                </td>

                                                {/* Inspection / Insurance */}
                                                <td className="py-4 px-4 space-y-1">
                                                    <div className="text-[11px]">
                                                        <span className="text-slate-400">Muayene: </span>
                                                        <strong className={v.muayene_days !== null && v.muayene_days <= 30 ? 'text-amber-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                                                            {v.muayene_bitis ? new Date(v.muayene_bitis).toLocaleDateString('tr-TR') : 'Yok'}
                                                        </strong>
                                                    </div>
                                                    <div className="text-[11px]">
                                                        <span className="text-slate-400">Sigorta: </span>
                                                        <strong className={v.sigorta_days !== null && v.sigorta_days <= 30 ? 'text-blue-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                                                            {v.sigorta_bitis ? new Date(v.sigorta_bitis).toLocaleDateString('tr-TR') : 'Yok'}
                                                        </strong>
                                                    </div>
                                                </td>

                                                {/* Total Expense */}
                                                <td className="py-4 px-4">
                                                    <div className="font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                                        ₺{Number(v.total_spent + v.total_damage).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">
                                                        {v.maintenance_count} Bakım &bull; {v.accident_count} Hasar
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openOperationsModal('status', v)}
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-blue-500/10 text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-colors cursor-pointer"
                                                            title="Zimmet & Durum Operasyonu"
                                                        >
                                                            <ArrowRightLeft className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedVehicleId(v.id);
                                                                setIsEditVehicleOpen(true);
                                                            }}
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                                                            title="Aracı Düzenle"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <Link
                                                            href={`/maintenances/create?arac_id=${v.id}`}
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                                                            title="Bakım Ekle"
                                                        >
                                                            <Wrench className="w-4 h-4" />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedVehicleForAccident(v);
                                                                setIsAccidentModalOpen(true);
                                                            }}
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-red-500/10 text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                                                            title="Kaza / Hasar Ekle"
                                                        >
                                                            <ShieldAlert className="w-4 h-4" />
                                                        </button>

                                                        <a
                                                            href={`/vehicles/${v.id}/passport`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
                                                            title="Dijital Pasaport"
                                                        >
                                                            <QrCode className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-slate-400">
                                            <Car className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                            <p className="font-bold">Filtre kriterlerine uygun araç bulunamadı.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Fleet Operations Modal (Status, Assignment, Release, Swap) */}
                {activeVehicle && (
                    <FleetOperationsModal
                        isOpen={isFleetOpsOpen}
                        onClose={() => setIsFleetOpsOpen(false)}
                        vehicle={activeVehicle}
                        drivers={drivers}
                        vehicles={vehicles}
                        initialTab={fleetOpsInitialTab}
                    />
                )}

                {/* Edit Vehicle Modal */}
                {activeVehicle && (
                    <EditVehicleModal
                        isOpen={isEditVehicleOpen}
                        onClose={() => setIsEditVehicleOpen(false)}
                        vehicle={activeVehicle}
                    />
                )}

                {/* Accident Modal */}
                <AccidentModal
                    isOpen={isAccidentModalOpen}
                    onClose={() => {
                        setIsAccidentModalOpen(false);
                        setSelectedVehicleForAccident(null);
                    }}
                    vehicles={vehicles}
                    activeVehicle={selectedVehicleForAccident || activeVehicle}
                />
            </div>
        </AppLayout>
    );
}
