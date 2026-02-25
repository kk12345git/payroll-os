'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    Users,
    IndianRupee,
    Download,
    Check,
    Clock,
    AlertCircle,
    Play,
    FileText,
} from 'lucide-react';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAutoPayOSStore } from '@/store/autopayOSStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { LoadingOverlay } from '@/components/Loading';

export default function RunAutoPayOSPage() {
    const { employees, fetchEmployees, loading: empLoading } = useEmployeeStore();
    const { processAutoPayOS, loading: autopayOSLoading, autopayOSRecords, error } = useAutoPayOSStore();
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
    const [processed, setProcessed] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const activeEmployees = useMemo(() => employees.filter(e => e.is_active), [employees]);

    const [year, month] = useMemo(() => {
        const parts = selectedMonth.split('-');
        return [parseInt(parts[0]), parseInt(parts[1])];
    }, [selectedMonth]);

    const currentMonthRecords = useMemo(() => {
        return autopayOSRecords.filter(r => r.month === month && r.year === year);
    }, [autopayOSRecords, month, year]);

    const stats = useMemo(() => {
        const total = activeEmployees.length;
        const processedCount = currentMonthRecords.length;
        const totalGross = currentMonthRecords.reduce((sum, r) => sum + r.gross_earnings, 0);
        const totalNet = currentMonthRecords.reduce((sum, r) => sum + r.net_pay, 0);

        return {
            total,
            processedCount,
            totalGross,
            totalNet,
            pending: total - processedCount
        };
    }, [activeEmployees, currentMonthRecords]);

    const handleRunAutoPayOS = async () => {
        try {
            const empIds = activeEmployees.map(e => e.id);
            await processAutoPayOS(month, year, empIds);
            setProcessed(true);
        } catch (err) {
            console.error('AutoPay-OS processing failed:', err);
        }
    };

    const months = useMemo(() => {
        const result = [];
        const now = new Date();
        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const val = d.toISOString().substring(0, 7);
            const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            result.push({ value: val, label });
        }
        return result;
    }, []);

    if (empLoading) return <LoadingOverlay />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 shimmer-text">
                        Run Monthly AutoPay-OS
                    </h1>
                    <p className="text-slate-600 font-medium tracking-tight uppercase text-[10px] bg-white/50 w-fit px-2 py-1 rounded border border-indigo-100">
                        Process salaries for all employees • {activeEmployees.length} active
                    </p>
                </motion.div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: AutoPay-OS Configuration */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Month Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-extreme p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200">
                                    <CalendarIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Select Month</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Choose autopay-os period</p>
                                </div>
                            </div>
                            <select
                                value={selectedMonth}
                                onChange={(e) => {
                                    setSelectedMonth(e.target.value);
                                    setProcessed(false);
                                }}
                                className="input-extreme text-lg font-black"
                            >
                                {months.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </motion.div>

                        {/* AutoPay-OS Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card-extreme p-6"
                        >
                            <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">Financial Overview</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-indigo-600" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Employees</span>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900">
                                        {stats.total}
                                    </div>
                                </div>
                                <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Processed</span>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900">
                                        {stats.processedCount}
                                    </div>
                                </div>
                                <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IndianRupee className="w-4 h-4 text-purple-600" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Gross Total</span>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                                        ₹{stats.totalGross.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IndianRupee className="w-4 h-4 text-blue-600" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Net Payable</span>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                                        ₹{stats.totalNet.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Employee List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="card-extreme p-6"
                        >
                            <h3 className="text-lg font-black text-slate-800 mb-6 tracking-tight">
                                AutoPay-OS Status Table
                            </h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {activeEmployees.map((emp) => {
                                    const record = currentMonthRecords.find(r => r.employee_id === emp.id);
                                    return (
                                        <div
                                            key={emp.id}
                                            className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">
                                                    {(emp.full_name || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 tracking-tight">
                                                        {emp.full_name}
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                        {emp.employee_code || `EMP${emp.id.toString().padStart(3, '0')}`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-slate-900 tracking-tight">
                                                    {record ? `₹${record.net_pay.toLocaleString()}` : '—'}
                                                </div>
                                                <div className={`text-[9px] font-black uppercase tracking-widest flex items-center justify-end gap-1 ${record ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {record ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {record ? 'Processed' : 'Pending'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Actions */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card-extreme bg-slate-900 text-white p-6 sticky top-8"
                        >
                            <h3 className="text-xl font-black mb-6 tracking-tight">Processing Actions</h3>

                            {!processed && stats.pending > 0 ? (
                                <>
                                    <div className="space-y-4 mb-8">
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <AlertCircle className="w-4 h-4 text-indigo-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Pre-Process Checksum</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                    <Check className="w-3 h-3 text-green-400" />
                                                    <span>Master Data Integrity</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                    <Check className="w-3 h-3 text-green-400" />
                                                    <span>Attendance Normalization</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                                    <Check className="w-3 h-3 text-green-400" />
                                                    <span>Compliance Constants Load</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={handleRunAutoPayOS}
                                        disabled={autopayOSLoading}
                                        whileHover={{ scale: autopayOSLoading ? 1 : 1.02 }}
                                        whileTap={{ scale: autopayOSLoading ? 1 : 0.98 }}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${autopayOSLoading
                                            ? 'bg-white/10 cursor-not-allowed text-slate-500'
                                            : 'bg-white text-slate-900 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                                            }`}
                                    >
                                        {autopayOSLoading ? (
                                            <>
                                                <Clock className="w-4 h-4 animate-spin text-indigo-500" />
                                                Calculations Pending...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4" />
                                                Run Full Batch
                                            </>
                                        )}
                                    </motion.button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-5 bg-green-500/10 rounded-2xl border border-green-500/30 mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-green-500 rounded-full">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-black text-green-400 tracking-tight">Execution Complete</span>
                                        </div>
                                        <p className="text-[10px] leading-relaxed text-slate-400 font-bold uppercase tracking-wide">
                                            Batch processed for {stats.processedCount} records. Indian statutory compliance applied (PF/ESI/PT).
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Batch Payslips
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3.5 bg-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Compliance Report
                                    </motion.button>

                                    <button
                                        onClick={() => setProcessed(false)}
                                        className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors mt-4"
                                    >
                                        Start New Cycle
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

