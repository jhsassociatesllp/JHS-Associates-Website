import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Stats.css";
import { imageUrl } from "../utils/imageUrl";

interface InsightItem {
  eyebrow: string;
  heading: string;
  description: string;  
}

const insights: InsightItem[] = [
  {
    eyebrow: "FINANCIAL INTEGRITY ",
    heading: "The JHS Insights Index",
    description:
      "In a world of evolving regulations and economic uncertainty, the firms that thrive are those built on unshakeable financial discipline. JHS Associates brings decades of expertise transforming complexity into clarity.",
  },  
  {
    eyebrow: "TAX STRATEGY ",
    heading: "Navigating India's New Tax Landscape",
    description:
      "From GST compliance and income tax management to mutual fund advisory and wealth planning, we provide comprehensive financial solutions for individuals and businesses. Our experts help you navigate regulatory changes, optimise tax efficiency, and build a stronger financial future with confidence.",
  },
  {
    eyebrow: "AUDIT ",
    heading: "Assurance That Goes Beyond Numbers",
    description:
      "Our audit practice doesn't just verify it uncovers hidden risks and opportunities. Rigorous, independent, and forward-looking assurance for businesses that demand more.",
  },
];

export default function Stats() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % insights.length);
    }, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleTabClick = (idx: number) => {
    setActiveIndex(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % insights.length);
    }, 6000);
  };

  const active = insights[activeIndex];

  return (
    <section className={`stats ${isVisible ? "stats--visible" : ""}`} ref={sectionRef}>

      {/* Left panel — light with text */}
      <div className="stats__left">
        <div className="stats__content">
          <p className="stats__eyebrow" key={`eyebrow-${activeIndex}`}>
            {active.eyebrow}
          </p>
          <h2 className="stats__heading" key={`heading-${activeIndex}`}>
            {active.heading}
          </h2>
          <p className="stats__description" key={`desc-${activeIndex}`}>
            {active.description}
          </p>
          <Link to="/case-studies" className="stats__cta" aria-label="JHS Insights case studies">
            <span>JHS INSIGHTS</span>
            <span className="stats__cta-arrow" aria-hidden="true">→</span>
          </Link>
          <div className="stats__tabs" role="tablist">
            {insights.map((item, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === activeIndex}
                className={`stats__tab ${idx === activeIndex ? "stats__tab--active" : ""}`}
                onClick={() => handleTabClick(idx)}
                aria-label={`Insight ${idx + 1}`}
              >
                <span className="stats__tab-track">
                  {idx === activeIndex && <span className="stats__tab-fill" />}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stat row inside left panel */}
        <div className="stats__row">
          {[
            {
              number: "45+",
              label: "Years of Excellence",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              )
            },
            {
              number: "1,000+",
              label: "Clients Served",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              )
            },
            {
              number: "13",
              label: "Offices",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              )
            },
            {
              number: "700+",
              label: "Team Size",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              )
            },
          ].map((s, i) => (
            <div className="stats__stat" key={i}>
              <div className="stats__stat-icon">{s.icon}</div>
              <div className="stats__stat-content">
                <span className="stats__stat-number">{s.number}</span>
                <span className="stats__stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — image */}
      <div className="stats__right" aria-hidden="true">
        <img 
          src={imageUrl('Insights2.png')}
          alt="JHS Insights"
          className={`stats__image ${imageLoaded ? 'stats__image--loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="stats__image-overlay" />
      </div>

    </section>
  );
}