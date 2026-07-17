import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClipboardCheck,
  FaDatabase,
  FaFileSignature,
  FaRobot,
  FaShieldAlt,
  FaUserCheck,
  FaUserClock,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import FaqSection from "./FaqSection";
import { hrFaqItems } from "../../content/siteContent";
import "../css-files/HRConsultancy.css";

const processSteps = [
  {
    title: "Candidate Registration and Verification",
    description:
      "We collect candidate profiles from trusted channels and verify key details such as resume quality, experience, notice period, salary expectations, skills, and availability before the process moves forward.",
    icon: FaUserCheck,
  },
  {
    title: "Structured Candidate Database",
    description:
      "Candidate information is maintained in a secure and organized format so recruiters can work with clearer visibility across skills, qualifications, location, compensation expectations, and fit.",
    icon: FaDatabase,
  },
  {
    title: "Requirement Alignment with Employers",
    description:
      "We collect the role, skill requirements, experience level, location, compensation expectations, joining timeline, and hiring context so shortlisting stays relevant.",
    icon: FaBuilding,
  },
  {
    title: "AI Signals with Recruiter Review",
    description:
      "Matching is supported by AI-assisted logic and completed with recruiter validation so shortlists stay practical, relevant, and aligned to real hiring needs.",
    icon: FaRobot,
  },
  {
    title: "Interview Coordination and Follow-up",
    description:
      "We coordinate interview schedules, reminders, candidate communication, and feedback tracking so the hiring process stays smoother for both recruiters and employers.",
    icon: FaCalendarAlt,
  },
  {
    title: "Offer, Joining, and Closure Support",
    description:
      "From offer-stage coordination to joining follow-up, we help maintain momentum so positions close with more structure and less avoidable friction.",
    icon: FaFileSignature,
  },
];

const trustCards = [
  {
    title: "Candidate Data Privacy",
    description:
      "Candidate information is handled with controlled access, confidentiality, and consent-aware sharing so the recruitment process stays professional and secure.",
    icon: FaShieldAlt,
  },
  {
    title: "Post-Joining Support",
    description:
      "Our support can continue after joining through follow-up checkpoints that help improve closure quality and reduce avoidable drop-off.",
    icon: FaUsers,
  },
  {
    title: "Recruitment Visibility",
    description:
      "We are building toward smarter dashboards, automation, and operational visibility so recruitment becomes easier to track and improve over time.",
    icon: FaChartLine,
  },
];

const reasons = [
  "Verified candidate quality before shortlisting",
  "Recruiter-led review with AI-assisted matching support",
  "Interview coordination and follow-up management",
  "Structured offer and joining support",
  "Secure handling of candidate data",
  "A practical workflow for growing recruitment needs",
];

const heroHighlights = [
  {
    title: "Verified profiles",
    copy: "Candidate quality checks before every shortlist.",
    icon: FaClipboardCheck,
  },
  {
    title: "Smarter matching",
    copy: "AI signals plus recruiter review for stronger fit.",
    icon: FaUserTie,
  },
  {
    title: "Closure support",
    copy: "Interview, offer, joining, and follow-up handled with more structure.",
    icon: FaUserClock,
  },
];

const hiringSignals = [
  "Role-based shortlisting with candidate interest confirmation",
  "Interview reminders and process coordination support",
  "Hiring visibility through structured workflow management",
];

const consultancyPortalUrl =
  "https://hr.onequicksolutions.com/?userType=consultancy";

const scrollToLocalSection = (sectionId) => {
  const target = document.getElementById(sectionId);
  const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;

  if (!target) {
    return;
  }

  const topPosition =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

  window.scrollTo({
    top: Math.max(topPosition, 0),
    behavior: "smooth",
  });
};

function HRConsultancyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToContact = () => {
    if (location.pathname !== "/") {
      navigate("/contact");
      return;
    }

    scrollToLocalSection("contact");
  };

  const openConsultancyPortal = () => {
    window.open(consultancyPortalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="hr-page">
        <section className="section-shell hr-page-hero">
          <div className="section-inner hr-page-hero__inner">
            <div className="hr-page-hero__copy">
              <span className="section-kicker">HR consulting and recruitment services</span>
              <h1 className="section-title hr-page-hero__title">
                Structured hiring support for businesses that need better recruitment flow
              </h1>
              <p className="section-copy hr-page-hero__lead">
                OneQuickSolutions helps businesses improve hiring through
                candidate verification, recruiter-led shortlisting, interview
                coordination, offer-stage support, and structured process
                visibility. The goal is to make recruitment easier to manage,
                easier to trust, and easier to scale.
              </p>

              <div className="hr-page-hero__actions">
                <button
                  type="button"
                  className="hr-page-button hr-page-button--primary"
                  onClick={goToContact}
                >
                  Share Your Hiring Requirement
                  <FaArrowRight />
                </button>
                <button
                  type="button"
                  className="hr-page-button hr-page-button--secondary"
                  onClick={openConsultancyPortal}
                >
                  Open HR Consultancy Portal
                  <FaArrowRight />
                </button>
                <button
                  type="button"
                  className="hr-page-button hr-page-button--secondary"
                  onClick={() => scrollToLocalSection("recruitment-process")}
                >
                  Explore the Recruitment Process
                </button>
              </div>
            </div>

            <div className="hr-page-hero__visual surface-panel">
              <div className="hr-page-hero__image-shell">
                <img
                  src="/images/contact.jpg.optimized.jpg"
                  alt="Recruitment planning and coordination workspace"
                  className="hr-page-hero__image"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>

              <div className="hr-page-visual-card hr-page-visual-card--floating">
                <span className="hr-page-icon-badge hr-page-icon-badge--small">
                  <FaBriefcase />
                </span>
                <div>
                  <strong>Complete workflow support</strong>
                  <p>Profiles, interviews, offers, joining, and process visibility in one flow.</p>
                </div>
              </div>

              <div className="hr-page-visual-card hr-page-visual-card--dashboard">
                <div className="hr-page-visual-card__top">
                  <img
                    src="/images/logo6.jpg"
                    alt="OneQuickSolutions recruitment support"
                    className="hr-page-dashboard-image"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                  <div>
                    <span className="hr-page-visual-label">Recruitment workflow</span>
                    <h2>Clearer hiring coordination</h2>
                  </div>
                </div>

                <ul className="hr-page-checklist">
                  {hiringSignals.map((signal) => (
                    <li key={signal}>
                      <FaCheckCircle />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="hr-page-hero__highlights">
              {heroHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="hr-page-highlight-card surface-panel interactive-panel"
                  >
                    <span className="hr-page-icon-badge">
                      <Icon />
                    </span>
                    <div className="hr-page-highlight-card__body">
                      <strong>{item.title}</strong>
                      <p>{item.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="recruitment-process" className="section-shell hr-page-process">
          <div className="section-inner">
            <div className="section-intro">
              <span className="section-kicker">Our recruitment process</span>
              <h2 className="section-title">A hiring flow designed for quality, coordination, and closure</h2>
              <p className="section-copy">
                We combine recruiter discipline, structured data handling, and
                process visibility so hiring moves with more confidence from
                first profile to final joining support.
              </p>
            </div>

            <div className="hr-page-process__grid">
              {processSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="hr-page-process-card surface-panel interactive-panel"
                  >
                    <span className="hr-page-icon-badge">
                      <Icon />
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-shell hr-page-assurance">
          <div className="section-inner hr-page-assurance__layout">
            <div className="hr-page-assurance__copy">
              <div className="section-intro section-intro--left hr-page-assurance__intro">
                <span className="section-kicker">Recruitment assurance</span>
                <h2 className="section-title">Secure hiring support with better follow-through</h2>
                <p className="section-copy">
                  Our recruitment support is designed to reduce friction for both
                  candidates and employers while improving visibility, quality,
                  and closure discipline across the process.
                </p>
              </div>

              <div className="hr-page-assurance__cards">
                {trustCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article key={card.title} className="hr-page-assurance-card surface-panel">
                      <span className="hr-page-icon-badge">
                        <Icon />
                      </span>
                      <div>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="hr-page-assurance__panel surface-panel">
              <span className="section-kicker">Why companies choose us</span>
              <h3>Recruiter-led support with practical process ownership</h3>
              <p>
                Partner with OneQuickSolutions to make hiring more organized,
                more transparent, and more dependable from sourcing to joining.
              </p>

              <div className="hr-page-assurance__metrics">
                <div className="hr-page-assurance__metric">
                  <strong>Verified shortlisting</strong>
                  <span>Profiles reviewed before they move toward client consideration.</span>
                </div>
                <div className="hr-page-assurance__metric">
                  <strong>Consent-aware data handling</strong>
                  <span>Candidate data is treated with privacy, access control, and care.</span>
                </div>
                <div className="hr-page-assurance__metric">
                  <strong>Structured follow-up</strong>
                  <span>Interview, offer, and joining stages are supported with clearer coordination.</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="section-shell hr-page-reasons">
          <div className="section-inner">
            <div className="section-intro">
              <span className="section-kicker">Why choose OneQuickSolutions?</span>
              <h2 className="section-title">A practical recruitment partner for consistent hiring delivery</h2>
              <p className="section-copy">
                We bring together process ownership, recruiter review, candidate
                quality checks, and coordination discipline so recruitment stays
                easier to manage.
              </p>
            </div>

            <div className="hr-page-reasons__grid">
              {reasons.map((reason) => (
                <article
                  key={reason}
                  className="hr-page-reason-card surface-panel interactive-panel"
                >
                  <span className="hr-page-icon-badge hr-page-icon-badge--small">
                    <FaCheckCircle />
                  </span>
                  <p>{reason}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell hr-page-cta">
          <div className="section-inner">
            <div className="hr-page-cta__panel surface-panel">
              <span className="section-kicker">Let&apos;s hire better talent</span>
              <h2 className="section-title">Contact us to discuss your hiring requirement</h2>
              <p className="section-copy">
                Whether you need urgent recruitment support or a more dependable
                hiring process, OneQuickSolutions is ready to help you move
                faster with better-fit candidates and stronger coordination.
              </p>

              <div className="hr-page-cta__actions">
                <button
                  type="button"
                  className="hr-page-button hr-page-button--primary"
                  onClick={openConsultancyPortal}
                >
                  Open HR Consultancy Portal
                  <FaArrowRight />
                </button>
                <button
                  type="button"
                  className="hr-page-button hr-page-button--secondary"
                  onClick={goToContact}
                >
                  Start the Conversation
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <FaqSection
        sectionId="faq"
        kicker="HR consultancy FAQ"
        title="Common questions about our recruitment support"
        description="These answers help employers understand how our HR consulting workflow is structured before starting a conversation."
        items={hrFaqItems}
      />
    </>
  );
}

export default HRConsultancyPage;
