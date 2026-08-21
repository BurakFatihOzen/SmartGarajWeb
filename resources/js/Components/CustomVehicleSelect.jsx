import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Car, Search } from 'lucide-react';

export default function CustomVehicleSelect({ 
    vehicles = [], 
    value, 
    onChange, 
    placeholder = "Araç Seçiniz...",
    className = "" 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    const selectedVehicle = vehicles.find(v => String(v.id) === String(value)) || vehicles[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredVehicles = vehicles.filter(v => {
        const query = searchTerm.toLowerCase();
        return (
            v.plaka?.toLowerCase().includes(query) ||
            v.marka?.toLowerCase().includes(query) ||
            v.model?.toLowerCase().includes(query)
        );
    });

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border ${
                    isOpen 
                        ? 'border-amber-500 ring-2 ring-amber-500/20 bg-white dark:bg-[#1a1d29]' 
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                } transition-all text-left cursor-pointer group shadow-sm`}
            >
                {selectedVehicle ? (
                    <div className="flex items-center space-x-3 truncate">
                        {/* Realistic Mini Plate Badge */}
                        <div className="inline-flex items-center rounded-lg border border-slate-900/40 bg-white shadow-xs overflow-hidden shrink-0">
                            <span className="bg-[#003399] px-1 py-0.5 text-[8px] font-black text-white leading-none tracking-tighter">TR</span>
                            <span className="px-2 py-0.5 text-xs font-black font-mono text-slate-900 tracking-wider">
                                {selectedVehicle.plaka}
                            </span>
                        </div>

                        <div className="truncate">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                                {selectedVehicle.marka} {selectedVehicle.model}
                            </span>
                            {selectedVehicle.model_yili && (
                                <span className="text-[11px] text-slate-400 font-semibold ml-1.5">
                                    ({selectedVehicle.model_yili})
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <span className="text-xs font-medium text-slate-400">{placeholder}</span>
                )}

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-amber-500' : 'group-hover:text-slate-600'}`} />
            </button>

            {/* Animated Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* Search inside dropdown if more than 4 vehicles */}
                    {vehicles.length > 4 && (
                        <div className="p-2 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Plaka veya model ara..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs font-medium bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* Vehicles List */}
                    <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map(v => {
                                const isSelected = String(v.id) === String(selectedVehicle?.id);
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(v.id);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                                            isSelected 
                                                ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-extrabold' 
                                                : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3 truncate">
                                            {/* Plate */}
                                            <div className="inline-flex items-center rounded-lg border border-slate-900/40 bg-white shadow-xs overflow-hidden shrink-0">
                                                <span className="bg-[#003399] px-1 py-0.5 text-[8px] font-black text-white leading-none">TR</span>
                                                <span className="px-1.5 py-0.5 text-[11px] font-black font-mono text-slate-900">
                                                    {v.plaka}
                                                </span>
                                            </div>

                                            <div className="truncate">
                                                <span className="text-xs font-bold">
                                                    {v.marka} {v.model}
                                                </span>
                                                {v.model_yili && (
                                                    <span className="text-[10px] text-slate-400 ml-1.5">
                                                        ({v.model_yili})
                                                    </span>
                                                )}
                                                {v.guncel_km > 0 && (
                                                    <span className="text-[10px] text-slate-400 font-mono ml-2">
                                                        &bull; {Number(v.guncel_km).toLocaleString('tr-TR')} KM
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <Check className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="py-4 text-center text-xs text-slate-400">
                                Eşleşen araç bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
