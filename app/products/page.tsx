import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { FinalCtaBanner, ProductSpotlightSection } from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Products | OneQuickSolutions",
  "Explore internal products and platform foundations from OneQuickSolutions, including the HR Management Portal in development.",
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
        title="Products and Platforms We Are Building"
        description="As an early-stage technology company, OneQuickSolutions is developing internal products and platform foundations that demonstrate our approach to workflow design, software development and role-based digital systems."
        chips={["Internal product", "HR workflow", "Role-based access", "Product foundation"]}
        primaryAction={{ label: "Explore the HR product", href: "/products/hr-management-portal" }}
        secondaryAction={{ label: "Contact our team", href: "/contact" }}
        highlights={[
          {
            title: "Built from real workflow needs",
            copy: "The product direction is shaped around practical business use rather than presentation-only ideas.",
          },
          {
            title: "Honest product positioning",
            copy: "We present these as internal product foundations, not as completed client projects.",
          },
          {
            title: "Ready to evolve",
            copy: "The platform can continue improving through feature validation, workflow refinement and future release phases.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
        }
      />
      <ProductSpotlightSection detailed />
      <FinalCtaBanner
        title="Interested in using or extending a OneQuickSolutions product?"
        description="Tell us whether you are exploring the HR portal for hiring, candidate onboarding or broader workflow planning."
      />
    </>
  );
}
