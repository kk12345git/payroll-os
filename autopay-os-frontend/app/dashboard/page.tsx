"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
    Users,
    TrendingUp,
    DollarSign,
    Calendar,
    ArrowUpRight,
    Building2,
    Clock,
    CheckCircle2,
    Sparkles,
    Zap,
    ChevronRight,
    Brain,
    ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { useEmployeeStore } from '@/store/employeeStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useAutoPayOSStore } from '@/store/autopay-osStore';
import { useAnomalyStore } from '@/store/anomalyStore';

import { DashboardCharts } from '@/components/DashboardCharts';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

export default function DashboardPage() {
    // ... (rest of the logic remains same until return) ...
    // ...
    // (I will apply variants in the next block)
    // Get live data from stores
    const { employees } = useEmployeeStore();
    const { departments } = useDepartmentStore();
    const { autopay-osRecords, monthlySummaries, fetchAutoPayOSSummaries, loading: autopay-osLoading } = useAutoPayOSStore();
    const { anomalies, fetchAnomalies } = useAnomalyStore();

    React.useEffect(() => {
        fetchAutoPayOSSummaries();
        fetchAnomalies(false); // Fetch unresolved anomalies
    }, [fetchAutoPayOSSummaries, fetchAnomalies]);

    // Calculate department cost allocation for pie chart
    const deptCosts = React.useMemo(() => {
        return departments.map(dept => {
            const deptEmployees = employees.filter(e => e.department_id === dept.id);
            const totalCost = deptEmployees.reduce((sum, emp) => {
                const record = autopay-osRecords.find(r => r.employee_id === emp.id);
                return sum + (Number(record?.gross_earnings) || 0);
            }, 0);
            return { name: dept.name, value: totalCost };
        }).filter(d => d.value > 0);
    }, [departments, employees, autopay-osRecords]);

    // Calculate live stats
    const totalEmployees = employees.length;
    const activeDepartments = departments.length;

    // Calculate total monthly autopay-os
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentMonthAutoPayOS = (autopay-osRecords || [])
        .filter(record => record.month === currentMonth && record.year === currentYear)
        .reduce((sum, record) => sum + (Number(record.net_pay) || 0), 0);

    // Calculate new joiners this month
    const thisMonthJoiners = employees.filter(emp => {
        const joinDate = new Date(emp.date_of_joining);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length;

    const stats = [
        {
            label: "Total Employees",
            value: totalEmployees.toString(),
            change: thisMonthJoiners > 0 ? `+${thisMonthJoiners}` : "0",
            icon: Users,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-500/10 to-cyan-500/10"
        },
        {
            label: "Departments",
            value: activeDepartments.toString(),
            change: "+0",
            icon: Building2,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-500/10 to-pink-500/10"
        },
        {
            label: "Monthly AutoPay-OS",
            value: `₹${(currentMonthAutoPayOS / 100000).toFixed(1)}L`,
            change: "+0%",
            icon: TrendingUp,
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-500/10 to-emerald-500/10"
        },
        {
            label: "Active Employees",
            value: employees.filter(e => e.is_active).length.toString(),
            change: `${totalEmployees > 0 ? Math.round((employees.filter(e => e.is_active).length / totalEmployees) * 100) : 0}%`,
            icon: CheckCircle2,
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-500/10 to-red-500/10"
        },
    ];

    const quickActions = [
        { title: "Add Employee", icon: Users, href: "/dashboard/employees", color: "from-blue-500 to-cyan-500" },
        { title: "Process AutoPay-OS", icon: DollarSign, href: "/dashboard/autopay-os", color: "from-green-500 to-emerald-500" },
        { title: "View Reports", icon: TrendingUp, href: "/dashboard/reports", color: "from-purple-500 to-pink-500" },
        { title: "Manage Departments", icon: Building2, href: "/dashboard/departments", color: "from-orange-500 to-red-500" },
    ];

    const recentActivity = [
        { action: "New employee onboarded", user: "Sarah Chen", time: "2 hours ago", icon: Users, color: "text-blue-500" },
        { action: "AutoPay-OS processed", user: "System", time: "5 hours ago", icon: CheckCircle2, color: "text-green-500" },
        { action: "Leave request approved", user: "John Doe", time: "1 day ago", icon: Calendar, color: "text-purple-500" },
        { action: "Department created", user: "Admin", time: "2 days ago", icon: Building2, color: "text-orange-500" },
    ];

    if (autopay-osLoading && monthlySummaries.length === 0) {
        return (
            <div className="space-y-8 pb-12">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <Skeleton variant="text" className="w-24" />
                        <Skeleton variant="text" className="w-48 h-8" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-2 h-[300px]" />
                    <Skeleton className="lg:col-span-1 h-[300px]" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-12"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <span className="text-indigo-600">Command Center</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Welcome Back! 👋
                    </h1>
                    <p className="text-slate-500 font-medium">Here&apos;s what&apos;s happening with your organization today.</p>
                </div>
                <button className="btn-extreme">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Report
                </button>
            </motion.div>

            {/* AI Intelligence Center */}
            {anomalies.length > 0 && (
                <motion.div
                    variants={itemVariants}
                    className="p-1 rounded-[2rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/10"
                >
                    {/* ... (rest of AI Center stays same) ... */}
                    <div className="bg-card/95 backdrop-blur-xl rounded-[1.85rem] p-8">
                        {/* (I'll keep the inner content for brevity or replace carefully) */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                    <Brain className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">AI Intelligence <span className="text-indigo-600">Center</span></h2>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic">Automated Risk & Anomaly Audit Active</p>
                                </div>
                            </div>
                            <div className="px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                {anomalies.length} Critical Observations
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {anomalies.slice(0, 3).map((anomaly) => (
                                <div
                                    key={anomaly.id}
                                    className="p-6 rounded-2xl bg-muted/40 border-2 border-transparent hover:border-indigo-500/30 transition-all group overflow-hidden relative"
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                                anomaly.severity === 'high' || anomaly.severity === 'critical' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                <ShieldAlert className="w-5 h-5 transition-transform group-hover:scale-110" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{anomaly.type.replace('_', ' ')}</span>
                                        </div>
                                        <h4 className="font-black text-foreground mb-2 line-clamp-1">{anomaly.title}</h4>
                                        <p className="text-xs font-medium text-muted-foreground mb-6 line-clamp-2 italic">{anomaly.description}</p>
                                        <Link
                                            href={`/dashboard/autopay-os`}
                                            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/link"
                                        >
                                            Investigate Now
                                            <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="card-extreme group hover:scale-105 transition-transform duration-300 relative overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <div className={cn(
                            "absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500",
                            stat.gradient
                        )} />

                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-black text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.change}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <DashboardCharts
                        type="line"
                        data={monthlySummaries}
                        title="Disbursement Trends"
                    />
                </div>
                <div className="lg:col-span-1">
                    <DashboardCharts
                        type="pie"
                        data={deptCosts}
                        title="Department Allocation"
                    />
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link key={action.title} href={action.href}>
                            <div className="card-extreme group hover:scale-105 transition-all duration-300 cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-sm font-black text-slate-900">{action.title}</div>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors absolute top-4 right-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                </h2>
                <div className="card-extreme">
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50/50 transition-colors group"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${activity.color} group-hover:scale-110 transition-transform`}>
                                    <activity.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm text-slate-900">{activity.action}</div>
                                    <div className="text-xs text-slate-500">{activity.user}</div>
                                </div>
                                <div className="text-xs font-bold text-slate-400">{activity.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
