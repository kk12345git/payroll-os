'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Calendar,
    Users,
    IndianRupee,
    CheckCircle2,
    ChevronRight,
    Eye,
    Send,
    Filter,
    Search,
} from 'lucide-react';
import Link from 'next/link';

interface Employee {
    id: string;
    name: string;
    pan: string;
    designation: string;
    department: string;
    grossSalary: string;
    tdsDeducted: string;
}

const MOCK_EMPLOYEES: Employee[] = [
    { id: '1', name: 'Alexander Wright', pan: 'ABCDE1234F', designation: 'Product Designer', department: 'Design', grossSalary: '₹8,50,000', tdsDeducted: '₹45,000' },
    { id: '2', name: 'Sarah Chen', pan: 'WXYZ5678G', designation: 'Backend Engineer', department: 'Engineering', grossSalary: '₹12,00,000', tdsDeducted: '₹95,000' },
    { id: '3', name: 'Marcus Johnson', pan: 'PQRS9012H', designation: 'HR Manager', department: 'HR', grossSalary: '₹9,50,000', tdsDeducted: '₹62,000' },
    { id: '4', name: 'Elena Rodriguez', pan: 'LMNO3456I', designation: 'Frontend Lead', department: 'Engineering', grossSalary: '₹15,00,000', tdsDeducted: '₹1,85,000' },
    { id: '5', name: 'David Kim', pan: 'STUV7890J', designation: 'Operations Analyst', department: 'Operations', grossSalary: '₹7,50,000', tdsDeducted: '₹32,000' },
];

export default function TDSFormsPage() {
    const [activeTab, setActiveTab] = useState<'form16' | 'form24q'>('form16');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedQuarter, setSelectedQuarter] = useState('Q4-2024');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const filteredEmployees = MOCK_EMPLOYEES.filter(emp =>
        (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.pan || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedEmp = MOCK_EMPLOYEES.find(e => e.id === selectedEmployee);

    const quarters = [
        { value: 'Q1-2024', label: 'Q1 (Apr-Jun) 2024' },
        { value: 'Q2-2024', label: 'Q2 (Jul-Sep) 2024' },
        { value: 'Q3-2024', label: 'Q3 (Oct-Dec) 2024' },
        { value: 'Q4-2024', label: 'Q4 (Jan-Mar) 2025' },
    ];

    const handleGenerateForm = (action: 'preview' | 'download') => {
        if (action === 'preview') {
            setShowPreview(true);
        } else {
            console.log('Downloading form...');
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/payroll" className="hover:text-indigo-600">Payroll</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">TDS Forms</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Form 16 & 24Q Generator
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Generate TDS certificates and quarterly returns
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Employees</div>
                        <div className="text-3xl font-black text-slate-900">{MOCK_EMPLOYEES.length}</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                            <IndianRupee className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total TDS (Q4)</div>
                        <div className="text-3xl font-black text-slate-900">₹4.19L</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Forms Generated</div>
                        <div className="text-3xl font-black text-slate-900">156</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Quarter</div>
                        <div className="text-lg font-black text-slate-900">Q4 FY 24-25</div>
                    </div>
                </motion.div>
            </div>

            {/* Tab Switcher */}
            <div className="card-extreme p-0 overflow-hidden">
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('form16')}
                        className={`flex-1 py-4 px-6 font-bold text-sm transition-all ${activeTab === 'form16'
                            ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <FileText className="w-4 h-4 inline mr-2" />
                        Form 16 (TDS Certificate)
                    </button>
                    <button
                        onClick={() => setActiveTab('form24q')}
                        className={`flex-1 py-4 px-6 font-bold text-sm transition-all ${activeTab === 'form24q'
                            ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Form 24Q (Quarterly Return)
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'form16' ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-4">Generate Form 16</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Form 16 is a TDS certificate issued to employees showing tax deducted at source
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Select Employee *
                                    </label>
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by name or PAN..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="input-extreme !pl-10 mb-3"
                                        />
                                    </div>
                                    <select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="input-extreme"
                                    >
                                        <option value="">Choose an employee</option>
                                        {filteredEmployees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name} ({emp.pan})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Financial Year *
                                    </label>
                                    <select className="input-extreme">
                                        <option>FY 2024-25</option>
                                        <option>FY 2023-24</option>
                                        <option>FY 2022-23</option>
                                    </select>
                                </div>
                            </div>

                            {selectedEmp && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-50 rounded-xl p-6 border border-slate-200"
                                >
                                    <h4 className="text-sm font-black text-slate-900 mb-4">Employee Details</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-slate-500 font-semibold">Name</div>
                                            <div className="text-slate-900 font-bold">{selectedEmp.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 font-semibold">PAN</div>
                                            <div className="text-slate-900 font-bold">{selectedEmp.pan}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 font-semibold">Gross Salary</div>
                                            <div className="text-slate-900 font-bold">{selectedEmp.grossSalary}</div>
                                        </div>
                                        <div>
                                            <div className="text-slate-500 font-semibold">TDS Deducted</div>
                                            <div className="text-green-600 font-bold">{selectedEmp.tdsDeducted}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleGenerateForm('preview')}
                                    disabled={!selectedEmployee}
                                    className="flex-1 py-3 px-6 bg-white border-2 border-indigo-200 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview Form 16
                                </button>
                                <button
                                    onClick={() => handleGenerateForm('download')}
                                    disabled={!selectedEmployee}
                                    className="flex-1 btn-extreme disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-4">Generate Form 24Q</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Form 24Q is the quarterly TDS return filed by employers with the Income Tax Department
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Select Quarter *
                                    </label>
                                    <select
                                        value={selectedQuarter}
                                        onChange={(e) => setSelectedQuarter(e.target.value)}
                                        className="input-extreme"
                                    >
                                        {quarters.map((q) => (
                                            <option key={q.value} value={q.value}>
                                                {q.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Financial Year *
                                    </label>
                                    <select className="input-extreme">
                                        <option>FY 2024-25</option>
                                        <option>FY 2023-24</option>
                                        <option>FY 2022-23</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <h4 className="text-sm font-black text-slate-900 mb-4">Quarter Summary - {selectedQuarter}</h4>
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-slate-500 font-semibold text-sm">Total Employees</div>
                                        <div className="text-2xl font-black text-slate-900">{MOCK_EMPLOYEES.length}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 font-semibold text-sm">Total Gross Salary</div>
                                        <div className="text-2xl font-black text-slate-900">₹52.50L</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 font-semibold text-sm">Total TDS</div>
                                        <div className="text-2xl font-black text-green-600">₹4.19L</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-blue-900 mb-1">Ready for Filing</div>
                                        <div className="text-sm text-blue-700">
                                            All employee records are complete. Form 24Q is ready to be generated and filed.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleGenerateForm('preview')}
                                    className="flex-1 py-3 px-6 bg-white border-2 border-indigo-200 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview Form 24Q
                                </button>
                                <button
                                    onClick={() => handleGenerateForm('download')}
                                    className="flex-1 btn-extreme"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download TXT File
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">
                                    {activeTab === 'form16' ? 'Form 16 Preview' : 'Form 24Q Preview'}
                                </h2>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="bg-slate-50 rounded-xl p-8 border-2 border-slate-200">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                                        {activeTab === 'form16' ? 'FORM NO. 16' : 'FORM NO. 24Q'}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        {activeTab === 'form16'
                                            ? 'Certificate under section 203 of the Income-tax Act, 1961'
                                            : 'Quarterly Statement of TDS from Salary'}
                                    </p>
                                </div>

                                <div className="space-y-6 text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="font-semibold text-slate-500">Employer Name</div>
                                            <div className="font-bold text-slate-900">Payroll Management Pvt. Ltd.</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-500">TAN</div>
                                            <div className="font-bold text-slate-900">ABCD12345E</div>
                                        </div>
                                    </div>

                                    {activeTab === 'form16' && selectedEmp && (
                                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                            <div>
                                                <div className="font-semibold text-slate-500">Employee Name</div>
                                                <div className="font-bold text-slate-900">{selectedEmp.name}</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-500">PAN</div>
                                                <div className="font-bold text-slate-900">{selectedEmp.pan}</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-500">Gross Salary</div>
                                                <div className="font-bold text-slate-900">{selectedEmp.grossSalary}</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-500">TDS Deducted</div>
                                                <div className="font-bold text-green-600">{selectedEmp.tdsDeducted}</div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'form24q' && (
                                        <div className="border-t pt-4">
                                            <div className="text-center py-8 bg-white rounded-lg">
                                                <div className="text-4xl font-black text-indigo-600 mb-2">₹4.19L</div>
                                                <div className="text-sm text-slate-600">Total TDS for Quarter</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white rounded-lg p-4 border-2 border-indigo-200 text-center">
                                        <div className="text-xs text-slate-500 mb-2">This is a preview only</div>
                                        <div className="text-sm font-bold text-slate-900">
                                            Download PDF for complete form with all details
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleGenerateForm('download');
                                    setShowPreview(false);
                                }}
                                className="flex-1 btn-extreme"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download {activeTab === 'form16' ? 'PDF' : 'TXT'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
