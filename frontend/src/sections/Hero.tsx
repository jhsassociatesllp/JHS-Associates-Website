import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import card1 from '../image/card1.jpeg'
import card2 from '../image/card2.jpeg'
import card3 from '../image/card3.jpeg'
import card4 from '../image/card4.jpeg'
import card5 from '../image/card5.jpeg'


interface Card {
  id: number;
  image: string;
  category: string;
  meta: string;
  title: string;
  hoverTitle: string;
  hoverDescription: string;
}

const cards: Card[] = [
  {
    id: 1,
    image: card1,
    category: "ARTICLES",
    meta: "SLIDESHOW • December 20, 2026",
    title: "BOARDROOMS IN TRANSITION: HOW INDIA’S GRC FRAMEWORK IS REDEFINING CORPORATE GOVERNANCE",
    hoverTitle: "Automotive Industry 2026",
    hoverDescription:
      "India’s corporate governance ecosystem has witnessed a decisive shift over the past decade. Landmark regulatory reforms led by SEBI, RBI, and IRDAI have elevated boardroom expectations and redefined the role of Governance, Risk, and Compliance (GRC). No longer limited to defensive oversight, GRC has become a strategic pillar enabling better board performance, organizational resilience, and sustainable long-term value creation.",
  },
  {
    id: 2,
    image: card2,
    category: "RESOURCES",
    meta: "Resources • April 27, 2026",
    title: "The Rule 6 Maze: A Boardroom Perspective on Data Governance in India",
    hoverTitle: "Infrastructure Strategy 2026",
    hoverDescription:
      "This strategic briefing examines the evolving role of data governance under the Digital Personal Data Protection (DPDP) framework, with a focused lens on Rule 6 and its implications for CEOs, Boards, and senior leadership. It highlights the shift from treating data privacy as a compliance function to positioning it as a critical element of governance, accountability, and institutional trust.",
  },
  {
    id: 3,
    image: card3,
    category: "TECHNOLOGY",
    meta: "Thought Leadership • January 22, 2025",
    title: "Investment Opportunities: A Strategic Roadmap for India”",
    hoverTitle: "Generative AI at Scale",
    hoverDescription:
      "India, with its dynamic economy, presents numerous investment opportunities across sectors. From emerging technologies like Artificial Intelligence and renewable energy to traditional industries such as manufacturing and infrastructure, the nation offers diverse avenues for growth.",
  },
  {
    id: 4,
    image: card4,
    category: "SUSTAINABILITY",
    meta: "INSIGHT • MARCH 30, 2026",
    title: "The Green Transition: Turning Climate Risk into Competitive Advantage",
    hoverTitle: "Sustainability & Climate 2026",
    hoverDescription:
      "Companies that embed sustainability into their core strategy are outperforming peers. Learn how to navigate the energy transition and create lasting stakeholder value.",
  },
  {
    id: 5,
    image: card5,
    category: "DIGITAL",
    meta: "ARTICLE • APRIL 5, 2026",
    title: "Digital Twins: The Future of Industrial Operations",
    hoverTitle: "Digital Transformation 2026",
    hoverDescription:
      "Digital twins are revolutionizing how companies design, operate, and maintain complex systems. Early adopters are seeing 30% efficiency gains.",
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Touch Swipe Refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalCards = cards.length;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalCards);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
    setTimeout(() => setIsAnimating(false), 400);
  };

  useEffect(() => {
    autoSlideRef.current = setInterval(nextSlide, 3000);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [currentIndex]);

  const pauseAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  };

  const resumeAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    autoSlideRef.current = setInterval(nextSlide, 3000);
  };

  // --- SWIPE HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    pauseAutoSlide();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      resumeAutoSlide();
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    resumeAutoSlide();
  };

  const getVisibleCards = () => {
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
    const nextIndex = (currentIndex + 1) % totalCards;
    const prev2Index = (currentIndex - 2 + totalCards) % totalCards;
    const next2Index = (currentIndex + 2) % totalCards;

    return {
      prev2: cards[prev2Index],
      prev: cards[prevIndex],
      current: cards[currentIndex],
      next: cards[nextIndex],
      next2: cards[next2Index],
    };
  };

  const visible = getVisibleCards();

  const renderCard = (card: Card, position: string) => {
    if (!card) return null;
    const isHovered = hoveredCard === card.id;
    const isCenter = position === "current";

    return (
      <article
        key={card.id}
        className={`hero__carousel-card hero__carousel-card--${position} ${isHovered && isCenter ? "hero__carousel-card--hovered" : ""
          }`}
        onClick={() => {
          if (position === "prev") prevSlide();
          else if (position === "next") nextSlide();
        }}
        onMouseEnter={() => {
          if (isCenter) {
            pauseAutoSlide();
            setHoveredCard(card.id);
          }
        }}
        onMouseLeave={() => {
          if (isCenter) {
            resumeAutoSlide();
            setHoveredCard(null);
          }
        }}
        tabIndex={isCenter ? 0 : -1}
      >
        {/* Background Image - Full Cover */}
        <div
          className="hero__carousel-card-bg"
          style={{ backgroundImage: `url(${card.image})` }}
        />

        {/* Dark Gradient Overlay - Only for center card */}
        {isCenter && <div className="hero__carousel-card-overlay" />}

        {/* White Clean Overlay on Hover - Like BCG style */}
        {isCenter && (
          <div className="hero__carousel-card-hover-overlay">
            <div className="hero__carousel-card-hover-content">
              <span className="hero__carousel-card-hover-category">
                {card.category}
              </span>
              <h3 className="hero__carousel-card-hover-title">{card.hoverTitle}</h3>
              <p className="hero__carousel-card-hover-desc">{card.hoverDescription}</p>
              <a href="#" className="hero__carousel-card-cta">
                LEARN MORE
                <span className="hero__carousel-card-cta-arrow">→</span>
              </a>
            </div>
          </div>
        )}

        {/* Content - Only visible on center card */}
        {isCenter && (
          <>
            <div className={`hero__carousel-card-badge ${isHovered ? "hero__carousel-card-badge--hidden" : ""}`}>
              {card.category}
            </div>
            <div className={`hero__carousel-card-content ${isHovered ? "hero__carousel-card-content--hidden" : ""}`}>
              <p className="hero__carousel-card-meta">{card.meta}</p>
              <h3 className="hero__carousel-card-title">{card.title}</h3>
            </div>
          </>
        )}
      </article>
    );
  };

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />

      {/* Header */}
      <div className="hero__header">
        <span className="hero__eyebrow">WELCOME TO JHS</span>
        <h1 className="hero__headline">
          Building Trust.
          <br />
          Delivering Excellence
          <br />
          Shaping Better Futures.
        </h1>
        {/* <span className="hero__badge">RESPONSIBLE AI</span> */}
      </div>

      {/* Carousel */}
      <div className="hero__carousel">
        <div
          className="hero__carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="hero__carousel-track">
            {renderCard(visible.prev2, "prev2")}
            {renderCard(visible.prev, "prev")}
            {renderCard(visible.current, "current")}
            {renderCard(visible.next, "next")}
            {renderCard(visible.next2, "next2")}
          </div>
        </div>



        <div className="hero__carousel-dots">
          {cards.map((_, idx) => (
            <button
              key={idx}
              className={`hero__carousel-dot ${idx === currentIndex ? "hero__carousel-dot--active" : ""
                }`}
              onClick={() => {
                pauseAutoSlide();
                setCurrentIndex(idx);
                setTimeout(resumeAutoSlide, 3000);
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="hero__spotlight-controls">
          {/* <button className="hero__spotlight-pause" aria-label="Pause">
            <span />
            <span />
          </button> */}
          <button className="hero__spotlight-arrow" onClick={prevSlide} aria-label="Previous">‹</button>
          <button className="hero__spotlight-arrow" onClick={nextSlide} aria-label="Next">›</button>
        </div>
      </div>
      {/* ── Spotlight Tab Section ── */}
      {/* <div className="hero__spotlight">
        <div className="hero__spotlight-title">JHS SPOTLIGHT</div>
        <nav className="hero__spotlight-tabs">
          {["AI & Automation", "Alumni", "Solutions"].map((tab) => (
            <button
              key={tab}
              className="hero__spotlight-tab"
              onClick={() => {
                if (tab === "AI & Automation") navigate("/ai-automation");
                else if (tab === "Alumni") navigate("/alumni");
                else if (tab === "Solutions") navigate("/solutions");
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div> */}
    </section>

  );
}