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
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

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
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 font-sans border-t-8 border-indigo-600 overflow-hidden"
    >
      {/* Cursor Glow */}
      <motion.div
        animate={{
          x: (mousePos.x + 0.5) * (typeof window !== 'undefined' ? window.innerWidth : 1000) - 150,
          y: (mousePos.y + 0.5) * (typeof window !== 'undefined' ? window.innerHeight : 1000) - 150,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="fixed top-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0"
      />
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
      <section className="relative pt-44 pb-32 overflow-hidden mesh-gradient-premium">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 glass-card-premium rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-12 text-indigo-600 border-indigo-200/50"
          >
            <Star className="w-4 h-4 fill-indigo-600" />
            Empowering the Future of Business
          </motion.div>

          <motion.h1
            style={{
              rotateX: mousePos.y * -10,
              rotateY: mousePos.x * 10,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="text-7xl md:text-[10rem] font-black tracking-[-0.05em] leading-[0.85] text-slate-900 mb-12 perspective-1000"
          >
            THE <span className="text-indigo-600 italic text-glitch" data-text="OS">OS</span> <br />
            OF EVERY<span className="text-gradient-extreme text-glitch" data-text="THING.">THING.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 font-bold max-w-3xl mx-auto mb-16 leading-tight tracking-tight px-4"
          >
            Beyond payroll. Beyond HR. AutoPay-OS is the intelligent core for global enterprises built for the next century of innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 perspective-1000"
          >
            <div
              className="magnetic-wrap"
              style={{ '--mx': mousePos.x, '--my': mousePos.y } as any}
            >
              <Link href="/register" className="group relative px-12 py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/40 magnetic-btn">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
                Launch Enterprise
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div
              className="magnetic-wrap"
              style={{ '--mx': mousePos.x, '--my': mousePos.y } as any}
            >
              <a href="#faq" className="px-12 py-7 glass-card-premium text-slate-900 rounded-[2.5rem] font-black text-xl flex items-center gap-4 hover:bg-white transition-all border-slate-200/60 shadow-xl magnetic-btn">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
                See it in Action
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Feature Grid Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Switch between USD, AED, INR, and GBP instantly with localized tax injection.",
                color: "indigo"
              },
              {
                icon: ShieldCheck,
                title: "Statutory PDF",
                desc: "Form 16, 24Q, and automated TDS certificates generated with zero manual effort.",
                color: "blue"
              },
              {
                icon: Zap,
                title: "Wage Access",
                desc: "Empower employees to withdraw their earned salary anytime, reducing stress.",
                color: "pink"
              },
              {
                icon: Brain,
                title: "AI Copilot",
                desc: "A natural language interface for your complex payroll and compliance queries.",
                color: "purple"
              },
              {
                icon: TrendingUp,
                title: "Cash Vision",
                desc: "Predictive 6-month liability projections using historical spend velocity.",
                color: "emerald"
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Bot",
                desc: "Employees get payslips, mark attendance, and check balances via WhatsApp.",
                color: "cyan"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{
                  y: -15,
                  rotateX: mousePos.y * 15,
                  rotateY: mousePos.x * 15,
                  transition: { type: "spring", damping: 10, stiffness: 100 }
                }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  delay: idx * 0.05
                }}
                viewport={{ once: true }}
                className="group p-10 glass-card-premium rounded-[3.5rem] hover:bg-slate-900 transition-all duration-700 perspective-1000 tilt-inner"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 transition-all group-hover:rotate-[360deg] duration-1000">
                  <feature.icon className="w-10 h-10 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-white transition-colors uppercase tracking-tight italic">{feature.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed group-hover:text-slate-400 transition-colors">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-32 bg-white relative overflow-hidden mesh-gradient-premium">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-28">
            <div className="max-w-2xl">
              <div className="w-20 h-2 bg-indigo-600 rounded-full mb-8" />
              <h2 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.9]">Trusted by the <br /> 1% of Global Tech.</h2>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
                ))}
                <span className="ml-4 font-black text-slate-900 uppercase tracking-widest text-[10px]">Verified Excellence</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="glass-card-premium p-10 rounded-[2.5rem] flex items-center gap-6 shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">JD</div>
                <div>
                  <div className="font-black text-2xl text-slate-900">John Doe</div>
                  <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">HR Director, TechCorp</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{
                rotateX: mousePos.y * 5,
                rotateY: mousePos.x * 5,
              }}
              className="p-16 bg-slate-900 rounded-[4rem] text-white relative group overflow-hidden shadow-2xl perspective-1000"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl" />
              <MessageSquare className="w-16 h-16 text-indigo-500 mb-12 animate-bounce" />
              <p className="text-3xl font-black leading-tight mb-16 tracking-tight">
                "AutoPay-OS changed how we handle payroll across 4 countries. The WhatsApp integration is a game-changer for our remote workers."
              </p>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center font-black text-xl group-hover:rotate-12 transition-transform">SA</div>
                <div>
                  <div className="font-black text-2xl">Sarah Ahmed</div>
                  <div className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Head of People, Global Logistics</div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "15k+", desc: "Monthly Transactions" },
                { label: "99.9%", desc: "Uptime Guaranteed" },
                { label: "120+", desc: "Enterprises Signed" },
                { label: "₹4.2bn", desc: "Total Processed" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, rotateZ: i % 2 === 0 ? 2 : -2 }}
                  className="p-10 glass-card-premium rounded-[3rem] group hover:bg-slate-900 transition-all duration-500 border-none shadow-xl cursor-none"
                >
                  <div className="text-4xl font-black text-slate-900 group-hover:text-white mb-2 transition-colors">{stat.label}</div>
                  <div className="text-[10px] font-black text-indigo-600 group-hover:text-indigo-400 uppercase tracking-[0.2em] transition-colors">{stat.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-44 bg-slate-50 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="mb-32">
            <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter text-slate-900 mb-8 leading-[0.85]">
              CHOOSE YOUR <br />
              <span className="text-indigo-600 italic">TRAJECTORY.</span>
            </h2>
            <p className="text-2xl text-slate-400 font-bold max-w-2xl mx-auto tracking-tight">Simple, Global Pricing for high-performance teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto items-center">
            {/* Startup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ rotateY: -10, y: -10 }}
              className="p-12 glass-card-premium rounded-[4rem] flex flex-col justify-between h-full border-none shadow-xl transition-all duration-500 perspective-1000"
            >
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Startup</h3>
                <div className="text-7xl font-black text-slate-900 mb-10">FREE</div>
                <p className="text-slate-400 font-bold mb-12 italic tracking-tight text-left">Up to 10 employees.</p>
                <ul className="space-y-6 mb-16">
                  {['Core Payroll', 'Attendance', 'Mobile Access'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-4 text-xs font-black text-slate-900 uppercase tracking-widest text-left">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="w-full py-7 bg-white text-slate-900 rounded-[2rem] font-black text-lg text-center border-2 border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-lg">
                Get Started
              </Link>
            </motion.div>

            {/* Enterprise - PRO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.15,
                rotateX: mousePos.y * 10,
                rotateY: mousePos.x * 10,
              }}
              className="p-16 bg-slate-900 text-white rounded-[5rem] flex flex-col justify-between relative transform md:scale-110 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] min-h-[850px] perspective-1000 z-20"
            >
              <div className="absolute top-0 right-16 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Most Popular</div>
              <div>
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-16">Pro Enterprise</h3>
                <div className="text-8xl font-black mb-12 flex flex-col items-center">
                  <span className="text-gradient-extreme text-7xl md:text-8xl text-glitch" data-text={typeof window !== 'undefined' && (window.navigator.language === 'en-IN' || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Calcutta') ? '₹4,999' : '$99'}>
                    {typeof window !== 'undefined' && (window.navigator.language === 'en-IN' || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Calcutta') ? '₹4,999' : '$99'}
                  </span>
                  <span className="text-sm text-slate-500 mt-2 uppercase tracking-widest">Per Month</span>
                </div>
                <p className="text-slate-400 font-bold mb-16 tracking-tight">The ultimate engine for growth.</p>
                <ul className="space-y-6 mb-20 text-left">
                  {['AI Admin Copilot', 'Self-Service WhatsApp', 'Stripe Global Billing', 'Form 16 Automations', 'Priority Support'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-5 text-sm font-black tracking-tight group">
                      <CheckCircle2 className="w-6 h-6 text-indigo-500 group-hover:scale-125 transition-transform" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="w-full py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-center text-xl hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-indigo-600/50">
                Select Trajectory
              </Link>
            </motion.div>

            {/* Custom - GLOBAL */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ rotateY: 10, y: -10 }}
              className="p-12 glass-card-premium rounded-[4rem] flex flex-col justify-between h-full border-none shadow-xl transition-all duration-500 text-left perspective-1000"
            >
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Global</h3>
                <div className="text-6xl font-black text-slate-900 mb-10 uppercase italic">CUSTOM</div>
                <p className="text-slate-400 font-bold mb-12 italic tracking-tight">White-label & API access.</p>
                <ul className="space-y-6 mb-16">
                  {['On-Premise Option', 'Dedicated Manager', 'Custom Rules'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-4 text-xs font-black text-slate-900 uppercase tracking-widest text-left">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-7 bg-white text-slate-900 rounded-[2rem] font-black text-lg text-center border-2 border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-lg">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-44 bg-white relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.85]">
              COMMON <br />
              <span className="text-indigo-600 italic">QUESTIONS.</span>
            </h2>
            <p className="text-xl text-slate-400 font-bold uppercase tracking-[0.2em]">Everything you need to know.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "How secure is my payroll data?", a: "We use bank-grade AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Your data is stored in isolated PostgreSQL instances with SOC2 Type II compliance." },
              { q: "Do you support UAE and Indian compliance?", a: "Yes. AutoPay-OS is natively built for both regions, handling PF/ESI/TDS for India and WPS/MOL reports for the UAE automatically." },
              { q: "Can employees access their own data?", a: "Absolutely. Every employee gets a dedicated portal and a WhatsApp interface to download payslips, check balances, and mark attendance." }
            ].map((item, i) => (
              <div key={i} className="glass-card-premium rounded-[3rem] border-none overflow-hidden transition-all shadow-xl">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-12 py-8 flex items-center justify-between text-left group"
                >
                  <span className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic">{item.q}</span>
                  {activeFaq === i ? <Minus className="w-6 h-6 text-indigo-600" /> : <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />}
                </button>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-12 pb-12 text-slate-500 font-bold leading-relaxed text-lg tracking-tight"
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
      <section className="py-44 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-premium opacity-20" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter text-white mb-16 leading-[0.85]">
            READY FOR THE <br />
            <span className="text-indigo-500 italic">FUTURE?</span>
          </h2>
          <p className="text-2xl text-slate-400 font-bold mb-20 max-w-2xl mx-auto tracking-tight">Join 400+ enterprises waiting for the next-gen AI update.</p>

          <form onSubmit={handleWaitlistSubmit} className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto">
            <input
              type="email"
              required
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="Enter your work email"
              className="flex-1 px-10 py-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-white placeholder:text-white/30 font-black italic outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all text-xl"
            />
            <button
              disabled={isSubmitting}
              className="px-16 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-indigo-600/40"
            >
              {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}
              JOIN NOW
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
