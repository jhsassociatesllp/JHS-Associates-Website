import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Insights.css";

export default function Insights() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightTopRef = useRef<HTMLDivElement>(null);
  const rightBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate the left card (Blogs)
      gsap.fromTo(
        leftCardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate the right cards staggered
      gsap.fromTo(
        [rightTopRef.current, rightBottomRef.current],
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="insights" ref={sectionRef}>
      <div className="insights__container">

        {/* LEFT COLUMN - BLOGS */}
        <div className="insights__card insights__card--blogs" ref={leftCardRef}>
          <div className="insights__card-bg-blogs"></div>
          <div className="insights__card-overlay-blogs"></div>

          <div className="insights__card-content">
            <span className="insights__eyebrow">FEATURED BLOGS</span>
            <h2 className="insights__title insights__title--light">
              Navigating Modern Tax Compliance &amp; Strategic Advisory
            </h2>
            <a href="#" className="insights__btn insights__btn--accent">
              READ NOW
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="insights__right-col">

          {/* TOP RIGHT - PODCAST */}
          <div className="insights__card insights__card--podcast" ref={rightTopRef}>
            <div className="insights__card-content">
              <span className="insights__eyebrow insights__eyebrow--dark">EXPERT PODCASTS</span>
              <h2 className="insights__title insights__title--dark">
                How Industry Leaders are Adapting
              </h2>
              <a href="#" className="insights__btn insights__btn--accent">
                EXPLORE THE SERIES
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
            {/* Optional icon or visual on the right side of this card */}
            <div className="insights__podcast-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
                <line x1="8" y1="22" x2="16" y2="22"></line>
              </svg>
            </div>
          </div>

          {/* BOTTOM RIGHT - EXCELLANCIA */}
          <div className="insights__card insights__card--excellancia" ref={rightBottomRef}>
            {/* Geometric background pattern */}
            <svg className="insights__excellancia-bg" viewBox="0 0 400 300" preserveAspectRatio="none">
              <path d="M-50 300 L200 0 L450 300" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
              <path d="M150 350 L300 100 L450 350" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
            </svg>

            <div className="insights__card-content">
              <span className="insights__eyebrow insights__eyebrow--light">BUILT FOR EXCELLENCE</span>
              <h2 className="insights__title insights__title--light">
                JHS Excellancia Library
              </h2>
              <a href="#" className="insights__btn insights__btn--accent">
                FIND YOUR SOLUTION
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
