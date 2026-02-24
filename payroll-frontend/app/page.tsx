'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  ShieldCheck,
  Globe,
  MessageSquare,
  ChevronRight,
  Play,
  Star,
  ArrowRight,
  Check,
  Cpu,
  Menu,
  X,
  Plus,
  Minus,
  Send,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

import HeroBackground from '@/components/ui/HeroBackground';
import FeatureCard from '@/components/ui/FeatureCard';

const FEATURES = [
  {
    title: "AI Compliance Core",
    description: "Automated tax logic that updates itself. Stay 100% compliant without lifting a finger.",
    icon: <Cpu className="w-10 h-10 text-white" />
  },
  {
    title: "Global Scalability",
    description: "Multi-currency, multi-jurisdiction. Manage 10 or 10,000 employees with the same precision.",
    icon: <Globe className="w-10 h-10 text-white" />
  },
  {
    title: "Predictive Analytics",
    description: "Know your attrition risks and budget forecasts before they happen. Data-driven peace of mind.",
    icon: <Zap className="w-10 h-10 text-white" />
  },
  {
    title: "Hyper-Secure",
    description: "Military-grade encryption for your most sensitive data. Bank-level security, redefined.",
    icon: <ShieldCheck className="w-10 h-10 text-white" />
  },
  {
    title: "Instant ESS Portal",
    description: "Empower your workforce with a premium self-service experience on any device.",
    icon: <Plus className="w-10 h-10 text-white" />
  },
  {
    title: "Dynamic Reporting",
    description: "Generate boardroom-ready insights with a single click. Every metric at your fingertips.",
    icon: <ArrowRight className="w-10 h-10 text-white" />
  }
];

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
      className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white selection:bg-indigo-100 dark:selection:bg-indigo-900/30 font-sans border-t-8 border-indigo-600 overflow-x-hidden"
    >
      <HeroBackground />

      {/* Navigation */}
      <nav className="fixed top-2 left-0 right-0 z-50 flex justify-center px-4">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="max-w-7xl w-full hyper-glass dark:bg-slate-900/40 border-slate-200/50 dark:border-white/5 rounded-3xl px-8 py-4 flex items-center justify-between shadow-2xl"
        >
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              AutoPay-<span className="text-indigo-600">OS</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#ai" className="hover:text-indigo-600 transition-colors">AI Engine</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white/20 rounded-2xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all">
                Client Login
              </Link>
              <Link href="/register" className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25">
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
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 glass-card-premium rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-primary dark:text-primary border-primary/20 bg-primary/5"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
            V2: THE INTELLIGENCE AGE IS HERE
          </motion.div>

          <motion.div
            style={{
              rotateX: mousePos.y * -8,
              rotateY: mousePos.x * 8,
              transformStyle: "preserve-3d"
            }}
            transition={{ type: "spring", damping: 40, stiffness: 80 }}
            className="perspective-2000"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-7xl md:text-[12rem] font-black tracking-[-0.06em] leading-[0.75] mb-16 perspective-origin-center font-display"
            >
              <span className="block text-slate-900 dark:text-white drop-shadow-2xl">PRECISION</span>
              <span className="block italic font-light text-slate-400 dark:text-slate-600">is</span>
              <span className="text-gradient-extreme [text-shadow:_0_20px_60px_rgba(124,58,237,0.4)]">LEGENDARY.</span>
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto mb-20 leading-tight tracking-tight px-4"
          >
            Experience the definitive enterprise core. AutoPay-OS V2 combines hyper-precision with predictive intelligence for the world&apos;s most ambitious teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 perspective-2000"
          >
            <Link
              href="/register"
              className="group relative px-14 py-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[2.5rem] font-black text-xl flex items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-indigo-600/20"
              style={{
                transform: `translateX(${mousePos.x * 10}px) translateY(${mousePos.y * 10}px)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-2xl" />
              Launch Enterprise
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>

            <a
              href="#faq"
              className="group px-14 py-8 glass-card-premium rounded-[2.5rem] font-black text-xl flex items-center gap-4 hover:bg-white dark:hover:bg-slate-800 transition-all border-slate-200/60 shadow-xl"
              style={{
                transform: `translateX(${mousePos.x * -10}px) translateY(${mousePos.y * -10}px)`
              }}
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:rotate-[360deg] transition-transform duration-700">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              Live Demo
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-8 h-auto">
            {/* Main Feature - Large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="md:col-span-12 lg:col-span-8 p-16 hyper-glass rounded-[4rem] group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10 max-w-2xl">
                <div className="w-16 h-16 bg-primary/20 rounded-3xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500">
                  <Brain className="w-8 h-8 text-primary font-bold" />
                </div>
                <h3 className="text-5xl md:text-7xl font-black mb-8 font-display tracking-tighter">AI TALENT <br /><span className="text-primary italic">INTELLIGENCE.</span></h3>
                <p className="text-2xl text-slate-500 font-medium leading-relaxed mb-12">
                  Our proprietary neural core analyzes attrition patterns and predicts compliance risks before they emerge. Stay ahead of the global workforce curve with sub-second insights.
                </p>
                <div className="flex items-center gap-6">
                  <div className="px-6 py-2 rounded-full border border-primary text-[10px] font-black uppercase tracking-widest text-primary">Neural Core V2</div>
                  <div className="px-6 py-2 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">Enterprise Ready</div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Feature 1 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-6 lg:col-span-4 p-12 bg-slate-950 rounded-[4rem] text-white overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Globe className="w-12 h-12 text-indigo-400 mb-8" />
              <h4 className="text-4xl font-black mb-6 font-display">GLOBAL <br />TENANCY.</h4>
              <p className="font-medium text-slate-400 text-lg">Multi-currency, multi-jurisdiction logic for the hyper-scaled enterprise.</p>
            </motion.div>

            {/* Sidebar Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-6 lg:col-span-4 p-12 glass-card-premium rounded-[4rem] border-primary/20 relative group overflow-hidden"
            >
              <Zap className="w-12 h-12 text-primary mb-8" />
              <h4 className="text-4xl font-black mb-6 font-display text-slate-900 dark:text-white">PREDICTIVE <br /><span className="text-primary italic">CASH FLOW.</span></h4>
              <p className="font-medium text-slate-500 dark:text-slate-400 text-lg">Real-time liability forecasting with 99.8% precision across all regions.</p>
            </motion.div>

            {/* Bottom Large Feature */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-12 lg:col-span-8 p-16 hyper-glass rounded-[4rem] flex flex-col md:flex-row items-center gap-16"
            >
              <div className="flex-1">
                <ShieldCheck className="w-16 h-16 text-emerald-500 mb-8" />
                <h3 className="text-5xl font-black mb-6 font-display tracking-tighter">IRONCLAD <br />GOVERNANCE.</h3>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  Military-grade encryption for PII and automated statutory filings. We handle the complexity, you keep the control.
                </p>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-primary/5 border border-primary/10 rounded-3xl animate-pulse" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-40 bg-white relative overflow-hidden mesh-gradient-premium">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-28">
            <div className="max-w-2xl">
              <div className="w-20 h-2 bg-indigo-600 rounded-full mb-8" />
              <h2 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-[0.9]">Trusted by the <br /> 1% of Global Tech.</h2>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
                ))}
                <span className="ml-4 font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Verified Excellence</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="glass-card-premium p-10 rounded-[2.5rem] flex items-center gap-6 shadow-2xl">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">JD</div>
                <div>
                  <div className="font-black text-2xl text-slate-900 dark:text-white">John Doe</div>
                  <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">HR Director, TechCorp</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="p-16 bg-slate-900 rounded-[4rem] text-white relative group overflow-hidden shadow-2xl perspective-1000"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl" />
              <MessageSquare className="w-16 h-16 text-indigo-500 mb-12" />
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
                  className="p-10 glass-card-premium rounded-[3rem] group hover:bg-slate-950 transition-all duration-500 border-none shadow-xl"
                >
                  <div className="text-4xl font-black text-slate-900 dark:text-white group-hover:text-white mb-2 transition-colors">{stat.label}</div>
                  <div className="text-[10px] font-black text-indigo-600 group-hover:text-indigo-400 uppercase tracking-[0.2em] transition-colors">{stat.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Engine Section */}
      <section id="ai" className="py-40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-600/5 rounded-full blur-[160px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="hyper-glass dark:bg-slate-900/60 rounded-[4rem] p-12 md:p-24 border border-slate-200/50 dark:border-white/5 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-8">
                  <Brain className="w-4 h-4" />
                  PROPRIETARY AI CORE
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                  THE BRAIN BEHIND <br />
                  <span className="text-gradient-extreme">THE BUSINESS.</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 font-bold mb-12 leading-relaxed">
                  Our neural network processes millions of data points to predict compliance shifts, attrition trends, and budget variances before they impact your bottom line.
                </p>
                <div className="space-y-6">
                  {[
                    "Self-evolving compliance engine",
                    "Predictive attrition modeling",
                    "Automated tax optimization routes"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 text-lg font-black"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <Check className="text-white w-4 h-4" />
                      </div>
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="relative z-10 glass-card-premium dark:bg-slate-900/80 rounded-[3rem] p-8 shadow-2xl border-white/20 animate-float-3d">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20" />
                  <div className="p-6 bg-slate-900 rounded-[2rem] mb-6">
                    <div className="h-2 w-24 bg-indigo-500 rounded-full mb-4" />
                    <div className="h-2 w-48 bg-slate-800 rounded-full mb-8" />
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-20 bg-slate-800/50 rounded-xl" />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Processing real-time insights...</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-40 bg-slate-50 dark:bg-slate-900/20 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-black mb-12 tracking-tighter"
          >
            SELECT YOUR <br />
            <span className="text-indigo-600">INTELOCITY.</span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20 text-left">
            {[
              { name: "Starter", price: "₹2,499", desc: "For teams up to 50", features: ["Basic AI Core", "Compliant Payslips", "Mobile ESS"], color: "slate" },
              { name: "Enterprise", price: "₹9,999", desc: "For global operations", features: ["Full Neural Suite", "Multi-Jurisdiction", "White-glove Support"], color: "indigo", highlight: true },
              { name: "Custom", price: "Quote", desc: "Bespoke engineering", features: ["Dedicated Instance", "API Priority", "Custom Integrations"], color: "slate" }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-12 rounded-[3.5rem] flex flex-col justify-between transition-all hover:scale-105 ${plan.highlight ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-600/40 z-10' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-pulse">
                    Most Power
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">{plan.name}</h3>
                  <div className="text-6xl font-black mb-6 tracking-tighter">{plan.price}</div>
                  <p className={`font-bold mb-10 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                  <div className="space-y-6 mb-12">
                    {plan.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-4 font-bold uppercase text-[10px] tracking-[0.2em]">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
                <Link
                  href="/register"
                  className={`block w-full py-6 rounded-3xl font-black text-center text-lg transition-all active:scale-95 ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800 shadow-xl'}`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-40 relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black tracking-tighter mb-8"
            >
              COMMON <br />
              <span className="text-indigo-600 italic">QUESTIONS.</span>
            </motion.h2>
          </div>

          <div className="space-y-6">
            {[
              { q: "How secure is my payroll data?", a: "We use bank-grade AES-256 encryption. Your data is stored in isolated PostgreSQL instances with SOC2 compliance." },
              { q: "Do you support all regions?", a: "AutoPay-OS handles complex tax logic for India, UAE, US, and UK natively." },
              { q: "Can employees access their own data?", a: "Yes. Every employee gets a dedicated portal and a WhatsApp interface for payslips and attendance." }
            ].map((item, i) => (
              <div key={i} className="glass-card-premium dark:bg-slate-900/60 rounded-[3rem] border-slate-200/50 dark:border-white/5 overflow-hidden shadow-xl">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-12 py-10 flex items-center justify-between text-left group"
                >
                  <span className="text-2xl font-black group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.q}</span>
                  {activeFaq === i ? <Minus className="w-6 h-6 text-indigo-600" /> : <Plus className="w-6 h-6 text-slate-400" />}
                </button>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-12 pb-12 text-slate-600 dark:text-slate-400 font-bold leading-relaxed text-lg"
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
      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-premium opacity-20" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter text-white mb-16 leading-[0.85]">
            READY FOR THE <br />
            <span className="text-indigo-500 italic">FUTURE?</span>
          </h2>
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
              className="px-16 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}
              JOIN NOW
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-50 dark:bg-[#010413] px-6 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              AutoPay-<span className="text-indigo-600">OS</span>
            </span>
          </div>
          <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>© 2026 AutoPay-OS Global Ltd.</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
