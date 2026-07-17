import React from "react";
import {
  FaBrain,
  FaCloud,
  FaCodeBranch,
  FaDatabase,
  FaDrawPolygon,
  FaGlobe,
  FaLayerGroup,
  FaMap,
} from "react-icons/fa6";
import { technologyGroups } from "../../content/siteContent";
import "../css-files/ContentSections.css";

const iconMap = {
  frontend: FaGlobe,
  backend: FaCodeBranch,
  mobile: FaLayerGroup,
  cloud: FaCloud,
  data: FaDatabase,
  ai: FaBrain,
  design: FaDrawPolygon,
  spatial: FaMap,
};

function Features() {
  return (
    <section id="features" className="section-shell technology-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Technologies we use</span>
          <h2 className="section-title">Delivery capabilities that support modern, scalable digital products</h2>
          <p className="section-copy">
            We work across the design, engineering, data, cloud, and specialist
            workflow capabilities required to deliver reliable digital systems
            for different kinds of organizations.
          </p>
        </div>

        <div className="technology-grid">
          {technologyGroups.map((item) => {
            const Icon = iconMap[item.icon] ?? FaCodeBranch;

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

export default Features;
