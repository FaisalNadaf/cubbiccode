/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 */

import fs from "fs";
import path from "path";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import {
  ClientGlobeShowcase,
  type Logo,
} from "@/sections/clientele/ClientGlobeShowcase";
import { featuredClients } from "@/content/clients";

export const metadata = {
  title: "Our Clientele  500+ Brands Trust Cubiccode",
  description:
    "From Tata Sky, Reliance and Cognizant to fast-growing startups  Cubiccode serves 500+ businesses across India. A look at a few of the brands we've loved working with.",
};

/**
 * Read every client logo straight from /public at build time. Drop files into
 * public/images/clientsLogo (or remove them) and they appear/disappear on the
 * page automatically  nothing hardcoded.
 */
function getClientLogos(): Logo[] {
  const dir = path.join(process.cwd(), "public", "images", "clientsLogo");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => /\.(png|jpe?g|webp|avif|svg)$/i.test(f))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => ({
      src: `/images/clientsLogo/${encodeURIComponent(f)}`,
      alt: "Cubiccode client logo",
    }));
}

export default function ClientelePage() {
  // Featured brands lead the grid's starting rows; the rest of the folder logos follow.
  const featured: Logo[] = featuredClients.map((c) => ({
    src: c.logo,
    alt: c.name,
  }));
  const featuredSrcs = new Set(featured.map((l) => l.src));
  const rest = getClientLogos().filter((l) => !featuredSrcs.has(l.src));
  const logos = [...featured, ...rest];

  return (
    <>
      {/* <PageHero
        kicker="Our clientele"
        title="Few of the top companies we've loved working with"
        subtitle="For nearly a decade we've partnered with over 500+ businesses across India  from household names like Tata Sky, Reliance and Cognizant to ambitious startups building their first product. Here's a glimpse of the companies that trust us."
        image="/images/Moments/EPCSCL06-GroupPicture.JPG"
        imageAlt="The Cubiccode team with clients and partners"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Clientele" }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/portfolio" arrow>
            See our work
          </Button>
          <Button href="/case-studies" variant="outline">
            View case studies
          </Button>
        </div>
      </PageHero> */}

      {/* Globe of client logos that scroll-morphs into the MagicBento grid */}
      <ClientGlobeShowcase logos={logos} />
    </>
  );
}
