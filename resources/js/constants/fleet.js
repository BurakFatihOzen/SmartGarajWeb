export const FLEET_STATUS_OPTIONS = [
    { 
        value: 'aktif', 
        label: 'Aktif / Havuzda (Boşta)', 
        dotColor: 'bg-emerald-500', 
        badge: 'Boşta', 
        desc: 'Genel şirket havuzunda, kullanıma hazır',
        colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    { 
        value: 'gorevde', 
        label: 'Görevde / Zimmetli (Sürücüde)', 
        dotColor: 'bg-blue-500', 
        badge: 'Zimmetli', 
        desc: 'Personel kullanımında, aktif sahada',
        colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    { 
        value: 'serviste', 
        label: 'Serviste / Bakımda', 
        dotColor: 'bg-amber-500', 
        badge: 'Bakımda', 
        desc: 'Yetkili veya özel serviste işlem görüyor',
        colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    { 
        value: 'hasarli', 
        label: 'Hasarlı / Kaza İncelemesinde', 
        dotColor: 'bg-red-500', 
        badge: 'Eksperde', 
        desc: 'Kaza dosyasında veya eksper incelemesinde',
        colorClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    },
    { 
        value: 'muayenede', 
        label: 'Muayenede / Randevu Bekliyor', 
        dotColor: 'bg-purple-500', 
        badge: 'TÜVTÜRK', 
        desc: 'TÜVTÜRK istasyonunda veya muayene sürecinde',
        colorClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    },
    { 
        value: 'atil', 
        label: 'Atıl / Geçici Olarak Yatıyor', 
        dotColor: 'bg-slate-400', 
        badge: 'Kullanım Dışı', 
        desc: 'Geçici olarak operasyondan çekilmiş, park halinde',
        colorClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    },
    { 
        value: 'satildi', 
        label: 'Satıldı / Filodan Ayrıldı', 
        dotColor: 'bg-rose-600', 
        badge: 'Satıldı', 
        desc: 'Araç filodan satılarak teslim edildi',
        colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    { 
        value: 'kiralik_iade', 
        label: 'Kiralık / İade Edildi', 
        dotColor: 'bg-cyan-600', 
        badge: 'İade Edildi', 
        desc: 'Sözleşme tamamlandı, kiralama firmasına teslim edildi',
        colorClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    }
];

export const OWNERSHIP_OPTIONS = [
    { value: 'Özmal', label: 'Özmal (Şirket Mülkiyeti)', badge: 'Özmal', desc: 'Şirketin mülkiyetinde olan taşıt' },
    { value: 'Uzun Dönem Kiralık', label: 'Uzun Dönem Filo Kiralama', badge: 'Operasyonel', desc: '12-36 ay süreli operasyonel filo kiralama' },
    { value: 'Finansal Kiralama (Leasing)', label: 'Finansal Kiralama / Leasing', badge: 'Leasing', desc: 'Banka veya leasing sözleşmeli taşıt' },
    { value: 'Kısa Dönem Kiralık', label: 'Kısa Dönem / Günlük Kiralık', badge: 'Geçici', desc: 'Proje veya geçici ihtiyaç için kiralanan taşıt' },
    { value: 'Şahıs / Taşeron', label: 'Taşeron / Şahıs Aracı', badge: 'Alt Yüklenici', desc: 'Şirket bünyesinde çalışan taşeron/şahıs taşıtı' }
];

export const CORPORATE_DEPARTMENTS = [
    { name: 'Saha Satış & Pazarlama', icon: '🚗', color: 'text-blue-500' },
    { name: 'Lojistik, Dağıtım & Kargo', icon: '📦', color: 'text-amber-500' },
    { name: 'Teknik Servis & Saha Operasyon', icon: '🛠️', color: 'text-orange-500' },
    { name: 'Üst Yönetim, VIP & GM', icon: '👔', color: 'text-purple-500' },
    { name: 'İnsan Kaynakları & İdari İşler', icon: '💼', color: 'text-indigo-500' },
    { name: 'Finans, Muhasebe & Denetim', icon: '🏢', color: 'text-emerald-500' },
    { name: 'Şantiye, Proje & Saha Yönetimi', icon: '🏗️', color: 'text-yellow-500' },
    { name: 'Güvenlik, Emniyet & Tesis', icon: '🛡️', color: 'text-cyan-500' },
    { name: 'Bilgi Teknolojileri (IT) & Sistem', icon: '💻', color: 'text-blue-400' },
    { name: 'Satın Alma, Tedarik & Depo', icon: '🛒', color: 'text-green-500' },
    { name: 'Hukuk & Müşavir Hizmetleri', icon: '⚖️', color: 'text-rose-500' },
    { name: 'Genel Havuz (Ortak Kullanım)', icon: '⚡', color: 'text-slate-500' }
];

export const getStatusBadgeObj = (status) => {
    const found = FLEET_STATUS_OPTIONS.find(s => s.value === status);
    if (found) return found;
    return FLEET_STATUS_OPTIONS[0];
};
