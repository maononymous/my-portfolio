// App.jsx
import React, { useRef, useEffect, useState } from 'react'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene, { MoonOverlay } from './components/three/PlanetScene'
import ModeToggleButton from './components/ModeToggleButton'
import GalaxyOverlay from './components/GalaxyOverlay'
import sections from './data/sections'
import ClickSpark from './components/effects/ClickSpark'
import Galaxy from './components/backgrounds/Galaxy'
import { isTypingTarget } from './utils/isTypingTarget'
import SectionNavButton from './components/SectionNavButton'
import SectionMenu from './components/SectionMenu'
import DNAMode from './components/three/DNAMode'
import SectionBubbleMenu from './components/SectionBubbleMenu'

const SCROLL_THRESHOLD = 40

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [planetId, setPlanetId] = useState(1)
  const [scrolling, setScrolling] = useState(false)
  const [isCloudVisible, setIsCloudVisible] = useState(false)
  const [cloudDirection, setCloudDirection] = useState('down')
  const [lastScrollDir, setLastScrollDir] = useState('down')
  const [dnaPhase, setDnaPhase] = useState('revealed')
  const sectionRefs = useRef([])
  const [skills, setSkills] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  /* ---------------- MENU SECTION ---------------- */

  const jumpToIndex = (targetIndex) => {
    if (scrolling) return
    if (targetIndex === currentIndex) return
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const direction = targetIndex > currentIndex ? 'down' : 'up'
    setLastScrollDir(direction)

    // Planet: keep your exact transition
    if (mode === 'Planet') {
      setCloudDirection(direction)
      setScrolling(true)
      setIsCloudVisible('entry')

      setTimeout(() => {
        setCurrentIndex(targetIndex)
        setPlanetId((prev) => (prev % 5) + 1) // if you want this to tick once per jump
        setSkills([])
        setIsCloudVisible('exit')
      }, 800)

      setTimeout(() => {
        setIsCloudVisible(false)
        setScrolling(false)
      }, 2000)

      return
    }

    // DNA: keep your exact behavior
    setDnaPhase('transitioning')
    setScrolling(true)
    setCurrentIndex(targetIndex)
    setTimeout(() => setScrolling(false), 900)
  }

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

  useEffect(() => {
    let startX = 0
    let startY = 0
    let tracking = false

    const THRESHOLD = 55        // swipe distance
    const MAX_OFF_AXIS = 80     // ignore mostly horizontal gestures

    const onTouchStart = (e) => {
      const t = e.touches?.[0]
      if (!t) return
      tracking = true
      startX = t.clientX
      startY = t.clientY
    }

    const onTouchMove = (e) => {
      // prevent iOS “rubber band” / back-swipe weirdness while tracking
      if (tracking) e.preventDefault()
    }

    const onTouchEnd = (e) => {
      if (!tracking) return
      tracking = false

      const t = e.changedTouches?.[0]
      if (!t) return

      const dx = t.clientX - startX
      const dy = t.clientY - startY

      // ignore mostly horizontal swipes
      if (Math.abs(dx) > MAX_OFF_AXIS || Math.abs(dx) > Math.abs(dy)) return
      if (Math.abs(dy) < THRESHOLD) return

      const direction = dy < 0 ? 'down' : 'up'
      if (scrolling) return

      const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= sections.length) return

      setLastScrollDir(direction)

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

      setDnaPhase('transitioning')
      setScrolling(true)
      setCurrentIndex(nextIndex)
      setTimeout(() => setScrolling(false), 900)
    }

    const optsStart = { passive: true, capture: true }
    const optsMove  = { passive: false, capture: true }
    const optsEnd   = { passive: true, capture: true }

    window.addEventListener('touchstart', onTouchStart, optsStart)
    window.addEventListener('touchmove', onTouchMove, optsMove)
    window.addEventListener('touchend', onTouchEnd, optsEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart, optsStart)
      window.removeEventListener('touchmove', onTouchMove, optsMove)
      window.removeEventListener('touchend', onTouchEnd, optsEnd)
    }
  }, [currentIndex, mode, scrolling])

  /* ---------------- KEYBOARD NAV (UPDATED) ---------------- */

  useEffect(() => {
    const doStep = (direction) => {
      if (scrolling) return

      const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= sections.length) return

      setLastScrollDir(direction)

      // ✅ Planet mode: identical behavior to wheel
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

      // ✅ DNA mode: identical behavior to wheel
      setDnaPhase('transitioning')
      setScrolling(true)
      setCurrentIndex(nextIndex)
      setTimeout(() => setScrolling(false), 900)
    }

    const onKeyDown = (e) => {
      if (isTypingTarget(document.activeElement)) return

      const key = e.key

      // Move down
      if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
        e.preventDefault()
        doStep('down')
        return
      }

      // Move up
      if (key === 'ArrowUp' || key === 'PageUp') {
        e.preventDefault()
        doStep('up')
        return
      }

      // Home / End (jump)
      if (key === 'Home') {
        e.preventDefault()
        if (scrolling) return
        if (currentIndex === 0) return

        // treat as repeated "up" jumps? nope — instant jump with your current animation rules:
        // We'll do a single transition to target by stepping until you implement menu/jump properly.
        // For now, do one step so it stays consistent with your transition system.
        doStep('up')
        return
      }

      if (key === 'End') {
        e.preventDefault()
        if (scrolling) return
        if (currentIndex === sections.length - 1) return
        doStep('down')
        return
      }
    }

    window.addEventListener('keydown', onKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [currentIndex, scrolling, mode]) // keep deps simple + correct

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

        <SectionNavButton
          mode={mode}
          planetId={planetId}
          onClick={() => setMenuOpen(true)}
        />

        <SectionBubbleMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          sections={sections}
          currentIndex={currentIndex}
          mode={mode}
          onSelectIndex={(i) => {
            setMenuOpen(false)
            jumpToIndex(i)
          }}
        />

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
