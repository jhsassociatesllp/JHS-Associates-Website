import { useEffect, useRef, useState, type ReactElement } from 'react'
import './Mumbai.css'
import './CityShared.css'

/* ─── Hero background ───────────────────────────────── */
import { imageUrl } from '../../utils/imageUrl'
import { mapEmbedUrlFor } from '../../utils/mapEmbedUrl'
import { copyToClipboard } from '../../utils/copyToClipboard'
import CityPartnerAvatar from './CityPartnerAvatar'

/* ─── Partner Image Imports ─────────────────────────── */

/* ─── Sector SVG Icons ───────────────────────────────── */
const SectorIcons: Record<string, ReactElement> = {
  Construction: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="22" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="15" y="14" width="14" height="20" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="28" y="18" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <line x1="4" y1="34" x2="36" y2="34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="18" y="19" width="4" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 6 L24 14 L16 14 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </svg>
  ),
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
  Healthcare: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="12" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 7 L14 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M26 7 L26 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 21 L20 21 L20 18 L22 18 L22 21 L25 21 L25 23 L22 23 L22 26 L20 26 L20 23 L17 23 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Hospitality: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 32 L8 18 Q8 16 10 16 L18 16 L18 12 Q18 10 20 10 Q22 10 22 12 L22 16 L30 16 Q32 16 32 18 L32 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="16" y="23" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="20" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="25" y="20" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="32" x2="34" y2="32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  'Media & Education': (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="9" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 27 L11 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 27 L23 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9" y1="34" x2="25" y2="34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="31" cy="15" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M29.5 13.5 L33.5 15.5 L29.5 17.5 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
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
  Logistics: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M26 20 L32 20 L36 26 L36 30 L26 30 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="10" cy="32" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="30" cy="32" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 16 L10 10 L22 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 10 L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

/* ─── Partner Data ─────────────────────────────────── */
const PARTNERS = [
  { name: 'Huzeifa Unwala', image: imageUrl('Huzefa-Unwala-removebg-preview.webp'), qualifications: 'FCA, CISA, ISO 27001 Lead Auditor,NISM(DP), NISM(Social Auditor)', designation: 'IFC, Governance & Risk', email: 'huzeifa.unwala@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/ca-huzeifa-unwala/' },
  { name: 'Tasnim Tankiwala', image: imageUrl('Tasnim-Tankiwala-removebg-preview.webp'), qualifications: 'FCA, IP (IBBI), DIRM, DISA', designation: 'Statutory Audit', email: 'tasnim.tankiwala@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/tasnim-tankiwala' },
  { name: 'Jamal Ashraf Chatriwala', image: imageUrl('Jamal-Chatriwala-removebg-preview.webp'), qualifications: 'ACA, IPO Certified', designation: 'Internal Audit, Risk Advisory & Insurance', email: 'jamal.chatriwala@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/chatriwala' },
  { name: 'Taher Pepermintwala', image: imageUrl('Taher-Pepermintwala-removebg-preview.webp'), qualifications: 'FCA, CISA, ACCA, Dip IFRS', designation: 'Assurance, Tech & SOC Audit', email: 'taher.pepermintwala@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/taherpepermintwala/' },
  { name: 'Sahil Shah', image: imageUrl('Sahil-Shah-removebg-preview.webp'), qualifications: 'ACA, IPO Certified', designation: 'Risk Advisory, Internal Audit & IFC', email: 'sahil.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/sahil-shah-664a5312a' },
  { name: 'Tausif Shaikh', image: imageUrl('Tausif-Shaikh-removebg-preview.webp'), qualifications: 'ACA, AICA-L1', designation: 'Assurance & Tax', email: 'tausif.shaikh@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/ca-tausif-shaikh' },
  { name: 'Samad Dhanani', image: imageUrl('Samad-Dhanani-removebg-preview.webp'), qualifications: 'M.Com, ACA, CS', designation: 'Statutory Audit & Accounts Outsourcing', email: 'samad.dhanani@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/samad-dhanani-9b342562' },
  { name: 'Disha Shah', image: imageUrl('Disha Shah-removebg-preview.webp'), qualifications: 'FCA ', designation: ' Risk Advisory, Internal Audit & IFC', email: 'disha.shah@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/disha-shah-4826b097' },
  { name: 'Dhanlaxmi Nair', image: imageUrl('Dhanlaxmi.webp'), qualifications: 'M.Com, FCA, CMA, SET', designation: 'Risk Advisory & Consulting', email: 'dhanlaxmi.nair@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/dhanlaxmi-nair-311053206' },
  { name: 'Amit More', image: imageUrl('Amit-more.webp'), qualifications: 'MBA–IIM, ISO 27001 Lead Auditor, ISO 42001 Certified ', designation: 'Cyber Security & GRC', email: 'amitkumar.more@jhsconsulting.in', linkedin: 'https://www.linkedin.com/in/amitkumarmore/' },
  { name: 'Dipika Bisawa', image: imageUrl('Dipika-Bisawa.webp'), qualifications: 'ACS', designation: 'Compliance & Risk Management', email: 'dipika.bisawa@jhsconsulting.in', linkedin: 'https://www.linkedin.com/in/dipika-bisawa-0a9a211a/' },
  { name: 'Raj Dabburi', image: imageUrl('Raj-daburi.webp'), qualifications: 'CA, MBA', designation: 'Board & Institutional Advisory', email: 'raj.d@jhsconsulting.in', linkedin: 'https://www.linkedin.com/in/rajdabburi/' },
  { name: 'Huzefa Mala', image: imageUrl('Huzefa-mala.webp'), qualifications: 'FCA, UGC-NET Qualified', designation: 'Income Tax Advisory & Audits', email: 'huzefa.mala@jhsconsulting.in', linkedin: 'https://www.linkedin.com/in/huzefamala/' },
  { name: 'Huzefa Kaka', image: imageUrl('Huzefa-kaka.webp'), qualifications: ' NISM certification', designation: 'Risk & Governance', email: 'huzefa.kaka@jhsassociates.in', linkedin: 'https://www.linkedin.com/in/huzefakaka/' },
]

/* ─── Sectors ─────────────────────────────────────── */
const SECTORS = ['Construction', 'BFSI', 'Healthcare', 'Hospitality', 'Media & Education', 'Manufacturing', 'Logistics']

/* ─── Specialisations ─────────────────────────────── */
const SPECIALIZATIONS = [
  { label: 'IT & Cyber Security', g: 'a' },
  { label: 'Internal Audit', g: 'b' },
  { label: 'Advisory Services', g: 'c' },
  { label: 'SOC & SSAE-21', g: 'a' },
  { label: 'Corporate Training', g: 'b' },
  { label: 'Litigation Assessment', g: 'c' },
  { label: 'Resources Value Augmentation', g: 'a' },
  { label: 'Related Party Transactions', g: 'b' },
  { label: 'Concurrent Audit', g: 'c' },
  { label: 'Social Stock Audit', g: 'a' },
  { label: 'Mystery Audits', g: 'b' },
  { label: 'Digital KYC Audits', g: 'c' },
  { label: 'Revenue Audits', g: 'a' },
]

/* ─── Map Locations ───────────────────────────────── */
const MAP_LOCATIONS = [
  {
    id: 'andheri', name: 'Andheri ', tag: 'Head Office',
    address: 'Unit No. B-406 to 410, 4th floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East). Maharashtra – 400059',
    lat: 19.1073677, lng: 72.8804167,
  },
  {
    id: 'masjid', name: 'Masjid', tag: 'Branch',
    address: "Unit No.402, 4th floor, Nav Vyapar Bhavan, 49 P.D'mello Road, MB, Maharashtra - 400009",
    lat: 18.9510385, lng: 72.8408999,
  },
  {
    id: 'kalyan', name: 'Kalyan', tag: 'Branch',
    address: 'Unit No 11-12,Regency Avenue, Murbad Road Kalyan (West). Maharashtra - 421301',
    lat: 19.2412544, lng: 73.1454276,
  },
  {
    id: 'mazgaon', name: 'Mazgaon', tag: 'Branch',
    address: 'Shop No. 11A, 345, New Sai Niketan CHS Ltd. Dr Mascarenhas Road, Mazgaon, Mumbai – 400010'
  }
].map(loc => ({ ...loc, mapUrl: mapEmbedUrlFor(loc) }))

/* ─── Inline Icons ───────────────────────────────── */
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
export default function Mumbai() {
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
    <div className="mum-page">

      {/* ══ HERO ══ */}
      <section className="mum-hero">
        <div className="mum-hero__photo" style={{ backgroundImage: `url("${imageUrl('Mumbai 2.webp')}")` }} />
        <div className="mum-hero__overlay" />
        <div className="mum-hero__content">
          {/* <span className="mum-hero__eyebrow">JHS &amp; Associates LLP</span> */}
          <h1 className="mum-hero__title">Mumbai</h1>
          <p className="mum-hero__sub">Principal Headquarters </p>
        </div>
        <div className="mum-hero__card">
          <div className="mum-hero__card-left">
            <span className="mum-hero__card-badge">Head Office — Andheri East</span>
            <div className="mum-hero__card-addr">
              <IconPin />
              <span>Unit No. B-406 to 410, 4th floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East). Maharashtra – 400059</span>
            </div>
          </div>
          <div className="mum-hero__card-divider" />
          <div className="mum-hero__card-right">
            <div className="mum-hero__card-stat"><span className="mum-hero__card-stat-label">Phone</span><span className="mum-hero__card-stat-val">1800 120 1022</span></div>
            <div className="mum-hero__card-stat"><span className="mum-hero__card-stat-label">Email</span><span className="mum-hero__card-stat-val">connect@jhsassociates.in</span></div>
            {/* <div className="mum-hero__card-stat"><span className="mum-hero__card-stat-label">Hours</span><span className="mum-hero__card-stat-val">Mon–Sat, 9:30 AM – 6:30 PM</span></div> */}
          </div>
        </div>
      </section>

      {/* ══ STATS RIBBON ══ */}
      <div className="mum-ribbon">
        <div className="mum-ribbon__inner">
          {([['9', 'Expert Partners'], ['7', 'Sectors Served'], ['13', 'Specialisations'], ['4', 'Mumbai Offices']] as [string, string][]).map(([num, lbl]) => (
            <div key={lbl} className="mum-ribbon__item">
              <span className="mum-ribbon__num">{num}</span>
              <span className="mum-ribbon__lbl">{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ PARTNERS ══ */}
      <section className="mum-section mum-partners-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Our Team</span>
            <h2 className="mum-section-hdr__title">Mumbai Partners</h2>
            <p className="mum-section-hdr__sub">Meet the leaders driving excellence across audit, tax, advisory, and assurance in Mumbai.</p>
          </div>
          <div className="mum-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="pc-card">
                <CityPartnerAvatar image={p.image} name={p.name} className="pc-avatar" imgClassName="pc-avatar__img" />
                <div className="pc-info">
                  <h3 className="pc-name">{p.name}</h3>
                  <p className="pc-quals">{p.qualifications}</p>
                  <p className="pc-desig">{p.designation}</p>
                </div>
                {/* <div className="pc-stats">
                  <div className="pc-stat">
                    <IconTeam />
                    <span className="pc-stat__val">{p.teamSize}</span>
                    <span className="pc-stat__lbl">Team Size</span>
                  </div>
                  <div className="pc-stat">
                    <IconClients />
                    <span className="pc-stat__val">{p.clientsServed}+</span>
                    <span className="pc-stat__lbl">Clients Served</span>
                  </div>
                </div> */}
                <div className="pc-social">
                  <div className="pc-mail-wrap" ref={openMailFor === p.email ? mailRef : null}>
                    <button
                      type="button"
                      className="pc-btn pc-btn--mail"
                      onClick={() => setOpenMailFor(openMailFor === p.email ? null : p.email)}
                    >
                      <IconMail /><span>Email</span>
                    </button>
                    {openMailFor === p.email && (
                      <div className="pc-mail-dropdown">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Gmail
                        </a>
                        <a
                          href={`https://outlook.office.com/mail/deeplink/compose?to=${p.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Open in Outlook Web
                        </a>
                        <a
                          href={`mailto:${p.email}`}
                          className="pc-mail-option"
                          onClick={() => setOpenMailFor(null)}
                        >
                          Default Mail App
                        </a>
                        <button
                          type="button"
                          className="pc-mail-option"
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
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="pc-btn pc-btn--li"><IconLinkedIn /><span>LinkedIn</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WE SPECIALISE IN ══ */}
      <section className="mum-section mum-specials-section">
        <div className="mum-container">
          <div className="mum-specials-inner">
            <div className="mum-specials-left">
              <span className="mum-section-hdr__tag mum-section-hdr__tag--white">Expertise</span>
              <h2 className="mum-specials-title">We Specialised In</h2>
              <p className="mum-specials-body">From cutting-edge cyber assurance to niche social-sector audits, our Mumbai team brings a breadth of specialised capabilities unmatched in the region.</p>
              <div className="mum-specials-accent-line" />
              <p className="mum-specials-note">Each specialisation is backed by certified professionals with real-world project experience.</p>
            </div>
            <div className="mum-specials-right">
              <div className="mum-specials-grid">
                {SPECIALIZATIONS.map((s, i) => (
                  <div key={s.label} className={`mum-special-pill mum-special-pill--${s.g}`} style={{ animationDelay: `${i * 0.04}s` }}>
                    <span className="mum-special-pill__check"><IconCheck /></span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTORS SERVED ══ */}
      <section className="mum-section mum-sectors-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Industries</span>
            <h2 className="mum-section-hdr__title">Sectors Served</h2>
            <p className="mum-section-hdr__sub">Deep domain expertise across Mumbai's most dynamic industries built through years of hands on client engagement.</p>
          </div>
          <div className="mum-sectors-grid">
            {SECTORS.map((s, i) => (
              <div key={s} className="mum-sector-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="mum-sector-card__icon-wrap">{SectorIcons[s]}</div>
                <span className="mum-sector-card__label">{s}</span>
                <div className="mum-sector-card__line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAP ══ */}
      <section className="mum-map-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Locations</span>
            <h2 className="mum-section-hdr__title">Our Offices in Mumbai</h2>
            <p className="mum-section-hdr__sub">Select a location to view it on the map.</p>
          </div>
          <div className="mum-map-tabs">
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} className={`mum-map-tab ${activeLocation.id === loc.id ? 'active' : ''}`} onClick={() => setActiveLocation(loc)}>
                <IconPin /><span>{loc.name}</span>
                {loc.tag === 'Head Office' && <span className="mum-map-tab__badge">HQ</span>}
              </button>
            ))}
          </div>
          <div className="mum-map-layout">
            <div className="mum-map-info-card">
              <div className="mum-map-info-tag">{activeLocation.tag}</div>
              <h3 className="mum-map-info-title">{activeLocation.name}</h3>
              <div className="mum-map-info-addr-row"><IconPin /><p className="mum-map-info-addr">{activeLocation.address}</p></div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address)}`} target="_blank" rel="noopener noreferrer" className="mum-map-directions-btn">Get Directions →</a>
            </div>
            <div className="mum-map-wrap">
              <iframe title={`JHS Mumbai ${activeLocation.name}`} src={activeLocation.mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ BRANCHES ══ */}
      {/* <section className="mum-branches-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Sub-Offices</span>
            <h2 className="mum-section-hdr__title">Mumbai Sub-Offices</h2>
            <p className="mum-section-hdr__sub">Strategically located across Mumbai's key corridors for easier client access.</p>
          </div>
          <div className="mum-branches-grid">
            {[
              { name: 'Masjid', num: '01', address: "Unit No. 402, 4th floor, Nav Vyapar Bhavan, 49 P.D'mello Road, MB, Maharashtra – 400009" },
              { name: 'Kalyan', num: '02', address: 'Shop No 11-12, Regency Avenue, Below Gastrocare Hospital, Syndicate Bus Stop, Kalyan West, Maharashtra – 421301' },
              { name: 'Mazgaon', num: '03', address: 'Ground Floor, Shop No. 11A, 345, New Sai Niketan CHS Ltd., Dr. Mascarenhas Road, Mazgaon, Mumbai – 400010' }
            ].map(b => (
              <div key={b.name} className="mum-branch-card">
                <div className="mum-branch-card__num">{b.num}</div>
                <div className="mum-branch-card__content">
                  <div className="mum-branch-card__icon-wrap"><IconPin /></div>
                  <h3 className="mum-branch-card__name">{b.name}</h3>
                  <p className="mum-branch-card__addr">{b.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══ CASE STUDIES ══ */}
      <section className="city-cs-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Case Studies</span>
            <h2 className="mum-section-hdr__title">Success Stories</h2>
            <p className="mum-section-hdr__sub">Real impact delivered for clients across Mumbai — from audit and compliance to strategic advisory and risk frameworks.</p>
          </div>
          <div className="city-cs-grid">
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Audit & Assurance</span>
              <h3 className="city-cs-card__title">Statutory Audit for a Leading NBFC</h3>
              <p className="city-cs-card__body">Delivered end-to-end statutory audit services, identifying critical control gaps and ensuring full RBI compliance within a tight regulatory timeline.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">BFSI</span>
                <span className="city-cs-card__result">30% reduction in compliance risk</span>
              </div>
            </div>
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Tax Advisory</span>
              <h3 className="city-cs-card__title">GST Restructuring for a Manufacturing Group</h3>
              <p className="city-cs-card__body">Redesigned the GST input credit chain for a multi-entity manufacturing group, unlocking significant working capital and eliminating prior exposure.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">Manufacturing</span>
                <span className="city-cs-card__result">₹2Cr+ in recovered ITC</span>
              </div>
            </div>
            <div className="city-cs-card">
              <span className="city-cs-card__tag">Risk & Governance</span>
              <h3 className="city-cs-card__title">IFC Framework for a Listed Real Estate Developer</h3>
              <p className="city-cs-card__body">Built and implemented a robust Internal Financial Controls framework from scratch, meeting SEBI listing obligations with zero audit observations.</p>
              <div className="city-cs-card__footer">
                <span className="city-cs-card__sector">Real Estate</span>
                <span className="city-cs-card__result">Zero SEBI audit observations</span>
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
            <p className="city-rfp-sub">Submit a Request for Proposal and our Mumbai team will respond within 24 hours.</p>
          </div>
          <a href="/approval-for-proposal" className="city-rfp-btn">Request for Proposal</a>
        </div>
      </section>

    </div>
  )
}