import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

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
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800",
    category: "AUTOMOTIVE INDUSTRY",
    meta: "SLIDESHOW • MARCH 26, 2026",
    title: "A Faster Path to Value from AI in the Commercial Vehicle Aftermarket",
    hoverTitle: "Automotive Industry 2026",
    hoverDescription:
      "Artificial intelligence is reshaping the commercial vehicle aftermarket. Companies that act now can capture significant value — those that wait risk being left behind.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800",
    category: "INFRASTRUCTURE",
    meta: "REPORT • APRIL 1, 2026",
    title: "Infrastructure Strategy for a New Era of Capital Markets",
    hoverTitle: "Infrastructure Strategy 2026",
    hoverDescription:
      "After two challenging years, investors can look forward to increased fundraising, stabilizing valuations, and fresh opportunities across energy and digital infrastructure.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
    category: "TECHNOLOGY",
    meta: "ARTICLE • APRIL 4, 2026",
    title: "Generative AI: From Experimentation to Enterprise-Wide Value",
    hoverTitle: "Generative AI at Scale",
    hoverDescription:
      "The most successful organizations are moving beyond pilots. Discover how leading enterprises are embedding GenAI into core operations to unlock transformative gains.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800",
    category: "SUSTAINABILITY",
    meta: "INSIGHT • MARCH 30, 2026",
    title: "The Green Transition: Turning Climate Risk into Competitive Advantage",
    hoverTitle: "Sustainability & Climate 2026",
    hoverDescription:
      "Companies that embed sustainability into their core strategy are outperforming peers. Learn how to navigate the energy transition and create lasting stakeholder value.",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800",
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