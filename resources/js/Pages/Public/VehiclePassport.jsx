import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    ShieldCheck, 
    Car, 
    Wrench, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Printer, 
    TrendingUp,
    Sparkles,
    Shield,
    Sun,
    Moon,
    ArrowLeft
} from 'lucide-react';

export default function VehiclePassport({ vehicle, qrCodeUrl, verifyUrl, totalSpent, maintenanceCount }) {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light-mode');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light-mode');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            setIsDark(false);
            localStorage.setItem('theme', 'light');
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light-mode');
        } else {
            setIsDark(true);
            localStorage.setItem('theme', 'dark');
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light-mode');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#090a0f] text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-amber-500 selection:text-black transition-colors duration-200">
            <Head title={`Araç Servis Pasaportu — ${vehicle.plaka}`} />

            <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
                {/* Header Brand */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-2xl">
                    <div className="flex items-center space-x-3.5 text-center sm:text-left">
                        <Link 
                            href="/dashboard"
                            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 shrink-0 hover:scale-105 transition-transform"
                            title="Ana Sayfaya Dön"
                        >
                            <Wrench className="w-6 h-6 stroke-[2.5]" />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                Smart<span className="text-amber-500">Garaj</span>
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                                    Resmi Doğrulanmış Pasaport
                                </span>
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Güvenli ve Değiştirilemez Dijital Araç Servis Karnesi
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-white/[0.06]"
                            title={isDark ? 'Açık Moda Geç' : 'Koyu Moda Geç'}
                        >
                            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                        </button>

                        <a
                            href={`/vehicles/${vehicle.id}/print-report`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                            <Printer className="w-4 h-4" />
                            <span>PDF / Yazdır</span>
                        </a>
                    </div>
                </div>

                {/* Hero Vehicle Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl items-center">
                    {/* Vehicle Photo with Ambient Backdrop */}
                    <div className="md:col-span-5 flex flex-col">
                        {vehicle.fotograf_url ? (
                            <div className="relative w-full h-48 sm:h-56 md:h-52 rounded-2xl overflow-hidden bg-slate-900/60 dark:bg-black/60 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-md">
                                <img
                                    src={vehicle.fotograf_url}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110"
                                />
                                <img
                                    src={vehicle.fotograf_url}
                                    alt={vehicle.plaka}
                                    className="relative z-10 w-full h-full max-h-52 object-contain p-1"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 sm:h-56 md:h-52 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-2">
                                <Car className="w-12 h-12 opacity-50" />
                                <span className="text-xs font-semibold">Fotoğraf Yüklenmemiş</span>
                            </div>
                        )}
                    </div>

                    {/* Vehicle Details */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="badge-plate text-sm sm:text-base font-black px-2.5 py-1">
                                    {vehicle.plaka}
                                </span>
                                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Doğrulanmış Kayıt</span>
                                </div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                                {vehicle.marka} {vehicle.model}
                            </h2>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                                {vehicle.motor || 'Standart Motor'} &bull; {vehicle.yil || 'Belirtilmedi'} Model &bull; {vehicle.ruhsat_tipi || 'Otomobil (Hususi)'}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5">
                                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Güncel KM</div>
                                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
                                    {Number(vehicle.guncel_km || 0).toLocaleString('tr-TR')}
                                </div>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5">
                                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Toplam Bakım</div>
                                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
                                    {maintenanceCount} Adet
                                </div>
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/5">
                                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Kayıtlı Harcama</div>
                                <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                                    ₺{Number(totalSpent || 0).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                            </div>
                        </div>

                        {vehicle.sasi_no && (
                            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.04] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/5">
                                <strong className="text-slate-800 dark:text-slate-200">ŞASİ (VIN):</strong> {vehicle.sasi_no}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] space-y-1 shadow-sm">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">TÜVTÜRK Muayene</div>
                        <div className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                            {vehicle.muayene_bitis ? new Date(vehicle.muayene_bitis).toLocaleDateString('tr-TR') : 'Kayıt Yok'}
                        </div>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] space-y-1 shadow-sm">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Trafik Sigortası</div>
                        <div className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                            {vehicle.sigorta_bitis ? new Date(vehicle.sigorta_bitis).toLocaleDateString('tr-TR') : 'Kayıt Yok'}
                        </div>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] space-y-1 shadow-sm">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Kasko Poliçesi</div>
                        <div className="text-base font-black text-indigo-600 dark:text-indigo-400 font-mono">
                            {vehicle.kasko_bitis ? new Date(vehicle.kasko_bitis).toLocaleDateString('tr-TR') : 'Kasko Yok'}
                        </div>
                    </div>
                </div>

                {/* Maintenance Timeline Section */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] space-y-5 shadow-sm dark:shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                            <Wrench className="w-4 h-4 text-amber-500" />
                            <span>Servis ve Bakım Geçmişi ({vehicle.bakimlar?.length || 0} Kayıt)</span>
                        </h3>
                    </div>

                    {vehicle.bakimlar && vehicle.bakimlar.length > 0 ? (
                        <div className="space-y-4">
                            {vehicle.bakimlar.map((item, index) => (
                                <div 
                                    key={index}
                                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-3"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                    {item.islem_turu}
                                                </h4>
                                                <span className="text-xs font-semibold text-slate-400">
                                                    {item.tarih ? new Date(item.tarih).toLocaleDateString('tr-TR') : '-'} &bull; {item.islem_km ? `${Number(item.islem_km).toLocaleString('tr-TR')} KM` : '-'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right sm:text-right">
                                            <span className="text-sm sm:text-base font-black text-amber-500 font-mono">
                                                {Number(item.toplam_tutar || 0).toLocaleString('tr-TR')} ₺
                                            </span>
                                        </div>
                                    </div>

                                    {item.aciklama && (
                                        <p className="text-xs text-slate-600 dark:text-slate-300 pl-10.5">
                                            {item.aciklama}
                                        </p>
                                    )}

                                    {item.parcalar && Array.isArray(item.parcalar) && item.parcalar.length > 0 && (
                                        <div className="pl-10.5 pt-2 flex flex-wrap gap-1.5">
                                            {item.parcalar.map((p, pIdx) => (
                                                <span 
                                                    key={pIdx}
                                                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                                                >
                                                    {p.ad} {p.fiyat ? `(${Number(p.fiyat).toLocaleString('tr-TR')} ₺)` : ''}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                            <Clock className="w-10 h-10 mx-auto mb-2 opacity-40" />
                            <p className="text-xs font-semibold">Bu araca ait henüz kayıtlı servis işlemi bulunmamaktadır.</p>
                        </div>
                    )}
                </div>

                {/* Footer Security Notice */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                        🛡️ SmartGaraj Dijital Doğrulama Sistemi
                    </p>
                    <p className="text-[11px]">
                        Bu belge araç sahibinin kayıtları ve servis faturaları doğrultusunda oluşturulmuş dijital karnedir.
                    </p>
                </div>
            </div>
        </div>
    );
}
