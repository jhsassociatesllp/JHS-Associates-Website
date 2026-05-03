import { useEffect, useState } from 'react'
import './Kolkata.css'

import kolkataBg from '../../image/Kolkata.jpg'
import imgSharad from '../../image/Sharad-Mohata-removebg-preview.png'
import imgViranch from '../../image/Viranch-Modi-removebg-preview.png'
import imgJagdish from '../../image/Jagdish-Solanki-removebg-preview.png'
import imgSunil from '../../image/Sunil-Pathak-removebg-preview.png'

const PARTNERS = [
  {
    name: 'Sharad Mohata',
    image: imgSharad,
    qualifications: 'FCA',
    designation: 'Tax & Corporate Advisory',
    email: 'sharad.mohata.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sharad-mohata-kol',
  },
  {
    name: 'Viranch Modi',
    image: imgViranch,
    qualifications: 'FCA',
    designation: 'GST & Indirect Tax',
    email: 'viranch.modi.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/viranch-modi-kol',
  },
  {
    name: 'Jagdish Solanki',
    image: imgJagdish,
    qualifications: 'FCA',
    designation: 'Statutory Audit & Assurance',
    email: 'jagdish.solanki.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/jagdish-solanki-kol',
  },
  {
    name: 'Sunil Pathak',
    image: imgSunil,
    qualifications: 'FCA',
    designation: 'Risk Advisory & Compliance',
    email: 'sunil.pathak.kol@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sunil-pathak-kol',
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
const SECTORS = ["Real Estate","Infrastructure","FMCG","Retail","Family-Owned Business"]

/* ─── Specialisations ─────────────────────────────── */
const SPECIALIZATIONS = [
  {
    "label": "Risk-Based Internal Audit",
    "g": "a"
  },
  {
    "label": "SOP's",
    "g": "b"
  },
  {
    "label": "Dispute Resolution",
    "g": "c"
  }
]

/* ─── Map Locations ───────────────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'kolkata',
    name: 'Kolkata (Head Office)',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.4!2d88.3529!3d22.5448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277c0a7a00001%3A0x5b9f2a8e3f3e8b1a!2sPark%20Street%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1680000000006',
    address: 'Unit No. 402, 4th floor, Vardhan Complex, 25A Camac Street, Kolkata, West Bengal – 700016'
  },
  {
    id: 'parkstreet',
    name: 'Park Street',
    mapUrl: 'https://maps.google.com/maps?q=Chatterjee%20International,%20Jawaharlal%20Nehru%20Road,%20Park%20Street,%20Kolkata&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '6th Floor, Chatterjee International, 33A Jawaharlal Nehru Road, Park Street, Kolkata, West Bengal – 700071'
  },
  {
    id: 'saltlake',
    name: 'Salt Lake',
    mapUrl: 'https://maps.google.com/maps?q=Block%20EP,%20Salt%20Lake%20Sector%20V,%20Bidhannagar,%20Kolkata&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: 'Block EP, Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal – 700091'
  }
]

const BRANCHES = [
  {
    name: 'Park Street',
    address: '6th Floor, Chatterjee International, 33A Jawaharlal Nehru Road, Park Street, Kolkata, West Bengal – 700071',
  },
  {
    name: 'Salt Lake',
    address: 'Block EP, Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal – 700091',
  },
]

function PartnerAvatar({ image, name }: { image: string; name: string }) {
  return (
    <div className="kol-pc-avatar">
      <img src={image} alt={name} className="kol-pc-avatar__img" />
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

export default function Kolkata() {
  const [activeLocation, setActiveLocation] = useState(MAP_LOCATIONS[0])

  useEffect(() => { window.scrollTo({ top: 0 }) }, [])
  return (
    <div className="kol-page">
      <section className="kol-hero">
        <div className="kol-hero__photo" style={{ backgroundImage: `url(${kolkataBg})` }} />
        <div className="kol-hero__overlay" />
        <div className="kol-hero__content">
          <p className="kol-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="kol-hero__title">Kolkata</h1>
          <p className="kol-hero__sub">City of Joy &amp; Eastern India Business Gateway</p>
        </div>
        <div className="kol-hero__card">
          <span className="kol-hero__card-brand">JHS</span>
          <div className="kol-hero__card-badge">Head Office</div>
          <div className="kol-hero__card-body">
            <div className="kol-hero__card-addr">
              <IconPin />
              <span>Unit No. 402, 4th floor, Vardhan Complex, 25A Camac Street, Kolkata, West Bengal – 700016</span>
            </div>
          </div>
          <div className="kol-hero__card-info">
            <div className="kol-hero__card-info-item">
              <div>
                <span className="kol-hero__card-info-label">Phone</span>
                <span className="kol-hero__card-info-val">+91 33 1234 5678</span>
              </div>
            </div>
            <div className="kol-hero__card-info-item">
              <div>
                <span className="kol-hero__card-info-label">Email</span>
                <span className="kol-hero__card-info-val">kolkata@jhsassociates.in</span>
              </div>
            </div>
            <div className="kol-hero__card-info-item">
              <div>
                <span className="kol-hero__card-info-label">Business Hours</span>
                <span className="kol-hero__card-info-val">Mon–Sat, 9:30 AM – 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* ════════════ SECTORS SERVED ════════════ */}
      <section className="kol-section kol-sectors-section">
        <div className="kol-container">
          <div className="kol-section-hdr">
            <span className="kol-section-hdr__tag">Industries</span>
            <h2 className="kol-section-hdr__title">Sectors Served</h2>
            <p className="kol-section-hdr__sub">Deep domain expertise across dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="kol-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="kol-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="kol-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="kol-sector-card__label">{s}</span>
                <div className="kol-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ WE SPECIALISE IN ════════════ */}
      <section className="kol-section kol-specials-section">
        <div className="kol-container">
          <div className="kol-specials-inner">
            <div className="kol-specials-left">
              <span className="kol-section-hdr__tag kol-section-hdr__tag--white">Expertise</span>
              <h2 className="kol-specials-title">We Specialise In</h2>
              <p className="kol-specials-body">Bringing a breadth of specialised capabilities unmatched in the region.</p>
              <div className="kol-specials-accent-line" />
              <p className="kol-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="kol-specials-right">
              <div className="kol-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`kol-special-pill kol-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="kol-special-pill__check"><IconCheck /></span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="kol-section kol-section--light">
        <div className="kol-container">
          <div className="kol-section-hdr">
            <span className="kol-section-hdr__tag">Our Team</span>
            <h2 className="kol-section-hdr__title">Kolkata Partners</h2>
            <p className="kol-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Kolkata.
            </p>
          </div>
          <div className="kol-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="kol-pc-card">
                <PartnerAvatar image={p.image} name={p.name} />
                <div className="kol-pc-info">
                  <h3 className="kol-pc-name">{p.name}</h3>
                  <p className="kol-pc-quals">{p.qualifications}</p>
                  <p className="kol-pc-desig">{p.designation}</p>
                </div>
                <div className="kol-pc-social">
                  <a href={`mailto:${p.email}`} className="kol-pc-btn kol-pc-btn--mail"><IconMail /><span>Email</span></a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="kol-pc-btn kol-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kol-map-section">
        <div className="kol-container">
          <div className="kol-section-hdr">
            <span className="kol-section-hdr__tag">Locations</span>
            <h2 className="kol-section-hdr__title">Our Offices in Kolkata</h2>
            <p className="kol-section-hdr__sub">
              Select a location below to view it on the map.
            </p>
          </div>

          <div className="kol-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button
                key={loc.id}
                className={`kol-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`}
                onClick={() => setActiveLocation(loc)}
              >
                <IconPin />
                <span>{loc.name}</span>
              </button>
            ))}
          </div>

          <div className="kol-map-content">
            <div className="kol-map-info-card">
              <h3 className="kol-map-info-title">{activeLocation.name}</h3>
              <p className="kol-map-info-addr">{activeLocation.address}</p>
            </div>
            <div className="kol-map-wrap">
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

      <section className="kol-branches-section">
        <div className="kol-container">
          <div className="kol-section-hdr">
            <span className="kol-section-hdr__tag kol-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="kol-section-hdr__title kol-section-hdr__title--light">Kolkata Sub-Offices</h2>
            <p className="kol-section-hdr__sub kol-section-hdr__sub--light">
              Strategically located across Kolkata's key corridors for easier client access.
            </p>
          </div>
          <div className="kol-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="kol-branch-card">
                <div className="kol-branch-card__num">0{i + 1}</div>
                <div className="kol-branch-card__icon"><IconPin /></div>
                <h3 className="kol-branch-card__name">{b.name}</h3>
                <p className="kol-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
