'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    BookOpen,
    MessageCircle,
    HelpCircle,
    FileText,
    ShieldCheck,
    Zap,
    Coins,
    ChevronRight,
    PlayCircle
} from 'lucide-react';
import { api } from '@/lib/api';

const ARTICLES = [
    { cat: 'Getting Started', title: 'Setting up your Global Workspace', desc: 'Learn how to configure your country and base currency rules.' },
    { cat: 'Payments', title: 'Managing Stripe Subscriptions', desc: 'How to upgrade, downgrade, or update your billing information.' },
    { cat: 'Compliance', title: 'Generating Form 16 & 24Q', desc: 'A step-by-step guide to automated statutory filings.' },
    { cat: 'AI Features', title: 'Powering up with AI Admin Copilot', desc: 'Ask natural language questions to gain deep payroll insights.' },
];

export default function HelpCenterPage() {
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Header / Search */}
            <section className="bg-slate-900 pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[150px] rounded-full" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8"
                    >
                        How can we <span className="text-indigo-400">help?</span>
                    </motion.h1>
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                        <input
                            type="text"
                            placeholder="Search articles on compliance, payments, AI..."
                            className="w-full pl-16 pr-8 py-6 bg-white/10 backdrop-blur-xl border-none rounded-[2rem] text-white text-lg font-medium focus:ring-4 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Quick Categories */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { icon: BookOpen, title: 'Knowledge Base', desc: 'Explore detailed documentation on every feature.' },
                        { icon: PlayCircle, title: 'Video Tutorials', desc: 'Watch quick guides to master the platform.' },
                        { icon: MessageCircle, title: 'Direct Support', desc: 'Chat with our global experts 24/7.' },
                    ].map((card, i) => (
                        <div key={i} className="card-extreme p-10 bg-slate-50 border-none hover:bg-white hover:shadow-2xl transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 transition-colors">
                                <card.icon className="w-8 h-8 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">{card.title}</h3>
                            <p className="text-slate-500 font-medium">{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Popular Articles */}
                <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                    <FileText className="text-indigo-600 w-8 h-8" />
                    Popular Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ARTICLES.map((art, i) => (
                        <div key={i} className="p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-600/20 hover:bg-indigo-50/30 transition-all flex items-center justify-between group cursor-pointer">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">{art.cat}</div>
                                <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{art.title}</h4>
                                <p className="text-sm font-medium text-slate-500 mt-1">{art.desc}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t bg-slate-50 px-6 text-center">
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                    Antigravity Global SaaS • World-Class Documentation Engine
                </p>
            </footer>
        </div>
    );
}
