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
import DNAMode from './components/three/DNAMode'
import SectionBubbleMenu from './components/SectionBubbleMenu'
import SplitView from './components/SplitView'

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

  // ✅ Desktop-only split view (>= 900px)
  const [splitEnabled, setSplitEnabled] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 900px)').matches : true
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 900px)')
    const update = () => setSplitEnabled(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  /* ---------------- MENU SECTION ---------------- */

  const runTransitionToIndex = (targetIndex, direction) => {
    // direction is 'down' | 'up'
    setLastScrollDir(direction)

    // ✅ Desktop split: ALWAYS run both systems (Planet clouds + DNA helix)
    if (splitEnabled) {
      setCloudDirection(direction)
      setDnaPhase('transitioning')

      setScrolling(true)
      setIsCloudVisible('entry')

      setTimeout(() => {
        setCurrentIndex(targetIndex)
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

    // ✅ Mobile / non-split: keep your exact old behavior (mode-gated)
    if (mode === 'Planet') {
      setCloudDirection(direction)
      setScrolling(true)
      setIsCloudVisible('entry')

      setTimeout(() => {
        setCurrentIndex(targetIndex)
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
    setCurrentIndex(targetIndex)
    setTimeout(() => setScrolling(false), 900)
  }

  const jumpToIndex = (targetIndex) => {
    if (scrolling) return
    if (targetIndex === currentIndex) return
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const direction = targetIndex > currentIndex ? 'down' : 'up'
    runTransitionToIndex(targetIndex, direction)
  }

  /* ---------------- SCROLL HANDLING ---------------- */

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault()
      if (scrolling || Math.abs(e.deltaY) < SCROLL_THRESHOLD) return

      const direction = e.deltaY > 0 ? 'down' : 'up'
      const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= sections.length) return

      runTransitionToIndex(nextIndex, direction)
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentIndex, scrolling, mode, splitEnabled])

  useEffect(() => {
    let startX = 0
    let startY = 0
    let tracking = false

    const THRESHOLD = 55
    const MAX_OFF_AXIS = 80

    const onTouchStart = (e) => {
      if (menuOpen) return
      const t = e.touches?.[0]
      if (!t) return
      tracking = true
      startX = t.clientX
      startY = t.clientY
    }

    const onTouchMove = (e) => {
      if (menuOpen) return
      if (tracking) e.preventDefault()
    }

    const onTouchEnd = (e) => {
      if (menuOpen) return
      if (!tracking) return
      tracking = false

      const t = e.changedTouches?.[0]
      if (!t) return

      const dx = t.clientX - startX
      const dy = t.clientY - startY

      if (Math.abs(dx) > MAX_OFF_AXIS || Math.abs(dx) > Math.abs(dy)) return
      if (Math.abs(dy) < THRESHOLD) return

      const direction = dy < 0 ? 'down' : 'up'
      if (scrolling) return

      const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= sections.length) return

      runTransitionToIndex(nextIndex, direction)
    }

    const optsStart = { passive: true, capture: true }
    const optsMove = { passive: false, capture: true }
    const optsEnd = { passive: true, capture: true }

    window.addEventListener('touchstart', onTouchStart, optsStart)
    window.addEventListener('touchmove', onTouchMove, optsMove)
    window.addEventListener('touchend', onTouchEnd, optsEnd)

    return () => {
      window.removeEventListener('touchstart', onTouchStart, optsStart)
      window.removeEventListener('touchmove', onTouchMove, optsMove)
      window.removeEventListener('touchend', onTouchEnd, optsEnd)
    }
  }, [currentIndex, mode, scrolling, menuOpen, splitEnabled])

  /* ---------------- KEYBOARD NAV ---------------- */

  useEffect(() => {
    const doStep = (direction) => {
      if (scrolling) return

      const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= sections.length) return

      runTransitionToIndex(nextIndex, direction)
    }

    const onKeyDown = (e) => {
      if (isTypingTarget(document.activeElement)) return

      const key = e.key

      if (key === 'ArrowDown' || key === 'PageDown' || key === ' ') {
        e.preventDefault()
        doStep('down')
        return
      }

      if (key === 'ArrowUp' || key === 'PageUp') {
        e.preventDefault()
        doStep('up')
        return
      }

      if (key === 'Home') {
        e.preventDefault()
        if (scrolling) return
        if (currentIndex === 0) return
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
  }, [currentIndex, scrolling, mode, splitEnabled])

  /* ---------------- MODE SWITCH SAFETY ---------------- */

  useEffect(() => {
    if (!splitEnabled && mode === 'DNA') setDnaPhase('revealed')
  }, [mode, splitEnabled])

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

  const showPlanet = splitEnabled ? true : mode === 'Planet'
  const showDNA = splitEnabled ? true : mode === 'DNA'

  const planetLayer = (
    <div style={{ opacity: showPlanet ? 1 : 0, pointerEvents: showPlanet ? 'auto' : 'none' }}>
      <PlanetScene planetId={planetId} />
      <MoonOverlay skills={skills} planetId={planetId} />
      <GalaxyOverlay direction={cloudDirection} isVisible={isCloudVisible} />

      {sections.map(
        (section, index) =>
          index === currentIndex && (
            <PortfolioSection
              key={`${section.id}-Planet`}
              ref={(el) => (sectionRefs.current[index] = el)}
              section={section}
              mode="Planet"
              dnaPhase={dnaPhase}
            />
          )
      )}
    </div>
  )

  const dnaLayer = (
    <div style={{ opacity: showDNA ? 1 : 0, pointerEvents: showDNA ? 'auto' : 'none' }}>
      <DNAMode
        activeIndex={currentIndex}
        direction={lastScrollDir}
        dnaPhase={dnaPhase}
        onPhaseChange={setDnaPhase}
      />

      {sections.map(
        (section, index) =>
          index === currentIndex && (
            <PortfolioSection
              key={`${section.id}-DNA`}
              ref={(el) => (sectionRefs.current[index] = el)}
              section={section}
              mode="DNA"
              dnaPhase={dnaPhase}
            />
          )
      )}
    </div>
  )

  return (
    <ClickSpark sparkColor="#ffffff" sparkCount={10} sparkRadius={18} duration={420}>
      <Galaxy />

      <div>
        {/* ✅ Split view on desktop, fallback to planet-only when disabled */}
        <SplitView enabled={splitEnabled} left={planetLayer} right={dnaLayer} active={mode === 'DNA' ? 'right' : 'left'} />

        {/* ✅ Hide toggle on desktop split, keep it on mobile */}
        {!splitEnabled && <ModeToggleButton mode={mode} setMode={setMode} />}

        <SectionNavButton mode={splitEnabled ? 'Planet' : mode} planetId={planetId} onClick={() => setMenuOpen(true)} />

        <SectionBubbleMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          sections={sections}
          currentIndex={currentIndex}
          mode={splitEnabled ? 'Planet' : mode}
          onSelectIndex={(idx) => jumpToIndex(idx)}
        />
      </div>
    </ClickSpark>
  )
}

export default App
