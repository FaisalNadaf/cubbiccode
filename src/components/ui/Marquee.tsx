import { cn } from "@/lib/utils";

export function Marquee({
  children,
  reverse = false,
  speed = 42,
  pauseOnHover = true,
  className,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("group mask-x flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max items-center",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          // Hover-capable pointers only. Touch browsers latch :hover on the
          // tapped element until you tap elsewhere, so on a phone the first tap
          // anywhere near the marquee froze it for good. Any device with a real
          // pointer matches `hover: hover`, so desktop resolves to the same rule.
          pauseOnHover &&
            "[@media(hover:hover)]:group-hover:[animation-play-state:paused]"
        )}
        style={{ ["--marquee-duration" as string]: `${speed}s` }}
      >
        {children}
        <span aria-hidden className="contents">
          {children}
        </span>
      </div>
    </div>
  );
}
