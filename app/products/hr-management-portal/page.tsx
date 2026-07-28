import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactFormSection } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { ProductSpotlightSection } from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "HR Management Portal | OneQuickSolutions",
  "Explore the OneQuickSolutions HR Management Portal, an internal product in development for structured company hiring workflows and candidate applications.",
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
        kicker="Internal product in development"
        title="HR Management Portal for structured hiring workflows"
        description="A role-based recruitment and HR workflow platform designed for companies, candidates and recruitment teams. This internal product demonstrates how OneQuickSolutions approaches structured hiring flow, access control and recruitment visibility."
        chips={["Companies", "Candidates", "Recruitment teams", "Role-based access"]}
        primaryAction={{ label: "Open company hiring flow", href: "https://hr.onequicksolutions.com/?userType=company" }}
        secondaryAction={{ label: "Open candidate application flow", href: "https://hr.onequicksolutions.com/?userType=candidate" }}
        highlights={[
          {
            title: "Accurate product status",
            copy: "This is presented as an internal product in development, not as a published client delivery.",
          },
          {
            title: "Role-based user paths",
            copy: "Companies and candidates can enter through dedicated paths designed for their side of the workflow.",
          },
          {
            title: "Workflow-focused design",
            copy: "The product direction covers candidate flow, recruiter coordination, hiring visibility and future reporting support.",
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
