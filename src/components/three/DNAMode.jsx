// components/three/DNAMode.jsx
import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DNAHelixMesh from './DNAHelixMesh'
import FloatingLines from '../backgrounds/FloatingLines'

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function DNAHelix({ activeIndex, direction, onTransitionState }) {
  const groupRef = useRef()
  const transitioningRef = useRef(false)
  const rafRef = useRef(0)

  // ✅ single source of truth for helix continuity
  const rotRef = useRef(0)

  const PHASE_STEP = Math.PI // how much the helix advances per section

  const ACTIVE_RUNG_PALETTE = useMemo(
    () => ['#00e5ff', '#ff4dff', '#7CFF6B', '#FFD54A', '#9B7CFF'],
    []
  )

  const activeRungColor = useMemo(() => {
    return ACTIVE_RUNG_PALETTE[activeIndex % ACTIVE_RUNG_PALETTE.length]
  }, [activeIndex, ACTIVE_RUNG_PALETTE])

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    transitioningRef.current = true
    onTransitionState?.('transitioning')

    const dir = direction === 'down' ? 1 : -1
    const startTime = performance.now()
    const DURATION = 800

    const group = groupRef.current
    const startRot = rotRef.current
    const targetRot = startRot + dir * Math.PI * 0.65
    rotRef.current = targetRot

    const startY = group?.position?.y ?? 0
    const targetY = -dir * 0.28

    // ✅ cumulative phase (no snapping to activeIndex * step)
    //const startPhase = phaseRef.current
    //const endPhase = startPhase + dir * PHASE_STEP

    const tick = (t) => {
      const p = Math.min(1, (t - startTime) / DURATION)
      const e = easeInOutQuad(p)

      if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(startRot, targetRot, e)
        groupRef.current.position.y = THREE.MathUtils.lerp(startY, targetY, e)
      }

      //phaseRef.current = THREE.MathUtils.lerp(startPhase, endPhase, e)

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (groupRef.current) groupRef.current.position.y = 0
      //phaseRef.current = endPhase

      transitioningRef.current = false
      onTransitionState?.('activated')
      window.setTimeout(() => onTransitionState?.('revealed'), 140)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => rafRef.current && cancelAnimationFrame(rafRef.current)

    // ✅ IMPORTANT: do NOT include onTransitionState in deps (it changes every render)
  }, [activeIndex, direction])

  // keep this OFF (your “keeps rotating” complaint)
  useFrame(() => {
    if (!transitioningRef.current && groupRef.current) groupRef.current.rotation.y += 0.002
  })

  return (
    <group ref={groupRef}>
      <DNAHelixMesh
        height={7.4}
        turns={0.74}
        radius={2.5}
        segments={400}
        railRadius={0.074}
        rungEvery={17}
        rungInset={0.95}
        rungRadius={0.037}
        rungOpacity={0.8}
        helixColor="#d6cfc4"
        activeRungColor={activeRungColor}
        sectionSeed={activeIndex}
        phase={0}
      />
    </group>
  )
}

export default function DNAMode({ activeIndex, direction, onPhaseChange }) {
  useEffect(() => {
    onPhaseChange?.('revealed')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'auto',
    }}
  >
    {/* FloatingLines background */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'auto',
      }}
    >
      <FloatingLines
        enabledWaves={['top', 'middle', 'bottom']}
        lineCount={[20, 5, 40]}
        lineDistance={[20, 5, 40]}
        bendRadius={8.0}
        bendStrength={-1.0}
        interactive={true}
        parallax={true}
        parallaxStrength={0.3}
        linesGradient={[
  '#0b1c1f',
  '#123233',
  '#1a4a4a'
]}
      />
    </div>

    {/* DNA Three.js canvas */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 6]} intensity={0.9} />

        <DNAHelix
          activeIndex={activeIndex}
          direction={direction}
          onTransitionState={(phase) => onPhaseChange?.(phase)}
        />
      </Canvas>
    </div>
  </div>
)
}