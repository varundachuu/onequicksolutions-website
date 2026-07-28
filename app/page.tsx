import { buildMetadata, buildOrganizationSchema } from "@/lib/metadata";

import { ContactFormSection } from "@/components/contact-form";
import { FAQSection } from "@/components/faq";
import {
  AudienceSection,
  BusinessChallengesSection,
  EngagementModelsSection,
  SolutionsWeBuildSection,
} from "@/components/home-content";
import { HomeHero } from "@/components/home-hero";
import {
  DevelopmentProcessSection,
  homepageFaqs,
  PortfolioSection,
  ProductSpotlightSection,
  WhyChooseUsSection,
} from "@/components/sections";
import { ServiceGrid } from "@/components/service-grid";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Software, SaaS and Digital Solutions | OneQuickSolutions",
  "OneQuickSolutions is a founder-led technology startup providing custom software development, business websites, SaaS platforms, mobile applications, AI automation and data analytics solutions.",
  "/",
);

export default function HomePage() {
  return (
    <>
      <StructuredData data={buildOrganizationSchema()} />
      <HomeHero />
      <ServiceGrid />
      <BusinessChallengesSection />
      <AudienceSection />
      <SolutionsWeBuildSection />
      <DevelopmentProcessSection />
      <WhyChooseUsSection />
      <ProductSpotlightSection />
      <PortfolioSection showCta />
      <EngagementModelsSection />
      <FAQSection
        items={homepageFaqs}
        description="These answers help explain how we approach software, website and digital solution requirements before work begins."
      />
      <ContactFormSection
        sourcePath="/"
        heading="Have a Software or Digital Requirement?"
        description="Tell us about your business challenge, current process or product idea. We will help you identify a practical way to plan and approach the solution."
      />
    </>
  );
}
