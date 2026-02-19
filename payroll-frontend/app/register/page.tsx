'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, Loader2, ShieldCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        companyName: '' // SaaS support
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
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
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[15%] left-[10%] w-[30vw] h-[30vw] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, 60, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-violet-500/10 blur-[130px] rounded-full pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-[500px] z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10 relative">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/50 shadow-sm"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-900">Next Gen Payroll</span>
                    </motion.div>

                    <h1 className="text-5xl font-black tracking-tight mb-3 text-slate-900 leading-tight">
                        Create <span className="shimmer-text">Impact.</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg italic">"Precision in every payout, power in every process."</p>
                </div>

                {/* Hyper-glass Card */}
                <div className="hyper-glass rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                    {/* Subtle top light effect */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50/80 backdrop-blur-md border border-red-100 text-red-700 px-5 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-3"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                        className="input-extreme"
                                        placeholder="Johnathan Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Business Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                        className="input-extreme"
                                        placeholder="Acme Solutions"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Work Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="input-extreme"
                                        placeholder="john@company.io"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="input-extreme"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Confirm</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 w-14 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-slate-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className="input-extreme"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-extreme w-full mt-4 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Initialize Account</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-200/50 text-center">
                        <p className="text-sm text-slate-500 font-bold">
                            Existing operator? {' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 transition-all hover:tracking-wide">
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
                    className="mt-8 flex justify-center"
                >
                    <div className="px-5 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20">
                        Enterprise Secured System
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
