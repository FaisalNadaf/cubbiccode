// Cubiccode services — authoritative copy. Drives /capabilities/[slug] + homepage showcase.

export type WorkItem = { name: string; note?: string };

export type Capability = {
  slug: string;
  icon: string; // lucide-react icon name
  title: string; // nav + card title
  short: string; // homepage "What We Do" card description
  headline: string; // hero H1
  subheadline: string; // hero sub-headline
  cta: string; // hero CTA label
  problem: string; // the opening problem paragraph
  buildHeading: string; // "What We Build" / "What We Automate" / etc.
  features: string[]; // the bullet list
  solution: string; // "How We Do It Better" paragraph
  result?: string; // optional "What You Get" / outcome paragraph
  work?: { heading: string; items: WorkItem[]; caseStudies?: boolean };
  buildAfter?: { title: string; text: string }[]; // training only
};

// Shared "Our Work — Web Apps We've Built" list (web app dev + ERP).
const webApps: WorkItem[] = [
  { name: "CityIndex", note: "investment web application" },
  { name: "Lonar Solutions", note: "Portfolio Management System" },
  { name: "FORCE" },
  { name: "JL Wing — Indian Army" },
  { name: "Bridge Now" },
  { name: "Synapsis Techno Instruments" },
  { name: "Cleancode" },
  { name: "Queues" },
  { name: "Belgaum Matrimony" },
  { name: "Crypto Trading" },
];

export const capabilities: Capability[] = [
  {
    slug: "website-development",
    icon: "MonitorSmartphone",
    title: "Website Designing & Development",
    short:
      "Conversion-first websites, e-commerce stores, booking platforms and web applications. Fast, responsive, and built to rank.",
    headline: "Websites designed to impress and engineered to convert.",
    subheadline:
      "Striking, on-brand websites, e-commerce stores and booking platforms — built fast, built to rank, built to sell. 700+ projects and counting.",
    cta: "Start Your Project",
    problem:
      "First impressions happen in milliseconds. Most businesses are quietly losing customers to their own website — it loads slowly, looks dated on mobile, ranks nowhere on Google, and gives visitors no clear reason to act. Worse, a tired, generic, template-built site tells your best prospects you're a tired, generic business. It isn't an asset — it's a silent leak in your revenue.",
    buildHeading: "What We Build",
    features: [
      "Custom Website Design — distinctive, design-led, and unmistakably yours. No templates, ever.",
      "Responsive & Mobile-First Builds — pixel-perfect on every screen size.",
      "E-commerce Stores — secure, conversion-optimised storefronts with payments and inventory.",
      "Booking & Appointment Websites — for clinics, salons, services and events.",
      "Landing Pages — high-converting pages for campaigns and product launches.",
      "CMS Integration — update your content yourself, no developer required.",
      "Speed & SEO Optimisation — fast load, strong Core Web Vitals, ranking-ready from day one.",
      "Maintenance & AMC — we don't vanish at launch.",
    ],
    solution:
      "Design is where we refuse to compromise. Every site is crafted from scratch around your brand and your customer — never a recycled template — so you look like the elite business you are. And we own the outcome, not just the pixels: a dedicated project manager owns your timeline, we agree a launch date and hit it, and every build is mobile-first, SEO-ready and tested before it touches your customers. Because our expertise is in-house, you get premium design at a price that respects your budget.",
    work: {
      heading: "Our Work — Websites We've Built",
      items: [
        { name: "Harsha & Rakesh Salon" },
        { name: "Positron Engineering Corporation" },
        { name: "Creintors Group of Companies" },
        { name: "Mabda Group" },
        { name: "Avenore Events" },
        { name: "Simple.life" },
        { name: "Initium" },
      ],
    },
  },
  {
    slug: "web-application-development",
    icon: "AppWindow",
    title: "Web Application Development",
    short:
      "Web apps, SaaS products, custom dashboards, admin panels and API integrations. Built to scale, backed by ongoing support & AMC.",
    headline: "Powerful web applications, built to scale with your business.",
    subheadline:
      "Web applications, SaaS products, dashboards and customer portals — engineered for performance, security and growth.",
    cta: "Start Your Project",
    problem:
      "Spreadsheets and off-the-shelf tools only take you so far. As you grow, you hit the ceiling: manual processes that don't scale, data scattered across disconnected apps, and no single system that works the way you actually do. You know you need software built around your business — but custom development feels risky, slow and expensive, and you've heard the horror stories of half-built apps and developers who disappeared.",
    buildHeading: "What We Build",
    features: [
      "Custom Web Applications — bespoke software engineered around your exact workflow.",
      "SaaS Products — multi-tenant, subscription-ready platforms, from MVP to scale.",
      "Dashboards & Admin Panels — real-time data, clean UX, role-based access control.",
      "Customer & Client Portals — secure self-service for your users and partners.",
      "API Integration & Development — connect to payments, CRMs, ERPs and third-party services.",
      "Progressive Web Apps (PWAs) — app-like experiences without the app store.",
      "Ongoing Support & AMC — we monitor, maintain and evolve what we build.",
    ],
    solution:
      "We build on a modern, proven technology stack chosen for performance, security and long-term maintainability — not trends. We architect for scale from day one, so your app grows with your user base instead of buckling under it. One accountable team takes you from blueprint to deployment to support, and you fully own the product — no lock-in, no per-seat ransom.",
    work: {
      heading: "Our Work — Web Apps We've Built",
      items: webApps,
      caseStudies: true,
    },
  },
  {
    slug: "custom-erp",
    icon: "Boxes",
    title: "Custom ERP Software Solutions",
    short:
      "Tailored ERP systems that replace spreadsheets and chaos with one source of truth for your operations.",
    headline: "One system to run your entire operation.",
    subheadline:
      "Custom ERP software that replaces spreadsheets, WhatsApp chaos and disconnected tools with a single source of truth — built around how your business actually works.",
    cta: "Book an ERP Consultation",
    problem:
      "Your sales data lives in one place, inventory in another, accounts in a third — and the real status of anything lives in someone's head. Off-the-shelf ERP forces you to change your business to fit the software. Both cost you time, money and visibility — exactly when you're trying to scale.",
    buildHeading: "What We Build",
    features: [
      "Custom ERP modules for sales, inventory, procurement, HR, accounts and operations.",
      "Role-based dashboards so every team sees exactly what they need — and nothing they don't.",
      "Real-time reporting that replaces month-end guesswork with live numbers.",
      "Integrations with your existing tools, website, payment systems and hardware.",
      "Cloud-based access so your team works from anywhere, securely.",
    ],
    solution:
      "We build the ERP around your workflow, not the other way around. We start by mapping how your business actually runs, then engineer a system that fits like a glove. You get one accountable team from blueprint to deployment to support, and software you fully own — no per-seat ransom, no vendor lock-in.",
    work: {
      heading: "Our Work — Web Apps We've Built",
      items: webApps,
      caseStudies: true,
    },
  },
  {
    slug: "workflow-automation",
    icon: "Workflow",
    title: "Workflow Automation",
    short:
      "Cut the repetitive work. We automate approvals, follow-ups, reporting and handoffs so your team scales without hiring.",
    headline: "Stop doing work software should be doing.",
    subheadline:
      "We automate the repetitive, manual tasks draining your team — approvals, follow-ups, data entry, reporting and handoffs — so you scale output without scaling headcount.",
    cta: "Find What to Automate",
    problem:
      "Your best people spend hours every week copying data between tools, chasing approvals, sending the same follow-ups, and assembling reports by hand. It's slow, it's error-prone, and it doesn't scale — every new customer adds more manual work.",
    buildHeading: "What We Automate",
    features: [
      "Lead & enquiry routing — captured, assigned and followed up automatically.",
      "Approvals & notifications — no more chasing people on WhatsApp.",
      "Data sync — between your website, CRM, ERP and spreadsheets.",
      "Reporting — dashboards and scheduled reports that build themselves.",
      "Customer communication — onboarding, reminders and updates on autopilot.",
      "Document & invoice generation — triggered, not typed.",
    ],
    solution:
      "We start with your bottleneck, not a tool. We audit where your team loses hours, then design automations that remove that friction — with full accountability and clear before/after metrics. You see exactly how much time you've reclaimed.",
  },
  {
    slug: "seo",
    icon: "TrendingUp",
    title: "SEO, Search Visibility & Domain Authority Accelerator",
    short:
      "Search visibility that compounds. Technical SEO, content and authority-building that puts you in front of buyers.",
    headline: "Get found by the customers already searching for you.",
    subheadline:
      "Technical SEO, content and authority-building that compounds — so your business climbs the rankings and stays there. “Taken off in the search engines like a rocket,” in our clients' words.",
    cta: "Rank Your Business on Top",
    problem:
      "You can have the best products and services in your market and still be invisible. If you're not on page one when buyers search, those buyers go to a competitor who is. And SEO done badly — keyword stuffing, spammy backlinks — can actively hurt you.",
    buildHeading: "What We Do",
    features: [
      "Technical SEO — speed, structure, mobile, indexing and Core Web Vitals.",
      "On-page optimisation — content, metadata and internal linking that ranks.",
      "Off-page & authority-building — quality backlinks that raise your domain authority.",
      "Local SEO & Google Business Profile — own your city's searches.",
      "Content optimisation — built around what your buyers actually search.",
      "Analytics & reporting — transparent rankings, traffic and lead tracking.",
    ],
    solution:
      "We build authority that compounds, not shortcuts that get penalised. Our SEO is engineered into the website from the architecture up — and tracked with honest reporting, so you see ranking and traffic movement, not vanity metrics.",
    result:
      "Higher rankings, more qualified organic traffic, a rising domain authority that gets harder for competitors to beat, and a clear line from search visibility to leads.",
  },
];

export const capabilityBySlug = (slug: string) =>
  capabilities.find((c) => c.slug === slug);
