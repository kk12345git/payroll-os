import { motion } from 'framer-motion';
import Logo from './Logo';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

export default function LoadingSpinner({ size = 'md', color = 'indigo' }: LoadingSpinnerProps) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-16 h-16',
    };

    return (
        <div className="relative flex items-center justify-center">
            <motion.div
                className={`${sizes[size]} border-4 border-slate-100 border-t-indigo-600 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {size === 'lg' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Logo showText={false} size="sm" className="opacity-80" />
                </div>
            )}
        </div>
    );
}

export function LoadingOverlay({ message = "Preparing your dashboard..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="relative">
                    <motion.div
                        className="w-32 h-32 rounded-full bg-indigo-500/10 absolute -inset-4 blur-2xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Logo size="xl" showText={false} className="relative z-10" />
                </div>

                <div className="space-y-2">
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
                    >
                        Payroll OS
                    </motion.h3>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-indigo-600"
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                        <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">{message}</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />
    );
}

export function SkeletonCard() {
    return (
        <div className="card-extreme">
            <div className="flex items-start gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="card-extreme">
            <div className="space-y-4">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
