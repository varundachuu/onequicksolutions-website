import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { generalFaqs } from "@/data/faqs";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactFormSection } from "@/components/contact-form";
import { FAQSection } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Contact OneQuickSolutions | Website, Software, SaaS, AI and HR Enquiries",
  "Contact OneQuickSolutions to discuss websites, custom software, SaaS products, AI workflows, analytics dashboards, HR consulting, and digital training support.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero
        kicker="Contact OneQuickSolutions"
        title="Let’s discuss the website, software, app, or workflow you want to improve"
        description="Share your business goal, process gap, or product idea and we will help you identify a practical direction for design, development, launch, and ongoing support."
        chips={[
          "Project discovery",
          "Website redesign",
          "Software and SaaS",
          "AI, analytics, cloud",
          "HR and training support",
        ]}
        primaryAction={{ label: "View our services", href: "/services" }}
        secondaryAction={{ label: "Explore HR consulting", href: "/hr-consulting" }}
        highlights={[
          {
            title: "Clear next steps",
            copy: "We focus on helping you understand the right scope and priority before work begins.",
          },
          {
            title: "Faster conversations",
            copy: "The more context you share, the easier it is for us to guide you toward a useful solution path.",
          },
          {
            title: "Suitable for different project stages",
            copy: "We can support new ideas, redesigns, process improvement, or existing platform enhancements.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        }
      />
      <ContactFormSection sourcePath="/contact" />
      <FAQSection
        items={generalFaqs}
        description="If you are planning a conversation with our team, these answers will help you understand how we approach projects and support."
      />
    </>
  );
}
