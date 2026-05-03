import './Footer.css'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone } from 'lucide-react'

/* ─── Column Data ────────────────────────────────────── */
const INSIGHTS = [
  { name: 'Thought Leadership', path: '/insights/thought-leadership' },
  { name: 'Resources', path: '/insights/resources' },
  { name: 'Articles', path: '/insights/articles' },
  { name: 'Case Studies', path: '/insights/case-studies' },
]

const USEFUL_LINKS = [
  { name: 'Locations', path: '/locations' },
  { name: 'Contact', path: '/contact' },
  { name: 'Feedback', path: '/feedback' },
  { name: 'RFP', path: '/rfp' },
  { name: 'Know JHS', path: '/about' },
  { name: 'Careers', path: '/careers' },
]

const SERVICES = [
  { name: 'Assurance', path: '/services/assurance' },
  { name: 'Consulting', path: '/services/consulting' },
  { name: 'Taxation', path: '/services/taxation' },
  { name: 'Outsourcing', path: '/services/outsourcing' },
]

/* ─── Social Icons ──────────────────────────────────── */
const IconFacebook = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const IconX = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)
const IconInstagram = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)
const IconYouTube = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#3a6fa5" />
  </svg>
)

/* ─── Component ─────────────────────────────────────── */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">

      {/* ══ CTA Band ══ */}
      <div className="footer__cta">
        <div className="footer__cta-inner">
          <h2 className="footer__cta-title">How can we help you?</h2>
          <p className="footer__cta-sub">
            <Link to="/contact">Get in touch with us</Link> or find an office closest to you.
          </p>
        </div>
      </div>

      {/* ══ Social Strip ══ */}
      <div className="footer__social-strip">
        <div className="footer__social-strip-inner">
          <span className="footer__social-strip-label">Get connected with us on social networks:</span>
          <div className="footer__social-icons">
            <a href="https://facebook.com/jhsassociates" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer__social-icon"><IconFacebook /></a>
            <a href="https://x.com/jhsassociates" target="_blank" rel="noopener noreferrer" aria-label="X" className="footer__social-icon"><IconX /></a>
            <a href="https://linkedin.com/company/jhsassociates" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer__social-icon"><IconLinkedIn /></a>
            <a href="https://instagram.com/jhsassociates" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer__social-icon"><IconInstagram /></a>
            <a href="https://youtube.com/@jhsassociates" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer__social-icon"><IconYouTube /></a>
          </div>
        </div>
      </div>

      {/* ══ Main Body ══ */}
      <div className="footer__body">
        <div className="footer__grid">

          {/* Col 1 — Brand + Services */}
          <div className="footer__col footer__col--brand">
            <div className="footer__brand-logo">
              <img src="/src/image/logo.png" alt="JHS & Associates LLP" />
            </div>
            <p className="footer__brand-desc">
              Trusted chartered accountants and advisory partners for businesses across India.
              Excellence, integrity, and expertise in every engagement.
            </p>

            {/* Services heading + pills */}
            <h4 className="footer__col-heading footer__services-heading">Services</h4>
            <div className="footer__col-rule" />
            <div className="footer__service-pills">
              {SERVICES.map(s => (
                <Link key={s.name} to={s.path} className="footer__pill">{s.name}</Link>
              ))}
            </div>
          </div>

          {/* Col 2 — Insights */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Insights</h4>
            <div className="footer__col-rule" />
            <ul className="footer__col-list">
              {INSIGHTS.map(item => (
                <li key={item.name}><Link to={item.path}>{item.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Useful Links */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Useful Links</h4>
            <div className="footer__col-rule" />
            <ul className="footer__col-list">
              {USEFUL_LINKS.map(item => (
                <li key={item.name}><Link to={item.path}>{item.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div className="footer__col">
            <h4 className="footer__col-heading">Contact</h4>
            <div className="footer__col-rule" />
            <ul className="footer__contact-list">
              <li>
                <MapPin size={16} className="footer__contact-icon" />
                <span>Unit No. B-406 to 410, Navkar Chambers, Marol Naka Metro, Andheri (East), Mumbai – 400059</span>
              </li>
              <li>
                <Mail size={16} className="footer__contact-icon" />
                <a href="mailto:connect@jhsassociates.in">connect@jhsassociates.in</a>
              </li>
              <li>
                <Phone size={16} className="footer__contact-icon" />
                <a href="tel:18001201022">1800 120 1022</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ══ Bottom Bar ══ */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copy">Copyright © {year} JHS Associates</p>
        </div>
      </div>

    </footer>
  )
}