// src/components/SectionBubbleMenu.jsx
import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import './BubbleMenu.css'

function fitLabelToPill(labelEl, pillEl, opts = {}) {
  const {
    maxPx = 34,
    minPx = 12,
    step = 1,
    safetyPadding = 24, // accounts for left+right padding
  } = opts

  if (!labelEl || !pillEl) return

  // Reset to max first
  let size = maxPx
  labelEl.style.fontSize = `${size}px`

  // Available width inside pill
  const available = Math.max(0, pillEl.clientWidth - safetyPadding)

  // Shrink until it fits
  // scrollWidth reflects rendered width of the label
  while (size > minPx && labelEl.scrollWidth > available) {
    size -= step
    labelEl.style.fontSize = `${size}px`
  }
}

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
  const isMobile = window.innerWidth < 900

  const menuItems = useMemo(() => {
    return sections.map((s, i) => ({
      label: s.title,
      ariaLabel: s.title,
      rotation: isMobile ? Math.round((Math.random() * 40) - 20) : Math.round((Math.random() * 45) - 22.5),
      hoverStyles:
        mode === 'DNA'
          ? { bgColor: 'rgba(159,211,199,0.18)', textColor: 'rgba(214,207,196,0.95)' }
          : { bgColor: 'rgba(232,236,255,0.16)', textColor: 'rgba(255,255,255,0.92)' },
    }))
  }, [sections, mode])

  const cols = useMemo(() => {
    const n = Math.max(1, sections.length)
    return Math.min(5, Math.ceil(Math.sqrt(n)))
  }, [sections.length])

  const pillBg = mode === 'DNA' ? 'rgba(7,22,24,0.82)' : 'rgba(8,8,10,0.82)'
  const pillColor = mode === 'DNA' ? 'rgba(214,207,196,0.95)' : 'rgba(255,255,255,0.92)'

  // ✅ Fit text whenever menu opens, and whenever pills resize
  useEffect(() => {
    if (!open) return

    const pills = bubblesRef.current.filter(Boolean)
    const labels = labelRefs.current.filter(Boolean)
    if (!pills.length || !labels.length) return

    const doFitAll = () => {
      for (let i = 0; i < pills.length; i++) {
        const pill = pills[i]
        const label = labels[i]
        if (!pill || !label) continue

        // Choose a max font based on pill size (helps big pills stay bold)
        const maxPx = Math.min(40, Math.max(18, Math.floor(pill.clientWidth / 9)))
        fitLabelToPill(label, pill, { maxPx, minPx: 12, step: 1, safetyPadding: 28 })
      }
    }

    // Fit immediately (next frame ensures layout settled)
    const raf = requestAnimationFrame(doFitAll)

    // Refit on resize of each pill
    const ro = new ResizeObserver(() => doFitAll())
    pills.forEach((p) => ro.observe(p))

    // Also refit on window resize (belt + suspenders)
    window.addEventListener('resize', doFitAll)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', doFitAll)
    }
  }, [open, sections.length, cols])

  // GSAP open/close animation (your existing behavior)
  useEffect(() => {
    const overlay = overlayRef.current
    const bubbles = bubblesRef.current.filter(Boolean)
    const labels = labelRefs.current.filter(Boolean)

    if (!overlay) return

    if (open) {
      gsap.set(overlay, { display: 'flex' })

      if (!bubbles.length) return

      gsap.killTweensOf([...bubbles, ...labels])
      gsap.set(bubbles, { scale: 0, rotation: (i) => menuItems[i]?.rotation ?? 0, transformOrigin: '50% 50%' })
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
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out',
            },
            `-=${animationDuration * 0.9}`
          )
        }
      })
    } else {
      if (!bubbles.length) {
        gsap.set(overlay, { display: 'none' })
        return
      }

      gsap.killTweensOf([...bubbles, ...labels])
      gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.2, ease: 'power3.in' })
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }
  }, [open, animationEase, animationDuration, staggerDelay])

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
                '--item-rot': `${item.rotation ?? 0}deg`,
                '--pill-bg': pillBg,
                '--pill-color': pillColor,
                '--hover-bg': item.hoverStyles?.bgColor || 'rgba(255,255,255,0.08)',
                '--hover-color': item.hoverStyles?.textColor || pillColor,
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
