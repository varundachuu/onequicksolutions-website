import React from "react";
import "../css-files/About.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChartLine,
  faCheck,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

const capabilityPoints = [
  "Innovative IT solutions tailored to your business model",
  "Custom digital delivery with dependable communication",
  "Dedicated product, marketing, and engineering support",
  "A practical focus on measurable business impact",
];

const highlightCards = [
  {
    icon: faHandshake,
    title: "Collaborative delivery",
    description: "We work as a hands-on partner, not a distant vendor.",
  },
  {
    icon: faChartLine,
    title: "Built for growth",
    description: "Every engagement is shaped to scale with your next stage.",
  },
];

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
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

const AboutUs = () => {
  return (
    <section id="about" className="about-main-container section-shell">
      <div className="section-inner">
        <div className="section-intro section-intro--left about-intro">
          <span className="section-kicker">About us</span>
          <h2 className="section-title">
            A practical digital partner for ambitious businesses
          </h2>
          <p className="section-copy">
            OneQuickSolutions helps businesses modernize how they look, launch,
            and grow online. We combine software, web, analytics, and
            operations thinking to create solutions that are attractive,
            reliable, and genuinely useful.
          </p>
        </div>

        <div className="about-us surface-panel">
          <div className="about-us-left">
            <div className="about-image-shell">
              <img
                src="./images/About.jpg"
                alt="Team members collaborating around a laptop"
                className="about-image"
              />
            </div>
          </div>

          <div className="about-us-right">
            <h3 className="about-card-title">
              Built to connect strategy, execution, and long-term support
            </h3>
            <p className="about-body">
              Our specialty is delivering business-focused digital solutions
              that help teams operate with more clarity, speed, and confidence.
              From SaaS ideas to polished company websites and data-driven
              workflows, we shape each project around your actual goals instead
              of generic deliverables.
            </p>

            <div className="about-highlights">
              {highlightCards.map((item) => (
                <article key={item.title} className="about-highlight-card">
                  <span className="about-highlight-icon">
                    <FontAwesomeIcon icon={item.icon} />
                  </span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <ul className="features-list">
              {capabilityPoints.map((point) => (
                <li key={point}>
                  <span className="icon-check">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="about-actions">
              <button
                className="book-tour"
                onClick={() => scrollToSection("contact")}
                type="button"
              >
                Get in Touch
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <p className="about-note">
                Tell us what you are building, and we will help shape the right
                next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
