import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
    GmailIcon, GithubIcon, LinkedInIcon,
    LeetCodeIcon, InstagramIcon, XIcon,
    BrandColors
} from './SocialIcons';
import { resumeData } from '../data/resumeData';

const SocialItems = [
    {
        name: 'Email',
        handle: resumeData.personalInfo.email,
        link: `mailto:${resumeData.personalInfo.email}`,
        icon: <GmailIcon className="w-full h-full" />,
        color: BrandColors.email
    },
    {
        name: 'GitHub',
        handle: `@${resumeData.personalInfo.github}`,
        link: `https://github.com/${resumeData.personalInfo.github}`,
        icon: <GithubIcon className="w-full h-full" />,
        color: BrandColors.github
    },
    {
        name: 'LinkedIn',
        handle: resumeData.personalInfo.name,
        link: `https://linkedin.com/in/${resumeData.personalInfo.linkedin}`,
        icon: <LinkedInIcon className="w-full h-full" />,
        color: BrandColors.linkedin
    },
    {
        name: 'LeetCode',
        handle: resumeData.personalInfo.leetcode,
        link: `https://leetcode.com/${resumeData.personalInfo.leetcode}`,
        icon: <LeetCodeIcon className="w-full h-full" />,
        color: BrandColors.leetcode
    },
    {
        name: 'Instagram',
        handle: `@${resumeData.personalInfo.instagram}`,
        link: `https://instagram.com/${resumeData.personalInfo.instagram}`,
        icon: <InstagramIcon className="w-full h-full" />,
        color: BrandColors.instagram
    },
    {
        name: 'X (Twitter)',
        handle: `@${resumeData.personalInfo.x}`,
        link: `https://x.com/${resumeData.personalInfo.x}`,
        icon: <XIcon className="w-full h-full" />,
        color: BrandColors.x
    }
];

const CursorRevealMenu = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Physics for the following cursor (spring)
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        x.set(clientX);
        y.set(clientY);

        // Calculate card rotation based on movement
        const rotX = (clientY - rect.height / 2) / 20;
        const rotY = (clientX - rect.width / 2) / 20;
        rotateX.set(-rotX);
        rotateY.set(rotY);
    };

    return (
        <div
            className="w-full relative py-10"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            {/* The List (Restored) */}
            <div className="flex flex-col space-y-2">
                {SocialItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative z-10 flex items-center justify-between p-6 border-b border-white/10 hover:border-white/30 transition-colors"
                        onMouseEnter={() => setHoveredIndex(index)}
                    >
                        <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-white group-hover:bg-gray-400 transition-colors duration-300 font-display uppercase tracking-tighter">
                            {item.name}
                        </span>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white transform group-hover:translate-x-[-10px]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </div>
                    </a>
                ))}
            </div>

            {/* Holographic Cursor/Card */}
            <motion.div
                style={{
                    x: springX,
                    y: springY,
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    translateX: '-50%',
                    translateY: '-50%',
                    zIndex: 20
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: hoveredIndex !== null ? 1 : 0,
                    scale: hoveredIndex !== null ? 1 : 0.5
                }}
                className="pointer-events-none absolute top-0 left-0 hidden md:block"
            >
                {hoveredIndex !== null && (
                    <div
                        className="w-[280px] p-6 rounded-2xl border backdrop-blur-xl shadow-2xl flex flex-col items-center gap-4 overflow-hidden relative"
                        style={{
                            backgroundColor: 'rgba(20, 20, 20, 0.8)',
                            borderColor: SocialItems[hoveredIndex].color
                        }}
                    >
                        {/* Glow Gradient */}
                        <div
                            className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent to-white"
                            style={{ background: `radial-gradient(circle at 50% 0%, ${SocialItems[hoveredIndex].color}, transparent 70%)` }}
                        />

                        {/* Large Icon */}
                        <div
                            className="w-16 h-16 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            style={{ color: SocialItems[hoveredIndex].color }}
                        >
                            {SocialItems[hoveredIndex].icon}
                        </div>

                        {/* Details */}
                        <div className="text-center relative z-10">
                            <h4 className="text-white font-bold text-xl mb-1">{SocialItems[hoveredIndex].name}</h4>
                            <p className="font-mono text-sm opacity-80" style={{ color: SocialItems[hoveredIndex].color }}>
                                {SocialItems[hoveredIndex].handle}
                            </p>
                        </div>

                        {/* Decoration lines */}
                        <div className="absolute bottom-4 left-4 right-4 h-[1px] bg-white/10" />
                        <div className="absolute bottom-4 left-4 w-1 h-3 bg-white/50" />
                        <div className="absolute bottom-4 right-4 w-1 h-3 bg-white/50" />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CursorRevealMenu;
