import React from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "./PageHero";
import Services from "./services";
import ProductSpotlight from "./ProductSpotlight";
import Products from "./Products";
import Features from "./Features";
import Industries from "./Industries";
import Portfolio from "./Portfolio";
import OtherServices from "./Other-Services";
import FaqSection from "./FaqSection";
import { faqItems } from "../../content/siteContent";
import "../css-files/ContentSections.css";

function ServicesPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        kicker="Software development services"
        title="Digital services built to improve how your business operates, presents, and grows"
        description="OneQuickSolutions combines custom software development, websites, mobile apps, SaaS delivery, AI, analytics, cloud support, HR consulting, and training enablement into one practical service ecosystem."
        chips={[
          "Custom software",
          "Web and mobile",
          "SaaS and cloud",
          "AI and analytics",
          "HR and training",
        ]}
        primaryAction={{
          label: "Start a project conversation",
          onClick: () => navigate("/contact"),
        }}
        secondaryAction={{
          label: "Explore HR consultancy",
          onClick: () => navigate("/hr-consultancy"),
        }}
        highlights={[
          {
            title: "Business-aware planning",
            copy: "We shape services around the outcome you need, not a fixed template.",
          },
          {
            title: "Cross-functional execution",
            copy: "Design, development, data, cloud, and support can move together in one delivery flow.",
          },
          {
            title: "Lead and operations impact",
            copy: "The goal is not just better visuals, but stronger conversion, clarity, and day-to-day usefulness.",
          },
        ]}
      />

      <Services variant="page" />
      <ProductSpotlight />
      <OtherServices />
      <Products />
      <Features />
      <Industries />
      <Portfolio onPrimaryCta={() => navigate("/contact")} />
      <FaqSection
        items={faqItems}
        description="If you are comparing partners, these are the practical questions that usually matter most before deciding how to move forward."
      />

      <section className="section-shell">
        <div className="section-inner">
          <div className="cta-banner surface-panel">
            <div>
              <span className="section-kicker">Ready to move</span>
              <h2 className="section-title cta-banner__title">
                Tell us what you need to build, improve, or modernize
              </h2>
              <p className="section-copy">
                We can help you shape the right scope, user journey, and technical approach before development starts.
              </p>
            </div>

            <div className="cta-banner__actions">
              <button
                type="button"
                className="section-action__button"
                onClick={() => navigate("/contact")}
              >
                Contact OneQuickSolutions
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
