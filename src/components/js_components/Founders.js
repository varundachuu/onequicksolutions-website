import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import "../css-files/Founders.css";

const team = {
  founders: [
    {
      image: "/images/Profile-Images/varun1.jpg",
      name: "Varun",
      title: "Founder and Managing Director",
      badge: "Founder",
      description:
        "Focused on business direction, delivery momentum, and helping clients turn ideas into structured digital outcomes.",
    },
    {
      image: "/images/Profile-Images/Yogesh4.jpg",
      name: "Yogesh",
      title: "Founder and Chief Executive Officer",
      badge: "Founder",
      description:
        "Brings execution focus, collaboration leadership, and a practical approach to growth-oriented digital delivery.",
    },
  ],
  partners: [
    {
      name: "Chirag",
      title: "Working Partner",
      badge: "Partner",
    },
    {
      name: "Gowtham",
      title: "Working Partner",
      badge: "Partner",
    },
    {
      name: "Santhosh",
      title: "Working Partner",
      badge: "Partner",
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
    section.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({
    top: Math.max(topPosition, 0),
    behavior: "smooth",
  });
};

function Founders() {
  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const renderCard = (person, className) => (
    <article key={person.name} className={className}>
      <div className="team-image-shell">
        {person.image ? (
          <img
            src={person.image}
            alt={`${person.name} from OneQuickSolutions`}
            className="team-image"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        ) : (
          <div className="team-image-placeholder" aria-label={`${person.name} photo placeholder`}>
            <span className="team-image-placeholder__initials">
              {getInitials(person.name)}
            </span>
            <span className="team-image-placeholder__label">Photo coming soon</span>
          </div>
        )}
      </div>
      <span className="team-badge">{person.badge}</span>
      <h3 className="team-name">{person.name}</h3>
      <p className="team-title">{person.title}</p>
      {person.description && <p className="team-description">{person.description}</p>}
      <button type="button" className="team-cta" onClick={scrollToContact}>
        Connect with our team
        <FaArrowRight />
      </button>
    </article>
  );

  return (
    <section className="founder-container section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Leadership and partners</span>
          <h2 className="section-title">The people guiding OneQuickSolutions forward</h2>
          <p className="section-copy">
            Our leadership combines business direction, execution focus, and
            collaborative delivery support so projects can move from concept to
            credible digital outcome with less friction.
          </p>
        </div>

        <div className="team-group">
          <div className="team-group-header">
            <span className="team-group-kicker">Leadership</span>
            <h3 className="team-group-title">Founders</h3>
          </div>

          <div className="leaders-grid">
            {team.founders.map((person) => renderCard(person, "team-card"))}
          </div>
        </div>

        <div className="team-group">
          <div className="team-group-header">
            <span className="team-group-kicker">Delivery support</span>
            <h3 className="team-group-title">Working Partners</h3>
          </div>

          <div className="partners-grid">
            {team.partners.map((person) => renderCard(person, "employee-card"))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Founders;
