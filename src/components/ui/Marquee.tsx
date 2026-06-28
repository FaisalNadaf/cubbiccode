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
          pauseOnHover && "group-hover:[animation-play-state:paused]"
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
