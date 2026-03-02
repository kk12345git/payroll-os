'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Send, Sparkles, ChevronRight, TrendingUp, AlertTriangle,
    Users, DollarSign, BarChart3, FileText, Zap, MessageSquare,
    Copy, CheckCheck, RefreshCw, Lightbulb, Shield, Award, Target
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

// ---- Types ----
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'metric' | 'chart' | 'alert' | 'insight' | 'entity' | 'error' | 'help' | 'draft' | 'report';
    data?: any;
    suggestions?: string[];
    timestamp: Date;
}

// ---- Suggested Queries ----
const QUICK_COMMANDS = [
    { icon: <AlertTriangle size={14} />, label: 'Flight Risk Report', query: 'Show me the flight risk report', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { icon: <TrendingUp size={14} />, label: 'Budget Forecast', query: 'Forecast next month budget', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { icon: <DollarSign size={14} />, label: 'Compensation Gap', query: 'Show compensation gap analysis', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { icon: <Award size={14} />, label: 'Top Performers', query: 'Who are the top performers?', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { icon: <FileText size={14} />, label: 'Draft Offer Letter', query: 'Draft an offer letter for Rahul Sharma', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { icon: <Shield size={14} />, label: 'Team Health', query: 'Give me a team health report', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { icon: <Users size={14} />, label: 'Headcount', query: 'How many employees do we have?', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { icon: <BarChart3 size={14} />, label: 'Leave Analysis', query: 'Who has the most leaves this month?', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
];

// ---- Copy Button ----
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-white/30 hover:text-white/70 transition-colors">
            {copied ? <CheckCheck size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
}

// ---- Render markdown-ish text ----
function MarkdownText({ text }: { text: string }) {
    const lines = text.split('\n');
    return (
        <div className="space-y-0.5">
            {lines.map((line, i) => {
                if (!line.trim()) return <div key={i} className="h-2" />;
                // Bold headers (**text**)
                const rendered = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
                // List items
                if (line.trim().startsWith('- ') || line.trim().startsWith('•')) {
                    return (
                        <div key={i} className="flex gap-2 text-white/70 text-sm leading-relaxed">
                            <span className="text-white/30 mt-0.5 shrink-0">•</span>
                            <span dangerouslySetInnerHTML={{ __html: rendered.replace(/^[-•]\s*/, '') }} />
                        </div>
                    );
                }
                // Header lines with -- ---
                if (line.startsWith('---')) return <hr key={i} className="border-white/10 my-2" />;
                // Numbered items
                const numMatch = line.match(/^(\d+)\.\s(.+)/);
                if (numMatch) {
                    return (
                        <div key={i} className="flex gap-2 text-white/70 text-sm leading-relaxed">
                            <span className="text-indigo-400 font-bold shrink-0 w-5">{numMatch[1]}.</span>
                            <span dangerouslySetInnerHTML={{ __html: numMatch[2].replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                        </div>
                    );
                }
                return (
                    <p key={i} className="text-white/70 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: rendered }} />
                );
            })}
        </div>
    );
}

// ---- Message Bubble ----
function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.role === 'user';

    const bgClass = {
        metric: 'border-blue-500/20 bg-blue-500/5',
        alert: 'border-red-500/20 bg-red-500/5',
        insight: 'border-indigo-500/20 bg-indigo-500/5',
        chart: 'border-amber-500/20 bg-amber-500/5',
        entity: 'border-violet-500/20 bg-violet-500/5',
        draft: 'border-emerald-500/20 bg-emerald-500/5',
        report: 'border-teal-500/20 bg-teal-500/5',
        help: 'border-white/10 bg-white/3',
        error: 'border-red-500/30 bg-red-500/10',
    }[msg.type || 'insight'] || 'border-white/10 bg-white/5';

    const typeLabel = ({
        metric: { label: 'Metric', color: 'text-blue-400', icon: <BarChart3 size={11} /> },
        alert: { label: 'Risk Alert', color: 'text-red-400', icon: <AlertTriangle size={11} /> },
        insight: { label: 'Insight', color: 'text-indigo-400', icon: <Lightbulb size={11} /> },
        chart: { label: 'Analysis', color: 'text-amber-400', icon: <TrendingUp size={11} /> },
        entity: { label: 'Record', color: 'text-violet-400', icon: <Target size={11} /> },
        draft: { label: 'Draft Document', color: 'text-emerald-400', icon: <FileText size={11} /> },
        report: { label: 'Report', color: 'text-teal-400', icon: <Shield size={11} /> },
        help: { label: 'Help', color: 'text-white/40', icon: <Sparkles size={11} /> },
        error: { label: 'Error', color: 'text-red-400', icon: <AlertTriangle size={11} /> },
    } as Record<string, any>)[msg.type || 'insight'];


    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-600' : 'bg-gradient-to-br from-violet-600 to-indigo-600'}`}>
                {isUser ? <span className="text-xs font-bold text-white">U</span> : <Brain size={15} className="text-white" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {isUser ? (
                    <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm">
                        {msg.content}
                    </div>
                ) : (
                    <div className={`rounded-2xl rounded-tl-sm border p-4 ${bgClass}`}>
                        {typeLabel && (
                            <div className={`flex items-center gap-1.5 text-[10px] font-semibold mb-3 ${typeLabel.color}`}>
                                {typeLabel.icon} {typeLabel.label}
                            </div>
                        )}
                        <MarkdownText text={msg.content} />

                        {/* Suggestion chips */}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {msg.suggestions.map((s, i) => (
                                    <button key={i}
                                        className="text-xs px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/20 transition-all"
                                        onClick={() => {
                                            // We'll handle this via a custom event
                                            window.dispatchEvent(new CustomEvent('copilot-suggestion', { detail: s }));
                                        }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Timestamp + copy */}
                {!isUser && (
                    <div className="flex items-center gap-3 pl-1">
                        <span className="text-[10px] text-white/20">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <CopyButton text={msg.content} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ---- Typing Indicator ----
function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                <Brain size={15} className="text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                {[0, 1, 2].map(i => (
                    <motion.div key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                    />
                ))}
            </div>
        </div>
    );
}

// ---- Main Page ----
export default function CopilotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const t = localStorage.getItem('token') || '';
        setToken(t);

        // Welcome message
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: '👋 **Welcome to the AutoPay-OS AI HR Copilot!**\n\nI can answer questions about your workforce, predict flight risk, analyze compensation gaps, draft documents, and much more.\n\nTry one of the quick commands below or ask me anything! 🚀',
            type: 'help',
            suggestions: [
                'Show me the flight risk report',
                'Forecast next month budget',
                'Who are the top performers?',
                'Draft an offer letter for Priya Patel',
            ],
            timestamp: new Date()
        }]);

        // Listen for suggestion clicks
        const handler = (e: CustomEvent) => {
            handleSend(e.detail, localStorage.getItem('token') || '');
        };
        window.addEventListener('copilot-suggestion', handler as EventListener);
        return () => window.removeEventListener('copilot-suggestion', handler as EventListener);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = async (query: string, t?: string) => {
        const tok = t ?? token;
        if (!query.trim() || loading) return;
        setInput('');

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: query,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/copilot/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
                body: JSON.stringify({ query })
            });
            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer || 'I could not generate a response.',
                type: data.type,
                data: data.data,
                suggestions: data.suggestions,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '❌ Connection error. Please check your network and try again.',
                type: 'error',
                timestamp: new Date()
            }]);
        }
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    const clearChat = () => {
        setMessages([{
            id: 'cleared',
            role: 'assistant',
            content: '🔄 Chat cleared. How can I help you?',
            type: 'help',
            timestamp: new Date()
        }]);
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-zinc-950 via-[#06060f] to-zinc-950 overflow-hidden">

            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-white/[0.06] bg-black/20 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                        <Brain size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white">AutoPay-OS HR Copilot</h1>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] text-white/40">AI-powered · 20+ HR commands</span>
                        </div>
                    </div>
                </div>
                <button onClick={clearChat} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                    <RefreshCw size={12} /> Clear
                </button>
            </div>

            {/* Quick Commands */}
            <div className="shrink-0 px-4 py-3 border-b border-white/[0.04] bg-black/10">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                    {QUICK_COMMANDS.map((cmd, i) => (
                        <button key={i} onClick={() => handleSend(cmd.query)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border whitespace-nowrap shrink-0 transition-all hover:opacity-80 ${cmd.color}`}>
                            {cmd.icon} {cmd.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                {loading && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-indigo-500/40 transition-colors">
                    <Sparkles size={16} className="text-indigo-400 shrink-0" />
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about your workforce... (e.g. 'flight risk', 'draft offer letter', 'compensation gap')"
                        className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none"
                        disabled={loading}
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || loading}
                        className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    >
                        <Send size={14} className="text-white" />
                    </button>
                </div>
                <p className="text-center text-[10px] text-white/20 mt-2">
                    AI Copilot uses your live payroll, attendance, and performance data · Responses are advisory only
                </p>
            </div>
        </div>
    );
}
