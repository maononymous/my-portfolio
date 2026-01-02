// components/three/DNAMode.jsx
import React, { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DNAHelixMesh from './DNAHelixMesh'
import FloatingLines from '../backgrounds/FloatingLines'
import { useThree } from '@react-three/fiber'

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height

    let z = 6
    let fov = 45

    if (aspect < 0.75) {
      z = 15
      fov = 50
    } else if (aspect < 1.0) {
      z = 6.8
      fov = 47
    }

    camera.position.set(0, 0, z)
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  return null
}

function DNAHelix({ activeIndex, direction, dnaPhase, onTransitionState }) {
  const groupRef = useRef()
  const transitioningRef = useRef(false)
  const rafRef = useRef(0)

  const rotRef = useRef(0)

  // ramp timing for smooth "resume rotation"
  const resumeAtRef = useRef(0)
  const resumeRampMs = 220
  const skipNextFrameRef = useRef(false)

  // ✅ ensure constant rotation is full-speed on first mount (no accidental ramp-from-zero)
  useEffect(() => {
    resumeAtRef.current = performance.now() - resumeRampMs
  }, [])

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
    return dnaPhase === 'revealed' ? c : '#d6cfc4' // show highlight only after revealed
  }, [activeIndex, dnaPhase, ACTIVE_RUNG_PALETTE])

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    transitioningRef.current = true
    onTransitionState?.('transitioning')

    const dir = direction === 'down' ? 1 : -1
    const startTime = performance.now()
    const DURATION = 800

    const group = groupRef.current

    // ✅ start from ACTUAL visible rotation (prevents start jerk)
    const startRot = group?.rotation?.y ?? rotRef.current
    rotRef.current = startRot

    const targetRot = startRot + dir * Math.PI 

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

      // ✅ lock final values exactly (prevents end jitter)
      if (groupRef.current) {
        groupRef.current.rotation.y = targetRot
        groupRef.current.position.y = 0
      }
      rotRef.current = targetRot

      // ✅ ramp rotation back in smoothly (prevents end "kick")
      resumeAtRef.current = performance.now()

      transitioningRef.current = false

      skipNextFrameRef.current = true
      onTransitionState?.('activated')
      window.setTimeout(() => onTransitionState?.('revealed'), 140)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => rafRef.current && cancelAnimationFrame(rafRef.current)
  }, [activeIndex, direction]) // keep deps tight

  useFrame(() => {
    const g = groupRef.current
    if (!g) return

    if (skipNextFrameRef.current) {
      skipNextFrameRef.current = false
      rotRef.current = g.rotation.y // keep sync
      return
    }


    // during transition: tick() owns rotation
    if (transitioningRef.current) {
      // keep ref synced anyway (safety)
      rotRef.current = g.rotation.y
      return
    }

    // ramp back to constant speed after transition
    const now = performance.now()
    const t = Math.min(1, (now - resumeAtRef.current) / resumeRampMs)
    const ramp = t * t * (3 - 2 * t) // smoothstep 0->1
    const speed = 0.002 * ramp

    g.rotation.y += speed
    rotRef.current = g.rotation.y // ✅ keep ref synced always
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
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
          <ResponsiveCamera />
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
