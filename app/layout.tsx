import type { Metadata } from "next";

import "@/app/globals.css";

import { SiteShell } from "@/components/site-shell";
import { ThemeScript } from "@/components/theme-script";
import { companyInfo } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(companyInfo.siteUrl),
  title: {
    default: "Software Development Company | OneQuickSolutions",
    template: "%s",
  },
  description: companyInfo.description,
  applicationName: companyInfo.name,
  openGraph: {
    siteName: companyInfo.name,
    type: "website",
    title: "Software Development Company | OneQuickSolutions",
    description: companyInfo.description,
    url: companyInfo.siteUrl,
    images: [
      {
        url: companyInfo.ogImage,
        alt: `${companyInfo.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Company | OneQuickSolutions",
    description: companyInfo.description,
    images: [companyInfo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
