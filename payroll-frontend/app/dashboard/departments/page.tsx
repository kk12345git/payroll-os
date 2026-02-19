"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Users,
    Shield,
    UserCircle2,
    MoreVertical,
    ArrowUpRight,
    Target,
    LayoutGrid,
    List as ListIcon,
    ChevronRight,
    Edit,
    Trash2,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useEmployeeStore } from '@/store/employeeStore';
import { useToast } from '@/store/toastStore';
import type { Department, DepartmentCreate } from '@/lib/api';
import { LoadingOverlay } from '@/components/Loading';

export default function DepartmentsPage() {
    const { departments, loading, error, fetchDepartments, addDepartment, updateDepartment, deleteDepartment } = useDepartmentStore();
    const { employees, fetchEmployees } = useEmployeeStore();
    const toast = useToast();

    // Fetch data on mount
    React.useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, [fetchDepartments, fetchEmployees]);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

    const [formData, setFormData] = useState({
        name: '',
        budget: 0,
        manager_id: '',
    });

    const handleAddDepartment = () => {
        setModalMode('add');
        setSelectedDepartment(null);
        setFormData({ name: '', budget: 0, manager_id: '' });
        setIsModalOpen(true);
    };

    const handleEditDepartment = (dept: Department) => {
        setModalMode('edit');
        setSelectedDepartment(dept);
        setFormData({
            name: dept.name,
            budget: dept.budget,
            manager_id: dept.manager_id?.toString() || '',
        });
        setIsModalOpen(true);
    };

    const handleDeleteDepartment = (dept: Department) => {
        setSelectedDepartment(dept);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedDepartment) {
            try {
                await deleteDepartment(selectedDepartment.id);
                toast.success(`${selectedDepartment.name} department deleted successfully!`);
                setIsDeleteModalOpen(false);
                setSelectedDepartment(null);
            } catch (error) {
                toast.error('Failed to delete department. Please try again.');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (modalMode === 'add') {
                const newDept: DepartmentCreate = {
                    name: formData.name,
                    budget: formData.budget,
                    manager_id: formData.manager_id ? parseInt(formData.manager_id) : undefined,
                    company_id: 1, // Default company for now
                };
                await addDepartment(newDept);
                toast.success(`${formData.name} department added successfully!`);
            } else if (selectedDepartment) {
                await updateDepartment(selectedDepartment.id, {
                    name: formData.name,
                    budget: formData.budget,
                    manager_id: formData.manager_id ? parseInt(formData.manager_id) : undefined,
                });
                toast.success(`${formData.name} department updated successfully!`);
            }
            setIsModalOpen(false);
            setFormData({ name: '', budget: 0, manager_id: '' });
        } catch (error) {
            toast.error('Failed to save department. Please try again.');
        }
    };

    // Get employee count per department
    const getDepartmentEmployeeCount = (deptId: number) => {
        return employees.filter(emp => emp.department_id === deptId).length;
    };

    if (loading && departments.length === 0) {
        return <LoadingOverlay message="Synchronizing organizational structure..." />;
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Departments</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Department Management
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {departments.length} departments
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'}`}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <button onClick={handleAddDepartment} className="btn-extreme">
                        <Plus className="w-4 h-4" />
                        Add Department
                    </button>
                </div>
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
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Departments</div>
                        <div className="text-3xl font-black text-slate-900">{departments.length}</div>
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
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</div>
                        <div className="text-3xl font-black text-slate-900">{employees.length}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Budget</div>
                        <div className="text-3xl font-black text-slate-900">
                            ₹{(departments.reduce((sum, d) => sum + d.budget, 0) / 100000).toFixed(1)}L
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Departments Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {departments.map((dept, index) => {
                    const employeeCount = getDepartmentEmployeeCount(dept.id);
                    const headEmployee = dept.manager_id ? employees.find(e => e.id === dept.manager_id) : null;

                    return (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card-extreme group hover:shadow-2xl transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <Building2 className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditDepartment(dept)}
                                        className="p-2 hover:bg-indigo-50 rounded-lg transition-all"
                                    >
                                        <Edit className="w-4 h-4 text-indigo-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDepartment(dept)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <Link href={`/dashboard/departments/${dept.id}`}>
                                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {dept.name}
                                </h3>
                            </Link>

                            <div className="space-y-3 mt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 font-semibold">Employees</span>
                                    <span className="text-sm font-black text-slate-900">{employeeCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 font-semibold">Budget</span>
                                    <span className="text-sm font-black text-slate-900">₹{(dept.budget / 100000).toFixed(1)}L</span>
                                </div>
                                {headEmployee && (
                                    <div className="pt-3 border-t border-slate-200">
                                        <div className="text-xs text-slate-500 mb-1">Department Head</div>
                                        <div className="font-bold text-sm text-slate-900">{headEmployee.full_name}</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add/Edit Department Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-6">
                            {modalMode === 'add' ? 'Add Department' : 'Edit Department'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Department Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-extreme"
                                    placeholder="Engineering, Design, HR..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Budget (₹)</label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                                    className="input-extreme"
                                    placeholder="1000000"
                                />
                            </div>

                            <div>
                                <select
                                    value={formData.manager_id}
                                    onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                                    className="input-extreme"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 btn-extreme"
                            >
                                {modalMode === 'add' ? 'Add' : 'Save'} Department
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Delete Department?</h2>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete <strong>{selectedDepartment?.name}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
