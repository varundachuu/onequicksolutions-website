import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import {
  DevelopmentProcessSection,
  FinalCtaBanner,
  IndustriesSection,
  TechnologySection,
} from "@/components/sections";
import { ServiceGrid } from "@/components/service-grid";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Software Development Services | OneQuickSolutions",
  "Explore custom software, SaaS platforms, websites, mobile applications, AI automation and data analytics services from OneQuickSolutions.",
  "/services",
);

export default function ServicesPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        kicker="Software development services"
        title="Software and Digital Solutions Built Around Your Business"
        description="OneQuickSolutions helps businesses modernize how they look, launch, operate, and grow with service coverage across software, websites, SaaS, mobile, AI, analytics, cloud, UI/UX, and hiring support."
        chips={[
          "Business websites",
          "Custom software",
          "SaaS platforms",
          "AI and analytics",
          "Cloud and UX support",
        ]}
        primaryAction={{ label: "Talk to our team", href: "/contact" }}
        secondaryAction={{ label: "Explore products", href: "/products" }}
        highlights={[
          {
            title: "Practical business fit",
            copy: "We shape delivery around workflows, customer experience, and long-term usefulness.",
          },
          {
            title: "Cross-functional support",
            copy: "Design, development, analytics, cloud thinking, and launch support stay connected.",
          },
          {
            title: "Built for clearer decisions",
            copy: "Our work is designed to improve visibility, trust, and operational confidence.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
        }
      />

      <section className="section-shell">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Overview</span>
            <h2 className="section-title">One partner for public-facing and internal digital delivery</h2>
            <p className="section-copy">
              We support both how your business appears to customers and how it performs behind the
              scenes. That includes websites, software workflows, portals, dashboards, AI-assisted
              processes, and the supporting design and hosting decisions around them.
            </p>
          </div>
        </div>
      </section>

      <ServiceGrid variant="page" />
      <DevelopmentProcessSection />
      <IndustriesSection />
      <TechnologySection />
      <FinalCtaBanner
        title="Need help choosing the right service or next step?"
        description="Tell us the business problem, the system gap, or the growth goal you are trying to solve and we will help you identify the most practical direction."
        buttonLabel="Start the conversation"
      />
    </>
  );
}
