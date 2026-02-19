'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Loader2, IndianRupee, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
            {/* Extreme Animated Mesh Background */}
            <div className="mesh-bg" />

            {/* Decorative Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.3, 0.45, 0.3],
                    x: [0, -60, 0],
                    y: [0, 40, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.2, 0.35, 0.2],
                    x: [0, 70, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[20%] left-[15%] w-[30vw] h-[30vw] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-[460px] z-10"
            >
                {/* Brand Identity */}
                <div className="text-center mb-12 relative flex flex-col items-center">
                    <Logo size="xl" className="mb-4" />
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em] opacity-60">Enterprise OS Control Center</p>
                </div>

                {/* Login Card */}
                <div className="hyper-glass rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-7">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50/80 backdrop-blur-md border border-red-100 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Operator Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-extreme"
                                    placeholder="admin@payroll.pro"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Secret Key</label>
                                <Link href="#" className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors">
                                    Recover
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-extreme"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-extreme w-full group py-4 h-16 flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <div className="flex items-center justify-center gap-3 text-lg">
                                    <span>Access Dashboard</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-8 border-t border-slate-200/50">
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">
                            New Operator? {' '}
                            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 transition-all font-black hover:tracking-wider">
                                Initialize System
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-12 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 cursor-default">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">GDPR Ready</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
