import React from "react";
import { processSteps } from "../../content/siteContent";
import "../css-files/ContentSections.css";

function Products() {
  return (
    <section id="process" className="section-shell process-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Our development process</span>
          <h2 className="section-title">A delivery approach built for clarity, quality, and better decisions</h2>
          <p className="section-copy">
            We use a structured process so projects stay aligned to business
            goals, user needs, technical quality, and long-term usefulness.
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

export default Products;
