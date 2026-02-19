'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Mail,
    Link as LinkIcon,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    Copy,
    Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function InvitationsPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);
    const [pending, setPending] = useState<any[]>([]);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const data = await api.getPendingInvites();
                setPending(data);
            } catch (err) {
                console.error("Failed to fetch pending invites", err);
            }
        };
        fetchPending();
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { invite_url } = await api.generateInviteLink(email);
            setInviteUrl(invite_url);
            toast.success("Invite link generated successfully!");
        } catch (err: any) {
            toast.error(err.message || "Failed to generate link");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (inviteUrl) {
            navigator.clipboard.writeText(inviteUrl);
            toast.success("Link copied to clipboard!");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                    <UserPlus className="w-10 h-10 text-indigo-600" />
                    Growth & Recruitment
                </h1>
                <p className="text-slate-500 font-medium">Invite your staff to the platform with secure onboarding links.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Invite Form */}
                <div className="md:col-span-2 space-y-8">
                    <div className="card-extreme p-8 bg-white border-none shadow-2xl shadow-slate-200">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <Send className="w-5 h-5 text-indigo-600" />
                            Send New Invitation
                        </h2>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Staff Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-600"
                                        placeholder="employee@yourcompany.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LinkIcon className="w-5 h-5" />}
                                Generate Secure Invite Link
                            </button>
                        </form>

                        <AnimatePresence>
                            {inviteUrl && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-8 pt-8 border-t border-slate-100"
                                >
                                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Secure Token Link</div>
                                        <div className="flex items-center gap-3">
                                            <code className="flex-1 text-xs truncate font-bold text-indigo-900">{inviteUrl}</code>
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-400 italic">This link will expire in 48 hours for security reasons.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Pending Invites */}
                    <div className="card-extreme bg-white border-none shadow-xl shadow-slate-100 overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                Pending Invitations
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {pending.map((inv, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{inv.email}</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sent on {inv.sent_at}</div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                                        {inv.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info / Tips */}
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl shadow-indigo-600/20">
                        <CheckCircle2 className="w-10 h-10 mb-6" />
                        <h3 className="text-xl font-black mb-2 leading-tight">Scale Instantly.</h3>
                        <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                            Once an employee joins via the link, their profile is automatically linked to your company ID and localized tax rules.
                        </p>
                    </div>

                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem]">
                        <AlertCircle className="w-10 h-10 mb-6 text-indigo-400" />
                        <h3 className="text-xl font-black mb-2 leading-tight">Security First.</h3>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed">
                            Invite links are single-use tokens. If a link expires, simply generate a new one for the employee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
