'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, TrendingUp, Target, BarChart3, GitBranch,
    Briefcase, DollarSign, AlertCircle, CheckCircle2, Clock,
    ChevronDown, ChevronRight, Zap, Building2, Search, Filter,
    ArrowUpRight, ArrowDownRight, Minus, RefreshCw, X
} from 'lucide-react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
    PieChart, Pie, Cell, RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts';
import { API_BASE_URL } from '@/lib/api';

// ---- Types ----
type ReqStatus = 'draft' | 'approved' | 'in_progress' | 'filled' | 'cancelled';
type Priority = 'low' | 'medium' | 'high' | 'critical';
type ScenarioType = 'growth' | 'restructure' | 'cost_cut' | 'steady';

interface DashboardData {
    summary: {
        total_active: number;
        open_requisitions: number;
        critical_roles: number;
        recent_hires_90d: number;
        avg_monthly_salary: number;
        monthly_payroll_burn: number;
    };
    dept_distribution: { dept: string; count: number }[];
    dept_salary: { dept: string; avg_salary: number; total_salary: number }[];
    requisitions_by_status: Record<string, number>;
}

interface Requisition {
    id: number;
    job_title: string;
    job_level?: string;
    job_type: string;
    location?: string;
    is_remote: boolean;
    min_salary?: number;
    max_salary?: number;
    target_start_date?: string;
    status: ReqStatus;
    priority: Priority;
    justification?: string;
    skills_required?: string;
    department_id?: number;
    created_at: string;
}

interface Scenario {
    id: number;
    name: string;
    description?: string;
    scenario_type: ScenarioType;
    growth_rate_pct: number;
    attrition_rate_pct: number;
    salary_increase_pct: number;
    timeframe_months: number;
    projected_headcount?: number;
    projected_cost?: number;
    net_hires_needed?: number;
    created_at: string;
}

interface OrgNode {
    dept_id: number;
    dept_name: string;
    headcount: number;
    members: { id: number; name: string; designation: string; date_of_joining?: string }[];
}

// ---- Config ----
const STATUS_CFG: Record<ReqStatus, { label: string; color: string; dot: string }> = {
    draft: { label: 'Draft', color: 'text-white/40 bg-white/5 border-white/10', dot: 'bg-white/30' },
    approved: { label: 'Approved', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
    in_progress: { label: 'In Progress', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
    filled: { label: 'Filled ✓', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
    cancelled: { label: 'Cancelled', color: 'text-red-400/60 bg-red-500/5 border-red-500/10', dot: 'bg-red-400' },
};

const PRIORITY_CFG: Record<Priority, { label: string; color: string; icon: React.ReactNode }> = {
    low: { label: 'Low', color: 'text-white/40', icon: <Minus size={12} /> },
    medium: { label: 'Medium', color: 'text-amber-400', icon: <ArrowUpRight size={12} /> },
    high: { label: 'High', color: 'text-orange-400', icon: <ArrowUpRight size={12} /> },
    critical: { label: 'Critical', color: 'text-red-400', icon: <AlertCircle size={12} /> },
};

const SCENARIO_CFG: Record<ScenarioType, { label: string; icon: string; color: string }> = {
    growth: { label: 'Growth', icon: '🚀', color: 'from-emerald-500/20 to-teal-900/20 border-emerald-500/20' },
    restructure: { label: 'Restructure', icon: '🔄', color: 'from-blue-500/20 to-indigo-900/20 border-blue-500/20' },
    cost_cut: { label: 'Cost Cut', icon: '✂️', color: 'from-red-500/20 to-rose-900/20 border-red-500/20' },
    steady: { label: 'Steady', icon: '⚖️', color: 'from-zinc-500/20 to-zinc-900/20 border-zinc-500/20' },
};

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

function fmt(n: number) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
}

// ---- Stat Card ----
function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 flex flex-col gap-2">
            <div className={`flex items-center gap-2 text-xs font-medium ${color}`}>
                {icon} {label}
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
            {sub && <p className="text-xs text-white/30">{sub}</p>}
        </motion.div>
    );
}

// ---- Add Requisition Modal ----
function AddReqModal({ token, onDone }: { token: string; onDone: () => void }) {
    const [form, setForm] = useState({
        job_title: '', job_level: '', job_type: 'full_time', location: '',
        is_remote: false, min_salary: '', max_salary: '',
        priority: 'medium' as Priority, justification: '', skills_required: ''
    });
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        if (!form.job_title) return;
        setSaving(true);
        await fetch(`${API_BASE_URL}/api/headcount/requisitions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                ...form,
                min_salary: form.min_salary ? parseFloat(form.min_salary) : null,
                max_salary: form.max_salary ? parseFloat(form.max_salary) : null,
            })
        });
        setSaving(false);
        onDone();
    };

    return (
        <div className="rounded-2xl bg-zinc-900 border border-white/10 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Open New Role Requisition</h3>
            <div className="grid grid-cols-2 gap-3">
                <input value={form.job_title} onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))}
                    placeholder="Job Title *" className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                <input value={form.job_level} onChange={e => setForm(f => ({ ...f, job_level: e.target.value }))}
                    placeholder="Level (Junior/Mid/Senior)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                <select value={form.job_type} onChange={e => setForm(f => ({ ...f, job_type: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50">
                    <option value="full_time">Full-Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                    <option value="part_time">Part-Time</option>
                </select>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="Location" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">🚨 Critical</option>
                </select>
                <input value={form.min_salary} onChange={e => setForm(f => ({ ...f, min_salary: e.target.value }))}
                    placeholder="Min Salary ₹" type="number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                <input value={form.max_salary} onChange={e => setForm(f => ({ ...f, max_salary: e.target.value }))}
                    placeholder="Max Salary ₹" type="number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                <input value={form.skills_required} onChange={e => setForm(f => ({ ...f, skills_required: e.target.value }))}
                    placeholder="Key skills (comma-separated)" className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                <textarea value={form.justification} onChange={e => setForm(f => ({ ...f, justification: e.target.value }))}
                    placeholder="Business justification..." rows={2} className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 resize-none" />
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="remote" checked={form.is_remote} onChange={e => setForm(f => ({ ...f, is_remote: e.target.checked }))} className="accent-indigo-500" />
                <label htmlFor="remote" className="text-xs text-white/60">Remote / Hybrid allowed</label>
            </div>
            <button onClick={submit} disabled={saving || !form.job_title}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-xl text-sm transition-all disabled:opacity-40">
                {saving ? 'Creating...' : 'Create Requisition'}
            </button>
        </div>
    );
}

// ---- Scenario Modeler Modal ----
function ScenarioModal({ token, currentHeadcount, onDone }: { token: string; currentHeadcount: number; onDone: () => void }) {
    const [form, setForm] = useState({
        name: '', description: '', scenario_type: 'growth' as ScenarioType,
        growth_rate_pct: 20, attrition_rate_pct: 10, salary_increase_pct: 8, timeframe_months: 12
    });
    const [saving, setSaving] = useState(false);

    // Live preview calculation
    const attrition = Math.round(currentHeadcount * (form.attrition_rate_pct / 100));
    const growth = Math.round(currentHeadcount * (form.growth_rate_pct / 100));
    const projected = currentHeadcount + growth - attrition;

    const submit = async () => {
        if (!form.name) return;
        setSaving(true);
        await fetch(`${API_BASE_URL}/api/headcount/scenarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(form)
        });
        setSaving(false);
        onDone();
    };

    return (
        <div className="rounded-2xl bg-zinc-900 border border-white/10 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Create Workforce Scenario</h3>

            {/* Live Preview */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="text-center">
                    <p className="text-xs text-white/40">Current</p>
                    <p className="text-xl font-black text-white">{currentHeadcount}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-white/40">Net Change</p>
                    <p className={`text-xl font-black ${growth - attrition >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {growth - attrition >= 0 ? '+' : ''}{growth - attrition}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-white/40">Projected</p>
                    <p className="text-xl font-black text-indigo-400">{projected}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Scenario Name *" className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />

                <select value={form.scenario_type} onChange={e => setForm(f => ({ ...f, scenario_type: e.target.value as ScenarioType }))}
                    className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50">
                    <option value="growth">🚀 Growth — Aggressive hiring</option>
                    <option value="restructure">🔄 Restructure — Team reorganization</option>
                    <option value="cost_cut">✂️ Cost Cut — Headcount reduction</option>
                    <option value="steady">⚖️ Steady — Maintain & backfill</option>
                </select>

                {[
                    { key: 'growth_rate_pct', label: 'Growth Rate %', min: 0, max: 100 },
                    { key: 'attrition_rate_pct', label: 'Expected Attrition %', min: 0, max: 50 },
                    { key: 'salary_increase_pct', label: 'Salary Increase %', min: 0, max: 30 },
                    { key: 'timeframe_months', label: 'Timeframe (months)', min: 1, max: 36 },
                ].map(({ key, label, min, max }) => (
                    <div key={key} className="flex flex-col gap-1">
                        <label className="text-xs text-white/50">{label}: <span className="text-white font-bold">{(form as any)[key]}{key !== 'timeframe_months' ? '%' : 'm'}</span></label>
                        <input type="range" min={min} max={max} value={(form as any)[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) }))}
                            className="accent-indigo-500" />
                    </div>
                ))}
            </div>

            <button onClick={submit} disabled={saving || !form.name}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all disabled:opacity-40">
                {saving ? 'Simulating...' : '⚡ Run Simulation'}
            </button>
        </div>
    );
}

// ---- Requisition Card ----
function ReqCard({ req, token, onRefresh }: { req: Requisition; token: string; onRefresh: () => void }) {
    const st = STATUS_CFG[req.status];
    const pr = PRIORITY_CFG[req.priority];

    const updateStatus = async (status: ReqStatus) => {
        await fetch(`${API_BASE_URL}/api/headcount/requisitions/${req.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        onRefresh();
    };

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/[0.03] border border-white/10 p-4 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${st.color}`}>{st.label}</span>
                        <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${pr.color}`}>{pr.icon} {pr.label}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{req.job_title}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                        {req.job_level && <span>{req.job_level}</span>}
                        {req.job_level && req.job_type && <span>·</span>}
                        <span className="capitalize">{req.job_type.replace('_', '-')}</span>
                        {req.location && <><span>·</span><span>{req.location}{req.is_remote ? ' (Remote)' : ''}</span></>}
                    </div>
                </div>
                {(req.min_salary || req.max_salary) && (
                    <div className="text-right shrink-0">
                        <p className="text-xs text-white/40">Salary Band</p>
                        <p className="text-sm font-bold text-emerald-400">
                            {req.min_salary ? fmt(req.min_salary) : '?'} – {req.max_salary ? fmt(req.max_salary) : '?'}
                        </p>
                    </div>
                )}
            </div>

            {req.skills_required && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {req.skills_required.split(',').map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">{s.trim()}</span>
                    ))}
                </div>
            )}

            {req.justification && (
                <p className="text-xs text-white/40 mb-3 line-clamp-2 italic">"{req.justification}"</p>
            )}

            {/* Quick status change */}
            {req.status !== 'filled' && req.status !== 'cancelled' && (
                <div className="flex gap-1.5 flex-wrap">
                    {req.status === 'draft' && (
                        <button onClick={() => updateStatus('approved')}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
                            ✓ Approve
                        </button>
                    )}
                    {req.status === 'approved' && (
                        <button onClick={() => updateStatus('in_progress')}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all">
                            🎯 Start Hiring
                        </button>
                    )}
                    {(req.status === 'in_progress' || req.status === 'approved') && (
                        <button onClick={() => updateStatus('filled')}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all">
                            ✅ Mark Filled
                        </button>
                    )}
                    <button onClick={() => updateStatus('cancelled')}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400/60 hover:bg-red-500/10 transition-all">
                        Cancel
                    </button>
                </div>
            )}
        </motion.div>
    );
}

// ---- Org Chart Node ----
function OrgDeptNode({ node, expanded, onToggle }: { node: OrgNode; expanded: boolean; onToggle: () => void }) {
    const fill = Math.min(100, (node.headcount / 15) * 100);
    return (
        <div className="select-none">
            <button onClick={onToggle}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all text-left mb-2 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Building2 size={16} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{node.dept_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${fill}%` }} />
                        </div>
                        <span className="text-xs text-white/40 shrink-0">{node.headcount} people</span>
                    </div>
                </div>
                {expanded ? <ChevronDown size={14} className="text-white/30 shrink-0" /> : <ChevronRight size={14} className="text-white/30 shrink-0" />}
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 mb-2">
                        <div className="flex flex-col gap-1.5 border-l border-white/10 pl-4">
                            {node.members.map(m => (
                                <div key={m.id} className="flex items-center gap-2 py-1.5">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                        {m.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-white">{m.name}</p>
                                        <p className="text-[10px] text-white/30">{m.designation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ---- Scenario Card ----
function ScenarioCard({ s }: { s: Scenario }) {
    const cfg = SCENARIO_CFG[s.scenario_type];
    return (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl bg-gradient-to-br border p-5 ${cfg.color}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{cfg.icon}</span>
                <div>
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-xs text-white/40">{cfg.label} · {s.timeframe_months}m</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                    <p className="text-xl font-black text-white">{s.projected_headcount ?? '—'}</p>
                    <p className="text-[10px] text-white/40">Projected HC</p>
                </div>
                <div>
                    <p className="text-xl font-black text-emerald-400">{s.net_hires_needed ?? 0}</p>
                    <p className="text-[10px] text-white/40">Net Hires</p>
                </div>
                <div>
                    <p className="text-xl font-black text-amber-400">{s.projected_cost ? fmt(s.projected_cost) : '—'}</p>
                    <p className="text-[10px] text-white/40">Annual Cost</p>
                </div>
            </div>
            <div className="flex gap-3 text-[10px] text-white/50">
                <span>↑ {s.growth_rate_pct}% growth</span>
                <span>· ↓ {s.attrition_rate_pct}% attrition</span>
                <span>· 💰 {s.salary_increase_pct}% hike</span>
            </div>
        </motion.div>
    );
}

// ---- Main Page ----
export default function HeadcountPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [orgChart, setOrgChart] = useState<OrgNode[]>([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'dashboard' | 'roles' | 'scenarios' | 'org'>('dashboard');
    const [showAddReq, setShowAddReq] = useState(false);
    const [showAddScenario, setShowAddScenario] = useState(false);
    const [expandedDepts, setExpandedDepts] = useState<Set<number>>(new Set());
    const [reqFilter, setReqFilter] = useState<ReqStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const t = localStorage.getItem('token') || '';
        setToken(t);
        fetchAll(t);
    }, []);

    const fetchAll = async (t: string) => {
        setLoading(true);
        try {
            const [dashRes, reqRes, scRes, orgRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/headcount/dashboard`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/headcount/requisitions`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/headcount/scenarios`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/headcount/org-chart`, { headers: { Authorization: `Bearer ${t}` } }),
            ]);
            if (dashRes.ok) setData(await dashRes.json());
            if (reqRes.ok) setRequisitions(await reqRes.json());
            if (scRes.ok) setScenarios(await scRes.json());
            if (orgRes.ok) setOrgChart(await orgRes.json());
        } catch { }
        setLoading(false);
    };

    const toggleDept = (id: number) => {
        setExpandedDepts(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const filteredReqs = requisitions
        .filter(r => reqFilter === 'all' || r.status === reqFilter)
        .filter(r => r.job_title.toLowerCase().includes(searchTerm.toLowerCase()));

    const currentHeadcount = data?.summary.total_active ?? 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-[#08080f] to-zinc-950 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Headcount Planning</h1>
                                <p className="text-white/40 text-sm">Workforce strategy, open roles & scenario modeling</p>
                            </div>
                        </div>
                        <button onClick={() => fetchAll(token)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                            <RefreshCw size={13} /> Refresh
                        </button>
                    </div>

                    {/* Summary Stats */}
                    {data && (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
                            <StatCard icon={<Users size={13} />} label="Active HC" value={String(data.summary.total_active)} color="text-indigo-400" />
                            <StatCard icon={<Briefcase size={13} />} label="Open Roles" value={String(data.summary.open_requisitions)} color="text-blue-400" />
                            <StatCard icon={<AlertCircle size={13} />} label="Critical Roles" value={String(data.summary.critical_roles)} color="text-red-400" />
                            <StatCard icon={<CheckCircle2 size={13} />} label="Hires (90d)" value={String(data.summary.recent_hires_90d)} color="text-emerald-400" />
                            <StatCard icon={<DollarSign size={13} />} label="Avg CTC" value={fmt(data.summary.avg_monthly_salary)} sub="per month" color="text-amber-400" />
                            <StatCard icon={<TrendingUp size={13} />} label="Payroll Burn" value={fmt(data.summary.monthly_payroll_burn)} sub="per month" color="text-violet-400" />
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 w-fit">
                        {([
                            { key: 'dashboard', label: '📊 Dashboard' },
                            { key: 'roles', label: '💼 Open Roles' },
                            { key: 'scenarios', label: '⚡ Scenarios' },
                            { key: 'org', label: '🌳 Org Chart' },
                        ] as const).map(t => (
                            <button key={t.key} onClick={() => { setTab(t.key); setShowAddReq(false); setShowAddScenario(false); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-white/50 hover:text-white'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dashboard Tab */}
                <AnimatePresence mode="wait">
                    {tab === 'dashboard' && data && (
                        <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Dept Distribution */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Users size={15} className="text-indigo-400" /> Headcount by Department</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={data.dept_distribution} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                                        <XAxis dataKey="dept" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                                        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                            {data.dept_distribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Dept Salary Distribution */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><DollarSign size={15} className="text-amber-400" /> Avg Salary by Department</h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={data.dept_salary} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 60 }}>
                                        <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickFormatter={v => fmt(v)} />
                                        <YAxis type="category" dataKey="dept" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} width={55} />
                                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(v: any) => fmt(Number(v))} />
                                        <Bar dataKey="avg_salary" radius={[0, 6, 6, 0]} fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Requisition Status Pie */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Briefcase size={15} className="text-blue-400" /> Requisition Pipeline</h3>
                                <div className="flex items-center gap-6">
                                    <ResponsiveContainer width="50%" height={150}>
                                        <PieChart>
                                            <Pie data={Object.entries(data.requisitions_by_status).map(([k, v]) => ({ name: k, value: v }))}
                                                dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                                                {Object.keys(data.requisitions_by_status).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex flex-col gap-2 flex-1">
                                        {Object.entries(data.requisitions_by_status).map(([status, count], i) => (
                                            <div key={status} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                    <span className="text-white/60 capitalize">{status.replace('_', ' ')}</span>
                                                </div>
                                                <span className="font-bold text-white">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick scenarios preview */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Zap size={15} className="text-violet-400" /> Active Scenarios</h3>
                                    <button onClick={() => setTab('scenarios')} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</button>
                                </div>
                                {scenarios.length === 0 ? (
                                    <p className="text-xs text-white/30 text-center py-8">No scenarios modeled yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {scenarios.slice(0, 2).map(s => (
                                            <div key={s.id} className={`rounded-xl bg-gradient-to-br border p-3 flex items-center justify-between ${SCENARIO_CFG[s.scenario_type].color}`}>
                                                <div className="flex items-center gap-2">
                                                    <span>{SCENARIO_CFG[s.scenario_type].icon}</span>
                                                    <span className="text-sm text-white font-medium">{s.name}</span>
                                                </div>
                                                <div className="flex gap-3 text-xs text-white/60">
                                                    <span>{s.projected_headcount} HC</span>
                                                    <span>{s.net_hires_needed} hires</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Open Roles Tab */}
                    {tab === 'roles' && (
                        <motion.div key="roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                                <div className="flex gap-2 flex-wrap">
                                    {(['all', 'draft', 'approved', 'in_progress', 'filled'] as const).map(s => (
                                        <button key={s} onClick={() => setReqFilter(s)}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${reqFilter === s ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                                            {s === 'all' ? 'All' : STATUS_CFG[s]?.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Search roles..." className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                                    </div>
                                    <button onClick={() => setShowAddReq(!showAddReq)}
                                        className="flex items-center gap-1.5 text-xs px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all">
                                        <Plus size={13} /> New Requisition
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {showAddReq && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
                                        <AddReqModal token={token} onDone={() => { setShowAddReq(false); fetchAll(token); }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {filteredReqs.length === 0 ? (
                                <div className="text-center py-20 text-white/20">
                                    <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
                                    <p>No requisitions yet. Open your first role!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredReqs.map(r => <ReqCard key={r.id} req={r} token={token} onRefresh={() => fetchAll(token)} />)}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Scenarios Tab */}
                    {tab === 'scenarios' && (
                        <motion.div key="scenarios" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-sm text-white/50">Model different growth strategies and see projected headcount & costs in real-time.</p>
                                <button onClick={() => setShowAddScenario(!showAddScenario)}
                                    className="flex items-center gap-1.5 text-xs px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all">
                                    <Plus size={13} /> New Scenario
                                </button>
                            </div>

                            <AnimatePresence>
                                {showAddScenario && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
                                        <ScenarioModal token={token} currentHeadcount={currentHeadcount} onDone={() => { setShowAddScenario(false); fetchAll(token); }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {scenarios.length === 0 ? (
                                <div className="text-center py-20 text-white/20">
                                    <Zap size={40} className="mx-auto mb-3 opacity-30" />
                                    <p>No scenarios yet. Model your first workforce strategy!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {scenarios.map(s => <ScenarioCard key={s.id} s={s} />)}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Org Chart Tab */}
                    {tab === 'org' && (
                        <motion.div key="org" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-white/50">{orgChart.length} departments · {orgChart.reduce((s, d) => s + d.headcount, 0)} total employees</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setExpandedDepts(new Set(orgChart.map(d => d.dept_id)))}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                                        Expand All
                                    </button>
                                    <button onClick={() => setExpandedDepts(new Set())}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all">
                                        Collapse All
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {orgChart.map(node => (
                                    <div key={node.dept_id} className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                                        <OrgDeptNode node={node} expanded={expandedDepts.has(node.dept_id)} onToggle={() => toggleDept(node.dept_id)} />
                                    </div>
                                ))}
                            </div>
                            {orgChart.length === 0 && (
                                <div className="text-center py-20 text-white/20">
                                    <GitBranch size={40} className="mx-auto mb-3 opacity-30" />
                                    <p>No org data available yet.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
