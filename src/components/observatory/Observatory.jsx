import { useEffect, useState } from 'react'

const observations = [
  {
    id: 'North Horizon',
    title: 'Who Am I?',
    x: 20,
    y: 30,
    depth: 1,
  },
  {
    id: 'Signal Lost',
    title: 'The Midnight Moon',
    x: 70,
    y: 20,
    depth: 2,
  },
  {
    id: 'Faint Light',
    title: 'Map to My Treasure',
    x: 45,
    y: 55,
    depth: 3,
  },
  {
    id: 'Migration Log',
    title: 'Horizon',
    x: 15,
    y: 70,
    depth: 2,
  },
  {
    id: 'Southern Sky',
    title: 'The Healer',
    x: 80,
    y: 65,
    depth: 1,
  },
]

export function Observatory() {
  const [focus, setFocus] = useState(0)

  const [mouse, setMouse] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  })

  useEffect(() => {
    const handleWheel = (e) => {
      setFocus((prev) =>
        Math.max(
          0,
          Math.min(1, prev + e.deltaY * -0.0005)
        )
      )
    }

    const handleMove = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('wheel', handleWheel)
    window.addEventListener('mousemove', handleMove)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [])

  const isNight =
    new Date().getHours() >= 20 ||
    new Date().getHours() < 5

  return (
    <>
      {/* blurry sky */}
      <div
        className="sky-blur"
        style={{
          opacity: 1 - focus,
        }}
      />

      {/* movable telescope */}
      <div
        className="telescope-lens"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      >
        <div className="lens-content">
          {observations.map((obs) => {
            const offsetX =
              ((mouse.x / window.innerWidth) - 0.5) *
              obs.depth *
              20

            const offsetY =
              ((mouse.y / window.innerHeight) - 0.5) *
              obs.depth *
              20

            return (
              <div
                key={obs.id}
                className="observation"
                style={{
                  left: `${obs.x}%`,
                  top: `${obs.y}%`,
                  opacity: focus,
                  transform: `translate(${offsetX}px, ${offsetY}px)`,
                }}
              >
                {isNight ? (
                  <>
                    <span className="star">✦</span>
                    <span className="title">{obs.title}</span>
                  </>
                ) : (
                  <>
                    <span className="obs-code">
                      {obs.id}
                    </span>

                    <span className="title">
                      {obs.title}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="focus-text">
        Scroll to focus • Move mouse to explore
      </div>
    </>
  )
}