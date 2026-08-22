import React, { useState, useMemo } from 'react';
import { Link, router, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import EditVehicleModal from '@/Components/EditVehicleModal';
import { 
    Car, 
    PlusCircle, 
    Wrench, 
    Trash2, 
    Calendar, 
    Shield, 
    Gauge, 
    ExternalLink, 
    Camera, 
    Upload, 
    FileText,
    Sparkles,
    Search,
    LayoutGrid,
    List,
    AlertTriangle,
    CheckCircle2,
    Pencil
} from 'lucide-react';

export default function VehiclesIndex({ vehicles = [] }) {
    const { auth } = usePage().props;
    const isFleet = auth?.user?.hesap_turu === 'filo' || auth?.user?.rol === 'filo';

    const [uploadingId, setUploadingId] = useState(null);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'muayene', 'sigorta'
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const handlePhotoUpload = (e, vehicleId) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingId(vehicleId);
        const formData = new FormData();
        formData.append('fotograf', file);

        router.post(`/vehicles/${vehicleId}/upload-photo`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setUploadingId(null),
        });
    };

    const handleDelete = (id, plaka) => {
        if (confirm(`${plaka} plakalı aracı ve tüm bakım kayıtlarını silmek istediğinizden emin misiniz?`)) {
            router.delete(`/vehicles/${id}`);
        }
    };

    const getDaysRemaining = (dateString) => {
        if (!dateString) return null;
        const target = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Filtered Vehicles
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            const matchesSearch = searchQuery === '' ||
                v.plaka?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.marka?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.model?.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (filterStatus === 'muayene') {
                const days = getDaysRemaining(v.muayene_bitis);
                return days !== null && days <= 45;
            }
            if (filterStatus === 'sigorta') {
                const days = getDaysRemaining(v.sigorta_bitis);
                return days !== null && days <= 45;
            }

            return true;
        });
    }, [vehicles, searchQuery, filterStatus]);

    return (
        <AppLayout title="Garajım">
            <Head title="Garajım - Araçlarım" />

            <div className="space-y-6">
                {/* 1. HEADER & ACTIONS ROW */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                                <Car className="w-5 h-5" />
                            </div>
                            <span>Garajımdaki Araçlar</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Sisteme kayıtlı toplam <strong className="text-slate-800 dark:text-white font-bold">{vehicles.length}</strong> araç ve servis geçmişi yönetiliyor.
                        </p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/vehicles/create"
                            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Yeni Araç Kaydet</span>
                        </Link>
                    </div>
                </div>

                {/* 2. FILTER & SEARCH TOOLBAR (GoDrive & Velo Style) */}
                {vehicles.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Plaka, marka veya model ara..."
                                className="w-full bg-slate-50 dark:bg-[#1a1d27] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs"
                            />
                        </div>

                        {/* Filter Tabs & View Toggle */}
                        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center space-x-1.5 text-xs">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                        filterStatus === 'all' 
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    Tümü ({vehicles.length})
                                </button>
                                <button
                                    onClick={() => setFilterStatus('muayene')}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                        filterStatus === 'muayene' 
                                            ? 'bg-amber-500 text-black shadow-xs' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    Muayenesi Yaklaşan
                                </button>
                                <button
                                    onClick={() => setFilterStatus('sigorta')}
                                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                        filterStatus === 'sigorta' 
                                            ? 'bg-blue-500 text-white shadow-xs' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    Sigortası Yaklaşan
                                </button>
                            </div>

                            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    title="Kart Görünümü"
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                        viewMode === 'grid' ? 'bg-white dark:bg-[#1a1d27] text-amber-500 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    title="Tablo Görünümü"
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                        viewMode === 'list' ? 'bg-white dark:bg-[#1a1d27] text-amber-500 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. VEHICLES SHOWCASE (GRID OR LIST) */}
                {filteredVehicles.length > 0 ? (
                    viewMode === 'grid' ? (
                        /* GRID VIEW */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVehicles.map((v) => (
                                <div
                                    key={v.id}
                                    className="p-6 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden shadow-lg hover:shadow-xl"
                                >
                                    <div className="space-y-4">
                                        {/* Vehicle Photo Container with Cinematic Dual-Layer Showcase */}
                                        <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-200/80 dark:border-white/10 group/photo flex items-center justify-center shadow-inner">
                                            {v.fotograf_url ? (
                                                <>
                                                    {/* Ambient Background Aura */}
                                                    <img
                                                        src={v.fotograf_url}
                                                        alt=""
                                                        aria-hidden="true"
                                                        className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-60 dark:opacity-40 saturate-150 transform-gpu pointer-events-none"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                                                    {/* Foreground Sharp Vehicle (100% visible, never cropped) */}
                                                    <img
                                                        src={v.fotograf_url}
                                                        alt={v.plaka}
                                                        className="relative z-10 w-full h-full object-contain object-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover/photo:scale-105 transition-transform duration-500 p-2"
                                                    />
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-1">
                                                    <Car className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                                                    <span className="text-[11px] font-semibold">Fotoğraf Eklenmemiş</span>
                                                </div>
                                            )}

                                            {/* Upload Overlay Button */}
                                            <label className="absolute inset-0 z-15 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold space-y-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoUpload(e, v.id)}
                                                    className="hidden"
                                                />
                                                <Camera className="w-6 h-6 text-amber-400" />
                                                <span>{uploadingId === v.id ? 'Yükleniyor...' : (v.fotograf_url ? 'Fotoğrafı Değiştir' : 'Fotoğraf Ekle')}</span>
                                            </label>

                                            {/* Quick Badge in Photo */}
                                            <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                                                <span className="badge-plate text-xs shadow-md">
                                                    {v.plaka}
                                                </span>
                                            </div>

                                            <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-black/70 backdrop-blur-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-xs">
                                                    {v.yil || 'Model Yılı Yok'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Brand & Model */}
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-amber-500 transition-colors">
                                                {v.marka} {v.model}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1.5 font-medium">
                                                <span>Motor: {v.motor || 'Standart'}</span>
                                                <span>&bull;</span>
                                                <span>{v.ruhsat_tipi || 'Otomobil'}</span>
                                            </p>
                                        </div>

                                        {/* Odometer */}
                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-xs font-medium">
                                                <Gauge className="w-4 h-4 text-amber-500" />
                                                <span>Güncel Sayaç:</span>
                                            </div>
                                            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                                                {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM
                                            </span>
                                        </div>

                                        {/* Dates Mini Badges */}
                                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
                                                <span className="text-slate-500 block font-semibold uppercase">Muayene</span>
                                                {v.muayene_bitis ? (
                                                    (() => {
                                                        const d = getDaysRemaining(v.muayene_bitis);
                                                        return (
                                                            <span className={`font-bold font-mono ${d < 0 ? 'text-red-500 dark:text-red-400' : d < 30 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                {d < 0 ? 'Geçti' : `${d} Gün`}
                                                            </span>
                                                        );
                                                    })()
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </div>

                                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
                                                <span className="text-slate-500 block font-semibold uppercase">Sigorta</span>
                                                {v.sigorta_bitis ? (
                                                    (() => {
                                                        const d = getDaysRemaining(v.sigorta_bitis);
                                                        return (
                                                            <span className={`font-bold font-mono ${d < 0 ? 'text-red-500 dark:text-red-400' : d < 30 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                {d < 0 ? 'Geçti' : `${d} Gün`}
                                                            </span>
                                                        );
                                                    })()
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </div>

                                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
                                                <span className="text-slate-500 block font-semibold uppercase">Kasko</span>
                                                {v.kasko_bitis ? (
                                                    (() => {
                                                        const d = getDaysRemaining(v.kasko_bitis);
                                                        return (
                                                            <span className={`font-bold font-mono ${d < 0 ? 'text-red-500 dark:text-red-400' : d < 30 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                {d < 0 ? 'Geçti' : `${d} Gün`}
                                                            </span>
                                                        );
                                                    })()
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-white/10 gap-2">
                                        <Link
                                            href={isFleet ? `/fleet?arac_id=${v.id}` : `/dashboard?arac_id=${v.id}`}
                                            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-black dark:bg-white/[0.05] dark:hover:bg-amber-500 dark:hover:text-black text-slate-700 dark:text-slate-200 text-xs font-bold text-center transition-all flex items-center justify-center space-x-1.5 shadow-2xs"
                                        >
                                            <span>Yönet</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>

                                        <button
                                            onClick={() => setEditingVehicle(v)}
                                            title="Aracı Düzenle"
                                            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-black dark:bg-white/[0.05] dark:hover:bg-amber-500 dark:hover:text-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        <Link
                                            href={`/maintenances/create?arac_id=${v.id}`}
                                            title="Bakım Ekle"
                                            className="p-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black border border-amber-500/20 transition-all cursor-pointer"
                                        >
                                            <Wrench className="w-4 h-4" />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(v.id, v.plaka)}
                                            title="Aracı Sil"
                                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* LIST TABLE VIEW (GoDrive Style) */
                        <div className="p-6 rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/[0.08] shadow-xl overflow-hidden">
                            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-50 dark:bg-white/[0.03] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
                                        <tr>
                                            <th className="px-4 py-3.5">Plaka</th>
                                            <th className="px-4 py-3.5">Marka & Model</th>
                                            <th className="px-4 py-3.5">Güncel KM</th>
                                            <th className="px-4 py-3.5">TÜVTÜRK Muayene</th>
                                            <th className="px-4 py-3.5">Trafik Sigortası</th>
                                            <th className="px-4 py-3.5 text-right">Eylemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200/80 dark:divide-white/[0.06]">
                                        {filteredVehicles.map((v) => (
                                            <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="badge-plate text-xs">{v.plaka}</span>
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                                                    {v.marka} {v.model} ({v.yil || '-'})
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    {v.muayene_bitis ? (
                                                        (() => {
                                                            const d = getDaysRemaining(v.muayene_bitis);
                                                            return (
                                                                <span className={`font-bold font-mono ${d < 0 ? 'text-red-500' : d < 30 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                    {d < 0 ? 'Günü Geçti' : `${d} Gün Kaldı`}
                                                                </span>
                                                            );
                                                        })()
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    {v.sigorta_bitis ? (
                                                        (() => {
                                                            const d = getDaysRemaining(v.sigorta_bitis);
                                                            return (
                                                                <span className={`font-bold font-mono ${d < 0 ? 'text-red-500' : d < 30 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                    {d < 0 ? 'Günü Geçti' : `${d} Gün Kaldı`}
                                                                </span>
                                                            );
                                                        })()
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                                                    <Link
                                                        href={isFleet ? `/fleet?arac_id=${v.id}` : `/dashboard?arac_id=${v.id}`}
                                                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:brightness-110 transition-all inline-flex items-center space-x-1"
                                                    >
                                                        <span>Yönet</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => setEditingVehicle(v)}
                                                        title="Aracı Düzenle"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors cursor-pointer"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(v.id, v.plaka)}
                                                        title="Aracı Sil"
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
                        </div>
                    )
                ) : (
                    <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#13151b] border border-slate-200/80 dark:border-white/10 space-y-4 shadow-lg">
                        <Car className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-600" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Aradığınız kriterlere uygun araç bulunamadı</h3>
                        <button
                            onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Vehicle Modal */}
            <EditVehicleModal
                isOpen={!!editingVehicle}
                onClose={() => setEditingVehicle(null)}
                vehicle={editingVehicle}
            />
        </AppLayout>
    );
}
