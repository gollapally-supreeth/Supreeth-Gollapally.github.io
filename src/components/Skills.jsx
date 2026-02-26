import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { resumeData } from '../data/resumeData';
import { Layout, Code, Terminal, Cpu, Zap, Database, Shield, Layers } from 'lucide-react';

const iconMap = { Layout, Code, Terminal, Cpu, Zap, Database, Shield, Layers };
import SkillUniverse from './SkillUniverse';



const TechMarquee = ({ items }) => {
    return (
        <div className="w-full overflow-hidden py-10 mb-20 relative flex selection:bg-transparent">
            {/* Soft fade masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: [0, "-50%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 80, // Slower speed
                    ease: "linear"
                }}
            >
                {/* Duplicate list 8 times to ensure no gaps and "more" density as requested */}
                {[...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items].map((tech, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        {iconMap[tech.icon] && React.createElement(iconMap[tech.icon], { size: 28, className: "text-gray-400 group-hover:text-[var(--accent-color)] transition-colors duration-300" })}
                        <span className="text-lg font-bold font-display tracking-wide text-gray-300 group-hover:text-white transition-colors duration-300">{tech.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const Skills = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax background text
    const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section id="skills" ref={containerRef} className="py-20 md:py-20 relative overflow-hidden">



            {/* Header + Marquee — constrained */}
            <div className="container mx-auto px-4 md:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
                        Technical <span className="text-[var(--accent-color)]">Skill set Graph</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        A comprehensive suite of tools and technologies I use to build scalable, high-performance solutions.
                        <span className="text-white/80 font-medium">
                            {' '}Visualized as a Graph where <span className="text-[var(--accent-color)] font-bold">Proximity indicates Mastery.</span> The closer a skill is to its center, the higher my proficiency.
                        </span>
                    </p>
                </motion.div>

                {/* Marquee Section */}
                {resumeData.skills?.marquee && (
                    <TechMarquee items={resumeData.skills.marquee} />
                )}
            </div>

            {/* Skill Universe Graph — full viewport width */}
            {resumeData.skills && (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full relative z-10"
                >
                    <SkillUniverse skillsData={resumeData.skills} />
                </motion.div>
            )}
        </section>
    );
};

export default Skills;
