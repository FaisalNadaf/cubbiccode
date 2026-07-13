/** @format */

"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

// Problem-flavoured icons for the floating chips (Lucide names).
const FLOAT_ICONS = ["TrendingDown", "Clock", "AlertTriangle"];

// Short (1–2 word) problem tags for the floating text badges.
const FLOAT_BADGES = [
	"Wasted hours",
	"Lost sales",
	"Outdated",
	"No visibility",
];

/**
 * THE PROBLEM  a centered content card ringed by floating image cards and
 * icon chips. The whole scene reacts to the cursor: each block drifts by an
 * amount set by its depth (mouse parallax) and lifts / comes forward on hover.
 */
export function ProblemShowcase({
	kicker = "The problem",
	problem,
	images,
	icons = FLOAT_ICONS,
	badges = FLOAT_BADGES,
}: {
	kicker?: string;
	problem: string;
	images: string[];
	icons?: string[];
	badges?: string[];
}) {
	const ref = useRef<HTMLDivElement>(null);
	const mx = useMotionValue(0);
	const my = useMotionValue(0);
	const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.4 });
	const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.4 });

	// Cursor parallax is a fine-pointer affordance. On touch the only mousemove is
	// the one a tap synthesises  it would shove the card off-centre with no
	// mouseleave ever arriving to bring it back. Resolved in an effect so SSR and
	// the first client render stay identical.
	const parallaxOn = useRef(true);
	useEffect(() => {
		const coarse = window.matchMedia("(pointer: coarse)");
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => {
			parallaxOn.current = !coarse.matches && !reduced.matches;
			if (!parallaxOn.current) {
				mx.set(0);
				my.set(0);
			}
		};
		sync();
		coarse.addEventListener("change", sync);
		reduced.addEventListener("change", sync);
		return () => {
			coarse.removeEventListener("change", sync);
			reduced.removeEventListener("change", sync);
		};
	}, [mx, my]);

	const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = ref.current;
		if (!el || !parallaxOn.current) return;
		const r = el.getBoundingClientRect();
		mx.set((e.clientX - r.left) / r.width - 0.5);
		my.set((e.clientY - r.top) / r.height - 0.5);
	};
	const handleLeave = () => {
		mx.set(0);
		my.set(0);
	};

	return (
		<div
			ref={ref}
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			className="relative mx-auto max-w-6xl lg:flex lg:min-h-[720px] lg:items-center lg:justify-center">
			{/* soft stage behind the scene (desktop) */}
			<div className="pointer-events-none absolute inset-0 -z-10 hidden rounded-[3rem] bg-gradient-to-br from-corporate-50/50 via-white to-corporate-50/20 lg:block" />

			{/* ── floating images (desktop) ── */}
			<Float
				sx={sx}
				sy={sy}
				depth={40}
				className="absolute left-[1%] top-[5%] hidden w-[clamp(180px,18vw,290px)] lg:block">
				<ImageCard src={images[0]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={46}
				className="absolute right-[14%] top-[1%] hidden w-[clamp(180px,18vw,290px)] lg:block">
				<ImageCard src={images[1]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={34}
				className="absolute bottom-[4%] left-[3%] hidden w-[clamp(180px,18vw,290px)] lg:block">
				<ImageCard src={images[2]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={52}
				className="absolute bottom-[6%] right-[1%] hidden w-[clamp(180px,18vw,290px)] lg:block">
				<ImageCard src={images[3]} />
			</Float>

			{/* ── floating icon chips (desktop) ── */}
			<Float
				sx={sx}
				sy={sy}
				depth={72}
				className="absolute left-[31%] top-[11%] hidden lg:block">
				<IconChip name={icons[0]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={84}
				className="absolute right-[3%] top-[29%] hidden lg:block">
				<IconChip name={icons[1]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={66}
				className="absolute bottom-[7%] left-[38%] hidden lg:block">
				<IconChip name={icons[2]} />
			</Float>

			{/* ── floating problem badges  parked in the side gaps, clear of images ── */}
			<Float
				sx={sx}
				sy={sy}
				depth={90}
				className="absolute left-[45%] top-[4%] z-30 hidden lg:block">
				<TextBadge label={badges[0]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={80}
				className="absolute right-[0.5%] top-[47%] z-30 hidden lg:block">
				<TextBadge label={badges[1]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={76}
				className="absolute left-[0.5%] top-[45%] z-30 hidden lg:block">
				<TextBadge label={badges[2]} />
			</Float>
			<Float
				sx={sx}
				sy={sy}
				depth={96}
				className="absolute bottom-[4%] left-[47%] z-30 hidden lg:block">
				<TextBadge label={badges[3]} />
			</Float>

			{/* ── centered content ── */}
			<Float
				sx={sx}
				sy={sy}
				depth={-14}
				hover={false}
				className="relative z-20 mx-auto w-full max-w-2xl">
				<div className="rounded-[2rem] border border-steel-200 bg-white/95 p-8 shadow-lift backdrop-blur lg:p-11">
					<span className="kicker">{kicker}</span>
					<p className="mt-5 text-pretty text-lg font-medium leading-relaxed text-steel-700 lg:text-xl">
						{problem}
					</p>
				</div>
			</Float>

			{/* ── mobile: badge row + simple image grid under the card ── */}
			<div className="mt-8 flex flex-col items-center gap-6 lg:hidden">
				<div className="flex flex-wrap justify-center gap-2">
					{badges.map((b, i) => (
						<TextBadge
							key={i}
							label={b}
						/>
					))}
				</div>
				<div className="grid w-full grid-cols-2 gap-4">
					{images.slice(0, 4).map((src, i) => (
						<ImageCard
							key={i}
							src={src}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

/* ── a mouse-parallaxed, hover-reactive block ── */

function Float({
	sx,
	sy,
	depth = 30,
	hover = true,
	className,
	children,
}: {
	sx: MotionValue<number>;
	sy: MotionValue<number>;
	depth?: number;
	hover?: boolean;
	className?: string;
	children: React.ReactNode;
}) {
	const x = useTransform(sx, (v) => v * depth);
	const y = useTransform(sy, (v) => v * depth);
	return (
		<motion.div
			style={{ x, y }}
			whileHover={hover ? { scale: 1.06, zIndex: 40 } : undefined}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={className}>
			{children}
		</motion.div>
	);
}

function ImageCard({ src, className }: { src: string; className?: string }) {
	return (
		<div
			className={cn(
				"overflow-hidden rounded-3xl border border-steel-200 bg-white shadow-lift",
				className,
			)}>
			<div className="relative aspect-[5/4] w-full">
				{/* `sizes` is px-only by necessity: a `vw` token makes next/image drop the
				    small candidates from the generated srcset, which would change the
				    source the browser picks at >=1024px. */}
				<Image
					src={src}
					alt=""
					fill
					sizes="(min-width: 1024px) 222px, (min-width: 768px) 480px, (min-width: 480px) 352px, 192px"
					className="object-cover"
				/>
			</div>
		</div>
	);
}

function IconChip({ name }: { name: string }) {
	return (
		<div className="flex size-14 items-center justify-center rounded-2xl border border-steel-200 bg-white text-corporate-600 shadow-soft lg:size-[68px]">
			<Icon
				name={name}
				className="size-6 lg:size-7"
			/>
		</div>
	);
}

function TextBadge({ label }: { label: string }) {
	return (
		<span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-steel-200 bg-white px-4 py-2 text-[13px] font-semibold text-ink shadow-soft">
			<span className="size-1.5 shrink-0 rounded-full bg-red-500" />
			{label}
		</span>
	);
}
