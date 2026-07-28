import { buildMetadata, buildOrganizationSchema } from "@/lib/metadata";

import { ContactFormSection } from "@/components/contact-form";
import { FAQSection } from "@/components/faq";
import { HomeHero } from "@/components/home-hero";
import {
  ClientConfidenceSection,
  DevelopmentProcessSection,
  homepageFaqs,
  IndustriesSection,
  PortfolioSection,
  ProductSpotlightSection,
  TechnologySection,
  TrainingProgramsSection,
  WhyChooseUsSection,
} from "@/components/sections";
import { ServiceGrid } from "@/components/service-grid";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Software Development Company | OneQuickSolutions",
  "OneQuickSolutions helps businesses build premium websites, custom software, SaaS platforms, AI workflows, analytics dashboards, HR systems, and digital training experiences.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <StructuredData data={buildOrganizationSchema()} />
      <HomeHero />
      <WhyChooseUsSection />
      <ServiceGrid />
      <ProductSpotlightSection />
      <DevelopmentProcessSection />
      <TechnologySection />
      <IndustriesSection />
      <PortfolioSection showCta />
      <TrainingProgramsSection showFaqLink />
      <ClientConfidenceSection />
      <FAQSection
        items={homepageFaqs}
        description="If you are planning a conversation with our team, these answers will help you understand how we approach projects and support."
      />
      <ContactFormSection sourcePath="/" />
    </>
  );
}
