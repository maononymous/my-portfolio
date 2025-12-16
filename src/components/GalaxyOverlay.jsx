import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Galaxy from "./backgrounds/Galaxy";

export default function GalaxyOverlay({ direction, isVisible }) {
  return (
    <AnimatePresence mode="wait">
      {isVisible === "entry" && (
        <motion.div
          key={`galaxy-enter-${direction}`}
          initial={{ y: direction === "down" ? "100%" : "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1, transition: { duration: 1, ease: "easeInOut" } }}
          exit={{ opacity: 1 }}
          style={baseStyle(direction)}
        >
          <Galaxy
            // “transition galaxy” — more intense than background
            density={7.5}
            glowIntensity={0.25}
            saturation={0.3}
            hueShift={140}
            speed={0.001}
            mouseInteraction={false}
            mouseRepulsion={false}
            repulsionStrength={0}
            transparent={false}
          />
        </motion.div>
      )}

      {isVisible === "exit" && (
        <motion.div
          key={`galaxy-exit-${direction}`}
          initial={{ y: "0%", opacity: 1 }}
          animate={{
            y: direction === "down" ? "-100%" : "100%",
            opacity: 0,
            transition: { duration: 1, ease: "easeInOut" },
          }}
          style={baseStyle(direction)}
        >
          <Galaxy
            density={7.5}
            glowIntensity={0.25}
            saturation={0.3}
            hueShift={140}
            speed={0.001}
            mouseInteraction={false}
            mouseRepulsion={false}
            repulsionStrength={0}
            transparent={false}
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
  height: "150vh",
  top: "-25vh",
  zIndex: 10,
  pointerEvents: "none",

  // remove the “rectangle” feel
  WebkitMaskImage:
    direction === "down"
      ? "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)"
      : "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)",
  maskImage:
    direction === "down"
      ? "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)"
      : "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)",

  // optional: makes the transition feel “hazy”
  filter: "blur(1.2px)",
});
