import { Canvas } from '@react-three/fiber'
import { Compass } from '../components/canvas/Compass.jsx'
import { getTimeTheme, useTimeOfDay } from '../hooks/useTimeOfDay.js'

export function Home({ onNavigate }) {
  const timeOfDay = useTimeOfDay()
  const theme = getTimeTheme(timeOfDay)

  return (
    <section id="content" className="home-page">
      <p className="eyebrow">{theme.label} compass</p>
      <h1>Poetry that moves with the hour.</h1>
      <p className="intro">
        Follow the compass into poems, notes, and quiet rooms. This first build gives the site its time-aware sky,
        airplane cursor, and interactive 3D compass.
      </p>
      <div className="compass-stage" aria-label="Interactive poetry compass">
        <Canvas camera={{ position: [0, 0, 6.2], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={1.4} />
          <directionalLight position={[2, 4, 4]} intensity={1.6} color={theme.accent} />
          <Compass onNavigate={onNavigate} />
        </Canvas>
      </div>
    </section>
  )
}
