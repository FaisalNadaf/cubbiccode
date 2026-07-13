"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  /** Primary call to action, centred beneath the fan. */
  cta?: { label: string; href: string };
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,

  cardWidth = 520,
  cardHeight = 320,

  overlap = 0.48,
  spreadDeg = 48,

  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  cta,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  // The fan is authored at a fixed px size, which is wider than a phone. Below
  // the width at which the card stops fitting, min()/calc() shrink the card and
  // the stage fluidly. `calc(100vw - 40px)` is >= 984px at every viewport
  // >= 1024px, so each min() below resolves to the authored px value there and
  // desktop cannot move; `fluid` proves that holds for the given props and
  // falls back to the raw px values if it ever would not.
  const FLUID_CEILING = 984;
  const aspect = cardWidth > 0 ? cardHeight / cardWidth : 0;
  const stagePx = Math.max(380, cardHeight + 80);
  const fluid =
    cardWidth > 0 &&
    cardWidth <= FLUID_CEILING &&
    FLUID_CEILING * aspect + 80 >= stagePx;

  const cardW = fluid ? `min(${cardWidth}px, calc(100vw - 40px))` : cardWidth;
  const cardH = fluid
    ? `min(${cardHeight}px, calc((100vw - 40px) * ${aspect}))`
    : cardHeight;
  const stageH = fluid
    ? `min(${stagePx}px, calc((100vw - 40px) * ${aspect} + 80px))`
    : stagePx;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full"
        style={{ height: stageH }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription="carousel"
        aria-label="Project showcase"
      >
        {/* background wash / spotlight (unique feel) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-ink/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-ink/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // hide far-away cards cleanly
              if (!visible) return null;

              // fan geometry
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10; // subtle arc-down feel
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: unknown,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);

                      // swipe logic
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 rounded-2xl border-4 border-white overflow-hidden shadow-xl",
                    "will-change-transform select-none",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: cardW,
                    height: cardH,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Call to action, centred under the fan; dots tuck in beneath it. */}
      {cta || showDots ? (
        <div className="mt-8 flex flex-col items-center gap-5">
          {cta ? (
            <Button href={cta.href} variant="accent" size="lg" arrow>
              {cta.label}
            </Button>
          ) : null}

          {showDots ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {items.map((it, idx) => {
                  const on = idx === active;
                  return (
                    // The pill is the inner span so the button itself can grow
                    // to the 44px WCAG target on touch without the pill growing
                    // with it. At `pointer: fine` the button carries no padding
                    // or border, so its box is exactly the pill's box — the row
                    // is unchanged.
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setActive(idx)}
                      className="flex items-center justify-center [@media(pointer:coarse)]:size-11"
                      aria-label={`Go to ${it.title}`}
                      aria-current={on || undefined}
                    >
                      <span
                        className={cn(
                          "block rounded-full transition-all duration-300",
                          on
                            ? "h-2 w-6 bg-corporate-600"
                            : "h-2 w-2 bg-ink/20 hover:bg-ink/40",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              {activeItem.href ? (
                <Link
                  href={activeItem.href}
                  target="_blank"
                  rel="noreferrer"
                  className="tap-target text-steel-500 transition hover:text-ink"
                  aria-label="Open link"
                >
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  const hasImage = Boolean(item.imageSrc);

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
            loading="eager"
          />
        ) : (
          <PlaceholderArt title={item.title} />
        )}
      </div>

      {/* Readability wash. The placeholder is already dark and carries its own
          monogram, so a second gradient over it would only mud the artwork. */}
      {hasImage ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      ) : null}

      {/* content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        {item.tag ? (
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
            {item.tag}
          </span>
        ) : null}
        <div className="truncate text-lg font-semibold text-white">
          {item.title}
        </div>
        {item.description ? (
          <div className="mt-1 line-clamp-2 text-sm text-white/80">
            {item.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Shown for projects whose screenshot we don't have. Deliberately branded rather
 * than a grey "No image" box: the card sits in the same fan as real screenshots,
 * so it has to look like a chosen treatment, not a broken one.
 */
function PlaceholderArt({ title }: { title: string }) {
  // First letter of each of the first two words — "JL Wing Indian Army" ⇒ "JW".
  const monogram = title
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-ink-900 via-ink to-corporate-800">
      {/* White rules, not the `bg-blueprint` utility — that grid is drawn in
          corporate blue at 7% alpha, which vanishes against this navy. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(70% 60% at 78% 18%, rgba(63,134,208,0.35), transparent)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-4 select-none font-display text-[4.5rem] font-black leading-none tracking-tightest text-white/[0.07] sm:text-[7rem]"
      >
        {monogram}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
      />
    </div>
  );
}
