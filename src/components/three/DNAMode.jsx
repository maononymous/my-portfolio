// components/three/DNAMode.jsx
import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DNAHelixMesh from './DNAHelixMesh'

function seeded01(seed) {
  const x = Math.sin(seed * 999.123) * 10000
  return x - Math.floor(x)
}
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function DNAHelix({ activeIndex, direction, onTransitionState }) {
  const groupRef = useRef()
  const transitioningRef = useRef(false)
  const rafRef = useRef(0)

  // stable per section, used to “shift” the helix slice
  const targetPhase = useMemo(() => {
    const step = Math.PI * 0.65
    return activeIndex * step
  }, [activeIndex])

  const phaseRef = useRef(targetPhase)

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    transitioningRef.current = true
    onTransitionState?.('transitioning')

    const dir = direction === 'down' ? 1 : -1
    const startTime = performance.now()
    const DURATION = 800

    const group = groupRef.current
    const startRot = group?.rotation?.y ?? 0
    const targetRot = startRot + dir * Math.PI // rotation per scroll

    const startY = group?.position?.y ?? 0
    const targetY = -dir * 0.28

    const startPhase = phaseRef.current
    const endPhase = targetPhase

    const tick = (t) => {
      const p = Math.min(1, (t - startTime) / DURATION)
      const e = easeInOutQuad(p)

      if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(startRot, targetRot, e)
        groupRef.current.position.y = THREE.MathUtils.lerp(startY, targetY, e)
      }

      phaseRef.current = THREE.MathUtils.lerp(startPhase, endPhase, e)

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (groupRef.current) groupRef.current.position.y = 0
      phaseRef.current = endPhase

      transitioningRef.current = false
      onTransitionState?.('revealed')
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [activeIndex, direction, targetPhase])

  // optional idle rotate (turn off while debugging)
  useFrame(() => {
    if (!transitioningRef.current && groupRef.current) {
        groupRef.current.rotation.y += 0.002
    }
  })

  const ACTIVE_RUNG_PALETTE = [
  '#00e5ff', // cyan
  '#ff4dff', // magenta
  '#7CFF6B', // neon green
  '#FFD54A', // gold
  '#9B7CFF', // violet
]


  const activeRungColor = useMemo(() => {
    const palette = ACTIVE_RUNG_PALETTE
    return palette[activeIndex % palette.length]
  }, [activeIndex])

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
        phase={phaseRef.current}
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
        pointerEvents: 'none',
        background: '#000000',
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
  )
}
