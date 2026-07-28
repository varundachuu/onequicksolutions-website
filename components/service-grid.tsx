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

const serviceCtaLabels: Record<string, string> = {
  "custom-software-development": "Explore Custom Software Development",
  "website-development": "Explore Website Development",
  "saas-development": "Explore SaaS Development",
  "mobile-app-development": "Explore Mobile App Development",
  "ai-solutions": "Explore AI Solutions",
  "data-analytics": "Explore Data Analytics",
  "cloud-solutions": "Explore Cloud Solutions",
  "ui-ux-design": "Explore UI/UX Design",
  "hr-consulting": "Explore HR Consulting",
};

const servicesPageGroups = [
  {
    id: "software-platform-development",
    title: "Software and platform development",
    description:
      "Services for businesses planning internal software, SaaS products, portals, dashboards and mobile workflows.",
  },
  {
    id: "digital-presence",
    title: "Digital presence",
    description:
      "Services for businesses improving websites, interface quality, content hierarchy and public-facing digital trust.",
  },
  {
    id: "automation-intelligence",
    title: "Automation and intelligence",
    description:
      "Services designed to improve reporting, AI-assisted workflows, knowledge access and business visibility.",
  },
  {
    id: "infrastructure-support",
    title: "Infrastructure and support",
    description:
      "Support for deployment, cloud environments, ongoing maintenance direction and integration planning.",
  },
  {
    id: "specialist-business-services",
    title: "Specialist business services",
    description:
      "Specialist support areas that sit alongside the main product and software services when the requirement needs them.",
  },
];

const supportCoverageCards = [
  {
    title: "Application maintenance",
    summary:
      "Support for improving, stabilizing and extending an existing website, portal or business application after launch.",
    bullets: ["Issue review and fixes", "Feature enhancement planning", "Ongoing improvement support"],
    href: "/cloud-solutions",
    cta: "Explore cloud and support",
  },
  {
    title: "Integration services",
    summary:
      "API and workflow integration support for businesses connecting forms, portals, dashboards and operational tools.",
    bullets: ["System-to-system connectivity", "Data flow planning", "Integration-aware workflow support"],
    href: "/custom-software-development",
    cta: "Explore software integration",
  },
  {
    title: "Digital learning",
    summary:
      "Training and education support through E-Shikshana and guided enablement for teams, learners and institutions.",
    bullets: ["Structured programmes", "Onboarding enablement", "Learning support direction"],
    href: "/programs",
    cta: "Explore programmes",
  },
];

export function ServiceGrid({ variant = "home" }: ServiceGridProps) {
  const primaryServices = serviceCards.filter((service) => service.homepageCategory === "primary");
  const supportingServices = serviceCards.filter((service) => service.homepageCategory === "supporting");

  if (variant === "home") {
    return (
      <>
        <section id="service" className="service-showcase section-shell">
          <div className="section-inner">
            <div className="section-intro">
              <span className="section-kicker">Our core services</span>
              <h2 className="section-title">Software, websites and platforms built around practical business needs</h2>
              <p className="section-copy">
                We provide practical technology services designed around business workflows, users
                and long-term operational needs.
              </p>
            </div>

            <div className="service-showcase__grid service-showcase__grid--rich">
              {primaryServices.map((service) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap] ?? FaCode;

                return (
                  <article key={service.slug} className="service-card service-card--rich">
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
                    <Link className="service-card__read-more" href={`/${service.slug}`}>
                      {serviceCtaLabels[service.slug] ?? "Explore service"}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="service-showcase service-showcase--soft section-shell">
          <div className="section-inner">
            <div className="section-intro">
              <span className="section-kicker">Supporting technology capabilities</span>
              <h2 className="section-title">Additional services that strengthen the main delivery</h2>
              <p className="section-copy">
                These services support mobile delivery, AI use cases, analytics, deployment and
                user experience without diluting the website&apos;s core focus.
              </p>
            </div>

            <div className="service-showcase__grid service-showcase__grid--compact">
              {supportingServices.map((service) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap] ?? FaCode;

                return (
                  <article key={service.slug} className="service-card service-card--rich">
                    <span className="service-card__icon">
                      <Icon />
                    </span>
                    <h3 className="service-card__title">{service.title}</h3>
                    <p className="service-card__description">{service.summary}</p>
                    <ul className="service-card__list">
                      {service.bullets.slice(0, 3).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <Link className="service-card__read-more" href={`/${service.slug}`}>
                      {serviceCtaLabels[service.slug] ?? "Explore service"}
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="section-action">
              <Link href="/services" className="section-action__button">
                View full service details
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <section id="service" className="service-showcase section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Services overview</span>
          <h2 className="section-title">
            A complete view of software, website, automation and specialist support coverage
          </h2>
          <p className="section-copy">
            OneQuickSolutions provides software development, SaaS platforms, websites, mobile
            applications, AI automation, data analytics, cloud solutions and UI/UX services. Our
            services are designed to help businesses replace manual processes, improve operational
            visibility, build digital products and create stronger online experiences.
          </p>
        </div>

        {servicesPageGroups.map((group) => {
          const cards = serviceCards.filter((service) => service.servicesGroup === group.id);
          const extraCards =
            group.id === "infrastructure-support"
              ? supportCoverageCards.slice(0, 2)
              : group.id === "specialist-business-services"
                ? supportCoverageCards.slice(2)
                : [];

          return (
            <div key={group.id} className="service-showcase__group">
              <div className="section-intro section-intro--left">
                <span className="section-kicker">{group.title}</span>
                <h3 className="section-title">{group.title}</h3>
                <p className="section-copy">{group.description}</p>
              </div>

              <div className="service-showcase__grid service-showcase__grid--rich">
                {cards.map((service) => {
                  const Icon = iconMap[service.icon as keyof typeof iconMap] ?? FaCode;

                  return (
                    <article key={service.slug} className="service-card service-card--rich">
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
                      <div className="service-card__tags" aria-label={`${service.title} deliverables`}>
                        {service.tags.map((tag) => (
                          <span key={tag} className="service-card__tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link className="service-card__read-more" href={`/${service.slug}`}>
                        View full service page
                      </Link>
                    </article>
                  );
                })}

                {extraCards.map((card) => (
                  <article key={card.title} className="service-card service-card--rich">
                    <span className="service-card__icon">
                      <FaCloud />
                    </span>
                    <h3 className="service-card__title">{card.title}</h3>
                    <p className="service-card__description">{card.summary}</p>
                    <ul className="service-card__list">
                      {card.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <Link className="service-card__read-more" href={card.href}>
                      {card.cta}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
