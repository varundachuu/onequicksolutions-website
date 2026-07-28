import { buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";

export const metadata = buildMetadata(
  "Terms and Conditions | OneQuickSolutions",
  "Read the current terms and conditions placeholder for OneQuickSolutions. This page will be updated with the final legal terms.",
  "/terms-and-conditions",
);

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        kicker="Terms and conditions"
        title="Terms placeholder"
        description="This public page is a temporary placeholder until the final terms and conditions text is approved and published."
        primaryAction={{ label: "Contact our team", href: "/contact" }}
        secondaryAction={{ label: "Return home", href: "/" }}
        breadcrumbs={
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Terms and Conditions" }]}
          />
        }
      />
      <section className="section-shell">
        <div className="section-inner copy-page">
          <p>
            Project scope, delivery phases, ownership, payment, maintenance, and acceptance terms
            should be defined formally in the approved legal version of this page or in project
            agreements shared directly with clients.
          </p>
          <p>
            Until then, this page serves only as a visible route placeholder so the website does
            not contain broken legal footer links.
          </p>
        </div>
      </section>
    </>
  );
}
