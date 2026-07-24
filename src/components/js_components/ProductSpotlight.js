import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBriefcase, FaBuilding, FaUserTie } from "react-icons/fa";
import { hiringEntryCards, productSpotlights } from "../../content/siteContent";
import "../css-files/ContentSections.css";

const audienceIconMap = {
  "For companies": FaBuilding,
  "For candidates": FaUserTie,
};

function ProductSpotlight({ detailed = false }) {
  const product = productSpotlights[0];

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
              <h3>HR Consultancy</h3>
              <p>
                Simple, structured support for sourcing candidates, coordinating
                interviews, and managing recruitment workflows.
              </p>
              <Link className="product-spotlight__read-more" to="/products">
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
          <h2 className="section-title">HR Consultancy Portal</h2>
          <p className="section-copy">
            Beyond services, OneQuickSolutions is also building focused digital
            products. This HR consultancy portal is designed to make hiring feel
            clearer, faster, and more organized for both businesses and candidates.
          </p>
        </div>

        <article className="product-portal-card surface-panel">
          <div className="product-portal-card__overview">
            <div className="product-spotlight__headline">
              <span className="product-spotlight__icon" aria-hidden="true">
                <FaBriefcase />
              </span>
              <div>
                <h3>{product.title}</h3>
                <p className="product-portal-card__eyebrow">Recruitment management made simpler</p>
              </div>
            </div>

            <p className="product-portal-card__description">{product.summary}</p>

            <ul className="product-portal-card__features">
              {product.bullets.map((item) => (
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
              const Icon = audienceIconMap[card.audience] ?? FaBriefcase;

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
            <h3>Another practical business product is on the way</h3>
            <p>We are working on the next tool to help teams manage everyday work with more clarity.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProductSpotlight;
