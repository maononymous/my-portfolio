import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const PortfolioSection = React.forwardRef(({ section, mode, dnaPhase = 'revealed' }, ref) => {
  const showDNAContent = mode !== 'DNA' || dnaPhase === 'revealed'

  const isMobile =
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false

  const POSITIONS = isMobile
    ? { title: 160, subtitle: 250, body: 290 }
    : { title: 380, subtitle: 420, body: 470 }

  // --- glass padding ---
  const GLASS_PAD = 12 // visual padding around content (px)
  const GLASS_TOP_PAD = 12
  const GLASS_BOTTOM_PAD = -48

  // Measure refs (invisible)
  const measureWrapRef = useRef(null)
  const measureDNARef = useRef(null)
  const measurePlanetRef = useRef(null)

  const [glassBodyHeight, setGlassBodyHeight] = useState(260) // fallback

  // Recompute when section changes, mode changes, or viewport changes
  useLayoutEffect(() => {
    const compute = () => {
      const dnaH = measureDNARef.current?.offsetHeight ?? 0
      const planetH = measurePlanetRef.current?.offsetHeight ?? 0
      const maxH = Math.max(dnaH, planetH)

      // fallback if something is 0 during first paint
      setGlassBodyHeight(maxH || 260)
    }

    compute()

    // re-measure on resize (fonts wrap differently)
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [section.id, section.dnaContent, section.planetContent, isMobile])

  // Glass positioning
  const GLASS_TOP = POSITIONS.title - (GLASS_TOP_PAD + GLASS_PAD)
  const GLASS_HEIGHT =
    (POSITIONS.body - POSITIONS.title) + // space from title start to body start
    glassBodyHeight +
    GLASS_TOP_PAD +
    GLASS_BOTTOM_PAD +
    GLASS_PAD * 2

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
      {/* ✅ Hidden measurer (does NOT affect layout) */}
      <div
        ref={measureWrapRef}
        style={{
          position: 'absolute',
          left: '-99999px',
          top: 0,
          width: 'min(800px, calc(100vw - 4rem))',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Title/subtitle not needed for body height; we only measure body content */}
        <div ref={measureDNARef} style={{ lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>{section.dnaContent}</p>
        </div>

        <div
          ref={measurePlanetRef}
          style={{ lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: section.planetContent }}
        />
      </div>

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
        {/* ✅ Glass: SAME height for Planet & DNA per section (max of both) */}
        <div
          className="section-glass"
          style={{
            position: 'absolute',
            top: GLASS_TOP,
            left: -GLASS_PAD,
            right: -GLASS_PAD,
            height: GLASS_HEIGHT,
            borderRadius: '26px',
          }}
        />

        {/* FIXED POSITIONS (unchanged) */}
        <div style={{ position: 'absolute', top: POSITIONS.title, left: 0, right: 0 }}>
          <h2 style={{ margin: 0, lineHeight: 1.1 }}>{section.title}</h2>
        </div>

        <div style={{ position: 'absolute', top: POSITIONS.subtitle, left: 0, right: 0 }}>
          <h4
            style={{ margin: 0, fontWeight: 400, lineHeight: 1.25 }}
            dangerouslySetInnerHTML={{ __html: section.subtitle }}
          />
        </div>

        <div style={{ position: 'absolute', top: POSITIONS.body, left: 0, right: 0 }}>
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
