import Link from "next/link";

import type { ServicePageData } from "@/data/services";
import { getServiceBySlug } from "@/data/services";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/metadata";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactFormSection } from "@/components/contact-form";
import { FAQSection } from "@/components/faq";
import { PageHero } from "@/components/page-hero";
import { DevelopmentProcessSection } from "@/components/sections";
import { StructuredData } from "@/components/structured-data";

type ServicePageProps = {
  service: ServicePageData;
};

const relatedLinkOverrides: Record<string, { title: string; href: string }> = {
  "products/hr-management-portal": {
    title: "HR Management Portal",
    href: "/products/hr-management-portal",
  },
};

const secondaryActionMap: Record<string, string> = {
  "custom-software-development": "/services",
  "website-development": "/products",
  "saas-development": "/custom-software-development",
  "mobile-app-development": "/website-development",
  "ai-solutions": "/data-analytics",
  "data-analytics": "/ai-solutions",
  "cloud-solutions": "/custom-software-development",
  "ui-ux-design": "/website-development",
  "hr-consulting": "/products/hr-management-portal",
};

function resolveRelatedLinks(service: ServicePageData) {
  return service.relatedServices
    .map((item) => {
      const relatedService = getServiceBySlug(item);
      if (relatedService) {
        return { title: relatedService.title, href: `/${relatedService.slug}` };
      }

      return relatedLinkOverrides[item] ?? null;
    })
    .filter((item): item is { title: string; href: string } => Boolean(item));
}

export function ServicePage({ service }: ServicePageProps) {
  const relatedLinks = resolveRelatedLinks(service);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.title },
  ];

  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.title, path: `/${service.slug}` },
      ])} />
      <StructuredData data={buildServiceSchema(service)} />

      <PageHero
        kicker={service.introKicker}
        title={service.h1}
        description={service.heroDescription}
        chips={service.heroChips}
        primaryAction={{ label: service.primaryCta, href: "/contact" }}
        secondaryAction={{
          label: service.secondaryCta,
          href: secondaryActionMap[service.slug] ?? "/services",
        }}
        highlights={service.heroHighlights}
        breadcrumbs={<Breadcrumbs items={breadcrumbs} />}
      />

      <section className="section-shell service-detail-section">
        <div className="section-inner">
          <div className="section-intro section-intro--left">
            <span className="section-kicker">Problems we solve</span>
            <h2 className="section-title">Where this service creates the most value</h2>
            <p className="section-copy">{service.summary}</p>
          </div>

          <div className="detail-card-grid">
            {service.problems.map((problem) => (
              <article key={problem} className="detail-card surface-panel interactive-panel">
                <h3>Challenge</h3>
                <p>{problem}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell service-detail-section service-detail-section--soft">
        <div className="section-inner service-two-column">
          <div>
            <div className="section-intro section-intro--left">
              <span className="section-kicker">What we build or provide</span>
              <h2 className="section-title">Solution coverage shaped around practical business needs</h2>
              <p className="section-copy">
                We focus on delivery that is useful in daily operations, credible in presentation,
                and maintainable as the business continues to evolve.
              </p>
            </div>
            <div className="detail-list-panel surface-panel">
              <ul className="detail-checklist">
                {service.solutions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="section-intro section-intro--left">
              <span className="section-kicker">Who this service is for</span>
              <h2 className="section-title">Best fit for teams that need clarity, structure, and better outcomes</h2>
              <p className="section-copy">
                Every project is different, but these are the kinds of organizations that usually
                benefit most from this service.
              </p>
            </div>
            <div className="detail-list-panel surface-panel">
              <ul className="detail-checklist">
                {service.audience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell service-detail-section">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Deliverables</span>
            <h2 className="section-title">What the engagement is designed to produce</h2>
            <p className="section-copy">
              Deliverables vary by scope, but the project is shaped to provide practical outcomes
              that can be launched, used, and improved with confidence.
            </p>
          </div>

          <div className="detail-card-grid detail-card-grid--three">
            {service.deliverables.map((item) => (
              <article key={item} className="detail-card surface-panel interactive-panel">
                <h3>Included</h3>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell service-detail-section service-detail-section--soft">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Process</span>
            <h2 className="section-title">A structured path from discovery to release</h2>
            <p className="section-copy">{service.processSummary}</p>
          </div>
        </div>
      </section>

      <DevelopmentProcessSection />

      <section className="section-shell service-detail-section">
        <div className="section-inner service-two-column">
          <div>
            <div className="section-intro section-intro--left">
              <span className="section-kicker">Technology stack</span>
              <h2 className="section-title">Capabilities we use to deliver this service</h2>
              <p className="section-copy">
                We only describe tools, patterns, and delivery capabilities that fit the existing
                OneQuickSolutions direction and project experience.
              </p>
            </div>
            <div className="detail-list-panel surface-panel">
              <ul className="detail-checklist">
                {service.technologyStack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="section-intro section-intro--left">
              <span className="section-kicker">Security and quality</span>
              <h2 className="section-title">Practices that support safer, more dependable delivery</h2>
              <p className="section-copy">
                We focus on practical quality controls that help reduce avoidable risk and improve
                day-to-day usability.
              </p>
            </div>
            <div className="detail-list-panel surface-panel">
              <ul className="detail-checklist">
                {service.securityQuality.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell service-detail-section service-detail-section--soft">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Typical use cases</span>
            <h2 className="section-title">Example implementation directions</h2>
            <p className="section-copy">
              These are realistic solution examples, not published client projects.
            </p>
          </div>

          <div className="detail-card-grid detail-card-grid--three">
            {service.useCases.map((useCase) => (
              <article key={useCase.title} className="detail-card surface-panel interactive-panel">
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell service-detail-section">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Engagement models</span>
            <h2 className="section-title">Flexible ways to begin and continue delivery</h2>
            <p className="section-copy">
              The right engagement model depends on scope clarity, urgency, and whether the work is
              best released in one phase or several.
            </p>
          </div>

          <div className="detail-card-grid detail-card-grid--two">
            {service.engagementModels.map((model) => (
              <article key={model.title} className="detail-card surface-panel interactive-panel">
                <h3>{model.title}</h3>
                <p>{model.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FAQSection
        items={service.faqs}
        sectionId={`faq-${service.slug}`}
        kicker="Frequently asked questions"
        title={`Common questions about ${service.title.toLowerCase()}`}
        description={`These answers help clarify how ${service.title.toLowerCase()} projects are usually approached before work begins.`}
      />

      <section className="section-shell service-detail-section service-detail-section--soft">
        <div className="section-inner">
          <div className="section-intro">
            <span className="section-kicker">Related services</span>
            <h2 className="section-title">Other areas that often connect with this service</h2>
            <p className="section-copy">
              Many projects overlap across design, product, automation, analytics, and launch
              support. These pages are a strong next step if you want the bigger picture.
            </p>
          </div>

          <div className="detail-card-grid detail-card-grid--three">
            {relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="detail-link-card surface-panel interactive-panel">
                <strong>{link.title}</strong>
                <span>Explore this page</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactFormSection
        sourcePath={`/${service.slug}`}
        defaultService={service.title}
        kicker="Final CTA"
        heading={service.finalCtaTitle}
        description={service.finalCtaDescription}
      />
    </>
  );
}
