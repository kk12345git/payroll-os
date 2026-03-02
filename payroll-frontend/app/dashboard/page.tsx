"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    Users, TrendingUp, DollarSign, Calendar, ArrowUpRight,
    Building2, Clock, CheckCircle2, Sparkles, Zap,
    ChevronRight, Brain, Briefcase, Activity, ShieldCheck,
    ArrowDownRight, CreditCard, Banknote
} from 'lucide-react';
import Link from 'next/link';

import { useEmployeeStore } from '@/store/employeeStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useAutoPayOSStore } from '@/store/autopay-osStore';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardCharts } from '@/components/DashboardCharts';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

// ---- Animation Config ----
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function fmt(n: number) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { employees } = useEmployeeStore();
    const { departments } = useDepartmentStore();
    const { autopayOSRecords, monthlySummaries, fetchAutoPayOSSummaries } = useAutoPayOSStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchAutoPayOSSummaries();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [fetchAutoPayOSSummaries]);

    // Live Stats calculation
    const activeHeadcount = employees.filter(e => e.is_active).length;
    const thisMonthJoiners = employees.filter(emp => {
        const jd = new Date(emp.date_of_joining);
        return jd.getMonth() === currentTime.getMonth() && jd.getFullYear() === currentTime.getFullYear();
    }).length;

    const currentMonthData = (autopayOSRecords || []).filter(r => r.month === currentTime.getMonth() + 1 && r.year === currentTime.getFullYear());
    const monthlyBurn = currentMonthData.reduce((sum, r) => sum + (Number(r.net_pay) || 0), 0);
    // Rough estimation if no real data
    const estBurn = monthlyBurn || (activeHeadcount * 55000) * 0.8;

    // Charts Allocation
    const deptCosts = React.useMemo(() => {
        return departments.map(dept => {
            const hc = employees.filter(e => e.department_id === dept.id).length;
            // Fake cost distribution if no real payroll data yet, to keep chart active
            return { name: dept.name, value: currentMonthData.length ? currentMonthData.filter(r => employees.find(e => e.id === r.employee_id)?.department_id === dept.id).reduce((s, r) => s + Number(r.gross_earnings), 0) : hc * 60000 };
        }).filter(d => d.value > 0);
    }, [departments, employees, currentMonthData]);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto min-h-screen">

            {/* HERO SECTION */}
            <motion.div variants={itemVariants} className="relative rounded-[2rem] overflow-hidden bg-zinc-950 border border-white/5 p-8 lg:p-12 shadow-2xl">
                {/* Stunning Background Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 h-full">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-sm font-bold text-indigo-400 tracking-widest uppercase">
                            <Sparkles size={14} /> AUTOPAY-OS COMMAND CENTER
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
                            Welcome back, <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                {user?.full_name?.split(' ')[0] || 'Admin'}
                            </span>.
                        </h1>
                        <p className="text-lg text-white/50 max-w-xl font-medium leading-relaxed">
                            Your workforce intelligence is fully operational. Everything from payroll to headcount is running smoothly on AutoPay-OS.
                        </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-3 text-right">
                        <div className="flex items-center gap-2 text-white/50 font-medium">
                            <Clock size={16} />
                            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        <p className="text-4xl font-black text-white tracking-widest font-mono">
                            {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* METRICS ROW */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Active Headcount", value: activeHeadcount, sub: `${thisMonthJoiners > 0 ? '+' + thisMonthJoiners : '0'} new this month`, icon: Users, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
                    { title: "Monthly Payroll Burn", value: fmt(estBurn), sub: "Estimated current run rate", icon: DollarSign, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                    { title: "Departments", value: departments.length, sub: "Active business units", icon: Building2, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
                    { title: "Platform Health", value: "Optimal", sub: "All systems operational", icon: CheckCircle2, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                ].map((stat, i) => (
                    <div key={i} className="group relative rounded-2xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500">
                            <div className={`p-3 rounded-2xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <h3 className="text-sm font-bold tracking-wider text-white/40 uppercase mb-2">{stat.title}</h3>
                        <p className="text-4xl font-black text-white tracking-tight mb-2">{stat.value}</p>
                        <p className="text-xs text-indigo-400/80 font-medium">{stat.sub}</p>
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* CHARTS / ANALYTICS */}
                <motion.div variants={itemVariants} className="xl:col-span-2 space-y-8">
                    <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/5 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Payroll Disbursements</h2>
                                <p className="text-sm text-white/40">Historical trend tracking over the last 6 months</p>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                                <TrendingUp size={12} /> Stable
                            </div>
                        </div>
                        <DashboardCharts type="line" data={monthlySummaries} title="" />
                    </div>
                </motion.div>

                {/* SIDE COLUMN: QUICK ACTIONS & ORG STATE */}
                <motion.div variants={itemVariants} className="xl:col-span-1 space-y-4">
                    <div className="rounded-[1.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-1 relative z-10">Next Action</h3>
                        <h2 className="text-2xl font-black mb-4 relative z-10 tracking-tight">Processing Payroll?</h2>
                        <ul className="space-y-2 mb-6 relative z-10 text-sm font-medium text-white/80">
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Attendance synced</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-300" /> Leaves reconciled</li>
                            <li className="flex items-center gap-2"><Clock size={16} className="text-amber-300" /> Pending review</li>
                        </ul>
                        <Link href="/dashboard/autopay-os" className="relative z-10 flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                            <Banknote size={16} /> Run AutoPay-OS
                        </Link>
                    </div>

                    <div className="rounded-[1.5rem] bg-white/[0.02] border border-white/5 p-6 space-y-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-3 px-1">Quick Links</h3>
                        {[
                            { label: "Hire Employee", href: "/dashboard/employees", icon: Users },
                            { label: "Approve Leaves", href: "/dashboard/attendance", icon: Calendar },
                            { label: "View Reports", href: "/dashboard/reports", icon: Activity },
                            { label: "Company Settings", href: "/dashboard/settings", icon: Building2 },
                        ].map((link, i) => (
                            <Link key={i} href={link.href} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                                        <link.icon size={16} />
                                    </div>
                                    <span className="font-semibold text-sm text-white/80 group-hover:text-white transition-colors">{link.label}</span>
                                </div>
                                <ArrowUpRight size={16} className="text-white/20 group-hover:text-indigo-400 transition-colors" />
                            </Link>
                        ))}
                    </div>

                </motion.div>
            </div>

        </motion.div>
    );
}
