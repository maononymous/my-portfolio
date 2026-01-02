import React from 'react'

const ModeToggleButton = ({ mode, setMode }) => {
  const toggleMode = () => {
    setMode(mode === 'DNA' ? 'Planet' : 'DNA')
  }

  return (
    <button
      onClick={toggleMode}
      type="button"
      aria-label={mode === 'DNA' ? 'Switch to Planet View' : 'Switch to DNA View'}
      style={{
        position: 'fixed',
        top: 'calc(var(--safe-top) + 12px)',
        right: 'calc(var(--safe-right) + 12px)',
        padding: '0.85rem 1.1rem',
        background: mode === 'DNA' ? '#4CAF50' : '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'background 0.3s ease, transform 0.15s ease',
      }}
      onMouseDown={(e) => {
        // tiny press feedback; harmless and isolated
        e.currentTarget.style.transform = 'scale(0.98)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {mode === 'DNA' ? 'Switch to Planet View' : 'Switch to DNA View'}
    </button>
  )
}

export default ModeToggleButton
