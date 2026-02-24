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

    const springX = useSpring(mousePos.x, { stiffness: 50, damping: 30 });
    const springY = useSpring(mousePos.y, { stiffness: 50, damping: 30 });

    const gridRotateX = useTransform(springY, [-1, 1], [isMobile ? 0 : 20, isMobile ? 0 : -20]);
    const gridRotateY = useTransform(springX, [-1, 1], [isMobile ? 0 : -20, isMobile ? 0 : 20]);
    const gridOpacity = useTransform(scrollY, [0, 500], [0.5, 0]);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none perspective-2000">
            {/* Animated Grid */}
            <motion.div
                style={{
                    rotateX: gridRotateX,
                    rotateY: gridRotateY,
                    opacity: gridOpacity,
                    backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: isMobile ? '40px 40px' : '80px 80px',
                    maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
                }}
                className="absolute inset-[-100%] text-indigo-500/10 dark:text-indigo-400/5 [transform-style:preserve-3d]"
            />

            {/* Floating Particles - Reduced for Mobile */}
            {[...Array(isMobile ? 8 : 20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        z: Math.random() * 500,
                        opacity: 0
                    }}
                    animate={{
                        y: [null, "-20%"],
                        opacity: [0, 0.3, 0],
                        transition: {
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                    className="absolute w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full blur-[1px]"
                />
            ))}

            {/* Glowing Orbs - Static on Mobile for performance */}
            <motion.div
                animate={isMobile ? {} : {
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: springX.get() * 50,
                    y: springY.get() * 50
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/20 rounded-full blur-[80px] md:blur-[120px]"
            />
            <motion.div
                animate={isMobile ? {} : {
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.15, 0.1],
                    x: springX.get() * -50,
                    y: springY.get() * -50
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-pink-500/10 rounded-full blur-[60px] md:blur-[100px]"
            />
        </div>
    );
}

