'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Plus,
    Search,
    Users,
    TrendingUp,
    Zap,
    Clock,
    Target,
    Award,
    ChevronRight,
    ArrowUpRight,
    Filter,
    Rocket,
    CheckCircle2,
    Calendar,
    X,
    Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { API_BASE_URL } from '@/lib/api';

interface Gig {
    id: number;
    title: string;
    description: string;
    budget: string;
    required_skills: string;
    status: string;
    deadline: string;
    created_at: string;
}

export default function GigMarketplace() {
    const [loading, setLoading] = useState(true);
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showApplyModal, setShowApplyModal] = useState<Gig | null>(null);
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        const fetchGigs = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/talent/gigs`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setGigs(await res.json());
            } catch (error) {
                toast.error("Failed to load gig marketplace");
            } finally {
                setLoading(false);
            }
        };
        fetchGigs();
    }, []);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showApplyModal) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/talent/gigs/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gig_id: showApplyModal.id,
                    cover_letter: coverLetter
                })
            });

            if (res.ok) {
                toast.success("Application submitted successfully!");
                setShowApplyModal(null);
                setCoverLetter('');
            }
        } catch (error) {
            toast.error("Application failed");
        }
    };

    const filtered = gigs.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading && gigs.length === 0) return <LoadingOverlay message="Indexing internal opportunities..." />;

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Rocket className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Gig <span className="text-indigo-600 not-italic">Marketplace</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Internal Mobility • Skill Development • Performance Incentives
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-64 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find a project..."
                            className="w-full bg-white border-none rounded-2xl pl-12 pr-4 py-4 font-bold text-xs shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Stats / Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-extreme bg-slate-900 border-none p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Award className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Total Budget Pool</p>
                        <p className="text-4xl font-black tracking-tighter italic text-white">₹1.2M</p>
                        <div className="mt-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+12% from last quarter</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 card-extreme bg-indigo-600 border-none p-8 flex items-center justify-between group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700">
                        <Zap className="w-64 h-64 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white italic uppercase mb-2 line-clamp-1">Upskill while you earn</h2>
                        <p className="text-indigo-100/70 font-medium max-w-md">Browse projects posted by other departments and contribute beyond your primary role.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-700/20 relative z-10 shrink-0">
                        Post a Gig
                    </button>
                </div>
            </div>

            {/* Main Listing */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Available Opportunities ({filtered.length})</h3>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filtered.map((gig) => (
                        <motion.div
                            key={gig.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="card-extreme bg-white border-2 border-slate-100 p-8 group transition-all"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            Active
                                        </div>
                                        <div className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest border border-indigo-100">
                                            {new Date(gig.deadline).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 uppercase italic leading-none">{gig.title}</h4>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                            </div>

                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-8 line-clamp-3 italic">
                                "{gig.description}"
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {gig.required_skills?.split(',').map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 transition-colors group-hover:border-indigo-200 group-hover:text-indigo-600">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Incentive</p>
                                        <p className="text-xl font-black text-slate-900 italic">₹{Number(gig.budget).toLocaleString()}</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100" />
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                                        <p className="text-xs font-black text-slate-600 uppercase tracking-tight italic flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> ~2 Weeks
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowApplyModal(gig)}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="md:col-span-2 py-20 text-center card-extreme border-dashed border-2 border-slate-200 bg-slate-50">
                            <Target className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active gigs match your current filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 lg:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                            onClick={() => setShowApplyModal(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative overflow-hidden"
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Application Portal</p>
                                        <h3 className="text-3xl font-black text-slate-900 italic uppercase">Apply for <span className="text-indigo-600 not-italic">{showApplyModal.title}</span></h3>
                                    </div>
                                    <button onClick={() => setShowApplyModal(null)} className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all">
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleApply} className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Wallet className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Base Budget</p>
                                                    <p className="text-lg font-black text-slate-900 italic">₹{Number(showApplyModal.budget).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Deadline</p>
                                                    <p className="text-xs font-black text-slate-900 uppercase italic">{new Date(showApplyModal.deadline).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                                                Cover Letter / Pitch
                                                <span className="text-indigo-600 font-bold tracking-tight">Tell us why you're a fit</span>
                                            </label>
                                            <textarea
                                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-bold text-slate-900 focus:ring-4 ring-indigo-500/10 min-h-[180px] text-sm resize-none"
                                                placeholder="Highlight your relevant experience and how you plan to contribute..."
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-900 rounded-2xl flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] leading-relaxed">
                                            By applying, you agree that this gig is an <span className="text-white">internal project</span> and compensation will be added to your <span className="text-white">next autopay-os cycle</span> upon completion.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-slate-900 hover:shadow-slate-900/10 transition-all font-mono"
                                    >
                                        Transmit Application Node
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
