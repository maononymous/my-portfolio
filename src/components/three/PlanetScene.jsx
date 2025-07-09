import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { Stars } from '@react-three/drei'

const RotatingPlanet = ({ triggerSpin }) => {
  const meshRef = useRef()
  const spinSpeed = useRef(0.002)
  const timeoutRef = useRef(null)
  const texture = useLoader(TextureLoader, '/textures/2k_mars.jpg')

  useEffect(() => {
    spinSpeed.current = 0.2
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      spinSpeed.current = 0.002
    }, 600)
  }, [triggerSpin])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += spinSpeed.current
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

const PlanetScene = ({ triggerSpin }) => {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <RotatingPlanet triggerSpin={triggerSpin} />
    </Canvas>
  )
}

export default PlanetScene