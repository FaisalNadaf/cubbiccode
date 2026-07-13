"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Route transition (App Router `template.tsx` re-mounts on every navigation).
 *
 *  • Content does an OPACITY-ONLY crossfade  no transform/filter, so sticky &
 *    fixed descendants (e.g. the Capabilities sticky panel, the navbar) are not
 *    broken by a transformed ancestor.
 *  • The branded navy "curtain" that used to wipe up here is gone: every client
 *    navigation is now covered by <PageLoader/> (z-150). Running both showed two
 *    loading screens, because the loader hid the curtain (z-120) only while it
 *    was fully opaque — the moment it began fading out, the still-wiping curtain
 *    appeared underneath it. The cross-fade below survives, hidden beneath the
 *    loader, and is what keeps the incoming route from flashing.
 *  • Fully disabled under prefers-reduced-motion.
 *  • SSR / no-JS safe: see the <noscript> override in app/layout.tsx that forces
 *    [data-route-fade] back to opacity:1 when JS is unavailable.
 */

// Flipped to true after the first load, so the fade-in only runs on real navs.
let firstLoadDone = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = usePrefersReducedMotion();

  // Read during render, not in an effect. On the server and on the hydrating
  // first render this is always false, so both agree; it only flips for the
  // *next* Template instance, i.e. a real client navigation.
  const isClientNav = firstLoadDone;

  useEffect(() => {
    firstLoadDone = true;
  }, []);

  // On a client navigation the incoming route fades up; on the first load it
  // must render opaque. framer applies `initial` to the SSR markup, so an
  // unconditional initial={{opacity:0}} shipped every route's entire content at
  // opacity:0 and deferred the largest contentful paint until hydration.
  const fadeIn = isClientNav && !reduce;

  return (
    // The wrapper is always rendered, so the server and the client agree on the
    // element tree. Previously the reduced-motion branch unwrapped the children,
    // but `reduce` is only known after hydration — so a reduced-motion visitor
    // hydrated a different DOM than was sent.
    <motion.div
      data-route-fade
      initial={fadeIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={fadeIn ? { duration: 0.45, ease: "easeOut" } : { duration: 0 }}
    >
      {children}
    </motion.div>
  );
}
