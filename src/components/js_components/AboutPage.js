import React from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "./PageHero";
import WhyChooseUs from "./whyChooseUs";
import AboutUs from "./About";
import Founders from "./Founders";
import ClientConfidence from "./ClientConfidence";
import "../css-files/ContentSections.css";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        kicker="About OneQuickSolutions"
        title="A practical software company focused on trust, clarity, and business usefulness"
        description="We help organizations modernize how they operate, communicate, and grow through digital products, premium web experiences, smarter workflows, and dependable ongoing support."
        chips={[
          "Mission and vision",
          "Business-first delivery",
          "Founders and partners",
          "Long-term collaboration",
        ]}
        primaryAction={{
          label: "Talk to our team",
          onClick: () => navigate("/contact"),
        }}
        secondaryAction={{
          label: "View our services",
          onClick: () => navigate("/services"),
        }}
        highlights={[
          {
            title: "Strategy and execution together",
            copy: "We bridge thinking and delivery so plans become usable outcomes, not just presentations.",
          },
          {
            title: "Modern, credible presentation",
            copy: "We care about how your brand feels to users because trust starts before the first conversation.",
          },
          {
            title: "Support beyond launch",
            copy: "Our goal is to stay useful as your business, platform, or process continues to evolve.",
          },
        ]}
      />

      <WhyChooseUs />
      <AboutUs />
      <Founders />
      <ClientConfidence />

      <section className="section-shell">
        <div className="section-inner">
          <div className="cta-banner surface-panel">
            <div>
              <span className="section-kicker">Build with confidence</span>
              <h2 className="section-title cta-banner__title">
                If you want a digital partner that stays practical and responsive, let&apos;s talk
              </h2>
              <p className="section-copy">
                We can help clarify the next best move whether you are starting from an idea, an existing platform, or an outdated website.
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

export default AboutPage;
