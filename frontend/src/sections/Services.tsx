import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

const capabilities = [
  { label: "Audit & Assurance", href: "/services/assurance" },
  { label: "Tax Advisory", href: "/services/taxation" },
  { label: "GST Compliance", href: "/services/taxation" },
  { label: "Financial Reporting", href: "/services/consulting" },
  { label: "Corporate Advisory", href: "/services/consulting" },
  { label: "Risk & Governance", href: "/services/soc-attestation" },
  { label: "Outsourcing", href: "/services/outsourcing" },
  { label: "Single Window Assistance", href: "/services/single-window-assistance" },
];

const industries = [
  { label: "Manufacturing", href: "/sectors/other/manufacturing" },
  { label: "Real Estate", href: "/sectors/consumer/real-estate" },
  { label: "Healthcare", href: "/sectors/other/healthcare" },
  { label: "Banking & Finance", href: "/sectors/financial-services/banking" },
  { label: "IT & Technology", href: "/sectors/media-technology/it-tes" },
  { label: "Retail & FMCG", href: "/sectors/consumer/retail" },
  { label: "Construction", href: "/sectors/other/construction" },
  { label: "NGO", href: "/sectors/other/ngo" },
  { label: "Media", href: "/sectors/media-technology/media" },
  { label: "Insurance", href: "/sectors/financial-services/insurance" },
];

export default function Services() {
  const [capOpen, setCapOpen] = useState(false);
  const [indOpen, setIndOpen] = useState(false);

  const capRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside either dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideCap = capRef.current && !capRef.current.contains(target);
      const outsideInd = indRef.current && !indRef.current.contains(target);
      if (outsideCap && outsideInd) {
        setCapOpen(false);
        setIndOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="services">
      {/* Left — pale navy background with text + dropdowns */}
      <div className="services__left">
        <div className="services__left-bg">
          <span className="services__deco services__deco--1" aria-hidden="true" />
          <span className="services__deco services__deco--2" aria-hidden="true" />
        </div>

        <div className="services__content">
          <h2 className="services__heading">
            How can we assist you <br /> today?
          </h2>
          <p className="services__sub">
            Explore our core areas of expertise by selecting your
            topic of interest below.
          </p>

          <div className="services__dropdowns">
            {/* Capabilities dropdown */}
            <div
              ref={capRef}
              className={`services__dropdown ${capOpen ? "services__dropdown--open" : ""}`}
            >
              <button
                className="services__dropdown-trigger"
                onClick={() => { setCapOpen((v) => !v); setIndOpen(false); }}
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
                      <Link
                        className="services__dropdown-item"
                        to={item.href}
                        onClick={() => setCapOpen(false)}
                      >
                        {item.label}
                        <svg width="14" height="14" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Industries dropdown */}
            <div
              ref={indRef}
              className={`services__dropdown ${indOpen ? "services__dropdown--open" : ""}`}
            >
              <button
                className="services__dropdown-trigger"
                onClick={() => { setIndOpen((v) => !v); setCapOpen(false); }}
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
                      <Link
                        className="services__dropdown-item"
                        to={item.href}
                        onClick={() => setIndOpen(false)}
                      >
                        {item.label}
                        <svg width="14" height="14" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
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
    </section>
  );
}