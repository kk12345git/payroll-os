'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Check,
    Clock,
    AlertCircle,
    IndianRupee,
} from 'lucide-react';

interface AutoPayOSEvent {
    date: string;
    status: 'completed' | 'pending' | 'processing';
    amount: number;
    employees: number;
}

export default function AutoPayOSCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // February 2026

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    // Mock payroll events
    const payrollEvents: Record<string, AutoPayOSEvent> = {
        '2026-02-28': {
            date: '2026-02-28',
            status: 'pending',
            amount: 4567890,
            employees: 156,
        },
        '2026-01-31': {
            date: '2026-01-31',
            status: 'completed',
            amount: 4423450,
            employees: 154,
        },
        '2025-12-31': {
            date: '2025-12-31',
            status: 'completed',
            amount: 4389120,
            employees: 152,
        },
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getEventForDate = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
            2,
            '0'
        )}-${String(day).padStart(2, '0')}`;
        return payrollEvents[dateStr];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'processing':
                return 'bg-yellow-500';
            case 'pending':
                return 'bg-blue-500';
            default:
                return 'bg-slate-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <Check className="w-4 h-4" />;
            case 'processing':
                return <Clock className="w-4 h-4" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

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
                        AutoPay-OS Calendar
                    </h1>
                    <p className="text-slate-600">View payroll schedule and history</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl"
                        >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={previousMonth}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-indigo-600" />
                                    </motion.button>
                                    <motion.button
                                        onClick={nextMonth}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5 text-indigo-600" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div
                                        key={day}
                                        className="text-center font-semibold text-slate-600 text-sm py-2"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {/* Empty cells for days before month starts */}
                                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}

                                {/* Days of the month */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const event = getEventForDate(day);
                                    const isToday =
                                        day === new Date().getDate() &&
                                        currentDate.getMonth() === new Date().getMonth() &&
                                        currentDate.getFullYear() === new Date().getFullYear();

                                    return (
                                        <motion.div
                                            key={day}
                                            whileHover={{ scale: event ? 1.05 : 1 }}
                                            className={`aspect-square p-2 rounded-xl border-2 transition-all ${isToday
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : event
                                                        ? 'border-slate-200 bg-white cursor-pointer hover:border-indigo-300 hover:shadow-lg'
                                                        : 'border-slate-100 bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex flex-col h-full">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span
                                                        className={`text-sm font-semibold ${isToday ? 'text-indigo-600' : 'text-slate-700'
                                                            }`}
                                                    >
                                                        {day}
                                                    </span>
                                                    {event && (
                                                        <div className={`p-1 ${getStatusColor(event.status)} rounded-full`}>
                                                            <div className="text-white">{getStatusIcon(event.status)}</div>
                                                        </div>
                                                    )}
                                                </div>
                                                {event && (
                                                    <div className="text-xs text-slate-600 mt-auto">
                                                        <div className="font-semibold">
                                                            ₹{(event.amount / 100000).toFixed(1)}L
                                                        </div>
                                                        <div className="text-slate-500">{event.employees} emp</div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar - Upcoming & Recent */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Legend */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl"
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Legend</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">Completed</div>
                                        <div className="text-sm text-slate-500">AutoPay-OS processed</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500 rounded-lg">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">Processing</div>
                                        <div className="text-sm text-slate-500">In progress</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">Pending</div>
                                        <div className="text-sm text-slate-500">Scheduled</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Upcoming AutoPay-OS */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold">Next AutoPay-OS</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm opacity-80">Date</div>
                                    <div className="text-2xl font-bold">28 Feb 2026</div>
                                </div>
                                <div>
                                    <div className="text-sm opacity-80">Amount</div>
                                    <div className="text-xl font-bold flex items-center gap-1">
                                        <IndianRupee className="w-5 h-5" />
                                        45,67,890
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm opacity-80">Employees</div>
                                    <div className="text-xl font-bold">156</div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-4 py-3 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Process Now
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Recent History */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl"
                        >
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent History</h3>
                            <div className="space-y-3">
                                {Object.values(payrollEvents)
                                    .filter((e) => e.status === 'completed')
                                    .map((event) => (
                                        <div
                                            key={event.date}
                                            className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-slate-800">
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <div className="p-1 bg-green-500 rounded-full">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                ₹{event.amount.toLocaleString()} • {event.employees} employees
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
