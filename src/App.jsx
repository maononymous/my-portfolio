import { useState } from 'react';
import ModeToggleButton from './components/ModeToggleButton';
import PortfolioSection from './components/PortfolioSection';
import sections from './data/sections';

function App() {
  const [mode, setMode] = useState('DNA');

  return (
    <div>
      <ModeToggleButton mode={mode} setMode={setMode} />

      <div
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
        }}
      >
        {sections.map(section => (
          <PortfolioSection key={section.id} section={section} mode={mode} />
        ))}
      </div>
    </div>
  );
}

export default App;
