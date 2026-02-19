'use client';

import { motion } from 'framer-motion';
import {
    Calendar,
    TrendingUp,
    Clock,
    UserCheck,
    ChevronRight,
    ArrowRight,
    Edit,
} from 'lucide-react';
import Link from 'next/link';

const ATTENDANCE_FEATURES = [
    {
        title: 'Manual Entry',
        description: 'Mark daily attendance for all employees with time tracking',
        icon: Edit,
        href: '/dashboard/attendance/manual-entry',
        color: 'from-purple-500 to-pink-600',
    },
    {
        title: 'Attendance Calendar',
        description: 'View monthly attendance with daily statistics and breakdowns',
        icon: Calendar,
        href: '/dashboard/attendance/calendar',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        title: 'Attendance Analytics',
        description: 'Department-wise breakdowns and trend analysis',
        icon: TrendingUp,
        href: '/dashboard/attendance/analytics',
        color: 'from-green-500 to-emerald-600',
    },
    {
        title: 'Monthly Reports',
        description: 'Comprehensive employee-wise attendance reports',
        icon: UserCheck,
        href: '/dashboard/attendance/reports',
        color: 'from-orange-500 to-red-600',
    },
    {
        title: 'Late/Early Tracking',
        description: 'Monitor irregular check-in and check-out times',
        icon: Clock,
        href: '/dashboard/attendance/late-early',
        color: 'from-amber-500 to-orange-600',
    },
];

export default function AttendancePage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-indigo-600">Attendance</span>
                </nav>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                    Attendance Management
                </h1>
                <p className="text-slate-500 font-medium">
                    Track, manage, and analyze employee attendance
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ATTENDANCE_FEATURES.map((feature, index) => (
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
                <h2 className="text-xl font-black text-slate-900 mb-6">Quick Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-black text-indigo-600 mb-1">155</div>
                        <div className="text-sm font-semibold text-slate-600">Total Employees</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-green-600 mb-1">142</div>
                        <div className="text-sm font-semibold text-slate-600">Present Today</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-orange-600 mb-1">8</div>
                        <div className="text-sm font-semibold text-slate-600">On Leave</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-red-600 mb-1">5</div>
                        <div className="text-sm font-semibold text-slate-600">Absent</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
