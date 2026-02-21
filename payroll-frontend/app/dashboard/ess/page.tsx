'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    ClipboardCheck,
    Calendar,
    FileText,
    TrendingUp,
    ChevronRight,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

export default function ESSDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchESSData = async () => {
            try {
                const response = await fetch('/api/me/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch ESS data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchESSData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic">
                        Employee <span className="text-primary tracking-tighter not-italic">Portal</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-bold uppercase tracking-widest text-[10px]">
                        Welcome back, <span className="text-foreground">{user?.full_name}</span> • {stats?.employee?.designation}
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Last Net Pay', value: `₹${stats?.stats?.last_net_pay?.toLocaleString()}`, icon: Wallet, color: 'indigo' },
                    { label: 'Pending Leaves', value: stats?.stats?.pending_leaves || 0, icon: Calendar, color: 'purple' },
                    { label: 'Attendance (MTD)', value: stats?.stats?.attendance_this_month || 0, icon: ClipboardCheck, color: 'pink' }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="p-8 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-border/50 relative group overflow-hidden"
                    >
                        <div className={cn(
                            "absolute -right-8 -top-8 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
                            stat.color === 'indigo' ? 'bg-indigo-500' : stat.color === 'purple' ? 'bg-purple-500' : 'bg-pink-500'
                        )} />

                        <stat.icon className={cn("w-6 h-6 mb-4", `text-${stat.color}-500`)} />
                        <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                        <p className="text-3xl font-black tracking-tighter text-foreground italic">{stat.value}</p>
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-xl overflow-hidden">
                    <div className="p-8 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-accent/5 to-transparent">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" />
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Recent Activity</h2>
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1 group">
                            View All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="p-4">
                        {stats?.recent_activity?.map((activity: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-accent/5 rounded-2xl transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {activity.type === 'attendance' ? 'A' : 'L'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground capitalize">{activity.type}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black">{new Date(activity.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    activity.status === 'present' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                )}>
                                    {activity.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform duration-700">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight mb-2 italic">Ready to optimize your taxes?</h2>
                        <p className="text-white/70 text-sm mb-6 max-w-[250px] font-bold">Use our AI-driven Tax Optimizer to maximize your savings this month.</p>
                        <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-xl">
                            Open Optimizer <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all text-left flex flex-col gap-4 group">
                            <FileText className="w-6 h-6 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Download</span>
                            <span className="font-bold text-sm">Last Payslip</span>
                        </button>
                        <button className="p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all text-left flex flex-col gap-4 group">
                            <Calendar className="w-6 h-6 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Request</span>
                            <span className="font-bold text-sm">Apply for Leave</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

