'use client';

import { motion } from 'framer-motion';
import {
    FileText,
    Users,
    Building,
    Shield,
    Wand2,
    TrendingUp,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const REPORT_FEATURES = [
    {
        title: 'AutoPay-OS Summary',
        description: 'Monthly autopay-os breakdown with cost distribution and trends',
        icon: TrendingUp,
        href: '/dashboard/reports/autopay-os',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        title: 'Employee Analytics',
        description: 'Headcount analytics, join/exit trends, and attrition rates',
        icon: Users,
        href: '/dashboard/reports/employee-analytics',
        color: 'from-green-500 to-emerald-600',
    },
    {
        title: 'Department Costs',
        description: 'Department-wise cost analysis and breakdowns',
        icon: Building,
        href: '/dashboard/reports/department-cost',
        color: 'from-purple-500 to-pink-600',
    },
    {
        title: 'Statutory Compliance',
        description: 'PF, ESI, PT, TDS compliance tracking and reports',
        icon: Shield,
        href: '/dashboard/reports/compliance',
        color: 'from-orange-500 to-amber-600',
    },
    {
        title: 'Custom Report Builder',
        description: 'Build custom reports with any combination of fields',
        icon: Wand2,
        href: '/dashboard/reports/custom',
        color: 'from-pink-500 to-rose-600',
    },
];

export default function ReportsPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-indigo-600">Reports & Analytics</span>
                </nav>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                    Reports & Analytics
                </h1>
                <p className="text-slate-500 font-medium">
                    Comprehensive reporting suite for autopay-os, attendance, and compliance
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REPORT_FEATURES.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={feature.href}>
                            <div className="card-extreme group cursor-pointer hover:shadow-2xl transition-all h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 font-medium">{feature.description}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card-extreme bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                <h2 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 bg-white rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all text-left group">
                        <FileText className="w-8 h-8 text-indigo-600 mb-2" />
                        <div className="font-bold text-slate-900">Generate Monthly Report</div>
                        <div className="text-sm text-slate-500">Export all reports for current month</div>
                    </button>
                    <button className="p-4 bg-white rounded-xl border-2 border-green-200 hover:border-green-400 transition-all text-left group">
                        <Shield className="w-8 h-8 text-green-600 mb-2" />
                        <div className="font-bold text-slate-900">Compliance Dashboard</div>
                        <div className="text-sm text-slate-500">View all statutory compliance status</div>
                    </button>
                    <button className="p-4 bg-white rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all text-left group">
                        <Wand2 className="w-8 h-8 text-purple-600 mb-2" />
                        <div className="font-bold text-slate-900">Build Custom Report</div>
                        <div className="text-sm text-slate-500">Create custom report with filters</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
