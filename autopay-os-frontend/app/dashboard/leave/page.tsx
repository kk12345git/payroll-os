'use client';

import { motion } from 'framer-motion';
import {
    Calendar,
    DollarSign,
    Settings,
    Wallet,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const LEAVE_FEATURES = [
    {
        title: 'Leave Balance',
        description: 'Track employee leave balances with visual progress indicators',
        icon: Wallet,
        href: '/dashboard/leave/balance',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        title: 'Team Leave Calendar',
        description: 'Visualize upcoming leaves across the organization',
        icon: Calendar,
        href: '/dashboard/leave/team-calendar',
        color: 'from-green-500 to-emerald-600',
    },
    {
        title: 'Leave Policy',
        description: 'Manage leave types, rules, and entitlements',
        icon: Settings,
        href: '/dashboard/leave/policy',
        color: 'from-purple-500 to-pink-600',
    },
    {
        title: 'Leave Encashment',
        description: 'Calculate leave encashment amounts and policies',
        icon: DollarSign,
        href: '/dashboard/leave/encashment',
        color: 'from-orange-500 to-amber-600',
    },
];

export default function LeavePage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-indigo-600">Leave Management</span>
                </nav>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                    Leave Management
                </h1>
                <p className="text-slate-500 font-medium">
                    Manage employee leaves, policies, and encashment
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {LEAVE_FEATURES.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={feature.href}>
                            <div className="card-extreme group cursor-pointer hover:shadow-2xl transition-all">
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

            {/* Quick Stats */}
            <div className="card-extreme bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                <h2 className="text-xl font-black text-slate-900 mb-6">Leave Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-black text-indigo-600 mb-1">12</div>
                        <div className="text-sm font-semibold text-slate-600">Pending Requests</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-green-600 mb-1">8</div>
                        <div className="text-sm font-semibold text-slate-600">On Leave Today</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-orange-600 mb-1">24</div>
                        <div className="text-sm font-semibold text-slate-600">Upcoming Leaves</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-purple-600 mb-1">4</div>
                        <div className="text-sm font-semibold text-slate-600">Leave Types</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
