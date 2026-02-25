'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="group relative h-full glass-card-premium dark:bg-slate-900/60 p-10 rounded-[3rem] border border-slate-200/50 dark:border-white/5 transition-colors hover:border-indigo-500/50 cursor-pointer overflow-hidden"
        >
            <div
                style={{ transform: "translateZ(80px)" }}
                className="relative z-10"
            >
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-600/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    {icon}
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed text-lg">
                    {description}
                </p>
            </div>

            {/* Shine / Glow trail */}
            <motion.div
                style={{
                    x: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
                    y: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]),
                }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-3xl pointer-events-none transition-opacity duration-500"
            />

            {/* 3D Depth Layer */}
            <div className="absolute inset-0 bg-slate-100/50 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3.5rem] -z-10 blur-sm pointer-events-none" />
        </motion.div>
    );
}
