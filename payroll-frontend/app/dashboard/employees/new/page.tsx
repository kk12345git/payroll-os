"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Calendar,
    CreditCard,
    Globe,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Banknote,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STEPS = [
    { id: 1, title: 'Personal Identity', icon: <User className="w-4 h-4" /> },
    { id: 2, title: 'Work & role', icon: <Briefcase className="w-4 h-4" /> },
    { id: 3, title: 'Statutory & Bank', icon: <ShieldCheck className="w-4 h-4" /> },
];

export default function NewEmployeePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',

        // Work
        employeeCode: '',
        department: '',
        designation: '',
        joiningDate: '',

        // Statutory
        pan: '',
        aadhaar: '',
        uan: '',
        esi: '',

        // Bank
        accountNumber: '',
        ifsc: '',
        bankName: '',
        taxRegime: 'new'
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < STEPS.length) {
            nextStep();
        } else {
            // Final submission logic here
            console.log("Submitting:", formData);
            router.push('/dashboard/employees');
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Admin Console</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/dashboard/employees" className="hover:text-indigo-600 transition-colors">Workforce</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-indigo-600">Onboard New Talent</span>
            </nav>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 shimmer-text">
                    Onboard New Talent
                </h1>
                <p className="text-slate-500 font-medium">Add a new professional to your organization's roster.</p>
            </div>

            {/* Stepper Infrastructure */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                {STEPS.map((step) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${currentStep >= step.id
                            ? 'bg-indigo-600 border-indigo-100 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white border-slate-50 text-slate-400 shadow-sm'
                            }`}>
                            {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-indigo-600' : 'text-slate-400'
                            }`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Container */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-extreme p-8 md:p-10"
            >
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <FormSection key="step1" title="Personal Identity" description="Basic information required for official identification.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Full Legal Name" icon={<User />} placeholder="e.g. Jonathan Wrights" required />
                                <InputGroup label="Work Email Address" icon={<Mail />} type="email" placeholder="jonathan@company.pro" required />
                                <InputGroup label="Phone Number" icon={<Phone />} placeholder="+91 98765 43210" />
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Gender Selection</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Male', 'Female', 'Other'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all"
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <InputGroup label="Date of Birth" icon={<Calendar />} type="date" placeholder="Select date" />
                            </div>
                        </FormSection>
                    )}

                    {currentStep === 2 && (
                        <FormSection key="step2" title="Employment & Role" description="Configure the professional's position within the organizational hierarchy.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Auto-Generated Code" icon={<FileText />} placeholder="EMP-2024-001" required />
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Assigned Department</label>
                                    <select className="input-extreme !py-3 appearance-none">
                                        <option>Select Department</option>
                                        <option>Engineering</option>
                                        <option>Design</option>
                                        <option>Human Resources</option>
                                    </select>
                                </div>
                                <InputGroup label="Official Designation" icon={<Briefcase />} placeholder="e.g. Senior Backend Engineer" required />
                                <InputGroup label="Joining Date" icon={<Calendar />} type="date" placeholder="Select date" required />
                            </div>
                        </FormSection>
                    )}

                    {currentStep === 3 && (
                        <FormSection key="step3" title="Statutory & Banking" description="Crucial data for payroll processing and Indian tax compliance.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="PAN Number (10 Digits)" icon={<CreditCard />} placeholder="ABCDE1234F" required />
                                <InputGroup label="Aadhaar Number" icon={<ShieldCheck />} placeholder="1234 5678 9012" required />
                                <InputGroup label="Bank Account Number" icon={<Banknote />} placeholder="0000 0000 0000" required />
                                <InputGroup label="Bank IFSC Code" icon={<Globe />} placeholder="SBIN000123" required />
                                <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Tax Regime Selection</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-600 transition-all group">
                                            <input type="radio" name="regime" className="mt-1 accent-indigo-600" defaultChecked />
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">New Tax Regime (Default)</div>
                                                <p className="text-[10px] text-slate-400 font-medium mt-1">Lower tax rates, minimal deductions. Ideal for high gross income.</p>
                                            </div>
                                        </label>
                                        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-600 transition-all group">
                                            <input type="radio" name="regime" className="mt-1 accent-indigo-600" />
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">Old Tax Regime</div>
                                                <p className="text-[10px] text-slate-400 font-medium mt-1">Allows common deductions like 80C, HRA, Insurance premiums.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </FormSection>
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${currentStep === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous Phase
                    </button>

                    <button type="submit" className="btn-extreme !px-10">
                        {currentStep === STEPS.length ? 'Finalize Onboarding' : (
                            <span className="flex items-center gap-2">
                                Continue to Next
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}

interface FormSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">{description}</p>
            </div>
            {children}
        </motion.div>
    );
}

interface InputGroupProps {
    label: string;
    icon: React.ReactElement;
    type?: string;
    placeholder: string;
    required?: boolean;
}

function InputGroup({ label, icon, type = "text", placeholder, required = false }: InputGroupProps) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    {React.cloneElement(icon, {
                        className: "w-4 h-4",
                        ...({} as any) // Type bail for cloneElement props 
                    })}
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    className="input-extreme !pl-12 text-sm"
                />
            </div>
        </div>
    );
}
