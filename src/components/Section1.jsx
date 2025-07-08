import React from 'react';

const Section1 = ({ mode }) => {
  return (
    <section
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: mode === 'DNA' ? '#fefbe9' : '#0b1d3a',
        color: mode === 'DNA' ? '#333' : '#e0e0e0',
        transition: 'all 0.4s ease'
      }}
    >
      {mode === 'DNA' ? (
        <div>
          <h2>DNA Mode: Who I Am</h2>
          <p>This section expresses your personality and story through the lens of creativity.</p>
        </div>
      ) : (
        <div>
          <h2>Planet Mode: What I've Built</h2>
          <p>This section focuses on technical achievements and structured skills.</p>
        </div>
      )}
    </section>
  );
};

export default Section1;
