import React from "react";
import {
  FaBullhorn,
  FaChartLine,
  FaCloud,
  FaCubes,
  FaDatabase,
  FaLaptopCode,
  FaMobileAlt,
} from "react-icons/fa";
import "../css-files/services.css";

const services = [
  {
    title: "Web application development",
    description:
      "Responsive, high-trust websites and web applications built around real business goals.",
    icon: FaLaptopCode,
  },
  {
    title: "Software products and customization",
    description:
      "Custom SaaS and tailored product improvements that reduce complexity for your team.",
    icon: FaCloud,
  },
  {
    title: "Reporting and analytics",
    description:
      "Clear dashboards and reporting systems that turn data into practical direction.",
    icon: FaChartLine,
  },
  {
    title: "Digital marketing support",
    description:
      "Lead generation, messaging, and performance-oriented campaigns that feel more intentional.",
    icon: FaBullhorn,
  },
  {
    title: "Mobile app delivery",
    description:
      "Cross-platform mobile experiences for customers, teams, and internal operations.",
    icon: FaMobileAlt,
  },
  {
    title: "Data aggregation services",
    description:
      "Structured collection pipelines that make business data cleaner and easier to use.",
    icon: FaDatabase,
  },
  {
    title: "BIM, LiDAR, GIS photogrammetry",
    description:
      "Specialized digital workflows for organizations working with spatial and technical datasets.",
    icon: FaCubes,
  },
];

const Services = () => {
  return (
    <section id="service" className="service-showcase section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Our services</span>
          <h2 className="section-title">Services designed to move work forward</h2>
          <p className="section-copy">
            From development and analytics to delivery support, we create
            tailored digital solutions that help teams operate with more
            confidence and less friction.
          </p>
        </div>

        <div className="service-showcase__grid">
          {services.map((service) => {
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

export default Services;
