import Image from "next/image";
import { BadgeCheck, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { awards, certificateImages, whyChooseUs } from "@/content/company";
import { site } from "@/content/site";

export const metadata = {
  title: "Certifications — ISO 9001:2015 & Quality Standards | Cubiccode",
  description:
    "Cubiccode Digital Media LLP is ISO 9001:2015 certified. A formally audited quality management system means consistent, reliable, high-quality delivery on every project, every time.",
};

const isoMeans = [
  "Consistent, repeatable delivery on every engagement",
  "Documented processes from kickoff to launch",
  "Clear accountability and continuous improvement",
  "Audited quality management — not just a promise",
];

const trustBand = whyChooseUs.slice(0, 3);

export default function CertificationsPage() {
  return (
    <>
      <PageHero
        kicker="Quality & standards"
        title="ISO 9001:2015 certified"
        subtitle="Our quality management system is formally certified — which is a technical way of saying that consistent, reliable, on-time delivery isn't luck. It's a documented, audited process."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Who We Are", href: "/about" },
          { label: "Certifications" },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button href={site.proposalCta} external variant="accent" arrow>
            Start a project
          </Button>
          <Button href="/achievements" variant="outline">
            See our awards
          </Button>
        </div>
      </PageHero>

      {/* ISO feature — badge + what it means */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Big badge card — ink */}
          <Reveal direction="right">
            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-ink p-10 text-center text-white shadow-lift lg:p-14">
              <div className="absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-[0.16]" />
              <div className="absolute -right-16 -top-16 size-72 rounded-full bg-corporate-600/25 blur-3xl" />
              <div className="relative flex flex-col items-center">
                <span className="flex size-28 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur lg:size-32">
                  <ShieldCheck className="size-14 text-corporate-300 lg:size-16" />
                </span>
                <p className="mt-8 font-display text-4xl font-bold tracking-tightest lg:text-5xl">
                  ISO 9001:2015
                </p>
                <p className="mt-3 text-sm uppercase tracking-kicker text-corporate-200">
                  Quality Management Systems
                </p>
                <div className="mt-7 h-px w-20 bg-white/15" />
                <p className="mt-6 max-w-sm text-pretty leading-relaxed text-steel-300">
                  Certified company — {site.legalName}. Building to a defined,
                  audited standard since {site.founded}.
                </p>
              </div>
            </div>
          </Reveal>

          {/* What it means */}
          <Reveal direction="left" delay={0.1}>
            <div>
              <span className="kicker">What the certification means for you</span>
              <h2 className="mt-5 text-pretty text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
                A standard you can hold us to
              </h2>
              <p className="mt-5 leading-relaxed text-steel-600">
                ISO 9001:2015 is the world&apos;s most recognised quality management
                standard. For you, it&apos;s a guarantee that the way we plan, build and
                deliver is structured, repeatable and continuously improving.
              </p>

              <RevealGroup stagger={0.07} className="mt-9 space-y-4">
                {isoMeans.map((m) => (
                  <RevealItem key={m}>
                    <div className="flex items-start gap-3.5">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-corporate-600" />
                      <p className="text-pretty leading-relaxed text-steel-700">{m}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Certificate gallery */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_25%,#000,transparent)] opacity-50" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="The credentials"
            title="Certified, awarded & verifiable"
            intro="The official certificates and honours behind our quality commitment."
          />

          <RevealGroup stagger={0.1} className="mt-16 grid gap-8 sm:grid-cols-2">
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

      {/* Supporting recognitions */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="container-x relative">
          <SectionHeading
            kicker="Supporting proof"
            title="Recognised beyond the certificate"
            intro="Independent award bodies and national press reach the same conclusion as our auditors."
          />

          <RevealGroup stagger={0.08} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((a) => (
              <RevealItem key={a.title}>
                <article className="flex h-full flex-col rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="inline-flex w-fit items-center rounded-full bg-corporate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-corporate-700">
                    {a.kind}
                  </span>
                  <h3 className="mt-4 text-pretty text-base font-semibold leading-snug text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-auto pt-4 text-[13px] text-steel-500">
                    {a.org}
                    {a.year ? ` · ${a.year}` : ""}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Trust band — ink */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
          <div className="absolute right-0 top-0 size-[460px] rounded-full bg-corporate-600/20 blur-3xl" />
        </div>
        <div className="container-x relative">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-kicker text-corporate-300">
              Why the standard matters
            </p>
          </Reveal>
          <RevealGroup stagger={0.1} className="mt-12 grid gap-6 md:grid-cols-3">
            {trustBand.map((t) => (
              <RevealItem key={t.num}>
                <article className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
                  <span className="font-display text-3xl font-bold tracking-tightest text-corporate-300">
                    {t.num}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{t.title}</h3>
                  <p className="mt-3 text-pretty leading-relaxed text-steel-300">{t.text}</p>
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
