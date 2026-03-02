'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Target, BarChart3, MessageSquare, Users, Star,
    TrendingUp, Plus, ChevronRight, CheckCircle2, Clock, AlertTriangle,
    Search, Flame, Zap, GitBranch, RefreshCw, Award, Settings,
    ArrowUp, ArrowDown, Minus, Filter, SlidersHorizontal
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, Tooltip, RadarChart,
    PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, Cell
} from 'recharts';
import { API_BASE_URL } from '@/lib/api';

// ---- Types ----

type ReviewType = 'self' | 'peer' | 'manager' | 'upward';
type OKRLevel = 'company' | 'team' | 'individual';
type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'at_risk';
type CycleStatus = 'draft' | 'active' | 'review_phase' | 'calibration' | 'completed';

interface OKR {
    id: number;
    employee_id: number;
    title: string;
    description?: string;
    key_result?: string;
    target_value: number;
    current_value: number;
    unit: string;
    status: GoalStatus;
    level: OKRLevel;
    confidence: number;
    due_date?: string;
    progress_pct: number;
}

interface Review {
    id: number;
    employee_id: number;
    reviewer_id: number;
    review_type: ReviewType;
    period?: string;
    rating?: number;
    comments?: string;
    strengths?: string;
    improvements?: string;
    competency_ratings?: Record<string, number>;
    calibrated_rating?: number;
    is_calibrated: boolean;
    is_anonymous: boolean;
    is_finalized: boolean;
    created_at: string;
}

interface ReviewCycle {
    id: number;
    name: string;
    description?: string;
    status: CycleStatus;
    review_types: string;
    submission_deadline?: string;
    review_count: number;
    created_at: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    designation: string;
    department_id: number;
}

// ---- Config ----

const STATUS_CONFIG: Record<GoalStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'text-white/40 bg-white/5 border-white/10', icon: <Clock size={12} /> },
    in_progress: { label: 'In Progress', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: <RefreshCw size={12} /> },
    completed: { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 size={12} /> },
    at_risk: { label: 'At Risk', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: <AlertTriangle size={12} /> },
    cancelled: { label: 'Cancelled', color: 'text-red-400/60 bg-red-500/5 border-red-500/10', icon: <Minus size={12} /> },
};

const REVIEW_TYPE_CONFIG: Record<ReviewType, { label: string; color: string; emoji: string }> = {
    self: { label: 'Self Review', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', emoji: '🪞' },
    peer: { label: 'Peer Review', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', emoji: '🤝' },
    manager: { label: 'Manager Review', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', emoji: '👔' },
    upward: { label: 'Upward Review', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', emoji: '⬆️' },
};

const CYCLE_STATUS_STEPS: CycleStatus[] = ['draft', 'active', 'review_phase', 'calibration', 'completed'];

const DEFAULT_COMPETENCIES = ['Communication', 'Execution', 'Leadership', 'Innovation', 'Collaboration', 'Ownership'];

function getConfidenceColor(c: number) {
    if (c >= 70) return 'text-emerald-400';
    if (c >= 40) return 'text-amber-400';
    return 'text-red-400';
}

function getProgressColor(p: number) {
    if (p >= 80) return 'from-emerald-500 to-teal-500';
    if (p >= 50) return 'from-blue-500 to-indigo-500';
    if (p >= 25) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
}

// ---- Sub-components ----

function OKRCard({ okr, onUpdate }: { okr: OKR; onUpdate: (id: number, val: number) => void }) {
    const cfg = STATUS_CONFIG[okr.status];
    const colors = getProgressColor(okr.progress_pct);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                        </span>
                        <span className={`text-[10px] font-medium ${getConfidenceColor(okr.confidence)}`}>
                            {okr.confidence}% confidence
                        </span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{okr.title}</p>
                    {okr.key_result && <p className="text-xs text-white/40 mt-0.5 truncate">{okr.key_result}</p>}
                </div>
                <span className="text-lg font-black text-white shrink-0">{okr.progress_pct}%</span>
            </div>

            <div className="mb-3">
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${okr.progress_pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${colors}`}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-white/30 mt-1">
                    <span>{okr.current_value}{okr.unit}</span>
                    <span>{okr.target_value}{okr.unit}</span>
                </div>
            </div>

            {okr.due_date && (
                <p className="text-[10px] text-white/30 flex items-center gap-1">
                    <Clock size={10} /> Due {new Date(okr.due_date).toLocaleDateString()}
                </p>
            )}
        </motion.div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const cfg = REVIEW_TYPE_CONFIG[review.review_type];
    const displayRating = review.calibrated_rating ?? review.rating ?? 0;

    const competencyData = review.competency_ratings
        ? Object.entries(review.competency_ratings).map(([k, v]) => ({ subject: k, value: v, fullMark: 5 }))
        : [];

    return (
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color}`}>
                    <span>{cfg.emoji}</span> {cfg.label}
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} className={s <= displayRating ? 'fill-amber-400 text-amber-400' : 'text-white/10'} />
                    ))}
                    {review.is_calibrated && (
                        <span className="ml-1 text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                            Calibrated
                        </span>
                    )}
                </div>
            </div>

            {review.comments && <p className="text-sm text-white/60 leading-relaxed">"{review.comments}"</p>}

            <div className="grid grid-cols-2 gap-3 text-xs">
                {review.strengths && (
                    <div>
                        <p className="text-emerald-400 font-semibold mb-1">Strengths</p>
                        <p className="text-white/50">{review.strengths}</p>
                    </div>
                )}
                {review.improvements && (
                    <div>
                        <p className="text-amber-400 font-semibold mb-1">Growth Areas</p>
                        <p className="text-white/50">{review.improvements}</p>
                    </div>
                )}
            </div>

            {competencyData.length > 0 && (
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={competencyData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                            <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

function AddOKRModal({ employeeId, token, onDone }: { employeeId: number; token: string; onDone: () => void }) {
    const [title, setTitle] = useState('');
    const [keyResult, setKeyResult] = useState('');
    const [target, setTarget] = useState(100);
    const [unit, setUnit] = useState('%');
    const [level, setLevel] = useState<OKRLevel>('individual');
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        if (!title) return;
        setSaving(true);
        await fetch(`${API_BASE_URL}/api/performance/okrs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ employee_id: employeeId, title, key_result: keyResult, target_value: target, unit, level }),
        });
        setSaving(false);
        onDone();
    };

    return (
        <div className="rounded-2xl bg-zinc-900 border border-white/10 p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-4">Add OKR Goal</h3>
            <div className="flex flex-col gap-3">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Objective title"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50" />
                <input value={keyResult} onChange={e => setKeyResult(e.target.value)} placeholder="Key result (measurable)"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50" />
                <div className="grid grid-cols-3 gap-3">
                    <input type="number" value={target} onChange={e => setTarget(+e.target.value)} placeholder="Target"
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50" />
                    <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="Unit (%/$)"
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50" />
                    <select value={level} onChange={e => setLevel(e.target.value as OKRLevel)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50">
                        <option value="individual">Individual</option>
                        <option value="team">Team</option>
                        <option value="company">Company</option>
                    </select>
                </div>
                <button onClick={submit} disabled={saving || !title}
                    className="py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all disabled:opacity-40">
                    {saving ? 'Saving...' : 'Create OKR'}
                </button>
            </div>
        </div>
    );
}

function AddReviewModal({ employeeId, token, onDone }: { employeeId: number; token: string; onDone: () => void }) {
    const [reviewType, setReviewType] = useState<ReviewType>('manager');
    const [rating, setRating] = useState(3);
    const [comments, setComments] = useState('');
    const [strengths, setStrengths] = useState('');
    const [improvements, setImprovements] = useState('');
    const [competency, setCompetency] = useState<Record<string, number>>({});
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        setSaving(true);
        await fetch(`${API_BASE_URL}/api/performance/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                employee_id: employeeId, review_type: reviewType, rating, comments, strengths, improvements,
                competency_ratings: Object.keys(competency).length ? competency : null,
            }),
        });
        setSaving(false);
        onDone();
    };

    return (
        <div className="rounded-2xl bg-zinc-900 border border-white/10 p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-4">Submit 360° Review</h3>
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 flex-wrap">
                    {(['self', 'peer', 'manager', 'upward'] as ReviewType[]).map(t => (
                        <button key={t} onClick={() => setReviewType(t)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${reviewType === t ? REVIEW_TYPE_CONFIG[t].color : 'border-white/10 text-white/40'}`}>
                            {REVIEW_TYPE_CONFIG[t].emoji} {REVIEW_TYPE_CONFIG[t].label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">Rating:</span>
                    {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} onClick={() => setRating(s)}>
                            <Star size={20} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/20 hover:text-amber-400 transition-colors'} />
                        </button>
                    ))}
                </div>
                <textarea value={comments} onChange={e => setComments(e.target.value)} placeholder="Overall feedback..." rows={2}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none" />
                <div className="grid grid-cols-2 gap-2">
                    <textarea value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="Key strengths..." rows={2}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none" />
                    <textarea value={improvements} onChange={e => setImprovements(e.target.value)} placeholder="Growth areas..." rows={2}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 resize-none" />
                </div>

                <div>
                    <p className="text-xs text-white/40 mb-2">Competency Ratings (optional)</p>
                    <div className="grid grid-cols-2 gap-2">
                        {DEFAULT_COMPETENCIES.map(comp => (
                            <div key={comp} className="flex items-center justify-between gap-2">
                                <span className="text-xs text-white/50">{comp}</span>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} onClick={() => setCompetency(prev => ({ ...prev, [comp]: s }))}>
                                            <div className={`w-4 h-4 rounded-sm transition-all ${(competency[comp] ?? 0) >= s ? 'bg-violet-500' : 'bg-white/10'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={submit} disabled={saving}
                    className="py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-xl text-sm transition-all disabled:opacity-40">
                    {saving ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
}

// ---- Main Page ----

export default function PerformanceDashboard() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selected, setSelected] = useState<Employee | null>(null);
    const [okrs, setOkrs] = useState<OKR[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [cycles, setCycles] = useState<ReviewCycle[]>([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'okrs' | 'reviews' | 'cycles'>('okrs');
    const [showAddOKR, setShowAddOKR] = useState(false);
    const [showAddReview, setShowAddReview] = useState(false);
    const [reviewFilter, setReviewFilter] = useState<ReviewType | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const t = localStorage.getItem('token') || '';
        setToken(t);
        fetchInitial(t);
    }, []);

    const fetchInitial = async (t: string) => {
        setLoading(true);
        try {
            const [empRes, cycleRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/employees`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/performance/cycles`, { headers: { Authorization: `Bearer ${t}` } }),
            ]);
            if (empRes.ok) setEmployees(await empRes.json());
            if (cycleRes.ok) setCycles(await cycleRes.json());
        } catch { }
        setLoading(false);
    };

    const fetchPerformanceData = async (empId: number, t: string) => {
        const [okrRes, revRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/performance/okrs/${empId}`, { headers: { Authorization: `Bearer ${t}` } }),
            fetch(`${API_BASE_URL}/api/performance/reviews/${empId}`, { headers: { Authorization: `Bearer ${t}` } }),
        ]);
        if (okrRes.ok) setOkrs(await okrRes.json());
        if (revRes.ok) setReviews(await revRes.json());
    };

    const handleSelect = (emp: Employee) => {
        setSelected(emp);
        setShowAddOKR(false);
        setShowAddReview(false);
        fetchPerformanceData(emp.id, token);
    };

    const avgRating = reviews.length > 0
        ? (reviews.filter(r => r.rating).reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.filter(r => r.rating).length).toFixed(1)
        : '—';

    const overallProgress = okrs.length > 0
        ? Math.round(okrs.reduce((s, o) => s + o.progress_pct, 0) / okrs.length)
        : 0;

    const filteredReviews = reviewFilter === 'all' ? reviews : reviews.filter(r => r.review_type === reviewFilter);
    const filteredEmployees = employees.filter(e =>
        `${e.first_name} ${e.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-[#0a0a1a] to-zinc-950 p-6">
            <div className="max-w-7xl mx-auto flex gap-6">

                {/* Sidebar — Employee Picker */}
                <div className="w-64 shrink-0 flex flex-col gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <Trophy size={18} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-white">Performance</h1>
                                <p className="text-white/30 text-xs">360° Intelligence</p>
                            </div>
                        </div>

                        <div className="relative mb-3">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search team..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50" />
                        </div>

                        <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
                            {filteredEmployees.map(emp => (
                                <button key={emp.id} onClick={() => handleSelect(emp)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all group ${selected?.id === emp.id ? 'bg-indigo-600/20 border-indigo-500/30 text-white' : 'border-white/5 text-white/60 hover:text-white hover:border-white/15 bg-white/[0.02]'}`}>
                                    <p className="text-xs font-semibold">{emp.first_name} {emp.last_name}</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">{emp.designation}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Cycles mini-panel */}
                    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                        <p className="text-[11px] font-semibold text-white/50 mb-2 uppercase tracking-wider">Review Cycles</p>
                        {cycles.slice(0, 3).map(c => (
                            <div key={c.id} className="py-1.5 border-b border-white/5 last:border-0">
                                <p className="text-xs text-white font-medium truncate">{c.name}</p>
                                <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[10px] text-white/30 capitalize">{c.status.replace('_', ' ')}</span>
                                    <span className="text-[10px] text-indigo-400">{c.review_count} reviews</span>
                                </div>
                            </div>
                        ))}
                        {cycles.length === 0 && <p className="text-[10px] text-white/20 py-2">No cycles yet</p>}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {!selected ? (
                        <div className="h-full flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/20 flex items-center justify-center mb-5">
                                <Users size={32} className="text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">360° Performance Intelligence</h2>
                            <p className="text-white/30 text-sm max-w-sm">Select an employee to view OKR progress, 360° feedback, competency radars, and calibration scores.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {/* Employee Header */}
                            <div className="rounded-2xl bg-gradient-to-br from-indigo-600/30 to-violet-900/20 border border-indigo-500/20 p-5">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-black text-white">
                                            {selected.first_name[0]}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{selected.first_name} {selected.last_name}</h2>
                                            <p className="text-white/40 text-sm">{selected.designation}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-white">{overallProgress}%</p>
                                            <p className="text-xs text-white/40">OKR Progress</p>
                                        </div>
                                        <div className="w-px bg-white/10 self-stretch" />
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 justify-center">
                                                <p className="text-3xl font-black text-white">{avgRating}</p>
                                                {avgRating !== '—' && <Star size={18} className="fill-amber-400 text-amber-400" />}
                                            </div>
                                            <p className="text-xs text-white/40">Avg Rating</p>
                                        </div>
                                        <div className="w-px bg-white/10 self-stretch" />
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-white">{reviews.length}</p>
                                            <p className="text-xs text-white/40">Reviews</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 w-fit">
                                {(['okrs', 'reviews', 'cycles'] as const).map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-white/50 hover:text-white'}`}>
                                        {tab === 'okrs' ? '🎯 OKRs' : tab === 'reviews' ? '🔄 360° Reviews' : '📋 Cycles'}
                                    </button>
                                ))}
                            </div>

                            {/* OKRs Tab */}
                            {activeTab === 'okrs' && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-white">OKR Goals — {selected.first_name}</h3>
                                        <button onClick={() => setShowAddOKR(!showAddOKR)}
                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all">
                                            <Plus size={14} /> Add OKR
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {showAddOKR && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                                                <AddOKRModal employeeId={selected.id} token={token} onDone={() => { setShowAddOKR(false); fetchPerformanceData(selected.id, token); }} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {okrs.length === 0 ? (
                                        <div className="text-center py-16 text-white/20">
                                            <Target size={40} className="mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">No OKRs yet. Add the first goal!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {okrs.map(okr => (
                                                <OKRCard key={okr.id} okr={okr} onUpdate={() => fetchPerformanceData(selected.id, token)} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div>
                                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                        <div className="flex gap-2 flex-wrap">
                                            <button onClick={() => setReviewFilter('all')}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${reviewFilter === 'all' ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-white/40'}`}>
                                                All
                                            </button>
                                            {(['self', 'peer', 'manager', 'upward'] as ReviewType[]).map(t => (
                                                <button key={t} onClick={() => setReviewFilter(t)}
                                                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-all ${reviewFilter === t ? REVIEW_TYPE_CONFIG[t].color : 'border-white/10 text-white/40'}`}>
                                                    {REVIEW_TYPE_CONFIG[t].emoji} {REVIEW_TYPE_CONFIG[t].label}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => setShowAddReview(!showAddReview)}
                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all">
                                            <Plus size={14} /> Add Review
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showAddReview && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                                                <AddReviewModal employeeId={selected.id} token={token} onDone={() => { setShowAddReview(false); fetchPerformanceData(selected.id, token); }} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {filteredReviews.length === 0 ? (
                                        <div className="text-center py-16 text-white/20">
                                            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">No reviews yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {filteredReviews.map(r => <ReviewCard key={r.id} review={r} />)}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cycles Tab */}
                            {activeTab === 'cycles' && (
                                <div className="flex flex-col gap-4">
                                    {cycles.map(cycle => (
                                        <div key={cycle.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">{cycle.name}</h3>
                                                    <p className="text-xs text-white/40">{cycle.description}</p>
                                                </div>
                                                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${cycle.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                                                        cycle.status === 'active' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                                                            cycle.status === 'calibration' ? 'text-violet-400 bg-violet-500/10 border-violet-500/20' :
                                                                'text-white/40 bg-white/5 border-white/10'
                                                    }`}>
                                                    {cycle.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            {/* Progress steps */}
                                            <div className="flex items-center gap-1 mt-3">
                                                {CYCLE_STATUS_STEPS.map((step, idx) => {
                                                    const currentIdx = CYCLE_STATUS_STEPS.indexOf(cycle.status);
                                                    const isPast = idx <= currentIdx;
                                                    return (
                                                        <React.Fragment key={step}>
                                                            <div className={`flex-1 h-1.5 rounded-full transition-all ${isPast ? 'bg-indigo-500' : 'bg-white/10'}`} />
                                                            {idx < CYCLE_STATUS_STEPS.length - 1 && null}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-between text-[10px] text-white/30 mt-1">
                                                {CYCLE_STATUS_STEPS.map(s => <span key={s} className="capitalize">{s.replace('_', ' ')}</span>)}
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                                                <span>Types: {cycle.review_types.split(',').join(', ')}</span>
                                                <span>·</span>
                                                <span>{cycle.review_count} reviews submitted</span>
                                                {cycle.submission_deadline && <><span>·</span><span>Due {new Date(cycle.submission_deadline).toLocaleDateString()}</span></>}
                                            </div>
                                        </div>
                                    ))}
                                    {cycles.length === 0 && (
                                        <div className="text-center py-16 text-white/20">
                                            <BarChart3 size={40} className="mx-auto mb-3 opacity-30" />
                                            <p className="text-sm">No review cycles yet. Create one from HR settings.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
