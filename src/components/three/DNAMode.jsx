// components/three/DNAMode.jsx
import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DNAHelixMesh from './DNAHelixMesh'
import FloatingLines from '../backgrounds/FloatingLines'

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function DNAHelix({ activeIndex, direction, dnaPhase, onTransitionState }) {
  const groupRef = useRef()
  const transitioningRef = useRef(false)
  const rafRef = useRef(0)

  const rotRef = useRef(0)

  const ACTIVE_RUNG_PALETTE = useMemo(
    () => [
      '#8b1e3f', // deep crimson
      '#1f3c88', // royal indigo
      '#0f5132', // forest green
      '#4a235a', // dark violet
      '#003f3f', // dark cyan
    ],
    []
  )

  const activeRungColor = useMemo(() => {
    const c = ACTIVE_RUNG_PALETTE[activeIndex % ACTIVE_RUNG_PALETTE.length]
    return dnaPhase === 'revealed' ? c : '#d6cfc4' // hide highlight until revealed
  }, [activeIndex, dnaPhase, ACTIVE_RUNG_PALETTE])

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

    const tick = (t) => {
      const p = Math.min(1, (t - startTime) / DURATION)
      const e = easeInOutQuad(p)

      if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(startRot, targetRot, e)
        groupRef.current.position.y = THREE.MathUtils.lerp(startY, targetY, e)
      }

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (groupRef.current) groupRef.current.position.y = 0

      transitioningRef.current = false
      onTransitionState?.('activated')
      window.setTimeout(() => onTransitionState?.('revealed'), 140)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => rafRef.current && cancelAnimationFrame(rafRef.current)
  }, [activeIndex, direction]) // keep deps tight

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
        rungInset={1}
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

// Background mounts once, never re-renders unless YOU change these memo'd values.
const DNABackground = React.memo(function DNABackground() {
  const enabledWaves = useMemo(() => ['top', 'middle', 'bottom'], [])
  const lineCount = useMemo(() => [20, 5, 40], [])
  const lineDistance = useMemo(() => [20, 5, 40], [])
  const linesGradient = useMemo(() => ['#0b1c1f', '#123233', '#1a4a4a'], [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}>
      <FloatingLines
        enabledWaves={enabledWaves}
        lineCount={lineCount}
        lineDistance={lineDistance}
        bendRadius={8.0}
        bendStrength={-1.0}
        interactive={true}
        parallax={true}
        parallaxStrength={0.3}
        linesGradient={linesGradient}
        mixBlendMode="normal"
      />
    </div>
  )
})

export default function DNAMode({ activeIndex, direction, dnaPhase, onPhaseChange }) {
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
      {/* FloatingLines background (stable, does NOT restart on scroll) */}
      <DNABackground />

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
            dnaPhase={dnaPhase}
            onTransitionState={(phase) => onPhaseChange?.(phase)}
          />
        </Canvas>
      </div>
    </div>
  )
}
