import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
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
    ExternalLink,
    Layers,
    Road
} from 'lucide-react';
import FineModal from '../../Components/FineModal';
import CustomSelect from '../../Components/CustomSelect';

export default function FleetFines({ fines = [], vehicles = [], drivers = [], kpis = {} }) {
    const { auth } = usePage().props;
    const isFleetMode = auth?.user?.rol === 'filo' || auth?.user?.hesap_turu === 'filo';

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all'); // 'all' | 'trafik_cezasi' | 'hgs_ihlal'
    const [isFineModalOpen, setIsFineModalOpen] = useState(false);
    const [selectedVehicleForFine, setSelectedVehicleForFine] = useState(null);

    const filteredFines = fines.filter(fine => {
        const matchesSearch = searchTerm === '' ||
            fine.vehicle?.plaka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fine.driver?.ad_soyad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fine.ceza_maddesi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fine.otoyol_kopru?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || fine.durum === selectedStatus;
        const matchesType = selectedType === 'all' || 
            (selectedType === 'hgs_ihlal' && fine.ceza_tipi === 'hgs_ihlal') ||
            (selectedType === 'trafik_cezasi' && (fine.ceza_tipi === 'trafik_cezasi' || !fine.ceza_tipi));

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleStatusChange = (id, newStatus) => {
        router.post(`/fines/${id}/status`, {
            durum: newStatus,
            odeme_tarihi: newStatus === 'odendi' ? new Date().toISOString().split('T')[0] : null,
        }, { preserveScroll: true });
    };

    const handleDeleteFine = (id) => {
        if (confirm('Bu ceza / ihlal kaydını silmek istediğinize emin misiniz?')) {
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
        <AppLayout activeMode={isFleetMode ? "fleet" : "individual"} title="Trafik Cezaları & HGS İhlal Yönetimi">
            <Head title="Trafik Cezaları & HGS İhlalleri — SmartGaraj" />

            <div className="space-y-6 sm:space-y-8">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-black uppercase">
                                CEZA & HGS İHLAL TAKİBİ
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Trafik & <span className="text-red-500">HGS Geçiş Cezaları</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                            Araçlarınıza kesilen trafik cezalarını, otoyol/köprü HGS geçiş ihlallerini ve %25 erken ödeme indirim sürelerini takip edin.
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
                        <span>Yeni Ceza / HGS İhlali Ekle</span>
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
                        <p className="text-[11px] text-slate-400 font-semibold">{kpis.totalCount || 0} toplam kayıt</p>
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
                            <span className="text-xs font-bold">HGS / OGS İhlalleri</span>
                            <Layers className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                            {kpis.hgsCount || 0} Adet
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Köprü / Otoyol kaçak geçiş</p>
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
                            placeholder="Plaka, sürücü, otoyol veya madde ara..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <CustomSelect
                            options={[
                                { value: 'all', label: 'Tüm Ceza Türleri' },
                                { value: 'trafik_cezasi', label: 'Trafik Cezaları', icon: <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> },
                                { value: 'hgs_ihlal', label: 'HGS / OGS İhlalleri', icon: <Road className="w-3.5 h-3.5 text-blue-500" /> },
                            ]}
                            value={selectedType}
                            onChange={(val) => setSelectedType(val)}
                            className="w-48"
                        />

                        <CustomSelect
                            options={[
                                { value: 'all', label: 'Tüm Durumlar' },
                                { value: 'odenmedi', label: 'Ödenmemiş', icon: <Clock className="w-3.5 h-3.5 text-red-500" /> },
                                { value: 'odendi', label: 'Ödenmiş', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
                                { value: 'itiraz_edildi', label: 'İtiraz Edildi', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> },
                            ]}
                            value={selectedStatus}
                            onChange={(val) => setSelectedStatus(val)}
                            className="w-44"
                        />
                    </div>
                </div>

                {/* Fines Table */}
                <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs min-w-[760px]">
                            <thead className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.06]">
                                <tr>
                                    <th className="px-5 py-4">Tarih & Araç</th>
                                    <th className="px-5 py-4">Tür & İhlal Detayı</th>
                                    <th className="px-5 py-4">Sürücü / Sorumlu</th>
                                    <th className="px-5 py-4">Tutar & %25 İndirim</th>
                                    <th className="px-5 py-4">Vade & Durum</th>
                                    <th className="px-5 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {filteredFines.length > 0 ? (
                                    filteredFines.map((fine) => {
                                        const daysRemaining = getDaysRemaining(fine.son_odeme_tarihi);
                                        const isHgs = fine.ceza_tipi === 'hgs_ihlal';

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

                                                {/* Violation / Code & HGS Badge */}
                                                <td className="px-5 py-4 max-w-xs">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            {isHgs ? (
                                                                <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase">
                                                                    🛣️ HGS GEÇİŞ İHLALİ
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[10px] font-black uppercase">
                                                                    🚨 TRAFİK CEZASI
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="font-bold text-slate-800 dark:text-slate-200">
                                                            {fine.ceza_maddesi}
                                                        </div>
                                                        {fine.otoyol_kopru && (
                                                            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                                                                <Road className="w-3 h-3" />
                                                                <span>{fine.otoyol_kopru}</span>
                                                            </div>
                                                        )}
                                                        {fine.aciklama && (
                                                            <div className="text-[10px] text-slate-400 truncate">
                                                                {fine.aciklama}
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

                                                {/* Amount & 25% Discount */}
                                                <td className="px-5 py-4 font-mono">
                                                    <div className="font-black text-slate-900 dark:text-white text-sm">
                                                        ₺{Number(fine.tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    {fine.gecis_ucreti > 0 && isHgs && (
                                                        <div className="text-[10px] text-slate-400">
                                                            Asıl Geçiş: ₺{Number(fine.gecis_ucreti).toLocaleString('tr-TR')}
                                                        </div>
                                                    )}
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
                                                    ) : fine.durum === 'itiraz_edildi' ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold border border-amber-500/20">
                                                            <AlertTriangle className="w-3.5 h-3.5" />
                                                            İtiraz Edildi
                                                        </span>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-extrabold border border-red-500/20">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Ödenmedi
                                                            </span>
                                                            {daysRemaining !== null && (
                                                                <div className={`text-[10px] font-bold ${daysRemaining < 7 ? 'text-red-500' : 'text-slate-400'}`}>
                                                                    {daysRemaining > 0 ? `${daysRemaining} gün kaldı` : 'Vadesi geçti'}
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
                                                                className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                                                title="Tutanak / Tebligat Görseli"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        )}

                                                        {fine.durum !== 'odendi' ? (
                                                            <button
                                                                onClick={() => handleStatusChange(fine.id, 'odendi')}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white text-[11px] font-extrabold transition-all cursor-pointer"
                                                            >
                                                                Ödendi Yap
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleStatusChange(fine.id, 'odenmedi')}
                                                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-500 hover:text-red-500 text-[11px] font-bold transition-all cursor-pointer"
                                                            >
                                                                Geri Al
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleDeleteFine(fine.id)}
                                                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                                            title="Cezayı Sil"
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
                                        <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                                            <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40 text-red-500" />
                                            <p className="font-bold text-xs">Kayıtlı trafik veya HGS cezası bulunamadı.</p>
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
