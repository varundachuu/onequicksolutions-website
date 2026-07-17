import React from "react";
import { FaComments, FaLightbulb, FaLifeRing } from "react-icons/fa";
import { clientConfidenceItems } from "../../content/siteContent";
import "../css-files/ContentSections.css";

const iconMap = {
  "Clear communication": FaComments,
  "Business-first thinking": FaLightbulb,
  "Longer-term support": FaLifeRing,
};

function ClientConfidence() {
  return (
    <section className="section-shell confidence-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Client confidence</span>
          <h2 className="section-title">Trust is built through how the work feels, not just how it looks</h2>
          <p className="section-copy">
            Because we do not fabricate testimonials, this section focuses on
            the delivery qualities serious buyers typically look for before
            they commit to a long-term digital partner.
          </p>
        </div>

        <div className="confidence-grid">
          {clientConfidenceItems.map((item) => {
            const Icon = iconMap[item.title] ?? FaLightbulb;

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

export default ClientConfidence;
