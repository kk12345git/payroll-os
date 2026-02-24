'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    MessageSquare,
    Smartphone,
    Bot,
    User,
    MoreVertical,
    Phone,
    Video,
    Paperclip,
    Smile
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function WhatsAppSimulatorPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "👋 Hi! I'm the AutoPay-OS Bot. Verify your phone number to start.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(''); // Simulated user phone
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // If phone number not set, treat first message as phone verification for simulation
        if (!phoneNumber && messages.length === 1) {
            const phone = input.trim();
            setPhoneNumber(phone);

            const userMsg: Message = {
                id: Date.now().toString(),
                text: phone,
                sender: 'user',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMsg]);
            setInput('');

            // Artificial delay
            setLoading(true);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: 'verified',
                    text: `✅ Phone ${phone} verified! Type 'HELP' to see what I can do.`,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
                setLoading(false);
            }, 800);
            return;
        }

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Call backend simulation
            // Use the "verified" phone number for the API call
            const result = await api.simulateWhatsApp(phoneNumber || '0000000000', userMsg.text);

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: result.response,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err: any) {
            toast.error("Failed to connect to bot");
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "❌ Error: Could not reach the payroll server.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex items-center justify-center p-4">
            <div className="flex w-full h-full gap-8">
                {/* Instructions Side */}
                <div className="hidden md:flex flex-col justify-center w-1/3 text-slate-600 space-y-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">WhatsApp Integration</h1>
                        <p className="text-sm font-medium opacity-80">Zero-UI AutoPay-OS Management</p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                        <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            Try these commands:
                        </h3>
                        <ul className="space-y-3 text-sm font-medium text-indigo-800">
                            <li className="flex items-center gap-3 bg-white/50 p-2 rounded-lg">
                                <span className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold font-mono">BALANCE</span>
                                <span>Check EWA limit</span>
                            </li>
                            <li className="flex items-center gap-3 bg-white/50 p-2 rounded-lg">
                                <span className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold font-mono">ATTENDANCE</span>
                                <span>Mark present</span>
                            </li>
                            <li className="flex items-center gap-3 bg-white/50 p-2 rounded-lg">
                                <span className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold font-mono">PAYSLIP</span>
                                <span>Get PDF link</span>
                            </li>
                            <li className="flex items-center gap-3 bg-white/50 p-2 rounded-lg">
                                <span className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold font-mono">WITHDRAW 500</span>
                                <span>Request funds</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-xs">
                        <strong>Simulation Mode:</strong> This interface simulates the Meta/WhatsApp API webhook. In production, this backend service connects directly to your Twilio/Interakt account.
                    </div>
                </div>

                {/* Phone Simulator */}
                <div className="flex-1 flex justify-center h-full">
                    <div className="w-[380px] h-full bg-black rounded-[3rem] p-3 shadow-2xl relative border-[6px] border-slate-800 overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

                        {/* Screen */}
                        <div className="w-full h-full bg-[#E5DDD5] rounded-[2.5rem] overflow-hidden flex flex-col relative z-10">
                            {/* WhatsApp Header */}
                            <div className="bg-[#075E54] text-white p-4 pt-8 flex items-center justify-between shadow-md z-20">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#075E54]">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm leading-tight">AutoPay-OS Bot</h3>
                                        <p className="text-[10px] opacity-80">Business Account</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 opacity-80">
                                    <Video className="w-5 h-5" />
                                    <Phone className="w-4 h-4" />
                                    <MoreVertical className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm relative ${msg.sender === 'user'
                                                ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-none'
                                                : 'bg-white text-slate-900 rounded-tl-none'
                                            }`}>
                                            <div className="whitespace-pre-wrap">{msg.text}</div>
                                            <div className="text-[10px] text-slate-400 text-right mt-1">
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            {/* Triangle */}
                                            <div className={`absolute top-0 w-3 h-3 ${msg.sender === 'user'
                                                    ? '-right-1.5 bg-[#DCF8C6] [clip-path:polygon(0_0,100%_0,0_100%)]'
                                                    : '-left-1.5 bg-white [clip-path:polygon(0_0,100%_0,100%_100%)]'
                                                }`} />
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSend} className="bg-[#F0F0F0] p-2 flex items-center gap-2">
                                <div className="p-2 text-slate-500">
                                    <Smile className="w-6 h-6" />
                                </div>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={!phoneNumber ? "Enter verified phone number..." : "Type a message..."}
                                    className="flex-1 bg-white rounded-full py-2 px-4 focus:outline-none text-sm"
                                />
                                {input.trim() ? (
                                    <button
                                        type="submit"
                                        className="bg-[#075E54] text-white p-2.5 rounded-full shadow-sm hover:bg-[#054c44] transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="p-2.5 bg-[#075E54] text-white rounded-full opacity-50">
                                        <Send className="w-4 h-4" />
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
