import { Flag, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { CountStat } from "@/components/ui/Stat";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { journey } from "@/content/company";
import { heroStats } from "@/content/site";

export const metadata = {
  title: "Our Journey — From a Belagavi Studio to 500+ Clients | Cubiccode",
  description:
    "Milestone by milestone, 2016 to today — how Cubiccode grew from a small Belagavi studio into an ISO 9001:2015 certified company trusted by 500+ businesses across India.",
};

export default function JourneyPage() {
  return (
    <>
      <PageHero
        kicker="Our journey"
        title="From humble beginnings to 700+ projects nationwide."
        subtitle="Nearly a decade of disciplined delivery, told milestone by milestone — from our first 100 students and 250+ companies to national awards, the TEDx stage and the platforms now running real businesses at scale."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Who We Are", href: "/about" },
          { label: "Our Journey" },
        ]}
      />

      {/* Timeline */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          {/* Start marker */}
          <Reveal>
            <div className="mb-14 flex items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-soft">
                <MapPin className="size-4 text-corporate-600" />
                Belagavi, Karnataka · {journey[0].year}
              </span>
            </div>
          </Reveal>

          <div className="relative mx-auto max-w-5xl">
            {/* Connecting line — center on desktop, left on mobile */}
            <div className="pointer-events-none absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-corporate-400 via-steel-200 to-steel-200 lg:left-1/2 lg:-translate-x-1/2" />

            <div className="space-y-12 lg:space-y-0">
              {journey.map((m, i) => {
                const left = i % 2 === 0;
                return (
                  <Reveal
                    key={m.year}
                    direction={left ? "right" : "left"}
                    className={
                      "relative pl-16 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0 " +
                      (i > 0 ? "lg:-mt-10" : "")
                    }
                  >
                    {/* Node marker */}
                    <span className="absolute left-5 top-1.5 z-10 flex size-3.5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-corporate-600 shadow-glow lg:left-1/2" />

                    {/* Card — alternating side */}
                    <div
                      className={
                        left
                          ? "lg:col-start-1 lg:pr-4 lg:text-right"
                          : "lg:col-start-2 lg:pl-4"
                      }
                    >
                      <article className="group rounded-3xl border border-steel-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift lg:p-8">
                        <p className="font-display text-5xl font-bold leading-none tracking-tightest text-gradient-steel lg:text-6xl">
                          {m.year}
                        </p>
                        <h3 className="mt-4 text-xl font-semibold text-ink">{m.title}</h3>
                        <p className="mt-3 text-pretty leading-relaxed text-steel-600">
                          {m.text}
                        </p>
                      </article>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* End marker */}
          <Reveal>
            <div className="mt-14 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lift">
                <Flag className="size-4 text-corporate-300" />
                {journey[journey.length - 1].year} — and still building, still shipping fast
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing stat band */}
      <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-blueprint [background-size:42px_42px] opacity-[0.12]" />
          <div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-corporate-600/20 blur-3xl" />
        </div>
        <div className="container-x relative">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-kicker text-corporate-300">
              Where the journey stands today
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
