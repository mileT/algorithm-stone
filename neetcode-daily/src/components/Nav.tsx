import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Daily', end: true },
  { to: '/problems', label: 'Problems' },
  { to: '/learn', label: 'Python' },
  { to: '/notes', label: 'Notes' },
  { to: '/email', label: 'Email' },
]

export function Nav() {
  return (
    <header className="nav">
      <NavLink to="/" className="brand">
        <span className="brand-mark" aria-hidden>
          N
        </span>
        NeetDaily
      </NavLink>
      <nav className="nav-links" aria-label="Primary">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
