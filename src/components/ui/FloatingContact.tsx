/**
 * FloatingContact — the "Connect" dome, bottom-left corner.
 *
 * It sits as a full circle pinned in the bottom-left corner — always in view,
 * small enough to stay out of the way of the page. Every so often it nudges
 * upward and shakes, then settles. Open it (click, or hover on a mouse) and four
 * actions fan out along an arc up and to the right: WhatsApp, Chatbot, Call, Visit.
 *
 * The geometry is one number, RADIUS, and one list, ARC. Each action's resting
 * offset is polar — the angles run clockwise from the top of the dome, so DOM
 * order, tab order and what you see all agree, with no reversing tricks.
 *
 * A disclosure, not a menu: a button plus a list of links. `role="menu"` would
 * flip screen readers into application mode and oblige roving tabindex, arrow
 * keys and type-ahead — a great deal of machinery to fire a `tel:` link. So:
 * `aria-expanded` on the dome, a plain list, focus stays put on open, Escape
 * closes and hands focus back. Nothing is trapped, because nothing is modal.
 *
 * Notes that are load-bearing rather than decorative:
 *  • The shake is finite. It runs a few times and stops for the session, and
 *    never runs at all under prefers-reduced-motion. An attract loop that never
 *    ends is a WCAG 2.2.2 failure and reads as a toy on a B2B site.
 *  • Hover opens it only on a real mouse (`hover: hover`), and only after a
 *    short intent delay, so a pointer crossing the bottom of the screen does not
 *    fling the fan open. Touch and keyboard use the click/Enter path.
 *  • No scroll lock and no `lenis.stop()` for our own open state — the fan just
 *    closes on scroll, so it cannot fight the smooth-scroll provider by
 *    construction. The one place we touch Lenis is Collect.chat's own open
 *    event, which pins <body> in a way Lenis never sees.
 *  • z-[60]: above page content (max 50), below the navbar and its opaque mobile
 *    drawer (70), which is exactly why there is no "hide when the menu opens"
 *    flag to keep in sync.
 *
 * @format
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { MapPin, MessagesSquare, Phone, X } from "lucide-react";
import { site } from "@/content/site";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { onCollectChat } from "@/lib/collectchat";
import { cn } from "@/lib/utils";

/** lucide has no WhatsApp glyph. Monochrome, which their brand guidelines allow. */
function WhatsAppGlyph({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			className={className}>
			<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.99 2.898 9.83 9.83 0 0 1 2.892 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.464 3.63" />
		</svg>
	);
}

/**
 * The arc: one radius, three evenly-spaced seats.
 *
 * Even spacing is the whole trick — sweeping SPREAD° and dividing it equally
 * puts the same air between every pair, so the fan reads as one object rather
 * than scattered dots.
 *
 * Anchored in the bottom-left corner, the fan opens up and to the right: the
 * sweep is centred on the 45° diagonal (CENTER_ANGLE) so every seat lands in the
 * upper-right quadrant — none crosses the left edge (which would clip, or worse,
 * push a horizontal scrollbar onto the page) and none dips below the fold.
 *
 * The numbers are constrained, not taste:
 *  • RADIUS ≥ dome radius (42) + action radius (28) + air — any tighter and the
 *    seats sit on the dome itself.
 *  • With three seats the quarter-sweep (SPREAD 90°) spaces them Δ 45° apart —
 *    wide enough that the radius can sit close to the dome: the chord is
 *    2·R·sin(Δ/2), and at R = 100 that is ~76px, leaving ~20px between two 56px
 *    circles.
 */
const RADIUS = 100;
/** Total sweep of the fan. */
const SPREAD = 90;
/** Bearing the sweep is centred on, in degrees (90 = straight up, 0 = right). */
const CENTER_ANGLE = 45;

/**
 * The dome is a full circle, DOME px across, pinned in the corner and always in
 * view — it never hides below the fold. `LIFT` is a small vertical nudge (px,
 * negative = up) per state: flush at rest, rising a touch on hover as an
 * affordance and holding there while open, where the arc unfolds above it.
 */
const DOME = 84;
const LIFT = { rest: 0, hover: -6, open: -6 };

type Action = {
	key: string;
	label: string;
	icon: React.ReactNode;
	/** The three link actions. The chatbot is a button — it opens the widget. */
	href?: string;
	external?: boolean;
	onSelect?: () => void;
	/** Always set: the buttons are icon-only, so the icon can't be the name. */
	ariaLabel: string;
};

const ICON = "size-[20px]" as const;

/** Appears once you're into the page, not over the hero. */
const ARM_SCROLL_PX = 300;
const ARM_DWELL_MS = 1600;

/**
 * Scroll that closes an open fan. Generous on purpose: a thumb reaching for an
 * action routinely drags the page a few pixels, and the browser itself nudges
 * the scroll position when the dome takes focus.
 */
const CLOSE_SCROLL_PX = 96;

/** Mouse-only. Long enough that crossing the corner doesn't fling it open. */
const HOVER_OPEN_MS = 120;
const HOVER_CLOSE_MS = 260;

/**
 * Springs, tuned rather than guessed. ζ = damping / (2·√(stiffness·mass)).
 *
 * FAN at ζ ≈ 0.83 settles in ~380ms with about 1% overshoot — enough to feel
 * like the buttons carry weight, not enough to wobble. The old 380/26/0.9
 * (ζ ≈ 0.70) visibly bounced past its seat and back, which is what read as
 * unsmooth. DOME is a touch softer still, so the lift never snaps.
 */
const FAN = { type: "spring", stiffness: 320, damping: 28, mass: 0.9 } as const;
const DOME_SPRING = {
	type: "spring",
	stiffness: 260,
	damping: 30,
	mass: 1,
} as const;

/** Out from the centre one at a time; back in slightly quicker, in reverse. */
const STAGGER_IN = 0.05;
const STAGGER_OUT = 0.035;

export function FloatingContact() {
	const [open, setOpen] = useState(false);
	/** The dome has earned its place on screen (scrolled, or dwelled). */
	const [armed, setArmed] = useState(false);
	/** Something else owns the bottom of the screen: the footer CTA, or the bot. */
	const [yielded, setYielded] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [shaking, setShaking] = useState(false);

	const rootRef = useRef<HTMLDivElement>(null);
	const domeRef = useRef<HTMLButtonElement>(null);
	/** Kills the attract shake for anyone who has already found the dome. */
	const usedRef = useRef(false);
	const hoverTimer = useRef<number | null>(null);

	const reduced = usePrefersReducedMotion();
	const pathname = usePathname();

	const shown = armed && !yielded;

	const close = useCallback((refocus = false) => {
		setOpen(false);
		if (refocus) domeRef.current?.focus();
	}, []);

	const engage = useCallback(() => {
		usedRef.current = true;
		setShaking(false);
	}, []);

	// ── Arrival ──────────────────────────────────────────────────────────────
	// Never on first paint. The preloader covers all of this anyway, so the dwell
	// timer simply expires underneath it and the dome peeks up as the curtain lifts.
	useEffect(() => {
		if (armed) return;
		const check = () => {
			if (window.scrollY > ARM_SCROLL_PX) setArmed(true);
		};
		check();
		const timer = window.setTimeout(() => setArmed(true), ARM_DWELL_MS);
		window.addEventListener("scroll", check, { passive: true });
		return () => {
			window.clearTimeout(timer);
			window.removeEventListener("scroll", check);
		};
	}, [armed]);

	// ── The attract shake ────────────────────────────────────────────────────
	// A half-hidden control has to announce itself, so it lifts and shivers on a
	// delay. Finite and session-gated: it plays its cycles once and is then done
	// for good. A pulse that loops forever fails WCAG 2.2.2 (no way to stop it)
	// and is the loudest "toy" tell a B2B site can wear.
	useEffect(() => {
		if (!shown || reduced || open || usedRef.current) return;
		if (sessionStorage.getItem("cc-fab-shaken") === "1") return;
		const timer = window.setTimeout(() => {
			if (usedRef.current) return;
			sessionStorage.setItem("cc-fab-shaken", "1");
			setShaking(true);
		}, 2600);
		return () => window.clearTimeout(timer);
	}, [shown, reduced, open]);

	// ── Yield the bottom of the screen to the page's own CTA ─────────────────
	// Two "contact us" affordances stacked on top of each other is a conversion
	// bug, and a fixed control parked over a focused field fails WCAG 2.4.11.
	useEffect(() => {
		const targets = document.querySelectorAll("[data-fab-yield]");
		if (!targets.length) return;
		const seen = new Set<Element>();
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) seen.add(e.target);
					else seen.delete(e.target);
				}
				setYielded(seen.size > 0);
			},
			{ threshold: 0.2 },
		);
		targets.forEach((t) => io.observe(t));
		return () => io.disconnect();
	}, [pathname]);

	useEffect(() => {
		setOpen(false);
		setYielded(false);
	}, [pathname]);

	// ── Close on: Escape, outside pointer, focus leaving, scroll ──────────────
	useEffect(() => {
		if (!open) return;

		// Document-scoped, not root-scoped: Safari and Firefox don't move focus to a
		// <button> on click, so a mouse user's Escape lands on <body> and would never
		// reach a listener bound to the widget.
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close(true);
		};
		const onPointerDown = (e: PointerEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) close();
		};
		const from = window.scrollY;
		const onScroll = () => {
			if (Math.abs(window.scrollY - from) > CLOSE_SCROLL_PX) close();
		};

		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("scroll", onScroll);
		};
	}, [open, close]);

	// ── The bot and the fan are never open at the same time ───────────────────
	useEffect(() => {
		const offOpen = onCollectChat("open", () => {
			setOpen(false);
			setYielded(true);
			// Their bundle pins <body> with `position: fixed` while the chat is up.
			// Lenis scrolls the document programmatically and never sees that, so it
			// keeps running underneath. Read the global lazily: it is assigned in the
			// provider's effect, and never exists at all under reduced motion.
			(window as unknown as { lenis?: { stop: () => void } }).lenis?.stop();
		});
		const offClose = onCollectChat("close", () => {
			setYielded(false);
			(window as unknown as { lenis?: { start: () => void } }).lenis?.start();
		});
		return () => {
			offOpen();
			offClose();
		};
	}, []);

	useEffect(
		() => () => {
			if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
		},
		[],
	);

	/** Mouse only. Touch reports `hover: none`, and would otherwise fire this on tap. */
	const canHover = () =>
		typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

	const onEnter = () => {
		if (!canHover()) return;
		engage();
		setHovered(true);
		if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
		hoverTimer.current = window.setTimeout(() => setOpen(true), HOVER_OPEN_MS);
	};

	const onLeave = () => {
		if (!canHover()) return;
		setHovered(false);
		if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
		hoverTimer.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_MS);
	};

	const toggle = () => {
		engage();
		if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
		setOpen((v) => !v);
	};

	// Clockwise from the top, which is also DOM order, tab order and paint order.
	const actions: Action[] = [
		{
			key: "whatsapp",
			label: "WhatsApp",
			icon: <WhatsAppGlyph className={ICON} />,
			href: site.whatsapp,
			external: true,
			ariaLabel: "Message us on WhatsApp",
		},
		{
			key: "call",
			label: "Call",
			icon: <Phone className={ICON} strokeWidth={1.75} aria-hidden />,
			href: `tel:${site.primaryPhoneRaw}`,
			ariaLabel: `Call ${site.phones[0]}`,
		},
		{
			key: "visit",
			label: "Visit",
			icon: <MapPin className={ICON} strokeWidth={1.75} aria-hidden />,
			href: site.mapShort,
			external: true,
			ariaLabel: "Find our Belagavi office on Google Maps",
		},
	];

	/**
	 * Seat `i` of `n`, evenly spaced across SPREAD° and centred on CENTER_ANGLE,
	 * then polar → cartesian. Screen y grows downward, hence the negated sine.
	 * Deriving the angles instead of listing them is what guarantees the spacing
	 * stays even if an action is ever added or dropped.
	 */
	const seat = (i: number, n: number) => {
		const deg = CENTER_ANGLE + SPREAD / 2 - (i * SPREAD) / (n - 1);
		const rad = (deg * Math.PI) / 180;
		return { x: RADIUS * Math.cos(rad), y: -RADIUS * Math.sin(rad) };
	};

	const listVariants: Variants = {
		open: {
			transition: reduced ? (
				{}
			) : (
				{ staggerChildren: STAGGER_IN, delayChildren: 0.03 }
			),
		},
		closed: {
			transition: reduced ?
				{}
			:	{ staggerChildren: STAGGER_OUT, staggerDirection: -1 },
		},
	};

	// Under reduced motion the actions still appear and disappear — they simply
	// don't travel. They are placed at their seats and cross-faded there.
	const itemVariants: Variants = {
		open: (c: { x: number; y: number }) => ({
			opacity: 1,
			x: c.x,
			y: c.y,
			scale: 1,
			// Opacity lands well before the spring does, so a button is solid while it
			// is still travelling — it flies out, rather than fading in mid-air.
			transition:
				reduced ?
					{ duration: 0.12 }
				:	{ ...FAN, opacity: { duration: 0.14, ease: EASE_OUT } },
		}),
		closed: (c: { x: number; y: number }) =>
			reduced ?
				{ opacity: 0, x: c.x, y: c.y, scale: 1, transition: { duration: 0.12 } }
			:	{
					opacity: 0,
					x: 0,
					y: 0,
					scale: 0.5,
					// Retracts on the same curve it left on, just quicker. A linear-out
					// exit made the buttons appear to fall back rather than be drawn in.
					transition: { duration: 0.2, ease: EASE_OUT },
				},
	};

	const domeY =
		open ? LIFT.open
		: hovered ? LIFT.hover
		: LIFT.rest;

	return (
		<>
			{/* Mobile only: a plain dim, no backdrop-filter. Rendered outside the root
			    so the outside-pointerdown handler closes on it for free. */}
			<AnimatePresence>
				{open && (
					<motion.div
						aria-hidden="true"
						className="fixed inset-0 z-[59] bg-ink/40 lg:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: reduced ? 0.1 : 0.18, ease: "linear" }}
					/>
				)}
			</AnimatePresence>

			<motion.div
				ref={rootRef}
				onPointerEnter={onEnter}
				onPointerLeave={onLeave}
				className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom,0px)+20px)] left-[calc(env(safe-area-inset-left,0px)+24px)] z-[60]"
				initial={false}
				animate={shown ? "shown" : "hidden"}
				variants={{
					hidden: { opacity: 0, y: 24 },
					shown: { opacity: 1, y: 0 },
				}}
				transition={
					shown ? { type: "spring", stiffness: 320, damping: 30 } : (
						{ duration: 0.18, ease: EASE_OUT }
					)
				}
				inert={!shown || undefined}
				aria-hidden={!shown || undefined}>
				{/* The dome and the arc travel together, so opening lifts the whole
				    assembly clear of the fold in one movement. */}
				<motion.div
					className="relative"
					style={{ width: DOME, height: DOME }}
					animate={{ y: domeY }}
					transition={reduced ? { duration: 0.12 } : DOME_SPRING}>
					<motion.button
						ref={domeRef}
						type="button"
						onClick={toggle}
						aria-expanded={open}
						aria-controls="floating-contact-actions"
						className={cn(
							"pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-ink text-white shadow-lift ring-1 ring-inset ring-white/10",
							"transition-shadow duration-200 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
						)}
						// The shake: a lift and a shiver, a few times, then never again.
						// Rotation and y only — both compositor-only properties.
						animate={
							shaking ?
								{ rotate: [0, -7, 6, -5, 4, -2, 0], y: [0, -8, 0, -5, 0, -2, 0] }
							:	{ rotate: 0, y: 0 }
						}
						transition={
							shaking ?
								{
									duration: 0.75,
									ease: "easeInOut",
									repeat: 3,
									repeatDelay: 5,
								}
							:	{ duration: 0.2 }
						}
						onAnimationComplete={() => setShaking(false)}>
						<AnimatePresence mode="wait" initial={false}>
							<motion.span
								key={open ? "x" : "chat"}
								className="grid size-6 place-items-center"
								initial={
									reduced ? { opacity: 0 } : (
										{ opacity: 0, rotate: -30, scale: 0.86 }
									)
								}
								animate={
									reduced ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }
								}
								exit={
									reduced ? { opacity: 0 } : (
										{ opacity: 0, rotate: 30, scale: 0.86 }
									)
								}
								transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}>
								{open ?
									<X
										className="size-[22px]"
										strokeWidth={1.75}
										aria-hidden
									/>
								:	<MessagesSquare
										className="size-[22px]"
										strokeWidth={1.75}
										aria-hidden
									/>
								}
							</motion.span>
						</AnimatePresence>

						{/* The accessible name is this text — no aria-label, which would desync
						    from "Close" the moment it opens (WCAG 2.5.3 Label in Name). */}
						<span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
							{open ? "Close" : "Connect"}
						</span>
					</motion.button>

					{/* After the dome in the DOM, not before it. Both are absolutely
					    positioned, so order costs nothing visually — but it is the whole
					    tab order: put the list first and Tab from the dome sails straight
					    past the actions and out of the widget. */}
					<motion.ul
						id="floating-contact-actions"
						aria-label="Contact options"
						className="absolute inset-0"
						variants={listVariants}
						initial="closed"
						animate={open ? "open" : "closed"}
						inert={!open || undefined}>
						{actions.map((action, i) => {
							const body = (
								<>
									{/* Transform + colour only, and never `box-shadow`/`filter`, so a
									    hover can't repaint a button that is still in flight. */}
									<span className="grid size-14 place-items-center rounded-full bg-white text-corporate-700 shadow-lift ring-1 ring-inset ring-ink/[0.08] transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-corporate-600 group-hover:text-white group-focus-visible:bg-corporate-600 group-focus-visible:text-white">
										{action.icon}
									</span>
									{/* The name, parked above its icon. Icon-only controls are a
									    guessing game; `ariaLabel` covers assistive tech, this
									    covers everyone else. */}
									<span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em] text-white opacity-0 shadow-soft transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
										{action.label}
									</span>
								</>
							);

							const cls =
								"group pointer-events-auto relative flex size-14 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

							return (
								<motion.li
									key={action.key}
									custom={seat(i, actions.length)}
									variants={itemVariants}
									// Seated on the dome's centre; the variants carry each one out
									// to its place on the arc.
									//
									// The z-lift is not cosmetic: the seats are siblings, so a later
									// one paints over an earlier one, and at 16px apart a hover
									// label was disappearing behind the next circle along. Whichever
									// item is being pointed at or focused comes to the front.
									className="absolute left-1/2 top-1/2 -ml-7 -mt-7 hover:z-10 focus-within:z-10">
									{action.href ?
										<a
											href={action.href}
											aria-label={action.ariaLabel}
											onClick={() => close()}
											{...(action.external ?
												{ target: "_blank", rel: "noopener noreferrer" }
											:	{})}
											className={cls}>
											{body}
										</a>
									:	<button
											type="button"
											aria-label={action.ariaLabel}
											onClick={() => {
												action.onSelect?.();
												close();
											}}
											className={cls}>
											{body}
										</button>
									}
								</motion.li>
							);
						})}
					</motion.ul>
				</motion.div>
			</motion.div>
		</>
	);
}
