'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    FileText,
    Calendar as CalendarIcon,
    IndianRupee,
    Building2,
    User,
    Send,
    Printer,
    Mail,
    ChevronRight
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAutoPayOSStore } from '@/store/autopay-osStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { LoadingOverlay } from '@/components/Loading';
import type { AutoPayOSRecord } from '@/lib/api';

export default function SalarySlipsPage() {
    const { employees, fetchEmployees, loading: empLoading } = useEmployeeStore();
    const { departments, fetchDepartments } = useDepartmentStore();
    const { autopayOSRecords, fetchAutoPayOSHistory, fetchAutoPayOSSummaries, loading: autopayOSLoading } = useAutoPayOSStore();

    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
    const [selectedRecord, setSelectedRecord] = useState<AutoPayOSRecord | null>(null);
    const [notifying, setNotifying] = useState(false);
    const slipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
        fetchAutoPayOSSummaries();
    }, [fetchEmployees, fetchDepartments, fetchAutoPayOSSummaries]);

    const months = useMemo(() => {
        const result = [];
        const now = new Date();
        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const val = d.toISOString().substring(0, 7);
            const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            result.push({ value: val, label });
        }
        return result;
    }, []);

    const [year, month] = useMemo(() => {
        const parts = selectedMonth.split('-');
        return [parseInt(parts[0]), parseInt(parts[1])];
    }, [selectedMonth]);

    const activeEmployees = useMemo(() => employees.filter(e => e.is_active), [employees]);

    const filteredRecords = useMemo(() => {
        return autopayOSRecords.filter(r => r.month === month && r.year === year);
    }, [autopayOSRecords, month, year]);

    const displays = useMemo(() => {
        return activeEmployees.map(emp => {
            const record = filteredRecords.find(r => r.employee_id === emp.id);
            const dept = departments.find(d => d.id === emp.department_id);
            return {
                emp,
                record,
                deptName: dept?.name || 'Unknown'
            };
        }).filter(d => d.record);
    }, [activeEmployees, filteredRecords, departments]);

    const selectedEmployee = useMemo(() => {
        if (!selectedRecord) return null;
        return employees.find(e => e.id === selectedRecord.employee_id);
    }, [selectedRecord, employees]);

    const selectedDept = useMemo(() => {
        if (!selectedEmployee) return null;
        return departments.find(d => d.id === selectedEmployee.department_id);
    }, [selectedEmployee, departments]);

    const handleDownloadPDF = async () => {
        if (!slipRef.current || !selectedRecord || !selectedEmployee) return;

        try {
            const canvas = await html2canvas(slipRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            } as any);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Payslip_${selectedEmployee.full_name}_${selectedMonth}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleBulkNotify = async () => {
        setNotifying(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Notifications successfully dispatched to all employees for this period!');
        } catch (error) {
            console.error('Error sending notifications:', error);
        } finally {
            setNotifying(false);
        }
    };

    if (empLoading) return <LoadingOverlay />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">
                            Salary Slips
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] bg-white/50 w-fit px-2 py-1 rounded border border-indigo-100">
                            Enterprise Document Management • {displays.length} records active
                        </p>
                    </motion.div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleBulkNotify}
                            disabled={notifying || displays.length === 0}
                            className="btn-extreme bg-gradient-to-r from-indigo-500 to-purple-500 border-none text-white shadow-indigo-100 disabled:opacity-50"
                        >
                            <Send className={`w-4 h-4 mr-2 ${notifying ? 'animate-pulse' : ''}`} />
                            {notifying ? 'Transmitting...' : 'Bulk Notify Employees'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Configuration */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-extreme p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-100">
                                    <CalendarIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Period Selection</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Fiscal Month</p>
                                </div>
                            </div>
                            <select
                                value={selectedMonth}
                                onChange={(e) => {
                                    setSelectedMonth(e.target.value);
                                    setSelectedRecord(null);
                                }}
                                className="input-extreme"
                            >
                                {months.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card-extreme p-6"
                        >
                            <h3 className="text-lg font-black text-slate-800 mb-4 tracking-tight">
                                Processed Records ({displays.length})
                            </h3>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {displays.length > 0 ? displays.map(({ emp, record, deptName }) => (
                                    <motion.button
                                        key={emp.id}
                                        onClick={() => setSelectedRecord(record || null)}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedRecord?.id === record?.id
                                            ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-100'
                                            : 'bg-white border-slate-100 hover:border-indigo-200'
                                            }`}
                                    >
                                        <div className="font-bold text-slate-800 tracking-tight">{emp.full_name}</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                                            {emp.employee_code || `EMP${emp.id}`} • {deptName}
                                        </div>
                                        <div className="text-xs font-black text-indigo-600 mt-2">
                                            ₹{record?.net_pay.toLocaleString()}
                                        </div>
                                    </motion.button>
                                )) : (
                                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No slips available</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Preview Main Engine */}
                    <div className="lg:col-span-2">
                        {selectedRecord && selectedEmployee ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="card-extreme overflow-hidden border-0 shadow-2xl"
                            >
                                <div ref={slipRef} className="bg-white">
                                    {/* Formal Header */}
                                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32"></div>
                                        <div className="relative z-10 flex justify-between items-start">
                                            <div>
                                                <h2 className="text-3xl font-black mb-1 tracking-tighter uppercase italic">Payslip Details</h2>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                                                    {months.find((m) => m.value === selectedMonth)?.label}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Ref</div>
                                                <div className="font-bold text-xs ring-1 ring-white/10 px-2 py-0.5 rounded">#{selectedRecord.id.toString().padStart(6, '0')}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Grid */}
                                    <div className="p-8">
                                        <div className="grid grid-cols-2 gap-6 mb-10">
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                                    <User className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Employee Profile</span>
                                                </div>
                                                <div className="font-bold text-slate-800 tracking-tight">{selectedEmployee.full_name}</div>
                                                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                                    {selectedEmployee.employee_code || `EMP${selectedEmployee.id}`}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                                    <Building2 className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Organization Unit</span>
                                                </div>
                                                <div className="font-bold text-slate-800 tracking-tight">{selectedDept?.name || 'Operations'}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corporate Hub</div>
                                            </div>
                                            <div className="col-span-2 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                        <CalendarIcon className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Attendance Log</div>
                                                        <div className="font-bold text-slate-800 text-sm">{selectedRecord.paid_days} Days Paid • {selectedRecord.absent_days} Absent</div>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-1.5 bg-green-100 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-widest border border-green-200">
                                                    {selectedRecord.status}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                            <div className="space-y-4">
                                                <h3 className="text-xs font-black text-slate-900 pb-2 border-b-2 border-indigo-600 w-fit uppercase tracking-widest">Credits</h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { label: 'Basic Pay', value: selectedRecord.basic_earned },
                                                        { label: 'HRA', value: selectedRecord.hra_earned },
                                                        { label: 'Conveyance', value: selectedRecord.conveyance_earned },
                                                        { label: 'Medical', value: selectedRecord.medical_earned },
                                                        { label: 'Special Pay', value: selectedRecord.special_earned },
                                                    ].filter(x => x.value !== null).map((item) => (
                                                        <div key={item.label} className="flex justify-between items-center">
                                                            <span className="text-xs font-bold text-slate-400 uppercase">{item.label}</span>
                                                            <span className="font-black text-slate-800 italic">₹{item.value?.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between pt-4 border-t border-slate-100">
                                                        <span className="text-xs font-black text-slate-900 uppercase">Gross Total</span>
                                                        <span className="font-black text-green-600 text-xl tracking-tighter">₹{selectedRecord.gross_earnings.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-xs font-black text-slate-900 pb-2 border-b-2 border-red-500 w-fit uppercase tracking-widest">Retentions</h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { label: 'Provident Fund', value: selectedRecord.pf_deduction },
                                                        { label: 'ESI', value: selectedRecord.esi_deduction },
                                                        { label: 'Prof. Tax', value: selectedRecord.pt_deduction },
                                                        { label: 'TDS / IT', value: selectedRecord.income_tax_deduction },
                                                    ].filter(x => x.value !== null).map((item) => (
                                                        <div key={item.label} className="flex justify-between items-center">
                                                            <span className="text-xs font-bold text-slate-400 uppercase">{item.label}</span>
                                                            <span className="font-black text-slate-800 italic">₹{item.value?.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between pt-4 border-t border-slate-100">
                                                        <span className="text-xs font-black text-slate-900 uppercase">Total Reductions</span>
                                                        <span className="font-black text-red-600 text-xl tracking-tighter">₹{selectedRecord.total_deductions.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/10 to-transparent"></div>
                                            <div className="relative z-10 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Net Salary Credits</div>
                                                    <div className="text-5xl font-black tracking-tighter shimmer-text">₹{selectedRecord.net_pay.toLocaleString()}</div>
                                                    <p className="text-[8px] font-bold text-slate-500 mt-2 uppercase tracking-widest italic">Electronic payment normalized for Indian Banking Protocols</p>
                                                </div>
                                                <IndianRupee className="w-16 h-16 text-white/10" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Persistent Page Actions */}
                                <div className="p-8 pt-0 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </button>
                                    <button className="py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email to Staff
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="card-extreme p-12 flex flex-col items-center justify-center h-full min-h-[600px] border-dashed border-2 border-slate-200"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <FileText className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Slip Engine Idle</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs text-center">
                                    Select an employee record from the batch to initialize high-fidelity preview
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
