/** @format */

"use client";

import Link from "next/link";
import {
	motion,
	useMotionValue,
	useSpring,
	useTransform,
	useReducedMotion,
	type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { TiltCard } from "@/components/ui/TiltCard";
import { Icon } from "@/components/ui/Icon";
import { CountStat } from "@/components/ui/Stat";
import { Reveal } from "@/components/ui/Reveal";
import { heroHighlights, heroStats, hero, type Stat } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * WHY CUBICCODE — a floating, scattered collage.
 *
 * A wide header bar sits top-centre, the content highlights ("data") zig-zag
 * down the left as tilted cards, the headline stats stagger down the right, and
 * a circular "Explore Our Work" CTA anchors the middle. Each block drifts toward
 * the pointer (parallax), tilts in 3D on hover, and the centre CTA is magnetic.
 *
 * The scattered layout is absolutely positioned on a fixed-height canvas at xl+;
 * cards are sized to their content so nothing clips. Below xl it collapses to a
 * clean stacked layout. All pointer motion respects prefers-reduced-motion.
 */

/* Left "data" cards — scattered zig-zag (top-left corner, % of the canvas). */
const DATA_XL = [
	{ left: "4%", top: "11%", width: "18rem", rotate: -3, depth: 26 },
	{ left: "23%", top: "26%", width: "17rem", rotate: -7, depth: 16 },
	{ left: "3%", top: "46%", width: "19rem", rotate: 1, depth: 30 },
	{ left: "21%", top: "70%", width: "21rem", rotate: 5, depth: 18 },
] as const;

/* Right "stats" cards — staggered column. */
const STAT_XL = [
	{ left: "79%", top: "12%", width: "12rem", rotate: 1, depth: 22 },
	{ left: "65%", top: "31%", width: "13rem", rotate: 3, depth: 28 },
	{ left: "79%", top: "53%", width: "12rem", rotate: -1, depth: 16 },
	{ left: "65%", top: "74%", width: "13rem", rotate: 1, depth: 24 },
] as const;

/**
 * A single floating block — drifts toward the pointer (× depth) and reveals on
 * scroll. Pointer drift is skipped under reduced motion; only the resting
 * rotation remains.
 */
function FloatCard({
	mx,
	my,
	depth,
	rotate = 0,
	delay = 0,
	enabled,
	className,
	children,
}: {
	mx: MotionValue<number>;
	my: MotionValue<number>;
	depth: number;
	rotate?: number;
	delay?: number;
	enabled: boolean;
	className?: string;
	children: React.ReactNode;
}) {
	const x = useTransform(mx, (v) => v * depth);
	const y = useTransform(my, (v) => v * depth);

	return (
		<motion.div
			className={cn("relative", className)}
			style={enabled ? { x, y, rotate } : { rotate }}
			initial={{ opacity: 0, scale: enabled ? 0.92 : 1 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}>
			{children}
		</motion.div>
	);
}

/* The wide "WHY CUBICCODE" header bar. */
function HeaderBar({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"inline-flex items-center justify-center gap-2.5 rounded-2xl border border-steel-200 bg-white px-8 py-5 shadow-soft",
				className
			)}>
			<span className="size-2 rounded-full bg-corporate-500" />
			<span className="text-sm font-semibold uppercase tracking-kicker text-corporate-600">
				Why Cubiccode
			</span>
		</div>
	);
}

/* A single content-highlight ("data") card — icon + wrapping copy. */
function DataSurface({ h }: { h: { icon: string; text: string } }) {
	return (
		<TiltCard className="flex h-full w-full items-start gap-3.5 overflow-hidden rounded-2xl border border-steel-200 bg-white p-5 shadow-soft transition-shadow duration-300 hover:shadow-card">
			<span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-corporate-50 text-corporate-600 ring-1 ring-corporate-100">
				<Icon name={h.icon} className="size-5" />
			</span>
			<p className="text-[13.5px] font-medium leading-relaxed text-steel-700">
				{h.text}
			</p>
		</TiltCard>
	);
}

/* A single stat card. */
function StatSurface({ s }: { s: Stat }) {
	return (
		<TiltCard className="flex h-full w-full items-center gap-3.5 overflow-hidden rounded-2xl border border-steel-200 bg-white px-5 py-4 shadow-soft transition-shadow duration-300 hover:shadow-card">
			<div className="shrink-0 font-display text-[1.85rem] font-bold leading-none tracking-tight text-ink">
				<CountStat value={s.value} prefix={s.prefix} suffix={s.suffix} />
			</div>
			<div className="text-[12.5px] font-semibold leading-snug text-steel-500">
				{s.label}
			</div>
		</TiltCard>
	);
}

/* The circular focal CTA — magnetic to the cursor. */
function CenterCTA() {
	return (
		<Magnetic strength={0.4}>
			<Link
				href="/portfolio"
				className="group/cta relative flex size-44 flex-col items-center justify-center gap-1.5 rounded-full border border-steel-200 bg-white text-center shadow-card transition-shadow duration-300 hover:shadow-lift">
				<span
					aria-hidden
					className="absolute inset-1.5 rounded-full border border-corporate-100"
				/>
				<span className="relative max-w-[6.5rem] font-display text-[15px] font-bold leading-tight tracking-tight text-ink">
					{hero.secondaryCta}
				</span>
				<ArrowUpRight className="relative size-4 text-corporate-600 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
			</Link>
		</Magnetic>
	);
}

export function WhyCollage() {
	const reduce = useReducedMotion();
	const enabled = !reduce;

	// Raw pointer offset (-1 → 1 from centre), smoothed by a spring.
	const mvX = useMotionValue(0);
	const mvY = useMotionValue(0);
	const sx = useSpring(mvX, { stiffness: 110, damping: 18, mass: 0.5 });
	const sy = useSpring(mvY, { stiffness: 110, damping: 18, mass: 0.5 });

	const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!enabled) return;
		const r = e.currentTarget.getBoundingClientRect();
		mvX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
		mvY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
	};
	const handleLeave = () => {
		mvX.set(0);
		mvY.set(0);
	};

	return (
		<div className="relative">
			{/* ── XL+ — scattered, pointer-reactive collage ─────────────────────── */}
			<div
				onMouseMove={handleMove}
				onMouseLeave={handleLeave}
				className="relative hidden h-[660px] xl:block">
				{/* Soft corporate halo behind the focal CTA (ties into the theme) */}
				<div
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-1/2 size-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
					style={{
						background:
							"radial-gradient(circle, rgba(27,110,194,0.10), transparent 70%)",
					}}
				/>

				{/* Header bar — wide, top-centre */}
				<div className="absolute left-1/2 top-[5%] z-20 w-[30rem] -translate-x-1/2">
					<FloatCard mx={sx} my={sy} depth={7} enabled={enabled} className="w-full">
						<HeaderBar className="w-full" />
					</FloatCard>
				</div>

				{/* Left — "data" highlights */}
				{heroHighlights.map((h, i) => {
					const p = DATA_XL[i];
					return (
						<div
							key={h.text}
							className="absolute"
							style={{ left: p.left, top: p.top, width: p.width }}>
							<FloatCard
								mx={sx}
								my={sy}
								depth={p.depth}
								rotate={p.rotate}
								delay={0.05 * i}
								enabled={enabled}
								className="w-full">
								<DataSurface h={h} />
							</FloatCard>
						</div>
					);
				})}

				{/* Right — stats */}
				{heroStats.map((s, i) => {
					const p = STAT_XL[i];
					return (
						<div
							key={s.label}
							className="absolute"
							style={{ left: p.left, top: p.top, width: p.width }}>
							<FloatCard
								mx={sx}
								my={sy}
								depth={p.depth}
								rotate={p.rotate}
								delay={0.05 * i}
								enabled={enabled}
								className="w-full">
								<StatSurface s={s} />
							</FloatCard>
						</div>
					);
				})}

				{/* Centre — focal CTA */}
				<div
					className="absolute z-10"
					style={{ left: "50%", top: "46%", width: "11rem" }}>
					<FloatCard
						mx={sx}
						my={sy}
						depth={12}
						delay={0.15}
						enabled={enabled}
						className="w-full">
						<CenterCTA />
					</FloatCard>
				</div>
			</div>

			{/* ── Below xl — clean stacked fallback ─────────────────────────────── */}
			<div className="relative py-2 xl:hidden">
				<div className="mb-9 flex justify-center">
					<HeaderBar />
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					{heroHighlights.map((h, i) => (
						<Reveal key={h.text} direction="up" delay={0.06 * i}>
							<DataSurface h={h} />
						</Reveal>
					))}
				</div>

				<div className="my-10 flex justify-center">
					<Button href="/portfolio" size="lg" arrow>
						{hero.secondaryCta}
					</Button>
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					{heroStats.map((s, i) => (
						<Reveal key={s.label} direction="up" delay={0.06 * i}>
							<StatSurface s={s} />
						</Reveal>
					))}
				</div>
			</div>
		</div>
	);
}
