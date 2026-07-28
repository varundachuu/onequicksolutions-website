import company from "@/shared/company.json";

export const companyInfo = {
  name: company.name,
  siteUrl: company.siteUrl,
  email: company.email,
  phones: company.phones,
  logoPath: company.logoPath,
  ogImage: company.ogImage,
  description:
    "OneQuickSolutions is a founder-led technology startup providing custom software development, business websites, SaaS platforms, mobile applications, AI automation and data analytics solutions.",
  tagline:
    "Custom software, business websites, SaaS platforms, workflow automation and digital solutions",
};

export const homeHeroChips = [
  "Custom Software",
  "Business Websites",
  "SaaS Platforms",
  "Workflow Automation",
];

export const deliveryHighlights = [
  {
    title: "Founder-led planning",
    copy: "You communicate directly with the people responsible for solution planning and delivery.",
  },
  {
    title: "Focused service coverage",
    copy: "We prioritise software, websites and SaaS platforms while supporting analytics, AI, cloud and UX needs around them.",
  },
  {
    title: "Practical project structure",
    copy: "Discovery, deliverables, milestones and next steps are discussed clearly before development moves forward.",
  },
];

export const heroStats = [
  {
    title: "Business-first thinking",
    copy: "We shape features around workflows, users and operational outcomes.",
  },
  {
    title: "Founder-led involvement",
    copy: "Requirements and delivery direction stay close to the founding team.",
  },
  {
    title: "Flexible engagement",
    copy: "You can begin with discovery, a prototype, an MVP or a defined first phase.",
  },
];

export const whyChooseUsReasons = [
  {
    title: "Founder-led involvement",
    description:
      "Clients communicate directly with the people responsible for solution planning and delivery.",
    icon: "compass",
  },
  {
    title: "Business-first thinking",
    description:
      "Features are connected to real business requirements, user needs and operational outcomes.",
    icon: "layers",
  },
  {
    title: "Flexible engagement",
    description:
      "Work can begin with discovery, a prototype, an MVP or a defined first phase.",
    icon: "people",
  },
  {
    title: "Clear project structure",
    description:
      "Scope, deliverables, milestones and responsibilities are discussed before development begins.",
    icon: "growth",
  },
  {
    title: "Practical technology selection",
    description:
      "Technology is selected according to project requirements, maintainability and future growth.",
    icon: "shield",
  },
  {
    title: "Long-term improvement",
    description:
      "Solutions can be enhanced gradually based on real usage and changing business requirements.",
    icon: "support",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discovery and business alignment",
    description:
      "We begin by understanding your business model, operational friction, users, and commercial goals so the solution is shaped around the right problem.",
  },
  {
    step: "02",
    title: "Strategy and solution planning",
    description:
      "We define scope, priorities, architecture direction, user flows, and delivery milestones to reduce ambiguity before development begins.",
  },
  {
    step: "03",
    title: "UI/UX and experience design",
    description:
      "We translate the plan into a usable experience with clear navigation, visual hierarchy, responsive layouts, and conversion-aware design decisions.",
  },
  {
    step: "04",
    title: "Build and integrate",
    description:
      "Our team develops the solution with clean structure, scalable patterns, and the integrations needed to support your wider workflow.",
  },
  {
    step: "05",
    title: "QA, performance, and launch readiness",
    description:
      "We validate experience quality, responsiveness, accessibility, and reliability before launch so your product feels stable and trustworthy.",
  },
  {
    step: "06",
    title: "Launch, support, and improve",
    description:
      "After release, we continue refining performance, content, and features so the platform remains useful as your business evolves.",
  },
];

export const technologyGroups = [
  {
    icon: "frontend",
    title: "Frontend experiences",
    description:
      "Responsive interfaces, component-driven UI systems, and modern web experiences built for clarity and performance.",
    chips: ["React-based UI", "Responsive layouts", "Interactive dashboards"],
  },
  {
    icon: "backend",
    title: "Backend systems",
    description:
      "Structured application logic, API-first thinking, secure workflows, and scalable system architecture for business operations.",
    chips: ["APIs", "Workflow logic", "Role-based portals"],
  },
  {
    icon: "mobile",
    title: "Mobile delivery",
    description:
      "Application experiences for on-the-go users, internal teams, and customer-facing workflows that need reliable mobility.",
    chips: ["Mobile UX", "Cross-platform support", "App integrations"],
  },
  {
    icon: "cloud",
    title: "Cloud and deployment",
    description:
      "Cloud-ready environments, modern hosting, deployment planning, and infrastructure support designed for uptime and growth.",
    chips: ["Cloud hosting", "Deployment support", "Scalable environments"],
  },
  {
    icon: "data",
    title: "Data and analytics",
    description:
      "Reporting layers, dashboard thinking, structured data flows, and insight delivery that help leaders make faster decisions.",
    chips: ["Dashboards", "Reporting", "Business visibility"],
  },
  {
    icon: "ai",
    title: "AI and automation",
    description:
      "Purposeful AI integrations and automation systems that make support, operations, and decision-making more efficient.",
    chips: ["Automation", "Assistants", "Smart workflows"],
  },
  {
    icon: "design",
    title: "Design systems",
    description:
      "Brand-aligned UI design, wireframes, prototypes, and reusable interface patterns that improve consistency across products.",
    chips: ["Wireframes", "Prototypes", "Design systems"],
  },
  {
    icon: "spatial",
    title: "BIM and GIS toolchains",
    description:
      "Digital support for mapping, spatial analysis, infrastructure information, and technical data visibility requirements.",
    chips: ["GIS workflows", "Spatial data", "Technical delivery"],
  },
];

export const industryGroups = [
  {
    title: "Startups",
    description:
      "Product-minded teams that need speed, flexibility, and a strong digital foundation from the beginning.",
  },
  {
    title: "SMEs",
    description:
      "Growing businesses that want sharper websites, better operations, and practical digital systems without unnecessary complexity.",
  },
  {
    title: "Enterprises",
    description:
      "Larger organizations looking for structured delivery, workflow visibility, scalable systems, and dependable collaboration.",
  },
  {
    title: "Educational Institutions",
    description:
      "Colleges, academies, and training-led teams that need accessible learning experiences and structured programme support.",
  },
  {
    title: "HR and recruitment teams",
    description:
      "Organizations that need smoother shortlisting, candidate management, recruitment coordination, and hiring process support.",
  },
  {
    title: "Infrastructure and geospatial teams",
    description:
      "Businesses working with mapping, built-environment data, GIS, BIM, and technical information workflows.",
  },
];

export const businessChallengeCards = [
  {
    title: "Manual and repetitive processes",
    description:
      "Replace repeated data entry, manual approvals and disconnected spreadsheets with structured digital workflows.",
  },
  {
    title: "Information spread across systems",
    description:
      "Connect applications, databases, files and business tools to improve access, coordination and reporting.",
  },
  {
    title: "Limited operational visibility",
    description:
      "Create dashboards and reports that help management understand performance, pending work and bottlenecks.",
  },
  {
    title: "Existing software does not fit",
    description:
      "Develop custom systems around business requirements instead of forcing teams to work around generic software.",
  },
  {
    title: "Outdated business website",
    description:
      "Create a professional online presence that clearly explains services and supports enquiries.",
  },
  {
    title: "Product idea without technical execution",
    description:
      "Plan and build MVPs, SaaS platforms and mobile applications through clearly defined development phases.",
  },
];

export const audienceProfiles = [
  {
    title: "Startups validating a product idea",
    description:
      "Suitable for founders who need help shaping an MVP, portal or early product workflow into a structured first release.",
  },
  {
    title: "Growing businesses replacing manual processes",
    description:
      "Designed for teams moving away from spreadsheets, repeated approvals and disconnected operational tools.",
  },
  {
    title: "SMEs requiring internal software",
    description:
      "Useful for businesses that need dashboards, employee portals, workflow systems and reporting visibility.",
  },
  {
    title: "Service businesses improving their online presence",
    description:
      "A good fit for businesses that need clearer service communication, stronger design and better enquiry journeys.",
  },
  {
    title: "HR and recruitment teams needing workflow systems",
    description:
      "Suitable for teams that want more structured candidate handling, job flow, recruiter coordination and hiring visibility.",
  },
  {
    title: "Educational organisations building digital platforms",
    description:
      "Useful for institutions and training-led teams planning accessible learning, onboarding or programme support flows.",
  },
  {
    title: "Management teams requiring consolidated reports",
    description:
      "A strong fit for leaders who need clearer KPIs, dashboard visibility and less manual reporting effort.",
  },
  {
    title: "Companies modernising existing software",
    description:
      "Suitable for teams improving an outdated system, weak workflow structure or fragile launch environment.",
  },
];

export const solutionBuildCards = [
  {
    title: "Business management portals",
    description:
      "Portals that bring workflows, approvals, reporting and user roles into one structured system.",
  },
  {
    title: "Admin dashboards",
    description:
      "Operational dashboards that help teams manage status, users, requests, reports and decision-making.",
  },
  {
    title: "Employee portals",
    description:
      "Internal applications for records, attendance, approvals, communication and day-to-day staff workflows.",
  },
  {
    title: "Customer portals",
    description:
      "Secure user areas where customers can manage accounts, requests, applications or service activity.",
  },
  {
    title: "Recruitment and HR systems",
    description:
      "Platforms that support candidate flow, recruiter coordination, company access and hiring visibility.",
  },
  {
    title: "Workflow and approval applications",
    description:
      "Systems that replace manual follow-up with structured steps, role-based actions and status tracking.",
  },
  {
    title: "CRM and lead-management systems",
    description:
      "Sales and enquiry workflows that centralise lead capture, follow-up and visibility across teams.",
  },
  {
    title: "Reporting dashboards",
    description:
      "Dashboard layers that consolidate operational data and turn it into clearer business visibility.",
  },
  {
    title: "SaaS platforms and mobile applications",
    description:
      "Customer-facing products, multi-user workflows and mobile access layers designed around real usage needs.",
  },
  {
    title: "AI-assisted workflows and integrations",
    description:
      "Automation, document support, knowledge access and API-connected processes designed for practical business use.",
  },
];

export const engagementApproaches = [
  {
    title: "Discovery and planning",
    description:
      "Suitable for businesses that need help defining the solution clearly before development begins.",
  },
  {
    title: "Prototype or MVP",
    description:
      "Suitable for validating a product or workflow with a focused initial version and practical release scope.",
  },
  {
    title: "Fixed-scope project",
    description:
      "Suitable when requirements, deliverables and milestones are already defined clearly enough to move ahead.",
  },
  {
    title: "Milestone-based development",
    description:
      "Suitable for larger projects that need to be delivered through approved phases and evolving priorities.",
  },
  {
    title: "Maintenance and enhancement",
    description:
      "Suitable for improving, supporting or extending an existing website, application or business system.",
  },
];

export const portfolioStories = [
  {
    title: "Recruitment Workflow Platform",
    type: "Representative solution blueprint",
    businessChallenge:
      "Recruitment teams may rely on email, spreadsheets and disconnected tools to track candidates, vacancies and interview progress.",
    proposedSolution:
      "A role-based recruitment platform for managing candidates, employers, jobs, applications, interviews and status updates.",
    keyCapabilities: [
      "Candidate database",
      "Employer portal",
      "Job management",
      "Application workflow",
      "Interview tracking",
      "Notifications and recruitment reports",
    ],
    expectedOutcome:
      "A more structured recruitment workflow designed to improve visibility, coordination and reporting.",
  },
  {
    title: "Business Website and Enquiry Platform",
    type: "Representative solution blueprint",
    businessChallenge:
      "A service business may have an outdated website, weak service communication and limited enquiry flow.",
    proposedSolution:
      "A multi-page business website with clear service pages, responsive design, SEO-ready structure and enquiry-focused calls to action.",
    keyCapabilities: [
      "Dedicated service pages",
      "Responsive layouts",
      "Structured contact journeys",
      "Technical SEO foundations",
      "Analytics and Search Console setup",
    ],
    expectedOutcome:
      "A clearer digital presence designed to improve trust, explain services better and support more enquiries.",
  },
  {
    title: "Excel-to-Workflow Operations System",
    type: "Representative solution blueprint",
    businessChallenge:
      "A growing business may still depend on spreadsheets, manual approvals and duplicate data entry across teams.",
    proposedSolution:
      "A custom internal application with role-based workflows, dashboards, approval tracking and system integrations.",
    keyCapabilities: [
      "Role-based user access",
      "Workflow automation",
      "Approval tracking",
      "Dashboards and reports",
      "API integrations",
    ],
    expectedOutcome:
      "A more dependable internal workflow designed to reduce repetition, improve reporting and centralise operations.",
  },
  {
    title: "SaaS MVP for a Growing Service Model",
    type: "Representative solution blueprint",
    businessChallenge:
      "A founder may have a repeatable service workflow that needs to be turned into a scalable subscription platform.",
    proposedSolution:
      "A SaaS MVP with user onboarding, customer accounts, workflow logic, dashboards and future-ready integration points.",
    keyCapabilities: [
      "MVP feature planning",
      "Customer account flows",
      "Admin dashboard",
      "Reporting visibility",
      "Notification and integration readiness",
    ],
    expectedOutcome:
      "A practical first product release designed to validate the core workflow and support future product expansion.",
  },
];

export const clientConfidenceItems = [
  {
    title: "Clear communication",
    description:
      "We keep conversations practical, transparent, and focused on priorities so projects move forward without unnecessary confusion.",
  },
  {
    title: "Business-first thinking",
    description:
      "Every recommendation is shaped around your workflow, market position, and operational reality rather than generic delivery habits.",
  },
  {
    title: "Longer-term support",
    description:
      "Launch is not treated as the finish line. We stay available for refinement, optimization, and the next stage of growth.",
  },
];

export const productSpotlight = {
  title: "HR Management Portal",
  label: "Internal product in development",
  summary:
    "A role-based recruitment and HR workflow platform designed for companies, candidates and recruitment teams.",
  description:
    "This internal product demonstrates how OneQuickSolutions approaches hiring workflow design through company access, candidate onboarding, application flow, recruiter coordination and reporting visibility.",
  bullets: [
    "Company registration and candidate registration flows",
    "Job posting, application tracking and candidate status management",
    "Recruiter dashboard, role-based access and reporting visibility",
  ],
  tags: ["HR management", "Recruitment portal", "Candidate workflow"],
};

export const hiringEntryCards = [
  {
    audience: "For companies",
    title: "Start hiring with OneQuickSolutions",
    description:
      "Open the company login to manage hiring needs, review candidate activity, and move faster with a more organized recruitment flow.",
    buttonLabel: "Hire Here",
    href: `${company.portalUrl}/?userType=company`,
  },
  {
    audience: "For candidates",
    title: "Create your profile and start applying",
    description:
      "Open the candidate login to register, complete your details, and apply for opportunities through the OneQuickSolutions hiring portal.",
    buttonLabel: "Apply Here",
    href: `${company.portalUrl}/?userType=candidate`,
  },
];

export const programs = [
  {
    title: "E-Shikshana",
    description:
      "A digital training and education initiative designed to make upskilling more structured, practical, and accessible.",
    icon: "graduation",
  },
  {
    title: "Training enablement",
    description:
      "Programme support for institutions and teams that need guided digital learning, onboarding, or capability development.",
    icon: "teacher",
  },
  {
    title: "Foundational learning support",
    description:
      "Learner-friendly content and programme structure for people building stronger technical and analytical fundamentals.",
    icon: "book",
  },
];

export const aboutPillars = [
  {
    title: "Mission",
    description:
      "To help businesses build digital systems that are more useful, more credible, and easier to grow with confidence.",
  },
  {
    title: "Vision",
    description:
      "To become a trusted long-term partner for organizations that want stronger digital execution without unnecessary complexity.",
  },
  {
    title: "Expertise",
    description:
      "Our work spans software, SaaS, websites, mobile, AI, analytics, cloud, recruitment support, and digital training.",
  },
  {
    title: "Approach",
    description:
      "We value clear communication, practical problem solving, and business-aware delivery that continues after launch.",
  },
];

export const teamGroups = {
  founders: [
    {
      image: "/images/Profile-Images/varun1.jpg",
      name: "Varun",
      title: "Founder and Managing Director",
      badge: "Founder",
      description:
        "Focused on business direction, delivery momentum, and helping clients turn ideas into structured digital outcomes.",
    },
    {
      image: "/images/Profile-Images/Yogesh4.jpg",
      name: "Yogesh",
      title: "Founder and Chief Executive Officer",
      badge: "Founder",
      description:
        "Brings execution focus, collaboration leadership, and a practical approach to growth-oriented digital delivery.",
    },
  ],
  partners: [
    {
      name: "Chirag",
      title: "Working Partner",
      badge: "Partner",
      image: "/images/Profile-Images/chirag.jpg",
    },
    {
      name: "Gowtham",
      title: "Working Partner",
      badge: "Partner",
    },
    {
      name: "Santhosh",
      title: "Working Partner",
      badge: "Partner",
    },
  ],
};

export const contactMethods = [
  {
    label: "Email us",
    value: companyInfo.email,
    href: `mailto:${companyInfo.email}`,
    icon: "mail",
  },
  {
    label: "Call us",
    value: `${companyInfo.phones[0]} / ${companyInfo.phones[1]}`,
    href: "tel:+918073981290",
    icon: "phone",
  },
  {
    label: "Response time",
    value: "Usually within one business day",
    icon: "clock",
  },
];
