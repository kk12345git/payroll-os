'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calculator,
    IndianRupee,
    TrendingDown,
    FileText,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Info,
    Download,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface TaxBreakdown {
    slab: string;
    amount: number;
    rate: string;
    tax: number;
}

export default function IncomeTaxCalculatorPage() {
    const [annualIncome, setAnnualIncome] = useState('1200000');
    const [deductions80C, setDeductions80C] = useState('150000');
    const [deductions80D, setDeductions80D] = useState('25000');
    const [homeLoanInterest, setHomeLoanInterest] = useState('200000');
    const [otherDeductions, setOtherDeductions] = useState('50000');
    const [selectedRegime, setSelectedRegime] = useState<'old' | 'new'>('new');

    const income = parseFloat(annualIncome) || 0;
    const totalDeductions = parseFloat(deductions80C) + parseFloat(deductions80D) +
        parseFloat(homeLoanInterest) + parseFloat(otherDeductions);

    // Old Regime Calculation
    const calculateOldRegime = () => {
        const taxableIncome = Math.max(0, income - totalDeductions);
        let tax = 0;
        const breakdown: TaxBreakdown[] = [];

        if (taxableIncome > 250000) {
            const slab1 = Math.min(taxableIncome - 250000, 250000);
            tax += slab1 * 0.05;
            breakdown.push({ slab: '₹2.5L - ₹5L', amount: slab1, rate: '5%', tax: slab1 * 0.05 });
        }
        if (taxableIncome > 500000) {
            const slab2 = Math.min(taxableIncome - 500000, 500000);
            tax += slab2 * 0.20;
            breakdown.push({ slab: '₹5L - ₹10L', amount: slab2, rate: '20%', tax: slab2 * 0.20 });
        }
        if (taxableIncome > 1000000) {
            const slab3 = taxableIncome - 1000000;
            tax += slab3 * 0.30;
            breakdown.push({ slab: 'Above ₹10L', amount: slab3, rate: '30%', tax: slab3 * 0.30 });
        }

        const cess = tax * 0.04;
        return { taxableIncome, tax, cess, total: tax + cess, breakdown };
    };

    // New Regime Calculation
    const calculateNewRegime = () => {
        const taxableIncome = income;
        let tax = 0;
        const breakdown: TaxBreakdown[] = [];

        if (taxableIncome > 300000) {
            const slab1 = Math.min(taxableIncome - 300000, 300000);
            tax += slab1 * 0.05;
            breakdown.push({ slab: '₹3L - ₹6L', amount: slab1, rate: '5%', tax: slab1 * 0.05 });
        }
        if (taxableIncome > 600000) {
            const slab2 = Math.min(taxableIncome - 600000, 300000);
            tax += slab2 * 0.10;
            breakdown.push({ slab: '₹6L - ₹9L', amount: slab2, rate: '10%', tax: slab2 * 0.10 });
        }
        if (taxableIncome > 900000) {
            const slab3 = Math.min(taxableIncome - 900000, 300000);
            tax += slab3 * 0.15;
            breakdown.push({ slab: '₹9L - ₹12L', amount: slab3, rate: '15%', tax: slab3 * 0.15 });
        }
        if (taxableIncome > 1200000) {
            const slab4 = Math.min(taxableIncome - 1200000, 300000);
            tax += slab4 * 0.20;
            breakdown.push({ slab: '₹12L - ₹15L', amount: slab4, rate: '20%', tax: slab4 * 0.20 });
        }
        if (taxableIncome > 1500000) {
            const slab5 = taxableIncome - 1500000;
            tax += slab5 * 0.30;
            breakdown.push({ slab: 'Above ₹15L', amount: slab5, rate: '30%', tax: slab5 * 0.30 });
        }

        const cess = tax * 0.04;
        return { taxableIncome, tax, cess, total: tax + cess, breakdown };
    };

    const oldRegime = calculateOldRegime();
    const newRegime = calculateNewRegime();
    const recommended = newRegime.total < oldRegime.total ? 'new' : 'old';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
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
                        <span className="text-indigo-600">Income Tax Calculator</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Income Tax Calculator
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Compare Old vs New Tax Regime for FY 2024-25
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-extreme">
                        <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-indigo-600" />
                            Income & Deductions
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Annual Gross Income
                                </label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        value={annualIncome}
                                        onChange={(e) => setAnnualIncome(e.target.value)}
                                        className="input-extreme !pl-10"
                                        placeholder="1200000"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-4 h-4 text-indigo-600" />
                                    <h3 className="text-sm font-bold text-slate-900">Deductions (Old Regime Only)</h3>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                            80C (PPF, ELSS, etc.)
                                        </label>
                                        <input
                                            type="number"
                                            value={deductions80C}
                                            onChange={(e) => setDeductions80C(e.target.value)}
                                            className="input-extreme !py-2 text-sm"
                                            placeholder="150000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                            80D (Health Insurance)
                                        </label>
                                        <input
                                            type="number"
                                            value={deductions80D}
                                            onChange={(e) => setDeductions80D(e.target.value)}
                                            className="input-extreme !py-2 text-sm"
                                            placeholder="25000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                            24(b) Home Loan Interest
                                        </label>
                                        <input
                                            type="number"
                                            value={homeLoanInterest}
                                            onChange={(e) => setHomeLoanInterest(e.target.value)}
                                            className="input-extreme !py-2 text-sm"
                                            placeholder="200000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                            Other Deductions
                                        </label>
                                        <input
                                            type="number"
                                            value={otherDeductions}
                                            onChange={(e) => setOtherDeductions(e.target.value)}
                                            className="input-extreme !py-2 text-sm"
                                            placeholder="50000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <div className="text-xs font-bold text-slate-500 mb-1">Total Deductions</div>
                                <div className="text-2xl font-black text-slate-900">{formatCurrency(totalDeductions)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Results */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Old Regime */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className={`card-extreme cursor-pointer ${selectedRegime === 'old' ? 'ring-2 ring-indigo-500' : ''}`}
                            onClick={() => setSelectedRegime('old')}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-slate-900">Old Regime</h3>
                                {recommended === 'old' && (
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                        Recommended
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500">Taxable Income</div>
                                    <div className="text-xl font-black text-slate-900">{formatCurrency(oldRegime.taxableIncome)}</div>
                                </div>
                                <div className="border-t border-slate-100 pt-3">
                                    <div className="text-xs font-semibold text-slate-500">Total Tax (incl. cess)</div>
                                    <div className="text-3xl font-black text-indigo-600">{formatCurrency(oldRegime.total)}</div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                                    With Deductions: {formatCurrency(totalDeductions)}
                                </div>
                            </div>
                        </motion.div>

                        {/* New Regime */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className={`card-extreme cursor-pointer ${selectedRegime === 'new' ? 'ring-2 ring-indigo-500' : ''}`}
                            onClick={() => setSelectedRegime('new')}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-slate-900">New Regime</h3>
                                {recommended === 'new' && (
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                        Recommended
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500">Taxable Income</div>
                                    <div className="text-xl font-black text-slate-900">{formatCurrency(newRegime.taxableIncome)}</div>
                                </div>
                                <div className="border-t border-slate-100 pt-3">
                                    <div className="text-xs font-semibold text-slate-500">Total Tax (incl. cess)</div>
                                    <div className="text-3xl font-black text-purple-600">{formatCurrency(newRegime.total)}</div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                                    No Deductions Allowed
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="card-extreme">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-slate-900">
                                {selectedRegime === 'old' ? 'Old' : 'New'} Regime - Tax Breakdown
                            </h2>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all">
                                <Download className="w-4 h-4" />
                                Download Report
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left py-3 px-4 text-xs font-black text-slate-500 uppercase">Slab</th>
                                        <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase">Amount</th>
                                        <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase">Rate</th>
                                        <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase">Tax</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedRegime === 'old' ? oldRegime : newRegime).breakdown.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-50">
                                            <td className="py-3 px-4 text-sm font-semibold text-slate-900">{item.slab}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">
                                                {formatCurrency(item.amount)}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-bold text-indigo-600 text-right">{item.rate}</td>
                                            <td className="py-3 px-4 text-sm font-black text-slate-900 text-right">
                                                {formatCurrency(item.tax)}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 font-bold">
                                        <td className="py-3 px-4 text-sm" colSpan={3}>Tax Before Cess</td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            {formatCurrency((selectedRegime === 'old' ? oldRegime : newRegime).tax)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-sm font-semibold" colSpan={3}>Health & Education Cess (4%)</td>
                                        <td className="py-3 px-4 text-sm font-semibold text-right">
                                            {formatCurrency((selectedRegime === 'old' ? oldRegime : newRegime).cess)}
                                        </td>
                                    </tr>
                                    <tr className="bg-indigo-50 border-t-2 border-indigo-200">
                                        <td className="py-4 px-4 text-base font-black text-slate-900" colSpan={3}>Total Tax Payable</td>
                                        <td className="py-4 px-4 text-xl font-black text-indigo-600 text-right">
                                            {formatCurrency((selectedRegime === 'old' ? oldRegime : newRegime).total)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Savings Alert */}
                    {Math.abs(oldRegime.total - newRegime.total) > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-2xl border-2 ${recommended === 'new'
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-purple-50 border-purple-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl ${recommended === 'new' ? 'bg-green-100' : 'bg-purple-100'
                                    } flex items-center justify-center`}>
                                    <TrendingDown className={`w-6 h-6 ${recommended === 'new' ? 'text-green-600' : 'text-purple-600'
                                        }`} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">
                                        Save {formatCurrency(Math.abs(oldRegime.total - newRegime.total))} with {recommended === 'new' ? 'New' : 'Old'} Regime!
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {recommended === 'new'
                                            ? 'New regime offers better tax savings for your income level'
                                            : 'Old regime is better with your current deductions'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
