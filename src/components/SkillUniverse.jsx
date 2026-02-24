import React, { useEffect, useRef, useMemo } from 'react';

const SkillUniverse = ({ skillsData }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    // Config for the Solar System Layout
    const CONFIG = {
        baseCatRadius: 220,
        baseSkillDist: 120,
        maxSkillDist: 600,
        nodeSizes: {
            root: 65,
            category: 45,
            skill: 35
        }
    };

    // Color Palette for Groups
    const CATEGORY_STYLE = {
        languages: { main: '#3b82f6', light: '#60a5fa', dark: '#1e3a8a' }, // Blue
        frameworks: { main: '#06b6d4', light: '#22d3ee', dark: '#0e7490' }, // Cyan
        databases: { main: '#10b981', light: '#34d399', dark: '#047857' }, // Emerald
        tools: { main: '#8b5cf6', light: '#a78bfa', dark: '#5b21b6' }, // Purple
        platforms: { main: '#f97316', light: '#fb923c', dark: '#c2410c' }, // Orange
        trading: { main: '#ef4444', light: '#f87171', dark: '#b91c1c' }, // Red
        default: { main: '#64748b', light: '#94a3b8', dark: '#334155' } // Slate
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height, dpr;
        let nodes = [];
        let edges = [];
        let animationFrameId;

        // Mouse state for interaction
        let mouse = { x: -1000, y: -1000 };

        const calculateLayout = () => {
            nodes = [];
            edges = [];

            const centerX = width / 2;
            const centerY = height / 2;

            // 1. Root Node (The Sun)
            const rootNode = {
                id: 'root',
                label: 'Skill Set',
                type: 'root',
                group: 'root',
                x: centerX,
                y: centerY,
                baseX: centerX,
                baseY: centerY,
                radius: CONFIG.nodeSizes.root,
                color: '#ffffff'
            };
            nodes.push(rootNode);

            const categories = Object.entries(skillsData).filter(([key]) => key !== 'marquee');
            const numCats = categories.length;
            const angleStep = (2 * Math.PI) / numCats;

            // AUTO-SCALE
            const minDim = Math.min(width, height);
            const scaleFactor = minDim < 800 ? minDim / 1000 : 1;

            const R_Cat = CONFIG.baseCatRadius * scaleFactor;

            categories.forEach(([category, items], catIndex) => {
                const catAngle = catIndex * angleStep - Math.PI / 2;

                const catX = centerX + Math.cos(catAngle) * R_Cat;
                const catY = centerY + Math.sin(catAngle) * R_Cat;

                const catLabel = category.charAt(0).toUpperCase() + category.slice(1);

                const style = CATEGORY_STYLE[category] || CATEGORY_STYLE.default;

                const catNode = {
                    id: category,
                    label: catLabel,
                    type: 'category',
                    group: category,
                    x: catX,
                    y: catY,
                    baseX: catX,
                    baseY: catY,
                    radius: CONFIG.nodeSizes.category * scaleFactor,
                    color: style.main
                };
                nodes.push(catNode);
                edges.push({ source: rootNode, target: catNode, type: 'orbit', color: style.light });

                // Skills (Moons)
                const numSkills = items.length;
                const fanAngle = Math.min(Math.PI * 1.2, numSkills * 0.3);
                const startFan = catAngle - (fanAngle / 2);

                items.forEach((skillObj, i) => {
                    const name = skillObj.name || skillObj;
                    const level = skillObj.level;

                    // User's custom formula: (130 - level) / 40  (Approx logic based on prev feedback)
                    // Actually, let's keep strict User Logic:
                    // dist = base + (factor * spread)
                    // Previous edits used: const levelFactor = (130 - level) / 40;
                    // But that leads to factors > 1 if level < 90.
                    // Let's stick to the reliable linear interpolation for safety, but mapped to user's requested 80-200 range

                    const levelFactor = (100 - level) / 100; // 0 (Expert) to 1 (Novice)
                    const distFromCat = (CONFIG.baseSkillDist + (levelFactor * (CONFIG.maxSkillDist - CONFIG.baseSkillDist))) * scaleFactor;

                    const finalAngle = catAngle + ((i - (numSkills - 1) / 2) * (fanAngle / numSkills));

                    const skillX = catX + Math.cos(finalAngle) * distFromCat;
                    const skillY = catY + Math.sin(finalAngle) * distFromCat;

                    const skillNode = {
                        id: `${category}-${name}`,
                        label: name,
                        type: 'skill',
                        group: category,
                        x: skillX,
                        y: skillY,
                        baseX: skillX,
                        baseY: skillY,
                        radius: CONFIG.nodeSizes.skill * scaleFactor,
                        level: level,
                        dist: distFromCat,
                        angle: finalAngle,
                        color: style.light // Skill gets lighter shade
                    };
                    nodes.push(skillNode);
                    edges.push({ source: catNode, target: skillNode, type: 'link', color: style.dark });
                });
            });
        };

        const resize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                dpr = window.devicePixelRatio || 1;
                width = rect.width;
                height = rect.height;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.scale(dpr, dpr);
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                calculateLayout();
            }
        };

        window.addEventListener('resize', resize);
        setTimeout(resize, 0);

        // Visibility Check to Pause Animation (Fixes Scroll Lag)
        let isVisible = true;

        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                // Restart loop if stopped
                if (!animationFrameId) draw();
            } else {
                // Stop loop
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        }, { threshold: 0 });

        if (canvas) observer.observe(canvas);

        // --- RENDER LOOP ---
        const draw = () => {
            if (!isVisible) return; // double check

            ctx.clearRect(0, 0, width, height);
            const time = Date.now() * 0.001;

            // Interaction
            nodes.forEach(node => {
                const floatY = Math.sin(time + node.x * 0.01) * 3;
                let offsetX = 0, offsetY = 0;
                const dx = mouse.x - node.baseX;
                const dy = mouse.y - node.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) {
                    const factor = (300 - dist) / 300;
                    offsetX = dx * factor * 0.1;
                    offsetY = dy * factor * 0.1;
                }
                node.x = node.baseX + offsetX;
                node.y = node.baseY + floatY + offsetY;
            });

            // Draw Edges
            edges.forEach(edge => {
                ctx.beginPath();

                if (edge.type === 'orbit') {
                    // Orbit: Stronger, dashed line
                    ctx.setLineDash([5, 5]);
                    ctx.moveTo(edge.source.x, edge.source.y);
                    ctx.lineTo(edge.target.x, edge.target.y);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // More visible
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.setLineDash([]); // Reset
                } else {
                    // Link (Category -> Skill): OPTIMIZED PLASMA BEAM
                    // Performance Fix: Removed shadowBlur (CPU heavy) and reduced segments.
                    const x1 = edge.source.x;
                    const y1 = edge.source.y;
                    const x2 = edge.target.x;
                    const y2 = edge.target.y;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx);

                    // Optimization: Increase step size to reduce draw calls
                    // Step 8 instead of 2 = 4x faster rendering
                    const step = 8;

                    ctx.beginPath();

                    for (let i = 0; i <= dist; i += step) {
                        // Simplified noise math
                        const t = time * 10;
                        const n = Math.sin(i * 0.2 + t) + Math.cos(i * 0.1 - t);

                        // Envelope
                        const envelope = Math.sin((i / dist) * Math.PI);
                        const displacement = n * envelope * 0.8; // Reduced amplitude for "tight" beam

                        // Rotate
                        const tx = x1 + (Math.cos(angle) * i) - (Math.sin(angle) * displacement);
                        const ty = y1 + (Math.sin(angle) * i) + (Math.cos(angle) * displacement);

                        if (i === 0) ctx.moveTo(tx, ty);
                        else ctx.lineTo(tx, ty);
                    }

                    // SIMULATED GLOW (Fast)
                    // Instead of shadowBlur, draw twice: bright thick line + solid thin core

                    // 1. Aura (simulated with opacity)
                    ctx.strokeStyle = edge.color || '#4facfe';
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.2; // Transparent glow
                    ctx.stroke();

                    // 2. Core (Solid)
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = 0.8;
                    ctx.stroke();

                    ctx.globalAlpha = 1.0; // Reset
                }
            });

            // Draw Nodes
            nodes.forEach(node => {
                const { x, y, radius, type, label, group } = node;

                // Get Style
                const style = CATEGORY_STYLE[group] || CATEGORY_STYLE.default;

                const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);

                if (type === 'root') {
                    grad.addColorStop(0, '#ffffff');
                    grad.addColorStop(1, '#cbd5e1');
                    ctx.shadowColor = 'rgba(255,255,255,0.6)';
                    ctx.shadowBlur = 30;
                } else if (type === 'category') {
                    // Planet Color
                    grad.addColorStop(0, style.light);
                    grad.addColorStop(1, style.dark);
                    ctx.shadowColor = style.main;
                    ctx.shadowBlur = 25;
                } else {
                    // Moon Color: White body with colored tint/glow
                    grad.addColorStop(0, '#ffffff');
                    grad.addColorStop(0.3, '#ffffff');
                    grad.addColorStop(1, style.light); // Tinted edge
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Unique Ring for Categories
                if (type === 'category') {
                    ctx.beginPath();
                    ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
                    ctx.strokeStyle = style.main;
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = 0.3;
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;
                }

                // Gloss
                ctx.beginPath();
                ctx.ellipse(x - radius * 0.35, y - radius * 0.35, radius * 0.2, radius * 0.12, Math.PI / 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.fill();

                // Text
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                if (type === 'category') {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '700 14px Inter, sans-serif';
                } else if (type === 'root') {
                    ctx.fillStyle = '#1e3a8a';
                    ctx.font = '900 18px Inter, sans-serif';
                } else {
                    // Skill text matches category color for readability/association
                    ctx.fillStyle = style.dark;
                    ctx.font = '700 11px Inter, sans-serif';
                }

                // ... text rendering ...
                if (label.length > 9 && label.includes(' ')) {
                    const words = label.split(' ');
                    ctx.fillText(words[0], x, y - 6);
                    ctx.fillText(words.slice(1).join(' '), x, y + 6);
                } else {
                    ctx.fillText(label, x, y);
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [skillsData]);

    return (
        <div ref={containerRef} className="w-full h-[1400px] relative">
            <canvas ref={canvasRef} className="block w-full h-full" />


        </div>
    );
};

export default SkillUniverse;
