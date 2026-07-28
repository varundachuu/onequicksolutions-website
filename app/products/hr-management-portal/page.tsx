import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactFormSection } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { ProductSpotlightSection } from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "HR Management Portal | OneQuickSolutions",
  "Explore the OneQuickSolutions HR Management Portal for company hiring workflows, candidate applications, and structured recruitment coordination.",
  "/products/hr-management-portal",
);

export default function HrManagementPortalPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: "HR Management Portal", path: "/products/hr-management-portal" },
        ])}
      />
      <PageHero
        kicker="Featured product"
        title="HR Management Portal for structured hiring workflows"
        description="This product brings employers, candidates, and recruitment coordination into a cleaner digital flow with role-based access, guided entry points, and clearer visibility into hiring activity."
        chips={["Companies", "Candidates", "Role-based access", "Recruitment visibility"]}
        primaryAction={{ label: "Open company hiring flow", href: "https://hr.onequicksolutions.com/?userType=company" }}
        secondaryAction={{ label: "Open candidate application flow", href: "https://hr.onequicksolutions.com/?userType=candidate" }}
        highlights={[
          {
            title: "Company-ready entry",
            copy: "Businesses can begin their hiring flow through a dedicated company path.",
          },
          {
            title: "Candidate-ready entry",
            copy: "Candidates can create profiles, continue through applications, and stay in a structured process.",
          },
          {
            title: "Built for clearer coordination",
            copy: "The portal supports recruiter workflow, shortlist movement, and future hiring visibility improvements.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: "HR Management Portal" },
            ]}
          />
        }
      />
      <ProductSpotlightSection detailed />
      <ContactFormSection
        sourcePath="/products/hr-management-portal"
        defaultService="HR Consulting"
        kicker="Portal enquiry"
        heading="Want to discuss hiring access, workflow setup, or partnership support?"
        description="Tell us whether you are a company exploring the hiring portal, a candidate looking for the right route, or a team planning to expand the recruitment workflow."
      />
    </>
  );
}
