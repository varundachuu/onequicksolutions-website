import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import PageHero from "./PageHero";
import "../css-files/ContentSections.css";

const programmes = [
  {
    title: "E-Shikshana",
    description:
      "A digital training and education initiative designed to make upskilling more structured, practical, and accessible.",
    icon: FaGraduationCap,
  },
  {
    title: "Training enablement",
    description:
      "Programme support for institutions and teams that need guided digital learning, onboarding, or capability development.",
    icon: FaChalkboardTeacher,
  },
  {
    title: "Foundational learning support",
    description:
      "Learner-friendly content and programme structure for people building stronger technical and analytical fundamentals.",
    icon: FaBookOpen,
  },
];

function ProgramsPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        kicker="Training and education"
        title="Programmes that help people learn, adapt, and build confidence"
        description="Our training and education programmes support learners, institutions, and teams with clearer learning experiences, practical enablement, and capability-building support."
        chips={["E-Shikshana", "Team enablement", "Practical learning"]}
        primaryAction={{
          label: "Discuss a programme",
          onClick: () => navigate("/contact"),
        }}
        secondaryAction={{
          label: "Explore our services",
          onClick: () => navigate("/services"),
        }}
        highlights={[
          {
            title: "Accessible learning",
            copy: "Structured programmes that make learning easier to start and sustain.",
          },
          {
            title: "Practical capability",
            copy: "Support designed around real skills, workflows, and adoption needs.",
          },
          {
            title: "Flexible delivery",
            copy: "Useful for individuals, institutions, and teams at different stages of growth.",
          },
        ]}
      />

      <section className="section-shell">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Our programmes</span>
            <h2 className="section-title">Learning support designed for meaningful progress</h2>
            <p className="section-copy">
              Whether you are building technical fundamentals, supporting a new
              system rollout, or shaping a more consistent learning journey,
              our programmes make development feel more approachable.
            </p>
          </div>

          <div className="process-grid">
            {programmes.map((programme, index) => {
              const Icon = programme.icon;

              return (
                <article key={programme.title} className="process-card surface-panel interactive-panel">
                  <span className="process-card__step">0{index + 1}</span>
                  <span className="technology-card__icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{programme.title}</h3>
                  <p>{programme.description}</p>
                </article>
              );
            })}
          </div>

          <div className="section-action">
            <button
              type="button"
              className="section-action__button"
              onClick={() => navigate("/contact")}
            >
              Plan a learning programme
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProgramsPage;
