import React, { useRef, useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
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
    Sparkles
} from 'lucide-react';

export default function VehiclesIndex({ vehicles = [] }) {
    const [uploadingId, setUploadingId] = useState(null);

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

    return (
        <AppLayout title="Garajım">
            <Head title="Garajım - Araçlarım" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-3">
                            <Car className="w-7 h-7 text-amber-400" />
                            <span>Garajımdaki Araçlar</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Sisteme kayıtlı toplam <strong className="text-white">{vehicles.length}</strong> araç yönetiliyor.
                        </p>
                    </div>

                    <Link
                        href="/vehicles/create"
                        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Yeni Araç Kaydet</span>
                    </Link>
                </div>

                {/* Grid of Vehicles */}
                {vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((v) => (
                            <div
                                key={v.id}
                                className="p-6 rounded-3xl bg-[#13151b] border border-white/[0.08] hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-5 group relative overflow-hidden shadow-xl"
                            >
                                <div className="space-y-4">
                                    {/* Vehicle Photo Container with Quick Upload */}
                                    <div className="relative h-44 rounded-2xl overflow-hidden bg-[#181b24] border border-white/10 group/photo">
                                        {v.fotograf_url ? (
                                            <img
                                                src={v.fotograf_url}
                                                alt={v.plaka}
                                                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-1">
                                                <Car className="w-10 h-10 text-slate-600" />
                                                <span className="text-[11px] font-semibold">Fotoğraf Eklenmemiş</span>
                                            </div>
                                        )}

                                        {/* Upload Overlay Button */}
                                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold space-y-1">
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
                                        <div className="absolute top-2.5 left-2.5">
                                            <span className="badge-plate text-xs shadow-md">
                                                {v.plaka}
                                            </span>
                                        </div>

                                        <div className="absolute top-2.5 right-2.5">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-xs text-slate-300 border border-white/10">
                                                {v.yil || 'Model Yılı Yok'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Brand & Model */}
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                                            {v.marka} {v.model}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1.5">
                                            <span>Motor: {v.motor || 'Standart'}</span>
                                            <span>&bull;</span>
                                            <span>{v.ruhsat_tipi || 'Otomobil'}</span>
                                        </p>
                                    </div>

                                    {/* Odometer */}
                                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center space-x-2 text-slate-400 text-xs">
                                            <Gauge className="w-4 h-4 text-amber-400" />
                                            <span>Güncel Sayaç:</span>
                                        </div>
                                        <span className="font-mono font-bold text-white text-sm">
                                            {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM
                                        </span>
                                    </div>

                                    {/* Dates Mini Badges */}
                                    <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            <span className="text-slate-500 block font-semibold uppercase">Muayene</span>
                                            {v.muayene_bitis ? (
                                                (() => {
                                                    const d = getDaysRemaining(v.muayene_bitis);
                                                    return (
                                                        <span className={`font-bold font-mono ${d < 0 ? 'text-red-400' : d < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                            {d < 0 ? 'Geçti' : `${d} Gün`}
                                                        </span>
                                                    );
                                                })()
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </div>

                                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            <span className="text-slate-500 block font-semibold uppercase">Sigorta</span>
                                            {v.sigorta_bitis ? (
                                                (() => {
                                                    const d = getDaysRemaining(v.sigorta_bitis);
                                                    return (
                                                        <span className={`font-bold font-mono ${d < 0 ? 'text-red-400' : d < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                            {d < 0 ? 'Geçti' : `${d} Gün`}
                                                        </span>
                                                    );
                                                })()
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </div>

                                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            <span className="text-slate-500 block font-semibold uppercase">Kasko</span>
                                            {v.kasko_bitis ? (
                                                (() => {
                                                    const d = getDaysRemaining(v.kasko_bitis);
                                                    return (
                                                        <span className={`font-bold font-mono ${d < 0 ? 'text-red-400' : d < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                            {d < 0 ? 'Geçti' : `${d} Gün`}
                                                        </span>
                                                    );
                                                })()
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-2">
                                    <Link
                                        href={`/dashboard?arac_id=${v.id}`}
                                        className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-amber-500 hover:text-black text-slate-200 text-xs font-bold text-center transition-all flex items-center justify-center space-x-1.5"
                                    >
                                        <span>Yönet</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>

                                    <Link
                                        href={`/maintenances/create?arac_id=${v.id}`}
                                        title="Bakım Ekle"
                                        className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/20 transition-all"
                                    >
                                        <Wrench className="w-4 h-4" />
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(v.id, v.plaka)}
                                        title="Aracı Sil"
                                        className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center rounded-3xl bg-[#13151b] border border-white/10 space-y-4">
                        <Car className="w-12 h-12 mx-auto text-slate-600" />
                        <h3 className="text-lg font-bold text-white">Henüz kayıtlı bir aracınız yok</h3>
                        <Link
                            href="/vehicles/create"
                            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>İlk Aracınızı Ekleyin</span>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
