import React from 'react';

const PortfolioSection = ({ section, mode }) => {
  return (
    <section id={section.id}
      style={{
        height: '100vh',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
        background: mode === 'DNA' ? '#fefbe9' : '#0b1d3a',
        color: mode === 'DNA' ? '#222' : '#eee',
        transition: 'background 0.3s ease, color 0.3s ease',
        }}
    >
      <div style={{
        width: '100%',
        maxWidth: '800px',
        padding: '3rem',
        margin: '0 auto',
        textAlign: 'left',
        }}
      >
        <h2 style={{ marginBottom: '0.5rem' }}>{section.title}</h2>
        <h4 style={{ marginBottom: '1rem', fontWeight: 400 }}>{section.subtitle}</h4>
        <p style={{ lineHeight: '1.6' }}>
          {mode === 'DNA' ? section.dnaContent : section.planetContent}
        </p>
      </div>
    </section>
  );
};

export default PortfolioSection;
