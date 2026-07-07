// Content imagery for capabilities & industries.
//
// Maps every capability / industry  and each of their features, solutions and
// "problem" scenes  to a matching image in /public/images/downloads, chosen by
// the file's descriptive name. Feature / solution arrays are INDEX-ALIGNED to
// the `features` / `solutions` arrays in capabilities.ts / industries.ts, so keep
// them in the same order when either list changes.

const DIR = "/images/downloads/";
const p = (name: string) => `${DIR}${name}`;

// Real client screenshots  a neutral fallback if a mapping is ever missing.
const FALLBACK_POOL = [
  "/images/portfolio/city-index.jpg",
  "/images/portfolio/laxis-analytics.jpg",
  "/images/portfolio/prions-biotech.jpg",
  "/images/portfolio/woodpecker-exotic.jpg",
  "/images/portfolio/harsha-rakesh.jpg",
  "/images/portfolio/aishwarya-cottons.png",
];
const fallback = (i: number) => FALLBACK_POOL[i % FALLBACK_POOL.length];

/* ── Capabilities ─────────────────────────────────────────────────────────── */

// Hero / card image per capability slug.
const CAPABILITY_IMAGE: Record<string, string> = {
  "website-development": p("Website Designing & Development.webp"),
  "web-application-development": p("Web Application Development.webp"),
  "custom-erp": p("Custom ERP Software Solutions.jpg"),
  "workflow-automation": p("Workflow Automation.jpg"),
  seo: p("SEOSearchVisibilityDomainAuthorityAccelerator.jpg"),
};

// One image per feature (aligned to capabilities.ts `features`, in order).
const CAPABILITY_FEATURE_IMAGES: Record<string, string[]> = {
  "website-development": [
    p("CustomWebsiteDesign.jpg"),
    p("ResponsiveMobile-FirstBuilds.jpg"),
    p("E-commerceStores.jpg"),
    p("Booking & Appointment Websites_converted.jpg"),
    p("High-converting landing pages.jpg"),
    p("CMS Integration_converted.jpg"),
    p("SpeedSEOOptimisation_converted.jpg"),
    p("Maintenance & AMC website.webp"),
  ],
  "web-application-development": [
    p("Custom Web Applications.webp"),
    p("SaaS Products.webp"),
    p("DashboardsAdminPanel.jpeg"),
    p("Customer & Client Portals_converted.jpg"),
    p("API Integration & Development.webp"),
    p("web application development.jpg"),
    p("Ongoing Support & AMC_converted.jpg"),
  ],
  "custom-erp": [
    p("Custom ERP modules.webp"),
    p("Role-based dashboards.webp"),
    p("Real-time reporting.webp"),
    p("Integrations with your existing tools.webp"),
    p("Cloud-based access.webp"),
  ],
  "workflow-automation": [
    p("Lead Generation.webp"),
    p("Automated notifications_converted.jpg"),
    p("Integrations with your existing tools.webp"),
    p("Automatedreporting.jpg"),
    p("Communicationautomation.jpg"),
    p("Workflow automation_converted.jpg"),
  ],
  seo: [
    p("Technical SEO.webp"),
    p("On-page optimisation.webp"),
    p("Off-page & authority-building.webp"),
    p("Local SEO & Google Business Profile.webp"),
    p("Contentoptimisation_converted.jpg"),
    p("Analyticsreporting_converted.jpg"),
  ],
};

// Four topical images for the "The Problem" floating scene per capability.
const CAPABILITY_PROBLEM_IMAGES: Record<string, string[]> = {
  "website-development": [
    p("Slow load.webp"),
    p("Datedonmobile.jpg"),
    p("seo.webp"),
    p("Lost leads.jpg"),
  ],
  "web-application-development": [
    p("Custom Web Applications.webp"),
    p("SaaS Products.webp"),
    p("DashboardsAdminPanel.jpeg"),
    p("Customer & Client Portals_converted.jpg"),
  ],
  "custom-erp": [
    p("Custom ERP modules.webp"),
    p("Role-based dashboards.webp"),
    p("Real-time reporting.webp"),
    p("Integrations with your existing tools.webp"),
  ],
  "workflow-automation": [
    p("Communicationautomation.jpg"),
    p("Automatedreporting.jpg"),
    p("Automated notifications_converted.jpg"),
    p("Follow-up automation_converted.jpg"),
  ],
  seo: [
    p("Technical SEO.webp"),
    p("On-page optimisation.webp"),
    p("Off-page & authority-building.webp"),
    p("Local SEO & Google Business Profile.webp"),
  ],
};

export const capabilityImage = (slug: string): string =>
  CAPABILITY_IMAGE[slug] ?? fallback(0);

export const capabilityFeatureImages = (
  slug: string,
  count: number
): string[] => {
  const set = CAPABILITY_FEATURE_IMAGES[slug] ?? [];
  return Array.from({ length: count }, (_, i) => set[i] ?? fallback(i));
};

export const capabilityProblemImages = (slug: string): string[] => {
  const set = CAPABILITY_PROBLEM_IMAGES[slug];
  return set && set.length >= 4
    ? set.slice(0, 4)
    : Array.from({ length: 4 }, (_, i) => fallback(i));
};

/* ── Industries ───────────────────────────────────────────────────────────── */

// Hero / card image per industry slug.
const INDUSTRY_IMAGE: Record<string, string> = {
  manufacturing: p("IndustriesManufacturingUnits.jpg"),
  education: p("EducationTrainingInstitutes.jpg"),
  logistics: p("LogisticsTransport.jpg"),
  healthcare: p("HealthcareHospitalsClinicsWellness.jpg"),
  construction: p("ConstructionRealEstate.jpg"),
  smes: p("SmallMediumEnterprisesSMEs.jpg"),
  retail: p("Retail Chains & Franchises.webp"),
  staffing: p("HRStaffingAgencies.jpg"),
  startups: p("NewStart-ups.jpg"),
};

// One image per solution (aligned to industries.ts `solutions`, in order).
const INDUSTRY_SOLUTION_IMAGES: Record<string, string[]> = {
  manufacturing: [
    p("B2B product catalogue websites.webp"),
    p("RFQenquiryportals.jpg"),
    p("CustomERP_converted.jpg"),
    p("Dealer & distributor portals_converted.jpg"),
    p("Workflow automation_converted.jpg"),
    p("Industrial SEO.webp"),
  ],
  education: [
    p("Lead Generation.webp"),
    p("Admission-focused websites engineered.webp"),
    p("Follow-up automation_converted.jpg"),
    p("Student & admission portals.webp"),
    p("LearningManagementSystems_converted.jpg"),
    p("Local & education SEO.jpg"),
    p("Fee & communication automation_converted.jpg"),
  ],
  logistics: [
    p("Customertrackingportals_converted.jpg"),
    p("Onlinebookingplatforms_converted.jpg"),
    p("Fleet & dispatch dashboards_converted.jpg"),
    p("Custom logistics ERP_converted.jpg"),
    p("Automated notifications_converted.jpg"),
    p("SEO & web presence.webp"),
  ],
  healthcare: [
    p("Appointment-booking websites_converted.jpg"),
    p("Automated reminders_converted.jpg"),
    p("Patient portals_converted.jpg"),
    p("Clinic & hospital management dashboards_converted.jpg"),
    p("Local SEO & Google Business Profile.webp"),
    p("Review & reputation building.jpg"),
  ],
  construction: [
    p("Premium project & property showcase websites.jpg"),
    p("Property listing portals_converted.jpg"),
    p("Lead-capture & CRM systems_converted.jpg"),
    p("Follow-up automation_converted.jpg"),
    p("Real estate SEO & local visibility_converted.jpg"),
    p("Virtualtoursrichmedia.jpg"),
  ],
  smes: [
    p("Conversion-focused websites_converted.jpg"),
    p("E-commerceStores.jpg"),
    p("Workflow automation_converted.jpg"),
    p("SEO & web presence.webp"),
    p("A tech partner_converted.jpg"),
  ],
  retail: [
    p("Conversion-focused websites_converted.jpg"),
    p("Onlineorderinge-commerce.jpg"),
    p("DashboardsAdminPanel.jpeg"),
    p("Customer & Client Portals_converted.jpg"),
    p("Automatedreporting.jpg"),
    p("Local SEO & Google Business Profile.webp"),
  ],
  staffing: [
    p("Brandedjobportalscareerssites.jpg"),
    p("DashboardsAdminPanel.jpeg"),
    p("Screeningschedulingautomation.jpg"),
    p("Customer & Client Portals_converted.jpg"),
    p("Candidaterolematching.jpg"),
    p("Communicationautomation.jpg"),
  ],
  startups: [
    p("High-converting landing pages.jpg"),
    p("MVPdevelopment.jpg"),
    p("Scalable web apps_converted.jpg"),
    p("Brand-grade design_converted.jpg"),
    p("SaaS Products.webp"),
    p("SEO & web presence.webp"),
  ],
};

export const industryImage = (slug: string): string =>
  INDUSTRY_IMAGE[slug] ?? fallback(0);

export const industrySolutionImages = (
  slug: string,
  count: number
): string[] => {
  const set = INDUSTRY_SOLUTION_IMAGES[slug] ?? [];
  return Array.from({ length: count }, (_, i) => set[i] ?? fallback(i));
};
