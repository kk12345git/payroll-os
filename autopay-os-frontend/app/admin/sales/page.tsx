'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    DollarSign,
    TrendingUp,
    Globe,
    Building2,
    ChevronRight,
    Search,
    Download,
    Filter,
    ArrowUpRight,
    MoreVertical,
    Zap
} from 'lucide-react';
import { api } from '@/lib/api';

export default function SalesAdminPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [m, c] = await Promise.all([
                    api.getAdminMetrics(),
                    api.getAllCompanies()
                ]);
                setMetrics(m);
                setCompanies(c);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-300">INITIALIZING SALES ENGINE...</div>;

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <TrendingUp className="w-10 h-10 text-indigo-600" />
                        Sales & Revenue Control
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Global oversight of all platform tenants and subscriptions.</p>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total MRR', value: `$${metrics?.mrr?.toLocaleString()}`, sub: `+${metrics?.growth}% from last month`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Acquired Companies', value: metrics?.total_companies, sub: 'Active worldwide tenants', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Paid Subscriptions', value: metrics?.active_subscriptions, sub: 'PRO & Enterprise', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Platform Users', value: '4.2k', sub: 'Total employee seats', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-extreme p-6 bg-white border-none shadow-xl shadow-slate-100"
                    >
                        <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-6`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{m.value}</div>
                        <div className="text-xs font-black uppercase tracking-widest text-slate-400">{m.label}</div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                            <ArrowUpRight className="w-3 h-3" />
                            {m.sub}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Table */}
            <div className="card-extreme bg-white border-none shadow-2xl shadow-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-black text-slate-900">Client Directory</h2>
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-6 py-3 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-600"
                            placeholder="Search by company or country..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Company</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Region</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {companies.map((c, i) => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">
                                                {c.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900">{c.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">ID: #{c.id}024</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span className="font-bold text-slate-600 text-sm">{c.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${c.plan === 'PRO' ? 'bg-indigo-100 text-indigo-700' : c.plan === 'ENTERPRISE' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {c.plan}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            {c.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-white rounded-xl transition-colors">
                                            <MoreVertical className="w-5 h-5 text-slate-400" />
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
