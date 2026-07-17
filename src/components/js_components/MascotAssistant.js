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

const SECTION_LABELS = {
  home: "Home",
  about: "About",
  features: "Features",
  service: "Services",
  "other-services": "Programmes",
  contact: "Contact",
  "hr-consultancy": "HR Consultancy",
};

const BONK_REACTIONS = [
  {
    badge: "OW",
    line: "Ow. That was a very direct click.",
  },
  {
    badge: "HEY",
    line: "Easy. I am a mascot, not a punching bag.",
  },
  {
    badge: "RUDE",
    line: "Quicki is filing a tiny workplace complaint.",
  },
  {
    badge: "OKAY",
    line: "All right, all right. You definitely won that round.",
  },
];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const INTRO_MESSAGE = "Welcome to OneQuickSolutions";

const getDockMetrics = () => {
  if (typeof window === "undefined") {
    return {
      translateX: "0px",
      translateY: "0px",
    };
  }

  const compact = window.innerWidth <= 640;
  const size = compact ? 68 : 80;
  const rightOffset = compact ? 12.8 : 25.6;
  const bottomOffset = compact ? 12.8 : 25.6;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const dockX = window.innerWidth - rightOffset - size / 2;
  const dockY = window.innerHeight - bottomOffset - size / 2;

  return {
    translateX: `${Math.round(dockX - centerX)}px`,
    translateY: `${Math.round(dockY - centerY)}px`,
  };
};

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

function QuickiBot({
  variant = "dock",
  isPartyMode = false,
  isPushing = false,
  scrollDirection = "down",
  isTalking = false,
  isBonked = false,
  bonkCycle = 0,
}) {
  return (
    <div
      className={[
        "quicki-bot",
        `quicki-bot--${variant}`,
        isPartyMode ? "quicki-bot--party" : "",
        isTalking ? "quicki-bot--talking" : "",
        isBonked ? "quicki-bot--bonked" : "",
        isBonked ? `quicki-bot--bonked-${bonkCycle % 2}` : "",
        isPushing ? `quicki-bot--scroll-${scrollDirection}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <span className="quicki-bot__aura" />
      <span className="quicki-bot__shadow" />
      <span className="quicki-bot__antenna" />
      <span className="quicki-bot__arm quicki-bot__arm--left" />
      <span className="quicki-bot__arm quicki-bot__arm--right" />
      <div className="quicki-bot__body">
        <div className="quicki-bot__visor">
          <span className="quicki-bot__eye quicki-bot__eye--left">
            <span className="quicki-bot__pupil" />
          </span>
          <span className="quicki-bot__eye quicki-bot__eye--right">
            <span className="quicki-bot__pupil" />
          </span>
        </div>
        <span className="quicki-bot__mouth" />
        <span className="quicki-bot__core" />
      </div>
      <span className="quicki-bot__hover-ring" />
    </div>
  );
}

function MascotAssistant({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introSettling, setIntroSettling] = useState(false);
  const [introTarget, setIntroTarget] = useState(getDockMetrics);
  const [speech, setSpeech] = useState(INTRO_MESSAGE);
  const [activeSection, setActiveSection] = useState("home");
  const [sparkles, setSparkles] = useState([]);
  const [isPushing, setIsPushing] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [isBonked, setIsBonked] = useState(false);
  const [bonkBadge, setBonkBadge] = useState("OW");
  const [bonkCycle, setBonkCycle] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const sparkleTimerRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const introSettleTimerRef = useRef(null);
  const introHideTimerRef = useRef(null);
  const bonkTimerRef = useRef(null);
  const bonkResetTimerRef = useRef(null);
  const bonkCountRef = useRef(0);
  const lastBonkAtRef = useRef(0);
  const activeLabel = SECTION_LABELS[activeSection] ?? "Home";

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
    if (isOpen || showIntro) {
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
  }, [activeSection, isOpen, showIntro]);

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
    const updateIntroTarget = () => {
      setIntroTarget(getDockMetrics());
    };

    updateIntroTarget();
    setSpeech(INTRO_MESSAGE);
    lastScrollYRef.current = window.scrollY;

    introSettleTimerRef.current = window.setTimeout(() => {
      setIntroSettling(true);
    }, 1850);

    introHideTimerRef.current = window.setTimeout(() => {
      setShowIntro(false);
      setIntroSettling(false);
      setSpeech(CONTEXT_LINES.home[0]);
    }, 3000);

    window.addEventListener("resize", updateIntroTarget);

    return () => {
      window.removeEventListener("resize", updateIntroTarget);
      if (introSettleTimerRef.current) {
        window.clearTimeout(introSettleTimerRef.current);
      }
      if (introHideTimerRef.current) {
        window.clearTimeout(introHideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScrollMotion = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollYRef.current;
      lastScrollYRef.current = nextScrollY;

      if (showIntro || Math.abs(delta) < 4) {
        return;
      }

      setScrollDirection(delta > 0 ? "down" : "up");
      setIsPushing(true);

      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = window.setTimeout(() => {
        setIsPushing(false);
      }, 220);
    };

    window.addEventListener("scroll", handleScrollMotion, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollMotion);
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, [showIntro]);

  useEffect(() => {
    return () => {
      if (sparkleTimerRef.current) {
        window.clearTimeout(sparkleTimerRef.current);
      }
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
      if (bonkTimerRef.current) {
        window.clearTimeout(bonkTimerRef.current);
      }
      if (bonkResetTimerRef.current) {
        window.clearTimeout(bonkResetTimerRef.current);
      }
    };
  }, []);

  const emitSparkles = (
    count = 12,
    { hueStart = 210, hueRange = 80, spreadX = 180, spreadY = 150 } = {}
  ) => {
    if (sparkleTimerRef.current) {
      window.clearTimeout(sparkleTimerRef.current);
    }

    const generatedSparkles = Array.from({ length: count }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      x: `${Math.round((Math.random() - 0.5) * spreadX)}px`,
      y: `${Math.round((Math.random() - 0.5) * spreadY)}px`,
      size: `${Math.round(8 + Math.random() * 10)}px`,
      rotation: `${Math.round(Math.random() * 180)}deg`,
      delay: `${(Math.random() * 0.12).toFixed(2)}s`,
      hue: `${hueStart + Math.round(Math.random() * hueRange)}`,
    }));

    setSparkles(generatedSparkles);
    sparkleTimerRef.current = window.setTimeout(() => {
      setSparkles([]);
    }, 1100);
  };

  const restoreContextSpeech = () => {
    setSpeech(
      activeSection === "contact"
        ? "I will hang here quietly near the finish line."
        : randomItem(CONTEXT_LINES[activeSection] ?? CONTEXT_LINES.home)
    );
  };

  const triggerBonkReaction = () => {
    const now = Date.now();
    const nextCount =
      now - lastBonkAtRef.current < 1500
        ? Math.min(bonkCountRef.current + 1, BONK_REACTIONS.length)
        : 1;

    bonkCountRef.current = nextCount;
    lastBonkAtRef.current = now;

    if (bonkTimerRef.current) {
      window.clearTimeout(bonkTimerRef.current);
    }
    if (bonkResetTimerRef.current) {
      window.clearTimeout(bonkResetTimerRef.current);
    }

    const reaction = BONK_REACTIONS[nextCount - 1] ?? BONK_REACTIONS[0];
    setBonkBadge(reaction.badge);
    setSpeech(reaction.line);
    setIsBonked(true);
    setBonkCycle((current) => current + 1);

    emitSparkles(5 + nextCount * 2, {
      hueStart: nextCount >= 3 ? 350 : 18,
      hueRange: nextCount >= 3 ? 36 : 22,
      spreadX: 120,
      spreadY: 96,
    });

    bonkTimerRef.current = window.setTimeout(() => {
      setIsBonked(false);
    }, 520);

    bonkResetTimerRef.current = window.setTimeout(() => {
      bonkCountRef.current = 0;
      lastBonkAtRef.current = 0;
    }, 1700);
  };

  const handleClosePanel = () => {
    setIsOpen(false);
    restoreContextSpeech();
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
    <>
      {showIntro && (
        <div
          className={[
            "mascot-intro",
            introSettling ? "mascot-intro--settling" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            "--intro-dx": introTarget.translateX,
            "--intro-dy": introTarget.translateY,
          }}
          aria-live="polite"
        >
          <div className="mascot-intro__stage">
            <div className="mascot-intro__speech">
              <span className="mascot-intro__label">Quicki</span>
              <p>{INTRO_MESSAGE}</p>
            </div>

            <div className="mascot-intro__visual" aria-hidden="true">
              <QuickiBot
                variant="intro"
                isPartyMode={isPartyMode}
                isPushing={false}
                scrollDirection={scrollDirection}
                isTalking
              />
            </div>
          </div>
        </div>
      )}

      <aside
        className={[
          "mascot-assistant",
          showIntro ? "mascot-assistant--hidden" : "",
          isOpen ? "mascot-assistant--open" : "",
          isPartyMode ? "mascot-assistant--party" : "",
          isPushing ? `mascot-assistant--scroll-${scrollDirection}` : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Quicki assistant"
      >
        {!isOpen && (
          <div className="mascot-assistant__speech" aria-live="polite">
            <span className="mascot-assistant__speech-label">Quicki</span>
            <p>{speech}</p>
          </div>
        )}

        <div className="mascot-assistant__dock">
          {isOpen && (
            <div className="mascot-panel">
              <div className="mascot-panel__header">
                <div>
                  <p className="mascot-panel__eyebrow">Quick Actions</p>
                  <h3>Quicki control deck</h3>
                  <div className="mascot-panel__meta">
                    <span className="mascot-panel__status">Viewing {activeLabel}</span>
                    <span className="mascot-panel__meta-note">One tap away</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mascot-panel__close"
                  onClick={handleClosePanel}
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
                  <span className="mascot-action__copy">
                    <strong>Surprise Me</strong>
                  </span>
                  <span className="mascot-action__tag">Jump</span>
                </button>

                <button
                  type="button"
                  className="mascot-action"
                  onClick={handleThemeFlip}
                >
                  <span className="mascot-action__icon">
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </span>
                  <span className="mascot-action__copy">
                    <strong>Theme Flip</strong>
                  </span>
                  <span className="mascot-action__tag">Mood</span>
                </button>

                <button
                  type="button"
                  className="mascot-action"
                  onClick={handlePartyMode}
                >
                  <span className="mascot-action__icon">
                    <FaBolt />
                  </span>
                  <span className="mascot-action__copy">
                    <strong>{isPartyMode ? "Calm It Down" : "Party Mode"}</strong>
                  </span>
                  <span className="mascot-action__tag">Spark</span>
                </button>

                <button
                  type="button"
                  className="mascot-action mascot-action--primary"
                  onClick={handleContactWarp}
                >
                  <span className="mascot-action__icon">
                    <FaPaperPlane />
                  </span>
                  <span className="mascot-action__copy">
                    <strong>Contact Warp</strong>
                  </span>
                  <span className="mascot-action__tag">Reach</span>
                </button>
              </div>
            </div>
          )}

          <div className="mascot-assistant__anchor">
            <span className="mascot-assistant__push-trail" aria-hidden="true" />
            <span
              key={bonkCycle}
              className={[
                "mascot-assistant__bonk-badge",
                isBonked ? "mascot-assistant__bonk-badge--visible" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            >
              {bonkBadge}
            </span>

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
              className={[
                "mascot-trigger",
                isBonked ? "mascot-trigger--bonked" : "",
                isBonked ? `mascot-trigger--bonked-${bonkCycle % 2}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                triggerBonkReaction();

                if (!isOpen) {
                  setIsOpen(true);
                  emitSparkles(10);
                }
              }}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Bonk Quicki assistant" : "Open Quicki assistant"}
            >
              <QuickiBot
                variant="dock"
                isPartyMode={isPartyMode}
                isPushing={isPushing}
                scrollDirection={scrollDirection}
                isTalking={isPushing || isPartyMode}
                isBonked={isBonked}
                bonkCycle={bonkCycle}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MascotAssistant;
