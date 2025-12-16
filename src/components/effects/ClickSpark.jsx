import React, { useEffect, useMemo, useRef } from "react";

export default function ClickSpark({
  children,
  sparkColor = "#ffffff",
  sparkSize = 1,     // visual size multiplier
  sparkRadius = 500,   // how far sparks spread
  sparkCount = 500,
  duration = 100,     // ms
  extraScale = 2,     // overall multiplier
  disabled = false,
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const rafRef = useRef(0);

  const dpr = useMemo(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = (t) => {
      const now = t || performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const alive = [];
      for (const s of sparksRef.current) {
        const age = now - s.start;
        const p = Math.min(1, age / s.life);
        if (p >= 1) continue;

        // ease-out
        const e = 1 - Math.pow(1 - p, 3);

        const x = s.x + s.vx * e;
        const y = s.y + s.vy * e;

        const alpha = (1 - p) * 0.9;
        const size = s.size * (1 - p * 0.6);

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = Math.max(1, size * 0.12);

        // little streak
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - s.vx * 0.08, y - s.vy * 0.08);
        ctx.stroke();

        // dot
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.2, size * 0.18), 0, Math.PI * 2);
        ctx.fill();

        alive.push(s);
      }

      sparksRef.current = alive;
      ctx.globalAlpha = 1;

      if (alive.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    const ensureRAF = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const spawn = (clientX, clientY) => {
      const now = performance.now();
      const count = Math.max(1, sparkCount | 0);
      const radius = sparkRadius * extraScale;
      const baseSize = sparkSize * extraScale;

      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        const r = radius * (0.65 + Math.random() * 0.6);
        const vx = Math.cos(a) * r;
        const vy = Math.sin(a) * r;

        sparksRef.current.push({
          x: clientX,
          y: clientY,
          vx,
          vy,
          start: now,
          life: duration,
          size: baseSize * (0.75 + Math.random() * 0.7),
          color: sparkColor,
        });
      }

      ensureRAF();
    };

    const onPointerDown = (e) => {
      if (disabled) return;
      // ignore right-click
      if (e.button === 2) return;

      // if touch, first touch point is clientX/clientY already on pointer event
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      sparksRef.current = [];
    };
  }, [dpr, sparkColor, sparkSize, sparkRadius, sparkCount, duration, extraScale, disabled]);

  return (
    <>
      {children}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}
