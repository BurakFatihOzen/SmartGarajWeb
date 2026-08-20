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

    // Format registration date
    const memberSince = user?.kayit_tarihi 
        ? new Date(user.kayit_tarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
        : '2026';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#13151b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-sm">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Profil & Hesap Yönetimi</h3>
                            <span className="text-[11px] text-slate-400">Kişisel bilgilerinizi ve güvenlik ayarlarınızı düzenleyin</span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Summary Mini Banner */}
                <div className="px-6 py-3.5 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-slate-200">Garaj Sahibi (Pro Üye)</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                        Kayıt: {memberSince}
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-6 pt-3 bg-white/[0.01]">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 text-xs font-bold transition-all relative ${
                            activeTab === 'profile' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Kişisel Bilgiler
                        {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`ml-6 pb-3 text-xs font-bold transition-all relative ${
                            activeTab === 'password' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Şifre & Güvenlik
                        {activeTab === 'password' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />}
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {activeTab === 'profile' ? (
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Ad Soyad */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Ad Soyad</label>
                                    <div className="relative">
                                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            value={profileForm.data.ad_soyad}
                                            onChange={(e) => profileForm.setData('ad_soyad', e.target.value)}
                                            className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-semibold"
                                            required
                                        />
                                    </div>
                                    {profileForm.errors.ad_soyad && <p className="text-red-400 text-[11px] mt-1">{profileForm.errors.ad_soyad}</p>}
                                </div>

                                {/* E-Posta */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">E-Posta</label>
                                    <div className="relative">
                                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-semibold"
                                            required
                                        />
                                    </div>
                                    {profileForm.errors.email && <p className="text-red-400 text-[11px] mt-1">{profileForm.errors.email}</p>}
                                </div>

                                {/* Telefon */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon Numarası</label>
                                    <div className="relative">
                                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                            type="tel"
                                            value={profileForm.data.telefon}
                                            onChange={(e) => profileForm.setData('telefon', e.target.value)}
                                            placeholder="05XX XXX XX XX"
                                            className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-mono"
                                        />
                                    </div>
                                    {profileForm.errors.telefon && <p className="text-red-400 text-[11px] mt-1">{profileForm.errors.telefon}</p>}
                                </div>

                                {/* Şehir / İl */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Şehir / Lokasyon</label>
                                    <div className="relative">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                            type="text"
                                            value={profileForm.data.sehir}
                                            onChange={(e) => profileForm.setData('sehir', e.target.value)}
                                            placeholder="Örn: Sivas, İstanbul, Ankara"
                                            className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                                        />
                                    </div>
                                    {profileForm.errors.sehir && <p className="text-red-400 text-[11px] mt-1">{profileForm.errors.sehir}</p>}
                                </div>
                            </div>

                            {/* Sürücü Belgesi / Ehliyet Sınıfı */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Sürücü Belgesi / Ehliyet Sınıfı</label>
                                <div className="relative">
                                    <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                    <select
                                        value={profileForm.data.ehliyet_sinifi}
                                        onChange={(e) => profileForm.setData('ehliyet_sinifi', e.target.value)}
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer font-semibold"
                                    >
                                        <option value="B Sınıfı (Otomobil)">B Sınıfı (Otomobil & Kamyonet)</option>
                                        <option value="A2 Sınıfı (Motosiklet)">A2 Sınıfı (Motosiklet)</option>
                                        <option value="A Sınıfı (Ağır Motosiklet)">A Sınıfı (Tüm Motosikletler)</option>
                                        <option value="C Sınıfı (Kamyon)">C Sınıfı (Kamyon & Çekici)</option>
                                        <option value="D Sınıfı (Otobüs / Minibüs)">D Sınıfı (Otobüs & Minibüs)</option>
                                        <option value="B + A2 Sınıfı">B + A2 Sınıfı (Otomobil + Motor)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Security Status Footnote */}
                            <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center space-x-2.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="text-[11px] text-slate-300">
                                    Hesabınız PostgreSQL ve SHA-256 / Bcrypt kriptografik standartları ile korunmaktadır.
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{profileForm.processing ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Mevcut Şifre</label>
                                <div className="relative">
                                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.eski_sifre}
                                        onChange={(e) => passwordForm.setData('eski_sifre', e.target.value)}
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                                        required
                                    />
                                </div>
                                {passwordForm.errors.eski_sifre && <p className="text-red-400 text-[11px] mt-1">{passwordForm.errors.eski_sifre}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Yeni Şifre (En az 6 karakter)</label>
                                <div className="relative">
                                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.yeni_sifre}
                                        onChange={(e) => passwordForm.setData('yeni_sifre', e.target.value)}
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                {passwordForm.errors.yeni_sifre && <p className="text-red-400 text-[11px] mt-1">{passwordForm.errors.yeni_sifre}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Yeni Şifre (Tekrar)</label>
                                <div className="relative">
                                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        type="password"
                                        value={passwordForm.data.yeni_sifre_confirmation}
                                        onChange={(e) => passwordForm.setData('yeni_sifre_confirmation', e.target.value)}
                                        className="w-full bg-[#1a1d27] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{passwordForm.processing ? 'Güncelleniyor...' : 'Şifremi Güncelle'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
