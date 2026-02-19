'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    TrendingDown,
    AlertTriangle,
    ChevronRight,
    Download,
    Search,
    Filter,
    Calendar,
    Users,
} from 'lucide-react';
import Link from 'next/link';

interface LateEarlyRecord {
    id: string;
    employeeName: string;
    department: string;
    date: string;
    checkIn: string;
    checkOut: string;
    expectedIn: string;
    expectedOut: string;
    lateBy: string;
    earlyBy: string;
    status: 'late' | 'early' | 'both' | 'ontime';
}

const MOCK_RECORDS: LateEarlyRecord[] = [
    { id: '1', employeeName: 'Alexander Wright', department: 'Design', date: '2025-02-17', checkIn: '10:15 AM', checkOut: '06:00 PM', expectedIn: '09:00 AM', expectedOut: '06:00 PM', lateBy: '75 min', earlyBy: '-', status: 'late' },
    { id: '2', employeeName: 'Sarah Chen', department: 'Engineering', date: '2025-02-17', checkIn: '09:05 AM', checkOut: '05:30 PM', expectedIn: '09:00 AM', expectedOut: '06:00 PM', lateBy: '5 min', earlyBy: '30 min', status: 'both' },
    { id: '3', employeeName: 'Marcus Johnson', department: 'HR', date: '2025-02-17', checkIn: '08:55 AM', checkOut: '05:45 PM', expectedIn: '09:00 AM', expectedOut: '06:00 PM', lateBy: '-', earlyBy: '15 min', status: 'early' },
    { id: '4', employeeName: 'Elena Rodriguez', department: 'Engineering', date: '2025-02-17', checkIn: '09:20 AM', checkOut: '06:05 PM', expectedIn: '09:00 AM', expectedOut: '06:00 PM', lateBy: '20 min', earlyBy: '-', status: 'late' },
    { id: '5', employeeName: 'David Kim', department: 'Operations', date: '2025-02-17', checkIn: '08:58 AM', checkOut: '06:02 PM', expectedIn: '09:00 AM', expectedOut: '06:00 PM', lateBy: '-', earlyBy: '-', status: 'ontime' },
];

export default function LateEarlyTrackingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedDate, setSelectedDate] = useState('2025-02-17');

    const filteredRecords = MOCK_RECORDS.filter(record => {
        const matchesSearch = (record.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
        const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const stats = {
        totalLate: MOCK_RECORDS.filter(r => r.status === 'late' || r.status === 'both').length,
        totalEarly: MOCK_RECORDS.filter(r => r.status === 'early' || r.status === 'both').length,
        avgLateTime: '32 min',
        repeatOffenders: 12,
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            late: 'bg-red-100 text-red-700 border-red-200',
            early: 'bg-orange-100 text-orange-700 border-orange-200',
            both: 'bg-purple-100 text-purple-700 border-purple-200',
            ontime: 'bg-green-100 text-green-700 border-green-200',
        };
        return badges[status as keyof typeof badges];
    };

    const getStatusText = (status: string) => {
        const text = {
            late: 'Late Arrival',
            early: 'Early Departure',
            both: 'Late & Early',
            ontime: 'On Time',
        };
        return text[status as keyof typeof text];
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
                        <span className="text-indigo-600">Late/Early Tracking</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Late & Early Departure Tracking
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Monitor punctuality and track irregular timings
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                    />
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
                        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Late Arrivals</div>
                        <div className="text-3xl font-black text-slate-900">{stats.totalLate}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Early Departures</div>
                        <div className="text-3xl font-black text-slate-900">{stats.totalEarly}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Late Time</div>
                        <div className="text-3xl font-black text-slate-900">{stats.avgLateTime}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repeat Offenders</div>
                        <div className="text-3xl font-black text-slate-900">{stats.repeatOffenders}</div>
                    </div>
                </motion.div>
            </div>

            {/* Filters & Table */}
            <div className="card-extreme p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-extreme !py-2.5 !pl-10 text-sm"
                            />
                        </div>
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
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="late">Late Arrival</option>
                            <option value="early">Early Departure</option>
                            <option value="both">Both</option>
                            <option value="ontime">On Time</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Check In</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Check Out</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Late By</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Early By</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredRecords.map((record) => (
                                <motion.tr
                                    key={record.id}
                                    whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.02)' }}
                                    className="group transition-all"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {record.employeeName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">{record.employeeName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                                            {record.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900">{record.checkIn}</div>
                                        <div className="text-xs text-slate-500">Expected: {record.expectedIn}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900">{record.checkOut}</div>
                                        <div className="text-xs text-slate-500">Expected: {record.expectedOut}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {record.lateBy !== '-' ? (
                                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                {record.lateBy}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {record.earlyBy !== '-' ? (
                                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                                                {record.earlyBy}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(record.status)}`}>
                                            {getStatusText(record.status)}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
