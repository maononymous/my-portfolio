import React, { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Html } from '@react-three/drei'

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

const SkillMoon = ({ skill, index, total, closing, born }) => {
  const ref = useRef()

  const orbitRadius = ORBIT_BASE + (index % 3) * 0.6
  const speed = 0.005 + index * 0.05 // radians/sec (use clock delta style)
  const offset = total ? (index / total) * Math.PI : 0 // front hemisphere spread

  useFrame(({ clock }) => {
    if (!ref.current) return
    if (!born) return

    const t = clock.getElapsedTime()

    // 0..PI => always front (z >= 0 side)
    const angle = (t * speed + offset) % Math.PI

    const startR = PLANET_RADIUS + SPAWN_OFFSET

    // spawn point: dead-center, front of planet
    const spawnX = 0
    const spawnZ = startR

    // orbit point (front arc)
    const orbitX = Math.cos(angle) * orbitRadius
    const orbitZ = Math.sin(angle) * orbitRadius

    // easing
    const elapsed = performance.now() - born
    const p = Math.min(1, Math.max(0, elapsed / 650))
    const ease = p * p * (3 - 2 * p)

    let x, z

    if (!closing) {
      // OPEN: spawn -> orbit
      x = spawnX + (orbitX - spawnX) * ease
      z = spawnZ + (orbitZ - spawnZ) * ease
    } else {
      // CLOSE: orbit -> planet center (no snapping to spawn)
      const sinkX = 0
      const sinkZ = 0 // tweak: try -0.25 to "sink through" a bit
      x = orbitX + (sinkX - orbitX) * ease
      z = orbitZ + (sinkZ - orbitZ) * ease
    }

    // (Optional) keep this ONLY if you still see popping near camera
    // const SAFE_Z = 5.2
    // z = Math.min(z, SAFE_Z)

    ref.current.position.set(x, 0, z)

    // OPTIONAL scale animation (safe)
    const target = closing ? 0.0 : 1.0
    const s = ref.current.scale.x
    ref.current.scale.setScalar(s + (target - s) * 0.10)
  })

  return (
    <group ref={ref} scale={[1, 1, 1]}>
      <mesh>
        <sphereGeometry args={[0.50, 32, 32]} />
        {/* Basic material = always visible (rules out lighting issues) */}
        <meshStandardMaterial color="#cfd8ff" />
      </mesh>

      {!closing && (
        <Html
          position={[0, 0.35, -3]}
          center
          occlude
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


/* ---------------- SCENE ---------------- */

const PlanetScene = ({ planetId, skills = [], speed = 0.002 }) => {
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

      <RotatingPlanet planetId={planetId} speed={speed} />

      {skills.map((s, i) => (
        <SkillMoon
          key={s.key}
          skill={s.key}
          closing={s.closing}
          born={s.born}
          index={i}
          total={skills.length}
        />
      ))}
    </Canvas>
  )
}

export default PlanetScene
