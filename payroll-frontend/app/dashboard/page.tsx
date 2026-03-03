"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    Users, TrendingUp, DollarSign, Calendar, ArrowUpRight,
    Building2, Clock, CheckCircle2, Sparkles, Activity,
    Banknote, Briefcase, FileText, ChevronRight, UserPlus,
    AlertCircle, FileClock, XCircle, Brain
} from 'lucide-react';
import Link from 'next/link';

import { useEmployeeStore } from '@/store/employeeStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useAutoPayOSStore } from '@/store/autopay-osStore';
import { useAuth } from '@/contexts/AuthContext';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useLeaveStore } from '@/store/leaveStore';
import { DashboardCharts } from '@/components/DashboardCharts';
import { cn } from '@/lib/utils';

// ---- Animation Config ----
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function fmt(n: number) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString()}`;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { employees } = useEmployeeStore();
    const { departments } = useDepartmentStore();
    const { autopayOSRecords, monthlySummaries, fetchAutoPayOSSummaries } = useAutoPayOSStore();
    const { leaveApplications, fetchLeaves } = useLeaveStore();
    const { attendanceRecords, getAttendanceByMonth } = useAttendanceStore();

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchAutoPayOSSummaries();
        fetchLeaves();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [fetchAutoPayOSSummaries, fetchLeaves]);

    // ---- Data Processing ----
    const activeHeadcount = employees.filter(e => e.is_active).length;
    const thisMonthJoiners = employees.filter(emp => {
        const jd = new Date(emp.date_of_joining);
        return jd.getMonth() === currentTime.getMonth() && jd.getFullYear() === currentTime.getFullYear();
    }).length;

    // Payroll Data
    const currentMonthData = (autopayOSRecords || []).filter(r => r.month === currentTime.getMonth() + 1 && r.year === currentTime.getFullYear());
    const monthlyBurn = currentMonthData.reduce((sum, r) => sum + (Number(r.net_pay) || 0), 0);
    const estBurn = monthlyBurn || (activeHeadcount * 55000) * 0.8;

    // Approvals Data
    const pendingLeaves = leaveApplications.filter(l => l.status === 'Pending').length;

    // Attendance Data
    const todayStr = currentTime.toISOString().split('T')[0];
    const todaysAttendance = attendanceRecords.filter(r => r.date === todayStr);
    const presentCount = todaysAttendance.filter(r => r.status === 'present').length;
    const attendanceRate = activeHeadcount > 0 ? Math.round((presentCount / activeHeadcount) * 100) : 0;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-[1600px] mx-auto min-h-screen px-4 sm:px-6 md:px-8 py-6 pb-24 space-y-6">

            {/* HERO SECTION - MOBILE RESPONSIVE */}
            <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/5 p-6 sm:p-10 shadow-2xl">
                {/* Background Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 h-full">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-indigo-400 tracking-widest uppercase">
                            <Sparkles size={14} /> AUTOPAY-OS OVERVIEW
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3 leading-tight">
                            Welcome back, <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                {user?.full_name?.split(' ')[0] || 'Admin'}
                            </span>.
                        </h1>
                        <p className="text-sm sm:text-base text-white/50 max-w-xl font-medium leading-relaxed">
                            Your workforce overview is ready. Stay on top of attendance, pending requests, and upcoming payroll.
                        </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-start md:items-end gap-2 text-left md:text-right mt-4 md:mt-0 border-t md:border-t-0 border-white/10 pt-4 md:pt-0 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-white/50 font-medium text-xs sm:text-sm">
                            <Clock size={14} />
                            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-widest font-mono">
                            {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* HIGH DENSITY STATS GRID */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {[
                    { title: "Active Headcount", value: activeHeadcount, sub: `${thisMonthJoiners > 0 ? '+' + thisMonthJoiners : '0'} new this month`, icon: Users, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
                    { title: "Today's Attendance", value: `${attendanceRate}%`, sub: `${presentCount} employees present`, icon: Activity, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                    { title: "Pending Approvals", value: pendingLeaves, sub: "Leave requests waiting", icon: FileClock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                    { title: "Payroll Run Rate", value: fmt(estBurn), sub: "Est. monthly cost", icon: DollarSign, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
                ].map((stat, i) => (
                    <div key={i} className="group relative rounded-2xl bg-white/[0.6] dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-4 sm:p-5 lg:p-6 transition-all shadow-sm">
                        <div className="absolute top-0 right-0 p-4 sm:p-5 md:p-6 opacity-30 md:opacity-20 group-hover:opacity-100 transition-opacity">
                            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.color}`}>
                                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                        <h3 className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-500 dark:text-white/40 uppercase mb-1 md:mb-2">{stat.title}</h3>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1 sm:mb-2">{stat.value}</p>
                        <p className="text-[9px] sm:text-xs text-slate-500 dark:text-white/40 font-medium">{stat.sub}</p>
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* CHARTS / ANALYTICS (Takes up 2/3 on desktop) */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-5 sm:p-6 lg:p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">Payroll Disbursements</h2>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-white/40">Historical trend tracking over the last 6 months</p>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto w-max">
                                <TrendingUp size={12} /> Stable
                            </div>
                        </div>
                        <DashboardCharts type="line" data={monthlySummaries} title="" />
                    </div>

                    {/* Pending Action Grid specific for Mobile-friendly density */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                                <FileClock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight mb-1">Leave Requests</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{pendingLeaves} new requests require approval.</p>
                                <Link href="/dashboard/attendance/leaves" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1">
                                    Review now <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight mb-1">Missing Setup</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Ensure all new joiners have salary structures.</p>
                                <Link href="/dashboard/autopay-os/salary-structure" className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 flex items-center gap-1">
                                    Fix now <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* SIDE COLUMN: QUICK ACTIONS & ALERTS */}
                <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                    {/* PRIMARY ACTION CARD */}
                    <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 relative z-10">Next Action</h3>
                        <h2 className="text-xl sm:text-2xl font-black mb-4 relative z-10 tracking-tight">Run {currentTime.toLocaleString('en-US', { month: 'long' })} Payroll</h2>
                        <ul className="space-y-2 mb-6 relative z-10 text-xs sm:text-sm font-medium text-white/80">
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-300" /> Attendance logs synced</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-300" /> Statutory rates active</li>
                        </ul>
                        <Link href="/dashboard/autopay-os" className="relative z-10 flex items-center justify-center gap-2 w-full py-3 sm:py-4 bg-white text-indigo-900 font-bold rounded-xl sm:rounded-2xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-md text-sm sm:text-base">
                            <Banknote size={18} /> Start AutoPay-OS
                        </Link>
                    </div>

                    {/* QUICK LINKS COMPACT MENU */}
                    <div className="rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-5 sm:p-6 space-y-3 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-white/40 mb-4 px-1">Quick Company Links</h3>
                        {[
                            { label: "Hire Employee", href: "/dashboard/employees", icon: UserPlus, bg: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                            { label: "Company Structure", href: "/dashboard/settings", icon: Building2, bg: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
                            { label: "Attendance & Leaves", href: "/dashboard/attendance", icon: Calendar, bg: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                            { label: "Ask HR AI Copilot", href: "/dashboard/copilot", icon: Brain, bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                        ].map((link, i) => (
                            <Link key={i} href={link.href} className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-transparent transition-all group">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${link.bg} transition-colors shrink-0`}>
                                    <link.icon size={16} />
                                </div>
                                <span className="font-semibold text-sm text-slate-700 dark:text-white/80 ml-3 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{link.label}</span>
                                <ChevronRight size={16} className="text-slate-400 dark:text-white/20 ml-auto group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>

                </motion.div>
            </div>

        </motion.div>
    );
}
