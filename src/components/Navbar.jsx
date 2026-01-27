import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { resumeData } from '../data/resumeData';

const Navbar = () => {
    const [activeSection, setActiveSection] = useState('Home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Smooth optimized scrolling values for hardware accelerated styles
    const backgroundOpacity = useTransform(scrollY, [0, 50], [0, 0.6]); // More transparency for glass
    const blurAmount = useTransform(scrollY, [0, 50], [0, 40]); // Stronger "frosted" blur
    // Faded border: starts invisible, becomes very subtle
    const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.08]);
    const shadowOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);

    // Spring physics for buttery smooth background transition
    const smoothBg = useSpring(backgroundOpacity, { stiffness: 300, damping: 30 });
    const smoothBlur = useSpring(blurAmount, { stiffness: 300, damping: 30 });
    const smoothBorder = useSpring(borderOpacity, { stiffness: 300, damping: 30 });
    const smoothShadow = useSpring(shadowOpacity, { stiffness: 300, damping: 30 });

    useEffect(() => {
        // Lightweight IntersectionObserver for tracking active section
        const sections = ['about', 'skills', 'projects', 'experience', 'contact'];
        const sectionElements = sections.map(id => document.getElementById(id));

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -30% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let current = entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1);
                    if (current === 'Skills') current = 'Expertise';
                    if (current === 'Projects') current = 'Work';
                    if (current === 'Experience') current = 'Journey';
                    setActiveSection(current);
                }
            });
        }, observerOptions);

        const handleScroll = () => {
            if (window.scrollY < 100) setActiveSection('Home');
        };

        window.addEventListener('scroll', handleScroll);

        if (window.scrollY < 100) setActiveSection('Home');

        sectionElements.forEach(el => {
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'About', href: '#about' },
        { name: 'Expertise', href: '#skills' },
        { name: 'Journey', href: '#experience' },
        { name: 'Work', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Apple-like easing
                className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none"
            >
                <div className="pointer-events-auto w-[90%] md:w-auto relative">
                    {/* Desktop & Mobile Container */}
                    <motion.div
                        className="flex items-center justify-between md:justify-center gap-1 px-4 p-3 md:px-2 md:p-2 rounded-2xl md:rounded-full border border-white/10 transition-colors duration-300"
                        style={{
                            backgroundColor: useTransform(smoothBg, v => `rgba(10,10,10, ${v})`),
                            backdropFilter: useTransform(smoothBlur, v => `blur(${v}px)`),
                            borderColor: useTransform(smoothBorder, v => `rgba(255,255,255, ${v})`),
                            boxShadow: useTransform(smoothShadow, v => `0 10px 40px -10px rgba(0,0,0, ${v})`)
                        }}
                    >
                        {/* Mobile: Logo / Brand Name */}
                        <div className="pl-2">
                            <img src="/assets/logo.png" alt="SG Logo" className="h-8 w-auto object-contain" />
                        </div>

                        {/* DESKTOP LINKS */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.name;
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setActiveSection(link.name)}
                                        className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10 ${isActive ? 'text-black font-semibold' : 'text-white/60 hover:text-white'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-[var(--accent-color)] rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        {link.name}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-[1px] h-6 bg-white/10 mx-2" />

                        {/* CTA Button */}
                        <div className="flex items-center gap-4">
                            <a
                                href={resumeData.navbar.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:block mr-1 px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                {resumeData.navbar.ctaText}
                            </a>

                            {/* MOBILE MENU TOGGLE */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-white hover:text-[var(--accent-color)] transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.nav>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-24 left-4 right-4 z-40 md:hidden bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
                    >
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => {
                                        setActiveSection(link.name);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`text-lg font-medium p-4 rounded-xl transition-all ${activeSection === link.name
                                        ? 'bg-[var(--accent-color)] text-black font-bold'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            ))}

                            <div className="h-px bg-white/10 my-2" />

                            <a
                                href={resumeData.navbar.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-center p-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                {resumeData.navbar.ctaText}
                            </a>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
