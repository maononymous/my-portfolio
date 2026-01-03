// components/SectionMenu.jsx
import React from 'react'

export default function SectionMenu({ open, mode, sections, currentIndex, onClose, onSelect }) {
  if (!open) return null

  return (
    <div className={`sectionMenuOverlay ${mode === 'DNA' ? 'isDNA' : 'isPlanet'}`} onClick={onClose}>
      <div className="sectionMenuPanel" onClick={(e) => e.stopPropagation()}>
        <div className="sectionMenuHeader">
          <div className="sectionMenuTitle">Sections</div>
          <button className="sectionMenuClose" type="button" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="sectionMenuList">
          {sections.map((s, i) => (
            <button
              key={s.id || i}
              type="button"
              className={`sectionMenuItem ${i === currentIndex ? 'active' : ''}`}
              onClick={() => onSelect(i)}
            >
              <div className="sectionMenuItemTitle">{s.title}</div>
              {s.subtitle ? <div className="sectionMenuItemSub">{s.subtitle}</div> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
