import React, { useRef, useState, Suspense } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Code, Cpu, TrendingUp, Zap, ArrowUpRight, Globe, Shield, Activity } from 'lucide-react';
import { resumeData } from '../data/resumeData';

// ParticleImage uses Three.js TextGeometry — lazy load it so the About section
// text and layout paint immediately without waiting for the 3D canvas
const ParticleImage = React.lazy(() => import('./ParticleImage'));

// --- Components ---

const BentoCard = ({ children, className = "", delay = 0, symbol = null }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            /* Standard card style with subtle white border */
            className={`relative overflow-hidden rounded-3xl bg-neutral-900/50 p-6 border border-white/10 ${className} group`}
        >
            {/* Particle Effect Layer */}
            {symbol && (
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <Suspense fallback={null}>
                        <ParticleImage symbol={symbol} isHovered={isHovered} />
                    </Suspense>
                </div>
            )}

            <div className="relative z-10 h-full flex flex-col pointer-events-none w-full">
                {children}
            </div>
        </motion.div>
    );
};

const About = () => {
    const iconMap = { Code, Cpu, TrendingUp, Zap, Globe, Shield, Activity };
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

    return (
        <section id="about" ref={containerRef} className="py-20 md:py-32 px-4 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent-color)]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2" />



            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-20 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-6 justify-center md:justify-start"
                    >
                        <span className="h-px w-12 bg-[var(--accent-color)]" />
                        <span className="text-[var(--accent-color)] font-mono text-sm tracking-widest uppercase">
                            {resumeData.about.title}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold font-display text-white leading-tight"
                    >
                        {resumeData.about.heading} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-emerald-600">
                            {resumeData.about.headingHighlight}
                        </span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-7 h-full">
                        <BentoCard className="h-full flex flex-col min-h-[460px]" delay={0.1} symbol={resumeData.about.symbol}>
                            <div className="h-full flex flex-col justify-center space-y-5 text-lg text-gray-300 leading-relaxed max-w-2xl px-2">
                                {resumeData.about.description.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </BentoCard>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                        {resumeData.about.features.map((feature, index) => (
                            <BentoCard key={index} className="flex flex-col justify-between min-h-[220px]" delay={0.3 + (index * 0.1)} symbol={feature.symbol}>
                                <div>
                                    <div className="mb-4 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[var(--accent-color)] group-hover:text-black">
                                        {React.createElement(iconMap[feature.icon] || Code, { size: 24 })}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--accent-color)] transition-colors">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </BentoCard>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
