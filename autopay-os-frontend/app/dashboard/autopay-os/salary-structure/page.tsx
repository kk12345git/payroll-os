'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calculator, IndianRupee, TrendingUp, Percent, DollarSign } from 'lucide-react';
import { useSalaryStore, SalaryComponent } from '@/store/useSalaryStore';

export default function SalaryStructurePage() {
    const { components, addComponent, calculateCTC } = useSalaryStore();
    const [selectedComponents, setSelectedComponents] = useState<SalaryComponent[]>([]);
    const [basicSalary, setBasicSalary] = useState(30000);

    // Calculate component values based on basic salary
    const calculatedComponents = selectedComponents.map((comp) => {
        if (comp.calculationType === 'percentage' && comp.baseComponent === 'BASIC') {
            return { ...comp, calculatedValue: (basicSalary * comp.value) / 100 };
        }
        return { ...comp, calculatedValue: comp.value };
    });

    const { ctc, gross, net } = calculateCTC(
        calculatedComponents.map((c) => ({
            ...c,
            value: c.calculatedValue || c.value,
        }))
    );

    const toggleComponent = (component: SalaryComponent) => {
        if (selectedComponents.find((c) => c.id === component.id)) {
            setSelectedComponents(selectedComponents.filter((c) => c.id !== component.id));
        } else {
            setSelectedComponents([...selectedComponents, component]);
        }
    };

    const earnings = components.filter((c) => c.type === 'earning');
    const deductions = components.filter((c) => c.type === 'deduction');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Salary Structure Builder
                    </h1>
                    <p className="text-slate-600">
                        Create and manage salary structures with Indian compliance
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Component Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Salary Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                    <IndianRupee className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Basic Salary</h3>
                                    <p className="text-sm text-slate-500">Foundation of salary structure</p>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={basicSalary}
                                onChange={(e) => setBasicSalary(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold"
                                placeholder="Enter basic salary"
                            />
                        </motion.div>

                        {/* Earnings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-green-100 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Earnings</h3>
                                    <p className="text-sm text-slate-500">Select applicable allowances</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {earnings.map((component) => {
                                    const isSelected = selectedComponents.find((c) => c.id === component.id);
                                    return (
                                        <motion.button
                                            key={component.id}
                                            onClick={() => toggleComponent(component)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full p-4 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'bg-green-50 border-green-500 shadow-lg'
                                                    : 'bg-white border-slate-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-800">{component.name}</div>
                                                    <div className="text-sm text-slate-500">
                                                        {component.calculationType === 'percentage'
                                                            ? `${component.value}% of ${component.baseComponent}`
                                                            : `₹${component.value.toLocaleString()}`}
                                                    </div>
                                                </div>
                                                {component.calculationType === 'percentage' ? (
                                                    <Percent className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <DollarSign className="w-5 h-5 text-green-600" />
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Deductions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-red-100 shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                                    <Calculator className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">Deductions</h3>
                                    <p className="text-sm text-slate-500">Statutory & other deductions</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {deductions.map((component) => {
                                    const isSelected = selectedComponents.find((c) => c.id === component.id);
                                    return (
                                        <motion.button
                                            key={component.id}
                                            onClick={() => toggleComponent(component)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full p-4 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'bg-red-50 border-red-500 shadow-lg'
                                                    : 'bg-white border-slate-200 hover:border-red-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="text-left">
                                                    <div className="font-semibold text-slate-800">{component.name}</div>
                                                    <div className="text-sm text-slate-500">
                                                        {component.calculationType === 'percentage'
                                                            ? `${component.value}% of ${component.baseComponent}`
                                                            : `₹${component.value.toLocaleString()}`}
                                                    </div>
                                                </div>
                                                {component.isStatutory && (
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-semibold">
                                                        Statutory
                                                    </span>
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: CTC Calculator */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-2xl sticky top-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                                    <Calculator className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">CTC Breakdown</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl">
                                    <div className="text-sm opacity-80 mb-1">Cost to Company (Annual)</div>
                                    <div className="text-3xl font-bold">₹{(ctc * 12).toLocaleString()}</div>
                                </div>

                                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl">
                                    <div className="text-sm opacity-80 mb-1">Gross Salary (Monthly)</div>
                                    <div className="text-2xl font-bold">₹{gross.toLocaleString()}</div>
                                </div>

                                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl">
                                    <div className="text-sm opacity-80 mb-1">Net Salary (Monthly)</div>
                                    <div className="text-2xl font-bold">₹{net.toLocaleString()}</div>
                                </div>

                                <div className="border-t border-white/20 pt-4 mt-4">
                                    <h4 className="font-semibold mb-3">Selected Components</h4>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {calculatedComponents.map((comp) => (
                                            <div key={comp.id} className="flex justify-between text-sm">
                                                <span className="opacity-80">{comp.name}</span>
                                                <span className="font-semibold">
                                                    {comp.type === 'earning' ? '+' : '-'}₹
                                                    {(comp.calculatedValue || comp.value).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Save Salary Structure
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
