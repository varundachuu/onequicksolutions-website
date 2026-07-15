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
import "../css-files/HRConsultancy.css";

const processSteps = [
  {
    title: "Candidate Registration & Verification",
    description:
      "We collect candidate profiles through campus drives, job fairs, social media, referrals, website registrations, and direct applications. Every candidate profile is verified for resume quality, contact details, education, skills, experience, salary expectations, and availability.",
    icon: FaUserCheck,
  },
  {
    title: "Strong Candidate Database",
    description:
      "We maintain a secure candidate database with skills, qualifications, experience, location, salary expectations, and notice period details. Candidate contact information is protected and shared only with proper approval.",
    icon: FaDatabase,
  },
  {
    title: "Client Registration & Job Requirements",
    description:
      "We collect company details, HR contact information, business email, company profile, and job requirements such as role, skills, experience, salary, location, openings, and joining date.",
    icon: FaBuilding,
  },
  {
    title: "AI & Recruiter-Based Matching",
    description:
      "Our system matches candidates based on skills, experience, education, location, salary, and notice period. Recruiters then review profiles, confirm candidate interest, and shortlist the best-fit candidates for clients.",
    icon: FaRobot,
  },
  {
    title: "Interview Coordination",
    description:
      "We schedule interviews, send reminders, coordinate with candidates and clients, and collect interview feedback to keep the hiring process smooth and organized.",
    icon: FaCalendarAlt,
  },
  {
    title: "Offer & Joining Management",
    description:
      "We support offer release, salary discussions, acceptance tracking, joining confirmation, and post-joining follow-up to ensure successful recruitment closure.",
    icon: FaFileSignature,
  },
];

const trustCards = [
  {
    title: "Candidate Data Privacy",
    description:
      "Candidate information is managed securely by OneQuickSolutions. We use candidate data only with consent and restrict access based on user roles to protect privacy and confidentiality.",
    icon: FaShieldAlt,
  },
  {
    title: "Post-Joining Support",
    description:
      "Our responsibility does not end with joining. We follow up after 7, 30, 60, and 90 days to ensure smooth onboarding. Replacement support is provided based on the agreed recruitment terms.",
    icon: FaUsers,
  },
  {
    title: "Future-Ready Recruitment",
    description:
      "OneQuickSolutions is moving towards smarter recruitment with AI resume parsing, AI candidate matching, WhatsApp reminders, interview scheduling automation, and recruitment dashboards.",
    icon: FaChartLine,
  },
];

const reasons = [
  "Complete recruitment process management",
  "Verified candidate profiles",
  "Secure candidate data handling",
  "Recruiter-reviewed shortlisting",
  "Interview and offer coordination",
  "Post-joining follow-up support",
  "Revenue and hiring performance tracking",
];

const heroHighlights = [
  {
    title: "Verified profiles",
    copy: "Candidate quality checks before every shortlist.",
    icon: FaClipboardCheck,
  },
  {
    title: "Smart matching",
    copy: "AI signals plus recruiter review for better-fit hiring.",
    icon: FaUserTie,
  },
  {
    title: "Closure support",
    copy: "Interview, offer, joining, billing, and follow-up handled end to end.",
    icon: FaUserClock,
  },
];

const hiringSignals = [
  "Role-wise shortlisting with interest confirmation",
  "Structured reminders for interviews and joining",
  "Recruitment dashboards and performance visibility",
];
const consultancyPortalUrl = "https://hr.onequicksolutions.com/?userType=consultancy";

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
      navigate({
        pathname: "/",
        hash: "#contact",
      });
      return;
    }

    scrollToLocalSection("contact");
  };

  const openConsultancyPortal = () => {
    window.open(consultancyPortalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="hr-page">
      <section className="section-shell hr-page-hero">
        <div className="section-inner hr-page-hero__inner">
          <div className="hr-page-hero__copy">
            <span className="section-kicker">HR Consultancy Recruitment Services</span>
            <h1 className="section-title hr-page-hero__title">
              Find the Right Talent with OneQuickSolutions
            </h1>
            <p className="section-copy hr-page-hero__lead">
              OneQuickSolutions helps companies recruit qualified candidates
              through a structured, transparent, and quality-focused hiring
              process. From candidate registration to interview coordination,
              offer management, joining confirmation, and billing, we manage
              the complete recruitment workflow with professionalism and care.
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
                src="/images/contact.jpg"
                alt="Recruitment coordination workspace"
                className="hr-page-hero__image"
              />
            </div>

            <div className="hr-page-visual-card hr-page-visual-card--floating">
              <span className="hr-page-icon-badge hr-page-icon-badge--small">
                <FaBriefcase />
              </span>
              <div>
                <strong>Complete workflow</strong>
                <p>Registration, interviews, offers, joining, and billing.</p>
              </div>
            </div>

            <div className="hr-page-visual-card hr-page-visual-card--dashboard">
              <div className="hr-page-visual-card__top">
                <img
                  src="/images/logo6.jpg"
                  alt="OneQuickSolutions recruitment support"
                  className="hr-page-dashboard-image"
                />
                <div>
                  <span className="hr-page-visual-label">Recruitment dashboard</span>
                  <h2>Transparent hiring visibility</h2>
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
            <span className="section-kicker">Our Recruitment Process</span>
            <h2 className="section-title">A clear hiring flow from first profile to final closure</h2>
            <p className="section-copy">
              We combine recruiter discipline, secure data handling, and
              process visibility so every hiring requirement moves forward with
              structure and confidence.
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
              <span className="section-kicker">Recruitment Assurance</span>
              <h2 className="section-title">Secure hiring, stronger follow-up, better closure quality</h2>
              <p className="section-copy">
                Our recruitment support is designed to reduce friction for both
                companies and candidates while protecting the quality and
                confidentiality of the process.
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
            <span className="section-kicker">Why teams trust us</span>
            <h3>Recruiter-led shortlisting with measurable follow-through</h3>
            <p>
              Partner with OneQuickSolutions to simplify hiring, improve
              candidate quality, and close positions faster with a reliable
              recruitment process.
            </p>

            <div className="hr-page-assurance__metrics">
              <div className="hr-page-assurance__metric">
                <strong>Role-based review</strong>
                <span>Human validation before every shortlist reaches the client.</span>
              </div>
              <div className="hr-page-assurance__metric">
                <strong>Consent-first data use</strong>
                <span>Protected candidate details with controlled access sharing.</span>
              </div>
              <div className="hr-page-assurance__metric">
                <strong>90-day follow-up</strong>
                <span>Support continues beyond joining for smoother onboarding.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell hr-page-reasons">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Why Choose OneQuickSolutions?</span>
            <h2 className="section-title">A practical recruitment partner for consistent hiring delivery</h2>
            <p className="section-copy">
              We bring together complete process ownership, verified candidate
              quality, and hiring visibility so recruitment stays organized and
              easier to scale.
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
            <span className="section-kicker">Let&apos;s Hire Better Talent</span>
            <h2 className="section-title">Contact us today to share your hiring requirement</h2>
            <p className="section-copy">
              Whether you need support for immediate openings or want a more
              dependable recruitment process, OneQuickSolutions is ready to
              help you move faster with better-fit candidates.
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
  );
}

export default HRConsultancyPage;
