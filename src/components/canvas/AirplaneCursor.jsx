import { useEffect, useRef } from 'react'
import { getTimeTheme, useTimeOfDay } from '../../hooks/useTimeOfDay.js'

export function AirplaneCursor() {
  const timeOfDay = useTimeOfDay()
  const theme = getTimeTheme(timeOfDay)
  const plane = useRef(null)
  const trail = useRef(null)

  useEffect(() => {
    const cursor = plane.current
    const trailNode = trail.current
    const state = { x: window.innerWidth / 2, y: window.innerHeight / 2, px: window.innerWidth / 2, py: window.innerHeight / 2 }

    function move(event) {
      state.x = event.clientX
      state.y = event.clientY
    }

    function tick() {
      state.px += (state.x - state.px) * 0.22
      state.py += (state.y - state.py) * 0.22
      const angle = Math.atan2(state.y - state.py, state.x - state.px) * (180 / Math.PI)

      cursor.style.transform = `translate3d(${state.px}px, ${state.py}px, 0) rotate(${angle + 45}deg)`
      trailNode.style.transform = `translate3d(${state.px}px, ${state.py}px, 0) rotate(${angle}deg)`
      requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', move)
    const frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div ref={trail} className="airplane-trail" style={{ background: theme.trail }} />
      <div ref={plane} className="airplane-cursor" aria-hidden="true">
        <span />
      </div>
    </>
  )
}
