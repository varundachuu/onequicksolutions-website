import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import "../css-files/Founders.css";

const team = {
  leaders: [
    {
      image: "./images/Profile-Images/varun1.jpg",
      name: "Varun",
      title: "Managing Director",
      badge: "Leadership",
    },
    {
      image: "./images/Profile-Images/Yogesh4.jpg",
      name: "Yogesh",
      title: "Chief Executive Officer",
      badge: "Strategy",
    },
  ],
};

const scrollToContact = () => {
  const section = document.getElementById("contact");
  const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;

  if (!section) {
    return;
  }

  const topPosition =
    section.getBoundingClientRect().top + window.scrollY - headerHeight - 14;

  window.scrollTo({
    top: Math.max(topPosition, 0),
    behavior: "smooth",
  });
};

const Founders = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => setIsVisible(true), 180);
    return () => window.clearTimeout(timerId);
  }, []);

  const renderCard = (person, className) => (
    <article key={person.name} className={className}>
      <div className="team-image-shell">
        <img src={person.image} alt={person.name} className="team-image" />
      </div>
      <span className="team-badge">{person.badge}</span>
      <h3 className="team-name">{person.name}</h3>
      <p className="team-title">{person.title}</p>
      <button type="button" className="team-cta" onClick={scrollToContact}>
        Connect with our team
        <FaArrowRight />
      </button>
    </article>
  );

  return (
    <section className={`founder-container section-shell ${isVisible ? "visible" : ""}`}>
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Our team</span>
          <h2 className="section-title">The people leading OneQuickSolutions</h2>
          <p className="section-copy">
            Varun and Yogesh lead our work with a practical mix of business
            direction, execution focus, and long-term growth thinking.
          </p>
        </div>

        <div className="leaders-grid">
          {team.leaders.map((person) => renderCard(person, "team-card"))}
        </div>
      </div>
    </section>
  );
};

export default Founders;
