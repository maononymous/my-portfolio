import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
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
  const htmlRef = useRef()
  const isMobileRef = useRef(false)

  const moonTexture = useLoader(TextureLoader, '/textures/2k_moon.jpg')
  const planetTexture = useLoader(TextureLoader, textureMap[planetId] || textureMap[1])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => (isMobileRef.current = mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  const orbitRadius = ORBIT_BASE + (index % 3) * 0.6
  const speed = -0.05 - index * 0.05
  const offset = total ? (index / total) * Math.PI : 0
  const angleRef = useRef(offset)

  useFrame((_, delta) => {
    if (!ref.current || !born) return

    if (meshRef.current) meshRef.current.rotation.y += 0.001

    angleRef.current = (angleRef.current + delta * speed) % (Math.PI * 2)

    const behind = Math.sin(angleRef.current) > 0
    const BEHIND_FAST = 30
    const effectiveSpeed = behind ? speed * BEHIND_FAST : speed
    angleRef.current = (angleRef.current + delta * effectiveSpeed) % (Math.PI * 2)

    const angle = angleRef.current

    // ✅ define isMobile BEFORE using it
    const isMobile = isMobileRef.current
    const orbitAngle = isMobile ? angle : angle + Math.PI

    if (meshRef.current?.material) {
      const mat = meshRef.current.material
      mat.transparent = true
      mat.blending = THREE.NormalBlending
      mat.depthWrite = false

      const target = behind && !closing ? 0.0 : 1.0
      mat.opacity += (target - mat.opacity) * 0.12

      if (htmlRef.current?.style) {
        htmlRef.current.style.opacity = String(mat.opacity)
        htmlRef.current.style.display = mat.opacity < 0.05 ? 'none' : 'block'
      }
    }

    const startR = PLANET_RADIUS + SPAWN_OFFSET

    // Spawn start
    let spawnX = 0,
      spawnY = 0,
      spawnZ = 0

    if (isMobile) {
      // MOBILE: unchanged
      spawnY = -startR
      spawnZ = 0
    } else {
      // DESKTOP: spawn at CENTER
      spawnX = 0
      spawnZ = 0
    }

    // Orbit target
    let orbitX = 0,
      orbitY = 0,
      orbitZ = 0

    if (isMobile) {
      orbitY = Math.cos(angle) * orbitRadius
      orbitZ = Math.sin(angle) * orbitRadius
    } else {
      // DESKTOP: phase-shifted so it heads LEFT first
      orbitX = Math.cos(orbitAngle) * orbitRadius
      orbitZ = Math.sin(orbitAngle) * orbitRadius
    }

    const elapsed = performance.now() - born
    const p = Math.min(1, Math.max(0, elapsed / 650))
    const ease = p * p * (3 - 2 * p)

    let x, y, z
    if (!closing) {
      x = spawnX + (orbitX - spawnX) * ease
      y = spawnY + (orbitY - spawnY) * ease
      z = spawnZ + (orbitZ - spawnZ) * ease
    } else {
      x = orbitX * (1 - ease)
      y = orbitY * (1 - ease)
      z = orbitZ * (1 - ease)
    }

    ref.current.position.set(x, y, z)

    const s = ref.current.scale.x
    const targetScale = closing ? 0.0 : 1.0
    ref.current.scale.setScalar(s + (targetScale - s) * 0.10)
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
        />
      </mesh>

      <Html
        ref={htmlRef}
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
    </group>
  )
}

/* ---------------- CAMERA ---------------- */

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / size.height
    let z = 6
    let fov = 45

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

/* ---------------- SCENES ---------------- */

const PlanetScene = ({ planetId, speed = 0.002 }) => (
  <Canvas
    dpr={[1, 1.5]}
    style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
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

export const MoonOverlay = ({ skills = [], planetId }) => (
  <Canvas
    dpr={[1, 1.5]}
    gl={{ alpha: true }}
    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none' }}
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

export default PlanetScene
