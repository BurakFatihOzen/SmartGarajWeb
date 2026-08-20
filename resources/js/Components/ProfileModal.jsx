import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    User, 
    Mail, 
    Phone, 
    Lock, 
    X, 
    Check, 
    AlertCircle, 
    MapPin, 
    CreditCard, 
    ShieldCheck, 
    Calendar, 
    Award,
    Sparkles
} from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user }) {
    const [activeTab, setActiveTab] = useState('profile');

    const profileForm = useForm({
        ad_soyad: user?.ad_soyad || '',
        email: user?.email || '',
        telefon: user?.telefon || '',
        sehir: user?.sehir || '',
        ehliyet_sinifi: user?.ehliyet_sinifi || 'B Sınıfı (Otomobil)',
    });

    const passwordForm = useForm({
        eski_sifre: '',
        yeni_sifre: '',
        yeni_sifre_confirmation: '',
    });

    if (!isOpen) return null;

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post('/profile', {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                onClose();
            },
        });
    };

    const memberSince = user?.kayit_tarihi 
        ? new Date(user.kayit_tarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '2026';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white dark:bg-[#11131c] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-sm shrink-0 font-bold">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">Profil & Hesap Yönetimi</h3>
                            <span className="text-[11px] text-slate-400">Kişisel bilgilerinizi ve güvenlik ayarlarınızı düzenleyin</span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Summary Mini Banner */}
                <div className="px-6 py-3 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Garaj Sahibi (Pro Üye)</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                        Kayıt: {memberSince}
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200/80 dark:border-white/10 px-6 pt-3 bg-slate-50/30 dark:bg-white/[0.01] shrink-0">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 mr-6 text-xs font-bold transition-all relative cursor-pointer ${
                            activeTab === 'profile'
                                ? 'text-amber-500'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Kişisel Bilgiler
                        {activeTab === 'profile' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('password')}
                        className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                            activeTab === 'password'
                                ? 'text-amber-500'
                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Şifre & Güvenlik
                        {activeTab === 'password' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                        )}
                    </button>
                </div>

                {/* Tab 1: Profile Form */}
                <div className="p-6 overflow-y-auto flex-1">
                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            {/* Ad Soyad */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Ad Soyad
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="text"
                                        value={profileForm.data.ad_soyad}
                                        onChange={(e) => profileForm.setData('ad_soyad', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                {profileForm.errors.ad_soyad && <p className="text-red-500 text-xs mt-1">{profileForm.errors.ad_soyad}</p>}
                            </div>

                            {/* E-Posta */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    E-Posta Adresi
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                {profileForm.errors.email && <p className="text-red-500 text-xs mt-1">{profileForm.errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Telefon */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Telefon Numarası
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                        <input
                                            type="tel"
                                            value={profileForm.data.telefon}
                                            onChange={(e) => profileForm.setData('telefon', e.target.value)}
                                            placeholder="05XX XXX XX XX"
                                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                {/* Şehir */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Şehir / Lokasyon
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                        <input
                                            type="text"
                                            value={profileForm.data.sehir}
                                            onChange={(e) => profileForm.setData('sehir', e.target.value)}
                                            placeholder="Örn: Sivas, İstanbul"
                                            className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Ehliyet Sınıfı */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Sürücü Belgesi / Ehliyet Sınıfı
                                </label>
                                <div className="relative">
                                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <select
                                        value={profileForm.data.ehliyet_sinifi}
                                        onChange={(e) => profileForm.setData('ehliyet_sinifi', e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-8 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer appearance-none"
                                    >
                                        <option value="B Sınıfı (Otomobil & Kamyonet)">B Sınıfı (Otomobil & Kamyonet)</option>
                                        <option value="A / A2 Sınıfı (Motosiklet)">A / A2 Sınıfı (Motosiklet)</option>
                                        <option value="C Sınıfı (Kamyon & Çekici)">C Sınıfı (Kamyon & Çekici)</option>
                                        <option value="D Sınıfı (Otobüs & Minibüs)">D Sınıfı (Otobüs & Minibüs)</option>
                                        <option value="E / CE Sınıfı (Ağır Vasıta & Tır)">E / CE Sınıfı (Ağır Vasıta & Tır)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center space-x-2.5">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>Hesabınız PostgreSQL ve SHA-256 / Bcrypt kriptografik güvenlik standartları ile korunmaktadır.</span>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md hover:shadow-amber-500/30 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                    <span>{profileForm.processing ? 'Güncelleniyor...' : 'Bilgileri Güncelle'}</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Tab 2: Password Form */
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Mevcut Şifreniz
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.eski_sifre}
                                        onChange={(e) => passwordForm.setData('eski_sifre', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                {passwordForm.errors.eski_sifre && <p className="text-red-500 text-xs mt-1">{passwordForm.errors.eski_sifre}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Yeni Şifre Belirleyin
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.yeni_sifre}
                                        onChange={(e) => passwordForm.setData('yeni_sifre', e.target.value)}
                                        placeholder="En az 6 karakter"
                                        className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                {passwordForm.errors.yeni_sifre && <p className="text-red-500 text-xs mt-1">{passwordForm.errors.yeni_sifre}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Yeni Şifre Tekrarı
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.yeni_sifre_confirmation}
                                        onChange={(e) => passwordForm.setData('yeni_sifre_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-[#1a1d29] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md hover:shadow-amber-500/30 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                    <span>{passwordForm.processing ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
