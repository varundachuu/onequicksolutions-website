export type NavLink = {
  label: string;
  href: string;
  primary?: boolean;
  children?: Array<{ label: string; href: string }>;
};

export const serviceNavItems = [
  { label: "Custom Software Development", href: "/custom-software-development" },
  { label: "Business Website Development", href: "/website-development" },
  { label: "SaaS Development", href: "/saas-development" },
  { label: "Mobile App Development", href: "/mobile-app-development" },
  { label: "AI Solutions", href: "/ai-solutions" },
  { label: "Data Analytics and Dashboards", href: "/data-analytics" },
  { label: "Cloud Solutions and Deployment", href: "/cloud-solutions" },
  { label: "UI/UX Design", href: "/ui-ux-design" },
  { label: "HR Consulting", href: "/hr-consulting" },
];

export const mainNavItems: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [...serviceNavItems, { label: "View All Services", href: "/services" }],
  },
  { label: "Products", href: "/products" },
  { label: "Solution Blueprints", href: "/solution-blueprints" },
  { label: "Programs", href: "/programs" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact", primary: true },
];

export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Solution Blueprints", href: "/solution-blueprints" },
  { label: "Programs", href: "/programs" },
  { label: "Industries", href: "/industries" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

export const footerLegalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
];
