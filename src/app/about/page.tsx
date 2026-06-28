import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Target } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountStat } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { aboutCopy, whyChooseUs, values, awards, journey } from "@/content/company";
import { heroStats, site } from "@/content/site";

export const metadata = {
  title: "About Us — Nearly a Decade of Building the Web | Cubiccode",
  description:
    "Cubiccode Digital Media LLP is an ISO 9001:2015 certified website & web app company from Belagavi, Karnataka — trusted by 500+ businesses across India for fast, reliable, conversion-driven delivery.",
};

export default function AboutPage() {
  const journeyTeaser = [journey[0], journey[3], journey[6], journey[journey.length - 1]];

  return (
    <>
      <PageHero
        kicker="Who we are"
        title={aboutCopy.headline}
        subtitle={aboutCopy.intro}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href={site.proposalCta} external variant="accent" arrow>
            Get a Proposal
          </Button>
          <Button href="/journey" variant="outline">
            Our journey
          </Button>
        </div>
      </PageHero>

      {/* Story — two columns with parallax-feel image */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="right">
            <div className="relative">
              <span className="kicker">The story</span>
              <h2 className="mt-5 text-pretty text-3xl font-semibold leading-[1.12] text-ink sm:text-4xl lg:text-[2.5rem]">
                {aboutCopy.storyHeading}
              </h2>

              <div className="mt-7 space-y-5">
                {aboutCopy.story.map((p, i) => (
                  <p
                    key={i}
                    className="text-pretty leading-relaxed text-steel-600"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="relative">
              {/* Floating accent card */}
              <div className="absolute -left-5 -top-5 z-10 hidden rounded-2xl border border-steel-200 bg-white/90 px-5 py-4 shadow-lift backdrop-blur sm:block">
                <p className="font-display text-3xl font-bold tracking-tightest text-ink">
                  {new Date().getFullYear() - site.founded}+ yrs
                </p>
                <p className="text-[13px] text-steel-500">building the web</p>
              </div>

              <div className="relative overflow-hidden rounded-4xl border border-steel-200 shadow-lift">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/about/about-main.png"
                    alt="Cubiccode — building websites and web apps that drive results"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-ink backdrop-blur">
                    {site.certification}
                  </span>
                  <p className="mt-3 max-w-xs text-pretty text-sm leading-relaxed text-white/90">
                    From a Belagavi studio to a partner trusted by 500+ businesses across India.
                  </p>
                </div>
              </div>

              {/* Blueprint accent behind */}
              <div className="pointer-events-none absolute -bottom-6 -right-6 -z-10 size-48 rounded-3xl bg-blueprint [background-size:24px_24px] opacity-60" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stat band — ink/navy */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
          <div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
        </div>
        <div className="container-x relative">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-kicker text-corporate-300">
              Nearly a decade, measured in outcomes
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

      {/* Vision & Mission */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="Vision & mission"
            title="Where we're going, and why."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal direction="right">
              <article className="relative h-full overflow-hidden rounded-4xl border border-steel-200 bg-white p-9 shadow-soft lg:p-11">
                <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-corporate-50 blur-2xl" />
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600">
                  <Compass className="size-6" />
                </span>
                <h3 className="relative mt-6 text-2xl font-semibold text-ink">
                  Our Vision
                </h3>
                <p className="relative mt-4 text-pretty leading-relaxed text-steel-600">
                  {aboutCopy.vision}
                </p>
              </article>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <article className="relative h-full overflow-hidden rounded-4xl border border-ink bg-ink p-9 text-white shadow-lift lg:p-11">
                <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:30px_30px] opacity-20" />
                <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-corporate-500/30 blur-3xl" />
                <span className="relative flex size-12 items-center justify-center rounded-2xl bg-white/10 text-corporate-200 ring-1 ring-white/15">
                  <Target className="size-6" />
                </span>
                <h3 className="relative mt-6 text-2xl font-semibold text-white">
                  Our Mission
                </h3>
                <p className="relative mt-4 text-pretty leading-relaxed text-steel-300">
                  {aboutCopy.mission}
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why choose Cubiccode */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="container-x relative">
          <SectionHeading
            kicker="Why choose Cubiccode"
            title="Five reasons businesses pick — and stay with — us"
            intro="We pair deep in-house expertise with a disciplined, customer-centric process. Here's what that means for your project."
          />

          <RevealGroup
            stagger={0.08}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {whyChooseUs.map((w) => (
              <RevealItem key={w.num}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="pointer-events-none absolute -right-6 -top-8 font-display text-[7rem] font-bold leading-none text-steel-100 transition-colors duration-300 group-hover:text-corporate-100">
                    {w.num}
                  </div>
                  <div className="relative">
                    <span className="text-sm font-semibold tracking-kicker text-corporate-600">
                      {w.num}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-ink">{w.title}</h3>
                    <p className="mt-3 text-pretty leading-relaxed text-steel-600">
                      {w.text}
                    </p>
                  </div>
                  <div className="relative mt-auto pt-6">
                    <div className="hairline" />
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Values teaser — link to /culture */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)] opacity-50" />
        <div className="container-x relative">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <SectionHeading
              kicker="What we value"
              title="The principles behind every project"
              className="mb-0"
            />
            <Reveal>
              <Link
                href="/culture"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink"
              >
                Explore our culture
                <ArrowUpRight className="size-4 text-corporate-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>

          <RevealGroup
            stagger={0.06}
            className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-steel-200 bg-steel-200 shadow-soft sm:grid-cols-2 lg:grid-cols-3"
          >
            {values.map((v) => (
              <RevealItem key={v.title}>
                <div className="group flex h-full gap-4 bg-white p-7 transition-colors duration-300 hover:bg-canvas-soft">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-corporate-50 text-corporate-600 transition-colors duration-300 group-hover:bg-corporate-600 group-hover:text-white">
                    <Icon name={v.icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-steel-500">
                      {v.text}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Awards teaser — link to /achievements */}
      <section className="section relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.1]" />
          <div className="absolute -right-20 top-0 size-[460px] rounded-full bg-corporate-600/20 blur-3xl" />
        </div>
        <div className="container-x relative">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <SectionHeading
              light
              kicker="Recognition"
              title="An award-winning track record"
              className="mb-0"
            />
            <Reveal>
              <Button href="/achievements" variant="white" arrow>
                All achievements
              </Button>
            </Reveal>
          </div>

          <RevealGroup
            stagger={0.08}
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {awards.map((a) => (
              <RevealItem key={a.title}>
                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07]">
                  <span className="inline-flex w-fit items-center rounded-full border border-corporate-400/40 bg-corporate-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-corporate-200">
                    {a.kind}
                  </span>
                  <h3 className="mt-4 text-pretty text-base font-semibold leading-snug text-white">
                    {a.title}
                  </h3>
                  <p className="mt-auto pt-4 text-[13px] text-steel-400">
                    {a.org}
                    {a.year ? ` · ${a.year}` : ""}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Mini journey teaser — link to /journey */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="container-x relative">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <SectionHeading
              kicker="Our journey"
              title="From 2016 to 500+ clients"
              intro="A few milestones from nearly a decade of disciplined delivery."
              className="mb-0"
            />
            <Reveal>
              <Button href="/journey" variant="outline" arrow>
                See the full timeline
              </Button>
            </Reveal>
          </div>

          <RevealGroup
            stagger={0.08}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {journeyTeaser.map((m) => (
              <RevealItem key={m.year}>
                <article className="group relative h-full rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <p className="font-display text-4xl font-bold tracking-tightest text-gradient-steel">
                    {m.year}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-500">{m.text}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection />
    </>
  );
}
