import React, { useMemo } from 'react';
import { 
    X, 
    Wrench, 
    Calendar, 
    Gauge, 
    Coins, 
    Building2, 
    User, 
    Phone, 
    Droplets, 
    FileText, 
    MapPin, 
    Pencil, 
    CheckCircle2, 
    Boxes, 
    Paintbrush, 
    Clock, 
    Shield, 
    Sparkles,
    Printer,
    Check,
    Layers,
    Tag,
    ChevronRight,
    CircleDot
} from 'lucide-react';

const categorizeOperation = (opName) => {
    const lower = opName.toLowerCase();
    
    if (lower.includes('yağ') || lower.includes('periyodik') || (lower.includes('filtre') && !lower.includes('klima')) || lower.includes('antifriz') || lower.includes('cam suyu')) {
        return {
            id: 'periyodik_sivi',
            category: 'Periyodik & Sıvı Bakımı',
            icon: '🛢️',
            badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
            cardBg: 'bg-amber-500/[0.03] border-amber-500/20'
        };
    }
    if ((lower.includes('fren') || lower.includes('balata') || lower.includes('disk') || lower.includes('kaliper') || lower.includes('abs')) && !lower.includes('baskı balata') && !lower.includes('debriyaj')) {
        return {
            id: 'fren_guvenlik',
            category: 'Fren & Güvenlik Sistemi',
            icon: '🛑',
            badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
            cardBg: 'bg-red-500/[0.03] border-red-500/20'
        };
    }
    if (lower.includes('baskı') || lower.includes('debriyaj') || lower.includes('volan') || lower.includes('şanzıman') || lower.includes('vites')) {
        return {
            id: 'sanziman_aktarma',
            category: 'Şanzıman, Debriyaj & Aktarma',
            icon: '⚙️',
            badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
            cardBg: 'bg-indigo-500/[0.03] border-indigo-500/20'
        };
    }
    if (lower.includes('triger') || lower.includes('motor') || lower.includes('v kayış') || lower.includes('devirdaim') || lower.includes('buji') || lower.includes('turbo') || lower.includes('enjektör') || lower.includes('egr') || lower.includes('dpf') || lower.includes('subap') || lower.includes('termostat') || lower.includes('radyatör')) {
        return {
            id: 'motor_mekanik',
            category: 'Motor & Mekanik Aksam',
            icon: '🔧',
            badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            cardBg: 'bg-blue-500/[0.03] border-blue-500/20'
        };
    }
    if (lower.includes('amortisör') || lower.includes('salıncak') || lower.includes('rot') || lower.includes('rulman') || lower.includes('aks') || lower.includes('lastik') || lower.includes('balans') || lower.includes('süspansiyon') || lower.includes('direksiyon')) {
        return {
            id: 'yuruyen_lastik',
            category: 'Yürüyen Aksam & Lastik',
            icon: '🛞',
            badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            cardBg: 'bg-emerald-500/[0.03] border-emerald-500/20'
        };
    }
    if (lower.includes('kaporta') || lower.includes('boya') || lower.includes('göçük') || lower.includes('pdr') || lower.includes('çekiç') || lower.includes('rötüş') || lower.includes('pasta') || lower.includes('seramik') || lower.includes('ppf') || lower.includes('kuaför')) {
        return {
            id: 'kaporta_boya',
            category: 'Kaporta, Boya & Detailing',
            icon: '🎨',
            badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
            cardBg: 'bg-purple-500/[0.03] border-purple-500/20'
        };
    }
    if (lower.includes('akü') || lower.includes('klima') || lower.includes('elektrik') || lower.includes('alternatör') || lower.includes('marş') || lower.includes('sigorta') || lower.includes('aydınlatma') || lower.includes('far')) {
        return {
            id: 'elektrik_klima',
            category: 'Elektrik, Akü & Klima',
            icon: '⚡',
            badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
            cardBg: 'bg-cyan-500/[0.03] border-cyan-500/20'
        };
    }
    if (lower.includes('muayene') || lower.includes('tüvtürk') || lower.includes('ekspertiz') || lower.includes('arıza tespit') || lower.includes('dyno')) {
        return {
            id: 'muayene_ekspertiz',
            category: 'Muayene & Ekspertiz',
            icon: '📋',
            badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
            cardBg: 'bg-slate-500/[0.03] border-slate-500/20'
        };
    }
    return {
        id: 'diger_ozel',
        category: 'Diğer & Özel Servis İşlemleri',
        icon: '🛠️',
        badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
        cardBg: 'bg-slate-500/[0.03] border-slate-500/20'
    };
};

export default function MaintenanceDetailModal({ isOpen, onClose, maintenance, onEdit, vehicle = null }) {
    if (!isOpen || !maintenance) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'Girilmedi';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getServicePlaceText = () => {
        if (maintenance.servis_adi) {
            return {
                title: maintenance.servis_adi,
                subtitle: maintenance.sanayi_sitesi ? `${maintenance.sanayi_sitesi} (Yetkili Servis)` : 'Yetkili Bayi & Servis',
                icon: Building2,
                typeBadge: 'Yetkili Servis'
            };
        }
        if (maintenance.usta_adi) {
            return {
                title: maintenance.usta_adi,
                subtitle: maintenance.sanayi_sitesi || 'Özel Oto Mekanik Servisi',
                icon: Wrench,
                typeBadge: 'Özel Servis / Usta'
            };
        }
        if (maintenance.sanayi_sitesi) {
            return {
                title: maintenance.sanayi_sitesi,
                subtitle: 'Sanayi Sitesi Atölyesi',
                icon: MapPin,
                typeBadge: 'Sanayi Ustası'
            };
        }
        if (maintenance.servis_turu === 'kendi_garajimiz') {
            return {
                title: 'Kendi Garajım (DIY)',
                subtitle: 'Bireysel / Şirket İçi Bakım',
                icon: Wrench,
                typeBadge: 'Kendi Garajımız'
            };
        }
        return {
            title: 'Özel Servis / Sanayi',
            subtitle: 'Servis adı belirtilmedi',
            icon: Building2,
            typeBadge: 'Özel Servis'
        };
    };

    const servicePlace = getServicePlaceText();
    const ServiceIcon = servicePlace.icon;

    // Parse distinct operations and group them into categories
    const categorizedOperations = useMemo(() => {
        const rawTitle = maintenance.islem_turu || '';
        // Split by '+' or '|' or ';'
        const items = rawTitle.split(/\s*\+\s*|\s*\|\s*|\s*;\s*/).map(s => s.trim()).filter(Boolean);

        const groups = {};

        items.forEach(op => {
            const cat = categorizeOperation(op);
            if (!groups[cat.id]) {
                groups[cat.id] = {
                    id: cat.id,
                    name: cat.category,
                    icon: cat.icon,
                    badgeBg: cat.badgeBg,
                    cardBg: cat.cardBg,
                    items: []
                };
            }
            groups[cat.id].items.push(op);
        });

        return Object.values(groups);
    }, [maintenance.islem_turu]);

    // Extract OEM spare parts from description or notes
    const extractedParts = useMemo(() => {
        const text = maintenance.aciklama || '';
        const partsMatch = text.match(/\[Değişen OEM Parçalar:\s*([^\]]+)\]/i);
        if (partsMatch && partsMatch[1]) {
            return partsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        }
        // Fallback: Check for inline "OEM yedek parçalar: ..."
        const inlineMatch = text.match(/kullanılan OEM yedek parçalar:\s*([^.\n]+)/i);
        if (inlineMatch && inlineMatch[1]) {
            return inlineMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        }
        return [];
    }, [maintenance.aciklama]);

    // Extract Bodywork repair parts
    const extractedBodywork = useMemo(() => {
        const text = maintenance.aciklama || '';
        const bodyworkMatch = text.match(/\[Kaporta\/Boya Onarımı:\s*([^\]]+)\]/i);
        if (bodyworkMatch && bodyworkMatch[1]) {
            return bodyworkMatch[1].split('|').map(s => s.trim()).filter(Boolean);
        }
        return [];
    }, [maintenance.aciklama]);

    // Clean human notes by removing serialized brackets
    const cleanNotes = useMemo(() => {
        let text = maintenance.aciklama || '';
        text = text.replace(/\[Değişen OEM Parçalar:[^\]]+\]/gi, '').trim();
        text = text.replace(/\[Kaporta\/Boya Onarımı:[^\]]+\]/gi, '').trim();
        return text;
    }, [maintenance.aciklama]);

    // Check if oil section is relevant
    const hasOilInfo = Boolean(
        maintenance.yag_markasi || 
        maintenance.yag_viskozite || 
        maintenance.yag_litresi || 
        (maintenance.islem_turu && maintenance.islem_turu.toLowerCase().includes('yağ'))
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-2xl overflow-hidden animate-scaleUp">
                
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black shrink-0">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="badge-plate text-xs font-black px-2 py-0.5">
                                    {maintenance.vehicle_plaka || vehicle?.plaka || '34 GARAJ 01'}
                                </span>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                    {maintenance.vehicle_name || (vehicle ? `${vehicle.marka} ${vehicle.model}` : '')}
                                </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                                Bakım & Servis Detay Raporu
                            </h3>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer hidden sm:flex"
                            title="Raporu Yazdır"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-900 dark:text-white text-xs">
                    
                    {/* Top Summary Banner: Cost & Timing */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                Toplam Bakım Tutarı
                            </span>
                            <div className="font-mono font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">
                                ₺{Number(maintenance.maliyet_tl || 0).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#161824] border border-amber-500/15 flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-amber-500" />
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-normal">İşlem Tarihi</span>
                                    <span>{maintenance.islem_tarihi_formatted || formatDate(maintenance.islem_tarihi)}</span>
                                </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#161824] border border-amber-500/15 flex items-center space-x-2">
                                <Gauge className="w-4 h-4 text-emerald-500" />
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-normal">Servis Kilometresi</span>
                                    <span className="font-mono">{Number(maintenance.islem_km || 0).toLocaleString('tr-TR')} KM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Place & Master (Servisin Yapıldığı Yer) */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                🏢 Servisin Yapıldığı Yer & Usta Bilgileri
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold border border-blue-500/20">
                                {servicePlace.typeBadge}
                            </span>
                        </div>

                        <div className="flex items-start space-x-3.5 pt-1">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                                <ServiceIcon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1 flex-1">
                                <div className="text-sm font-black text-slate-900 dark:text-white">
                                    {servicePlace.title}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {servicePlace.subtitle}
                                </div>
                                {maintenance.usta_tel && (
                                    <div className="flex items-center space-x-2 pt-1 text-slate-700 dark:text-slate-300 font-bold">
                                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                        <a href={`tel:${maintenance.usta_tel}`} className="hover:text-emerald-500 hover:underline">
                                            {maintenance.usta_tel}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION: CATEGORIZED OPERATIONS BREAKDOWN (Kategori Kategori Yapılan Bakımlar) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-amber-500" />
                                <span>Yapılan İşlemler (Kategori Kategori Dağılım)</span>
                            </span>
                            <span className="text-[11px] font-bold text-slate-400">
                                {categorizedOperations.reduce((acc, c) => acc + c.items.length, 0)} İşlem Kayıtlı
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {categorizedOperations.map((catGroup) => (
                                <div
                                    key={catGroup.id}
                                    className={`p-4 rounded-2xl border ${catGroup.cardBg} space-y-2.5 transition-all`}
                                >
                                    {/* Category Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-base">{catGroup.icon}</span>
                                            <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                                {catGroup.name}
                                            </h4>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${catGroup.badgeBg}`}>
                                            {catGroup.items.length} İşlem
                                        </span>
                                    </div>

                                    {/* List of items in this category */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                        {catGroup.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-2.5 rounded-xl bg-white dark:bg-[#161824] border border-slate-200/70 dark:border-white/[0.06] flex items-center space-x-2"
                                            >
                                                <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                </div>
                                                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: MOTOR OIL & FLUIDS SPECIFICATIONS (If Applicable) */}
                    {hasOilInfo && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                <Droplets className="w-3.5 h-3.5" />
                                <span>Kullanılan Motor Yağı & Filtre Spesifikasyonları</span>
                            </span>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                                <div className="p-3 rounded-xl bg-white dark:bg-[#161824] border border-amber-500/10">
                                    <span className="text-[10px] text-slate-400 font-bold block">Yağ Markası</span>
                                    <span className="font-black text-slate-900 dark:text-white text-xs">{maintenance.yag_markasi || 'Castrol'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white dark:bg-[#161824] border border-amber-500/10">
                                    <span className="text-[10px] text-slate-400 font-bold block">Seri / Model</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate block">{maintenance.yag_modeli || 'EDGE Titanium FST'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white dark:bg-[#161824] border border-amber-500/10">
                                    <span className="text-[10px] text-slate-400 font-bold block">Viskozite</span>
                                    <span className="font-black text-amber-600 dark:text-amber-400 text-xs">{maintenance.yag_viskozite || '5W-30'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white dark:bg-[#161824] border border-amber-500/10">
                                    <span className="text-[10px] text-slate-400 font-bold block">Dolum / Filtre</span>
                                    <span className="font-black text-slate-900 dark:text-white text-xs">
                                        {maintenance.yag_litresi ? `${maintenance.yag_litresi}L` : '4.5L'} {maintenance.yag_filtresi_degisti ? '✓ Filtre Değişti' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION: OEM SPARE PARTS LIST (Değişen OEM Parçalar) */}
                    {extractedParts.length > 0 && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Boxes className="w-3.5 h-3.5 text-blue-500" />
                                <span>Değişen OEM Yedek Parçalar & Markalar ({extractedParts.length} Parça)</span>
                            </span>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {extractedParts.map((part, idx) => (
                                    <div
                                        key={idx}
                                        className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-extrabold text-xs flex items-center space-x-1.5"
                                    >
                                        <Tag className="w-3 h-3" />
                                        <span>{part}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION: BODYWORK & PDR REPAIR (Kaporta / Boyasız Göçük) */}
                    {extractedBodywork.length > 0 && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/5 border border-purple-500/15 space-y-3">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                                <Paintbrush className="w-3.5 h-3.5" />
                                <span>Kaporta, Göçük & Boya Onarımları ({extractedBodywork.length} Parça)</span>
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                {extractedBodywork.map((bw, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-xl bg-white dark:bg-[#161824] border border-purple-500/15 font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span>{bw}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION: TECHNICIAN & USER NOTES (Usta Açıklaması) */}
                    {cleanNotes && (
                        <div className="space-y-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                <span>Teknik Servis Notu & Usta Açıklaması</span>
                            </span>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                                {cleanNotes}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                        Kapat
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            if (onEdit) onEdit(maintenance);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center space-x-1.5 cursor-pointer"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Bakımı Düzenle</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
