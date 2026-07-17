import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css-files/Header.css";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "HR Consultancy", path: "/hr-consultancy" },
  { name: "Contact", path: "/contact" },
];

function Header({ theme, onToggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((current) => !current);

  const goHome = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
    setIsMenuOpen(false);
  };

  const handleNavClick = (path) => {
    if (path === "/") {
      goHome();
      return;
    }

    navigate(path);
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
    };

    const handleResize = () => {
      if (window.innerWidth > 1180) {
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
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  const renderNavButton = (link, className) => {
    const isPrimary = link.path === "/contact";
    const isActive = location.pathname === link.path;

    return (
      <button
        key={link.path}
        type="button"
        className={[
          className,
          isPrimary ? `${className}--primary` : "",
          isActive ? "is-active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => handleNavClick(link.path)}
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
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
        <button
          type="button"
          className="brand"
          onClick={goHome}
          aria-label="Go to homepage"
        >
          <span className="brand-logo-shell">
            <img
              className="brand-logo"
              src="/images/logo6.jpg"
              alt="OneQuickSolutions logo"
              decoding="async"
              fetchpriority="high"
              width="464"
              height="98"
            />
          </span>
          <span className="brand-tagline">
            Software development, SaaS, AI, analytics, and digital transformation
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
