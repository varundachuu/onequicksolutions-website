import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaArrowTrendUp,
  FaBookOpen,
  FaBrain,
  FaBriefcase,
  FaBullseye,
  FaBuilding,
  FaChalkboardUser,
  FaCloud,
  FaCodeBranch,
  FaCompassDrafting,
  FaDatabase,
  FaDrawPolygon,
  FaGlobe,
  FaGraduationCap,
  FaLayerGroup,
  FaLightbulb,
  FaLifeRing,
  FaMap,
  FaPeopleCarryBox,
  FaPeopleGroup,
  FaRocket,
  FaShieldHeart,
  FaUserTie,
} from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";

import { generalFaqs } from "@/data/faqs";
import {
  aboutPillars,
  clientConfidenceItems,
  companyInfo,
  hiringEntryCards,
  industryGroups,
  portfolioStories,
  processSteps,
  productSpotlight,
  programs,
  teamGroups,
  technologyGroups,
  whyChooseUsReasons,
} from "@/data/site";

const whyChooseIconMap = {
  compass: FaCompassDrafting,
  layers: FaLayerGroup,
  people: FaPeopleGroup,
  growth: FaArrowTrendUp,
};

const technologyIconMap = {
  frontend: FaGlobe,
  backend: FaCodeBranch,
  mobile: FaLayerGroup,
  cloud: FaCloud,
  data: FaDatabase,
  ai: FaBrain,
  design: FaDrawPolygon,
  spatial: FaMap,
};

const industryIconMap = {
  Startups: FaRocket,
  SMEs: MdBusinessCenter,
  Enterprises: FaBuilding,
  "Educational Institutions": FaGraduationCap,
  "HR and recruitment teams": FaUserTie,
  "Infrastructure and geospatial teams": FaBriefcase,
};

const programmeIconMap = {
  graduation: FaGraduationCap,
  teacher: FaChalkboardUser,
  book: FaBookOpen,
};

const audienceIconMap = {
  "For companies": FaBuilding,
  "For candidates": FaUserTie,
};

const aboutIconMap = {
  Mission: FaBullseye,
  Vision: FaLightbulb,
  Expertise: FaPeopleCarryBox,
  Approach: FaShieldHeart,
};

const confidenceIconMap = {
  "Clear communication": FaUserTie,
  "Business-first thinking": FaLightbulb,
  "Longer-term support": FaLifeRing,
};

export function WhyChooseUsSection() {
  return (
    <section className="section-shell trust-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Why choose us</span>
          <h2 className="section-title">
            A digital partner for businesses that want better execution and better presentation
          </h2>
          <p className="section-copy">
            OneQuickSolutions combines modern design standards, dependable development, and
            process-aware thinking so your digital presence becomes easier to trust, easier to
            use, and easier to grow.
          </p>
        </div>

        <div className="trust-grid">
          {whyChooseUsReasons.map((reason) => {
            const Icon = whyChooseIconMap[reason.icon as keyof typeof whyChooseIconMap] ?? FaCompassDrafting;

            return (
              <article key={reason.title} className="trust-card surface-panel interactive-panel">
                <span className="trust-card__icon">
                  <Icon />
                </span>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function DevelopmentProcessSection() {
  return (
    <section id="process" className="section-shell process-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Our development process</span>
          <h2 className="section-title">
            A delivery approach built for clarity, quality, and better decisions
          </h2>
          <p className="section-copy">
            We use a structured process so projects stay aligned to business goals, user needs,
            technical quality, and long-term usefulness.
          </p>
        </div>

        <div className="process-grid">
          {processSteps.map((item) => (
            <article key={item.step} className="process-card surface-panel interactive-panel">
              <span className="process-card__step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechnologySection() {
  return (
    <section id="features" className="section-shell technology-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Technologies we use</span>
          <h2 className="section-title">
            Delivery capabilities that support modern, scalable digital products
          </h2>
          <p className="section-copy">
            We work across the design, engineering, data, cloud, and specialist workflow
            capabilities required to deliver reliable digital systems for different kinds of
            organizations.
          </p>
        </div>

        <div className="technology-grid">
          {technologyGroups.map((item) => {
            const Icon = technologyIconMap[item.icon as keyof typeof technologyIconMap] ?? FaCodeBranch;

            return (
              <article key={item.title} className="technology-card surface-panel interactive-panel">
                <span className="technology-card__icon">
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="technology-card__chips">
                  {item.chips.map((chip) => (
                    <span key={chip} className="technology-card__chip">
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function IndustriesSection() {
  return (
    <section id="industries" className="section-shell industries-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Industries we serve</span>
          <h2 className="section-title">
            Built for different growth stages and operational realities
          </h2>
          <p className="section-copy">
            Our work is adaptable by design, which means we can support different business types
            without forcing every client into the same digital model.
          </p>
        </div>

        <div className="industry-grid">
          {industryGroups.map((item) => {
            const Icon = industryIconMap[item.title as keyof typeof industryIconMap] ?? FaBuilding;

            return (
              <article key={item.title} className="industry-card surface-panel interactive-panel">
                <span className="industry-card__icon">
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PortfolioSection({ showCta = false }: { showCta?: boolean }) {
  return (
    <section id="portfolio" className="section-shell portfolio-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Portfolio and case-study direction</span>
          <h2 className="section-title">
            Representative solution blueprints that reflect how we think
          </h2>
          <p className="section-copy">
            We do not publish invented client stories. Instead, this section shows the kind of
            business challenges and solution structures we are equipped to support.
          </p>
        </div>

        <div className="portfolio-grid">
          {portfolioStories.map((story) => (
            <article key={story.title} className="portfolio-card surface-panel">
              <span className="portfolio-card__type">{story.type}</span>
              <h3>{story.title}</h3>
              <div className="portfolio-card__body">
                <div>
                  <strong>Challenge</strong>
                  <p>{story.challenge}</p>
                </div>
                <div>
                  <strong>Solution</strong>
                  <p>{story.solution}</p>
                </div>
                <div>
                  <strong>Outcome</strong>
                  <p>{story.outcome}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {showCta && (
          <div className="section-action">
            <Link href="/contact" className="section-action__button">
              Discuss a similar project
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function ProductSpotlightSection({ detailed = false }: { detailed?: boolean }) {
  if (!detailed) {
    return (
      <section id="products" className="section-shell product-spotlight-section">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Products</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-copy">
              Practical digital tools designed to make everyday business work easier.
            </p>
          </div>

          <article className="product-spotlight product-spotlight--compact surface-panel">
            <span className="product-spotlight__icon" aria-hidden="true">
              <FaBriefcase />
            </span>
            <div className="product-spotlight__compact-copy">
              <h3>{productSpotlight.title}</h3>
              <p>{productSpotlight.summary}</p>
              <Link className="product-spotlight__read-more" href="/products/hr-management-portal">
                Read more
                <FaArrowRight />
              </Link>
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="section-shell product-spotlight-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Products</span>
          <h2 className="section-title">{productSpotlight.title}</h2>
          <p className="section-copy">
            Beyond services, OneQuickSolutions is also building focused digital products. This HR
            management portal is designed to make hiring feel clearer, faster, and more organized
            for both businesses and candidates.
          </p>
        </div>

        <article className="product-portal-card surface-panel">
          <div className="product-portal-card__overview">
            <div className="product-spotlight__headline">
              <span className="product-spotlight__icon" aria-hidden="true">
                <FaBriefcase />
              </span>
              <div>
                <h3>{productSpotlight.title}</h3>
                <p className="product-portal-card__eyebrow">
                  Recruitment management made simpler
                </p>
              </div>
            </div>

            <p className="product-portal-card__description">{productSpotlight.description}</p>

            <ul className="product-portal-card__features">
              {productSpotlight.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="product-portal-card__access">
            <div>
              <span className="product-portal-card__label">Portal access</span>
              <h4>Choose how you want to continue</h4>
              <p>Open the right workspace for your hiring needs.</p>
            </div>

            <div className="product-entry-grid">
              {hiringEntryCards.map((card) => {
                const Icon = audienceIconMap[card.audience as keyof typeof audienceIconMap] ?? FaBriefcase;

                return (
                  <article key={card.audience} className="product-entry-card interactive-panel">
                    <span className="product-entry-card__audience">{card.audience}</span>
                    <span className="product-entry-card__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <a
                      className="product-entry-card__button"
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {card.buttonLabel}
                      <FaArrowRight />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </article>

        <article className="product-coming-soon surface-panel">
          <span className="product-coming-soon__icon" aria-hidden="true">
            <FaBriefcase />
          </span>
          <div>
            <span className="product-coming-soon__label">Coming soon</span>
            <h3>More practical business products are in planning</h3>
            <p>We are continuing to shape focused tools that make everyday work clearer.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function TrainingProgramsSection({ showFaqLink = false }: { showFaqLink?: boolean }) {
  return (
    <section id="programs" className="service-showcase service-showcase--soft section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Training and education</span>
          <h2 className="section-title">Programmes that strengthen capability after the build</h2>
          <p className="section-copy">
            OneQuickSolutions also supports learning and enablement through E-Shikshana and
            training-focused programmes that help teams and learners adopt new systems with more
            confidence.
          </p>
        </div>

        <div className="service-showcase__grid service-showcase__grid--compact">
          {programs.map((programme) => {
            const Icon = programmeIconMap[programme.icon as keyof typeof programmeIconMap] ?? FaBookOpen;

            return (
              <article key={programme.title} className="service-card service-card--rich">
                <span className="service-card__icon">
                  <Icon />
                </span>
                <h3 className="service-card__title">{programme.title}</h3>
                <p className="service-card__description">{programme.description}</p>
              </article>
            );
          })}
        </div>

        {showFaqLink && (
          <div className="section-action">
            <Link href="/programs" className="section-action__button">
              Explore programmes
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="about-main-container section-shell">
      <div className="section-inner">
        <div className="section-intro section-intro--left about-intro">
          <span className="section-kicker">About OneQuickSolutions</span>
          <h2 className="section-title">
            We build digital solutions that connect brand trust, technical clarity, and business
            usefulness
          </h2>
          <p className="section-copy">
            OneQuickSolutions is a software development company focused on helping organizations
            modernize how they operate, present themselves, and deliver value online.
          </p>
        </div>

        <div className="about-us surface-panel">
          <div className="about-us-left">
            <div className="about-image-shell">
              <Image
                src="/images/About.jpg.optimized.jpg"
                alt="OneQuickSolutions team collaboration and planning session"
                className="about-image"
                width={1200}
                height={900}
              />
            </div>
          </div>

          <div className="about-us-right">
            <h3 className="about-card-title">
              A practical partner for startups, SMEs, enterprises, and institutions
            </h3>
            <p className="about-body">
              Our strength is combining strategic thinking with hands-on execution. That means
              sharper websites, better workflows, clearer communication, and digital experiences
              that feel premium without losing sight of operational reality.
            </p>

            <div className="about-pillars">
              {aboutPillars.map((item) => {
                const Icon = aboutIconMap[item.title as keyof typeof aboutIconMap] ?? FaBullseye;

                return (
                  <article key={item.title} className="about-pillar-card">
                    <span className="about-pillar-card__icon">
                      <Icon />
                    </span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="about-metrics">
              <div className="about-metric">
                <strong>Business-aware delivery</strong>
                <span>Solutions shaped around goals, users, and process fit.</span>
              </div>
              <div className="about-metric">
                <strong>Cross-functional support</strong>
                <span>Design, development, analytics, cloud, HR, and training perspectives.</span>
              </div>
            </div>

            <div className="about-actions">
              <Link className="book-tour" href="/contact">
                Discuss your project
                <FaArrowRight />
              </Link>
              <p className="about-note">
                If you have an idea, redesign, system gap, or product goal, we can help you
                clarify the best next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FoundersSection() {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const renderCard = (person: (typeof teamGroups.founders)[number] | (typeof teamGroups.partners)[number], className: string) => (
    <article key={person.name} className={className}>
      <div className="team-image-shell">
        {person.image ? (
          <Image
            src={person.image}
            alt={`${person.name} from ${companyInfo.name}`}
            className="team-image"
            width={520}
            height={520}
          />
        ) : (
          <div className="team-image-placeholder" aria-label={`${person.name} photo placeholder`}>
            <span className="team-image-placeholder__initials">{getInitials(person.name)}</span>
            <span className="team-image-placeholder__label">Photo coming soon</span>
          </div>
        )}
      </div>
      <span className="team-badge">{person.badge}</span>
      <h3 className="team-name">{person.name}</h3>
      <p className="team-title">{person.title}</p>
      {"description" in person && person.description ? (
        <p className="team-description">{person.description}</p>
      ) : null}
      <Link href="/contact" className="team-cta">
        Connect with our team
        <FaArrowRight />
      </Link>
    </article>
  );

  return (
    <section className="founder-container section-shell">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Leadership and partners</span>
          <h2 className="section-title">The people guiding OneQuickSolutions forward</h2>
          <p className="section-copy">
            Our leadership combines business direction, execution focus, and collaborative delivery
            support so projects can move from concept to credible digital outcome with less
            friction.
          </p>
        </div>

        <div className="team-group">
          <div className="team-group-header">
            <span className="team-group-kicker">Leadership</span>
            <h3 className="team-group-title">Founders</h3>
          </div>
          <div className="leaders-grid">
            {teamGroups.founders.map((person) => renderCard(person, "team-card"))}
          </div>
        </div>

        <div className="team-group">
          <div className="team-group-header">
            <span className="team-group-kicker">Delivery support</span>
            <h3 className="team-group-title">Working Partners</h3>
          </div>
          <div className="partners-grid">
            {teamGroups.partners.map((person) => renderCard(person, "employee-card"))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClientConfidenceSection() {
  return (
    <section className="section-shell confidence-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Client confidence</span>
          <h2 className="section-title">
            Trust is built through how the work feels, not just how it looks
          </h2>
          <p className="section-copy">
            Because we do not fabricate testimonials, this section focuses on the delivery
            qualities serious buyers typically look for before they commit to a long-term digital
            partner.
          </p>
        </div>

        <div className="confidence-grid">
          {clientConfidenceItems.map((item) => {
            const Icon = confidenceIconMap[item.title as keyof typeof confidenceIconMap] ?? FaLightbulb;

            return (
              <article key={item.title} className="confidence-card surface-panel interactive-panel">
                <span className="confidence-card__icon">
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaBanner({
  title = "Tell us what you want to build next",
  description = "Share your project idea, redesign goal, software requirement, or recruitment need and we will help you identify the right next step.",
  buttonLabel = "Contact our team",
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="section-shell">
      <div className="section-inner">
        <div className="cta-banner surface-panel">
          <div>
            <span className="section-kicker">Start a conversation</span>
            <h2 className="section-title cta-banner__title">{title}</h2>
            <p className="section-copy">{description}</p>
          </div>
          <div className="cta-banner__actions">
            <Link href="/contact" className="section-action__button">
              {buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export const homepageFaqs = generalFaqs;
