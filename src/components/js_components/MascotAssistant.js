import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaMagic,
  FaMoon,
  FaPaperPlane,
  FaSun,
  FaTimes,
} from "react-icons/fa";
import "../css-files/MascotAssistant.css";

const SECTION_SHORTCUTS = [
  {
    id: "about",
    type: "section",
    label: "About",
    line: "Story time. Let me land you on the team intro.",
  },
  {
    id: "service",
    type: "section",
    label: "Services",
    line: "Jumping to the service stack. This part sells hard.",
  },
  {
    id: "other-services",
    type: "section",
    label: "Programmes",
    line: "Teleporting to the programmes section. Extra goodies ahead.",
  },
  {
    id: "contact",
    type: "section",
    label: "Contact",
    line: "Bold move. Straight to the contact form.",
  },
  {
    id: "hr-consultancy",
    type: "route",
    path: "/hr-consultancy",
    label: "HR Consultancy",
    line: "Switching into hiring mode. Let us visit the consultancy page.",
  },
];

const CONTEXT_LINES = {
  home: [
    "Quicki online. Need a shortcut or a tiny bit of chaos?",
    "I can hop you to the best bits if you do not feel like scrolling.",
  ],
  about: [
    "This is the brand story zone. Want the service highlights next?",
    "A good intro builds trust. I can zip you to the offers too.",
  ],
  features: [
    "Feature cards looking sharp. Want a faster route to contact?",
    "Capabilities unlocked. I can jump you deeper down the page.",
  ],
  service: [
    "These service cards are conversion territory. Good place to linger.",
    "Need a faster path from services to contact? I can do that.",
  ],
  "other-services": [
    "Programmes spotted. I call this the bonus round.",
    "There is more down here than people expect. Nice scroll.",
  ],
  contact: [
    "Perfect timing. I can nudge people straight into this section.",
    "Contact section reached. Mission almost complete.",
  ],
  "hr-consultancy": [
    "Hiring mode activated. Quicki loves a specialized landing page.",
    "This page is focused. Want me to warp back to the main site?",
  ],
};

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const scrollToDocumentSection = (sectionId) => {
  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.getElementById(sectionId);
  const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;

  if (!target) {
    return;
  }

  const topPosition =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 14;

  window.scrollTo({
    top: Math.max(topPosition, 0),
    behavior: "smooth",
  });
};

function MascotAssistant({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [speech, setSpeech] = useState(CONTEXT_LINES.home[0]);
  const [activeSection, setActiveSection] = useState("home");
  const [sparkles, setSparkles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const sparkleTimerRef = useRef(null);

  useEffect(() => {
    const updateActiveSection = () => {
      if (location.pathname === "/hr-consultancy") {
        setActiveSection("hr-consultancy");
        return;
      }

      if (location.pathname !== "/") {
        setActiveSection("home");
        return;
      }

      const headerHeight =
        document.querySelector(".header")?.offsetHeight ?? 0;
      const sections = ["about", "features", "service", "other-services", "contact"];
      let currentSection = "home";

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (!section) {
          return;
        }

        if (window.scrollY >= section.offsetTop - headerHeight - 120) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      return undefined;
    }

    const lines = CONTEXT_LINES[activeSection] ?? CONTEXT_LINES.home;
    setSpeech(lines[0]);

    const rotationTimer = window.setInterval(() => {
      setSpeech(randomItem(lines));
    }, 5200);

    return () => {
      window.clearInterval(rotationTimer);
    };
  }, [activeSection, isOpen]);

  useEffect(() => {
    if (!isPartyMode) {
      return undefined;
    }

    const partyTimer = window.setInterval(() => {
      emitSparkles(14);
    }, 1800);

    return () => {
      window.clearInterval(partyTimer);
    };
  }, [isPartyMode]);

  useEffect(() => {
    return () => {
      if (sparkleTimerRef.current) {
        window.clearTimeout(sparkleTimerRef.current);
      }
    };
  }, []);

  const emitSparkles = (count = 12) => {
    if (sparkleTimerRef.current) {
      window.clearTimeout(sparkleTimerRef.current);
    }

    const generatedSparkles = Array.from({ length: count }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      x: `${Math.round((Math.random() - 0.5) * 180)}px`,
      y: `${Math.round((Math.random() - 0.5) * 150)}px`,
      size: `${Math.round(8 + Math.random() * 10)}px`,
      rotation: `${Math.round(Math.random() * 180)}deg`,
      delay: `${(Math.random() * 0.12).toFixed(2)}s`,
      hue: `${210 + Math.round(Math.random() * 80)}`,
    }));

    setSparkles(generatedSparkles);
    sparkleTimerRef.current = window.setTimeout(() => {
      setSparkles([]);
    }, 1100);
  };

  const moveToTarget = (target) => {
    if (target.type === "route") {
      navigate(target.path);
      return;
    }

    if (target.id === "home") {
      if (location.pathname !== "/") {
        navigate("/");
        return;
      }

      scrollToDocumentSection("home");
      return;
    }

    if (location.pathname !== "/") {
      navigate({
        pathname: "/",
        hash: `#${target.id}`,
      });
      return;
    }

    scrollToDocumentSection(target.id);
  };

  const handleSurpriseJump = () => {
    const surprise = randomItem(SECTION_SHORTCUTS);
    setSpeech(surprise.line);
    emitSparkles(15);
    setIsOpen(false);
    moveToTarget(surprise);
  };

  const handleThemeFlip = () => {
    onToggleTheme();
    emitSparkles(12);
    setSpeech(
      theme === "light"
        ? "Night shift enabled. Moodier and shinier."
        : "Sun mode restored. Crisp and bright again."
    );
  };

  const handlePartyMode = () => {
    const nextPartyState = !isPartyMode;
    setIsPartyMode(nextPartyState);
    emitSparkles(nextPartyState ? 18 : 10);
    setSpeech(
      nextPartyState
        ? "Party mode unlocked. Tiny chaos, excellent vibes."
        : "Back to business mode. Quicki is behaving again."
    );
  };

  const handleContactWarp = () => {
    emitSparkles(14);
    setSpeech("Opening the contact section. Let us make something together.");
    setIsOpen(false);
    moveToTarget({ id: "contact", type: "section" });
  };

  return (
    <aside
      className={[
        "mascot-assistant",
        isOpen ? "mascot-assistant--open" : "",
        isPartyMode ? "mascot-assistant--party" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Quicki assistant"
    >
      <div className="mascot-assistant__speech" aria-live="polite">
        <span className="mascot-assistant__speech-label">Quicki</span>
        <p>{speech}</p>
      </div>

      <div className="mascot-assistant__dock">
        {isOpen && (
          <div className="mascot-panel">
            <div className="mascot-panel__header">
              <div>
                <p className="mascot-panel__eyebrow">Digital Sidekick</p>
                <h3>Quicki&apos;s chaos console</h3>
              </div>
              <button
                type="button"
                className="mascot-panel__close"
                onClick={() => setIsOpen(false)}
                aria-label="Close mascot panel"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mascot-panel__actions">
              <button
                type="button"
                className="mascot-action"
                onClick={handleSurpriseJump}
              >
                <span className="mascot-action__icon">
                  <FaMagic />
                </span>
                <span>
                  <strong>Surprise Me</strong>
                  <small>Randomly jump to a strong section.</small>
                </span>
              </button>

              <button
                type="button"
                className="mascot-action"
                onClick={handleThemeFlip}
              >
                <span className="mascot-action__icon">
                  {theme === "light" ? <FaMoon /> : <FaSun />}
                </span>
                <span>
                  <strong>Theme Flip</strong>
                  <small>Let Quicki toggle the mood instantly.</small>
                </span>
              </button>

              <button
                type="button"
                className="mascot-action"
                onClick={handlePartyMode}
              >
                <span className="mascot-action__icon">
                  <FaBolt />
                </span>
                <span>
                  <strong>{isPartyMode ? "Calm It Down" : "Party Mode"}</strong>
                  <small>Fire spark bursts and extra mascot energy.</small>
                </span>
              </button>

              <button
                type="button"
                className="mascot-action mascot-action--primary"
                onClick={handleContactWarp}
              >
                <span className="mascot-action__icon">
                  <FaPaperPlane />
                </span>
                <span>
                  <strong>Contact Warp</strong>
                  <small>Jump straight to the conversation starter.</small>
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="mascot-assistant__anchor">
          <div className="mascot-assistant__sparkles" aria-hidden="true">
            {sparkles.map((sparkle) => (
              <span
                key={sparkle.id}
                className="mascot-sparkle"
                style={{
                  "--sparkle-x": sparkle.x,
                  "--sparkle-y": sparkle.y,
                  "--sparkle-size": sparkle.size,
                  "--sparkle-rotation": sparkle.rotation,
                  "--sparkle-delay": sparkle.delay,
                  "--sparkle-color": `hsl(${sparkle.hue} 92% 62%)`,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="mascot-trigger"
            onClick={() => {
              const nextOpen = !isOpen;
              setIsOpen(nextOpen);

              if (nextOpen) {
                setSpeech("Console open. Pick a shortcut or unleash the chaos.");
                emitSparkles(10);
              } else {
                setSpeech(
                  activeSection === "contact"
                    ? "I will hang here quietly near the finish line."
                    : randomItem(CONTEXT_LINES[activeSection] ?? CONTEXT_LINES.home)
                );
              }
            }}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close Quicki assistant" : "Open Quicki assistant"}
          >
            <span className="mascot-trigger__orb" />
            <img
              src="/images/quicki-mascot.png"
              alt="Quicki mascot"
              className="mascot-trigger__image"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default MascotAssistant;
