'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    Search,
    Filter,
    ArrowUpRight,
    History
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { API_BASE_URL } from '@/lib/api';

interface Declaration {
    id: number;
    employee_id: number;
    category: string;
    sub_category: string;
    amount_declared: number;
    amount_accepted: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    financial_year: string;
    proof_url: string;
    remarks: string;
}

export default function InvestmentReviewQueue() {
    const [loading, setLoading] = useState(true);
    const [declarations, setDeclarations] = useState<Declaration[]>([]);
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');

    useEffect(() => {
        const fetchDeclarations = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/investments/admin${filter === 'pending' ? '?status=pending' : ''}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setDeclarations(await res.json());
            } catch (error) {
                console.error("Failed to fetch declarations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeclarations();
    }, [filter]);

    const handleReview = async (id: number, status: 'approved' | 'rejected', amount?: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/investments/admin/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    amount_accepted: amount || 0,
                    admin_remarks: status === 'approved' ? 'Verified proof.' : 'Invalid/Incomplete proof.'
                })
            });

            if (res.ok) {
                toast.success(`Declaration ${status} successfully`);
                setDeclarations(declarations.filter(d => d.id !== id));
            }
        } catch (error) {
            toast.error("Failed to update declaration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-20">
            {loading && <LoadingOverlay />}

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                        Investment <span className="text-indigo-600 not-italic">Review Queue</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                        Verify and approve employee tax-saving declarations for FY 2025-26
                    </p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'pending' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        All Activity
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {declarations.length === 0 ? (
                    <div className="card-extreme p-20 text-center bg-white border-2 border-slate-100">
                        <ShieldCheck className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-900 mb-1">Queue Clear!</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No pending investment declarations to review.</p>
                    </div>
                ) : (
                    declarations.map((decl) => (
                        <motion.div
                            key={decl.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card-extreme bg-white border-2 border-slate-100 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-indigo-200 transition-all"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl">
                                    {decl.category}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-black text-slate-900">{decl.sub_category}</h3>
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            ID: #{decl.id}
                                        </span>
                                    </div>
                                    <p className="text-3xl font-black tracking-tighter text-indigo-600 italic">₹{decl.amount_declared.toLocaleString()}</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(decl.created_at).toLocaleDateString()}
                                        </div>
                                        {decl.remarks && (
                                            <div className="text-[10px] font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-lg">
                                                "{decl.remarks}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {decl.proof_url ? (
                                    <a
                                        href={decl.proof_url}
                                        target="_blank"
                                        className="h-14 px-6 rounded-2xl border-2 border-slate-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Proof
                                    </a>
                                ) : (
                                    <div className="h-14 px-6 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-600">
                                        <ShieldCheck className="w-4 h-4" />
                                        In-System Verify
                                    </div>
                                )}

                                <div className="h-14 w-px bg-slate-100 mx-2 hidden lg:block" />

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleReview(decl.id, 'rejected')}
                                        className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                        title="Reject"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => handleReview(decl.id, 'approved', decl.amount_declared)}
                                        className="h-14 px-8 rounded-2xl bg-emerald-500 text-white flex items-center gap-3 font-black text-xs uppercase tracking-[0.1em] hover:bg-slate-900 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        Verify & Accept
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div >
    );
}
