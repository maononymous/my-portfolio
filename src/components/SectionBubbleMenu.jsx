// src/components/SectionBubbleMenu.jsx
import { useMemo, useRef, useEffect } from 'react'
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
  staggerDelay = 0.10,
}) {
  const overlayRef = useRef(null)
  const pillRefs = useRef([]) // buttons
  const labelRefs = useRef([]) // spans

  const isMobile =
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 899px)').matches
      : false

  // grid columns (mobile CSS forces 1 col)
  const cols = useMemo(() => {
    const n = Math.max(1, sections.length)
    return Math.min(5, Math.ceil(Math.sqrt(n)))
  }, [sections.length])

  // rotation range (reduce automatically when grid is dense)
  const MAX_ROT = useMemo(() => {
    if (isMobile) return 0
    if (cols >= 5) return 15
    if (cols === 4) return 22
    if (cols === 3) return 30
    return 45
  }, [cols, isMobile])

  // stable rotations for THIS open (no jitter while open)
  const rotations = useMemo(() => {
    const n = sections.length
    return Array.from({ length: n }, () =>
      Math.round((Math.random() * 2 - 1) * MAX_ROT)
    )
    // IMPORTANT: depend on open so it re-randomizes each open
  }, [sections.length, MAX_ROT, open])

  // only mount when open (this eliminates "display:none" headaches)
  if (!open) return null

  // ✅ Desktop entrance animation using CSS var --s (scale)
  useEffect(() => {
    const pills = pillRefs.current.filter(Boolean)
    const labels = labelRefs.current.filter(Boolean)
    if (!pills.length) return

    // Always force overlay visible when mounted
    if (overlayRef.current) overlayRef.current.style.display = 'flex'

    // Mobile: no GSAP, just ensure everything is visible
    if (isMobile) {
      pills.forEach((p) => p.style.setProperty('--s', '1'))
      labels.forEach((l) => {
        l.style.opacity = '1'
        l.style.visibility = 'visible'
        l.style.transform = 'none'
      })
      return
    }

    gsap.killTweensOf([...pills, ...labels])

    // Start hidden using CSS var (no transform override)
    pills.forEach((p) => p.style.setProperty('--s', '0'))
    gsap.set(labels, { y: 24, autoAlpha: 0 })

    pills.forEach((pill, i) => {
      const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05)
      const tl = gsap.timeline({ delay })

      tl.to(pill, {
        duration: animationDuration,
        ease: animationEase,
        // animate CSS variable, not transform:
        onUpdate: function () {},
        '--s': 1,
      })

      if (labels[i]) {
        tl.to(
          labels[i],
          { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' },
          `-=${animationDuration * 0.9}`
        )
      }
    })

    return () => gsap.killTweensOf([...pills, ...labels])
  }, [isMobile, rotations, animationEase, animationDuration, staggerDelay])

  const pillBg = mode === 'DNA' ? 'rgba(7,22,24,0.82)' : 'rgba(8,8,10,0.82)'
  const pillColor = mode === 'DNA' ? 'rgba(214,207,196,0.95)' : 'rgba(255,255,255,0.92)'

  return (
    <div
      ref={overlayRef}
      className={`bubble-menu-items fixed ${
        mode === 'DNA' ? 'bubble-menu-items--dna' : 'bubble-menu-items--planet'
      }`}
      onClick={onClose}
      aria-label="Section navigation overlay"
    >
      <ul
        className="pill-list"
        role="menu"
        aria-label="Section links"
        style={{ '--cols': cols }}
        onClick={(e) => e.stopPropagation()}
      >
        {sections.map((s, idx) => {
          const rot = rotations[idx] ?? 0
          return (
            <li key={s.id ?? idx} role="none" className="pill-col">
              <button
                type="button"
                className={`pill-link ${idx === currentIndex ? 'active' : ''}`}
                role="menuitem"
                ref={(el) => {
                  if (el) pillRefs.current[idx] = el
                }}
                style={{
                  '--pill-bg': pillBg,
                  '--pill-color': pillColor,
                  '--hover-bg':
                    mode === 'DNA'
                      ? 'rgba(159,211,199,0.18)'
                      : 'rgba(232,236,255,0.16)',
                  '--hover-color': pillColor,
                  '--item-rot': `${rot}deg`,
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
          )
        })}
      </ul>
    </div>
  )
}
