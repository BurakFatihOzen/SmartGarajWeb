import React, { useState, useEffect } from 'react';
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
    ArrowRightLeft,
    Pencil,
    ChevronRight,
    Eye
} from 'lucide-react';
import AccidentModal from '../../Components/AccidentModal';
import EditVehicleModal from '../../Components/EditVehicleModal';
import FleetVehicleManageModal from '../../Components/FleetVehicleManageModal';
import FleetActiveVehicleHero from '../../Components/FleetActiveVehicleHero';
import { getStatusBadgeObj } from '@/constants/fleet';

export default function FleetDashboard({ 
    vehicles = [], 
    drivers = [], 
    kpis = {}, 
    departmentDistribution = {}, 
    brandDistribution = {} 
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedDept, setSelectedDept] = useState('all');
    
    // Active Showcase Vehicle
    const [activeVehicleId, setActiveVehicleId] = useState(vehicles[0]?.id || null);
    
    // Modals
    const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);
    const [selectedVehicleForAccident, setSelectedVehicleForAccident] = useState(null);
    
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [manageTargetVehicle, setManageTargetVehicle] = useState(null);

    const [isEditVehicleOpen, setIsEditVehicleOpen] = useState(false);
    const [editTargetVehicle, setEditTargetVehicle] = useState(null);

    // Keep active vehicle object synchronized with latest vehicles prop
    const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles[0] || null;

    useEffect(() => {
        if (!activeVehicleId && vehicles.length > 0) {
            setActiveVehicleId(vehicles[0].id);
        }
    }, [vehicles, activeVehicleId]);

    const openManageModal = (v) => {
        setManageTargetVehicle(v);
        setIsManageModalOpen(true);
    };

    const openEditVehicleModal = (v) => {
        setEditTargetVehicle(v);
        setIsEditVehicleOpen(true);
    };

    // Filtered Vehicles
    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = 
            v.plaka.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${v.marka} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (v.zimmet_surucu_adi && v.zimmet_surucu_adi.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (v.departman && v.departman.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = selectedStatus === 'all' || v.durum === selectedStatus;
        const matchesDept = selectedDept === 'all' || v.departman === selectedDept;

        return matchesSearch && matchesStatus && matchesDept;
    });

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
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-amber-500/20 border border-blue-500/20 dark:border-amber-500/30 text-blue-600 dark:text-amber-400 text-xs font-extrabold tracking-wide uppercase">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>SmartFilo Operasyon Portalı</span>
                                </span>
                                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>Canlı Filo Telemetrisi</span>
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                Filo Yönetim & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 dark:from-amber-400 dark:via-orange-400 dark:to-amber-200">Operasyon Merkezi</span>
                            </h1>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                Filonuzdaki {kpis.totalVehicles || 0} aracın anlık durumlarını, zimmetli sürücülerini, bakım maliyetlerini ve kaza/tramer risklerini tek ekrandan yönetin.
                            </p>
                        </div>

                        {/* Fleet Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <Link
                                href="/vehicles/create"
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                                <span>Filoya Araç Ekle</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setSelectedVehicleForAccident(activeVehicle || null);
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

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Vehicles Card */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Toplam Filo Büyüklüğü
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">
                                <Car className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                                {kpis.totalVehicles || 0}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">Kayıtlı Araç</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-white/5">
                            <span className="text-emerald-500 font-bold">● {kpis.activeCount || 0} Aktif</span>
                            <span className="text-blue-500 font-bold">● {kpis.onDutyCount || 0} Görevde</span>
                            <span className="text-amber-500 font-bold">● {kpis.inServiceCount || 0} Serviste</span>
                        </div>
                    </div>

                    {/* Total Fleet Expense Card */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Toplam Filo Harcaması
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                ₺{Number(kpis.totalFleetExpense || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400">
                            <span>Bakım: ₺{Number(kpis.totalMaintenanceExpense || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                            <span>Hasar: ₺{Number(kpis.totalDamageExpense || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>

                    {/* Average KM Card */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Filo KM Ortalaması
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black">
                                <Truck className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                                {Number(kpis.avgKm || 0).toLocaleString('tr-TR')}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">KM / Araç</span>
                        </div>
                        <div className="text-[11px] pt-1 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400">
                            Toplam Tramer Kaydı: <strong className="text-red-500">₺{Number(kpis.totalTramer || 0).toLocaleString('tr-TR')}</strong>
                        </div>
                    </div>

                    {/* Approaching Expiries Card */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Yaklaşan Vade Uyarıları
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                                {(kpis.expiringInspections || 0) + (kpis.expiringInsurances || 0) + (kpis.expiringKaskos || 0)}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">Kritik İşlem</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400">
                            <span>Muayene: {kpis.expiringInspections || 0}</span>
                            <span>Sigorta: {kpis.expiringInsurances || 0}</span>
                            <span>Kasko: {kpis.expiringKaskos || 0}</span>
                        </div>
                    </div>
                </div>

                {/* ACTIVE FLEET VEHICLE SHOWCASE HERO (Requested Feature) */}
                {activeVehicle && (
                    <FleetActiveVehicleHero
                        vehicle={activeVehicle}
                        allVehicles={vehicles}
                        onSelectVehicle={(v) => setActiveVehicleId(v.id)}
                        onOpenManageModal={() => openManageModal(activeVehicle)}
                        onOpenEditModal={() => openEditVehicleModal(activeVehicle)}
                        onOpenAccidentModal={() => {
                            setSelectedVehicleForAccident(activeVehicle);
                            setIsAccidentModalOpen(true);
                        }}
                    />
                )}

                {/* Filter and Search Toolbar */}
                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Plaka, marka, model, sürücü veya departman ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>

                    {/* Status and Department Filter */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="aktif">Aktif / Havuzda</option>
                            <option value="gorevde">Görevde / Zimmetli</option>
                            <option value="serviste">Serviste / Bakımda</option>
                            <option value="hasarli">Hasarlı / Eksperde</option>
                            <option value="muayenede">Muayenede</option>
                            <option value="atil">Atıl / Yatıyor</option>
                            <option value="satildi">Satıldı</option>
                            <option value="kiralik_iade">Kiralık İade</option>
                        </select>

                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
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
                        <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                                <Car className="w-5 h-5 text-blue-500" />
                                <span>Filo Araç Listesi ({filteredVehicles.length} Araç)</span>
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Detayları incelemek ve aktif araç olarak seçmek için listeye tıklayın.</p>
                        </div>
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
                                        const statusBadge = getStatusBadgeObj(v.durum);
                                        const isSelected = activeVehicle?.id === v.id;

                                        return (
                                            <tr 
                                                key={v.id} 
                                                onClick={() => setActiveVehicleId(v.id)}
                                                className={`transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-blue-500/10 dark:bg-blue-500/15 border-l-4 border-l-blue-600 dark:border-l-blue-400'
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
                                                            <div className="badge-plate text-xs font-black px-2 py-0.5 inline-block">
                                                                {v.plaka}
                                                            </div>
                                                            <div className="font-bold text-slate-900 dark:text-white mt-1">
                                                                {v.marka} {v.model}
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">
                                                                {v.yil || '-'} &bull; {v.motor || 'Standart'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status & Assigned Driver */}
                                                <td className="py-4 px-4">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openManageModal(v);
                                                        }}
                                                        className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform ${statusBadge.colorClass}`}
                                                        title="Zimmet ve durumu yönetmek için tıklayın"
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
                                                        {v.departman}
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
                                                <td className="py-4 px-4 sm:px-6 text-right">
                                                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type="button"
                                                            onClick={() => openManageModal(v)}
                                                            className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                                                            title="Zimmet & Durum Yönet"
                                                        >
                                                            <ArrowRightLeft className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => openEditVehicleModal(v)}
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-amber-500/10 text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                                                            title="Araç Bilgilerini Düzenle"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <a
                                                            href={`/vehicles/${v.id}/passport`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 transition-colors"
                                                            title="Dijital Pasaport"
                                                        >
                                                            <QrCode className="w-4 h-4 text-blue-500" />
                                                        </a>

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

                {/* Fleet Vehicle Status & Driver Assignment Modal */}
                <FleetVehicleManageModal
                    isOpen={isManageModalOpen}
                    onClose={() => {
                        setIsManageModalOpen(false);
                        setManageTargetVehicle(null);
                    }}
                    vehicle={manageTargetVehicle}
                    drivers={drivers}
                />

                {/* Full Vehicle Edit Modal */}
                <EditVehicleModal
                    isOpen={isEditVehicleOpen}
                    onClose={() => {
                        setIsEditVehicleOpen(false);
                        setEditTargetVehicle(null);
                    }}
                    vehicle={editTargetVehicle}
                />

                {/* Accident & Damage Modal */}
                <AccidentModal
                    isOpen={isAccidentModalOpen}
                    onClose={() => {
                        setIsAccidentModalOpen(false);
                        setSelectedVehicleForAccident(null);
                    }}
                    vehicles={vehicles}
                    activeVehicle={selectedVehicleForAccident}
                />
            </div>
        </AppLayout>
    );
}
