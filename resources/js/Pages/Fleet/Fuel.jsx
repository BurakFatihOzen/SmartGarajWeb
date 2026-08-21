import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { 
    Fuel, 
    Car, 
    User, 
    Calendar, 
    DollarSign, 
    PlusCircle, 
    Search, 
    Gauge, 
    Trash2, 
    ExternalLink,
    TrendingUp,
    Droplet,
    Sparkles
} from 'lucide-react';
import FuelModal from '../../Components/FuelModal';

export default function FleetFuel({ fuelLogs = [], vehicles = [], drivers = [], kpis = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFuelType, setSelectedFuelType] = useState('all');
    const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
    const [selectedVehicleForFuel, setSelectedVehicleForFuel] = useState(null);

    const filteredLogs = fuelLogs.filter(log => {
        const matchesSearch = searchTerm === '' ||
            log.vehicle?.plaka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.driver?.ad_soyad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.istasyon?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFuel = selectedFuelType === 'all' || log.yakit_turu === selectedFuelType;
        return matchesSearch && matchesFuel;
    });

    const handleDeleteFuel = (id) => {
        if (confirm('Bu yakıt fişi kaydını silmek istediğinize emin misiniz?')) {
            router.delete(`/fuel/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout activeMode="fleet" title="Yakıt Tüketim & Gider Yönetimi">
            <Head title="Yakıt Tüketim & Gider Yönetimi — SmartFilo" />

            <div className="space-y-6 sm:space-y-8">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase">
                                ENERJİ & TÜKETİM
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Yakıt & <span className="text-emerald-500">Tüketim Analizi</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                            Filonuzdaki araçların akaryakıt fişlerini, istasyon harcamalarını ve litre başı birim maliyetlerini izleyin.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedVehicleForFuel(null);
                            setIsFuelModalOpen(true);
                        }}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
                    >
                        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>Yakıt Alım Fişi Ekle</span>
                    </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Toplam Yakıt Gideri</span>
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            ₺{Number(kpis.totalSpent || 0).toLocaleString('tr-TR')}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">{kpis.totalFills || 0} dolum kaydı</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Toplam Alınan Litre</span>
                            <Droplet className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                            {Number(kpis.totalLiters || 0).toLocaleString('tr-TR')} <span className="text-sm font-bold">Lt</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Tüm filo toplamı</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Ortalama Birim Fiyat</span>
                            <TrendingUp className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                            ₺{Number(kpis.avgUnitPrice || 0).toFixed(2)}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">₺ / Litre ortalaması</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Son 30 Gün Harcama</span>
                            <Calendar className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                            ₺{Number(kpis.last30DaysSpent || 0).toLocaleString('tr-TR')}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Bu ayki akaryakıt bütçesi</p>
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
                            placeholder="Plaka, sürücü veya istasyon ara..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <select
                            value={selectedFuelType}
                            onChange={(e) => setSelectedFuelType(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        >
                            <option value="all">Tüm Yakıt Türleri</option>
                            <option value="Benzin">Benzin</option>
                            <option value="Dizel (Motorin)">Dizel (Motorin)</option>
                            <option value="LPG / Otogaz">LPG / Otogaz</option>
                            <option value="Elektrik (kWh)">Elektrik (kWh)</option>
                        </select>
                    </div>
                </div>

                {/* Fuel Logs Table */}
                <div className="rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-xs min-w-[760px]">
                            <thead className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.06]">
                                <tr>
                                    <th className="px-5 py-4">Tarih & Araç</th>
                                    <th className="px-5 py-4">Sürücü & İstasyon</th>
                                    <th className="px-5 py-4">Sayaç KM</th>
                                    <th className="px-5 py-4">Litre & Birim Fiyat</th>
                                    <th className="px-5 py-4">Toplam Tutar</th>
                                    <th className="px-5 py-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {filteredLogs.length > 0 ? (
                                    filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                            {/* Date & Vehicle */}
                                            <td className="px-5 py-4">
                                                <div className="space-y-1">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {new Date(log.tarih).toLocaleDateString('tr-TR')}
                                                    </div>
                                                    {log.vehicle && (
                                                        <div className="flex items-center space-x-1.5">
                                                            <span className="badge-plate text-[10px] py-0.5 px-2">
                                                                {log.vehicle.plaka}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 truncate">
                                                                {log.vehicle.marka} {log.vehicle.model}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Driver & Station */}
                                            <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                                                <div className="flex items-center space-x-1.5">
                                                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                                                        {log.istasyon || 'İstasyon'}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-normal">({log.yakit_turu})</span>
                                                </div>
                                                <div className="text-[11px] text-slate-900 dark:text-white font-bold mt-1">
                                                    {log.driver ? log.driver.ad_soyad : 'Sürücü Belirtilmedi'}
                                                </div>
                                            </td>

                                            {/* KM */}
                                            <td className="px-5 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                {Number(log.km).toLocaleString('tr-TR')} KM
                                            </td>

                                            {/* Liter & Unit Price */}
                                            <td className="px-5 py-4 font-mono">
                                                <div className="font-black text-slate-900 dark:text-white">
                                                    {Number(log.litre).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} Lt
                                                </div>
                                                <div className="text-[10px] text-slate-400">
                                                    ₺{Number(log.birim_fiyat).toFixed(2)} / Lt
                                                </div>
                                            </td>

                                            {/* Total Amount */}
                                            <td className="px-5 py-4 font-mono">
                                                <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                                    ₺{Number(log.toplam_tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {log.fis_url && (
                                                        <a
                                                            href={log.fis_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                                                            title="Yakıt Fişini Gör"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}

                                                    <button
                                                        onClick={() => handleDeleteFuel(log.id)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <Fuel className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                            <p className="font-bold">Kayıtlı yakıt fişi bulunamadı</p>
                                            <p className="text-xs mt-1">Akaryakıt alımlarınızı kaydederek maliyetleri takip edin.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Fuel Modal */}
            <FuelModal
                isOpen={isFuelModalOpen}
                onClose={() => setIsFuelModalOpen(false)}
                vehicles={vehicles}
                drivers={drivers}
                preselectedVehicle={selectedVehicleForFuel}
            />
        </AppLayout>
    );
}
