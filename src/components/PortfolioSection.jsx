import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const PortfolioSection = React.forwardRef(({ section, mode, dnaPhase = 'revealed' }, ref) => {
  const showDNAContent = mode !== 'DNA' || dnaPhase === 'revealed'

  const isMobile =
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false

  /**
   * =========================
   * CENTER-ANCHORED LAYOUT
   * =========================
   *
   * We pin to a stable anchor point (50% of viewport height),
   * then apply offsets that are consistent across screen sizes.
   *
   * - On desktop: fixed offsets from center (px), not fixed absolute tops.
   * - On mobile: we still stack dynamically, but starting from an anchor
   *   relative to center, not an absolute top.
   */

  // Desktop offsets from viewport center (tweak these once; they’ll scale across screens)
  const DESKTOP_OFFSETS = { title: -120, subtitle: -70, body: 0 } // px from 50% line

  // Mobile anchor offset from center, then stack based on measured heights
  const MOBILE_ANCHOR_OFFSET = -180 // px from 50% line (moves the whole block up/down)
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

  // Measure title/subtitle height on mobile
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  // Store TOPS AS OFFSETS (from center), not absolute px
  const [mobileOffsets, setMobileOffsets] = useState({
    title: MOBILE_ANCHOR_OFFSET,
    subtitle: MOBILE_ANCHOR_OFFSET + 60,
    body: MOBILE_ANCHOR_OFFSET + 120,
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

  // Measure title/subtitle on mobile and compute OFFSETS from center
  useLayoutEffect(() => {
    if (!isMobile) return

    const compute = () => {
      const titleH = titleRef.current?.offsetHeight ?? 0
      const subtitleH = subtitleRef.current?.offsetHeight ?? 0

      const titleOffset = MOBILE_ANCHOR_OFFSET
      const subtitleOffset = titleOffset + titleH + GAP_TITLE_SUBTITLE
      const bodyOffset = subtitleOffset + subtitleH + GAP_SUBTITLE_BODY

      setMobileOffsets({ title: titleOffset, subtitle: subtitleOffset, body: bodyOffset })
    }

    compute()

    const ro = new ResizeObserver(compute)
    if (titleRef.current) ro.observe(titleRef.current)
    if (subtitleRef.current) ro.observe(subtitleRef.current)

    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [isMobile, section.id, section.title, section.subtitle])

  const OFFSETS = isMobile ? mobileOffsets : DESKTOP_OFFSETS

  // Helpers: convert offset -> CSS top (center-anchored)
  const topFromCenter = (offsetPx) => `calc(50% + ${offsetPx}px)`

  // Glass positioning: align to title top and cover through body + measured body height
  const GLASS_TOP = `calc(50% + ${OFFSETS.title - (GLASS_TOP_PAD + GLASS_PAD)}px)`

  // Use delta between title/body offsets to keep glass consistent
  const glassSpan = (OFFSETS.body - OFFSETS.title) + glassBodyHeight + GLASS_TOP_PAD + GLASS_BOTTOM_PAD + GLASS_PAD * 2
  const GLASS_HEIGHT = Math.max(220, glassSpan)

  const textColor =
    mode === 'DNA'
      ? '#262626'
      : 'rgba(220, 220, 220, 0.85)'

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
          className={`section-glass ${mode === 'DNA' ? 'section-glass--dna' : 'section-glass--planet'}`}
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
        <div style={{ position: 'absolute', top: topFromCenter(OFFSETS.title), left: 0, right: 0 }}>
          <h2
            ref={titleRef}
            style={{
              margin: 0,
              lineHeight: 1.1,
              color: textColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.35)',
            }}
          >
            {section.title}
          </h2>
        </div>

        {/* Subtitle */}
        <div style={{ position: 'absolute', top: topFromCenter(OFFSETS.subtitle), left: 0, right: 0 }}>
          <h4
            ref={subtitleRef}
            style={{
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.25,
              color: textColor,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
            dangerouslySetInnerHTML={{ __html: section.subtitle }}
          />
        </div>

        {/* Body */}
        <div style={{ position: 'absolute', top: topFromCenter(OFFSETS.body), left: 0, right: 0 }}>
          {mode === 'DNA' ? (
            <p
              style={{
                margin: 0,
                lineHeight: 1.6,
                color: 'rgba(20, 20, 20, 0.9)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {section.dnaContent}
            </p>
          ) : (
            <div
              className="planet-text"
              style={{
                lineHeight: 1.6,
                color: 'rgba(215, 215, 215, 0.82)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
              dangerouslySetInnerHTML={{ __html: section.planetContent }}
            />
          )}
        </div>
      </motion.div>
    </motion.section>
  )
})

export default PortfolioSection
