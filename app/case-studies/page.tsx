import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import {
  ClientConfidenceSection,
  FinalCtaBanner,
  PortfolioSection,
} from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Case Studies and Solution Examples | OneQuickSolutions",
  "Review representative solution blueprints and practical digital implementation examples from OneQuickSolutions.",
  "/case-studies",
);

export default function CaseStudiesPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ])}
      />
      <PageHero
        kicker="Case studies and solution examples"
        title="Representative digital solution blueprints that show how we think"
        description="We do not publish fictional client wins. Instead, we show realistic implementation directions that reflect the types of problems and outcomes OneQuickSolutions is designed to support."
        chips={["Websites", "SaaS", "Recruitment", "Training", "Operations"]}
        primaryAction={{ label: "Discuss a similar project", href: "/contact" }}
        secondaryAction={{ label: "Explore our services", href: "/services" }}
        highlights={[
          {
            title: "No invented claims",
            copy: "These are representative delivery blueprints rather than fabricated public case studies.",
          },
          {
            title: "Useful for early planning",
            copy: "They help show the kind of workflow, structure, and outcome direction a project can take.",
          },
          {
            title: "Built around real business contexts",
            copy: "Each example reflects practical operational or growth-focused needs.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Case Studies" }]} />
        }
      />
      <PortfolioSection />
      <ClientConfidenceSection />
      <FinalCtaBanner
        title="Have a project that sounds similar to one of these solution directions?"
        description="Share the challenge, the users involved, and the outcome you want so we can shape the most practical next step."
      />
    </>
  );
}
