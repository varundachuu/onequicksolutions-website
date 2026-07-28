"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBolt,
  FaMoon,
  FaPaperPlane,
  FaSun,
  FaTimes,
} from "react-icons/fa";

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
  products: [
    "Product mode spotted. This section is where the portal story gets interesting.",
    "There is a practical tool hiding here, not just a brochure moment.",
  ],
  programs: [
    "Programmes spotted. I call this the bonus round.",
    "There is more down here than people expect. Nice scroll.",
  ],
  contact: [
    "Perfect timing. I can nudge people straight into this section.",
    "Contact section reached. Mission almost complete.",
  ],
  "hr-consulting": [
    "Hiring mode activated. Quicki loves a specialized landing page.",
    "This page is focused. Want me to warp to the portal next?",
  ],
} as const;

const SECTION_LABELS = {
  home: "Home",
  about: "About",
  features: "Technologies",
  service: "Services",
  products: "Products",
  programs: "Programmes",
  contact: "Contact",
  "hr-consulting": "HR Consulting",
} as const;

const BONK_REACTIONS = [
  { badge: "OW", line: "Ow. That was a very direct click." },
  { badge: "HEY", line: "Easy. I am a mascot, not a punching bag." },
  { badge: "RUDE", line: "Quicki is filing a tiny workplace complaint." },
  { badge: "OKAY", line: "All right, all right. You definitely won that round." },
];

const PARTY_IDLE_LINES = [
  "Party mode is live. Tap me for a neon mocktail refill.",
  "Quicki is on fizz duty. One click and I will take a sip.",
  "This is the tasteful chaos setting. Slightly ridiculous, still branded.",
];

const PARTY_REACTIONS = [
  { badge: "SIP", line: "First sip landed. Neon mocktail quality is unexpectedly elite." },
  { badge: "GLOW", line: "Second sip. My eyes now have startup-founder confidence." },
  { badge: "VIBE", line: "Okay yes, now we are in full rooftop robot vibes." },
  { badge: "DANCE", line: "Turbo fizz engaged. Shoulder shuffle activated immediately." },
  { badge: "DJ", line: "I can hear the gradients dancing. This feels extremely correct." },
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
const INTRO_MESSAGE = "Welcome to OneQuickSolutions";

const randomItem = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

function getDockMetrics() {
  if (typeof window === "undefined") {
    return { translateX: "0px", translateY: "0px" };
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
}

function scrollToDocumentSection(sectionId: string) {
  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.getElementById(sectionId);
  const headerHeight = document.querySelector(".header")?.clientHeight ?? 0;

  if (!target) {
    return;
  }

  const topPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 14;
  window.scrollTo({ top: Math.max(topPosition, 0), behavior: "smooth" });
}

type MascotProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
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
}: {
  variant?: "dock" | "intro";
  isPartyMode?: boolean;
  isPushing?: boolean;
  scrollDirection?: "up" | "down";
  isTalking?: boolean;
  isBonked?: boolean;
  bonkCycle?: number;
  isSipping?: boolean;
  isDancing?: boolean;
  drinkFlavor?: (typeof PARTY_FLAVORS)[number];
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
        ["--quicki-party-primary" as string]: drinkFlavor.primary,
        ["--quicki-party-secondary" as string]: drinkFlavor.secondary,
        ["--quicki-party-shadow" as string]: drinkFlavor.shadow,
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

export function MascotAssistant({ theme, onToggleTheme }: MascotProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPartyMode, setIsPartyMode] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introSettling, setIntroSettling] = useState(false);
  const [introTarget, setIntroTarget] = useState(getDockMetrics());
  const [speech, setSpeech] = useState(INTRO_MESSAGE);
  const [isSpeechVisible, setIsSpeechVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<keyof typeof SECTION_LABELS>("home");
  const [sparkles, setSparkles] = useState<
    Array<{ id: string; x: string; y: string; size: string; rotation: string; delay: string; hue: string }>
  >([]);
  const [isPushing, setIsPushing] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [isBonked, setIsBonked] = useState(false);
  const [bonkCycle, setBonkCycle] = useState(0);
  const [isReactionBadgeVisible, setIsReactionBadgeVisible] = useState(false);
  const [reactionBadge, setReactionBadge] = useState("OW");
  const [reactionBadgeTone, setReactionBadgeTone] = useState("bonk");
  const [reactionCycle, setReactionCycle] = useState(0);
  const [partyFlavorIndex, setPartyFlavorIndex] = useState(0);
  const [isSipping, setIsSipping] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const speechTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const introSettleTimerRef = useRef<number | null>(null);
  const introHideTimerRef = useRef<number | null>(null);
  const sparkleTimerRef = useRef<number | null>(null);
  const bonkTimerRef = useRef<number | null>(null);
  const badgeTimerRef = useRef<number | null>(null);
  const bonkResetTimerRef = useRef<number | null>(null);
  const partySipTimerRef = useRef<number | null>(null);
  const partyDanceTimerRef = useRef<number | null>(null);
  const partyResetTimerRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const bonkCountRef = useRef(0);
  const lastBonkAtRef = useRef(0);
  const partyCountRef = useRef(0);
  const lastPartyAtRef = useRef(0);

  const activeLabel = SECTION_LABELS[activeSection] ?? "Home";
  const activeDrinkFlavor = PARTY_FLAVORS[partyFlavorIndex] ?? PARTY_FLAVORS[0];
  const assistantTone =
    pathname === "/hr-consulting" || activeSection === "home" || activeSection === "contact"
      ? "hero"
      : "body";

  function clearAllTimers() {
    [
      speechTimerRef,
      scrollTimerRef,
      introSettleTimerRef,
      introHideTimerRef,
      sparkleTimerRef,
      bonkTimerRef,
      badgeTimerRef,
      bonkResetTimerRef,
      partySipTimerRef,
      partyDanceTimerRef,
      partyResetTimerRef,
    ].forEach((ref) => {
      if (ref.current) {
        window.clearTimeout(ref.current);
        ref.current = null;
      }
    });
  }

  function showSpeechMessage(message: string, duration = 2400) {
    if (speechTimerRef.current) {
      window.clearTimeout(speechTimerRef.current);
    }

    setSpeech(message);
    setIsSpeechVisible(true);

    speechTimerRef.current = window.setTimeout(() => {
      setIsSpeechVisible(false);
      speechTimerRef.current = null;
    }, duration);
  }

  useEffect(() => {
    setIsOpen(false);

    const updateActiveSection = () => {
      if (pathname === "/hr-consulting") {
        setActiveSection("hr-consulting");
        return;
      }

      if (pathname !== "/") {
        setActiveSection("home");
        return;
      }

      const headerHeight = document.querySelector(".header")?.clientHeight ?? 0;
      const sections = ["about", "features", "service", "products", "programs", "contact"] as const;
      let currentSection: keyof typeof SECTION_LABELS = "home";

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && window.scrollY >= section.offsetTop - headerHeight - 120) {
          currentSection = sectionId;
        }
      });

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setIntroTarget(getDockMetrics());
    lastScrollYRef.current = window.scrollY;

    if (window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true") {
      return;
    }

    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    setShowIntro(true);
    setSpeech(INTRO_MESSAGE);

    const updateIntroTarget = () => setIntroTarget(getDockMetrics());
    window.addEventListener("resize", updateIntroTarget);

    introSettleTimerRef.current = window.setTimeout(() => {
      setIntroSettling(true);
    }, 650);

    introHideTimerRef.current = window.setTimeout(() => {
      setShowIntro(false);
      setIntroSettling(false);
      setSpeech(CONTEXT_LINES.home[0]);
    }, 1300);

    return () => {
      window.removeEventListener("resize", updateIntroTarget);
    };
  }, []);

  useEffect(() => {
    if (showIntro || isOpen || isBonked || isSipping) {
      return;
    }

    const lines = isPartyMode
      ? PARTY_IDLE_LINES
      : CONTEXT_LINES[activeSection] ?? CONTEXT_LINES.home;
    showSpeechMessage(randomItem(lines), activeSection === "contact" ? 2800 : 2200);
  }, [activeSection, isBonked, isOpen, isPartyMode, isSipping, showIntro]);

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
    return () => window.removeEventListener("scroll", handleScrollMotion);
  }, [showIntro]);

  useEffect(() => {
    if (!isPartyMode) {
      return;
    }

    const timer = window.setInterval(() => emitSparkles(14), 1800);
    return () => window.clearInterval(timer);
  }, [isPartyMode]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const resetLook = () => {
      trigger.style.setProperty("--quicki-look-x", "0rem");
      trigger.style.setProperty("--quicki-look-y", "0rem");
    };

    if (!isPartyMode || showIntro) {
      resetLook();
      return;
    }

    let animationFrameId = 0;

    const handlePointerMove = (event: PointerEvent) => {
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

    const handleWindowLeave = () => resetLook();

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
    return () => clearAllTimers();
  }, []);

  function emitSparkles(
    count = 12,
    { hueStart = 210, hueRange = 80, spreadX = 180, spreadY = 150 } = {},
  ) {
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
    sparkleTimerRef.current = window.setTimeout(() => setSparkles([]), 1100);
  }

  function showReactionBadge(badge: string, tone = "bonk") {
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
  }

  function triggerBonkReaction() {
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
    showSpeechMessage(reaction.line, 1800);
    setIsBonked(true);
    setBonkCycle((current) => current + 1);

    emitSparkles(5 + nextCount * 2, {
      hueStart: nextCount >= 3 ? 350 : 18,
      hueRange: nextCount >= 3 ? 36 : 22,
      spreadX: 120,
      spreadY: 96,
    });

    bonkTimerRef.current = window.setTimeout(() => setIsBonked(false), 520);
    bonkResetTimerRef.current = window.setTimeout(() => {
      bonkCountRef.current = 0;
      lastBonkAtRef.current = 0;
    }, 1700);
  }

  function triggerPartyReaction() {
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
    showSpeechMessage(`${reaction.line} ${nextFlavor.name} just got poured.`, 2200);
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

    partySipTimerRef.current = window.setTimeout(() => setIsSipping(false), 720);
    partyDanceTimerRef.current = window.setTimeout(() => setIsDancing(false), nextCount >= 4 ? 1180 : 820);
    partyResetTimerRef.current = window.setTimeout(() => {
      partyCountRef.current = 0;
      lastPartyAtRef.current = 0;
    }, 4600);
  }

  function handleThemeFlip() {
    onToggleTheme();
    emitSparkles(12);
    showSpeechMessage(
      theme === "light"
        ? "Night shift enabled. Moodier and shinier."
        : "Sun mode restored. Crisp and bright again.",
      2200,
    );
  }

  function handlePartyMode() {
    const nextPartyState = !isPartyMode;
    setIsPartyMode(nextPartyState);
    setPartyFlavorIndex(0);
    setIsSipping(false);
    setIsDancing(false);
    partyCountRef.current = 0;
    lastPartyAtRef.current = 0;
    emitSparkles(nextPartyState ? 18 : 10);
    showSpeechMessage(
      nextPartyState
        ? "Party mode unlocked. Quicki mixed a neon mocktail and is feeling brave."
        : "Back to business mode. Quicki is behaving again.",
      2400,
    );
  }

  function handleContactWarp() {
    emitSparkles(14);
    showSpeechMessage("Opening the contact section. Let us make something together.", 1800);
    setIsOpen(false);

    if (pathname === "/") {
      scrollToDocumentSection("contact");
      return;
    }

    if (pathname === "/contact") {
      scrollToDocumentSection("contact");
      return;
    }

    router.push("/contact");
  }

  const panelLink =
    pathname === "/hr-consulting" ? "/products/hr-management-portal" : "/contact";
  const panelLinkLabel =
    pathname === "/hr-consulting" ? "Portal route" : "Contact route";

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
            ["--intro-dx" as string]: introTarget.translateX,
            ["--intro-dy" as string]: introTarget.translateY,
          }}
          aria-live="polite"
        >
          <div className="mascot-intro__stage">
            <div className="mascot-intro__speech">
              <span className="mascot-intro__label">Quicki</span>
              <p>{INTRO_MESSAGE}</p>
            </div>

            <div className="mascot-intro__visual" aria-hidden="true">
              <QuickiBot variant="intro" isTalking />
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
          `mascot-assistant--tone-${assistantTone}`,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Quicki assistant"
      >
        {!isOpen && (
          <div
            className={[
              "mascot-assistant__speech",
              isSpeechVisible ? "mascot-assistant__speech--visible" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-live="polite"
          >
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
                    <span className="mascot-panel__meta-note">{panelLinkLabel}</span>
                  </div>
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
                <button type="button" className="mascot-action" onClick={handleThemeFlip}>
                  <span className="mascot-action__icon">
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                  </span>
                  <span className="mascot-action__copy">
                    <strong>Theme Flip</strong>
                  </span>
                  <span className="mascot-action__tag">Mood</span>
                </button>

                <button type="button" className="mascot-action" onClick={handlePartyMode}>
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

                <Link href={panelLink} className="mascot-action">
                  <span className="mascot-action__icon">
                    <FaPaperPlane />
                  </span>
                  <span className="mascot-action__copy">
                    <strong>{pathname === "/hr-consulting" ? "Open Portal Page" : "Open Contact Page"}</strong>
                  </span>
                  <span className="mascot-action__tag">Link</span>
                </Link>
              </div>
            </div>
          )}

          <div className="mascot-assistant__anchor">
            <span className="mascot-assistant__push-trail" aria-hidden="true" />
            <span
              key={reactionCycle}
              className={[
                "mascot-assistant__bonk-badge",
                isReactionBadgeVisible ? "mascot-assistant__bonk-badge--visible" : "",
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
                    ["--sparkle-x" as string]: sparkle.x,
                    ["--sparkle-y" as string]: sparkle.y,
                    ["--sparkle-size" as string]: sparkle.size,
                    ["--sparkle-rotation" as string]: sparkle.rotation,
                    ["--sparkle-delay" as string]: sparkle.delay,
                    ["--sparkle-color" as string]: `hsl(${sparkle.hue} 92% 62%)`,
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
                isPartyMode ? "Tap Quicki party mode" : isOpen ? "Bonk Quicki assistant" : "Open Quicki assistant"
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
