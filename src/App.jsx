import React, { useState, useRef, useEffect } from 'react'
import ModeToggleButton from './components/ModeToggleButton'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene from './components/three/PlanetScene'
import CloudOverlay from './components/CloudOverlay'
import sections from './data/sections'

let scrollTimeout = null
let lastScrollY = 0

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentSection, setCurrentSection] = useState(0)
  const [planetId, setPlanetId] = useState(1)
  const [planetSpeed, setPlanetSpeed] = useState(0.002)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isCloudVisible, setIsCloudVisible] = useState(false)
  const [cloudDirection, setCloudDirection] = useState('down')


  const sectionRefs = useRef(sections.map(() => React.createRef()))

  const handleScroll = (e) => {
    if (scrolling) return

    const direction = e.deltaY > 0 ? 'down' : 'up'
    const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1

    if (nextIndex < 0 || nextIndex >= sections.length) return

    setCloudDirection(direction)
    setIsCloudVisible(true)
    setScrolling(true)

    setTimeout(() => {
      setCurrentIndex(nextIndex)
      setPlanetId((prev) => (prev % 5) + 1)
    }, 700)

    setTimeout(() => {
      setIsCloudVisible(false)
      setScrolling(false)
    }, 1400)
  }


  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: true })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentSection, isTransitioning])

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <ModeToggleButton mode={mode} setMode={setMode} />
      {mode === 'Planet' && <PlanetScene planetId={planetId} speed={planetSpeed} />}
      <CloudOverlay direction={cloudDirection} isVisible={isCloudVisible} />
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