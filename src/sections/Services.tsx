import { useState } from "react";
import "./Services.css";

const capabilities = [
  { label: "Audit & Assurance", href: "/services/audit" },
  { label: "Tax Advisory", href: "/services/tax" },
  { label: "GST Compliance", href: "/services/gst" },
  { label: "Financial Reporting", href: "/services/reporting" },
  { label: "Corporate Advisory", href: "/services/corporate" },
  { label: "Risk & Governance", href: "/services/risk" },
];

const industries = [
  { label: "Manufacturing", href: "/industries/manufacturing" },
  { label: "Real Estate", href: "/industries/real-estate" },
  { label: "Healthcare", href: "/industries/healthcare" },
  { label: "Banking & Finance", href: "/industries/banking" },
  { label: "IT & Technology", href: "/industries/technology" },
  { label: "Retail & FMCG", href: "/industries/retail" },
];

export default function Services() {
  const [capOpen, setCapOpen] = useState(false);
  const [indOpen, setIndOpen] = useState(false);

  const handleCapSelect = (href: string) => {
    window.location.href = href;
    setCapOpen(false);
  };

  const handleIndSelect = (href: string) => {
    window.location.href = href;
    setIndOpen(false);
  };

  return (
    <section className="services">
      {/* Left — pale navy background with text + dropdowns */}
      <div className="services__left">
        {/* Decorative circles wrapped to contain overflow without clipping dropdowns */}
        <div className="services__left-bg">
          <span className="services__deco services__deco--1" aria-hidden="true" />
          <span className="services__deco services__deco--2" aria-hidden="true" />
        </div>

        <div className="services__content">
          <h2 className="services__heading">
            How can we
            assist you <br /> today?
          </h2>
          <p className="services__sub">
            Explore our core areas of expertise by selecting your
            topic of interest below.
          </p>

          <div className="services__dropdowns">
            {/* Capabilities dropdown */}
            <div className={`services__dropdown ${capOpen ? "services__dropdown--open" : ""}`}>
              <button
                className="services__dropdown-trigger"
                onClick={() => { setCapOpen(!capOpen); setIndOpen(false); }}
                aria-expanded={capOpen}
                aria-haspopup="listbox"
              >
                <span>Capabilities</span>
                <svg
                  className="services__dropdown-icon"
                  width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {capOpen && (
                <ul className="services__dropdown-menu" role="listbox">
                  {capabilities.map((item) => (
                    <li key={item.label} role="option">
                      <button
                        className="services__dropdown-item"
                        onClick={() => handleCapSelect(item.href)}
                      >
                        {item.label}
                        <svg width="14" height="14" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Industries dropdown */}
            <div className={`services__dropdown ${indOpen ? "services__dropdown--open" : ""}`}>
              <button
                className="services__dropdown-trigger"
                onClick={() => { setIndOpen(!indOpen); setCapOpen(false); }}
                aria-expanded={indOpen}
                aria-haspopup="listbox"
              >
                <span>Industries</span>
                <svg
                  className="services__dropdown-icon"
                  width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {indOpen && (
                <ul className="services__dropdown-menu" role="listbox">
                  {industries.map((item) => (
                    <li key={item.label} role="option">
                      <button
                        className="services__dropdown-item"
                        onClick={() => handleIndSelect(item.href)}
                      >
                        {item.label}
                        <svg width="14" height="14" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right — abstract decorative image panel */}
      <div className="services__right" aria-hidden="true">
        <div className="services__right-bg" />
        {/* SVG wave shapes layered for depth */}
        <svg className="services__wave services__wave--back"
          viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="320" cy="280" rx="260" ry="340" fill="rgba(255,255,255,0.06)" />
          <ellipse cx="200" cy="400" rx="200" ry="260" fill="rgba(255,255,255,0.05)" />
        </svg>
        <svg className="services__wave services__wave--mid"
          viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 460 0 C 380 120 500 260 380 360 C 260 460 160 380 80 500 L 500 600 L 500 0 Z"
            fill="rgba(255,255,255,0.07)"
          />
        </svg>
        <svg className="services__wave services__wave--front"
          viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 500 100 C 400 160 460 320 340 400 C 220 480 160 440 100 560 L 500 600 Z"
            fill="rgba(255,255,255,0.09)"
          />
          <circle cx="380" cy="160" r="90" fill="rgba(255,255,255,0.06)" />
          <circle cx="260" cy="360" r="60" fill="rgba(255,255,255,0.05)" />
        </svg>
      </div>

      {/* Click-outside overlay to close dropdowns */}
      {(capOpen || indOpen) && (
        <div
          className="services__backdrop"
          onClick={() => { setCapOpen(false); setIndOpen(false); }}
          aria-hidden="true"
        />
      )}
    </section>
  );
}