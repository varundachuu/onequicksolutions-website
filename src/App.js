import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Header from "./components/js_components/Header.js";
import Footer from "./components/js_components/Footer.js";
import MascotAssistant from "./components/js_components/MascotAssistant.js";
import HRConsultancyPage from "./components/js_components/HRConsultancyPage.js";
import HomePage from "./components/js_components/HomePage.js";
import ServicesPage from "./components/js_components/ServicesPage.js";
import AboutPage from "./components/js_components/AboutPage.js";
import ContactPage from "./components/js_components/ContactPage.js";
import SeoManager from "./components/js_components/SeoManager.js";

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

function AppShell() {
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const timerId = window.setTimeout(() => {
        const target = document.getElementById(targetId);
        const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;

        if (target) {
          const topPosition =
            target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

          window.scrollTo({
            top: Math.max(topPosition, 0),
            behavior: "smooth",
          });
        }
      }, 60);

      return () => window.clearTimeout(timerId);
    }

    window.scrollTo(0, 0);
    return undefined;
  }, [location.pathname, location.hash]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className={`App App--${theme}`}>
      <SeoManager pathname={location.pathname} />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hr-consultancy" element={<HRConsultancyPage />} />
        </Routes>
      </main>

      <MascotAssistant theme={theme} onToggleTheme={toggleTheme} />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppShell />
    </Router>
  );
}

export default App;
