import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import {
  AboutSection,
  ClientConfidenceSection,
  FinalCtaBanner,
  FoundersSection,
  WhyChooseUsSection,
} from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "About Us | OneQuickSolutions",
  "Learn about the mission, vision, approach, founders, and business-first delivery philosophy behind OneQuickSolutions.",
  "/about-us",
);

export default function AboutUsPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about-us" },
        ])}
      />
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
        primaryAction={{ label: "Talk to our team", href: "/contact" }}
        secondaryAction={{ label: "View our services", href: "/services" }}
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
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
        }
      />
      <WhyChooseUsSection />
      <AboutSection />
      <FoundersSection />
      <ClientConfidenceSection />
      <FinalCtaBanner
        title="If you want a digital partner that stays practical and responsive, let’s talk"
        description="We can help clarify the next best move whether you are starting from an idea, an existing platform, or an outdated website."
        buttonLabel="Contact OneQuickSolutions"
      />
    </>
  );
}
