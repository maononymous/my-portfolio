import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ModeToggleButton from './components/ModeToggleButton.jsx'

function App() {
  const [mode, setMode] = useState('DNA');

  return (
    <div>
      <ModeToggleButton mode={mode} setMode={setMode} />
      <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1>{mode === 'DNA' ? 'Welcome to the DNA View 🧬' : 'Welcome to the Planet View 🌍'}</h1>
      </main>
    </div>
  )
}

export default App
