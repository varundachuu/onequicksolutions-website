import React from "react";
import { FaBuilding, FaGraduationCap, FaIndustry, FaRocket, FaUserTie } from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import { industryGroups } from "../../content/siteContent";
import "../css-files/ContentSections.css";

const iconMap = {
  Startups: FaRocket,
  SMEs: MdBusinessCenter,
  Enterprises: FaBuilding,
  "Educational Institutions": FaGraduationCap,
  "HR and Recruitment Teams": FaUserTie,
  "Infrastructure and Geospatial Teams": FaIndustry,
};

function Industries() {
  return (
    <section id="industries" className="section-shell industries-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Industries we serve</span>
          <h2 className="section-title">Built for different growth stages and operational realities</h2>
          <p className="section-copy">
            Our work is adaptable by design, which means we can support different
            business types without forcing every client into the same digital model.
          </p>
        </div>

        <div className="industry-grid">
          {industryGroups.map((item) => {
            const Icon = iconMap[item.title] ?? FaBuilding;

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

export default Industries;
