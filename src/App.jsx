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

// ✅ NEW: global fixed overlay
import PortfolioTextOverlay from './components/PortfolioTextOverlay'

const SCROLL_THRESHOLD = 40

/* ---------------- SOCIAL FAB (bottom-right) ---------------- */

const IconGitHub = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.8-.25.8-.56v-2c-3.26.72-3.95-1.4-3.95-1.4-.53-1.35-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.2 1.8 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.72-1.56-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.5.12-3.12 0 0 .98-.31 3.2 1.2a11 11 0 0 1 5.82 0c2.22-1.51 3.2-1.2 3.2-1.2.64 1.62.24 2.82.12 3.12.75.82 1.2 1.87 1.2 3.15 0 4.5-2.75 5.5-5.36 5.79.41.35.78 1.05.78 2.13v3.15c0 .31.21.66.8.55A11.5 11.5 0 0 0 12 .5z" />
  </svg>
)

const IconLinkedIn = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 23.5h4V7.98h-4V23.5zM8.5 7.98h3.83v2.12h.05c.53-1 1.83-2.12 3.77-2.12 4.03 0 4.78 2.65 4.78 6.1v9.42h-4v-8.36c0-2-.04-4.57-2.79-4.57-2.8 0-3.23 2.17-3.23 4.42v8.51h-4V7.98z" />
  </svg>
)

const IconMail = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...props}>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
)

function SocialFab() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const links = [
    {
      key: 'github',
      label: 'GitHub',
      href: 'https://github.com/maononymous',
      Icon: IconGitHub,
      dx: 0,
      dy: -72,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/abdullahomermohammed',
      Icon: IconLinkedIn,
      dx: -56,
      dy: -56,
    },
    {
      key: 'email',
      label: 'Email',
      href: 'mailto:mabdul23@depaul.edu',
      Icon: IconMail,
      dx: -72,
      dy: 0,
    },
  ]

  useEffect(() => {
    const onDocDown = (e) => {
      if (!open) return
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDocDown)
    return () => document.removeEventListener('pointerdown', onDocDown)
  }, [open])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 100,
        userSelect: 'none',
      }}
    >
      {/* Items */}
      {links.map(({ key, label, href, Icon, dx, dy }, i) => (
        <a
          key={key}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          aria-label={label}
          title={label}
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 44,
            height: 44,
            borderRadius: 999,
            display: 'grid',
            placeItems: 'center',
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.92)',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.16)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transform: open
              ? `translate(${dx}px, ${dy}px) scale(1)`
              : 'translate(0px, 0px) scale(0.82)',
            transition:
              'transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 240ms ease',
            transitionDelay: open ? `${i * 50}ms` : '0ms',
          }}
        >
          <Icon style={{ fill: 'currentColor' }} />
        </a>
      ))}

      {/* Main button */}
      <button
        type="button"
        aria-label={open ? 'Close links' : 'Open links'}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: 'rgba(255,255,255,0.92)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        }}
      >
        <span
          style={{
            fontSize: 16,
            lineHeight: 1,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 240ms ease',
          }}
        >
          ✦
        </span>
      </button>
    </div>
  )
}

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

  // ✅ NEW: reveal for global text overlay (0 = DNA, 1 = Planet)
  // On mobile/non-split we keep it snapped to the active mode.
  // On split, default is 0.5 unless SplitView provides a ratio callback.
  const [reveal, setReveal] = useState(0.5)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 900px)')
    const update = () => setSplitEnabled(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // ✅ Keep overlay reveal in sync when NOT in split mode
  useEffect(() => {
    if (splitEnabled) return
    setReveal(mode === 'DNA' ? 0 : 1)
  }, [mode, splitEnabled])

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

  const activeSection = sections[currentIndex]

  return (
    <ClickSpark sparkColor="#ffffff" sparkCount={10} sparkRadius={18} duration={420}>
      <Galaxy />

      <PortfolioTextOverlay
        section={activeSection}
        reveal={reveal}
        mode={splitEnabled ? 'Split' : mode}
        dnaPhase={dnaPhase}
      />

      {/* ✅ Bottom-right social FAB */}
      <SocialFab />

      <div>
        <SplitView
          enabled={splitEnabled}
          left={planetLayer}
          right={dnaLayer}
          active={mode === 'DNA' ? 'right' : 'left'}
          reveal={reveal}
          onRevealChange={setReveal}
        />

        {!splitEnabled && <ModeToggleButton mode={mode} setMode={setMode} />}

        <SectionNavButton
          mode={splitEnabled ? 'Planet' : mode}
          planetId={planetId}
          onClick={() => setMenuOpen(true)}
          isDesktop={splitEnabled}
        />

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
