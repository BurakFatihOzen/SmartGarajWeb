import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { 
    ShieldAlert, 
    Car, 
    User, 
    Calendar, 
    DollarSign, 
    PlusCircle, 
    Search, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    Trash2, 
    Eye,
    Percent,
    ExternalLink
} from 'lucide-react';
import FineModal from '../../Components/FineModal';

export default function FleetFines({ fines = [], vehicles = [], drivers = [], kpis = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isFineModalOpen, setIsFineModalOpen] = useState(false);
    const [selectedVehicleForFine, setSelectedVehicleForFine] = useState(null);

    const filteredFines = fines.filter(fine => {
        const matchesSearch = searchTerm === '' ||
            fine.vehicle?.plaka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fine.driver?.ad_soyad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fine.ceza_maddesi?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || fine.durum === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (id, newStatus) => {
        router.post(`/fines/${id}/status`, {
            durum: newStatus,
            odeme_tarihi: newStatus === 'odendi' ? new Date().toISOString().split('T')[0] : null,
        }, { preserveScroll: true });
    };

    const handleDeleteFine = (id) => {
        if (confirm('Bu trafik cezası kaydını silmek istediğinize emin misiniz?')) {
            router.delete(`/fines/${id}`, { preserveScroll: true });
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

    return (
        <AppLayout activeMode="fleet" title="Trafik Cezaları & İhlal Yönetimi">
            <Head title="Trafik Cezaları & İhlal Yönetimi — SmartFilo" />

            <div className="space-y-6 sm:space-y-8">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-black uppercase">
                                CEZA & İHLAL TAKİBİ
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Trafik Cezaları & <span className="text-red-500">Maliyet Portalı</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                            Filonuzdaki araçlara kesilen cezaları, erken ödeme indirim sürelerini ve sürücü bazlı ihlalleri yönetin.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedVehicleForFine(null);
                            setIsFineModalOpen(true);
                        }}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/25 transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
                    >
                        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>Yeni Trafik Cezası Ekle</span>
                    </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Toplam Ceza Tutarı</span>
                            <DollarSign className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            ₺{Number(kpis.totalAmount || 0).toLocaleString('tr-TR')}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">{kpis.totalCount || 0} toplam ceza kaydı</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Ödenmemiş Cezalar</span>
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                            ₺{Number(kpis.unpaidAmount || 0).toLocaleString('tr-TR')}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">{kpis.unpaidCount || 0} bekleyen ödeme</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">%25 İndirimli Ödenecek</span>
                            <Percent className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
                            ₺{Number(kpis.discountedPotential || 0).toLocaleString('tr-TR')}
                        </div>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Erken ödeme avantajı</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Ödenen Cezalar</span>
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                            {fines.filter(f => f.durum === 'odendi').length}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Kapatılmış ceza dosyaları</p>
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
                            placeholder="Plaka, sürücü veya ceza maddesi ara..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="odenmedi">Ödenmemiş (Bekleyen)</option>
                            <option value="odendi">Ödenmiş</option>
                            <option value="itiraz_edildi">İtiraz Edilmiş</option>
                        </select>
                    </div>
                </div>

                {/* Fines Table */}
                <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs min-w-[760px]">
                            <thead className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.06]">
                                <tr>
                                    <th className="px-5 py-4">Tarih & Araç</th>
                                    <th className="px-5 py-4">İhlal Yapan Sürücü</th>
                                    <th className="px-5 py-4">Ceza Maddesi & Detay</th>
                                    <th className="px-5 py-4">Tutar & İndirim</th>
                                    <th className="px-5 py-4">Vade & Durum</th>
                                    <th className="px-5 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {filteredFines.length > 0 ? (
                                    filteredFines.map((fine) => {
                                        const daysRemaining = getDaysRemaining(fine.son_odeme_tarihi);

                                        return (
                                            <tr key={fine.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                                {/* Date & Vehicle */}
                                                <td className="px-5 py-4">
                                                    <div className="space-y-1">
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {new Date(fine.ceza_tarihi).toLocaleDateString('tr-TR')}
                                                        </div>
                                                        {fine.vehicle && (
                                                            <div className="flex items-center space-x-1.5">
                                                                <span className="badge-plate text-[10px] py-0.5 px-2">
                                                                    {fine.vehicle.plaka}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 truncate">
                                                                    {fine.vehicle.marka} {fine.vehicle.model}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Driver */}
                                                <td className="px-5 py-4">
                                                    {fine.driver ? (
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {fine.driver.ad_soyad}
                                                            <div className="text-[10px] text-slate-400 font-normal">{fine.driver.departman || 'Genel'}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400 italic">Plakaya Kesildi</span>
                                                    )}
                                                </td>

                                                {/* Violation / Code */}
                                                <td className="px-5 py-4 max-w-xs">
                                                    <div className="font-bold text-slate-800 dark:text-slate-200">
                                                        {fine.ceza_maddesi}
                                                    </div>
                                                    {fine.aciklama && (
                                                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                                            {fine.aciklama}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Amount & 25% Discount */}
                                                <td className="px-5 py-4 font-mono">
                                                    <div className="font-black text-slate-900 dark:text-white text-sm">
                                                        ₺{Number(fine.tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    {fine.indirimli_tutar && fine.durum === 'odenmedi' && (
                                                        <div className="text-[10px] text-emerald-500 font-bold">
                                                            %25 İndirimli: ₺{Number(fine.indirimli_tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Deadline & Status */}
                                                <td className="px-5 py-4">
                                                    {fine.durum === 'odendi' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold border border-emerald-500/20">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Ödendi ({fine.odeme_tarihi ? new Date(fine.odeme_tarihi).toLocaleDateString('tr-TR') : ''})
                                                        </span>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-extrabold border border-red-500/20">
                                                                Ödenmedi
                                                            </span>
                                                            {daysRemaining !== null && (
                                                                <div className={`text-[10px] font-bold ${daysRemaining <= 7 ? 'text-red-500' : 'text-amber-500'}`}>
                                                                    {daysRemaining < 0 ? 'İndirim süresi geçti' : `İndirime ${daysRemaining} gün kaldı`}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {fine.tutanak_url && (
                                                            <a
                                                                href={fine.tutanak_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                                title="Tutanak Belgesini Gör"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        )}

                                                        {fine.durum !== 'odendi' ? (
                                                            <button
                                                                onClick={() => handleStatusChange(fine.id, 'odendi')}
                                                                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] transition-colors cursor-pointer"
                                                                title="Ödendi Olarak İşaretle"
                                                            >
                                                                Öde
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleStatusChange(fine.id, 'odenmedi')}
                                                                className="text-[10px] text-slate-400 hover:underline cursor-pointer"
                                                                title="Geri Al"
                                                            >
                                                                Geri Al
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleDeleteFine(fine.id)}
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
                                            <ShieldAlert className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <p className="font-bold">Kayıtlı trafik cezası bulunamadı</p>
                                            <p className="text-xs mt-1">Filonuzda ceza kaydı bulunmamaktadır.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Fine Modal */}
            <FineModal
                isOpen={isFineModalOpen}
                onClose={() => setIsFineModalOpen(false)}
                vehicles={vehicles}
                drivers={drivers}
                preselectedVehicle={selectedVehicleForFine}
            />
        </AppLayout>
    );
}
