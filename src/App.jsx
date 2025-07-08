import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ModeToggleButton from './components/ModeToggleButton.jsx'
import Section1 from './components/Section1.jsx'

function App() {
  const [mode, setMode] = useState('DNA');

  return (
    <div>
      <ModeToggleButton mode={mode} setMode={setMode} />
      <Section1 mode={mode} />
    </div>
  )
}

export default App
