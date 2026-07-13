/** @format */

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
			aria-label="Cubiccode home"
			// .tap-target-h is declared only inside @media (pointer: coarse), so it
			// emits nothing at all for a mouse. The link itself is only 36px tall.
			className={cn(
				"tap-target-h inline-flex items-center gap-2.5",
				className,
			)}>
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
			aria-label="Cubiccode home"
			// An inline <a> ignores min-height, so the 44px floor has to come with a
			// display change — both are coarse-pointer-gated, i.e. no CSS is emitted
			// for a fine pointer and the desktop box stays a plain inline anchor.
			className={cn(
				"font-display text-xl font-semibold tracking-tight",
				"[@media(pointer:coarse)]:inline-flex [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center",
				className,
			)}>
			Cubic<span className="text-corporate-400">code</span>
		</Link>
	);
}
