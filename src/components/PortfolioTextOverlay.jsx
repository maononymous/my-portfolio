import React from 'react'

export default function PortfolioTextOverlay({
  section,
  reveal = 0.5, // 0 = DNA, 1 = Planet
  locked = true,
}) {
  if (!section) return null

  // clamp reveal
  const r = Math.min(1, Math.max(0, reveal))
  const leftPct = `${r * 100}%`

  // If you want DNA on right / Planet on left, swap these masks.
  const dnaMask = `inset(0 ${100 - r * 100}% 0 0)`
  const planetMask = `inset(0 0 0 ${r * 100}%)`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {/* text frame centered horizontally */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
          width: 'min(800px, calc(100vw - 4rem))',
          height: '100%',
        }}
      >
        {/* Optional: show slider split line position (debug) */}
        {/* <div style={{ position:'absolute', top:0, bottom:0, left:leftPct, width:1, background:'rgba(255,255,255,0.15)' }} /> */}

        {/* TITLE band */}
        <Band top="18vh">
          <Layer clipPath={dnaMask} opacity={1}>
            <h2 style={styles.h2}>{section.title}</h2>
          </Layer>
          <Layer clipPath={planetMask} opacity={1}>
            <h2 style={styles.h2}>{section.title}</h2>
          </Layer>
        </Band>

        {/* SUBTITLE band */}
        <Band top="26vh">
          <Layer clipPath={dnaMask} opacity={1}>
            <h4
              style={styles.h4}
              dangerouslySetInnerHTML={{ __html: section.subtitle }}
            />
          </Layer>
          <Layer clipPath={planetMask} opacity={1}>
            <h4
              style={styles.h4}
              dangerouslySetInnerHTML={{ __html: section.subtitle }}
            />
          </Layer>
        </Band>

        {/* BODY band */}
        <Band top="34vh">
          <Layer clipPath={dnaMask} opacity={1}>
            <p style={styles.p}>{section.dnaContent}</p>
          </Layer>
          <Layer clipPath={planetMask} opacity={1}>
            <div
              className="planet-text"
              style={styles.p}
              dangerouslySetInnerHTML={{ __html: section.planetContent }}
            />
          </Layer>
        </Band>
      </div>
    </div>
  )
}

function Band({ top, children }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
      }}
    >
      {children}
    </div>
  )
}

function Layer({ clipPath, opacity, children }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        clipPath,
        WebkitClipPath: clipPath,
        opacity,
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  )
}

const styles = {
  h2: { margin: 0, lineHeight: 1.1 },
  h4: { margin: 0, fontWeight: 400, lineHeight: 1.25 },
  p: { margin: 0, lineHeight: 1.6 },
}
