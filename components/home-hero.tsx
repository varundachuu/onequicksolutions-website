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
            <span className="hero-kicker">Founder-led technology startup</span>
            <h1 id="home-hero-title" className="animated-title">
              Software, SaaS and Digital Solutions Built Around Your Business
            </h1>
            <p className="animated-description">
              OneQuickSolutions is a founder-led technology startup providing custom software
              development, business websites, SaaS platforms, mobile applications, AI automation
              and data analytics solutions. We help startups and growing businesses replace manual
              processes, connect business systems and build practical digital platforms.
            </p>

            <div className="hero-chip-list" aria-label="Core expertise">
              {homeHeroChips.map((chip) => (
                <span key={chip} className="hero-chip">
                  {chip}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <Link href="/contact" className="cta-button">
                Discuss Your Requirement
              </Link>
              <Link href="/services" className="secondary-button">
                Explore Our Services
              </Link>
            </div>
          </div>

          <aside className="hero-panel surface-panel" aria-label="Delivery highlights">
            <span className="hero-panel__eyebrow">Founder-led delivery</span>
            <h2 className="hero-panel__title">
              Practical software, website and workflow planning for businesses that need clarity
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
              Best fit for startups, SMEs, service firms, educational organisations, recruitment
              teams and businesses moving away from manual processes.
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
