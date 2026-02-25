'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Plus,
    FileText,
    History,
    IndianRupee,
    Info,
    CheckCircle2,
    XCircle,
    Clock,
    Upload,
    ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { API_BASE_URL } from '@/lib/api';

interface Declaration {
    id: number;
    category: string;
    sub_category: string;
    amount_declared: number;
    amount_accepted: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    financial_year: string;
}

interface Summary {
    total_declared: number;
    total_accepted: number;
    pending_count: number;
}

export default function InvestmentPortal() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [declarations, setDeclarations] = useState<Declaration[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        category: '80C',
        sub_category: '',
        amount_declared: '',
        financial_year: '2025-26',
        remarks: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [summaryRes, declRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/investments/me/summary?financial_year=2025-26`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/investments/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (summaryRes.ok) setSummary(await summaryRes.json());
                if (declRes.ok) setDeclarations(await declRes.json());
            } catch (error) {
                console.error("Failed to fetch investment data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/investments/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Declaration submitted successfully!");
                setShowForm(false);
                // Refresh data
                window.location.reload();
            } else {
                throw new Error("Submission failed");
            }
        } catch (error) {
            toast.error("Failed to submit declaration");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !summary) return <LoadingOverlay />;

    return (
        <div className="space-y-10 max-w-[1200px] mx-auto pb-20">
            {loading && <LoadingOverlay />}

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Tax <span className="text-indigo-600 not-italic">Declarations</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Financial Year 2025-26 • Maximize your take-home pay through smart investments
                    </p>
                </div>
                {!showForm && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-indigo-600 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        New Declaration
                    </motion.button>
                )}
            </header>

            <AnimatePresence mode="wait">
                {showForm ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card-extreme bg-white border-2 border-slate-100 p-8 md:p-12 relative overflow-hidden"
                    >
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute left-8 top-8 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to dashboard
                        </button>

                        <div className="max-w-2xl mx-auto mt-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 italic">New Tax-Saving Purpose</h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Category</label>
                                        <select
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="80C">Section 80C (LIC, PF, ELSS)</option>
                                            <option value="80D">Section 80D (Health Insurance)</option>
                                            <option value="HRA">House Rent Allowance (HRA)</option>
                                            <option value="80CCD">Section 80CCD (NPS)</option>
                                            <option value="LTA">Leave Travel Allowance</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Specific Head</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. LIC Premium"
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 font-bold text-slate-900 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                                            value={formData.sub_category}
                                            onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount to Declare (Annual)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-5 py-5 text-2xl font-black text-slate-900 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                                            value={formData.amount_declared}
                                            onChange={(e) => setFormData({ ...formData, amount_declared: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-indigo-200 transition-all cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 mb-4 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-black text-slate-900 mb-1">Upload Digital Proof</h4>
                                    <p className="text-xs text-slate-400 font-medium max-w-[200px]">PDF, JPG or PNG. Max size 5MB.</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/40 hover:bg-slate-900 transition-all active:scale-[0.98]"
                                >
                                    Submit Declaration for Review
                                </button>
                            </form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden group">
                                <FileText className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-1">Total Declared</h3>
                                <p className="text-4xl font-black tracking-tighter italic">₹{summary?.total_declared.toLocaleString()}</p>
                                <div className="mt-6 flex items-center gap-2 text-[9px] font-black bg-white/20 px-3 py-1.5 rounded-full w-fit">
                                    <Info className="w-3 h-3" />
                                    BASED ON FY 2025-26
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 relative overflow-hidden group">
                                <CheckCircle2 className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-50 opacity-1 group-hover:scale-110 transition-transform" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Amount Accepted</h3>
                                <p className="text-4xl font-black tracking-tighter italic text-slate-900">₹{summary?.total_accepted.toLocaleString()}</p>
                                <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                                    VERIFIED BY FINANCE
                                </div>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                                <Clock className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Review</h3>
                                <p className="text-4xl font-black tracking-tighter italic">{summary?.pending_count}</p>
                                <div className="mt-6 flex items-center gap-2 text-[9px] font-black text-orange-400 bg-white/10 px-3 py-1.5 rounded-full w-fit">
                                    AWAITING AUDIT
                                </div>
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="card-extreme bg-white border-2 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <History className="w-6 h-6 text-indigo-600" />
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Declaration <span className="text-indigo-600 not-italic">History</span></h3>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Purpose</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {declarations.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <FileText className="w-12 h-12 text-slate-200 mb-4" />
                                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No declarations found for this financial year.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            declarations.map((decl) => (
                                                <tr key={decl.id} className="group hover:bg-slate-50/50 transition-all">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 font-black flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                {decl.category}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-slate-900">{decl.sub_category}</div>
                                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{decl.financial_year}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 font-black text-slate-900">₹{decl.amount_declared.toLocaleString()}</td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${decl.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                            decl.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                                'bg-orange-100 text-orange-600'
                                                            }`}>
                                                            {decl.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                                            {decl.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                            {decl.status === 'pending' && <Clock className="w-3 h-3" />}
                                                            {decl.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase">
                                                        {new Date(decl.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
