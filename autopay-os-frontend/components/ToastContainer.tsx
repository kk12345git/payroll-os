"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, type Toast } from '@/store/toastStore';

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
    const iconClass = "w-5 h-5";

    switch (type) {
        case 'success':
            return <CheckCircle2 className={iconClass} />;
        case 'error':
            return <XCircle className={iconClass} />;
        case 'warning':
            return <AlertTriangle className={iconClass} />;
        case 'info':
            return <Info className={iconClass} />;
    }
};

const ToastItem = ({ toast }: { toast: Toast }) => {
    const { removeToast } = useToastStore();
    const [progress, setProgress] = useState(100);

    const duration = toast.duration || 5000;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - (100 / (duration / 100))));
        }, 100);

        return () => clearInterval(interval);
    }, [duration]);

    const colors = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-900',
            icon: 'text-green-600',
            progress: 'bg-green-500',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-900',
            icon: 'text-red-600',
            progress: 'bg-red-500',
        },
        warning: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            text: 'text-orange-900',
            icon: 'text-orange-600',
            progress: 'bg-orange-500',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-900',
            icon: 'text-blue-600',
            progress: 'bg-blue-500',
        },
    };

    const style = colors[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={`${style.bg} ${style.border} border-2 rounded-xl shadow-lg overflow-hidden max-w-md w-full`}
        >
            <div className="p-4 flex items-start gap-3">
                <div className={style.icon}>
                    <ToastIcon type={toast.type} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className={`${style.text} font-semibold text-sm`}>{toast.message}</p>
                </div>

                <button
                    onClick={() => removeToast(toast.id)}
                    className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-black/5">
                <motion.div
                    className={`h-full ${style.progress}`}
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>
        </motion.div>
    );
};

export default function ToastContainer() {
    const { toasts } = useToastStore();

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <div key={toast.id} className="mb-3">
                            <ToastItem toast={toast} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
