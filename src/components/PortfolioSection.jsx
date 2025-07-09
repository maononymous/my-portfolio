import React from 'react'
import { motion } from 'framer-motion'

const PortfolioSection = React.forwardRef(({ section, mode }, ref) => {
  return (
    <motion.section
      ref={ref}
      id={section.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      viewport={{ once: true }}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
        background: mode === 'DNA' ? '#fefbe9' : 'transparent',
        color: mode === 'DNA' ? '#222' : '#eee',
        zIndex: 1,
        padding: 0,
        margin: 0,
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          maxWidth: '800px',
          padding: '2rem',
          textAlign: 'left',
          backgroundColor: mode === 'DNA' ? 'rgba(255,255,255,0.85)' : 'transparent',
          borderRadius: '10px',
          zIndex: 2,
        }}
      >
        <h2 style={{ marginBottom: '0.5rem' }}>{section.title}</h2>
        <h4 style={{ marginBottom: '1rem', fontWeight: 400 }}>{section.subtitle}</h4>
        <p style={{ lineHeight: '1.6' }}>
          {mode === 'DNA' ? section.dnaContent : section.planetContent}
        </p>
      </motion.div>
    </motion.section>
  )
})

export default PortfolioSection