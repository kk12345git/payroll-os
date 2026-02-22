'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, User, Loader2, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';

import HeroBackground from '@/components/ui/HeroBackground';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        companyName: ''
    });
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await register(formData.email, formData.password, formData.fullName, formData.companyName);
            toast.success('Registration successful! Launching setup wizard...');
            router.push('/onboarding');
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Registration failed. Please try again.');
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    rotateX: mousePos.y * -10,
                    rotateY: mousePos.x * 10,
                    transformStyle: "preserve-3d"
                }}
                className="w-full max-w-[500px] z-10 perspective-2000"
            >
                {/* Brand Header */}
                <div
                    style={{ transform: "translateZ(50px)" }}
                    className="text-center mb-10 relative"
                >
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full glass-card-premium border-indigo-200/50"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900 dark:text-indigo-200">Next Gen Payroll</span>
                    </motion.div>

                    <h1 className="text-6xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white leading-tight">
                        Create <span className="text-gradient-extreme italic">Impact.</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg italic tracking-tight">&quot;Precision in every payout, power in every process.&quot;</p>
                </div>

                {/* Hyper-glass Card */}
                <div className="hyper-glass dark:bg-slate-900/60 rounded-[3rem] p-10 relative overflow-hidden border border-slate-200/50 dark:border-white/5 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50/80 dark:bg-red-950/30 backdrop-blur-md border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all"
                                        placeholder="Johnathan Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Business Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all"
                                        placeholder="Acme Solutions"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Work Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all"
                                        placeholder="john@company.io"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="w-full px-6 py-5 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block">Confirm</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full px-6 py-5 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Initialize Account</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-200/50 dark:border-white/5 text-center">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">
                            Existing operator? {' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-400 transition-all ml-2 underline underline-offset-4">
                                Sign in securely
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Dynamic Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ transform: "translateZ(30px)" }}
                    className="mt-8 flex justify-center"
                >
                    <div className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl">
                        Enterprise Secured System
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
