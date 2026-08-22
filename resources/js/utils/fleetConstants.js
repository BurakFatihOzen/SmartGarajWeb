export const FLEET_STATUS_OPTIONS = [
    { 
        value: 'aktif', 
        label: 'Aktif / Havuzda (Boşta)', 
        desc: 'Görev atamasına hazır, havuzda bekliyor',
        dotColor: 'bg-emerald-500', 
        badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
    },
    { 
        value: 'gorevde', 
        label: 'Görevde / Zimmetli', 
        desc: 'Personele zimmetli ve aktif kullanımda',
        dotColor: 'bg-blue-500', 
        badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
    },
    { 
        value: 'serviste', 
        label: 'Serviste / Periyodik Bakımda', 
        desc: 'Servis onarımında veya periyodik bakımda',
        dotColor: 'bg-amber-500', 
        badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
    },
    { 
        value: 'hasarli', 
        label: 'Hasarlı / Ekspertiz & Onarımda', 
        desc: 'Kaza/hasar dosya sürecinde onarımda',
        dotColor: 'bg-purple-500', 
        badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
    },
    { 
        value: 'muayenede', 
        label: 'Muayenede / Resmi İşlemde', 
        desc: 'TÜVTÜRK muayenesi veya ruhsat işleminde',
        dotColor: 'bg-cyan-500', 
        badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' 
    },
    { 
        value: 'atil', 
        label: 'Atıl / Yedek Parkta', 
        desc: 'Geçici olarak operasyon dışı bekletiliyor',
        dotColor: 'bg-red-500', 
        badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
    },
    { 
        value: 'satildi', 
        label: 'Satıldı / Filodan Ayrıldı', 
        desc: 'Mülkiyeti devredildi veya filodan çıkarıldı',
        dotColor: 'bg-slate-500', 
        badgeBg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' 
    },
];

export const FLEET_OWNERSHIP_OPTIONS = [
    { 
        value: 'Özmal', 
        label: 'Özmal (Şirket Malı)', 
        desc: 'Şirketin mülkiyetindeki tescilli özmal araç',
        icon: '🏢' 
    },
    { 
        value: 'Uzun Dönem Kiralık', 
        label: 'Uzun Dönem Filo Kiralama (Operasyonel)', 
        desc: 'Filo kiralama sözleşmesi kapsamında',
        icon: '📄' 
    },
    { 
        value: 'Finansal Kiralama (Leasing)', 
        label: 'Finansal Kiralama / Leasing', 
        desc: 'Finansman leasing ödemeli araç',
        icon: '💳' 
    },
    { 
        value: 'Kısa Dönem Kiralık', 
        label: 'Kısa Dönem Kiralık / İkame', 
        desc: 'Geçici operasyon veya ikame araç',
        icon: '⏱️' 
    },
    { 
        value: 'Taşeron / Konsinye', 
        label: 'Taşeron / Konsinye Araç', 
        desc: 'Hizmet alınan harici araç',
        icon: '🤝' 
    },
];

export const FLEET_DEPARTMENT_OPTIONS = [
    { 
        value: 'Saha Satış & Pazarlama', 
        label: 'Saha Satış & Pazarlama', 
        desc: 'Müşteri ziyaretleri, satış temsilcileri',
        icon: '💼' 
    },
    { 
        value: 'Lojistik & Dağıtım', 
        label: 'Lojistik, Sevkiyat & Dağıtım', 
        desc: 'Ürün nakliyesi, kargo, tedarik sevkiyatı',
        icon: '🚚' 
    },
    { 
        value: 'Teknik Saha Servisi & Destek', 
        label: 'Teknik Saha Servisi & Destek', 
        desc: 'Kurulum, montaj, yerinde arıza bakım',
        icon: '🛠️' 
    },
    { 
        value: 'Üst Yönetim & VIP', 
        label: 'Üst Yönetim & VIP Makam', 
        desc: 'Genel müdürlük, yönetim kurulu, direktörler',
        icon: '👔' 
    },
    { 
        value: 'Satın Alma & Tedarik Zinciri', 
        label: 'Satın Alma & Tedarik', 
        desc: 'Hammadde, parça ve ürün alımları',
        icon: '📦' 
    },
    { 
        value: 'İdari İşler & Şirket Operasyonu', 
        label: 'İdari İşler & Genel Operasyon', 
        desc: 'Genel şirket içi operasyonel işler',
        icon: '🏢' 
    },
    { 
        value: 'İnsan Kaynakları & Personel', 
        label: 'İnsan Kaynakları & Servis', 
        desc: 'Personel transferleri ve organizasyon',
        icon: '👥' 
    },
    { 
        value: 'Şantiye & Proje Sahası', 
        label: 'Şantiye, Tesis & Proje', 
        desc: 'İnşaat, saha kurulum ve proje ekipleri',
        icon: '🏗️' 
    },
    { 
        value: 'Güvenlik, Denetim & Teftiş', 
        label: 'Güvenlik, Denetim & Saha Kontrol', 
        desc: 'Saha denetimleri, kalite kontrol',
        icon: '🛡️' 
    },
    { 
        value: 'Genel Şirket Havuzu', 
        label: 'Genel Şirket Havuzu (Ortak)', 
        desc: 'Tüm birimlerin ortak rezervasyon havuzu',
        icon: '🅿️' 
    },
];
