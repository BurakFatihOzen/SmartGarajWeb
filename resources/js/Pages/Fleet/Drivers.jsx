import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { 
    UserCheck, 
    Car, 
    PlusCircle, 
    Search, 
    Calendar, 
    Clock, 
    Phone, 
    Mail, 
    Shield, 
    AlertTriangle, 
    CheckCircle2, 
    Trash2, 
    Edit3, 
    Building2, 
    Layers, 
    DollarSign,
    Fuel,
    FileText,
    ArrowRightLeft,
    X
} from 'lucide-react';
import AssignmentModal from '../../Components/AssignmentModal';

export default function FleetDrivers({ drivers = [], vehicles = [], kpis = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('all');
    const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDriverForAssign, setSelectedDriverForAssign] = useState(null);

    // Editing Driver
    const [editingDriver, setEditingDriver] = useState(null);

    // Release Modal State
    const [releasingAssignment, setReleasingAssignment] = useState(null);
    const [releaseKm, setReleaseKm] = useState('');
    const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [releaseNotes, setReleaseNotes] = useState('');

    // Add Driver Form State
    const [newDriver, setNewDriver] = useState({
        ad_soyad: '',
        tc_no: '',
        telefon: '',
        email: '',
        ehliyet_sinifi: 'B',
        ehliyet_verilis_tarihi: '',
        ehliyet_gecerlilik_tarihi: '',
        departman: '',
        gorev_unvani: '',
        notlar: '',
    });

    const departments = Array.from(new Set(drivers.map(d => d.departman).filter(Boolean)));

    const filteredDrivers = drivers.filter(driver => {
        const matchesSearch = searchTerm === '' ||
            driver.ad_soyad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.telefon?.includes(searchTerm) ||
            driver.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'all' || driver.departman === selectedDept;
        return matchesSearch && matchesDept;
    });

    const handleCreateDriver = (e) => {
        e.preventDefault();
        router.post('/fleet/drivers', newDriver, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddDriverOpen(false);
                setNewDriver({
                    ad_soyad: '',
                    tc_no: '',
                    telefon: '',
                    email: '',
                    ehliyet_sinifi: 'B',
                    ehliyet_verilis_tarihi: '',
                    ehliyet_gecerlilik_tarihi: '',
                    departman: '',
                    gorev_unvani: '',
                    notlar: '',
                });
            },
        });
    };

    const handleUpdateDriver = (e) => {
        e.preventDefault();
        router.put(`/fleet/drivers/${editingDriver.id}`, editingDriver, {
            preserveScroll: true,
            onSuccess: () => setEditingDriver(null),
        });
    };

    const handleDeleteDriver = (id, name) => {
        if (confirm(`${name} isimli sürücüyü silmek istediğinize emin misiniz?`)) {
            router.delete(`/fleet/drivers/${id}`, { preserveScroll: true });
        }
    };

    const handleReleaseSubmit = (e) => {
        e.preventDefault();
        router.post(`/fleet/assignments/${releasingAssignment.id}/release`, {
            iade_tarihi: releaseDate,
            bitis_km: releaseKm,
            iade_notu: releaseNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => setReleasingAssignment(null),
        });
    };

    const getLicenseBadge = (expiryDate) => {
        if (!expiryDate) return { label: 'Belirtilmedi', color: 'text-slate-400' };
        const target = new Date(expiryDate);
        const today = new Date();
        const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

        if (diff < 0) return { label: `${Math.abs(diff)} gün önce bitti!`, color: 'text-red-500 font-black' };
        if (diff <= 60) return { label: `${diff} gün kaldı (Yenileme Yakın)`, color: 'text-amber-500 font-bold' };
        return { label: `Geçerli (${diff} gün)`, color: 'text-emerald-500 font-bold' };
    };

    return (
        <AppLayout activeMode="fleet" title="Sürücüler & Zimmet Yönetimi">
            <Head title="Sürücüler & Zimmet Yönetimi — SmartFilo" />

            <div className="space-y-6 sm:space-y-8">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-black uppercase">
                                SMARTFİLO PERSONEL
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Sürücüler & <span className="text-blue-500">Zimmet Yönetimi</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                            Filonuzdaki tüm sürücülerin ehliyet geçerliliklerini, aktif araç zimmetlerini ve geçmiş teslim-tesellüm kayıtlarını yönetin.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedDriverForAssign(null);
                                setIsAssignModalOpen(true);
                            }}
                            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                            <ArrowRightLeft className="w-4 h-4" />
                            <span>Araca Sürücü Zimmetle</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAddDriverOpen(true)}
                            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                            <span>Yeni Sürücü Ekle</span>
                        </button>
                    </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Toplam Sürücü</span>
                            <UserCheck className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            {kpis.totalDrivers || 0}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Kayıtlı filo personeli</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Zimmetli / Görevde</span>
                            <Car className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            {kpis.assignedDrivers || 0}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Aracı teslim almış sürücüler</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Boşta / Yedek</span>
                            <UserCheck className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                            {kpis.idleDrivers || 0}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Araç bekleyen sürücüler</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Ehliyet Vadesi Yaklaşan</span>
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 font-mono">
                            {kpis.licenseExpiringSoon || 0}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">60 gün içinde süresi dolacak</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="p-4 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Sürücü adı, telefon veya e-posta ara..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        >
                            <option value="all">Tüm Departmanlar</option>
                            {departments.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Drivers Table / List */}
                <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs min-w-[760px]">
                            <thead className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.06]">
                                <tr>
                                    <th className="px-5 py-4">Sürücü & Bilgiler</th>
                                    <th className="px-5 py-4">Departman & Görev</th>
                                    <th className="px-5 py-4">Ehliyet Sınıfı & Vade</th>
                                    <th className="px-5 py-4">Aktif Zimmetli Araç</th>
                                    <th className="px-5 py-4">Ceza & Yakıt Geçmişi</th>
                                    <th className="px-5 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {filteredDrivers.length > 0 ? (
                                    filteredDrivers.map((driver) => {
                                        const active = driver.active_assignment;
                                        const licBadge = getLicenseBadge(driver.ehliyet_gecerlilik_tarihi);

                                        return (
                                            <tr key={driver.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                                {/* Driver Name & Contacts */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                                                            {driver.ad_soyad.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 dark:text-white text-sm">
                                                                {driver.ad_soyad}
                                                            </div>
                                                            <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-0.5">
                                                                {driver.telefon && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Phone className="w-3 h-3" />
                                                                        {driver.telefon}
                                                                    </span>
                                                                )}
                                                                {driver.tc_no && (
                                                                    <span>TC: {driver.tc_no.substring(0, 3)}*****{driver.tc_no.substring(8)}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Department & Title */}
                                                <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                                                    <div>{driver.departman || 'Genel Filo'}</div>
                                                    <div className="text-[10px] text-slate-400 font-normal">{driver.gorev_unvani || 'Sürücü'}</div>
                                                </td>

                                                {/* License */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] font-bold text-xs">
                                                            Sınıf {driver.ehliyet_sinifi}
                                                        </span>
                                                        <span className={`text-[11px] ${licBadge.color}`}>
                                                            {licBadge.label}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Active Assigned Vehicle */}
                                                <td className="px-5 py-4">
                                                    {active && active.vehicle ? (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="badge-plate text-[10px] py-0.5 px-2">
                                                                    {active.vehicle.plaka}
                                                                </span>
                                                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                                    {active.vehicle.marka} {active.vehicle.model}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-[10px] text-slate-400">
                                                                    Teslim: {new Date(active.teslim_tarihi).toLocaleDateString('tr-TR')} ({Number(active.baslangic_km).toLocaleString('tr-TR')} KM)
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setReleasingAssignment(active);
                                                                        setReleaseKm(active.vehicle.guncel_km || active.baslangic_km);
                                                                    }}
                                                                    className="text-[10px] font-extrabold text-red-500 hover:underline cursor-pointer"
                                                                >
                                                                    İade Al
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-[11px] text-slate-400 font-semibold">Boşta</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedDriverForAssign(driver);
                                                                    setIsAssignModalOpen(true);
                                                                }}
                                                                className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-[10px] font-bold transition-colors cursor-pointer"
                                                            >
                                                                + Araç Ata
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Fines & Fuel Records */}
                                                <td className="px-5 py-4">
                                                    <div className="text-[11px] space-y-0.5">
                                                        <div className="text-slate-700 dark:text-slate-300 font-bold">
                                                            {driver.fines?.length || 0} Ceza &bull; {driver.fuel_logs?.length || 0} Yakıt Fişi
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => setEditingDriver(driver)}
                                                            className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer"
                                                            title="Düzenle"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDriver(driver.id, driver.ad_soyad)}
                                                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                                            title="Sil"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <p className="font-bold">Kayıtlı sürücü bulunamadı</p>
                                            <p className="text-xs mt-1">Yeni bir sürücü ekleyerek zimmet işlemlerine başlayın.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Driver Modal */}
            {isAddDriverOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsAddDriverOpen(false)} />
                    <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 space-y-4 z-10">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <PlusCircle className="w-5 h-5 text-amber-500" />
                                <span>Yeni Filo Sürücüsü Ekle</span>
                            </h3>
                            <button onClick={() => setIsAddDriverOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateDriver} className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Adı & Soyadı *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Örn: Ahmet Yılmaz"
                                    value={newDriver.ad_soyad}
                                    onChange={(e) => setNewDriver({ ...newDriver, ad_soyad: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                                    <input
                                        type="text"
                                        placeholder="05XX XXX XX XX"
                                        value={newDriver.telefon}
                                        onChange={(e) => setNewDriver({ ...newDriver, telefon: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">T.C. Kimlik No</label>
                                    <input
                                        type="text"
                                        maxLength={11}
                                        placeholder="11 haneli TC"
                                        value={newDriver.tc_no}
                                        onChange={(e) => setNewDriver({ ...newDriver, tc_no: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Departman / Birim</label>
                                    <input
                                        type="text"
                                        placeholder="Lojistik, Saha Satış vb."
                                        value={newDriver.departman}
                                        onChange={(e) => setNewDriver({ ...newDriver, departman: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ehliyet Sınıfı *</label>
                                    <select
                                        value={newDriver.ehliyet_sinifi}
                                        onChange={(e) => setNewDriver({ ...newDriver, ehliyet_sinifi: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white"
                                    >
                                        <option value="B">B (Otomobil / Kamyonet)</option>
                                        <option value="C">C (Kamyon / Çekici)</option>
                                        <option value="D">D (Otobüs / Minibüs)</option>
                                        <option value="E">E (Römorklu)</option>
                                        <option value="A2">A2 (Motosiklet)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ehliyet Son Geçerlilik Tarihi</label>
                                    <input
                                        type="date"
                                        value={newDriver.ehliyet_gecerlilik_tarihi}
                                        onChange={(e) => setNewDriver({ ...newDriver, ehliyet_gecerlilik_tarihi: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">E-posta Adresi</label>
                                    <input
                                        type="email"
                                        placeholder="surucu@sirket.com"
                                        value={newDriver.email}
                                        onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-end space-x-3">
                                <button type="button" onClick={() => setIsAddDriverOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400">
                                    Vazgeç
                                </button>
                                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25">
                                    Sürücüyü Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Release Assignment Modal */}
            {releasingAssignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setReleasingAssignment(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 space-y-4 z-10">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <ArrowRightLeft className="w-5 h-5 text-red-500" />
                                <span>Aracı İade Al & Zimmeti Kapat</span>
                            </h3>
                            <button onClick={() => setReleasingAssignment(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleReleaseSubmit} className="space-y-4">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border text-xs space-y-1">
                                <div className="font-bold text-slate-900 dark:text-white">
                                    {releasingAssignment.vehicle?.plaka} — {releasingAssignment.vehicle?.marka} {releasingAssignment.vehicle?.model}
                                </div>
                                <div className="text-slate-400">
                                    Teslim Alan: <strong>{releasingAssignment.driver?.ad_soyad}</strong> (Başlangıç: {Number(releasingAssignment.baslangic_km).toLocaleString('tr-TR')} KM)
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">İade Tarihi *</label>
                                <input
                                    type="date"
                                    required
                                    value={releaseDate}
                                    onChange={(e) => setReleaseDate(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">İade Anındaki Bitiş KM *</label>
                                <input
                                    type="number"
                                    required
                                    min={releasingAssignment.baslangic_km}
                                    value={releaseKm}
                                    onChange={(e) => setReleaseKm(e.target.value)}
                                    className="w-full font-mono px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-black text-slate-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">İade Notları (Araç Durumu)</label>
                                <textarea
                                    rows={2}
                                    value={releaseNotes}
                                    onChange={(e) => setReleaseNotes(e.target.value)}
                                    placeholder="Hasar, temizlik veya yakıt durumu..."
                                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-end space-x-3">
                                <button type="button" onClick={() => setReleasingAssignment(null)} className="px-4 py-2 rounded-xl border text-xs font-bold text-slate-400">
                                    Vazgeç
                                </button>
                                <button type="submit" className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/25">
                                    İadeyi Tamamla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            <AssignmentModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                vehicles={vehicles}
                drivers={drivers}
                preselectedDriver={selectedDriverForAssign}
            />
        </AppLayout>
    );
}
