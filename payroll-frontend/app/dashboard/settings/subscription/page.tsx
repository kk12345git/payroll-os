'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Zap,
    CheckCircle2,
    Shield,
    Clock,
    AlertCircle,
    ChevronRight,
    Sparkles,
    Gem,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, type Subscription } from '@/lib/api';
import { useToast } from '@/store/toastStore';

const PLANS = [
    {
        id: 'free',
        name: 'Basic / Free',
        price: '0',
        description: 'Perfect for testing and small startups.',
        features: [
            'Up to 10 Employees',
            'Manual Attendance',
            'Basic Payroll Generation',
            'Standard Reports',
            'Community Support'
        ],
        icon: <Zap className="w-5 h-5" />,
        color: 'text-slate-500',
        bgColor: 'bg-slate-500/10'
    },
    {
        id: 'pro',
        name: 'Professional',
        price: '999',
        description: 'Scale your business with advanced tools.',
        features: [
            'Unlimited Employees',
            'Biometric Sync (AI)',
            'Advanced Tax Compliance',
            'Bulk Payroll Processing',
            'Dedicated Account Manager',
            'Custom Export Formats'
        ],
        icon: <Gem className="w-5 h-5" />,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        popular: true
    }
];

export default function SubscriptionPage() {
    const toast = useToast();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [currentPlan, setCurrentPlan] = useState('free');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgrading, setIsUpgrading] = useState(false);

    React.useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const sub = await api.getSubscription();
                setSubscription(sub);
                setCurrentPlan(sub.plan);
            } catch (err) {
                console.error('Failed to fetch subscription:', err);
                toast.error('Could not load subscription details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubscription();
    }, []);

    const handleUpgrade = async (planId: string) => {
        if (planId === currentPlan) return;
        setIsUpgrading(true);
        try {
            const updated = await api.upgradePlan(planId);
            setSubscription(updated);
            setCurrentPlan(updated.plan);
            toast.success(`Succesfully upgraded to ${planId.toUpperCase()}!`);
        } catch (err: any) {
            toast.error(err.message || 'Upgrade failed');
        } finally {
            setIsUpgrading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Subscription <span className="text-primary">Portal</span></h1>
                    <p className="text-muted-foreground font-medium italic">Manage your organization's plan and scaling options.</p>
                </div>

                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Status</p>
                        <p className="text-sm font-black uppercase text-foreground">
                            {currentPlan === 'free' ? 'TRIAL MODE' : 'PRO ACTIVATED'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Plan Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                {PLANS.map((plan) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "card-extreme p-10 relative overflow-hidden flex flex-col transition-all duration-500",
                            currentPlan === plan.id ? "border-primary/40 ring-4 ring-primary/5 bg-primary/[0.02]" : "hover:border-primary/20",
                            plan.popular && "border-indigo-500/30"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-8 right-[-35px] rotate-45 bg-indigo-600 text-white py-2 px-12 text-[10px] font-black tracking-widest uppercase shadow-xl">
                                Recommended
                            </div>
                        )}

                        {currentPlan === plan.id && (
                            <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">Active Plan</span>
                            </div>
                        )}

                        <div className="flex items-center gap-4 mb-8">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", plan.bgColor, plan.color)}>
                                {plan.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">{plan.name}</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{plan.description}</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-foreground tracking-tighter">₹{plan.price}</span>
                                <span className="text-muted-foreground font-bold italic tracking-tight">/ month</span>
                            </div>
                            {plan.id === 'free' ? (
                                <p className="text-xs font-bold text-slate-400 mt-2 italic">No credit card required ever.</p>
                            ) : (
                                <p className="text-xs font-bold text-primary mt-2 flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    Billed monthly. Cancel anytime.
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 mb-12 flex-1">
                            {plan.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-start gap-3 group">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                                        currentPlan === plan.id ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 text-slate-400"
                                    )}>
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {currentPlan !== plan.id ? (
                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isUpgrading}
                                className="btn-extreme w-full py-5 flex items-center justify-center gap-2"
                            >
                                {isUpgrading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        PROCESSING...
                                    </>
                                ) : (
                                    <>
                                        UPGRADE TO {plan.name.split(' ')[0]}
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="w-full py-5 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border border-dashed rounded-2xl">
                                Currently Active
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Billing History & Security */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-extreme p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-lg font-black uppercase tracking-tight">Billing History</h4>
                            <p className="text-xs font-semibold text-muted-foreground">Download your invoices and tax receipts.</p>
                        </div>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { date: 'Feb 18, 2026', amount: '₹0.00', status: 'PAID' },
                        ].map((invoice, iIdx) => (
                            <div key={iIdx} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground uppercase tracking-tight">{invoice.date}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{invoice.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-foreground">{invoice.amount}</p>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">PDF</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-extreme p-8 bg-indigo-600 text-white relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                    <Sparkles className="w-10 h-10 mb-6 text-indigo-200" />
                    <h4 className="text-xl font-black leading-tight mb-4 uppercase tracking-tight">Enterprise Scaling?</h4>
                    <p className="text-indigo-100 text-sm font-medium mb-8">
                        Need more than 5,000 employees or custom ERP integration? Our enterprise team can build a tailor-made solution.
                    </p>
                    <button className="w-full py-4 bg-white text-indigo-700 font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">
                        CONTACT SALES
                    </button>
                </div>
            </div>

            {/* Security Alerts */}
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                    <h5 className="text-sm font-black text-amber-900 uppercase tracking-tight">Trial Expiry Notice</h5>
                    <p className="text-xs font-semibold text-amber-700">
                        Your free trial of features like **AI Biometrics** will expire in 14 days. Upgrade to Pro to keep your advanced workflows running without interruption.
                    </p>
                </div>
            </div>
        </div>
    );
}
