import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Car, 
    Wrench, 
    ShieldAlert, 
    ShieldCheck, 
    QrCode, 
    Pencil, 
    PlusCircle, 
    Calendar, 
    Shield, 
    FileText, 
    Sparkles, 
    Gauge, 
    User, 
    UserCheck, 
    Phone, 
    Fuel, 
    AlertTriangle, 
    CheckCircle2, 
    ChevronDown, 
    Briefcase, 
    TrendingUp, 
    AlertCircle,
    Building2,
    ArrowRightLeft,
    Clock,
    DollarSign
} from 'lucide-react';
import { getStatusBadgeObj } from '@/constants/fleet';

export default function FleetActiveVehicleHero({ 
    vehicle, 
    allVehicles = [], 
    onSelectVehicle, 
    onOpenManageModal, 
    onOpenEditModal, 
    onOpenAccidentModal 
}) {
    if (!vehicle) return null;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeHeroTab, setActiveHeroTab] = useState('summary'); // 'summary' | 'maintenances' | 'accidents'

    const statusBadge = getStatusBadgeObj(vehicle.durum);

    const getDaysRemaining = (dateStr) => {
        if (!dateStr) return null;
        const target = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const formatDate = (d) => {
        if (!d) return 'Belirtilmedi';
        try {
            return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch {
            return d;
        }
    };

    return (
        <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-blue-500/20 dark:border-blue-500/30 shadow-xl dark:shadow-2xl overflow-hidden transition-all animate-fadeIn">
            
            {/* Top Bar: Vehicle Selector & Indicator */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-amber-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-amber-500/5 border-b border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        İncelenen Aktif Filo Aracı
                    </span>
                </div>

                {/* Quick Vehicle Switcher Dropdown */}
                {allVehicles.length > 1 && (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2 shadow-xs hover:border-blue-500 transition-all cursor-pointer"
                        >
                            <span className="badge-plate text-[10px] font-black px-1.5 py-0.2">{vehicle.plaka}</span>
                            <span className="truncate max-w-[140px]">{vehicle.marka} {vehicle.model}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-white/10 shadow-2xl p-1.5 space-y-1 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95">
                                {allVehicles.map(v => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectVehicle(v);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                                            v.id === vehicle.id
                                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black'
                                                : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2 truncate">
                                            <span className="badge-plate text-[10px] font-black px-1.5 py-0.2">{v.plaka}</span>
                                            <span className="truncate">{v.marka} {v.model}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{v.zimmet_surucu_adi ? 'Zimmetli' : 'Boşta'}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Main Showcase Hero */}
            <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch">
                    
                    {/* Left: Vehicle Photo & Plate Badge (with z-20 so it never hides behind photo) */}
                    <div className="w-full lg:w-[320px] xl:w-[360px] flex flex-col justify-between shrink-0 space-y-4">
                        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shadow-lg group">
                            
                            {/* License Plate - Strictly z-20 pointer-events-none */}
                            <div className="absolute top-3 left-3 z-20 pointer-events-none">
                                <div className="badge-plate text-xs sm:text-sm font-black px-3 py-1 shadow-md bg-white text-slate-900 border-2 border-slate-900">
                                    {vehicle.plaka}
                                </div>
                            </div>

                            {/* Year Badge */}
                            <div className="absolute top-3 right-3 z-20 pointer-events-none">
                                <div className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-slate-950/80 backdrop-blur-md text-white border border-white/20">
                                    {vehicle.yil || 'Model'}
                                </div>
                            </div>

                            {/* Image */}
                            {vehicle.fotograf_url ? (
                                <img
                                    src={vehicle.fotograf_url}
                                    alt={`${vehicle.marka} ${vehicle.model}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-600">
                                    <Car className="w-16 h-16 stroke-[1.2] mb-1" />
                                    <span className="text-[11px] font-bold">Fotoğraf Eklenmedi</span>
                                </div>
                            )}

                            {/* Bottom Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none z-10" />

                            {/* Status Overlay Pill */}
                            <div className="absolute bottom-3 left-3 z-20">
                                <span className={`px-3 py-1 rounded-xl text-xs font-black border backdrop-blur-md shadow-md ${statusBadge.colorClass}`}>
                                    ● {statusBadge.label}
                                </span>
                            </div>
                        </div>

                        {/* Driver & Assignment Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
                                <div className="flex items-center gap-1.5">
                                    <UserCheck className="w-4 h-4 text-blue-500" />
                                    <span>Zimmet & Personel Bilgisi</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={onOpenManageModal}
                                    className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer flex items-center gap-1"
                                >
                                    <ArrowRightLeft className="w-3 h-3" />
                                    <span>Değiştir / Havuza Al</span>
                                </button>
                            </div>

                            {vehicle.zimmet_surucu_adi ? (
                                <div className="space-y-1 text-xs">
                                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                                        {vehicle.zimmet_surucu_adi}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <Briefcase className="w-3 h-3 text-slate-400" />
                                        <span>{vehicle.departman || 'Departman Atanmadı'}</span>
                                    </div>
                                    {vehicle.active_assignment?.surucu_telefon && (
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            <span>{vehicle.active_assignment.surucu_telefon}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-xs text-slate-500 dark:text-slate-400 py-1">
                                    Bu araç şu anda herhangi bir personele zimmetli değildir. Şirket havuzunda boştadır.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Specs, Deadlines and Action Toolbar */}
                    <div className="flex-1 flex flex-col justify-between space-y-6">
                        <div>
                            {/* Tags Header */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="px-3 py-1 rounded-xl text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                    {vehicle.sozlesme_turu || 'Özmal'}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                    {vehicle.ruhsat_tipi || 'Otomobil'}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                    Motor: {vehicle.motor || 'Standart'}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                                    Yakıt: {vehicle.yakit_turu || 'Benzin/Dizel'}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {vehicle.marka} {vehicle.model}
                            </h2>
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                                Güncel Sayaç: <span className="font-mono font-black text-slate-800 dark:text-slate-200">{Number(vehicle.guncel_km || 0).toLocaleString('tr-TR')} KM</span> &bull; Şasi No (VIN): <span className="font-mono text-slate-600 dark:text-slate-300">{vehicle.sasi_no || 'Kayıtlı Değil'}</span>
                            </p>
                        </div>

                        {/* Inspection, Insurance and Kasko Countdown Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { label: 'TÜVTÜRK Muayene', date: vehicle.muayene_bitis, icon: Shield },
                                { label: 'Trafik Sigortası', date: vehicle.sigorta_bitis, icon: FileText },
                                { label: 'Kasko Poliçesi', date: vehicle.kasko_bitis, icon: Sparkles },
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

                        {/* Expense & Tramer Mini Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400">Toplam Bakım</span>
                                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                                    ₺{Number(vehicle.total_spent || 0).toLocaleString('tr-TR')}
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400">Hasar / Onarım</span>
                                <div className="text-sm font-black text-red-500 font-mono mt-0.5">
                                    ₺{Number(vehicle.total_damage || 0).toLocaleString('tr-TR')}
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400">Tramer Kaydı</span>
                                <div className="text-sm font-black text-amber-500 font-mono mt-0.5">
                                    ₺{Number(vehicle.tramer_total || 0).toLocaleString('tr-TR')}
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400">Yakıt Gideri</span>
                                <div className="text-sm font-black text-blue-500 font-mono mt-0.5">
                                    ₺{Number(vehicle.fuel_expense || 0).toLocaleString('tr-TR')}
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Toolbar */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={onOpenManageModal}
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                                <ArrowRightLeft className="w-4 h-4 stroke-[2.5]" />
                                <span>Durum & Zimmet Yönet</span>
                            </button>

                            <Link
                                href={`/maintenances/create?arac_id=${vehicle.id}`}
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Bakım Ekle</span>
                            </Link>

                            <button
                                type="button"
                                onClick={onOpenAccidentModal}
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                                <ShieldAlert className="w-4 h-4" />
                                <span>Hasar / Kaza Bildir</span>
                            </button>

                            <button
                                type="button"
                                onClick={onOpenEditModal}
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                                <Pencil className="w-4 h-4 text-amber-500" />
                                <span>Aracı Düzenle</span>
                            </button>

                            <a
                                href={`/vehicles/${vehicle.id}/passport`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                            >
                                <QrCode className="w-4 h-4 text-blue-500" />
                                <span>Pasaport (QR)</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Sub Tabs: Recent Maintenances & Recent Accidents in Hero */}
                {(vehicle.recent_maintenances?.length > 0 || vehicle.recent_accidents?.length > 0) && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/[0.06] space-y-4">
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={() => setActiveHeroTab('summary')}
                                className={`text-xs font-black pb-1.5 border-b-2 transition-all cursor-pointer ${
                                    activeHeroTab === 'summary'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                            >
                                Son Bakım Kayıtları ({vehicle.recent_maintenances?.length || 0})
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveHeroTab('accidents')}
                                className={`text-xs font-black pb-1.5 border-b-2 transition-all cursor-pointer ${
                                    activeHeroTab === 'accidents'
                                        ? 'border-red-500 text-red-600 dark:text-red-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                }`}
                            >
                                Hasar & Kaza Geçmişi ({vehicle.recent_accidents?.length || 0})
                            </button>
                        </div>

                        {activeHeroTab === 'summary' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {vehicle.recent_maintenances?.map((m) => (
                                    <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-900 dark:text-white truncate">{m.islem_turu}</span>
                                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">₺{Number(m.maliyet_tl || 0).toLocaleString('tr-TR')}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span>{formatDate(m.islem_tarihi)}</span>
                                            <span>{m.islem_km ? `${Number(m.islem_km).toLocaleString('tr-TR')} KM` : '-'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeHeroTab === 'accidents' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {vehicle.recent_accidents?.map((a) => (
                                    <div key={a.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-900 dark:text-white truncate">{a.kaza_turu}</span>
                                            <span className="font-mono text-red-500 font-black">₺{Number(a.hasar_tutari || 0).toLocaleString('tr-TR')}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                                            <span>{formatDate(a.kaza_tarihi)}</span>
                                            <span className={a.tramer_kaydi ? 'text-amber-500 font-bold' : 'text-slate-400'}>
                                                {a.tramer_kaydi ? `Tramer: ₺${Number(a.tramer_tutari || 0).toLocaleString('tr-TR')}` : 'Tramer Yok'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
