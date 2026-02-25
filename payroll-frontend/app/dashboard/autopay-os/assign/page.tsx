'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Users,
    IndianRupee,
    Save,
    X,
    ChevronRight,
    TrendingUp,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Filter,
} from 'lucide-react';
import Link from 'next/link';

interface Employee {
    id: string;
    name: string;
    department: string;
    designation: string;
    currentCTC?: string;
    lastRevision?: string;
}

interface SalaryTemplate {
    id: string;
    name: string;
    ctc: string;
    components: number;
}

const MOCK_EMPLOYEES: Employee[] = [
    { id: '1', name: 'Alexander Wright', department: 'Design', designation: 'Product Designer', currentCTC: '₹8,50,000', lastRevision: 'Jan 2024' },
    { id: '2', name: 'Sarah Chen', department: 'Engineering', designation: 'Backend Engineer', currentCTC: '₹12,00,000', lastRevision: 'Feb 2024' },
    { id: '3', name: 'Marcus Johnson', department: 'Human Resources', designation: 'HR Manager' },
    { id: '4', name: 'Elena Rodriguez', department: 'Engineering', designation: 'Frontend Lead', currentCTC: '₹15,00,000', lastRevision: 'Mar 2023' },
    { id: '5', name: 'David Kim', department: 'Operations', designation: 'Operations Analyst', currentCTC: '₹7,50,000', lastRevision: 'Nov 2023' },
];

const SALARY_TEMPLATES: SalaryTemplate[] = [
    { id: '1', name: 'Junior Level', ctc: '₹6,00,000', components: 8 },
    { id: '2', name: 'Mid Level', ctc: '₹10,00,000', components: 10 },
    { id: '3', name: 'Senior Level', ctc: '₹15,00,000', components: 12 },
    { id: '4', name: 'Leadership Level', ctc: '₹25,00,000', components: 15 },
];

export default function AssignSalaryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const filteredEmployees = MOCK_EMPLOYEES.filter(emp => {
        const matchesSearch = (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (emp.designation || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const handleSelectEmployee = (id: string) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(e => e !== id));
        } else {
            setSelectedEmployees([...selectedEmployees, id]);
        }
    };

    const handleAssignSalary = () => {
        if (selectedEmployees.length > 0 && selectedTemplate) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedEmployees([]);
                setSelectedTemplate('');
            }, 3000);
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
                        <Link href="/dashboard/autopay-os" className="hover:text-indigo-600">AutoPay-OS</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Assign Salary</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Assign Salary Structure
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Assign pre-defined salary structures to employees
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
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Employees</div>
                        <div className="text-3xl font-black text-slate-900">{selectedEmployees.length}</div>
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
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">With Salary</div>
                        <div className="text-3xl font-black text-slate-900">
                            {MOCK_EMPLOYEES.filter(e => e.currentCTC).length}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</div>
                        <div className="text-3xl font-black text-slate-900">
                            {MOCK_EMPLOYEES.filter(e => !e.currentCTC).length}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-extreme"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg CTC</div>
                        <div className="text-3xl font-black text-slate-900">₹10.5L</div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Employee Selection */}
                <div className="lg:col-span-2 card-extreme p-0 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-black text-slate-900 mb-4">Select Employees</h2>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    className="input-extreme !py-2.5 !pl-10 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm"
                            >
                                <option value="all">All Departments</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Human Resources">HR</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto">
                        {filteredEmployees.map((employee) => (
                            <motion.div
                                key={employee.id}
                                whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.02)' }}
                                className="p-4 border-b border-slate-50 cursor-pointer"
                                onClick={() => handleSelectEmployee(employee.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(employee.id)}
                                            onChange={() => handleSelectEmployee(employee.id)}
                                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                            {employee.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">{employee.name}</div>
                                            <div className="text-xs text-slate-500">{employee.designation} • {employee.department}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {employee.currentCTC ? (
                                            <>
                                                <div className="font-bold text-sm text-slate-900">{employee.currentCTC}</div>
                                                <div className="text-xs text-slate-500">Last: {employee.lastRevision}</div>
                                            </>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold">
                                                No Salary
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-6">
                    <div className="card-extreme">
                        <h2 className="text-lg font-black text-slate-900 mb-4">Select Salary Template</h2>
                        <div className="space-y-3">
                            {SALARY_TEMPLATES.map((template) => (
                                <motion.div
                                    key={template.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedTemplate(template.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplate === template.id
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-slate-200 bg-white hover:border-indigo-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-bold text-sm text-slate-900">{template.name}</div>
                                        <input
                                            type="radio"
                                            checked={selectedTemplate === template.id}
                                            onChange={() => setSelectedTemplate(template.id)}
                                            className="w-5 h-5 text-indigo-600"
                                        />
                                    </div>
                                    <div className="text-2xl font-black text-indigo-600 mb-1">{template.ctc}</div>
                                    <div className="text-xs text-slate-500">{template.components} components</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleAssignSalary}
                            disabled={selectedEmployees.length === 0 || !selectedTemplate}
                            className="w-full btn-extreme disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Assign to {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedEmployees([]);
                                setSelectedTemplate('');
                            }}
                            className="w-full py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                            <X className="w-4 h-4 mr-2 inline" />
                            Clear Selection
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
                >
                    <CheckCircle2 className="w-6 h-6" />
                    <div>
                        <div className="font-bold">Salary Assigned Successfully!</div>
                        <div className="text-sm opacity-90">Updated {selectedEmployees.length} employee(s)</div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
