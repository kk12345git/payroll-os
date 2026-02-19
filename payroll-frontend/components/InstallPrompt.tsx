'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Globe, Monitor } from 'lucide-react';
import { toast } from 'sonner';


export default function InstallPrompt() {
    const [isVisible, setIsVisible] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | null>(null);

    useEffect(() => {
        // Simple logic to detect if already installed or on which platform
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        } else {
            setPlatform('desktop');
        }

        // Delay show
        const timer = setTimeout(() => setIsVisible(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[9999]"
            >
                <div className="card-extreme p-6 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -mr-16 -mt-16" />

                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Download className="w-7 h-7" />
                        </div>
                        <div className="space-y-1 pr-6">
                            <h3 className="text-xl font-black tracking-tight leading-none">Install AutoPay-OS</h3>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                Get a faster, dedicated experience by adding this to your {platform === 'desktop' ? 'computer' : 'home screen'}.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                        {platform === 'ios' ? (
                            <div className="flex items-center gap-3 text-xs font-bold text-indigo-400">
                                <span className="p-1 px-2 bg-white/10 rounded-md">Tap 📤</span>
                                <span>then select "Add to Home Screen"</span>
                            </div>
                        ) : platform === 'android' ? (
                            <div className="flex items-center gap-3 text-xs font-bold text-indigo-400">
                                <span className="p-1 px-2 bg-white/10 rounded-md">Tap ⋮</span>
                                <span>then select "Install app"</span>
                            </div>
                        ) : (
                            <button
                                className="w-full py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                                onClick={() => {
                                    // PWA Install prompt logic would go here
                                    toast.info("Click the install icon in your browser address bar.");
                                }}
                            >
                                <Monitor className="w-4 h-4" /> Install Desktop App
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
