'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Download,
    ChevronRight,
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    FileText,
    Filter,
    Search,
} from 'lucide-react';
import Link from 'next/link';

interface EmployeeAttendance {
    id: string;
    name: string;
    department: string;
    daysPresent: number;
    daysAbsent: number;
    daysLate: number;
    leaves: number;
    percentage: number;
}

const MOCK_ATTENDANCE_REPORT: EmployeeAttendance[] = [
    { id: '1', name: 'Alexander Wright', department: 'Design', daysPresent: 20, daysAbsent: 1, daysLate: 2, leaves: 1, percentage: 91 },
    { id: '2', name: 'Sarah Chen', department: 'Engineering', daysPresent: 21, daysAbsent: 0, daysLate: 1, leaves: 1, percentage: 95 },
    { id: '3', name: 'Marcus Johnson', department: 'HR', daysPresent: 19, daysAbsent: 2, daysLate: 3, leaves: 0, percentage: 86 },
    { id: '4', name: 'Elena Rodriguez', department: 'Engineering', daysPresent: 22, daysAbsent: 0, daysLate: 0, leaves: 0, percentage: 100 },
    { id: '5', name: 'David Kim', department: 'Operations', daysPresent: 18, daysAbsent: 1, daysLate: 4, leaves: 1, percentage: 82 },
];

export default function MonthlyAttendanceReportPage() {
    const [selectedMonth, setSelectedMonth] = useState('2025-02');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const filteredReport = MOCK_ATTENDANCE_REPORT.filter(emp => {
        const matchesSearch = (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const totalStats = {
        totalEmployees: MOCK_ATTENDANCE_REPORT.length,
        avgPresent: Math.round(MOCK_ATTENDANCE_REPORT.reduce((sum, e) => sum + e.daysPresent, 0) / MOCK_ATTENDANCE_REPORT.length),
        avgPercentage: Math.round(MOCK_ATTENDANCE_REPORT.reduce((sum, e) => sum + e.percentage, 0) / MOCK_ATTENDANCE_REPORT.length),
        totalAbsent: MOCK_ATTENDANCE_REPORT.reduce((sum, e) => sum + e.daysAbsent, 0),
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        console.log(`Exporting to ${format}`);
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
                        <span className="text-indigo-600">Monthly Report</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Monthly Attendance Report
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Comprehensive attendance analysis and insights
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                    >
                        <option value="2025-02">February 2025</option>
                        <option value="2025-01">January 2025</option>
                        <option value="2024-12">December 2024</option>
                    </select>
                    <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Excel
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        PDF
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
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.totalEmployees}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Present Days</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.avgPresent}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Attendance</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.avgPercentage}%</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Absent Days</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.totalAbsent}</div>
                    </div>
                </motion.div>
            </div>

            {/* Report Table */}
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
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Present</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Absent</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Late</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Leaves</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Attendance %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredReport.map((employee) => (
                                <motion.tr
                                    key={employee.id}
                                    whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.02)' }}
                                    className="group transition-all"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {employee.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">{employee.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                                            {employee.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                                            {employee.daysPresent}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                                            {employee.daysAbsent}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold">
                                            {employee.daysLate}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                                            {employee.leaves}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${employee.percentage >= 90 ? 'bg-green-500' :
                                                            employee.percentage >= 80 ? 'bg-orange-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${employee.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className={`text-sm font-black ${employee.percentage >= 90 ? 'text-green-600' :
                                                employee.percentage >= 80 ? 'text-orange-600' : 'text-red-600'
                                                }`}>
                                                {employee.percentage}%
                                            </span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <div className="text-sm text-slate-600">
                        Showing <span className="font-bold text-slate-900">{filteredReport.length}</span> of{' '}
                        <span className="font-bold text-slate-900">{MOCK_ATTENDANCE_REPORT.length}</span> employees
                    </div>
                </div>
            </div>
        </div>
    );
}
