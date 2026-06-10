import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { AirplaneCursor } from './components/canvas/AirplaneCursor.jsx'
import { SceneCanvas } from './components/canvas/SceneCanvas.jsx'
import { MiniCompassNav } from './components/ui/MiniCompassNav.jsx'
import { TimeSwitcher } from './components/ui/TimeSwitcher.jsx'
import { About } from './pages/About.jsx'
import { Home } from './pages/Home.jsx'
import { Poems } from './pages/Poems.jsx'
import { South } from './pages/South.jsx'
import './App.css'

function HomeRoute() {
  const navigate = useNavigate()
  return <Home onNavigate={(path) => navigate(path)} />
}

function AppShell() {
  return (
    <>
      <SceneCanvas />
      <AirplaneCursor />
      <main className="site-shell">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/poems" element={<Poems />} />
          <Route path="/about" element={<About />} />
          <Route path="/south" element={<South />} />
        </Routes>
      </main>
      <MiniCompassNav />
      <TimeSwitcher />
      <a className="skip-link" href="#content">
        Skip to content
      </a>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
