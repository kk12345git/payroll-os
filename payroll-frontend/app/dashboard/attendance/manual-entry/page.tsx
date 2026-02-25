"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Save,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    ChevronRight,
    Upload,
} from 'lucide-react';
import Link from 'next/link';
import { useAttendanceStore } from '@/store/attendanceStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useToast } from '@/store/toastStore';
import { ResponsiveTable } from '@/components/ResponsiveTable';
import type { AttendanceRecord, Employee } from '@/lib/api';

export default function ManualAttendancePage() {
    const { employees } = useEmployeeStore();
    const { addAttendanceRecord, bulkAddAttendance, attendanceRecords } = useAttendanceStore();
    const toast = useToast();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState<Record<number, { status: string; checkIn: string; checkOut: string }>>({});
    const [searchQuery, setSearchQuery] = useState('');

    // Initialize attendance for all employees when date changes
    React.useEffect(() => {
        const data: Record<number, { status: string; checkIn: string; checkOut: string }> = {};
        employees.forEach(emp => {
            const existing = attendanceRecords.find(
                rec => rec.employee_id === emp.id && rec.date === selectedDate
            );

            data[emp.id] = {
                status: existing?.status || 'present',
                checkIn: existing?.check_in || '09:00',
                checkOut: existing?.check_out || '18:00',
            };
        });
        setAttendanceData(data);
    }, [selectedDate, employees, attendanceRecords]);

    const handleStatusChange = (employeeId: number, status: string) => {
        setAttendanceData(prev => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                status,
            },
        }));
    };

    const handleTimeChange = (employeeId: number, field: 'checkIn' | 'checkOut', value: string) => {
        setAttendanceData(prev => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                [field]: value,
            },
        }));
    };

    const handleSaveAttendance = () => {
        const records: any[] = [];

        Object.entries(attendanceData).forEach(([employeeId, data]) => {
            records.push({
                employee_id: parseInt(employeeId),
                date: selectedDate,
                status: data.status,
                check_in: data.status === 'present' || data.status === 'half-day' ? data.checkIn : undefined,
                check_out: data.status === 'present' ? data.checkOut : undefined,
                work_location: 'office'
            });
        });

        bulkAddAttendance(records as any);
        toast.success(`Attendance saved for ${records.length} employees on ${selectedDate}!`, 3000);
    };

    const filteredEmployees = employees.filter(emp =>
        (emp.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate stats
    const presentCount = Object.values(attendanceData).filter(a => a.status === 'present').length;
    const absentCount = Object.values(attendanceData).filter(a => a.status === 'absent').length;
    const leaveCount = Object.values(attendanceData).filter(a => a.status === 'leave').length;
    const halfDayCount = Object.values(attendanceData).filter(a => a.status === 'half-day').length;

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
                        <span className="text-indigo-600">Manual Entry</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Manual Attendance Entry
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Mark attendance for all employees
                    </p>
                </div>

                <button onClick={handleSaveAttendance} className="btn-extreme">
                    <Save className="w-4 h-4 mr-2" />
                    Save Attendance
                </button>
            </div>

            {/* Date Selector & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-1 card-extreme">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input-extreme"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme bg-green-50 border-2 border-green-200"
                >
                    <div className="flex items-center justify-between">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <div className="text-right">
                            <div className="text-sm font-semibold text-green-700">Present</div>
                            <div className="text-2xl font-black text-green-900">{presentCount}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme bg-red-50 border-2 border-red-200"
                >
                    <div className="flex items-center justify-between">
                        <XCircle className="w-8 h-8 text-red-600" />
                        <div className="text-right">
                            <div className="text-sm font-semibold text-red-700">Absent</div>
                            <div className="text-2xl font-black text-red-900">{absentCount}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme bg-blue-50 border-2 border-blue-200"
                >
                    <div className="flex items-center justify-between">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <div className="text-right">
                            <div className="text-sm font-semibold text-blue-700">On Leave</div>
                            <div className="text-2xl font-black text-blue-900">{leaveCount}</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme bg-orange-50 border-2 border-orange-200"
                >
                    <div className="flex items-center justify-between">
                        <Clock className="w-8 h-8 text-orange-600" />
                        <div className="text-right">
                            <div className="text-sm font-semibold text-orange-700">Half Day</div>
                            <div className="text-2xl font-black text-orange-900">{halfDayCount}</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search */}
            <div className="card-extreme">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-extreme"
                />
            </div>

            {/* Attendance Table */}
            <ResponsiveTable<Employee>
                data={filteredEmployees}
                columns={[
                    {
                        key: 'full_name',
                        label: 'Employee',
                        render: (emp: Employee) => (
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900">{emp.full_name}</span>
                                <span className="text-xs text-slate-500 font-medium">{emp.employee_code || `EMP00${emp.id}`}</span>
                            </div>
                        )
                    },
                    {
                        key: 'department_id',
                        label: 'Department',
                        render: (emp: Employee) => {
                            const { departments } = useDepartmentStore.getState();
                            const dept = (departments || []).find(d => d.id === emp.department_id);
                            return <span className="font-semibold text-slate-600">{dept?.name || 'Unassigned'}</span>
                        }
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        render: (emp: Employee) => {
                            const att = attendanceData[emp.id] || { status: 'present', checkIn: '09:00', checkOut: '18:00' };
                            return (
                                <select
                                    value={att.status}
                                    onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                                    aria-label={`Attendance status for ${emp.full_name}`}
                                    className="input-extreme text-center font-bold min-w-[140px]"
                                >
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="half-day">Half Day</option>
                                    <option value="leave">Leave</option>
                                </select>
                            );
                        }
                    },
                    {
                        key: 'checkIn',
                        label: 'Check In',
                        render: (emp: Employee) => {
                            const att = attendanceData[emp.id] || { status: 'present', checkIn: '09:00', checkOut: '18:00' };
                            return (
                                <input
                                    type="time"
                                    value={att.checkIn}
                                    onChange={(e) => handleTimeChange(emp.id, 'checkIn', e.target.value)}
                                    disabled={att.status === 'absent' || att.status === 'leave'}
                                    aria-label={`Check in time for ${emp.full_name}`}
                                    className="input-extreme text-center disabled:bg-slate-100 disabled:text-slate-400 font-bold"
                                />
                            );
                        }
                    },
                    {
                        key: 'checkOut',
                        label: 'Check Out',
                        render: (emp: Employee) => {
                            const att = attendanceData[emp.id] || { status: 'present', checkIn: '09:00', checkOut: '18:00' };
                            return (
                                <input
                                    type="time"
                                    value={att.checkOut}
                                    onChange={(e) => handleTimeChange(emp.id, 'checkOut', e.target.value)}
                                    disabled={att.status !== 'present'}
                                    aria-label={`Check out time for ${emp.full_name}`}
                                    className="input-extreme text-center disabled:bg-slate-100 disabled:text-slate-400 font-bold"
                                />
                            );
                        }
                    }
                ]}
                emptyMessage={`No employees found matching "${searchQuery}"`}
            />
        </div>
    );
}
