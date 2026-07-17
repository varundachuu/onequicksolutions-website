import React from "react";
import { FaBookOpen, FaChalkboardUser, FaGraduationCap } from "react-icons/fa6";
import "../css-files/services.css";

const programmes = [
  {
    title: "E-Shikshana",
    description:
      "A digital training and education initiative designed to make upskilling more structured, practical, and accessible.",
    icon: FaGraduationCap,
  },
  {
    title: "Training enablement",
    description:
      "Programme support for institutions and teams that need guided digital learning, onboarding, or capability development.",
    icon: FaChalkboardUser,
  },
  {
    title: "Foundational learning support",
    description:
      "Learner-friendly content and programme structure for people building stronger technical and analytical fundamentals.",
    icon: FaBookOpen,
  },
];

function OtherServices() {
  return (
    <section
      id="other-services"
      className="service-showcase service-showcase--soft section-shell"
    >
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Training and education</span>
          <h2 className="section-title">Programmes that strengthen capability after the build</h2>
          <p className="section-copy">
            OneQuickSolutions also supports learning and enablement through
            E-Shikshana and training-focused programmes that help teams and
            learners adopt new systems with more confidence.
          </p>
        </div>

        <div className="service-showcase__grid service-showcase__grid--compact">
          {programmes.map((service) => {
            const Icon = service.icon;

            return (
              <article key={service.title} className="service-card service-card--rich">
                <span className="service-card__icon">
                  <Icon />
                </span>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OtherServices;
