import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({
    options = [],
    value,
    onChange,
    placeholder = 'Seçiniz...',
    label = null,
    icon: Icon = null,
    className = '',
    error = null,
    allowCustom = false,
    customPlaceholder = 'Özel değer giriniz...',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customValue, setCustomValue] = useState('');
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Smoothly scroll dropdown into view if it opens near the bottom of the viewport
    useEffect(() => {
        if (isOpen && dropdownRef.current) {
            const timer = setTimeout(() => {
                dropdownRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue) => {
        if (optionValue === '__custom__') {
            setIsCustomMode(true);
            setIsOpen(false);
        } else {
            setIsCustomMode(false);
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const handleCustomChange = (e) => {
        const val = e.target.value;
        setCustomValue(val);
        onChange(val);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <div className="h-5 flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                        {Icon && <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        <span className="truncate">{label}</span>
                    </label>
                    {allowCustom && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustomMode(!isCustomMode);
                                if (!isCustomMode) {
                                    setCustomValue(value || '');
                                }
                            }}
                            className="text-[10px] text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold underline cursor-pointer shrink-0 ml-2"
                        >
                            {isCustomMode ? 'Listeden Seç' : 'Özel Yaz'}
                        </button>
                    )}
                </div>
            )}

            {isCustomMode ? (
                <div className="relative">
                    <input
                        type="text"
                        value={customValue || value || ''}
                        onChange={handleCustomChange}
                        placeholder={customPlaceholder}
                        className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border border-blue-500 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                </div>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full h-11 flex items-center justify-between px-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1d29] border ${
                            isOpen 
                                ? 'border-blue-500 ring-2 ring-blue-500/20' 
                                : 'border-slate-200 dark:border-white/[0.08]'
                        } hover:border-slate-300 dark:hover:border-white/20 transition-all text-left cursor-pointer shadow-sm`}
                    >
                        <div className="flex items-center space-x-2 truncate">
                            {selectedOption ? (
                                <>
                                    {selectedOption.dotColor && (
                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedOption.dotColor} shadow-sm`} />
                                    )}
                                    {selectedOption.icon && (
                                        <span className="text-sm leading-none shrink-0">{selectedOption.icon}</span>
                                    )}
                                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {selectedOption.label}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xs font-medium text-slate-400 truncate">
                                    {value || placeholder}
                                </span>
                            )}
                        </div>

                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-white dark:bg-[#161824] border border-slate-200 dark:border-white/[0.1] shadow-2xl overflow-hidden animate-fadeIn max-h-64 overflow-y-auto">
                            <div className="p-1.5 space-y-1">
                                {options.map((option) => {
                                    const isSelected = option.value === value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                                                isSelected
                                                    ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2.5 truncate">
                                                {option.dotColor && (
                                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${option.dotColor}`} />
                                                )}
                                                {option.icon && (
                                                    <span className="text-base leading-none shrink-0">{option.icon}</span>
                                                )}
                                                <div className="truncate">
                                                    <div className="text-xs font-bold leading-tight">
                                                        {option.label}
                                                    </div>
                                                    {option.desc && (
                                                        <div className="text-[10px] font-normal text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                                            {option.desc}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <Check className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
                                            )}
                                        </button>
                                    );
                                })}

                                {allowCustom && (
                                    <button
                                        type="button"
                                        onClick={() => handleSelect('__custom__')}
                                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] text-blue-500 dark:text-blue-400 text-xs font-bold text-left cursor-pointer border-t border-slate-100 dark:border-white/[0.04] mt-1"
                                    >
                                        <span>+ Farklı / Özel Departman Girişi</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {error && (
                <p className="text-[11px] text-red-500 font-semibold mt-1">{error}</p>
            )}
        </div>
    );
}
