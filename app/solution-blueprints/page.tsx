import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { FinalCtaBanner, PortfolioSection } from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Solution Blueprints | OneQuickSolutions",
  "Review representative solution blueprints that demonstrate the types of software, platforms and digital workflows OneQuickSolutions can plan and build.",
  "/solution-blueprints",
);

export default function SolutionBlueprintsPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solution Blueprints", path: "/solution-blueprints" },
        ])}
      />
      <PageHero
        kicker="Solution blueprints"
        title="Representative solution directions for real business needs"
        description="These solution blueprints illustrate the types of systems and digital platforms OneQuickSolutions can plan and develop. They are representative examples and are not presented as completed client projects."
        chips={["Software workflows", "Business websites", "SaaS MVPs", "Recruitment platforms"]}
        primaryAction={{ label: "Discuss a similar requirement", href: "/contact" }}
        secondaryAction={{ label: "Explore our services", href: "/services" }}
        highlights={[
          {
            title: "No invented client results",
            copy: "We use representative concepts to show capability rather than publishing fictional proof.",
          },
          {
            title: "Useful for early planning",
            copy: "These blueprints help clarify how a software, website or workflow project can be structured.",
          },
          {
            title: "Built around practical scenarios",
            copy: "Each blueprint reflects common business problems such as manual workflows, weak visibility or product planning gaps.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Solution Blueprints" }]} />
        }
      />
      <PortfolioSection />
      <FinalCtaBanner
        title="Have a business challenge that sounds similar?"
        description="Tell us about the process gap, product idea or digital requirement you want to explore and we will help identify a practical next step."
        buttonLabel="Discuss Your Requirement"
      />
    </>
  );
}
