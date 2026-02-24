'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building,
    Save,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    Globe,
    FileText,
    IndianRupee,
    Upload,
} from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';

export default function CompanyProfilePage() {
    const [formData, setFormData] = useState({
        companyName: 'KRG Digital Solutions Pvt Ltd',
        legalName: 'KRG Digital Solutions Private Limited',
        registrationNumber: 'U74999TG2020PTC136542',
        panNumber: 'AABCK1234F',
        tanNumber: 'BLRK12345D',
        gstNumber: '36AABCK1234F1Z5',
        address: '123, Tech Park, Hitech City',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        country: 'India',
        phone: '+91 9876543210',
        email: 'hr@krgdigital.com',
        website: 'www.krgdigital.com',
        pfNumber: 'TNCHE1234567000',
        esiNumber: 'ESI123456789',
        ptNumber: 'PT123456',
        lwfNumber: 'LWF123456',
        financialYearStart: '04',
        dataRegion: 'India',
    });

    const [saving, setSaving] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/companies/settings`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    country: formData.country,
                    data_region: formData.dataRegion
                })
            });
            if (res.ok) {
                alert('Settings updated successfully!');
            }
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setSaving(false);
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
                        <Link href="/dashboard/settings" className="hover:text-indigo-600">Settings</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600">Company Profile</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        Company Profile Settings
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage company information and statutory details
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-extreme disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Basic Information */}
            <div className="card-extreme">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                            className="input-extreme"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Legal Name *</label>
                        <input
                            type="text"
                            value={formData.legalName}
                            onChange={(e) => handleChange('legalName', e.target.value)}
                            className="input-extreme"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">CIN/Registration Number</label>
                        <input
                            type="text"
                            value={formData.registrationNumber}
                            onChange={(e) => handleChange('registrationNumber', e.target.value)}
                            className="input-extreme"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Financial Year Start (Month)</label>
                        <select
                            value={formData.financialYearStart}
                            onChange={(e) => handleChange('financialYearStart', e.target.value)}
                            className="input-extreme"
                        >
                            <option value="01">January</option>
                            <option value="04">April</option>
                            <option value="07">July</option>
                            <option value="10">October</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Global Sovereignty & Data Residency */}
            <div className="card-extreme border-2 border-indigo-500/10 bg-indigo-50/10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Globe className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase italic">Data Sovereignty</h2>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">GDPR / DPDP Compliance Control</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                            AutoPay-OS ensures global regulatory compliance by allowing you to pin your organizational data to specific geographic legal regions.
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-indigo-100 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Encryption: AES-256-GCM</span>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Globe className="w-24 h-24" />
                        </div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 font-mono">Select Data Residency Node</label>
                        <div className="space-y-4 relative z-10">
                            {[
                                { id: 'India', label: 'India (MeitY Approved)', flag: '🇮🇳' },
                                { id: 'EU', label: 'European Union (GDPR)', flag: '🇪🇺' },
                                { id: 'US', label: 'United States (HIPAA/SOC2)', flag: '🇺🇸' }
                            ].map((region) => (
                                <button
                                    key={region.id}
                                    onClick={() => handleChange('dataRegion', region.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${formData.dataRegion === region.id
                                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{region.flag}</span>
                                        <span className="text-xs font-black uppercase tracking-widest">{region.label}</span>
                                    </div>
                                    {formData.dataRegion === region.id && (
                                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tax Information */}
            <div className="card-extreme">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Tax Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">PAN Number *</label>
                        <input
                            type="text"
                            value={formData.panNumber}
                            onChange={(e) => handleChange('panNumber', e.target.value)}
                            className="input-extreme"
                            placeholder="AABCK1234F"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">TAN Number</label>
                        <input
                            type="text"
                            value={formData.tanNumber}
                            onChange={(e) => handleChange('tanNumber', e.target.value)}
                            className="input-extreme"
                            placeholder="BLRK12345D"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">GST Number</label>
                        <input
                            type="text"
                            value={formData.gstNumber}
                            onChange={(e) => handleChange('gstNumber', e.target.value)}
                            className="input-extreme"
                            placeholder="36AABCK1234F1Z5"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="card-extreme">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Contact & Address</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Registered Address *</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="input-extreme"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="input-extreme"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">State *</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                                className="input-extreme"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">PIN Code *</label>
                            <input
                                type="text"
                                value={formData.pincode}
                                onChange={(e) => handleChange('pincode', e.target.value)}
                                className="input-extreme"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Country *</label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                className="input-extreme"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="input-extreme !pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="input-extreme !pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    className="input-extreme !pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statutory Numbers */}
            <div className="card-extreme">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                        <IndianRupee className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Statutory Registration Numbers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">PF Registration Number</label>
                        <input
                            type="text"
                            value={formData.pfNumber}
                            onChange={(e) => handleChange('pfNumber', e.target.value)}
                            className="input-extreme"
                            placeholder="TNCHE1234567000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">ESI Registration Number</label>
                        <input
                            type="text"
                            value={formData.esiNumber}
                            onChange={(e) => handleChange('esiNumber', e.target.value)}
                            className="input-extreme"
                            placeholder="ESI123456789"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Tax Number</label>
                        <input
                            type="text"
                            value={formData.ptNumber}
                            onChange={(e) => handleChange('ptNumber', e.target.value)}
                            className="input-extreme"
                            placeholder="PT123456"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Labour Welfare Fund Number</label>
                        <input
                            type="text"
                            value={formData.lwfNumber}
                            onChange={(e) => handleChange('lwfNumber', e.target.value)}
                            className="input-extreme"
                            placeholder="LWF123456"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
