import { buildMetadata } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";

export const metadata = buildMetadata(
  "Privacy Policy | OneQuickSolutions",
  "Read the current privacy notice placeholder for OneQuickSolutions. This page will be updated with the final legal policy text.",
  "/privacy-policy",
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        kicker="Privacy policy"
        title="Privacy notice placeholder"
        description="This page is provided as a temporary public placeholder until the final privacy policy wording is approved and published."
        primaryAction={{ label: "Contact our team", href: "/contact" }}
        secondaryAction={{ label: "Return home", href: "/" }}
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
        }
      />
      <section className="section-shell">
        <div className="section-inner copy-page">
          <p>
            OneQuickSolutions only intends to use submitted contact information for responding to
            enquiries and understanding the project or service requirement being discussed.
          </p>
          <p>
            The formal privacy policy text, including retention, cookies, analytics, and legal
            rights language, should be finalized and added before this placeholder is treated as a
            complete legal document.
          </p>
        </div>
      </section>
    </>
  );
}
