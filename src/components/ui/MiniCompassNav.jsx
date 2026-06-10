import { Link, useLocation } from 'react-router-dom'

const links = [
  ['/', 'N'],
  ['/poems', 'E'],
  ['/about', 'W'],
  ['/south', 'S'],
]

export function MiniCompassNav() {
  const location = useLocation()

  if (location.pathname === '/') return null

  return (
    <nav className="mini-compass" aria-label="Compass navigation">
      {links.map(([path, label]) => (
        <Link key={path} className={location.pathname === path ? 'active' : ''} to={path}>
          {label}
        </Link>
      ))}
    </nav>
  )
}
