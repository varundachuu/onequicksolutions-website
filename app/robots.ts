import type { MetadataRoute } from "next";

import { companyInfo } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${companyInfo.siteUrl}/sitemap.xml`,
  };
}
