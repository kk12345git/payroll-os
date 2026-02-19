'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Save,
    ChevronRight,
    Mail,
    MessageSquare,
    Check,
} from 'lucide-react';
import Link from 'next/link';

interface NotificationSetting {
    id: string;
    category: string;
    name: string;
    description: string;
    email: boolean;
    inApp: boolean;
}

const MOCK_NOTIFICATIONS: NotificationSetting[] = [
    // Payroll
    { id: '1', category: 'Payroll', name: 'Payroll Processed', description: 'When monthly payroll is processed successfully', email: true, inApp: true },
    { id: '2', category: 'Payroll', name: 'Salary Slip Generated', description: 'When salary slip is generated for employees', email: true, inApp: false },
    { id: '3', category: 'Payroll', name: 'Payroll Errors', description: 'When errors occur during payroll processing', email: true, inApp: true },

    // Attendance
    { id: '4', category: 'Attendance', name: 'Late Arrival', description: 'When an employee marks attendance after work hours', email: false, inApp: true },
    { id: '5', category: 'Attendance', name: 'Absence Alert', description: 'When an employee is absent without leave', email: true, inApp: true },
    { id: '6', category: 'Attendance', name: 'Monthly Report Ready', description: 'When monthly attendance report is generated', email: true, inApp: false },

    // Leave
    { id: '7', category: 'Leave', name: 'New Leave Request', description: 'When an employee applies for leave', email: true, inApp: true },
    { id: '8', category: 'Leave', name: 'Leave Approved', description: 'When leave request is approved', email: true, inApp: true },
    { id: '9', category: 'Leave', name: 'Leave Rejected', description: 'When leave request is rejected', email: true, inApp: true },
    { id: '10', category: 'Leave', name: 'Leave Balance Low', description: 'When leave balance falls below threshold', email: false, inApp: true },

    // Employee
    { id: '11', category: 'Employee', name: 'New Employee Added', description: 'When a new employee is added to the system', email: true, inApp: false },
    { id: '12', category: 'Employee', name: 'Profile Updated', description: 'When employee profile is updated', email: false, inApp: true },
    { id: '13', category: 'Employee', name: 'Document Uploaded', description: 'When employee uploads a document', email: false, inApp: true },
];

export default function NotificationPreferencesPage() {
    const [notifications, setNotifications] = useState<NotificationSetting[]>(MOCK_NOTIFICATIONS);

    const categories = Array.from(new Set(notifications.map(n => n.category)));

    const toggleEmail = (id: string) => {
        setNotifications(prev => prev.map(notif =>
            notif.id === id ? { ...notif, email: !notif.email } : notif
        ));
    };

    const toggleInApp = (id: string) => {
        setNotifications(prev => prev.map(notif =>
            notif.id === id ? { ...notif, inApp: !notif.inApp } : notif
        ));
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/settings" className="hover:text-indigo-600">Settings</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Notifications</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Notification Preferences
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage email and in-app notification settings
                    </p>
                </div>

                <button className="btn-extreme">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Notifications</div>
                        <div className="text-3xl font-black text-slate-900">{notifications.length}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Enabled</div>
                        <div className="text-3xl font-black text-slate-900">
                            {notifications.filter(n => n.email).length}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-App Enabled</div>
                        <div className="text-3xl font-black text-slate-900">
                            {notifications.filter(n => n.inApp).length}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-6">
                {categories.map(category => {
                    const categoryNotifs = notifications.filter(n => n.category === category);

                    return (
                        <div key={category} className="card-extreme">
                            <h2 className="text-xl font-black text-slate-900 mb-6">{category} Notifications</h2>

                            <div className="space-y-3">
                                {categoryNotifs.map((notif, index) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-bold text-slate-900 mb-1">{notif.name}</div>
                                                <div className="text-sm text-slate-500">{notif.description}</div>
                                            </div>

                                            <div className="flex items-center gap-6 ml-6">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm font-semibold text-slate-600">Email</span>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={notif.email}
                                                            onChange={() => toggleEmail(notif.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-11 h-6 rounded-full transition-all ${notif.email ? 'bg-green-500' : 'bg-slate-300'
                                                            }`}>
                                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notif.email ? 'translate-x-6' : 'translate-x-0.5'
                                                                } translate-y-0.5`} />
                                                        </div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm font-semibold text-slate-600">In-App</span>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={notif.inApp}
                                                            onChange={() => toggleInApp(notif.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-11 h-6 rounded-full transition-all ${notif.inApp ? 'bg-blue-500' : 'bg-slate-300'
                                                            }`}>
                                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notif.inApp ? 'translate-x-6' : 'translate-x-0.5'
                                                                } translate-y-0.5`} />
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
