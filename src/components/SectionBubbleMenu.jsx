import React, { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './BubbleMenu.css'

export default function SectionBubbleMenu({
  open,
  onClose,
  onSelectIndex,
  sections = [],
  currentIndex = 0,
  mode = 'Planet',
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12,
}) {
  const overlayRef = useRef(null)
  const bubblesRef = useRef([])
  const labelRefs = useRef([])

  const mobileOverlayRef = useRef(null)
  const mobileSheetRef = useRef(null)


  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 899px)').matches : false
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 899px)')
    const handler = () => setIsMobile(mq.matches)
    handler()
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  // Desktop grid columns (mobile uses simple list menu)
  const cols = useMemo(() => {
    const n = Math.max(1, sections.length)
    return Math.min(5, Math.ceil(Math.sqrt(n)))
  }, [sections.length])

  // Rotation range (desktop only)
  const MAX_ROT = useMemo(() => {
    if (cols >= 5) return 15
    if (cols === 4) return 22
    if (cols === 3) return 30
    return 40
  }, [cols])

  // Stable random rotations while menu is open (desktop only)
  const rotations = useMemo(() => {
    if (!open) return []
    if (isMobile) return []
    return Array.from({ length: sections.length }, () =>
      Math.round((Math.random() * 2 - 1) * MAX_ROT)
    )
  }, [open, isMobile, sections.length, MAX_ROT])

  // ✅ iOS-safe scroll lock: block background, allow scroll inside menu
  useEffect(() => {
    if (!open || !isMobile) return

    const overlayEl = mobileOverlayRef.current

    const prevent = (e) => {
      // allow scrolling INSIDE the overlay
      if (overlayEl && overlayEl.contains(e.target)) return
      e.preventDefault()
    }

    // lock page scroll
    const prevOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    // critical for iOS
    document.addEventListener('touchmove', prevent, { passive: false })

    return () => {
      document.removeEventListener('touchmove', prevent)
      document.documentElement.style.overflow = prevOverflow
      document.body.style.overflow = prevBodyOverflow
    }
  }, [open, isMobile])


  // -------- DESKTOP GSAP OPEN --------
  useEffect(() => {
    if (!open) return
    if (isMobile) return

    const overlay = overlayRef.current
    if (!overlay) return

    const bubbles = bubblesRef.current.filter(Boolean)
    const labels = labelRefs.current.filter(Boolean)

    // show overlay
    gsap.set(overlay, { display: 'flex' })

    const run = () => {
      const b = bubblesRef.current.filter(Boolean)
      const l = labelRefs.current.filter(Boolean)
      if (!b.length) return

      gsap.killTweensOf([...b, ...l])
      gsap.set(b, {
        scale: 0,
        rotation: (i) => rotations[i] ?? 0,
        transformOrigin: '50% 50%',
      })
      gsap.set(l, { y: 24, autoAlpha: 0 })

      b.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05)
        const tl = gsap.timeline({ delay })

        tl.to(bubble, {
          scale: 1,
          rotation: rotations[i] ?? 0,
          duration: animationDuration,
          ease: animationEase,
        })

        if (l[i]) {
          tl.to(
            l[i],
            { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' },
            `-=${animationDuration * 0.9}`
          )
        }
      })
    }

    // If refs aren’t ready on first paint, retry next frame
    if (!bubbles.length) requestAnimationFrame(run)
    else run()

    return () => {
      gsap.killTweensOf([
        ...bubblesRef.current.filter(Boolean),
        ...labelRefs.current.filter(Boolean),
      ])
    }
  }, [open, isMobile, rotations, animationEase, animationDuration, staggerDelay])

  // -------- DESKTOP GSAP CLOSE --------
  useEffect(() => {
    if (open) return
    if (isMobile) return

    const overlay = overlayRef.current
    if (!overlay) return

    const bubbles = bubblesRef.current.filter(Boolean)
    const labels = labelRefs.current.filter(Boolean)

    if (!bubbles.length) {
      overlay.style.display = 'none'
      return
    }

    gsap.killTweensOf([...bubbles, ...labels])
    gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.2, ease: 'power3.in' })
    gsap.to(bubbles, {
      scale: 0,
      duration: 0.2,
      ease: 'power3.in',
      onComplete: () => {
        overlay.style.display = 'none'
      },
    })
  }, [open, isMobile])

  // ESC close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  // Simple mobile sheet theme (independent of BubbleMenu.css)
  const sheetBg = mode === 'DNA' ? 'rgba(7,22,24,0.86)' : 'rgba(8,8,10,0.86)'
  const textColor = mode === 'DNA' ? 'rgba(214,207,196,0.95)' : 'rgba(255,255,255,0.92)'

  // ✅ MOBILE: simple list (stable, always visible)
  if (isMobile) {
    return (
      <div
        ref={mobileOverlayRef}
        onClick={onClose}
        onTouchMove={(e) => e.stopPropagation()}  // ✅ keep touch events inside
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 3000,

          // ✅ make THIS the scroll container
          height: '100dvh',
          width: '100vw',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',

          background: mode === 'DNA' ? 'rgba(0,10,12,0.38)' : 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',

          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 'calc(env(safe-area-inset-top) + 72px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
        }}
        aria-label="Section menu"
      >

        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 'min(92vw, 560px)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.12)',
            background: sheetBg,
            padding: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px 12px',
              color: textColor,
              fontWeight: 600,
            }}
          >
            <span>Sections</span>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.14)',
                color: textColor,
                borderRadius: 10,
                padding: '8px 10px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {sections.map((s, idx) => (
              <button
                key={s.id ?? idx}
                type="button"
                onClick={() => {
                  onSelectIndex?.(idx)
                  onClose?.()
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background:
                    idx === currentIndex
                      ? 'rgba(232,236,255,0.12)'
                      : 'rgba(255,255,255,0.06)',
                  color: textColor,
                  cursor: 'pointer',
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ✅ DESKTOP: pill menu (uses BubbleMenu.css)
  return (
    <div
      ref={overlayRef}
      className={`bubble-menu-items fixed ${
        mode === 'DNA' ? 'bubble-menu-items--dna' : 'bubble-menu-items--planet'
      }`}
      aria-hidden={!open}
      onClick={onClose}
    >
      <ul
        className="pill-list"
        role="menu"
        aria-label="Section links"
        style={{ '--cols': cols }}
        onClick={(e) => e.stopPropagation()}
      >
        {sections.map((s, idx) => (
          <li key={s.id ?? idx} role="none" className="pill-col">
            <button
              type="button"
              className={`pill-link ${idx === currentIndex ? 'active' : ''}`}
              role="menuitem"
              style={{ '--item-rot': `${rotations[idx] ?? 0}deg` }}
              ref={(el) => {
                if (el) bubblesRef.current[idx] = el
              }}
              onClick={() => {
                onSelectIndex?.(idx)
                onClose?.()
              }}
              title={s.title}
            >
              <span
                className="pill-label"
                ref={(el) => {
                  if (el) labelRefs.current[idx] = el
                }}
              >
                {s.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
