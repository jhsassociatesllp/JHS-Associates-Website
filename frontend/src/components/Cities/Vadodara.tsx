import { useEffect, useState } from 'react'
import './Vadodara.css'

import vadodaraBg from '../../image/Vadodara.jpg'
import imgMehul from '../../image/Mehul-Shah-removebg-preview.png'
import imgMilin from '../../image/Milin-Parekh-removebg-preview.png'
import imgRaj from '../../image/Raj-Shah-removebg-preview.png'
import imgKalpesh from '../../image/Kalpesh-Parmar-removebg-preview.png'

const PARTNERS = [
  {
    name: 'Mehul Shah',
    image: imgMehul,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'mehul.shah.vad@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/mehul-shah-vadodara',
  },
  {
    name: 'Milin Parekh',
    image: imgMilin,
    qualifications: 'FCA',
    designation: 'Direct Tax & Advisory',
    email: 'milin.parekh@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/milin-parekh',
  },
  {
    name: 'Raj Shah',
    image: imgRaj,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Internal Audit',
    email: 'raj.shah.vad@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/raj-shah-vadodara',
  },
  {
    name: 'Kalpesh Parmar',
    image: imgKalpesh,
    qualifications: 'FCA',
    designation: 'Accounts Outsourcing & Compliance',
    email: 'kalpesh.parmar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/kalpesh-parmar',
  },
]


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
const SECTORS = ["NPO","NGO's","Manufacturing","Retail","Corporates & Trusts","Individual Investors"]

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
    id: 'vadodara',
    name: 'Vadodara (Head Office)',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.4!2d73.1812!3d22.3119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc5873e48f5a9%3A0x1be90e4cce8bf0c6!2sAlkapuri%2C%20Vadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1680000000004',
    address: '4th floor, Lila Chambers, Notus Pride, Vadodara, Gujarat – 390023'
  },
  {
    id: 'alkapuri',
    name: 'Alkapuri',
    mapUrl: 'https://maps.google.com/maps?q=Kumar%20Plaza,%20Alkapuri,%20Vadodara,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '301, 3rd Floor, Kumar Plaza, Alkapuri, Vadodara, Gujarat – 390007'
  },
  {
    id: 'fatehgunj',
    name: 'Fatehgunj',
    mapUrl: 'https://maps.google.com/maps?q=Dev%20Complex,%20Near%20BSNL%20Office,%20Fatehgunj,%20Vadodara&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '102, Dev Complex, Near BSNL Office, Fatehgunj, Vadodara, Gujarat – 390002'
  }
]

const BRANCHES = [
  {
    name: 'Alkapuri',
    address: '301, 3rd Floor, Kumar Plaza, Alkapuri, Vadodara, Gujarat – 390007',
  },
  {
    name: 'Fatehgunj',
    address: '102, Dev Complex, Near BSNL Office, Fatehgunj, Vadodara, Gujarat – 390002',
  },
]

function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="vad-pc-avatar">
      <img src={image} alt={name} className="vad-pc-avatar__img" />
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

export default function Vadodara() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])
  return (
    <div className="vad-page">
      <section className="vad-hero">
        <div className="vad-hero__photo" style={{ backgroundImage: `url(${vadodaraBg})` }} />
        <div className="vad-hero__overlay" />
        <div className="vad-hero__content">
          <p className="vad-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="vad-hero__title">Vadodara</h1>
          <p className="vad-hero__sub">Cultural Capital &amp; Growing Business Hub of Gujarat</p>
        </div>
        <div className="vad-hero__card">
          <span className="vad-hero__card-brand">JHS</span>
          <div className="vad-hero__card-badge">Head Office</div>
          <div className="vad-hero__card-body">
            <div className="vad-hero__card-addr">
              <IconPin />
              <span>4th floor, Lila Chambers, Notus Pride, Vadodara, Gujarat – 390023</span>
            </div>
          </div>
          <div className="vad-hero__card-info">
            <div className="vad-hero__card-info-item">
              <div>
                <span className="vad-hero__card-info-label">Phone</span>
                <span className="vad-hero__card-info-val">+91 265 1234 5678</span>
              </div>
            </div>
            <div className="vad-hero__card-info-item">
              <div>
                <span className="vad-hero__card-info-label">Email</span>
                <span className="vad-hero__card-info-val">vadodara@jhsassociates.in</span>
              </div>
            </div>
            <div className="vad-hero__card-info-item">
              <div>
                <span className="vad-hero__card-info-label">Business Hours</span>
                <span className="vad-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* ════════════ SECTORS SERVED ════════════ */}
      <section className="vad-section vad-sectors-section">
        <div className="vad-container">
          <div className="vad-section-hdr">
            <span className="vad-section-hdr__tag">Industries</span>
            <h2 className="vad-section-hdr__title">Sectors Served</h2>
            <p className="vad-section-hdr__sub">Deep domain expertise across dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="vad-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="vad-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="vad-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="vad-sector-card__label">{s}</span>
                <div className="vad-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ WE SPECIALISE IN ════════════ */}
      <section className="vad-section vad-specials-section">
        <div className="vad-container">
          <div className="vad-specials-inner">
            <div className="vad-specials-left">
              <span className="vad-section-hdr__tag vad-section-hdr__tag--white">Expertise</span>
              <h2 className="vad-specials-title">We Specialise In</h2>
              <p className="vad-specials-body">Bringing a breadth of specialised capabilities unmatched in the region.</p>
              <div className="vad-specials-accent-line" />
              <p className="vad-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="vad-specials-right">
              <div className="vad-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`vad-special-pill vad-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="vad-special-pill__check"><IconCheck /></span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="vad-section vad-section--light">
        <div className="vad-container">
          <div className="vad-section-hdr">
            <span className="vad-section-hdr__tag">Our Team</span>
            <h2 className="vad-section-hdr__title">Vadodara Partners</h2>
            <p className="vad-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Vadodara.
            </p>
          </div>
          <div className="vad-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="vad-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="vad-pc-info">
                  <h3 className="vad-pc-name">{p.name}</h3>
                  <p className="vad-pc-quals">{p.qualifications}</p>
                  <p className="vad-pc-desig">{p.designation}</p>
                </div>
                <div className="vad-pc-social">
                  <a href={`mailto:${p.email}`} className="vad-pc-btn vad-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="vad-pc-btn vad-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vad-map-section">
        <div className="vad-container">
          <div className="vad-section-hdr">
            <span className="vad-section-hdr__tag">Locations</span>
            <h2 className="vad-section-hdr__title">Our Offices in Vadodara</h2>
            <p className="vad-section-hdr__sub">
              Select a location below to view it on the map.
            </p>
          </div>

          <div className="vad-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button
                key={loc.id}
                className={`vad-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`}
                onClick={() => setActiveLocation(loc)}
              >
                <IconPin />
                <span>{loc.name}</span>
              </button>
            ))}
          </div>

          <div className="vad-map-content">
            <div className="vad-map-info-card">
              <h3 className="vad-map-info-title">{activeLocation.name}</h3>
              <p className="vad-map-info-addr">{activeLocation.address}</p>
            </div>
            <div className="vad-map-wrap">
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

      <section className="vad-branches-section">
        <div className="vad-container">
          <div className="vad-section-hdr">
            <span className="vad-section-hdr__tag vad-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="vad-section-hdr__title vad-section-hdr__title--light">Vadodara Sub-Offices</h2>
            <p className="vad-section-hdr__sub vad-section-hdr__sub--light">
              Strategically located across Vadodara's key business corridors for easier client access.
            </p>
          </div>
          <div className="vad-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="vad-branch-card">
                <div className="vad-branch-card__num">0{i + 1}</div>
                <div className="vad-branch-card__icon"><IconPin /></div>
                <h3 className="vad-branch-card__name">{b.name}</h3>
                <p className="vad-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
