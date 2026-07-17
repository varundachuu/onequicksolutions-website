import { useEffect } from "react";
import {
  faqItems,
  hrFaqItems,
  serviceItems,
} from "../../content/siteContent";

const SITE_URL = "https://www.onequicksolutions.com";
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "OneQuickSolutions",
  alternateName: "One Quick Solutions",
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  description:
    "OneQuickSolutions is a software development company delivering custom software, websites, mobile apps, SaaS, AI, analytics, cloud solutions, HR consulting, and training support.",
  email: "onequicksolutionsinfo@gmail.com",
  telephone: "+91-80739-81290",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+91-80739-81290",
      email: "onequicksolutionsinfo@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+91-91108-63957",
      email: "onequicksolutionsinfo@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English"],
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "OneQuickSolutions",
  publisher: {
    "@id": ORGANIZATION_ID,
  },
};

const buildFaqSchema = (items, url) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
  url,
});

const buildBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const routeSeo = {
  "/": {
    title:
      "OneQuickSolutions | Custom Software, SaaS, Web, Mobile & AI Solutions",
    description:
      "OneQuickSolutions helps startups, SMEs, enterprises, and institutions build custom software, websites, mobile apps, SaaS platforms, AI solutions, analytics systems, and cloud-ready digital experiences.",
    canonical: `${SITE_URL}/`,
    schema: [
      organizationSchema,
      websiteSchema,
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "OneQuickSolutions",
        url: `${SITE_URL}/`,
        image: DEFAULT_IMAGE,
        description:
          "Software development, website development, mobile apps, SaaS, AI, analytics, cloud solutions, HR consulting, product experiences, and training programmes.",
        provider: {
          "@id": ORGANIZATION_ID,
        },
        areaServed: ["India", "Remote"],
        serviceType: serviceItems.map((item) => item.title),
      },
      buildFaqSchema(faqItems, `${SITE_URL}/#faq`),
    ],
  },
  "/services": {
    title:
      "Software Development Services | OneQuickSolutions",
    description:
      "Explore OneQuickSolutions services for custom software development, websites, mobile apps, SaaS, AI, analytics, cloud solutions, UI/UX design, HR consulting, plus linked product and training programme sections.",
    canonical: `${SITE_URL}/services`,
    schema: [
      organizationSchema,
      websiteSchema,
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Software Development Services",
        serviceType: "Custom software, SaaS, web, mobile, AI, analytics, cloud, UI/UX, and HR consulting services",
        provider: {
          "@id": ORGANIZATION_ID,
        },
        areaServed: ["India", "Remote"],
        url: `${SITE_URL}/services`,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "OneQuickSolutions Services",
          itemListElement: serviceItems.map((item) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: item.title,
              description: item.summary,
              url: `${SITE_URL}/services#${item.slug}`,
            },
          })),
        },
      },
      buildFaqSchema(faqItems, `${SITE_URL}/services#faq`),
      buildBreadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Services", url: `${SITE_URL}/services` },
      ]),
    ],
  },
  "/about": {
    title: "About OneQuickSolutions | Software Company with Business-First Delivery",
    description:
      "Learn about OneQuickSolutions, our mission, vision, delivery approach, founders, and the practical expertise behind our software, design, analytics, cloud, HR, and training services.",
    canonical: `${SITE_URL}/about`,
    schema: [
      organizationSchema,
      websiteSchema,
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About OneQuickSolutions",
        url: `${SITE_URL}/about`,
        about: {
          "@id": ORGANIZATION_ID,
        },
      },
      buildBreadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "About", url: `${SITE_URL}/about` },
      ]),
    ],
  },
  "/contact": {
    title: "Contact OneQuickSolutions | Discuss Your Software or Digital Project",
    description:
      "Contact OneQuickSolutions to discuss custom software, websites, mobile apps, SaaS, AI solutions, analytics, cloud projects, HR consulting, or training and education support.",
    canonical: `${SITE_URL}/contact`,
    schema: [
      organizationSchema,
      websiteSchema,
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact OneQuickSolutions",
        url: `${SITE_URL}/contact`,
      },
      buildFaqSchema(faqItems, `${SITE_URL}/contact#faq`),
      buildBreadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Contact", url: `${SITE_URL}/contact` },
      ]),
    ],
  },
  "/hr-consultancy": {
    title:
      "HR Consulting & Recruitment Services | OneQuickSolutions",
    description:
      "OneQuickSolutions HR consulting supports candidate sourcing, recruiter-led matching, interview coordination, joining follow-up, and structured recruitment workflow management.",
    canonical: `${SITE_URL}/hr-consultancy`,
    schema: [
      organizationSchema,
      websiteSchema,
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "HR Consulting and Recruitment Support",
        serviceType: "HR consulting and recruitment services",
        provider: {
          "@id": ORGANIZATION_ID,
        },
        areaServed: ["India", "Remote"],
        url: `${SITE_URL}/hr-consultancy`,
        description:
          "Recruitment support covering candidate verification, recruiter-led shortlisting, interview coordination, offer management, joining follow-up, and hiring workflow visibility.",
      },
      buildFaqSchema(hrFaqItems, `${SITE_URL}/hr-consultancy#faq`),
      buildBreadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "HR Consultancy", url: `${SITE_URL}/hr-consultancy` },
      ]),
    ],
  },
};

const ensureMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
};

const ensureLinkTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
};

function SeoManager({ pathname }) {
  useEffect(() => {
    const page = routeSeo[pathname] ?? routeSeo["/"];

    document.title = page.title;

    ensureMetaTag('meta[name="description"]', { name: "description" }).setAttribute(
      "content",
      page.description
    );
    ensureMetaTag('meta[name="robots"]', { name: "robots" }).setAttribute(
      "content",
      "index,follow,max-image-preview:large"
    );
    ensureMetaTag('meta[property="og:type"]', { property: "og:type" }).setAttribute(
      "content",
      "website"
    );
    ensureMetaTag('meta[property="og:title"]', { property: "og:title" }).setAttribute(
      "content",
      page.title
    );
    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
    }).setAttribute("content", page.description);
    ensureMetaTag('meta[property="og:url"]', { property: "og:url" }).setAttribute(
      "content",
      page.canonical
    );
    ensureMetaTag('meta[property="og:image"]', { property: "og:image" }).setAttribute(
      "content",
      DEFAULT_IMAGE
    );
    ensureMetaTag('meta[property="og:site_name"]', {
      property: "og:site_name",
    }).setAttribute("content", "OneQuickSolutions");
    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
    }).setAttribute("content", "summary_large_image");
    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
    }).setAttribute("content", page.title);
    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
    }).setAttribute("content", page.description);
    ensureMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
    }).setAttribute("content", DEFAULT_IMAGE);

    ensureLinkTag('link[rel="canonical"]', {
      rel: "canonical",
    }).setAttribute("href", page.canonical);

    let schemaNode = document.getElementById("site-schema");

    if (!schemaNode) {
      schemaNode = document.createElement("script");
      schemaNode.type = "application/ld+json";
      schemaNode.id = "site-schema";
      document.head.appendChild(schemaNode);
    }

    schemaNode.textContent = JSON.stringify(page.schema);
  }, [pathname]);

  return null;
}

export default SeoManager;
