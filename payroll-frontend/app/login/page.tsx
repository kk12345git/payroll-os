'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Brain, AlertCircle, Quote } from 'lucide-react';

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
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Panel - Branding & Social Proof */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#020617] relative flex-col justify-between p-12 overflow-hidden items-start">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                <Link href="/" className="flex items-center gap-3 relative z-10 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Brain className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">AutoPay-OS</span>
                </Link>

                <div className="relative z-10 max-w-lg mt-auto mb-20">
                    <h2 className="text-5xl font-bold tracking-tight text-white mb-6 font-display">
                        Run your global autopay-os on autopilot.
                    </h2>
                    <p className="text-slate-400 text-lg mb-12">
                        Join modern teams managing compliance, benefits, and treasury operations in one unified workspace.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <Quote className="w-6 h-6 text-primary mb-4 opacity-50" />
                        <p className="text-slate-300 font-medium leading-relaxed mb-6">
                            "AutoPay-OS replaced our entire finance ops stack. We run autopay-os across 6 countries in under 10 minutes now. It's truly game-changing."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                                J
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm">Jessica Chen</div>
                                <div className="text-slate-500 text-xs">VP Finance, Sequence</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-6 text-sm text-slate-500">
                    <span>© 2026 AutoPay-OS</span>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Brain className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">AutoPay-OS</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
                        <p className="text-slate-500">Sign in to your dashboard to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Work Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Don't have an account? {' '}
                            <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
