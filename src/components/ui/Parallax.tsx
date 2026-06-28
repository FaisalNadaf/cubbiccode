"use client";

import { useRef, type ElementType } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionStyle,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Reusable scroll-linked parallax.
 *
 * Translates a layer on the Y axis (and optionally scales it) as it travels
 * through the viewport. Animates ONLY transform → GPU-composited, 60fps, no
 * layout thrash. Under `prefers-reduced-motion` it renders a static element.
 *
 * @param speed      px of vertical drift across the full scroll pass.
 *                   Positive = element lags (moves down) → "further back".
 *                   Negative = element leads (moves up)  → "closer / faster".
 * @param scaleFrom  starting scale (e.g. 1.0)
 * @param scaleTo    ending scale   (e.g. 1.06) — set both to enable subtle zoom
 * @param clamp      clamp transforms at the scroll ends (default true)
 */
export function Parallax({
  children,
  className,
  speed = 60,
  scaleFrom,
  scaleTo,
  clamp = true,
  as = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  scaleFrom?: number;
  scaleTo?: number;
  clamp?: boolean;
  as?: "div" | "span" | "figure" | "li";
  style?: MotionStyle;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opts = { clamp } as const;
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed], opts);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [scaleFrom ?? 1, scaleTo ?? 1],
    opts
  );

  const MotionTag = motion[as] as ElementType;
  const wantScale = scaleFrom !== undefined || scaleTo !== undefined;

  if (reduce) {
    const StaticTag = as as ElementType;
    return (
      <StaticTag ref={ref} className={className}>
        {children}
      </StaticTag>
    );
  }

  return (
    <MotionTag
      ref={ref}
      style={{ y, ...(wantScale ? { scale } : {}), ...style }}
      className={cn("[will-change:transform]", className)}
    >
      {children}
    </MotionTag>
  );
}
