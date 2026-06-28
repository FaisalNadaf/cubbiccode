import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, Clock, ShieldCheck, Users, Play } from "lucide-react";
import { industries, industryBySlug } from "@/content/industries";
import { site } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return { title: "Industry not found" };
  return {
    title: `${ind.title} — ${site.name}`,
    description: ind.subheadline,
  };
}

const trustPoints = [
  {
    icon: ShieldCheck,
    title: site.certification,
    text: "A formally certified quality process — consistent, reliable delivery on every project.",
  },
  {
    icon: Users,
    title: "500+ clients served",
    text: "Nearly a decade of building for businesses across India and beyond.",
  },
  {
    icon: Clock,
    title: "On-time delivery",
    text: "Clear timelines and disciplined execution — we ship when we say we will.",
  },
  {
    icon: BadgeCheck,
    title: "Affordable quality",
    text: "Enterprise-grade engineering at prices that make sense for your sector.",
  },
];

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();

  const others = industries.filter((i) => i.slug !== ind.slug);

  return (
    <>
      <PageHero
        kicker="Industry"
        title={ind.headline}
        subtitle={ind.subheadline}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries/manufacturing" },
          { label: ind.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href={site.proposalCta} external arrow variant="accent" size="lg">
            {ind.cta}
          </Button>
          <Button href="/case-studies" variant="outline" size="lg">
            See Our Work
          </Button>
        </div>
      </PageHero>

      {/* ============ THE PROBLEM ============ */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="right">
            <div>
              <span className="kicker">The reality today</span>
              <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-steel-700 lg:text-2xl">
                {ind.problem}
              </p>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="relative">
              <div className="pointer-events-none absolute -bottom-6 -right-6 -z-10 size-48 rounded-3xl bg-blueprint [background-size:24px_24px] opacity-60" />
              <div className="relative overflow-hidden rounded-4xl border border-steel-200 shadow-lift">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="/images/no.png"
                    alt={ind.title}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-ink backdrop-blur">
                    <Icon name={ind.icon} className="size-4 text-corporate-600" />
                    {ind.title}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ HOW WE HELP ============ */}
      <section className="section relative bg-canvas-soft">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                kicker="What we deliver"
                title="How we help"
                intro="Domain-specific platforms built on real production experience — not generic templates retrofitted to your sector."
              />
              <Reveal delay={0.15}>
                <div className="mt-10 inline-flex items-center gap-4 rounded-3xl border border-steel-200 bg-white p-5 shadow-soft">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-corporate-200 shadow-soft">
                    <Icon name={ind.icon} className="size-7" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{ind.title}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-steel-500">
                      {ind.short}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <RevealGroup className="flex flex-col gap-3">
              {ind.solutions.map((s, i) => (
                <RevealItem key={s}>
                  <div className="group flex items-center gap-5 rounded-2xl border border-steel-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-corporate-200 hover:shadow-lift">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-corporate-50 font-display text-base font-bold text-corporate-600 ring-1 ring-corporate-100 transition-colors group-hover:bg-corporate-600 group-hover:text-white group-hover:ring-corporate-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] font-medium leading-snug text-steel-700">
                      {s}
                    </span>
                    <ArrowUpRight className="size-5 shrink-0 -translate-x-1 text-steel-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-corporate-500 group-hover:opacity-100" />
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ============ HOW WE DO IT BETTER ============ */}
      <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.14]" />
        <div className="pointer-events-none absolute -left-24 top-1/3 size-[460px] rounded-full bg-corporate-600/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <span className="kicker !text-corporate-300">How we do it better</span>
            <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-white lg:text-[1.55rem] lg:leading-[1.4]">
              {ind.better}
            </p>
            <div className="mt-9">
              <Button href={site.proposalCta} external variant="accent" arrow>
                {ind.cta}
              </Button>
            </div>
          </div>

          {/* video card */}
          <div className="relative">
            <figure className="group relative overflow-hidden rounded-4xl border border-white/10 shadow-lift">
              <div className="relative aspect-video w-full">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/images/no.png"
                >
                  <source src="/videos/demo.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition-transform duration-300 group-hover:scale-105">
                  <Play className="size-6 translate-x-0.5 fill-white text-white" />
                </span>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ THE RESULT ============ */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)] opacity-50" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl rounded-4xl border border-steel-200 bg-white p-10 text-center shadow-soft lg:p-14">
            <span className="kicker justify-center">The result</span>
            <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-ink lg:text-2xl">
              {ind.result}
            </p>
          </div>
        </div>
      </section>

      {/* ============ PROOF STAT BAND (ink) ============ */}
      {ind.proof && ind.proof.length > 0 && (
        <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-28">
          <div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.14]" />
          <div className="pointer-events-none absolute left-1/2 top-0 size-[600px] -translate-x-1/2 rounded-full bg-corporate-600/15 blur-3xl" />
          <div className="container-x relative">
            <SectionHeading
              align="center"
              light
              kicker="Proven in your sector"
              title="Real numbers from platforms in production"
            />
            <RevealGroup className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
              {ind.proof.map((p) => (
                <RevealItem key={p.label}>
                  <div className="relative h-full overflow-hidden rounded-4xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm lg:p-10">
                    <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-corporate-500/20 blur-2xl" />
                    <div className="relative font-display text-5xl font-bold tracking-tight text-white lg:text-6xl">
                      {p.value}
                    </div>
                    <div className="relative mt-4 text-sm font-medium uppercase tracking-wide text-steel-300">
                      {p.label}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ============ WHY CUBICCODE FOR YOUR SECTOR ============ */}
      <section className="section relative bg-canvas">
        <div className="container-x">
          <SectionHeading
            align="center"
            kicker="Why Cubiccode"
            title="The right partner for your sector"
            intro="An ISO-certified, full-stack ITES company trusted by 500+ businesses — combining enterprise discipline with the agility your industry needs."
          />

          <RevealGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((t) => (
              <RevealItem key={t.title}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-corporate-200 hover:shadow-lift">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-corporate-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex size-12 items-center justify-center rounded-2xl bg-steel-50 text-corporate-600 ring-1 ring-steel-200 transition-colors group-hover:bg-corporate-600 group-hover:text-white group-hover:ring-corporate-600">
                    <t.icon className="size-6" />
                  </span>
                  <h3 className="relative mt-6 text-lg font-semibold leading-snug text-ink">
                    {t.title}
                  </h3>
                  <p className="relative mt-2 flex-1 text-[13.5px] leading-relaxed text-steel-500">
                    {t.text}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============ OTHER INDUSTRIES ============ */}
      <section className="section relative bg-canvas-soft">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              kicker="More sectors"
              title="Other industries we serve"
              intro="Domain-specific platforms across the industries that power India's economy."
            />
            <Link
              href="/industries/manufacturing"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-corporate-600 hover:text-corporate-700"
            >
              View all industries
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <RevealItem key={o.slug}>
                <Link
                  href={`/industries/${o.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-corporate-200 hover:shadow-lift"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-corporate-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-steel-50 text-corporate-600 ring-1 ring-steel-200 transition-colors group-hover:bg-corporate-600 group-hover:text-white group-hover:ring-corporate-600">
                      <Icon name={o.icon} className="size-6" />
                    </span>
                    <ArrowUpRight className="size-5 -translate-x-1 text-steel-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-corporate-500 group-hover:opacity-100" />
                  </div>
                  <h3 className="relative mt-5 text-lg font-semibold leading-snug text-ink">
                    {o.title}
                  </h3>
                  <p className="relative mt-2 flex-1 text-[13.5px] leading-relaxed text-steel-500">
                    {o.short}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection />
    </>
  );
}
