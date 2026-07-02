import React, { useEffect, useState } from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
    {
      image: "./images/Profile-Images/Ramya.jpg",
      name: "Ramya",
      title: "Chief Technology Officer",
      badge: "Technology",
    },
  ],
  specialists: [
    {
      image: "./images/Profile-Images/Kishore.jpg",
      name: "Kishore",
      title: "MIS Manager",
      badge: "Operations",
    },
    {
      image: "./images/Profile-Images/Soumik Mandal.jpeg",
      name: "Soumik Mandal",
      title: "Senior Developer",
      badge: "Engineering",
    },
    {
      image: "./images/Profile-Images/madhu.jpg",
      name: "Madhu Sudhan",
      title: "QA Manager",
      badge: "Quality",
    },
    {
      image: "./images/Profile-Images/prasad1.jpg",
      name: "Prasad",
      title: "Digital Marketing Executive",
      badge: "Marketing",
    },
    {
      image: "./images/Profile-Images/kavya.jpg",
      name: "Kavya",
      title: "Accountant Manager",
      badge: "Finance",
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

  const scrollEmployees = (direction) => {
    document
      .querySelector(".employees-scrollable")
      ?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

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
          <h2 className="section-title">The people shaping every delivery</h2>
          <p className="section-copy">
            Our leadership and specialists bring together product thinking,
            engineering, operations, and marketing so each engagement benefits
            from a wider business perspective.
          </p>
        </div>

        <div className="leaders-grid">
          {team.leaders.map((person) => renderCard(person, "team-card"))}
        </div>

        <div className="team-strip-header">
          <div>
            <span className="team-strip-kicker">Specialists</span>
            <h3 className="team-strip-title">Extended delivery team</h3>
          </div>
          <div className="scroll-buttons">
            <button
              type="button"
              className="scroll-button"
              onClick={() => scrollEmployees(-1)}
              aria-label="Scroll team cards left"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              className="scroll-button"
              onClick={() => scrollEmployees(1)}
              aria-label="Scroll team cards right"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="employees-scrollable">
          {team.specialists.map((person) => renderCard(person, "employee-card"))}
        </div>
      </div>
    </section>
  );
};

export default Founders;
