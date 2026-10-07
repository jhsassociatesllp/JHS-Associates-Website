import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, MapPin, Mail, ArrowRight, ShieldCheck, Users, CalendarCheck, ChevronDown } from 'lucide-react'
import BookConsultationModal, { type ConsultationPartner } from '../common/BookConsultationModal'
import type { PartnerProfile } from './servicePartnersData'
import { useResolveServicePartners, useServicePointPartners } from '../../data/leadership'
import './ServicePartnersModal.css'

const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

interface ServicePartnersModalProps {
  isOpen: boolean
  onClose: () => void
  serviceTitle: string
  /** Key of this service in the admin-managed catalog (e.g. "assurance"). */
  serviceKey: string
  point: { id: string; title: string; desc: string } | null
  partners: PartnerProfile[]
}

export default function ServicePartnersModal({
  isOpen,
  onClose,
  serviceTitle,
  serviceKey,
  point,
  partners,
}: ServicePartnersModalProps) {
  const modalBodyRef = useRef<HTMLDivElement>(null)
  const [bookingPartner, setBookingPartner] = useState<ConsultationPartner | null>(null)
  // How many partner cards are still below the visible part of the list, so
  // a first-time visitor knows to scroll for more.
  const [moreBelow, setMoreBelow] = useState(0)
  const resolvePartners = useResolveServicePartners()
  const builtInPartners = useMemo(() => resolvePartners(partners), [resolvePartners, partners])
  const shownPartners = useServicePointPartners(serviceKey, point?.id ?? '', builtInPartners)

  const updateMoreBelow = useCallback(() => {
    const body = modalBodyRef.current
    if (!body) return
    const cards = Array.from(body.querySelectorAll<HTMLElement>('.sp-partner-card'))
    const { bottom } = body.getBoundingClientRect()
    // A card counts as "below" when less than ~40px of it is inside the visible area
    setMoreBelow(cards.filter((c) => c.getBoundingClientRect().top > bottom - 40).length)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    updateMoreBelow()
    // re-check once the open animation has settled
    const settle = window.setTimeout(updateMoreBelow, 350)
    window.addEventListener('resize', updateMoreBelow)
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('resize', updateMoreBelow)
    }
  }, [isOpen, shownPartners, updateMoreBelow])

  // Lock background scroll (html, body, and Lenis) and listen for ESC key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !bookingPartner) onClose()
    }

    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyPaddingRight = document.body.style.paddingRight

    // Prevent horizontal page shift when hiding scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Lock native scroll on both body & html
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Stop Lenis smooth scroll so background webpage never scrolls
    const lenis = (window as any).__lenis
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.paddingRight = prevBodyPaddingRight

      // Restart Lenis smooth scroll
      if (lenis && typeof lenis.start === 'function') {
        lenis.start()
      }

      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, bookingPartner])

  if (!isOpen || !point) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // Forward wheel events over header/bar/footer directly to the scrollable body
  const handleContainerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (modalBodyRef.current && !modalBodyRef.current.contains(e.target as Node)) {
      modalBodyRef.current.scrollTop += e.deltaY
    }
  }

  return (
    <>
    <div
      className="sp-modal-backdrop"
      onClick={onClose}
      onWheel={(e) => {
        if (e.target === e.currentTarget) e.preventDefault()
      }}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
    >
      <div
        className="sp-modal-container"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleContainerWheel}
        data-lenis-prevent="true"
      >
        
        {/* ── Modal Header ── */}
        <div className="sp-modal-header">
          <div className="sp-modal-header__meta">
            <span className="sp-modal-tag">{serviceTitle}</span>
            <span className="sp-modal-id">Point #{point.id}</span>
          </div>

          <button
            type="button"
            className="sp-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <h2 className="sp-modal-title">{point.title}</h2>
          {point.desc && <p className="sp-modal-desc">{point.desc}</p>}
        </div>

        {/* ── Modal Bar ── */}
        <div className="sp-modal-bar">
          <div className="sp-modal-bar__left">
            <Users size={18} className="sp-modal-bar__icon" />
            <span className="sp-modal-bar__label">Designated Expert Partners</span>
          </div>
          <span className="sp-modal-bar__count">
            {shownPartners.length} {shownPartners.length === 1 ? 'Expert Partner' : 'Expert Partners'}
          </span>
        </div>

        {/* ── Modal Content: Partners Grid ── */}
        <div className="sp-modal-bodywrap">
        <div className="sp-modal-body" ref={modalBodyRef} onScroll={updateMoreBelow} data-lenis-prevent="true">
          {shownPartners.length > 0 ? (
            <div className="sp-partners-grid">
              {shownPartners.map((partner, idx) => (
                <div key={`${partner.name}-${idx}`} className="sp-partner-card">
                  <div className="sp-partner-card__avatar-wrap">
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="sp-partner-card__avatar"
                        loading="lazy"
                        onError={(e) => {
                          // Hide image and fall back to initials container
                          const target = e.currentTarget
                          target.style.display = 'none'
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex'
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="sp-partner-card__avatar-placeholder"
                      style={{ display: partner.image ? 'none' : 'flex' }}
                    >
                      {getInitials(partner.name)}
                    </div>
                  </div>

                  <div className="sp-partner-card__details">
                    <h3 className="sp-partner-card__name">{partner.name}</h3>

                    {partner.creds && (
                      <span className="sp-partner-card__creds">{partner.creds}</span>
                    )}

                    {partner.designation && (
                      <p className="sp-partner-card__designation">{partner.designation}</p>
                    )}

                    <div className="sp-partner-card__location">
                      <MapPin size={13} />
                      <span>{partner.location}</span>
                    </div>

                    <div className="sp-partner-card__actions">
                      <button
                        type="button"
                        className="sp-partner-card__btn sp-partner-card__btn--book"
                        onClick={() =>
                          setBookingPartner({
                            name: partner.name,
                            role: point.title,
                            location: partner.location,
                          })
                        }
                      >
                        <CalendarCheck size={14} />
                        <span>Book Appointment</span>
                      </button>

                      {partner.email && (
                        <a
                          href={`mailto:${partner.email}?subject=Inquiry%20regarding%20${encodeURIComponent(point.title)}`}
                          className="sp-partner-card__btn sp-partner-card__btn--email"
                          title={`Email ${partner.name}`}
                        >
                          <Mail size={14} />
                          <span>Email</span>
                        </a>
                      )}

                      {partner.linkedin ? (
                        <a
                          href={partner.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sp-partner-card__btn sp-partner-card__btn--li"
                          title="LinkedIn Profile"
                        >
                          <IconLinkedIn />
                          <span>LinkedIn</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sp-empty-state">
              <ShieldCheck size={48} className="sp-empty-state__icon" />
              <h3 className="sp-empty-state__title">Specialized Advisory Engagement</h3>
              <p className="sp-empty-state__desc">
                Our national practice leaders and sector specialists lead engagements in this domain. Connect with our advisory desk to schedule a dedicated partner consultation.
              </p>
              <Link to="/contact" className="sp-empty-state__cta" onClick={onClose}>
                <span>Connect with Advisory Team</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {moreBelow > 0 && (
          <>
            <div className="sp-modal-fade" aria-hidden="true" />
            <button
              type="button"
              className="sp-modal-more"
              onClick={() =>
                modalBodyRef.current?.scrollBy({ top: modalBodyRef.current.clientHeight * 0.85, behavior: 'smooth' })
              }
            >
              <span>{moreBelow} more {moreBelow === 1 ? 'partner' : 'partners'} below</span>
              <ChevronDown size={15} />
            </button>
          </>
        )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="sp-modal-footer">
          <p className="sp-modal-footer__text">
            Looking for customized assistance? Our partner-led teams provide end-to-end execution.
          </p>
          <div className="sp-modal-footer__actions">
            <Link to="/book-appointment" className="sp-modal-btn sp-modal-btn--primary" onClick={onClose}>
              <span>Consult an Expert</span>
              <ArrowRight size={14} />
            </Link>
            <button type="button" className="sp-modal-btn sp-modal-btn--secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

      </div>
    </div>

    {bookingPartner && (
      <div style={{ position: 'relative', zIndex: 100000 }}>
        <BookConsultationModal partner={bookingPartner} onClose={() => setBookingPartner(null)} />
      </div>
    )}
    </>
  )
}
