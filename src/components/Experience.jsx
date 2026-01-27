import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { resumeData } from '../data/resumeData';
import { Briefcase, GraduationCap, Calendar, Sparkles } from 'lucide-react';
import PixelCard from './PixelCard';

const Experience = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Helper to parse dates for sorting
    const parseDate = (dateString) => {
        if (!dateString) return new Date(0);
        const parts = dateString.split('–')[0].split('-')[0].trim().split(' ');
        const monthMap = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sept': 8, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const month = monthMap[parts[0]] || 0;
        const year = parseInt(parts[1]) || 0;
        return new Date(year, month);
    };

    const getYear = (dateString) => {
        if (!dateString) return '';
        const parts = dateString.split('–')[0].split('-')[0].trim().split(' ');
        return parts[1] || parts[0]; // Fallback if format differs
    };

    // Merge and sort items
    const journeyItems = [
        ...resumeData.education.map(item => ({ ...item, type: 'education' })),
        ...resumeData.experience.map(item => ({ ...item, type: 'experience' }))
    ].sort((a, b) => parseDate(b.dates) - parseDate(a.dates));

    return (
        <section id="experience" className="section min-h-screen py-20 md:py-24 relative overflow-hidden" ref={containerRef}>
            <div className="container mx-auto px-4 md:px-12 max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mb-16 md:mb-24 text-center relative"
                >
                    <h2 className="text-4xl md:text-6xl font-bold font-display">
                        My <span className="text-[var(--accent-color)]">Journey</span>
                    </h2>
                </motion.div>

                {/* Column Headers (Desktop Only) */}
                <div className="hidden md:flex justify-between items-center mb-16 relative">
                    <div className="w-1/2 pr-12 text-right">
                        <div className="inline-flex items-center gap-3 border-b-2 border-[var(--accent-color)]/20 pb-2 px-4">
                            <h3 className="text-2xl font-bold text-white tracking-wide">Education</h3>
                            <GraduationCap className="text-[var(--accent-color)]" size={24} />
                        </div>
                    </div>
                    <div className="w-1/2 pl-12 text-left">
                        <div className="inline-flex items-center gap-3 border-b-2 border-[var(--accent-color)]/20 pb-2 px-4 flex-row-reverse">
                            <h3 className="text-2xl font-bold text-white tracking-wide">Experience</h3>
                            <Briefcase className="text-[var(--accent-color)]" size={24} />
                        </div>
                    </div>

                    {/* Central Source Star (Between Text) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                        <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_10px_var(--accent-color),0_0_40px_20px_var(--accent-color)] animate-pulse">
                            <div className="absolute inset-0 bg-white rounded-full blur-[2px]" />
                        </div>
                    </div>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Central Line (Desktop) / Left Line (Mobile) */}
                    <div className="absolute left-4 md:left-1/2 -top-16 bottom-0 w-px bg-white/10 transform md:-translate-x-1/2">
                        {/* Static Glowing Energy Beam */}
                        <div
                            className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-[2px]"
                        >
                            {/* Core Beam */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white via-[var(--accent-color)] to-transparent opacity-80" />

                            {/* Glow Effect - Optimized without blur */}
                            <div className="absolute inset-0 bg-[var(--accent-color)] opacity-30" />
                        </div>
                    </div>

                    <div className="space-y-12">
                        {journeyItems.map((item, index) => {
                            const isEducation = item.type === 'education';
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`relative flex flex-col md:flex-row items-center ${isEducation ? 'md:flex-row-reverse' : ''
                                        }`}
                                >
                                    {/* Spacer for the other side */}
                                    <div className="hidden md:block flex-1" />

                                    {/* Central Year/Icon Marker */}
                                    <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center z-20">
                                        <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-[var(--accent-color)] shadow-[0_0_15px_rgba(199,251,56,0.2)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {isEducation ? (
                                                <GraduationCap size={20} className="text-[var(--accent-color)]" />
                                            ) : (
                                                <Briefcase size={20} className="text-[var(--accent-color)]" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEducation ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'
                                        }`}>
                                        <div className="group relative perspective-1000">
                                            {/* Date Tag - Mobile Only */}
                                            <div className={`mb-3 flex md:hidden items-center gap-2 text-[var(--accent-color)]/80 text-sm font-mono`}>
                                                <Calendar size={14} />
                                                <span>{item.dates}</span>
                                            </div>

                                            <div className="h-full w-full">
                                                <PixelCard
                                                    variant="default"
                                                    gap={20} // Optimized: Increased from 12 to 20 to reduce canvas draw calls by ~60%
                                                    speed={25}
                                                    colors="#c7fb38,#1a1a1a,#FFFFFF"
                                                    className="rounded-2xl border border-white/10 bg-[#0a0a0a] h-full w-full"
                                                >
                                                    {/* Inner Content Container */}
                                                    <div className="relative z-10 h-full p-6 md:p-8">

                                                        {/* Desktop Date Badge */}
                                                        <div className={`hidden md:flex absolute top-8 ${isEducation ? 'left-8 flex-row' : 'right-8 flex-row-reverse'
                                                            } items-center gap-2 text-xs font-mono tracking-wide text-[var(--accent-color)] opacity-70 group-hover:opacity-100 transition-opacity`}>
                                                            <Calendar size={12} />
                                                            <span>
                                                                {isEducation
                                                                    ? item.dates.replace(/[a-zA-Z]+\s/g, '') // Removes Month names for Education (e.g. "Sept 2021 - May 2024" -> "2021 - 2024")
                                                                    : item.dates // Keeps full "Month Year" for Experience
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col gap-2 mb-4 md:mt-8">
                                                            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[var(--accent-color)] transition-colors font-display tracking-tight">
                                                                {isEducation ? item.degree : item.role}
                                                            </h3>
                                                            <h4 className="text-base md:text-lg text-gray-400 font-light tracking-wide group-hover:text-gray-200 transition-colors">
                                                                {isEducation ? item.institution : item.company}
                                                            </h4>
                                                        </div>

                                                        {isEducation ? (
                                                            <div className="mt-2">
                                                                {/* GPA Removed as per request */}
                                                            </div>
                                                        ) : (
                                                            <ul className={`space-y-3 pt-6 border-t border-white/5 ${isEducation ? 'md:text-right' : 'md:text-left'
                                                                }`}>
                                                                {item.points.map((point, i) => (
                                                                    <li key={i} className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                                                                        {point}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </PixelCard>
                                            </div>

                                            {/* Connector Line (Desktop) */}
                                            <div className={`hidden md:block absolute top-12 w-16 h-[2px] bg-gradient-to-r from-[var(--accent-color)]/50 to-transparent ${isEducation ? '-right-16 left-auto origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100' : '-left-16 right-auto origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100'
                                                }`} />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
