import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getCompassAngle } from '../../hooks/useCompassAngle.js'
import { getTimeTheme, useTimeOfDay } from '../../hooks/useTimeOfDay.js'

const directions = [
  { label: 'Poems', path: '/poems', angle: 0, position: [0, 2.66, 0.08] },
  { label: 'About', path: '/about', angle: Math.PI / 2, position: [-2.66, 0, 0.08] },
  { label: 'South', path: '/south', angle: Math.PI, position: [0, -2.66, 0.08] },
  { label: 'Home', path: '/', angle: Math.PI * 1.5, position: [2.66, 0, 0.08] },
]

function makePetalShape(length = 1.6, waist = 0.34, shoulder = 0.58) {
  const petal = new THREE.Shape()
  petal.moveTo(0, length)
  petal.bezierCurveTo(shoulder, length * 0.48, waist, length * 0.16, waist, 0)
  petal.bezierCurveTo(waist, -length * 0.16, shoulder, -length * 0.48, 0, -length)
  petal.bezierCurveTo(-shoulder, -length * 0.48, -waist, -length * 0.16, -waist, 0)
  petal.bezierCurveTo(-waist, length * 0.16, -shoulder, length * 0.48, 0, length)
  petal.closePath()
  return petal
}

function Petal({ direction, onNavigate, onHover, secondary = false }) {
  const ref = useRef()
  const timeOfDay = useTimeOfDay()
  const theme = getTimeTheme(timeOfDay)
  const shape = useMemo(() => makePetalShape(secondary ? 1.24 : 1.62, secondary ? 0.2 : 0.32, secondary ? 0.34 : 0.55), [secondary])

  return (
    <group rotation={[0, 0, -direction.angle]}>
      <mesh
        ref={ref}
        onPointerEnter={() => {
          onHover(direction.angle)
          gsap.to(ref.current.position, { z: 0.38, duration: 0.35, ease: 'power2.out' })
        }}
        onPointerLeave={() => gsap.to(ref.current.position, { z: 0.05, duration: 0.35, ease: 'power2.out' })}
        onClick={() => onNavigate(direction.path, direction.angle)}
        position={[0, 0, 0.05]}
      >
        <extrudeGeometry args={[shape, { depth: secondary ? 0.045 : 0.09, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.035 }]} />
        <meshStandardMaterial
          color={secondary ? theme.ink : theme.accent}
          emissive={secondary ? theme.sky[0] : '#5d3400'}
          emissiveIntensity={secondary ? 0.08 : 0.14}
          roughness={0.3}
          metalness={secondary ? 0.18 : 0.36}
          transparent
          opacity={secondary ? 0.38 : 0.82}
        />
      </mesh>
    </group>
  )
}

function Ring({ radius, tube, color, opacity = 0.6 }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.05]}>
      <torusGeometry args={[radius, tube, 16, 128]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} metalness={0.28} roughness={0.32} />
    </mesh>
  )
}

function TickMarks({ color }) {
  return (
    <group position={[0, 0, 0.02]}>
      {Array.from({ length: 48 }, (_, index) => {
        const angle = (index / 48) * Math.PI * 2
        const major = index % 6 === 0
        return (
          <mesh
            key={index}
            position={[Math.sin(angle) * 2.18, Math.cos(angle) * 2.18, 0]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[major ? 0.035 : 0.018, major ? 0.28 : 0.16, 0.025]} />
            <meshStandardMaterial color={color} transparent opacity={major ? 0.72 : 0.38} />
          </mesh>
        )
      })}
    </group>
  )
}

export function Compass({ onNavigate }) {
  const group = useRef()
  const needle = useRef()
  const timeOfDay = useTimeOfDay()
  const theme = getTimeTheme(timeOfDay)

  useEffect(() => {
    if (!needle.current) return
    needle.current.rotation.z = -getCompassAngle()
  }, [])

  useFrame(({ pointer }) => {
    if (!group.current) return
    group.current.rotation.x += (-0.22 + pointer.y * 0.1 - group.current.rotation.x) * 0.06
    group.current.rotation.y += (pointer.x * 0.12 - group.current.rotation.y) * 0.06
  })

  function swingNeedle(angle) {
    gsap.to(needle.current.rotation, {
      z: -angle,
      duration: 1.1,
      ease: 'elastic.out(1, 0.5)',
    })
  }

  function handleNavigate(path, angle) {
    swingNeedle(angle)
    setTimeout(() => onNavigate(path), 520)
  }

  return (
    <group ref={group} scale={0.68} position={[0, -0.15, 0]}>
      <mesh position={[0, 0, -0.16]}>
        <cylinderGeometry args={[2.38, 2.38, 0.08, 128]} />
        <meshStandardMaterial color={theme.sky[0]} roughness={0.55} metalness={0.08} transparent opacity={0.44} />
      </mesh>
      <Ring radius={2.34} tube={0.035} color={theme.ink} opacity={0.68} />
      <Ring radius={2.05} tube={0.018} color={theme.accent} opacity={0.45} />
      <Ring radius={0.72} tube={0.018} color={theme.ink} opacity={0.5} />
      <TickMarks color={theme.ink} />
      {directions.map((direction) => (
        <Petal key={direction.label} direction={direction} onHover={swingNeedle} onNavigate={handleNavigate} />
      ))}
      {directions.map((direction) => (
        <Petal
          key={`${direction.label}-secondary`}
          direction={{ ...direction, angle: direction.angle + Math.PI / 4 }}
          onHover={swingNeedle}
          onNavigate={handleNavigate}
          secondary
        />
      ))}
      <group ref={needle} position={[0, 0, 0.32]}>
        <mesh>
          <boxGeometry args={[0.11, 3.12, 0.08]} />
          <meshStandardMaterial color="#f6d17a" emissive="#4a2500" emissiveIntensity={0.12} metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh position={[0, 1.68, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.25, 0.62, 3]} />
          <meshStandardMaterial color="#fff0b4" metalness={0.5} roughness={0.25} />
        </mesh>
        <mesh position={[0, -1.68, 0]}>
          <coneGeometry args={[0.18, 0.44, 3]} />
          <meshStandardMaterial color="#9d2745" metalness={0.36} roughness={0.28} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.44]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#fff3bd" emissive={theme.accent} emissiveIntensity={0.28} metalness={0.56} roughness={0.16} />
      </mesh>
      {directions.map((direction) => (
        <Text
          key={direction.label}
          position={direction.position}
          color={theme.ink}
          fontSize={0.22}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor={theme.sky[0]}
        >
          {direction.label}
        </Text>
      ))}
    </group>
  )
}
