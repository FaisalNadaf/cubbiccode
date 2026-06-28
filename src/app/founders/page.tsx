import { Play, Quote } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { founderMessage, founders } from "@/content/company";
import { site } from "@/content/site";

export const metadata = {
  title: "Message From the Founders | Cubiccode",
  description:
    "A message from Sarvesh Kakkeri & Shivani Jadhav, co-founders of Cubiccode Digital Media LLP — on building the company they wished existed, taking ownership of every outcome, and delivering premium work at honest pricing.",
};

export default function FoundersPage() {
  const pullQuote =
    "We'll take ownership of your outcome as if it were our own — and we won't consider the job done until the work moves your business forward.";

  return (
    <>
      <PageHero
        kicker={founderMessage.greeting}
        title={founderMessage.title}
        subtitle="Nearly a decade in, the belief that started Cubiccode still drives every project we ship."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Who We Are", href: "/about" },
          { label: "Founders" },
        ]}
      />

      {/* Founders presentation — monograms + message */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          {/* Founder cards */}
          <Reveal direction="right">
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-ink p-8 shadow-lift lg:p-10">
                <div className="absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-[0.16]" />
                <div className="absolute -right-16 -top-16 size-72 rounded-full bg-corporate-600/25 blur-3xl" />
                <div className="relative grid grid-cols-2 gap-5">
                  {founders.map((f) => (
                    <div
                      key={f.name}
                      className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur"
                    >
                      <div className="flex size-20 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] lg:size-24">
                        <span className="font-display text-3xl font-bold tracking-tightest text-white lg:text-4xl">
                          {f.initials}
                        </span>
                      </div>
                      <p className="mt-5 font-display text-base font-semibold leading-tight text-white">
                        {f.name}
                      </p>
                      <p className="mt-1 text-[12.5px] text-corporate-200">{f.role}</p>
                    </div>
                  ))}
                </div>
                <div className="relative mt-7 border-t border-white/10 pt-6 text-center">
                  <p className="text-[13px] leading-relaxed text-steel-300">
                    Co-founders of {site.legalName} — building since {site.founded}.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* The message */}
          <div>
            <Reveal>
              <Quote className="size-12 text-corporate-500/25" />
            </Reveal>

            <div className="mt-6 space-y-6">
              {founderMessage.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p
                    className={
                      i === 0
                        ? "text-pretty text-xl font-medium leading-relaxed text-ink sm:text-2xl"
                        : "text-pretty text-lg leading-relaxed text-steel-600"
                    }
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Pulled quote */}
            <div className="my-12 border-l-2 border-corporate-500 pl-7">
              <SplitReveal
                as="p"
                className="text-pretty font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl"
              >
                {pullQuote}
              </SplitReveal>
            </div>

            {/* Signature */}
            <Reveal>
              <div className="flex flex-col gap-1 border-t border-steel-200 pt-8">
                <span className="font-display text-2xl font-semibold text-gradient">
                  {founderMessage.signature}
                </span>
                <span className="text-sm text-steel-500">{founderMessage.role}</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href={site.proposalCta} external variant="accent" arrow>
                  Let&apos;s build something that matters
                </Button>
                <Button href="/journey" variant="outline">
                  Our journey
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* "Video" introduction */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)] opacity-50" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="kicker justify-center">Founders' introduction</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-pretty text-3xl font-semibold text-ink sm:text-4xl">
                Hear it in our own words
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <figure className="group relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-4xl border border-steel-200 bg-ink shadow-lift">
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
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15 lg:size-24">
                  <Play className="size-8 translate-x-0.5 fill-white text-white lg:size-9" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-7 text-center">
                  <p className="font-display text-xl font-semibold text-white">
                    A word from {founderMessage.names}
                  </p>
                  <p className="mt-1 text-sm text-steel-300">{founderMessage.role}</p>
                </div>
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
