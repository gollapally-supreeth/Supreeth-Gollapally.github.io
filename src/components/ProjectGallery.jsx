import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ArrowUpRight, ArrowRight } from 'lucide-react';
import { resumeData } from '../data/resumeData';

// Constants
const CARD_WIDTH = 500; // Smaller card width
const CARD_GAP = 32;

const ProjectGallery = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section id="projects" ref={targetRef} className="relative md:h-[300vh] bg-[#050505] py-20 md:py-0">
            {/* Desktop: Horizontal Scroll */}
            <div className="hidden md:flex sticky top-0 h-screen flex-col justify-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-8 px-8 md:px-24 items-center h-full will-change-transform">
                    {/* Title Section */}
                    <div className="flex-shrink-0 w-[500px] text-left px-4">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-px w-12 bg-[var(--accent-color)]" />
                            <span className="text-[var(--accent-color)] font-mono text-sm tracking-widest uppercase">
                                My Works
                            </span>
                        </div>
                        <h2 className="text-7xl font-bold font-display text-white leading-tight mb-8">
                            Selected <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-emerald-600">
                                Projects
                            </span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-md leading-relaxed">
                            A showcase of technical expertise and creative solutions. Each project represents a unique challenge and solution.
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 font-mono animate-pulse">
                            <span>SCROLL TO EXPLORE</span>
                            <ArrowRight size={16} />
                        </div>
                    </div>

                    {/* Project Cards */}
                    {resumeData.projects.map((project, index) => (
                        <GalleryItem key={index} project={project} index={index} />
                    ))}

                    {/* View All / Github Card */}
                    <div className="flex-shrink-0 w-[400px] h-[60vh] flex items-center justify-center flex-col gap-6 border border-white/5 rounded-[2rem] bg-white/5">
                        <div className="p-4 rounded-full bg-white/10 text-white">
                            <Github size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">More on GitHub</h3>
                            <p className="text-gray-400 mb-6 px-8">Check out my other experiments and contributions.</p>
                            <a
                                href={`https://github.com/${resumeData.personalInfo.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent-color)] text-white rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300"
                            >
                                Visit Profile <ArrowUpRight size={18} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile: Vertical Stack */}
            <div className="md:hidden flex flex-col gap-12 px-4">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-12 bg-[var(--accent-color)]" />
                        <span className="text-[var(--accent-color)] font-mono text-sm tracking-widest uppercase">
                            My Works
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold font-display text-white leading-tight mb-4">
                        Selected <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-color)] to-emerald-600">
                            Projects
                        </span>
                    </h2>
                </div>

                {resumeData.projects.map((project, index) => (
                    <GalleryItem key={index} project={project} index={index} isMobile={true} />
                ))}

                <div className="w-full py-12 flex flex-col items-center justify-center gap-6 border border-white/5 rounded-[2rem] bg-white/5">
                    <div className="p-4 rounded-full bg-white/10 text-white">
                        <Github size={32} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">More on GitHub</h3>
                        <a
                            href={`https://github.com/${resumeData.personalInfo.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 mt-4 bg-[var(--accent-color)] text-white rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Visit Profile <ArrowUpRight size={18} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[var(--accent-color)]/5 rounded-full blur-[120px]" />
            </div>
        </section>
    );
};

const GalleryItem = ({ project, index, isMobile }) => {
    // Determine image URL: Use project.image if available, otherwise use placeholder
    const imageUrl = project.image || `https://picsum.photos/id/${index + 20}/600/900`;

    return (
        <div className={`group relative flex-shrink-0 ${isMobile ? 'w-full h-[60vh]' : 'w-[85vw] md:w-[400px] h-[70vh]'} flex flex-col justify-end p-6 md:p-8 rounded-3xl overflow-hidden transition-all duration-700 ${!isMobile && 'hover:w-[90vw] md:hover:w-[600px]'} bg-[#0a0a0a]`}>

            {/* Background Image with Parallax-like scaling */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 opacity-90 group-hover:opacity-60 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-black/40 z-10 transition-all duration-700 group-hover:bg-black/20" />
                <img
                    src={imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 filter grayscale group-hover:grayscale-0 transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] origin-center"
                />
            </div>

            {/* Expanding Content Container */}
            <div className="relative z-20 transform translate-y-0 transition-all duration-700 flex flex-col h-full justify-end">

                {/* Minimal Vertical Title */}
                <div className="mb-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="h-px w-8 bg-[var(--accent-color)]" />
                        <span className="text-[var(--accent-color)] font-mono text-xs tracking-[0.2em] uppercase">
                            0{index + 1}
                        </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-white leading-[0.9] font-display mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-500">
                        {project.name.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h3>
                </div>

                {/* Expanded Details - Auto expanded on mobile if needed, or interaction based */}
                <div className={`${isMobile ? 'grid-rows-[1fr]' : 'grid grid-rows-[0fr] group-hover:grid-rows-[1fr]'} transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]`}>
                    <div className="overflow-hidden">
                        <div className={`pt-6 space-y-6 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-700 delay-100`}>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((t, i) => (
                                    <span key={i} className="px-3 py-1.5 text-xs font-mono font-semibold bg-black/50 backdrop-blur-md border-b-2 border-[var(--accent-color)]/60 text-white/90 rounded-t-lg rounded-b-sm hover:bg-[var(--accent-color)]/10 hover:border-[var(--accent-color)] hover:shadow-[0_5px_15px_rgba(199,251,56,0.15)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-default">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Description - Shorter on mobile maybe? */}
                            <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-md font-light">
                                {project.description}
                            </p>

                            {/* Detailed Points - Hidden on mobile to save space? Keeping for now. */}
                            <ul className="space-y-2">
                                {project.points && project.points.slice(0, 2).map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-xs text-gray-400">
                                        <span className="mt-1.5 w-1 h-1 bg-[var(--accent-color)] rounded-full flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button */}
                            <div className="pt-4 flex items-center gap-4">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-6 py-3 bg-[var(--accent-color)] text-white rounded-full font-bold text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        VIEW PROJECT <ArrowUpRight size={18} />
                                    </a>
                                )}
                                <a
                                    href={project.github || `https://github.com/${resumeData.personalInfo.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300"
                                    title={project.github ? "View Source Code" : "View GitHub Profile"}
                                >
                                    <Github size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Border Beam */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--accent-color)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left" />
        </div>
    );
};

export default ProjectGallery;
