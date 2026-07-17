import React from "react";
import "../css-files/PageHero.css";
import heroBackground from "../../Hero-Background_image/background.jpg.optimized.jpg";

const solutionChips = [
  "Custom software",
  "SaaS platforms",
  "Web and mobile apps",
  "AI and analytics",
  "Cloud and UI/UX",
];

const deliveryHighlights = [
  {
    title: "Strategy-led delivery",
    copy: "We start with the business problem, then shape the right digital solution around it.",
  },
  {
    title: "Premium digital execution",
    copy: "Design, development, SEO, UX, and operational thinking are aligned instead of treated separately.",
  },
  {
    title: "Built for real growth",
    copy: "Our work is designed to help startups, SMEs, enterprises, and institutions move with more clarity.",
  },
];

function HomeHero({ onExploreServices, onTalkToTeam }) {
  return (
    <section
      className="hero"
      aria-labelledby="home-hero-title"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="hero-overlay">
        <div className="hero-content hero-content--split">
          <div className="hero-copy">
            <span className="hero-kicker">
              Custom software, SaaS, AI, analytics, cloud, HR, and training support
            </span>
            <h1 id="home-hero-title" className="animated-title">
              Build digital systems your business can trust and grow on
            </h1>
            <p className="animated-description">
              OneQuickSolutions helps startups, SMEs, enterprises, and
              educational institutions create sharper websites, better software,
              stronger digital workflows, and more confident customer
              experiences.
            </p>

            <div className="hero-chip-list" aria-label="Core expertise">
              {solutionChips.map((chip) => (
                <span key={chip} className="hero-chip">
                  {chip}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <button
                type="button"
                className="cta-button"
                onClick={onExploreServices}
              >
                Explore Services
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={onTalkToTeam}
              >
                Talk to Our Team
              </button>
            </div>
          </div>

          <aside className="hero-panel surface-panel" aria-label="Delivery highlights">
            <span className="hero-panel__eyebrow">Why businesses choose us</span>
            <h2 className="hero-panel__title">
              One partner for strategy, design, development, and ongoing improvement
            </h2>
            <div className="hero-panel__grid">
              {deliveryHighlights.map((item) => (
                <article key={item.title} className="hero-panel__card">
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
            <p className="hero-panel__note">
              Best fit for organizations that need a credible digital presence,
              smoother operations, and practical technical support.
            </p>
          </aside>

          <div className="hero-stats" aria-label="Company strengths">
            <div className="hero-stat-card">
              <strong>Business-first thinking</strong>
              <span>Solutions shaped around goals, users, and workflows.</span>
            </div>
            <div className="hero-stat-card">
              <strong>Cross-functional execution</strong>
              <span>UI/UX, development, SEO, analytics, and launch support in one flow.</span>
            </div>
            <div className="hero-stat-card">
              <strong>Longer-term support</strong>
              <span>We help refine, improve, and scale after the first release too.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
