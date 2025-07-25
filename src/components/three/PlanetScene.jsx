import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'
import { useLoader } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

const textureMap = {
  1: '/textures/2k_mars.jpg',
  2: '/textures/2k_jupiter.jpg',
  3: '/textures/2k_neptune.jpg',
  4: '/textures/2k_makemake_fictional.jpg',
  5: '/textures/2k_ceres_fictional.jpg',
}

const RotatingPlanet = ({ planetId, speed }) => {
  const meshRef = useRef()
  const texture = useLoader(TextureLoader, textureMap[planetId] || textureMap[1])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

const PlanetScene = ({ planetId, speed = 0.002 }) => {
  return (
    <Canvas
      style={{
        background: '#000000',
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
      <Stars key={planetId} radius={100} depth={50} count={6000} factor={5} saturation={0} fade speed={1}/>
      <RotatingPlanet planetId={planetId} speed={speed} />
    </Canvas>
  )
}

export default PlanetScene