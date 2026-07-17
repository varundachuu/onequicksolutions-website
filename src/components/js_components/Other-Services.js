import React from "react";
import { FaBookOpen, FaBrain } from "react-icons/fa";
import "../css-files/services.css";

const programmes = [
  {
    title: "E-Shikshana",
    description:
      "A digital learning programme shaped to make upskilling simpler and more engaging.",
    icon: FaBookOpen,
  },
  {
    title: "Foundational courses",
    description:
      "Structured programmes for beginners building strong technical and analytical fundamentals.",
    icon: FaBrain,
  },
];

const OtherServices = () => {
  return (
    <section
      id="other-services"
      className="service-showcase service-showcase--soft section-shell"
    >
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Programmes</span>
          <h2 className="section-title">Learning and enablement that support growth</h2>
          <p className="section-copy">
            Beyond project delivery, we also build programmes that help teams
            learn faster, adopt new systems more smoothly, and strengthen their
            capabilities over time.
          </p>
        </div>

        <div className="service-showcase__grid service-showcase__grid--compact service-showcase__grid--pair">
          {programmes.map((service) => {
            const Icon = service.icon;

            return (
              <article key={service.title} className="service-card">
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
};

export default OtherServices;
