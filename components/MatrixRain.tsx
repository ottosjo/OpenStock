"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const FONT_SIZE = 16;
const OPACITY = 0.12;

const katakana = Array.from({ length: 96 }, (_, i) => String.fromCharCode(0x30a0 + i));
const digits = "0123456789".split("");
const CHARS = [...katakana, ...digits];

function getChar(): string {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function MatrixRain() {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animIdRef = useRef<number>(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted || theme !== "matrix") return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let drops: number[] = [];

        const startAnimation = () => {
            const columns = Math.floor(canvas.width / FONT_SIZE);
            drops = Array(columns).fill(1);

            const draw = () => {
                ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = `${FONT_SIZE}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const char = getChar();
                    const x = i * FONT_SIZE;
                    const y = drops[i] * FONT_SIZE;
                    const isLeading = drops[i] * FONT_SIZE > canvas.height * 0.95 || Math.random() > 0.95;
                    ctx.fillStyle = isLeading ? "#aaffbb" : "#00FF41";
                    ctx.fillText(char, x, y);
                    if (y > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }

                animIdRef.current = requestAnimationFrame(draw);
            };

            draw();
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cancelAnimationFrame(animIdRef.current);
            startAnimation();
        };

        resize();
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animIdRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [theme, mounted]);

    if (!mounted || theme !== "matrix") return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                opacity: OPACITY,
                pointerEvents: "none",
                zIndex: 0,
            }}
            aria-hidden="true"
        />
    );
}
