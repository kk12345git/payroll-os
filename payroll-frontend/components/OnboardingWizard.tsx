'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ChevronLeft, Play } from 'lucide-react';

interface Step {
    title: string;
    description: string;
    actionLabel: string;
}

const STEPS: Step[] = [
    {
        title: "Welcome to AutoPay-OS",
        description: "We've enabled 'Simple Mode' for you. This hides enterprise jargon and focuses on what matters: paying your team correctly and on time.",
        actionLabel: "Let's Get Started"
    },
    {
        title: "Step 1: Set Up Team",
        description: "Add your employees and their basic monthly pay. We'll handle the complex statutory calculations (PF/ESI) automatically.",
        actionLabel: "Next Step"
    },
    {
        title: "Step 2: Review Attendance",
        description: "Quickly mark leaves or overrides for the month. Our AI will flag any anomalies before you process pay.",
        actionLabel: "Next Step"
    },
    {
        title: "Step 3: Run Payroll",
        description: "With one click, we calculate the full batch. You can download all payslips immediately and notify team via WhatsApp.",
        actionLabel: "Got it!"
    }
];

export const OnboardingWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-indigo-100"
                >
                    {/* Header Image/Icon */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center relative overflow-hidden">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 right-0 p-10 opacity-10"
                        >
                            <Sparkles className="w-32 h-32 text-white" />
                        </motion.div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4">
                                <Play className="w-8 h-8 text-white fill-current" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Quick Start Guide</h2>
                            <div className="flex gap-1 mt-4">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-10">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-center"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{STEPS[currentStep].title}</h3>
                            <p className="text-slate-600 leading-relaxed font-medium mb-8">
                                {STEPS[currentStep].description}
                            </p>
                        </motion.div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                                className={`flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                            >
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>

                            <button
                                onClick={() => {
                                    if (currentStep < STEPS.length - 1) {
                                        setCurrentStep(prev => prev + 1);
                                    } else {
                                        setIsVisible(false);
                                    }
                                }}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                {STEPS[currentStep].actionLabel}
                                {currentStep < STEPS.length - 1 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
