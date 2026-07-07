"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { capabilities, type Capability } from "@/content/capabilities";
import { capabilityImage } from "@/content/serviceImages";

/**
 * CAPABILITIES — scroll-pinned showcase (shares the Origin·Objects motion
 * language, recoloured to the company palette).
 *
 * Intro: the words "Our" / "Capabilities" frame a row of small capability
 * cards over a hairline. On scroll the words part + fade and the scene
 * cross-dissolves into a pinned showcase: a column of portrait cards travels
 * vertically so one capability is centred at a time (neighbours peek above /
 * below). The surrounding editorial furniture — a serif title block, a feature
 * + tech panel, an `n/total` counter and the CTA — crossfades to the active
 * capability. The background cools subtly as the sequence resolves.
 *
 * One `scrollYProgress` drives every value (transform / opacity / colour only).
 * Below 640px or under prefers-reduced-motion the pin is dropped for a stacked,
 * fully-revealed layout.
 *
 * Each card shows its capability's own artwork (see `capabilityImage`).
 */

// Showcase column geometry, in viewport-height units. Cards are near-full-height
// so the active one fills the stage while its neighbours just peek (sliding stack).
// GAP_VH must match the column's `gap-[…vh]` class or cards drift off-centre.
const CARD_VH = 80;
const GAP_VH = 6;
const STEP = CARD_VH + GAP_VH;
const START_Y = (100 - CARD_VH) / 2;
const END_Y = START_Y - (capabilities.length - 1) * STEP;

// The column holds card 1 centred until the showcase has fully faded in, then
// travels. Travel start === showcase-reveal end so slide 1 is seen centred AND
// fully visible before anything moves.
const TRAVEL_START = 0.18;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const idx = (n: number) => String(n).padStart(2, "0");
const lead = (feature: string) => feature.split("—")[0].trim();

export function CapabilitiesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const t = clamp01((v - TRAVEL_START) / (1 - TRAVEL_START));
    const i = Math.round(t * (capabilities.length - 1));
    setActive((prev) => (prev === i ? prev : i));
  });

  const introOpacity = useTransform(scrollYProgress, [0, 0.07, 0.14], [1, 1, 0]);
  const introXLeft = useTransform(scrollYProgress, [0, 0.14], [0, -200]);
  const introXRight = useTransform(scrollYProgress, [0, 0.14], [0, 200]);
  const showcaseOpacity = useTransform(scrollYProgress, [0.09, 0.18], [0, 1]);

  const columnY = useTransform(
    scrollYProgress,
    [TRAVEL_START, 1],
    [`${START_Y}vh`, `${END_Y}vh`]
  );

  const bgColor = useTransform(
    scrollYProgress,
    [0.5, 0.85],
    ["#F7F8FA", "#EEF2F7"]
  );

  if (isMobile || reduce) {
    return <CapabilitiesStatic animated={isMobile && !reduce} />;
  }

  const cap = capabilities[active];

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${capabilities.length * 90 + 40}vh` }}
    >
      <motion.div
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 h-screen w-full overflow-hidden text-ink"
      >
        {/* Brand texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-blueprint opacity-[0.5] [background-size:34px_34px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/2 z-0 size-[36rem] -translate-y-1/2 rounded-full bg-corporate-500/10 blur-3xl"
        />

        <h2 className="sr-only">Our Capabilities</h2>

        {/* ── Showcase (fades in) ─────────────────────────────────────── */}
        <motion.div style={{ opacity: showcaseOpacity }} className="absolute inset-0">
        

          {/* Card column */}
          <div className="absolute inset-x-0 top-0 z-20 flex justify-center">
            <motion.div
              style={{ y: columnY }}
              className="flex flex-col items-center gap-[6vh] [will-change:transform]"
            >
              {capabilities.map((c, i) => (
                <CapabilityCard
                  key={c.slug}
                  cap={c}
                  priority={i === 0}
                  className="aspect-[4/5] h-[80vh]"
                />
              ))}
            </motion.div>
          </div>

          {/* Static kicker on the hairline, left */}
          <span className="pointer-events-none absolute left-[5vw] top-[52vh] z-30 -translate-y-1/2 bg-canvas-soft pr-3 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-corporate-600">
            What we do
          </span>

      

          {/* Dynamic title block, top-left */}
          <div className="absolute left-[4vw] top-[13vh] z-30 w-[clamp(240px,27vw,440px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-serif text-[clamp(1rem,1.4vw,1.4rem)] text-corporate-500">
                  ({idx(active + 1)})
                </span>
                <h3 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,3.2rem)] font-normal leading-[1.05] tracking-[-0.01em] text-ink">
                  {cap.title}
                </h3>
                <p className="mt-4 max-w-[34ch] font-sans text-[clamp(13px,0.95vw,15.5px)] leading-relaxed text-steel-600">
                  {cap.short}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dynamic feature + tech panel, right-centre */}
          <div className="absolute right-[4vw] top-1/2 z-30 w-[clamp(200px,19vw,320px)] -translate-y-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ul className="flex flex-col gap-2.5">
                  {cap.features.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 font-sans text-[clamp(12.5px,0.95vw,14.5px)] leading-snug text-steel-700"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-corporate-500" />
                      {lead(f)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA button, bottom-right */}
          <Link
            href={`/capabilities/${cap.slug}`}
            className="group absolute bottom-[8vh] right-[6vw] z-40 flex h-[92px] w-[268px] flex-col justify-between rounded-2xl bg-white p-5 shadow-card ring-1 ring-steel-200 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ink">
              View capability
            </span>
            <ArrowUpRight className="size-5 self-end text-corporate-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* ── Intro: split words + card row (fades out) ───────────────── */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-[clamp(0.5rem,1.4vw,1.25rem)]">
              <motion.span
                aria-hidden
                style={{ x: introXLeft }}
                className="select-none whitespace-nowrap font-serif text-[clamp(2.5rem,7vw,7rem)] font-normal leading-none tracking-[-0.02em] text-ink [will-change:transform]"
              >
                Our
              </motion.span>

              <div className="flex items-center gap-[clamp(5px,0.7vw,12px)]">
                {capabilities.map((c) => (
                  <CapabilityCard
                    key={c.slug}
                    cap={c}
                    className="aspect-[4/5] w-[clamp(46px,5.5vw,90px)]"
                  />
                ))}
              </div>

              <motion.span
                aria-hidden
                style={{ x: introXRight }}
                className="select-none whitespace-nowrap font-serif text-[clamp(2.5rem,7vw,7rem)] font-normal leading-none tracking-[-0.02em] text-ink [will-change:transform]"
              >
                Capabilities
              </motion.span>
            </div>
            <div className="mt-8 h-px w-[min(62vw,760px)] bg-steel-300/70" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */

function CapabilityCard({
  cap,
  className = "",
  priority = false,
}: {
  cap: Capability;
  className?: string;
  priority?: boolean;
}) {
  // Full-bleed image card — the capability's own artwork fills the whole frame.
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-3xl bg-steel-100 ring-1 ring-steel-200/80 shadow-lift ${className}`}
    >
      <Image
        src={capabilityImage(cap.slug)}
        alt={cap.title}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 70vw, 720px"
        className="object-cover"
      />
    </div>
  );
}

/* ── Static / mobile fallback ────────────────────────────────────────────── */

function CapabilitiesStatic({ animated }: { animated: boolean }) {
  const fade = animated
    ? {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.7, ease: [0.35, 0.35, 0, 1] as const },
      }
    : {};

  return (
    <section className="section relative w-full overflow-hidden bg-canvas-soft text-ink">
      <div className="container-x">
        <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-corporate-600">
          What we do
        </span>
        <h2 className="mt-3 font-serif text-4xl font-normal leading-[1.05] tracking-[-0.01em]">
          Our Capabilities
        </h2>

        <div className="mt-10 flex flex-col gap-10">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.slug}
              {...fade}
              className="flex flex-col gap-5 border-t border-steel-200 pt-8 first:border-t-0 sm:flex-row sm:gap-7"
            >
              <CapabilityCard
                cap={cap}
                className="aspect-[4/5] w-full max-w-[200px] shrink-0"
              />
              <div>
                <span className="font-serif text-base text-corporate-500">
                  ({idx(i + 1)})
                </span>
                <h3 className="mt-1 font-serif text-2xl font-normal leading-tight">
                  {cap.title}
                </h3>
                <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-steel-600">
                  {cap.short}
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {cap.features.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-[13.5px] text-steel-700"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-corporate-500" />
                      {lead(f)}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/capabilities/${cap.slug}`}
                  className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-corporate-600 hover:text-corporate-700"
                >
                  View capability
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
