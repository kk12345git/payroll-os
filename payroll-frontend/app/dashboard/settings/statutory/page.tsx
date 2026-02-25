'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Save,
    ChevronRight,
    Shield,
    IndianRupee,
    Percent,
    Calendar,
    Info,
} from 'lucide-react';
import Link from 'next/link';

export default function StatutorySettingsPage() {
    const [pfSettings, setPfSettings] = useState({
        employeeRate: '12',
        employerRate: '12',
        threshold: '15000',
        adminCharges: '1.1',
        edliCharges: '0.5',
    });

    const [esiSettings, setEsiSettings] = useState({
        employeeRate: '0.75',
        employerRate: '3.25',
        threshold: '21000',
    });

    const [ptSettings, setPtSettings] = useState({
        enabled: true,
        state: 'Telangana',
        deductionMonth: 'February',
    });

    const [lwfSettings, setLwfSettings] = useState({
        enabled: true,
        employeeAmount: '10',
        employerAmount: '20',
        frequency: 'half-yearly',
    });

    const handleSave = () => {
        console.log('Saving statutory settings');
    };

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
                        <span className="text-indigo-600">Statutory Settings</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Statutory Settings
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Configure PF, ESI, PT, and LWF rates and thresholds
                    </p>
                </div>

                <button onClick={handleSave} className="btn-extreme">
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                </button>
            </div>

            {/* PF Settings */}
            <div className="card-extreme">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Provident Fund (PF)</h2>
                            <p className="text-sm text-slate-500">Employee Provident Fund Organization (EPFO)</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-bold">ENABLED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Employee Contribution (%) *</label>
                        <div className="relative">
                            <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={pfSettings.employeeRate}
                                onChange={(e) => setPfSettings(prev => ({ ...prev, employeeRate: e.target.value }))}
                                className="input-extreme !pr-10"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Employer Contribution (%) *</label>
                        <div className="relative">
                            <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={pfSettings.employerRate}
                                onChange={(e) => setPfSettings(prev => ({ ...prev, employerRate: e.target.value }))}
                                className="input-extreme !pr-10"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Wage Ceiling (₹) *</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={pfSettings.threshold}
                                onChange={(e) => setPfSettings(prev => ({ ...prev, threshold: e.target.value }))}
                                className="input-extreme !pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Charges (%) *</label>
                        <div className="relative">
                            <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={pfSettings.adminCharges}
                                onChange={(e) => setPfSettings(prev => ({ ...prev, adminCharges: e.target.value }))}
                                className="input-extreme !pr-10"
                                step="0.1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">EDLI Charges (%) *</label>
                        <div className="relative">
                            <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={pfSettings.edliCharges}
                                onChange={(e) => setPfSettings(prev => ({ ...prev, edliCharges: e.target.value }))}
                                className="input-extreme !pr-10"
                                step="0.1"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <div className="font-bold mb-1">PF Calculation</div>
                            Total PF = Employee PF ({pfSettings.employeeRate}%) + Employer PF ({pfSettings.employerRate}%) + Admin ({pfSettings.adminCharges}%) + EDLI ({pfSettings.edliCharges}%)
                        </div>
                    </div>
                </div>
            </div>

            {/* ESI Settings */}
            <div className="card-extreme">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Employee State Insurance (ESI)</h2>
                            <p className="text-sm text-slate-500">Employees' State Insurance Corporation (ESIC)</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-bold">ENABLED</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Employee Contribution (%) *</label>
                        <div className="relative">
                            <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={esiSettings.employeeRate}
                                onChange={(e) => setEsiSettings(prev => ({ ...prev, employeeRate: e.target.value }))}
                                className="input-extreme !pr-10"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Employer Contribution (%) *</label>
                        <div className="relative">
                            <Percent className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={esiSettings.employerRate}
                                onChange={(e) => setEsiSettings(prev => ({ ...prev, employerRate: e.target.value }))}
                                className="input-extreme !pr-10"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Wage Ceiling (₹) *</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={esiSettings.threshold}
                                onChange={(e) => setEsiSettings(prev => ({ ...prev, threshold: e.target.value }))}
                                className="input-extreme !pl-10"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-green-800">
                            <div className="font-bold mb-1">ESI Applicability</div>
                            ESI is applicable for employees earning up to ₹{esiSettings.threshold} per month.
                        </div>
                    </div>
                </div>
            </div>

            {/* PT Settings */}
            <div className="card-extreme">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <IndianRupee className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Professional Tax (PT)</h2>
                            <p className="text-sm text-slate-500">State-specific professional tax</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={ptSettings.enabled}
                            onChange={(e) => setPtSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                            className="w-5 h-5 rounded"
                        />
                        <span className={`px-4 py-2 rounded-full text-xs font-bold ${ptSettings.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {ptSettings.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </label>
                </div>

                {ptSettings.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">State *</label>
                            <select
                                value={ptSettings.state}
                                onChange={(e) => setPtSettings(prev => ({ ...prev, state: e.target.value }))}
                                className="input-extreme"
                            >
                                <option value="Telangana">Telangana</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Deduction Month *</label>
                            <select
                                value={ptSettings.deductionMonth}
                                onChange={(e) => setPtSettings(prev => ({ ...prev, deductionMonth: e.target.value }))}
                                className="input-extreme"
                            >
                                <option value="February">February</option>
                                <option value="March">March</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* LWF Settings */}
            <div className="card-extreme">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Labour Welfare Fund (LWF)</h2>
                            <p className="text-sm text-slate-500">State labour welfare contribution</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={lwfSettings.enabled}
                            onChange={(e) => setLwfSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                            className="w-5 h-5 rounded"
                        />
                        <span className={`px-4 py-2 rounded-full text-xs font-bold ${lwfSettings.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {lwfSettings.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                    </label>
                </div>

                {lwfSettings.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Employee Amount (₹) *</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={lwfSettings.employeeAmount}
                                    onChange={(e) => setLwfSettings(prev => ({ ...prev, employeeAmount: e.target.value }))}
                                    className="input-extreme !pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Employer Amount (₹) *</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={lwfSettings.employerAmount}
                                    onChange={(e) => setLwfSettings(prev => ({ ...prev, employerAmount: e.target.value }))}
                                    className="input-extreme !pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Deduction Frequency *</label>
                            <select
                                value={lwfSettings.frequency}
                                onChange={(e) => setLwfSettings(prev => ({ ...prev, frequency: e.target.value }))}
                                className="input-extreme"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="half-yearly">Half-Yearly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
