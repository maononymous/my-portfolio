import React, { useEffect, useRef, useState } from 'react'
import './SplitView.css'

export default function SplitView({ enabled, left, right, initial = 0.5 }) {
  const rootRef = useRef(null)
  const draggingRef = useRef(false)
  const [t, setT] = useState(initial) // 0..1

  useEffect(() => {
    if (!enabled) return

    const onMove = (e) => {
      if (!draggingRef.current) return
      const el = rootRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const nextT = Math.min(1, Math.max(0, x / rect.width))
      setT(nextT)
    }

    const onUp = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      document.body.classList.remove('splitview-dragging')
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      document.body.classList.remove('splitview-dragging')
      draggingRef.current = false
    }
  }, [enabled])

  if (!enabled) {
    return <>{left}</>
  }

  const pct = `${t * 100}%`

  return (
    <div ref={rootRef} className="splitview-root">
      {/* LEFT (Planet) */}
      <div
        className="splitview-layer"
        style={{ clipPath: `inset(0 calc(100% - ${pct}) 0 0)` }}
      >
        {left}
      </div>

      {/* RIGHT (DNA) */}
      <div className="splitview-layer" style={{ clipPath: `inset(0 0 0 ${pct})` }}>
        {right}
      </div>

      {/* Divider */}
      <div
        className="splitview-divider"
        style={{ left: pct }}
        onPointerDown={(e) => {
          e.preventDefault()
          draggingRef.current = true
          document.body.classList.add('splitview-dragging')
        }}
        role="slider"
        aria-label="Split view divider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(t * 100)}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 0.05 : 0.01
          if (e.key === 'ArrowLeft') setT((v) => Math.max(0, v - step))
          if (e.key === 'ArrowRight') setT((v) => Math.min(1, v + step))
          if (e.key === 'Home') setT(0)
          if (e.key === 'End') setT(1)
        }}
      >
        <div className="splitview-divider-hit" />
      </div>
    </div>
  )
}
