import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Components
import Header from "./components/js_components/Header.js";
import Footer from "./components/js_components/Footer.js";
import Features from "./components/js_components/Features.js";
import Founders from "./components/js_components/Founders.js";
import AboutUs from "./components/js_components/About.js";
import ContactUs from "./components/js_components/contactUs.js";
import Services from "./components/js_components/services.js";
import OtherServices from "./components/js_components/Other-Services.js"; // Programmes
import Products from "./components/js_components/Products.js";           // Product section
import WhyChooseUs from "./components/js_components/whyChooseUs.js";
import ScrollToTop from "./components/js_components/ScrollToTop.js";
import MascotAssistant from "./components/js_components/MascotAssistant.js";
import HRConsultancyPage from "./components/js_components/HRConsultancyPage.js";

// Assets
import heroBackground from "./Hero-Background_image/background.jpg";

const THEME_STORAGE_KEY = "onequicksolutions-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
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

function AppShell() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroElement = document.querySelector(".hero");
      if (heroElement) {
        heroElement.style.backgroundPosition = `center ${scrollY * 0.5}px`;
      }
      setShowScrollToTop(scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const targetId = location.hash.replace("#", "");
      const timerId = window.setTimeout(() => {
        scrollToDocumentSection(targetId);
      }, 60);

      return () => window.clearTimeout(timerId);
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [location.pathname, location.hash]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <div id="home" className={`App App--${theme}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section
                  className="hero"
                  style={{
                    backgroundImage: `url(${heroBackground})`,
                  }}
                >
                  <div className="hero-overlay">
                    <div className="hero-content">
                      <span className="hero-kicker">
                        SaaS platforms, growth systems, and digital products
                      </span>
                      <h1 className="animated-title">
                        Build a sharper digital presence with{" "}
                        <span className="brand-gradient">
                          OneQuickSolutions
                        </span>
                      </h1>
                      <p className="animated-description">
                        We design premium business experiences across{" "}
                        <span className="highlight">SaaS platforms</span>, web
                        development, marketing operations, and custom digital
                        solutions.
                      </p>

                      <div className="hero-actions">
                        <button
                          className="cta-button"
                          onClick={() => scrollToDocumentSection("about")}
                        >
                          Explore Our Work
                        </button>
                        <button
                          className="secondary-button"
                          onClick={() => scrollToDocumentSection("contact")}
                        >
                          Talk to Our Team
                        </button>
                      </div>

                      <div className="hero-stats" aria-label="Company highlights">
                        <div className="hero-stat-card">
                          <strong>End-to-end</strong>
                          <span>Strategy, design, build, and launch</span>
                        </div>
                        <div className="hero-stat-card">
                          <strong>Tailored delivery</strong>
                          <span>Solutions matched to your growth stage</span>
                        </div>
                        <div className="hero-stat-card">
                          <strong>Business-first</strong>
                          <span>Clear outcomes, not generic templates</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <WhyChooseUs />
                <AboutUs />
                <Features />
                <Services />
                <Products />
                <OtherServices />
                <Founders />
                <ContactUs />
              </>
            }
          />
          <Route path="/hr-consultancy" element={<HRConsultancyPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </main>

      <MascotAssistant theme={theme} onToggleTheme={toggleTheme} />

      {showScrollToTop && <ScrollToTop onClick={scrollToTop} />}

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
