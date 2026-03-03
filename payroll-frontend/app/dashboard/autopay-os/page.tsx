"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, Users, CheckCircle2,
    Clock, PlayCircle, ShieldCheck, Download, Check, Briefcase, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAutoPayOSStore } from '@/store/autopay-osStore';
import { LoadingOverlay } from '@/components/Loading';


function formatCurrency(n: number) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString()}`;
}

export default function AutoPayOSHub() {
    const { employees, fetchEmployees, loading: empLoading } = useEmployeeStore();
    const {
        processAutoPayOS,
        loading: autopayOSLoading,
        autopayOSRecords,
        monthlySummaries,
        fetchAutoPayOSSummaries
    } = useAutoPayOSStore();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchEmployees();
        fetchAutoPayOSSummaries();
    }, [fetchEmployees, fetchAutoPayOSSummaries]);

    const activeEmployees = useMemo(() => employees.filter(e => e.is_active), [employees]);

    // Current Month Details
    const now = new Date();
    const currentMonthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const currentMonthNum = now.getMonth() + 1;
    const currentYearNum = now.getFullYear();

    // Check if payroll is already run for this month
    const currentMonthRecords = useMemo(() => {
        return autopayOSRecords.filter(r => r.month === currentMonthNum && r.year === currentYearNum);
    }, [autopayOSRecords, currentMonthNum, currentYearNum]);

    const hasRunPayroll = currentMonthRecords.length > 0 || success;

    // Calculate exact totals if already run, otherwise estimate for active employees
    const totalNetPay = hasRunPayroll
        ? currentMonthRecords.reduce((sum, r) => sum + Number(r.net_pay || 0), 0)
        : (activeEmployees.length * 52000); // Rough estimate for display before run

    const totalGrossPay = hasRunPayroll
        ? currentMonthRecords.reduce((sum, r) => sum + Number(r.gross_earnings || 0), 0)
        : (activeEmployees.length * 60000); // Rough estimate

    const totalDeductions = hasRunPayroll
        ? currentMonthRecords.reduce((sum, r) => sum + Number(r.total_deductions || 0), 0)
        : (totalGrossPay - totalNetPay);

    const handleRunPayroll = async () => {
        try {
            await processAutoPayOS(currentMonthNum, currentYearNum, activeEmployees.map(e => e.id));
            setSuccess(true);
            setIsConfirmOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (empLoading) return <LoadingOverlay />;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            {/* HERO / STATUS HEADER */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm tracking-widest uppercase mb-4">
                                <ShieldCheck size={16} /> AutoPay-OS Core
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                                Payroll cycle for <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {currentMonthLabel}
                                </span>
                            </h1>
                            <p className="text-slate-500 font-medium max-w-lg mt-4">
                                The smartest, fully automated HR & Payroll process. Run salaries for your entire organization in one click, fully compliant with Indian laws.
                            </p>
                        </div>

                        {/* STATUS BADGE */}
                        <div className="flex flex-col items-start md:items-end">
                            {hasRunPayroll ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold text-sm border border-emerald-100 shadow-sm mb-4">
                                    <CheckCircle2 size={16} /> Processed
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full font-bold text-sm border border-amber-100 shadow-sm mb-4">
                                    <Clock size={16} /> Pending Action
                                </div>
                            )}
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Company</p>
                                <p className="text-lg font-bold text-slate-800">Your Organization</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT AREA: ONE CLICK RUN & SUMMARY */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* THE BIG CTA BOX */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
                        >
                            {!hasRunPayroll ? (
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Ready to run payroll?</h2>
                                        <p className="text-slate-500 font-medium">AutoPay-OS has automatically synced all {activeEmployees.length} employees' attendance and leave records.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsConfirmOpen(true)}
                                        className="shrink-0 flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <PlayCircle size={20} />
                                        RUN PAYROLL
                                    </button>
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                            <Check size={24} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payroll is complete.</h2>
                                            <p className="text-slate-500 font-medium">Salaries and compliances successfully processed for {currentMonthLabel}.</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex gap-4">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                                            <Download size={16} /> Batch Download Payslips
                                        </button>
                                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors">
                                            <FileText size={16} /> View Ledger
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Background decoration for the box */}
                            {!hasRunPayroll && <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />}
                        </motion.div>

                        {/* HIGH LEVEL FINANCIALS */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Payroll Cost</div>
                                    <div className="text-3xl font-black text-slate-900 tracking-tight mb-2">₹{(totalGrossPay).toLocaleString()}</div>
                                    <div className="text-xs text-slate-400 font-medium">Total gross earnings</div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500" />
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Net Direct Deposit</div>
                                    <div className="text-3xl font-black text-green-600 tracking-tight mb-2">₹{(totalNetPay).toLocaleString()}</div>
                                    <div className="text-xs text-slate-400 font-medium">Total paid to employees</div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-500" />
                                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Taxes & Deductions</div>
                                    <div className="text-3xl font-black text-orange-500 tracking-tight mb-2">₹{(totalDeductions).toLocaleString()}</div>
                                    <div className="text-xs text-slate-400 font-medium">PF, ESI, TDS, PT</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT AREA: NAVIGATION AND PAST RUNS */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">AutoPay-OS Tools</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Salary Structures', href: '/dashboard/autopay-os/salary-structure', icon: Briefcase },
                                    { label: 'TDS & Form 16', href: '/dashboard/autopay-os/tds-forms', icon: FileText },
                                    { label: 'Income Tax Calculator', href: '/dashboard/autopay-os/tax-calculator', icon: CalendarIcon },
                                ].map((tool, i) => (
                                    <Link key={i} href={tool.href} className="flex items-center p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                        <div className="w-10 h-10 bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                                            <tool.icon size={18} />
                                        </div>
                                        <div className="ml-4 font-bold text-slate-700 group-hover:text-indigo-600 transition-colors text-sm">
                                            {tool.label}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recent History</h3>
                            {monthlySummaries.length > 0 ? (
                                <div className="space-y-4">
                                    {monthlySummaries.slice(0, 3).map((summary, idx) => {
                                        const d = new Date();
                                        d.setMonth(d.getMonth() - (idx + 1));
                                        return (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800 tracking-tight">{d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                                    <p className="text-xs text-slate-400 font-medium">Completed</p>
                                                </div>
                                                <p className="font-black text-slate-900 tracking-tight">
                                                    {formatCurrency(Number((summary as any).total_net_pay || (summary as any).total_net || 0))}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">No prior history available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CONFIRMATION OVERLAY */}
            <AnimatePresence>
                {isConfirmOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Confirm Payroll Run</h2>
                                <p className="text-slate-500 font-medium mt-2">
                                    You are about to execute the payroll cycle for <strong>{currentMonthLabel}</strong> for {activeEmployees.length} employees.
                                </p>

                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 my-6 text-amber-800 text-sm font-medium flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                                    <div>
                                        This action will calculate all gross earnings, apply statutory deductions (PF, ESI, TDS), and finalize net pay amounts.
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        disabled={autopayOSLoading}
                                        onClick={() => setIsConfirmOpen(false)}
                                        className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={autopayOSLoading}
                                        onClick={handleRunPayroll}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                                    >
                                        {autopayOSLoading ? (
                                            <>
                                                <Clock className="w-4 h-4 animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                Confirm & Run
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
