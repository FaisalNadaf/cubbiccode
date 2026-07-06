"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  Trophy,
  Award,
  Medal,
  Star,
  GraduationCap,
  Mic,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Recognition = {
  title: string;
  org: string;
  year?: string;
  kind: string;
  icon: LucideIcon;
  image: string;
};

const recognitions: Recognition[] = [
  {
    title: "10 Best Web Development Start-ups in India",
    org: "Named among the country’s standout web development studios of the year by Silicon India.",
    year: "2019",
    kind: "Recognition",
    icon: Trophy,
    image: "/images/Moments/india-excellence-award-certificate1.jpg",
  },
  {
    title: "Most Outstanding Web Development Company in Karnataka",
    org: "Awarded at the AI Global Excellence Awards for consistent, high-impact delivery.",
    year: "2019",
    kind: "Award",
    icon: Award,
    image: "/images/Moments/brandcounselling1.jpg",
  },
  {
    title: "Silver — Web Application Development Company of the Year",
    org: "Honoured at the 16th India Digital Awards for enterprise-grade web application work.",
    year: "2025",
    kind: "Award",
    icon: Medal,
    image: "/images/Moments/WhatsAppImage2025-11-01at6.28.58PM.jpeg",
  },
  {
    title: "Best Website Designing & Development Company in Belgaum",
    org: "Regional recognition across Karnataka for design and engineering excellence.",
    kind: "Recognition",
    icon: Star,
    image: "/images/Moments/business-excellence-certificate1.jpg",
  },
  {
    title: "Best Youngest Digital Marketing Teacher in India",
    org: "Presented to co-founder Sarvesh Kakkeri at the Indian Education Awards, supported by Zee Business.",
    year: "2019",
    kind: "Award",
    icon: GraduationCap,
    image: "/images/Moments/EducationalE.jpg",
  },
  {
    title: "On the TEDx Stage",
    org: "Co-founder Sarvesh Kakkeri has delivered TEDx talks, including “A New Age Teacher”.",
    kind: "Talk",
    icon: Mic,
    image: "/images/Moments/2020.jpg",
  },
];

// Diagonal split — the slant pivots around centre (top + bottom = 100%) so left
// and right slides share an identical width profile (56% top, 44% bottom).
const imageClipLeft = "polygon(0 0, 56% 0, 44% 100%, 0 100%)";
const imageClipRight = "polygon(44% 0, 100% 0, 100% 100%, 56% 100%)";

const spring = { type: "spring", stiffness: 60, damping: 18 } as const;

/**
 * Awards & recognitions. Each slide is a diagonal split — a contained photo on a
 * brand backdrop against a content column, alternating sides.
 *
 * On desktop it's a scroll-pinned slideshow: the viewport sticks and a single,
 * spring-smoothed `scrollYProgress` drives the whole sequence, so photo and
 * content parallax and slide in from opposite edges while a giant ghost index
 * cross-fades behind them — buttery because the smoothing decouples the visuals
 * from raw scroll. Mobile keeps a stacked flow. Reduced motion → static stack.
 */
export function RecognitionZigzag() {
  const reduce = useReducedMotion();
  return (
    <>
      <MobileRows reduce={!!reduce} />
      {reduce ? <DesktopStatic /> : <DesktopPinned />}
    </>
  );
}

/* ── Desktop: spring-smoothed, scroll-pinned slideshow ───────────────────── */

function DesktopPinned() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const total = recognitions.length;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // The key to smoothness: spring the progress once, then derive everything off
  // it. Raw scroll → jittery; smoothed scroll → inertial, cinematic.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.0005,
  });

  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.max(0, Math.min(total - 1, Math.round(v * total - 0.5))));
  });

  const barScaleX = useTransform(progress, [0, 1], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const jumpTo = (i: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / total) * travel, behavior: "smooth" });
  };

  return (
    <section
      ref={wrapRef}
      className="relative hidden w-full bg-canvas lg:block"
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-canvas">
        {recognitions.map((r, i) => (
          <DesktopSlide key={r.title} r={r} i={i} total={total} progress={progress} />
        ))}

        {/* Progress bar */}
        <motion.div
          style={{ scaleX: barScaleX }}
          className="absolute inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-corporate-500 via-corporate-300 to-corporate-500"
        />
      </div>
    </section>
  );
}

/** Cross-fade keyframes for slide `i`, with clean first/last page endpoints. */
function opacityStops(i: number, total: number) {
  const seg = 1 / total;
  const c = (i + 0.5) * seg;
  const fade = seg * 0.42;
  let input = [c - 2 * fade, c - fade, c + fade, c + 2 * fade];
  let output = [0, 1, 1, 0];
  if (i === 0) {
    input = [-1, 0, c + fade, c + 2 * fade];
    output = [1, 1, 1, 0];
  }
  if (i === total - 1) {
    input = [c - 2 * fade, c - fade, 1, 2];
    output = [0, 1, 1, 1];
  }
  return { input, output, seg, c, fade };
}

function DesktopSlide({
  r,
  i,
  total,
  progress,
}: {
  r: Recognition;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { input, output, seg, c, fade } = opacityStops(i, total);
  const imageOnLeft = i % 2 === 0;
  const clip = imageOnLeft ? imageClipLeft : imageClipRight;
  const Ico = r.icon;

  const imageFrom = imageOnLeft ? -160 : 160; // photo enters from its outer edge
  const contentFrom = imageOnLeft ? 150 : -150; // content from the opposite side

  const enter = [c - fade * 1.7, c - fade * 0.4, c + fade * 0.4, c + fade * 1.7];

  const opacity = useTransform(progress, input, output);

  // Photo: slides in on x, drifts + Ken-Burns-zooms on y/scale for depth.
  const imageX = useTransform(progress, enter, [imageFrom, 0, 0, -imageFrom * 0.4]);
  const imgY = useTransform(progress, [c - seg, c + seg], [46, -46]);
  const imgScale = useTransform(progress, [c - seg, c, c + seg], [1.12, 1, 1.05]);

  // Content: slides in on x with a small lift; a giant ghost index parallaxes.
  const contentX = useTransform(progress, enter, [contentFrom, 0, 0, -contentFrom * 0.4]);
  const contentY = useTransform(progress, enter, [26, 0, 0, -18]);
  const numY = useTransform(progress, [c - seg, c + seg], [90, -90]);
  const numOpacity = useTransform(
    progress,
    [c - fade * 1.6, c - fade * 0.6, c + fade * 0.6, c + fade * 1.6],
    [0, 1, 1, 0]
  );

  const nn = String(i + 1).padStart(2, "0");
  const tt = String(total).padStart(2, "0");

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 [will-change:opacity]">
      <div className="group relative h-full w-full overflow-hidden bg-canvas">
        {/* ── Photo side ── */}
        <motion.div style={{ x: imageX }} className="absolute inset-0 [will-change:transform]">
          <div
            className="absolute inset-0"
            style={{ clipPath: clip, WebkitClipPath: clip }}
          >
            {/* Layered brand backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-steel-50 to-steel-200" />
            <div className="absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-40" />
            <div
              className={cn(
                "pointer-events-none absolute top-1/2 size-[440px] -translate-y-1/2 rounded-full bg-corporate-500/10 blur-3xl",
                imageOnLeft ? "left-[6%]" : "right-[6%]"
              )}
            />
            {/* Contained photo, parallaxing */}
            <motion.div
              style={{ y: imgY, scale: imgScale }}
              className={cn(
                "absolute inset-y-0 w-[48%] [will-change:transform]",
                imageOnLeft ? "left-0" : "right-0"
              )}
            >
              <Image
                src={r.image}
                alt={r.title}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                priority={i === 0}
                className="object-contain p-8 drop-shadow-[0_34px_60px_rgba(11,27,58,0.22)] lg:p-12"
              />
            </motion.div>
          </div>
          {/* Diagonal hairline accent */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: clip, WebkitClipPath: clip }}
          >
            <span className="absolute inset-0 ring-1 ring-inset ring-corporate-400/25" />
          </span>
        </motion.div>

        {/* ── Giant ghost index (behind content) ── */}
        <motion.span
          aria-hidden
          style={{ y: numY, opacity: numOpacity, fontSize: "clamp(8rem, 15vw, 15rem)" }}
          className={cn(
            "pointer-events-none absolute top-[7%] z-0 select-none font-display font-black leading-[0.8] tracking-tightest text-corporate-600/[0.07] [will-change:transform,opacity]",
            imageOnLeft ? "right-[4%] text-right" : "left-[4%] text-left"
          )}
        >
          {nn}
        </motion.span>

        {/* ── Content ── */}
        <motion.div
          style={{ x: contentX, y: contentY }}
          className={cn(
            "relative z-10 flex h-full w-full max-w-[46%] flex-col justify-center px-6 py-12 sm:px-10 md:px-14 lg:px-20 [will-change:transform]",
            imageOnLeft ? "ml-auto" : "mr-auto"
          )}
        >
          <div className="flex items-center gap-3.5">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-corporate-600 text-white shadow-[0_12px_30px_-10px_rgba(27,110,194,0.6)]">
              <Ico className="size-5" />
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-600">
              {r.kind}
              {r.year && (
                <>
                  <span aria-hidden className="h-3 w-px bg-steel-300" />
                  <span className="text-steel-500">{r.year}</span>
                </>
              )}
            </span>
          </div>

          <h3 className="mt-6 text-balance font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[2.7rem]">
            {r.title}
          </h3>

          <p className="mt-5 max-w-prose text-base leading-relaxed text-steel-500 sm:text-lg">
            {r.org}
          </p>

          <div className="mt-9 flex items-center gap-4">
            <span className="text-sm font-semibold tabular-nums text-ink">{nn}</span>
            <span className="h-px w-16 rounded-full bg-corporate-500" />
            <span className="text-sm font-medium tabular-nums text-steel-400">{tt}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Mobile / tablet: stacked flow ───────────────────────────────────────── */

function MobileRows({ reduce }: { reduce: boolean }) {
  const stackVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: spring },
  };

  return (
    <div className="flex flex-col lg:hidden">
      {recognitions.map((r, i) => {
        const Ico = r.icon;
        return (
          <section key={r.title} className="w-full bg-canvas">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-70px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
              }}
              className="group relative flex flex-col overflow-hidden"
            >
              <motion.div
                variants={stackVariants}
                className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-white via-steel-50 to-steel-200 sm:h-80"
              >
                <div className="absolute inset-0 bg-blueprint [background-size:30px_30px] opacity-40" />
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  sizes="100vw"
                  className="object-contain p-6 drop-shadow-[0_20px_40px_rgba(11,27,58,0.18)] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-corporate-400/20"
                />
              </motion.div>
              <motion.div
                variants={stackVariants}
                className="border-b border-steel-200 bg-canvas px-6 py-9 sm:px-10"
              >
                <RecognitionBody index={i} icon={Ico} recognition={r} />
              </motion.div>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}

/* ── Desktop reduced-motion fallback: static, non-pinned stack ────────────── */

function DesktopStatic() {
  return (
    <div className="hidden flex-col lg:flex">
      {recognitions.map((r, i) => {
        const Ico = r.icon;
        const imageOnLeft = i % 2 === 0;
        const clip = imageOnLeft ? imageClipLeft : imageClipRight;
        return (
          <section
            key={r.title}
            className="relative h-[72vh] min-h-[540px] w-full overflow-hidden bg-canvas"
          >
            <div
              className="absolute inset-0"
              style={{ clipPath: clip, WebkitClipPath: clip }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-steel-50 to-steel-200" />
              <div className="absolute inset-0 bg-blueprint [background-size:34px_34px] opacity-40" />
              <div
                className={cn(
                  "absolute inset-y-0 w-[48%]",
                  imageOnLeft ? "left-0" : "right-0"
                )}
              >
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-contain p-8 drop-shadow-[0_34px_60px_rgba(11,27,58,0.22)] lg:p-12"
                />
              </div>
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ clipPath: clip, WebkitClipPath: clip }}
            >
              <span className="absolute inset-0 ring-1 ring-inset ring-corporate-400/25" />
            </span>
            <div
              className={cn(
                "relative z-10 flex h-full w-full max-w-[46%] flex-col justify-center px-6 py-12 sm:px-10 md:px-14 lg:px-20",
                imageOnLeft ? "ml-auto" : "mr-auto"
              )}
            >
              <RecognitionBody index={i} icon={Ico} recognition={r} />
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Number, icon, kind/year meta, title and body for a single recognition. */
function RecognitionBody({
  index,
  icon: Ico,
  recognition,
}: {
  index: number;
  icon: LucideIcon;
  recognition: Recognition;
}) {
  const { title, org, year, kind } = recognition;
  return (
    <>
      <span className="font-display text-6xl font-bold leading-none text-corporate-600/15 sm:text-7xl">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="mt-4 flex items-center gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-corporate-600 text-white">
          <Ico className="size-5" />
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-kicker text-corporate-600">
          {kind}
          {year && (
            <>
              <span aria-hidden className="h-3 w-px bg-steel-300" />
              <span className="text-steel-500">{year}</span>
            </>
          )}
        </span>
      </div>

      <h3 className="mt-5 text-balance font-display text-2xl font-bold leading-[1.1] tracking-tight text-ink sm:text-3xl">
        {title}
      </h3>

      <p className="mt-4 max-w-prose text-base leading-relaxed text-steel-500">
        {org}
      </p>
    </>
  );
}
