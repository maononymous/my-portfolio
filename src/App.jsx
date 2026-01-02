// App.jsx
import React, { useRef, useEffect, useState } from 'react'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene, { MoonOverlay } from './components/three/PlanetScene'
import ModeToggleButton from './components/ModeToggleButton'
import GalaxyOverlay from './components/GalaxyOverlay'
import sections from './data/sections'
import ClickSpark from './components/effects/ClickSpark'
import Galaxy from './components/backgrounds/Galaxy'

// NEW
import DNAMode from './components/three/DNAMode'

const SCROLL_THRESHOLD = 40

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [planetId, setPlanetId] = useState(1)
  const [scrolling, setScrolling] = useState(false)
  const [isCloudVisible, setIsCloudVisible] = useState(false)
  const [cloudDirection, setCloudDirection] = useState('down')
  const [lastScrollDir, setLastScrollDir] = useState('down')

  // NEW: DNA text gating
  const [dnaPhase, setDnaPhase] = useState('revealed') // 'transitioning' | 'activated' | 'revealed'

  const sectionRefs = useRef([])
  const [skills, setSkills] = useState([])

  /* ---------------- SCROLL HANDLING ---------------- */

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault()
      if (scrolling || Math.abs(e.deltaY) < SCROLL_THRESHOLD) return

      const direction = e.deltaY > 0 ? 'down' : 'up'
      const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= sections.length) return

      setLastScrollDir(direction)

      // ✅ Planet mode: keep your exact behavior
      if (mode === 'Planet') {
        setCloudDirection(direction)
        setScrolling(true)
        setIsCloudVisible('entry')

        setTimeout(() => {
          setCurrentIndex(nextIndex)
          setPlanetId((prev) => (prev % 5) + 1)
          setSkills([])
          setIsCloudVisible('exit')
        }, 800)

        setTimeout(() => {
          setIsCloudVisible(false)
          setScrolling(false)
        }, 2000)

        return
      }

      // ✅ DNA mode: do NOT touch planetId/clouds/skills
      // Hide text immediately; DNA helix will reveal it when ready
      setDnaPhase('transitioning')
      setScrolling(true)
      setCurrentIndex(nextIndex)

      // Scroll lock duration should match DNA transition duration (~800ms) + a little buffer
      setTimeout(() => setScrolling(false), 900)
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentIndex, scrolling, mode])

  /* ---------------- MODE SWITCH SAFETY ---------------- */

  useEffect(() => {
    // When switching into DNA mode, ensure text is allowed unless DNA triggers otherwise.
    if (mode === 'DNA') setDnaPhase('revealed')
  }, [mode])

  /* ---------------- SKILL CLICK HANDLING ---------------- */

  useEffect(() => {
    const CLOSE_MS = 750

    const closeAll = () => {
      const now = performance.now()
      setSkills((prev) => prev.map((s) => ({ ...s, closing: true, born: now })))
      window.setTimeout(() => setSkills([]), CLOSE_MS)
    }

    const onDocumentClick = (e) => {
      const el = e.target.closest?.('.skill')

      if (el) {
        e.preventDefault()
        e.stopPropagation()

        const key = el.getAttribute('data-skill') || el.textContent?.trim()
        if (!key) return

        if (skills.length) closeAll()

        window.setTimeout(() => {
          setSkills((prev) =>
            prev.some((s) => s.key === key)
              ? prev
              : [...prev, { key, closing: false, born: performance.now() }]
          )
        }, skills.length ? CLOSE_MS : 0)

        return
      }

      if (skills.length) closeAll()
    }

    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [skills])

  /* ---------------- RENDER ---------------- */

  const showPlanet = mode === 'Planet'
  const showDNA = mode === 'DNA'

  return (
    <ClickSpark sparkColor="#ffffff" sparkCount={10} sparkRadius={18} duration={420}>
      <Galaxy />

      <div>
        {/* ---------------- PLANET LAYER (mounted always; hidden in DNA mode) ---------------- */}
        <div style={{ opacity: showPlanet ? 1 : 0, pointerEvents: showPlanet ? 'auto' : 'none' }}>
          {/* planet behind text */}
          <PlanetScene planetId={planetId} />

          {/* moons above text */}
          <MoonOverlay skills={skills} planetId={planetId} />

          <GalaxyOverlay direction={cloudDirection} isVisible={isCloudVisible} />
        </div>

        {/* ---------------- DNA LAYER (mounted always; hidden in Planet mode) ---------------- */}
        <div style={{ opacity: showDNA ? 1 : 0, pointerEvents: showDNA ? 'auto' : 'none' }}>
          <DNAMode
            activeIndex={currentIndex}
            direction={lastScrollDir}
            dnaPhase={dnaPhase}
            onPhaseChange={setDnaPhase}
          />
        </div>

        {/* Toggle stays global */}
        <ModeToggleButton mode={mode} setMode={setMode} />

        {/* Text stays as-is; DNA gating is via dnaPhase */}
        {sections.map(
          (section, index) =>
            index === currentIndex && (
              <PortfolioSection
                key={`${section.id}-${mode}`}
                ref={(el) => (sectionRefs.current[index] = el)}
                section={section}
                mode={mode}
                dnaPhase={dnaPhase}
              />
            )
        )}
      </div>
    </ClickSpark>
  )
}

export default App
