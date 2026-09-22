import { useEffect, useRef, useState } from 'react'
import { X, Loader2, AlertCircle } from 'lucide-react'
import { useSiteAuth } from '../../context/SiteAuthContext'
import { useGoogleIdentity, getGoogleIdentity } from '../../hooks/useGoogleIdentity'
import './AuthModal.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

type Mode = 'signin' | 'signup'

export default function AuthModal() {
  const { isAuthModalOpen, authModalIntent, closeAuthModal, login, signup, loginWithGoogle } = useSiteAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const googleReady = useGoogleIdentity()
  const googleButtonRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isAuthModalOpen) {
      setError('')
      setMode('signin')
    }
  }, [isAuthModalOpen])

  const onGoogleCredential = async (response: { credential: string }) => {
    setError('')
    setSubmitting(true)
    try {
      await loginWithGoogle(response.credential)
      closeAuthModal()
    } catch {
      setError('Google sign-in failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!isAuthModalOpen || !googleReady || !GOOGLE_CLIENT_ID || !googleButtonRef.current) return
    const google = getGoogleIdentity()
    if (!google?.accounts?.id) return

    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogleCredential })
    google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline', size: 'large', width: 320, text: 'continue_with',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthModalOpen, googleReady, mode])

  if (!isAuthModalOpen) return null

  const resetFields = () => {
    setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setAgreeTerms(false)
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    resetFields()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup' && !agreeTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'signup') {
        await signup({ first_name: firstName, last_name: lastName, email, password, agree_terms: agreeTerms })
      } else {
        await login(email, password)
      }
      closeAuthModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="am-overlay" onMouseDown={closeAuthModal}>
      <div
        className="am-panel"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'signup' ? 'Sign up for an account' : 'Log in to your account'}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="am-close" onClick={closeAuthModal} aria-label="Close">
          <X size={18} />
        </button>

        <h2 className="am-title">{mode === 'signup' ? 'Sign Up For An Account' : 'Log In To Your Account'}</h2>
        {authModalIntent && (
          <p className="am-intent">Sign in to {authModalIntent}</p>
        )}

        <form className="am-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="am-row">
              <label className="am-field">
                <span>First name</span>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
              </label>
              <label className="am-field">
                <span>Last name</span>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
              </label>
            </div>
          )}

          <label className="am-field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail Address" required autoComplete="email" />
          </label>

          <label className="am-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Create a password (min. 8 characters)' : 'Password'}
              required
              minLength={mode === 'signup' ? 8 : undefined}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </label>

          {mode === 'signup' && (
            <label className="am-terms">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              <span>
                I agree to the JHS &amp; Associates{' '}
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>{' '}
                and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </span>
            </label>
          )}

          {error && <p className="am-error"><AlertCircle size={13} /> {error}</p>}

          <button type="submit" className="am-submit" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="am-spin" /> : (mode === 'signup' ? 'SIGN UP' : 'SIGN IN')}
          </button>

          <button type="button" className="am-switch" onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}>
            {mode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          <div className="am-divider"><span>OR</span></div>

          {GOOGLE_CLIENT_ID ? (
            <div ref={googleButtonRef} className="am-google-btn" />
          ) : (
            <p className="am-error"><AlertCircle size={13} /> Google Sign-In is not configured.</p>
          )}
        </form>
      </div>
    </div>
  )
}
