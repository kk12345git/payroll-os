'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Save,
    ChevronRight,
    Plus,
    X,
    Edit,
    Trash2,
    TrendingUp,
    TrendingDown,
    IndianRupee,
} from 'lucide-react';
import Link from 'next/link';

interface SalaryComponent {
    id: string;
    name: string;
    type: 'earning' | 'deduction';
    calculationType: 'fixed' | 'percentage';
    value: string;
    taxable: boolean;
    statutory: boolean;
}

const MOCK_COMPONENTS: SalaryComponent[] = [
    { id: '1', name: 'Basic Salary', type: 'earning', calculationType: 'percentage', value: '40', taxable: true, statutory: false },
    { id: '2', name: 'HRA', type: 'earning', calculationType: 'percentage', value: '50', taxable: true, statutory: false },
    { id: '3', name: 'Special Allowance', type: 'earning', calculationType: 'percentage', value: '10', taxable: true, statutory: false },
    { id: '4', name: 'PF', type: 'deduction', calculationType: 'percentage', value: '12', taxable: false, statutory: true },
    { id: '5', name: 'Professional Tax', type: 'deduction', calculationType: 'fixed', value: '200', taxable: false, statutory: true },
];

export default function SalaryComponentsPage() {
    const [components, setComponents] = useState<SalaryComponent[]>(MOCK_COMPONENTS);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const earnings = components.filter(c => c.type === 'earning');
    const deductions = components.filter(c => c.type === 'deduction');

    const deleteComponent = (id: string) => {
        setComponents(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/settings" className="hover:text-indigo-600">Settings</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Salary Components</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Salary Components Management
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Configure earnings and deduction components for salary structures
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-extreme"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Component
                </button>
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
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Components</div>
                        <div className="text-3xl font-black text-slate-900">{components.length}</div>
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
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</div>
                        <div className="text-3xl font-black text-slate-900">{earnings.length}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                            <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductions</div>
                        <div className="text-3xl font-black text-slate-900">{deductions.length}</div>
                    </div>
                </motion.div>
            </div>

            {/* Earnings */}
            <div className="card-extreme">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Earning Components</h2>
                </div>

                <div className="space-y-3">
                    {earnings.map((component, index) => (
                        <motion.div
                            key={component.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                        <IndianRupee className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 mb-1">{component.name}</div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full ${component.calculationType === 'percentage'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-purple-100 text-purple-700'
                                                } font-bold text-xs`}>
                                                {component.calculationType === 'percentage' ? `${component.value}% of Basic` : `₹${component.value}`}
                                            </span>
                                            {component.taxable && (
                                                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold text-xs">
                                                    Taxable
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingId(component.id)}
                                        className="p-2 hover:bg-white rounded-lg transition-all"
                                    >
                                        <Edit className="w-4 h-4 text-slate-600" />
                                    </button>
                                    {!component.statutory && (
                                        <button
                                            onClick={() => deleteComponent(component.id)}
                                            className="p-2 hover:bg-white rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Deductions */}
            <div className="card-extreme">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Deduction Components</h2>
                </div>

                <div className="space-y-3">
                    {deductions.map((component, index) => (
                        <motion.div
                            key={component.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                        <TrendingDown className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 mb-1">{component.name}</div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full ${component.calculationType === 'percentage'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-purple-100 text-purple-700'
                                                } font-bold text-xs`}>
                                                {component.calculationType === 'percentage' ? `${component.value}% of Basic` : `₹${component.value}`}
                                            </span>
                                            {component.statutory && (
                                                <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
                                                    Statutory
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingId(component.id)}
                                        className="p-2 hover:bg-white rounded-lg transition-all"
                                    >
                                        <Edit className="w-4 h-4 text-slate-600" />
                                    </button>
                                    {!component.statutory && (
                                        <button
                                            onClick={() => deleteComponent(component.id)}
                                            className="p-2 hover:bg-white rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Add Salary Component</h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Component Name *</label>
                                    <input type="text" placeholder="e.g., Transport Allowance" className="input-extreme" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Type *</label>
                                        <select className="input-extreme">
                                            <option value="earning">Earning</option>
                                            <option value="deduction">Deduction</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Calculation Type *</label>
                                        <select className="input-extreme">
                                            <option value="percentage">Percentage of Basic</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Value *</label>
                                    <input type="number" placeholder="Enter percentage or amount" className="input-extreme" />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" className="w-5 h-5 rounded" />
                                        <span className="font-semibold text-slate-700">Taxable Component</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" className="w-5 h-5 rounded" />
                                        <span className="font-semibold text-slate-700">Statutory Component</span>
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3 rounded-b-2xl">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 btn-extreme">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Component
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
