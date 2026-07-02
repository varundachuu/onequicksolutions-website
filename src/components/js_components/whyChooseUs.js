import React from "react";
import { FaPiggyBank, FaPlug, FaRocket, FaUserShield } from "react-icons/fa";
import styles from "../css-files/whyChooseUs.module.css";

const reasons = [
  {
    title: "Scalable delivery",
    description:
      "Solutions are designed to support today's needs and tomorrow's growth without a painful rebuild.",
    icon: FaRocket,
  },
  {
    title: "Reliable partnership",
    description:
      "You get a responsive team that communicates clearly and stays invested well beyond handoff.",
    icon: FaUserShield,
  },
  {
    title: "Commercially smart",
    description:
      "We focus on practical value, efficient execution, and investments that make business sense.",
    icon: FaPiggyBank,
  },
  {
    title: "Easy to integrate",
    description:
      "Our work fits naturally into your current tools, workflows, and wider digital ecosystem.",
    icon: FaPlug,
  },
];

const WhyChooseUs = () => {
  return (
    <section className={`section-shell ${styles.whyChooseUsSection}`}>
      <div className="section-inner">
        <div className={`section-intro ${styles.intro}`}>
          <span className="section-kicker">Why choose us</span>
          <h2 className="section-title">
            Built for businesses that want quality and momentum
          </h2>
          <p className="section-copy">
            We combine sharp design, dependable execution, and business-minded
            thinking so your digital presence feels credible, modern, and ready
            to convert.
          </p>
        </div>

        <div className={styles.featuresContainer}>
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article key={reason.title} className={styles.featureCard}>
                <span className={styles.iconWrap}>
                  <Icon />
                </span>
                <h3 className={styles.featureTitle}>{reason.title}</h3>
                <p className={styles.featureDescription}>{reason.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
