import { useEffect, useRef, useState } from 'react'
import './Hyderabad.css'
import './CityShared.css'

import { imageUrl } from '../../utils/imageUrl'

const PARTNERS = [
  { name: 'Pradeep', image: imageUrl('NM Pradeep.png'), qualifications: 'FCA', designation: 'Statutory Audit & Tax Advisory', teamSize: 10, clientsServed: 38, email: 'pradeep@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/pradeep-jhs' },
  { name: 'Geethika Ghanta', image: imageUrl('Geethika Ghanta.png'), qualifications: 'FCA', designation: 'Risk Advisory & Compliance', teamSize: 7, clientsServed: 25, email: 'geethika.ghanta@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/ca-geethika-ghanta-99a159160/' },
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
}

const SECTORS = ['BFSI', 'FMCG', 'Real Estate']

const SPECIALIZATIONS = [
  { label: 'Accounts Payable Management', g: 'a' },
  { label: 'GST', g: 'b' },
  { label: 'Bank Audits', g: 'c' },
  { label: 'Income Tax', g: 'a' },
  { label: 'Transfer Pricing', g: 'b' },
  { label: 'Concurrent Audit', g: 'c' },
  { label: 'Outsourcing', g: 'a' },
]

const MAP_LOCATIONS = [
  {
    id: 'hyderabad', name: 'Hyderabad ', tag: '',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3!2d78.3722!3d17.4474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688bef76177fe5!2sHiTech%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000003!5m2!1sen!2sin',
    address: '6-3-788/36 & 37/A, "Badhe House", First Floor, Durganagar, Ameerpet, Hyderabad, Telangana – 500016'
  },
  // {
  //   id: 'hiteccity', name: 'HITEC City', tag: 'Branch',
  //   mapUrl: 'https://maps.google.com/maps?q=Cyber%20Towers,%20HITEC%20City,%20Madhapur,%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed',
  //   address: '8th Floor, Cyber Towers, HITEC City, Madhapur, Hyderabad, Telangana – 500081'
  // },
  // {
  //   id: 'banjarahills', name: 'Banjara Hills', tag: 'Branch',
  //   mapUrl: 'https://maps.google.com/maps?q=Lumbini%20Avenue,%20Road%20No.%202,%20Banjara%20Hills,%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed',
  //   address: '201, 2nd Floor, Lumbini Avenue, Road No. 2, Banjara Hills, Hyderabad, Telangana – 500034'
  // },
]

const IconMail = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>)
const IconLinkedIn = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>)
const IconPin = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>)
const IconCheck = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)

export default function Hyderabad() {
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
    <div className="hyd-page">
      <section className="hyd-hero">
        <div className="hyd-hero__photo" style={{ backgroundImage: `url(${imageUrl('Hyderabad.png')})` }} />
        <div className="hyd-hero__overlay" />
        <div className="hyd-hero__content">
          {/* <span className="hyd-hero__eyebrow">JHS &amp; Associates LLP</span> */}
          <h1 className="hyd-hero__title">Hyderabad</h1>
          <p className="hyd-hero__sub">South India Tech Hub &amp; Strategic Regional Office</p>
        </div>
        <div className="hyd-hero__card">
          <div className="hyd-hero__card-left">
            <span className="hyd-hero__card-badge">Hyderabad</span>
            <div className="hyd-hero__card-addr"><IconPin /><span>6-3-788/36 &amp; 37/A, "Badhe House", First Floor, Durganagar, Ameerpet, Hyderabad, Telangana – 500016</span></div>
          </div>
          <div className="hyd-hero__card-divider" />
          {/* <div className="hyd-hero__card-right">
            <div className="hyd-hero__card-stat"><span className="hyd-hero__card-stat-label">Phone</span><span className="hyd-hero__card-stat-val">+91 40 1234 5678</span></div>
            <div className="hyd-hero__card-stat"><span className="hyd-hero__card-stat-label">Email</span><span className="hyd-hero__card-stat-val">hyderabad@jhsassociates.in</span></div>
            <div className="hyd-hero__card-stat"><span className="hyd-hero__card-stat-label">Hours</span><span className="hyd-hero__card-stat-val">Mon–Sat, 9:30 AM – 6:30 PM</span></div>
          </div> */}
        </div>
      </section>

      <div className="hyd-ribbon">
        <div className="hyd-ribbon__inner">
          {([['2', 'Expert Partners'], ['3', 'Sectors Served'], ['7', 'Specialisations'], ['1', 'Hyderabad Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="hyd-ribbon__item"><span className="hyd-ribbon__num">{num}</span><span className="hyd-ribbon__lbl">{lbl}</span></div>
          ))}
        </div>


      <section className="hyd-section hyd-partners-section">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag">Our Team</span>
            <h2 className="hyd-section-hdr__title">Hyderabad Partners</h2>
            <p className="hyd-section-hdr__sub">Meet the leaders driving excellence across audit, tax, advisory, and assurance in Hyderabad.</p>
          </div>
          <div className="hyd-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="hyd-pc-card">
                <div className="hyd-pc-avatar"><img src={p.image} alt={p.name} className="hyd-pc-avatar__img" loading="lazy" /></div>
                <div className="hyd-pc-info"><h3 className="hyd-pc-name">{p.name}</h3><p className="hyd-pc-quals">{p.qualifications}</p><p className="hyd-pc-desig">{p.designation}</p></div>
                <div className="hyd-pc-stats">
                  <div className="hyd-pc-stat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg><span className="hyd-pc-stat__val">{p.teamSize}</span><span className="hyd-pc-stat__lbl">Team Size</span></div>
                  <div className="hyd-pc-stat"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><span className="hyd-pc-stat__val">{p.clientsServed}+</span><span className="hyd-pc-stat__lbl">Clients Served</span></div>
                </div>
                <div className="hyd-pc-social">
                  <div className="hyd-pc-mail-wrap" ref={openMailFor === p.email ? mailRef : null}>
                    <button
                      type="button"
                      className={`hyd-pc-btn hyd-pc-btn--mail ${openMailFor === p.email ? 'is-open' : ''}`}
                      onClick={() => setOpenMailFor(openMailFor === p.email ? null : p.email)}
                    >
                      <IconMail /><span>Email</span>
                    </button>
                    {openMailFor === p.email && (
                      <div className="hyd-pc-mail-dropdown">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hyd-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Gmail
                        </a>
                        <a
                          href={`https://outlook.office.com/mail/deeplink/compose?to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hyd-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Outlook Web
                        </a>
                        <a
                          href={`mailto:${p.email}`}
                          className="hyd-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Default Mail App
                        </a>
                        <button
                          type="button"
                          className="hyd-pc-mail-option"
                          onClick={() => {
                            navigator.clipboard.writeText(p.email)
                            setOpenMailFor(null)
                          }}
                        >
                          Copy Email Address
                        </button>
                      </div>
                    )}
                  </div>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="hyd-pc-btn hyd-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="hyd-section hyd-specials-section">
        <div className="hyd-container">
          <div className="hyd-specials-inner">
            <div className="hyd-specials-left">
              <span className="hyd-section-hdr__tag hyd-section-hdr__tag--white">Expertise</span>
              <h2 className="hyd-specials-title">We Specialised In</h2>
              <p className="hyd-specials-body">From concurrent bank audits to transfer pricing, our Hyderabad team delivers specialised financial and tax advisory across key sectors.</p>
              <div className="hyd-specials-accent-line" />
              <p className="hyd-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="hyd-specials-right">
              <div className="hyd-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`hyd-special-pill hyd-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="hyd-special-pill__check"><IconCheck /></span><span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* ══ SECTORS SERVED ══ */}
      <section className="hyd-section hyd-sectors-section">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag">Industries</span>
            <h2 className="hyd-section-hdr__title">Sectors Served</h2>
            <p className="hyd-section-hdr__sub">Deep domain expertise across Telangana's most dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="hyd-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="hyd-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="hyd-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="hyd-sector-card__label">{s}</span>
                <div className="hyd-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hyd-map-section">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag">Locations</span>
            <h2 className="hyd-section-hdr__title">Our Offices in Hyderabad</h2>
            <p className="hyd-section-hdr__sub">Select a location to view it on the map.</p>
          </div>
          <div className="hyd-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} className={`hyd-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`} onClick={() => setActiveLocation(loc)}>
                <IconPin /><span>{loc.name}</span>
                {/* {loc.tag === 'Head Office' && <span className="hyd-map-tab__badge">HQ</span>} */}
              </button>
            ))}
          </div>
          <div className="hyd-map-layout">
            <div className="hyd-map-info-card">
              <div className="hyd-map-info-tag">{activeLocation.tag}</div>
              <h3 className="hyd-map-info-title">{activeLocation.name}</h3>
              <div className="hyd-map-info-addr-row"><IconPin /><p className="hyd-map-info-addr">{activeLocation.address}</p></div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`} target="_blank" rel="noopener noreferrer" className="hyd-map-directions-btn">Get Directions →</a>
            </div>
            <div className="hyd-map-wrap">
              <iframe title={`JHS ${activeLocation.name}`} src={activeLocation.mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* <section className="hyd-branches-section">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag">Sub-Offices</span>
            <h2 className="hyd-section-hdr__title">Hyderabad Sub-Offices</h2>
            <p className="hyd-section-hdr__sub">Strategically located across Hyderabad's key business corridors for easier client access.</p>
          </div>
          <div className="hyd-branches-grid">
            {[
              { name: 'HITEC City', num: '01', address: '8th Floor, Cyber Towers, HITEC City, Madhapur, Hyderabad, Telangana – 500081' },
              { name: 'Banjara Hills', num: '02', address: '201, 2nd Floor, Lumbini Avenue, Road No. 2, Banjara Hills, Hyderabad, Telangana – 500034' },
            ].map(b => (
              <div key={b.name} className="hyd-branch-card">
                <div className="hyd-branch-card__num">{b.num}</div>
                <div className="hyd-branch-card__content">
                  <div className="hyd-branch-card__icon-wrap"><IconPin /></div>
                  <h3 className="hyd-branch-card__name">{b.name}</h3>
                  <p className="hyd-branch-card__addr">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══ CASE STUDIES ══ */}
      <section className="city-cs-section">
        <div className="hyd-container">
          <div className="hyd-section-hdr">
            <span className="hyd-section-hdr__tag">Case Studies</span>
            <h2 className="hyd-section-hdr__title">Success Stories</h2>
            <p className="hyd-section-hdr__sub">Real impact delivered for clients across Hyderabad — from pharma regulatory audits to tech transfer pricing and real estate compliance.</p>
          </div>
          <div className="city-cs-grid">
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Regulatory Audit</span>
              <h3 className="city-cs-card__title">Schedule M Compliance for a Pharma Exporter</h3>
              <p className="city-cs-card__body">Assisted a bulk drug exporter in achieving Schedule M GMP compliance, strengthening documentation and quality control systems ahead of a USFDA inspection.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">Pharma</span>
                <span className="city-cs-card__result">USFDA inspection cleared</span>
              </div>
            </div>
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Transfer Pricing</span>
              <h3 className="city-cs-card__title">TP Study for a Global IT Services Company</h3>
              <p className="city-cs-card__body">Conducted a benchmarking study and prepared robust TP documentation for a Hyderabad-based IT services subsidiary, successfully defending assessment proceedings.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">IT Services</span>
                <span className="city-cs-card__result">₹4Cr+ exposure defended</span>
              </div>
            </div>
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Real Estate Advisory</span>
              <h3 className="city-cs-card__title">RERA Compliance for a Residential Developer</h3>
              <p className="city-cs-card__body">Structured RERA compliance framework and quarterly reporting for a residential developer with 3 ongoing projects, ensuring buyer fund protection and regulatory adherence.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">Real Estate</span>
                <span className="city-cs-card__result">3 projects fully RERA compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ RFP CTA ══ */}
      <section className="city-rfp-section">
        <div className="city-rfp-inner">
          <div className="city-rfp-text">
            <h2 className="city-rfp-title">Ready to Work With Us?</h2>
            <p className="city-rfp-sub">Submit a Request for Proposal and our Hyderabad team will respond within 24 hours.</p>
          </div>
          <a href="/contact" className="city-rfp-btn">Request for Proposal</a>
        </div>
      </section>

    </div>
  )
}