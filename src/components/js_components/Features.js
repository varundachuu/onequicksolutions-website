import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faCloud,
  faCode,
  faMobileAlt,
  faRobot,
  faShieldAlt,
  faSyncAlt,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../css-files/Features.module.css";

const featureList = [
  {
    id: 1,
    icon: faCloud,
    title: "Cloud integration",
    description:
      "Secure, scalable cloud delivery aligned with the pace and structure of your business.",
  },
  {
    id: 2,
    icon: faTools,
    title: "Custom SaaS systems",
    description:
      "Tailored SaaS experiences that simplify operations and create a stronger product foundation.",
  },
  {
    id: 3,
    icon: faCode,
    title: "Modern web development",
    description:
      "Responsive, polished web platforms designed to feel fast, clear, and conversion-ready.",
  },
  {
    id: 4,
    icon: faSyncAlt,
    title: "Digital transformation",
    description:
      "Workflow automation and operational improvements that reduce friction across teams.",
  },
  {
    id: 5,
    icon: faRobot,
    title: "AI and ML solutions",
    description:
      "Smarter decision support and process enhancement through purposeful AI implementation.",
  },
  {
    id: 6,
    icon: faMobileAlt,
    title: "Mobile app delivery",
    description:
      "Connected, user-friendly apps for teams and customers who need speed on the go.",
  },
  {
    id: 7,
    icon: faChartBar,
    title: "Data analytics",
    description:
      "Actionable reporting and insight layers that help leaders move with confidence.",
  },
  {
    id: 8,
    icon: faShieldAlt,
    title: "Cybersecurity",
    description:
      "Protection-minded development practices that help keep your systems and data safer.",
  },
];

function Features() {
  return (
    <section id="features" className={`section-shell ${styles.featuresSection}`}>
      <div className="section-inner">
        <div className="section-intro">
          <span className="section-kicker">Our features</span>
          <h2 className="section-title">Capabilities that make delivery smoother</h2>
          <p className="section-copy">
            We focus on the technical and operational foundations that help your
            digital products look better, perform better, and scale with less
            friction.
          </p>
        </div>

        <div className={styles.featuresRow}>
          {featureList.map((feature) => (
            <article key={feature.id} className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <FontAwesomeIcon icon={feature.icon} />
              </span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
