import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "./backgrounds/Particles";

export default function ParticleOverlay({ direction, isVisible }) {
  return (
    <AnimatePresence mode="wait">
      {isVisible === "entry" && (
        <motion.div
          key={`particles-enter-${direction}`}
          initial={{ y: direction === "down" ? "100%" : "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: "75%", transition: { duration: 1, ease: "easeInOut" } }}
          exit={{ opacity: "75%" }}
          style={baseStyle}
        >
          <Particles
            particleCount={2000}          // keep reasonable
            particleSpread={2}
            speed={2}
            particleBaseSize={1000}
            alphaParticles={true}
            moveParticlesOnHover={false}
            particleHoverFactor={1}
            disableRotation={true}
            pixelRatio={Math.min(2, window.devicePixelRatio || 1)}
          />
        </motion.div>
      )}

      {isVisible === "exit" && (
        <motion.div
          key={`particles-exit-${direction}`}
          initial={{ y: "0%", opacity: "75%" }}
          animate={{
            y: direction === "down" ? "-100%" : "100%",
            opacity: 0,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          style={baseStyle}
        >
          <Particles
            particleCount={2000}          // keep reasonable
            particleSpread={2}
            speed={2}
            particleBaseSize={1000}
            alphaParticles={true}
            moveParticlesOnHover={false}
            particleHoverFactor={1}
            disableRotation={true}
            pixelRatio={Math.min(2, window.devicePixelRatio || 1)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const baseStyle = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 10,
  pointerEvents: "none",
  background: "rgba(0,0,0,1)",
  backdropFilter: "blur(200px)",
};
