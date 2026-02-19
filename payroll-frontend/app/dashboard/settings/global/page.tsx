'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    IndianRupee,
    DollarSign,
    Coins,
    Save,
    Building2,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const COUNTRIES = [
    { name: 'India', code: 'IN', currency: 'INR', symbol: '₹' },
    { name: 'United States', code: 'US', currency: 'USD', symbol: '$' },
    { name: 'UAE', code: 'AE', currency: 'AED', symbol: 'د.إ' },
    { name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£' }
];

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        country: 'India',
        base_currency: 'INR'
    });

    useEffect(() => {
        // Mock fetch or fetch from subscription (which includes company info)
        setSettings({
            country: 'India',
            base_currency: 'INR'
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateCompanySettings(settings);
            toast.success("Organization settings updated! The platform will now use " + settings.base_currency);
        } catch (err: any) {
            toast.error(err.message || "Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                    <Globe className="w-10 h-10 text-indigo-600" />
                    Global Settings
                </h1>
                <p className="text-slate-500 font-medium">
                    Configure your organization's region and financial standards.
                </p>
            </div>

            <div className="card-extreme p-8 bg-white border-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Country Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Primary Location
                        </label>
                        <select
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            value={settings.country}
                            onChange={(e) => {
                                const country = COUNTRIES.find(c => c.name === e.target.value);
                                if (country) {
                                    setSettings({ country: country.name, base_currency: country.currency });
                                }
                            }}
                        >
                            {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Currency Indicator */}
                    <div className="space-y-3">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Coins className="w-4 h-4" />
                            Base Currency
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl border-none">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl font-black">
                                {COUNTRIES.find(c => c.currency === settings.base_currency)?.symbol}
                            </div>
                            <div>
                                <div className="font-black text-lg">{settings.base_currency}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fixed by region</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 max-w-[60%] line-clamp-2">
                        Updating these settings will change how salaries are displayed and generated across the entire employee portal.
                    </p>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* Preview Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-extreme p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 flex items-center gap-6"
            >
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <span className="text-3xl font-black text-indigo-600">
                        {COUNTRIES.find(c => c.currency === settings.base_currency)?.symbol}
                    </span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">Currency Preview</h3>
                    <p className="text-sm font-medium text-slate-500">
                        Example: A salary of 50,000 will be displayed as
                        <span className="font-black text-slate-900 ml-1">
                            {COUNTRIES.find(c => c.currency === settings.base_currency)?.symbol}50,000.00
                        </span>
                    </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 ml-auto" />
            </motion.div>
        </div>
    );
}
