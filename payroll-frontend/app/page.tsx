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
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
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
              Antigravity<span className="text-indigo-600">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 font-black text-xs uppercase tracking-widest text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#ai" className="hover:text-indigo-600 transition-colors">AI Engine</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-900 border-2 border-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
              Client Login
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-indigo-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-indigo-600/25">
              Start Free Trial
            </Link>
          </div>
        </motion.div>
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
              Launch My Enterprise
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-6 bg-white text-slate-900 border-2 border-slate-200 rounded-[2rem] font-black text-lg flex items-center gap-3 hover:bg-slate-50 transition-all">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">Designed for Global scale.</h2>
            <div className="w-24 h-2 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Multi-Currency",
                desc: "Switch between USD, AED, INR, and GBP instantly with localized tax rule injection."
              },
              {
                icon: ShieldCheck,
                title: "Statutory PDF Filings",
                desc: "Form 16, 24Q, and automated TDS certificates generated with one click."
              },
              {
                icon: Zap,
                title: "Earned Wage Access",
                desc: "Empower employees to withdraw their earned salary anytime, reducing financial stress."
              },
              {
                icon: Brain,
                title: "AI Admin Copilot",
                desc: "Natural language query interface. Just ask 'What's my total payroll cost?'"
              },
              {
                icon: TrendingUp,
                title: "Cash Flow Vision",
                desc: "Predictive 6-month liability projections using historical spend and hiring velocity."
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Self-Service",
                desc: "Employees get payslips, mark attendance, and check balances via WhatsApp."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
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
                <div className="text-5xl font-black mb-6">$49<span className="text-lg text-slate-500 ml-1">/mo</span></div>
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

      {/* Footer */}
      <footer className="py-20 bg-slate-50 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Antigravity<span className="text-indigo-600">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-12 text-sm font-bold text-slate-400">
            <span>© 2026 Antigravity Global Ltd.</span>
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
