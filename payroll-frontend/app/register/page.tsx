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
            setError('System mismatch: Encryption keys (passwords) do not match');
            return;
        }

        setLoading(true);

        try {
            await register(formData.email, formData.password, formData.fullName, formData.companyName);
            toast.success('Registration successful! Launching setup wizard...');
            router.push('/onboarding');
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Initialization failed. Please try again.');
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                style={{
                    rotateX: mousePos.y * -5,
                    rotateY: mousePos.x * 5,
                    transformStyle: "preserve-3d"
                }}
                className="w-full max-w-[540px] z-10 perspective-2000 py-12"
            >
                {/* Protocol Header */}
                <div
                    style={{ transform: "translateZ(80px)" }}
                    className="text-center mb-16 relative flex flex-col items-center"
                >
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="inline-flex items-center gap-3 mb-10 px-6 py-2 rounded-full hyper-glass border-primary/20 bg-primary/5"
                    >
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Genesis Protocol V2</span>
                    </motion.div>

                    <h1 className="text-5xl font-black font-display tracking-tight text-white mb-4 uppercase">Initialize <span className="text-primary italic">Node.</span></h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.5em] italic">Establish Global Enterprise Core</p>
                </div>

                {/* Registration Artifact */}
                <div className="hyper-glass rounded-[4rem] p-12 relative overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 justify-center"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 block">Operator Identity</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-500">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                        className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-none font-bold text-white transition-all text-base placeholder:text-slate-700"
                                        placeholder="Command Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 block">Entity ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-500">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                        className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-none font-bold text-white transition-all text-base placeholder:text-slate-700"
                                        placeholder="Business Name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 block">Communication Link</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-500">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full pl-20 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-none font-bold text-white transition-all text-lg placeholder:text-slate-700"
                                    placeholder="operator@autopay.ai"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 block">New Encryption</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-none font-bold text-white transition-all text-base placeholder:text-slate-700"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 block">Verify Code</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-primary/20 outline-none font-bold text-white transition-all text-base placeholder:text-slate-700"
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
                                    <span>Establish Identity</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 text-center pt-10 border-t border-white/5">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                            Existing Operator? {' '}
                            <Link href="/login" className="text-primary hover:text-white transition-all ml-4 underline underline-offset-8">
                                Sign In Securely
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    style={{ transform: "translateZ(30px)" }}
                    className="mt-12 flex justify-center"
                >
                    <div className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl backdrop-blur-md">
                        <span className="text-primary mr-3">●</span> High Security Protocol Active
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
