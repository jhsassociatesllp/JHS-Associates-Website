import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useSiteAuth } from '../../context/SiteAuthContext'

/**
 * Signed-in account chip (avatar + first name) with a small menu.
 * Rendered in the hero's action row on the home page and as a fixed
 * top-right chip on every other page. Styles live in Navbar.css.
 */
export default function AccountMenu({ className = '' }: { className?: string }) {
  const { user, logout } = useSiteAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null

  const firstName = user.first_name || user.name.split(' ')[0]

  return (
    <div className={`nb__account ${className}`} ref={ref}>
      <button
        type="button"
        className="nb__account-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nb__account-avatar"><User size={14} /></span>
        <span className="nb__account-name">{firstName}</span>
        <ChevronDown size={14} className={`nb__account-chevron ${open ? 'is-open' : ''}`} />
      </button>
      {open && (
        <div className="nb__account-menu" role="menu">
          <span className="nb__account-label">Signed in as</span>
          <span className="nb__account-email">{user.email}</span>
          <button
            type="button"
            className="nb__account-logout"
            role="menuitem"
            onClick={() => { logout(); setOpen(false) }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
