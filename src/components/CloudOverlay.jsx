import React from 'react'
import { motion } from 'framer-motion'

const CloudOverlay = ({ direction, isVisible }) => {
  const variants = {
    hidden: (dir) => ({
      y: dir === 'down' ? '-100%' : '100%',
      opacity: 0,
    }),
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    exit: (dir) => ({
      y: dir === 'down' ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    }),
  }

  return (
    <motion.div
      className="cloud-overlay"
      custom={direction}
      initial="hidden"
      animate={isVisible ? 'visible' : 'exit'}
      variants={variants}
      style={{
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
      }}
    />
  )
}

export default CloudOverlay