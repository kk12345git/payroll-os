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
            className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-[#020617]"
        >
            <HeroBackground />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                    rotateX: mousePos.y * -5,
                    rotateY: mousePos.x * 5,
                    transformStyle: "preserve-3d"
                }}
                className="w-full max-w-[480px] z-10 perspective-2000"
            >
                {/* Control Artifact Header */}
                <div
                    style={{ transform: "translateZ(80px)" }}
                    className="text-center mb-16 relative flex flex-col items-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-1 mb-10 rounded-3xl bg-gradient-to-br from-primary via-indigo-500 to-pink-500 shadow-[0_0_50px_rgba(124,58,237,0.3)]"
                    >
                        <div className="bg-[#020617] p-6 rounded-[calc(1.5rem-4px)]">
                            <Logo size="xl" />
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-black font-display tracking-tight text-white mb-2 uppercase">Command Center</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.5em] italic">Enterprise Protocol Alpha</p>
                </div>

                {/* The Artifact Card */}
                <div className="hyper-glass rounded-[4rem] p-12 relative overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 block">Identity Signature</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-500">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-20 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-none font-bold text-white transition-all text-lg placeholder:text-slate-700"
                                    placeholder="operator@autopay.ai"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block">Access Encryption</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-500">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-20 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-none font-bold text-white transition-all text-lg placeholder:text-slate-700"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-8 bg-white text-slate-950 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {loading ? (
                                <Loader2 className="w-7 h-7 animate-spin" />
                            ) : (
                                <>
                                    <span>Establish Connection</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 text-center pt-10 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                            Uauthorized Access? {' '}
                            <Link href="/register" className="text-primary hover:text-white transition-all ml-4 underline underline-offset-8">
                                Initialize New Node
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
