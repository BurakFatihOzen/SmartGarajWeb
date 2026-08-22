import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
    options = [], // [{ value: '...', label: '...', icon?: ReactNode, badge?: string, color?: string }]
    value, 
    onChange, 
    placeholder = "Seçiniz...",
    className = "",
    dropdownWidth = "w-full"
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(o => String(o.value) === String(value));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border ${
                    isOpen 
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-[#1a1d29]' 
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                } transition-all text-left cursor-pointer group shadow-xs`}
            >
                <div className="flex items-center space-x-2 truncate">
                    {selectedOption?.icon && (
                        <span className="shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                            {selectedOption.icon}
                        </span>
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    {selectedOption?.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                            {selectedOption.badge}
                        </span>
                    )}
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-1.5 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute left-0 top-full mt-1.5 z-50 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-1.5 space-y-0.5 ${dropdownWidth}`}>
                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                        {options.map(opt => {
                            const isSelected = String(opt.value) === String(value);
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
                                        isSelected 
                                            ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-300 font-extrabold' 
                                            : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-300 font-medium'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2 truncate">
                                        {opt.icon && (
                                            <span className={`shrink-0 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                                                {opt.icon}
                                            </span>
                                        )}
                                        <span className="text-xs truncate">{opt.label}</span>
                                        {opt.badge && (
                                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                                                {opt.badge}
                                            </span>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 ml-2" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
