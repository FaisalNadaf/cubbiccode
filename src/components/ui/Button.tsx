import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./MagneticButton";

const button = cva(
  // `text-center` only reads when the label wraps, which it never does at the
  // widths desktop buttons are laid out at — the label box is shrink-to-fit.
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full text-center font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white shadow-soft hover:shadow-lift hover:bg-corporate-700",
        accent:
          "bg-corporate-600 text-white shadow-soft hover:bg-corporate-500 hover:shadow-glow",
        outline:
          "border border-steel-300 bg-white/70 text-ink hover:border-ink hover:bg-white",
        ghost: "text-ink hover:bg-steel-100",
        white: "bg-white text-ink shadow-soft hover:shadow-lift",
      },
      size: {
        // Height is a floor (min-h + py) below lg and the exact design height
        // again from lg up. A fixed `h-*` cannot contain a label that wraps to a
        // second line on a 320px screen — the text spills out of the pill. The
        // `lg:` height/padding re-assertion keeps desktop byte-identical.
        //
        // The coarse-pointer bump lifts the 40px `sm` button to the 44px WCAG
        // touch minimum on phones/tablets only. Fine-pointer (mouse) rendering
        // is untouched.
        sm: "h-auto min-h-10 px-5 py-2 text-sm lg:h-10 lg:py-0 [@media(pointer:coarse)]:min-h-11",
        md: "h-auto min-h-12 px-7 py-2.5 text-[15px] lg:h-12 lg:py-0",
        lg: "h-auto min-h-14 px-9 py-3 text-base lg:h-14 lg:py-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonProps = {
  href?: string;
  external?: boolean;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof button> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  href,
  external,
  arrow,
  magnetic = true,
  variant,
  size,
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(button({ variant, size }), className);

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowUpRight className="relative z-10 size-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      )}
    </>
  );

  const node = href ? (
    <Link
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </Link>
  ) : (
    // Without an explicit type a <button> defaults to "submit", so dropping one
    // inside a <form> silently submits it.
    <button type={type ?? "button"} className={classes} {...props}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic strength={0.25}>{node}</Magnetic> : node;
}
