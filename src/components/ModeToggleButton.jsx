import React from 'react';

const ModeToggleButton = ({ mode, setMode }) => {
  const toggleMode = () => {
    setMode(mode === 'DNA' ? 'Planet' : 'DNA');
  };

  return (
    <button
      onClick={toggleMode}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        padding: '0.75rem 1.25rem',
        background: mode === 'DNA' ? '#4CAF50' : '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'background 0.3s ease'
      }}
    >
      {mode === 'DNA' ? 'Switch to Planet View' : 'Switch to DNA View'}
    </button>
  );
};

export default ModeToggleButton;