import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css-files/Header.css";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";

const NAV_LINKS = [
  { name: "Home", id: "home", type: "home" },
  { name: "About", id: "about", type: "section" },
  { name: "Features", id: "features", type: "section" },
  { name: "Services", id: "service", type: "section" },
  { name: "Programmes", id: "other-services", type: "section" },
  {
    name: "HR Consultancy",
    id: "hr-consultancy",
    type: "route",
    path: "/hr-consultancy",
  },
  { name: "Contact Us", id: "contact", type: "section" },
];

const scrollToDocumentSection = (sectionId) => {
  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const section = document.getElementById(sectionId);
  const headerHeight = document.querySelector(".header")?.offsetHeight ?? 0;

  if (!section) {
    return;
  }

  const topPosition =
    section.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

  window.scrollTo({
    top: Math.max(topPosition, 0),
    behavior: "smooth",
  });
};

function Header({ theme, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((current) => !current);

  const handleLinkClick = (link) => {
    if (link.type === "route") {
      navigate(link.path);
      setActiveSection(link.id);
      setIsMenuOpen(false);
      return;
    }

    if (link.id === "home") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        scrollToDocumentSection("home");
      }

      setActiveSection("home");
      setIsMenuOpen(false);
      return;
    }

    if (location.pathname !== "/") {
      navigate({
        pathname: "/",
        hash: `#${link.id}`,
      });
    } else {
      scrollToDocumentSection(link.id);
    }

    setActiveSection(link.id);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      if (location.pathname !== "/") {
        setActiveSection(
          location.pathname === "/hr-consultancy" ? "hr-consultancy" : "home"
        );
        return;
      }

      const headerHeight =
        document.querySelector(".header")?.offsetHeight ?? 0;
      let currentSection = "home";

      NAV_LINKS.forEach((link) => {
        if (link.type !== "section") {
          return;
        }

        const section = document.getElementById(link.id);
        if (!section) {
          return;
        }

        if (window.scrollY >= section.offsetTop - headerHeight - 120) {
          currentSection = link.id;
        }
      });

      setActiveSection(currentSection);
    };

    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };

    handleScroll();

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  const renderNavButton = (link, className) => {
    const isPrimary = link.id === "contact";
    const isActive =
      link.type === "route"
        ? location.pathname === link.path
        : location.pathname === "/" && activeSection === link.id;

    return (
      <button
        key={link.id}
        type="button"
        className={[
          className,
          isPrimary ? `${className}--primary` : "",
          isActive ? "is-active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => handleLinkClick(link)}
      >
        {link.name}
      </button>
    );
  };

  const nextTheme = theme === "light" ? "dark" : "light";
  const themeLabel =
    nextTheme === "dark" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <>
      <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
        <button
          type="button"
          className="brand"
          onClick={() => handleLinkClick(NAV_LINKS[0])}
          aria-label="Go to home section"
        >
          <span className="brand-logo-shell">
            <img
              className="brand-logo"
              src="/images/logo6.jpg"
              alt="One Quick Solutions"
            />
          </span>
          <span className="brand-tagline">
            SaaS, web, and digital transformation
          </span>
        </button>

        <div className="header-actions">
          <nav className="nav-links" aria-label="Main menu">
            {NAV_LINKS.map((link) => renderNavButton(link, "nav-button"))}
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={themeLabel}
            aria-pressed={theme === "dark"}
            title={themeLabel}
          >
            <span className="theme-toggle__icon" aria-hidden="true">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </span>
            <span className="theme-toggle__text">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>
        </div>

        <button
          type="button"
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div
        className={`side-modal ${isMenuOpen ? "visible" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      >
        <div
          id="mobile-menu"
          className="modal-content"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="modal-top">
            <div>
              <p className="modal-eyebrow">Navigate</p>
              <h2 className="modal-title">Explore the site</h2>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className="modal-links">
            {NAV_LINKS.map((link) => renderNavButton(link, "modal-nav-button"))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

