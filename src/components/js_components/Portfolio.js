import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { portfolioStories } from "../../content/siteContent";
import "../css-files/ContentSections.css";

function Portfolio({ onPrimaryCta }) {
  return (
    <section id="portfolio" className="section-shell portfolio-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Portfolio and case-study direction</span>
          <h2 className="section-title">Representative solution blueprints that reflect how we think</h2>
          <p className="section-copy">
            We do not publish invented client stories. Instead, this section
            shows the kind of business challenges and solution structures we
            are equipped to support. Approved client-specific case studies can
            be layered in later for even stronger proof.
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

        {onPrimaryCta && (
          <div className="section-action">
            <button
              type="button"
              className="section-action__button"
              onClick={onPrimaryCta}
            >
              Discuss a similar project
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Portfolio;
