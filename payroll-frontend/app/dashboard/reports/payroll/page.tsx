'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    ChevronRight,
    IndianRupee,
    Users,
    TrendingUp,
    Calendar,
    Filter,
    BarChart3,
    PieChart,
} from 'lucide-react';
import Link from 'next/link';

interface AutoPayOSSummary {
    month: string;
    totalEmployees: number;
    grossPay: number;
    deductions: number;
    netPay: number;
    pfEmployer: number;
    esiEmployer: number;
}

const MOCK_SUMMARY: AutoPayOSSummary[] = [
    { month: 'Jan 2025', totalEmployees: 150, grossPay: 8500000, deductions: 1250000, netPay: 7250000, pfEmployer: 450000, esiEmployer: 180000 },
    { month: 'Feb 2025', totalEmployees: 155, grossPay: 8800000, deductions: 1300000, netPay: 7500000, pfEmployer: 465000, esiEmployer: 185000 },
    { month: 'Mar 2025', totalEmployees: 158, grossPay: 9100000, deductions: 1350000, netPay: 7750000, pfEmployer: 480000, esiEmployer: 190000 },
];

export default function AutoPayOSSummaryReports() {
    const [selectedPeriod, setSelectedPeriod] = useState('quarterly');
    const [selectedQuarter, setSelectedQuarter] = useState('Q4-2024');

    const currentMonth = MOCK_SUMMARY[MOCK_SUMMARY.length - 1];
    const avgGrossPay = MOCK_SUMMARY.reduce((sum, m) => sum + m.grossPay, 0) / MOCK_SUMMARY.length;
    const totalNetPay = MOCK_SUMMARY.reduce((sum, m) => sum + m.netPay, 0);

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
                        <span className="text-indigo-600">AutoPay-OS Summary</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        AutoPay-OS Summary Reports
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Comprehensive payroll insights and cost breakdowns
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
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
                        <Download className="w-4 h-4" />
                        PDF
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
                            <IndianRupee className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Month Gross</div>
                        <div className="text-3xl font-black text-slate-900">₹{(currentMonth.grossPay / 100000).toFixed(1)}L</div>
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
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</div>
                        <div className="text-3xl font-black text-slate-900">{currentMonth.totalEmployees}</div>
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
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Monthly Payout</div>
                        <div className="text-3xl font-black text-slate-900">₹{(avgGrossPay / 100000).toFixed(1)}L</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Deductions</div>
                        <div className="text-3xl font-black text-slate-900">₹{(currentMonth.deductions / 100000).toFixed(1)}L</div>
                    </div>
                </motion.div>
            </div>

            {/* Monthly Breakdown Table */}
            <div className="card-extreme p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h2 className="text-xl font-black text-slate-900">Monthly AutoPay-OS Breakdown</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Month</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Employees</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Gross Pay</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Deductions</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Net Pay</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">PF (Employer)</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">ESI (Employer)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_SUMMARY.map((month, index) => (
                                <motion.tr
                                    key={month.month}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.02)' }}
                                    className="group transition-all"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{month.month}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                                            {month.totalEmployees}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                                        ₹{(month.grossPay / 100000).toFixed(2)}L
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                                        ₹{(month.deductions / 100000).toFixed(2)}L
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                                        ₹{(month.netPay / 100000).toFixed(2)}L
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-orange-600">
                                        ₹{(month.pfEmployer / 100000).toFixed(2)}L
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-purple-600">
                                        ₹{(month.esiEmployer / 100000).toFixed(2)}L
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                            <tr>
                                <td className="px-6 py-4 text-sm font-black text-slate-900">TOTAL</td>
                                <td className="px-6 py-4 text-center text-sm font-black text-slate-900">
                                    {currentMonth.totalEmployees}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-slate-900">
                                    ₹{(MOCK_SUMMARY.reduce((sum, m) => sum + m.grossPay, 0) / 100000).toFixed(2)}L
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-red-600">
                                    ₹{(MOCK_SUMMARY.reduce((sum, m) => sum + m.deductions, 0) / 100000).toFixed(2)}L
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-green-600">
                                    ₹{(totalNetPay / 100000).toFixed(2)}L
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-orange-600">
                                    ₹{(MOCK_SUMMARY.reduce((sum, m) => sum + m.pfEmployer, 0) / 100000).toFixed(2)}L
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-purple-600">
                                    ₹{(MOCK_SUMMARY.reduce((sum, m) => sum + m.esiEmployer, 0) / 100000).toFixed(2)}L
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Cost Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-extreme">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Cost Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Net Salaries', amount: currentMonth.netPay, color: 'green', percentage: 80 },
                            { label: 'PF Employer', amount: currentMonth.pfEmployer, color: 'orange', percentage: 5 },
                            { label: 'ESI Employer', amount: currentMonth.esiEmployer, color: 'purple', percentage: 2 },
                            { label: 'Other Deductions', amount: currentMonth.deductions - currentMonth.pfEmployer - currentMonth.esiEmployer, color: 'red', percentage: 13 },
                        ].map((item, index) => (
                            <div key={item.label} className="flex items-center gap-4">
                                <div className="w-24 text-sm font-semibold text-slate-700">{item.label}</div>
                                <div className="flex-1">
                                    <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                            className={`h-full bg-gradient-to-r ${item.color === 'green' ? 'from-green-500 to-emerald-600' :
                                                    item.color === 'orange' ? 'from-orange-500 to-amber-600' :
                                                        item.color === 'purple' ? 'from-purple-500 to-pink-600' :
                                                            'from-red-500 to-rose-600'
                                                } flex items-center justify-end pr-3`}
                                        >
                                            <span className="text-xs font-bold text-white">{item.percentage}%</span>
                                        </motion.div>
                                    </div>
                                </div>
                                <div className="w-28 text-right text-sm font-bold text-slate-900">
                                    ₹{(item.amount / 100000).toFixed(2)}L
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-extreme bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Quick Insights</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-blue-100">
                            <div className="text-xs font-semibold text-slate-500 mb-1">Avg. Cost Per Employee</div>
                            <div className="text-2xl font-black text-blue-600">
                                ₹{((currentMonth.grossPay + currentMonth.pfEmployer + currentMonth.esiEmployer) / currentMonth.totalEmployees / 1000).toFixed(0)}K
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-blue-100">
                            <div className="text-xs font-semibold text-slate-500 mb-1">Total Employer Contribution</div>
                            <div className="text-2xl font-black text-orange-600">
                                ₹{((currentMonth.pfEmployer + currentMonth.esiEmployer) / 100000).toFixed(2)}L
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-blue-100">
                            <div className="text-xs font-semibold text-slate-500 mb-1">Deduction Rate</div>
                            <div className="text-2xl font-black text-purple-600">
                                {((currentMonth.deductions / currentMonth.grossPay) * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
