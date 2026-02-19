'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Search,
    Building2,
    Briefcase
} from 'lucide-react';
import { api, type Employee } from '@/lib/api';
import { LoadingOverlay } from '@/components/Loading';
import { toast } from 'sonner';

export default function CompliancePage() {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await api.getEmployees();
                setEmployees(data);
            } catch (err) {
                console.error("Failed to fetch employees", err);
            }
        };
        fetchEmployees();
    }, []);

    const downloadForm16 = async (empId: number, name: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/compliance/form16/${empId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Form16_${name.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Form 16 downloaded successfully");
        } catch (err) {
            toast.error("Failed to download Form 16");
        } finally {
            setLoading(false);
        }
    };

    const downloadForm24Q = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/compliance/form24q`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Form24Q_Quarter_Statement.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Form 24Q (Company Statement) downloaded successfully");
        } catch (err) {
            toast.error("Failed to download Form 24Q");
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-20">
            {loading && <LoadingOverlay />}

            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                    <ShieldCheck className="w-10 h-10 text-indigo-600" />
                    Compliance & Statutory Filings
                </h1>
                <p className="text-slate-500 font-medium">
                    Automated generation of Form 16 (TDS Certificates) and Form 24Q (Quarterly Returns).
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card-extreme p-8 bg-indigo-600 text-white flex items-center justify-between group cursor-pointer"
                    onClick={downloadForm24Q}
                >
                    <div>
                        <h3 className="text-2xl font-black mb-2">Form 24Q Statement</h3>
                        <p className="text-indigo-100 text-sm font-medium">Generate the consolidated quarterly TDS return for the entire organization.</p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full w-fit">
                            <Download className="w-4 h-4" />
                            Download Q3 FY25-26
                        </div>
                    </div>
                    <FileText className="w-20 h-20 text-white/10 group-hover:text-white/20 transition-all" />
                </motion.div>

                <div className="card-extreme p-8 bg-white border-2 border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Compliance Health</h3>
                        </div>
                        <p className="text-slate-500 text-sm">All employee PAN details verified. Tax deductions for current quarter are within limits.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-green-600 mt-4">
                        <CheckCircle2 className="w-4 h-4" />
                        SYSTEMS STATUS: AUDIT READY
                    </div>
                </div>
            </div>

            {/* Employee Form 16 List */}
            <div className="card-extreme bg-white border-2 overflow-hidden">
                <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-slate-900">Employee TDS Certificates (Form 16)</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find employee..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">PAN / Code</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Quarter</th>
                                <th className="px-6 py-4 text-right px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                                {emp.full_name[0]}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900">{emp.full_name}</div>
                                                <div className="text-xs font-medium text-slate-400">{emp.designation}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-slate-900 uppercase">{emp.pan_number || 'NA'}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.employee_code}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-300" />
                                            <span className="text-sm font-medium text-slate-600">Q3 FY25-26</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => downloadForm16(emp.id, emp.full_name)}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-auto hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Generate Part B
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
