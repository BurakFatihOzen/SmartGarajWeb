import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const VEHICLE_PARTS = [
    { id: 'on_tampon', name: 'Ön Tampon' },
    { id: 'motor_kaputu', name: 'Motor Kaputu' },
    { id: 'tavan', name: 'Tavan' },
    { id: 'bagaj_kapagi', name: 'Bagaj Kapağı' },
    { id: 'arka_tampon', name: 'Arka Tampon' },
    { id: 'sol_on_camurluk', name: 'Sol Ön Çamurluk' },
    { id: 'sol_on_kapi', name: 'Sol Ön Kapı' },
    { id: 'sol_arka_kapi', name: 'Sol Arka Kapı' },
    { id: 'sol_arka_camurluk', name: 'Sol Arka Çamurluk' },
    { id: 'sag_on_camurluk', name: 'Sağ Ön Çamurluk' },
    { id: 'sag_on_kapi', name: 'Sağ Ön Kapı' },
    { id: 'sag_arka_kapi', name: 'Sağ Arka Kapı' },
    { id: 'sag_arka_camurluk', name: 'Sağ Arka Çamurluk' },
];

const STATUS_CONFIG = {
    orijinal: { key: 'orijinal', label: 'Orijinal', fill: '#cbd3db', letter: '', color: '#94a3b8' },
    lokal_boyali: { key: 'lokal_boyali', label: 'Lokal Boyalı', fill: '#f58220', letter: 'L', color: '#f58220' },
    boyali: { key: 'boyali', label: 'Boyalı', fill: '#2563eb', letter: 'B', color: '#2563eb' },
    degisen: { key: 'degisen', label: 'Değişen', fill: '#e31e24', letter: 'D', color: '#e31e24' },
};

export default function DamageBodyMap({ value = [], onChange, readOnly = false }) {
    const [selectedBrush, setSelectedBrush] = useState(null);
    const [hoveredPart, setHoveredPart] = useState(null);

    // Normalize value to map of { [partName]: 'boyali' | 'degisen' | 'lokal_boyali' }
    const partsMap = {};
    if (Array.isArray(value)) {
        value.forEach(item => {
            if (!item) return;
            const pName = item.parca || item.partName || item.id;
            let pStatus = (item.durum || item.status || '').toLowerCase();
            if (pStatus === 'boyalı' || pStatus === 'boyali') pStatus = 'boyali';
            else if (pStatus === 'değişen' || pStatus === 'degisen') pStatus = 'degisen';
            else if (pStatus === 'lokal boyalı' || pStatus === 'lokal_boyali') pStatus = 'lokal_boyali';
            else if (pStatus === 'orijinal') pStatus = 'orijinal';

            if (pName && pStatus && pStatus !== 'orijinal') {
                partsMap[pName] = pStatus;
            }
        });
    }

    const handlePartClick = (partName) => {
        if (readOnly || !onChange) return;

        let nextStatus;
        const current = partsMap[partName] || 'orijinal';

        if (selectedBrush) {
            nextStatus = current === selectedBrush ? 'orijinal' : selectedBrush;
        } else {
            // Cycle: Orijinal -> Boyalı (B) -> Değişen (D) -> Lokal Boyalı (L) -> Orijinal
            if (current === 'orijinal') nextStatus = 'boyali';
            else if (current === 'boyali') nextStatus = 'degisen';
            else if (current === 'degisen') nextStatus = 'lokal_boyali';
            else nextStatus = 'orijinal';
        }

        const updated = { ...partsMap };
        if (nextStatus === 'orijinal') {
            delete updated[partName];
        } else {
            updated[partName] = nextStatus;
        }

        const newArray = Object.keys(updated).map(p => ({
            parca: p,
            durum: updated[p] === 'boyali' ? 'Boyalı' : (updated[p] === 'degisen' ? 'Değişen' : 'Lokal Boyalı')
        }));

        onChange(newArray);
    };

    const handleReset = () => {
        if (readOnly || !onChange) return;
        onChange([]);
    };

    const getPartFill = (partName) => {
        const stKey = partsMap[partName] || 'orijinal';
        return STATUS_CONFIG[stKey] || STATUS_CONFIG.orijinal;
    };

    const boyaliList = Object.keys(partsMap).filter(p => partsMap[p] === 'boyali');
    const degisenList = Object.keys(partsMap).filter(p => partsMap[p] === 'degisen');
    const lokalList = Object.keys(partsMap).filter(p => partsMap[p] === 'lokal_boyali');
    const hasAnyDamage = boyaliList.length > 0 || degisenList.length > 0 || lokalList.length > 0;

    return (
        <div className="rounded-2xl bg-[#fffef5] dark:bg-[#11131c] border border-amber-200/50 dark:border-white/[0.08] p-6 sm:p-8 space-y-6">
            
            {/* Header: Title & Legend Row (Sahibinden exact layout) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h3 className="text-base font-extrabold text-[#007be5] dark:text-blue-400">
                    Boyalı veya Değişen Parça
                </h3>

                {/* Legend Indicators / Brush Tools */}
                <div className="flex flex-wrap items-center gap-4 select-none">
                    <button
                        type="button"
                        onClick={() => setSelectedBrush(selectedBrush === 'orijinal' ? null : 'orijinal')}
                        className={`flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                            selectedBrush === 'orijinal' ? 'ring-2 ring-slate-500 rounded px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800' : ''
                        }`}
                    >
                        <span className="w-4 h-4 rounded-sm bg-[#94a3b8]"></span>
                        <span className="text-slate-600 dark:text-slate-300">Orijinal</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedBrush(selectedBrush === 'lokal_boyali' ? null : 'lokal_boyali')}
                        className={`flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                            selectedBrush === 'lokal_boyali' ? 'ring-2 ring-orange-500 rounded px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/40' : ''
                        }`}
                    >
                        <span className="w-4 h-4 rounded-sm bg-[#f58220]"></span>
                        <span className="text-[#f58220]">Lokal Boyalı</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedBrush(selectedBrush === 'boyali' ? null : 'boyali')}
                        className={`flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                            selectedBrush === 'boyali' ? 'ring-2 ring-blue-500 rounded px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/40' : ''
                        }`}
                    >
                        <span className="w-4 h-4 rounded-sm bg-[#2563eb]"></span>
                        <span className="text-[#2563eb]">Boyalı</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedBrush(selectedBrush === 'degisen' ? null : 'degisen')}
                        className={`flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                            selectedBrush === 'degisen' ? 'ring-2 ring-red-500 rounded px-1.5 py-0.5 bg-red-50 dark:bg-red-950/40' : ''
                        }`}
                    >
                        <span className="w-4 h-4 rounded-sm bg-[#e31e24]"></span>
                        <span className="text-[#e31e24]">Değişen</span>
                    </button>

                    {!readOnly && hasAnyDamage && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                            title="Tümünü Sıfırla"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Area: Authentic Sahibinden Vector Schematic & Summary List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                
                {/* 🚗 Left Side: Exact Sahibinden Car SVG Schematic (7 cols) */}
                <div className="lg:col-span-7 flex justify-center">
                    <div className="relative w-full max-w-[340px] select-none">
                        
                        {/* Hover Tooltip */}
                        {hoveredPart && (
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-6 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg z-30 pointer-events-none whitespace-nowrap">
                                {hoveredPart}
                            </div>
                        )}

                        <svg viewBox="0 0 460 620" className="w-full h-auto drop-shadow-sm">

                            {/* ── 4 WHEELS (Large Soft Round Circles Behind Fenders) ── */}
                            {/* Sol Ön Teker */}
                            <circle cx="95" cy="255" r="32" fill="#d8dce2" stroke="#cbd2d9" strokeWidth="1.5" />
                            {/* Sağ Ön Teker */}
                            <circle cx="365" cy="255" r="32" fill="#d8dce2" stroke="#cbd2d9" strokeWidth="1.5" />
                            {/* Sol Arka Teker */}
                            <circle cx="95" cy="475" r="32" fill="#d8dce2" stroke="#cbd2d9" strokeWidth="1.5" />
                            {/* Sağ Arka Teker */}
                            <circle cx="365" cy="475" r="32" fill="#d8dce2" stroke="#cbd2d9" strokeWidth="1.5" />

                            {/* ══════════════════════════════════════════════════════
                                1. DETACHED BUMPERS (Ön & Arka Tampon)
                            ══════════════════════════════════════════════════════ */}

                            {/* ÖN TAMPON (Üstte Ayrı Bar, Far Yuvalı) */}
                            <g 
                                onClick={() => handlePartClick('Ön Tampon')}
                                onMouseEnter={() => setHoveredPart('Ön Tampon')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Ön Tampon' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 160 50
                                        C 180 35, 280 35, 300 50
                                        C 310 56, 310 76, 298 82
                                        C 265 74, 195 74, 162 82
                                        C 150 76, 150 56, 160 50
                                        Z
                                    "
                                    fill={getPartFill('Ön Tampon').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {/* Headlamp cutouts inside bumper */}
                                <ellipse cx="178" cy="62" rx="14" ry="7" fill="#ffffff" opacity="0.9" />
                                <ellipse cx="282" cy="62" rx="14" ry="7" fill="#ffffff" opacity="0.9" />
                                
                                {getPartFill('Ön Tampon').letter && (
                                    <text x="230" y="62" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="15">
                                        {getPartFill('Ön Tampon').letter}
                                    </text>
                                )}
                            </g>

                            {/* ARKA TAMPON (Altta Ayrı Bar, Stop Yuvalı) */}
                            <g 
                                onClick={() => handlePartClick('Arka Tampon')}
                                onMouseEnter={() => setHoveredPart('Arka Tampon')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Arka Tampon' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 162 560
                                        C 195 566, 265 566, 298 560
                                        C 310 566, 310 586, 300 594
                                        C 280 605, 180 605, 160 594
                                        C 150 586, 150 566, 162 560
                                        Z
                                    "
                                    fill={getPartFill('Arka Tampon').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {/* Taillight cutouts */}
                                <rect x="168" y="572" width="18" height="10" rx="3" fill="#ffffff" opacity="0.9" />
                                <rect x="274" y="572" width="18" height="10" rx="3" fill="#ffffff" opacity="0.9" />

                                {getPartFill('Arka Tampon').letter && (
                                    <text x="230" y="580" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="15">
                                        {getPartFill('Arka Tampon').letter}
                                    </text>
                                )}
                            </g>

                            {/* ══════════════════════════════════════════════════════
                                2. CENTER CAR BODY (Gövde, Kaput, Camlar, Tavan, Bagaj)
                            ══════════════════════════════════════════════════════ */}

                            {/* MOTOR KAPUTU (Aerodinamik bombeli) */}
                            <g 
                                onClick={() => handlePartClick('Motor Kaputu')}
                                onMouseEnter={() => setHoveredPart('Motor Kaputu')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Motor Kaputu' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 152 105
                                        C 180 96, 280 96, 308 105
                                        C 318 115, 324 165, 322 230
                                        L 138 230
                                        C 136 165, 142 115, 152 105
                                        Z
                                    "
                                    fill={getPartFill('Motor Kaputu').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Motor Kaputu').letter && (
                                    <text x="230" y="168" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="24">
                                        {getPartFill('Motor Kaputu').letter}
                                    </text>
                                )}
                            </g>

                            {/* ÖN CAM (Windshield - Sabit Cam) */}
                            <path
                                d="
                                    M 140 238
                                    L 320 238
                                    C 314 275, 304 290, 292 298
                                    L 168 298
                                    C 156 290, 146 275, 140 238
                                    Z
                                "
                                fill="#cbd3db"
                                stroke="#ffffff"
                                strokeWidth="3.5"
                                opacity="0.65"
                            />

                            {/* TAVAN (Ortadaki Dikdörtgen Tavan) */}
                            <g 
                                onClick={() => handlePartClick('Tavan')}
                                onMouseEnter={() => setHoveredPart('Tavan')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Tavan' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 166 306
                                        L 294 306
                                        L 294 416
                                        L 166 416
                                        Z
                                    "
                                    fill={getPartFill('Tavan').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Tavan').letter && (
                                    <text x="230" y="361" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="24">
                                        {getPartFill('Tavan').letter}
                                    </text>
                                )}
                            </g>

                            {/* ARKA CAM (Rear Windshield - Sabit Cam) */}
                            <path
                                d="
                                    M 168 424
                                    L 292 424
                                    C 304 432, 314 448, 320 484
                                    L 140 484
                                    C 146 448, 156 432, 168 424
                                    Z
                                "
                                fill="#cbd3db"
                                stroke="#ffffff"
                                strokeWidth="3.5"
                                opacity="0.65"
                            />

                            {/* BAGAJ KAPAĞI (Gövde arkası) */}
                            <g 
                                onClick={() => handlePartClick('Bagaj Kapağı')}
                                onMouseEnter={() => setHoveredPart('Bagaj Kapağı')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Bagaj Kapağı' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 138 492
                                        L 322 492
                                        C 324 515, 314 538, 298 544
                                        C 280 550, 180 550, 162 544
                                        C 146 538, 136 515, 138 492
                                        Z
                                    "
                                    fill={getPartFill('Bagaj Kapağı').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Bagaj Kapağı').letter && (
                                    <text x="230" y="520" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="22">
                                        {getPartFill('Bagaj Kapağı').letter}
                                    </text>
                                )}
                            </g>

                            {/* ══════════════════════════════════════════════════════
                                3. SOL KANAT (Açık Kanat Şeklinde Sol Kapılar & Çamurluklar)
                            ══════════════════════════════════════════════════════ */}

                            {/* SOL ÖN ÇAMURLUK */}
                            <g 
                                onClick={() => handlePartClick('Sol Ön Çamurluk')}
                                onMouseEnter={() => setHoveredPart('Sol Ön Çamurluk')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sol Ön Çamurluk' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 134 110
                                        L 104 125
                                        C 90 140, 78 175, 76 210
                                        C 74 235, 78 248, 85 258
                                        L 134 258
                                        Z
                                    "
                                    fill={getPartFill('Sol Ön Çamurluk').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Sol Ön Çamurluk').letter && (
                                    <text x="106" y="195" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="18">
                                        {getPartFill('Sol Ön Çamurluk').letter}
                                    </text>
                                )}
                            </g>

                            {/* SOL ÖN KAPI (Açılmış Kanat, Dik Dış Kenar, Oval İç Kenar) */}
                            <g 
                                onClick={() => handlePartClick('Sol Ön Kapı')}
                                onMouseEnter={() => setHoveredPart('Sol Ön Kapı')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sol Ön Kapı' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 78 266
                                        L 134 266
                                        L 134 372
                                        L 78 372
                                        C 68 335, 66 295, 78 266
                                        Z
                                    "
                                    fill={getPartFill('Sol Ön Kapı').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {/* Inner window glass outline separator */}
                                <path
                                    d="M 84 274 C 74 300, 74 330, 82 360 L 128 360 L 128 274 Z"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    opacity="0.6"
                                />
                                {getPartFill('Sol Ön Kapı').letter && (
                                    <text x="105" y="318" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="22">
                                        {getPartFill('Sol Ön Kapı').letter}
                                    </text>
                                )}
                            </g>

                            {/* SOL ARKA KAPI */}
                            <g 
                                onClick={() => handlePartClick('Sol Arka Kapı')}
                                onMouseEnter={() => setHoveredPart('Sol Arka Kapı')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sol Arka Kapı' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 78 380
                                        L 134 380
                                        L 134 466
                                        L 85 466
                                        C 78 440, 74 410, 78 380
                                        Z
                                    "
                                    fill={getPartFill('Sol Arka Kapı').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Sol Arka Kapı').letter && (
                                    <text x="106" y="423" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="22">
                                        {getPartFill('Sol Arka Kapı').letter}
                                    </text>
                                )}
                            </g>

                            {/* SOL ARKA ÇAMURLUK */}
                            <g 
                                onClick={() => handlePartClick('Sol Arka Çamurluk')}
                                onMouseEnter={() => setHoveredPart('Sol Arka Çamurluk')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sol Arka Çamurluk' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 85 474
                                        L 134 474
                                        L 134 534
                                        L 105 534
                                        C 92 520, 84 500, 85 474
                                        Z
                                    "
                                    fill={getPartFill('Sol Arka Çamurluk').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Sol Arka Çamurluk').letter && (
                                    <text x="110" y="504" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="18">
                                        {getPartFill('Sol Arka Çamurluk').letter}
                                    </text>
                                )}
                            </g>

                            {/* ══════════════════════════════════════════════════════
                                4. SAĞ KANAT (Açık Kanat Şeklinde Sağ Kapılar & Çamurluklar)
                            ══════════════════════════════════════════════════════ */}

                            {/* SAĞ ÖN ÇAMURLUK */}
                            <g 
                                onClick={() => handlePartClick('Sağ Ön Çamurluk')}
                                onMouseEnter={() => setHoveredPart('Sağ Ön Çamurluk')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sağ Ön Çamurluk' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 326 110
                                        L 356 125
                                        C 370 140, 382 175, 384 210
                                        C 386 235, 382 248, 375 258
                                        L 326 258
                                        Z
                                    "
                                    fill={getPartFill('Sağ Ön Çamurluk').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Sağ Ön Çamurluk').letter && (
                                    <text x="354" y="195" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="18">
                                        {getPartFill('Sağ Ön Çamurluk').letter}
                                    </text>
                                )}
                            </g>

                            {/* SAĞ ÖN KAPI (Sahibinden Mavi Vurgulu Sağ Ön Kapı Şekli) */}
                            <g 
                                onClick={() => handlePartClick('Sağ Ön Kapı')}
                                onMouseEnter={() => setHoveredPart('Sağ Ön Kapı')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sağ Ön Kapı' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 382 266
                                        L 326 266
                                        L 326 372
                                        L 382 372
                                        C 392 335, 394 295, 382 266
                                        Z
                                    "
                                    fill={getPartFill('Sağ Ön Kapı').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {/* Inner window glass outline separator */}
                                <path
                                    d="M 376 274 C 386 300, 386 330, 378 360 L 332 360 L 332 274 Z"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    opacity="0.6"
                                />
                                {getPartFill('Sağ Ön Kapı').letter && (
                                    <text x="355" y="318" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="22">
                                        {getPartFill('Sağ Ön Kapı').letter}
                                    </text>
                                )}
                            </g>

                            {/* SAĞ ARKA KAPI */}
                            <g 
                                onClick={() => handlePartClick('Sağ Arka Kapı')}
                                onMouseEnter={() => setHoveredPart('Sağ Arka Kapı')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sağ Arka Kapı' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 382 380
                                        L 326 380
                                        L 326 466
                                        L 375 466
                                        C 382 440, 386 410, 382 380
                                        Z
                                    "
                                    fill={getPartFill('Sağ Arka Kapı').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Sağ Arka Kapı').letter && (
                                    <text x="354" y="423" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="22">
                                        {getPartFill('Sağ Arka Kapı').letter}
                                    </text>
                                )}
                            </g>

                            {/* SAĞ ARKA ÇAMURLUK (Sahibinden Mavi Vurgulu Sağ Arka Çamurluk Şekli) */}
                            <g 
                                onClick={() => handlePartClick('Sağ Arka Çamurluk')}
                                onMouseEnter={() => setHoveredPart('Sağ Arka Çamurluk')}
                                onMouseLeave={() => setHoveredPart(null)}
                                className={readOnly ? '' : 'cursor-pointer'}
                                style={{ opacity: hoveredPart === 'Sağ Arka Çamurluk' ? 0.85 : 1 }}
                            >
                                <path
                                    d="
                                        M 375 474
                                        L 326 474
                                        L 326 534
                                        L 355 534
                                        C 368 520, 376 500, 375 474
                                        Z
                                    "
                                    fill={getPartFill('Sağ Arka Çamurluk').fill}
                                    stroke="#ffffff"
                                    strokeWidth="3.5"
                                    strokeLinejoin="round"
                                />
                                {getPartFill('Sağ Arka Çamurluk').letter && (
                                    <text x="350" y="504" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontWeight="900" fontSize="18">
                                        {getPartFill('Sağ Arka Çamurluk').letter}
                                    </text>
                                )}
                            </g>

                        </svg>
                    </div>
                </div>

                {/* 📋 Right Side: Clean Sahibinden-Style Summary List (5 cols) */}
                <div className="lg:col-span-5 space-y-6 pt-4">

                    {/* Boyalı Parçalar */}
                    {boyaliList.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm font-extrabold text-[#2563eb]">
                                <span className="w-3.5 h-3.5 rounded-sm bg-[#2563eb]"></span>
                                <span>Boyalı Parçalar</span>
                            </div>
                            <ul className="space-y-1.5 pl-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {boyaliList.map(p => (
                                    <li key={p} className="flex items-center gap-2">
                                        <span className="text-slate-400 font-bold">&bull;</span>
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Değişen Parçalar */}
                    {degisenList.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm font-extrabold text-[#e31e24]">
                                <span className="w-3.5 h-3.5 rounded-sm bg-[#e31e24]"></span>
                                <span>Değişen Parçalar</span>
                            </div>
                            <ul className="space-y-1.5 pl-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {degisenList.map(p => (
                                    <li key={p} className="flex items-center gap-2">
                                        <span className="text-slate-400 font-bold">&bull;</span>
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Lokal Boyalı Parçalar */}
                    {lokalList.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm font-extrabold text-[#f58220]">
                                <span className="w-3.5 h-3.5 rounded-sm bg-[#f58220]"></span>
                                <span>Lokal Boyalı Parçalar</span>
                            </div>
                            <ul className="space-y-1.5 pl-6 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {lokalList.map(p => (
                                    <li key={p} className="flex items-center gap-2">
                                        <span className="text-slate-400 font-bold">&bull;</span>
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Hiçbir hasar seçilmediyse */}
                    {!hasAnyDamage && (
                        <div className="py-4 text-slate-500 dark:text-slate-400 text-xs font-semibold space-y-1">
                            <p className="font-extrabold text-slate-800 dark:text-white text-sm">
                                Hasarlı parça seçilmedi
                            </p>
                            <p className="text-[11px] text-slate-400">
                                Parçalara tıklayarak Boyalı (B), Değişen (D) veya Lokal (L) olarak işaretleyebilirsiniz.
                            </p>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
