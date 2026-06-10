import { Canvas, useFrame } from '@react-three/fiber'
import { Cloud, Clouds, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getTimeTheme, useTimeOfDay } from '../../hooks/useTimeOfDay.js'

function DriftLines({ color }) {
  const group = useRef()
  const lines = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        x: -8 + Math.random() * 16,
        y: -3 + Math.random() * 7,
        z: -8 - Math.random() * 8,
        speed: 0.08 + Math.random() * 0.08,
        scale: 0.4 + Math.random() * 0.8,
        key: index,
      })),
    [],
  )

  useFrame((_, delta) => {
    group.current.children.forEach((line, index) => {
      line.position.x += lines[index].speed * delta
      if (line.position.x > 8) line.position.x = -8
    })
  })

  return (
    <group ref={group}>
      {lines.map((line) => (
        <mesh key={line.key} position={[line.x, line.y, line.z]} scale={[line.scale, 1, 1]}>
          <boxGeometry args={[1.4, 0.01, 0.01]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  )
}

function FloatingParticles({ color, count = 70, opacity = 0.32 }) {
  const group = useRef()
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        x: -7 + Math.random() * 14,
        y: -3.5 + Math.random() * 8,
        z: -5 - Math.random() * 8,
        speed: 0.08 + Math.random() * 0.12,
        size: 0.012 + Math.random() * 0.035,
        key: index,
      })),
    [count],
  )

  useFrame((state, delta) => {
    group.current.children.forEach((dot, index) => {
      dot.position.y += particles[index].speed * delta
      dot.position.x += Math.sin(state.clock.elapsedTime * 0.45 + index) * 0.0008
      if (dot.position.y > 4.4) dot.position.y = -3.6
    })
  })

  return (
    <group ref={group}>
      {particles.map((particle) => (
        <mesh key={particle.key} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  )
}

function DayClouds() {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud seed={2} segments={28} bounds={[8, 2, 2]} volume={7} color="#ffffff" opacity={0.42} position={[-3, 1.4, -8]} />
      <Cloud seed={9} segments={24} bounds={[6, 2, 2]} volume={6} color="#eef7ff" opacity={0.34} position={[3, -0.2, -9]} />
      <Cloud seed={13} segments={20} bounds={[5, 2, 2]} volume={4} color="#f8fbff" opacity={0.28} position={[0, 2.8, -10]} />
    </Clouds>
  )
}

function HorizonGlow({ color }) {
  return (
    <mesh position={[0, -2.75, -8]} scale={[9, 1.2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.28} depthWrite={false} />
    </mesh>
  )
}

function Birds() {
  const group = useRef()

  useFrame((state) => {
    group.current.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.8
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.08
  })

  return (
    <group ref={group} position={[-2.8, 1.6, -7]} scale={0.55}>
      {[-1, 0, 1].map((offset) => (
        <group key={offset} position={[offset * 0.8, Math.abs(offset) * 0.18, 0]}>
          <mesh rotation={[0, 0, 0.42]}>
            <boxGeometry args={[0.42, 0.018, 0.018]} />
            <meshBasicMaterial color="#1b2240" transparent opacity={0.55} />
          </mesh>
          <mesh rotation={[0, 0, -0.42]}>
            <boxGeometry args={[0.42, 0.018, 0.018]} />
            <meshBasicMaterial color="#1b2240" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SceneContents() {
  const timeOfDay = useTimeOfDay()
  const theme = getTimeTheme(timeOfDay)

  return (
    <>
      <color attach="background" args={[theme.sky[0]]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color={theme.accent} />
      {timeOfDay === 'night' && <Stars radius={80} depth={35} count={1500} factor={4} fade speed={0.4} />}
      {timeOfDay === 'day' && <DayClouds />}
      {timeOfDay === 'dawn' && (
        <>
          <fog attach="fog" args={[theme.sky[1], 8, 22]} />
          <FloatingParticles color="#ffe4bd" count={95} opacity={0.24} />
          <HorizonGlow color="#ffd18a" />
          <Birds />
        </>
      )}
      {timeOfDay === 'day' && (
        <>
          <FloatingParticles color="#ffffff" count={35} opacity={0.2} />
          <Birds />
        </>
      )}
      {timeOfDay === 'dusk' && (
        <>
          <fog attach="fog" args={[theme.sky[0], 10, 26]} />
          <FloatingParticles color="#ffc084" count={80} opacity={0.24} />
          <HorizonGlow color="#ff9d5c" />
        </>
      )}
      {timeOfDay === 'night' && <FloatingParticles color="#dcb765" count={46} opacity={0.42} />}
      <DriftLines color={theme.accent} />
    </>
  )
}

export function SceneCanvas() {
  const timeOfDay = useTimeOfDay()
  const theme = getTimeTheme(timeOfDay)

  return (
    <div
      className={`scene-layer time-${timeOfDay}`}
      style={{ '--sky-a': theme.sky[0], '--sky-b': theme.sky[1], '--sky-c': theme.sky[2], '--theme-accent': theme.accent }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 2]}>
        <SceneContents />
      </Canvas>
      <div className="sky-gradient" />
      <div className="celestial-body" />
      <div className="horizon-silhouette" />
      <div className="mist-band mist-a" />
      <div className="mist-band mist-b" />
    </div>
  )
}
