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
  "/images/portfolio/positron.jpeg",
  "/images/portfolio/prionsbiotec.jpg",
  "/images/portfolio/woodpeckerexotic.jpg",
  "/images/portfolio/harsharakes.jpg",
  "/images/portfolio/aishwaryacotton.jpg",
];
const fallback = (i: number) => FALLBACK_POOL[i % FALLBACK_POOL.length];

/* ── Capabilities ─────────────────────────────────────────────────────────── */

// Card image per capability slug, read by the homepage capabilities showcase —
// its own artwork set, kept in /images/HOMEPAGE rather than shared with the
// service pages, so the home cards can be re-shot without touching them.
const HOME_DIR = "/images/HOMEPAGE/";
const home = (name: string) => `${HOME_DIR}${name}`;

const CAPABILITY_IMAGE: Record<string, string> = {
  "website-development": home("webdevelopment.webp"),
  "web-application-development": home("webapplicationn.jpg"),
  "custom-erp": home("customerphome.jpg"),
  "workflow-automation": home("workflowautomatio.jpeg"),
  seo: home("seo-capability-home.jpg"),
};

// One image per feature (aligned to capabilities.ts `features`, in order).
const CAPABILITY_FEATURE_IMAGES: Record<string, string[]> = {
  "website-development": [
    p("seo better result.webp"),
    p("Responsive & Mobile-First Builds.webp"),
    p("using e commrce website.jpg"),
    p("Booking & Appointment Websites_converted.jpg"),
    p("madhtara.jpg"),
    p("CustomERP_converted.jpg"),
    p("seo better result.webp"),
    p("web maintainnece.webp"),
  ],
  "web-application-development": [
    p("hero-minimal-bold-2.webp"),
    p("usig saas.webp"),
    p("DashboardsAdminPanel.jpeg"),
    p("Customer & Client Portals_converted.jpg"),
    p("api integration amkeing payment.webp"),
    p("web application development.jpg"),
    p("Ongoing Support & AMC_converted.jpg"),
  ],
  "custom-erp": [
    p("Custom logistics ERP_converted.jpg"),
    p("Role-based dashboards.webp"),
    p("Real-time reporting.webp"),
    p("api integration amkeing payment.webp"),
    p("uploading in cloud.webp"),
  ],
  "workflow-automation": [
    p("fast lead.webp"),
    p("Automated notifications_converted.jpg"),
    p("workflow.webp"),
    p("Automatedreporting.jpg"),
    p("auutomationn.webp"),
    p("work done.webp"),
  ],
  seo: [
    p("tech seo.webp"),
    p("onpageseoo.jpg"),
    p("offpage seo.webp"),
    p("localseo.jpg"),
    p("lead genn.webp"),
    p("Analyticsreporting_converted.jpg"),
  ],
};

// Four topical images for the "The Problem" floating scene per capability.
// Chosen to echo each capability's `problem` copy (slow/dated sites, scattered
// data, manual grind, invisibility) rather than reuse the solution/feature shots.
const CAPABILITY_PROBLEM_IMAGES: Record<string, string[]> = {
  // Loads slowly, dated on mobile, leaks revenue, generic template build.
  "website-development": [
    p("hero-smart-key-1.webp"),
    p("cards-servico-editorial-1.webp"),
    p("hero-organico-editorial-3.webp"),
    p("hero-stats-flutuantes-3.webp"),
  ],
  // Spreadsheets hit a ceiling, data scattered across disconnected apps,
  // developers who disappear ("we dont vanish on launch").
  "web-application-development": [
    p("custom dashboard.jpg"),
    p("Web Application Development.webp"),
    p("API Integration & Development.webp"),
    p("we dont vansih on launch.webp"),
  ],
  // Sales / inventory / accounts in separate silos, no real-time visibility.
  "custom-erp": [
    p("Custom ERP Software Solutions.jpg"),
    p("Cloud-based access.webp"),
    p("laptop-desk-displaying-data-charts.jpg"),
    p("A cross-functional team.webp"),
  ],
  // Hours lost copying data by hand, chasing follow-ups and reminders.
  "workflow-automation": [
    p("Workflow Automation.jpg"),
    p("woman-working-laptop.jpg"),
    p("auto follow up.webp"),
    p("reminderautomai.jpg"),
  ],
  // Invisible off page one; bad SEO (stuffing, spam) actively hurts.
  seo: [
    p("SEOSearchVisibilityDomainAuthorityAccelerator.jpg"),
    p("SpeedSEOOptimisation_converted.jpg"),
    p("Built-inSEOanalytics_converted.jpg"),
    p("Contentoptimisation_converted.jpg"),
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
  startups: p("startup.webp"),
};

// One image per solution (aligned to industries.ts `solutions`, in order).
const INDUSTRY_SOLUTION_IMAGES: Record<string, string[]> = {
  manufacturing: [
    p("prithvimetal.jpg"),
    p("enquary portal.webp"),
    p("CustomERP_converted.jpg"),
    p("Dealer & distributor portals_converted.jpg"),
    p("Workflow automation_converted.jpg"),
    p("industraila seo.webp"),
  ],
  education: [
    p("lead generation education.webp"),
    p("Admission-focused websites engineered.webp"),
    p("auto follow up.webp"),
    p("studenonlineapplicatipn.jpg"),
    p("learningmanagementportal.jpg"),
    p("localseo.jpg"),
    p("Fee & communication automation_converted.jpg"),
  ],
  logistics: [
    p("onpageseoo.jpg"),
    p("Onlinebookingplatforms_converted.jpg"),
    p("fleet dispatch.webp"),
    p("Custom logistics ERP_converted.jpg"),
    p("Automated notifications_converted.jpg"),
    p("seo better result.webp"),
  ],
  healthcare: [
    p("appontpatient.jpg"),
    p("auto follow up.webp"),
    p("Patient portals_converted.jpg"),
    p("Clinic & hospital management dashboards_converted.jpg"),
    p("localseo.jpg"),
    p("Review & reputation building.jpg"),
  ],
  construction: [
    p("Premiumprojectpropertyshowcasewebsite.jpeg"),
    p("propertylistingportal.jpg"),
    p("Lead-capture & CRM systems_converted.jpg"),
    p("workflow.webp"),
    p("industraila seo.webp"),
    p("Virtualtoursrichmedia.jpg"),
  ],
  smes: [
    p("Conversion-focused websites_converted.jpg"),
    p("using e commrce website.jpg"),
    p("Workflow automation_converted.jpg"),
    p("seo better result.webp"),
    p("A tech partner_converted.jpg"),
  ],
  retail: [
    p("Conversion-focused websites_converted.jpg"),
    p("Onlineorderinge-commerce.jpg"),
    p("Real-time reporting.webp"),
    p("Customer & Client Portals_converted.jpg"),
    p("Automatedreporting.jpg"),
    p("localseo.jpg"),
  ],
  staffing: [
    p("job attractive portal.webp"),
    p("aplication tracking portal.webp"),
    p("Screeningschedulingautomation.jpg"),
    p("Customer & Client Portals_converted.jpg"),
    p("Candidaterolematching.jpg"),
    p("auutomationn.webp"),
  ],
  startups: [
    p("hero-dark-luxury-2.webp"),
    p("hero-smart-key-1.webp"),
    p("Automatedreporting.jpg"),
    p("hero-noir-lux-1.webp"),
    p("usig saas.webp"),
    p("seo better result.webp"),
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

/* ── Page-header photographs ──────────────────────────────────────────────── */

// The studio photograph behind each page's PageHero, in /public/images/Headerimages.
//
// No two pages on the site share a header, so these are one shot per slug rather
// than one shot for "capabilities" and one for "industries" — the [slug] routes
// render many pages each, and a single image there repeated across all of them.
// There are exactly as many photographs as pages, so there is no spare to fall
// back on: an unmapped slug throws at build rather than quietly duplicating
// another page's header.
const HEADER_DIR = "/images/Headerimages/";
const h = (name: string) => `${HEADER_DIR}${name}`;

const CAPABILITY_HERO: Record<string, string> = {
  "website-development": h("_DSC9932.JPG"),
  "web-application-development": h("_DSC9804.JPG"),
  "custom-erp": h("_DSC9847.JPG"),
  "workflow-automation": h("_DSC9931.JPG"),
  seo: h("_DSC9840.JPG"),
};

const INDUSTRY_HERO: Record<string, string> = {
  manufacturing: h("_DSC9921.JPG"),
  education: h("_DSC9814.JPG"),
  logistics: h("_DSC9807.JPG"),
  healthcare: h("_DSC9886.JPG"),
  construction: h("_DSC9829.JPG"),
  smes: h("_DSC9814.JPG"),
  retail: h("_DSC9818.JPG"),
  staffing: h("_DSC9881.JPG"),
  startups: h("_DSC9860.JPG"),
};

export const capabilityHeroImage = (slug: string): string => {
  const src = CAPABILITY_HERO[slug];
  if (!src)
    throw new Error(`serviceImages: no header photo for capability "${slug}"`);
  return src;
};

export const industryHeroImage = (slug: string): string => {
  const src = INDUSTRY_HERO[slug];
  if (!src)
    throw new Error(`serviceImages: no header photo for industry "${slug}"`);
  return src;
};
