import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CloudOverlay = ({ direction, isVisible }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {isVisible === 'entry' && (
          <motion.div
            key={`cloud-enter-${direction}`}
            custom={direction}
            initial={{ y: direction === 'down' ? '100%' : '-100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
            exit={{ opacity: 1 }}
            className="cloud-overlay"
            style={baseStyle}
          />
        )}

        {isVisible === 'exit' && (
          <motion.div
            key={`cloud-exit-${direction}`}
            custom={direction}
            initial={{ y: '0%', opacity: 1 }}
            animate={{
              y: direction === 'down' ? '-100%' : '100%',
              opacity: 0,
              transition: { duration: 0.11, ease: 'easeInOut' },
            }}
            className="cloud-overlay"
            style={{ ...baseStyle, zIndex: 9 }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

const baseStyle = {
  backgroundImage: 'url(/textures/clouds.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 10,
  pointerEvents: 'none',
  filter: 'brightness(0.3) contrast(1.2)',
}

export default CloudOverlay