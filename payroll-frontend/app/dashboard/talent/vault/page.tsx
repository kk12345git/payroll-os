'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    FileText,
    Smartphone,
    Laptop,
    Search,
    Plus,
    Filter,
    ArrowUpRight,
    ChevronRight,
    Lock,
    Eye,
    Download,
    Calendar,
    User,
    HardDrive,
    X,
    MoreVertical,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

interface Asset {
    id: number;
    asset_type: string;
    model_name: string;
    serial_number: string;
    status: string;
    employee_id: number | null;
    assigned_at: string | null;
}

interface Document {
    id: number;
    title: string;
    doc_type: string;
    file_path: string;
    expiry_date: string | null;
    is_encrypted: boolean;
    created_at: string;
}

export default function DocumentVault() {
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeTab, setActiveTab] = useState<'vault' | 'assets'>('vault');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [assetRes, docRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/assets/hardware`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/assets/vault`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (assetRes.ok) setAssets(await assetRes.json());
                if (docRes.ok) setDocuments(await docRes.json());
            } catch (error) {
                toast.error("Failed to fetch vault data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAssets = assets.filter(a =>
        a.model_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDocs = documents.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.doc_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAssetIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'laptop': return <Laptop className="w-5 h-5" />;
            case 'mobile': return <Smartphone className="w-5 h-5" />;
            default: return <HardDrive className="w-5 h-5" />;
        }
    };

    if (loading && assets.length === 0) return <LoadingOverlay message="Unlocking secure vault protocols..." />;

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Enterprise <span className="text-indigo-600 not-italic">Vault</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Encrypted Storage • Hardware Lifecycle • Military-Grade Asset Tracking
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        {(['vault', 'assets'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === tab
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filter By Dept
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'vault' ? (
                    <motion.div
                        key="vault"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredDocs.map((doc) => (
                            <div key={doc.id} className="card-extreme bg-white border-2 border-slate-100 p-6 group hover:border-indigo-200 transition-all">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {doc.is_encrypted && <Lock className="w-3.5 h-3.5 text-slate-300" />}
                                        <button className="text-slate-200 hover:text-slate-400 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-1 truncate uppercase italic">{doc.title}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{doc.doc_type}</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                        Uploaded {new Date(doc.created_at).toLocaleDateString()}
                                    </div>
                                    {doc.expiry_date && (
                                        <div className="flex items-center gap-3 text-[10px] font-black text-red-400 uppercase tracking-tight">
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            Expires {new Date(doc.expiry_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                    <button className="flex-1 h-11 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group">
                                        <Eye className="w-3.5 h-3.5" /> View Secure
                                    </button>
                                    <button className="w-11 h-11 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center transition-all">
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="assets"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card-extreme bg-white border-2 border-slate-100 overflow-hidden"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Unit</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Serial Num</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Holder</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAssets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    {getAssetIcon(asset.asset_type)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase italic leading-none">{asset.model_name}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{asset.asset_type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase font-mono">{asset.serial_number}</td>
                                        <td className="px-8 py-6">
                                            {asset.employee_id ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-indigo-400" />
                                                    <span className="text-[10px] font-black uppercase italic text-slate-600">Employee ID: #{asset.employee_id}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                asset.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                                            )}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-white hover:shadow-lg rounded-xl transition-all">
                                                <ArrowUpRight className="w-5 h-5 text-slate-300 hover:text-indigo-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAssets.length === 0 && (
                            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No assets recorded in inventory</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
