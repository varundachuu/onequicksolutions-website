import type { Metadata } from "next";

import { companyInfo } from "@/data/site";
import type { ServicePageData } from "@/data/services";

export const siteUrl = companyInfo.siteUrl;

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: companyInfo.name,
      type: "website",
      images: [
        {
          url: absoluteUrl(companyInfo.ogImage),
          alt: `${companyInfo.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(companyInfo.ogImage)],
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyInfo.name,
    url: companyInfo.siteUrl,
    logo: absoluteUrl(companyInfo.logoPath),
    email: companyInfo.email,
    telephone: companyInfo.phones,
    description: companyInfo.description,
  };
}

export function buildServiceSchema(service: ServicePageData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    provider: {
      "@type": "Organization",
      name: companyInfo.name,
      url: companyInfo.siteUrl,
    },
    areaServed: "Global",
    description: service.metaDescription,
    url: absoluteUrl(`/${service.slug}`),
  };
}
