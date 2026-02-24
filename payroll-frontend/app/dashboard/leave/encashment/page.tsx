'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    IndianRupee,
    Calculator,
    ChevronRight,
    Users,
    Calendar,
    TrendingUp,
    Download,
} from 'lucide-react';
import Link from 'next/link';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAutoPayOSStore } from '@/store/payrollStore';
import { useToast } from '@/store/toastStore';

export default function LeaveEncashmentPage() {
    const { employees } = useEmployeeStore();
    const { salaryStructures } = useAutoPayOSStore();
    const toast = useToast();

    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [leaveBalance, setLeaveBalance] = useState('15');
    const [encashDays, setEncashDays] = useState('10');

    // Auto-detect daily salary for selected employee
    const selectedEmployeeSalary = useMemo(() => {
        if (!selectedEmployeeId) return 0;
        const structure = salaryStructures[parseInt(selectedEmployeeId)];
        if (!structure) return 0;

        const monthlyGross = (structure.basic || 0) + (structure.hra || 0) + (structure.conveyance || 0) + (structure.medical_allowance || 0) + (structure.special_allowance || 0);
        return Math.round(monthlyGross / 30);
    }, [selectedEmployeeId, salaryStructures]);

    const [manualDailySalary, setManualDailySalary] = useState('');

    const effectiveDailySalary = manualDailySalary ? parseFloat(manualDailySalary) : selectedEmployeeSalary;

    const calculate = () => {
        const days = parseFloat(encashDays) || 0;
        const salary = effectiveDailySalary || 0;
        return days * salary;
    };

    const encashmentAmount = calculate();

    const handleProcessEncashment = () => {
        if (!selectedEmployeeId) {
            toast.error('Please select an employee first');
            return;
        }
        toast.success(`Leave encashment of ₹${encashmentAmount.toLocaleString('en-IN')} processed for employee.`);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/leave" className="hover:text-indigo-600">Leave</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Encashment Calculator</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Leave Encashment Calculator
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Calculate leave encashment amounts for employees
                    </p>
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
                        <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                            <IndianRupee className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Encashed (YTD)</div>
                        <div className="text-3xl font-black text-slate-900">₹8.5L</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employees Encashed</div>
                        <div className="text-3xl font-black text-slate-900">42</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Days Encashed</div>
                        <div className="text-3xl font-black text-slate-900">12</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Amount</div>
                        <div className="text-3xl font-black text-slate-900">₹20.2K</div>
                    </div>
                </motion.div>
            </div>

            {/* Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="card-extreme">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Calculate Encashment</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Select Employee *
                            </label>
                            <select
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                                className="input-extreme font-bold"
                            >
                                <option value="">Choose an employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.full_name} ({emp.employee_code || `EMP${emp.id.toString().padStart(3, '0')}`})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Available Leave Balance (Days)
                            </label>
                            <input
                                type="number"
                                value={leaveBalance}
                                onChange={(e) => setLeaveBalance(e.target.value)}
                                className="input-extreme"
                                placeholder="15"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Days to Encash *
                            </label>
                            <input
                                type="number"
                                value={encashDays}
                                onChange={(e) => setEncashDays(e.target.value)}
                                className="input-extreme"
                                placeholder="10"
                                max={leaveBalance}
                            />
                            <div className="text-xs text-slate-500 mt-1">
                                Maximum: {leaveBalance} days available
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Daily Salary Rate *
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={manualDailySalary || (selectedEmployeeSalary || '')}
                                    onChange={(e) => setManualDailySalary(e.target.value)}
                                    className="input-extreme !pl-10 font-black text-indigo-600"
                                    placeholder="Rate"
                                />
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {selectedEmployeeSalary > 0
                                    ? `Auto-detected from salary structure: ₹${selectedEmployeeSalary}/day`
                                    : "Enter rate or select employee to auto-detect"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="card-extreme bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <h2 className="text-xl font-black text-slate-900 mb-6">Encashment Summary</h2>

                    <div className="space-y-6">
                        <div className="p-6 bg-white rounded-xl border-2 border-green-200">
                            <div className="text-sm font-semibold text-slate-600 mb-2">Total Encashment Amount</div>
                            <div className="text-5xl font-black text-green-600 flex items-center">
                                <IndianRupee className="w-10 h-10" />
                                {encashmentAmount.toLocaleString('en-IN')}
                            </div>
                        </div>

                        <div className="space-y-4 p-6 bg-white rounded-xl">
                            <h3 className="text-sm font-black text-slate-900 mb-4">Calculation Breakdown</h3>

                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="text-sm font-semibold text-slate-600">Days to Encash</span>
                                <span className="text-lg font-black text-slate-900">{encashDays}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="text-sm font-semibold text-slate-600">Daily Salary Rate</span>
                                <span className="text-lg font-black text-slate-900">₹{effectiveDailySalary.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex justify-between items-center pt-3">
                                <span className="text-sm font-semibold text-slate-900">Total Amount</span>
                                <span className="text-2xl font-black text-green-600">₹{encashmentAmount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="text-sm text-blue-800">
                                    <div className="font-bold mb-1">Remaining Balance</div>
                                    After encashment: <span className="font-black">{parseFloat(leaveBalance || '0') - parseFloat(encashDays || '0')} days</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleProcessEncashment}
                            className="w-full btn-extreme"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Process Encashment
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Panel */}
            <div className="card-extreme bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
                <h3 className="text-lg font-black text-slate-900 mb-4">Leave Encashment Policy</h3>
                <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-indigo-600">1</span>
                        </div>
                        <p>Only <span className="font-bold">Earned Leave (EL)</span> is eligible for encashment</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-indigo-600">2</span>
                        </div>
                        <p>Minimum service of <span className="font-bold">6 months</span> required for encashment</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-indigo-600">3</span>
                        </div>
                        <p>Maximum encashment allowed: <span className="font-bold">15 days per year</span></p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-indigo-600">4</span>
                        </div>
                        <p>Encashment is calculated based on <span className="font-bold">basic salary only</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
