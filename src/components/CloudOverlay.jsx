import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const enterVariants = {
  hidden: (dir) => ({
    y: dir === 'down' ? '100%' : '-100%',
    opacity: 0,
  }),
  visible: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

const exitVariants = {
  hidden: {
    y: '0%',
    opacity: 0,
  },
  exit: (dir) => ({
    y: dir === 'down' ? '-100%' : '100%',
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  }),
}

const CloudOverlay = ({ direction, isVisible }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {isVisible && (
          <>
            <motion.div
              key={`cloud-enter-${direction}`}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={enterVariants}
              className="cloud-overlay"
              style={baseStyle}
            />

            <motion.div
              key={`cloud-exit-${direction}`}
              custom={direction}
              initial="hidden"
              animate="hidden"
              exit="exit"
              variants={exitVariants}
              className="cloud-overlay"
              style={{ ...baseStyle, zIndex: 9 }}
            />
          </>
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