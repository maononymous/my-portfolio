import React, { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const PortfolioSection = React.forwardRef(({ section, mode, dnaPhase = 'revealed' }, ref) => {
  const showDNAContent = mode !== 'DNA' || dnaPhase === 'revealed'

  const isMobile =
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false

  // ✅ Desktop stays fixed (your old behavior)
  const DESKTOP_POSITIONS = { title: 380, subtitle: 420, body: 470 }

  // ✅ Mobile only: use a single anchor, then stack dynamically
  const MOBILE_ANCHOR_TOP = 160
  const GAP_TITLE_SUBTITLE = 12
  const GAP_SUBTITLE_BODY = 18

  // --- glass padding ---
  const GLASS_PAD = 16
  const GLASS_TOP_PAD = 16
  const GLASS_BOTTOM_PAD = -64

  // Measure refs (invisible for content height parity)
  const measureDNARef = useRef(null)
  const measurePlanetRef = useRef(null)
  const [glassBodyHeight, setGlassBodyHeight] = useState(260)

  // ✅ NEW: measure actual title/subtitle height on mobile
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const [mobileTops, setMobileTops] = useState({
    title: MOBILE_ANCHOR_TOP,
    subtitle: MOBILE_ANCHOR_TOP + 60,
    body: MOBILE_ANCHOR_TOP + 120,
  })

  // Measure planet vs dna body to keep glass height same per section
  useLayoutEffect(() => {
    const compute = () => {
      const dnaH = measureDNARef.current?.offsetHeight ?? 0
      const planetH = measurePlanetRef.current?.offsetHeight ?? 0
      setGlassBodyHeight(Math.max(dnaH, planetH) || 260)
    }

    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [section.id, section.dnaContent, section.planetContent])

  // ✅ Measure title/subtitle on mobile and compute tops
  useLayoutEffect(() => {
    if (!isMobile) return

    const compute = () => {
      const titleH = titleRef.current?.offsetHeight ?? 0
      const subtitleH = subtitleRef.current?.offsetHeight ?? 0

      const titleTop = MOBILE_ANCHOR_TOP
      const subtitleTop = titleTop + titleH + GAP_TITLE_SUBTITLE
      const bodyTop = subtitleTop + subtitleH + GAP_SUBTITLE_BODY

      setMobileTops({ title: titleTop, subtitle: subtitleTop, body: bodyTop })
    }

    compute()

    // Use ResizeObserver so it reacts to wrapping/font changes reliably
    const ro = new ResizeObserver(compute)
    if (titleRef.current) ro.observe(titleRef.current)
    if (subtitleRef.current) ro.observe(subtitleRef.current)

    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [isMobile, section.id, section.title, section.subtitle])

  const POSITIONS = isMobile ? mobileTops : DESKTOP_POSITIONS

  // Glass positioning
  const GLASS_TOP = POSITIONS.title - (GLASS_TOP_PAD + GLASS_PAD)

  // Height covers from title start → body start + body height + padding
  const GLASS_HEIGHT =
    (POSITIONS.body - POSITIONS.title) +
    glassBodyHeight +
    GLASS_TOP_PAD +
    GLASS_BOTTOM_PAD +
    GLASS_PAD * 2

  return (
    <motion.section
      className={`portfolio-section ${mode === 'DNA' ? 'mode-dna' : 'mode-planet'}`}
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
      {/* Hidden measurer (body only) */}
      <div
        style={{
          position: 'absolute',
          left: '-99999px',
          top: 0,
          width: 'min(800px, calc(100vw - 4rem))',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
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
        {/* Glass card */}
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

        {/* Title */}
        <div style={{ position: 'absolute', top: POSITIONS.title, left: 0, right: 0 }}>
          <h2 ref={titleRef} style={{ margin: 0, lineHeight: 1.1 }}>
            {section.title}
          </h2>
        </div>

        {/* Subtitle */}
        <div style={{ position: 'absolute', top: POSITIONS.subtitle, left: 0, right: 0 }}>
          <h4
            ref={subtitleRef}
            style={{ margin: 0, fontWeight: 400, lineHeight: 1.25 }}
            dangerouslySetInnerHTML={{ __html: section.subtitle }}
          />
        </div>

        {/* Body */}
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
