'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, User, Lock, Loader2, ArrowRight, Brain, AlertCircle, Quote, Building2, CheckCircle2 } from 'lucide-react';

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
            toast.success('Registration successful! Setting up your workspace...');
            router.push('/onboarding');
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Panel - Branding & Social Proof */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#020617] relative flex-col justify-between p-12 overflow-hidden items-start">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                <Link href="/" className="flex items-center gap-3 relative z-10 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Brain className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">AutoPay-OS</span>
                </Link>

                <div className="relative z-10 max-w-lg mt-auto mb-20">
                    <h2 className="text-4xl font-bold tracking-tight text-white mb-8 font-display">
                        Start building your modern workforce.
                    </h2>

                    <div className="space-y-6 mb-12">
                        {[
                            "Automated multi-currency payouts",
                            "Hyper-precise anomaly detection",
                            "Continuous compliance updates",
                            "World-class employee portals"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                <span className="text-slate-300 font-medium text-lg">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <Quote className="w-6 h-6 text-primary mb-4 opacity-50" />
                        <p className="text-slate-300 font-medium leading-relaxed mb-6">
                            "Setting up AutoPay-OS was unbelievably fast. We onboarded our entire engineering team and ran our first autopay-os cycle in under 48 hours."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold">
                                D
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm">David Miller</div>
                                <div className="text-slate-500 text-xs">CEO, TechScale</div>
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

            {/* Right Panel - Register Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative bg-white overflow-y-auto">
                <div className="w-full max-w-lg py-10">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Brain className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">AutoPay-OS</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create your account</h1>
                        <p className="text-slate-500">Free 14-day trial. No credit card required.</p>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Company Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Work Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                    placeholder="jane@acme.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <p className="text-sm text-slate-500 mb-6">
                                By creating an account, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Create account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-8">
                        <p className="text-sm text-slate-500 font-medium">
                            Already have an account? {' '}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
