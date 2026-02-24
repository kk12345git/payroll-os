'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Save,
    ChevronRight,
    Users,
    Check,
    X,
} from 'lucide-react';
import Link from 'next/link';

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
}

const ALL_PERMISSIONS = [
    'view_employees', 'add_employees', 'edit_employees', 'delete_employees',
    'view_payroll', 'process_payroll', 'edit_payroll',
    'view_attendance', 'mark_attendance', 'approve_attendance',
    'view_leaves', 'approve_leaves', 'manage_leave_policy',
    'view_reports', 'export_reports',
    'manage_settings', 'manage_users', 'manage_roles',
];

const MOCK_ROLES: Role[] = [
    { id: '1', name: 'Admin', description: 'Full system access', permissions: ALL_PERMISSIONS },
    { id: '2', name: 'HR Manager', description: 'Manage employees and payroll', permissions: ['view_employees', 'add_employees', 'edit_employees', 'view_payroll', 'process_payroll', 'approve_leaves', 'view_reports'] },
    { id: '3', name: 'HR Executive', description: 'View and update employee records', permissions: ['view_employees', 'add_employees', 'edit_employees', 'view_attendance', 'mark_attendance'] },
    { id: '4', name: 'Employee', description: 'Basic employee access', permissions: ['view_employees'] },
];

export default function UserRolesPage() {
    const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
    const [selectedRole, setSelectedRole] = useState<string>(MOCK_ROLES[0].id);

    const currentRole = roles.find(r => r.id === selectedRole);

    const hasPermission = (permission: string) => {
        return currentRole?.permissions.includes(permission) || false;
    };

    const togglePermission = (permission: string) => {
        if (currentRole) {
            const newPermissions = hasPermission(permission)
                ? currentRole.permissions.filter(p => p !== permission)
                : [...currentRole.permissions, permission];

            setRoles(prev => prev.map(role =>
                role.id === selectedRole ? { ...role, permissions: newPermissions } : role
            ));
        }
    };

    const getPermissionLabel = (permission: string) => {
        return permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
                        <span className="text-indigo-600">User Roles</span>
                    </nav>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 shimmer-text">
                        User Roles & Permissions
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage user roles and access control
                    </p>
                </div>

                <button className="btn-extreme">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Roles List */}
                <div className="card-extreme">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Roles</h2>
                    </div>

                    <div className="space-y-2">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`w-full p-4 rounded-xl text-left transition-all ${selectedRole === role.id
                                        ? 'bg-indigo-50 border-2 border-indigo-500'
                                        : 'bg-slate-50 border-2 border-slate-200 hover:border-indigo-200'
                                    }`}
                            >
                                <div className="font-bold text-slate-900 mb-1">{role.name}</div>
                                <div className="text-sm text-slate-500">{role.description}</div>
                                <div className="text-xs text-indigo-600 font-semibold mt-2">
                                    {role.permissions.length} permissions
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions */}
                <div className="lg:col-span-2 card-extreme">
                    <div className="flex items-center gap- mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{currentRole?.name} Permissions</h2>
                            <p className="text-sm text-slate-500">{currentRole?.description}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Employee Permissions */}
                        <div>
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">Employee Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['view_employees', 'add_employees', 'edit_employees', 'delete_employees'].map(permission => (
                                    <label
                                        key={permission}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${hasPermission(permission)
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={hasPermission(permission)}
                                                onChange={() => togglePermission(permission)}
                                                className="w-5 h-5 rounded"
                                            />
                                            <span className="font-semibold text-slate-900">{getPermissionLabel(permission)}</span>
                                        </div>
                                        {hasPermission(permission) && <Check className="w-5 h-5 text-green-600" />}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* AutoPay-OS Permissions */}
                        <div>
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">AutoPay-OS Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['view_payroll', 'process_payroll', 'edit_payroll'].map(permission => (
                                    <label
                                        key={permission}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${hasPermission(permission)
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={hasPermission(permission)}
                                                onChange={() => togglePermission(permission)}
                                                className="w-5 h-5 rounded"
                                            />
                                            <span className="font-semibold text-slate-900">{getPermissionLabel(permission)}</span>
                                        </div>
                                        {hasPermission(permission) && <Check className="w-5 h-5 text-green-600" />}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Attendance Permissions */}
                        <div>
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">Attendance Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['view_attendance', 'mark_attendance', 'approve_attendance'].map(permission => (
                                    <label
                                        key={permission}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${hasPermission(permission)
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={hasPermission(permission)}
                                                onChange={() => togglePermission(permission)}
                                                className="w-5 h-5 rounded"
                                            />
                                            <span className="font-semibold text-slate-900">{getPermissionLabel(permission)}</span>
                                        </div>
                                        {hasPermission(permission) && <Check className="w-5 h-5 text-green-600" />}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Leave Permissions */}
                        <div>
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">Leave Management</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['view_leaves', 'approve_leaves', 'manage_leave_policy'].map(permission => (
                                    <label
                                        key={permission}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${hasPermission(permission)
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={hasPermission(permission)}
                                                onChange={() => togglePermission(permission)}
                                                className="w-5 h-5 rounded"
                                            />
                                            <span className="font-semibold text-slate-900">{getPermissionLabel(permission)}</span>
                                        </div>
                                        {hasPermission(permission) && <Check className="w-5 h-5 text-green-600" />}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* System Permissions */}
                        <div>
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">System & Reports</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['view_reports', 'export_reports', 'manage_settings', 'manage_users', 'manage_roles'].map(permission => (
                                    <label
                                        key={permission}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${hasPermission(permission)
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={hasPermission(permission)}
                                                onChange={() => togglePermission(permission)}
                                                className="w-5 h-5 rounded"
                                            />
                                            <span className="font-semibold text-slate-900">{getPermissionLabel(permission)}</span>
                                        </div>
                                        {hasPermission(permission) && <Check className="w-5 h-5 text-green-600" />}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
