import Link from "next/link";
import {
  FaBrain,
  FaChartColumn,
  FaCloud,
  FaCode,
  FaLaptopCode,
  FaMobileScreenButton,
  FaPalette,
  FaPeopleGroup,
  FaServer,
} from "react-icons/fa6";

import { serviceCards } from "@/data/services";

const iconMap = {
  code: FaCode,
  laptop: FaLaptopCode,
  mobile: FaMobileScreenButton,
  cloud: FaCloud,
  ai: FaBrain,
  analytics: FaChartColumn,
  server: FaServer,
  palette: FaPalette,
  people: FaPeopleGroup,
};

type ServiceGridProps = {
  variant?: "home" | "page";
};

export function ServiceGrid({ variant = "home" }: ServiceGridProps) {
  const gridClass = variant === "page" ? "service-showcase__grid service-showcase__grid--rich" : "service-showcase__grid";

  return (
    <section id="service" className="service-showcase section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Our services</span>
          <h2 className="section-title">
            Services designed to strengthen how your business looks, works, and grows
          </h2>
          <p className="section-copy">
            Our services cover customer-facing experiences, internal systems, and specialist
            digital support so you can improve both presentation and performance without juggling
            multiple partners.
          </p>
        </div>

        <div className={gridClass}>
          {serviceCards.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] ?? FaCode;

            return (
              <article key={service.slug} className="service-card service-card--rich">
                <span className="service-card__icon">
                  <Icon />
                </span>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.summary}</p>

                {variant === "page" && (
                  <ul className="service-card__list">
                    {service.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                <div className="service-card__tags" aria-label={`${service.title} deliverables`}>
                  {service.tags.map((tag) => (
                    <span key={tag} className="service-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link className="service-card__read-more" href={`/${service.slug}`}>
                  View service page
                </Link>
              </article>
            );
          })}
        </div>

        {variant === "home" && (
          <div className="section-action">
            <Link href="/services" className="section-action__button">
              View full service details
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
