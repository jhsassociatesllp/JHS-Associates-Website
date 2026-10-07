import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, Check } from 'lucide-react'
import {
  POLICY_VERSION,
  hasAcknowledgedDisclaimer,
  readConsent,
  saveConsent,
  syncPendingConsent,
  type Consent,
} from '../../utils/cookieConsent'
import './CookieConsent.css'

export const OPEN_COOKIE_SETTINGS = 'jhs:open-cookie-settings'
export const DISCLAIMER_ACCEPTED = 'jhs:disclaimer-accepted'

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(() => readConsent())
  const [disclaimerDone, setDisclaimerDone] = useState(() => hasAcknowledgedDisclaimer())
  const [reopened, setReopened] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [preferences, setPreferences] = useState(() => readConsent()?.p ?? true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onDisclaimer = () => setDisclaimerDone(true)
    const onReopen = () => {
      const current = readConsent()
      setPreferences(current?.p ?? true)
      setCustomizing(true)
      setReopened(true)
    }
    window.addEventListener(DISCLAIMER_ACCEPTED, onDisclaimer)
    window.addEventListener(OPEN_COOKIE_SETTINGS, onReopen)
    return () => {
      window.removeEventListener(DISCLAIMER_ACCEPTED, onDisclaimer)
      window.removeEventListener(OPEN_COOKIE_SETTINGS, onReopen)
    }
  }, [])

  // a previous choice that never reached the server is re-sent once
  useEffect(() => { syncPendingConsent() }, [])

  const needsChoice = !consent || consent.v !== POLICY_VERSION
  // The legal disclaimer comes first; the cookie notice follows it.
  const visible = reopened || (disclaimerDone && needsChoice)

  const choose = useCallback(async (status: 'accepted' | 'rejected' | 'custom', prefs: boolean) => {
    setSaving(true)
    const saved = await saveConsent(status, prefs)
    setConsent(saved)
    setSaving(false)
    setReopened(false)
    setCustomizing(false)
  }, [])

  if (!visible) return null

  return (
    <div className="ck-banner" role="dialog" aria-modal="false" aria-label="Cookie preferences">
      <div className="ck-card">
        <div className="ck-head">
          <span className="ck-icon"><Cookie size={18} /></span>
          <h2>Your cookie preferences</h2>
        </div>

        {!customizing ? (
          <p className="ck-text">
            We use essential cookies to keep the website working. With your permission we also use a
            preference cookie to remember your language for 12 months. Read our{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        ) : (
          <div className="ck-options">
            <div className="ck-option">
              <div>
                <strong>Strictly necessary</strong>
                <p>Remembers your cookie choice and the website notice, and keeps you signed in. Always on.</p>
              </div>
              <span className="ck-lock"><Check size={14} /> Always on</span>
            </div>
            <label className="ck-option ck-option--toggle">
              <div>
                <strong>Preferences</strong>
                <p>Remembers the language you choose, so the site opens the way you left it.</p>
              </div>
              <input
                type="checkbox"
                className="ck-switch"
                checked={preferences}
                onChange={(e) => setPreferences(e.target.checked)}
                aria-label="Allow preference cookies"
              />
            </label>
          </div>
        )}

        <div className="ck-actions">
          {!customizing ? (
            <>
              <button type="button" className="ck-btn ck-btn--primary" disabled={saving} onClick={() => choose('accepted', true)}>
                Accept all
              </button>
              <button type="button" className="ck-btn ck-btn--outline" disabled={saving} onClick={() => choose('rejected', false)}>
                Reject non-essential
              </button>
              <button type="button" className="ck-link" onClick={() => setCustomizing(true)}>
                Customize
              </button>
            </>
          ) : (
            <>
              <button type="button" className="ck-btn ck-btn--primary" disabled={saving} onClick={() => choose('custom', preferences)}>
                Save my choices
              </button>
              <button type="button" className="ck-btn ck-btn--outline" disabled={saving} onClick={() => choose('accepted', true)}>
                Accept all
              </button>
              {reopened ? (
                <button type="button" className="ck-link" onClick={() => { setReopened(false); setCustomizing(false) }}>
                  Cancel
                </button>
              ) : (
                <button type="button" className="ck-link" onClick={() => setCustomizing(false)}>
                  Back
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
