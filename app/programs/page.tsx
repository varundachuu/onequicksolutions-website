import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { programFaqs } from "@/data/faqs";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactFormSection } from "@/components/contact-form";
import { FAQSection } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { TrainingProgramsSection } from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

export const metadata = buildMetadata(
  "Training and Education Programmes | OneQuickSolutions",
  "Explore E-Shikshana and training enablement programmes from OneQuickSolutions for learners, institutions, and teams adopting new digital workflows.",
  "/programs",
);

export default function ProgramsPage() {
  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Programs", path: "/programs" },
        ])}
      />
      <PageHero
        kicker="Training and education"
        title="Programmes that help people learn, adapt, and build confidence"
        description="Our training and education programmes support learners, institutions, and teams with clearer learning experiences, practical enablement, and capability-building support."
        chips={["E-Shikshana", "Team enablement", "Practical learning"]}
        primaryAction={{ label: "Discuss a programme", href: "/contact" }}
        secondaryAction={{ label: "Explore our services", href: "/services" }}
        highlights={[
          {
            title: "Accessible learning",
            copy: "Structured programmes that make learning easier to start and sustain.",
          },
          {
            title: "Practical capability",
            copy: "Support designed around real skills, workflows, and adoption needs.",
          },
          {
            title: "Flexible delivery",
            copy: "Useful for individuals, institutions, and teams at different stages of growth.",
          },
        ]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Programs" }]} />
        }
      />
      <TrainingProgramsSection />
      <FAQSection
        items={programFaqs}
        title="Common questions about our training and education programmes"
        description="These answers help explain how E-Shikshana and training enablement can support learners, teams, and institutions."
      />
      <ContactFormSection
        sourcePath="/programs"
        defaultService="Training and Education"
        kicker="Programme enquiry"
        heading="Planning a learning or enablement initiative?"
        description="Tell us about the learners, the capability gap, or the new system your team needs people to adopt more confidently."
      />
    </>
  );
}
