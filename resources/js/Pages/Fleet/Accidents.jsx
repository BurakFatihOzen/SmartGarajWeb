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
    ExternalLink,
    FileText,
    Camera,
    Percent,
    Wrench,
    FileCheck,
    Layers,
    Phone,
    ChevronRight,
    Eye,
    Pencil
} from 'lucide-react';
import AccidentModal from '../../Components/AccidentModal';

const STAGE_OPTIONS = [
    { value: 'dosya_acildi', label: '1. Dosya Açıldı (Kayıt)', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { value: 'eksper_incelemesinde', label: '2. Eksper İncelemesinde', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { value: 'onarimda', label: '3. Serviste / Onarımda', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { value: 'tramer_onaylandi', label: '4. Tramer Onaylandı', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
    { value: 'kapandi', label: '5. Tazminat Ödendi / Kapandı', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
];

export default function FleetAccidents({ accidents = [], vehicles = [], drivers = [], kpis = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStage, setSelectedStage] = useState('all');
    const [selectedTramer, setSelectedTramer] = useState('all');
    const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);
    const [editingAccident, setEditingAccident] = useState(null);
    const [selectedVehicleForAccident, setSelectedVehicleForAccident] = useState(null);

    // Filter Logic
    const filteredAccidents = accidents.filter(acc => {
        const matchesSearch = searchTerm === '' ||
            acc.vehicle?.plaka?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.dosya_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.sigorta_sirketi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.surucu_adi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.karsi_taraf_plaka?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStage = selectedStage === 'all' || (acc.dosya_durumu || 'dosya_acildi') === selectedStage;
        const matchesTramer = selectedTramer === 'all' || 
            (selectedTramer === 'tramer' && acc.tramer_kaydi) || 
            (selectedTramer === 'not_tramer' && !acc.tramer_kaydi);

        return matchesSearch && matchesStage && matchesTramer;
    });

    const handleUpdateStage = (id, newStage) => {
        router.post(`/accidents/${id}/status`, {
            dosya_durumu: newStage
        }, { preserveScroll: true });
    };

    const handleDeleteAccident = (id) => {
        if (confirm('Bu kaza ve sigorta hasar dosyasını silmek istediğinize emin misiniz?')) {
            router.delete(`/accidents/${id}`, { preserveScroll: true });
        }
    };

    const getStageBadge = (stageValue) => {
        const stage = STAGE_OPTIONS.find(s => s.value === (stageValue || 'dosya_acildi'));
        return stage || STAGE_OPTIONS[0];
    };

    return (
        <AppLayout activeMode="fleet" title="Kaza & Sigorta Hasar Portalı">
            <Head title="Kaza & Sigorta Hasar Portalı — SmartFilo" />

            <div className="space-y-6 sm:space-y-8">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] text-slate-900 dark:text-white p-6 sm:p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-black uppercase">
                                HASAR & SİGORTA DOSYA YÖNETİMİ
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Kaza & Sigorta <span className="text-red-500">Hasar Dosyaları</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                            Filonuzdaki araçların kaza tespit tutanaklarını, eksper aşamalarını, tramer kayıtlarını ve sigorta tazminat süreçlerini uçtan uca takip edin.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedVehicleForAccident(null);
                            setIsAccidentModalOpen(true);
                        }}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/25 transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
                    >
                        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>Yeni Hasar Dosyası Aç</span>
                    </button>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Toplam Onarım Tutarı</span>
                            <DollarSign className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                            ₺{Number(kpis.totalDamage || 0).toLocaleString('tr-TR')}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">{kpis.totalCount || 0} kayıtlı hasar olayı</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Tramer Kaydı Toplamı</span>
                            <Percent className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                            ₺{Number(kpis.totalTramer || 0).toLocaleString('tr-TR')}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Resmi SBM tramer tutarları</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Açık / Süreçteki Dosyalar</span>
                            <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                            {kpis.openCases || 0}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Eksper veya onarım bekleyen</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-1">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-bold">Kapanan Hasar Dosyaları</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
                            {kpis.closedCases || 0}
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold">Tazminatı ödenen / arşivlenen</p>
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
                            placeholder="Plaka, dosya no, sigorta şirketi veya sürücü ara..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <select
                            value={selectedStage}
                            onChange={(e) => setSelectedStage(e.target.value)}
                            className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        >
                            <option value="all">Tüm Dosya Aşamaları</option>
                            {STAGE_OPTIONS.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedTramer}
                            onChange={(e) => setSelectedTramer(e.target.value)}
                            className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                        >
                            <option value="all">Tümü (Tramerli / Tramersiz)</option>
                            <option value="tramer">Sadece Tramer Kayıtlı</option>
                            <option value="not_tramer">Tramer Kaydı Olmayan</option>
                        </select>
                    </div>
                </div>

                {/* Accidents Dossiers List */}
                <div className="space-y-4">
                    {filteredAccidents.length > 0 ? (
                        filteredAccidents.map((acc) => {
                            const stage = getStageBadge(acc.dosya_durumu);
                            const hasParts = Array.isArray(acc.hasarli_parcalar) && acc.hasarli_parcalar.length > 0;
                            const photos = Array.isArray(acc.fotograflar) ? acc.fotograflar : [];

                            return (
                                <div 
                                    key={acc.id}
                                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-white/20 transition-all"
                                >
                                    {/* Dossier Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                                        <div className="flex items-center space-x-3">
                                            <span className="badge-plate text-xs px-3 py-1">
                                                {acc.vehicle?.plaka || '34 SG 000'}
                                            </span>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                                                    {acc.vehicle?.marka} {acc.vehicle?.model} &bull; <span className="text-slate-400 font-semibold">{acc.kaza_turu}</span>
                                                </h4>
                                                <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-0.5">
                                                    <span className="flex items-center gap-1 font-mono">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(acc.kaza_tarihi).toLocaleDateString('tr-TR')}
                                                    </span>
                                                    {acc.kaza_km && (
                                                        <span>{Number(acc.kaza_km).toLocaleString('tr-TR')} KM</span>
                                                    )}
                                                    {acc.surucu_adi && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {acc.surucu_adi}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stage Badge & Dropdown Selector */}
                                        <div className="flex items-center space-x-2">
                                            <select
                                                value={acc.dosya_durumu || 'dosya_acildi'}
                                                onChange={(e) => handleUpdateStage(acc.id, e.target.value)}
                                                className={`text-[11px] font-black px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${stage.color}`}
                                            >
                                                {STAGE_OPTIONS.map(s => (
                                                    <option key={s.value} value={s.value} className="bg-white dark:bg-[#1a1d29] text-slate-900 dark:text-white">
                                                        {s.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={() => {
                                                    setEditingAccident(acc);
                                                    setSelectedVehicleForAccident(acc.vehicle);
                                                    setIsAccidentModalOpen(true);
                                                }}
                                                className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer"
                                                title="Dosyayı Düzenle"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteAccident(acc.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                                                title="Dosyayı Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Dossier Information Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                        {/* Financials */}
                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-1">
                                            <span className="text-[10px] font-extrabold uppercase text-slate-400">Onarım / Hasar</span>
                                            <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                                                ₺{Number(acc.hasar_tutari || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </div>
                                            {acc.tazminat_tutari > 0 && (
                                                <div className="text-[10px] font-bold text-emerald-500">
                                                    Ödenen: ₺{Number(acc.tazminat_tutari).toLocaleString('tr-TR')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tramer & Kusur */}
                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-1">
                                            <span className="text-[10px] font-extrabold uppercase text-slate-400">Tramer & Kusur</span>
                                            <div className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">
                                                {acc.tramer_kaydi ? `₺${Number(acc.tramer_tutari || acc.hasar_tutari || 0).toLocaleString('tr-TR')}` : 'Kayıtsız'}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500">
                                                Kusur Oranı: %{acc.kusur_orani || 0}
                                            </div>
                                        </div>

                                        {/* Insurance & Claim No */}
                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-1">
                                            <span className="text-[10px] font-extrabold uppercase text-slate-400">Sigorta Dosyası</span>
                                            <div className="font-bold text-slate-900 dark:text-white truncate">
                                                {acc.sigorta_sirketi || 'Belirtilmedi'}
                                            </div>
                                            <div className="text-[10px] font-mono text-slate-400 truncate">
                                                {acc.dosya_no ? `No: ${acc.dosya_no}` : 'Dosya no yok'}
                                            </div>
                                        </div>

                                        {/* Expert & Counterparty */}
                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-1">
                                            <span className="text-[10px] font-extrabold uppercase text-slate-400">Eksper & Karşı Taraf</span>
                                            <div className="font-bold text-slate-900 dark:text-white truncate">
                                                {acc.eksper_adi ? `Eksper: ${acc.eksper_adi}` : (acc.karsi_taraf_plaka ? `Karşı: ${acc.karsi_taraf_plaka}` : 'Bilgi yok')}
                                            </div>
                                            {acc.eksper_tel && (
                                                <div className="text-[10px] text-blue-500 font-bold flex items-center gap-1">
                                                    <Phone className="w-2.5 h-2.5" />
                                                    {acc.eksper_tel}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description text */}
                                    {acc.aciklama && (
                                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-white/[0.01] p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                                            {acc.aciklama}
                                        </p>
                                    )}

                                    {/* Damaged Parts Badges (Kaporta Durumu) */}
                                    {hasParts && (
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                                Hasarlı / İşlem Gören Parçalar ({acc.hasarli_parcalar.length})
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {acc.hasarli_parcalar.map((p, pIdx) => (
                                                    <span 
                                                        key={pIdx}
                                                        className="px-2.5 py-1 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[11px] font-bold"
                                                    >
                                                        {p.partName || p.partId || p.id || 'Parça'}: {p.status === 'degisen' ? 'Değişen' : (p.status === 'boyali' ? 'Boyalı' : 'Lokal Boya')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Photos & Report Attachments */}
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        {acc.tutanak_url && (
                                            <a
                                                href={acc.tutanak_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors flex items-center gap-1.5"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                                <span>Kaza Tespit Tutanağı</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}

                                        {photos.map((imgUrl, imgIdx) => (
                                            <a
                                                key={imgIdx}
                                                href={imgUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                                            >
                                                <Camera className="w-3.5 h-3.5 text-amber-500" />
                                                <span>Hasar Fotoğrafı #{imgIdx + 1}</span>
                                                <ExternalLink className="w-3 h-3 opacity-60" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] p-8 text-slate-400 space-y-2">
                            <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-50 text-red-500" />
                            <h4 className="font-extrabold text-base text-slate-800 dark:text-white">Kayıtlı Hasar Dosyası Bulunamadı</h4>
                            <p className="text-xs max-w-sm mx-auto">Filonuzda kayıtlı bir kaza veya sigorta hasar dosyası bulunmamaktadır.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Accident Modal */}
            <AccidentModal
                isOpen={isAccidentModalOpen}
                onClose={() => {
                    setIsAccidentModalOpen(false);
                    setEditingAccident(null);
                }}
                vehicles={vehicles}
                activeVehicle={selectedVehicleForAccident}
                accidentToEdit={editingAccident}
            />
        </AppLayout>
    );
}
