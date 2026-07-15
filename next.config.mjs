/** @type {import('next').NextConfig} */

/**
 * Permanent (301) redirects from every URL this site has served to its canonical
 * replacement, so indexed links and bookmarks keep working and pass their link
 * equity on.
 *
 * Two sources feed this list:
 *  1. legacy cubiccode.in URLs that no longer have a page of their own, and
 *  2. the short internal paths this app used before the SEO slugs landed.
 *
 * The canonical targets live in `src/lib/routes.ts` and in the `path` field of
 * `src/content/capabilities.ts` / `industries.ts`. A next.config cannot import
 * TypeScript, so if you rename a slug there, rename its target here too.
 */
const CAPABILITY = {
  website:
    "/best-website-designing-and-development-company-in-belgaum-karnataka-india",
  webApp: "/best-web-application-development-company-belgaum-karnataka-india",
  erp: "/best-custom-erp-software-development-company-in-belgaum-karnataka-india",
  automation: "/best-workflow-automation-company-in-belgaum-karnataka-india",
  seo: "/best-seo-company-in-belgaum-karnataka-india",
};

const INDUSTRY = {
  manufacturing:
    "/website-and-erp-development-company-for-manufacturing-industries-in-india",
  education:
    "/website-and-erp-development-company-for-education-and-training-institutes-in-india",
  logistics:
    "/website-and-erp-development-company-for-logistics-and-transport-companies-in-india",
  healthcare:
    "/website-and-erp-development-company-for-hospitals-and-healthcare-in-india",
  construction:
    "/website-and-erp-development-company-for-construction-and-real-estate-in-india",
  smes: "/website-and-erp-development-company-for-small-and-medium-enterprises-in-india",
  retail:
    "/website-and-erp-development-company-for-retail-chains-and-franchises-in-india",
  staffing:
    "/website-and-software-development-company-for-hr-and-staffing-agencies-in-india",
  startups:
    "/website-and-web-application-development-company-for-startups-in-india",
};

const legacyRedirects = [
  // ── Legacy cubiccode.in URLs with no direct successor ──
  [
    "/top-web-designing-and-development-company-in-belgaum-karnataka-india",
    CAPABILITY.website,
  ],
  // There is no standalone ecommerce page; the website capability covers it.
  [
    "/best-ecommerce-website-designing-and-development-company-belgaum-karnataka-india",
    CAPABILITY.website,
  ],

  // ── Short paths this app served before the SEO slugs ──
  [
    "/about",
    "/about-cubiccode-digital-media-llp-web-development-company-belgaum-karnataka-india",
  ],
  [
    "/achievements",
    "/awards-and-achievements-of-cubiccode-digital-media-llp-belgaum-karnataka-india",
  ],
  [
    "/founders",
    "/founders-of-cubiccode-digital-media-llp-belgaum-karnataka-india",
  ],
  [
    "/journey",
    "/our-journey-since-2016-cubiccode-digital-media-llp-belgaum-karnataka-india",
  ],
  ["/culture", "/life-at-cubiccode-company-culture-belgaum-karnataka-india"],
  [
    "/certifications",
    "/iso-9001-2015-certified-web-development-company-in-belgaum-karnataka-india",
  ],
  [
    "/portfolio",
    "/best-website-designing-and-development-portfolio-belgaum-karnataka-india",
  ],
  ["/case-studies", "/web-application-development-portfolio"],
  [
    "/clientele",
    "/our-clients-500-plus-brands-across-india-cubiccode-digital-media-llp",
  ],
  [
    "/seo-results",
    "/seo-results-rankings-and-organic-growth-cubiccode-digital-media-llp",
  ],
  ["/contact", "/contact-details-cubiccode-digital-media-llp"],
  [
    "/careers",
    "/careers-join-the-team-at-cubiccode-digital-media-llp-belgaum-karnataka-india",
  ],
  ["/partner", "/become-a-sales-partner-with-cubiccode-digital-media-llp"],
  ["/gdg", "/gdg-belgaum-google-developer-group-community"],
  [
    "/careerjump",
    "/careerjump-career-acceleration-program-belgaum-karnataka-india",
  ],
  [
    "/data-analytics",
    "/advanced-data-analytics-with-generative-ai-course-in-belgaum-karnataka-india",
  ],
  [
    "/digital-marketing",
    "/advanced-digital-marketing-course-in-belgaum-karnataka-india",
  ],
  ["/terms", "/terms-and-conditions"],
  ["/privacy", "/privacy-policy"],

  // ── Capability / industry pages, previously nested, now flat at the root ──
  ["/capabilities", CAPABILITY.website],
  ["/capabilities/website-development", CAPABILITY.website],
  ["/capabilities/web-application-development", CAPABILITY.webApp],
  ["/capabilities/custom-erp", CAPABILITY.erp],
  ["/capabilities/workflow-automation", CAPABILITY.automation],
  ["/capabilities/seo", CAPABILITY.seo],
  ["/industries", INDUSTRY.manufacturing],
  ["/industries/manufacturing", INDUSTRY.manufacturing],
  ["/industries/education", INDUSTRY.education],
  ["/industries/logistics", INDUSTRY.logistics],
  ["/industries/healthcare", INDUSTRY.healthcare],
  ["/industries/construction", INDUSTRY.construction],
  ["/industries/smes", INDUSTRY.smes],
  ["/industries/retail", INDUSTRY.retail],
  ["/industries/staffing", INDUSTRY.staffing],
  ["/industries/startups", INDUSTRY.startups],
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async redirects() {
    // 301, not `permanent: true` — that emits a 308, which Google honours but a
    // lot of SEO tooling and older crawlers still treat as a soft redirect.
    return legacyRedirects.map(([source, destination]) => ({
      source,
      destination,
      statusCode: 301,
    }));
  },
};

export default nextConfig;
