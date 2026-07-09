import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { imageUrl } from '../utils/imageUrl'

// ─── Types ─────────────────────────────────────────────────────
interface SubItem {
  label: string;
  description?: string;
  href?: string;
  children?: RightItem[]; // ← Services & Sectors ke right-panel items
}

interface RightItem {
  label: string;
  description?: string;
  href?: string;
}

interface NavItem {
  id: string;
  label: string;
  subLabel?: string;
  subDesc?: string;
  subItems?: SubItem[];
  inlineExpand?: boolean; // ← true = Services & Sectors style
  href?: string;
}

// ─── Menu Data ─────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
  },
  {
    id: "insights",
    label: "Insights",
    subLabel: "Insights",
    subDesc: "Access our latest thinking, research & perspectives.",
    subItems: [
      { label: "Resources", description: "Reports, tools & frameworks", href: '/resources' },
      { label: "Articles", description: "Expert authored deep-dives", href: '/articles' },
      { label: "Thought Leadership", description: "Leadership perspectives", href: '/thought-leadership' },
      { label: "Case Studies", description: "Real-world transformation stories", href: '/case-studies' },
      { label: "Newsletters", description: "Subscribe to our weekly digest", href: '/newsletters' },
      { label: "Podcasts", description: "Audio insights on the go", href: '/podcasts' },
    ],
  },

  // ── SERVICES — inlineExpand: true ──────────────────────────
  {
    id: "services",
    label: "Services",
    inlineExpand: true,
    subItems: [
      {
        label: "India",
        description: "Tailored solutions for the Indian market",
        children: [
          { label: "Consulting", description: "Holistic advisory across functions", href: '/services/consulting' },
          { label: "IT Assurance", description: "risk & compliance", href: '/services/assurance' },
          { label: "Taxation ", description: "Direct & indirect tax advisory", href: '/services/taxation' },
          { label: "Outsourcing ", description: "Finance & accounting outsourcing", href: '/services/outsourcing' },
          { label: "Corporate Finance", description: "End to end corporate finance advisory covering capital markets, M&A, valuations, treasury and infrastructure advisory for businesses at every stage of growth.", href: '/services/corporate-finance' },
          { label: "Compliance & Learning", description: "Training programs on GST, Income Tax, Accounting Standards, and Corporate Compliance to equip your teams with essential knowledge and skills.", href: '/services/compliance-learning' },
        ],
      },
      {
        label: "Global",
        description: "World-class advisory across geographies",
        children: [
          { label: "Assurance", description: "", href: '/services/assurance' },
          { label: "Taxation ", description: "", href: '/services/taxation' },
          { label: "Single Window Assistance", description: "", href: '/services/single-window-assistance' },
          { label: "SOC Attestation", description: "", href: '/services/soc-attestation' },
          { label: "Consulting", description: "", href: '/services/consulting' },
          { label: "Outsourcing", description: "", href: '/services/outsourcing' },
        ],
      },
    ],
  },

  // ── SECTORS — inlineExpand: true ───────────────────────────
  {
    id: "sectors",
    label: "Sectors",
    inlineExpand: true,
    subItems: [
      {
        label: "Media & Technology",
        description: "Navigating digital disruption",
        children: [
          { label: "Media", description: "", href: '/sectors/media-technology/media' },
          { label: "IT System Audit", description: "", href: '/sectors/media-technology/it-system-audit' },
          { label: "IT /ITeS", description: "", href: 'sectors/media-technology/it-tes' },
        ],
      },
      {
        label: "Consumer",
        description: "FMCG to luxury retail",
        children: [
          { label: "FMCG", description: "", href: '/sectors/consumer/fmcg' },
          { label: "Retail", description: "", href: '/sectors/consumer/retail' },
          { label: "Oil & Gas", description: "", href: '/sectors/consumer/oil-gas-industry' },
          { label: "Housing", description: "", href: '/sectors/consumer/housing' },
          { label: "Real Estate", description: "", href: '/sectors/consumer/real-estate' },
          { label: "Commodity", description: "", href: '/sectors/consumer/commodity' },
          { label: "Gems & Jewellery", description: "", href: '/sectors/consumer/gems-jewellery' },
        ],
      },
      {
        label: "Financial Services",
        description: "Banking, capital & fintech",
        children: [
          { label: "Banking", description: "Retail & corporate banking", href: '/sectors/financial-services/banking' },
          { label: "Insurance", description: "Life, health & general insurance", href: '/sectors/financial-services/insurance' },
          { label: "Broking", description: "", href: '/sectors/financial-services/broking' },
          { label: "Mutual Funds", description: "", href: '/sectors/financial-services/mutual-funds' },
          { label: "Digital Currency", description: "", href: '/sectors/financial-services/digital-currency' },
          { label: "Family Oriented Businesses", description: "", href: '/sectors/financial-services/family-oriented-businesses' },
          { label: "Portfolio Management", description: "", href: '/sectors/financial-services/portfolio-management' },
          { label: "Venture capital", description: "", href: '/sectors/financial-services/venture-capital' },
          { label: "NBFC", description: "", href: '/sectors/financial-services/nbfc' },
        ],
      },
      {
        label: "Others",
        description: "Cross-industry specialist practices",
        children: [
          { label: "Healthcare", description: "Policy, delivery & life sciences", href: '/sectors/other/healthcare' },
          { label: "Constructions", description: "", href: '/sectors/other/construction' },
          { label: "Manufacturing", description: "", href: '/sectors/other/manufacturing' },
          { label: "Logistics", description: "Supply chain & transportation", href: '/sectors/other/logistics' },
          { label: "NGO", description: "", href: '/sectors/other/ngo' },
        ],
      },
    ],
  },

  {
    id: "knowus",
    label: "Know Us",
    subLabel: "Know Us",
    subDesc: "Discover who we are what we stand for and how we work.",
    subItems: [
      { label: "Our Story", description: "History & founding vision", href: "/know-us/our-story" },
      { label: "Mission & Vision", description: "What drives us", href: "/know-us/mission-vision" },
      // { label: "Leadership", description: "Meet the partners", href: "/know-us/leadership" },
      // { label: "Culture", description: "Our values & ways of working", href: "/know-us/culture" },
      // { label: "Partnerships", description: "Strategic alliances & networks", href: "/know-us/partnerships" },
      // { label: "Awards", description: "Recognition & accolades", href: "/know-us/awards" },
    ],
  },
  {
    id: "aboutus",
    label: "About Us",
    subLabel: "About Us",
    subDesc: "JHS & Associates LLP your trusted partners in finance.",
    subItems: [
      // { label: "Company Overview", description: "Who we are", href: '/about/company-overview' },
      { label: "Our Offices", description: "Mumbai, Delhi, Bangalore & more", href: '/about/our-offices' },
      // { label: "Global Presence", description: "Our international footprint", href: '/about/global-presence' },
      { label: "Leadership Team", description: "Board & senior partners", href: '/about/leadership' },
      { label: "Careers", description: "Join our growing team", href: '/about/careers' },
      // { label: "CSR", description: "Our social responsibility", href: '/about/csr' },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    href: '/contact',
  },
];

// ─── Component ─────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);

  const menuOpenRef = useRef(menuOpen);
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const lastScrollY = useRef(0);

  // For inlineExpand items (Services & Sectors):
  // which sub-item is selected → drives the right panel
  const [activeSubLabel, setActiveSubLabel] = useState<string | null>(null);

  // Mobile Drill-Down State
  const [mobileState, setMobileState] = useState<{
    view: 'root' | 'l1' | 'l2';
    l1Id?: string;
    l2Label?: string;
  }>({ view: 'root' });

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        if (!menuOpenRef.current) setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setTimeout(() => searchRef.current?.focus(), 400);
  }, [menuOpen]);

  const openMenu = () => {
    setActiveId('insights'); // Default to Insights instead of Home
    setActiveSubLabel(null);
    setMobileState({ view: 'root' });
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    setActiveSubLabel(null);
    setTimeout(() => setMobileState({ view: 'root' }), 400);
  };

  // When L1 nav changes, reset sub selection
  const handleNavHover = (id: string) => {
    setActiveId(id);
    setActiveSubLabel(null);
  };

  const activeNavItem = NAV_ITEMS.find((n) => n.id === activeId) ?? NAV_ITEMS[0];
  const isInline = !!activeNavItem.inlineExpand;

  // Right panel content:
  // — inlineExpand items → driven by activeSubLabel
  // — normal items       → show subItems directly in right panel
  const rightChildren: RightItem[] | SubItem[] | null = (() => {
    if (isInline && activeSubLabel) {
      return (
        activeNavItem.subItems?.find((s) => s.label === activeSubLabel)
          ?.children ?? null
      );
    }
    if (!isInline) {
      return activeNavItem.subItems ?? null;
    }
    return null;
  })();

  const rightTitle = isInline
    ? activeSubLabel
    : activeNavItem.subLabel ?? activeNavItem.label;

  const rightDesc = isInline
    ? activeNavItem.subItems?.find((s) => s.label === activeSubLabel)?.description
    : activeNavItem.subDesc;

  // --- Mobile Derived State ---
  const mobileActiveL1 = NAV_ITEMS.find((n) => n.id === mobileState.l1Id) ?? NAV_ITEMS[0];
  const mobileL1Items = mobileActiveL1.subItems ?? [];
  const mobileActiveL2 = mobileState.l2Label
    ? mobileL1Items.find((s) => s.label === mobileState.l2Label)
    : null;
  const mobileL2Items = mobileActiveL2?.children ?? [];

  return (
    <>
      {/* ══════════════ TOP NAVBAR ══════════════ */}
      <header className={`nb ${scrolled ? "nb--scrolled" : ""} ${menuOpen ? "nb--open" : ""} ${hidden ? "nb--hidden" : ""}`}>
        <div className="nb__left">
          <button
            className={`nb__burger ${menuOpen ? "nb__burger--open" : ""}`}
            onClick={menuOpen ? closeMenu : openMenu}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span className="nb__bar" />
            <span className="nb__bar" />
            <span className="nb__bar" />
          </button>

          <a href="/" className="nb__brand" onClick={closeMenu}>
            <img
              src={imageUrl('logo.jpeg')}
              alt="JHS "
              className="nb__logo"
            />
          </a>
        </div>


        {/* <div className="nb__right">
          <a href="/login" className="nb__login">LOG IN</a>
        </div> */}
      </header>

      {/* ══════════════ FULL-WIDTH MEGA MODAL ══════════════ */}
      <div
        className={`mega ${menuOpen ? "mega--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        {/* ── Modal top bar ── */}
        {/* <div className="mega__topbar">
          <div className="mega__topbar-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mega__search-ic">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Type to search…"
              className="mega__search-inp"
            />
          </div>
        </div> */}

        {/* ── Body: LEFT | RIGHT ── */}
        <div className="mega__body">

          {/* ════ DESKTOP PANEL ════ */}
          <div className="mega__desktop">

            {/* ════ LEFT PANEL ════ */}
            <nav className="mega__left" aria-label="Main navigation">
              <ul className="mega__nav-list">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id} className="mega__nav-li">

                    {/* L1 button */}
                    {item.href ? (
                      <Link
                        to={item.href}
                        className={`mega__nav-btn ${activeId === item.id ? "mega__nav-btn--active" : ""}`}
                        onClick={closeMenu}
                      >
                        <span className="mega__nav-label">{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        className={`mega__nav-btn ${activeId === item.id ? "mega__nav-btn--active" : ""}`}
                        onClick={() => handleNavHover(item.id)}
                      >
                        <span className="mega__nav-label">{item.label}</span>
                        <svg
                          className={`mega__nav-arr ${activeId === item.id && item.inlineExpand ? "mega__nav-arr--down" : ""}`}
                          width="14" height="14"
                          viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5"
                        >
                          {/* Arrow down when inline-expanded, right otherwise */}
                          {activeId === item.id && item.inlineExpand
                            ? <polyline points="6 9 12 15 18 9" />
                            : <polyline points="9 18 15 12 9 6" />
                          }
                        </svg>
                      </button>
                    )}



                  </li>
                ))}
              </ul>
            </nav>

            {/* ════ RIGHT PANEL ════ */}
            <div className="mega__right">

              {/* Services/Sectors Selection Panel */}
              {isInline && !activeSubLabel && (
                <div className="mega__right-panel mega__right-panel--vis">
                  <div className="mega__right-hdr">
                    <h2 className="mega__right-title">
                      {activeNavItem.id === 'services' ? 'Our Services' : 'Our Sectors'}
                    </h2>
                    <p className="mega__right-desc">
                      {activeNavItem.id === 'services'
                        ? 'Choose your market to explore our comprehensive service offerings'
                        : 'Select a sector to explore our specialized industry expertise'
                      }
                    </p>
                    <div className="mega__right-rule" />
                  </div>

                  <div className="mega__simple-grid">
                    {activeNavItem.subItems?.map((subItem) => (
                      <button
                        key={subItem.label}
                        className="mega__simple-item"
                        onClick={() => setActiveSubLabel(subItem.label)}
                      >
                        <h3>{subItem.label}</h3>
                        <p>{subItem.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Services/Sectors Detail Panel */}
              {isInline && activeSubLabel && rightChildren && (
                <div className="mega__right-panel mega__right-panel--vis">
                  <div className="mega__right-hdr">
                    <button
                      className="mega__back-btn"
                      onClick={() => setActiveSubLabel(null)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Back
                    </button>
                    <h2 className="mega__right-title">{rightTitle}</h2>
                    {rightDesc && (
                      <p className="mega__right-desc">{rightDesc}</p>
                    )}
                    <div className="mega__right-rule" />
                  </div>

                  <div className="mega__simple-grid">
                    {(rightChildren as Array<{
                      label: string;
                      description?: string;
                      href?: string;
                    }>).map((item) => (
                      <div key={item.label} className="mega__simple-item">
                        {item.href ? (
                          <Link
                            to={item.href}
                            className="mega__simple-link"
                            onClick={closeMenu}
                          >
                            <h4>{item.label}</h4>
                            {item.description && <p>{item.description}</p>}
                          </Link>
                        ) : (
                          <div className="mega__simple-link">
                            <h4>{item.label}</h4>
                            {item.description && <p>{item.description}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular panels for non-inline items (Know Us, About Us, etc.) */}
              {!isInline && (
                <div className={`mega__right-panel ${rightChildren ? "mega__right-panel--vis" : ""}`}>
                  {/* Heading */}
                  {rightTitle && (
                    <div className="mega__right-hdr">
                      <h2 className="mega__right-title">{rightTitle}</h2>
                      {rightDesc && (
                        <p className="mega__right-desc">{rightDesc}</p>
                      )}
                      <div className="mega__right-rule" />
                    </div>
                  )}

                  {/* Simple grid like Know Us */}
                  {rightChildren && rightChildren.length > 0 && (
                    <div className="mega__simple-grid">
                      {(rightChildren as Array<{
                        label: string;
                        description?: string;
                        href?: string;
                      }>).map((item) => (
                        <div key={item.label} className="mega__simple-item">
                          {item.href ? (
                            <Link
                              to={item.href}
                              className="mega__simple-link"
                              onClick={closeMenu}
                            >
                              <h4>{item.label}</h4>
                              {item.description && <p>{item.description}</p>}
                            </Link>
                          ) : (
                            <div className="mega__simple-link">
                              <h4>{item.label}</h4>
                              {item.description && <p>{item.description}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* ════ MOBILE DRILL-DOWN PANEL ════ */}
          <div className="mega__mobile">
            <div
              className="mega__mobile-slider"
              style={{ transform: `translateX(-${mobileState.view === 'root' ? 0 : mobileState.view === 'l1' ? 100 : 200}%)` }}
            >

              {/* P0: ROOT (L1 categories) */}
              <div className="mega__mobile-panel">
                <ul className="mega__mobile-list">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                      {item.href ? (
                        <Link
                          to={item.href}
                          className="mega__mobile-btn"
                          onClick={closeMenu}
                        >
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <button
                          className="mega__mobile-btn"
                          onClick={() => setMobileState({ view: 'l1', l1Id: item.id })}
                        >
                          <span>{item.label}</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* P1: SECOND LEVEL */}
              <div className="mega__mobile-panel">
                <div className="mega__mobile-hdr">
                  <button className="mega__mobile-back" onClick={() => setMobileState({ view: 'root' })}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                  </button>
                  <h3>{mobileActiveL1.label}</h3>
                </div>
                <ul className="mega__mobile-sublist">
                  {mobileL1Items.map((sub) => (
                    <li key={sub.label}>
                      {sub.children ? (
                        <button
                          className="mega__mobile-btn"
                          onClick={() => setMobileState({ view: 'l2', l1Id: mobileState.l1Id, l2Label: sub.label })}
                        >
                          <span>{sub.label}</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      ) : (
                        <a className="mega__mobile-link" href={sub.href || '#'} onClick={closeMenu}>
                          <span className="name">{sub.label}</span>
                          {sub.description && <span className="desc">{sub.description}</span>}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* P2: THIRD LEVEL */}
              <div className="mega__mobile-panel">
                <div className="mega__mobile-hdr">
                  <button className="mega__mobile-back" onClick={() => setMobileState({ view: 'l1', l1Id: mobileState.l1Id })}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                  </button>
                  <h3>{mobileState.l2Label}</h3>
                </div>
                <ul className="mega__mobile-sublist">
                  {mobileL2Items.map((child) => (
                    <li key={child.label}>
                      <a className="mega__mobile-link" href={child.href || '#'} onClick={closeMenu}>
                        <span className="name">{child.label}</span>
                        {child.description && <span className="desc">{child.description}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;