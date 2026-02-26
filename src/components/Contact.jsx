import React from 'react';
import { motion } from 'framer-motion';
import CursorRevealMenu from './CursorRevealMenu';

const Contact = () => {
    return (
        <section id="contact" className="section min-h-screen py-32 relative overflow-hidden flex flex-col items-center justify-center bg-[#050505]">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[var(--accent-color)]/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[150px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* Left Column: Heading & Call to Action */}
                    <div className="text-left sticky top-32">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[var(--accent-color)] font-mono text-xs tracking-[0.2em] uppercase mb-4"
                        >
                            <span className="inline-block w-2 h-2 bg-[var(--accent-color)] rounded-full mr-2 animate-pulse" />
                            Final Destination
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black font-display text-white leading-[0.9] tracking-tighter mb-8"
                        >
                            LET'S <br />
                            <span className="text-[var(--accent-color)]">
                                CONNECT
                            </span>
                        </motion.h2>

                        <p className="text-gray-400 text-lg md:text-xl max-w-md leading-relaxed mb-12">
                            Have a project in mind or just want to chat about tech? I'm always open to new ideas and collaborations.
                        </p>

                        <div className="text-xs text-gray-700 font-mono mt-24 hidden lg:block">
                            &copy; {new Date().getFullYear()} SUPREETH GOLLAPALLY
                        </div>
                    </div>

                    {/* Right Column: Social Links & Contact Form */}
                    <div className="w-full relative flex flex-col gap-16">

                        {/* Cursor Reveal Social Menu */}
                        <div className="w-full">
                            <CursorRevealMenu />
                        </div>


                    </div>
                </div>

                <div className="lg:hidden text-center mt-12 text-xs text-gray-700 font-mono">
                    &copy; {new Date().getFullYear()} SUPREETH GOLLAPALLY
                </div>
            </div>
        </section>
    );
};

export default Contact;
