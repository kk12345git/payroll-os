'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Zap,
    ShieldCheck,
    CheckCircle2,
    AlertTriangle,
    Clock,
    ArrowUpRight,
    Loader2,
    Gem
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function BillingPage() {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<any>(null);
    const [upgrading, setUpgrading] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await api.getBillingStatus();
                setStatus(data);
            } catch (err) {
                console.error("Failed to fetch billing status", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, []);

    const handleUpgrade = async (plan: string) => {
        setUpgrading(plan);
        try {
            const { url } = await api.createCheckoutSession(plan);
            // In real app, redirect to Stripe
            // window.location.href = url;

            // For Demo/Mock:
            toast.success("Connecting to Stripe Secure Checkout...");
            setTimeout(() => {
                window.location.href = url;
            }, 1000);
        } catch (err: any) {
            toast.error(err.message || "Failed to initiate payment");
        } finally {
            setUpgrading(null);
        }
    };

    if (loading) return (
        <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="max-w-[1000px] mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                    <CreditCard className="w-10 h-10 text-indigo-600" />
                    Billing & Subscriptions
                </h1>
                <p className="text-slate-500 font-medium">
                    Manage your global SaaS subscription and payment methods.
                </p>
            </div>

            {/* Current Status Card */}
            <div className="card-extreme bg-slate-900 text-white p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">
                            Current Plan
                        </div>
                        <h2 className="text-5xl font-black flex items-center gap-4">
                            {status?.plan?.toUpperCase()}
                            {status?.plan === 'FREE' && <span className="text-sm font-medium text-slate-400">(TRIAL)</span>}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 font-medium italic">
                            <Clock className="w-4 h-4" />
                            Next billing cycle: {status?.expiry ? new Date(status.expiry).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Usage Credits</div>
                        <div className="text-2xl font-black">UNLIMITED</div>
                        <div className="w-40 h-1.5 bg-white/10 rounded-full mt-4">
                            <div className="w-full h-full bg-indigo-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pro Tier */}
                <div className={`card-extreme p-8 bg-white border-2 ${status?.plan === 'PRO' ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Zap className="w-7 h-7" />
                        </div>
                        {status?.plan === 'PRO' && (
                            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Active
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Pro Plan</h3>
                    <div className="text-4xl font-black mb-6">$49<span className="text-sm text-slate-400 font-bold">/mo</span></div>

                    <ul className="space-y-4 mb-10">
                        {['AI Admin Copilot', 'Earned Wage Access', 'WhatsApp Integration', 'Compliance PDFs'].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500" /> {f}
                            </li>
                        ))}
                    </ul>

                    {status?.plan !== 'PRO' ? (
                        <button
                            disabled={upgrading === 'PRO'}
                            onClick={() => handleUpgrade('PRO')}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                        >
                            {upgrading === 'PRO' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
                            Upgrade to Pro
                        </button>
                    ) : (
                        <button className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest cursor-not-allowed">
                            Current Plan
                        </button>
                    )}
                </div>

                {/* Enterprise Tier */}
                <div className={`card-extreme p-8 bg-white border-2 ${status?.plan === 'ENTERPRISE' ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Gem className="w-7 h-7" />
                        </div>
                        {status?.plan === 'ENTERPRISE' && (
                            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Active
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Enterprise</h3>
                    <div className="text-4xl font-black mb-6">$199<span className="text-sm text-slate-400 font-bold">/mo</span></div>

                    <ul className="space-y-4 mb-10">
                        {['Custom API Access', 'SLA Guarantees', 'Dedicated Account Manager', 'Multi-Office Control'].map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-amber-500" /> {f}
                            </li>
                        ))}
                    </ul>

                    {status?.plan !== 'ENTERPRISE' ? (
                        <button
                            disabled={upgrading === 'ENTERPRISE'}
                            onClick={() => handleUpgrade('ENTERPRISE')}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                        >
                            {upgrading === 'ENTERPRISE' ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowUpRight className="w-5 h-5" />}
                            Enterprise Access
                        </button>
                    ) : (
                        <button className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest cursor-not-allowed">
                            Current Plan
                        </button>
                    )}
                </div>
            </div>

            {/* Warning / Notes */}
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                    <h4 className="font-black text-amber-900 mb-1 leading-none pt-1">Automatic Renewals</h4>
                    <p className="text-sm font-medium text-amber-700 leading-relaxed">
                        Subscriptions are billed automatically and appear on your card statement as <b>ANTIGRAVITY AI</b>. You can cancel at any time under the management settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
