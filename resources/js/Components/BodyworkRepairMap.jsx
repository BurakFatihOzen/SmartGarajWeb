import React, { useState } from 'react';
import { 
    Paintbrush, 
    Hammer, 
    Sparkles, 
    RotateCcw, 
    X, 
    Plus, 
    Check, 
    Shield, 
    Edit3, 
    Car,
    FileText
} from 'lucide-react';

export const VEHICLE_BODY_PARTS = [
    { id: 'on_tampon', name: 'Ön Tampon', path: 'M 140 10 C 180 0 240 0 280 10 C 300 20 305 35 295 45 C 275 42 145 42 125 45 C 115 35 120 20 140 10 Z' },
    { id: 'motor_kaputu', name: 'Motor Kaputu', path: 'M 130 50 C 180 48 240 48 290 50 L 305 160 C 250 165 170 165 115 160 Z' },
    { id: 'tavan', name: 'Tavan', path: 'M 135 230 C 180 228 240 228 285 230 L 290 350 C 240 352 180 352 130 350 Z' },
    { id: 'bagaj_kapagi', name: 'Bagaj Kapağı', path: 'M 135 410 C 180 405 240 405 285 410 L 295 480 C 245 490 175 490 125 480 Z' },
    { id: 'arka_tampon', name: 'Arka Tampon', path: 'M 125 485 C 175 495 245 495 295 485 C 305 495 300 510 280 520 C 240 530 180 530 140 520 C 120 510 115 495 125 485 Z' },
    { id: 'sol_on_camurluk', name: 'Sol Ön Çamurluk', path: 'M 105 45 C 125 42 128 50 113 160 L 95 170 C 85 130 85 80 105 45 Z' },
    { id: 'sol_on_kapi', name: 'Sol Ön Kapı', path: 'M 93 175 L 115 165 L 128 260 L 93 260 C 90 230 90 205 93 175 Z' },
    { id: 'sol_arka_kapi', name: 'Sol Arka Kapı', path: 'M 93 265 L 128 265 L 128 355 L 93 355 Z' },
    { id: 'sol_arka_camurluk', name: 'Sol Arka Çamurluk', path: 'M 93 360 L 128 360 L 123 480 C 100 475 85 430 93 360 Z' },
    { id: 'sag_on_camurluk', name: 'Sağ Ön Çamurluk', path: 'M 315 45 C 295 42 292 50 307 160 L 325 170 C 335 130 335 80 315 45 Z' },
    { id: 'sag_on_kapi', name: 'Sağ Ön Kapı', path: 'M 327 175 L 305 165 L 292 260 L 327 260 C 330 230 330 205 327 175 Z' },
    { id: 'sag_arka_kapi', name: 'Sağ Arka Kapı', path: 'M 327 265 L 292 265 L 292 355 L 327 355 Z' },
    { id: 'sag_arka_camurluk', name: 'Sağ Arka Çamurluk', path: 'M 327 360 L 292 360 L 297 480 C 320 475 335 430 327 360 Z' },
];

export const BODYWORK_OPERATION_TYPES = [
    { 
        id: 'pdr_gocuk', 
        name: 'Boyasız Göçük Düzeltme (PDR / Kuru Çekiç)', 
        short: 'PDR Göçük Düzeltme', 
        color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30', 
        fill: '#06b6d4', 
        icon: '🔨' 
    },
    { 
        id: 'rotus_cizik', 
        name: 'Rötüş & Çizik Onarımı', 
        short: 'Rötüş & Çizik', 
        color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30', 
        fill: '#f59e0b', 
        icon: '🖌️' 
    },
    { 
        id: 'lokal_boya', 
        name: 'Lokal Boya Uygulaması', 
        short: 'Lokal Boyalı', 
        color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30', 
        fill: '#ea580c', 
        icon: '🎨' 
    },
    { 
        id: 'tam_boya', 
        name: 'Tam Parça Boyama', 
        short: 'Tam Boyalı', 
        color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30', 
        fill: '#2563eb', 
        icon: '🎨' 
    },
    { 
        id: 'orijinal_degisen', 
        name: 'Orijinal Parça Değişimi', 
        short: 'Orijinal Değişen', 
        color: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30', 
        fill: '#dc2626', 
        icon: '🔄' 
    },
    { 
        id: 'yan_sanayi_degisen', 
        name: 'Çıkma / Yan Sanayi Parça Değişimi', 
        short: 'Yan Sanayi Değişen', 
        color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30', 
        fill: '#e11d48', 
        icon: '🔄' 
    },
    { 
        id: 'pasta_cila_seramik', 
        name: 'Pasta Cila & Seramik / Parlatma', 
        short: 'Pasta Cila', 
        color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30', 
        fill: '#9333ea', 
        icon: '✨' 
    },
    { 
        id: 'ppf_folyo', 
        name: 'PPF Kaplama & Folyo Koruma', 
        short: 'PPF / Folyo', 
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30', 
        fill: '#10b981', 
        icon: '🛡️' 
    },
    { 
        id: 'ayar_montaj', 
        name: 'Kilit / Menteşe / Ayar Düzenleme', 
        short: 'Ayar & Montaj', 
        color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/30', 
        fill: '#6366f1', 
        icon: '🔧' 
    },
    { 
        id: 'diger', 
        name: 'Diğer / Özel Kaporta İşlemi', 
        short: 'Özel İşlem', 
        color: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30', 
        fill: '#64748b', 
        icon: '✍️' 
    },
];

export default function BodyworkRepairMap({ value = [], onChange }) {
    const [selectedPartForAction, setSelectedPartForAction] = useState(null);
    const [customNote, setCustomNote] = useState('');
    const [selectedOpType, setSelectedOpType] = useState('pdr_gocuk');
    const [hoveredPart, setHoveredPart] = useState(null);

    // Normalize value array: [{ parca: 'Sol Ön Kapı', islem: 'Boyasız Göçük Düzeltme (PDR)', tip_id: 'pdr_gocuk', not: '...' }]
    const partsMap = {};
    if (Array.isArray(value)) {
        value.forEach(item => {
            if (item && item.parca) {
                partsMap[item.parca] = item;
            }
        });
    }

    const handlePartClick = (part) => {
        const existing = partsMap[part.name];
        setSelectedPartForAction(part);
        if (existing) {
            setSelectedOpType(existing.tip_id || 'pdr_gocuk');
            setCustomNote(existing.not || '');
        } else {
            setSelectedOpType('pdr_gocuk');
            setCustomNote('');
        }
    };

    const handleSavePartAction = () => {
        if (!selectedPartForAction) return;

        const opConfig = BODYWORK_OPERATION_TYPES.find(t => t.id === selectedOpType) || BODYWORK_OPERATION_TYPES[0];
        const islemLabel = selectedOpType === 'diger' && customNote.trim() 
            ? `Özel: ${customNote.trim()}` 
            : opConfig.short;

        const updated = { ...partsMap };
        updated[selectedPartForAction.name] = {
            parca: selectedPartForAction.name,
            parca_id: selectedPartForAction.id,
            tip_id: selectedOpType,
            islem: islemLabel,
            tam_ad: opConfig.name,
            not: customNote.trim(),
        };

        const newArray = Object.values(updated);
        onChange(newArray);
        setSelectedPartForAction(null);
        setCustomNote('');
    };

    const handleRemovePart = (partName) => {
        const updated = { ...partsMap };
        delete updated[partName];
        onChange(Object.values(updated));
    };

    const handleClearAll = () => {
        onChange([]);
    };

    return (
        <div className="rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.08] p-5 sm:p-7 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-white/[0.06]">
                <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                        <Paintbrush className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>Kaporta & Boya Onarım Şeması</span>
                            {value.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-black">
                                    {value.length} Parça Seçildi
                                </span>
                            )}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                            İşlem yapılan parçanın üstüne tıklayarak kuru çekiç, lokal boya, rötüş veya değişim detayı ekleyin.
                        </p>
                    </div>
                </div>

                {value.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-xs font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 underline cursor-pointer self-start sm:self-auto"
                    >
                        Tüm Parçaları Temizle
                    </button>
                )}
            </div>

            {/* Quick Presets Legend */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                {BODYWORK_OPERATION_TYPES.slice(0, 6).map((t) => (
                    <span key={t.id} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border ${t.color}`}>
                        <span>{t.icon}</span>
                        <span>{t.short}</span>
                    </span>
                ))}
            </div>

            {/* Map & Inspector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Visual Car SVG Diagram (5 Cols) */}
                <div className="lg:col-span-5 flex justify-center py-2">
                    <div className="relative w-64 h-[340px] select-none">
                        <svg viewBox="70 0 280 540" className="w-full h-full drop-shadow-md">
                            {/* Car Frame Background */}
                            <path
                                d="M 120 15 C 160 0 260 0 300 15 C 330 40 330 150 340 180 C 345 230 345 320 340 370 C 335 430 330 490 300 525 C 260 540 160 540 120 525 C 90 490 85 430 80 370 C 75 320 75 230 80 180 C 90 150 90 40 120 15 Z"
                                fill="#1e293b"
                                opacity="0.15"
                            />

                            {/* Individual Clickable Parts */}
                            {VEHICLE_BODY_PARTS.map((part) => {
                                const isAdded = !!partsMap[part.name];
                                const partData = partsMap[part.name];
                                const opConfig = isAdded ? BODYWORK_OPERATION_TYPES.find(t => t.id === partData.tip_id) : null;
                                const isHovered = hoveredPart === part.name;
                                const isCurrentlyEditing = selectedPartForAction?.name === part.name;

                                let fill = '#94a3b8'; // Default neutral
                                if (isAdded && opConfig) {
                                    fill = opConfig.fill;
                                }

                                return (
                                    <g key={part.id}>
                                        <path
                                            d={part.path}
                                            fill={fill}
                                            fillOpacity={isAdded ? 0.85 : (isHovered || isCurrentlyEditing ? 0.5 : 0.25)}
                                            stroke={isCurrentlyEditing ? '#3b82f6' : (isAdded ? '#ffffff' : '#64748b')}
                                            strokeWidth={isCurrentlyEditing ? 3 : (isAdded ? 2 : 1.5)}
                                            className="cursor-pointer transition-all hover:scale-[1.01] hover:fill-opacity-70"
                                            onMouseEnter={() => setHoveredPart(part.name)}
                                            onMouseLeave={() => setHoveredPart(null)}
                                            onClick={() => handlePartClick(part)}
                                        />
                                    </g>
                                );
                            })}
                        </svg>

                        {hoveredPart && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-slate-900 text-white text-[11px] font-bold shadow-lg pointer-events-none whitespace-nowrap">
                                {hoveredPart} {partsMap[hoveredPart] ? `(${partsMap[hoveredPart].islem})` : '(Tıkla & İşlem Seç)'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Part Editor / Action Box (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                    {selectedPartForAction ? (
                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161824] border border-blue-500/30 shadow-lg space-y-4 animate-fadeIn">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                    <h5 className="font-black text-sm text-slate-900 dark:text-white">
                                        {selectedPartForAction.name} &bull; İşlem Seçin
                                    </h5>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPartForAction(null)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Operation Type Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                                {BODYWORK_OPERATION_TYPES.map((op) => {
                                    const isSelected = selectedOpType === op.id;
                                    return (
                                        <button
                                            key={op.id}
                                            type="button"
                                            onClick={() => setSelectedOpType(op.id)}
                                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between text-xs font-bold ${
                                                isSelected
                                                    ? `${op.color} ring-2 ring-blue-500 shadow-sm`
                                                    : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm">{op.icon}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className="leading-tight truncate">{op.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Note Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Özel Not / Detay (Kuru çekiç, mikron boyutu, boyasız göçük vb.):
                                </label>
                                <input
                                    type="text"
                                    value={customNote}
                                    onChange={(e) => setCustomNote(e.target.value)}
                                    placeholder="Örn: Park halinde gamze kuru çekiçle düzeltildi, orijinal boya korundu"
                                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPartForAction(null)}
                                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                                >
                                    İptal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSavePartAction}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-500/25 flex items-center space-x-1.5 cursor-pointer"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Şemaya Ekle</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#161824] border border-slate-200/80 dark:border-white/[0.06] text-center space-y-2">
                            <Car className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                            <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                                Şemadan Bir Parçaya Tıklayın
                            </h5>
                            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                                Kaput, tavan, çamurluk veya kapılara tıklayarak boyasız göçük düzeltme, kuru çekiç, lokal boya ve detaylı not ekleyebilirsiniz.
                            </p>
                        </div>
                    )}

                    {/* Selected Parts Badges List */}
                    {value.length > 0 && (
                        <div className="space-y-2 pt-1">
                            <div className="text-xs font-black text-slate-700 dark:text-slate-300">
                                Kaydedilen Parça & Onarımlar ({value.length}):
                            </div>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto p-1">
                                {value.map((item, idx) => {
                                    const opConfig = BODYWORK_OPERATION_TYPES.find(t => t.id === item.tip_id) || BODYWORK_OPERATION_TYPES[0];
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#161824] border border-slate-200/80 dark:border-white/5 text-xs shadow-sm"
                                        >
                                            <div className="flex items-center space-x-2 truncate">
                                                <span>{opConfig.icon}</span>
                                                <span className="font-black text-slate-900 dark:text-white">{item.parca}:</span>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${opConfig.color}`}>
                                                    {item.islem}
                                                </span>
                                                {item.not && (
                                                    <span className="text-[11px] text-slate-400 italic truncate">
                                                        "{item.not}"
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemovePart(item.parca)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors ml-2 cursor-pointer shrink-0"
                                                title="Parçayı kaldır"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
