"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Download,
    Mail,
    Phone,
    MapPin,
    Calendar,
    UserPlus,
    Users,
    Clock,
    CheckCircle2,
    TrendingUp,
    Edit,
    Trash2,
    Upload,
    FileSpreadsheet
} from 'lucide-react';
import Link from 'next/link';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { useEmployeeStore } from '@/store/employeeStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useToast } from '@/store/toastStore';
import type { Employee } from '@/lib/api';
import { LoadingOverlay } from '@/components/Loading';

export default function EmployeesPage() {
    // Zustand stores
    const {
        employees,
        searchQuery,
        departmentFilter,
        statusFilter,
        loading,
        error,
        setSearchQuery,
        setDepartmentFilter,
        setStatusFilter,
        deleteEmployee,
        fetchEmployees,
        getFilteredEmployees,
    } = useEmployeeStore();

    const { departments, fetchDepartments } = useDepartmentStore();
    const toast = useToast();

    // Local state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, [fetchEmployees, fetchDepartments]);

    // Get filtered employees from store
    const filteredEmployees = getFilteredEmployees();

    // Stats calculation
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.is_active).length;
    const thisMonthJoiners = employees.filter(emp => {
        const joinDate = new Date(emp.date_of_joining);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length;

    const handleDeleteEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedEmployee) {
            try {
                await deleteEmployee(selectedEmployee.id);
                toast.success(`${selectedEmployee.full_name} deleted successfully!`);
                setIsDeleteModalOpen(false);
                setSelectedEmployee(null);
            } catch (error) {
                toast.error('Failed to delete employee. Please try again.');
            }
        }
    };

    const handleExport = (format: string) => {
        console.log(`Exporting ${filteredEmployees.length} employees to ${format}`);
        setShowExportMenu(false);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading && employees.length === 0) {
        return <LoadingOverlay message="Synchronizing employee records..." />;
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Employee Management
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {filteredEmployees.length} of {totalEmployees} employees
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all font-semibold text-sm shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        {showExportMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                                <button onClick={() => handleExport('excel')} className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Export to Excel
                                </button>
                                <button onClick={() => handleExport('pdf')} className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Export to PDF
                                </button>
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/employees/new">
                        <button className="btn-extreme">
                            <Plus className="w-4 h-4" />
                            Add Employee
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</div>
                        <div className="text-3xl font-black text-slate-900">{totalEmployees}</div>
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
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</div>
                        <div className="text-3xl font-black text-slate-900">{activeEmployees}</div>
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
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New This Month</div>
                        <div className="text-3xl font-black text-slate-900">{thisMonthJoiners}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departments</div>
                        <div className="text-3xl font-black text-slate-900">{departments.length}</div>
                    </div>
                </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="card-extreme">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or employee ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-extreme pl-12"
                        />
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="input-extreme min-w-[180px]"
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id.toString()}>{dept.name}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-extreme min-w-[150px]"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Employee List */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
            >
                {filteredEmployees.length === 0 ? (
                    <div className="card-extreme text-center py-12">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No employees found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredEmployees.map((employee) => (
                        <motion.div
                            key={employee.id}
                            variants={item}
                            className="card-extreme hover:shadow-xl transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg uppercase">
                                        {(employee.full_name || '??').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>

                                    <div className="flex-1">
                                        <Link href={`/dashboard/employees/${employee.id}`}>
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {employee.full_name}
                                            </h3>
                                        </Link>
                                        <div className="flex flex-wrap items-center gap-4 mt-1">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <span className="font-semibold">{employee.designation}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <Mail className="w-3.5 h-3.5" />
                                                {employee.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                <Phone className="w-3.5 h-3.5" />
                                                {employee.phone}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <div className="text-sm font-semibold text-primary">
                                            {departments.find(d => d.id === employee.department_id)?.name || 'Unassigned'}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            Joined {employee.date_of_joining && !isNaN(new Date(employee.date_of_joining).getTime())
                                                ? new Date(employee.date_of_joining).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                                : 'N/A'}
                                        </div>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${employee.is_active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {employee.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <Link href={`/dashboard/employees/${employee.id}/edit`}>
                                            <button className="p-2 hover:bg-indigo-50 rounded-lg transition-all">
                                                <Edit className="w-4 h-4 text-indigo-600" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteEmployee(employee)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Employee"
                message={`Are you sure you want to delete this employee? All associated records will be permanently removed.`}
                itemName={selectedEmployee?.full_name || ''}
            />
        </div>
    );
}
