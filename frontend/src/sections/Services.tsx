import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LazyImage from '../components/common/LazyImage';
import "./Services.css";

// industries_Images
import { imageUrl } from '../utils/imageUrl'

// service_images

type ServiceItem = {
  label: string;   
  href: string;
  description: string;
  image: string;
};

const capabilities: ServiceItem[] = [
  { label: "Audit & Assurance", href: "/services/assurance", description: "Enhance trust and transparency with our comprehensive audit and assurance services, tailored to meet your business needs.", image: imageUrl('Assurance.png') },
  { label: "Tax Advisory", href: "/services/taxation", description: "Navigate complex tax regulations efficiently. We provide strategic tax planning and advisory to optimize your tax position.", image: imageUrl('Taxposter.jpg') },
  { label: "GST Compliance", href: "/services/taxation", description: "Ensure seamless GST compliance with our end-to-end support, from registration to filing and dispute resolution.", image: imageUrl('gst-im.png') },
  { label: "Financial Reporting", href: "/services/consulting", description: "Accurate and timely financial reporting services to help you make informed business decisions and comply with standards.", image: imageUrl('Fainance-report.png') },
  { label: "Corporate Advisory", href: "/services/consulting", description: "Strategic guidance for corporate restructuring, mergers, acquisitions and overall business growth.", image: imageUrl('Blogimg.png') },
  { label: "Risk & Governance", href: "/services/soc-attestation", description: "Identify and mitigate enterprise risks while establishing robust corporate governance frameworks.", image: imageUrl('Risk.png') },
  { label: "Outsourcing", href: "/services/outsourcing", description: "Focus on your core competencies while we handle your accounting, payroll and compliance outsourcing needs.", image: imageUrl('Outsourcing.png') },
  { label: "Single Window Assistance", href: "/services/single-window-assistance", description: "A comprehensive, unified approach to setting up and managing your business operations in India.", image: imageUrl('single-w-A.avif') },
];

const industries: ServiceItem[] = [
  { label: "Manufacturing", href: "/sectors/other/manufacturing", description: "Optimizing supply chains, improving operational efficiency, and navigating regulatory landscapes in the manufacturing sector.", image: imageUrl('manufacturing.png') },
  { label: "Real Estate", href: "/sectors/consumer/real-estate", description: "Expert financial and advisory services for developers, investors and property managers in the real estate market.", image: imageUrl('Real-State.avif') },
  { label: "Healthcare", href: "/sectors/other/healthcare", description: "Supporting healthcare providers with compliance, operational efficiency and strategic financial planning.", image: imageUrl('healthcare.avif') },
  { label: "Banking & Finance", href: "/sectors/financial-services/banking", description: "Comprehensive audit, risk and advisory services tailored for banks, NBFCs and financial institutions.", image: imageUrl('reserve-bank-of-india-rbi-.jpg') },
  { label: "IT & Cybersecurity", href: "/sectors/media-technology/it-tes", description: "Empowering tech companies with specialized tax structuring, M&A advisory and compliance services.", image: imageUrl('IT-Technology.avif') },
  { label: "Retail & FMCG", href: "/sectors/consumer/retail", description: "Helping retail and fast-moving consumer goods businesses navigate complex market dynamics and consumer trends.", image: imageUrl('Retail.avif') },
  { label: "Construction", href: "/sectors/other/construction", description: "Strategic financial management and project advisory for large-scale infrastructure and construction companies.", image: imageUrl('construction.avif') },
  { label: "NGO", href: "/sectors/other/ngo", description: "Specialized audit and compliance support for non-governmental organizations and charitable trusts.", image: imageUrl('NGO.avif') },
  { label: "Media", href: "/sectors/media-technology/media", description: "Navigating intellectual property rights, international taxation and compliance in the fast-paced media industry.", image: imageUrl('Media.png') },
  { label: "Logistics", href: "/sectors/other/logistics", description: "Specialized audit and compliance support for non-governmental organizations and charitable trusts.", image: imageUrl('Logistics1.png') },
];

export default function Services() {
  const [capOpen, setCapOpen] = useState(false);
  const [indOpen, setIndOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ServiceItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const capRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLDivElement>(null);

  const isCapability = activeItem ? capabilities.some(c => c.label === activeItem.label) : false;
  const isIndustry = activeItem ? industries.some(i => i.label === activeItem.label) : false;

  // Preload all images on component mount
  useEffect(() => {
    const allImages = [...capabilities, ...industries].map(item => item.image);
    
    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
      };
    });
  }, []);

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

  const handleItemSelect = (item: ServiceItem) => {
    // Check if image is already loaded
    if (loadedImages.has(item.image)) {
      setActiveItem(item);
    } else {
      // Preload the image before setting active
      const img = new Image();
      img.src = item.image;
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, item.image]));
        setActiveItem(item);
      };
    }
  };

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
                className={`services__dropdown-trigger ${isCapability ? "services__dropdown-trigger--active" : ""}`}
                onClick={() => { setCapOpen((v) => !v); setIndOpen(false); }}
                aria-expanded={capOpen}
                aria-haspopup="listbox"
              >
                <span>{isCapability && activeItem ? activeItem.label : "Capabilities"}</span>
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
                <ul
                  className="services__dropdown-menu"
                  role="listbox"
                  onWheel={(e) => {
                    const el = e.currentTarget;

                    const isAtTop = el.scrollTop === 0;
                    const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

                    // Prevent page scroll when reaching top/bottom
                    if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
                      e.preventDefault();
                    }

                    // Stop event from bubbling to page
                    e.stopPropagation();
                  }}
                >
                  {capabilities.map((item) => (
                    <li key={item.label} role="option">
                      <button
                        className={`services__dropdown-item ${activeItem?.label === item.label ? "active" : ""
                          }`}
                        onClick={() => {
                          handleItemSelect(item);
                          setCapOpen(false);
                        }}
                      >
                        {item.label}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                className={`services__dropdown-trigger ${isIndustry ? "services__dropdown-trigger--active" : ""}`}
                onClick={() => { setIndOpen((v) => !v); setCapOpen(false); }}
                aria-expanded={indOpen}
                aria-haspopup="listbox"
              >
                <span>{isIndustry && activeItem ? activeItem.label : "Industries"}</span>
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
                <ul
                  className="services__dropdown-menu"
                  role="listbox"
                  onWheel={(e) => {
                    const el = e.currentTarget;

                    const isAtTop = el.scrollTop === 0;
                    const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

                    // Prevent page scroll when at edges
                    if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
                      e.preventDefault();
                    }

                    // Stop bubbling to page
                    e.stopPropagation();
                  }}
                >
                  {industries.map((item) => (
                    <li key={item.label} role="option">
                      <button
                        className={`services__dropdown-item ${activeItem?.label === item.label ? "active" : ""
                          }`}
                        onClick={() => {
                          handleItemSelect(item);
                          setIndOpen(false);
                        }}
                      >
                        {item.label}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
          <div className="services__right-dynamic fade-in" key={activeItem.label}>
            <LazyImage
              src={activeItem.image}
              alt={activeItem.label}
              className="services__right-image"
              threshold={0.1}
            />
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