'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    FileText,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    Download,
    IndianRupee,
    Users,
    Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface ComplianceItem {
    name: string;
    status: 'compliant' | 'pending' | 'overdue';
    dueDate: string;
    amount?: number;
    employees?: number;
}

const MOCK_COMPLIANCE: ComplianceItem[] = [
    { name: 'PF Return (ECR)', status: 'compliant', dueDate: '15th Jan 2025', amount: 465000, employees: 155 },
    { name: 'ESI Return', status: 'compliant', dueDate: '15th Jan 2025', amount: 185000, employees: 95 },
    { name: 'Professional Tax', status: 'pending', dueDate: '28th Feb 2025', amount: 45000, employees: 155 },
    { name: 'TDS Return (24Q)', status: 'pending', dueDate: '31st Mar 2025', amount: 1250000, employees: 155 },
    { name: 'Form 16 Generation', status: 'pending', dueDate: '15th Jun 2025' },
    { name: 'LWF Return', status: 'compliant', dueDate: '31st Dec 2024', amount: 15000, employees: 155 },
];

export default function StatutoryComplianceReportsPage() {
    const [selectedQuarter, setSelectedQuarter] = useState('Q4-2024');

    const compliantCount = MOCK_COMPLIANCE.filter(c => c.status === 'compliant').length;
    const pendingCount = MOCK_COMPLIANCE.filter(c => c.status === 'pending').length;
    const overdueCount = MOCK_COMPLIANCE.filter(c => c.status === 'overdue').length;
    const totalAmount = MOCK_COMPLIANCE.reduce((sum, c) => sum + (c.amount || 0), 0);

    const getStatusBadge = (status: string) => {
        const badges = {
            compliant: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Compliant' },
            pending: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', label: 'Pending' },
            overdue: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Overdue' },
        };
        return badges[status as keyof typeof badges] || badges.pending;
    };

    const getStatusIcon = (status: string) => {
        if (status === 'compliant') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        if (status === 'overdue') return <AlertTriangle className="w-5 h-5 text-red-600" />;
        return <FileText className="w-5 h-5 text-orange-600" />;
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/reports" className="hover:text-indigo-600">Reports</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Statutory Compliance</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Statutory Compliance Reports
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Track PF, ESI, PT, TDS and other statutory compliances
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedQuarter}
                        onChange={(e) => setSelectedQuarter(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                    >
                        <option value="Q1-2024">Q1 (Apr-Jun) 2024</option>
                        <option value="Q2-2024">Q2 (Jul-Sep) 2024</option>
                        <option value="Q3-2024">Q3 (Oct-Dec) 2024</option>
                        <option value="Q4-2024">Q4 (Jan-Mar) 2025</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliant</div>
                        <div className="text-3xl font-black text-slate-900">{compliantCount}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</div>
                        <div className="text-3xl font-black text-slate-900">{pendingCount}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overdue</div>
                        <div className="text-3xl font-black text-slate-900">{overdueCount}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <IndianRupee className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</div>
                        <div className="text-3xl font-black text-slate-900">₹{(totalAmount / 100000).toFixed(1)}L</div>
                    </div>
                </motion.div>
            </div>

            {/* Compliance Items */}
            <div className="card-extreme p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h2 className="text-xl font-black text-slate-900">Compliance Tracker - {selectedQuarter}</h2>
                </div>

                <div className="p-6 space-y-4">
                    {MOCK_COMPLIANCE.map((item, index) => {
                        const badge = getStatusBadge(item.status);

                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-xl border-2 ${badge.border} ${badge.bg} hover:shadow-lg transition-all`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md">
                                            {getStatusIcon(item.status)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 mb-1">{item.name}</h3>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-semibold">Due: {item.dueDate}</span>
                                                </div>
                                                {item.employees && (
                                                    <div className="flex items-center gap-1 text-slate-600">
                                                        <Users className="w-4 h-4" />
                                                        <span className="font-semibold">{item.employees} employees</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full ${badge.bg} ${badge.text} border ${badge.border} text-xs font-bold uppercase`}>
                                        {badge.label}
                                    </span>
                                </div>

                                {item.amount && (
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                        <span className="text-sm font-semibold text-slate-600">Amount Payable</span>
                                        <span className="text-2xl font-black text-slate-900 flex items-center">
                                            <IndianRupee className="w-5 h-5" />
                                            {(item.amount / 100000).toFixed(2)}L
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Compliance Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-extreme">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Statutory Breakdown</h3>

                    <div className="space-y-4">
                        {[
                            { name: 'PF Contributions', amount: 465000, percentage: 25, color: 'blue' },
                            { name: 'ESI Contributions', amount: 185000, percentage: 10, color: 'green' },
                            { name: 'TDS on Salaries', amount: 1250000, percentage: 67, color: 'purple' },
                            { name: 'Professional Tax', amount: 45000, percentage: 2, color: 'orange' },
                            { name: 'Labour Welfare Fund', amount: 15000, percentage: 1, color: 'pink' },
                        ].map((item, index) => (
                            <div key={item.name} className="flex items-center gap-4">
                                <div className="w-32 text-sm font-semibold text-slate-700">{item.name}</div>
                                <div className="flex-1">
                                    <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                            className={`h-full bg-gradient-to-r ${item.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                                                    item.color === 'green' ? 'from-green-500 to-emerald-600' :
                                                        item.color === 'purple' ? 'from-purple-500 to-pink-600' :
                                                            item.color === 'orange' ? 'from-orange-500 to-amber-600' :
                                                                'from-pink-500 to-rose-600'
                                                } flex items-center justify-end pr-3`}
                                        >
                                            <span className="text-xs font-bold text-white">{item.percentage}%</span>
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="w-24 text-right text-sm font-bold text-slate-900">
                                    ₹{(item.amount / 100000).toFixed(1)}L
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-extreme bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Compliance Score</h3>

                    <div className="flex items-center justify-center mb-6">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="#e2e8f0"
                                    strokeWidth="16"
                                    fill="none"
                                />
                                <motion.circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="#10b981"
                                    strokeWidth="16"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "502.4 502.4", strokeDashoffset: 502.4 }}
                                    animate={{ strokeDashoffset: 502.4 - (502.4 * (compliantCount / MOCK_COMPLIANCE.length)) }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-5xl font-black text-green-600">
                                    {Math.round((compliantCount / MOCK_COMPLIANCE.length) * 100)}%
                                </div>
                                <div className="text-sm font-semibold text-slate-600">Compliant</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 bg-white rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-600">On-time Filings</span>
                                <span className="text-lg font-black text-green-600">{compliantCount}/6</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-600">Pending Actions</span>
                                <span className="text-lg font-black text-orange-600">{pendingCount}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-600">Next Due Date</span>
                                <span className="text-lg font-black text-slate-900">28th Feb</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
