import { useEffect } from 'react'
import './Mumbai.css'

/* ─── Partner Data ────────────────────────────────────────── */
const PARTNERS = [
  {
    name: 'Tasnim Tankiwala',
    initials: 'TT',
    qualifications: 'FCA, FIAD & IFRS',
    designation: 'Statutory Audit',
    email: 'tasnim@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/tasnimtankiwala',
    color: '#1e3a5f',
  },
  {
    name: 'Jamal Chatriwala',
    initials: 'JC',
    qualifications: 'B.Com, ACA',
    designation: 'IA & Risk Advisory, Insurance',
    email: 'jamal@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/jamalchatriwala',
    color: '#2c5282',
  },
  {
    name: 'Tahir Pepermintwala',
    initials: 'TP',
    qualifications: 'B.Com, FCA, CISA, ACCA',
    designation: 'Assurance & Tech | SOC | Audit Expert',
    email: 'tahir@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/tahirpepermintwala',
    color: '#744210',
  },
  {
    name: 'Dhanlaxmi Nair',
    initials: 'DN',
    qualifications: 'M.COM, FCA',
    designation: 'SET & CMA',
    email: 'dhanlaxmi@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/dhanlaxminair',
    color: '#702459',
  },
  {
    name: 'Sahil Shah',
    initials: 'SS',
    qualifications: 'FCA',
    designation: 'Risk Advisory, IA, IPO & IPO Certification',
    email: 'sahil@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/sahilshah',
    color: '#1a365d',
  },
  {
    name: 'Tausif Shaikh',
    initials: 'TS',
    qualifications: 'B.COM, ACA',
    designation: 'Assurance & Tax',
    email: 'tausif@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/tausifshaikh',
    color: '#22543d',
  },
  {
    name: 'Samad Dhanani',
    initials: 'SD',
    qualifications: 'M.COM, CS, ACA',
    designation: 'Statutory & Accounts Outsourcing',
    email: 'samad@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/samaddhanani',
    color: '#2d3748',
  },
  {
    name: 'Disha Shah',
    initials: 'DS',
    qualifications: 'FCA',
    designation: 'Risk Advisory, IA & IPC',
    email: 'disha@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/dishashah',
    color: '#553c9a',
  },
  {
    name: 'Rajsekhar Dabburi',
    initials: 'RD',
    qualifications: 'CA, DMP (Harvard)',
    designation: 'Senior Advisor',
    email: 'rajsekhar@jhsassociates.in',
    linkedin: 'https://www.linkedin.com/in/rajsekhardabburi',
    color: '#7b341e',
  },
]

/* ─── Branch Data ─────────────────────────────────────────── */
const BRANCHES = [
  {
    name: 'Borivali',
    address: '2201-2202, ESSPEE Tower, Opp. Oberoi Sky City, Near Prabhu Hotel, Borivali East, Maharashtra – 400066',
    icon: '🏢',
  },
  {
    name: 'Masjid Bunder',
    address: "Unit No. 402, 4th Floor, Nav Vyapar Bhavan, 49 P D'mello Road, Masjid Bunder, Maharashtra – 400009",
    icon: '🏢',
  },
  {
    name: 'Kalyan',
    address: 'Unit No. 11-12, Regency Avenue, Murbad Road, Kalyan (West), Maharashtra – 421301',
    icon: '🏢',
  },
]

/* ─── Icons ───────────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

/* ─── Component ───────────────────────────────────────────── */
export default function Mumbai() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="mum-page">

      {/* ═══════════════════════════════════════════
          HERO / POSTER
      ═══════════════════════════════════════════ */}
      <section className="mum-hero">
        <div className="mum-hero__photo" />
        <div className="mum-hero__overlay" />

        {/* Decorative squares */}
        <div className="mum-hero__deco">
          <span className="mum-sq mum-sq--red mum-sq--lg" />
          <span className="mum-sq mum-sq--navy mum-sq--md" />
          <span className="mum-sq mum-sq--red mum-sq--sm" />
          <span className="mum-sq mum-sq--navy mum-sq--xs" />
        </div>

        <div className="mum-hero__content">
          <p className="mum-hero__eyebrow">JHS &amp; Associates LLP</p>
          <h1 className="mum-hero__title">Mumbai</h1>
          <p className="mum-hero__sub">Our Principal Headquarters &amp; Largest Office</p>
        </div>

        {/* Bottom poster card */}
        <div className="mum-hero__card">
          <span className="mum-hero__card-brand">JHS</span>
          <div className="mum-hero__card-badge">Head Office — Andheri (East)</div>
          <div className="mum-hero__card-body">
            <div className="mum-hero__card-addr">
              <PinIcon />
              <span>Unit No. B-406 to 410, 4th Floor, Navkar Chambers, Marol Naka Metro Station, Andheri (East), Maharashtra – 400059</span>
            </div>
            <div className="mum-hero__card-meta">
              <span>📞 +91 22 1234 5678</span>
              <span>✉️ mumbai@jhsassociates.in</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HEAD OFFICE INFO STRIP
      ═══════════════════════════════════════════ */}
      <div className="mum-strip">
        <div className="mum-strip__item">
          <span className="mum-strip__icon">📞</span>
          <div>
            <span className="mum-strip__label">Phone</span>
            <span className="mum-strip__val">+91 22 1234 5678</span>
          </div>
        </div>
        <div className="mum-strip__div" />
        <div className="mum-strip__item">
          <span className="mum-strip__icon">✉️</span>
          <div>
            <span className="mum-strip__label">Email</span>
            <span className="mum-strip__val">mumbai@jhsassociates.in</span>
          </div>
        </div>
        <div className="mum-strip__div" />
        <div className="mum-strip__item">
          <span className="mum-strip__icon">🕐</span>
          <div>
            <span className="mum-strip__label">Business Hours</span>
            <span className="mum-strip__val">Mon–Sat, 9:30 AM – 6:30 PM</span>
          </div>
        </div>
        <div className="mum-strip__div" />
        <div className="mum-strip__item">
          <span className="mum-strip__icon">🏙️</span>
          <div>
            <span className="mum-strip__label">City</span>
            <span className="mum-strip__val">Mumbai, Maharashtra</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          PARTNERS SECTION
      ═══════════════════════════════════════════ */}
      <section className="mum-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Our Team</span>
            <h2 className="mum-section-hdr__title">Mumbai Partners</h2>
            <p className="mum-section-hdr__sub">
              Meet the leaders driving excellence across audit, tax, advisory, and assurance in Mumbai.
            </p>
          </div>

          <div className="mum-partners-grid">
            {PARTNERS.map(p => (
              <div key={p.name} className="mum-partner-card">
                {/* Avatar */}
                <div className="mum-partner-card__avatar" style={{ background: p.color }}>
                  <span className="mum-partner-card__initials">{p.initials}</span>
                </div>

                {/* Info */}
                <div className="mum-partner-card__info">
                  <h3 className="mum-partner-card__name">{p.name}</h3>
                  <p className="mum-partner-card__quals">{p.qualifications}</p>
                  <p className="mum-partner-card__desig">{p.designation}</p>
                </div>

                {/* Divider */}
                <div className="mum-partner-card__divider" />

                {/* Social */}
                <div className="mum-partner-card__social">
                  <a href={`mailto:${p.email}`} className="mum-partner-card__link mum-partner-card__link--mail" title={`Email ${p.name}`}>
                    <MailIcon />
                    <span>Email</span>
                  </a>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="mum-partner-card__link mum-partner-card__link--li" title={`LinkedIn — ${p.name}`}>
                    <LinkedInIcon />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MAP — HEAD OFFICE
      ═══════════════════════════════════════════ */}
      <section className="mum-map-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag">Location</span>
            <h2 className="mum-section-hdr__title">Head Office – Andheri</h2>
          </div>
          <div className="mum-map-wrap">
            <iframe
              title="JHS Mumbai Head Office"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.528!2d72.87870!3d19.11540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c83b69d4c3b5%3A0x4a8d5f2f9b4e8e2a!2sNavkar%20Chambers%2C%20Marol%20Naka%2C%20Andheri%20East%2C%20Mumbai%2C%20Maharashtra%20400059!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SUB-BRANCHES
      ═══════════════════════════════════════════ */}
      <section className="mum-branches-section">
        <div className="mum-container">
          <div className="mum-section-hdr">
            <span className="mum-section-hdr__tag mum-section-hdr__tag--light">Sub-Offices</span>
            <h2 className="mum-section-hdr__title mum-section-hdr__title--light">Mumbai Sub-Branches</h2>
            <p className="mum-section-hdr__sub mum-section-hdr__sub--light">
              Strategically located across Mumbai's key corridors for easier client access.
            </p>
          </div>

          <div className="mum-branches-grid">
            {BRANCHES.map((b, i) => (
              <div key={b.name} className="mum-branch-card">
                <div className="mum-branch-card__num">0{i + 1}</div>
                <div className="mum-branch-card__icon">
                  <PinIcon />
                </div>
                <h3 className="mum-branch-card__name">{b.name}</h3>
                <p className="mum-branch-card__addr">{b.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
