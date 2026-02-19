'use client';

import { motion } from 'framer-motion';
import {
    Building,
    Shield,
    Layers,
    Users,
    Mail,
    Bell,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const SETTINGS_FEATURES = [
    {
        title: 'Company Profile',
        description: 'Manage company information and statutory details',
        icon: Building,
        href: '/dashboard/settings/company',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        title: 'Statutory Settings',
        description: 'Configure PF, ESI, PT, and LWF rates',
        icon: Shield,
        href: '/dashboard/settings/statutory',
        color: 'from-green-500 to-emerald-600',
    },
    {
        title: 'Salary Components',
        description: 'Manage earnings and deduction components',
        icon: Layers,
        href: '/dashboard/settings/salary-components',
        color: 'from-purple-500 to-pink-600',
    },
    {
        title: 'User Roles & Permissions',
        description: 'Configure user access and permissions',
        icon: Users,
        href: '/dashboard/settings/roles',
        color: 'from-orange-500 to-amber-600',
    },
    {
        title: 'Email Templates',
        description: 'Customize automated email notifications',
        icon: Mail,
        href: '/dashboard/settings/email-templates',
        color: 'from-pink-500 to-rose-600',
    },
    {
        title: 'Notification Preferences',
        description: 'Manage email and in-app notifications',
        icon: Bell,
        href: '/dashboard/settings/notifications',
        color: 'from-cyan-500 to-blue-600',
    },
];

export default function SettingsPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-indigo-600">Settings</span>
                </nav>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                    Settings & Configuration
                </h1>
                <p className="text-slate-500 font-medium">
                    Configure system settings, statutory rates, and preferences
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SETTINGS_FEATURES.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={feature.href}>
                            <div className="card-extreme group cursor-pointer hover:shadow-2xl transition-all h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 font-medium">{feature.description}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* System Info */}
            <div className="card-extreme bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200">
                <h2 className="text-xl font-black text-slate-900 mb-6">System Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="text-sm font-semibold text-slate-600 mb-1">Company Name</div>
                        <div className="text-lg font-black text-slate-900">KRG Digital Solutions</div>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-600 mb-1">Financial Year</div>
                        <div className="text-lg font-black text-slate-900">April - March</div>
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-600 mb-1">Total Employees</div>
                        <div className="text-lg font-black text-slate-900">155</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
