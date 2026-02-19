"use client";

import { useEffect, useState } from 'react';
import { Search, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

const QUICK_ACTIONS = [
    { name: 'Dashboard', description: 'View overview', href: '/dashboard', icon: '📊' },
    { name: 'Employees', description: 'Manage employees', href: '/dashboard/employees', icon: '👥' },
    { name: 'Add Employee', description: 'Create new employee', href: '/dashboard/employees/add', icon: '➕' },
    { name: 'Departments', description: 'View departments', href: '/dashboard/departments', icon: '🏢' },
    { name: 'Manual Attendance', description: 'Mark attendance', href: '/dashboard/attendance/manual-entry', icon: '✏️' },
    { name: 'Payroll', description: 'Process payroll', href: '/dashboard/payroll', icon: '💰' },
    { name: 'Reports', description: 'Generate reports', href: '/dashboard/reports', icon: '📈' },
    { name: 'Settings', description: 'System settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    const filteredActions = QUICK_ACTIONS.filter(
        action =>
            action.name.toLowerCase().includes(query.toLowerCase()) ||
            action.description.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => (i + 1) % filteredActions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => (i - 1 + filteredActions.length) % filteredActions.length);
            } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
                e.preventDefault();
                router.push(filteredActions[selectedIndex].href);
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, filteredActions, router, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4 pt-32">
                <div onClick={onClose} className="absolute inset-0" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(0);
                            }}
                            placeholder="Search for pages, actions..."
                            className="flex-1 bg-transparent border-none text-lg focus:ring-0 placeholder:text-slate-400 font-medium"
                        />
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {filteredActions.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="p-2">
                                {filteredActions.map((action, index) => (
                                    <div
                                        key={action.href}
                                        onClick={() => {
                                            router.push(action.href);
                                            onClose();
                                        }}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${index === selectedIndex
                                                ? 'bg-indigo-50 text-indigo-900'
                                                : 'hover:bg-slate-50 text-slate-700'
                                            }`}
                                    >
                                        <span className="text-2xl">{action.icon}</span>
                                        <div className="flex-1">
                                            <div className="font-bold">{action.name}</div>
                                            <div className="text-sm text-slate-500">{action.description}</div>
                                        </div>
                                        {index === selectedIndex && (
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                                                ↵
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                        <span>Navigate with ↑↓</span>
                        <span>Press Enter to select</span>
                        <span>ESC to close</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
