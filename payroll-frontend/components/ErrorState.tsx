"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHomeLink?: boolean;
}

export default function ErrorState({
    title = "Something went wrong",
    message = "We encountered an error. Please try again.",
    onRetry,
    showHomeLink = true,
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[400px]"
        >
            <div className="text-center max-w-md mx-auto p-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-3">{title}</h2>
                <p className="text-slate-600 mb-6">{message}</p>

                <div className="flex gap-3 justify-center">
                    {onRetry && (
                        <button onClick={onRetry} className="btn-extreme">
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Try Again
                        </button>
                    )}

                    {showHomeLink && (
                        <Link href="/dashboard">
                            <button className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
