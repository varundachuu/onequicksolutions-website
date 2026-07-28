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
  "Explore software development, SaaS platforms, business websites, mobile applications, AI automation, data analytics, cloud solutions and UI/UX services from OneQuickSolutions.",
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
        title="Software and Digital Services for Startups and Growing Businesses"
        description="OneQuickSolutions provides software development, SaaS platforms, websites, mobile applications, AI automation, data analytics, cloud solutions and UI/UX services. Our services are designed to help businesses replace manual processes, improve operational visibility, build digital products and create stronger online experiences."
        chips={[
          "Custom software",
          "Business websites",
          "SaaS platforms",
          "Mobile applications",
          "AI and analytics",
        ]}
        primaryAction={{ label: "Discuss Your Requirement", href: "/contact" }}
        secondaryAction={{ label: "Explore products", href: "/products" }}
        highlights={[
          {
            title: "Focused around practical business needs",
            copy: "We shape delivery around workflows, users, reporting needs and real operational outcomes.",
          },
          {
            title: "Designed for startups and growing businesses",
            copy: "The service mix supports product ideas, process improvement, internal systems and stronger digital presence.",
          },
          {
            title: "Founder-led communication",
            copy: "The conversation stays close to planning, delivery structure and practical next steps.",
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
            <h2 className="section-title">A complete service view without inflated claims</h2>
            <p className="section-copy">
              The homepage prioritises software, business websites and SaaS platform work, while
              this page shows the wider set of services that can support internal workflows, mobile
              delivery, AI automation, reporting, deployment and specialist business needs.
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
