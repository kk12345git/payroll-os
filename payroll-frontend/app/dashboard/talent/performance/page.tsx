'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    BarChart3,
    MessageSquare,
    Trophy,
    TrendingUp,
    ChevronRight,
    Search,
    Plus,
    Calendar,
    Star,
    ArrowUpRight,
    Users,
    CheckCircle2,
    Clock,
    UserCircle2,
    Quote
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/Loading';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

interface OKR {
    id: number;
    title: string;
    description: string;
    target_value: number;
    current_value: number;
    unit: string;
    status: string;
    due_date: string;
}

interface Review {
    id: number;
    period: string;
    rating: number;
    comments: string;
    strengths: string;
    improvements: string;
    created_at: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    department_id: number;
    designation: string;
}

export default function PerformanceDashboard() {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [okrs, setOkrs] = useState<OKR[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const fetchPerformance = async (empId: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [okrRes, reviewRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/performance/okrs/${empId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/api/performance/reviews/${empId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (okrRes.ok) setOkrs(await okrRes.json());
            if (reviewRes.ok) setReviews(await reviewRes.json());
        } catch (error) {
            toast.error("Cloud Analytics engine sync failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEmployee = (emp: Employee) => {
        setSelectedEmployee(emp);
        fetchPerformance(emp.id);
    };

    const filteredEmployees = employees.filter(e =>
        (e.first_name + ' ' + e.last_name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const avgPerformanceData = reviews.map(r => ({
        period: r.period,
        rating: r.rating
    }));

    if (loading && employees.length === 0) return <LoadingOverlay message="Gathering performance intelligence..." />;

    return (
        <div className="space-y-10 max-w-[1400px] mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">
                            Performance <span className="text-indigo-600 not-italic">Center</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        OKR Goal Tracking • 360 Feedback Loop • Talent Recognition
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Team Selection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-extreme bg-white border-2 border-slate-100 p-8 shadow-xl shadow-slate-100/50">
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search team..."
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
                                            ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                                            : "border-transparent bg-slate-50 hover:bg-white hover:border-slate-200"
                                    )}
                                >
                                    <div>
                                        <p className={cn(
                                            "font-black uppercase italic text-xs",
                                            selectedEmployee?.id === emp.id ? "text-white" : "text-slate-900"
                                        )}>{emp.first_name} {emp.last_name}</p>
                                        <p className={cn(
                                            "text-[9px] font-bold uppercase tracking-widest mt-1",
                                            selectedEmployee?.id === emp.id ? "text-slate-400" : "text-slate-400"
                                        )}>{emp.designation}</p>
                                    </div>
                                    <ChevronRight className={cn(
                                        "w-4 h-4 transition-transform",
                                        selectedEmployee?.id === emp.id ? "text-indigo-400 translate-x-1" : "text-slate-200"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Analytics */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {selectedEmployee ? (
                            <motion.div
                                key={selectedEmployee.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Header Card */}
                                <div className="p-10 rounded-[3rem] bg-indigo-600 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30">
                                    <div className="absolute top-0 right-0 p-12 opacity-10">
                                        <TrendingUp className="w-48 h-48" />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2 italic">Performance Profile</h2>
                                        <h3 className="text-5xl font-black tracking-tighter italic mb-8">{selectedEmployee.first_name} <span className="not-italic text-indigo-300">{selectedEmployee.last_name}</span></h3>

                                        <div className="flex flex-wrap gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">OKR Progress</p>
                                                <p className="text-3xl font-black tracking-tighter italic">
                                                    {okrs.length > 0 ? Math.round(okrs.reduce((a, b) => a + (b.current_value / b.target_value), 0) / okrs.length * 100) : 0}%
                                                </p>
                                            </div>
                                            <div className="w-px h-12 bg-white/10 hidden md:block" />
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Avg Rating</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-3xl font-black tracking-tighter italic">
                                                        {reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 'N/A'}
                                                    </p>
                                                    <Star className="w-5 h-5 fill-indigo-300 text-indigo-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Goal Tracker */}
                                    <div className="card-extreme bg-white border-2 border-slate-100 p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                                <Target className="w-4 h-4 text-indigo-600" />
                                                Active OKR Goals
                                            </h4>
                                            <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            {okrs.map((okr) => (
                                                <div key={okr.id} className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[11px] font-black uppercase tracking-tight text-slate-800">{okr.title}</p>
                                                        <span className="text-[10px] font-black text-indigo-600">{okr.current_value}/{okr.target_value}{okr.unit}</span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(okr.current_value / okr.target_value) * 100}%` }}
                                                            className="h-full bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/20"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {okrs.length === 0 && (
                                                <div className="py-12 flex flex-col items-center justify-center opacity-20 grayscale">
                                                    <Target className="w-12 h-12 mb-4" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">No Active Goals</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Rating Trend */}
                                    <div className="card-extreme bg-white border-2 border-slate-100 p-8 uppercase italic text-[10px] font-black">
                                        <h4 className="mb-8 flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-indigo-600" />
                                            Engagement Trend
                                        </h4>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={avgPerformanceData}>
                                                    <defs>
                                                        <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="rating"
                                                        stroke="#6366f1"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorRating)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Peer Reviews Feed */}
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black text-slate-900 italic uppercase">360-Degree <span className="text-indigo-600">Feedback</span></h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="card-extreme bg-white border-2 border-slate-100 p-8 relative overflow-hidden group hover:border-indigo-200 transition-all">
                                                <Quote className="absolute -top-4 -left-4 w-20 h-20 text-slate-50 group-hover:text-indigo-50 transition-colors" />
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xs uppercase italic">
                                                                {review.period}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} className={cn(
                                                                        "w-3 h-3",
                                                                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                                                                    )} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">"{review.comments}"</p>

                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-1">Strengths</p>
                                                            <p className="text-[10px] font-bold text-slate-500">{review.strengths}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Growth Areas</p>
                                                            <p className="text-[10px] font-bold text-slate-500">{review.improvements}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {reviews.length === 0 && (
                                            <div className="md:col-span-2 py-20 card-extreme bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center opacity-30 grayscale">
                                                <MessageSquare className="w-16 h-16 mb-4" />
                                                <p className="text-xs font-black uppercase tracking-[0.2em]">Awaiting Peer Feedback</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[700px] card-extreme bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                                <Users className="w-20 h-20 text-slate-100 mb-6" />
                                <h3 className="text-2xl font-black text-slate-900 italic uppercase">Enterprise Goal Tracking</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 max-w-[300px]">
                                    Select an employee from the roster to monitor OKRs and manage 360-degree performance reviews.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
