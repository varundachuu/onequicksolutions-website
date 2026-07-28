import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { FinalCtaBanner, ProductSpotlightSection } from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Products | OneQuickSolutions",
  "Explore focused digital products from OneQuickSolutions, including the HR Management Portal built to support companies and candidates through a structured hiring flow.",
  "/products",
);

export default function ProductsPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      <PageHero
        kicker="Products"
        title="Focused digital products that extend our service delivery"
        description="Alongside service work, OneQuickSolutions is building practical digital products designed to make business workflows clearer, more structured, and easier to scale."
        chips={["HR portal", "Role-based access", "Hiring workflow", "Operational clarity"]}
        primaryAction={{ label: "Explore the HR product", href: "/products/hr-management-portal" }}
        secondaryAction={{ label: "Contact our team", href: "/contact" }}
        highlights={[
          {
            title: "Built from real workflow needs",
            copy: "Product ideas are shaped around practical business use rather than novelty.",
          },
          {
            title: "Connected to delivery experience",
            copy: "Products grow out of the same problem-solving mindset used across our service work.",
          },
          {
            title: "Ready to evolve with feedback",
            copy: "We focus on structured rollout and improvement rather than static one-time releases.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
        }
      />
      <ProductSpotlightSection detailed />
      <FinalCtaBanner
        title="Interested in using or extending a OneQuickSolutions product?"
        description="Tell us whether you are exploring the HR portal for hiring, candidate onboarding, or broader workflow collaboration."
      />
    </>
  );
}
