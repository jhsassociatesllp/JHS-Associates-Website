import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import LazyImage from '../../common/LazyImage'
import { SECTOR_EXPERTS } from '../../../data/SectorExperts'
import { SECTOR_CASE_STUDY_MAP } from '../../../data/SectorCaseStudyMap'
import { CASE_STUDIES } from '../../../data/CaseStudies'
import { copyToClipboard } from '../../../utils/copyToClipboard'
import './SectorEngagement.css'

interface SectorEngagementProps {
  /** Key into SECTOR_EXPERTS / SECTOR_CASE_STUDY_MAP, matching the sector's file name (e.g. "Retail", "Banking"). */
  sectorKey: string
  /** Human-readable sector name used in section copy (e.g. "Retail", "Banking & Financial Services"). */
  sectorLabel: string
}

interface CaseStudy {
  id: string
  title: string
  sector: string
  category: string
  image: string
}

const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const IconMail = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)

const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

export default function SectorEngagement({ sectorKey, sectorLabel }: SectorEngagementProps) {
  const experts = SECTOR_EXPERTS[sectorKey as keyof typeof SECTOR_EXPERTS] ?? []
  const matchedSectors: string[] = SECTOR_CASE_STUDY_MAP[sectorKey as keyof typeof SECTOR_CASE_STUDY_MAP] ?? []
  const caseStudies = (CASE_STUDIES as CaseStudy[]).filter((cs) => matchedSectors.includes(cs.sector)).slice(0, 2)

  const [openMailFor, setOpenMailFor] = useState<string | null>(null)
  const mailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mailRef.current && !mailRef.current.contains(e.target as Node)) {
        setOpenMailFor(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* ── SECTOR EXPERTS ── */}
      {experts.length > 0 && (
        <section className="se-experts container">
          <div className="se-section-hd">
            <span className="se-tag">{experts.length > 1 ? 'Sector Experts' : 'Sector Expert'}</span>
            <h2 className="se-section-hd__title">Meet Our {sectorLabel} Specialists</h2>
          </div>

          <div className="se-experts__grid">
            {experts.map((person) => (
              <div key={person.name} className="se-expert-card">
                <div className="se-expert-card__img-wrap">
                  {person.image ? (
                    <LazyImage src={person.image} alt={person.name} className="se-expert-card__img" />
                  ) : (
                    <div className="se-expert-card__placeholder">
                      <span>{person.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <h3 className="se-expert-card__name">{person.name}</h3>
                {person.creds && <p className="se-expert-card__creds">{person.creds}</p>}

                <span className="se-expert-card__location">
                  <IconPin /> {person.location}
                </span>

                <div className="se-expert-card__divider" />

                <div className="se-expert-card__contact">
                  {person.email && (
                    <div className="se-expert-card__mail-wrap" ref={openMailFor === person.name ? mailRef : null}>
                      <button
                        type="button"
                        className={`se-expert-card__email ${openMailFor === person.name ? 'is-open' : ''}`}
                        onClick={() => setOpenMailFor(openMailFor === person.name ? null : person.name)}
                      >
                        <IconMail /><span>Email</span>
                      </button>
                      {openMailFor === person.name && (
                        <div className="se-expert-card__mail-dropdown">
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${person.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="se-expert-card__mail-option"
                            onClick={() => setOpenMailFor(null)}
                          >
                            Open in Gmail
                          </a>
                          <a
                            href={`https://outlook.office.com/mail/deeplink/compose?to=${person.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="se-expert-card__mail-option"
                            onClick={() => setOpenMailFor(null)}
                          >
                            Open in Outlook Web
                          </a>
                          <a
                            href={`mailto:${person.email}`}
                            className="se-expert-card__mail-option"
                            onClick={() => setOpenMailFor(null)}
                          >
                            Default Mail App
                          </a>
                          <button
                            type="button"
                            className="se-expert-card__mail-option"
                            onClick={() => {
                              copyToClipboard(person.email)
                              setOpenMailFor(null)
                            }}
                          >
                            Copy Email Address
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="se-expert-card__linkedin"
                    aria-label={`${person.name} on LinkedIn`}
                  >
                    <IconLinkedIn /> Connect
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="se-experts__footer">
            <Link to="/know-us/leadership" className="se-btn se-btn--link">
              Meet the Full Team <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* ── CASE STUDIES ── */}
      <section className="se-cases container">
        <div className="se-section-hd">
          <span className="se-tag">Proven Impact</span>
          <h2 className="se-section-hd__title">Case Studies in {sectorLabel}</h2>
        </div>

        {caseStudies.length > 0 ? (
          <div className="se-cases__grid">
            {caseStudies.map((cs) => (
              <Link to={`/case-studies/${cs.id}`} key={cs.id} className="se-case-card">
                <div className="se-case-card__img" style={{ backgroundImage: `url('${cs.image}')` }} />
                <div className="se-case-card__body">
                  <span className="se-case-card__meta">{cs.category}</span>
                  <h3 className="se-case-card__title">{cs.title}</h3>
                  <span className="se-case-card__link">Read More <ArrowUpRight size={13} /></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="se-cases__empty">
            <p>Explore how we've helped clients across industries achieve measurable results.</p>
            <Link to="/case-studies" className="se-btn se-btn--solid">
              View All Case Studies <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
