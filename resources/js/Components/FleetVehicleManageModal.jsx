import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { 
    Building2, 
    User, 
    UserCheck, 
    UserMinus, 
    ArrowRightLeft, 
    Gauge, 
    FileText, 
    X, 
    CheckCircle2, 
    AlertTriangle, 
    ShieldCheck, 
    Sparkles, 
    Fuel, 
    Layers, 
    Calendar, 
    Plus,
    Car,
    Briefcase
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import { FLEET_STATUS_OPTIONS, OWNERSHIP_OPTIONS, CORPORATE_DEPARTMENTS, getStatusBadgeObj } from '@/constants/fleet';

export default function FleetVehicleManageModal({ 
    isOpen, 
    onClose, 
    vehicle, 
    drivers = [] 
}) {
    if (!isOpen || !vehicle) return null;

    const [activeTab, setActiveTab] = useState('status'); // 'status' | 'assignment'
    const [status, setStatus] = useState(vehicle.durum || 'aktif');
    const [ownership, setOwnership] = useState(vehicle.sozlesme_turu || 'Özmal');
    const [department, setDepartment] = useState(vehicle.departman || 'Genel Havuz (Ortak Kullanım)');
    const [customDept, setCustomDept] = useState('');
    const [isCustomDept, setIsCustomDept] = useState(false);
    const [km, setKm] = useState(vehicle.guncel_km || '');
    const [notes, setNotes] = useState(vehicle.notlar || '');
    
    // Assignment State
    const [assignmentMode, setAssignmentMode] = useState('keep'); // 'keep' | 'assign' | 'unassign'
    const [selectedDriverId, setSelectedDriverId] = useState(vehicle.active_assignment?.surucu_id || '');
    const [manualDriverName, setManualDriverName] = useState(vehicle.zimmet_surucu_adi || '');
    const [handoverKm, setHandoverKm] = useState(vehicle.guncel_km || '');
    const [fuelLevel, setFuelLevel] = useState(vehicle.active_assignment?.yakit_seviyesi || '%100');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setStatus(vehicle.durum || 'aktif');
            setOwnership(vehicle.sozlesme_turu || 'Özmal');
            setDepartment(vehicle.departman || 'Genel Havuz (Ortak Kullanım)');
            setKm(vehicle.guncel_km || '');
            setNotes(vehicle.notlar || '');
            setSelectedDriverId(vehicle.active_assignment?.surucu_id || '');
            setManualDriverName(vehicle.zimmet_surucu_adi || '');
            setHandoverKm(vehicle.guncel_km || '');
            setAssignmentMode('keep');
        }
    }, [vehicle]);

    const handleDepartmentSelect = (deptName) => {
        setDepartment(deptName);
        setIsCustomDept(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const finalDept = isCustomDept && customDept ? customDept : department;

        const payload = {
            durum: assignmentMode === 'unassign' ? 'aktif' : (assignmentMode === 'assign' ? 'gorevde' : status),
            departman: finalDept,
            sozlesme_turu: ownership,
            guncel_km: km || handoverKm,
            notlar: notes,
            action_type: assignmentMode,
            yakit_seviyesi: fuelLevel
        };

        if (assignmentMode === 'unassign') {
            payload.surucu_id = 'unassign';
            payload.zimmet_surucu_adi = null;
        } else if (assignmentMode === 'assign') {
            if (selectedDriverId) {
                payload.surucu_id = selectedDriverId;
            } else {
                payload.zimmet_surucu_adi = manualDriverName;
            }
        } else {
            payload.surucu_id = selectedDriverId || null;
            payload.zimmet_surucu_adi = manualDriverName || null;
        }

        router.post(`/fleet/vehicles/${vehicle.id}/status`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const currentStatusBadge = getStatusBadgeObj(status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl flex flex-col">
                
                {/* Modal Top Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                                    Filo Operasyon Yönetimi
                                </span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${currentStatusBadge.colorClass}`}>
                                    {currentStatusBadge.label}
                                </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Araç Durumu, Zimmet & Departman Ataması
                            </h3>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Target Vehicle Summary Card */}
                <div className="px-5 sm:px-6 py-3 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent border-b border-slate-100 dark:border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                        <div className="badge-plate text-xs font-black px-2.5 py-1">
                            {vehicle.plaka}
                        </div>
                        <div>
                            <div className="text-xs font-black text-slate-900 dark:text-white">
                                {vehicle.marka} {vehicle.model}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                                {vehicle.yil} &bull; {vehicle.motor || 'Standart'} &bull; {Number(vehicle.guncel_km || 0).toLocaleString('tr-TR')} KM
                            </div>
                        </div>
                    </div>

                    {vehicle.zimmet_surucu_adi ? (
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/[0.04] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span>Zimmetli: <strong className="text-blue-600 dark:text-blue-400">{vehicle.zimmet_surucu_adi}</strong></span>
                        </div>
                    ) : (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                            ● Havuzda / Boşta
                        </span>
                    )}
                </div>

                {/* Nav Tabs */}
                <div className="flex border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/30 dark:bg-white/[0.01] px-5 sm:px-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('status')}
                        className={`py-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                            activeTab === 'status'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        <span>Filo Durumu & Departman</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('assignment')}
                        className={`py-3 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                            activeTab === 'assignment'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <UserCheck className="w-4 h-4" />
                        <span>Sürücü Zimmeti & Devir</span>
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                    {activeTab === 'status' && (
                        <div className="space-y-5">
                            {/* 1. Status Dropdown */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5">
                                    Operasyonel Filo Durumu *
                                </label>
                                <CustomSelect
                                    options={FLEET_STATUS_OPTIONS}
                                    value={status}
                                    onChange={(val) => setStatus(val)}
                                    placeholder="Filo Durumu Seçiniz..."
                                />
                            </div>

                            {/* 2. Ownership & KM */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5">
                                        Mülkiyet / Sözleşme Türü
                                    </label>
                                    <CustomSelect
                                        options={OWNERSHIP_OPTIONS}
                                        value={ownership}
                                        onChange={(val) => setOwnership(val)}
                                        placeholder="Mülkiyet Türü Seçiniz..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                                        <Gauge className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Güncel Kilometre (KM)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={km}
                                        onChange={(e) => setKm(e.target.value)}
                                        placeholder="Örn: 125000"
                                        className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-black font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* 3. Department Selection (Pills + Custom) */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>Atanan Departman / Saha Birimi</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomDept(!isCustomDept)}
                                        className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer"
                                    >
                                        {isCustomDept ? 'Hazır Listeye Dön' : '+ Özel Departman Yaz'}
                                    </button>
                                </div>

                                {isCustomDept ? (
                                    <input
                                        type="text"
                                        value={customDept}
                                        onChange={(e) => setCustomDept(e.target.value)}
                                        placeholder="Özel Departman Adı (Örn: Ege Bölge Saha Ekibi)"
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-blue-500 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {CORPORATE_DEPARTMENTS.map((dept) => {
                                            const isSelected = department === dept.name;
                                            return (
                                                <button
                                                    key={dept.name}
                                                    type="button"
                                                    onClick={() => handleDepartmentSelect(dept.name)}
                                                    className={`p-2 rounded-xl text-left text-xs font-bold border transition-all flex items-center space-x-2 cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs'
                                                            : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                                                    }`}
                                                >
                                                    <span className="text-sm shrink-0">{dept.icon}</span>
                                                    <span className="truncate text-[11px]">{dept.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* 4. Notes */}
                            <div>
                                <label className="block text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5">
                                    Operasyonel Açıklama & Notlar
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows="2"
                                    placeholder="Araç durumu veya filo operasyonuna dair dahili notlar..."
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'assignment' && (
                        <div className="space-y-5">
                            {/* Mode Selection Pill Buttons */}
                            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setAssignmentMode('keep')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        assignmentMode === 'keep'
                                            ? 'bg-white dark:bg-[#1a1d29] text-slate-900 dark:text-white shadow-xs font-black'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                    }`}
                                >
                                    Mevcut Durumu Koru
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAssignmentMode('assign')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                        assignmentMode === 'assign'
                                            ? 'bg-blue-600 text-white shadow-xs font-black'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                    }`}
                                >
                                    <ArrowRightLeft className="w-3.5 h-3.5" />
                                    <span>Zimmetle / Devret</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAssignmentMode('unassign')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                        assignmentMode === 'unassign'
                                            ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                    }`}
                                >
                                    <UserMinus className="w-3.5 h-3.5" />
                                    <span>Havuza Al (İade)</span>
                                </button>
                            </div>

                            {/* Unassign Notice */}
                            {assignmentMode === 'unassign' && (
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 space-y-2">
                                    <div className="flex items-center space-x-2 font-black text-xs">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        <span>Araç Havuza İade Edilecek</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed">
                                        <strong>{vehicle.zimmet_surucu_adi || 'Mevcut personel'}</strong> üzerindeki aktif zimmet protokolü kapatılacak ve araç filoda <strong>"Aktif / Havuzda (Boşta)"</strong> durumuna getirilecektir.
                                    </p>
                                </div>
                            )}

                            {/* Assign / Transfer Form */}
                            {assignmentMode === 'assign' && (
                                <div className="space-y-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15">
                                    <div>
                                        <label className="block text-xs font-black text-slate-700 dark:text-slate-200 mb-1.5">
                                            Zimmetlenecek Sürücü / Personel Seçin *
                                        </label>
                                        
                                        {drivers.length > 0 ? (
                                            <select
                                                value={selectedDriverId}
                                                onChange={(e) => {
                                                    setSelectedDriverId(e.target.value);
                                                    const drv = drivers.find(d => String(d.id) === String(e.target.value));
                                                    if (drv) {
                                                        setManualDriverName(drv.ad_soyad);
                                                        if (drv.departman) setDepartment(drv.departman);
                                                    }
                                                }}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">-- Kayıtlı Sürücülerden Seçin --</option>
                                                {drivers.map(d => (
                                                    <option key={d.id} value={d.id}>
                                                        {d.ad_soyad} {d.departman ? `(${d.departman})` : ''} {d.active_assignment ? `[Şu an ${d.active_assignment.vehicle?.plaka || 'Araçta'}]` : '[Müsait]'}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : null}

                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={manualDriverName}
                                                onChange={(e) => setManualDriverName(e.target.value)}
                                                placeholder="Veya elle personel adı girin (Örn: Mehmet Öz)"
                                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                                <Gauge className="w-3 h-3 text-amber-500" />
                                                <span>Teslim Başlangıç KM *</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={handoverKm}
                                                onChange={(e) => setHandoverKm(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                                <Fuel className="w-3 h-3 text-emerald-500" />
                                                <span>Depo Yakıt Seviyesi</span>
                                            </label>
                                            <select
                                                value={fuelLevel}
                                                onChange={(e) => setFuelLevel(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                                            >
                                                <option value="%100">Dolu (%100)</option>
                                                <option value="%75">3/4 Depo (%75)</option>
                                                <option value="%50">Yarım Depo (%50)</option>
                                                <option value="%25">1/4 Depo (%25)</option>
                                                <option value="Rezerv">Rezerv / Çeyrek Altı</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Keep mode summary */}
                            {assignmentMode === 'keep' && (
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs">
                                    <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-blue-500" />
                                        <span>Mevcut Zimmet Durumu</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                                        <div>Sürücü: <strong className="text-slate-900 dark:text-white">{vehicle.zimmet_surucu_adi || 'Atanmadı'}</strong></div>
                                        <div>Departman: <strong className="text-slate-900 dark:text-white">{vehicle.departman || 'Genel Havuz'}</strong></div>
                                        <div>Durum: <strong className="text-slate-900 dark:text-white">{currentStatusBadge.label}</strong></div>
                                        <div>KM: <strong className="text-slate-900 dark:text-white">{Number(vehicle.guncel_km || 0).toLocaleString('tr-TR')} KM</strong></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                        >
                            İptal
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <span>Kaydediliyor...</span>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Değişiklikleri Kaydet</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
