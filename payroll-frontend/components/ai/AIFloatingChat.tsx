"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIFloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Greeting, human! I see payroll costs are up 5% this month. Want a breakdown?' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');
        // Simulating AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "I'm analyzing that right now... The attrition risk for your engineering team is currently low (2.4%)."
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        className="mb-6 w-[400px] h-[550px] bg-card/60 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative group"
                    >
                        {/* Neon Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none" />

                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-card/40 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-tight">AI Agent <span className="text-indigo-400">Hub</span></h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Intelligence</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-none">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "flex flex-col gap-2 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto items-end" : "items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed",
                                        msg.role === 'ai'
                                            ? "bg-muted/40 text-foreground border border-white/5"
                                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    )}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-card/40 border-t border-white/10 relative z-10">
                            <div className="relative group/input">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    className="w-full bg-muted/20 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:outline-none focus:border-indigo-500/50 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1.5 p-2 bg-indigo-600 text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-indigo-600/30"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all relative group overflow-hidden",
                    isOpen
                        ? "bg-slate-900 border border-white/10"
                        : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-600/30"
                )}
            >
                {isOpen ? <X className="w-7 h-7" /> : <Brain className="w-7 h-7" />}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />
            </motion.button>
        </div>
    );
}
