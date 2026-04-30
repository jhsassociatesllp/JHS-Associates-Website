import { useNavigate } from "react-router-dom";
import "./Spotlight.css";

interface SpotlightButton {
  id: string;
  label: string;
  path: string;
}

const spotlightButtons: SpotlightButton[] = [
  { id: "ai-automation", label: "AI & AUTOMATION", path: "/ai-automation" },
  { id: "alumni", label: "ALUMNI", path: "/alumni" },
  { id: "solutions", label: "SOLUTIONS", path: "/solutions" },
];

export default function Spotlight() {
  const navigate = useNavigate();

  return (
    <section className="spotlight">
      <div className="spotlight__container">
        <h2 className="spotlight__title">JHS SPOTLIGHT</h2>
        <div className="spotlight__buttons">
          {spotlightButtons.map((button) => (
            <button
              key={button.id}
              className="spotlight__button"
              onClick={() => navigate(button.path)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
