'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  ShieldCheck,
  Globe,
  ChevronRight,
  Play,
  Star,
  ArrowRight,
  Check,
  Menu,
  X,
  Plus,
  Minus,
  Building2,
  Users,
  CreditCard,
  PieChart,
  Lock
} from 'lucide-react';

import HeroBackground from '@/components/ui/HeroBackground';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 font-sans overflow-x-hidden"
    >
      <HeroBackground />

      {/* Modern SaaS Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto backdrop-blur-md bg-[#020617]/50 border border-white/5 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AutoPay-OS</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#customers" className="hover:text-white transition-colors">Customers</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-white text-slate-900 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* SaaS Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AutoPay-OS 2.0 is now live
            <ChevronRight className="w-3 h-3" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-[5.5rem] font-bold tracking-tight leading-[1.05] mb-8 font-display"
          >
            The payroll platform <br className="hidden md:block" />
            <span className="text-slate-400">built for modern teams.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Automate compliance, forecast cash flow, and manage global talent from a single, intelligent workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 border border-white/10">
              <Play className="w-5 h-5 fill-current opacity-70" />
              Book a Demo
            </a>
          </motion.div>

          {/* Hero Product Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", damping: 20 }}
            style={{
              rotateX: mousePos.y * -5,
              rotateY: mousePos.x * 5,
              transformStyle: "preserve-3d"
            }}
            className="w-full max-w-6xl mx-auto perspective-2000 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent z-10 bottom-0 top-[60%]" />
            <div className="rounded-t-2xl border-t border-x border-white/10 bg-[#0B1120] p-4 shadow-2xl overflow-hidden relative" style={{ height: '500px' }}>
              {/* Fake UI Chrome */}
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                <div className="w-3 h-3 rounded-full bg-slate-700/80" />
                <div className="w-64 h-6 rounded-md bg-white/5 ml-4 flex items-center px-4">
                  <Lock className="w-3 h-3 text-slate-500 mr-2" />
                  <span className="text-[10px] text-slate-500">app.autopay.ai</span>
                </div>
              </div>

              {/* Fake Dashboard View */}
              <div className="grid grid-cols-12 gap-6 h-full">
                {/* Sidebar */}
                <div className="col-span-3 border-r border-white/5 pr-4 flex flex-col gap-2">
                  <div className="h-8 rounded-lg bg-primary/20 border border-primary/30 w-full mb-4 flex items-center px-3 gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary" />
                    <div className="h-3 bg-white/40 rounded-full w-1/2" />
                  </div>
                  <div className="h-6 rounded-lg bg-white/5 w-3/4" />
                  <div className="h-6 rounded-lg bg-white/5 w-5/6" />
                  <div className="h-6 rounded-lg bg-white/5 w-2/3" />
                  <div className="h-6 rounded-lg bg-white/5 w-4/5 mt-8" />
                  <div className="h-6 rounded-lg bg-white/5 w-full" />
                </div>
                {/* Main Content */}
                <div className="col-span-9 flex flex-col gap-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                      <div className="w-20 h-3 bg-slate-600 rounded-full" />
                      <div className="w-32 h-6 bg-white rounded-full" />
                    </div>
                    <div className="h-24 rounded-xl bg-primary/10 border border-primary/20 p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-20"><Zap className="w-12 h-12 text-primary" /></div>
                      <div className="w-20 h-3 bg-primary/50 rounded-full relative z-10" />
                      <div className="w-32 h-6 bg-primary rounded-full relative z-10" />
                    </div>
                    <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                      <div className="w-20 h-3 bg-slate-600 rounded-full" />
                      <div className="w-32 h-6 bg-white rounded-full" />
                    </div>
                  </div>
                  {/* Chart Area */}
                  <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-6 relative overflow-hidden">
                    <div className="w-32 h-4 bg-slate-600 rounded-full mb-8" />
                    {/* Fake Chart Lines */}
                    <svg className="absolute inset-x-0 bottom-0 w-full h-48" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,100 L0,50 Q25,20 50,60 T100,30 L100,100 Z" fill="url(#grad)" opacity="0.3" />
                      <path d="M0,50 Q25,20 50,60 T100,30" fill="none" stroke="#7C3AED" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] -z-10 rounded-full" />
          </motion.div>

        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="pb-32 pt-10 border-b border-white/5 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-widest">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-opacity duration-700">
            <div className="flex items-center gap-2 font-black text-2xl text-slate-300"><Building2 className="w-6 h-6" /> ACME Corp</div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-300"><Globe className="w-6 h-6" /> VANGUARD</div>
            <div className="flex items-center gap-2 font-black text-2xl font-serif italic text-slate-300">Pinnacle</div>
            <div className="flex items-center gap-2 font-black text-xl tracking-widest uppercase text-slate-300"><ShieldCheck className="w-5 h-5" /> SENTINEL</div>
            <div className="flex items-center gap-2 font-black text-2xl text-slate-300"><Zap className="w-6 h-6" /> Nexus</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for scale.<br />Designed for speed.</h2>
            <p className="text-xl text-slate-400 max-w-2xl">Everything you need to manage modern workforce compensation, without the antiquated spreadsheets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Real Feature Card 1 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] transition-colors group flex flex-col">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Compliance</h3>
              <p className="text-slate-400 leading-relaxed mb-8">Automatically calculate taxes, benefits, and deductions across 150+ countries with our localized engines.</p>

              <div className="mt-auto h-40 rounded-xl bg-[#020617] border border-white/5 p-4 relative overflow-hidden group-hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3 text-xs w-full text-slate-500">
                  <span>Region</span>
                  <span>Status</span>
                </div>
                <div className="flex items-center justify-between mb-2 p-2 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-xs font-semibold">USA (Federal)</span>
                  </div>
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" /> <span className="text-xs font-semibold">UK (HMRC)</span>
                  </div>
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Real Feature Card 2 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] transition-colors group flex flex-col">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Dispersal</h3>
              <p className="text-slate-400 leading-relaxed mb-8">Execute payroll runs in milliseconds. Connect your corporate treasury for 1-click global payouts.</p>

              <div className="mt-auto h-40 rounded-xl bg-[#020617] border border-white/5 p-4 relative overflow-hidden flex flex-col items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                <div className="text-3xl font-bold text-white mb-1 tracking-tighter">$2,450,000</div>
                <div className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-widest">Total AutoPay-OS Run</div>
                <button className="px-6 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-xs font-bold rounded-lg w-full flex justify-center items-center gap-2 transition-all">
                  Approve Run <Check className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Real Feature Card 3 */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.07] transition-colors group flex flex-col">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Forecasting</h3>
              <p className="text-slate-400 leading-relaxed mb-8">Predictive models map your runway, attrition costs, and compensation burn months in advance.</p>

              <div className="mt-auto h-40 rounded-xl bg-[#020617] border border-white/5 p-4 relative overflow-hidden group-hover:border-pink-500/30 transition-colors flex items-end gap-2">
                {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className={`w-full rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-pink-500 group-hover:bg-pink-400' : 'bg-slate-800'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">From complex to complete.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-white/10" />

            {[
              { step: "1", title: "Connect systems", desc: "Integrate your HRIS and treasury with a single API key." },
              { step: "2", title: "Set logic", desc: "Define rules, statutory requirements, and approval chains." },
              { step: "3", title: "Auto-pilot", desc: "Runs execute automatically with precision auditing." }
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="w-14 h-14 bg-[#020617] border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 font-bold text-primary shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6" id="customers">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">Don't just take our word for it.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "It replaced three different legacy systems within our first month. The automation alone saves us 40 hours per payroll cycle.", author: "Sarah Jenkins", role: "VP People", co: "TechCorp" },
              { quote: "The forecasting accuracy is unparalleled. We finally have a real-time view into our largest expense line.", author: "Marcus Thorne", role: "CFO", co: "Global Freight" },
              { quote: "We scaled from 50 to 500 employees across 4 countries, and AutoPay-OS handled the complexity without a hiccup.", author: "Elena Rostova", role: "Founder", co: "Innovate AI" }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-between">
                <div className="flex items-center gap-1 mb-6 opacity-80">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
                <p className="text-lg font-medium leading-relaxed mb-10 text-slate-300">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center font-bold text-sm text-slate-300">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.author}</div>
                    <div className="text-sm text-slate-500">{t.role}, {t.co}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Toggle Section */}
      <section id="pricing" className="py-32 px-6 border-t border-white/5 bg-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-slate-400">Start free, upgrade as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <div className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Growth</h3>
              <p className="text-slate-400 mb-6 text-sm">Perfect for startups and scaling teams.</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-bold">$12</span>
                <span className="text-slate-500 font-medium">/user/mo</span>
              </div>
              <Link href="/register" className="w-full block text-center py-3 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-semibold mb-8 transition-colors">
                Start 14-day free trial
              </Link>
              <div className="space-y-4 flex-1">
                {['Up to 100 employees', 'Standard compliance rules', 'Domestic direct deposits', 'Email support', 'Basic reporting'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <Check className="w-4 h-4 text-slate-500" /> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="p-10 rounded-3xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors relative flex flex-col">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-400 mb-6 text-sm">Advanced controls for global organizations.</p>
              <div className="flex items-baseline gap-2 mb-8 h-[60px] items-end pb-1">
                <span className="text-4xl font-bold text-white">Custom Pricing</span>
              </div>
              <a href="#demo" className="w-full block text-center py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold mb-8 transition-colors shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                Contact Sales
              </a>
              <div className="space-y-4 flex-1">
                {['Unlimited employees', '150+ country compliance', 'Global treasury payout', '24/7 dedicated support', 'Custom AI forecasting', 'SSO & Advanced Role Access'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <Check className="w-4 h-4 text-primary" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 border-y border-white/5" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Ready to upgrade your payroll?</h2>
          <p className="text-xl text-slate-400 mb-10">Join the thousands of forward-thinking companies running on AutoPay-OS.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
              Get started for free
            </Link>
            <a href="#demo" className="w-full sm:w-auto px-6 py-3 bg-transparent text-white border border-white/20 rounded-lg font-semibold hover:bg-white/5 transition-colors">
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

      {/* 4-Column SaaS Footer */}
      <footer className="pt-20 pb-10 px-6 bg-[#020617]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">AutoPay-OS</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm text-sm">The intelligent payroll platform designed to scale with your business natively, anywhere in the world.</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors text-sm font-bold">X</div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors text-sm font-bold">in</div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors text-sm font-bold">gh</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Processing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>© 2026 AutoPay-OS Inc. All rights reserved.</div>
          <div className="flex items-center gap-2 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
