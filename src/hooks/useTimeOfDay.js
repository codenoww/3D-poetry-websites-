import { useEffect, useState } from 'react'

const TIME_OVERRIDE_EVENT = 'poetry-time-override'

export const timeOptions = ['dawn', 'day', 'dusk', 'night']

export function getTimeOfDay(date = new Date()) {
  const hour = date.getHours()

  if (hour >= 5 && hour < 9) return 'dawn'
  if (hour >= 9 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'dusk'
  return 'night'
}

export function getTimeTheme(timeOfDay) {
  const themes = {
    dawn: {
      label: 'Dawn',
      range: '5 AM - 9 AM',
      sky: ['#25133c', '#b86f72', '#ffd18a'],
      ink: '#fff4df',
      accent: '#f7c978',
      trail: 'rgba(255, 219, 171, 0.72)',
    },
    day: {
      label: 'Day',
      range: '9 AM - 5 PM',
      sky: ['#3a8edb', '#82cfff', '#f9fbff'],
      ink: '#092034',
      accent: '#fff2a8',
      trail: 'rgba(255, 255, 255, 0.7)',
    },
    dusk: {
      label: 'Dusk',
      range: '5 PM - 8 PM',
      sky: ['#160f33', '#76416f', '#ff9d5c'],
      ink: '#fff0da',
      accent: '#ffc46b',
      trail: 'rgba(255, 171, 116, 0.68)',
    },
    night: {
      label: 'Night',
      range: '8 PM - 5 AM',
      sky: ['#030615', '#0a1836', '#1c315f'],
      ink: '#f5e8c7',
      accent: '#dcb765',
      trail: 'rgba(220, 183, 101, 0.72)',
    },
  }

  return themes[timeOfDay] ?? themes.night
}

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState(() => localStorage.getItem('poetry-time-override') || getTimeOfDay())

  useEffect(() => {
    function syncTime() {
      setTimeOfDay(localStorage.getItem('poetry-time-override') || getTimeOfDay())
    }

    const interval = window.setInterval(syncTime, 60 * 1000)
    window.addEventListener(TIME_OVERRIDE_EVENT, syncTime)
    window.addEventListener('storage', syncTime)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener(TIME_OVERRIDE_EVENT, syncTime)
      window.removeEventListener('storage', syncTime)
    }
  }, [])

  return timeOfDay
}

export function setTimeOverride(value) {
  if (value) {
    localStorage.setItem('poetry-time-override', value)
  } else {
    localStorage.removeItem('poetry-time-override')
  }

  window.dispatchEvent(new Event(TIME_OVERRIDE_EVENT))
}
