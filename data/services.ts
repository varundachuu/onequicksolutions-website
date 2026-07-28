import type { FAQItem } from "@/data/faqs";

export type ServiceCard = {
  slug: string;
  icon: string;
  title: string;
  summary: string;
  bullets: string[];
  tags: string[];
};

export type ServicePageData = ServiceCard & {
  metaTitle: string;
  metaDescription: string;
  introKicker: string;
  h1: string;
  heroDescription: string;
  heroChips: string[];
  heroHighlights: Array<{ title: string; copy: string }>;
  primaryCta: string;
  secondaryCta: string;
  problems: string[];
  solutions: string[];
  audience: string[];
  deliverables: string[];
  processSummary: string;
  technologyStack: string[];
  useCases: Array<{ title: string; description: string }>;
  securityQuality: string[];
  engagementModels: Array<{ title: string; description: string }>;
  faqs: FAQItem[];
  relatedServices: string[];
  finalCtaTitle: string;
  finalCtaDescription: string;
};

export const serviceCards: ServiceCard[] = [
  {
    slug: "custom-software-development",
    icon: "code",
    title: "Custom Software Development",
    summary:
      "We design and build custom business software that aligns with your workflows, users, and long-term operational goals.",
    bullets: [
      "Business process mapping and solution planning",
      "Secure, scalable architecture for long-term use",
      "Admin dashboards, automation, and system integrations",
    ],
    tags: ["Custom software", "Business systems", "Digital transformation"],
  },
  {
    slug: "website-development",
    icon: "laptop",
    title: "Website Development",
    summary:
      "From brand-led company websites to high-conversion business platforms, we create fast, responsive websites that build trust and generate enquiries.",
    bullets: [
      "Conversion-focused page structure and content flow",
      "Responsive design for desktop, tablet, and mobile",
      "SEO-ready development with clean performance practices",
    ],
    tags: ["Business websites", "Responsive design", "SEO-ready builds"],
  },
  {
    slug: "saas-development",
    icon: "cloud",
    title: "SaaS Development",
    summary:
      "We help turn product ideas into structured SaaS platforms with thoughtful onboarding, account management, and scalable delivery logic.",
    bullets: [
      "MVP planning and platform structure",
      "Role-based user journeys and admin visibility",
      "Product iteration that supports launch and growth",
    ],
    tags: ["SaaS platforms", "Product development", "Scalable systems"],
  },
  {
    slug: "mobile-app-development",
    icon: "mobile",
    title: "Mobile App Development",
    summary:
      "We build user-friendly mobile experiences for customers, teams, and internal operations with a strong focus on reliability and usability.",
    bullets: [
      "Android and cross-platform app experiences",
      "Clear information architecture and user journeys",
      "Secure API connectivity and backend support",
    ],
    tags: ["Mobile apps", "Cross-platform delivery", "App UX"],
  },
  {
    slug: "ai-solutions",
    icon: "ai",
    title: "AI Solutions",
    summary:
      "Our AI solutions focus on practical outcomes such as smarter support, automation, insights, and workflow improvement rather than novelty alone.",
    bullets: [
      "AI-assisted workflows and business process automation",
      "Knowledge assistants, smart search, and support experiences",
      "Use-case planning with governance and operational clarity",
    ],
    tags: ["AI automation", "Business intelligence", "Workflow optimization"],
  },
  {
    slug: "data-analytics",
    icon: "analytics",
    title: "Data Analytics",
    summary:
      "We turn scattered information into clear reporting systems and insight layers that help decision-makers act with more confidence.",
    bullets: [
      "Dashboard design for operational and leadership visibility",
      "Data structuring, aggregation, and reporting logic",
      "Insights tailored to business performance and growth decisions",
    ],
    tags: ["Dashboards", "Reporting systems", "Business insights"],
  },
  {
    slug: "cloud-solutions",
    icon: "server",
    title: "Cloud Solutions",
    summary:
      "We help businesses move toward cloud-ready, secure, and scalable delivery environments that support ongoing growth and resilience.",
    bullets: [
      "Deployment planning and cloud-ready application support",
      "Environment setup for performance, security, and uptime",
      "Modern hosting approaches for evolving digital products",
    ],
    tags: ["Cloud delivery", "Scalable infrastructure", "Secure hosting"],
  },
  {
    slug: "ui-ux-design",
    icon: "palette",
    title: "UI/UX Design",
    summary:
      "We create digital interfaces that look credible, feel intuitive, and guide users toward the actions that matter most.",
    bullets: [
      "Wireframes, page flows, and user experience strategy",
      "Modern visual systems aligned with your brand identity",
      "Usability-focused design decisions that support conversion",
    ],
    tags: ["UI design", "UX strategy", "Design systems"],
  },
  {
    slug: "hr-consulting",
    icon: "people",
    title: "HR Consulting",
    summary:
      "Our HR consulting services help businesses improve candidate sourcing, shortlisting, interview coordination, and recruitment workflow visibility.",
    bullets: [
      "Structured hiring process support and candidate tracking",
      "Recruiter-reviewed matching and coordination support",
      "A dedicated HR consultancy portal for smoother delivery",
    ],
    tags: ["Recruitment support", "Hiring workflows", "HR consulting"],
  },
];

const detailMap: Record<string, Omit<ServicePageData, keyof ServiceCard>> = {
  "custom-software-development": {
    metaTitle: "Custom Software Development Company | OneQuickSolutions",
    metaDescription:
      "Build secure custom software, workflow applications, admin portals, dashboards and system integrations designed around your business requirements.",
    introKicker: "Custom software development",
    h1: "Custom Software Development Built Around Your Workflow",
    heroDescription:
      "We build secure business applications, internal systems, portals, dashboards, and integrations that match how your team actually works instead of forcing you into generic software.",
    heroChips: [
      "Business applications",
      "Admin portals",
      "Workflow automation",
      "Reporting dashboards",
      "Legacy modernization",
    ],
    heroHighlights: [
      {
        title: "Designed around real operations",
        copy: "Useful when spreadsheets, manual approvals, and disconnected tools slow teams down.",
      },
      {
        title: "Flexible for different departments",
        copy: "Suitable for HR, operations, finance, reporting, inventory, and customer-facing workflows.",
      },
      {
        title: "Built for growth and change",
        copy: "The goal is long-term usability, not a short-term workaround that breaks later.",
      },
    ],
    primaryCta: "Discuss Your Software Requirement",
    secondaryCta: "View All Services",
    problems: [
      "Too much work depends on Excel sheets, WhatsApp threads, and manual follow-up.",
      "Approvals, reporting, and data updates are duplicated across teams or tools.",
      "Existing software does not match the business workflow and creates more friction than value.",
      "Management lacks one reliable dashboard for daily visibility and decision-making.",
      "Legacy tools are difficult to extend, secure, or integrate with newer systems.",
    ],
    solutions: [
      "Custom business applications for internal process management",
      "Admin portals, employee portals, and customer portals",
      "CRM-style workflow tools, attendance systems, and HR applications",
      "Inventory, operations, and reporting dashboards",
      "API integrations that connect forms, portals, and external systems",
      "Legacy software modernization and workflow redesign",
    ],
    audience: [
      "Businesses that need software designed around their actual approvals, users, and reporting flow",
      "Operations teams trying to replace fragmented manual processes with one structured system",
      "Growing companies that need secure internal visibility before they scale further",
      "Organizations that already have software but need a more practical and maintainable version",
    ],
    deliverables: [
      "Requirement discovery and workflow mapping",
      "Information architecture and feature planning",
      "Role-based screen flows and interface structure",
      "Custom portal development and dashboard implementation",
      "API and workflow integration planning",
      "Testing, deployment support, and post-launch improvement guidance",
    ],
    processSummary:
      "Custom software work usually starts with workflow discovery, user-role planning, data structure definition, and phased delivery so the system becomes easier to adopt and improve over time.",
    technologyStack: [
      "React-based user interfaces",
      "Role-based dashboard experiences",
      "API-led workflow integrations",
      "Secure authentication and access control patterns",
      "Cloud-ready deployment environments",
      "Business reporting and management dashboards",
    ],
    useCases: [
      {
        title: "Internal operations portal",
        description:
          "A central workspace for tasks, approvals, documents, status tracking, and management reporting.",
      },
      {
        title: "Attendance and HR workflow system",
        description:
          "A secure environment for employee records, approvals, attendance visibility, and internal communication flow.",
      },
      {
        title: "Inventory and activity dashboard",
        description:
          "A custom reporting layer that gives teams one source of truth instead of multiple manual spreadsheets.",
      },
    ],
    securityQuality: [
      "Role-based access control for different user types",
      "Secure authentication and controlled user permissions",
      "Input validation and safer data-handling practices",
      "HTTPS-ready deployments and environment separation",
      "Error logging, QA review, and structured release checks",
      "Backup-aware thinking for important operational data",
    ],
    engagementModels: [
      {
        title: "Fixed-scope project",
        description: "Best for clearly defined software requirements with a known outcome and milestone plan.",
      },
      {
        title: "Discovery and prototype engagement",
        description: "Useful when the workflow needs clarification before full implementation starts.",
      },
      {
        title: "Milestone-based development",
        description: "A phased approach for teams that want to launch in stages and validate along the way.",
      },
      {
        title: "Maintenance and enhancement support",
        description: "Ongoing help after launch for changes, improvements, and operational support.",
      },
    ],
    faqs: [
      {
        question: "How much does custom software development cost?",
        answer:
          "Cost depends on scope, workflow complexity, number of user roles, integrations, and reporting requirements. We usually begin with discovery so the estimate reflects the real business need.",
      },
      {
        question: "How long does a typical project take?",
        answer:
          "A focused internal tool may move quickly, while broader multi-role systems take longer. Timelines depend on scope clarity, feedback cycles, and integration needs.",
      },
      {
        question: "Can you improve our existing software?",
        answer:
          "Yes. We can review an existing system, identify the friction points, and recommend whether enhancement, redesign, or phased rebuilding is the better route.",
      },
      {
        question: "Will we own the source code?",
        answer:
          "Ownership and handover terms can be defined clearly during the project discussion so expectations stay aligned from the start.",
      },
      {
        question: "Can the application integrate with our existing systems?",
        answer:
          "Yes, where integration points are available. We can review APIs, data flow, and workflow dependencies before confirming the right approach.",
      },
      {
        question: "Do you provide maintenance?",
        answer:
          "Yes. Maintenance and improvement support can continue after the first release so the software stays useful as the business evolves.",
      },
      {
        question: "Can the software be hosted on our own server?",
        answer:
          "Hosting needs can be discussed based on your operational, security, and access requirements. We can support cloud-ready or organization-controlled deployment approaches.",
      },
      {
        question: "How is business data protected?",
        answer:
          "We focus on secure access control, authenticated workflows, validation, environment separation, and disciplined release practices to reduce avoidable risk.",
      },
    ],
    relatedServices: ["saas-development", "data-analytics", "cloud-solutions"],
    finalCtaTitle: "Need software that matches how your business actually runs?",
    finalCtaDescription:
      "Tell us what is slowing the workflow down, what the current process looks like, and what a better outcome should feel like.",
  },
  "website-development": {
    metaTitle: "Business Website Development Company | OneQuickSolutions",
    metaDescription:
      "Create fast, responsive and conversion-focused business websites with SEO-ready structure, secure forms and modern user experience.",
    introKicker: "Website development",
    h1: "Business Websites Designed to Build Trust and Generate Enquiries",
    heroDescription:
      "We create responsive business websites with stronger messaging, better user flow, and SEO-ready structure so your digital presence feels credible and actually supports growth.",
    heroChips: [
      "Corporate websites",
      "Responsive redesigns",
      "Landing pages",
      "Technical SEO setup",
      "Performance improvement",
    ],
    heroHighlights: [
      {
        title: "Trust-first presentation",
        copy: "The design, layout, and copy should make the business feel clearer and more credible immediately.",
      },
      {
        title: "Conversion-aware structure",
        copy: "We shape page hierarchy, CTAs, and content flow to support enquiries, not just visuals.",
      },
      {
        title: "Built for visibility",
        copy: "Important content, metadata, and internal links are structured to support SEO from the start.",
      },
    ],
    primaryCta: "Discuss Your Website Project",
    secondaryCta: "See Our Products",
    problems: [
      "The current website looks outdated and weakens trust before a sales conversation even starts.",
      "Important services are buried, unclear, or difficult for visitors to understand quickly.",
      "Mobile layouts feel cramped, inconsistent, or hard to navigate.",
      "The site is not structured well for SEO, internal linking, or performance.",
      "Calls-to-action are weak, and enquiries are lower than they should be.",
    ],
    solutions: [
      "Corporate websites and service-led business websites",
      "Landing pages and conversion-focused campaign pages",
      "Website redesigns that improve clarity, hierarchy, and trust",
      "Responsive development for desktop, tablet, and mobile",
      "Contact forms, WhatsApp prompts, and enquiry flow improvements",
      "Analytics, Search Console, technical SEO foundations, and post-launch support",
    ],
    audience: [
      "Businesses that need a stronger first impression and cleaner service communication",
      "Growing companies that want a premium website without losing practical usability",
      "Founders and teams planning a redesign to improve SEO, conversion, and trust",
      "Organizations that need a structured multi-page website instead of a single promotional page",
    ],
    deliverables: [
      "Sitemap and content-page structure",
      "Wireframes and visual direction",
      "Responsive UI design and front-end development",
      "Contact form and enquiry-flow setup",
      "Analytics setup and Search Console preparation",
      "Sitemap.xml, robots.txt, canonical structure, and basic schema support",
    ],
    processSummary:
      "Website projects balance brand direction, messaging clarity, user flow, SEO structure, responsive implementation, and conversion-focused CTA placement before launch.",
    technologyStack: [
      "React and Next.js page architecture",
      "Responsive component-based layouts",
      "SEO-friendly metadata and internal linking",
      "Performance-aware image and asset delivery",
      "Structured forms and enquiry workflows",
      "Accessible semantic HTML and keyboard-friendly navigation",
    ],
    useCases: [
      {
        title: "Service-led company website",
        description:
          "A structured public site with dedicated service pages, proof sections, FAQs, and strong contact paths.",
      },
      {
        title: "Brand refresh and redesign",
        description:
          "A full website update for businesses whose positioning, message, and visual consistency no longer match their current quality.",
      },
      {
        title: "Campaign or product landing page",
        description:
          "A conversion-focused experience built for launches, product promotion, or specific enquiry goals.",
      },
    ],
    securityQuality: [
      "HTTPS-ready deployment and secure hosting practices",
      "Validated contact inputs and clearer form handling",
      "Image optimization and performance-aware front-end delivery",
      "Semantic HTML, alt text, and accessible navigation patterns",
      "Structured metadata, canonicals, and crawlable internal links",
      "Post-launch review for responsiveness, broken links, and content issues",
    ],
    engagementModels: [
      {
        title: "Website redesign engagement",
        description: "Ideal when the business already has a live site but needs a sharper structure and stronger conversion flow.",
      },
      {
        title: "New website build",
        description: "Best for businesses launching a new digital presence or expanding into clearer service communication.",
      },
      {
        title: "Landing-page sprint",
        description: "A focused scope for campaign, offer, or service-specific pages that need to move quickly.",
      },
      {
        title: "Maintenance and optimization support",
        description: "For ongoing updates, content improvements, and performance refinement after launch.",
      },
    ],
    faqs: [
      {
        question: "Can you redesign our current website without losing our brand identity?",
        answer:
          "Yes. We can preserve the recognizable parts of your brand while improving structure, clarity, responsiveness, and overall presentation quality.",
      },
      {
        question: "Will the website be mobile responsive?",
        answer:
          "Yes. Responsive behavior is part of the build approach so the site stays usable across mobile, tablet, laptop, and desktop widths.",
      },
      {
        question: "Do you structure websites for SEO from the beginning?",
        answer:
          "Yes. We plan clean URLs, metadata, heading hierarchy, internal linking, sitemap support, and crawlable page structure as part of the implementation.",
      },
      {
        question: "Can you help with content clarity as well as development?",
        answer:
          "Yes. We can help improve readability, service messaging, CTA placement, and overall content structure so the site communicates better.",
      },
      {
        question: "Do you set up analytics and Search Console?",
        answer:
          "Yes. Those basics can be included so you have better visibility into traffic, indexing, and site performance after launch.",
      },
      {
        question: "Can you maintain the website after launch?",
        answer:
          "Yes. Ongoing maintenance can cover content updates, layout refinements, technical improvements, and future page additions.",
      },
    ],
    relatedServices: ["ui-ux-design", "custom-software-development", "cloud-solutions"],
    finalCtaTitle: "Ready for a website that feels premium and works harder?",
    finalCtaDescription:
      "Share what is not working in the current site, what you want visitors to understand faster, and what kind of enquiries you want to attract.",
  },
  "saas-development": {
    metaTitle: "SaaS Product Development Services | OneQuickSolutions",
    metaDescription:
      "Plan, build and launch scalable SaaS products with secure user accounts, dashboards, subscriptions, workflows and integrations.",
    introKicker: "SaaS development",
    h1: "Build and Launch Scalable SaaS Platforms",
    heroDescription:
      "We help founders and teams shape SaaS products with clear onboarding, account structure, admin visibility, and the product foundations required for reliable growth.",
    heroChips: [
      "Product discovery",
      "MVP planning",
      "Admin dashboards",
      "Subscription workflows",
      "Integration-ready architecture",
    ],
    heroHighlights: [
      {
        title: "Product-led thinking",
        copy: "SaaS work is not only about features. It is about the right user flow, adoption path, and release priorities.",
      },
      {
        title: "Built for iterative growth",
        copy: "We structure the first version so the product can evolve in sensible stages after launch.",
      },
      {
        title: "Clear difference from internal software",
        copy: "SaaS products serve repeatable users and workflows, while custom internal software is shaped around one business operation.",
      },
    ],
    primaryCta: "Discuss Your SaaS Product",
    secondaryCta: "Explore Custom Software",
    problems: [
      "The product idea is clear in principle but not yet shaped into a practical release roadmap.",
      "User onboarding, account roles, or workflow structure are still too vague for development to move confidently.",
      "Founders need an MVP that proves the core product direction without overbuilding too early.",
      "Product visibility for admins, customers, and support teams is not planned clearly yet.",
      "Scaling decisions need more structure around workflows, permissions, and integrations.",
    ],
    solutions: [
      "Product discovery and MVP feature planning",
      "User onboarding, account setup, and role-based experiences",
      "Admin dashboards and reporting visibility",
      "Subscription and account-management workflows",
      "Notifications, integrations, and workflow automation",
      "Product maintenance and phased enhancement planning",
    ],
    audience: [
      "Founders shaping a new SaaS concept into a practical first release",
      "Teams that need an MVP with clearer priorities before scaling feature scope",
      "Businesses converting a repeatable service or process into a productized platform",
      "Organizations that need customer-facing accounts, dashboards, and recurring workflow visibility",
    ],
    deliverables: [
      "Product discovery and feature-priority mapping",
      "User-role definitions and account-flow planning",
      "SaaS interface design and dashboard development",
      "Admin views, workflow logic, and reporting support",
      "Integration planning for notifications and external systems",
      "Launch-readiness review and structured product iteration recommendations",
    ],
    processSummary:
      "SaaS delivery usually begins with product definition, user-role design, and MVP scoping so the first release focuses on the strongest core workflow before deeper expansion.",
    technologyStack: [
      "React-based SaaS interfaces and dashboards",
      "Role-based account and admin experiences",
      "Workflow and notification logic",
      "API and third-party integration patterns",
      "Cloud-ready deployment planning",
      "Product analytics and reporting visibility",
    ],
    useCases: [
      {
        title: "Operations SaaS platform",
        description:
          "A structured workspace that helps customers manage tasks, track progress, and review account-specific dashboards.",
      },
      {
        title: "Service workflow product",
        description:
          "A subscription-led portal that turns a repeatable internal or consultancy process into a scalable product experience.",
      },
      {
        title: "Multi-user business portal",
        description:
          "A role-based application for staff, managers, and customer accounts with visibility into actions, status, and reports.",
      },
    ],
    securityQuality: [
      "Role-based access and account permissions",
      "Secure authentication patterns and session-aware flows",
      "Input validation and controlled data handling",
      "Logging and error visibility for product support",
      "Environment separation for safer release flow",
      "Deployment practices designed for reliable updates and iteration",
    ],
    engagementModels: [
      {
        title: "Discovery and MVP definition",
        description: "Ideal when the product concept is promising but the first release needs stronger structure.",
      },
      {
        title: "MVP build engagement",
        description: "A focused phase to launch the most important workflow and prove the product direction.",
      },
      {
        title: "Milestone-based product delivery",
        description: "Useful when the platform will grow through staged releases and controlled priorities.",
      },
      {
        title: "Post-launch product support",
        description: "For ongoing fixes, improvements, and next-phase feature work after the first release.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between custom software and SaaS?",
        answer:
          "Custom software is usually shaped around one organization's internal workflow, while SaaS is built as a repeatable product for multiple users or customer accounts.",
      },
      {
        question: "Can you help us plan the MVP before building it?",
        answer:
          "Yes. Product discovery and MVP planning are often the right first step so the release focuses on the most important workflow and user value.",
      },
      {
        question: "Do all SaaS products need multi-tenant architecture?",
        answer:
          "Not always. Multi-tenant design should match the product's real needs. We only recommend it when the implementation and product direction genuinely require it.",
      },
      {
        question: "Can you build admin dashboards and user-role permissions?",
        answer:
          "Yes. Role-based access, account-level visibility, and admin workflows are common parts of SaaS delivery planning.",
      },
      {
        question: "Can integrations be added after the MVP?",
        answer:
          "Yes. Many products begin with a strong core workflow and then add integrations, automation, or reporting layers in later milestones.",
      },
      {
        question: "Do you provide support after launch?",
        answer:
          "Yes. SaaS products usually improve through iteration, so ongoing support can be planned for fixes, enhancements, and new release phases.",
      },
    ],
    relatedServices: ["custom-software-development", "cloud-solutions", "ui-ux-design"],
    finalCtaTitle: "Have a SaaS product idea that needs structure before code?",
    finalCtaDescription:
      "Share the audience, the core workflow, and the first release goal. We can help shape the best next product step.",
  },
  "mobile-app-development": {
    metaTitle: "Mobile App Development Services | OneQuickSolutions",
    metaDescription:
      "Build secure Android and cross-platform mobile applications for customers, employees and business operations.",
    introKicker: "Mobile app development",
    h1: "Mobile Applications for Customers, Employees and Business Operations",
    heroDescription:
      "We create mobile app experiences that make business workflows, customer engagement, and on-the-go access easier to use, easier to trust, and easier to maintain.",
    heroChips: [
      "Android apps",
      "Cross-platform support",
      "Employee workflows",
      "Customer apps",
      "API-connected delivery",
    ],
    heroHighlights: [
      {
        title: "Built around the user journey",
        copy: "Good mobile apps make essential tasks simple, quick, and dependable even when people are moving fast.",
      },
      {
        title: "Useful for internal and external users",
        copy: "We can support employee, field-force, customer, or operational app requirements.",
      },
      {
        title: "Connected to wider systems",
        copy: "Mobile delivery often works best when APIs, dashboards, and backend workflows are planned together.",
      },
    ],
    primaryCta: "Discuss Your Mobile App",
    secondaryCta: "Explore Website Development",
    problems: [
      "Users need mobile access to tasks, approvals, or business information while away from a desktop.",
      "Teams rely on fragmented communication instead of one guided mobile workflow.",
      "Customer interactions are harder than they should be without a simpler app experience.",
      "Field teams need access to updates, forms, or reporting while working remotely.",
      "Existing systems do not offer a reliable mobile layer for daily use.",
    ],
    solutions: [
      "Android applications and cross-platform mobile experiences",
      "Customer-facing apps and account-related workflows",
      "Employee and field-force apps for operational activity",
      "Authentication, notifications, and API-connected experiences",
      "Offline-aware flows and data synchronization planning",
      "App deployment support and post-launch maintenance",
    ],
    audience: [
      "Businesses that need on-the-go access to workflows, records, or approvals",
      "Organizations serving customers who need a simpler mobile experience",
      "Operations teams that need cleaner field coordination and status visibility",
      "Companies extending an existing platform with a mobile layer",
    ],
    deliverables: [
      "Use-case discovery and feature planning",
      "App flow mapping and mobile-friendly UX structure",
      "Screen design and responsive component implementation",
      "Authentication and backend integration planning",
      "Testing across key flows and launch-readiness review",
      "Deployment support and iteration guidance",
    ],
    processSummary:
      "Mobile projects focus on core user actions first, then refine screen flow, API integration, notifications, and edge-case handling so the experience stays practical in real usage.",
    technologyStack: [
      "Mobile-first interface design",
      "API-connected application workflows",
      "Authentication and role-aware access",
      "Notification and alert flows",
      "Offline-aware state handling where required",
      "Cloud-ready backend coordination",
    ],
    useCases: [
      {
        title: "Employee operations app",
        description:
          "A mobile workflow for tasks, approvals, updates, and activity tracking across teams in the field or on the move.",
      },
      {
        title: "Customer service app",
        description:
          "A guided app for customer actions, account visibility, support requests, and ongoing communication.",
      },
      {
        title: "Field-force reporting tool",
        description:
          "A structured mobile layer for check-ins, form submissions, status reporting, and synchronized operational updates.",
      },
    ],
    securityQuality: [
      "Authenticated app access and role-based permissions",
      "Validated inputs and controlled API communication",
      "Planned synchronization and safer data handling",
      "Error review and test coverage across key user journeys",
      "Deployment support for stable release flow",
      "Environment-aware configuration for production readiness",
    ],
    engagementModels: [
      {
        title: "Prototype and feature-definition phase",
        description: "Useful when the mobile workflow needs stronger clarity before the build begins.",
      },
      {
        title: "Focused app build",
        description: "Best for clear mobile requirements with a defined user journey and release target.",
      },
      {
        title: "Phased rollout",
        description: "A practical path when app capability needs to expand in controlled stages after launch.",
      },
      {
        title: "Maintenance and updates",
        description: "For post-launch refinements, compatibility updates, and feature improvements over time.",
      },
    ],
    faqs: [
      {
        question: "Do you build Android apps or cross-platform apps?",
        answer:
          "We can support Android-focused and cross-platform app requirements depending on the business need, users, and release priorities.",
      },
      {
        question: "Can the app connect with our existing software or website?",
        answer:
          "Yes. If suitable integration points are available, the app can be planned to connect with APIs, dashboards, portals, or existing workflows.",
      },
      {
        question: "Can offline support be included?",
        answer:
          "Where the use case genuinely needs it, offline-aware flows and synchronization planning can be part of the solution design.",
      },
      {
        question: "Do you help with app store deployment?",
        answer:
          "Yes. Deployment support can be included so the release process is smoother and more structured.",
      },
      {
        question: "Can you improve an existing app experience?",
        answer:
          "Yes. We can review the current flow, usability issues, and integration gaps before recommending the right improvement path.",
      },
      {
        question: "Do you support maintenance after launch?",
        answer:
          "Yes. Ongoing support can cover fixes, UI refinements, workflow improvements, and future release planning.",
      },
    ],
    relatedServices: ["custom-software-development", "ui-ux-design", "cloud-solutions"],
    finalCtaTitle: "Need a mobile app that fits real business usage, not just a feature list?",
    finalCtaDescription:
      "Tell us who the users are, what they need to do quickly, and what systems the app must connect with.",
  },
  "ai-solutions": {
    metaTitle: "AI Automation and Business Solutions | OneQuickSolutions",
    metaDescription:
      "Implement practical AI assistants, document workflows, knowledge search and business process automation integrated with your systems.",
    introKicker: "AI solutions",
    h1: "Practical AI Solutions for Business Workflows",
    heroDescription:
      "We focus on useful AI applications such as knowledge assistants, document workflows, support automation, and process improvement instead of vague promises that are difficult to operationalize.",
    heroChips: [
      "AI assistants",
      "Knowledge search",
      "Document workflows",
      "Automation support",
      "Human review",
    ],
    heroHighlights: [
      {
        title: "Use-case clarity first",
        copy: "The best AI work starts with a real workflow problem, not a trend-driven feature list.",
      },
      {
        title: "Human review where needed",
        copy: "Important outputs can stay review-aware instead of being treated as fully automatic by default.",
      },
      {
        title: "Integrated with the rest of the business",
        copy: "AI becomes more useful when it connects with documents, systems, and operational context already in use.",
      },
    ],
    primaryCta: "Discuss an AI Use Case",
    secondaryCta: "Explore Data Analytics",
    problems: [
      "Teams spend too much time answering repeat questions or searching through scattered internal knowledge.",
      "Documents, requests, or updates require manual sorting and repetitive review.",
      "Support or lead handling needs better first-pass automation before human follow-up.",
      "Useful business information exists but is hard to surface quickly inside daily workflows.",
      "The organization wants AI support but needs privacy, governance, and review controls built in.",
    ],
    solutions: [
      "Internal knowledge assistants and guided search tools",
      "Document summarization, classification, and workflow routing",
      "Customer-support assistance and lead qualification support",
      "Reporting assistance and automation of repetitive process steps",
      "Integration of AI features into existing business systems",
      "Governance-aware flows with review checkpoints and exception handling",
    ],
    audience: [
      "Businesses exploring AI for support, operations, reporting, or internal knowledge access",
      "Teams with repetitive document-heavy or information-heavy workflows",
      "Organizations that need automation with human control rather than full blind automation",
      "Leaders who want practical AI outcomes tied to measurable process improvement",
    ],
    deliverables: [
      "Use-case discovery and workflow mapping",
      "Prompt, logic, and orchestration planning",
      "Knowledge, document, or process integration support",
      "Review checkpoints and exception-handling design",
      "Prototype or pilot implementation with practical boundaries",
      "Improvement guidance based on usage and feedback",
    ],
    processSummary:
      "AI work begins with process understanding, data and knowledge review, risk boundaries, and human-review planning so the final solution stays useful and manageable.",
    technologyStack: [
      "AI assistants embedded in business workflows",
      "Knowledge retrieval and structured search experiences",
      "Document processing and workflow automation logic",
      "Dashboards and visibility for AI-supported operations",
      "API integration with existing internal systems",
      "Governance-aware handling with review checkpoints",
    ],
    useCases: [
      {
        title: "Internal knowledge assistant",
        description:
          "A searchable assistant that helps teams find process information, service details, or document guidance faster.",
      },
      {
        title: "Document review workflow",
        description:
          "A system that classifies, summarizes, or routes files so teams spend less time on repetitive first-pass handling.",
      },
      {
        title: "Support and lead triage helper",
        description:
          "A structured AI layer that helps sort enquiries, suggest responses, and prepare human follow-up with better context.",
      },
    ],
    securityQuality: [
      "Workflow-level privacy awareness and access control",
      "Human review points for sensitive or high-impact outputs",
      "Input validation and exception handling for unreliable cases",
      "Error logging and usage-aware iteration",
      "Environment-aware deployment planning",
      "Safer integration patterns for system-connected automation",
    ],
    engagementModels: [
      {
        title: "AI discovery workshop",
        description: "Best when the organization has multiple ideas and needs help identifying the most practical first use case.",
      },
      {
        title: "Pilot implementation",
        description: "A focused phase to validate one AI-supported workflow before broader expansion.",
      },
      {
        title: "Workflow automation engagement",
        description: "For document, support, or operational processes that need AI plus structured business logic together.",
      },
      {
        title: "Optimization support",
        description: "For refining prompts, rules, review flow, and adoption after the initial implementation.",
      },
    ],
    faqs: [
      {
        question: "What kind of AI solutions do you focus on?",
        answer:
          "We focus on practical AI assistants, knowledge search, document workflows, support automation, and business process improvement rather than vague all-purpose AI claims.",
      },
      {
        question: "Can AI be connected to our current systems?",
        answer:
          "Yes, where integration is appropriate. We can review the process, data access, and system dependencies before recommending the safest approach.",
      },
      {
        question: "Do you build fully autonomous AI systems?",
        answer:
          "Not by default. Many business workflows are safer and more useful when AI supports people through review-aware steps instead of acting without oversight.",
      },
      {
        question: "How do you handle data privacy in AI workflows?",
        answer:
          "We plan access boundaries, process controls, review steps, and environment-aware handling so sensitive workflows remain more controlled.",
      },
      {
        question: "Can AI help with internal documents and knowledge search?",
        answer:
          "Yes. Internal search, summaries, classification, and guided knowledge access are among the most practical business use cases.",
      },
      {
        question: "How should we start if we are still exploring AI?",
        answer:
          "The best starting point is to identify one repetitive workflow or information bottleneck where AI can provide a clear operational improvement.",
      },
    ],
    relatedServices: ["data-analytics", "custom-software-development", "cloud-solutions"],
    finalCtaTitle: "Want AI that solves a real workflow problem instead of adding noise?",
    finalCtaDescription:
      "Tell us the process, the repeated task, or the information bottleneck you want to improve and we can help shape a practical AI direction.",
  },
  "data-analytics": {
    metaTitle: "Business Data Analytics and Dashboard Services | OneQuickSolutions",
    metaDescription:
      "Consolidate business data, automate reports and build clear dashboards for operational and management decision-making.",
    introKicker: "Data analytics",
    h1: "Turn Business Data into Clear, Actionable Dashboards",
    heroDescription:
      "We help businesses organize scattered information, automate reporting, and create dashboards that make daily operations and management decisions easier to understand.",
    heroChips: [
      "Management dashboards",
      "KPI tracking",
      "Data consolidation",
      "Automated reporting",
      "Role-based visibility",
    ],
    heroHighlights: [
      {
        title: "From scattered data to one view",
        copy: "Useful when business information lives across spreadsheets, portals, and disconnected reporting habits.",
      },
      {
        title: "Reporting with business context",
        copy: "A dashboard is only valuable when the numbers are shaped around the decisions people actually need to make.",
      },
      {
        title: "Visibility for operations and leadership",
        copy: "We can support daily operational reporting as well as management-level performance visibility.",
      },
    ],
    primaryCta: "Discuss Your Reporting Requirement",
    secondaryCta: "Explore AI Solutions",
    problems: [
      "Key information is spread across multiple spreadsheets, teams, or disconnected systems.",
      "Management reporting is delayed because the data collection process is still manual.",
      "Teams do not have one clear dashboard for operational activity, performance, or bottlenecks.",
      "Data quality or consistency issues make reporting harder to trust.",
      "People spend too much time preparing reports instead of acting on them.",
    ],
    solutions: [
      "Data consolidation from multiple internal sources",
      "Management and operational dashboards",
      "KPI tracking and scheduled reporting support",
      "Excel-to-dashboard migration where manual reporting is slowing the team down",
      "Data cleaning, transformation, and visibility planning",
      "Role-based access to reports and reporting workflows",
    ],
    audience: [
      "Businesses that need more reliable visibility into operations, hiring, sales, or service activity",
      "Leaders who want faster reporting without depending on manual spreadsheet updates",
      "Teams with multiple data sources that need one clearer view of performance",
      "Organizations modernizing reporting as part of broader digital transformation work",
    ],
    deliverables: [
      "Reporting requirement discovery and KPI mapping",
      "Data-source review and consolidation planning",
      "Dashboard structure and visualization layout",
      "Role-aware reporting access and visibility support",
      "Scheduled or repeatable reporting workflows",
      "Launch-ready dashboards with refinement guidance",
    ],
    processSummary:
      "Analytics engagements usually begin with business questions, reporting pain points, and source-data review so the dashboard design reflects useful decisions rather than generic charts.",
    technologyStack: [
      "Dashboard and reporting interfaces",
      "Data consolidation and transformation logic",
      "Role-based visibility and access handling",
      "Operational and management KPI layers",
      "Integration with existing systems and exports",
      "Cloud-ready reporting delivery where required",
    ],
    useCases: [
      {
        title: "Management performance dashboard",
        description:
          "A structured dashboard for leadership visibility across activity, progress, risks, and business priorities.",
      },
      {
        title: "Operational reporting workspace",
        description:
          "A live or regularly updated view of task flow, status movement, team workload, or process bottlenecks.",
      },
      {
        title: "Excel-to-dashboard migration",
        description:
          "A better reporting layer for businesses that have outgrown manual spreadsheet-driven visibility.",
      },
    ],
    securityQuality: [
      "Role-based report access and permissions",
      "Cleaner source-data handling and transformation discipline",
      "Validation-aware reporting logic and QA review",
      "Environment-aware dashboard deployment planning",
      "Safer integration with source systems or exports",
      "Structured release checks before production usage",
    ],
    engagementModels: [
      {
        title: "Reporting discovery phase",
        description: "Useful when the business questions are clear but the right dashboard structure is still undefined.",
      },
      {
        title: "Dashboard build project",
        description: "Best for teams ready to implement a specific reporting and KPI visibility layer.",
      },
      {
        title: "Data cleanup and reporting improvement",
        description: "For organizations that already have data but need a clearer structure and more dependable output.",
      },
      {
        title: "Ongoing reporting support",
        description: "For dashboard refinement, new KPIs, and operational improvements after launch.",
      },
    ],
    faqs: [
      {
        question: "Can you work with data that currently lives in spreadsheets?",
        answer:
          "Yes. Many reporting projects begin by organizing spreadsheet-based information into a cleaner dashboard flow.",
      },
      {
        question: "Do you only create management dashboards?",
        answer:
          "No. We can support operational dashboards, team-level reporting, and management visibility depending on the business need.",
      },
      {
        question: "Can dashboards be limited by user role?",
        answer:
          "Yes. Role-based visibility is often important so different teams only see the reporting that is relevant to them.",
      },
      {
        question: "Will you help define the KPIs too?",
        answer:
          "Yes. If needed, we can help shape the KPI structure around the decisions, workflows, and outcomes the business wants to monitor.",
      },
      {
        question: "Can reporting be automated instead of manually prepared?",
        answer:
          "Yes. One of the core goals of analytics work is reducing repeated manual reporting effort and improving consistency.",
      },
      {
        question: "Can you improve an existing dashboard?",
        answer:
          "Yes. We can review current reporting, highlight clarity gaps, and recommend how to improve structure, usability, and trust in the data.",
      },
    ],
    relatedServices: ["ai-solutions", "custom-software-development", "cloud-solutions"],
    finalCtaTitle: "Need cleaner reporting and better visibility across the business?",
    finalCtaDescription:
      "Tell us what data you already have, what questions leadership asks most often, and where reporting still feels too manual.",
  },
  "cloud-solutions": {
    metaTitle: "Cloud Solutions and Deployment Support | OneQuickSolutions",
    metaDescription:
      "Improve cloud readiness, deployment structure, uptime, and environment planning for websites, software and digital products.",
    introKicker: "Cloud solutions",
    h1: "Cloud Solutions That Support Stable Launches and Ongoing Growth",
    heroDescription:
      "We help businesses prepare websites, software, dashboards, and product workflows for reliable hosting, safer deployment, and more scalable digital delivery.",
    heroChips: ["Cloud hosting", "Deployment support", "Environment planning", "Performance", "Scalability"],
    heroHighlights: [
      {
        title: "Built for launch readiness",
        copy: "Deployment should support reliability, easier updates, and cleaner operational visibility.",
      },
      {
        title: "Aligned to the product",
        copy: "Cloud setup should match the workflow, user access pattern, and growth stage of the business.",
      },
      {
        title: "Practical, not overengineered",
        copy: "The right setup is the one that supports the current need while leaving room to evolve safely.",
      },
    ],
    primaryCta: "Discuss Your Hosting Requirement",
    secondaryCta: "Explore Custom Software",
    problems: [
      "The current deployment setup feels fragile, hard to update, or difficult to maintain.",
      "The business needs a cleaner path from development to launch and future changes.",
      "Performance, reliability, or environment separation are becoming more important as usage grows.",
      "Teams need better structure around hosting, access, and release management.",
      "A product or website is ready to scale but the deployment layer is not planned clearly enough yet.",
    ],
    solutions: [
      "Cloud-ready deployment planning for websites and applications",
      "Hosting structure review and environment setup support",
      "Safer release flow and operational visibility guidance",
      "Performance-aware hosting improvements and asset delivery planning",
      "Scalable environment thinking for evolving digital products",
      "Support for integration with wider software and reporting workflows",
    ],
    audience: [
      "Businesses preparing to launch or relaunch digital products with better technical structure",
      "Teams that need a more stable deployment approach for software, portals, or public websites",
      "Organizations improving operational reliability as usage or complexity increases",
      "Founders who want cloud decisions guided by practical business needs instead of unnecessary complexity",
    ],
    deliverables: [
      "Deployment and hosting review",
      "Environment structure recommendations",
      "Performance and asset-delivery guidance",
      "Release-flow and rollout planning",
      "Operational access and support considerations",
      "Improvement roadmap for future scale",
    ],
    processSummary:
      "Cloud work usually begins by reviewing how the product is used, deployed, updated, and supported so the environment can match the real operational need.",
    technologyStack: [
      "Cloud hosting environments",
      "Modern deployment workflows",
      "Secure environment separation",
      "Performance-aware asset delivery",
      "Role-based operational access",
      "Monitoring-aware release planning",
    ],
    useCases: [
      {
        title: "Website hosting modernization",
        description:
          "A cleaner production setup for faster public-page delivery, safer updates, and stronger reliability.",
      },
      {
        title: "Application environment planning",
        description:
          "A structured path for staging, production, and future release management across a business application.",
      },
      {
        title: "Portal scale-readiness review",
        description:
          "A deployment and performance review for a portal or dashboard that needs a more dependable operating setup.",
      },
    ],
    securityQuality: [
      "HTTPS-ready production configuration",
      "Environment separation for safer release handling",
      "Controlled operational access",
      "Performance-aware deployment planning",
      "Logging and review support where applicable",
      "Structured rollout and update discipline",
    ],
    engagementModels: [
      {
        title: "Deployment review",
        description: "A focused assessment of the current setup and the most important improvements to make next.",
      },
      {
        title: "Launch support",
        description: "Best for teams preparing to release a website, product, or application in a more structured way.",
      },
      {
        title: "Environment improvement engagement",
        description: "Useful when the product is already live but the hosting setup needs better reliability or maintainability.",
      },
      {
        title: "Ongoing support",
        description: "For staged improvements as the product, traffic, or operational requirements continue to grow.",
      },
    ],
    faqs: [
      {
        question: "Can you help even if our software is already deployed?",
        answer:
          "Yes. We can review the current environment, identify stability or performance concerns, and recommend practical improvements.",
      },
      {
        question: "Do you only support websites, or software products too?",
        answer:
          "We can support websites, dashboards, portals, and broader application delivery needs where deployment structure matters.",
      },
      {
        question: "Can you help us plan staging and production environments?",
        answer:
          "Yes. Environment separation is often an important part of safer releases and better long-term maintenance.",
      },
      {
        question: "Will you overcomplicate the hosting setup?",
        answer:
          "No. The goal is to choose a setup that matches the real business need and leaves sensible room for future growth.",
      },
      {
        question: "Can cloud planning be combined with website or software development?",
        answer:
          "Yes. Cloud considerations often work best when they are planned alongside the website, portal, or product being built.",
      },
    ],
    relatedServices: ["custom-software-development", "website-development", "data-analytics"],
    finalCtaTitle: "Need a cleaner deployment and hosting direction for your digital product?",
    finalCtaDescription:
      "Share what is live today, what feels unreliable, and what growth or operational requirements you need the environment to support.",
  },
  "ui-ux-design": {
    metaTitle: "UI/UX Design Services | OneQuickSolutions",
    metaDescription:
      "Create clear, conversion-focused, brand-aligned digital interfaces with stronger usability, hierarchy, and design consistency.",
    introKicker: "UI/UX design",
    h1: "UI and UX Design That Feels Credible, Clear, and Easy to Use",
    heroDescription:
      "We design websites, portals, dashboards, and product interfaces that guide users clearly, support conversion, and strengthen how the brand is perceived online.",
    heroChips: ["Wireframes", "Design systems", "Responsive UI", "Usability", "Conversion flow"],
    heroHighlights: [
      {
        title: "Clarity before decoration",
        copy: "Great UI/UX helps people understand what matters and what to do next without friction.",
      },
      {
        title: "Brand-aware design",
        copy: "The interface should look credible and distinctive without drifting away from the company identity.",
      },
      {
        title: "Useful across products and pages",
        copy: "We can support public websites, internal dashboards, portals, and product workflows.",
      },
    ],
    primaryCta: "Discuss Your Design Requirement",
    secondaryCta: "Explore Website Development",
    problems: [
      "The current interface feels outdated, inconsistent, or difficult to trust.",
      "Users struggle to find the most important actions or information quickly.",
      "The brand presentation does not match the quality of the business itself.",
      "Mobile layouts and spacing do not feel polished enough.",
      "Pages or dashboards have too much noise and not enough hierarchy.",
    ],
    solutions: [
      "Wireframes and information architecture planning",
      "Responsive interface design for websites, dashboards, and portals",
      "Visual systems aligned with brand identity",
      "Usability-led component design and layout improvement",
      "Conversion-aware landing and service page structure",
      "Design support for product MVPs and internal tools",
    ],
    audience: [
      "Businesses improving their public website, product dashboard, or portal experience",
      "Teams that need clearer user journeys and stronger content hierarchy",
      "Founders who want the product to feel more credible before scaling marketing or sales",
      "Organizations refining the experience of an existing application without rebuilding everything at once",
    ],
    deliverables: [
      "Wireframes and user-flow planning",
      "Visual direction and interface refinement",
      "Reusable UI patterns and component guidance",
      "Responsive page or screen design",
      "Interaction and hierarchy improvements",
      "Design handoff support for implementation",
    ],
    processSummary:
      "UI/UX work usually starts with user goals, business priorities, and interface pain points so the design can improve both usability and perceived trust.",
    technologyStack: [
      "Responsive UI systems",
      "Design-system thinking",
      "Component-led interface structure",
      "Conversion-aware content hierarchy",
      "Accessibility-minded layout planning",
      "Product and dashboard experience design",
    ],
    useCases: [
      {
        title: "Website redesign system",
        description:
          "A more premium visual and content structure for a public-facing business website.",
      },
      {
        title: "Dashboard usability refresh",
        description:
          "A clearer interface for teams that need quicker status visibility, simpler actions, and better on-screen hierarchy.",
      },
      {
        title: "Product MVP design",
        description:
          "A practical design foundation for a new product that needs to feel organized and trustworthy from the first release.",
      },
    ],
    securityQuality: [
      "Accessible layout and content structure",
      "Consistent interaction patterns across key flows",
      "Responsive behavior for major device sizes",
      "Design decisions that reduce confusion and form errors",
      "Handoff-ready structure for cleaner implementation",
      "Review-aware iteration before launch",
    ],
    engagementModels: [
      {
        title: "Design audit",
        description: "A focused review of the current interface and the biggest clarity or trust issues to solve first.",
      },
      {
        title: "Wireframe and design phase",
        description: "Useful when a product or website needs stronger structure before development proceeds.",
      },
      {
        title: "Redesign engagement",
        description: "Best for businesses upgrading an outdated, inconsistent, or low-conversion experience.",
      },
      {
        title: "Continuous UX improvement",
        description: "For iterative refinement after launch based on feedback and ongoing business needs.",
      },
    ],
    faqs: [
      {
        question: "Can you redesign an existing interface without changing the whole product?",
        answer:
          "Yes. We can improve hierarchy, layout, readability, and responsiveness without necessarily rebuilding every feature.",
      },
      {
        question: "Do you handle UX strategy as well as visual design?",
        answer:
          "Yes. We consider user goals, flows, hierarchy, and content clarity, not only visual styling.",
      },
      {
        question: "Can UI/UX work be combined with development?",
        answer:
          "Yes. Design and implementation often work best together so the final result stays consistent and practical.",
      },
      {
        question: "Will the design stay aligned with our brand identity?",
        answer:
          "Yes. The goal is to improve credibility and usability while staying consistent with the recognizable parts of your brand.",
      },
      {
        question: "Can you improve mobile usability specifically?",
        answer:
          "Yes. Mobile spacing, hierarchy, readability, and touch-friendly interaction are common parts of UI/UX refinement.",
      },
    ],
    relatedServices: ["website-development", "saas-development", "mobile-app-development"],
    finalCtaTitle: "Want your website or product to feel clearer and more premium?",
    finalCtaDescription:
      "Share which screens, pages, or user journeys feel weak today and we can help shape a stronger interface direction.",
  },
  "hr-consulting": {
    metaTitle: "HR Consulting and Recruitment Support | OneQuickSolutions",
    metaDescription:
      "Improve candidate sourcing, shortlisting, interview coordination, and hiring workflow visibility with structured HR consulting support.",
    introKicker: "HR consulting",
    h1: "Structured Hiring Support for Businesses That Need Better Recruitment Flow",
    heroDescription:
      "OneQuickSolutions helps businesses improve hiring through candidate verification, recruiter-led shortlisting, interview coordination, offer-stage support, and structured process visibility.",
    heroChips: ["Candidate verification", "Shortlisting", "Interview coordination", "Joining support", "HR portal"],
    heroHighlights: [
      {
        title: "Verified profiles first",
        copy: "Candidate quality checks and recruiter review help shortlists stay more practical and relevant.",
      },
      {
        title: "Workflow visibility",
        copy: "The process becomes easier to manage when interviews, updates, and follow-up stay organized.",
      },
      {
        title: "Portal-led growth",
        copy: "The HR management portal supports company and candidate entry points for more structured hiring delivery.",
      },
    ],
    primaryCta: "Discuss Your Hiring Requirement",
    secondaryCta: "View HR Management Portal",
    problems: [
      "Recruitment is slowed down by scattered candidate data and inconsistent shortlisting quality.",
      "Interview coordination and follow-up take too much manual effort.",
      "Hiring teams need more structured process visibility from sourcing to joining.",
      "Candidate communication and employer coordination feel fragmented.",
      "Growing recruitment needs require a more dependable digital workflow.",
    ],
    solutions: [
      "Candidate registration, verification, and database organization",
      "Recruiter-reviewed matching and shortlist preparation",
      "Interview scheduling, reminders, and follow-up support",
      "Offer-stage and joining-stage coordination",
      "Portal access for companies and candidates",
      "Workflow visibility for structured hiring operations",
    ],
    audience: [
      "Businesses that need smoother hiring coordination and stronger shortlist quality",
      "Teams handling frequent recruitment activity without enough workflow structure",
      "Organizations building a more dependable process for candidate movement and closure",
      "Employers that want a digital HR support flow alongside recruiter involvement",
    ],
    deliverables: [
      "Recruitment workflow review and hiring requirement alignment",
      "Candidate profile organization and shortlisting support",
      "Interview coordination and process follow-up",
      "Offer and joining support workflow",
      "HR portal entry guidance for employers and candidates",
      "Visibility recommendations for future hiring improvement",
    ],
    processSummary:
      "HR consulting work focuses on clearer candidate handling, recruiter-led review, structured communication, and stronger closure support so hiring moves with less avoidable friction.",
    technologyStack: [
      "Structured candidate workflow systems",
      "Role-based portal access for companies and candidates",
      "Recruitment visibility dashboards",
      "Consent-aware data handling",
      "AI-assisted matching signals with human review",
      "Cloud-ready HR portal delivery",
    ],
    useCases: [
      {
        title: "Recruitment support workflow",
        description:
          "A structured process for candidate handling, interview movement, and employer coordination.",
      },
      {
        title: "Company hiring portal access",
        description:
          "A digital entry point for employers who want clearer visibility and a more organized hiring journey.",
      },
      {
        title: "Candidate onboarding flow",
        description:
          "A guided profile and application path that helps candidates continue through a more structured recruitment process.",
      },
    ],
    securityQuality: [
      "Controlled access to candidate information",
      "Consent-aware data handling and sharing discipline",
      "Recruiter review before shortlist movement",
      "Structured follow-up and process ownership",
      "Portal-based role separation for companies and candidates",
      "Workflow visibility that supports more dependable delivery",
    ],
    engagementModels: [
      {
        title: "Hiring support engagement",
        description: "Best for teams that need immediate structure around sourcing, shortlisting, and coordination.",
      },
      {
        title: "Portal-led recruitment support",
        description: "Useful when a business wants a more digital and trackable hiring flow.",
      },
      {
        title: "Process improvement phase",
        description: "For organizations that already recruit actively but need clearer visibility and follow-through.",
      },
      {
        title: "Ongoing recruitment partnership",
        description: "For longer-term hiring support where consistency and closure quality matter.",
      },
    ],
    faqs: [
      {
        question: "What does your HR consulting support include?",
        answer:
          "It can include candidate verification, recruiter-led shortlisting, interview coordination, offer-stage follow-up, joining support, and workflow visibility.",
      },
      {
        question: "Can employers and candidates access separate workflows?",
        answer:
          "Yes. The HR management portal includes different entry points for companies and candidates so each side can continue through the right flow.",
      },
      {
        question: "How do you protect candidate information?",
        answer:
          "Candidate data is handled with controlled access, consent-aware sharing, and a more disciplined process structure.",
      },
      {
        question: "Can you support urgent openings and long-term hiring needs?",
        answer:
          "Yes. We can support immediate hiring requirements as well as more structured ongoing recruitment needs.",
      },
      {
        question: "Do you help after interviews and offers too?",
        answer:
          "Yes. Interview follow-up, offer movement, and joining-stage coordination can all be part of the support process.",
      },
    ],
    relatedServices: ["custom-software-development", "products/hr-management-portal", "data-analytics"],
    finalCtaTitle: "Need a more dependable recruitment flow for your business?",
    finalCtaDescription:
      "Share your hiring challenge, role expectations, and process gaps and we can help define the right next recruitment step.",
  },
};

export const serviceDetails: ServicePageData[] = serviceCards.map((service) => ({
  ...service,
  ...detailMap[service.slug],
}));

export const serviceSlugs = serviceDetails.map((service) => service.slug);

export function getServiceBySlug(slug: string) {
  return serviceDetails.find((service) => service.slug === slug);
}

export function requireService(slug: string): ServicePageData {
  const service = getServiceBySlug(slug);

  if (!service) {
    throw new Error(`Missing service data for ${slug}.`);
  }

  return service;
}
