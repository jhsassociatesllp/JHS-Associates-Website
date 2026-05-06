import { useEffect, useState } from 'react'
import './Global.css'

import globalBg from '../../image/Global.png'

const SectorIcons: Record<string, JSX.Element> = {
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
    "label": "Global Accounts Outsourcing (US, UK, Australia)",
    "g": "a"
  }
]

/* ─── Map Locations ───────────────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'uae',
    name: 'Dubai, UAE',
    mapUrl: 'https://maps.google.com/maps?q=Sheikh%20Rashid%20Tower,%20Dubai%20World%20Trade%20Center,%20Dubai,%20U.A.E&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '1703, Sheikh Rashid Tower, Dubai World Trade Center, Sheikh Zayed Road, Dubai, U.A.E'
  },
  {
    id: 'oman',
    name: 'Muscat, Oman',
    mapUrl: 'https://maps.google.com/maps?q=Ruwi,%20Muscat,%20Sultanate%20of%20Oman&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: 'P.O. Box : 3840, P. Code : 112, Ruwi, Muscat, Sultanate of Oman.'
  },
  {
    id: 'uk',
    name: 'Amersham, UK',
    mapUrl: 'https://maps.google.com/maps?q=Merritt%20House,%20Hill%20Avenue,%20Amersham%20HP6%205BQ,%20United%20Kingdom&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '1st Floor Merritt House, Hill Avenue, Amersham HP6 5BQ, United Kingdom'
  }
]

const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Global() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])

  return (
    <div className="glb-page">
      <section className="glb-hero">
        <div className="glb-hero__photo" style={{ backgroundImage: `url(${globalBg})` }} />
        <div className="glb-hero__overlay" />
        <div className="glb-hero__content">
          <p className="glb-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="glb-hero__title">Global Presence</h1>
          <p className="glb-hero__sub">Delivering Excellence Across International Borders</p>
        </div>
        <div className="glb-hero__card">
          <span className="glb-hero__card-brand">JHS</span>
          <div className="glb-hero__card-badge"> Office</div>
          <div className="glb-hero__card-body">
            <div className="glb-hero__card-addr">
              <IconPin />
              <span>International Hubs: UAE, Oman, and United Kingdom</span>
            </div>
          </div>
          <div className="glb-hero__card-info">
            <div className="glb-hero__card-info-item">
              <div>
                <span className="glb-hero__card-info-label">Email</span>
                <span className="glb-hero__card-info-val">global@jhsassociates.in</span>
              </div>
            </div>
            <div className="glb-hero__card-info-item">
              <div>
                <span className="glb-hero__card-info-label">Business Hours</span>
                <span className="glb-hero__card-info-val">Mon–Fri, 9:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ SECTORS SERVED ════════════ */}
      <section className="glb-section glb-sectors-section">
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
      </section>

      {/* ════════════ WE SPECIALISE IN ════════════ */}
      <section className="glb-section glb-specials-section">
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
      </section>

      {/* ════════════ MAP SECTION ════════════ */}
      <section className="glb-map-section">
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
      </section>
    </div>
  )
}
