'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    UserMinus,
    CheckCircle2,
    Clock,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    TrendingDown,
    ShieldCheck,
    AlertTriangle,
    X,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

interface LifecycleTask {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    category: 'onboarding' | 'offboarding';
    due_date: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    department_id: number;
    designation: string;
    joining_date: string;
}

export default function LifecyclePortal() {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [tasks, setTasks] = useState<LifecycleTask[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOffboardModal, setShowOffboardModal] = useState(false);

    // Offboarding form state
    const [offboardForm, setOffboardForm] = useState({
        resignation_date: new Date().toISOString().split('T')[0],
        last_working_day: '',
        reason: '',
        notice_period_days: '30'
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/employees`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setEmployees(await res.json());
            } catch (error) {
                console.error("Failed to fetch employees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const fetchTasks = async (empId: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/lifecycle/tasks/${empId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setTasks(await res.json());
        } catch (error) {
            toast.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEmployee = (emp: Employee) => {
        setSelectedEmployee(emp);
        fetchTasks(emp.id);
    };

    const handleOffboardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/lifecycle/offboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    employee_id: selectedEmployee.id,
                    ...offboardForm,
                    notice_period_days: parseInt(offboardForm.notice_period_days)
                })
            });

            if (res.ok) {
                toast.success(`Offboarding initiated for ${selectedEmployee.first_name}`);
                setShowOffboardModal(false);
                fetchTasks(selectedEmployee.id);
            } else {
                toast.error("Failed to initiate offboarding");
            }
        } catch (error) {
            toast.error("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (taskId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/lifecycle/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const filteredEmployees = employees.filter(e =>
        (e.first_name + ' ' + e.last_name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && employees.length === 0) return <LoadingOverlay message="Synchronizing organizational lifecycle..." />;

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-500/20 text-indigo-500">
                            <TrendingDown className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Enterprise <span className="text-indigo-600 not-italic">Lifecycle</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Seamless transitions • Automated Onboarding & Offboarding
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Employee Selector */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-extreme bg-white border-2 border-slate-100 p-8">
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none focus:ring-2 ring-indigo-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin">
                            {filteredEmployees.map((emp) => (
                                <button
                                    key={emp.id}
                                    onClick={() => handleSelectEmployee(emp)}
                                    className={cn(
                                        "w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between group",
                                        selectedEmployee?.id === emp.id
                                            ? "border-indigo-600 bg-indigo-50/30 shadow-lg shadow-indigo-500/5"
                                            : "border-transparent bg-slate-50 hover:bg-white hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xs transition-colors",
                                            selectedEmployee?.id === emp.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-900"
                                        )}>
                                            {emp.first_name[0]}{emp.last_name[0]}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase italic text-xs">{emp.first_name} {emp.last_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{emp.designation}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className={cn(
                                        "w-4 h-4 transition-transform",
                                        selectedEmployee?.id === emp.id ? "text-indigo-600 translate-x-1" : "text-slate-200"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Workflow Content */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedEmployee ? (
                            <motion.div
                                key={selectedEmployee.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="card-extreme bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-10">
                                        <Users className="w-48 h-48" />
                                    </div>
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Employee Focused</h2>
                                    <h3 className="text-4xl font-black tracking-tight italic mb-8">{selectedEmployee.first_name} <span className="text-indigo-400 not-italic">{selectedEmployee.last_name}</span></h3>

                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => setShowOffboardModal(true)}
                                            className="px-6 py-3 bg-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all flex items-center gap-2 shadow-xl shadow-red-500/20"
                                        >
                                            <UserMinus className="w-4 h-4" /> Initiate Offboarding
                                        </button>
                                        <button className="px-6 py-3 bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Schedule Check-in
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Onboarding Tasks */}
                                    <div className="card-extreme bg-white border-2 border-slate-100 overflow-hidden">
                                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <UserPlus className="w-4 h-4 text-emerald-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Onboarding Flow</h4>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400">
                                                {tasks.filter(t => t.category === 'onboarding' && t.status === 'completed').length}/{tasks.filter(t => t.category === 'onboarding').length} DONE
                                            </span>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {tasks.filter(t => t.category === 'onboarding').map((task) => (
                                                <button
                                                    key={task.id}
                                                    onClick={() => toggleTask(task.id, task.status)}
                                                    className="w-full p-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                            task.status === 'completed' ? "bg-emerald-500 border-emerald-500" : "border-slate-200 group-hover:border-indigo-600"
                                                        )}>
                                                            {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className={cn(
                                                                "text-[11px] font-black uppercase tracking-wide",
                                                                task.status === 'completed' ? "text-slate-400 line-through" : "text-slate-900"
                                                            )}>{task.title}</p>
                                                            <p className="text-[9px] font-bold text-slate-400">{task.description}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                            {tasks.filter(t => t.category === 'onboarding').length === 0 && (
                                                <div className="p-8 text-center text-slate-400 font-bold uppercase text-[9px]">No tasks assigned</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Offboarding Tasks */}
                                    <div className="card-extreme bg-white border-2 border-slate-100 overflow-hidden">
                                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <UserMinus className="w-4 h-4 text-red-500" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Offboarding Flow</h4>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400">
                                                {tasks.filter(t => t.category === 'offboarding' && t.status === 'completed').length}/{tasks.filter(t => t.category === 'offboarding').length} DONE
                                            </span>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {tasks.filter(t => t.category === 'offboarding').map((task) => (
                                                <button
                                                    key={task.id}
                                                    onClick={() => toggleTask(task.id, task.status)}
                                                    className="w-full p-4 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                            task.status === 'completed' ? "bg-red-500 border-red-500" : "border-slate-200 group-hover:border-indigo-600"
                                                        )}>
                                                            {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className={cn(
                                                                "text-[11px] font-black uppercase tracking-wide",
                                                                task.status === 'completed' ? "text-slate-400 line-through" : "text-slate-900"
                                                            )}>{task.title}</p>
                                                            <p className="text-[9px] font-bold text-slate-400">{task.description}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                            {tasks.filter(t => t.category === 'offboarding').length === 0 && (
                                                <div className="p-8 text-center text-slate-400 font-bold uppercase text-[9px]">Awaiting resignation</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[600px] card-extreme bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                                <Users className="w-20 h-20 text-slate-100 mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase">Select an Employee</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 max-w-[300px]">
                                    Browse your team to manage onboarding tasks or initiate the exit process.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Offboarding Modal */}
            <AnimatePresence>
                {showOffboardModal && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setShowOffboardModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl relative overflow-hidden flex flex-col lg:flex-row"
                        >
                            <div className="p-8 md:p-12 w-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
                                            <UserMinus className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 italic uppercase">Initiate <span className="text-red-600 not-italic">Exit</span></h3>
                                    </div>
                                    <button onClick={() => setShowOffboardModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleOffboardSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resignation Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 ring-red-500/20"
                                                value={offboardForm.resignation_date}
                                                onChange={(e) => setOffboardForm({ ...offboardForm, resignation_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Working Day</label>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 ring-red-500/20"
                                                value={offboardForm.last_working_day}
                                                onChange={(e) => setOffboardForm({ ...offboardForm, last_working_day: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exit Reason</label>
                                        <textarea
                                            placeholder="Personal reasons, career growth, etc."
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-900 focus:ring-2 ring-red-500/20 min-h-[100px]"
                                            value={offboardForm.reason}
                                            onChange={(e) => setOffboardForm({ ...offboardForm, reason: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
                                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                        <p className="text-[10px] font-bold text-red-600/80 uppercase tracking-widest leading-relaxed">
                                            Proceeding will auto-generate exit tasks (IT clearance, asset collection, exit interview) and notify the employee regarding their notice period.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-red-600 transition-all"
                                    >
                                        Initiate Exit Protocol
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
