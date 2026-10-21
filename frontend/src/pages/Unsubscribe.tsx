import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BellOff, BellRing, CheckCircle2 } from 'lucide-react'
import './Unsubscribe.css'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

type State = 'ask' | 'working' | 'unsubscribed' | 'resubscribed' | 'invalid'

export default function Unsubscribe() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [state, setState] = useState<State>(token ? 'ask' : 'invalid')

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  // The change is made only when the visitor presses the button, never just by opening the link
  // (mail scanners open links automatically).
  const change = async (path: 'unsubscribe' | 'resubscribe') => {
    setState('working')
    try {
      const res = await fetch(`${API_BASE}/notifications/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error()
      setState(path === 'unsubscribe' ? 'unsubscribed' : 'resubscribed')
    } catch {
      setState('invalid')
    }
  }

  return (
    <main className="unsub">
      <div className="unsub__card">
        {state === 'ask' && (
          <>
            <span className="unsub__icon"><BellOff size={28} /></span>
            <h1>Unsubscribe from JHS insight emails?</h1>
            <p>You will no longer receive an email when we publish a new white paper, article, regulatory update or podcast.</p>
            <div className="unsub__actions">
              <button type="button" className="unsub__btn" onClick={() => change('unsubscribe')}>Yes, unsubscribe me</button>
              <Link to="/" className="unsub__link">No, take me to the website</Link>
            </div>
          </>
        )}
        {state === 'working' && <p className="unsub__status">Please wait…</p>}
        {state === 'unsubscribed' && (
          <>
            <span className="unsub__icon unsub__icon--ok"><CheckCircle2 size={30} /></span>
            <h1>You are unsubscribed</h1>
            <p>We will not send you new-insight emails any more. You can still read everything on our website.</p>
            <div className="unsub__actions">
              <button type="button" className="unsub__btn unsub__btn--ghost" onClick={() => change('resubscribe')}>
                <BellRing size={16} /> Changed your mind? Subscribe again
              </button>
              <Link to="/" className="unsub__link">Go to the website</Link>
            </div>
          </>
        )}
        {state === 'resubscribed' && (
          <>
            <span className="unsub__icon unsub__icon--ok"><CheckCircle2 size={30} /></span>
            <h1>Welcome back</h1>
            <p>You will receive an email when we publish something new.</p>
            <div className="unsub__actions"><Link to="/" className="unsub__btn">Go to the website</Link></div>
          </>
        )}
        {state === 'invalid' && (
          <>
            <span className="unsub__icon"><BellOff size={28} /></span>
            <h1>This link is not valid</h1>
            <p>The link may be incomplete or out of date. Please use the unsubscribe link from a recent JHS email, or write to connect@jhsassociates.in.</p>
            <div className="unsub__actions"><Link to="/" className="unsub__link">Go to the website</Link></div>
          </>
        )}
      </div>
    </main>
  )
}
