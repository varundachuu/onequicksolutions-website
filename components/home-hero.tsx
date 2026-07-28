import Link from "next/link";

import heroBackground from "@/src/Hero-Background_image/background.jpg.optimized.jpg";
import { deliveryHighlights, heroStats, homeHeroChips } from "@/data/site";

export function HomeHero() {
  return (
    <section
      className="hero"
      aria-labelledby="home-hero-title"
      style={{ backgroundImage: `url(${heroBackground.src})` }}
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
              OneQuickSolutions helps startups, SMEs, enterprises, and educational institutions
              create sharper websites, better software, stronger digital workflows, and more
              confident customer experiences.
            </p>

            <div className="hero-chip-list" aria-label="Core expertise">
              {homeHeroChips.map((chip) => (
                <span key={chip} className="hero-chip">
                  {chip}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <Link href="/services" className="cta-button">
                Explore Services
              </Link>
              <Link href="/contact" className="secondary-button">
                Talk to Our Team
              </Link>
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
              Best fit for organizations that need a credible digital presence, smoother
              operations, and practical technical support.
            </p>
          </aside>

          <div className="hero-stats" aria-label="Company strengths">
            {heroStats.map((stat) => (
              <div key={stat.title} className="hero-stat-card">
                <strong>{stat.title}</strong>
                <span>{stat.copy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
