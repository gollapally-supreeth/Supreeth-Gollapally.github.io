import React, { useEffect, useRef } from 'react';

/**
 * Cursor — metaball cluster with spring-physics satellites.
 * Desktop only (pointer: fine). Touch devices untouched.
 *
 * Technique:
 *  - One main follower blob + N satellite orbs, each with independent spring mass.
 *  - Drawn with 'lighter' (additive) compositing → overlapping blobs naturally
 *    blend into bright glowing pools — real metaball glow, zero per-pixel math.
 *  - Velocity → squish/stretch on main blob.
 *  - State transitions smoothly interpolate target radii + orbit config.
 */

const ACCENT_R = 199, ACCENT_G = 251, ACCENT_B = 56;   // #c7fb38
const A = (a) => `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${a})`;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── Satellite config per state ──────────────────────────────────────────────
// Each satellite: { orbitR, phase, size, spring, damp }
const STATES = {
    default: {
        mainR: 7,
        sats: [
            { orbitR: 0,  phase: 0,             size: 5,  spring: 0.14, damp: 0.72 },
            { orbitR: 18, phase: 0,              size: 4,  spring: 0.10, damp: 0.68 },
            { orbitR: 18, phase: Math.PI * 0.66, size: 3,  spring: 0.09, damp: 0.66 },
            { orbitR: 18, phase: Math.PI * 1.33, size: 3,  spring: 0.08, damp: 0.65 },
        ],
    },
    link: {
        mainR: 18,
        sats: [
            { orbitR: 0,  phase: 0,              size: 12, spring: 0.16, damp: 0.70 },
            { orbitR: 30, phase: 0,              size: 7,  spring: 0.09, damp: 0.64 },
            { orbitR: 30, phase: Math.PI * 0.5,  size: 7,  spring: 0.09, damp: 0.64 },
            { orbitR: 30, phase: Math.PI,         size: 7,  spring: 0.09, damp: 0.64 },
            { orbitR: 30, phase: Math.PI * 1.5,  size: 7,  spring: 0.09, damp: 0.64 },
        ],
    },
    text: {
        mainR: 3,
        sats: [
            { orbitR: 0,  phase: 0,              size: 3,  spring: 0.18, damp: 0.75 },
            { orbitR: 0,  phase: 0,              size: 3,  spring: 0.12, damp: 0.70 },
        ],
    },
    view: {
        mainR: 28,
        sats: [
            { orbitR: 46, phase: 0,                        size: 6,  spring: 0.07, damp: 0.62 },
            { orbitR: 46, phase: Math.PI * 0.33,           size: 5,  spring: 0.07, damp: 0.60 },
            { orbitR: 46, phase: Math.PI * 0.66,           size: 6,  spring: 0.07, damp: 0.62 },
            { orbitR: 46, phase: Math.PI,                  size: 5,  spring: 0.07, damp: 0.60 },
            { orbitR: 46, phase: Math.PI * 1.33,           size: 6,  spring: 0.07, damp: 0.62 },
            { orbitR: 46, phase: Math.PI * 1.66,           size: 5,  spring: 0.07, damp: 0.60 },
        ],
    },
};

// ── Smooth blob via catmull-rom bezier ──────────────────────────────────────
function drawSmoothBlob(ctx, cx, cy, radii, scaleX = 1, scaleY = 1) {
    const n   = radii.length;
    if (n < 3) { ctx.arc(cx, cy, radii[0] * scaleX, 0, Math.PI * 2); return; }
    const pts = radii.map((r, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        return { x: cx + Math.cos(a) * r * scaleX, y: cy + Math.sin(a) * r * scaleY };
    });
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[(i + 2) % n];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.closePath();
}

// ── Radial glow fill ────────────────────────────────────────────────────────
function drawGlowBlob(ctx, x, y, r, innerA, outerA) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0,   A(innerA));
    g.addColorStop(0.5, A(innerA * 0.6));
    g.addColorStop(1,   A(outerA));
    ctx.fillStyle = g;
    ctx.fill();
}

export default function CustomCursor() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const canvas = canvasRef.current;
        const ctx    = canvas.getContext('2d');
        let raf;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        // ── Mouse / state ─────────────────────────────────────────────
        const mouse    = { x: -600, y: -600 };
        const main     = { x: -600, y: -600, vx: 0, vy: 0 };
        let curState   = 'default';
        let prevState  = 'default';
        let morphT     = 1;
        let magnet     = null;
        let isDown     = false;
        let isVisible  = false;
        let time       = 0;
        let splats     = [];   // click burst particles

        // ── Satellite live state ───────────────────────────────────────
        // We keep a flat array of up to 6 satellite springs
        const MAX_SATS = 6;
        const sats = Array.from({ length: MAX_SATS }, () => ({
            x: -600, y: -600, vx: 0, vy: 0,
        }));

        // ── Element detection ──────────────────────────────────────────
        const getState = (el) => {
            if (!el) return 'default';
            const dc = el.closest?.('[data-cursor]')?.getAttribute?.('data-cursor');
            if (dc === 'view') return 'view';
            if (el.closest?.('a, button, [role="button"], label, nav, [data-interactive]')) return 'link';
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) return 'text';
            if (el.closest?.('img, figure, .project-card, video')) return 'view';
            return 'default';
        };
        const getMagnet = (el) => {
            const t = el?.closest?.('a, button, [role="button"]');
            if (!t) return null;
            const r = t.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        };

        // ── Events ────────────────────────────────────────────────────
        const onMove = (e) => {
            mouse.x  = e.clientX;
            mouse.y  = e.clientY;
            isVisible = true;
            const s = getState(e.target);
            if (s !== curState) { prevState = curState; curState = s; morphT = 0; }
            magnet = curState === 'link' ? getMagnet(e.target) : null;
        };
        const onDown = (e) => {
            isDown = true;
            // spawn 8 splat particles
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                const sp = 2.5 + Math.random() * 3;
                splats.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 4 + Math.random() * 3, alpha: 0.85, life: 1 });
            }
        };
        const onUp    = () => { isDown = false; };
        const onLeave = () => { isVisible = false; };
        const onEnter = () => { isVisible = true; };

        document.addEventListener('mousemove',  onMove,  { passive: true });
        document.addEventListener('mousedown',  onDown);
        document.addEventListener('mouseup',    onUp);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);

        // ── Render ────────────────────────────────────────────────────
        const loop = () => {
            time += 0.018;
            morphT = clamp(morphT + 0.055, 0, 1);
            // ease-in-out
            const mt = morphT < 0.5 ? 2 * morphT * morphT : 1 - Math.pow(-2 * morphT + 2, 2) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Main blob spring
            let tx = mouse.x, ty = mouse.y;
            if (magnet) { tx = lerp(mouse.x, magnet.x, 0.4); ty = lerp(mouse.y, magnet.y, 0.4); }
            main.vx = (main.vx + (tx - main.x) * 0.13) * 0.74;
            main.vy = (main.vy + (ty - main.y) * 0.13) * 0.74;
            main.x += main.vx;
            main.y += main.vy;

            const speed  = Math.sqrt(main.vx * main.vx + main.vy * main.vy);
            const velAng = Math.atan2(main.vy, main.vx);
            const squish = clamp(speed * 0.038, 0, 0.5);
            const scaleX = 1 + squish;
            const scaleY = 1 - squish * 0.6;

            // Interpolated state configs
            const cfgA = STATES[prevState] || STATES.default;
            const cfgB = STATES[curState]  || STATES.default;
            const mainR = lerp(cfgA.mainR, cfgB.mainR, mt);

            if (!isVisible) { raf = requestAnimationFrame(loop); return; }

            // Use 'lighter' (additive) compositing — blobs brighten where they overlap
            ctx.globalCompositeOperation = 'lighter';

            // ── Draw satellites ──────────────────────────────────────
            const numSats = cfgB.sats.length;
            for (let i = 0; i < MAX_SATS; i++) {
                const sat     = sats[i];
                const satCfgA = cfgA.sats[i % cfgA.sats.length] || cfgA.sats[0];
                const satCfgB = cfgB.sats[i % cfgB.sats.length] || cfgB.sats[0];

                const orbitR = lerp(satCfgA.orbitR, satCfgB.orbitR, mt);
                const phase  = lerp(satCfgA.phase,  satCfgB.phase,  mt);
                const size   = lerp(satCfgA.size,   satCfgB.size,   mt);
                const sp     = lerp(satCfgA.spring, satCfgB.spring, mt);
                const dp     = lerp(satCfgA.damp,   satCfgB.damp,   mt);

                // Orbit target rotates with time
                const orbitAngle = phase + time * (i % 2 === 0 ? 0.6 : -0.5);
                const stx = main.x + Math.cos(orbitAngle) * orbitR;
                const sty = main.y + Math.sin(orbitAngle) * orbitR;

                sat.vx = (sat.vx + (stx - sat.x) * sp) * dp;
                sat.vy = (sat.vy + (sty - sat.y) * sp) * dp;
                sat.x += sat.vx;
                sat.y += sat.vy;

                if (size < 0.5 || i >= numSats + 1) continue;

                const glowR = size * 2.8;
                ctx.beginPath();
                ctx.arc(sat.x, sat.y, glowR, 0, Math.PI * 2);
                drawGlowBlob(ctx, sat.x, sat.y, glowR, 0.28, 0);

                ctx.beginPath();
                ctx.arc(sat.x, sat.y, size, 0, Math.PI * 2);
                drawGlowBlob(ctx, sat.x, sat.y, size, 0.75, 0.05);
            }

            // ── Draw main blob ───────────────────────────────────────
            const PT = 9;
            const radii = Array.from({ length: PT }, (_, i) => {
                const wobble = Math.sin(time * 2.2 + i * 0.9) * mainR * 0.14
                             + Math.sin(time * 1.1 + i * 1.7) * mainR * 0.07;
                return mainR + wobble;
            });

            ctx.save();
            ctx.translate(main.x, main.y);
            ctx.rotate(velAng);

            // Outer glow
            ctx.beginPath();
            drawSmoothBlob(ctx, 0, 0, radii.map(r => r * 2.6), scaleX, scaleY);
            const og = ctx.createRadialGradient(0, 0, 0, 0, 0, mainR * 2.6);
            og.addColorStop(0, A(0.15)); og.addColorStop(1, A(0));
            ctx.fillStyle = og; ctx.fill();

            // Mid glow
            ctx.beginPath();
            drawSmoothBlob(ctx, 0, 0, radii.map(r => r * 1.5), scaleX, scaleY);
            const mg = ctx.createRadialGradient(0, 0, 0, 0, 0, mainR * 1.55);
            mg.addColorStop(0, A(0.35)); mg.addColorStop(1, A(0.02));
            ctx.fillStyle = mg; ctx.fill();

            // Core blob
            ctx.beginPath();
            drawSmoothBlob(ctx, 0, 0, radii, scaleX, scaleY);
            const cg = ctx.createRadialGradient(-mainR * 0.2, -mainR * 0.2, 0, 0, 0, mainR * 1.1);
            cg.addColorStop(0, A(isDown ? 1.0 : 0.95));
            cg.addColorStop(0.55, A(0.7));
            cg.addColorStop(1,   A(0.25));
            ctx.fillStyle = cg; ctx.fill();

            ctx.restore();

            // ── View state: "VIEW" label ─────────────────────────────
            if (curState === 'view' && mt > 0.5) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = (mt - 0.5) * 2;
                ctx.fillStyle    = `rgb(${ACCENT_R},${ACCENT_G},${ACCENT_B})`;
                ctx.font         = '700 11px Inter,sans-serif';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('VIEW', main.x, main.y);
                ctx.globalAlpha = 1;
            }

            // ── Precise dot at exact mouse pos ───────────────────────
            ctx.globalCompositeOperation = 'source-over';
            if (curState !== 'text') {
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 2.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${ACCENT_R},${ACCENT_G},${ACCENT_B})`;
                ctx.fill();
            } else {
                // I-beam for text
                const h = 22, sw = 6;
                ctx.strokeStyle = `rgb(${ACCENT_R},${ACCENT_G},${ACCENT_B})`;
                ctx.lineWidth = 1.5; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y - h/2); ctx.lineTo(mouse.x, mouse.y + h/2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(mouse.x - sw/2, mouse.y - h/2); ctx.lineTo(mouse.x + sw/2, mouse.y - h/2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(mouse.x - sw/2, mouse.y + h/2); ctx.lineTo(mouse.x + sw/2, mouse.y + h/2); ctx.stroke();
            }

            // ── Splat particles ───────────────────────────────────────
            ctx.globalCompositeOperation = 'lighter';
            splats = splats.filter(s => s.alpha > 0.02);
            splats.forEach(s => {
                s.x    += s.vx; s.y += s.vy;
                s.vx   *= 0.88; s.vy *= 0.88;
                s.alpha *= 0.82;
                s.r    *= 0.95;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
                sg.addColorStop(0, A(s.alpha)); sg.addColorStop(1, A(0));
                ctx.fillStyle = sg; ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;

            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            document.removeEventListener('mousemove',  onMove);
            document.removeEventListener('mousedown',  onDown);
            document.removeEventListener('mouseup',    onUp);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none',
                zIndex: 99999,
            }}
        />
    );
}
