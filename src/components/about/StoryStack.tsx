/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { MousePointer2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { Reveal } from "@/components/ui/Reveal";
import { aboutCopy } from "@/content/company";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type ChapterId = "began" | "now";

const CHAPTERS: {
	id: ChapterId;
	src: string;
	alt: string;
	year: string;
	title: string;
	detail: string;
	/** Resting tilt, degrees  the stack looks hand-placed rather than aligned. */
	tilt: number;
	/** How far the card drifts with the pointer, px at full deflection. */
	drift: { x: number; y: number };
}[] = [
	{
		id: "began",
		src: "/images/Moments/2016.jpeg",
		alt: "Cubiccode's first office  a small blue room in Belagavi, 2016",
		year: "2016",
		title: "Where it began",
		detail:
			"One room in Belagavi, a board on the wall, and a stubborn idea: a website should earn its keep.",
		tilt: -4,
		drift: { x: -26, y: -18 },
	},
	{
		id: "now",
		src: "/images/Headerimages/Screenshot 2026-07-14 230346.png",
		alt: "Cubiccode collecting a national award for web application development",
		year: "2026",
		title: "Where we are now",
		detail:
			"Offices in Belagavi and Bengaluru, 700+ projects shipped, and national recognition for our web app work.",
		tilt: 4,
		drift: { x: 26, y: 18 },
	},
];

const SPRING = { stiffness: 130, damping: 20, mass: 0.6 };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Who we are" as a hand-placed stack: the 2016 photo behind on the left, the
 * 2026 photo behind on the right, the story card sitting on top of both.
 *
 * Pointer parallax runs on the stage (each card drifts by its own depth), and
 * hovering  or keyboard-focusing  a photo pulls it out of the stack while the
 * story card recedes behind it. Both are desktop/fine-pointer only: below `lg`
 * the same DOM reflows into a plain vertical stack with no transforms, so there
 * is no duplicated markup and nothing to overflow on a phone.
 */
export function StoryStack() {
	const reduce = useReducedMotion();
	const stageRef = useRef<HTMLDivElement>(null);
	const [isDesktop, setIsDesktop] = useState(false);
	const [active, setActive] = useState<ChapterId | null>(null);

	// Pointer, normalised to -1..1 from the centre of the stage.
	const px = useMotionValue(0);
	const py = useMotionValue(0);
	const sx = useSpring(px, SPRING);
	const sy = useSpring(py, SPRING);

	const interactive = isDesktop && !reduce;

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
		const sync = () => setIsDesktop(mq.matches);
		sync();
		mq.addEventListener("change", sync);
		return () => mq.removeEventListener("change", sync);
	}, []);

	// A resize out of the stage layout must not leave the cards parked off-centre.
	useEffect(() => {
		if (!interactive) {
			px.set(0);
			py.set(0);
			setActive(null);
		}
	}, [interactive, px, py]);

	const handleMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!interactive || !stageRef.current) return;
			const r = stageRef.current.getBoundingClientRect();
			px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
			py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
		},
		[interactive, px, py],
	);

	const handleLeave = useCallback(() => {
		px.set(0);
		py.set(0);
		setActive(null);
	}, [px, py]);

	const photo = (chapter: (typeof CHAPTERS)[number]) => (
		<PhotoCard
			key={chapter.id}
			chapter={chapter}
			sx={sx}
			sy={sy}
			interactive={interactive}
			active={active === chapter.id}
			dimmed={active !== null && active !== chapter.id}
			onActivate={() => interactive && setActive(chapter.id)}
			onDeactivate={() => interactive && setActive(null)}
		/>
	);

	return (
		<section className="section relative overflow-hidden bg-canvas-soft">
			<div className="pointer-events-none absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_25%,#000,transparent)] opacity-40" />

			<div className="container-x relative">
				<div
					ref={stageRef}
					onMouseMove={handleMove}
					onMouseLeave={handleLeave}
					style={{ perspective: 1400 }}
					className="relative flex flex-col gap-6 lg:block lg:h-[40rem] xl:h-[44rem]">
					{/* DOM order is the reading order the stack reflows into on phones:
					    2016 → the story → 2026. On lg the three go absolute and the
					    order stops mattering. */}
					{photo(CHAPTERS[0])}

					{/* Story card  centred on the stage, above both photos */}
					<div className="lg:pointer-events-none lg:absolute lg:inset-0 lg:z-30 lg:grid lg:place-items-center">
						<StoryCard
							sx={sx}
							sy={sy}
							interactive={interactive}
							recede={active !== null}
							onHover={() => setActive(null)}
						/>
					</div>

					{photo(CHAPTERS[1])}
				</div>
			</div>
		</section>
	);
}

function PhotoCard({
	chapter,
	sx,
	sy,
	interactive,
	active,
	dimmed,
	onActivate,
	onDeactivate,
}: {
	chapter: (typeof CHAPTERS)[number];
	sx: MotionValue<number>;
	sy: MotionValue<number>;
	interactive: boolean;
	active: boolean;
	dimmed: boolean;
	onActivate: () => void;
	onDeactivate: () => void;
}) {
	const x = useTransform(sx, (v) => v * chapter.drift.x);
	const y = useTransform(sy, (v) => v * chapter.drift.y);
	const isBegan = chapter.id === "began";

	return (
		<motion.figure
			tabIndex={interactive ? 0 : -1}
			onMouseEnter={onActivate}
			onMouseLeave={onDeactivate}
			onFocus={onActivate}
			onBlur={onDeactivate}
			style={{
				x: interactive ? x : 0,
				y: interactive ? y : 0,
				zIndex: active ? 40 : isBegan ? 10 : 20,
			}}
			animate={{
				rotate: interactive && !active ? chapter.tilt : 0,
				scale: active ? 1.06 : dimmed ? 0.97 : 1,
				opacity: dimmed ? 0.85 : 1,
			}}
			transition={{ duration: 0.7, ease: EASE }}
			className={cn(
				"group relative isolate aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] border border-steel-200 bg-ink shadow-card outline-none",
				"transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas-soft",
				active && "shadow-lift",
				"lg:absolute lg:aspect-[5/4] lg:w-[46%] lg:max-w-[34rem] lg:rounded-[2rem]",
				isBegan ? "lg:left-0 lg:top-0" : "lg:bottom-0 lg:right-0",
			)}>
			<Image
				src={chapter.src}
				alt={chapter.alt}
				fill
				sizes="(min-width: 1024px) 46vw, 100vw"
				className={cn(
					"object-cover object-center transition-transform duration-1000 ease-out motion-reduce:transform-none",
					active ? "scale-[1.06]" : "scale-100",
				)}
			/>

			{/* Legibility wash  deepens while the card is out of the stack */}
			<div
				aria-hidden
				className={cn(
					"pointer-events-none absolute inset-0 bg-gradient-to-t transition-opacity duration-500",
					"from-ink/85 via-ink/25 to-transparent",
					active ? "opacity-100" : "opacity-90",
				)}
			/>

			{/* Year badge */}
			<span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-ink backdrop-blur">
				<span className="size-1.5 rounded-full bg-corporate-500" />
				{chapter.year}
			</span>

			<figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
				<p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
					{chapter.title}
				</p>
				{/* Kept in the DOM at all times  screen readers get the full story even
				    though the pointer/keyboard reveal only paints it when the card is out. */}
				<motion.div
					initial={false}
					animate={{
						height: !interactive || active ? "auto" : 0,
						opacity: !interactive || active ? 1 : 0,
					}}
					transition={{ duration: 0.5, ease: EASE }}
					className="overflow-hidden">
					<p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">
						{chapter.detail}
					</p>
				</motion.div>
			</figcaption>
		</motion.figure>
	);
}

function StoryCard({
	sx,
	sy,
	interactive,
	recede,
	onHover,
}: {
	sx: MotionValue<number>;
	sy: MotionValue<number>;
	interactive: boolean;
	recede: boolean;
	/** Cursor back on the story  a photo that was pulled out drops into the stack. */
	onHover: () => void;
}) {
	const x = useTransform(sx, (v) => v * 12);
	const y = useTransform(sy, (v) => v * 9);
	const rotateY = useTransform(sx, (v) => v * 3.5);
	const rotateX = useTransform(sy, (v) => v * -3.5);

	// Soft corporate-blue spotlight that trails the cursor across the card.
	const glareX = useTransform(sx, [-1, 1], ["18%", "82%"]);
	const glareY = useTransform(sy, [-1, 1], ["10%", "90%"]);
	const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(27,110,194,0.10), transparent 60%)`;

	return (
		<motion.div
			onMouseEnter={onHover}
			style={
				interactive ?
					{ x, y, rotateX, rotateY, transformPerspective: 1400 }
				:	undefined
			}
			animate={{
				scale: recede ? 0.96 : 1,
				opacity: recede ? 0.35 : 1,
				filter: recede ? "blur(2px)" : "blur(0px)",
			}}
			transition={{ duration: 0.6, ease: EASE }}
			className={cn(
				"relative overflow-hidden rounded-[1.75rem] border border-steel-200 bg-white p-7 shadow-lift",
				"lg:pointer-events-auto lg:w-[58%] lg:max-w-[35rem] lg:rounded-[2rem] lg:p-10",
			)}>
			{interactive && (
				<motion.span
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{ background: glare }}
				/>
			)}

			<div className="relative">
				<span className="kicker">Who we are</span>

				<ScrollReveal
					baseOpacity={0.1}
					enableBlur
					blurStrength={7}
					baseRotation={1.5}
					containerClassName="!mt-5 !mb-0"
					textClassName="!text-[clamp(1.2rem,1.9vw,1.6rem)] !leading-[1.45] font-display tracking-tight text-ink">
					{aboutCopy.storyStatement}
				</ScrollReveal>

				<Reveal delay={0.1}>
					<p className="mt-6 text-pretty text-[15px] leading-relaxed text-steel-600 sm:text-base">
						{aboutCopy.storySupport}
					</p>
				</Reveal>

		
				
			</div>
		</motion.div>
	);
}
