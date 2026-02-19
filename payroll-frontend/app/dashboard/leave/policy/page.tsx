'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    ChevronRight,
    Plus,
    Edit,
    Save,
    X,
    Calendar,
    CheckCircle2,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { useLeaveStore } from '@/store/leaveStore';
import { LoadingOverlay } from '@/components/Loading';

export default function LeavePolicyPage() {
    const { leaveTypes, fetchLeaveTypes, loading } = useLeaveStore();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const handleEdit = (id: number) => {
        setEditingId(id);
    };

    const handleSave = (id: number) => {
        setEditingId(null);
        console.log('Saving policy:', id);
    };

    const getColorClass = (index: number) => {
        const colors = [
            'bg-blue-50 border-blue-200',
            'bg-red-50 border-red-200',
            'bg-green-50 border-green-200',
            'bg-purple-50 border-purple-200',
            'bg-pink-50 border-pink-200',
        ];
        return colors[index % colors.length];
    };

    if (loading && leaveTypes.length === 0) {
        return <LoadingOverlay message="Fetching leave policies..." />;
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
                        <span className="text-indigo-600">Policy Configuration</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Leave Policy Configuration
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage leave types, rules, and entitlements
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-extreme"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Leave Policy
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
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <Settings className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Policies</div>
                        <div className="text-3xl font-black text-slate-900">{leaveTypes.length}</div>
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
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Leave Days</div>
                        <div className="text-3xl font-black text-slate-900">{leaveTypes.reduce((sum, p) => sum + p.annual_limit, 0)}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Types</div>
                        <div className="text-3xl font-black text-slate-900">{leaveTypes.filter(p => p.is_paid).length}</div>
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
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leave Categories</div>
                        <div className="text-3xl font-black text-slate-900">{leaveTypes.length}</div>
                    </div>
                </motion.div>
            </div>

            {/* Policy Cards */}
            <div className="space-y-6">
                {leaveTypes.map((policy, index) => {
                    const isEditing = editingId === policy.id;

                    return (
                        <motion.div
                            key={policy.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`card-extreme border-2 ${getColorClass(index)}`}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{policy.name}</h3>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full ${policy.is_paid ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'} font-bold`}>
                                            {policy.is_paid ? 'Paid' : 'Unpaid'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-wider text-[10px]`}>
                                            {policy.code}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => isEditing ? handleSave(policy.id) : handleEdit(policy.id)}
                                    className="p-2 hover:bg-white rounded-lg transition-all"
                                >
                                    {isEditing ? <Save className="w-5 h-5 text-green-600" /> : <Edit className="w-5 h-5 text-slate-400" />}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Annual Limit</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            defaultValue={policy.annual_limit}
                                            className="input-extreme !py-2"
                                        />
                                    ) : (
                                        <div className="text-2xl font-black text-slate-900">{policy.annual_limit} days</div>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 mb-2">Description</label>
                                    <div className="text-slate-600 font-medium">{policy.description || 'No description provided.'}</div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
                    >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Add New Leave Policy</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Leave Type Name *</label>
                                    <input type="text" placeholder="e.g., Privilege Leave" className="input-extreme" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Code *</label>
                                    <input type="text" placeholder="e.g., PL" className="input-extreme" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea placeholder="Policy details..." className="input-extreme min-h-[100px]" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Limit *</label>
                                    <input type="number" placeholder="12" className="input-extreme" />
                                </div>
                                <div className="flex items-center gap-3 h-full pt-6">
                                    <input type="checkbox" className="w-5 h-5 rounded" id="is_paid" defaultChecked />
                                    <label htmlFor="is_paid" className="font-semibold text-slate-700">Paid Leave</label>
                                </div>
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
                                Add Policy
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
