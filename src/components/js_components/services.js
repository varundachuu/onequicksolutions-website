import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBrain,
  FaChartColumn,
  FaCloud,
  FaCode,
  FaLaptopCode,
  FaMapLocationDot,
  FaMobileScreenButton,
  FaPalette,
  FaPeopleGroup,
  FaServer,
} from "react-icons/fa6";
import { MdOutlineSchool } from "react-icons/md";
import { serviceItems } from "../../content/siteContent";
import "../css-files/services.css";

const iconMap = {
  code: FaCode,
  laptop: FaLaptopCode,
  mobile: FaMobileScreenButton,
  cloud: FaCloud,
  ai: FaBrain,
  analytics: FaChartColumn,
  server: FaServer,
  palette: FaPalette,
  map: FaMapLocationDot,
  people: FaPeopleGroup,
  education: MdOutlineSchool,
};

function Services({ variant = "home" }) {
  const navigate = useNavigate();

  return (
    <section id="service" className="service-showcase section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Our services</span>
          <h2 className="section-title">Services designed to strengthen how your business looks, works, and grows</h2>
          <p className="section-copy">
            Our services cover customer-facing experiences, internal systems,
            and specialist digital support so you can improve both presentation
            and performance without juggling multiple partners.
          </p>
        </div>

        <div className={`service-showcase__grid ${variant === "page" ? "service-showcase__grid--rich" : ""}`}>
          {serviceItems.map((service) => {
            const Icon = iconMap[service.icon] ?? FaCode;

            return (
              <article
                key={service.slug}
                id={variant === "page" ? service.slug : undefined}
                className="service-card service-card--rich"
              >
                <span className="service-card__icon">
                  <Icon />
                </span>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.summary}</p>

                <ul className="service-card__list">
                  {service.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="service-card__tags" aria-label={`${service.title} keywords`}>
                  {service.tags.map((tag) => (
                    <span key={tag} className="service-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {variant === "home" && (
          <div className="section-action">
            <button
              type="button"
              className="section-action__button"
              onClick={() => navigate("/services")}
            >
              View full service details
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;
