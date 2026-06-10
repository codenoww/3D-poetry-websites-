import { getTimeTheme, setTimeOverride, timeOptions, useTimeOfDay } from '../../hooks/useTimeOfDay.js'

export function TimeSwitcher() {
  const timeOfDay = useTimeOfDay()
  const theme = getTimeTheme(timeOfDay)

  return (
    <aside className="time-switcher" aria-label="Preview time based backgrounds">
      <span>
        {theme.label}
        <small>{theme.range}</small>
      </span>
      <div>
        {timeOptions.map((option) => (
          <button
            key={option}
            className={timeOfDay === option ? 'active' : ''}
            type="button"
            onClick={() => setTimeOverride(option)}
          >
            {getTimeTheme(option).label}
          </button>
        ))}
        <button type="button" onClick={() => setTimeOverride(null)}>
          Auto
        </button>
      </div>
    </aside>
  )
}
