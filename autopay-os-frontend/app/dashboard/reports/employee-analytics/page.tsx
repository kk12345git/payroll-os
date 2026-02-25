'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Download,
    BarChart3,
    PieChart,
    UserPlus,
    UserMinus,
} from 'lucide-react';
import Link from 'next/link';

interface HeadcountData {
    month: string;
    totalEmployees: number;
    newJoins: number;
    exits: number;
    netChange: number;
}

interface DepartmentHeadcount {
    name: string;
    count: number;
    percentage: number;
    color: string;
}

const MOCK_HEADCOUNT: HeadcountData[] = [
    { month: 'Jan 2025', totalEmployees: 150, newJoins: 8, exits: 3, netChange: 5 },
    { month: 'Feb 2025', totalEmployees: 155, newJoins: 7, exits: 2, netChange: 5 },
    { month: 'Mar 2025', totalEmployees: 158, newJoins: 5, exits: 2, netChange: 3 },
];

const DEPT_HEADCOUNT: DepartmentHeadcount[] = [
    { name: 'Engineering', count: 62, percentage: 39, color: 'blue' },
    { name: 'Sales', count: 38, percentage: 24, color: 'green' },
    { name: 'Operations', count: 24, percentage: 15, color: 'purple' },
    { name: 'Design', count: 18, percentage: 11, color: 'pink' },
    { name: 'HR', count: 10, percentage: 6, color: 'orange' },
    { name: 'Finance', count: 6, percentage: 4, color: 'red' },
];

export default function EmployeeAnalyticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('quarterly');

    const currentData = MOCK_HEADCOUNT[MOCK_HEADCOUNT.length - 1];
    const totalJoins = MOCK_HEADCOUNT.reduce((sum, m) => sum + m.newJoins, 0);
    const totalExits = MOCK_HEADCOUNT.reduce((sum, m) => sum + m.exits, 0);
    const attritionRate = ((totalExits / currentData.totalEmployees) * 100).toFixed(1);

    const getColorClass = (color: string) => {
        const colors = {
            blue: 'from-blue-500 to-indigo-600',
            green: 'from-green-500 to-emerald-600',
            purple: 'from-purple-500 to-pink-600',
            pink: 'from-pink-500 to-rose-600',
            orange: 'from-orange-500 to-amber-600',
            red: 'from-red-500 to-rose-600',
        };
        return colors[color as keyof typeof colors] || colors.blue;
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
                        <span className="text-indigo-600">Employee Analytics</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Employee Headcount Analytics
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Track workforce growth and department distribution
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4" />
                        Export
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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            +{currentData.netChange}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Headcount</div>
                        <div className="text-3xl font-black text-slate-900">{currentData.totalEmployees}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Joins (Q)</div>
                        <div className="text-3xl font-black text-slate-900">{totalJoins}</div>
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
                            <UserMinus className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Exits (Q)</div>
                        <div className="text-3xl font-black text-slate-900">{totalExits}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                            <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attrition Rate</div>
                        <div className="text-3xl font-black text-slate-900">{attritionRate}%</div>
                    </div>
                </motion.div>
            </div>

            {/* Monthly Trend */}
            <div className="card-extreme">
                <h2 className="text-xl font-black text-slate-900 mb-6">Headcount Growth Trend</h2>

                <div className="space-y-4">
                    {MOCK_HEADCOUNT.map((month, index) => (
                        <motion.div
                            key={month.month}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="font-bold text-slate-900">{month.month}</div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="w-4 h-4 text-green-600" />
                                        <span className="font-semibold text-green-600">+{month.newJoins}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <UserMinus className="w-4 h-4 text-red-600" />
                                        <span className="font-semibold text-red-600">-{month.exits}</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${month.netChange > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {month.netChange > 0 ? '+' : ''}{month.netChange}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-black text-slate-900">{month.totalEmployees}</div>
                                <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(month.totalEmployees / 200) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Department Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-extreme">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Department-wise Distribution</h3>
                    <div className="space-y-4">
                        {DEPT_HEADCOUNT.map((dept, index) => (
                            <motion.div
                                key={dept.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-slate-700">{dept.name}</span>
                                    <span className="text-sm font-bold text-slate-900">{dept.count} ({dept.percentage}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dept.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        className={`h-full bg-gradient-to-r ${getColorClass(dept.color)} flex items-center justify-end pr-3`}
                                    >
                                        <span className="text-xs font-bold text-white">{dept.percentage}%</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="card-extreme bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Workforce Insights</h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl">
                            <div className="text-xs font-semibold text-slate-500 mb-2">Largest Department</div>
                            <div className="text-2xl font-black text-blue-600">Engineering</div>
                            <div className="text-sm text-slate-600 mt-1">{DEPT_HEADCOUNT[0].count} employees (39%)</div>
                        </div>

                        <div className="p-4 bg-white rounded-xl">
                            <div className="text-xs font-semibold text-slate-500 mb-2">Growth Rate (QoQ)</div>
                            <div className="text-2xl font-black text-green-600">+8.7%</div>
                            <div className="text-sm text-slate-600 mt-1">Healthy expansion trend</div>
                        </div>

                        <div className="p-4 bg-white rounded-xl">
                            <div className="text-xs font-semibold text-slate-500 mb-2">Avg. Team Size</div>
                            <div className="text-2xl font-black text-purple-600">
                                {Math.round(currentData.totalEmployees / DEPT_HEADCOUNT.length)}
                            </div>
                            <div className="text-sm text-slate-600 mt-1">Per department</div>
                        </div>

                        <div className="p-4 bg-white rounded-xl">
                            <div className="text-xs font-semibold text-slate-500 mb-2">Retention Rate</div>
                            <div className="text-2xl font-black text-orange-600">{(100 - parseFloat(attritionRate)).toFixed(1)}%</div>
                            <div className="text-sm text-slate-600 mt-1">Strong retention</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
