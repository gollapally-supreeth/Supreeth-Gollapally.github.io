import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { resumeData } from '../data/resumeData';

const ProjectGallery = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const lastTransformsRef = useRef(new Map());
    const rafRef = useRef(null);
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
    );

    useEffect(() => {
        const checkWidth = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    }, []);

    const updateCards = useCallback(() => {
        if (window.innerWidth < 1024) return;
        const cards = cardsRef.current;
        if (!cards.length) return;

        const scrollTop = window.scrollY;
        const vh = window.innerHeight;
        const stackTop = vh * 0.15;
        const stackGap = 25;
        const scaleStep = 0.04;
        const sectionEl = sectionRef.current;
        if (!sectionEl) return;
        const sectionTop = sectionEl.offsetTop;

        cards.forEach((card, i) => {
            if (!card) return;
            const cardTop = sectionTop + card.offsetTop;
            const lastCard = cards[cards.length - 1];
            const lastCardTop = sectionTop + lastCard.offsetTop;
            const pinStart = cardTop - stackTop - stackGap * i;
            const pinEnd = lastCardTop - stackTop - stackGap * (cards.length - 1);

            let scaleProgress = 0;
            if (scrollTop > pinStart && scrollTop < pinEnd) {
                scaleProgress = (scrollTop - pinStart) / (pinEnd - pinStart);
            } else if (scrollTop >= pinEnd) {
                scaleProgress = 1;
            }
            const targetScale = 1 - (cards.length - 1 - i) * scaleStep;
            const scale = 1 - scaleProgress * (1 - targetScale);

            let translateY = 0;
            if (scrollTop >= pinStart && scrollTop <= pinEnd) {
                translateY = scrollTop - cardTop + stackTop + stackGap * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackTop + stackGap * i;
            }

            const newT = {
                ty: Math.round(translateY * 10) / 10,
                s: Math.round(scale * 1000) / 1000
            };
            const last = lastTransformsRef.current.get(i);
            if (!last || Math.abs(last.ty - newT.ty) > 0.1 || Math.abs(last.s - newT.s) > 0.001) {
                card.style.transform = `translate3d(0, ${newT.ty}px, 0) scale(${newT.s})`;
                lastTransformsRef.current.set(i, newT);
            }
        });
    }, []);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const setup = () => {
            const isD = window.innerWidth >= 1024;
            const cards = Array.from(section.querySelectorAll('.project-stack-card'));
            cardsRef.current = cards;
            if (isD) {
                cards.forEach(card => {
                    card.style.willChange = 'transform';
                    card.style.transformOrigin = 'top center';
                });
                updateCards();
            } else {
                cards.forEach(card => {
                    card.style.willChange = 'auto';
                    card.style.transform = 'none';
                    card.style.transformOrigin = '';
                });
            }
        };

        setup();

        const onScroll = () => {
            if (window.innerWidth < 1024) return;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateCards);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', setup);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', setup);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            lastTransformsRef.current.clear();
        };
    }, [updateCards]);

    return (
        <section ref={sectionRef} id="projects" className="relative bg-[#050505] pt-32 pb-16">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-3 md:mb-4 font-display">
                        Selected <span className="text-[var(--accent-color)]">Projects</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-lg max-w-2xl">
                        A showcase of technical expertise and creative solutions. Each project represents a unique challenge and solution.
                    </p>
                </motion.div>
            </div>

            {/* Cards Container */}
            <div className={`max-w-[1600px] mx-auto px-4 md:px-10 ${!isDesktop ? 'flex flex-col gap-8' : ''}`}>
                {resumeData.projects.map((project, index) => (
                    <motion.div
                        key={index}
                        className="project-stack-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, margin: '-50px' }}
                        style={isDesktop ? { marginBottom: '60vh' } : {}}
                    >
                        <ProjectCard project={project} index={index} />
                    </motion.div>
                ))}

                {/* GitHub CTA Card */}
                <div className="project-stack-card" style={{ marginBottom: 0 }}>
                    <GitHubCard github={resumeData.personalInfo.github} />
                </div>

                {/* Spacer for last card pinning (desktop only) */}
                <div className="hidden lg:block" style={{ height: '40vh' }} />
            </div>
        </section>
    );
};

/* ── GitHub CTA Card ───────────────────────────────────────── */
const GitHubCard = ({ github }) => (
    <div
        className="rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_8px_60px_rgba(0,0,0,0.6)] w-full relative"
        style={{ background: 'radial-gradient(ellipse at 60% 50%, #0d1f0d 0%, #050505 65%)' }}
    >
        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[var(--accent-color)] opacity-[0.07] blur-[100px] pointer-events-none" />
        {/* Dot grid */}
        <div
            className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[580px] px-8 py-16">
            {/* Animated icon */}
            <div className="relative mb-8">
                <div
                    className="absolute inset-0 rounded-full border-2 border-[var(--accent-color)] opacity-20 animate-ping"
                    style={{ animationDuration: '3s' }}
                />
                <div className="absolute -inset-4 rounded-full border border-[var(--accent-color)]/10" />
                <div className="w-20 h-20 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center backdrop-blur-sm">
                    <Github size={36} className="text-[var(--accent-color)]" />
                </div>
            </div>

            <p className="text-[var(--accent-color)] font-mono text-xs font-bold tracking-[0.3em] uppercase mb-4">
                Open Source
            </p>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-5 font-display leading-[1.05]">
                More on <span className="text-[var(--accent-color)]">GitHub</span>
            </h3>
            <p className="text-gray-400 text-sm md:text-lg max-w-md mb-10 leading-relaxed">
                Explore more projects, experiments and open-source work —{' '}
                <br className="hidden md:block" />
                all code is public and free to explore.
            </p>

            <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[var(--accent-color)] text-black text-base font-bold hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_40px_rgba(199,251,56,0.3)]"
            >
                <Github size={20} />
                Visit GitHub Profile
            </a>
        </div>
    </div>
);

/* ── Project Card ──────────────────────────────────────────── */
const ProjectCard = ({ project, index }) => (
    <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#0e0e0e] to-[#080808] shadow-[0_8px_60px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-[580px]">

            {/* LEFT: Info */}
            <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute left-0 top-8 bottom-8 w-[2px] bg-[var(--accent-color)] opacity-40" />
                {/* Background number */}
                <div className="absolute -right-4 -top-4 text-[12rem] font-black text-white/[0.02] leading-none pointer-events-none select-none">
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* Top content */}
                <div className="space-y-4 relative z-10">
                    <span className="inline-block text-[var(--accent-color)] font-mono text-sm font-bold tracking-widest">
                        #{String(index + 1).padStart(2, '0')}
                    </span>

                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                        {project.name}
                    </h3>

                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/70 uppercase tracking-wide"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Key points */}
                    {project.points && project.points.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-white/5">
                            {project.points.slice(0, 3).map((point, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] flex-shrink-0" />
                                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{point}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-5 relative z-10 justify-center">
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/40 active:scale-95 transition-all duration-200"
                    >
                        <Github size={16} />
                        GitHub
                    </a>
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[var(--accent-color)] text-black text-sm font-bold hover:brightness-110 active:scale-95 transition-all duration-200 shadow-[0_0_24px_rgba(199,251,56,0.3)]"
                        >
                            <ExternalLink size={16} />
                            Live Demo
                        </a>
                    )}
                </div>
            </div>

            {/* RIGHT: Browser Mockup */}
            <div className="lg:col-span-7 bg-[#0a0a0a] p-4 md:p-10 flex items-center">
                <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#1a1a1a]">
                    {/* Browser chrome */}
                    <div className="bg-[#2a2a2a] border-b border-white/10 px-4 py-3 flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <div className="flex-1 mx-4 bg-[#1a1a1a] rounded-lg px-4 py-2 flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/30 flex-shrink-0">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-white/40 text-xs font-mono truncate">
                                {project.link || 'localhost:3000'}
                            </span>
                        </div>
                    </div>
                    {/* Screenshot */}
                    <div className="relative aspect-[16/10] bg-[#0a0a0a] overflow-hidden">
                        <img
                            src={project.image || `https://picsum.photos/id/${index + 130}/1600/1000`}
                            alt={project.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ProjectGallery;
