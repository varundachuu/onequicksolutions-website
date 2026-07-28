import Link from "next/link";
import { FaArrowRight, FaEnvelope, FaPhone } from "react-icons/fa6";

import { footerLegalLinks, footerQuickLinks, serviceNavItems } from "@/data/navigation";
import { companyInfo } from "@/data/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-brand-shell">
            <img
              src={companyInfo.logoPath}
              alt={`${companyInfo.name} logo`}
              className="footer-logo"
              loading="lazy"
              decoding="async"
              width="464"
              height="98"
            />
          </div>
          <p className="footer-description">{companyInfo.description}</p>
        </div>

        <div className="footer-column">
          <h4>Navigate</h4>
          <div className="footer-link-list">
            {footerQuickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link-anchor">
                {link.label}
              </Link>
            ))}
            {footerLegalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link-anchor">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Services</h4>
          <div className="footer-link-list">
            {serviceNavItems.slice(0, 6).map((link) => (
              <Link key={link.href} href={link.href} className="footer-link-anchor">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>
          <a className="footer-contact-row" href={`mailto:${companyInfo.email}`}>
            <FaEnvelope />
            <span>{companyInfo.email}</span>
          </a>
          <a className="footer-contact-row" href="tel:+918073981290">
            <FaPhone />
            <span>{companyInfo.phones[0]}</span>
          </a>
          <a className="footer-contact-row" href="tel:+919110863957">
            <FaPhone />
            <span>{companyInfo.phones[1]}</span>
          </a>
          <p className="footer-column-copy">
            Share your project idea, redesign goal, software requirement, or recruitment need and
            we will help you identify the right next step.
          </p>
          <Link href="/contact" className="footer-cta">
            Contact our team
            <FaArrowRight />
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 {companyInfo.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
