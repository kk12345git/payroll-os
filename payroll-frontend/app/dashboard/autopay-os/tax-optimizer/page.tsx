'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calculator,
    ArrowRight,
    Zap,
    TrendingDown,
    CheckCircle2,
    AlertCircle,
    PieChart,
    Coins,
    Sparkles,
    Brain
} from 'lucide-react';
import { api, type TaxOptimizationResponse } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';

export default function TaxOptimizerPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TaxOptimizationResponse | null>(null);
    const [regime, setRegime] = useState<'old' | 'new'>('new');

    const fetchAnalysis = async (currentRegime: 'old' | 'new') => {
        setLoading(true);
        try {
            const result = await api.analyzeTax(currentRegime);
            setData(result);
        } catch (err: any) {
            toast.error(err.message || 'Failed to analyze tax');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis(regime);
    }, [regime]);

    if (loading && !data) return <LoadingOverlay />;
    if (!data) return null;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                        <Brain className="w-10 h-10 text-indigo-600" />
                        AI Tax Optimizer
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Analyze your salary structure and discover AI-driven strategies to save tax.
                    </p>
                </div>

                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                    <button
                        onClick={() => setRegime('new')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            regime === 'new' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        New Regime
                    </button>
                    <button
                        onClick={() => setRegime('old')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                            regime === 'old' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        Old Regime
                    </button>
                </div>
            </div>

            {/* Main Analysis Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Result Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme p-8 bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-indigo-200">Optimization Result</h2>
                                <div className="text-3xl font-black tracking-tight">
                                    {data.potential_annual_savings > 0
                                        ? `Save ₹${data.potential_annual_savings.toLocaleString()}/yr`
                                        : "You are fully optimized! 🎉"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">Current Tax</div>
                                <div className="text-2xl font-black">₹{data.current_tax.toLocaleString()}</div>
                            </div>
                            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
                                <div className="text-xs font-bold uppercase tracking-wider text-green-300 mb-1">Optimized Tax</div>
                                <div className="text-2xl font-black text-green-400">₹{data.optimized_tax.toLocaleString()}</div>
                            </div>
                        </div>

                        {data.recommended_regime !== regime && (
                            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-amber-200 text-sm mb-1">Recommendation: Switch Regime</h3>
                                    <p className="text-xs text-amber-100/80 leading-relaxed">
                                        Our AI calculates that switching to the <span className="font-black uppercase">{data.recommended_regime} Regime</span> could save you massive amounts if you maximize your deductions.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Simulation Chart/Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme p-8"
                >
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-indigo-600" />
                        Regime Comparison
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-slate-700">
                                <span>Old Regime (Max Deductions)</span>
                                <span>₹{data.simulations.old_regime_max_deductions.toLocaleString()}</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${(data.simulations.old_regime_max_deductions / Math.max(data.simulations.old_regime_max_deductions, data.simulations.new_regime_standard)) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold text-slate-700">
                                <span>New Regime (Standard)</span>
                                <span>₹{data.simulations.new_regime_standard.toLocaleString()}</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full"
                                    style={{ width: `${(data.simulations.new_regime_standard / Math.max(data.simulations.old_regime_max_deductions, data.simulations.new_regime_standard)) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-dashed border-slate-200">
                            <p className="text-xs text-slate-400 italic">
                                * The Old Regime simulation assumes you fully utilize Section 80C (₹1.5L), 80D (₹25k), and have HRA exemption. The New Regime assumes standard deduction only.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Actionable Suggestions */}
            <div>
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    AI Suggestions to Reduce Tax
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.suggestions.length === 0 ? (
                        <div className="col-span-3 p-12 text-center card-extreme border-dashed border-2 border-slate-200 bg-slate-50/50">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900">No further optimizations found</h3>
                            <p className="text-slate-500">You are already in the most optimal tax position given typical deductions!</p>
                        </div>
                    ) : (
                        data.suggestions.map((suggestion, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="card-extreme group hover:border-indigo-500/30 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Coins className="w-6 h-6" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                                        Save ₹{suggestion.potential_saving.toLocaleString()}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{suggestion.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                    {suggestion.description}
                                </p>
                                <button className="w-full py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                                    View Details <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
