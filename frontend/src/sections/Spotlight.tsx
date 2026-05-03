import { useNavigate } from "react-router-dom";
import "./Spotlight.css";

interface SpotlightItem {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: JSX.Element;
}

const spotlightItems: SpotlightItem[] = [
  {
    id: "ai-automation",
    label: "AI & Automation",
    description: "Cognitive workflows designed to handle trillion-dollar decision matrices with unparalleled accuracy.",
    path: "/ai-automation",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <rect x="9" y="9" width="6" height="6"></rect>
        <line x1="9" y1="1" x2="9" y2="4"></line>
        <line x1="15" y1="1" x2="15" y2="4"></line>
        <line x1="9" y1="20" x2="9" y2="23"></line>
        <line x1="15" y1="20" x2="15" y2="23"></line>
        <line x1="20" y1="9" x2="23" y2="9"></line>
        <line x1="20" y1="14" x2="23" y2="14"></line>
        <line x1="1" y1="9" x2="4" y2="9"></line>
        <line x1="1" y1="14" x2="4" y2="14"></line>
      </svg>
    ),
  },
  {
    id: "alumni",
    label: "Alumni Network",
    description: "Access a restricted network of global leaders shaping the future of industrial ecosystems.",
    path: "/alumni",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
      </svg>
    ),
  },
  {
    id: "solutions",
    label: "Strategic Solutions",
    description: "Tailored strategies designed for sustainable corporate success and market dominance.",
    path: "/solutions",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
      </svg>
    ),
  },
];

export default function Spotlight() {
  const navigate = useNavigate();

  return (
    <section className="spotlight">
      <div className="spotlight__container">

        {/* Left Column: Heading & CTA */}
        <div className="spotlight__left">
          <span className="spotlight__eyebrow">SPOTLIGHT</span>
          <h2 className="spotlight__title">Redefining high-stakes excellence.</h2>
          <p className="spotlight__desc">
            Our core expertise lies at the intersection of technological innovation and executive strategy.
          </p>
          <button
            className="spotlight__cta"
            onClick={() => navigate('/solutions')}
          >
            EXPLORE EXPERTISE
          </button>
        </div>

        {/* Right Column: List of items */}
        <div className="spotlight__right">
          {spotlightItems.map((item, index) => (
            <div key={item.id} className="spotlight__item-wrapper">
              <div 
                className="spotlight__item"
                onClick={() => navigate(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(item.path);
                  }
                }}
              >
                <div className="spotlight__item-header">
                  <div className="spotlight__icon">
                    {item.icon}
                  </div>
                  <h3 className="spotlight__item-title">{item.label}</h3>
                </div>
                <p className="spotlight__item-desc">{item.description}</p>
              </div>
              {/* Divider (except for the last item) */}
              {index < spotlightItems.length - 1 && (
                <div className="spotlight__divider"></div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
