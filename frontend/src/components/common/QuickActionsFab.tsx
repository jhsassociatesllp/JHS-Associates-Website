import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, CalendarCheck, Briefcase, ChevronUp, ChevronDown } from 'lucide-react'
import './QuickActionsFab.css'

interface QuickAction {
  key: string
  label: string
  icon: React.ReactNode
  path: string
  variant: 'primary' | 'secondary' | 'mixed'
}

const ACTIONS: QuickAction[] = [
  { key: 'consulting', label: 'Consulting', icon: <Briefcase size={17} />, path: '/about/leadership', variant: 'mixed' },
  { key: 'appointment', label: 'Book Appointment', icon: <CalendarCheck size={17} />, path: '/book-appointment', variant: 'secondary' },
  { key: 'contact', label: 'Contact Us', icon: <Phone size={17} />, path: '/contact', variant: 'primary' },
]

export default function QuickActionsFab() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  const goTo = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  return (
    <div className="quick-fab" ref={containerRef}>
      <div className={`quick-fab__menu ${isOpen ? 'quick-fab__menu--open' : ''}`} aria-hidden={!isOpen}>
        {ACTIONS.map((action, index) => (
          <button
            key={action.key}
            type="button"
            className="quick-fab__action"
            style={{ transitionDelay: isOpen ? `${index * 50}ms` : '0ms' }}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => goTo(action.path)}
          >
            <span>{action.label}</span>
            <span className={`quick-fab__action-icon quick-fab__action-icon--${action.variant}`}>
              {action.icon}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="quick-fab__toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close quick actions menu' : 'Open quick actions menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
      </button>
    </div>
  )
}
