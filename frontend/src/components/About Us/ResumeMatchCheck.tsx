import { useState } from 'react'
import './ResumeMatchCheck.css'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

interface CheckResult {
  score: number | null
  status: 'matched' | 'below' | 'unreadable'
  match: boolean
  threshold: number
  matched_keywords: string[]
  missing_keywords: string[]
  tips: string[]
}

interface Props {
  jobId: string
  file: File | null
  token: string | null
  onUnauthorized: () => void
}

/**
 * Optional pre-submit check: shows the applicant how well their resume matches the
 * vacancy (the same ATS scoring HR sees). Nothing is saved; it only gives guidance.
 */
export default function ResumeMatchCheck({ jobId, file, token, onUnauthorized }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState('')

  if (!file) return null
  if (!jobId) {
    return <p className="rmc-hint">Choose a vacancy above to see how well your resume matches it.</p>
  }

  const run = async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('job_id', jobId)
      body.append('resume', file)
      const res = await fetch(`${API_BASE_URL}/careers/ats-check`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      })
      if (res.status === 401) { onUnauthorized(); return }
      if (res.status === 429) { setError('You have checked your resume several times. Please try again in a while.'); return }
      if (!res.ok) { setError('We could not check this resume. Please make sure it is a PDF under 8 MB.'); return }
      setResult(await res.json())
    } catch {
      setError('We could not check this resume right now.')
    } finally {
      setLoading(false)
    }
  }

  const tone = result?.status === 'matched' ? 'good' : result?.status === 'unreadable' ? 'warn' : 'low'

  return (
    <div className="rmc">
      {!result && (
        <button type="button" className="rmc-btn" onClick={run} disabled={loading}>
          {loading ? 'Checking your resume…' : 'Check my resume match'}
        </button>
      )}
      {error && <p className="rmc-error" role="alert">{error}</p>}

      {result && (
        <div className={`rmc-card rmc-card--${tone}`} role="status">
          <div className="rmc-head">
            <div>
              <strong>
                {result.status === 'matched' && 'Good match for this role'}
                {result.status === 'below' && 'Your resume could match this role better'}
                {result.status === 'unreadable' && 'We could not read your resume'}
              </strong>
              <span className="rmc-sub">This is guidance only — you can still submit your application.</span>
            </div>
            {result.score != null && result.status !== 'unreadable' && <span className="rmc-score">{result.score}%</span>}
          </div>

          {result.status !== 'unreadable' && (
            <div className="rmc-bar" aria-hidden="true">
              <div className="rmc-bar__fill" style={{ width: `${result.score ?? 0}%` }} />
              <i className="rmc-bar__line" style={{ left: `${result.threshold}%` }} />
            </div>
          )}

          {result.matched_keywords.length > 0 && (
            <div className="rmc-chips">
              <span>Found in your resume</span>
              {result.matched_keywords.map((k) => <em key={k} className="rmc-chip rmc-chip--ok">{k}</em>)}
            </div>
          )}

          {result.tips.length > 0 && (
            <ul className="rmc-tips">
              {result.tips.map((t) => <li key={t}>{t}</li>)}
            </ul>
          )}

          <button type="button" className="rmc-link" onClick={() => setResult(null)}>Check again</button>
        </div>
      )}
    </div>
  )
}
