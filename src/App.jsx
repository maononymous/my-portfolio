import React, { useState, useEffect, useCallback } from 'react'
import sections from './data/sections'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene from './components/three/PlanetScene'
import ModeToggleButton from './components/ModeToggleButton'
import { AnimatePresence } from 'framer-motion'

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentSection, setCurrentSection] = useState(0)
  const [isThrottled, setIsThrottled] = useState(false)

  // Scroll detection logic
  const handleScroll = useCallback((e) => {
    if (isThrottled) return

    const delta = e.deltaY
    if (delta > 40 && currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
      throttleScroll()
    } else if (delta < -40 && currentSection > 0) {
      setCurrentSection((prev) => prev - 1)
      throttleScroll()
    }
  }, [currentSection, isThrottled])

  const throttleScroll = () => {
    setIsThrottled(true)
    setTimeout(() => setIsThrottled(false), 1000) // prevent too fast navigation
  }

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: true })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [handleScroll])

  return (
    <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <ModeToggleButton mode={mode} setMode={setMode} />
      {mode === 'Planet' && <PlanetScene triggerSpin={currentSection} />}
      <AnimatePresence mode="wait">
        <PortfolioSection
          key={currentSection}
          section={sections[currentSection]}
          mode={mode}
        />
      </AnimatePresence>
    </div>
  )
}

export default App