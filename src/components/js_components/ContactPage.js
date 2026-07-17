import React from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "./PageHero";
import ContactUs from "./contactUs";
import FaqSection from "./FaqSection";
import { faqItems } from "../../content/siteContent";
import "../css-files/ContentSections.css";

function ContactPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        kicker="Contact OneQuickSolutions"
        title="Let&apos;s discuss the website, software, app, or workflow you want to improve"
        description="Share your business goal, process gap, or product idea and we will help you identify a practical direction for design, development, launch, and ongoing support."
        chips={[
          "Project discovery",
          "Website redesign",
          "Software and SaaS",
          "AI, analytics, cloud",
          "HR and training support",
        ]}
        primaryAction={{
          label: "View our services",
          onClick: () => navigate("/services"),
        }}
        secondaryAction={{
          label: "Explore HR consultancy",
          onClick: () => navigate("/hr-consultancy"),
        }}
        highlights={[
          {
            title: "Clear next steps",
            copy: "We focus on helping you understand the right scope and priority before work begins.",
          },
          {
            title: "Faster conversations",
            copy: "The more context you share, the easier it is for us to guide you toward a useful solution path.",
          },
          {
            title: "Suitable for different project stages",
            copy: "We can support new ideas, redesigns, process improvement, or existing platform enhancements.",
          },
        ]}
      />

      <ContactUs />
      <FaqSection
        items={faqItems}
        description="If you are planning a conversation with our team, these answers will help you understand how we approach projects and support."
      />
    </>
  );
}

export default ContactPage;
