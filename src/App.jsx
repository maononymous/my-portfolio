import React, { useState, useRef, useEffect } from 'react'
import ModeToggleButton from './components/ModeToggleButton'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene from './components/three/PlanetScene'
import sections from './data/sections'

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentSection, setCurrentSection] = useState(0)
  const [planetId, setPlanetId] = useState(1)
  const [planetSpeed, setPlanetSpeed] = useState(0.002)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const sectionRefs = useRef(sections.map(() => React.createRef()))

  const handleScroll = (event) => {
    if (isTransitioning) return

    const delta = Math.sign(event.deltaY)
    const nextSection = currentSection + delta

    if (nextSection >= 0 && nextSection < sections.length) {
      setIsTransitioning(true)

      setPlanetSpeed(0.05)

      setTimeout(() => {
        setPlanetId((prev) => (prev % 5) + 1)
      }, 300)

      setTimeout(() => {
        setCurrentSection(nextSection)
        setIsTransitioning(false)
        setPlanetSpeed(0.002)
      }, 1000)
    }
  }

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: true })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentSection, isTransitioning])

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <ModeToggleButton mode={mode} setMode={setMode} />
      {mode === 'Planet' && <PlanetScene planetId={planetId} speed={planetSpeed} />}
      {sections.map((section, index) => (
        index === currentSection && (
          <PortfolioSection
            key={section.id}
            ref={sectionRefs.current[index]}
            section={section}
            mode={mode}
          />
        )
      ))}
    </div>
  )
}

export default App