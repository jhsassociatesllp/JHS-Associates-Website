import { useState } from "react";
import "./Spotlight.css";

interface SpotlightButton {
  id: string;
  label: string;
}

const spotlightButtons: SpotlightButton[] = [
  { id: "ai-automation", label: "AI & AUTOMATION" },
  { id: "alumni", label: "ALUMNI" },
  { id: "solutions", label: "SOLUTIONS" },
];

export default function Spotlight() {
  const [activeButton, setActiveButton] = useState("ai-automation");

  const handleButtonClick = (id: string) => {
    setActiveButton(id);
  };

  return (
    <section className="spotlight">
      <div className="spotlight__container">
        <h2 className="spotlight__title">JHS SPOTLIGHT</h2>
        <div className="spotlight__buttons">
          {spotlightButtons.map((button) => (
            <button
              key={button.id}
              className={`spotlight__button ${activeButton === button.id ? "spotlight__button--active" : ""}`}
              onClick={() => handleButtonClick(button.id)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
