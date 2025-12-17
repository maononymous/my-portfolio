import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'

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

const SkillMoon = ({ skill, index, total, closing, born, planetId }) => {
  const ref = useRef()
  const meshRef = useRef()

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
    }

    const startR = PLANET_RADIUS + SPAWN_OFFSET

    // spawn point: dead-center, front of planet
    const spawnX = 0
    const spawnZ = startR

    // orbit point (full circle, but sped up when behind)
    const orbitX = Math.cos(angle) * orbitRadius
    const orbitZ = Math.sin(angle) * orbitRadius

    // easing (born is reset on close in App.jsx)
    const elapsed = performance.now() - born
    const p = Math.min(1, Math.max(0, elapsed / 650))
    const ease = p * p * (3 - 2 * p)

    let x, z

    if (!closing) {
      // OPEN: spawn -> orbit
      x = spawnX + (orbitX - spawnX) * ease
      z = spawnZ + (orbitZ - spawnZ) * ease
    } else {
      // CLOSE: orbit -> planet center
      const sinkX = 0
      const sinkZ = 0
      x = orbitX + (sinkX - orbitX) * ease
      z = orbitZ + (sinkZ - orbitZ) * ease
    }

    ref.current.position.set(x, 0, z)

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

      {!closing && (
        <Html
          position={[0, 0.75, 0]}
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

// ✅ Planet canvas: behind everything
const PlanetScene = ({ planetId, speed = 0.002 }) => {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
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
