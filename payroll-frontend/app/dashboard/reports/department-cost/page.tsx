'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building,
    IndianRupee,
    Users,
    TrendingUp,
    ChevronRight,
    Download,
    BarChart3,
} from 'lucide-react';
import Link from 'next/link';

interface DepartmentCost {
    name: string;
    employees: number;
    totalCost: number;
    avgCostPerEmployee: number;
    percentage: number;
    color: string;
}

const MOCK_DEPT_COSTS: DepartmentCost[] = [
    { name: 'Engineering', employees: 62, totalCost: 4800000, avgCostPerEmployee: 77419, percentage: 42, color: 'blue' },
    { name: 'Sales', employees: 38, totalCost: 2400000, avgCostPerEmployee: 63158, percentage: 21, color: 'green' },
    { name: 'Operations', employees: 24, totalCost: 1500000, avgCostPerEmployee: 62500, percentage: 13, color: 'purple' },
    { name: 'Design', employees: 18, totalCost: 1350000, avgCostPerEmployee: 75000, percentage: 12, color: 'pink' },
    { name: 'HR', employees: 10, totalCost: 750000, avgCostPerEmployee: 75000, percentage: 7, color: 'orange' },
    { name: 'Finance', employees: 6, totalCost: 600000, avgCostPerEmployee: 100000, percentage: 5, color: 'red' },
];

export default function DepartmentCostAnalysisPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');

    const totalCost = MOCK_DEPT_COSTS.reduce((sum, d) => sum + d.totalCost, 0);
    const totalEmployees = MOCK_DEPT_COSTS.reduce((sum, d) => sum + d.employees, 0);
    const avgCost = totalCost / totalEmployees;

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
                        <span className="text-indigo-600">Department Cost Analysis</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Department-wise Cost Analysis
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Breakdown of autopay-os costs across departments
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                    >
                        <option value="monthly">This Month</option>
                        <option value="quarterly">This Quarter</option>
                        <option value="yearly">This Year</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <IndianRupee className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total AutoPay-OS Cost</div>
                        <div className="text-3xl font-black text-slate-900">₹{(totalCost / 100000).toFixed(1)}L</div>
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
                            <Building className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Departments</div>
                        <div className="text-3xl font-black text-slate-900">{MOCK_DEPT_COSTS.length}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</div>
                        <div className="text-3xl font-black text-slate-900">{totalEmployees}</div>
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
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Cost/Employee</div>
                        <div className="text-3xl font-black text-slate-900">₹{(avgCost / 1000).toFixed(0)}K</div>
                    </div>
                </motion.div>
            </div>

            {/* Department Cost Table */}
            <div className="card-extreme p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h2 className="text-xl font-black text-slate-900">Cost Breakdown by Department</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Employees</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total Cost</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Avg/Employee</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Cost Share</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_DEPT_COSTS.map((dept, index) => (
                                <motion.tr
                                    key={dept.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.02)' }}
                                    className="group transition-all"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getColorClass(dept.color)} flex items-center justify-center shadow-md`}>
                                                <Building className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{dept.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                                            {dept.employees}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                                        ₹{(dept.totalCost / 100000).toFixed(2)}L
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                                        ₹{(dept.avgCostPerEmployee / 1000).toFixed(0)}K
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${getColorClass(dept.color)}`}
                                                        style={{ width: `${dept.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-sm font-black text-slate-900 w-12 text-right">{dept.percentage}%</span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-extreme">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Cost Distribution</h3>
                    <div className="space-y-4">
                        {MOCK_DEPT_COSTS.map((dept, index) => (
                            <div key={dept.name} className="flex items-center gap-4">
                                <div className="w-28 text-sm font-semibold text-slate-700">{dept.name}</div>
                                <div className="flex-1">
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
                                </div>
                                <div className="w-24 text-right text-sm font-bold text-slate-900">
                                    ₹{(dept.totalCost / 100000).toFixed(1)}L
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-extreme bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Cost Insights</h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl">
                            <div className="text-xs font-semibold text-slate-500 mb-2">Highest Cost Department</div>
                            <div className="text-2xl font-black text-blue-600">{MOCK_DEPT_COSTS[0].name}</div>
                            <div className="text-sm text-slate-600 mt-1">₹{(MOCK_DEPT_COSTS[0].totalCost / 100000).toFixed(1)}L ({MOCK_DEPT_COSTS[0].percentage}%)</div>
                        </div>

                        <div className="p-4 bg-white rounded-xl">
                            <div className="text-xs font-semibold text-slate-500 mb-2">Highest Avg. Salary</div>
                            <div className="text-2xl font-black text-green-600">Finance</div>
                            <div className="text-sm text-slate-600 mt-1">₹{(MOCK_DEPT_COSTS[5].avgCostPerEmployee / 1000).toFixed(0)}K per employee</div>
                        </div>

                        <div className="p-4 bg-white rounded-xl">
                            <div className="text-xs font-semibold text-slate-500 mb-2">Largest Team</div>
                            <div className="text-2xl font-black text-purple-600">{MOCK_DEPT_COSTS[0].name}</div>
                            <div className="text-sm text-slate-600 mt-1">{MOCK_DEPT_COSTS[0].employees} employees</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
