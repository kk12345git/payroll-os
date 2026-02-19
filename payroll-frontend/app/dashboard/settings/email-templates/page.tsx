'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Save,
    ChevronRight,
    FileText,
    Eye,
    Edit,
} from 'lucide-react';
import Link from 'next/link';

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    variables: string[];
}

const MOCK_TEMPLATES: EmailTemplate[] = [
    {
        id: '1',
        name: 'Salary Slip',
        subject: 'Salary Slip for {{month}} {{year}}',
        body: 'Dear {{employee_name}},\n\nPlease find attached your salary slip for {{month}} {{year}}.\n\nGross Salary: ₹{{gross_salary}}\nNet Salary: ₹{{net_salary}}\n\nBest Regards,\nHR Team',
        variables: ['employee_name', 'month', 'year', 'gross_salary', 'net_salary'],
    },
    {
        id: '2',
        name: 'Leave Approval',
        subject: 'Leave Request Approved',
        body: 'Dear {{employee_name}},\n\nYour leave request from {{start_date}} to {{end_date}} has been approved.\n\nLeave Type: {{leave_type}}\nTotal Days: {{days}}\n\nBest Regards,\nHR Team',
        variables: ['employee_name', 'start_date', 'end_date', 'leave_type', 'days'],
    },
    {
        id: '3',
        name: 'Leave Rejection',
        subject: 'Leave Request Rejected',
        body: 'Dear {{employee_name}},\n\nYour leave request from {{start_date}} to {{end_date}} has been rejected.\n\nReason: {{reason}}\n\nBest Regards,\nHR Team',
        variables: ['employee_name', 'start_date', 'end_date', 'reason'],
    },
    {
        id: '4',
        name: 'Welcome Email',
        subject: 'Welcome to {{company_name}}',
        body: 'Dear {{employee_name}},\n\nWelcome to {{company_name}}! We are excited to have you join our team.\n\nYour Employee ID: {{employee_id}}\nJoining Date: {{joining_date}}\nDepartment: {{department}}\n\nBest Regards,\nHR Team',
        variables: ['employee_name', 'company_name', 'employee_id', 'joining_date', 'department'],
    },
];

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
    const [selectedTemplate, setSelectedTemplate] = useState<string>(MOCK_TEMPLATES[0].id);
    const [isEditing, setIsEditing] = useState(false);

    const currentTemplate = templates.find(t => t.id === selectedTemplate);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <Link href="/dashboard" className="hover:text-indigo-600">Admin Console</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/dashboard/settings" className="hover:text-indigo-600">Settings</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Email Templates</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Email Templates
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Customize automated email notifications
                    </p>
                </div>

                <button className="btn-extreme">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates List */}
                <div className="card-extreme">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Templates</h2>
                    </div>

                    <div className="space-y-2">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    setSelectedTemplate(template.id);
                                    setIsEditing(false);
                                }}
                                className={`w-full p-4 rounded-xl text-left transition-all ${selectedTemplate === template.id
                                        ? 'bg-indigo-50 border-2 border-indigo-500'
                                        : 'bg-slate-50 border-2 border-slate-200 hover:border-indigo-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <div className="font-bold text-slate-900">{template.name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Template Editor */}
                <div className="lg:col-span-2 card-extreme">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{currentTemplate?.name}</h2>
                                <p className="text-sm text-slate-500">{currentTemplate?.variables.length} variables available</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            {isEditing ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                            {isEditing ? 'Preview' : 'Edit'}
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Subject</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    defaultValue={currentTemplate?.subject}
                                    className="input-extreme"
                                />
                            ) : (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-900">
                                    {currentTemplate?.subject}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Body</label>
                            {isEditing ? (
                                <textarea
                                    defaultValue={currentTemplate?.body}
                                    rows={12}
                                    className="input-extreme resize-none font-mono text-sm"
                                />
                            ) : (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm text-slate-900 whitespace-pre-wrap">
                                    {currentTemplate?.body}
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <h3 className="text-sm font-bold text-blue-900 mb-3">Available Variables</h3>
                            <div className="flex flex-wrap gap-2">
                                {currentTemplate?.variables.map(variable => (
                                    <span
                                        key={variable}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-mono font-bold cursor-pointer hover:bg-blue-200 transition-all"
                                        onClick={() => navigator.clipboard.writeText(`{{${variable}}}`)}
                                    >
                                        {`{{${variable}}}`}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-blue-700 mt-3">Click a variable to copy it</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
