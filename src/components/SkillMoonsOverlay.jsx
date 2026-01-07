import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillSections } from "../data/skillSections";

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
        {moons.map((m) => {
          const skill = skillSections[m.skillKey];

          return (
            <motion.div
              key={m.id}
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
            >
              {/* Skill description */}
              <div style={descriptionStyle}>
                {skill?.description || m.label}
              </div>

              {/* External link (optional) */}
              {skill?.link && (
                <a
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  aria-label={`Open ${m.skillKey} documentation`}
                >
                  ↗
                </a>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
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
  borderRadius: 16,
  padding: "10px 12px",
  fontSize: 12,
  lineHeight: 1.45,
  maxWidth: 220,
  cursor: "default",
};

const descriptionStyle = {
  marginBottom: 6,
};

const linkStyle = {
  display: "inline-block",
  fontSize: 12,
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
};
