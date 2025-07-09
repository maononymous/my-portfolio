import React, { useState, useRef, useEffect } from 'react'
import ModeToggleButton from './components/ModeToggleButton'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene from './components/three/PlanetScene'
import sections from './data/sections'

let scrollTimeout = null
let lastScrollY = 0

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentSection, setCurrentSection] = useState(0)
  const [planetId, setPlanetId] = useState(1)
  const [planetSpeed, setPlanetSpeed] = useState(0.002)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const sectionRefs = useRef(sections.map(() => React.createRef()))

  const handleScroll = (event) => {
    if (isTransitioning || scrollTimeout) return

    const delta = event.deltaY

    if (Math.abs(delta) < 80) return

    const direction = Math.sign(delta)
    const nextSection = currentSection + direction

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

      scrollTimeout = setTimeout(() => {
        scrollTimeout = null
      }, 1200)
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