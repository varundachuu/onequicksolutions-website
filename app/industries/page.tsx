import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import {
  FinalCtaBanner,
  IndustriesSection,
  PortfolioSection,
  TechnologySection,
} from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Industries We Serve | OneQuickSolutions",
  "See how OneQuickSolutions supports startups, SMEs, enterprises, educational institutions, recruitment teams, and geospatial organizations.",
  "/industries",
);

export default function IndustriesPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
        ])}
      />
      <PageHero
        kicker="Industries we serve"
        title="Digital delivery shaped for different business realities"
        description="We support organizations at different growth stages, from startups building early momentum to larger teams improving systems, visibility, and public presentation."
        chips={[
          "Startups",
          "SMEs",
          "Enterprises",
          "Educational institutions",
          "Recruitment and geospatial teams",
        ]}
        primaryAction={{ label: "Discuss your business need", href: "/contact" }}
        secondaryAction={{ label: "Explore services", href: "/services" }}
        highlights={[
          {
            title: "Flexible delivery approach",
            copy: "We adapt the scope, pace, and structure to the team size and operational reality.",
          },
          {
            title: "Useful across public and internal systems",
            copy: "That includes websites, software, dashboards, product workflows, and recruitment support.",
          },
          {
            title: "Built for practical outcomes",
            copy: "The goal is better clarity, trust, and day-to-day usefulness, not just launch activity.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Industries" }]} />
        }
      />
      <IndustriesSection />
      <TechnologySection />
      <PortfolioSection showCta />
      <FinalCtaBanner
        title="Want to see how the right service mix fits your industry?"
        description="Tell us about the business model, users, and workflow challenges you are dealing with, and we will help map the right direction."
      />
    </>
  );
}
