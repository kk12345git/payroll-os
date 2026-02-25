'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';

interface TutorialTooltipProps {
    title: string;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    children: React.ReactNode;
}

export const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
    title,
    content,
    placement = 'top',
    children
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const getPlacementClasses = () => {
        switch (placement) {
            case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
            case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-3';
            case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-3';
            case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-3';
            default: return 'bottom-full left-1/2 -translate-x-1/2 mb-3';
        }
    };

    const getArrowClasses = () => {
        switch (placement) {
            case 'top': return 'top-full left-1/2 -translate-x-1/2 border-t-white/90 border-x-transparent border-b-transparent';
            case 'bottom': return 'bottom-full left-1/2 -translate-x-1/2 border-b-white/90 border-x-transparent border-t-transparent';
            case 'left': return 'left-full top-1/2 -translate-y-1/2 border-l-white/90 border-y-transparent border-r-transparent';
            case 'right': return 'right-full top-1/2 -translate-y-1/2 border-r-white/90 border-y-transparent border-l-transparent';
            default: return 'top-full left-1/2 -translate-x-1/2 border-t-white/90 border-x-transparent border-b-transparent';
        }
    };

    return (
        <div className="relative inline-block group">
            {children}

            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                className="absolute -top-1 -right-1 p-0.5 bg-indigo-600 rounded-full text-white hover:scale-110 transition-transform shadow-lg z-20"
            >
                <HelpCircle className="w-3 h-3" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className={`absolute z-50 w-64 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-indigo-100 shadow-2xl ${getPlacementClasses()}`}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-slate-900 text-sm tracking-tight">{title}</h4>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {content}
                        </p>

                        <div className={`absolute w-0 h-0 border-[6px] ${getArrowClasses()}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
