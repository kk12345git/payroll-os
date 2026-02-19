'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wand2,
    ChevronRight,
    Download,
    Eye,
    Plus,
    X,
    CheckCircle2,
    Filter,
    Database,
    FileText,
    Calendar,
    Users,
    IndianRupee,
    Settings,
} from 'lucide-react';
import Link from 'next/link';

interface ReportField {
    id: string;
    label: string;
    category: string;
    type: 'text' | 'number' | 'date' | 'currency';
}

interface FilterRule {
    field: string;
    operator: string;
    value: string;
}

const AVAILABLE_FIELDS: ReportField[] = [
    // Employee Fields
    { id: 'emp_id', label: 'Employee ID', category: 'Employee', type: 'text' },
    { id: 'emp_name', label: 'Employee Name', category: 'Employee', type: 'text' },
    { id: 'department', label: 'Department', category: 'Employee', type: 'text' },
    { id: 'designation', label: 'Designation', category: 'Employee', type: 'text' },
    { id: 'join_date', label: 'Joining Date', category: 'Employee', type: 'date' },

    // Salary Fields
    { id: 'basic_salary', label: 'Basic Salary', category: 'Salary', type: 'currency' },
    { id: 'gross_salary', label: 'Gross Salary', category: 'Salary', type: 'currency' },
    { id: 'net_salary', label: 'Net Salary', category: 'Salary', type: 'currency' },
    { id: 'allowances', label: 'Total Allowances', category: 'Salary', type: 'currency' },
    { id: 'deductions', label: 'Total Deductions', category: 'Salary', type: 'currency' },

    // Statutory Fields
    { id: 'pf_employee', label: 'PF (Employee)', category: 'Statutory', type: 'currency' },
    { id: 'pf_employer', label: 'PF (Employer)', category: 'Statutory', type: 'currency' },
    { id: 'esi_employee', label: 'ESI (Employee)', category: 'Statutory', type: 'currency' },
    { id: 'tax_deducted', label: 'Tax Deducted', category: 'Statutory', type: 'currency' },

    // Attendance Fields
    { id: 'days_present', label: 'Days Present', category: 'Attendance', type: 'number' },
    { id: 'days_absent', label: 'Days Absent', category: 'Attendance', type: 'number' },
    { id: 'leaves_taken', label: 'Leaves Taken', category: 'Attendance', type: 'number' },
];

const MOCK_PREVIEW_DATA = [
    { emp_id: 'EMP001', emp_name: 'Alexander Wright', department: 'Design', gross_salary: 85000, net_salary: 72000 },
    { emp_id: 'EMP002', emp_name: 'Sarah Chen', department: 'Engineering', gross_salary: 95000, net_salary: 80000 },
    { emp_id: 'EMP003', emp_name: 'Marcus Johnson', department: 'HR', gross_salary: 65000, net_salary: 55000 },
];

export default function CustomReportBuilderPage() {
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [filters, setFilters] = useState<FilterRule[]>([]);
    const [reportName, setReportName] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const categories = Array.from(new Set(AVAILABLE_FIELDS.map(f => f.category)));

    const toggleField = (fieldId: string) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const addFilter = () => {
        setFilters(prev => [...prev, { field: '', operator: 'equals', value: '' }]);
    };

    const removeFilter = (index: number) => {
        setFilters(prev => prev.filter((_, i) => i !== index));
    };

    const updateFilter = (index: number, key: keyof FilterRule, value: string) => {
        setFilters(prev => prev.map((filter, i) =>
            i === index ? { ...filter, [key]: value } : filter
        ));
    };

    const generateReport = (format: 'excel' | 'pdf' | 'csv') => {
        console.log(`Generating ${format} report with fields:`, selectedFields);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/reports" className="hover:text-indigo-600">Reports</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Custom Report Builder</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Custom Report Builder
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Build custom reports with any combination of fields and filters
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(true)}
                        disabled={selectedFields.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                </div>
            </div>

            {/* Report Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Field Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-extreme">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Select Fields</h2>
                                <p className="text-sm text-slate-500">Choose data fields to include in your report</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {categories.map(category => {
                                const categoryFields = AVAILABLE_FIELDS.filter(f => f.category === category);
                                const selectedCount = categoryFields.filter(f => selectedFields.includes(f.id)).length;

                                return (
                                    <div key={category}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">{category}</h3>
                                            <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                                                {selectedCount}/{categoryFields.length}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {categoryFields.map(field => (
                                                <motion.button
                                                    key={field.id}
                                                    onClick={() => toggleField(field.id)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedFields.includes(field.id)
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-slate-200 bg-white hover:border-indigo-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-900">{field.label}</span>
                                                        {selectedFields.includes(field.id) && (
                                                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-500 capitalize">{field.type}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card-extreme">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                    <Filter className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Filters</h2>
                                    <p className="text-sm text-slate-500">Add conditions to filter your data</p>
                                </div>
                            </div>
                            <button
                                onClick={addFilter}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Add Filter
                            </button>
                        </div>

                        {filters.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-semibold">No filters applied</p>
                                <p className="text-sm text-slate-400">Click "Add Filter" to add conditions</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filters.map((filter, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={filter.field}
                                                onChange={(e) => updateFilter(index, 'field', e.target.value)}
                                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                                            >
                                                <option value="">Select Field</option>
                                                {AVAILABLE_FIELDS.map(field => (
                                                    <option key={field.id} value={field.id}>{field.label}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={filter.operator}
                                                onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                                            >
                                                <option value="equals">Equals</option>
                                                <option value="contains">Contains</option>
                                                <option value="greater">Greater Than</option>
                                                <option value="less">Less Than</option>
                                            </select>
                                            <input
                                                type="text"
                                                value={filter.value}
                                                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                                placeholder="Value"
                                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                                            />
                                            <button
                                                onClick={() => removeFilter(index)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <X className="w-5 h-5 text-red-600" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Panel */}
                <div className="space-y-6">
                    <div className="card-extreme bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Report Summary</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Report Name</label>
                                <input
                                    type="text"
                                    value={reportName}
                                    onChange={(e) => setReportName(e.target.value)}
                                    placeholder="e.g., Monthly Payroll Summary"
                                    className="input-extreme !py-2.5 text-sm"
                                />
                            </div>

                            <div className="p-4 bg-white rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-600">Selected Fields</span>
                                    <span className="text-2xl font-black text-green-600">{selectedFields.length}</span>
                                </div>
                                <div className="text-xs text-slate-500">
                                    {selectedFields.length === 0 ? 'No fields selected' : `${selectedFields.length} field${selectedFields.length > 1 ? 's' : ''} selected`}
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-600">Active Filters</span>
                                    <span className="text-2xl font-black text-orange-600">{filters.length}</span>
                                </div>
                                <div className="text-xs text-slate-500">
                                    {filters.length === 0 ? 'No filters applied' : `${filters.length} filter${filters.length > 1 ? 's' : ''} applied`}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => generateReport('excel')}
                                disabled={selectedFields.length === 0}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                Export to Excel
                            </button>
                            <button
                                onClick={() => generateReport('pdf')}
                                disabled={selectedFields.length === 0}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                Export to PDF
                            </button>
                            <button
                                onClick={() => generateReport('csv')}
                                disabled={selectedFields.length === 0}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                Export to CSV
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-start gap-2">
                                <Wand2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-blue-800">
                                    <div className="font-bold mb-1">Pro Tip</div>
                                    Select fields from different categories to create comprehensive reports!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">Report Preview</h2>
                                        <p className="text-indigo-100 text-sm">Sample data preview with {selectedFields.length} fields</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-auto max-h-[calc(90vh-140px)]">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b-2 border-slate-200">
                                                {selectedFields.map(fieldId => {
                                                    const field = AVAILABLE_FIELDS.find(f => f.id === fieldId);
                                                    return (
                                                        <th key={fieldId} className="px-4 py-3 text-xs font-black text-slate-600 uppercase tracking-wider">
                                                            {field?.label}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {MOCK_PREVIEW_DATA.map((row, index) => (
                                                <tr key={index} className="hover:bg-slate-50">
                                                    {selectedFields.map(fieldId => (
                                                        <td key={fieldId} className="px-4 py-3 text-sm font-semibold text-slate-900">
                                                            {row[fieldId as keyof typeof row] || '—'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
