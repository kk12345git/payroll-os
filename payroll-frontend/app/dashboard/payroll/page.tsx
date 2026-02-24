'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    TrendingUp,
    Users,
    IndianRupee,
    FileText,
    Calculator,
    ArrowRight,
    DollarSign,
} from 'lucide-react';
import Link from 'next/link';

export default function AutoPayOSPage() {
    const stats = [
        {
            title: 'Total AutoPay-OS',
            value: '₹45,67,890',
            change: '+12.5%',
            icon: IndianRupee,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            title: 'Employees',
            value: '156',
            change: '+8',
            icon: Users,
            color: 'from-purple-500 to-pink-600',
        },
        {
            title: 'Avg. Salary',
            value: '₹29,280',
            change: '+5.2%',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-600',
        },
        {
            title: 'Pending Approvals',
            value: '12',
            change: '-3',
            icon: FileText,
            color: 'from-orange-500 to-red-600',
        },
    ];

    const quickActions = [
        {
            title: 'Salary Structure Builder',
            description: 'Create and manage salary structures',
            icon: Calculator,
            href: '/dashboard/payroll/salary-structure',
            color: 'from-indigo-500 to-purple-600',
        },
        {
            title: 'Assign Salary',
            description: 'Assign salary templates to employees',
            icon: Users,
            href: '/dashboard/payroll/assign',
            color: 'from-pink-500 to-rose-600',
        },
        {
            title: 'Run AutoPay-OS',
            description: 'Process monthly payroll for all employees',
            icon: DollarSign,
            href: '/dashboard/payroll/run',
            color: 'from-green-500 to-emerald-600',
        },
        {
            title: 'Income Tax Calculator',
            description: 'Calculate tax - Old vs New regime',
            icon: Calculator,
            href: '/dashboard/payroll/tax-calculator',
            color: 'from-orange-500 to-amber-600',
        },
        {
            title: 'TDS Forms (16 & 24Q)',
            description: 'Generate Form 16 and Form 24Q',
            icon: FileText,
            href: '/dashboard/payroll/tds-forms',
            color: 'from-red-500 to-pink-600',
        },
        {
            title: 'Salary Slips',
            description: 'Generate and download salary slips',
            icon: FileText,
            href: '/dashboard/payroll/slips',
            color: 'from-blue-500 to-cyan-600',
        },
        {
            title: 'AutoPay-OS Calendar',
            description: 'View payroll schedule and history',
            icon: Calendar,
            href: '/dashboard/payroll/calendar',
            color: 'from-purple-500 to-pink-600',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        AutoPay-OS Management
                    </h1>
                    <p className="text-slate-600">
                        Manage salaries, process payroll, and ensure compliance
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span
                                    className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.title}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quickActions.map((action, index) => (
                            <Link key={action.title} href={action.href}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-4 bg-gradient-to-br ${action.color} rounded-xl`}>
                                            <action.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{action.title}</h3>
                                    <p className="text-slate-600">{action.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Recent AutoPay-OS Runs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl"
                >
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent AutoPay-OS Runs</h2>
                    <div className="space-y-4">
                        {[
                            { month: 'January 2026', amount: '₹45,67,890', employees: 156, status: 'Completed' },
                            { month: 'December 2025', amount: '₹44,23,450', employees: 154, status: 'Completed' },
                            { month: 'November 2025', amount: '₹43,89,120', employees: 152, status: 'Completed' },
                        ].map((run, index) => (
                            <motion.div
                                key={run.month}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.0 + index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">{run.month}</div>
                                        <div className="text-sm text-slate-500">{run.employees} employees</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-800">{run.amount}</div>
                                    <div className="text-sm text-green-600">{run.status}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
