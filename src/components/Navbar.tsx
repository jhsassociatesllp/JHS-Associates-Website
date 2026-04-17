import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

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
}

// ─── Menu Data ─────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    id: "insights",
    label: "Insights",
    subLabel: "Insights",
    subDesc: "Access our latest thinking, research & perspectives.",
    subItems: [
      { label: "Resources", description: "Reports, tools & frameworks", href: '/resources' },
      { label: "Articles", description: "Expert authored deep-dives", href: '/articles' },
      { label: "Thought Leadership", description: "CEO & leadership perspectives", href: '/thought-leadership' },
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
          { label: "Assurance", description: "Audit, risk & compliance", href: '/services/assurance' },
          { label: "Taxation Services", description: "Direct & indirect tax advisory", href: '/services/taxation' },
          { label: "Outsourcing Services", description: "Finance & accounting outsourcing", href: '/services/outsourcing' },
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
          { label: "IT /ITeS", description: "", href: '/sectors/media-technology/it-ites' },
        ],
      },
      {
        label: "Consumer",
        description: "FMCG to luxury retail",
        children: [
          { label: "FMCG", description: "", href: '/sectors/consumer/fmcg' },
          { label: "Retail ", description: "", href: '/sectors/consumer/retail' },
          { label: "Oil & Gas", description: "", href: '/sectors/consumer/oil-gas' },
          { label: "Housing ", description: "", href: '/sectors/consumer/housing' },
          { label: "Real Estate", description: "", href: '/sectors/consumer/real-estate' },
          { label: "Commoditiy", description: "", href: '/sectors/consumer/commodities' },
          { label: "Gems & Jewelry", description: "", href: '/sectors/consumer/gems-jewelry' },
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
          { label: "Healthcare", description: "Policy, delivery & life sciences", href: '/sectors/others/healthcare' },
          { label: "Constructions", description: "", href: '/sectors/others/constructions' },
          { label: "Manufacturing", description: "", href: '/sectors/others/manufacturing' },
          { label: "NGO", description: "", href: '/sectors/others/ngo' },
        ],
      },
    ],
  },

  {
    id: "knowus",
    label: "Know Us",
    subLabel: "Know Us",
    subDesc: "Discover who we are, what we stand for, and how we work.",
    subItems: [
      { label: "Our Story", description: "History & founding vision" },
      { label: "Mission & Vision", description: "What drives us" },
      { label: "Leadership", description: "Meet the partners" },
      { label: "Culture", description: "Our values & ways of working" },
      { label: "Partnerships", description: "Strategic alliances & networks" },
      { label: "Awards", description: "Recognition & accolades" },
    ],
  },
  {
    id: "aboutus",
    label: "About Us",
    subLabel: "About Us",
    subDesc: "JHS & Associates LLP — your trusted partners in finance.",
    subItems: [
      { label: "Company Overview", description: "Who we are" },
      { label: "Our Offices", description: "Mumbai, Delhi, Bangalore & more" },
      { label: "Global Presence", description: "Our international footprint" },
      { label: "Leadership Team", description: "Board & senior partners" },
      { label: "Careers", description: "Join our growing team" },
      { label: "CSR", description: "Our social responsibility" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    subLabel: "Contact",
    subDesc: "Get in touch with our team — we're here to help.",
    subItems: [
      { label: "General Enquiry", description: "Write to us", href: '/contact' },
      { label: "Media Relations", description: "Press & publications" },
      { label: "Investor Relations", description: "For our stakeholders" },
      { label: "Mumbai Office", description: "+91 22 0000 0000" },
      { label: "Delhi Office", description: "+91 11 0000 0000" },
      { label: "Bangalore Office", description: "+91 80 0000 0000" },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);

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
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setTimeout(() => searchRef.current?.focus(), 400);
  }, [menuOpen]);

  const openMenu = () => {
    setActiveId(NAV_ITEMS[0].id);
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
      <header className={`nb ${scrolled ? "nb--scrolled" : ""}`}>
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
              src="/src/image/logo.png"
              alt="JHS & Associates LLP"
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

                    {/* ── INLINE SUB-ITEMS (Services & Sectors only) ── */}
                    {item.inlineExpand && activeId === item.id && item.subItems && (
                      <ul className="mega__inline-list">
                        {item.subItems.map((sub) => (
                          <li key={sub.label} className="mega__inline-li">
                            <button
                              className={`mega__inline-btn ${activeSubLabel === sub.label ? "mega__inline-btn--active" : ""}`}
                              onClick={() =>
                                setActiveSubLabel((prev) =>
                                  prev === sub.label ? null : sub.label
                                )
                              }
                            >
                              <span className="mega__inline-label">{sub.label}</span>
                              <svg
                                className="mega__inline-arr"
                                width="12" height="12"
                                viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5"
                              >
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                  </li>
                ))}
              </ul>
            </nav>

            {/* ════ RIGHT PANEL ════ */}
            <div className="mega__right">

              {/* Single unified right panel — updates based on active state */}
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

                {/* 2-column grid */}
                {rightChildren && rightChildren.length > 0 && (
                  <ul className="mega__sub-grid">
                    {(rightChildren as Array<{
                      label: string;
                      description?: string;
                      href?: string;
                    }>).map((item) => (
                      <li key={item.label} className="mega__sub-cell">
                        {item.href ? (
                          <Link
                            to={item.href}
                            className="mega__sub-link"
                            onClick={closeMenu}
                          >
                            <span className="mega__sub-name">{item.label}</span>
                            {item.description && (
                              <span className="mega__sub-desc">{item.description}</span>
                            )}
                          </Link>
                        ) : (
                          <span className="mega__sub-link mega__sub-link--plain">
                            <span className="mega__sub-name">{item.label}</span>
                            {item.description && (
                              <span className="mega__sub-desc">{item.description}</span>
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Placeholder when inlineExpand item selected but no sub clicked yet */}
                {isInline && !activeSubLabel && (
                  <div className="mega__inline-placeholder">
                    <p>Select a category from the left to explore</p>
                  </div>
                )}

              </div>
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
                      <button
                        className="mega__mobile-btn"
                        onClick={() => setMobileState({ view: 'l1', l1Id: item.id })}
                      >
                        <span>{item.label}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
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