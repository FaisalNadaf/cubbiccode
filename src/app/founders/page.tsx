/**
 * Designed & Developed by Faisal Nadaf
 * Contact: faisalfnadaf@gmail.com
 */

import Image from "next/image";
import { FoundingPanels } from "@/components/founders/FoundingPanels";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { founderMessage, founders } from "@/content/company";

export const metadata = {
  title: "Message From the Founders | Cubiccode",
  description:
    "A message from Sarvesh Kakkeri & Shivani Jadhav, co-founders of Cubiccode Digital Media LLP — on building the company they wished existed, taking ownership of every outcome, and delivering premium work at honest pricing.",
};

export default function FoundersPage() {
  const lead = founderMessage.paragraphs[0];

  return (
    <>
      {/* ── Hero: founders image (left) · heading + content + names (right) ── */}
      <section className="section relative overflow-hidden bg-canvas">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
        <div className="container-x relative grid items-stretch gap-10 pt-4 sm:pt-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          {/* Left — founders image */}
          <Reveal direction="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded-4xl border border-steel-200 bg-ink shadow-lift">
              <Image
                src="/images/about/about-main.png"
                alt="The founders of Cubiccode"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
            </div>
          </Reveal>

          {/* Right — heading, content, founder names */}
          <div className="flex flex-col lg:py-4">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-500">
                <span className="h-px w-8 bg-corporate-400/60" />
                {founderMessage.greeting}
              </span>
            </Reveal>

            {/* Heading */}
            <SplitReveal
              as="h1"
              play="mount"
              delay={0.1}
              className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tightest text-ink sm:text-5xl lg:text-[3.5rem]"
            >
              {founderMessage.title}
            </SplitReveal>

            {/* Content */}
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-steel-600">
                {lead}
              </p>
            </Reveal>

            {/* Founder names — pinned to the bottom of the column */}
            <Reveal delay={0.3} className="mt-auto pt-10">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-steel-200 pt-7">
                {founders.map((f) => (
                  <div key={f.name} className="flex items-center gap-3.5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-base font-bold tracking-tight text-white ring-1 ring-corporate-500/20">
                      {f.initials}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold leading-tight text-ink">
                        {f.name}
                      </p>
                      <p className="text-[12.5px] text-steel-500">{f.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Bottom: three interlocking angled message panels ── */}
      <FoundingPanels />
    </>
  );
}
