import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { html } from 'framer-motion/client'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

/* ---------------- TEXTURES ---------------- */

const textureMap = {
  1: '/textures/2k_mars.jpg',
  2: '/textures/2k_jupiter.jpg',
  3: '/textures/2k_neptune.jpg',
  4: '/textures/2k_makemake_fictional.jpg',
  5: '/textures/2k_ceres_fictional.jpg',
}

/* ---------------- PLANET ---------------- */

const RotatingPlanet = ({ planetId, speed }) => {
  const meshRef = useRef()
  const texture = useLoader(TextureLoader, textureMap[planetId] || textureMap[1])

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += speed
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

/* ---------------- MOON ---------------- */

const PLANET_RADIUS = 2
const SPAWN_OFFSET = 0.4
const ORBIT_BASE = 3.1

const isMobileRef = useRef(false)

useEffect(() => {
  const mq = window.matchMedia('(max-width: 768px)')
  const update = () => (isMobileRef.current = mq.matches)
  update()
  mq.addEventListener?.('change', update)
  return () => mq.removeEventListener?.('change', update)
}, [])


const SkillMoon = ({ skill, index, total, closing, born, planetId }) => {
  const ref = useRef()
  const meshRef = useRef()
  const labelVisibleRef = useRef(true)
  const htmlRef = useRef()

  const moonTexture = useLoader(TextureLoader, '/textures/2k_moon.jpg')
  const planetTexture = useLoader(
    TextureLoader,
    textureMap[planetId] || textureMap[1]
  )

  const orbitRadius = ORBIT_BASE + (index % 3) * 0.6
  const speed = 0.05 + index * 0.05
  const offset = total ? (index / total) * Math.PI : 0

  const angleRef = useRef(offset) // start each moon at its offset

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    if (!born) return

    // self-rotation
    if (meshRef.current) meshRef.current.rotation.y += 0.001

    // 🔹 FULL ORBIT ANGLE (no jump)
    const BEHIND_FAST = 10
    angleRef.current = (angleRef.current + delta * speed) % (Math.PI * 2)

    // determine behind AFTER angle update (more accurate)
    const behind = Math.sin(angleRef.current) < 0

    // speed up while behind
    const effectiveSpeed = behind ? speed * BEHIND_FAST : speed
    angleRef.current = (angleRef.current + delta * effectiveSpeed) % (Math.PI * 2)

    const angle = angleRef.current

    // ✅ FADE (imperative, works)
    // ✅ FADE (hard-test first, then smooth)
    if (meshRef.current?.material) {
      const mat = meshRef.current.material

      // make sure blending/alpha actually applies
      mat.transparent = true
      mat.blending = THREE.NormalBlending
      mat.depthWrite = false

      const target = behind && !closing ? 0.0 : 1.0
      mat.opacity = mat.opacity + (target - mat.opacity) * 0.12
      if (htmlRef.current?.style) {
        htmlRef.current.style.opacity = String(mat.opacity)
        htmlRef.current.style.display = mat.opacity < 0.05 ? 'none' : 'block'
      }
    }

    const startR = PLANET_RADIUS + SPAWN_OFFSET

    // --- choose orbit plane based on device ---
    const isMobile = isMobileRef.current

    // Orbit target
    let orbitX = 0, orbitY = 0, orbitZ = 0
    if (isMobile) {
      // Mobile: Y–Z plane (vertical on screen)
      orbitY = Math.cos(angle) * orbitRadius
      orbitZ = Math.sin(angle) * orbitRadius
    } else {
      // Desktop: X–Z plane (your current horizontal orbit)
      orbitX = Math.cos(angle) * orbitRadius
      orbitZ = Math.sin(angle) * orbitRadius
    }

    // Spawn start
    let spawnX = 0, spawnY = 0, spawnZ = 0
    if (isMobile) {
      // Mobile: start below the planet
      spawnY = -startR
      spawnZ = 0
    } else {
      // Desktop: your current start "in front"
      spawnX = 0
      spawnZ = startR
    }
    // easing (keep your existing)
    const elapsed = performance.now() - born
    const p = Math.min(1, Math.max(0, elapsed / 650))
    const ease = p * p * (3 - 2 * p)

    let x, y, z

    if (!closing) {
      // OPEN: spawn -> orbit
      x = spawnX + (orbitX - spawnX) * ease
      y = spawnY + (orbitY - spawnY) * ease
      z = spawnZ + (orbitZ - spawnZ) * ease
    } else {
      // CLOSE: orbit -> center
      const sinkX = 0, sinkY = 0, sinkZ = 0
      x = orbitX + (sinkX - orbitX) * ease
      y = orbitY + (sinkY - orbitY) * ease
      z = orbitZ + (sinkZ - orbitZ) * ease
    }

    ref.current.position.set(x, y, z)

    // scale
    const target = closing ? 0.0 : 1.0
    const s = ref.current.scale.x
    ref.current.scale.setScalar(s + (target - s) * 0.10)
  })

  return (
    <group ref={ref} scale={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          map={moonTexture}
          emissiveMap={planetTexture}
          emissive="#ffffff"
          emissiveIntensity={0.2}
          roughness={1}
          metalness={0.1}
          transparent
          //opacity={1} // real opacity is driven imperatively in useFrame
        />
      </mesh>

      {(
        <Html
          ref={htmlRef}
          position={[0, 0, 0]}
          center
          distanceFactor={10}
          style={{
            fontSize: '12px',
            color: '#e8ecff',
            opacity: 0.9,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {skill}
        </Html>
      )}
    </group>
  )
}

/* ---------------- SCENES ---------------- */

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height

    // Base values (your current)
    let z = 6
    let fov = 45

    // If screen is tall/narrow (portrait phones), back camera up a bit
    if (aspect < 0.75) {
      z = 10
      fov = 48
    } else if (aspect < 1.0) {
      z = 6.6
      fov = 46
    }

    camera.position.set(0, 0, z)
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  return null
}

// ✅ Planet canvas: behind everything
const PlanetScene = ({ planetId, speed = 0.002 }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <RotatingPlanet planetId={planetId} speed={speed} />
      </Suspense>
    </Canvas>
  )
}

// ✅ Moon overlay canvas: ABOVE your portfolio text
export const MoonOverlay = ({ skills = [], planetId }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={0.9} />
      <Suspense fallback={null}>
        {skills.map((s, i) => (
          <SkillMoon
            key={s.key}
            skill={s.key}
            closing={s.closing}
            born={s.born}
            index={i}
            total={skills.length}
            planetId={planetId}
          />
        ))}
      </Suspense>
    </Canvas>
  )
}

export default PlanetScene
