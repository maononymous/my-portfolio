import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import { skillSections } from '../../data/skillSections'

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

/**
 * skillObj expected shape (from sections.js):
 * {
 *   id, buttonLabel, moonLabel, blurb, links
 * }
 *
 * animation wrapper shape (optional):
 * { closing, born }
 */
const SkillMoon = ({
  skillObj,
  index,
  total,
  closing,
  born,
  planetId,
  onSkillClick,
}) => {
  const ref = useRef()
  const meshRef = useRef()
  const htmlRef = useRef()
  const isMobileRef = useRef(false)

  const moonTexture = useLoader(TextureLoader, '/textures/2k_moon.jpg')
  const planetTexture = useLoader(
    TextureLoader,
    textureMap[planetId] || textureMap[1]
  )

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
    const isMobile = isMobileRef.current
    const orbitAngle = isMobile ? angle : angle + Math.PI

    if (meshRef.current?.material) {
      const mat = meshRef.current.material
      mat.transparent = true
      mat.depthWrite = false

      const target = behind && !closing ? 0.0 : 1.0
      mat.opacity += (target - mat.opacity) * 0.12

      if (htmlRef.current?.style) {
        htmlRef.current.style.opacity = String(mat.opacity)
        htmlRef.current.style.display = mat.opacity < 0.05 ? 'none' : 'block'
      }
    }

    const startR = PLANET_RADIUS + SPAWN_OFFSET
    let spawnX = 0,
      spawnY = isMobile ? -startR : 0,
      spawnZ = 0

    let orbitX = 0,
      orbitY = 0,
      orbitZ = 0

    if (isMobile) {
      orbitY = Math.cos(angle) * orbitRadius
      orbitZ = Math.sin(angle) * orbitRadius
    } else {
      orbitX = Math.cos(orbitAngle) * orbitRadius
      orbitZ = Math.sin(orbitAngle) * orbitRadius
    }

    const elapsed = performance.now() - born
    const p = Math.min(1, Math.max(0, elapsed / 650))
    const ease = p * p * (3 - 2 * p)

    const x = closing ? orbitX * (1 - ease) : spawnX + (orbitX - spawnX) * ease
    const y = closing ? orbitY * (1 - ease) : spawnY + (orbitY - spawnY) * ease
    const z = closing ? orbitZ * (1 - ease) : spawnZ + (orbitZ - spawnZ) * ease

    ref.current.position.set(x, y, z)

    const s = ref.current.scale.x
    ref.current.scale.setScalar(s + ((closing ? 0 : 1) - s) * 0.1)
  })

  // 🔑 Skill lookup
  const skillKey = skillObj?.id || skillObj?.buttonLabel
  const skillData = skillSections[skillKey]

  const desc = skillData?.description || ''
  const len = desc.length

  // crude but effective “fit” scale — tweak thresholds if you want
  const scale =
    len > 160 ? 0.58 :
    len > 120 ? 0.66 :
    len > 90  ? 0.74 :
    len > 60  ? 0.82 :
                0.9

  return (
    <group ref={ref} scale={[0, 0, 0]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
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
  portal={false}
  ref={htmlRef}
  center
  distanceFactor={10}
  wrapperClass="skill-moon-ui"
  style={{
    pointerEvents: 'auto',
    width: '180px',          // give it more room than 150
    maxWidth: '180px',
    textAlign: 'center',
    cursor: skillData?.link ? 'pointer' : 'default',
    userSelect: 'none',
  }}
>
  <div
    style={{
      fontFamily: '"Source Serif 4","PT Serif",Georgia,serif',
      fontSize: '14px',              // crisp base
      lineHeight: 1.2,
      letterSpacing: '0.01em',
      color: 'rgba(235,235,235,0.92)',
      textShadow: '0 1px 2px rgba(0,0,0,0.45)',

      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform',
    }}
  >
    {skillData?.description}
  </div>
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

/**
 * MoonOverlay now expects skills like:
 * [
 *   { id, buttonLabel, moonLabel, blurb, links, closing?, born? }
 * ]
 *
 * If you still feed animation wrappers, we’ll support both forms:
 * - direct skill objects with (closing, born)
 * - old shape { key, closing, born, ... } where key maps to id
 */
export const MoonOverlay = ({ skills = [], planetId, onSkillClick }) => (
  <Canvas
    className="moon-overlay-canvas"
    dpr={[1, 1.5]}
    gl={{ alpha: true }}
    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    // IMPORTANT: enable pointerEvents so clicks work
    style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'auto' }}
    camera={{ position: [0, 0, 6], fov: 45 }}
  >
    <ResponsiveCamera />
    <ambientLight intensity={0.9} />
    <Suspense fallback={null}>
      {skills.map((s, i) => {
        // Support both new & old shapes:
        const skillObj =
          s && typeof s === 'object' && ('moonLabel' in s || 'buttonLabel' in s || 'links' in s)
            ? s
            : { id: s?.key || String(s), buttonLabel: s?.key || String(s), moonLabel: s?.key || String(s) }

        const key = skillObj.id || s?.key || i

        return (
          <SkillMoon
            key={key}
            skillObj={skillObj}
            closing={s?.closing}
            born={s?.born}
            index={i}
            total={skills.length}
            planetId={planetId}
            onSkillClick={onSkillClick}
          />
        )
      })}
    </Suspense>
  </Canvas>
)

export default PlanetScene
