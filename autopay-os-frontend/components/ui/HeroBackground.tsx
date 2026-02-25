'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function HeroBackground() {
    const { scrollY } = useScroll();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMove = (e: MouseEvent) => {
            if (window.innerWidth < 768) return;
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2
            });
        };
        window.addEventListener('mousemove', handleMove);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const springX = useSpring(mousePos.x, { stiffness: 40, damping: 40 });
    const springY = useSpring(mousePos.y, { stiffness: 40, damping: 40 });

    const meshOpacity = useTransform(scrollY, [0, 800], [0.8, 0]);
    const scrollParallax = useTransform(scrollY, [0, 1000], [0, 200]);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Liquid Mesh Base */}
            <motion.div
                style={{ opacity: meshOpacity, y: scrollParallax }}
                className="absolute inset-0 bg-transparent"
            >
                {/* Dynamic Primary Blob */}
                <motion.div
                    animate={{
                        x: [0, 50, -50, 0],
                        y: [0, -50, 50, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        translateX: useTransform(springX, [-1, 1], [-100, 100]),
                        translateY: useTransform(springY, [-1, 1], [-100, 100]),
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[140px]"
                />

                {/* Dynamic Secondary Blob */}
                <motion.div
                    animate={{
                        x: [0, -60, 60, 0],
                        y: [0, 60, -60, 0],
                        scale: [1.1, 0.9, 1.1, 1.1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        translateX: useTransform(springX, [-1, 1], [100, -100]),
                        translateY: useTransform(springY, [-1, 1], [100, -100]),
                    }}
                    className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-secondary/15 rounded-full blur-[120px]"
                />

                {/* Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] radial-gradient-center opacity-40 dark:opacity-20" />
            </motion.div>

            {/* Micro-Particles */}
            {!isMobile && [...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: 0
                    }}
                    animate={{
                        y: [null, "-30%"],
                        opacity: [0, 0.4, 0],
                    }}
                    transition={{
                        duration: Math.random() * 15 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                    className="absolute w-1 h-1 bg-primary/40 rounded-full blur-[1px]"
                />
            ))}
        </div>
    );
}

