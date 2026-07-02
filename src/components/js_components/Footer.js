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
  { label: "Home", id: "home", type: "home" },
  { label: "About", id: "about", type: "section" },
  { label: "Features", id: "features", type: "section" },
  { label: "Services", id: "service", type: "section" },
  { label: "Programmes", id: "other-services", type: "section" },
  {
    label: "HR Consultancy",
    id: "hr-consultancy",
    type: "route",
    path: "/hr-consultancy",
  },
  { label: "Contact", id: "contact", type: "section" },
];

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

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (link) => {
    if (link.type === "route") {
      navigate(link.path);
      return;
    }

    if (link.id === "home") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        scrollToDocumentSection("home");
      }

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
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-brand-shell">
            <img src="/images/logo6.jpg" alt="OneQuickSolutions" className="footer-logo" />
          </div>
          <p className="footer-description">
            OneQuickSolutions creates polished digital systems for businesses
            that want clearer operations, stronger branding, and better online
            delivery.
          </p>
        </div>

        <div className="footer-column">
          <h4>Quick links</h4>
          <div className="footer-link-list">
            {quickLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className="footer-link-button"
                onClick={() => handleLinkClick(link)}
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
            Share your idea, process gap, or product goal and we will help you
            map a smart next step.
          </p>
          <button
            type="button"
            className="footer-cta"
            onClick={() => handleLinkClick({ id: "contact", type: "section" })}
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
};

export default Footer;
