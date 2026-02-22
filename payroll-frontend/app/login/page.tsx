'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

import HeroBackground from '@/components/ui/HeroBackground';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        setMousePos({
            x: (clientX / innerWidth - 0.5) * 2,
            y: (clientY / innerHeight - 0.5) * 2
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-white dark:bg-[#020617]"
        >
            <HeroBackground />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    rotateX: mousePos.y * -10,
                    rotateY: mousePos.x * 10,
                    transformStyle: "preserve-3d"
                }}
                className="w-full max-w-[460px] z-10 perspective-2000"
            >
                {/* Brand Identity */}
                <div
                    style={{ transform: "translateZ(50px)" }}
                    className="text-center mb-12 relative flex flex-col items-center"
                >
                    <Logo size="xl" className="mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Enterprise OS Control Center</p>
                </div>

                {/* Login Card */}
                <div className="hyper-glass dark:bg-slate-900/60 rounded-[3rem] p-12 relative overflow-hidden border border-slate-200/50 dark:border-white/5 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50/80 dark:bg-red-950/30 backdrop-blur-md border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Operator Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-16 pr-6 py-5 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all"
                                    placeholder="admin@payroll.pro"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Secret Key</label>
                                <Link href="#" className="text-[10px] font-black text-indigo-600 hover:text-indigo-400 uppercase tracking-widest transition-colors">
                                    Recover
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-16 pr-6 py-5 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/10"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center pt-10 border-t border-slate-200/50 dark:border-white/5">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">
                            New Operator? {' '}
                            <Link href="/register" className="text-indigo-600 hover:text-indigo-400 transition-all ml-2 underline underline-offset-4">
                                Initialize System
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Badge */}
                <div
                    style={{ transform: "translateZ(30px)" }}
                    className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 cursor-default"
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">ISO 27001</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300 dark:bg-white/20" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">GDPR Ready</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
