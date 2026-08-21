import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    X, 
    AlertTriangle, 
    Calendar, 
    Car, 
    FileText, 
    Upload, 
    ShieldAlert, 
    DollarSign, 
    Percent, 
    FileCheck, 
    Camera,
    CheckCircle2
} from 'lucide-react';
import DamageBodyMap from './DamageBodyMap';

export default function AccidentModal({ isOpen, onClose, vehicles = [], activeVehicle = null }) {
    if (!isOpen) return null;

    const defaultVehicleId = activeVehicle ? activeVehicle.id : (vehicles.length > 0 ? vehicles[0].id : '');

    const { data, setData, post, processing, errors, reset } = useForm({
        arac_id: defaultVehicleId,
        kaza_tarihi: new Date().toISOString().split('T')[0],
        kaza_km: activeVehicle ? (activeVehicle.guncel_km || '') : '',
        kaza_turu: 'Çarpışma',
        hasar_tutari: '',
        tramer_kaydi: false,
        tramer_tutari: '',
        kusur_orani: 0,
        sigorta_sirketi: '',
        dosya_no: '',
        karsi_taraf_plaka: '',
        surucu_adi: '',
        aciklama: '',
        hasarli_parcalar: [],
        tutanak: null,
        fotograflar: [],
    });

    const [activeTab, setActiveTab] = useState('genel'); // 'genel' | 'kaporta' | 'evraklar'

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/accidents', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/[0.08] shadow-2xl overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                Yeni Hasar & Kaza Kaydı
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Kaza tutanağı, hasar fotoğrafları, kaporta durumu ve tramer kaydı
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center border-b border-slate-100 dark:border-white/[0.06] px-5 sm:px-6 bg-slate-50/30 dark:bg-transparent">
                    <button
                        type="button"
                        onClick={() => setActiveTab('genel')}
                        className={`py-3 px-3 text-xs font-extrabold border-b-2 transition-all ${
                            activeTab === 'genel'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        1. Kaza & Masraf Detayları
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('kaporta')}
                        className={`py-3 px-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 ${
                            activeTab === 'kaporta'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        2. Kaporta & Ekspertiz Şeması
                        {data.hasarli_parcalar.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                                {data.hasarli_parcalar.length}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('evraklar')}
                        className={`py-3 px-3 text-xs font-extrabold border-b-2 transition-all ${
                            activeTab === 'evraklar'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        3. Sigorta & Tutanak Dosyası
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                    
                    {/* Tab 1: Genel Bilgiler */}
                    {activeTab === 'genel' && (
                        <div className="space-y-4">
                            {/* Vehicle Selection */}
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Araç Seçimi *
                                </label>
                                <select
                                    value={data.arac_id}
                                    onChange={(e) => setData('arac_id', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    required
                                >
                                    {vehicles.map((v) => (
                                        <option key={v.id} value={v.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                            {v.plaka} — {v.marka} {v.model} ({v.yil || ''})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Kaza / Olay Tarihi *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.kaza_tarihi}
                                        onChange={(e) => setData('kaza_tarihi', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Olay Anındaki KM
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Örn: 85000"
                                        value={data.kaza_km}
                                        onChange={(e) => setData('kaza_km', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Kaza Türü *
                                    </label>
                                    <select
                                        value={data.kaza_turu}
                                        onChange={(e) => setData('kaza_turu', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    >
                                        <option value="Çarpışma">Çarpışma (İki Taraflı)</option>
                                        <option value="Arkadan Çarpma">Arkadan Çarpma</option>
                                        <option value="Park Halinde Sürtme">Park Halinde Hasar / Sürtme</option>
                                        <option value="Dolu / Doğal Afet">Dolu / Sel / Doğal Afet</option>
                                        <option value="Cam Kırılması">Cam Kırılması / Çatlak</option>
                                        <option value="Tek Taraflı Kaza">Tek Taraflı Kaza / Yoldan Çıkma</option>
                                        <option value="Mekanik Hasar">Mekanik / Alt Darbe Hasarı</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Toplam Onarım / Hasar Tutarı (₺)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={data.hasar_tutari}
                                        onChange={(e) => setData('hasar_tutari', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            {/* Tramer Toggle */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.tramer_kaydi}
                                        onChange={(e) => setData('tramer_kaydi', e.target.checked)}
                                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300 dark:border-white/20"
                                    />
                                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                        Bu hasar TRAMER / Sigorta kaydı olarak işlendi mi?
                                    </span>
                                </label>

                                {data.tramer_kaydi && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                Tramer Kaydı Tutarı (₺)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Örn: 24500"
                                                value={data.tramer_tutari}
                                                onChange={(e) => setData('tramer_tutari', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                Kusur Oranı (%{data.kusur_orani})
                                            </label>
                                            <select
                                                value={data.kusur_orani}
                                                onChange={(e) => setData('kusur_orani', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                            >
                                                <option value={0}>%0 (Kusursuz / Karşı Taraf %100)</option>
                                                <option value={25}>%25 Kusurlu</option>
                                                <option value={50}>%50 Eşit Kusurlu</option>
                                                <option value={75}>%75 Kusurlu</option>
                                                <option value={100}>%100 Kusurlu</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Olay Açıklaması / Detaylar
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder="Kaza nasıl meydana geldi, onarım nerede yapıldı..."
                                    value={data.aciklama}
                                    onChange={(e) => setData('aciklama', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Kaporta & Ekspertiz Şeması */}
                    {activeTab === 'kaporta' && (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Aracın hasar gören, boyanan veya değişen parçalarını aşağıdaki şemadan işaretleyin:
                            </p>
                            <DamageBodyMap
                                value={data.hasarli_parcalar}
                                onChange={(parts) => setData('hasarli_parcalar', parts)}
                                readOnly={false}
                            />
                        </div>
                    )}

                    {/* Tab 3: Sigorta & Evraklar */}
                    {activeTab === 'evraklar' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Hasar Dosyası Aşaması
                                    </label>
                                    <select
                                        value={data.dosya_durumu}
                                        onChange={(e) => setData('dosya_durumu', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                    >
                                        <option value="dosya_acildi">📄 1. Dosya Açıldı (Kayıt)</option>
                                        <option value="eksper_incelemesinde">🔍 2. Eksper İncelemesinde</option>
                                        <option value="onarimda">🛠️ 3. Serviste / Onarımda</option>
                                        <option value="tramer_onaylandi">⚖️ 4. Tramer / Kusur Onaylandı</option>
                                        <option value="kapandi">💳 5. Tazminat Ödendi / Dosya Kapandı</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Sigorta Tazminat Tutarı (₺)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Sigortanın ödediği tutar"
                                        value={data.tazminat_tutari}
                                        onChange={(e) => setData('tazminat_tutari', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Sigorta / Kasko Şirketi
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Anadolu Sigorta, Allianz, Aksigorta"
                                        value={data.sigorta_sirketi}
                                        onChange={(e) => setData('sigorta_sirketi', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Sigorta Dosya No
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Örn: 2026/49210-A"
                                        value={data.dosya_no}
                                        onChange={(e) => setData('dosya_no', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Atanan Eksper Adı & Soyadı
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Murat Kaya"
                                        value={data.eksper_adi}
                                        onChange={(e) => setData('eksper_adi', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Eksper Telefonu / İletişim
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="05XX XXX XX XX"
                                        value={data.eksper_tel}
                                        onChange={(e) => setData('eksper_tel', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Karşı Taraf Plakası (Varsa)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Örn: 34 ABC 123"
                                        value={data.karsi_taraf_plaka}
                                        onChange={(e) => setData('karsi_taraf_plaka', e.target.value.toUpperCase())}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Kaza Anındaki Sürücü (Filo)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Örn: Ahmet Yılmaz"
                                        value={data.surucu_adi}
                                        onChange={(e) => setData('surucu_adi', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold"
                                    />
                                </div>
                            </div>

                            {/* File Upload: Kaza Tespit Tutanağı */}
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Kaza Tespit Tutanağı (PDF / Fotoğraf)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setData('tutanak', e.target.files[0])}
                                    className="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                                />
                            </div>

                            {/* File Upload: Hasar Fotoğrafları */}
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Hasar ve Kaza Fotoğrafları
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => setData('fotograflar', Array.from(e.target.files))}
                                    className="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-slate-200 dark:file:bg-white/10 file:text-slate-900 dark:file:text-white hover:file:bg-slate-300 cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-extrabold text-xs shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{processing ? 'Kaydediliyor...' : 'Hasar Kaydını Tamamla'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
