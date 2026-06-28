import { featuredProjects } from "@/content/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/carousel";
import type { ShowcaseSlide } from "@/content/showcase";

// Featured projects mapped into the shared carousel's slide shape.
const slides: ShowcaseSlide[] = featuredProjects.map((p) => ({
  id: p.url,
  eyebrow: p.category,
  title: p.name,
  description: p.blurb,
  cta: { label: "Visit site", href: `https://${p.url}` },
  image: p.image,
}));

export function PortfolioShowcase() {
  return (
    <section className="relative flex h-screen w-screen flex-col mt-20 overflow-hidden bg-canvas-soft">
      {/* Ambient brand-colour blur shades */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-28 top-1/4 size-[26rem] rounded-full bg-corporate-400/20 blur-[130px]" />
        <div className="absolute -right-20 bottom-[-4rem] size-[30rem] rounded-full bg-corporate-500/15 blur-[150px]" />
        <div className="absolute left-1/2 top-[-6rem] size-80 -translate-x-1/2 rounded-full bg-ink/10 blur-[120px]" />
      </div>

      <div className="container-x relative z-10 flex h-full flex-col py-8 lg:py-10">
        {/* Heading row — fixed at top */}
        <div className="flex shrink-0 flex-col items-start justify-between gap-5 md:flex-row md:items-center px-10">
          <SectionHeading
            kicker="Our work"
            title="700+ builds. Here are a few we're proud of."
            intro="A glimpse of the brands we've helped launch, scale and grow."
          />
          <Button href="/portfolio" variant="outline" arrow className="shrink-0">
            View full portfolio
          </Button>
        </div>

        {/* Carousel fills + is centred in the remaining space (capped on big screens) */}
        <div className="mt-6 flex min-h-0 flex-1 items-center lg:mt-8">
          <Carousel slides={slides} theme="light" fill className="max-h-[600px]" />
        </div>
      </div>
    </section>
  );
}
