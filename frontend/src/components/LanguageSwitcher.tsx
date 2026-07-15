import { useEffect, useRef, useState } from 'react'
import { LANGUAGES, getStoredLanguage, setLanguage } from '../i18n/googleTranslate'
import './LanguageSwitcher.css'

const IconGlobe = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => getStoredLanguage())
  const [switching, setSwitching] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleSelect = async (code: string) => {
    if (code === active) {
      setOpen(false)
      return
    }
    setSwitching(true)
    setOpen(false)
    await setLanguage(code)
    setActive(code)
    setSwitching(false)
  }

  const activeOption = LANGUAGES.find((l) => l.code === active) ?? LANGUAGES[0]

  return (
    <div className="lang-switch notranslate" ref={wrapRef} translate="no">
      <button
        type="button"
        className="hero__action-btn hero__action-btn--outline lang-switch__btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={switching}
        title={activeOption.label}
      >
        <IconGlobe />
        <span className="lang-switch__code">{switching ? '…' : activeOption.code.toUpperCase()}</span>
        <IconChevron />
      </button>

      {open && (
        <ul className="lang-switch__menu" role="listbox">
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                className={`lang-switch__opt ${lang.code === active ? 'lang-switch__opt--active' : ''}`}
                role="option"
                aria-selected={lang.code === active}
                onClick={() => handleSelect(lang.code)}
              >
                <span className="lang-switch__opt-native">{lang.nativeLabel}</span>
                <span className="lang-switch__opt-en">{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
