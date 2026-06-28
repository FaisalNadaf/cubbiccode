import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Cubiccode — home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/brand/logo.png"
        alt="Cubiccode Digital Media LLP"
        width={172}
        height={44}
        priority={priority}
        className="h-9 w-auto object-contain"
      />
    </Link>
  );
}

/** Compact wordmark used in dark/footer contexts where the raster logo lacks contrast. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Cubiccode — home"
      className={cn(
        "font-display text-xl font-semibold tracking-tight",
        className
      )}
    >
      Cubic<span className="text-corporate-400">code</span>
    </Link>
  );
}
