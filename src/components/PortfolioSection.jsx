import React from 'react'
import { motion } from 'framer-motion'

const PortfolioSection = React.forwardRef(({ section, mode, dnaPhase = 'revealed' }, ref) => {
  // In DNA mode, only show the foreground text AFTER the helix finishes transition + cone lights up
  const showDNAContent = mode !== 'DNA' || dnaPhase === 'revealed'

  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  const POSITIONS = isMobile ? { title: 140, subtitle: 260, body: 380} : { title: 380, subtitle: 450, body: 500}

  return (
    <motion.section
      ref={ref}
      id={section.id}
      initial={mode === 'DNA' ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: mode === 'DNA' ? 0.35 : 0.8, ease: 'circOut' }}
      style={{
        position: 'relative',
        height: '100svh',
        minHeight: '100dvh',
        width: '100vw',
        scrollSnapAlign: 'start',
        background: 'transparent',
        color: '#eee',
        zIndex: 5,
        padding: 0,
        margin: 0,
      }}
    >
      <motion.div
        key={`${mode}-${showDNAContent ? 'in' : 'out'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: showDNAContent ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
          width: 'min(800px, calc(100vw - 4rem))',
          height: '100%',
          zIndex: 2,
          pointerEvents: showDNAContent ? 'auto' : 'none',
          willChange: 'opacity, transform',
          textAlign: 'left',
        }}
      >
        {/* FIXED PIXEL/VIEWPORT POSITIONS */}
        <div style={{ position: 'absolute', top: 380, left: 0, right: 0 }}>
          <h2 style={{ margin: 0, lineHeight: 1.1 }}>{section.title}</h2>
        </div>

        <div style={{ position: 'absolute', top: 450, left: 0, right: 0 }}>
          <h4
            style={{ margin: 0, fontWeight: 400, lineHeight: 1.25 }}
            dangerouslySetInnerHTML={{ __html: section.subtitle }}
          />
        </div>

        <div style={{ position: 'absolute', top: 500, left: 0, right: 0 }}>
          {mode === 'DNA' ? (
            <p style={{ margin: 0, lineHeight: 1.6 }}>{section.dnaContent}</p>
          ) : (
            <div
              className="planet-text"
              style={{ lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: section.planetContent }}
            />
          )}
        </div>
      </motion.div>
    </motion.section>
  )
})

export default PortfolioSection
