import { useEffect, useState } from 'react'
import { X, Users, MapPin, CalendarCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ExpertRow } from '../../data/expertsData'
import BookConsultationModal from './BookConsultationModal'
import type { ConsultationPartner } from './BookConsultationModal'
import './ExpertsModal.css'

interface Props {
  pointTitle: string
  pointDesc?: string
  rows: ExpertRow[]
  onClose: () => void
}

/** Splits a cell like "Taher Pepermintwala/Sahil Shah" into individual partner names. */
function splitNames(raw: string): string[] {
  return raw
    .split('/')
    .map((n) => n.replace(/\(.*?\)/g, '').trim())
    .filter(Boolean)
}

export default function ExpertsModal({ pointTitle, pointDesc, rows, onClose }: Props) {
  const [bookingPartner, setBookingPartner] = useState<ConsultationPartner | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const hasMatches = rows.length > 0

  return (
    <>
      <div className="exm-overlay" onMouseDown={onClose}>
        <div
          className="exm-panel"
          role="dialog"
          aria-modal="true"
          aria-label={`Experts for ${pointTitle}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="exm-head">
            <span className="exm-head__icon"><Users size={18} /></span>
            <div className="exm-head__text">
              <h3>{pointTitle}</h3>
              {pointDesc && <p>{pointDesc}</p>}
            </div>
            <button type="button" className="exm-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="exm-body">
            {hasMatches ? (
              rows.map((row) => (
                <div className="exm-service" key={row.sno}>
                  {rows.length > 1 && <p className="exm-service__label">{row.service}</p>}
                  <div className="exm-offices">
                    {Object.entries(row.experts).map(([office, names]) => (
                      <div className="exm-office" key={office}>
                        <span className="exm-office__name">
                          <MapPin size={12} /> JHS Mumbai &ndash; {office}
                        </span>
                        <div className="exm-partners">
                          {splitNames(names as string).map((name) => (
                            <button
                              type="button"
                              key={name}
                              className="exm-partner-chip"
                              onClick={() =>
                                setBookingPartner({
                                  name,
                                  role: pointTitle,
                                  location: `JHS Mumbai – ${office}`,
                                })
                              }
                            >
                              {name}
                              <CalendarCheck size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="exm-fallback">
                <p className="exm-fallback__title">Speak to our engagement team</p>
                <p className="exm-fallback__hint">
                  This service is handled by a dedicated specialist based on your requirement.
                  Browse the full expert directory or reach out and we&rsquo;ll connect you with
                  the right partner.
                </p>
                <div className="exm-fallback__actions">
                  <Link to="/services/our-experts" className="exm-btn exm-btn--outline" onClick={onClose}>
                    Browse Expert Directory
                  </Link>
                  <Link to="/contact" className="exm-btn exm-btn--primary" onClick={onClose}>
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </div>

          {hasMatches && (
            <p className="exm-footnote">
              Names sourced from JHS&rsquo;s Mumbai service capability records.
              Click a name to request a consultation.
            </p>
          )}
        </div>
      </div>

      {bookingPartner && (
        <BookConsultationModal partner={bookingPartner} onClose={() => setBookingPartner(null)} />
      )}
    </>
  )
}
