import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    X, 
    Wrench, 
    Calendar, 
    Gauge, 
    DollarSign, 
    Building2, 
    User, 
    Phone, 
    Droplet, 
    CheckCircle2, 
    AlertCircle,
    FileText
} from 'lucide-react';

export default function EditMaintenanceModal({ isOpen, onClose, maintenance }) {
    if (!isOpen || !maintenance) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        islem_tarihi: maintenance.islem_tarihi ? (maintenance.islem_tarihi.includes('T') ? maintenance.islem_tarihi.split('T')[0] : maintenance.islem_tarihi) : '',
        islem_turu: maintenance.islem_turu || 'Periyodik Bakım',
        servis_turu: maintenance.servis_turu || 'ozel_servis',
        servis_adi: maintenance.servis_adi || '',
        sanayi_sitesi: maintenance.sanayi_sitesi || '',
        usta_adi: maintenance.usta_adi || '',
        usta_tel: maintenance.usta_tel || '',
        yag_markasi: maintenance.yag_markasi || '',
        yag_modeli: maintenance.yag_modeli || '',
        yag_viskozite: maintenance.yag_viskozite || '5W-30',
        yag_litresi: maintenance.yag_litresi || '',
        yag_filtresi_degisti: Boolean(maintenance.yag_filtresi_degisti),
        islem_km: maintenance.islem_km || '',
        maliyet_tl: maintenance.maliyet_tl || '',
        aciklama: maintenance.aciklama || '',
    });

    const [isOilSectionOpen, setIsOilSectionOpen] = useState(
        Boolean(maintenance.yag_markasi || maintenance.yag_litresi || maintenance.islem_turu?.toLowerCase().includes('yağ') || maintenance.islem_turu?.toLowerCase().includes('periyodik'))
    );

    useEffect(() => {
        if (maintenance) {
            setData({
                islem_tarihi: maintenance.islem_tarihi ? (maintenance.islem_tarihi.includes('T') ? maintenance.islem_tarihi.split('T')[0] : maintenance.islem_tarihi) : '',
                islem_turu: maintenance.islem_turu || 'Periyodik Bakım',
                servis_turu: maintenance.servis_turu || 'ozel_servis',
                servis_adi: maintenance.servis_adi || '',
                sanayi_sitesi: maintenance.sanayi_sitesi || '',
                usta_adi: maintenance.usta_adi || '',
                usta_tel: maintenance.usta_tel || '',
                yag_markasi: maintenance.yag_markasi || '',
                yag_modeli: maintenance.yag_modeli || '',
                yag_viskozite: maintenance.yag_viskozite || '5W-30',
                yag_litresi: maintenance.yag_litresi || '',
                yag_filtresi_degisti: Boolean(maintenance.yag_filtresi_degisti),
                islem_km: maintenance.islem_km || '',
                maliyet_tl: maintenance.maliyet_tl || '',
                aciklama: maintenance.aciklama || '',
            });
            setIsOilSectionOpen(
                Boolean(maintenance.yag_markasi || maintenance.yag_litresi || maintenance.islem_turu?.toLowerCase().includes('yağ') || maintenance.islem_turu?.toLowerCase().includes('periyodik'))
            );
        }
    }, [maintenance]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/maintenances/${maintenance.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                Bakım Kaydını Düzenle
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Yapılan servis işlemini, maliyetini ve servis detaylarını güncelleyin
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

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                    {/* Error Alerts */}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs space-y-1">
                            <div className="font-bold flex items-center space-x-1.5">
                                <AlertCircle className="w-4 h-4" />
                                <span>Lütfen formdaki hataları kontrol edin:</span>
                            </div>
                            <ul className="list-disc list-inside pl-1 space-y-0.5">
                                {Object.entries(errors).map(([field, err]) => (
                                    <li key={field}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Temel Bilgiler */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                İşlem Tarihi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={data.islem_tarihi}
                                onChange={(e) => setData('islem_tarihi', e.target.value)}
                                required
                                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                İşlem Türü <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.islem_turu}
                                onChange={(e) => setData('islem_turu', e.target.value)}
                                required
                                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                            >
                                <option value="Periyodik Bakım">Periyodik Bakım (Yağ + Filtreler)</option>
                                <option value="Ağır Bakım (Triger / V Kayışı)">Ağır Bakım (Triger / V Kayışı)</option>
                                <option value="Yağ & Filtre Değişimi">Yağ & Filtre Değişimi</option>
                                <option value="Fren Sistemi (Balata / Disk)">Fren Sistemi (Balata / Disk)</option>
                                <option value="Lastik Değişimi & Balans">Lastik Değişimi & Balans</option>
                                <option value="Akü Değişimi">Akü Değişimi</option>
                                <option value="Mekanik Onarım / Ön Takım">Mekanik Onarım / Ön Takım</option>
                                <option value="Şanzıman / Debriyaj">Şanzıman / Debriyaj</option>
                                <option value="Kaporta & Boya Onarımı">Kaporta & Boya Onarımı</option>
                                <option value="Elektrik & Elektronik">Elektrik & Elektronik</option>
                                <option value="Klima & Havalandırma">Klima & Havalandırma</option>
                                <option value="Egzoz / Emisyon">Egzoz / Emisyon</option>
                                <option value="Diğer Onarım">Diğer Onarım</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Sayaç Kilometresi (KM)
                            </label>
                            <div className="relative">
                                <Gauge className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="number"
                                    value={data.islem_km}
                                    onChange={(e) => setData('islem_km', e.target.value)}
                                    placeholder="Örn: 145000"
                                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Toplam Maliyet (₺) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-xs">₺</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.maliyet_tl}
                                    onChange={(e) => setData('maliyet_tl', e.target.value)}
                                    required
                                    placeholder="Örn: 4500"
                                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Servis & Usta Detayları */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
                            <Building2 className="w-4 h-4 text-blue-500" />
                            <span>Servis & Usta Bilgileri</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Servis Türü
                                </label>
                                <select
                                    value={data.servis_turu}
                                    onChange={(e) => setData('servis_turu', e.target.value)}
                                    className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none cursor-pointer"
                                >
                                    <option value="yetkili_servis">Yetkili Servis</option>
                                    <option value="ozel_servis">Özel Servis</option>
                                    <option value="sanayi">Oto Sanayi / Özel Usta</option>
                                    <option value="kendi_garajimiz">Kendi Garajımız / Kendim Yaptım</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Servis / Firma Adı
                                </label>
                                <input
                                    type="text"
                                    value={data.servis_adi}
                                    onChange={(e) => setData('servis_adi', e.target.value)}
                                    placeholder="Örn: Doğuş Oto, Bosch Car Service"
                                    className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Sanayi Sitesi
                                </label>
                                <input
                                    type="text"
                                    value={data.sanayi_sitesi}
                                    onChange={(e) => setData('sanayi_sitesi', e.target.value)}
                                    placeholder="Örn: Maslak Oto Sanayi"
                                    className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Usta Adı
                                </label>
                                <input
                                    type="text"
                                    value={data.usta_adi}
                                    onChange={(e) => setData('usta_adi', e.target.value)}
                                    placeholder="Örn: Ahmet Usta"
                                    className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Usta Tel
                                </label>
                                <input
                                    type="text"
                                    value={data.usta_tel}
                                    onChange={(e) => setData('usta_tel', e.target.value)}
                                    placeholder="05XX XXX XX XX"
                                    className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Motor Yağı & Filtre Bölümü (Opsiyonel) */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
                                <Droplet className="w-4 h-4 text-amber-500" />
                                <span>Motor Yağı & Filtre Detayları</span>
                            </h4>
                            <button
                                type="button"
                                onClick={() => setIsOilSectionOpen(!isOilSectionOpen)}
                                className="text-[11px] font-bold text-amber-500 hover:underline cursor-pointer"
                            >
                                {isOilSectionOpen ? 'Gizle' : 'Göster'}
                            </button>
                        </div>

                        {isOilSectionOpen && (
                            <div className="space-y-3 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                            Yağ Markası
                                        </label>
                                        <input
                                            type="text"
                                            value={data.yag_markasi}
                                            onChange={(e) => setData('yag_markasi', e.target.value)}
                                            placeholder="Castrol, Motul, Mobil 1, Shell"
                                            className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                            Viskozite
                                        </label>
                                        <select
                                            value={data.yag_viskozite}
                                            onChange={(e) => setData('yag_viskozite', e.target.value)}
                                            className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none cursor-pointer"
                                        >
                                            <option value="0W-20">0W-20</option>
                                            <option value="0W-30">0W-30</option>
                                            <option value="5W-30">5W-30</option>
                                            <option value="5W-40">5W-40</option>
                                            <option value="10W-40">10W-40</option>
                                            <option value="15W-40">15W-40</option>
                                            <option value="Diğer">Diğer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                            Yağ Litresi
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={data.yag_litresi}
                                            onChange={(e) => setData('yag_litresi', e.target.value)}
                                            placeholder="Örn: 4.5"
                                            className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id="edit_yag_filtresi"
                                        checked={data.yag_filtresi_degisti}
                                        onChange={(e) => setData('yag_filtresi_degisti', e.target.checked)}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300 dark:border-white/10"
                                    />
                                    <label htmlFor="edit_yag_filtresi" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                        Yağ Filtresi ile Birlikte Değiştirildi
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Açıklama & Değişen Parçalar */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Yapılan İşlemler, Değişen Parçalar & Açıklama
                        </label>
                        <textarea
                            value={data.aciklama}
                            onChange={(e) => setData('aciklama', e.target.value)}
                            rows={3}
                            placeholder="Değişen parçalar (Hava filtresi, polen filtresi, bujiler, ön fren balatası vb.) ve ek notlar"
                            className="w-full text-xs font-medium p-3 rounded-xl bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{processing ? 'Kaydediliyor...' : 'Bakım Kaydını Güncelle'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
