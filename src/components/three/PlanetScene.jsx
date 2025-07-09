import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense } from 'react'

const Planet = () => {
  return (
    <mesh rotation={[0.2, 0.6, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial color="#4fc3f7" metalness={0.5} roughness={0.1} />
    </mesh>
  )
}

const PlanetScene = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <Stars radius={100} depth={50} count={5000} factor={4} />
          <Planet />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default PlanetScene