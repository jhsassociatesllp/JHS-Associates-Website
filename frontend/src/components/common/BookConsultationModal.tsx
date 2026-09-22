import { useEffect, useRef, useState } from 'react'
import { X, CalendarCheck, CheckCircle2, Loader2, AlertCircle, MapPin } from 'lucide-react'
import { useSiteAuth } from '../../context/SiteAuthContext'
import './BookConsultationModal.css'

export interface ConsultationPartner {
  name: string
  role: string
  location: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

const APPOINTMENT_TYPES = [
  'General Consultation',
  'In-depth Advisory Session',
  'Follow-up Meeting',
]

interface Props {
  partner: ConsultationPartner
  onClose: () => void
}

export default function BookConsultationModal({ partner, onClose }: Props) {
  const { user, token, openAuthModal } = useSiteAuth()
  const [appointmentType, setAppointmentType] = useState(APPOINTMENT_TYPES[0])
  const [step, setStep] = useState<'select' | 'submitting' | 'success' | 'error'>('select')
  const [errorMessage, setErrorMessage] = useState('')
  const pendingSubmitRef = useRef(false)

  const submitRequest = async (authToken: string) => {
    setStep('submitting')
    try {
      const res = await fetch(`${API_BASE_URL}/consulting/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          partner_name: partner.name,
          partner_role: partner.role || null,
          partner_location: partner.location || null,
          appointment_type: appointmentType,
        }),
      })
      if (res.status === 401 || res.status === 403) {
        // Expired token or a suspended account — send the user back through
        // sign-in rather than looping on a retry with the same dead token.
        setErrorMessage('Your session has expired. Please sign in again to continue.')
        pendingSubmitRef.current = true
        openAuthModal('book this appointment')
        setStep('select')
        return
      }
      if (!res.ok) throw new Error('Failed to submit request')
      setStep('success')
    } catch {
      setErrorMessage('Something went wrong submitting your request. Please try again.')
      setStep('error')
    }
  }

  /* If the user signs in (from this modal's own prompt, or the shared
     AuthModal opened from elsewhere) while a submit was pending, finish it
     automatically instead of making them click Request Now again. */
  useEffect(() => {
    if (user && token && pendingSubmitRef.current) {
      pendingSubmitRef.current = false
      void submitRequest(token)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

  const handleRequestNow = () => {
    if (user && token) {
      pendingSubmitRef.current = false
      void submitRequest(token)
    } else {
      pendingSubmitRef.current = true
      openAuthModal('book this appointment')
    }
  }

  return (
    <div className="bcm-overlay" onMouseDown={onClose}>
      <div className="bcm-panel" role="dialog" aria-modal="true" aria-label="Book your appointment" onMouseDown={(e) => e.stopPropagation()}>
        <div className="bcm-head">
          <h3>Book your Appointment</h3>
          <button type="button" className="bcm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="bcm-partner">
          <span className="bcm-partner__name">{partner.name}</span>
          {partner.role && <span className="bcm-partner__role">{partner.role}</span>}
          {partner.location && (
            <span className="bcm-partner__location"><MapPin size={12} /> {partner.location}</span>
          )}
        </div>

        {step === 'select' && (
          <>
            <div className="bcm-section">
              <span className="bcm-section__icon"><CalendarCheck size={16} /></span>
              <span>Select appointment type</span>
            </div>
            <select
              className="bcm-select"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
            >
              {APPOINTMENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="bcm-request-box">
              <p className="bcm-request-box__title">Appointment available only on request</p>
              <p className="bcm-request-box__hint">
                {user
                  ? 'To request an appointment, click the Request Now button'
                  : 'Sign in to confirm who we should contact, then click Request Now.'}
              </p>
              <button type="button" className="bcm-btn bcm-btn--primary" onClick={handleRequestNow}>
                {user ? 'Request Now' : 'Sign In & Request'}
              </button>
            </div>
            {errorMessage && <p className="bcm-error"><AlertCircle size={13} /> {errorMessage}</p>}
          </>
        )}

        {step === 'submitting' && (
          <div className="bcm-status">
            <Loader2 size={28} className="bcm-spin" />
            <p>Submitting your request…</p>
          </div>
        )}

        {step === 'success' && (
          <div className="bcm-status">
            <span className="bcm-status__icon bcm-status__icon--success"><CheckCircle2 size={28} /></span>
            <p className="bcm-status__title">Request sent!</p>
            <p className="bcm-status__hint">
              Thank you{user ? `, ${user.name.split(' ')[0]}` : ''}. Our team will reach out to you shortly to confirm
              your {appointmentType.toLowerCase()} with {partner.name}.
            </p>
            <button type="button" className="bcm-btn bcm-btn--outline" onClick={onClose}>Close</button>
          </div>
        )}

        {step === 'error' && (
          <div className="bcm-status">
            <span className="bcm-status__icon bcm-status__icon--error"><AlertCircle size={28} /></span>
            <p className="bcm-status__title">{errorMessage || 'Something went wrong.'}</p>
            <button type="button" className="bcm-btn bcm-btn--primary" onClick={() => setStep('select')}>Try Again</button>
          </div>
        )}

        <p className="bcm-footnote">Your information is transmitted securely and stored only to process this request.</p>
      </div>
    </div>
  )
}
