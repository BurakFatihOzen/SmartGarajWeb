import React from 'react';
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
    Shield
} from 'lucide-react';

export default function VehiclePassport({ vehicle, qrCodeUrl, verifyUrl, totalSpent, maintenanceCount }) {
    return (
        <div className="min-h-screen bg-[#0b0c10] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-amber-500 selection:text-black">
            <Head title={`Araç Servis Pasaportu - ${vehicle.plaka}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Brand */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#13151b] border border-white/[0.08] shadow-2xl">
                    <div className="flex items-center space-x-3.5 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/25">
                            <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                Smart<span className="text-amber-400">Garaj</span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                                    Resmi Doğrulanmış Pasaport
                                </span>
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Güvenli ve Değiştirilemez Dijital Araç Servis Karnesi
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={`/vehicles/${vehicle.id}/print-report`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-amber-500/20"
                        >
                            <Printer className="w-4 h-4" />
                            <span>PDF / Yazdır</span>
                        </a>
                    </div>
                </div>

                {/* Hero Vehicle Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-[#13151b] border border-white/[0.08] shadow-xl">
                    {/* Vehicle Photo */}
                    <div className="md:col-span-1">
                        {vehicle.fotograf_url ? (
                            <img
                                src={vehicle.fotograf_url}
                                alt={vehicle.plaka}
                                className="w-full h-48 md:h-full object-cover rounded-2xl border border-white/10 shadow-lg"
                            />
                        ) : (
                            <div className="w-full h-48 md:h-full min-h-[180px] rounded-2xl bg-[#181b24] border border-white/5 flex flex-col items-center justify-center text-slate-500 space-y-2">
                                <Car className="w-12 h-12 text-slate-600" />
                                <span className="text-xs font-semibold">Fotoğraf Yüklenmemiş</span>
                            </div>
                        )}
                    </div>

                    {/* Vehicle Details */}
                    <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-wider">
                                    {vehicle.plaka}
                                </span>
                                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Doğrulanmış Kayıt</span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white mt-1">
                                {vehicle.marka} {vehicle.model}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {vehicle.motor || 'Standart Motor'} &bull; {vehicle.yil || 'Belirtilmedi'} Model &bull; {vehicle.ruhsat_tipi ? vehicle.ruhsat_tipi.toUpperCase() : 'OTOMOBİL'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-[#181b24] border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-slate-400">Güncel KM</div>
                                <div className="text-base font-extrabold text-white mt-0.5">
                                    {Number(vehicle.guncel_km || 0).toLocaleString('tr-TR')} KM
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#181b24] border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-slate-400">Toplam Bakım</div>
                                <div className="text-base font-extrabold text-white mt-0.5">
                                    {maintenanceCount} Adet
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#181b24] border border-white/5 col-span-2 sm:col-span-1">
                                <div className="text-[10px] uppercase font-bold text-slate-400">Kayıtlı Harcama</div>
                                <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                                    ₺{Number(totalSpent || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>

                        {vehicle.sasi_no && (
                            <div className="text-xs font-mono text-slate-400 bg-[#181b24] px-3 py-1.5 rounded-lg border border-white/5">
                                <strong className="text-slate-300">ŞASİ:</strong> {vehicle.sasi_no}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-[#13151b] border border-white/[0.08] space-y-1">
                        <div className="text-xs font-bold text-slate-400">TÜVTÜRK Muayene</div>
                        <div className="text-base font-black text-amber-400 font-mono">
                            {vehicle.muayene_bitis ? new Date(vehicle.muayene_bitis).toLocaleDateString('tr-TR') : 'Kayıt Yok'}
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#13151b] border border-white/[0.08] space-y-1">
                        <div className="text-xs font-bold text-slate-400">Trafik Sigortası</div>
                        <div className="text-base font-black text-blue-400 font-mono">
                            {vehicle.sigorta_bitis ? new Date(vehicle.sigorta_bitis).toLocaleDateString('tr-TR') : 'Kayıt Yok'}
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#13151b] border border-white/[0.08] space-y-1">
                        <div className="text-xs font-bold text-slate-400">Kasko Poliçesi</div>
                        <div className="text-base font-black text-indigo-400 font-mono">
                            {vehicle.kasko_bitis ? new Date(vehicle.kasko_bitis).toLocaleDateString('tr-TR') : 'Kasko Yok'}
                        </div>
                    </div>
                </div>

                {/* Maintenance Records Table */}
                <div className="rounded-3xl bg-[#13151b] border border-white/[0.08] p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-black text-white flex items-center space-x-2">
                            <Wrench className="w-4 h-4 text-amber-400" />
                            <span>Servis ve Bakım Geçmişi ({maintenanceCount} Kayıt)</span>
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                                    <th className="py-3 px-3">Tarih</th>
                                    <th className="py-3 px-3">İşlem Türü / Detay</th>
                                    <th className="py-3 px-3">KM</th>
                                    <th className="py-3 px-3 text-right">Tutar (TL)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-200">
                                {vehicle.maintenances && vehicle.maintenances.length > 0 ? (
                                    vehicle.maintenances.map((m) => (
                                        <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-3 font-mono font-bold text-slate-400">
                                                {new Date(m.islem_tarihi).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="font-bold text-white text-sm">{m.islem_turu}</div>
                                                {m.aciklama && (
                                                    <div className="text-[11px] text-slate-400 mt-0.5">{m.aciklama}</div>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 font-mono">
                                                {Number(m.islem_km || 0).toLocaleString('tr-TR')} KM
                                            </td>
                                            <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-400">
                                                ₺{Number(m.maliyet_tl || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-500">
                                            Henüz kayıtlı bir bakım geçmişi bulunmamaktadır.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* QR Code Verification Seal Card */}
                <div className="p-6 rounded-3xl bg-[#13151b] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start space-x-2 text-amber-400 font-bold text-sm">
                            <Shield className="w-4 h-4" />
                            <span>SmartGaraj Doğrulama Damgası</span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                            Bu araç pasaportu, araç sahibinin SmartGaraj platformuna işlediği resmi servis fişleri ve bakım kayıtları ile mühürlenmiştir.
                        </p>
                        <div className="text-[10px] text-slate-500 font-mono mt-2">
                            Token: SG-{String(vehicle.qr_token || '').substring(0, 12).toUpperCase()}
                        </div>
                    </div>
                    {qrCodeUrl && (
                        <div className="p-2 rounded-2xl bg-white shadow-lg shrink-0">
                            <img src={qrCodeUrl} alt="QR Doğrulama" className="w-24 h-24" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
