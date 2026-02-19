'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Calendar,
    Download,
    ChevronRight,
    BarChart3,
} from 'lucide-react';
import Link from 'next/link';

interface DepartmentStats {
    name: string;
    present: number;
    absent: number;
    late: number;
    percentage: number;
}

const DEPARTMENT_STATS: DepartmentStats[] = [
    { name: 'Engineering', present: 45, absent: 2, late: 3, percentage: 90 },
    { name: 'Design', present: 18, absent: 1, late: 1, percentage: 90 },
    { name: 'HR', present: 8, absent: 0, late: 0, percentage: 100 },
    { name: 'Operations', present: 22, absent: 1, late: 2, percentage: 88 },
    { name: 'Sales', present: 35, absent: 3, late: 4, percentage: 84 },
];

export default function AttendanceAnalyticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

    const overallStats = {
        avgAttendance: 92.5,
        trend: '+2.3%',
        totalPresent: 4289,
        totalAbsent: 156,
        totalLate: 342,
        punctualityRate: 88.2,
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/attendance" className="hover:text-indigo-600">Attendance</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Analytics</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Attendance Analytics
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Insights and trends across your organization
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                    >
                        <option value="today">Today</option>
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="thisYear">This Year</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            {overallStats.trend}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Attendance</div>
                        <div className="text-3xl font-black text-slate-900">{overallStats.avgAttendance}%</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Present</div>
                        <div className="text-3xl font-black text-slate-900">{overallStats.totalPresent.toLocaleString()}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Late Arrivals</div>
                        <div className="text-3xl font-black text-slate-900">{overallStats.totalLate}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Punctuality Rate</div>
                        <div className="text-3xl font-black text-slate-900">{overallStats.punctualityRate}%</div>
                    </div>
                </motion.div>
            </div>

            {/* Department-wise Breakdown */}
            <div className="card-extreme">
                <h2 className="text-xl font-black text-slate-900 mb-6">Department-wise Attendance</h2>

                <div className="space-y-4">
                    {DEPARTMENT_STATS.map((dept, index) => (
                        <motion.div
                            key={dept.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="font-bold text-slate-900">{dept.name}</div>
                                    <div className="text-sm text-slate-500">
                                        {dept.present} Present • {dept.absent} Absent • {dept.late} Late
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-black ${dept.percentage >= 90 ? 'text-green-600' :
                                            dept.percentage >= 85 ? 'text-orange-600' : 'text-red-600'
                                        }`}>
                                        {dept.percentage}%
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dept.percentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                    className={`h-full rounded-full ${dept.percentage >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                            dept.percentage >= 85 ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
                                                'bg-gradient-to-r from-red-500 to-rose-600'
                                        }`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Trends & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Trend */}
                <div className="card-extreme">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Weekly Attendance Trend</h3>
                    <div className="space-y-3">
                        {[
                            { day: 'Monday', percentage: 94, present: 147 },
                            { day: 'Tuesday', percentage: 96, present: 150 },
                            { day: 'Wednesday', percentage: 91, present: 142 },
                            { day: 'Thursday', percentage: 93, present: 145 },
                            { day: 'Friday', percentage: 89, present: 139 },
                        ].map((day, index) => (
                            <div key={day.day} className="flex items-center gap-4">
                                <div className="w-24 text-sm font-semibold text-slate-700">{day.day}</div>
                                <div className="flex-1">
                                    <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${day.percentage}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-end pr-3"
                                        >
                                            <span className="text-xs font-bold text-white">{day.percentage}%</span>
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="w-16 text-sm font-bold text-slate-900">{day.present}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts & Issues */}
                <div className="card-extreme">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Alerts & Issues</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-red-900 mb-1">High Absenteeism</div>
                                    <div className="text-sm text-red-700">
                                        Sales department has 8.4% absence rate this week
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-orange-900 mb-1">Punctuality Alert</div>
                                    <div className="text-sm text-orange-700">
                                        42 employees were late 3+ times this week
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-green-900 mb-1">Perfect Attendance</div>
                                    <div className="text-sm text-green-700">
                                        89 employees had perfect attendance this month
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
