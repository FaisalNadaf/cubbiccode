import Image from "next/image";
import { Award as AwardIcon, BadgeCheck, Newspaper, Trophy } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountStat } from "@/components/ui/Stat";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { awards, certificateImages } from "@/content/company";
import { pressMentions } from "@/content/clients";
import { heroStats } from "@/content/site";

export const metadata = {
  title: "Achievements — Awards, Recognition & Press | Cubiccode",
  description:
    "5x awarded, ISO 9001:2015 certified and named among the Top 10 web development start-ups in India. A look at the awards, certifications and press that mark Cubiccode's track record.",
};

const kindIcon: Record<string, typeof Trophy> = {
  Award: Trophy,
  Recognition: AwardIcon,
  Certification: BadgeCheck,
};

export default function AchievementsPage() {
  return (
    <>
      <PageHero
        kicker="Recognition"
        title="Recognised by the industry. Trusted by the market."
        subtitle="Awards are nice. What they really represent is a decade of clients who got results — 5x awarded, ISO 9001:2015 certified, named among the Top 10 web development start-ups in India, and on the TEDx stage."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Who We Are", href: "/about" },
          { label: "Achievements" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          {["5x Awarded", "ISO 9001:2015", "Top 10 in India"].map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-soft"
            >
              <BadgeCheck className="size-4 text-corporate-600" />
              {b}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Recognition wall — premium award cards */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="The recognition wall"
            title="Honours earned the hard way"
            intro="National media, global award bodies and quality auditors — all pointing to the same thing: work you can trust."
          />

          <RevealGroup
            stagger={0.1}
            className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
          >
            {awards.map((a) => {
              const Ico = kindIcon[a.kind] ?? Trophy;
              return (
                <RevealItem key={a.title}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-steel-200 bg-white shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                    {/* certificate image */}
                    {a.image && (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-soft">
                        <Image
                          src={a.image}
                          alt={a.title}
                          fill
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent" />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink shadow-soft backdrop-blur">
                          <Ico className="size-3.5 text-corporate-600" />
                          {a.kind}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-pretty text-base font-semibold leading-snug text-ink">
                        {a.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between pt-5 text-[13px] text-steel-500">
                        <span className="font-medium">{a.org}</span>
                        {a.year && (
                          <span className="rounded-full bg-canvas-soft px-2.5 py-1 font-display font-semibold text-ink">
                            {a.year}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-corporate-600 to-corporate-400 transition-transform duration-500 group-hover:scale-x-100" />
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Certificates gallery — framed grid */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)] opacity-50" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="The paperwork"
            title="Certificates & official honours"
            intro="Framed, audited and verifiable. The credentials behind the claims."
          />

          <RevealGroup
            stagger={0.1}
            className="mt-16 grid gap-8 sm:grid-cols-2"
          >
            {certificateImages.map((c) => (
              <RevealItem key={c.src}>
                <figure className="group rounded-4xl border border-steel-200 bg-white p-4 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-steel-200 bg-canvas-soft">
                    <Image
                      src={c.src}
                      alt={c.title}
                      fill
                      sizes="(min-width: 640px) 45vw, 90vw"
                      className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="flex items-center justify-between px-2 pt-5">
                    <span className="font-semibold text-ink">{c.title}</span>
                    <BadgeCheck className="size-5 text-corporate-600" />
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Press mentions + news collage */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="right">
            <div>
              <span className="kicker">
                <Newspaper className="size-[14px]" /> As featured in
              </span>
              <h2 className="mt-5 text-pretty text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
                Our work has been covered by India&apos;s leading media houses
              </h2>
              <p className="mt-5 leading-relaxed text-steel-600">
                From national tech press to mainstream dailies, our growth story and our
                clients&apos; results have made headlines across the country.
              </p>

              <RevealGroup
                stagger={0.05}
                className="mt-8 flex flex-wrap gap-3"
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
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <figure className="relative overflow-hidden rounded-4xl border border-steel-200 bg-white p-3 shadow-lift">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-canvas-soft">
                <Image
                  src="/images/press/news-cutouts.png"
                  alt="Cubiccode featured across Indian newspapers and media outlets"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-ink/90 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                <Newspaper className="size-3.5 text-corporate-300" />
                Press coverage, across India
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Scale stat band */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
          <div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
        </div>
        <div className="container-x relative">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-kicker text-corporate-300">
              The scale behind the recognition
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

      <CTASection />
    </>
  );
}
