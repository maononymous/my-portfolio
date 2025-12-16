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
          style={baseStyle(direction)}
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
          style={baseStyle(direction)}
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

const baseStyle = (direction) => ({
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 10,
  pointerEvents: "none",
  background: "transparent",

  // soften the whole overlay a bit
  filter: "blur(1.5px)",

  // IMPORTANT: feather edges so it doesn't look like a rectangle
  WebkitMaskImage:
    direction === "down"
      ? "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)"
      : "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)",
  maskImage:
    direction === "down"
      ? "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)"
      : "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)",
});