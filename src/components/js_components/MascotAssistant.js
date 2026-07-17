import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaMoon,
  FaPaperPlane,
  FaSun,
  FaTimes,
} from "react-icons/fa";
import "../css-files/MascotAssistant.css";

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
    "Technology capabilities are lined up here. Want the service breakdown next?",
    "This section shows the tools and delivery strengths behind the work.",
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
  features: "Technologies",
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

const PARTY_IDLE_LINES = [
  "Party mode is live. Tap me for a neon mocktail refill.",
  "Quicki is on fizz duty. One click and I will take a sip.",
  "This is the tasteful chaos setting. Slightly ridiculous, still branded.",
];

const PARTY_REACTIONS = [
  {
    badge: "SIP",
    line: "First sip landed. Neon mocktail quality is unexpectedly elite.",
  },
  {
    badge: "GLOW",
    line: "Second sip. My eyes now have startup-founder confidence.",
  },
  {
    badge: "VIBE",
    line: "Okay yes, now we are in full rooftop robot vibes.",
  },
  {
    badge: "DANCE",
    line: "Turbo fizz engaged. Shoulder shuffle activated immediately.",
  },
  {
    badge: "DJ",
    line: "I can hear the gradients dancing. This feels extremely correct.",
  },
];

const PARTY_FLAVORS = [
  {
    name: "Neon Lime",
    primary: "#63f29c",
    secondary: "#1ed7c7",
    shadow: "rgba(30, 215, 199, 0.42)",
    hue: 152,
  },
  {
    name: "Berry Glow",
    primary: "#9d7cff",
    secondary: "#5aa8ff",
    shadow: "rgba(125, 92, 255, 0.42)",
    hue: 268,
  },
  {
    name: "Solar Citrus",
    primary: "#ffcb57",
    secondary: "#ff7e62",
    shadow: "rgba(255, 126, 98, 0.4)",
    hue: 28,
  },
];

const INTRO_SESSION_KEY = "onequicksolutions-quicki-intro-seen";

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const INTRO_MESSAGE = "Welcome to OneQuickSolutions";

const shouldShowIntro = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== "true";
};

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
  isSipping = false,
  isDancing = false,
  drinkFlavor = PARTY_FLAVORS[0],
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
        isSipping ? "quicki-bot--sipping" : "",
        isDancing ? "quicki-bot--dancing" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--quicki-party-primary": drinkFlavor.primary,
        "--quicki-party-secondary": drinkFlavor.secondary,
        "--quicki-party-shadow": drinkFlavor.shadow,
      }}
      aria-hidden="true"
    >
      <span className="quicki-bot__aura" />
      <span className="quicki-bot__shadow" />
      <span className="quicki-bot__antenna" />
      <span className="quicki-bot__arm quicki-bot__arm--left" />
      <span className="quicki-bot__arm quicki-bot__arm--right" />
      <span className="quicki-bot__drink">
        <span className="quicki-bot__drink-glass" />
        <span className="quicki-bot__drink-liquid" />
        <span className="quicki-bot__drink-straw" />
      </span>
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
      <span className="quicki-bot__party-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="quicki-bot__hover-ring" />
    </div>
  );
}

function MascotAssistant({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const [introSettling, setIntroSettling] = useState(false);
  const [introTarget, setIntroTarget] = useState(getDockMetrics);
  const [speech, setSpeech] = useState(INTRO_MESSAGE);
  const [activeSection, setActiveSection] = useState("home");
  const [sparkles, setSparkles] = useState([]);
  const [isPushing, setIsPushing] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("down");
  const [isBonked, setIsBonked] = useState(false);
  const [bonkCycle, setBonkCycle] = useState(0);
  const [isReactionBadgeVisible, setIsReactionBadgeVisible] = useState(false);
  const [reactionBadge, setReactionBadge] = useState("OW");
  const [reactionBadgeTone, setReactionBadgeTone] = useState("bonk");
  const [reactionCycle, setReactionCycle] = useState(0);
  const [partyFlavorIndex, setPartyFlavorIndex] = useState(0);
  const [isSipping, setIsSipping] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const triggerRef = useRef(null);
  const sparkleTimerRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const introSettleTimerRef = useRef(null);
  const introHideTimerRef = useRef(null);
  const bonkTimerRef = useRef(null);
  const badgeTimerRef = useRef(null);
  const bonkResetTimerRef = useRef(null);
  const bonkCountRef = useRef(0);
  const lastBonkAtRef = useRef(0);
  const partySipTimerRef = useRef(null);
  const partyDanceTimerRef = useRef(null);
  const partyResetTimerRef = useRef(null);
  const partyCountRef = useRef(0);
  const lastPartyAtRef = useRef(0);
  const activeLabel = SECTION_LABELS[activeSection] ?? "Home";
  const activeDrinkFlavor = PARTY_FLAVORS[partyFlavorIndex] ?? PARTY_FLAVORS[0];

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
    if (isOpen || showIntro || isBonked || isSipping) {
      return undefined;
    }

    const lines = isPartyMode
      ? PARTY_IDLE_LINES
      : CONTEXT_LINES[activeSection] ?? CONTEXT_LINES.home;
    setSpeech(lines[0]);

    const rotationTimer = window.setInterval(() => {
      setSpeech(randomItem(lines));
    }, 5200);

    return () => {
      window.clearInterval(rotationTimer);
    };
  }, [activeSection, isBonked, isOpen, isPartyMode, isSipping, showIntro]);

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
    const trigger = triggerRef.current;

    if (!trigger) {
      return undefined;
    }

    const resetLook = () => {
      trigger.style.setProperty("--quicki-look-x", "0rem");
      trigger.style.setProperty("--quicki-look-y", "0rem");
    };

    if (!isPartyMode || showIntro) {
      resetLook();
      return undefined;
    }

    let animationFrameId = 0;

    const handlePointerMove = (event) => {
      const offsetX = ((event.clientX / window.innerWidth) - 0.5) * 0.22;
      const offsetY = ((event.clientY / window.innerHeight) - 0.5) * 0.18;

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = window.requestAnimationFrame(() => {
        trigger.style.setProperty("--quicki-look-x", `${offsetX.toFixed(3)}rem`);
        trigger.style.setProperty("--quicki-look-y", `${offsetY.toFixed(3)}rem`);
      });
    };

    const handleWindowLeave = () => {
      resetLook();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handleWindowLeave);
    document.addEventListener("mouseleave", handleWindowLeave);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      resetLook();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleWindowLeave);
      document.removeEventListener("mouseleave", handleWindowLeave);
    };
  }, [isPartyMode, showIntro]);

  useEffect(() => {
    const updateIntroTarget = () => {
      setIntroTarget(getDockMetrics());
    };

    updateIntroTarget();
    lastScrollYRef.current = window.scrollY;

    if (!showIntro) {
      setSpeech(CONTEXT_LINES.home[0]);
      return undefined;
    }

    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    setSpeech(INTRO_MESSAGE);

    introSettleTimerRef.current = window.setTimeout(() => {
      setIntroSettling(true);
    }, 650);

    introHideTimerRef.current = window.setTimeout(() => {
      setShowIntro(false);
      setIntroSettling(false);
      setSpeech(CONTEXT_LINES.home[0]);
    }, 1300);

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
  }, [showIntro]);

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
      if (badgeTimerRef.current) {
        window.clearTimeout(badgeTimerRef.current);
      }
      if (bonkResetTimerRef.current) {
        window.clearTimeout(bonkResetTimerRef.current);
      }
      if (partySipTimerRef.current) {
        window.clearTimeout(partySipTimerRef.current);
      }
      if (partyDanceTimerRef.current) {
        window.clearTimeout(partyDanceTimerRef.current);
      }
      if (partyResetTimerRef.current) {
        window.clearTimeout(partyResetTimerRef.current);
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
      isPartyMode
        ? randomItem(PARTY_IDLE_LINES)
        : activeSection === "contact"
        ? "I will hang here quietly near the finish line."
        : randomItem(CONTEXT_LINES[activeSection] ?? CONTEXT_LINES.home)
    );
  };

  const showReactionBadge = (badge, tone = "bonk") => {
    if (badgeTimerRef.current) {
      window.clearTimeout(badgeTimerRef.current);
    }

    setReactionBadge(badge);
    setReactionBadgeTone(tone);
    setIsReactionBadgeVisible(true);
    setReactionCycle((current) => current + 1);

    badgeTimerRef.current = window.setTimeout(() => {
      setIsReactionBadgeVisible(false);
    }, 920);
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
    showReactionBadge(reaction.badge, "bonk");
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

  const triggerPartyReaction = () => {
    const now = Date.now();
    const nextCount =
      now - lastPartyAtRef.current < 4200
        ? Math.min(partyCountRef.current + 1, PARTY_REACTIONS.length)
        : 1;
    const nextFlavorIndex = (partyFlavorIndex + 1) % PARTY_FLAVORS.length;
    const nextFlavor = PARTY_FLAVORS[nextFlavorIndex] ?? PARTY_FLAVORS[0];
    const reaction = PARTY_REACTIONS[nextCount - 1] ?? PARTY_REACTIONS[0];

    partyCountRef.current = nextCount;
    lastPartyAtRef.current = now;

    if (partySipTimerRef.current) {
      window.clearTimeout(partySipTimerRef.current);
    }
    if (partyDanceTimerRef.current) {
      window.clearTimeout(partyDanceTimerRef.current);
    }
    if (partyResetTimerRef.current) {
      window.clearTimeout(partyResetTimerRef.current);
    }

    setPartyFlavorIndex(nextFlavorIndex);
    setSpeech(`${reaction.line} ${nextFlavor.name} just got poured.`);
    setIsSipping(true);
    showReactionBadge(reaction.badge, "party");
    emitSparkles(12 + nextCount * 2, {
      hueStart: nextFlavor.hue,
      hueRange: 36,
      spreadX: 150,
      spreadY: 120,
    });

    if (nextCount >= 4) {
      setIsDancing(true);
      emitSparkles(20, {
        hueStart: nextFlavor.hue,
        hueRange: 70,
        spreadX: 210,
        spreadY: 170,
      });
    }

    partySipTimerRef.current = window.setTimeout(() => {
      setIsSipping(false);
    }, 720);

    partyDanceTimerRef.current = window.setTimeout(() => {
      setIsDancing(false);
    }, nextCount >= 4 ? 1180 : 820);

    partyResetTimerRef.current = window.setTimeout(() => {
      partyCountRef.current = 0;
      lastPartyAtRef.current = 0;
    }, 4600);
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
    setPartyFlavorIndex(0);
    setIsSipping(false);
    setIsDancing(false);
    partyCountRef.current = 0;
    lastPartyAtRef.current = 0;
    emitSparkles(nextPartyState ? 18 : 10);
    setSpeech(
      nextPartyState
        ? "Party mode unlocked. Quicki mixed a neon mocktail and is feeling brave."
        : "Back to business mode. Quicki is behaving again."
    );

    if (partySipTimerRef.current) {
      window.clearTimeout(partySipTimerRef.current);
    }
    if (partyDanceTimerRef.current) {
      window.clearTimeout(partyDanceTimerRef.current);
    }
    if (partyResetTimerRef.current) {
      window.clearTimeout(partyResetTimerRef.current);
    }
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
              key={reactionCycle}
              className={[
                "mascot-assistant__bonk-badge",
                isReactionBadgeVisible
                  ? "mascot-assistant__bonk-badge--visible"
                  : "",
                `mascot-assistant__bonk-badge--${reactionBadgeTone}`,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            >
              {reactionBadge}
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
              ref={triggerRef}
              type="button"
              className={[
                "mascot-trigger",
                isBonked ? "mascot-trigger--bonked" : "",
                isBonked ? `mascot-trigger--bonked-${bonkCycle % 2}` : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (isPartyMode) {
                  triggerPartyReaction();
                } else {
                  triggerBonkReaction();
                }

                if (!isOpen) {
                  setIsOpen(true);
                  emitSparkles(10);
                }
              }}
              aria-expanded={isOpen}
              aria-label={
                isPartyMode
                  ? "Tap Quicki party mode"
                  : isOpen
                    ? "Bonk Quicki assistant"
                    : "Open Quicki assistant"
              }
            >
              <QuickiBot
                variant="dock"
                isPartyMode={isPartyMode}
                isPushing={isPushing}
                scrollDirection={scrollDirection}
                isTalking={isPushing || isPartyMode || isSipping}
                isBonked={isBonked}
                bonkCycle={bonkCycle}
                isSipping={isSipping}
                isDancing={isDancing}
                drinkFlavor={activeDrinkFlavor}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MascotAssistant;
