'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    Clock,
    CheckCircle2,
    ChevronRight,
    Download,
    Search,
} from 'lucide-react';
import Link from 'next/link';
import { useEmployeeStore } from '@/store/employeeStore';
import { useLeaveStore } from '@/store/leaveStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { LoadingOverlay } from '@/components/Loading';

export default function LeaveBalancePage() {
    const { employees, fetchEmployees } = useEmployeeStore();
    const { leaveApplications, leaveTypes, fetchLeaves, fetchLeaveTypes, loading: leaveLoading, getLeaveBalances } = useLeaveStore();
    const { departments, fetchDepartments } = useDepartmentStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    useEffect(() => {
        fetchEmployees();
        fetchLeaves();
        fetchLeaveTypes();
        fetchDepartments();
    }, []);

    const employeeBalances = employees.map(emp => {
        const balances = getLeaveBalances(emp.id);
        const totalLeaves = balances.reduce((sum, b) => sum + b.annualLimit, 0);
        const used = balances.reduce((sum, b) => sum + b.used, 0);
        const remaining = balances.reduce((sum, b) => sum + b.available, 0);
        const pending = leaveApplications.filter(a => a.employee_id === emp.id && a.status === 'Pending').length;
        const dept = departments.find(d => d.id === emp.department_id);

        return {
            id: emp.id,
            name: emp.full_name,
            department: dept?.name || 'Unknown',
            designation: emp.designation,
            totalLeaves,
            used,
            remaining,
            pending,
        };
    });

    const filteredBalances = employeeBalances.filter(emp => {
        const matchesSearch = (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const totalStats = {
        totalEmployees: employees.length,
        avgUsed: employees.length > 0 ? Math.round(employeeBalances.reduce((sum, e) => sum + e.used, 0) / employees.length) : 0,
        avgRemaining: employees.length > 0 ? Math.round(employeeBalances.reduce((sum, e) => sum + e.remaining, 0) / employees.length) : 0,
        totalPending: employeeBalances.reduce((sum, e) => sum + e.pending, 0),
    };

    if (leaveLoading && employees.length === 0) {
        return <LoadingOverlay message="Synchronizing leave records..." />;
    }

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
                        <span className="text-indigo-600">Leave Balance</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Leave Balance Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Track leave balances across your organization
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                    <Download className="w-4 h-4" />
                    Export Report
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
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Leaves Used</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.avgUsed}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Remaining</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.avgRemaining}</div>
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
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Requests</div>
                        <div className="text-3xl font-black text-slate-900">{totalStats.totalPending}</div>
                    </div>
                </motion.div>
            </div>

            {/* Filters and Table */}
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
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Total</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Used</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Remaining</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Pending</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBalances.map((employee) => {
                                const usedPercentage = employee.totalLeaves > 0 ? (employee.used / employee.totalLeaves) * 100 : 0;

                                return (
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
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{employee.name}</div>
                                                    <div className="text-xs text-slate-500">{employee.designation}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                                                {employee.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">{employee.totalLeaves}</td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-orange-600">{employee.used}</td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-green-600">{employee.remaining}</td>
                                        <td className="px-6 py-4 text-center">
                                            {employee.pending > 0 ? (
                                                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
                                                    {employee.pending}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-32">
                                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                                                    <span>{usedPercentage.toFixed(0)}% used</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${usedPercentage < 50 ? 'bg-green-500' :
                                                            usedPercentage < 75 ? 'bg-orange-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${usedPercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
