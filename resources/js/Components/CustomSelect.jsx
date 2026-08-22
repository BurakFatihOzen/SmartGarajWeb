import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function CustomSelect({ 
    options = [], // [{ value: '...', label: '...', icon?: ReactNode, badge?: string, color?: string, dotColor?: string, desc?: string }]
    value, 
    onChange, 
    placeholder = "Seçiniz...",
    className = "",
    dropdownWidth = "w-full",
    searchable = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);

    const selectedOption = options.find(o => String(o.value) === String(value));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = searchable && searchTerm
        ? options.filter(o => 
            o.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.desc && o.desc.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : options;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border ${
                    isOpen 
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-[#1a1d29]' 
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                } transition-all text-left cursor-pointer group shadow-xs`}
            >
                <div className="flex items-center space-x-2.5 truncate min-w-0">
                    {selectedOption?.dotColor && (
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedOption.dotColor}`} />
                    )}
                    {selectedOption?.icon && (
                        <span className="shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                            {selectedOption.icon}
                        </span>
                    )}
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    {selectedOption?.badge && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 shrink-0">
                            {selectedOption.badge}
                        </span>
                    )}
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            </button>

            {isOpen && (
                <div className={`absolute left-0 top-full mt-1.5 z-50 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2 space-y-1.5 ${dropdownWidth}`}>
                    {searchable && (
                        <div className="relative mb-1">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Arayın..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left cursor-pointer group ${
                                            isSelected 
                                                ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-900 dark:text-blue-200 font-extrabold border border-blue-500/20' 
                                                : 'hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 font-medium'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2.5 truncate min-w-0">
                                            {opt.dotColor && (
                                                <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
                                            )}
                                            {opt.icon && (
                                                <span className={`shrink-0 ${isSelected ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`}>
                                                    {opt.icon}
                                                </span>
                                            )}
                                            <div className="truncate min-w-0">
                                                <div className="text-xs truncate">{opt.label}</div>
                                                {opt.desc && (
                                                    <div className="text-[10px] text-slate-400 truncate font-normal">{opt.desc}</div>
                                                )}
                                            </div>
                                            {opt.badge && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 shrink-0">
                                                    {opt.badge}
                                                </span>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <Check className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="py-4 text-center text-xs text-slate-400">
                                Sonuç bulunamadı
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
