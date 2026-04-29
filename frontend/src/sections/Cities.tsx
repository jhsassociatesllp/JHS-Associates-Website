import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Cities.css";

const citiesList = [
  {
    name: "Mumbai",
    address: "Headquarters, Andheri",
    image: "src/image/Mumbai.jpg",
  },
  {
    name: "Delhi",
    address: "Connaught Place",
    image: "src/image/Dehli.avif",
  },
  {
    name: "Bengaluru",
    address: "UB City, Vittal Mallya Road",
    image: "src/image/Bengluru.avif"
  },
  {
    name: "Vadodara",
    address: "Kalyani Nagar",
    image: "src/image/Vadodara.jpg",
  },
  {
    name: "Ahmedabad",
    address: "SG Highway",
    image: "src/image/Ahmedabad.jpg",
  },
  {
    name: "Hyderabad",
    address: "HITEC City",
    image: "src/image/Hydrabad.jpg",
  },
  {
    name: "Kolkata",
    address: "Salt Lake City",
    image: "src/image/Kolkata.jpg",
  },
  {
    name: "Chennai",
    address: "T Nagar",
    image: "src/image/Chennai.jpg",
  },
];

export default function Cities() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".cities__header",
        { opacity: 0, y: 30 },
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

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cities__grid",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cities" ref={sectionRef}>
      <div className="cities__container">
        <div className="cities__header">
          <span className="cities__eyebrow">Our Presence</span>
          <h2 className="cities__headline">
            Connecting expertise <br /> across major cities
          </h2>
          <p className="cities__sub">
            We provide strategic financial and advisory services to our clients from multiple strategic locations.
          </p>
        </div>

        <div className="cities__grid">
          {citiesList.map((city, index) => (
            <div
              key={city.name}
              className="cities__card"
              ref={(el) => { cardsRef.current[index] = el; }}
            >
              <div
                className="cities__card-bg"
                style={{ backgroundImage: `url(${city.image})` }}
              />
              <div className="cities__card-overlay" />
              <div className="cities__card-content">
                <h3 className="cities__card-title">{city.name}</h3>
                <p className="cities__card-address">{city.address}</p>
                <Link to={`/city/${city.name.toLowerCase()}`} className="cities__card-btn">
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
