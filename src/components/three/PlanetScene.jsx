import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'

const RotatingPlanet = () => {
  const meshRef = useRef()
  const texture = useLoader(TextureLoader, '/textures/2k_mars.jpg')

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

const PlanetScene = () => {
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
      <RotatingPlanet />
      {/* <OrbitControls enableZoom={false} /> */}
    </Canvas>
  )
}

export default PlanetScene