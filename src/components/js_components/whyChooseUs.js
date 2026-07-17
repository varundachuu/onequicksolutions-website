import React from "react";
import {
  FaArrowTrendUp,
  FaCompassDrafting,
  FaLayerGroup,
  FaPeopleGroup,
} from "react-icons/fa6";
import "../css-files/ContentSections.css";

const reasons = [
  {
    title: "Business-first strategy",
    description:
      "We translate goals, bottlenecks, and user needs into digital decisions that make commercial sense.",
    icon: FaCompassDrafting,
  },
  {
    title: "End-to-end execution",
    description:
      "Design, development, analytics, cloud support, and launch thinking are connected instead of fragmented.",
    icon: FaLayerGroup,
  },
  {
    title: "Flexible for different team sizes",
    description:
      "Our delivery approach works for startups, SMEs, enterprises, and institutions that need a practical partner.",
    icon: FaPeopleGroup,
  },
  {
    title: "Built to support growth",
    description:
      "We focus on solutions that still feel usable and credible as your brand, process, or platform evolves.",
    icon: FaArrowTrendUp,
  },
];

function WhyChooseUs() {
  return (
    <section className="section-shell trust-section">
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Why choose us</span>
          <h2 className="section-title">
            A digital partner for businesses that want better execution and better presentation
          </h2>
          <p className="section-copy">
            OneQuickSolutions combines modern design standards, dependable
            development, and process-aware thinking so your digital presence
            becomes easier to trust, easier to use, and easier to grow.
          </p>
        </div>

        <div className="trust-grid">
          {reasons.map((reason) => {
            const Icon = reason.icon;

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

export default WhyChooseUs;
