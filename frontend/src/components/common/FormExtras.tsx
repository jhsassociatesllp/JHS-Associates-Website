import { Link } from 'react-router-dom'
import './FormExtras.css'

/* Honeypot: a box real visitors never see; bots fill it in and the server refuses the form. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="fx-hp" aria-hidden="true">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}

/* Privacy consent (DPDP Act): required before any form can be sent */
export function ConsentCheck({
  id,
  checked,
  onChange,
  error,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  error?: string
}) {
  const errId = `${id}-err`
  return (
    <div className="fx-consent">
      <label htmlFor={id} className="fx-consent__label">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
        />
        <span>
          I agree to the{' '}
          <Link to="/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </Link>{' '}
          and consent to JHS contacting me about this request. <b aria-hidden="true">*</b>
        </span>
      </label>
      {error && (
        <span id={errId} className="fx-consent__err" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

/* "123 / 1000" counter under a text box */
export function CharCount({ value, max }: { value: string; max: number }) {
  const near = value.length > max * 0.9
  return (
    <span className={`fx-count${near ? ' fx-count--near' : ''}`} aria-live="off">
      {value.length} / {max}
    </span>
  )
}
