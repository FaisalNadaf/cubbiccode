import Image from "next/image";
import { Quote, Star, Newspaper } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountStat } from "@/components/ui/Stat";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { featuredClients, namedClients, pressMentions } from "@/content/clients";
import { testimonials } from "@/content/testimonials";
import { heroStats } from "@/content/site";

export const metadata = {
  title: "Our Clientele — 500+ Brands Trust Cubiccode",
  description:
    "From Tata Sky, Reliance and Cognizant to fast-growing startups — Cubiccode serves 500+ businesses across India. A look at a few of the brands we've loved working with.",
};

export default function ClientelePage() {
  const namedHalf = Math.ceil(namedClients.length / 2);
  const namedRowA = namedClients.slice(0, namedHalf);
  const namedRowB = namedClients.slice(namedHalf);
  const featured = testimonials.slice(0, 2);

  return (
    <>
      <PageHero
        kicker="Our clientele"
        title="Few of the top companies we've loved working with"
        subtitle="For nearly a decade we've partnered with over 500+ businesses across India — from household names like Tata Sky, Reliance and Cognizant to ambitious startups building their first product. Here's a glimpse of the companies that trust us."
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
      </PageHero>

      {/* Stat band — ink/navy accent */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
          <div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
        </div>
        <div className="container-x relative">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-kicker text-corporate-300">
              A track record measured in outcomes
            </p>
          </Reveal>
          <RevealGroup
            stagger={0.1}
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4"
          >
            {heroStats.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <CountStat
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="font-display text-4xl font-bold tracking-tightest text-white sm:text-5xl lg:text-6xl"
                />
                <p className="mx-auto mt-3 max-w-[180px] text-sm leading-relaxed text-steel-300">
                  {s.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Featured logos grid */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="Trusted by industry leaders"
            title="Brands that put their name beside ours"
            intro="A selection of the enterprises and category leaders we've engineered, designed and grown alongside."
          />

          <RevealGroup
            stagger={0.06}
            className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-steel-200 bg-steel-200 shadow-soft sm:grid-cols-3 lg:grid-cols-4"
          >
            {featuredClients.map((c) => (
              <RevealItem key={c.name}>
                <div className="group flex h-32 items-center justify-center bg-white px-8 transition-colors duration-300 hover:bg-canvas-soft lg:h-36">
                  <Image
                    src={c.logo}
                    alt={`${c.name} — a Cubiccode client`}
                    width={150}
                    height={56}
                    className="h-9 w-auto max-w-[150px] object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 lg:h-10"
                  />
                </div>
              </RevealItem>
            ))}
            {/* trailing tile to balance the grid on wide screens */}
            <div className="hidden items-center justify-center bg-white px-8 lg:flex">
              <span className="text-center font-display text-sm font-semibold leading-tight text-steel-400">
                + 500 more
                <br />
                across India
              </span>
            </div>
          </RevealGroup>
        </div>
      </section>

      {/* Named brands wall — marquee chips */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="container-x">
          <SectionHeading
            align="center"
            kicker="The wider network"
            title="Nearly 500+ businesses, from almost every state"
            intro="Manufacturers, hospitals, schools, retailers, financial firms and startups — across India and beyond."
          />
        </div>

        <div className="mt-14 space-y-4">
          <Marquee speed={78}>
            {namedRowA.map((n) => (
              <NameChip key={n} name={n} />
            ))}
          </Marquee>
          <Marquee speed={70} reverse>
            {namedRowB.map((n) => (
              <NameChip key={n} name={n} />
            ))}
          </Marquee>
        </div>

        <div className="container-x mt-14 flex justify-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 rounded-full border border-steel-200 bg-white px-6 py-3 text-sm text-steel-600 shadow-soft">
              <span className="font-display text-xl font-bold text-ink">500+</span>
              of the most trusted companies, served across India &amp; abroad
            </div>
          </Reveal>
        </div>
      </section>

      {/* Press mentions */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="container-x">
          <div className="flex flex-col items-center text-center">
            <Reveal>
              <span className="kicker justify-center">
                <Newspaper className="size-[14px]" /> As featured in
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 max-w-2xl text-pretty text-2xl font-semibold text-ink sm:text-3xl">
                Our work has been covered by India&apos;s leading media houses
              </h2>
            </Reveal>
          </div>

          <RevealGroup
            stagger={0.05}
            className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-3"
          >
            {pressMentions.map((p) => (
              <RevealItem key={p}>
                <span className="inline-flex items-center rounded-full border border-steel-200 bg-canvas-soft px-5 py-2.5 text-sm font-semibold text-steel-700 transition-colors hover:border-corporate-300 hover:text-ink">
                  {p}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)] opacity-60" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="In their words"
            title="Why our clients keep coming back"
          />

          <RevealGroup
            stagger={0.12}
            className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {featured.map((t) => (
              <RevealItem key={t.name}>
                <figure className="flex h-full flex-col rounded-3xl border border-steel-200 bg-white p-8 shadow-soft lg:p-10">
                  <div className="flex items-center justify-between">
                    <Quote className="size-8 text-corporate-500/30" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-corporate-500 text-corporate-500"
                        />
                      ))}
                    </div>
                  </div>
                  <blockquote className="mt-6 flex-1 text-pretty text-base leading-relaxed text-steel-600 lg:text-lg">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-steel-200 pt-6">
                    <Image
                      src={t.photo}
                      alt={t.name}
                      width={52}
                      height={52}
                      className="size-[52px] rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-ink">{t.name}</p>
                      <p className="text-[13px] text-steel-500">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection />
    </>
  );
}

function NameChip({ name }: { name: string }) {
  return (
    <span className="mx-2 inline-flex shrink-0 items-center rounded-full border border-steel-200 bg-white px-5 py-2.5 text-sm font-medium text-steel-600 shadow-soft">
      {name}
    </span>
  );
}
