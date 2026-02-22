import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lanyard from './Lanyard';
import { resumeData } from '../data/resumeData';

const Hero = () => {
    const [hasInteracted, setHasInteracted] = React.useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-20">

            {/* Name as Main Background Layer */}
            <motion.div
                initial="hidden"
                animate="visible"
                style={{ y: yText, opacity: opacityText }}
                className="absolute inset-x-0 top-[22%] flex flex-col items-center justify-center pointer-events-none select-none z-0 px-4"
            >
                <div className="relative">
                    <h1 className="text-[9vw] md:text-[10vw] font-black leading-[0.8] tracking-tighter font-display text-center">
                        <div className="relative flex flex-col">
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 0.3, y: 0 }}
                                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent block"
                            >
                                {resumeData.hero.title1}
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 0.3, y: 0 }}
                                transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="bg-gradient-to-b from-gray-500 to-gray-900 bg-clip-text text-transparent block"
                            >
                                {resumeData.hero.title2}
                            </motion.span>
                        </div>
                    </h1>
                </div>
            </motion.div>

            <div className="z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col items-center justify-center h-full relative">

                {/* 3D Lanyard - Layered ON TOP of text */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full pointer-events-auto">
                        <Lanyard
                            position={[0, 0, 20]}
                            gravity={[0, -40, 0]}
                            cameraDistance={19}
                            onInteract={() => setHasInteracted(true)}
                        />
                    </div>
                </div>

                {/* Interaction Hint */}
                <AnimatePresence>
                    {!hasInteracted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, delay: 2 }}
                            className="absolute bottom-2 flex flex-col items-center gap-2 z-20 pointer-events-none"
                        >
                            <span className="text-white/50 text-sm font-medium tracking-widest uppercase">
                                Drag to interact
                            </span>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-px h-12 bg-gradient-to-b from-[var(--accent-color)] to-transparent"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Hero;
