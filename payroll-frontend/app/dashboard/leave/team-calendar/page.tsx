'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Users,
    Filter,
    Download,
    User,
} from 'lucide-react';
import Link from 'next/link';

interface LeaveEntry {
    employeeId: string;
    employeeName: string;
    department: string;
    startDate: string;
    endDate: string;
    type: 'casual' | 'sick' | 'vacation' | 'personal';
    status: 'approved' | 'pending' | 'rejected';
}

const MOCK_LEAVES: LeaveEntry[] = [
    { employeeId: '1', employeeName: 'Alexander Wright', department: 'Design', startDate: '2025-02-03', endDate: '2025-02-05', type: 'vacation', status: 'approved' },
    { employeeId: '2', employeeName: 'Sarah Chen', department: 'Engineering', startDate: '2025-02-10', endDate: '2025-02-12', type: 'sick', status: 'approved' },
    { employeeId: '3', employeeName: 'Marcus Johnson', department: 'HR', startDate: '2025-02-15', endDate: '2025-02-15', type: 'casual', status: 'approved' },
    { employeeId: '4', employeeName: 'Elena Rodriguez', department: 'Engineering', startDate: '2025-02-20', endDate: '2025-02-22', type: 'vacation', status: 'pending' },
    { employeeId: '5', employeeName: 'David Kim', department: 'Operations', startDate: '2025-02-25', endDate: '2025-02-28', type: 'personal', status: 'approved' },
];

export default function LeaveCalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 1, 1)); // February 2025
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

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

    const getLeavesForDate = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return MOCK_LEAVES.filter(leave => {
            const matchesDepartment = selectedDepartment === 'all' || leave.department === selectedDepartment;
            const matchesType = selectedType === 'all' || leave.type === selectedType;
            const isInRange = dateStr >= leave.startDate && dateStr <= leave.endDate;
            return matchesDepartment && matchesType && isInRange;
        });
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const getTypeColor = (type: string) => {
        const colors = {
            casual: 'bg-blue-100 text-blue-700 border-blue-200',
            sick: 'bg-red-100 text-red-700 border-red-200',
            vacation: 'bg-purple-100 text-purple-700 border-purple-200',
            personal: 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return colors[type as keyof typeof colors] || colors.casual;
    };

    const totalOnLeave = MOCK_LEAVES.filter(l => l.status === 'approved').length;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/leave" className="hover:text-indigo-600">Leave</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Team Calendar</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Team Leave Calendar
                    </h1>
                    <p className="text-slate-500 font-medium">
                        View team availability and upcoming leaves
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                    <Download className="w-4 h-4" />
                    Export Calendar
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total on Leave</div>
                        <div className="text-3xl font-black text-slate-900">{totalOnLeave}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Casual Leaves</div>
                        <div className="text-3xl font-black text-slate-900">{MOCK_LEAVES.filter(l => l.type === 'casual').length}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sick Leaves</div>
                        <div className="text-3xl font-black text-slate-900">{MOCK_LEAVES.filter(l => l.type === 'sick').length}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vacation Leaves</div>
                        <div className="text-3xl font-black text-slate-900">{MOCK_LEAVES.filter(l => l.type === 'vacation').length}</div>
                    </div>
                </motion.div>
            </div>

            {/* Calendar */}
            <div className="card-extreme p-0 overflow-hidden">
                {/* Filters */}
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                        >
                            <option value="all">All Departments</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="HR">HR</option>
                            <option value="Operations">Operations</option>
                        </select>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                        >
                            <option value="all">All Leave Types</option>
                            <option value="casual">Casual</option>
                            <option value="sick">Sick</option>
                            <option value="vacation">Vacation</option>
                            <option value="personal">Personal</option>
                        </select>
                    </div>
                </div>

                {/* Calendar Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h2>
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
                            <div key={`empty-${i}`} className="min-h-[120px]" />
                        ))}
                        {days.map((day) => {
                            const leaves = getLeavesForDate(day);
                            const isWeekend = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() === 0 ||
                                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getDay() === 6;

                            return (
                                <div
                                    key={day}
                                    className={`min-h-[120px] border-2 rounded-xl p-2 ${isWeekend ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'
                                        }`}
                                >
                                    <div className="text-sm font-black text-slate-900 mb-2">{day}</div>
                                    <div className="space-y-1">
                                        {leaves.slice(0, 3).map((leave, idx) => (
                                            <div
                                                key={idx}
                                                className={`text-[10px] font-bold px-2 py-1 rounded border ${getTypeColor(leave.type)} truncate`}
                                                title={`${leave.employeeName} - ${leave.type}`}
                                            >
                                                {leave.employeeName.split(' ')[0]}
                                            </div>
                                        ))}
                                        {leaves.length > 3 && (
                                            <div className="text-[9px] font-bold text-slate-500 px-2">
                                                +{leaves.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-6 text-xs flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
                            <span className="font-semibold text-slate-600">Casual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
                            <span className="font-semibold text-slate-600">Sick</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-200" />
                            <span className="font-semibold text-slate-600">Vacation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200" />
                            <span className="font-semibold text-slate-600">Personal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
