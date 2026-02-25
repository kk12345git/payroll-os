'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';

export default function OfflineStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [showReconnect, setShowReconnect] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowReconnect(true);
            setTimeout(() => setShowReconnect(false), 5000);
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[10000] p-4 flex justify-center pointer-events-none"
                >
                    <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] pointer-events-auto border-2 border-white/20 backdrop-blur-xl">
                        <WifiOff className="w-4 h-4 animate-pulse" />
                        You are currently offline. Check your connection.
                    </div>
                </motion.div>
            )}

            {isOnline && showReconnect && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[10000] p-4 flex justify-center pointer-events-none"
                >
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] pointer-events-auto border-2 border-white/20 backdrop-blur-xl">
                        <Wifi className="w-4 h-4" />
                        Connection Restored! Syncing data...
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
