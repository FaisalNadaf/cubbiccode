import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { capabilities } from "@/content/capabilities";
import { industries } from "@/content/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = [
    "",
    "/about",
    "/achievements",
    "/founders",
    "/journey",
    "/culture",
    "/certifications",
    "/portfolio",
    "/clientele",
    "/case-studies",
    "/contact",
    "/careers",
    "/partner",
    "/gdg",
    "/careerjump",
    "/data-analytics",
    "/digital-marketing",
    "/terms",
    "/privacy",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  capabilities.forEach((c) =>
    entries.push({
      url: `${base}/capabilities/${c.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );
  industries.forEach((i) =>
    entries.push({
      url: `${base}/industries/${i.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return entries;
}
