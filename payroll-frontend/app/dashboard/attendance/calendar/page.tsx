'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    Download,
    Upload,
    Filter,
    Search,
} from 'lucide-react';
import Link from 'next/link';

interface AttendanceData {
    date: string;
    day: string;
    present: number;
    absent: number;
    late: number;
    leaves: number;
}

const MOCK_ATTENDANCE: AttendanceData[] = [
    { date: '2025-02-01', day: 'Sat', present: 142, absent: 3, late: 8, leaves: 2 },
    { date: '2025-02-02', day: 'Sun', present: 0, absent: 0, late: 0, leaves: 0 },
    { date: '2025-02-03', day: 'Mon', present: 148, absent: 2, late: 5, leaves: 0 },
    { date: '2025-02-04', day: 'Tue', present: 150, absent: 1, late: 3, leaves: 1 },
    { date: '2025-02-05', day: 'Wed', present: 145, absent: 4, late: 6, leaves: 0 },
];

export default function AttendanceCalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // February 2025
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDay };
    };

    const { daysInMonth, firstDay } = getDaysInMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

    const getAttendanceForDate = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return MOCK_ATTENDANCE.find(a => a.date === dateStr);
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const totalStats = {
        avgPresent: 147,
        avgAbsent: 2.5,
        avgLate: 5.5,
        totalLeaves: 3,
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/attendance" className="hover:text-indigo-600">Attendance</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Calendar View</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Attendance Calendar
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Track daily attendance patterns and trends
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Upload className="w-4 h-4" />
                        Bulk Upload
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Present</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.avgPresent}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Absent</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.avgAbsent}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Late</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.avgLate}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">On Leave</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.totalLeaves}</div>
                    </div>
                </motion.div>
            </div>

            {/* Calendar */}
            <div className="card-extreme p-0 overflow-hidden">
                {/* Calendar Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">Click on any date to view detailed attendance</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-white rounded-lg transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-white rounded-lg transition-all"
                            >
                                <ChevronRight className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-wider py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {emptyDays.map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {days.map((day) => {
                            const attendance = getAttendanceForDate(day);
                            const isWeekend = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() === 0 ||
                                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() === 6;

                            return (
                                <motion.div
                                    key={day}
                                    whileHover={{ scale: 1.05 }}
                                    className={`aspect-square border-2 rounded-xl p-2 cursor-pointer transition-all ${attendance
                                            ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 hover:border-indigo-400'
                                            : isWeekend
                                                ? 'border-slate-100 bg-slate-50'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    onClick={() => attendance && setSelectedDate(attendance.date)}
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="text-sm font-black text-slate-900 mb-1">{day}</div>
                                        {attendance && attendance.present > 0 ? (
                                            <div className="flex-1 flex flex-col justify-end space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <span className="text-[10px] font-bold text-slate-600">{attendance.present}</span>
                                                </div>
                                                {attendance.absent > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                                        <span className="text-[10px] font-bold text-slate-600">{attendance.absent}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : isWeekend ? (
                                            <div className="flex-1 flex items-center justify-center">
                                                <span className="text-[10px] font-semibold text-slate-400">OFF</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-6 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="font-semibold text-slate-600">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="font-semibold text-slate-600">Absent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="font-semibold text-slate-600">Late</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="font-semibold text-slate-600">On Leave</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">
                            Details for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </h3>
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            <XCircle className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {(() => {
                        const data = MOCK_ATTENDANCE.find(a => a.date === selectedDate);
                        if (!data) return null;

                        return (
                            <div className="grid grid-cols-4 gap-6">
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="text-sm font-semibold text-green-700 mb-1">Present</div>
                                    <div className="text-3xl font-black text-green-600">{data.present}</div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div className="text-sm font-semibold text-red-700 mb-1">Absent</div>
                                    <div className="text-3xl font-black text-red-600">{data.absent}</div>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="text-sm font-semibold text-orange-700 mb-1">Late</div>
                                    <div className="text-3xl font-black text-orange-600">{data.late}</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="text-sm font-semibold text-purple-700 mb-1">On Leave</div>
                                    <div className="text-3xl font-black text-purple-600">{data.leaves}</div>
                                </div>
                            </div>
                        );
                    })()}
                </motion.div>
            )}
        </div>
    );
}
