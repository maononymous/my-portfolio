import React, { useRef, useEffect, useState } from 'react'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene, { MoonOverlay } from './components/three/PlanetScene'
import ModeToggleButton from './components/ModeToggleButton'
import GalaxyOverlay from './components/GalaxyOverlay'
import sections from './data/sections'
import ClickSpark from './components/effects/ClickSpark'
import Galaxy from './components/backgrounds/Galaxy'

const SCROLL_THRESHOLD = 40

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [planetId, setPlanetId] = useState(1)
  const [scrolling, setScrolling] = useState(false)
  const [isCloudVisible, setIsCloudVisible] = useState(false)
  const [cloudDirection, setCloudDirection] = useState('down')
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
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentIndex, scrolling])

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

  return (
    <ClickSpark sparkColor="#ffffff" sparkCount={10} sparkRadius={18} duration={420}>
      <Galaxy />

      <div>
        {/* planet behind text */}
        <PlanetScene planetId={planetId} />

        {/* moons above text */}
        <MoonOverlay skills={skills} planetId={planetId} />

        <GalaxyOverlay direction={cloudDirection} isVisible={isCloudVisible} />

        <ModeToggleButton mode={mode} setMode={setMode} />

        {sections.map(
          (section, index) =>
            index === currentIndex && (
              <PortfolioSection
                key={`${section.id}-${mode}`}
                ref={(el) => (sectionRefs.current[index] = el)}
                section={section}
                mode={mode}
              />
            )
        )}
      </div>
    </ClickSpark>
  )
}

export default App
