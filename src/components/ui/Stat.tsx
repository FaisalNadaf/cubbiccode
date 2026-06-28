"use client";

import { useRef } from "react";
import CountUp from "react-countup";
import { useInView } from "framer-motion";

export function CountStat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2.4,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp
          end={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          duration={duration}
          separator=","
          useEasing
        />
      ) : (
        <>
          {prefix}0{suffix}
        </>
      )}
    </span>
  );
}
