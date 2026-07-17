import React from "react";
import { FaArrowRight, FaBullseye, FaLightbulb, FaPeopleCarryBox, FaShieldHeart } from "react-icons/fa6";
import "../css-files/About.css";

const pillars = [
  {
    title: "Mission",
    description:
      "To help businesses build digital systems that are more useful, more credible, and easier to grow with confidence.",
    icon: FaBullseye,
  },
  {
    title: "Vision",
    description:
      "To become a trusted long-term partner for organizations that want stronger digital execution without unnecessary complexity.",
    icon: FaLightbulb,
  },
  {
    title: "Expertise",
    description:
      "Our work spans software, SaaS, websites, mobile, AI, analytics, cloud, recruitment support, and digital training.",
    icon: FaPeopleCarryBox,
  },
  {
    title: "Approach",
    description:
      "We value clear communication, practical problem solving, and business-aware delivery that continues after launch.",
    icon: FaShieldHeart,
  },
];

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;

  if (!section) {
    return;
  }

  const topPosition =
    section.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({
    top: Math.max(topPosition, 0),
    behavior: "smooth",
  });
};

function AboutUs() {
  return (
    <section id="about" className="about-main-container section-shell">
      <div className="section-inner">
        <div className="section-intro section-intro--left about-intro">
          <span className="section-kicker">About OneQuickSolutions</span>
          <h2 className="section-title">
            We build digital solutions that connect brand trust, technical clarity, and business usefulness
          </h2>
          <p className="section-copy">
            OneQuickSolutions is a software development company focused on
            helping organizations modernize how they operate, present
            themselves, and deliver value online. We do not just build for the
            sake of shipping. We build to solve the right problem in a way that
            still feels strong months after launch.
          </p>
        </div>

        <div className="about-us surface-panel">
          <div className="about-us-left">
            <div className="about-image-shell">
              <img
                src="/images/About.jpg.optimized.jpg"
                alt="OneQuickSolutions team collaboration and planning session"
                className="about-image"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          </div>

          <div className="about-us-right">
            <h3 className="about-card-title">
              A practical partner for startups, SMEs, enterprises, and institutions
            </h3>
            <p className="about-body">
              Our strength is combining strategic thinking with hands-on
              execution. That means sharper websites, better workflows, clearer
              communication, and digital experiences that feel premium without
              losing sight of operational reality.
            </p>

            <div className="about-pillars">
              {pillars.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="about-pillar-card">
                    <span className="about-pillar-card__icon">
                      <Icon />
                    </span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="about-metrics">
              <div className="about-metric">
                <strong>Business-aware delivery</strong>
                <span>Solutions shaped around goals, users, and process fit.</span>
              </div>
              <div className="about-metric">
                <strong>Cross-functional support</strong>
                <span>Design, development, analytics, cloud, HR, and training perspectives.</span>
              </div>
            </div>

            <div className="about-actions">
              <button
                className="book-tour"
                onClick={() => scrollToSection("contact")}
                type="button"
              >
                Discuss your project
                <FaArrowRight />
              </button>
              <p className="about-note">
                If you have an idea, redesign, system gap, or product goal, we
                can help you clarify the best next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
