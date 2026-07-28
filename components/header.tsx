"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaChevronDown, FaMoon, FaSun, FaTimes } from "react-icons/fa";

import { companyInfo } from "@/data/site";
import { mainNavItems, serviceNavItems } from "@/data/navigation";

type HeaderProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

function isServicesActive(pathname: string) {
  const servicePaths = new Set(["/services", ...serviceNavItems.map((item) => item.href)]);
  return servicePaths.has(pathname);
}

function isPathActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/services") {
    return isServicesActive(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navGroupRef = useRef<HTMLDivElement | null>(null);

  const nextTheme = theme === "light" ? "dark" : "light";
  const themeLabel =
    nextTheme === "dark" ? "Switch to dark mode" : "Switch to light mode";

  const navItems = useMemo(() => mainNavItems, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsServicesOpen(false);
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

    const handleDocumentClick = (event: MouseEvent) => {
      if (!navGroupRef.current?.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("keydown", handleEsc);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
        <Link className="brand" href="/" aria-label="Go to homepage">
          <span className="brand-logo-shell">
            <img
              className="brand-logo"
              src={companyInfo.logoPath}
              alt={`${companyInfo.name} logo`}
              decoding="async"
              fetchPriority="high"
              width="464"
              height="98"
            />
          </span>
          <span className="brand-tagline">{companyInfo.tagline}</span>
        </Link>

        <div className="header-actions">
          <nav className="nav-links" aria-label="Main menu">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  ref={navGroupRef}
                  className={`nav-group ${isServicesActive(pathname ?? "/") ? "is-active" : ""}`}
                >
                  <button
                    type="button"
                    className={`nav-button nav-group__trigger ${isServicesActive(pathname ?? "/") ? "is-active" : ""}`}
                    onClick={() => setIsServicesOpen((current) => !current)}
                    aria-expanded={isServicesOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <FaChevronDown className={`nav-group__icon ${isServicesOpen ? "is-open" : ""}`} />
                  </button>
                  <div className={`nav-dropdown ${isServicesOpen ? "is-open" : ""}`}>
                    <div className="nav-dropdown__panel">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className="nav-dropdown__link">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "nav-button",
                    item.primary ? "nav-button--primary" : "",
                    isPathActive(pathname ?? "/", item.href) ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.label}
                </Link>
              ),
            )}
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
          onClick={() => setIsMenuOpen((current) => !current)}
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
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="modal-nav-group">
                  <Link
                    href={item.href}
                    className={`modal-nav-button ${isServicesActive(pathname ?? "/") ? "is-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                  <div className="modal-nav-group__children">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="modal-nav-sublink">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "modal-nav-button",
                    item.primary ? "modal-nav-button--primary" : "",
                    isPathActive(pathname ?? "/", item.href) ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}
