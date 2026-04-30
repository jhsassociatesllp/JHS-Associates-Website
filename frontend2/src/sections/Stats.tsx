import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Stats.css";

interface InsightItem {
  eyebrow: string;
  heading: string;
  description: string;
}

const insights: InsightItem[] = [
  {
    eyebrow: "FINANCIAL INTEGRITY · TRUST · PRECISION",
    heading: "The JHS Insights Index",
    description:
      "In a world of evolving regulations and economic uncertainty, the firms that thrive are those built on unshakeable financial discipline. JHS Associates brings decades of expertise — transforming complexity into clarity.",
  },
  {
    eyebrow: "TAX STRATEGY · COMPLIANCE · ADVISORY",
    heading: "Navigating India's New Tax Landscape",
    description:
      "From GST reforms to direct tax overhauls, staying compliant while optimising your tax position demands expert guidance. Our advisors keep you ahead of every regulatory shift.",
  },
  {
    eyebrow: "AUDIT · ASSURANCE · GOVERNANCE",
    heading: "Assurance That Goes Beyond Numbers",
    description:
      "Our audit practice doesn't just verify — it uncovers hidden risks and opportunities. Rigorous, independent, and forward-looking assurance for businesses that demand more.",
  },
];

export default function Stats() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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
            { number: "44+", label: "Years of Excellence" },
            { number: "1000+", label: "Clients Served" },
            { number: "13", label: "Offices" },
            { number: "700+", label: "Team Size" },
          ].map((s, i) => (
            <div className="stats__stat" key={i}>
              <span className="stats__stat-number">{s.number}</span>
              <span className="stats__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — image */}
      <div className="stats__right" aria-hidden="true">
        <div className="stats__image" />
        <div className="stats__image-overlay" />
      </div>

    </section>
  );
}