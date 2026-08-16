import { useEffect, useRef, useState, type ReactElement } from 'react'
import './Global.css'
import { imageUrl } from '../../utils/imageUrl'
import { mapEmbedUrl } from '../../utils/mapEmbedUrl'
import { copyToClipboard } from '../../utils/copyToClipboard'

const PARTNERS = [
  {
    name: 'Vinod Joshi',
    image: imageUrl('vinod joshi.webp'),
    qualifications: 'FCA, MBA (Finance)',
    designation: 'Financial Advisory & CFO Services',
    email: 'vinod.joshi@jhsuae.com',
    linkedin: 'https://linkedin.com/in/vinod-joshi-fca',
  },
]

const SectorIcons: Record<string, ReactElement> = {
  BFSI: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 16 L20 7 L35 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="16" width="30" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="20" width="5" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="17.5" y="20" width="5" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="27" y="20" width="5" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="5" y="30" width="30" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="20" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Manufacturing: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="20" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 8 L20 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 29 L20 32" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 20 L11 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29 20 L32 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11.5 11.5 L13.6 13.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M26.4 26.4 L28.5 28.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28.5 11.5 L26.4 13.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.6 26.4 L11.5 28.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  NPO: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 32 L9.5 21.5 C6.7 18.7 6.7 14.3 9.5 11.5 C12.3 8.7 16.7 8.7 19.5 11.5 L20 12 L20.5 11.5 C23.3 8.7 27.7 8.7 30.5 11.5 C33.3 14.3 33.3 18.7 30.5 21.5 L20 32 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  "NGO's": (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 32 L9.5 21.5 C6.7 18.7 6.7 14.3 9.5 11.5 C12.3 8.7 16.7 8.7 19.5 11.5 L20 12 L20.5 11.5 C23.3 8.7 27.7 8.7 30.5 11.5 C33.3 14.3 33.3 18.7 30.5 21.5 L20 32 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  Retail: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 16 L14 12 C14 8.7 16.7 6 20 6 C23.3 6 26 8.7 26 12 L26 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  'Corporates & Trusts': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="16" height="24" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 34 L32 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 16 L16 18 M24 16 L24 18 M16 22 L16 24 M24 22 L24 24 M16 28 L16 30 M24 28 L24 30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  'Individual Investors': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="14" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 32 C10 26.5 14.5 22 20 22 C25.5 22 30 26.5 30 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  FMCG: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8 L10 8 L14 26 L30 26 L34 14 L12 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="28" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  'Real Estate': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20 L20 7 L35 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="20" width="22" height="14" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="16" y="24" width="8" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  Infrastructure: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 34 L10 14 L30 14 L30 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 24 L30 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 14 L20 6 L30 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14 L15 34 M25 14 L25 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  'Family-Owned Business': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 18 C16.2 18 18 16.2 18 14 C18 11.8 16.2 10 14 10 C11.8 10 10 11.8 10 14 C10 16.2 11.8 18 14 18 Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M26 22 C28.2 22 30 20.2 30 18 C30 15.8 28.2 14 26 14 C23.8 14 22 15.8 22 18 C22 20.2 23.8 22 26 22 Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 32 C6 27.6 9.6 24 14 24 C16.5 24 18.7 25.1 20.1 26.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.9 32 C19.9 28.5 22.3 25.5 25.6 24.9 C25.7 24.8 25.9 24.8 26 24.8 C29.9 24.8 33 28 33 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/* ─── Sectors ─────────────────────────────────────── */
const SECTORS = ["NPO", "NGO's", "Manufacturing", "Retail", "Corporates & Trusts", "Individual Investors"]

/* ─── Specialisations ─────────────────────────────── */
const SPECIALIZATIONS = [
  {
    "label": "Individual Tax",
    "g": "a"
  },
  {
    "label": "Corporate Tax",
    "g": "b"
  },
  {
    "label": "Transfer Pricing",
    "g": "c"
  },
  {
    "label": "Outsourced Accounting",
    "g": "a"
  },
  {
    "label": "Global Taxation",
    "g": "b"
  },
  {
    "label": "Global Outsourcing",
    "g": "c"
  },
  {
    "label": "Learning & Development",
    "g": "c"
  },
  {
    "label": "Global Accounts Outsourcing (UAE, Oman & UK)",
    "g": "a"
  }
]

/* ─── Map Locations ───────────────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'uae',
    name: 'Dubai, UAE',
    address: '1703, Sheikh Rashid Tower, Dubai World Trade Center, Sheikh Zayed Road, Dubai, U.A.E'
  },
  {
    id: 'oman',
    name: 'Muscat, Oman',
    address: 'P.O. Box : 3840, P. Code : 112, Ruwi, Muscat, Sultanate of Oman'
  },
  {
    id: 'uk',
    name: 'Amersham, UK',
    address: '1st Floor Merritt House, Hill Avenue, Amersham HP6 5BQ, United Kingdom'
  },
  // {
  //   id: 'kenya',
  //   name: 'Nairobi, Kenya',
  //   mapUrl: 'https://maps.google.com/maps?q=Nairobi,%20Kenya&t=&z=13&ie=UTF8&iwloc=&output=embed',
  //   address: 'Nairobi, Kenya'
  // },
  // {
  //   id: 'usa',
  //   name: 'USA',
  //   mapUrl: 'https://maps.google.com/maps?q=New%20York,%20USA&t=&z=12&ie=UTF8&iwloc=&output=embed',
  //   address: 'United States of America'
  // }
].map(loc => ({ ...loc, mapUrl: mapEmbedUrl(loc.address) }))

const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

function PartnerAvatar({ image, name }: { image: string; name: string }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="glb-pc-avatar">
      {!imgError ? (
        <img src={image} alt={name} className="glb-pc-avatar__img" loading="lazy" onError={() => setImgError(true)} />
      ) : (
        <div className="glb-pc-avatar__placeholder">{name.charAt(0)}</div>
      )}
    </div>
  )
}

const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Global() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])
  const [openMailFor, setOpenMailFor] = useState<string | null>(null)
  const mailRef = useRef<HTMLDivElement>(null)

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

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
    <div className="glb-page">
      <section className="glb-hero">
        <div className="glb-hero__photo" style={{ backgroundImage: `url(${imageUrl('Global.webp')})` }} />
        <div className="glb-hero__overlay" />
        <div className="glb-hero__content">
          {/* <p className="glb-hero__eyebrow">JHS &amp; Associates LLP</p> */}
          <h1 className="glb-hero__title">Global Presence</h1>
          <p className="glb-hero__sub">Delivering Excellence Across International Borders</p>
        </div>
        <div className="glb-hero__card">
          <span className="glb-hero__card-brand">JHS</span>
          <div className="glb-hero__card-badge"> Office</div>
          <div className="glb-hero__card-body">
            <div className="glb-hero__card-addr">
              <IconPin />
              <span>International Hubs: UAE, Oman and United Kingdom</span>
            </div>
          </div>
          <div className="glb-hero__card-info">
            <div className="glb-hero__card-info-item">

              <div>
                <span className="glb-hero__card-info-label">Email</span>
                <span className="glb-hero__card-info-val">vinod.joshi@jhsuae.com</span>
              </div>
            </div>
            <div className="glb-hero__card-info-item">
              <div>
                <span className="glb-hero__card-info-label">Phone</span>
                <span className="glb-hero__card-info-val">+971 4348 0046</span>
              </div>
            </div>
          </div>
        </div >
      </section >

      {/* ══ STATS RIBBON ══ */}
      <div className="glb-ribbon">
        <div className="glb-ribbon__inner">
          {([[`${PARTNERS.length}`, 'Expert Partners'], [`${SECTORS.length}`, 'Sectors Served'], [`${SPECIALIZATIONS.length}`, 'Specialisations'], [`${MAP_LOCATIONS.length}`, 'Global Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="glb-ribbon__item"><span className="glb-ribbon__num">{num}</span><span className="glb-ribbon__lbl">{lbl}</span></div>
          ))}
        </div>
      </div>

      {/* ════════════ PARTNERS ════════════ */}
      <section className="glb-section glb-partners-section">
        <div className="glb-container">
          <div className="glb-section-hdr">
            <span className="glb-section-hdr__tag">Our Team</span>
            <h2 className="glb-section-hdr__title">Global Partners</h2>
            <p className="glb-section-hdr__sub">Meet the leader driving excellence across our international offices.</p>
          </div>
          <div className="glb-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="glb-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="glb-pc-info">
                  <h3 className="glb-pc-name">{p.name}</h3>
                  <p className="glb-pc-quals">{p.qualifications}</p>
                  <p className="glb-pc-desig">{p.designation}</p>
                </div>
                <div className="glb-pc-social">
                  <div className="glb-pc-mail-wrap" ref={openMailFor === p.name ? mailRef : null}>
                    <button
                      type="button"
                      className={`glb-pc-btn glb-pc-btn--mail ${openMailFor === p.name ? 'is-open' : ''}`}
                      onClick={() => setOpenMailFor(openMailFor === p.name ? null : p.name)}
                    >
                      <IconMail /><span>Email</span>
                    </button>
                    {openMailFor === p.name && (
                      <div className="glb-pc-mail-dropdown">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glb-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Gmail
                        </a>
                        <a
                          href={`https://outlook.office.com/mail/deeplink/compose?to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glb-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Outlook Web
                        </a>
                        <a
                          href={`mailto:${p.email}`}
                          className="glb-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Default Mail App
                        </a>
                        <button
                          type="button"
                          className="glb-pc-mail-option"
                          onClick={() => {
                            copyToClipboard(p.email)
                            setOpenMailFor(null)
                          }}
                        >
                          Copy Email Address
                        </button>
                      </div>
                    )}
                  </div>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="glb-pc-btn glb-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ SECTORS SERVED ════════════ */}
      < section className="glb-section glb-sectors-section" >
        <div className="glb-container">
          <div className="glb-section-hdr">
            <span className="glb-section-hdr__tag">Industries</span>
            <h2 className="glb-section-hdr__title">Sectors Served</h2>
            <p className="glb-section-hdr__sub">Deep domain expertise across dynamic international industries — built through years of hands-on global client engagement.</p>
          </div>
          <div className="glb-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="glb-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="glb-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="glb-sector-card__label">{s}</span>
                <div className="glb-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* ════════════ WE SPECIALISE IN ════════════ */}
      < section className="glb-section glb-specials-section" >
        <div className="glb-container">
          <div className="glb-specials-inner">
            <div className="glb-specials-left">
              <span className="glb-section-hdr__tag glb-section-hdr__tag--white">Expertise</span>
              <h2 className="glb-specials-title">We Specialise In</h2>
              <p className="glb-specials-body">Bringing a breadth of specialised global taxation and outsourcing capabilities.</p>
              <div className="glb-specials-accent-line" />
              <p className="glb-specials-note">Each specialisation is backed by certified international professionals with cross-border project experience.</p>
            </div>
            <div className="glb-specials-right">
              <div className="glb-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`glb-special-pill glb-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="glb-special-pill__check"><IconCheck /></span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ════════════ MAP SECTION ════════════ */}
      < section className="glb-map-section" >
        <div className="glb-container">
          <div className="glb-section-hdr">
            <span className="glb-section-hdr__tag">Locations</span>
            <h2 className="glb-section-hdr__title">Our International Offices</h2>
            <p className="glb-section-hdr__sub">
              Select a location below to view it on the map.
            </p>
          </div>

          <div className="glb-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button
                key={loc.id}
                className={`glb-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`}
                onClick={() => setActiveLocation(loc)}
              >
                <IconPin />
                <span>{loc.name}</span>
              </button>
            ))}
          </div>

          <div className="glb-map-content">
            <div className="glb-map-info-card">
              <h3 className="glb-map-info-title">{activeLocation.name}</h3>
              <p className="glb-map-info-addr">{activeLocation.address}</p>
            </div>
            <div className="glb-map-wrap">
              <iframe
                title={`JHS ${activeLocation.name} Office`}
                src={activeLocation.mapUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section >
    </div >
  )
}
