'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import {
    TrendingUp,
    AlertCircle,
    DollarSign,
    Calendar,
    Info,
    ArrowUpRight,
    Zap,
    History,
    Target
} from 'lucide-react';
import { api, type ForecastData } from '@/lib/api';
import { LoadingOverlay } from '@/components/Loading';
import { toast } from 'sonner';

export default function ForecastPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ForecastData | null>(null);

    const fetchForecast = async () => {
        setLoading(true);
        try {
            const result = await api.getForecast();
            setData(result);
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch forecast");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForecast();
    }, []);

    if (loading && !data) return <LoadingOverlay />;
    if (!data) return null;

    // Prepare chart data
    const chartData = [
        ...data.historical.map(h => ({
            name: `${h.month}/${h.year}`,
            amount: h.amount,
            type: 'Historical'
        })),
        ...data.projections.map(p => ({
            name: `${p.month}/${p.year}`,
            amount: p.amount,
            type: 'Projected',
            confidence: Math.round(p.confidence * 100)
        }))
    ];

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                    <TrendingUp className="w-10 h-10 text-indigo-600" />
                    Predictive Cash Flow
                </h1>
                <p className="text-slate-500 font-medium">
                    AI-driven projection of your company's autopay-os liability for the next 6 months.
                </p>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-extreme p-6 bg-white border-2 hover:border-indigo-500/20 transition-all"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                            <History className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Avg Monthly Liability</h3>
                    </div>
                    <div className="text-3xl font-black text-slate-900">₹{data.metrics.avg_monthly_liability.toLocaleString()}</div>
                    <div className="mt-2 text-xs font-bold text-slate-400">Based on last 6 months</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme p-6 bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-white/10 text-white">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-indigo-100 text-sm uppercase tracking-wider">Projected 6M Total</h3>
                    </div>
                    <div className="text-3xl font-black">₹{data.metrics.projected_6m_total.toLocaleString()}</div>
                    <div className="mt-2 text-xs font-bold text-indigo-200/80 italic">Includes hiring velocity factor</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme p-6 bg-slate-900 text-white"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-white/10 text-white">
                            <Zap className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider">AI Growth Model</h3>
                    </div>
                    <div className="text-3xl font-black">{data.metrics.growth_projection_applied}</div>
                    <div className="mt-2 text-xs font-bold text-slate-500">Auto-tuned based on trends</div>
                </motion.div>
            </div>

            {/* Main Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-extreme p-8 h-[500px] flex flex-col bg-white border-2"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        Financial Projection <span className="text-sm font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase ml-3">AI Vision</span>
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-300" />
                            <span className="text-xs font-bold text-slate-500">Historical</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-600" />
                            <span className="text-xs font-bold text-slate-500">Projected</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                                formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, 'Liability']}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#4f46e5"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorAmt)"
                                dot={(props: any) => {
                                    const { cx, cy, payload } = props;
                                    if (payload.type === 'Projected') {
                                        return <circle cx={cx} cy={cy} r={4} fill="#4f46e5" stroke="#fff" strokeWidth={2} />;
                                    }
                                    return <circle cx={cx} cy={cy} r={3} fill="#cbd5e1" stroke="#fff" strokeWidth={2} />;
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Projection Details List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-2">
                        <Calendar className="w-4 h-4" />
                        Month-by-Month Projection
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        {data.projections.map((proj, idx) => (
                            <motion.div
                                key={`${proj.year}-${proj.month}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.05 }}
                                className="flex items-center justify-between p-5 bg-white border-2 rounded-2xl group hover:border-indigo-500/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                                        <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600">{proj.year}</span>
                                        <span className="text-sm font-black text-slate-900">{new Date(0, proj.month - 1).toLocaleString('default', { month: 'short' })}</span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-black text-slate-900">₹{proj.amount.toLocaleString()}</div>
                                        <div className="text-xs font-bold text-slate-400">Total Projected Payout</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">AI Confidence</div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${proj.confidence * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{Math.round(proj.confidence * 100)}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-2">
                        <Info className="w-4 h-4" />
                        AI Strategic Insights
                    </h4>
                    <div className="card-extreme p-8 bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative h-full">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <ArrowUpRight className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-indigo-200 mb-1">Hiring Velocity Risk</h5>
                                    <p className="text-xs text-indigo-100/60 leading-relaxed">
                                        Based on your 2% average monthly growth, we project a ₹{(data.metrics.avg_monthly_liability * 0.12).toLocaleString()} increase in quarterly burn by Q3.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-indigo-200 mb-1">Statutory Reserve Warning</h5>
                                    <p className="text-xs text-indigo-100/60 leading-relaxed">
                                        Projections suggest you should reserve at least ₹{(data.metrics.avg_monthly_liability * 0.15).toLocaleString()} for PF/ESI contributions monthly to avoid cash flow bottlenecks.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-indigo-300" />
                                    <p className="text-[10px] font-medium text-indigo-100/70">
                                        Confidence scores are calculated using historical data volatility and data quality index from the previous 12 months.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
