import React from 'react'
import { Canvas } from '@react-three/fiber'
import SkillMoon from './PlanetScene' // or keep SkillMoon in same file and export it

const MoonOverlay = ({ skills }) => {
  return (
    <Canvas
      className="moon-overlay-canvas"
      gl={{ alpha: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)} // transparent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3,            // ABOVE your PortfolioSection
        pointerEvents: 'auto' // clicks still go to skill buttons
      }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ambientLight intensity={0.8} />

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

export default MoonOverlay
