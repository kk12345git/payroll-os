'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Send,
    Sparkles,
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    Bot,
    User,
    ChevronRight,
    Search,
    RefreshCcw,
    Zap
} from 'lucide-react';
import { api, type CopilotResponse } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    result?: CopilotResponse;
}

export default function AICopilotPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hello! I'm your AI Admin Copilot. Ask me anything about your autopay-os, headcount, or department costs.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userQuery = input.trim();
        const userMsg: Message = {
            id: Date.now().toString(),
            text: userQuery,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.askCopilot(userQuery);

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: response.answer,
                sender: 'bot',
                timestamp: new Date(),
                result: response
            }]);
        } catch (err: any) {
            toast.error("Failed to reach Copilot");
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "❌ Sorry, I'm having trouble connecting to the data engine right now.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQueries = [
        "What is our total annual autopay-os cost?",
        "Who is the highest paid employee?",
        "Show headcount by department",
        "How many active employees do we have?",
        "What is the salary breakdown by department?"
    ];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                        <Brain className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            AI Copilot <span className="text-indigo-600">Beta</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Enterprise Intelligence at your fingertips.</p>
                    </div>
                </div>
                <button
                    onClick={() => setMessages([messages[0]])}
                    className="p-3 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-200"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex gap-8 overflow-hidden">
                {/* Chat Section */}
                <div className="flex-1 card-extreme bg-white/50 backdrop-blur-xl flex flex-col p-0 overflow-hidden border-2">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex items-start gap-4",
                                    msg.sender === 'user' ? "flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                    msg.sender === 'bot' ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                                )}>
                                    {msg.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>

                                <div className={cn(
                                    "max-w-[80%] space-y-4",
                                    msg.sender === 'user' ? "text-right" : ""
                                )}>
                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm font-medium leading-relaxed inline-block text-left",
                                        msg.sender === 'bot'
                                            ? "bg-white border border-slate-200 text-slate-700 shadow-sm"
                                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    )}>
                                        <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*(.*?)\*/g, '<strong class="font-black">$1</strong>') }} />
                                    </div>

                                    {/* data indicators (charts, stats etc) */}
                                    {msg.result?.data && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-[2rem] text-left"
                                        >
                                            {msg.result.type === 'metric' && (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                                                        <Zap className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Calculated Insight</p>
                                                        <p className="text-2xl font-black text-slate-900">
                                                            {typeof msg.result.data === 'object'
                                                                ? Object.values(msg.result.data as Record<string, any>)[0].toLocaleString()
                                                                : String(msg.result.data)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {msg.result.type === 'chart' && (
                                                <div className="space-y-4">
                                                    {Object.entries(msg.result.data as Record<string, number>).map(([label, val]) => (
                                                        <div key={label} className="space-y-1">
                                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                                <span>{label}</span>
                                                                <span>₹{val.toLocaleString()}</span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-indigo-600 rounded-full"
                                                                    style={{ width: `${(val / Math.max(...Object.values(msg.result?.data as Record<string, number>))) * 100}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-8 bg-white border-t border-slate-100">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your Copilot something..."
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-8 pr-20 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600/30 focus:ring-4 focus:ring-indigo-600/5 transition-all text-slate-900"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar Suggestions */}
                <div className="hidden lg:flex flex-col w-80 gap-6">
                    <div className="card-extreme p-6 bg-indigo-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="font-black text-lg mb-2 relative z-10 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Pro Tips
                        </h3>
                        <p className="text-sm text-indigo-100/80 leading-relaxed relative z-10">
                            The AI Copilot understands specific autopay-os metrics. Try asking about trends, high earners, or departmental costs.
                        </p>
                    </div>

                    <div className="flex-1 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Try Asking
                        </h4>
                        {suggestedQueries.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(q)}
                                className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-indigo-600/30 hover:bg-indigo-50 group transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{q}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                        Secure AI Engine Active
                    </div>
                </div>
            </div>
        </div>
    );
}
