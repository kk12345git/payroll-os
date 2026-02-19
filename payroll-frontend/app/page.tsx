'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  ShieldCheck,
  Globe,
  IndianRupee,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Play,
  Star,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Plus,
  Minus,
  Send,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);
  const [waitlistEmail, setWaitlistEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Welcome to the elite! You're on the list. 🚀");
    setWaitlistEmail('');
    setIsSubmitting(false);
  };
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 font-sans border-t-8 border-indigo-600">
      {/* Navigation */}
      <nav className="fixed top-2 left-0 right-0 z-50 flex justify-center px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-7xl w-full bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl px-8 py-4 flex items-center justify-between shadow-lg shadow-slate-200/20"
        >
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              AutoPay-<span className="text-indigo-600">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 font-black text-xs uppercase tracking-widest text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#ai" className="hover:text-indigo-600 transition-colors">AI Engine</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-900 border-2 border-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                Client Login
              </Link>
              <Link href="/register" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-indigo-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-indigo-600/25">
                Start Free Trial
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 bg-slate-900 text-white rounded-xl active:scale-95 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-24 left-4 right-4 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl md:hidden z-50 flex flex-col gap-6"
          >
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-xl font-black text-slate-900">Features</a>
            <a href="#ai" onClick={() => setIsMenuOpen(false)} className="text-xl font-black text-slate-900">AI Engine</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-xl font-black text-slate-900">Pricing</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="text-xl font-black text-slate-900">FAQ</a>
            <hr className="border-slate-100" />
            <Link href="/login" className="w-full py-5 bg-slate-100 text-slate-900 rounded-2xl font-black text-center">Login</Link>
            <Link href="/register" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-center shadow-xl shadow-indigo-600/20">Sign Up</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-indigo-100"
          >
            <Star className="w-4 h-4 fill-indigo-600" />
            The World's Most Intelligent Payroll Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.95] text-slate-900 mb-8"
          >
            Payroll with an <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Artificial Brain.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Automated compliance, earned wage access, and AI-driven cash flow forecasting for global enterprises. Built for 2026.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link href="/register" className="group px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20">
              Launch Enterprise
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#faq" className="px-10 py-6 bg-white text-slate-900 border-2 border-slate-200 rounded-[2rem] font-black text-lg flex items-center gap-3 hover:bg-slate-50 transition-all">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              See it in Action
            </a>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">Trusted by global <br /> payroll leaders.</h2>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
                ))}
                <span className="ml-4 font-black text-slate-900">4.9/5 Average Rating</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">JD</div>
                <div>
                  <div className="font-black text-slate-900">John Doe</div>
                  <div className="text-xs font-bold text-slate-400">HR Director, TechCorp</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-slate-900 rounded-[3rem] text-white relative group transition-all hover:scale-[1.02]">
              <MessageSquare className="w-12 h-12 text-indigo-500 mb-8 opacity-50" />
              <p className="text-2xl font-bold leading-relaxed mb-12">
                "AutoPay-OS changed how we handle payroll across 4 countries. The WhatsApp integration is a game-changer for our remote workers."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black">SA</div>
                <div>
                  <div className="font-black text-lg">Sarah Ahmed</div>
                  <div className="text-sm font-bold text-slate-400">Head of People, Global Logistics</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "15k+", desc: "Monthly Transactions" },
                { label: "99.9%", desc: "Uptime Guaranteed" },
                { label: "120+", desc: "Enterprises Signed" },
                { label: "₹4.2bn", desc: "Total Payroll Processed" }
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-indigo-600 transition-all">
                  <div className="text-3xl font-black text-slate-900 group-hover:text-white mb-2">{stat.label}</div>
                  <div className="text-xs font-black text-slate-400 group-hover:text-indigo-200 uppercase tracking-widest">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">Simple, Global Pricing.</h2>
            <p className="text-xl text-slate-500 font-medium">Choose a plan that scales with your worldwide team.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-10 bg-slate-50 rounded-[3rem] flex flex-col justify-between border-4 border-transparent hover:border-indigo-600/10 transition-all">
              <div>
                <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-2">Startup</h3>
                <div className="text-5xl font-black text-slate-900 mb-6">Free</div>
                <p className="text-slate-500 font-bold mb-8 italic">Up to 10 employees.</p>
                <ul className="space-y-4 mb-12">
                  {['Core Payroll', 'Attendance', 'Mobile Access'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-black text-slate-900">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-center border-2 border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-10 bg-slate-900 text-white rounded-[3.5rem] flex flex-col justify-between relative transform scale-110 shadow-2xl shadow-slate-900/30">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-6 py-2 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Most Popular</div>
              <div>
                <h3 className="text-xl font-black text-indigo-400 uppercase tracking-widest mb-2">Enterprise</h3>
                <div className="text-5xl font-black mb-6">
                  {typeof window !== 'undefined' && (window.navigator.language === 'en-IN' || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Calcutta') ? '₹4,999' : '$99'}
                  <span className="text-lg text-slate-500 ml-1">/mo</span>
                </div>
                <p className="text-slate-400 font-bold mb-8">Unlimited employees.</p>
                <ul className="space-y-4 mb-12">
                  {['AI Admin Copilot', 'Self-Service WhatsApp', 'Stripe Global Billing', 'Form 16 Automations', 'Priority Support'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-black">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-center hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-indigo-600/40">
                Select Plan
              </Link>
            </div>

            {/* Custom */}
            <div className="p-10 bg-slate-50 rounded-[3rem] flex flex-col justify-between border-4 border-transparent hover:border-indigo-600/10 transition-all">
              <div>
                <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-2">Global</h3>
                <div className="text-5xl font-black text-slate-900 mb-6">Custom</div>
                <p className="text-slate-500 font-bold mb-8 italic">White-label & API access.</p>
                <ul className="space-y-4 mb-12">
                  {['Custom Integrations', 'Dedicated Account Manager', 'On-Premise Option'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-black text-slate-900">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-center border-2 border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">Common Questions.</h2>
            <p className="text-lg text-slate-500 font-bold">Everything you need to know about AutoPay-OS.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "How secure is my payroll data?", a: "We use bank-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Your data is stored in isolated PostgreSQL instances with SOC2 Type II compliance." },
              { q: "Do you support UAE and Indian compliance?", a: "Yes. AutoPay-OS is natively built for both regions, handling PF/ESI/TDS for India and WPS/MOL reports for the UAE automatically." },
              { q: "Can employees access their own data?", a: "Absolutely. Every employee gets a dedicated portal and a WhatsApp interface to download payslips, check balances, and mark attendance." },
              { q: "What happens if I need support?", a: "Pro and Enterprise customers get 24/7 priority support via WhatsApp and Slack. Free users have access to our comprehensive documentation and community forum." }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.q}</span>
                  {activeFaq === i ? <Minus className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />}
                </button>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-8 pb-8 text-slate-500 font-medium leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-32 bg-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">Ready for the future?</h2>
          <p className="text-xl text-indigo-100 font-bold mb-12">Join 400+ enterprises waiting for the next-gen AI update.</p>

          <form onSubmit={handleWaitlistSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              required
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="Enter your work email"
              className="flex-1 px-8 py-6 bg-white/10 border border-white/20 rounded-[2rem] text-white placeholder:text-white/50 font-bold outline-none focus:ring-4 focus:ring-white/20 transition-all"
            />
            <button
              disabled={isSubmitting}
              className="px-12 py-6 bg-white text-indigo-600 rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              Join Waitlist
            </button>
          </form>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-20 bg-slate-50 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transition-transform hover:rotate-12 cursor-pointer">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              AutoPay-<span className="text-indigo-600">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-12 text-sm font-bold text-slate-400">
            <span>© 2026 AutoPay-OS Global Ltd.</span>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Global Support</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:border-indigo-600 hover:text-indigo-600 transition-all cursor-pointer">
              <Globe className="w-5 h-5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
