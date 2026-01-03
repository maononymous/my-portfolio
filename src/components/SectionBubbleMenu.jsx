// src/components/SectionBubbleMenu.jsx
import React, { useMemo } from 'react'
import './BubbleMenu.css'

export default function SectionBubbleMenu({
  open = false,
  onClose,
  onSelectIndex,
  sections = [],
  currentIndex = 0,
  mode = 'Planet',
}) {
  const cols = useMemo(() => {
    const n = Math.max(1, sections.length || 0)
    return Math.min(5, Math.ceil(Math.sqrt(n)))
  }, [sections.length])

  const items = useMemo(() => {
    // ✅ fallback items so you can NEVER get "blur only"
    const base = Array.isArray(sections) && sections.length
      ? sections.map((s) => s?.title ?? '(untitled)')
      : ['TEST ONE', 'TEST TWO', 'TEST THREE']

    return base
  }, [sections])

  if (!open) return null

  return (
    <div
      className={`bubble-menu-items fixed ${mode === 'DNA' ? 'bubble-menu-items--dna' : 'bubble-menu-items--planet'}`}
      onClick={onClose}
      style={{
        display: 'flex',
        pointerEvents: 'auto',
      }}
    >
      {/* ✅ THIS MUST SHOW. If you don't see it, your component isn't the one rendering. */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 999999,
          background: 'rgba(255,0,0,0.85)',
          color: '#fff',
          padding: '8px 10px',
          borderRadius: 10,
          fontSize: 14,
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
        }}
      >
        MENU OPEN ✅ | sections.length = {Array.isArray(sections) ? sections.length : 'NOT ARRAY'}
      </div>

      <ul
        className="pill-list"
        style={{ '--cols': cols }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((title, idx) => (
          <li key={idx} className="pill-col">
            <button
              type="button"
              className={`pill-link ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => {
                onSelectIndex?.(idx)
                onClose?.()
              }}
              style={{
                background: 'rgba(255,255,255,0.85)',
                color: '#111',
                minHeight: 80,
              }}
            >
              <span className="pill-label">{title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
