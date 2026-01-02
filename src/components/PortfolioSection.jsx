import React from 'react'
import { motion } from 'framer-motion'

const PortfolioSection = React.forwardRef(({ section, mode, dnaPhase = 'revealed' }, ref) => {
  // In DNA mode, only show the foreground text AFTER the helix finishes transition + cone lights up
  const showDNAContent = mode !== 'DNA' || dnaPhase === 'revealed'

  return (
    <motion.section
      ref={ref}
      id={section.id}
      // Avoid double-transitions fighting the DNA helix animation
      initial={mode === 'DNA' ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: mode === 'DNA' ? 0.35 : 0.8, ease: 'circOut' }}
      style={{
        position: 'relative',
        height: '100svh',
        minHeight: '100dvh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
        background: 'transparent',
        color: '#eee',
        zIndex: 5,
        padding: 0,
        margin: 0,
        transition: 'background 0.75s ease, color 0.75s ease',
      }}
    >
      <motion.div
        // Keyed by "in/out" so Framer doesn’t get stuck when dnaPhase flips quickly
        key={`${mode}-${showDNAContent ? 'in' : 'out'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: showDNAContent ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          maxWidth: '800px',
          padding: '2rem',
          textAlign: 'left',
          borderRadius: '10px',
          zIndex: 2,
          pointerEvents: showDNAContent ? 'auto' : 'none',
          willChange: 'opacity, transform',
        }}
      >
        <h2 style={{ marginBottom: '0.5rem' }}>{section.title}</h2>
        <h4 style={{ marginBottom: '1rem', fontWeight: 400 }}>{section.subtitle}</h4>

        {/* TEXT CONTENT */}
        {mode === 'DNA' ? (
          <p style={{ lineHeight: '1.6' }}>{section.dnaContent}</p>
        ) : (
          <div
            className="planet-text"
            style={{ lineHeight: '1.6' }}
            dangerouslySetInnerHTML={{ __html: section.planetContent }}
          />
        )}
      </motion.div>
    </motion.section>
  )
})

export default PortfolioSection
