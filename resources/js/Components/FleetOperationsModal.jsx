import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import CustomDropdown from '@/Components/CustomDropdown';
import { 
    FLEET_STATUS_OPTIONS, 
    FLEET_OWNERSHIP_OPTIONS, 
    FLEET_DEPARTMENT_OPTIONS 
} from '@/Utils/fleetConstants';
import { 
    X, 
    Car, 
    User, 
    UserCheck, 
    UserMinus, 
    UserPlus, 
    ArrowRightLeft, 
    RotateCcw, 
    CheckCircle2, 
    AlertCircle, 
    Gauge, 
    Calendar, 
    Fuel, 
    FileText, 
    Building2, 
    Layers, 
    Wrench,
    ShieldAlert,
    Clock,
    Sparkles
} from 'lucide-react';

export default function FleetOperationsModal({ 
    isOpen, 
    onClose, 
    vehicle, 
    drivers = [], 
    vehicles = [],
    initialTab = 'status' 
}) {
    if (!isOpen || !vehicle) return null;

    const [activeTab, setActiveTab] = useState(initialTab); // 'status', 'assign', 'release', 'swap'
    const [loading, setLoading] = useState(false);

    // Form States - Status Change
    const [status, setStatus] = useState(vehicle.durum || 'aktif');
    const [department, setDepartment] = useState(vehicle.departman || 'Saha Satış & Pazarlama');
    const [ownership, setOwnership] = useState(vehicle.sozlesme_turu || 'Özmal');
    const [km, setKm] = useState(vehicle.guncel_km || '');
    const [notes, setNotes] = useState(vehicle.notlar || '');

    // Form States - Assignment
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [customDriverName, setCustomDriverName] = useState('');
    const [assignKm, setAssignKm] = useState(vehicle.guncel_km || '');
    const [assignDate, setAssignDate] = useState(new Date().toISOString().split('T')[0]);
    const [assignFuel, setAssignFuel] = useState('%100 (Dolu)');
    const [assignNote, setAssignNote] = useState('');

    // Form States - Release
    const [releaseKm, setReleaseKm] = useState(vehicle.guncel_km || '');
    const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [releaseNote, setReleaseNote] = useState('');

    // Form States - Swap Driver Vehicle
    const [swapTargetVehicleId, setSwapTargetVehicleId] = useState('');

    useEffect(() => {
        if (vehicle) {
            setStatus(vehicle.durum || 'aktif');
            setDepartment(vehicle.departman || 'Saha Satış & Pazarlama');
            setOwnership(vehicle.sozlesme_turu || 'Özmal');
            setKm(vehicle.guncel_km || '');
            setNotes(vehicle.notlar || '');
            setAssignKm(vehicle.guncel_km || '');
            setReleaseKm(vehicle.guncel_km || '');
        }
    }, [vehicle]);

    // Handle Status Change
    const handleStatusSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post(`/fleet/vehicles/${vehicle.id}/status`, {
            durum: status,
            departman: department,
            sozlesme_turu: ownership,
            guncel_km: km,
            notlar: notes,
            zimmet_surucu_adi: status === 'aktif' ? null : vehicle.zimmet_surucu_adi,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                onClose();
            },
            onError: () => setLoading(false)
        });
    };

    // Handle New Assignment
    const handleAssignSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // If driver selected from registered list
        if (selectedDriverId) {
            router.post('/fleet/assignments', {
                arac_id: vehicle.id,
                surucu_id: selectedDriverId,
                teslim_tarihi: assignDate,
                baslangic_km: assignKm,
                yakit_seviyesi: assignFuel,
                teslim_notu: assignNote,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    onClose();
                },
                onError: () => setLoading(false)
            });
        } else if (customDriverName.trim()) {
            // If manual driver name typed
            router.post(`/fleet/vehicles/${vehicle.id}/status`, {
                durum: 'gorevde',
                zimmet_surucu_adi: customDriverName.trim(),
                guncel_km: assignKm,
                notlar: assignNote ? `${vehicle.notlar || ''}\nZimmet Notu: ${assignNote}`.trim() : vehicle.notlar,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    onClose();
                },
                onError: () => setLoading(false)
            });
        }
    };

    // Handle Vehicle Release (İade Al)
    const handleReleaseSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (vehicle.active_assignment?.id) {
            router.post(`/fleet/assignments/${vehicle.active_assignment.id}/release`, {
                iade_tarihi: releaseDate,
                bitis_km: releaseKm,
                iade_notu: releaseNote,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    onClose();
                },
                onError: () => setLoading(false)
            });
        } else {
            // Direct release back to pool
            router.post(`/fleet/vehicles/${vehicle.id}/status`, {
                durum: 'aktif',
                zimmet_surucu_adi: null,
                guncel_km: releaseKm,
                notlar: releaseNote ? `${vehicle.notlar || ''}\nİade Notu: ${releaseNote}`.trim() : vehicle.notlar,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    onClose();
                },
                onError: () => setLoading(false)
            });
        }
    };

    // Handle Swap Vehicle for Driver
    const handleSwapSubmit = (e) => {
        e.preventDefault();
        if (!swapTargetVehicleId || !vehicle.active_assignment?.surucu_id) return;

        setLoading(true);
        // Step 1: release current vehicle, then assign new vehicle
        router.post(`/fleet/assignments/${vehicle.active_assignment.id}/release`, {
            iade_tarihi: new Date().toISOString().split('T')[0],
            bitis_km: vehicle.guncel_km || 0,
            iade_notu: 'Araç değişimi nedeniyle iade alındı.',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                const targetVehicle = vehicles.find(v => v.id === Number(swapTargetVehicleId));
                router.post('/fleet/assignments', {
                    arac_id: swapTargetVehicleId,
                    surucu_id: vehicle.active_assignment.surucu_id,
                    teslim_tarihi: new Date().toISOString().split('T')[0],
                    baslangic_km: targetVehicle?.guncel_km || 0,
                    yakit_seviyesi: '%100',
                    teslim_notu: `${vehicle.plaka} plakalı araçtan geçiş yapıldı.`,
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setLoading(false);
                        onClose();
                    },
                    onError: () => setLoading(false)
                });
            },
            onError: () => setLoading(false)
        });
    };

    const hasActiveAssignment = !!(vehicle.zimmet_surucu_adi || vehicle.active_assignment);
    const availableOtherVehicles = vehicles.filter(v => v.id !== vehicle.id && v.durum === 'aktif');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
                            <Car className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                    Filo & Zimmet Operasyonu
                                </h3>
                                <span className="badge-plate text-xs">{vehicle.plaka}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {vehicle.marka} {vehicle.model} ({vehicle.yil}) &bull; {vehicle.departman || 'Genel Havuz'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/30 dark:bg-white/[0.01] p-1.5 gap-1 overflow-x-auto text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => setActiveTab('status')}
                        className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'status'
                                ? 'bg-white dark:bg-[#1c1f2e] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/10'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Durum & Departman</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('assign')}
                        className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'assign'
                                ? 'bg-white dark:bg-[#1c1f2e] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-white/10'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Personele Zimmetle</span>
                    </button>

                    {hasActiveAssignment && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('release')}
                            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'release'
                                    ? 'bg-white dark:bg-[#1c1f2e] text-red-600 dark:text-red-400 shadow-sm border border-slate-200 dark:border-white/10'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>İade Al / Havuza Çıkar</span>
                        </button>
                    )}

                    {hasActiveAssignment && availableOtherVehicles.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setActiveTab('swap')}
                            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'swap'
                                    ? 'bg-white dark:bg-[#1c1f2e] text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-white/10'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Araç Değiştir</span>
                        </button>
                    )}
                </div>

                {/* Form Bodies */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    {/* TAB 1: STATUS CHANGE */}
                    {activeTab === 'status' && (
                        <form onSubmit={handleStatusSubmit} className="space-y-4">
                            <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/15 flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-300">
                                    Aracın operasyonel durumunu (Servis, Görev, Muayene vb.) ve şirket içi departman atamasını güncelleyin.
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CustomDropdown
                                    label="Operasyonel Filo Durumu"
                                    icon={Building2}
                                    value={status}
                                    options={FLEET_STATUS_OPTIONS}
                                    onChange={(val) => setStatus(val)}
                                />

                                <CustomDropdown
                                    label="Departman / Saha Birimi"
                                    icon={Layers}
                                    value={department}
                                    options={FLEET_DEPARTMENT_OPTIONS}
                                    onChange={(val) => setDepartment(val)}
                                    allowCustom={true}
                                    customPlaceholder="Örn: Saha Montaj, VIP Destek"
                                />

                                <CustomDropdown
                                    label="Mülkiyet / Sözleşme Türü"
                                    icon={FileText}
                                    value={ownership}
                                    options={FLEET_OWNERSHIP_OPTIONS}
                                    onChange={(val) => setOwnership(val)}
                                />

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                                        <Gauge className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Güncel Kilometre (KM)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={km}
                                        onChange={(e) => setKm(e.target.value)}
                                        placeholder="120000"
                                        className="w-full text-xs font-bold font-mono px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Operasyon Notu / Açıklama
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Durum değişikliği ile ilgili notlar..."
                                    className="w-full text-xs font-medium p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{loading ? 'Güncelleniyor...' : 'Durumu Güncelle'}</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 2: ASSIGN DRIVER */}
                    {activeTab === 'assign' && (
                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            {hasActiveAssignment && (
                                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2.5">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>
                                        Bu araç şu anda <strong>{vehicle.zimmet_surucu_adi || 'bir personele'}</strong> zimmetlidir. Yeni atama yapıldığında önceki zimmet otomatik kapatılacaktır.
                                    </span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Kayıtlı Sürücü Seçin</span>
                                </label>
                                {drivers.length > 0 ? (
                                    <select
                                        value={selectedDriverId}
                                        onChange={(e) => {
                                            setSelectedDriverId(e.target.value);
                                            if (e.target.value) setCustomDriverName('');
                                        }}
                                        className="w-full text-xs font-bold px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="">-- Kayıtlı Sürücü Listesinden Seçin --</option>
                                        {drivers.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.ad_soyad} &bull; {d.departman || 'Departman Belirtilmedi'} {d.active_assignment ? `(Mevcut: ${d.active_assignment.vehicle?.plaka})` : '(Boşta)'}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-[11px] text-slate-400">Kayıtlı sürücü bulunmuyor, aşağıdaki alandan isim girerek doğrudan atayabilirsiniz.</p>
                                )}
                            </div>

                            {!selectedDriverId && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        veya Manuel Sürücü / Personel Adı
                                    </label>
                                    <input
                                        type="text"
                                        value={customDriverName}
                                        onChange={(e) => setCustomDriverName(e.target.value)}
                                        placeholder="Örn: Mehmet Gökmenoğlu (Saha Satış)"
                                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Teslim Tarihi
                                    </label>
                                    <input
                                        type="date"
                                        value={assignDate}
                                        onChange={(e) => setAssignDate(e.target.value)}
                                        className="w-full text-xs font-bold px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Başlangıç KM
                                    </label>
                                    <input
                                        type="number"
                                        value={assignKm}
                                        onChange={(e) => setAssignKm(e.target.value)}
                                        className="w-full text-xs font-bold font-mono px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Yakıt Seviyesi
                                    </label>
                                    <select
                                        value={assignFuel}
                                        onChange={(e) => setAssignFuel(e.target.value)}
                                        className="w-full text-xs font-bold px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="%100 (Dolu)">%100 (Dolu Depo)</option>
                                        <option value="%75 (3/4)">%75 (3/4 Depo)</option>
                                        <option value="%50 (Yarım)">%50 (Yarım Depo)</option>
                                        <option value="%25 (Çeyrek)">%25 (Çeyrek Depo)</option>
                                        <option value="%10 (Rezerv)">%10 (Rezerv Işığı)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Zimmet Teslim Tutanağı Notu
                                </label>
                                <textarea
                                    value={assignNote}
                                    onChange={(e) => setAssignNote(e.target.value)}
                                    rows={2}
                                    placeholder="Ruhsat, anahtar, yangın tüpü, stepne eksiksiz teslim edildi."
                                    className="w-full text-xs font-medium p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || (!selectedDriverId && !customDriverName.trim())}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    <span>{loading ? 'Zimmetleniyor...' : 'Aracı Personele Zimmetle'}</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 3: RELEASE VEHICLE (İade Al) */}
                    {activeTab === 'release' && (
                        <form onSubmit={handleReleaseSubmit} className="space-y-4">
                            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
                                <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span>Mevcut Zimmet: {vehicle.zimmet_surucu_adi || 'Sürücü'}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Bu aracı sürücüden teslim alarak filoda <strong>"Aktif / Havuzda (Boşta)"</strong> durumuna geri getirebilirsiniz.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        İade / Teslim Alma Tarihi
                                    </label>
                                    <input
                                        type="date"
                                        value={releaseDate}
                                        onChange={(e) => setReleaseDate(e.target.value)}
                                        className="w-full text-xs font-bold px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Teslim Alınan Bitiş KM
                                    </label>
                                    <input
                                        type="number"
                                        value={releaseKm}
                                        onChange={(e) => setReleaseKm(e.target.value)}
                                        className="w-full text-xs font-bold font-mono px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    İade Notu / Araç Teslim Durumu
                                </label>
                                <textarea
                                    value={releaseNote}
                                    onChange={(e) => setReleaseNote(e.target.value)}
                                    rows={2}
                                    placeholder="Araç temiz, hasarsız, eksiksiz teslim alındı."
                                    className="w-full text-xs font-medium p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-500/25 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>{loading ? 'İade Alınıyor...' : 'Zimmeti Kapat & Havuza Al'}</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* TAB 4: SWAP VEHICLE FOR DRIVER */}
                    {activeTab === 'swap' && (
                        <form onSubmit={handleSwapSubmit} className="space-y-4">
                            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                                <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                                    <span>Sürücü: {vehicle.zimmet_surucu_adi}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400">
                                    Bu sürücünün mevcut aracı iade alınacak ve seçtiğiniz diğer boşta araca aktarılacaktır.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Tahsis Edilecek Yeni Araç Seçin (Havuzdaki Araçlar)
                                </label>
                                <select
                                    value={swapTargetVehicleId}
                                    onChange={(e) => setSwapTargetVehicleId(e.target.value)}
                                    required
                                    className="w-full text-xs font-bold px-3.5 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                                >
                                    <option value="">-- Tahsis Edilecek Aracı Seçin --</option>
                                    {availableOtherVehicles.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.plaka} &bull; {v.marka} {v.model} ({v.yil}) - {Number(v.guncel_km || 0).toLocaleString('tr-TR')} KM
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !swapTargetVehicleId}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                                >
                                    <ArrowRightLeft className="w-4 h-4" />
                                    <span>{loading ? 'Aktarılıyor...' : 'Aracı Değiştir & Tahsis Et'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
