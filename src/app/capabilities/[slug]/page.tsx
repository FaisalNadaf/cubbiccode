import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, Check, Play, Sparkles } from "lucide-react";
import { capabilities, capabilityBySlug } from "@/content/capabilities";
import { site } from "@/content/site";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cap = capabilityBySlug(slug);
  if (!cap) return { title: "Capability not found" };
  return {
    title: `${cap.title} — ${site.name}`,
    description: cap.subheadline,
  };
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cap = capabilityBySlug(slug);
  if (!cap) notFound();

  const others = capabilities.filter((c) => c.slug !== cap.slug);

  return (
    <>
      <PageHero
        kicker="Capability"
        title={cap.headline}
        subtitle={cap.subheadline}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Capabilities", href: "/capabilities/website-development" },
          { label: cap.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href={site.proposalCta} external arrow variant="accent" size="lg">
            {cap.cta}
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
              <span className="kicker">The problem</span>
              <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-steel-700 lg:text-2xl">
                {cap.problem}
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
                    alt={cap.title}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-ink backdrop-blur">
                    <Icon name={cap.icon} className="size-4 text-corporate-600" />
                    {cap.title}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WHAT WE BUILD / DO ============ */}
      <section className="section relative bg-canvas-soft">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                kicker={cap.buildHeading}
                title="Everything you need, engineered end-to-end."
                intro="A complete, accountable scope — no hand-offs, no gaps. Here's exactly what this engagement delivers."
              />
              <Reveal delay={0.15}>
                <div className="mt-10 inline-flex items-center gap-4 rounded-3xl border border-steel-200 bg-white p-5 shadow-soft">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-corporate-200 shadow-soft">
                    <Icon name={cap.icon} className="size-7" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{cap.title}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-steel-500">
                      {cap.short}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <RevealGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cap.features.map((f) => (
                <RevealItem key={f}>
                  <div className="group flex h-full items-start gap-3.5 rounded-2xl border border-steel-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-corporate-200 hover:shadow-lift">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100 transition-colors group-hover:bg-corporate-600 group-hover:text-white group-hover:ring-corporate-600">
                      <Check className="size-4" />
                    </span>
                    <span className="text-[15px] font-medium leading-snug text-steel-700">
                      {f}
                    </span>
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
            <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-white lg:text-[1.6rem] lg:leading-[1.4]">
              {cap.solution}
            </p>
            <div className="mt-9">
              <Button href={site.proposalCta} external variant="accent" arrow>
                {cap.cta}
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
            <span className="absolute -left-3 -top-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-lift">
              <Sparkles className="size-3.5 text-corporate-600" /> {site.certification}
            </span>
          </div>
        </div>
      </section>

      {/* ============ WHAT YOU'LL BUILD (training only) ============ */}
      {cap.buildAfter && cap.buildAfter.length > 0 && (
        <section className="section relative bg-canvas">
          <div className="container-x">
            <SectionHeading
              align="center"
              kicker="Portfolio-ready outcomes"
              title="What you'll be able to build after this course"
              intro="You won't just understand code — you'll have shipped real, portfolio-ready projects."
            />
            <RevealGroup className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {cap.buildAfter.map((b, i) => (
                <RevealItem key={b.title}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-corporate-200 hover:shadow-lift">
                    <span className="font-display text-5xl font-bold leading-none text-steel-100 transition-colors duration-300 group-hover:text-corporate-100">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 text-xl font-semibold text-ink">{b.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-steel-600">
                      {b.text}
                    </p>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ============ RESULT / WHAT YOU GET ============ */}
      {cap.result && (
        <section className="section relative overflow-hidden bg-canvas-soft">
          <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)] opacity-50" />
          <div className="container-x relative">
            <div className="mx-auto max-w-3xl rounded-4xl border border-steel-200 bg-white p-10 text-center shadow-soft lg:p-14">
              <span className="kicker justify-center">What you get</span>
              <p className="mt-6 text-pretty text-xl font-medium leading-relaxed text-ink lg:text-2xl">
                {cap.result}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ============ OUR WORK ============ */}
      {cap.work && cap.work.items.length > 0 && (
        <section className="section relative bg-canvas">
          <div className="container-x">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading kicker="Our work" title={cap.work.heading} />
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-corporate-600 hover:text-corporate-700"
              >
                Explore our portfolio
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cap.work.items.map((w) => (
                <RevealItem key={w.name}>
                  <div className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-steel-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-corporate-200 hover:shadow-lift">
                    <div>
                      <p className="font-semibold text-ink">{w.name}</p>
                      {w.note && (
                        <p className="mt-0.5 text-[13px] text-steel-500">{w.note}</p>
                      )}
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 -translate-x-1 text-steel-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-corporate-500 group-hover:opacity-100" />
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            {cap.work.caseStudies && (
              <div className="mt-10">
                <Button href="/case-studies" variant="outline" arrow>
                  View case studies
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ TECH STACK CHIPS ============ */}
      {cap.tech && cap.tech.length > 0 && (
        <section className="section relative bg-canvas-soft">
          <div className="container-x">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <SectionHeading
                kicker="Built on"
                title="A modern, battle-tested stack"
                intro="Proven technologies chosen for performance, security and long-term maintainability — not hype."
              />
              <RevealGroup className="flex flex-wrap gap-3">
                {cap.tech.map((t) => (
                  <RevealItem key={t}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-5 py-2.5 text-[15px] font-medium text-steel-700 shadow-soft transition-colors hover:border-corporate-200 hover:text-ink">
                      <span className="size-1.5 rounded-full bg-corporate-500" />
                      {t}
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </section>
      )}

      {/* ============ OTHER CAPABILITIES ============ */}
      <section className="section relative bg-canvas">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              kicker="Explore more"
              title="Other capabilities"
              intro="One accountable partner across the full digital lifecycle."
            />
            <Link
              href="/capabilities/website-development"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-corporate-600 hover:text-corporate-700"
            >
              View all capabilities
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((c) => (
              <RevealItem key={c.slug}>
                <Link
                  href={`/capabilities/${c.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-corporate-200 hover:shadow-lift"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-corporate-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-steel-50 text-corporate-600 ring-1 ring-steel-200 transition-colors group-hover:bg-corporate-600 group-hover:text-white group-hover:ring-corporate-600">
                      <Icon name={c.icon} className="size-6" />
                    </span>
                    <ArrowUpRight className="size-5 -translate-x-1 text-steel-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-corporate-500 group-hover:opacity-100" />
                  </div>
                  <h3 className="relative mt-5 text-lg font-semibold leading-snug text-ink">
                    {c.title}
                  </h3>
                  <p className="relative mt-2 flex-1 text-[13.5px] leading-relaxed text-steel-500">
                    {c.short}
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
