// PortfolioTextOverlay.jsx
import React from 'react'

export default function PortfolioTextOverlay({
  section,
  reveal = 0.5, // 0 = DNA, 1 = Planet
  locked = true,
}) {
  if (!section) return null

  // clamp reveal
  const r = Math.min(1, Math.max(0, reveal))

  // DNA visible on left side, Planet visible on right side
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
      {/* centered frame */}
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
        {/* TITLE */}
        <Band top="18vh">
          <Layer clipPath={dnaMask} className="portfolio-section mode-dna">
            <h2 style={styles.h2}>{section.title}</h2>
          </Layer>
          <Layer clipPath={planetMask} className="portfolio-section mode-planet">
            <h2 style={styles.h2}>{section.title}</h2>
          </Layer>
        </Band>

        {/* SUBTITLE */}
        <Band top="26vh">
          <Layer clipPath={dnaMask} className="portfolio-section mode-dna">
            <h4
              style={styles.h4}
              dangerouslySetInnerHTML={{ __html: section.subtitle }}
            />
          </Layer>
          <Layer clipPath={planetMask} className="portfolio-section mode-planet">
            <h4
              style={styles.h4}
              dangerouslySetInnerHTML={{ __html: section.subtitle }}
            />
          </Layer>
        </Band>

        {/* BODY */}
        <Band top="34vh">
          <Layer clipPath={dnaMask} className="portfolio-section mode-dna">
            <p style={styles.p}>{section.dnaContent}</p>
          </Layer>
          <Layer clipPath={planetMask} className="portfolio-section mode-planet">
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

function Layer({ clipPath, className, children }) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        clipPath,
        WebkitClipPath: clipPath,
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
