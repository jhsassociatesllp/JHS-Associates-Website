import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import { imageUrl } from '../utils/imageUrl'
import LanguageSwitcher from '../components/LanguageSwitcher'

interface Card {
  id: number;
  image: string;
  category: string;
  meta: string;
  title: string;
  hoverTitle: string;
  hoverDescription: string;
  route: string;
}

/* ─── API base — same convention used by the Excellencia/Regulatory/
   White Papers listing pages ────────────────────────────────────── */
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

interface ExcellenciaEntry {
  heading: string;
  short_description: string;
  image_id?: string;
  button_url?: string;
  created_at?: string;
}
interface RegulatoryEntry {
  title: string;
  short_description: string;
  image_id?: string;
  created_at?: string;
}
interface WhitePaperEntry {
  title: string;
  short_description: string;
  image_id?: string;
  created_at?: string;
}

const yearOf = (iso?: string) => (iso ? new Date(iso).getFullYear() : new Date().getFullYear());

// These three IDs are the ones swapped out for the latest admin-uploaded
// content; the "STRATEGIC LEADERSHIP BRIEFING" card (id 1) has no matching
// admin-managed category, so it stays static.
const EXCELLENCIA_CARD_ID = 3;
const REGULATORY_CARD_ID = 2;
const WHITEPAPER_CARD_ID = 7;

const mapExcellenciaEntry = (entry: ExcellenciaEntry): Card => ({
  id: EXCELLENCIA_CARD_ID,
  image: entry.image_id ? `${API_BASE}/excellencia/image/${entry.image_id}` : imageUrl('Card3.jpeg'),
  category: "EXCELLENCIA",
  meta: `JHS EXCELLENCIA · KNOWLEDGE LIBRARY · ${yearOf(entry.created_at)}`,
  title: entry.heading,
  hoverTitle: entry.heading,
  hoverDescription: entry.short_description,
  route: entry.button_url || "/excellencia",
});

const mapRegulatoryEntry = (entry: RegulatoryEntry): Card => ({
  id: REGULATORY_CARD_ID,
  image: entry.image_id ? `${API_BASE}/regulatory/image/${entry.image_id}` : imageUrl('Card1.jpeg'),
  category: "REGULATORY",
  meta: `JHS REGULATORY · COMPLIANCE UPDATE · ${yearOf(entry.created_at)}`,
  title: entry.title,
  hoverTitle: entry.title,
  hoverDescription: entry.short_description,
  route: "/regulatory",
});

const mapWhitePaperEntry = (entry: WhitePaperEntry): Card => ({
  id: WHITEPAPER_CARD_ID,
  image: entry.image_id ? `${API_BASE}/whitepapers/image/${entry.image_id}` : imageUrl('Fainance-report.png'),
  category: "WHITE PAPER",
  meta: `JHS WHITE PAPERS · THOUGHT LEADERSHIP · ${yearOf(entry.created_at)}`,
  title: entry.title,
  hoverTitle: entry.title,
  hoverDescription: entry.short_description,
  route: "/white-papers",
});

// Fallback content shown until the latest entries load (or if the API is
// unreachable) so the carousel never renders empty.
const DEFAULT_CARDS: Card[] = [
  {
    id: 1,
    image: imageUrl('Strategic Leadership.jpg'),
    category: "STRATEGIC LEADERSHIP BRIEFING",
    meta: "STRATEGIC LEADERSHIP BRIEFING · DATA GOVERNANCE · 2026",
    title: "The Rule 6 Maze: A Perspective for CEOs and Chairpersons",
    hoverTitle: "The Rule 6 Maze: A Perspective for CEOs and Chairpersons",
    hoverDescription:
      "The Rule 6 MazeFor too long, data privacy was treated as an operational footnote—a line item in SOPs and compliance checklists, buried within legal and IT departments and reviewed by Boards only as a quarterly formality.That era is over.With the notification of the DPDP Act (2023) and the subsequent DPDP Rules (2025), compliance is no longer optional. Rule 6 now stands as the 'elephant in the boardroom,explicitly requiring Data Fiduciaries to implement reasonable security safeguards.' This mandate extends beyond internal operations to include any processing conducted by third-party Data Processors, making the Fiduciary legally accountable for preventing breaches across the entire data lifecycle.",
    route: "/resources/data-governance-rule-6",
  },
  {
    id: REGULATORY_CARD_ID,
    image: imageUrl('Card1.jpeg'),
    category: "REGULATORY",
    meta: "Maharashtra Introduces Digital Partnership Firm Registration",
    title: "Discover the latest amendments that modernize partnership firm registration in Maharashtra with a completely online process, making registration simpler, faster, and more accessible for entrepreneurs.",
    hoverTitle: "Maharashtra Introduces Digital Partnership Firm Registration.",
    hoverDescription:
      "Discover the latest amendments that modernize partnership firm registration in Maharashtra with a completely online process, making registration simpler, faster, and more accessible for entrepreneurs.",
    route: "/regulatory",
  },

  {
    id: EXCELLENCIA_CARD_ID,
    image: imageUrl('Card3.jpeg'),
    category: "EXCELLENCIA",
    meta: "JHS EXCELLENCIA · KNOWLEDGE LIBRARY · 2026",
    title: "JHS Excellencia Library Premium Research, Benchmarks & Strategic Frameworks",
    hoverTitle: "JHS Excellencia Library",
    hoverDescription:
      "Our proprietary knowledge base of premium research, industry benchmarks, and strategic frameworks. Access curated whitepapers, regulatory updates, and strategic guides developed by JHS experts to empower informed decision-making.",
    route: "/excellencia",
  },
  {
    id: WHITEPAPER_CARD_ID,
    image: imageUrl('Fainance-report.png'),
    category: "WHITE PAPER",
    meta: "JHS WHITE PAPERS · THOUGHT LEADERSHIP · 2026",
    title: "EU Upholds Google's €4.1 Billion Android Fine",
    hoverTitle: "Read JHS Knowledge Desk's research paper analysing the CJEU's €4.1 billion Android antitrust ruling, its impact on global digital competition law, and the implications for India's competition and technology landscape.",
    hoverDescription:
      "Read JHS Knowledge Desk's research paper analysing the CJEU's €4.1 billion Android antitrust ruling, its impact on global digital competition law, and the implications for India's competition and technology landscape.",
    route: "/white-papers",
  },
];

// Transition duration must match CSS --carousel-transition-duration (700ms)
const TRANSITION_MS = 700;
const AUTO_SLIDE_MS = 3500;

export default function Hero() {
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);
  const navigate = useNavigate();

  // Touch Swipe Refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalCards = cards.length;

  // Pull the latest Excellencia / Regulatory / White Paper entries from the
  // admin-managed database and swap them into the matching carousel cards.
  // Each endpoint already returns newest-first, so entry [0] is "latest".
  // On any failure the DEFAULT_CARDS fallback set just stays in place.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [excellencia, regulatory, whitepapers] = await Promise.all([
        fetch(`${API_BASE}/excellencia/`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${API_BASE}/regulatory/`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch(`${API_BASE}/whitepapers/`).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);

      if (cancelled) return;

      setCards((prev) =>
        prev.map((card) => {
          if (card.id === EXCELLENCIA_CARD_ID && Array.isArray(excellencia) && excellencia.length > 0) {
            return mapExcellenciaEntry(excellencia[0]);
          }
          if (card.id === REGULATORY_CARD_ID && Array.isArray(regulatory) && regulatory.length > 0) {
            return mapRegulatoryEntry(regulatory[0]);
          }
          if (card.id === WHITEPAPER_CARD_ID && Array.isArray(whitepapers) && whitepapers.length > 0) {
            return mapWhitePaperEntry(whitepapers[0]);
          }
          return card;
        })
      );
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalCards);
    setTimeout(() => setIsAnimating(false), TRANSITION_MS);
  }, [isAnimating, totalCards]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
    setTimeout(() => setIsAnimating(false), TRANSITION_MS);
  }, [isAnimating, totalCards]);

  // Use a ref to always have the latest nextSlide without recreating the interval
  const nextSlideRef = useRef(nextSlide);
  useEffect(() => {
    nextSlideRef.current = nextSlide;
  }, [nextSlide]);

  // Single stable auto-slide interval — does not restart on index change
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        nextSlideRef.current();
      }
    }, AUTO_SLIDE_MS);
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, []);

  const pauseAutoSlide = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resumeAutoSlide = useCallback(() => {
    isPausedRef.current = false;
  }, []);

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
    const isSide = position === "prev" || position === "next";
    const showContent = isCenter || isSide;

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

        {/* Gradient overlay for text readability on side cards */}
        {isSide && <div className="hero__carousel-card-side-overlay" />}

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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.route);
                }}
                className="hero__carousel-card-cta"
              >
                LEARN MORE
                <span className="hero__carousel-card-cta-arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Badge & Content - Visible on center, prev, and next cards */}
        {showContent && (
          <>
            {/* <div className={`hero__carousel-card-badge ${isHovered && isCenter ? "hero__carousel-card-badge--hidden" : ""}`}>
              {card.category}
            </div> */}
            <div className={`hero__carousel-card-content ${isSide ? "hero__carousel-card-content--side" : ""} ${isHovered && isCenter ? "hero__carousel-card-content--hidden" : ""}`}>
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

      {/* Top-right action buttons */}
      <div className="hero__actions">
        <button
          className="hero__action-btn hero__action-btn--outline"
          onClick={() => navigate("/approval-for-proposal")}
        >
          Request for Proposal
        </button>
        <button
          className="hero__action-btn hero__action-btn--solid"
          onClick={() => navigate("/about/careers")}
        >
          Apply Now
        </button>
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <div className="hero__header">
        <span className="hero__eyebrow">WELCOME TO JHS</span>
        <h1 className="hero__headline">
          Building Trust
          <br />
          Delivering Excellence
          <br />
          Shaping Better Futures
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