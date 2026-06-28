import Image from "next/image";
import { CalendarClock, GitBranch, Quote, Rocket, Users2, Zap } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ValuesGrid } from "@/components/whoweare/ValuesGrid";

export const metadata = {
  title: "Company Culture — How We Think, Build & Ship | Cubiccode",
  description:
    "Lean, agile and customer-centric. Inside the way Cubiccode works — cross-functional teams, weekly sprints, on-time delivery and a culture built around getting clients exactly what they need.",
};

const waysOfWorking = [
  {
    icon: CalendarClock,
    title: "Weekly sprints",
    text: "We work in short, focused cycles — so progress is visible every week, not just at the deadline.",
  },
  {
    icon: Users2,
    title: "Cross-functional teams",
    text: "Designers, developers and project managers sit together on each project, not in silos.",
  },
  {
    icon: Zap,
    title: "Lean & agile",
    text: "Minimal overhead, maximum momentum. We evolve through collaboration and tight feedback loops.",
  },
  {
    icon: Rocket,
    title: "On-time delivery",
    text: "We set achievable deadlines, keep you updated as we advance, and launch by the date we agreed on.",
  },
  {
    icon: GitBranch,
    title: "Iterate in the open",
    text: "Frequent check-ins and shared progress mean no surprises — you see the work as it takes shape.",
  },
  {
    icon: Quote,
    title: "Customer-centric",
    text: "Every decision starts with one question: what does the client actually need to succeed?",
  },
];

export default function CulturePage() {
  return (
    <>
      <PageHero
        kicker="Life at Cubiccode"
        title="Lean teams. Big ownership. Real craft."
        subtitle="The culture that ships projects on time isn't an accident. Here's what it's built on."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Who We Are", href: "/about" },
          { label: "Culture" },
        ]}
      />

      {/* Core values — independently animating cards */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="What we value"
            title="Twelve principles that shape every project"
            intro="Not posters on a wall — these are the working habits behind nearly a decade of on-time, on-budget delivery."
          />
          <ValuesGrid />
        </div>
      </section>

      {/* Culture wall — intentional brand mosaic */}
      <section className="section relative overflow-hidden bg-canvas-soft">
        <div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(75%_60%_at_50%_20%,#000,transparent)] opacity-50" />
        <div className="container-x relative">
          <SectionHeading
            align="center"
            kicker="The culture wall"
            title="A studio that ships"
            intro="A glimpse of the energy, focus and craft behind the work."
          />

          <RevealGroup
            stagger={0.08}
            className="mt-14 grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] lg:grid-cols-4 lg:gap-5"
          >
            {/* Image tile — tall */}
            <RevealItem className="col-span-2 row-span-2">
              <div className="group relative h-full w-full overflow-hidden rounded-3xl border border-steel-200 shadow-soft">
                <Image
                  src="/images/about/parallax-1.jpg"
                  alt="The Cubiccode team in flow"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-5 left-5 font-display text-lg font-semibold text-white">
                  Heads down, building.
                </p>
              </div>
            </RevealItem>

            {/* Quote tile — ink */}
            <RevealItem className="col-span-2 row-span-1">
              <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-soft">
                <div className="absolute inset-0 bg-blueprint [background-size:30px_30px] opacity-[0.16]" />
                <Quote className="relative size-7 text-corporate-300" />
                <p className="relative mt-3 text-pretty font-display text-lg font-semibold leading-snug">
                  We stay lean and build agile.
                </p>
              </div>
            </RevealItem>

            {/* Stat tile */}
            <RevealItem className="col-span-1 row-span-1">
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-steel-200 bg-white p-5 text-center shadow-soft">
                <p className="font-display text-3xl font-bold tracking-tightest text-gradient">
                  Weekly
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-steel-500">
                  Sprints
                </p>
              </div>
            </RevealItem>

            {/* Blueprint tile */}
            <RevealItem className="col-span-1 row-span-1">
              <div className="relative h-full overflow-hidden rounded-3xl border border-corporate-200 bg-corporate-50 shadow-soft">
                <div className="absolute inset-0 bg-blueprint [background-size:22px_22px] opacity-70" />
                <div className="relative flex h-full items-center justify-center">
                  <span className="font-display text-sm font-semibold text-corporate-700">
                    Cross-functional
                  </span>
                </div>
              </div>
            </RevealItem>

            {/* Image tile — wide */}
            <RevealItem className="col-span-2 row-span-1">
              <div className="group relative h-full w-full overflow-hidden rounded-3xl border border-steel-200 shadow-soft">
                <Image
                  src="/images/about/parallax-2.jpg"
                  alt="Collaborative work at Cubiccode"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              </div>
            </RevealItem>

            {/* Image tile */}
            <RevealItem className="col-span-2 row-span-1">
              <div className="group relative h-full w-full overflow-hidden rounded-3xl border border-steel-200 shadow-soft">
                <Image
                  src="/images/about/about-4.jpg"
                  alt="Craft and detail at Cubiccode"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* Ways of working */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="container-x relative">
          <SectionHeading
            kicker="Ways of working"
            title="The operating system behind the studio"
            intro="A handful of simple commitments, applied relentlessly. They're why clients trust us with everything from a first website to a ₹250 crore platform."
          />

          <RevealGroup
            stagger={0.07}
            className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-steel-200 bg-steel-200 shadow-soft sm:grid-cols-2 lg:grid-cols-3"
          >
            {waysOfWorking.map((w) => (
              <RevealItem key={w.title}>
                <div className="group flex h-full flex-col bg-white p-8 transition-colors duration-300 hover:bg-canvas-soft">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-corporate-50 text-corporate-600 transition-colors duration-300 group-hover:bg-corporate-600 group-hover:text-white">
                    <w.icon className="size-[22px]" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{w.title}</h3>
                  <p className="mt-2 text-pretty leading-relaxed text-steel-600">{w.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection />
    </>
  );
}
