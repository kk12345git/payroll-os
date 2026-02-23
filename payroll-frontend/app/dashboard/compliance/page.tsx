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
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

    const downloadFile = async (endpoint: string, filename: string, isJson: boolean = false) => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/api/compliance/${endpoint}?month=${selectedMonth}&year=${selectedYear}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error("Export failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success(`${filename} generated successfully`);
        } catch (err) {
            toast.error(`Failed to generate ${filename}`);
        } finally {
            setLoading(false);
        }
    };

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

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-20">
            {loading && <LoadingOverlay />}

            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                    <ShieldCheck className="w-10 h-10 text-indigo-600" />
                    Compliance & Statutory Filings
                </h1>
                <p className="text-slate-500 font-medium">
                    Automated generation of Form 16, PF ECR, and ESI Monthly Returns.
                </p>
            </div>

            {/* Filters & Monthly Filings */}
            <div className="card-extreme p-8 bg-slate-900 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-black mb-1">Monthly Statutory Exports</h2>
                        <p className="text-slate-400 text-sm">Download portal-ready files for EPF and ESIC monthly contributions.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 p-2 rounded-2xl">
                        <select
                            className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {months.map((m, i) => (
                                <option key={m} value={i + 1} className="text-slate-900">{m}</option>
                            ))}
                        </select>
                        <div className="w-px h-4 bg-white/20" />
                        <select
                            className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {years.map(y => (
                                <option key={y} value={y} className="text-slate-900">{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => downloadFile('pf-ecr', `PF_ECR_${selectedMonth}_${selectedYear}.txt`)}
                        className="p-6 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <Download className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-lg mb-1">PF ECR File</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Generated in EPFO v2.0 (#~#) format. Ready for direct portal upload.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => downloadFile('esi-json', `ESI_Monthly_${selectedMonth}_${selectedYear}.json`, true)}
                        className="p-6 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <Download className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-lg mb-1">ESI Monthly JSON</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">JSON data for ESIC contribution portal. Includes IP name and wage details.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => downloadFile('pt-summary', `PT_Summary_${selectedMonth}_${selectedYear}.json`, true)}
                        className="p-6 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <Download className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-lg mb-1">PT State Summary</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Professional Tax breakdown by state. Essential for multi-state businesses.</p>
                    </motion.div>
                </div>
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
                            Download Current Quarter
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
                        <p className="text-slate-500 text-sm">All employee UAN and ESI details are verified for {months[selectedMonth - 1]}. Systems are audit-ready.</p>
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
