import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ChevronDown, ArrowUpRight, X, Menu } from 'lucide-react'
import './Navbar.css'

/* ── Data ──────────────────────────────────────────────── */
const INSIGHTS_LINKS = [
  { name: 'Resources',          href: '/resources' },
  { name: 'Articles',           href: '/articles' },
  { name: 'Case Studies',       href: '/case-studies' },
  { name: 'Thought Leadership', href: '/thought-leadership' },
]
const SERVICES_INDIA = [
  { name: 'Outsourcing', href: '/services/outsourcing' },
  { name: 'Consulting',  href: '/services/consulting' },
  { name: 'Taxation',    href: '/services/taxation' },
  { name: 'Assurance',   href: '/services/assurance' },
]
const SERVICES_GLOBAL = [
  { name: 'Assurance',                href: '/services/assurance' },
  { name: 'Taxation',                 href: '/services/taxation' },
  { name: 'Single Window Assistance', href: '/services/single-window-assistance' },
  { name: 'Consulting',               href: '/services/consulting' },
  { name: 'SOC Attestation',          href: '/services/soc-attestation' },
  { name: 'Outsourcing',              href: '/services/outsourcing' },
]
const SECTORS = [
  {
    title: 'Financial Services',
    items: [
      { name: 'Banking',                    href: '/sectors/financial-services/banking' },
      { name: 'Broking',                    href: '/sectors/financial-services/broking' },
      { name: 'Mutual Funds',               href: '/sectors/financial-services/mutual-funds' },
      { name: 'Family-Oriented Businesses', href: '/sectors/financial-services/family-oriented-businesses' },
      { name: 'Insurance',                  href: '/sectors/financial-services/insurance' },
      { name: 'Digital Currency',           href: '/sectors/financial-services/digital-currency' },
      { name: 'NBFC',                       href: '/sectors/financial-services/nbfc' },
      { name: 'Portfolio Management',       href: '/sectors/financial-services/portfolio-management' },
      { name: 'Venture Capital',            href: '/sectors/financial-services/venture-capital' },
    ],
  },
  {
    title: 'Consumer',
    items: [
      { name: 'Housing',        href: '/sectors/consumer/housing' },
      { name: 'Gems & Jewellery', href: '/sectors/consumer/gems-jewellery' },
      { name: 'Real Estate',    href: '/sectors/consumer/real-estate' },
      { name: 'Retail',         href: '/sectors/consumer/retail' },
      { name: 'Oil & Gas',      href: '/sectors/consumer/oil-gas-industry' },
      { name: 'FMCG',           href: '/sectors/consumer/fmcg' },
      { name: 'Commodity',      href: '/sectors/consumer/commodity' },
    ],
  },
  {
    title: 'Media & Technology',
    items: [
      { name: 'Media',           href: '/sectors/media-technology/media' },
      { name: 'IT System Audit', href: '/sectors/media-technology/it-system-audit' },
      { name: 'IT / ITeS',       href: '/sectors/media-technology/it-tes' },
    ],
  },
  {
    title: 'Other',
    items: [
      { name: 'Healthcare',    href: '/sectors/other/healthcare' },
      { name: 'Construction',  href: '/sectors/other/construction' },
      { name: 'NGO',           href: '/sectors/other/ngo' },
      { name: 'Manufacturing', href: '/sectors/other/manufacturing' },
    ],
  },
]
const ABOUT_LINKS = [
  { name: 'Our Story',  href: '/about/our-story' },
  { name: 'Leadership', href: '/about/leadership' },
  { name: 'Awards',     href: '/about/awards' },
  { name: 'CSR',        href: '/about/csr' },
  { name: 'Careers',    href: '/about/careers' },
]

/* ── Social icons ── */
const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

/* ── Component ── */
export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [activeMenu,   setActiveMenu]   = useState<string | null>(null)
  const [activeMobile, setActiveMobile] = useState<string | null>(null)
  const navRef     = useRef<HTMLElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 }
    )
  }, [])

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const openMenu  = (m: string) => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setActiveMenu(m) }
  const closeMenu = ()          => { timeoutRef.current = setTimeout(() => setActiveMenu(null), 150) }
  const keepMenu  = (m: string) => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setActiveMenu(m) }
  const toggleMob = (m: string) => setActiveMobile(p => p === m ? null : m)
  const closeMob  = ()          => { setMenuOpen(false); setActiveMobile(null) }

  return (
    <>
      {/* ══════════ HEADER ══════════ */}
      <header ref={navRef} className={`nb${scrolled ? ' nb--scrolled' : ''}`}>
        <div className="nb__topbar" />

        <div className="nb__inner">
          {/* Logo */}
          <a href="/" className="nb__logo">
            <img src="/src/image/logo2.png" alt="JHS & Associates LLP" className="nb__logo-img" />
          </a>

          {/* Desktop nav */}
          <nav className="nb__nav" aria-label="Primary">
            <ul className="nb__links">
              <li><a href="/" className="nb__link">Home</a></li>

              {/* Insights */}
              <li className="nb__item" onMouseEnter={() => openMenu('insights')} onMouseLeave={closeMenu}>
                <button className={`nb__link nb__link--btn${activeMenu === 'insights' ? ' nb__link--active' : ''}`}>
                  Insights <ChevronDown size={13} className={`nb__chevron${activeMenu === 'insights' ? ' nb__chevron--open' : ''}`} />
                </button>
                <div className={`nb__drop nb__drop--sm${activeMenu === 'insights' ? ' nb__drop--visible' : ''}`}
                  onMouseEnter={() => keepMenu('insights')} onMouseLeave={closeMenu}>
                  <div className="nb__drop-inner">
                    {INSIGHTS_LINKS.map(item => (
                      <a key={item.name} href={item.href} className="nb__drop-link">
                        <span>{item.name}</span><ArrowUpRight size={12} className="nb__drop-arrow" />
                      </a>
                    ))}
                  </div>
                </div>
              </li>

              {/* Services */}
              <li className="nb__item" onMouseEnter={() => openMenu('services')} onMouseLeave={closeMenu}>
                <button className={`nb__link nb__link--btn${activeMenu === 'services' ? ' nb__link--active' : ''}`}>
                  Services <ChevronDown size={13} className={`nb__chevron${activeMenu === 'services' ? ' nb__chevron--open' : ''}`} />
                </button>
                <div className={`nb__drop nb__drop--mega${activeMenu === 'services' ? ' nb__drop--visible' : ''}`}
                  onMouseEnter={() => keepMenu('services')} onMouseLeave={closeMenu}>
                  <div className="nb__drop-inner nb__mega-services">
                    <div className="nb__mega-col">
                      <p className="nb__mega-label">India</p>
                      {SERVICES_INDIA.map(item => (
                        <a key={item.name} href={item.href} className="nb__drop-link">
                          <span>{item.name}</span><ArrowUpRight size={12} className="nb__drop-arrow" />
                        </a>
                      ))}
                    </div>
                    <div className="nb__mega-divider" />
                    <div className="nb__mega-col">
                      <p className="nb__mega-label">Global</p>
                      {SERVICES_GLOBAL.map(item => (
                        <a key={item.name} href={item.href} className="nb__drop-link">
                          <span>{item.name}</span><ArrowUpRight size={12} className="nb__drop-arrow" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </li>

              {/* Sectors */}
              <li className="nb__item" onMouseEnter={() => openMenu('sectors')} onMouseLeave={closeMenu}>
                <button className={`nb__link nb__link--btn${activeMenu === 'sectors' ? ' nb__link--active' : ''}`}>
                  Sectors <ChevronDown size={13} className={`nb__chevron${activeMenu === 'sectors' ? ' nb__chevron--open' : ''}`} />
                </button>
                <div className={`nb__drop nb__drop--mega nb__drop--sectors${activeMenu === 'sectors' ? ' nb__drop--visible' : ''}`}
                  onMouseEnter={() => keepMenu('sectors')} onMouseLeave={closeMenu}>
                  <div className="nb__drop-inner nb__mega-sectors">
                    {SECTORS.map(sector => (
                      <div key={sector.title} className="nb__mega-col">
                        <p className="nb__mega-label">{sector.title}</p>
                        {sector.items.map(item => (
                          <a key={item.name} href={item.href} className="nb__drop-link">
                            <span>{item.name}</span><ArrowUpRight size={12} className="nb__drop-arrow" />
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </li>

              {/* About */}
              <li className="nb__item" onMouseEnter={() => openMenu('about')} onMouseLeave={closeMenu}>
                <button className={`nb__link nb__link--btn${activeMenu === 'about' ? ' nb__link--active' : ''}`}>
                  About Us <ChevronDown size={13} className={`nb__chevron${activeMenu === 'about' ? ' nb__chevron--open' : ''}`} />
                </button>
                <div className={`nb__drop nb__drop--sm${activeMenu === 'about' ? ' nb__drop--visible' : ''}`}
                  onMouseEnter={() => keepMenu('about')} onMouseLeave={closeMenu}>
                  <div className="nb__drop-inner">
                    {ABOUT_LINKS.map(item => (
                      <a key={item.name} href={item.href} className="nb__drop-link">
                        <span>{item.name}</span><ArrowUpRight size={12} className="nb__drop-arrow" />
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </nav>

          {/* Right: socials + CTA */}
          <div className="nb__right">
            <div className="nb__socials">
              <a href="https://www.linkedin.com/in/jhsllp" target="_blank" rel="noopener noreferrer" className="nb__social" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="https://www.facebook.com/JHSAssociatesLLP" target="_blank" rel="noopener noreferrer" className="nb__social" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://www.instagram.com/jhsassociates_llp/" target="_blank" rel="noopener noreferrer" className="nb__social" aria-label="Instagram"><InstagramIcon /></a>
            </div>
            <div className="nb__right-sep" />
            <a href="/contact" className="nb__cta">Contact Us <ArrowUpRight size={14} /></a>
          </div>

          {/* Hamburger — always visible on mobile */}
          <button
            className={`nb__burger${menuOpen ? ' nb__burger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {/* ══════════ MOBILE DRAWER — outside <header> so nothing clips it ══════════ */}
      {/* Backdrop */}
      <div
        className={`nb__backdrop${menuOpen ? ' nb__backdrop--show' : ''}`}
        onClick={closeMob}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`nb__drawer${menuOpen ? ' nb__drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="nb__drawer-hd">
          <a href="/" className="nb__logo" onClick={closeMob}>
            <img src="/src/image/logo.png" alt="JHS & Associates LLP" className="nb__logo-img" />
          </a>
          <button className="nb__drawer-close" onClick={closeMob} aria-label="Close menu" type="button">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="nb__drawer-body">

          <a href="/" className="nb__mob-link" onClick={closeMob}>Home</a>

          {/* Insights */}
          <div className="nb__mob-group">
            <button className={`nb__mob-link nb__mob-toggle${activeMobile === 'insights' ? ' nb__mob-toggle--open' : ''}`}
              onClick={() => toggleMob('insights')} type="button">
              Insights
              <ChevronDown size={16} className={`nb__mob-chevron${activeMobile === 'insights' ? ' nb__mob-chevron--open' : ''}`} />
            </button>
            <div className={`nb__mob-sub${activeMobile === 'insights' ? ' nb__mob-sub--open' : ''}`}>
              {INSIGHTS_LINKS.map(item => (
                <a key={item.name} href={item.href} className="nb__mob-sublink" onClick={closeMob}>{item.name}</a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="nb__mob-group">
            <button className={`nb__mob-link nb__mob-toggle${activeMobile === 'services' ? ' nb__mob-toggle--open' : ''}`}
              onClick={() => toggleMob('services')} type="button">
              Services
              <ChevronDown size={16} className={`nb__mob-chevron${activeMobile === 'services' ? ' nb__mob-chevron--open' : ''}`} />
            </button>
            <div className={`nb__mob-sub${activeMobile === 'services' ? ' nb__mob-sub--open' : ''}`}>
              <p className="nb__mob-sublabel">India</p>
              {SERVICES_INDIA.map(i => <a key={i.name} href={i.href} className="nb__mob-sublink" onClick={closeMob}>{i.name}</a>)}
              <p className="nb__mob-sublabel">Global</p>
              {SERVICES_GLOBAL.map(i => <a key={i.name} href={i.href} className="nb__mob-sublink" onClick={closeMob}>{i.name}</a>)}
            </div>
          </div>

          {/* Sectors */}
          <div className="nb__mob-group">
            <button className={`nb__mob-link nb__mob-toggle${activeMobile === 'sectors' ? ' nb__mob-toggle--open' : ''}`}
              onClick={() => toggleMob('sectors')} type="button">
              Sectors
              <ChevronDown size={16} className={`nb__mob-chevron${activeMobile === 'sectors' ? ' nb__mob-chevron--open' : ''}`} />
            </button>
            <div className={`nb__mob-sub${activeMobile === 'sectors' ? ' nb__mob-sub--open' : ''}`}>
              {SECTORS.map(s => (
                <div key={s.title}>
                  <p className="nb__mob-sublabel">{s.title}</p>
                  {s.items.map(i => <a key={i.name} href={i.href} className="nb__mob-sublink" onClick={closeMob}>{i.name}</a>)}
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="nb__mob-group">
            <button className={`nb__mob-link nb__mob-toggle${activeMobile === 'about' ? ' nb__mob-toggle--open' : ''}`}
              onClick={() => toggleMob('about')} type="button">
              About Us
              <ChevronDown size={16} className={`nb__mob-chevron${activeMobile === 'about' ? ' nb__mob-chevron--open' : ''}`} />
            </button>
            <div className={`nb__mob-sub${activeMobile === 'about' ? ' nb__mob-sub--open' : ''}`}>
              {ABOUT_LINKS.map(item => (
                <a key={item.name} href={item.href} className="nb__mob-sublink" onClick={closeMob}>{item.name}</a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="nb__mob-socials">
            <p className="nb__mob-socials-label">Connect</p>
            <div className="nb__mob-socials-row">
              <a href="https://www.linkedin.com/in/jhsllp" target="_blank" rel="noopener noreferrer" className="nb__mob-social" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="https://www.facebook.com/JHSAssociatesLLP" target="_blank" rel="noopener noreferrer" className="nb__mob-social" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://www.instagram.com/jhsassociates_llp/" target="_blank" rel="noopener noreferrer" className="nb__mob-social" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>

          {/* CTA */}
          <a href="/contact" className="nb__mob-cta" onClick={closeMob}>
            Contact Us <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </>
  )
}
