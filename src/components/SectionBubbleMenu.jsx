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

  // Mobile scroll trap refs
  const mobileOverlayRef = useRef(null)
  const mobileSheetRef = useRef(null)
  const touchStartYRef = useRef(0)

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

  const cols = useMemo(() => {
    const n = Math.max(1, sections.length)
    return Math.min(5, Math.ceil(Math.sqrt(n)))
  }, [sections.length])

  const MAX_ROT = useMemo(() => {
    if (cols >= 5) return 15
    if (cols === 4) return 22
    if (cols === 3) return 30
    return 40
  }, [cols])

  const rotations = useMemo(() => {
    if (!open) return []
    if (isMobile) return []
    return Array.from({ length: sections.length }, () =>
      Math.round((Math.random() * 2 - 1) * MAX_ROT)
    )
  }, [open, isMobile, sections.length, MAX_ROT])

  // ✅ HARD LOCK BACKGROUND SCROLL ON MOBILE (iOS SAFARI)
  useEffect(() => {
    if (!open || !isMobile) return

    // lock document scrolling
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyOverflow = document.body.style.overflow

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    // Prevent background scroll; allow sheet scroll
    const onTouchMove = (e) => {
      const sheet = mobileSheetRef.current
      if (!sheet) {
        e.preventDefault()
        return
      }

      // Only allow scrolling when the gesture is inside the sheet
      if (!sheet.contains(e.target)) {
        e.preventDefault()
        return
      }

      // iOS rubber-band: if at top/bottom and user tries to scroll past,
      // preventDefault so it doesn't scroll the page behind.
      const currentY = e.touches?.[0]?.clientY ?? 0
      const deltaY = currentY - touchStartYRef.current

      const atTop = sheet.scrollTop <= 0
      const atBottom = sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 1

      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      document.removeEventListener('touchmove', onTouchMove)
      document.documentElement.style.overflow = prevHtmlOverflow
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

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sheetBg = mode === 'DNA' ? 'rgba(7,22,24,0.86)' : 'rgba(8,8,10,0.86)'
  const textColor = mode === 'DNA' ? 'rgba(214,207,196,0.95)' : 'rgba(255,255,255,0.92)'

  // ✅ MOBILE: sheet scrolls (overlay does NOT)
  if (isMobile) {
    return (
      <div
        ref={mobileOverlayRef}
        onClick={onClose}
        onTouchStart={(e) => {
          touchStartYRef.current = e.touches?.[0]?.clientY ?? 0
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 3000,
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
          ref={mobileSheetRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 'min(92vw, 560px)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.12)',
            background: sheetBg,

            // ✅ THIS is the scroll container
            maxHeight:
              'calc(100dvh - (env(safe-area-inset-top) + 72px) - (env(safe-area-inset-bottom) + 24px))',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',

            padding: 12,
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              background: sheetBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px 12px',
              color: textColor,
              fontWeight: 600,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
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

          <div style={{ display: 'grid', gap: 10, padding: 10 }}>
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

  // ✅ DESKTOP: pill menu
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
