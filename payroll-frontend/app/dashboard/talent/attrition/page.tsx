'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    ShieldAlert,
    TrendingDown,
    Users,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { cn } from '@/lib/utils';

interface RiskFactor {
    name: string;
    impact: string;
    description: string;
}

interface AttritionReport {
    score: number;
    level: string;
    factors: RiskFactor[];
    employee_name: string;
    department: number;
}

export default function AttritionDashboard() {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<AttritionReport[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/talent/attrition-risk`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setReports(await res.json());
            } catch (error) {
                console.error("Failed to fetch risk reports", error);
                toast.error("Cloud Talent Engine unavailable. Retrying...");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r =>
        r.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        critical: reports.filter(r => r.level === 'Critical').length,
        medium: reports.filter(r => r.level === 'Medium').length,
        avgScore: reports.length > 0 ? Math.round(reports.reduce((s, r) => s + r.score, 0) / reports.length) : 0
    };

    const chartData = reports.slice(0, 8).map(r => ({
        name: r.employee_name.split(' ')[0],
        score: r.score
    }));

    const COLORS = ['#ef4444', '#f59e0b', '#6366f1'];

    if (loading && reports.length === 0) return <LoadingOverlay message="AI Brain scanning talent data..." />;

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Brain className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Talent <span className="text-indigo-600 not-italic">Intelligence</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        AI-Powered Attrition Risk Detector • Preserving your most valuable assets
                    </p>
                </div>
            </header>

            {/* Risk Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-[2.5rem] bg-red-600 text-white relative overflow-hidden group">
                    <ShieldAlert className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-red-100 mb-1">Critical Retention Risk</h3>
                    <p className="text-4xl font-black tracking-tighter italic">{stats.critical}</p>
                    <p className="mt-4 text-[10px] font-bold text-white/60">IMMEDIATE ATTENTION REQUIRED</p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 relative overflow-hidden group">
                    <TrendingDown className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-50 opacity-1 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Alert Baseline</h3>
                    <p className="text-4xl font-black tracking-tighter italic text-slate-900">{stats.medium + stats.critical}</p>
                    <p className="mt-4 text-[10px] font-bold text-slate-400">TOTAL HIGH-ENGAGEMENT RISKS</p>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                    <Brain className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Avg Dept Risk Index</h3>
                    <p className="text-4xl font-black tracking-tighter italic">{stats.avgScore}%</p>
                    <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Predictor Healthy</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score Chart */}
                <div className="card-extreme bg-white border-2 border-slate-100 p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 italic flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-indigo-600" />
                        Top Attrition Probabilities
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#ef4444' : '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Feed */}
                <div className="card-extreme bg-white border-2 border-slate-100 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">High Risk Intelligence Feed</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter team..."
                                className="bg-slate-50 border-none rounded-xl pl-9 pr-4 py-2 text-[10px] font-bold outline-none focus:ring-2 ring-indigo-500/20 w-48"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-4 scrollbar-thin">
                        {filteredReports.map((report, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-2xl bg-card border border-border/50 hover:border-indigo-200 transition-all group"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs",
                                            report.level === 'Critical' ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                        )}>
                                            {report.score}%
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic">{report.employee_name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={cn(
                                                    "text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                    report.level === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'
                                                )}>{report.level} Risk</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {report.factors.map((f, fi) => (
                                            <div key={fi} className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse" title={f.name} />
                                        ))}
                                    </div>
                                    <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Analysis Table */}
            <div className="card-extreme bg-white border-2 overflow-hidden shadow-xl shadow-slate-200/50">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 italic uppercase">Risk Factor <span className="text-indigo-600 not-italic">Breakdown</span></h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Score</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dominant Drivers</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Next Steps</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold">
                            {filteredReports.map((report, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6 uppercase italic text-sm">{report.employee_name}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${report.score}%` }}
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        report.score > 70 ? 'bg-red-500' : 'bg-indigo-500'
                                                    )}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black">{report.score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-2">
                                            {report.factors.map((f, fi) => (
                                                <span key={fi} className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                                                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                                                    {f.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button className="px-4 py-2 border-2 border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2">
                                            Schedule Pulse Check <ArrowUpRight className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
