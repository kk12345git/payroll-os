'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    Users,
    TrendingUp,
    ShieldCheck,
    Globe,
    ChevronRight,
    ArrowUpRight,
    Briefcase,
    LayoutDashboard,
    AlertCircle,
    CheckCircle2,
    X,
    MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { API_BASE_URL } from '@/lib/api';

interface Subsidiary {
    id: number;
    name: string;
    registration_number: string;
    is_active: boolean;
}

export default function GroupManagement() {
    const [loading, setLoading] = useState(true);
    const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', registration_number: '' });

    useEffect(() => {
        const fetchSubsidiaries = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/companies/subsidiaries`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setSubsidiaries(await res.json());
            } catch (error) {
                toast.error("Failed to load subsidiary data");
            } finally {
                setLoading(false);
            }
        };
        fetchSubsidiaries();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/companies/subsidiaries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const newSub = await res.json();
                setSubsidiaries([...subsidiaries, newSub]);
                setShowAddModal(false);
                setFormData({ name: '', registration_number: '' });
                toast.success(`${newSub.name} registered as subsidiary`);
            }
        } catch (error) {
            toast.error("Failed to register subsidiary");
        } finally {
            setLoading(false);
        }
    };

    const filtered = subsidiaries.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading && subsidiaries.length === 0) return <LoadingOverlay message="Consolidating group intelligence..." />;

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Globe className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Group <span className="text-indigo-600 not-italic">Admin</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Multi-Entity Operations • Subsidiary Management • Portfolio Intelligence
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Subsidiary
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-extreme bg-white border-2 border-slate-100 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Entities</p>
                    <p className="text-4xl font-black tracking-tighter italic text-slate-900">{subsidiaries.length + 1}</p>
                </div>
                <div className="card-extreme bg-white border-2 border-slate-100 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subsidiaries</p>
                    <p className="text-4xl font-black tracking-tighter italic text-indigo-600">{subsidiaries.length}</p>
                </div>
                <div className="card-extreme bg-white border-2 border-slate-100 p-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Nodes</p>
                    <p className="text-4xl font-black tracking-tighter italic text-emerald-500">{subsidiaries.filter(s => s.is_active).length + 1}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 uppercase italic flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                        Subsidiary <span className="text-indigo-600 not-italic">Portfolio</span>
                    </h3>
                    <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find subsidiary..."
                            className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 font-bold text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((sub) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="card-extreme bg-white border-2 border-slate-100 p-8 group hover:border-indigo-600 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Building2 className="w-24 h-24" />
                            </div>
                            <div className="mb-6 flex items-center justify-between">
                                <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Active</span>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 uppercase italic mb-1 truncate">{sub.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">REG: {sub.registration_number || 'PENDING'}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-300" />
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight italic">Enter Enterprise Context</span>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                    {subsidiaries.length === 0 && (
                        <div className="lg:col-span-3 py-20 text-center card-extreme bg-slate-50 border-2 border-dashed border-slate-200">
                            <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No subsidiaries registered for this corporate entity.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Subsidiary Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl relative overflow-hidden"
                        >
                            <div className="p-8 md:p-12">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 italic uppercase">New <span className="text-indigo-600 not-italic">Subsidiary</span></h3>
                                    <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 ring-indigo-500/20"
                                            placeholder="e.g., KRG Medifabb UK Ltd"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registration Number</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 ring-indigo-500/20"
                                            placeholder="CIN / Registration ID"
                                            value={formData.registration_number}
                                            onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                        />
                                    </div>

                                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                                        <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
                                        <p className="text-[10px] font-bold text-indigo-600/80 uppercase tracking-widest leading-relaxed">
                                            The new node will inherit group compliance policies but maintain an independent payroll & employee database.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all font-mono"
                                    >
                                        Initialize Subsidiary Node
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
