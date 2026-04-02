"use client";

import React, { useEffect, useRef } from 'react';

/**
 * Algorithmic Philosophy: "Latent Frontiers"
 * 
 * Knowledge is a fluid medium, and gaps are the turbulent frontiers where discovery awaits. 
 * The algorithm simulates a semantic flow field where data points (papers) create ripples 
 * in the fabric of consensus. 
 * 
 * Each particle represents a research thread or citation, navigating a high-dimensional 
 * noise field (Perlin-like). As they move, they leave ghost-like traces, 
 * symbolizing the "evidence" left behind in the literature.
 * 
 * The movement is slow, deliberate, and academic, with occasional turbulent zones 
 * representing "research gaps" or "contradictions" where particles deviate or swirl.
 */

const AlgorithmicHero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;
        
        const PARTICLE_COUNT = 250; // Increased for higher density
        const SEED = Math.random() * 1000;
        
        // Colors from theme
        const CREAM = '#F7F5E6';
        const CHARCOAL = '#1A1A1A';
        const ACCENT = '#C5A028'; 
        
        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: { x: number; y: number }[];
            maxLength: number;
            color: string;
            speed: number;
        }

        let particles: Particle[] = [];

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            
            initParticles();
            
            // Solid initial background
            ctx.fillStyle = CREAM;
            ctx.fillRect(0, 0, width, height);
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const isAccent = Math.random() > 0.8;
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: 0,
                    vy: 0,
                    history: [],
                    maxLength: 20 + Math.random() * 40,
                    color: isAccent ? ACCENT : CHARCOAL,
                    speed: 0.2 + Math.random() * 0.5
                });
            }
        };

        // Sophisticated multi-layered field for organic depth
        const getField = (x: number, y: number, t: number) => {
            // Layer 1: Global structure
            const n1 = Math.sin(x * 0.0005 + t * 0.1) * Math.cos(y * 0.0006 + t * 0.08);
            // Layer 2: Medium-scale eddies
            const n2 = Math.sin(x * 0.002 - t * 0.2) * Math.sin(y * 0.002 + t * 0.15);
            // Layer 3: High-frequency turbulence
            const n3 = Math.cos((x + y) * 0.005 + t * 0.5) * 0.5;
            
            const total = n1 * 4 + n2 * 2 + n3;
            return total * Math.PI * 2;
        };

        let t = SEED;
        const render = () => {
            t += 0.0005; 
            
            // "Ghosting" effect - reduced alpha to keep trails longer and bolder
            ctx.fillStyle = CREAM;
            ctx.globalAlpha = 0.02; // Very long trails
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;

            particles.forEach(p => {
                const angle = getField(p.x, p.y, t);
                
                // Acceleration
                p.vx += Math.cos(angle) * 0.12;
                p.vy += Math.sin(angle) * 0.12;
                
                // Friction
                p.vx *= 0.95;
                p.vy *= 0.95;
                
                // Move
                p.x += p.vx * p.speed;
                p.y += p.vy * p.speed;
                
                // Wrap around edges
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
                
                // Draw trailing line
                ctx.beginPath();
                ctx.lineWidth = p.color === ACCENT ? 1.5 : 1.0;
                // Higher opacity strokes for visibility
                ctx.strokeStyle = p.color === ACCENT ? `rgba(197, 160, 40, 0.7)` : `rgba(26, 26, 26, 0.35)`;
                
                const prevX = p.x - p.vx * p.speed;
                const prevY = p.y - p.vy * p.speed;
                
                if (Math.abs(p.x - prevX) < 100 && Math.abs(p.y - prevY) < 100) {
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resize);
        resize();
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80 mix-blend-multiply"
            style={{ zIndex: 0 }}
        />
    );
};

export default AlgorithmicHero;
