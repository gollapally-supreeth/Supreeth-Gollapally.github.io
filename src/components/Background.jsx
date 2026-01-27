import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Background = () => {
    // Tracking global mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Optimized spring config - less frequent updates
    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400, mass: 2 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400, mass: 2 });

    useEffect(() => {
        let ticking = false;
        const handleMouseMove = (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    mouseX.set(e.clientX / window.innerWidth - 0.5);
                    mouseY.set(e.clientY / window.innerHeight - 0.5);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Reduced transform ranges for better performance
    const x1 = useTransform(smoothX, [-0.5, 0.5], [200, -200]);
    const y1 = useTransform(smoothY, [-0.5, 0.5], [100, -100]);

    const x2 = useTransform(smoothX, [-0.5, 0.5], [-150, 150]);
    const y2 = useTransform(smoothY, [-0.5, 0.5], [-200, 200]);

    const x3 = useTransform(smoothX, [-0.5, 0.5], [150, -150]);
    const y3 = useTransform(smoothY, [-0.5, 0.5], [200, -200]);

    return (
        <div className="fixed inset-0 w-full h-full -z-50 bg-[#030303] overflow-hidden">
            {/* Optimized Blobs - Reduced Blur & Added will-change */}
            <motion.div
                style={{ x: x1, y: y1 }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--accent-color)]/10 blur-[80px] will-change-transform"
            />

            <motion.div
                style={{ x: x2, y: y2 }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#3b82f6]/10 blur-[80px] will-change-transform"
            />

            <motion.div
                style={{ x: x3, y: y3 }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-color)]/5 blur-[60px] will-change-transform"
            />

            {/* Static Noise Overlay usually faster than animated parallax if parallax isn't crucial */}
            <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />

            {/* Solid Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/80 to-[#030303] pointer-events-none" />
        </div>
    );
};

export default Background;
