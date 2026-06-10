export function getCompassAngle(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes()
  return (minutes / 1440) * Math.PI * 2
}

export function useCompassAngle() {
  return getCompassAngle()
}
