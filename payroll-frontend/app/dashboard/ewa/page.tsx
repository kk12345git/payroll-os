'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    ArrowRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    IndianRupee,
    TrendingUp,
    Calendar,
    Briefcase
} from 'lucide-react';
import { useEWAStore } from '@/store/ewaStore';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function EWAPage() {
    const { user } = useAuth();
    const {
        balance,
        history,
        pendingRequests,
        fetchBalance,
        fetchHistory,
        requestWithdrawal,
        fetchPendingRequests,
        processRequest,
        loading
    } = useEWAStore();

    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const isAdmin = user?.role === 'admin' || user?.role === 'hr_manager';

    useEffect(() => {
        if (isAdmin) {
            fetchPendingRequests();
        } else {
            fetchBalance();
            fetchHistory();
        }
    }, [isAdmin, fetchBalance, fetchHistory, fetchPendingRequests]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;

        setIsWithdrawing(true);
        try {
            await requestWithdrawal(Number(amount), notes);
            toast.success('Withdrawal request submitted successfully');
            setAmount('');
            setNotes('');
        } catch (err: any) {
            toast.error(err.message || 'Failed to submit request');
        } finally {
            setIsWithdrawing(false);
        }
    };

    const handleAdminAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            await processRequest(id, action);
            toast.success(`Request ${action}ed successfully`);
        } catch (err: any) {
            toast.error(err.message || 'Action failed');
        }
    };

    if (isAdmin) {
        return (
            <div className="space-y-8 max-w-6xl mx-auto pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">EWA Approvals</h1>
                        <p className="text-muted-foreground">Manage early wage withdrawal requests from employees.</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        {pendingRequests.length} Pending
                    </div>
                </div>

                <div className="card-extreme grid grid-cols-1 gap-4">
                    {pendingRequests.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500/20" />
                            <p>No pending requests. All caught up!</p>
                        </div>
                    ) : (
                        pendingRequests.map((req) => (
                            <div key={req.id} className="p-6 border border-border rounded-xl flex items-center justify-between bg-card hover:shadow-md transition-all">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg">₹{req.amount}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold uppercase tracking-wider">Pending</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Requested on {new Date(req.requested_at).toLocaleDateString()}
                                    </p>
                                    {req.notes && (
                                        <p className="text-sm italic text-slate-500 mt-2">"{req.notes}"</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleAdminAction(req.id, 'reject')}
                                        className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm transition-colors"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAdminAction(req.id, 'approve')}
                                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-bold text-sm transition-colors shadow-lg shadow-green-500/20"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">Earned Wage Access</h1>
                <p className="text-muted-foreground">Withdraw a portion of your earned salary before payday.</p>
            </div>

            {/* Balance Card */}
            <div className="card-extreme p-8 bg-gradient-to-br from-indigo-600 to-violet-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-100 font-bold mb-2 uppercase tracking-widest text-xs">
                            <Clock className="w-4 h-4" />
                            Available to Withdraw
                        </div>
                        <div className="text-5xl font-black tracking-tighter mb-4">
                            ₹{balance?.available.toFixed(2) || '0.00'}
                        </div>
                        <div className="flex gap-4 text-sm font-medium text-indigo-100">
                            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                                <Briefcase className="w-4 h-4" />
                                {balance?.paid_days || 0} Paid Days
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                                <TrendingUp className="w-4 h-4" />
                                ₹{balance?.earned.toFixed(0) || 0} Earned
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleWithdraw} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-80">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-100">
                            Withdraw Amount
                        </label>
                        <div className="relative mb-4">
                            <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isWithdrawing || !amount || Number(amount) <= 0 || Number(amount) > (balance?.available || 0)}
                            className="w-full py-3 bg-white text-indigo-700 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isWithdrawing ? 'Processing...' : 'Request Withdrawal'}
                            {!isWithdrawing && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            </div>

            {/* History */}
            <div>
                <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Transaction History
                </h2>
                <div className="card-extreme overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 text-xs font-black uppercase text-muted-foreground tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-left">Date</th>
                                    <th className="px-6 py-4 text-left">Amount</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                            No withdrawal history found.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-muted/20">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {new Date(tx.requested_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-foreground">
                                                ₹{tx.amount}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                    tx.status === 'approved' && "bg-green-100 text-green-700",
                                                    tx.status === 'rejected' && "bg-red-100 text-red-700",
                                                    tx.status === 'pending' && "bg-amber-100 text-amber-700",
                                                    tx.status === 'disbursed' && "bg-blue-100 text-blue-700",
                                                )}>
                                                    {tx.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                                    {tx.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                    {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {tx.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
