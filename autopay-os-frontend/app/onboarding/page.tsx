'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Globe,
    CheckCircle2,
    Rocket,
    ArrowRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

import HeroBackground from '@/components/ui/HeroBackground';

const STEPS = [
    { id: 1, title: 'Identity', icon: Building2 },
    { id: 2, title: 'Context', icon: Globe },
    { id: 3, title: 'Launch', icon: Rocket }
];

export default function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: '',
        country: 'India',
        base_currency: 'INR',
        address: ''
    });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const router = useRouter();

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        setMousePos({
            x: (clientX / innerWidth - 0.5) * 2,
            y: (clientY / innerHeight - 0.5) * 2
        });
    };

    const handleNext = () => step < 3 && setStep(step + 1);
    const handleBack = () => step > 1 && setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.updateCompanySettings({
                country: data.country,
                base_currency: data.base_currency
            });
            toast.success("Welcome aboard! Your workspace is ready.");
            router.push('/dashboard');
        } catch {
            toast.error("Setup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-white dark:bg-[#020617] perspective-2000"
        >
            <HeroBackground />

            <div className="max-w-3xl w-full z-10">
                {/* Stepper */}
                <div className="flex justify-between mb-16 px-6 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-white/5 -translate-y-1/2 -z-10" />
                    {STEPS.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-4 relative">
                            <motion.div
                                animate={{
                                    scale: step === s.id ? 1.2 : 1,
                                    backgroundColor: step >= s.id ? '#4f46e5' : '#f8fafc',
                                    color: step >= s.id ? '#ffffff' : '#94a3b8'
                                }}
                                className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl transition-all border-4 border-white dark:border-slate-900 group cursor-pointer`}
                                onClick={() => step > s.id && setStep(s.id)}
                            >
                                <s.icon className="w-7 h-7" />
                            </motion.div>
                            <div className="text-center absolute -bottom-10 w-32">
                                <div className={`text-[10px] uppercase font-black tracking-[0.2em] ${step >= s.id ? 'text-indigo-600' : 'text-slate-400'}`}>{s.title}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <motion.div
                    layout
                    style={{
                        rotateX: mousePos.y * -5,
                        rotateY: mousePos.x * 5,
                        transformStyle: "preserve-3d"
                    }}
                    className="hyper-glass dark:bg-slate-900/60 p-12 rounded-[3.5rem] border border-slate-200/50 dark:border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div style={{ transform: "translateZ(40px)" }}>
                                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                        The <span className="text-gradient-extreme italic">Blueprint.</span>
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 text-lg italic tracking-tight">Identity defines structure. Tell us about your org.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Company Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-6 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all text-xl"
                                            placeholder="e.g. AutoPay Global"
                                            value={data.name}
                                            onChange={e => setData({ ...data, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Headquarters Address</label>
                                        <textarea
                                            className="w-full p-6 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 dark:text-white transition-all h-32 text-lg resize-none"
                                            placeholder="Enter full address..."
                                            value={data.address}
                                            onChange={e => setData({ ...data, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div style={{ transform: "translateZ(40px)" }}>
                                    <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                        Market <span className="text-gradient-extreme italic">Context.</span>
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 text-lg italic tracking-tight">Compliance is local. Standards are global.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { n: 'India', c: 'INR', s: '₹' },
                                        { n: 'United States', c: 'USD', s: '$' },
                                        { n: 'UAE', c: 'AED', s: 'د.إ' },
                                        { n: 'United Kingdom', c: 'GBP', s: '£' }
                                    ].map(item => (
                                        <div
                                            key={item.n}
                                            onClick={() => setData({ ...data, country: item.n, base_currency: item.c })}
                                            className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden ${data.country === item.n ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 dark:bg-white/5'}`}
                                        >
                                            <div className="z-10">
                                                <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{item.n}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.c}</div>
                                            </div>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black z-10 transition-all ${data.country === item.n ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                                {item.s}
                                            </div>
                                            {data.country === item.n && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center space-y-10 py-6"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 bg-indigo-600/10 text-indigo-600 rounded-[3rem] flex items-center justify-center mx-auto border-2 border-indigo-600/20 relative"
                                >
                                    <CheckCircle2 className="w-16 h-16" />
                                    <div className="absolute inset-[-10%] border-2 border-indigo-600/20 rounded-[3.5rem] animate-pulse" />
                                </motion.div>

                                <div>
                                    <h2 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Ready for <span className="text-gradient-extreme italic">Takeoff.</span></h2>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 text-xl tracking-tight">
                                        Workspace initialization for <b>{data.name}</b>.
                                    </p>
                                </div>

                                <div className="p-10 bg-slate-900 dark:bg-slate-800 rounded-[3rem] text-white text-left flex items-center gap-6 border border-white/5 shadow-2xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400 z-10">
                                        <Globe className="w-8 h-8" />
                                    </div>
                                    <div className="z-10">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">System Environment</div>
                                        <div className="text-2xl font-black tracking-tight">{data.base_currency} Automated Compliance</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-16 flex items-center justify-between pt-10 border-t border-slate-200/50 dark:border-white/5">
                        <button
                            onClick={handleBack}
                            className={`flex items-center gap-3 px-8 py-4 font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={step === 1 && !data.name}
                                className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:scale-110 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-16 py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4 hover:scale-110 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                                Launch Workspace
                            </button>
                        )}
                    </div>
                </motion.div>

                <p className="mt-12 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic opacity-50">
                    AutoPay-OS Global SaaS Engine v2.4 • Integrated 3D Core
                </p>
            </div>
        </div>
    );
}
