import { useEffect, useRef, useState } from 'react'
import './Ahmedabad.css'
import './CityShared.css'

/* ─── Hero background ───────────────────────────────── */
import { imageUrl } from '../../utils/imageUrl'

/* ─── Partner Image Imports ─────────────────────────── */


/* ─── Sector SVG Icons ───────────────────────────────── */
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
      <circle cx="20" cy="13" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 32 C10 26.5 14.5 22 20 22 C25.5 22 30 26.5 30 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25 16 L27 18 L31 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Retail: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 16 L14 12 C14 8.7 16.7 6 20 6 C23.3 6 26 8.7 26 12 L26 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 22 L26 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  'Corporates & Trusts': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="11" y="9" width="18" height="25" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 34 L33 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="17" y="15" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 26 L25 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 29 L22 29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'Individual Investors': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="13" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 32 C10 26.5 14.5 22 20 22 C25.5 22 30 26.5 30 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M27 9 L29 11 L33 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

/* ─── Partner Data ─────────────────────────────────── */
const PARTNERS = [
  { name: 'Virendra Nayyar', image: imageUrl('Virendra-Nayyar-removebg-preview.png'), qualifications: 'FCA', designation: 'Statutory Audit & Assurance', teamSize: 10, clientsServed: 40, email: 'virendra.nayyar@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/virendra-nayyar-3114a9227' },
  { name: 'Saurabh Shah', image: imageUrl('Saurabh-Shah-removebg-preview.png'), qualifications: 'FCA, DISA', designation: 'Direct & Indirect Tax', teamSize: 8, clientsServed: 35, email: 'saurabh.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/saurabh-shah' },
  { name: 'Dhaval Thakkar', image: imageUrl('Dhaval-Thakkar-removebg-preview.png'), qualifications: 'FCA', designation: 'Fractional CFO & FP&A', teamSize: 7, clientsServed: 30, email: 'dhaval.thakkar@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/dhaval-thakkar-dt-25406144/' },
  { name: 'Viranch Modi', image: imageUrl('Viranch-Modi-removebg-preview.png'), qualifications: 'FCA', designation: 'Direct Tax, GST & Audit', teamSize: 9, clientsServed: 38, email: 'viranch.modi@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/viranch-modi-aa4106227/' },
  { name: 'Shreena Panara', image: imageUrl('Shreena Parana.png'), qualifications: 'FCA', designation: 'Audit & Compliance', teamSize: 6, clientsServed: 25, email: 'shreena.panara@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/ca-shreena-panara-61b27820a' },
  { name: 'Milin Parekh', image: imageUrl('Milin-Parekh-removebg-preview.png'), qualifications: 'M.Com, FCA', designation: 'IA & Tax Consulting', teamSize: 8, clientsServed: 32, email: 'milin.parekh@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/milin-parekh-63692061' },
  { name: 'Mehul Shah', image: imageUrl('Mehul-Shah-removebg-preview.png'), qualifications: 'FCA', designation: 'Income Tax & GST', teamSize: 5, clientsServed: 22, email: 'mehul.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/mehul-shah-9aaaa130b' },
  { name: 'Alpesh Vaniya', image: imageUrl('Alpesh-Vaniya-removebg-preview.png'), qualifications: 'FCA', designation: 'Statutory Audit & Assurance', teamSize: 7, clientsServed: 28, email: 'alpesh.vaniya@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/alpesh-vaniya-62544b190' },
  { name: 'Raj Shah', image: imageUrl('Raj-Shah-removebg-preview.png'), qualifications: 'ACA | LL.B.', designation: 'Tax, Litigation & Risk Advisory', teamSize: 6, clientsServed: 26, email: 'raj.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/ca-raj-a-shah' },
  // { name: 'Parth Shah', image: imageUrl('Parth_shah.jpeg'), qualifications: 'FCA', designation: 'Direct & Indirect Tax', email: 'parth.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/' },
  { name: 'Jhankhna Patel', image: imageUrl('Jhankana Patel.jpeg'), qualifications: 'ACA | CPA Australia', designation: 'Strategy, Compliance & Advisory', teamSize: 5, clientsServed: 20, email: 'jhankhna.patel@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/jhankhnapatel09' },
  { name: 'Nidhi Kotecha', image: imageUrl('Nidhi-kotecha.png'), qualifications: 'CA', designation: 'US Taxation, CFO Advisory & SEC Compliance', teamSize: 4, clientsServed: 18, email: 'jhankhna.patel@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/nidhi-kotecha-9758a6193/' },
]

/* ─── Sectors ─────────────────────────────────────── */
const SECTORS = ["NPO", "NGO's", "Manufacturing", "Retail", "Corporates & Trusts", "Individual Investors"]

/* ─── Specialisations ─────────────────────────────── */
const SPECIALIZATIONS = [
  { label: 'Individual Tax', g: 'a' },
  { label: 'Corporate Tax', g: 'b' },
  { label: 'Transfer Pricing', g: 'c' },
  { label: 'Outsourced Accounting', g: 'a' },
  { label: 'Global Taxation', g: 'b' },
  { label: 'Global Outsourcing', g: 'c' },
  { label: 'Global Accounts Outsourcing (US, UK, AU)', g: 'a' },
]

/* ─── Map Locations ───────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'ahmedabad', name: 'Ahmedabad ', tag: '',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9!2d72.5078!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sSG%20Highway%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1680000000001!5m2!1sen!2sin',
    address: 'Level 10, 1016–21, Swati Clover, Shilaj Circle,Sardar Patel Ring Road,Thaltej, Ahmedabad,Gujarat – 380054'
  },
  {
    id: 'vadodara', name: 'Vadodara', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Lila%20Chambers,%20Notus%20Pride,%20Vadodara,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '4th floor, Lila Chambers, Notus Pride,Vadodara. Gujarat-390023'
  },
  {
    id: 'vapi', name: 'Vapi', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Saga%20Casa,%20Daulat%20Nagar,%20Chala,%20Vapi,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: 'Office No.101, Saga Casa, Daulat Nagar, Chala, Vapi, Gujarat – 396215'
  },
  {
    id: 'rajkot', name: 'Rajkot', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Kings%20Heights,%20Vidya%20Kunj%20Society%20Main%20Road,%20Rajkot,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: 'B-303 Kings Heights, Vidya Kunj Society Main Road, Rajkot, Gujarat – 360001'
  },
  {
    id: 'surat', name: 'Surat', tag: 'Branch',
    mapUrl: 'https://maps.google.com/maps?q=Shubh%20Square,%20Lal%20Darwaja,%20Surat,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    address: '5th Floor, 504, Shubh Square, Above ICICI Bank, Lal Darwaja, Surat, Gujarat – 395003'
  },
]

/* ─── Icons ──────────────────────────────────────── */
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* ─── Page ───────────────────────────────────────── */
export default function Ahmedabad() {
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
    <div className="ahm-page">

      {/* ══ HERO ══ */}
      <section className="ahm-hero">
        <div className="ahm-hero__photo" style={{ backgroundImage: `url(${imageUrl('Ahmedabad.png')})` }} />
        <div className="ahm-hero__overlay" />
        <div className="ahm-hero__content">
          {/* <span className="ahm-hero__eyebrow">JHS &amp; Associates LLP</span> */}
          <h1 className="ahm-hero__title">Gujarat</h1>
          <p className="ahm-hero__sub">Regional Hub &amp; Key Western India Office</p>
        </div>
        <div className="ahm-hero__card">
          <div className="ahm-hero__card-left">
            <span className="ahm-hero__card-badge">Ahmedabad</span>
            <div className="ahm-hero__card-addr">
              <IconPin />
              <span>1016-1021, Swati Crimson and Clover, Near Shilaj Bridge, Ahmedabad, Gujarat – 380059</span>
            </div>
          </div>
          <div className="ahm-hero__card-divider" />
          {/* <div className="ahm-hero__card-right">
            <div className="ahm-hero__card-stat"><span className="ahm-hero__card-stat-label">Phone</span><span className="ahm-hero__card-stat-val">+91 79 1234 5678</span></div>
            <div className="ahm-hero__card-stat"><span className="ahm-hero__card-stat-label">Email</span><span className="ahm-hero__card-stat-val">ahmedabad@jhsassociates.in</span></div>
            <div className="ahm-hero__card-stat"><span className="ahm-hero__card-stat-label">Hours</span><span className="ahm-hero__card-stat-val">Mon–Sat, 9:30 AM – 6:30 PM</span></div>
          </div> */}
        </div>
      </section>

      {/* ══ STATS RIBBON ══ */}
      <div className="ahm-ribbon">
        <div className="ahm-ribbon__inner">
          {([['11', 'Expert Partners'], ['6', 'Sectors Served'], ['7', 'Specialisations'], ['5', 'Gujarat Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="ahm-ribbon__item">
              <span className="ahm-ribbon__num">{num}</span>
              <span className="ahm-ribbon__lbl">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PARTNERS ══ */}
      <section className="ahm-section ahm-partners-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Our Team</span>
            <h2 className="ahm-section-hdr__title">Gujarat Partners</h2>
            <p className="ahm-section-hdr__sub">Meet the leaders driving excellence across audit, tax, advisory, and assurance in Gujarat.</p>
          </div>
          <div className="ahm-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="ahm-pc-card">
                <div className="ahm-pc-avatar"><img src={p.image} alt={p.name} className="ahm-pc-avatar__img" loading="lazy" /></div>
                <div className="ahm-pc-info">
                  <h3 className="ahm-pc-name">{p.name}</h3>
                  <p className="ahm-pc-quals">{p.qualifications}</p>
                  <p className="ahm-pc-desig">{p.designation}</p>
                </div>
                <div className="ahm-pc-stats">
                  <div className="ahm-pc-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    <span className="ahm-pc-stat__val">{p.teamSize}</span>
                    <span className="ahm-pc-stat__lbl">Team Size</span>
                  </div>
                  <div className="ahm-pc-stat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span className="ahm-pc-stat__val">{p.clientsServed}+</span>
                    <span className="ahm-pc-stat__lbl">Clients Served</span>
                  </div>
                </div>
                <div className="ahm-pc-social">
                  <div className="ahm-pc-mail-wrap" ref={openMailFor === p.email ? mailRef : null}>
                    <button
                      type="button"
                      className={`ahm-pc-btn ahm-pc-btn--mail ${openMailFor === p.email ? 'is-open' : ''}`}
                      onClick={() => setOpenMailFor(openMailFor === p.email ? null : p.email)}
                    >
                      <IconMail /><span>Email</span>
                    </button>
                    {openMailFor === p.email && (
                      <div className="ahm-pc-mail-dropdown">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ahm-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Gmail
                        </a>
                        <a
                          href={`https://outlook.office.com/mail/deeplink/compose?to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ahm-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Outlook Web
                        </a>
                        <a
                          href={`mailto:${p.email}`}
                          className="ahm-pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Default Mail App
                        </a>
                        <button
                          type="button"
                          className="ahm-pc-mail-option"
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
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="ahm-pc-btn ahm-pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WE SPECIALISE IN ══ */}
      <section className="ahm-section ahm-specials-section">
        <div className="ahm-container">
          <div className="ahm-specials-inner">
            <div className="ahm-specials-left">
              <span className="ahm-section-hdr__tag ahm-section-hdr__tag--white">Expertise</span>
              <h2 className="ahm-specials-title">We Specialised In</h2>
              <p className="ahm-specials-body">From individual tax planning to global accounts outsourcing, our Ahmedabad team brings specialised capabilities across tax, compliance, and advisory services.</p>
              <div className="ahm-specials-accent-line" />
              <p className="ahm-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="ahm-specials-right">
              <div className="ahm-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`ahm-special-pill ahm-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="ahm-special-pill__check"><IconCheck /></span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTORS SERVED ══ */}
      <section className="ahm-section ahm-sectors-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Industries</span>
            <h2 className="ahm-section-hdr__title">Sectors Served</h2>
            <p className="ahm-section-hdr__sub">Deep domain expertise across Gujarat's most dynamic industries — built through years of hands-on client engagement.</p>
          </div>
          <div className="ahm-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="ahm-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="ahm-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="ahm-sector-card__label">{s}</span>
                <div className="ahm-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAP ══ */}
      <section className="ahm-map-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Locations</span>
            <h2 className="ahm-section-hdr__title">Our Offices in Gujarat</h2>
            <p className="ahm-section-hdr__sub">Select a location to view it on the map.</p>
          </div>
          <div className="ahm-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} className={`ahm-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`} onClick={() => setActiveLocation(loc)}>
                <IconPin /><span>{loc.name}</span>
                {/* {loc.tag === '' && <span className="ahm-map-tab__badge">HQ</span>} */}
              </button>
            ))}
          </div>
          <div className="ahm-map-layout">
            <div className="ahm-map-info-card">
              <div className="ahm-map-info-tag">{activeLocation.tag}</div>
              <h3 className="ahm-map-info-title">{activeLocation.name}</h3>
              <div className="ahm-map-info-addr-row"><IconPin /><p className="ahm-map-info-addr">{activeLocation.address}</p></div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`} target="_blank" rel="noopener noreferrer" className="ahm-map-directions-btn">Get Directions →</a>
            </div>
            <div className="ahm-map-wrap">
              <iframe title={`JHS ${activeLocation.name} Office`} src={activeLocation.mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ BRANCHES ══ */}
      {/* <section className="ahm-branches-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Sub-Offices</span>
            <h2 className="ahm-section-hdr__title">Gujarat Sub-Offices</h2>
            <p className="ahm-section-hdr__sub">Strategically located across Gujarat's key business corridors for easier client access.</p>
          </div>
          <div className="ahm-branches-grid">
            {[
              { name: 'Vadodara', num: '01', address: '4th floor, Lila Chambers, Notus Pride, Vadodara, Gujarat – 390023' },
              { name: 'Vapi', num: '02', address: 'Office No.101, Saga Casa, Daulat Nagar, Chala, Vapi, Gujarat – 396215' },
              { name: 'Rajkot', num: '03', address: 'B-303 Kings Heights, Vidya Kunj Society Main Road, Rajkot, Gujarat – 360001' },
              { name: 'Surat', num: '04', address: '5th Floor, 504, Shubh Square, Above ICICI Bank, Lal Darwaja, Surat, Gujarat – 395003' },
            ].map(b => (
              <div key={b.name} className="ahm-branch-card">
                <div className="ahm-branch-card__num">{b.num}</div>
                <div className="ahm-branch-card__content">
                  <div className="ahm-branch-card__icon-wrap"><IconPin /></div>
                  <h3 className="ahm-branch-card__name">{b.name}</h3>
                  <p className="ahm-branch-card__addr">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══ CASE STUDIES ══ */}
      <section className="city-cs-section">
        <div className="ahm-container">
          <div className="ahm-section-hdr">
            <span className="ahm-section-hdr__tag">Case Studies</span>
            <h2 className="ahm-section-hdr__title">Success Stories</h2>
            <p className="ahm-section-hdr__sub">Real impact delivered for clients across Ahmedabad — from pharma compliance to MSME advisory and diamond trade audits.</p>
          </div>
          <div className="city-cs-grid">
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Regulatory Compliance</span>
              <h3 className="city-cs-card__title">CARO Compliance for a Pharma Manufacturer</h3>
              <p className="city-cs-card__body">Guided a mid-size pharmaceutical manufacturer through full CARO 2020 compliance, resolving historical reporting gaps and strengthening internal controls.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">Pharma</span>
                <span className="city-cs-card__result">Zero qualification in annual audit</span>
              </div>
            </div>
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Forensic Audit</span>
              <h3 className="city-cs-card__title">Fraud Investigation for a Diamond Trading Firm</h3>
              <p className="city-cs-card__body">Performed a forensic audit for a diamond trading house, uncovering procurement irregularities and recovering misappropriated inventory through legal proceedings.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">Diamond Trade</span>
                <span className="city-cs-card__result">₹1.8Cr fraud identified</span>
              </div>
            </div>
            <div className="city-cs-card">
              <span className="city-cs-card__tag">MSME Advisory</span>
              <h3 className="city-cs-card__title">GST & Compliance Overhaul for a Textile Cluster</h3>
              <p className="city-cs-card__body">Restructured GST filing and bookkeeping practices across a cluster of textile MSMEs, reducing compliance burden and enabling seamless bank credit access.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">Textiles / MSME</span>
                <span className="city-cs-card__result">Bank credit unlocked for 12 units</span>
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
            <p className="city-rfp-sub">Submit a Request for Proposal and our Ahmedabad team will respond within 24 hours.</p>
          </div>
          <a href="/approval-for-proposal" className="city-rfp-btn">Request for Proposal</a>
        </div>
      </section>

    </div>
  )
}