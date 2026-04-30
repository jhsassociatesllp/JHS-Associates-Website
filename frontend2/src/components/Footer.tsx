import './Footer.css'
import { Mail, Phone, MapPin } from 'lucide-react'

const SERVICES = ['Audit & Assurance', 'Tax Consulting', 'Corporate Advisory', 'Financial Planning', 'Risk Management', 'Compliance']
const COMPANY = ['About Us', 'Our Team', 'Careers', 'Case Studies', 'News & Insights']

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">
      <div className="footer__top container">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <div>
              <img src="src\image\logo.png" alt="" />
            </div>
          </div>
          <p className="footer__desc">
            Trusted financial and advisory partners for businesses across India.
            Excellence, integrity, and expertise in every engagement.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a href="#" aria-label="Twitter"><TwitterIcon /></a>
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
          </div>
        </div>

        {/* Services */}
        <div className="footer__col">
          <h4>Services</h4>
          <ul>{SERVICES.map(s => <li key={s}><a href="#">{s}</a></li>)}</ul>
        </div>

        {/* Company */}
        <div className="footer__col">
          <h4>Company</h4>
          <ul>{COMPANY.map(c => <li key={c}><a href="#">{c}</a></li>)}</ul>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4>Contact</h4>
          <ul className="footer__contact-list">
            <li><MapPin size={15} /><span>Navkar Chambers Marol Andheri, Mumbai, MH 400059</span></li>
            <li><Phone size={15} /><a href="tel:+912212345678">+91 22 1234 5678</a></li>
            <li><Mail size={15} /><a href="mailto:connect@jhsassociates.in">connect@jhsassociates.in</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {year} JHS & Associates. All rights reserved.</p>
        <div className="footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Disclaimer</a>
        </div>
      </div>
    </footer>
  )
}