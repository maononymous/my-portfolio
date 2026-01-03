// src/components/SectionBubbleMenu.jsx
import { useRef, useEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import './BubbleMenu.css'

export default function SectionBubbleMenu({
  open,
  onClose,
  onSelectIndex,
  sections,
  currentIndex,
  mode,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.10,
}) {
  const overlayRef = useRef(null)
  const bubblesRef = useRef([]) // buttons
  const labelRefs = useRef([])  // spans

  // ✅ robust mobile detection (updates on rotate / resize)
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

  // columns for desktop grid; CSS forces 1 col on mobile anyway
  const cols = useMemo(() => {
    const n = Math.max(1, sections.length)
    return Math.min(5, Math.ceil(Math.sqrt(n)))
  }, [sections.length])

  // random rotation range (tune MAX if you want)
  const MAX_ROT = useMemo(() => (cols >= 5 ? 15 : cols === 4 ? 22 : cols === 3 ? 30 : 45), [cols])

  // ✅ rotations generated once per open (so they stay stable while open)
  const menuItems = useMemo(() => {
    return sections.map((s) => ({
      label: s.title,
      ariaLabel: s.title,
      rotation: Math.round((Math.random() * 2 - 1) * MAX_ROT),
      hoverStyles:
        mode === 'DNA'
          ? { bgColor: 'rgba(159,211,199,0.18)', textColor: 'rgba(214,207,196,0.95)' }
          : { bgColor: 'rgba(232,236,255,0.16)', textColor: 'rgba(255,255,255,0.92)' },
    }))
    // intentionally include open so you get fresh randomness each open
  }, [sections, mode, MAX_ROT, open])

  const pillBg = mode === 'DNA' ? 'rgba(7,22,24,0.82)' : 'rgba(8,8,10,0.82)'
  const pillColor = mode === 'DNA' ? 'rgba(214,207,196,0.95)' : 'rgba(255,255,255,0.92)'

  // ✅ Desktop GSAP only. Mobile = no GSAP (instant render).
  useEffect(() => {
    if (!open) return
    if (isMobile) return

    const overlay = overlayRef.current
    if (!overlay) return

    const bubbles = bubblesRef.current.filter(Boolean)
    const labels = labelRefs.current.filter(Boolean)
    if (!bubbles.length) return

    gsap.set(overlay, { display: 'flex' })
    gsap.killTweensOf([...bubbles, ...labels])

    gsap.set(bubbles, {
      scale: 0,
      rotation: (i) => menuItems[i]?.rotation ?? 0,
      transformOrigin: '50% 50%',
    })
    gsap.set(labels, { y: 24, autoAlpha: 0 })

    bubbles.forEach((bubble, i) => {
      const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05)
      const tl = gsap.timeline({ delay })

      tl.to(bubble, {
        scale: 1,
        rotation: menuItems[i]?.rotation ?? 0,
        duration: animationDuration,
        ease: animationEase,
      })

      if (labels[i]) {
        tl.to(
          labels[i],
          { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' },
          `-=${animationDuration * 0.9}`
        )
      }
    })

    return () => {
      gsap.killTweensOf([...bubbles, ...labels])
    }
  }, [open, isMobile, menuItems, animationEase, animationDuration, staggerDelay])

  // ✅ Close behavior: desktop animates out; mobile just hides
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    if (open) {
      // ensure visible (especially on mobile)
      overlay.style.display = 'flex'
      return
    }

    // closed
    if (isMobile) {
      overlay.style.display = 'none'
      return
    }

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
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      ref={overlayRef}
      className={`bubble-menu-items fixed ${mode === 'DNA' ? 'bubble-menu-items--dna' : 'bubble-menu-items--planet'}`}
      aria-hidden={!open}
      onClick={onClose}
      // ✅ mobile: show/hide via normal style (no GSAP dependency)
      style={isMobile ? { display: open ? 'flex' : 'none' } : undefined}
    >
      <ul
        className="pill-list"
        role="menu"
        aria-label="Section links"
        style={{ '--cols': cols }}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, idx) => (
          <li key={idx} role="none" className="pill-col">
            <button
              type="button"
              className={`pill-link ${idx === currentIndex ? 'active' : ''}`}
              aria-label={item.ariaLabel || item.label}
              style={{
                '--pill-bg': pillBg,
                '--pill-color': pillColor,
                '--hover-bg': item.hoverStyles?.bgColor || 'rgba(255,255,255,0.08)',
                '--hover-color': item.hoverStyles?.textColor || pillColor,

                // ✅ Mobile: apply rotation directly (no GSAP transforms involved)
                ...(isMobile ? { transform: `rotate(${item.rotation}deg)` } : null),
              }}
              ref={(el) => {
                if (el) bubblesRef.current[idx] = el
              }}
              onClick={() => {
                onSelectIndex?.(idx)
                onClose?.()
              }}
              title={item.label}
            >
              <span
                className="pill-label"
                ref={(el) => {
                  if (el) labelRefs.current[idx] = el
                }}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
