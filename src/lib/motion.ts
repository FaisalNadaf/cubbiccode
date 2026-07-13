"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * GSAP setup must run before the browser paints, otherwise the element is
 * painted in its final state and then yanked back to the tween's `from` state
 * a frame later — the classic one-frame flash. React logs a warning if
 * `useLayoutEffect` runs during SSR, so alias it away on the server where
 * layout effects are a no-op anyway.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * SSR-safe `prefers-reduced-motion`, and it keeps listening.
 *
 * framer-motion's own `useReducedMotion()` samples the media query once during
 * the first client render. That is a hydration hazard: the server always
 * renders the no-preference branch, so a reduced-motion user whose component
 * *changes its element tree* on the reduced branch hydrates a different DOM
 * than the server sent.
 *
 * This returns `false` on the server AND on the very first client render, then
 * flips after mount. Markup therefore matches on hydration, and the reduced
 * branch is applied one tick later — before any animation has had time to run.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY);
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Imperative check for use inside effects, where hydration is not a concern. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** The site's signature easing curve. Keep entrance motion on this one curve. */
export const EASE_OUT = [0.21, 0.47, 0.32, 0.98] as const;

/** Slightly snappier curve for hover/tap affordances. */
export const EASE_EMPHASIS = [0.22, 1, 0.36, 1] as const;
