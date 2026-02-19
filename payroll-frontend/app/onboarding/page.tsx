'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Globe,
    CheckCircle2,
    Users,
    Rocket,
    ArrowRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const STEPS = [
    { id: 1, title: 'Company Details', icon: Building2 },
    { id: 2, title: 'Regional Standards', icon: Globe },
    { id: 3, title: 'Finalize Setup', icon: Rocket }
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
    const router = useRouter();

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
        } catch (err) {
            toast.error("Setup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="max-w-2xl w-full">
                {/* Stepper */}
                <div className="flex justify-between mb-12 px-6">
                    {STEPS.map((s, idx) => (
                        <div key={s.id} className="flex items-center gap-4 relative">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white text-slate-300'}`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <div className="hidden md:block">
                                <div className={`text-[10px] uppercase font-black tracking-widest ${step >= s.id ? 'text-indigo-600' : 'text-slate-400'}`}>Step {s.id}</div>
                                <div className={`font-bold text-sm ${step >= s.id ? 'text-slate-900' : 'text-slate-300'}`}>{s.title}</div>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className={`hidden lg:block w-12 h-0.5 ml-4 ${step > s.id ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <motion.div
                    layout
                    className="card-extreme bg-white p-10 border-none shadow-2xl shadow-slate-200"
                >
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tell us about your organization.</h2>
                                <p className="text-slate-500 font-medium italic">This will appear on your payslips and reports.</p>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold"
                                        placeholder="e.g. Antigravity Global"
                                        value={data.name}
                                        onChange={e => setData({ ...data, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Headquarters Address</label>
                                    <textarea
                                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold h-32"
                                        placeholder="Enter full address..."
                                        value={data.address}
                                        onChange={e => setData({ ...data, address: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Where is your primary focus?</h2>
                                <p className="text-slate-500 font-medium italic">We'll inject local tax and currency standards based on this.</p>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { n: 'India', c: 'INR', s: '₹' },
                                        { n: 'United States', c: 'USD', s: '$' },
                                        { n: 'UAE', c: 'AED', s: 'د.إ' },
                                        { n: 'United Kingdom', c: 'GBP', s: '£' }
                                    ].map(item => (
                                        <div
                                            key={item.n}
                                            onClick={() => setData({ ...data, country: item.n, base_currency: item.c })}
                                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between group ${data.country === item.n ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                        >
                                            <div>
                                                <div className="text-xl font-black text-slate-900">{item.n}</div>
                                                <div className="text-xs font-black text-slate-400">{item.c}</div>
                                            </div>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black ${data.country === item.n ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                                                {item.s}
                                            </div>
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
                                className="text-center space-y-8"
                            >
                                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-green-100 animate-bounce">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ready for takeoff!</h2>
                                    <p className="text-slate-500 font-medium mt-2">
                                        You are launching <b>{data.name}</b> in <b>{data.country}</b>.
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-900 rounded-[2rem] text-white text-left flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dynamic Standards Linked</div>
                                        <div className="text-lg font-bold">{data.base_currency} Automated Compliance</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className={`flex items-center gap-2 px-6 py-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={step === 1 && !data.name}
                                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-600/25 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                                Launch Workspace
                            </button>
                        )}
                    </div>
                </motion.div>

                <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                    Antigravity Global SaaS Engine v2.4 • Trusted by enterprises worldwide
                </p>
            </div>
        </div>
    );
}
