import type { MetadataRoute } from "next";

import { companyInfo } from "@/data/site";
import { serviceSlugs } from "@/data/services";

const lastModified = new Date("2026-07-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/industries",
    "/products",
    "/products/hr-management-portal",
    "/case-studies",
    "/about-us",
    "/contact",
    "/programs",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  const serviceRoutes = serviceSlugs.map((slug) => `/${slug}`);

  return [...staticRoutes, ...serviceRoutes].map((path) => ({
    url: `${companyInfo.siteUrl}${path || "/"}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/services") ? 0.9 : 0.8,
  }));
}
