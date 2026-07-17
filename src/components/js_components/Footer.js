import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css-files/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "HR Consultancy", path: "/hr-consultancy" },
  { label: "Contact", path: "/contact" },
];

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleLinkClick = (path) => {
    if (path === "/") {
      goHome();
      return;
    }

    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-brand-shell">
            <img
              src="/images/logo6.jpg"
              alt="OneQuickSolutions logo"
              className="footer-logo"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width="464"
              height="98"
            />
          </div>
          <p className="footer-description">
            OneQuickSolutions is a software development company helping
            businesses improve digital presence, software workflows, customer
            experience, recruitment support, and learning enablement.
          </p>
        </div>

        <div className="footer-column">
          <h4>Navigate</h4>
          <div className="footer-link-list">
            {quickLinks.map((link) => (
              <button
                key={link.path}
                type="button"
                className="footer-link-button"
                onClick={() => handleLinkClick(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <a className="footer-contact-row" href="mailto:onequicksolutionsinfo@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>onequicksolutionsinfo@gmail.com</span>
          </a>
          <a className="footer-contact-row" href="tel:+918073981290">
            <FontAwesomeIcon icon={faPhone} />
            <span>+91 8073981290</span>
          </a>
          <a className="footer-contact-row" href="tel:+919110863957">
            <FontAwesomeIcon icon={faPhone} />
            <span>+91 9110863957</span>
          </a>
        </div>

        <div className="footer-column">
          <h4>Start a conversation</h4>
          <p className="footer-column-copy">
            Share your project idea, redesign goal, software requirement, or
            recruitment need and we will help you identify the right next step.
          </p>
          <button
            type="button"
            className="footer-cta"
            onClick={() => handleLinkClick("/contact")}
          >
            Contact our team
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 OneQuickSolutions. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
