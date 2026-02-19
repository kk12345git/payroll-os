'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Users, Check } from 'lucide-react';
import { useDepartmentStore } from '@/store/useDepartmentStore';

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    department?: any;
    mode: 'add' | 'edit';
}

export default function DepartmentModal({ isOpen, onClose, department, mode }: DepartmentModalProps) {
    const { addDepartment, updateDepartment } = useDepartmentStore();
    const [formData, setFormData] = useState({
        name: department?.name || '',
        code: department?.code || '',
        description: department?.description || '',
        headEmployeeId: department?.headEmployeeId || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'add') {
            addDepartment({
                name: formData.name,
                code: formData.code,
                manager_id: formData.headEmployeeId ? parseInt(formData.headEmployeeId) : undefined,
                company_id: 1,
                budget: 0,
            });
        } else {
            updateDepartment(department.id, {
                name: formData.name,
                code: formData.code,
                manager_id: formData.headEmployeeId ? parseInt(formData.headEmployeeId) : undefined,
            });
        }

        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {mode === 'add' ? 'Add New Department' : 'Edit Department'}
                                            </h2>
                                            <p className="text-sm opacity-90">
                                                {mode === 'add' ? 'Create a new department' : 'Update department details'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                {/* Department Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Department Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="e.g., Engineering, Sales, HR"
                                        required
                                    />
                                </div>

                                {/* Department Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Department Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                                        placeholder="e.g., ENG, SALES, HR"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        rows={3}
                                        placeholder="Brief description of the department"
                                    />
                                </div>

                                {/* Department Head */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Department Head
                                    </label>
                                    <select
                                        value={formData.headEmployeeId}
                                        onChange={(e) => setFormData({ ...formData, headEmployeeId: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Select department head</option>
                                        <option value="emp-1">John Doe (EMP001)</option>
                                        <option value="emp-2">Jane Smith (EMP002)</option>
                                        <option value="emp-3">Mike Johnson (EMP003)</option>
                                    </select>
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    {mode === 'add' ? 'Create Department' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
