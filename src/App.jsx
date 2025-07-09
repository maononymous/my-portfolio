import React, { useState, useRef, useEffect } from 'react'
import sections from './data/sections'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene from './components/PlanetScene'
import ModeToggleButton from './components/ModeToggleButton'

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentSection, setCurrentSection] = useState(0)
  const sectionRefs = useRef([])

  // Detect scroll to track current section
  useEffect(() => {
    const handleScroll = () => {
      const tops = sectionRefs.current.map(
        (ref) => ref?.getBoundingClientRect().top || 0
      )
      const nearestIndex = tops.reduce((closestIdx, top, idx) => {
        return Math.abs(top) < Math.abs(tops[closestIdx]) ? idx : closestIdx
      }, 0)
      setCurrentSection(nearestIndex)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ scrollSnapType: 'y mandatory', overflowY: 'scroll', height: '100vh' }}>
      <ModeToggleButton mode={mode} setMode={setMode} />
      {mode === 'Planet' && <PlanetScene triggerSpin={currentSection} />}
      {sections.map((section, index) => (
        <PortfolioSection
          key={section.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          section={section}
          mode={mode}
        />
      ))}
    </div>
  )
}

export default App