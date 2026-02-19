"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = "", showText = true, size = 'md' }: LogoProps) {
    const sizeClasses = {
        sm: { icon: 'w-6 h-6', text: 'text-lg' },
        md: { icon: 'w-8 h-8', text: 'text-xl' },
        lg: { icon: 'w-10 h-10', text: 'text-2xl' },
        xl: { icon: 'w-16 h-16', text: 'text-4xl' },
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`relative ${sizeClasses[size].icon}`}>
                <motion.svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Background Shape */}
                    <rect width="40" height="40" rx="12" fill="url(#logo-gradient)" />

                    {/* Stylized 'P' / Wallet / Growth Path */}
                    <motion.path
                        d="M12 10V30"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                    <motion.path
                        d="M12 10H22C26.4183 10 30 13.5817 30 18C30 22.4183 26.4183 26 22 26H12"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    />

                    {/* Growth Indicator Dots */}
                    <motion.circle
                        cx="22"
                        cy="18"
                        r="2.5"
                        fill="white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                    />

                    <defs>
                        <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6366f1" />
                            <stop offset="1" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>
                </motion.svg>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full -z-10" />
            </div>

            {showText && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`font-black tracking-tighter ${sizeClasses[size].text}`}
                >
                    <span className="text-slate-900 dark:text-white">PAY</span>
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ROLL</span>
                </motion.div>
            )}
        </div>
    );
}
