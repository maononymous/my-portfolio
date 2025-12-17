import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// simple deterministic hash so each skill gets a consistent orbit slot
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export default function SkillMoonsOverlay({ moons, onMoonClick }) {
  return (
    <div style={overlayStyle}>
      <AnimatePresence>
        {moons.map((m) => (
          <motion.button
            key={m.id}
            onClick={() => onMoonClick?.(m)}
            initial={{ x: m.spawnX, y: m.spawnY, opacity: 0, scale: 0.6 }}
            animate={{
              x: m.x,
              y: m.y,
              opacity: 1,
              scale: 1,
              transition: { duration: 0.45, ease: "easeOut" },
            }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
            style={moonStyle}
            aria-label={`Skill: ${m.skillKey}`}
          >
            {m.label}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none", // overlay doesn't block; moons themselves will enable pointer events
  zIndex: 20,
};

const moonStyle = {
  pointerEvents: "auto",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(10px)",
  color: "rgba(255,255,255,0.92)",
  borderRadius: 999,
  padding: "8px 10px",
  fontSize: 12,
  letterSpacing: 0.2,
  cursor: "pointer",
};
