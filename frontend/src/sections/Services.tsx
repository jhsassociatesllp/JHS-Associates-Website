import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

type ServiceItem = {
  label: string;
  href: string;
  description: string;
  image: string;
};

const capabilities: ServiceItem[] = [
  { label: "Audit & Assurance", href: "/services/assurance", description: "Enhance trust and transparency with our comprehensive audit and assurance services, tailored to meet your business needs.", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80" },
  { label: "Tax Advisory", href: "/services/taxation", description: "Navigate complex tax regulations efficiently. We provide strategic tax planning and advisory to optimize your tax position.", image: "https://images.unsplash.com/photo-1586486855514-8c633cc15394?auto=format&fit=crop&q=80" },
  { label: "GST Compliance", href: "/services/taxation", description: "Ensure seamless GST compliance with our end-to-end support, from registration to filing and dispute resolution.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80" },
  { label: "Financial Reporting", href: "/services/consulting", description: "Accurate and timely financial reporting services to help you make informed business decisions and comply with standards.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" },
  { label: "Corporate Advisory", href: "/services/consulting", description: "Strategic guidance for corporate restructuring, mergers, acquisitions, and overall business growth.", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" },
  { label: "Risk & Governance", href: "/services/soc-attestation", description: "Identify and mitigate enterprise risks while establishing robust corporate governance frameworks.", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80" },
  { label: "Outsourcing", href: "/services/outsourcing", description: "Focus on your core competencies while we handle your accounting, payroll, and compliance outsourcing needs.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" },
  { label: "Single Window Assistance", href: "/services/single-window-assistance", description: "A comprehensive, unified approach to setting up and managing your business operations in India.", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80" },
];

const industries: ServiceItem[] = [
  { label: "Manufacturing", href: "/sectors/other/manufacturing", description: "Optimizing supply chains, improving operational efficiency, and navigating regulatory landscapes in the manufacturing sector.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" },
  { label: "Real Estate", href: "/sectors/consumer/real-estate", description: "Expert financial and advisory services for developers, investors, and property managers in the real estate market.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" },
  { label: "Healthcare", href: "/sectors/other/healthcare", description: "Supporting healthcare providers with compliance, operational efficiency, and strategic financial planning.", image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80" },
  { label: "Banking & Finance", href: "/sectors/financial-services/banking", description: "Comprehensive audit, risk, and advisory services tailored for banks, NBFCs, and financial institutions.", image: "https://images.unsplash.com/photo-1501167733083-d5e0a0d4b971?auto=format&fit=crop&q=80" },
  { label: "IT & Technology", href: "/sectors/media-technology/it-tes", description: "Empowering tech companies with specialized tax structuring, M&A advisory, and compliance services.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80" },
  { label: "Retail & FMCG", href: "/sectors/consumer/retail", description: "Helping retail and fast-moving consumer goods businesses navigate complex market dynamics and consumer trends.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80" },
  { label: "Construction", href: "/sectors/other/construction", description: "Strategic financial management and project advisory for large-scale infrastructure and construction companies.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" },
  { label: "NGO", href: "/sectors/other/ngo", description: "Specialized audit and compliance support for non-governmental organizations and charitable trusts.", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80" },
  { label: "Media", href: "/sectors/media-technology/media", description: "Navigating intellectual property rights, international taxation, and compliance in the fast-paced media industry.", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80" },
  { label: "Insurance", href: "/sectors/financial-services/insurance", description: "Risk mitigation, regulatory compliance, and audit services for insurance providers and brokers.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80" },
];

export default function Services() {
  const [capOpen, setCapOpen] = useState(false);
  const [indOpen, setIndOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ServiceItem | null>(null);

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
                      <button
                        className={`services__dropdown-item ${activeItem?.label === item.label ? 'active' : ''}`}
                        onClick={() => {
                          setActiveItem(item);
                          setCapOpen(false);
                        }}
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
                      <button
                        className={`services__dropdown-item ${activeItem?.label === item.label ? 'active' : ''}`}
                        onClick={() => {
                          setActiveItem(item);
                          setIndOpen(false);
                        }}
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
        {activeItem ? (
          <div className="services__right-dynamic fade-in">
            <img src={activeItem.image} alt={activeItem.label} className="services__right-image" />
            <div className="services__right-overlay">
              <h3 className="services__right-title">{activeItem.label}</h3>
              <p className="services__right-desc">{activeItem.description}</p>
              <Link to={activeItem.href} className="services__right-btn">
                EXPLORE
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="services__right-default fade-in">
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
        )}
      </div>
    </section>
  );
}