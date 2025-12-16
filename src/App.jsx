import React, { useRef, useEffect, useState } from 'react'
import PortfolioSection from './components/PortfolioSection'
import PlanetScene from './components/three/PlanetScene'
import ModeToggleButton from './components/ModeToggleButton'
import CloudOverlay from './components/CloudOverlay'
import sections from './data/sections'
import ClickSpark from "./components/effects/ClickSpark";

const SCROLL_THRESHOLD = 40

const App = () => {
  const [mode, setMode] = useState('Planet')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [planetId, setPlanetId] = useState(1)
  const [scrolling, setScrolling] = useState(false)
  const [isCloudVisible, setIsCloudVisible] = useState(false)
  const [cloudDirection, setCloudDirection] = useState('down')
  const sectionRefs = useRef([])

  useEffect(() => {
    const handleScroll = (e) => {
      if (scrolling || Math.abs(e.deltaY) < SCROLL_THRESHOLD) return

      const direction = e.deltaY > 0 ? 'down' : 'up'
      const nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1

      if (nextIndex < 0 || nextIndex >= sections.length) return

      setCloudDirection(direction)
      setScrolling(true)
      setIsCloudVisible('entry')

      setTimeout(() => {
        setCurrentIndex(nextIndex)
        setPlanetId((prev) => (prev % 5) + 1)
        setIsCloudVisible('exit')
      }, 800)

      setTimeout(() => {
        setIsCloudVisible(false)
        setScrolling(false)
      }, 1500)
    }

    window.addEventListener('wheel', handleScroll, { passive: true })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentIndex, scrolling])

  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkCount={10}
      sparkRadius={18}
      duration={420}
    >
      <div>
        <PlanetScene planetId={planetId} />
        <CloudOverlay direction={cloudDirection} isVisible={isCloudVisible} />
        <ModeToggleButton mode={mode} setMode={setMode} />

        {sections.map((section, index) => (
          index === currentIndex && (
            <PortfolioSection
              key={`${section.id}-${mode}`}
              ref={(el) => (sectionRefs.current[index] = el)}
              section={section}
              mode={mode}
            />
          )
        ))}
      </div>
    </ClickSpark>
  )
}

export default App
