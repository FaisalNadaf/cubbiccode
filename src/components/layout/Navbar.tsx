/** @format */

"use client";

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	motion,
	AnimatePresence,
	useScroll,
	useMotionValueEvent,
	useMotionValue,
	useSpring,
	type Variants,
} from "framer-motion";
import { ChevronDown, ArrowUpRight, ArrowRight } from "lucide-react";
import { nav, site, type NavGroup, type NavLink } from "@/content/site";
import { routes } from "@/lib/routes";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING = {
	type: "spring",
	stiffness: 380,
	damping: 32,
	mass: 0.8,
} as const;

const hasPanel = (g: NavGroup) => !!(g.columns || g.links);

function groupHrefs(g: NavGroup): string[] {
	if (g.href) return [g.href];
	const cols =
		g.columns ?? (g.links ? [{ heading: g.label, links: g.links }] : []);
	return cols.flatMap((c) => c.links.map((l) => l.href));
}

function isActiveGroup(g: NavGroup, path: string): boolean {
	if (g.href) return path === g.href;
	return groupHrefs(g).some(
		(h) => path === h || (h !== "/" && path.startsWith(h + "/")),
	);
}

export function Navbar() {
	const reduce = usePrefersReducedMotion();
	const pathname = usePathname();
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = useState(false);
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [hovered, setHovered] = useState<number | null>(null);
	const [mobileOpen, setMobileOpen] = useState(false);

	// top-level item refs for the sliding pill
	const navRef = useRef<HTMLElement>(null);
	const itemRefs = useRef<(HTMLElement | null)[]>([]);
	const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

	// outer wrapper + the x-anchor used to center the mega panel under its trigger
	const barWrapRef = useRef<HTMLDivElement>(null);
	const [panelAnchor, setPanelAnchor] = useState(0);

	// Delayed close so moving the cursor from a trigger into the panel never
	// snaps the dropdown shut mid-traverse.
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

	const activeIndex = nav.findIndex((g) => isActiveGroup(g, pathname));
	const target = hovered ?? (activeIndex >= 0 ? activeIndex : null);

	// Every interior page now opens with a dark, full-bleed cinematic hero, so the bar
	// floats transparently with white text at the very top, then solidifies into the
	// light glass bar on scroll / panel open. Only the handful of pages that open on a
	// light background keep the solid bar from the start.
	const lightHeroRoutes: string[] = [routes.culture, routes.clientele];
	const overDarkHero =
		!lightHeroRoutes.includes(pathname) && !scrolled && openIndex === null;

	// Move the pill to the hovered (or active) item.
	useEffect(() => {
		if (target == null) {
			setPill((p) => ({ ...p, opacity: 0 }));
			return;
		}
		const el = itemRefs.current[target];
		if (el) {
			setPill({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
		}
	}, [target, scrolled]);

	// Anchor the mega panel to the center of its trigger item (relative to the bar).
	function measureAnchor(index: number | null) {
		if (index == null) return;
		const trigger = itemRefs.current[index];
		const wrap = barWrapRef.current;
		if (trigger && wrap) {
			const t = trigger.getBoundingClientRect();
			const w = wrap.getBoundingClientRect();
			setPanelAnchor(t.left - w.left + t.width / 2);
		}
	}

	useEffect(() => {
		measureAnchor(openIndex);
	}, [openIndex, scrolled]);

	useEffect(() => {
		function onResize() {
			const el = target != null ? itemRefs.current[target] : null;
			if (el)
				setPill({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
			measureAnchor(openIndex);
		}
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [target, openIndex]);

	// Close everything on route change.
	useEffect(() => {
		setOpenIndex(null);
		setHovered(null);
		setMobileOpen(false);
	}, [pathname]);

	// Stable identity: MobileMenu keys its focus-trap effect off this, and the bar
	// re-renders on every scroll tick.
	const closeMobile = useCallback(() => setMobileOpen(false), []);

	// Freeze the page behind the drawer. `overflow: hidden` alone does not hold it:
	// Lenis scrolls the document programmatically and never consults overflow, so it
	// has to be stopped as well. `window.lenis` is assigned by the SmoothScroll
	// provider's effect and is absent entirely under reduced motion, hence the
	// guarded lookup — by the time the drawer can be opened the provider has mounted.
	useEffect(() => {
		if (!mobileOpen) return;
		const html = document.documentElement;
		const body = document.body;
		const prevHtml = html.style.overflow;
		const prevBody = body.style.overflow;
		html.style.overflow = "hidden";
		body.style.overflow = "hidden";
		const lenis = (
			window as unknown as { lenis?: { stop: () => void; start: () => void } }
		).lenis;
		lenis?.stop();
		return () => {
			html.style.overflow = prevHtml;
			body.style.overflow = prevBody;
			lenis?.start();
		};
	}, [mobileOpen]);

	// The drawer and its toggle are both `lg:hidden`, so widening past the desktop
	// breakpoint while it is open would strand `mobileOpen` as true — and with it an
	// invisible scroll lock on a page whose menu is no longer reachable.
	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const onChange = (e: MediaQueryListEvent) => {
			if (e.matches) setMobileOpen(false);
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);

	function cancelClose() {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	}

	function closeAll() {
		cancelClose();
		setHovered(null);
		setOpenIndex(null);
	}

	// Arm a short timer instead of closing instantly  entering the panel (which
	// re-enters the bar wrapper) cancels it, so the hover gap no longer kills it.
	function scheduleClose() {
		cancelClose();
		closeTimer.current = setTimeout(() => {
			setHovered(null);
			setOpenIndex(null);
		}, 140);
	}

	// Clear any pending timer on unmount.
	useEffect(() => () => cancelClose(), []);

	return (
		<motion.header
			initial={reduce ? false : { y: -90, opacity: 0, scale: 0.97 }}
			animate={{ y: 0, opacity: 1, scale: 1 }}
			transition={
				reduce ?
					{ duration: 0 }
				:	{ duration: 0.9, ease: EASE, delay: 0.05 }
			}
			className="fixed inset-x-0 top-0 z-[70]">
			{/* ===== Full-width bar, flush to the top edge ===== */}
			<div
				className={cn(
					"relative border-b transition-all duration-500",
					scrolled || openIndex !== null ?
						"border-steel-200/60 bg-white/85 shadow-[0_1px_2px_-1px_rgba(11,27,58,0.08)] backdrop-blur-xl backdrop-saturate-150"
					: overDarkHero ?
						"border-transparent bg-gradient-to-b from-ink/65 via-ink/35 to-transparent"
					:	"border-transparent bg-white/75 backdrop-blur-md",
				)}>
				{/* animated sheen on scroll */}
				<div
					className={cn(
						"pointer-events-none absolute inset-0 bg-gradient-to-r from-corporate-500/0 via-corporate-400/10 to-corporate-500/0 transition-opacity duration-500",
						scrolled ? "opacity-100" : "opacity-0",
					)}
				/>

				<div
					ref={barWrapRef}
					className="container-x relative"
					onMouseLeave={scheduleClose}
					onMouseEnter={cancelClose}>
					<div
						className={cn(
							"relative flex items-center justify-between gap-4 transition-all duration-500",
							scrolled ? "h-[66px]" : "h-[82px]",
						)}>
						<Logo
							priority
							className={cn(
								"relative z-10 shrink-0 transition-[filter] duration-500 [&_img]:h-12",
								overDarkHero && "[&_img]:brightness-0 [&_img]:invert",
							)}
						/>

						{/* ===== Desktop nav (centered) ===== */}
						<nav
							ref={navRef}
							className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex">
							{/* sliding pill */}
							<motion.span
								aria-hidden
								className={cn(
									"absolute top-1/2 z-0 h-9 rounded-full ring-1",
									overDarkHero ?
										"bg-white/10 ring-white/15"
									:	"bg-ink/[0.06] ring-ink/[0.04]",
								)}
								animate={{
									x: pill.left,
									width: pill.width,
									opacity: pill.opacity,
									y: "-50%",
								}}
								transition={SPRING}
								style={{ left: 0 }}
							/>

							{nav.map((group, i) => {
								const active = isActiveGroup(group, pathname);
								const panel = hasPanel(group);
								const common =
									"relative z-10 inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-5 text-[15px] font-medium transition-colors duration-200";
								const tone =
									overDarkHero ?
										active || hovered === i ?
											"text-white [text-shadow:0_1px_3px_rgba(8,20,39,0.55)]"
										:	"text-white/90 [text-shadow:0_1px_3px_rgba(8,20,39,0.55)]"
									: active || hovered === i ? "text-ink"
									: "text-steel-700";

								return panel ?
										<button
											key={group.label}
											type="button"
											ref={(el) => {
												itemRefs.current[i] = el;
											}}
											onMouseEnter={() => {
												setHovered(i);
												setOpenIndex(i);
											}}
											onFocus={() => {
												setHovered(i);
												setOpenIndex(i);
											}}
											className={cn(common, tone)}
											aria-expanded={openIndex === i}>
											{group.label}
											<ChevronDown
												className={cn(
													"size-3.5 transition-transform duration-300",
													overDarkHero ? "text-white/60" : "text-steel-400",
													openIndex === i && "rotate-180 text-corporate-500",
												)}
											/>
										</button>
									:	<Link
											key={group.label}
											href={group.href!}
											ref={(el) => {
												itemRefs.current[i] = el;
											}}
											onMouseEnter={() => {
												setHovered(i);
												setOpenIndex(null);
											}}
											className={cn(common, tone)}>
											{group.label}
										</Link>;
							})}
						</nav>

						{/* ===== Right: CTA + mobile toggle ===== */}
						<div className="relative z-10 flex items-center gap-2">
							<ProposalCta className="hidden sm:inline-flex" />
							<MobileToggle
								open={mobileOpen}
								onClick={() => setMobileOpen((v) => !v)}
								dark={overDarkHero}
							/>
						</div>
					</div>

					{/* ===== Mega panel ===== */}
					<AnimatePresence>
						{openIndex !== null && hasPanel(nav[openIndex]) && (
							<MegaPanel
								key={openIndex}
								group={nav[openIndex]}
								onNavigate={closeAll}
								centerX={panelAnchor}
							/>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* ===== Mobile menu ===== */}
			<MobileMenu
				open={mobileOpen}
				onClose={closeMobile}
				pathname={pathname}
			/>
		</motion.header>
	);
}

/* ----------------------------------------------------------------------- */
/* Premium gradient CTA                                                     */
/* ----------------------------------------------------------------------- */

function ProposalCta({
	className,
	full = false,
}: {
	className?: string;
	full?: boolean;
}) {
	// framer drives these two loops through rAF, so the global
	// `prefers-reduced-motion` block in globals.css (which only neutralises CSS
	// animations/transitions) never reaches them — they need an explicit guard.
	const reduce = usePrefersReducedMotion();

	return (
		<Magnetic
			strength={0.3}
			className={full ? "w-full" : undefined}>
			<Link
				href={site.proposalCta}

				rel="noopener noreferrer"
				className={cn(
					"group relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5",
					full && "w-full py-3.5 text-base",
					className,
				)}>
				{/* pulsing glow */}
				<motion.span
					aria-hidden
					className="pointer-events-none absolute -inset-0.5 -z-20 rounded-full bg-corporate-500/45 blur-md"
					animate={
						reduce ?
							{ opacity: 0.45, scale: 1 }
						:	{ opacity: [0.3, 0.6, 0.3], scale: [0.97, 1.04, 0.97] }
					}
					transition={
						reduce ?
							{ duration: 0 }
						:	{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }
					}
				/>
				{/* animated gradient fill */}
				<motion.span
					aria-hidden
					className="absolute inset-0 -z-10 rounded-full"
					style={{
						backgroundImage:
							"linear-gradient(110deg,#0F4C81,#1B6EC2,#3F86D0,#1B6EC2,#0F4C81)",
						backgroundSize: "200% 100%",
					}}
					animate={
						reduce ?
							{ backgroundPosition: "0% 50%" }
						:	{ backgroundPosition: ["0% 50%", "200% 50%"] }
					}
					transition={
						reduce ?
							{ duration: 0 }
						:	{ duration: 6, repeat: Infinity, ease: "linear" }
					}
				/>
				{/* sheen sweep on hover */}
				<span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full">
					<span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-sm transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
				</span>
				Get a Proposal / Contact
				<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
			</Link>
		</Magnetic>
	);
}

/* ----------------------------------------------------------------------- */
/* Mega dropdown panel                                                      */
/* ----------------------------------------------------------------------- */

const panelVariants: Variants = {
	hidden: { opacity: 0, y: 10, scale: 0.98, filter: "blur(8px)" },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		filter: "blur(0px)",
		transition: { duration: 0.42, ease: EASE },
	},
	exit: {
		opacity: 0,
		y: 8,
		scale: 0.985,
		filter: "blur(6px)",
		transition: { duration: 0.22, ease: "easeIn" },
	},
};

const listVariants: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 14 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function MegaPanel({
	group,
	onNavigate,
	centerX,
}: {
	group: NavGroup;
	onNavigate: () => void;
	centerX: number;
}) {
	const columns =
		group.columns ??
		(group.links ? [{ heading: group.label, links: group.links }] : []);
	const multi = columns.length > 1;
	const single = multi ? undefined : columns[0];
	// Up to 4 links stack as one vertical list; longer lists would run past the
	// viewport bottom, so they stay on the 2-up grid.
	const verticalList = !!single && single.links.length <= 4;

	// Position the panel's left edge so it is centered under its trigger,
	// clamped to stay within the bar so it never overflows the viewport.
	const panelRef = useRef<HTMLDivElement>(null);
	const [left, setLeft] = useState(() => centerX);

	useLayoutEffect(() => {
		const el = panelRef.current;
		if (!el) return;
		const parent = el.offsetParent;
		const parentW =
			parent instanceof HTMLElement ? parent.clientWidth : window.innerWidth;
		const margin = 8;
		const next = Math.max(
			margin,
			Math.min(centerX - el.offsetWidth / 2, parentW - el.offsetWidth - margin),
		);
		setLeft(next);
	}, [centerX, group]);

	// mouse-follow highlight
	const mx = useMotionValue(0);
	const my = useMotionValue(0);
	const hx = useSpring(mx, { stiffness: 150, damping: 20 });
	const hy = useSpring(my, { stiffness: 150, damping: 20 });

	return (
		<motion.div
			ref={panelRef}
			variants={panelVariants}
			initial="hidden"
			animate="show"
			exit="exit"
			onMouseMove={(e) => {
				const r = e.currentTarget.getBoundingClientRect();
				mx.set(e.clientX - r.left);
				my.set(e.clientY - r.top);
			}}
			className="absolute top-full z-[65] hidden pt-2.5 lg:block"
			style={{ left }}>
			<div className="relative overflow-hidden rounded-3xl border border-steel-200 bg-white/95 p-2.5 shadow-lift ring-1 ring-black/5 backdrop-blur-xl">
				{/* mouse-follow glow */}
				<motion.div
					aria-hidden
					className="pointer-events-none absolute size-[240px] rounded-full bg-corporate-400/10 blur-3xl"
					style={{ left: hx, top: hy, x: "-50%", y: "-50%" }}
				/>
				{/* top accent line */}
				<div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-corporate-400/60 to-transparent" />

				{multi ?
					<div className="relative flex gap-1">
						{columns.map((col, ci) => (
							<div
								key={col.heading}
								className={cn(
									"w-[268px] p-1.5",
									ci > 0 && "border-l border-steel-100",
								)}>
								<ColHeading>{col.heading}</ColHeading>
								<motion.div
									variants={listVariants}
									initial="hidden"
									animate="show"
									className="mt-1 space-y-0.5">
									{col.links.map((link) => (
										<LinkRow
											key={link.label}
											link={link}
											onNavigate={onNavigate}
										/>
									))}
								</motion.div>
							</div>
						))}
					</div>
				:	<div
						className={cn(
							"relative p-1.5",
							verticalList ? "w-[344px]" : "w-[560px]",
						)}>
						<ColHeading>{single?.heading}</ColHeading>
						<motion.div
							variants={listVariants}
							initial="hidden"
							animate="show"
							className={cn(
								"mt-1",
								verticalList ? "space-y-0.5" : "grid grid-cols-2 gap-0.5",
							)}>
							{single?.links.map((link) => (
								<LinkRow
									key={link.label}
									link={link}
									onNavigate={onNavigate}
								/>
							))}
						</motion.div>
					</div>
				}
			</div>
		</motion.div>
	);
}

function ColHeading({ children }: { children: React.ReactNode }) {
	return (
		<p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-kicker text-steel-400">
			{children}
		</p>
	);
}

function LinkRow({
	link,
	onNavigate,
}: {
	link: NavLink;
	onNavigate: () => void;
}) {
	const className =
		"group/link relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-300 hover:bg-corporate-50/70";
	const inner = (
		<>
			{/* animated border */}
			<span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition-colors duration-300 group-hover/link:ring-corporate-200" />

			{link.icon && (
				<motion.span
					variants={{ hover: { scale: 1.18, y: -3, rotate: -4 } }}
					transition={{ type: "spring", stiffness: 420, damping: 13 }}
					className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-corporate-600 shadow-soft ring-1 ring-steel-200 transition-colors duration-300 group-hover/link:bg-corporate-600 group-hover/link:text-white group-hover/link:ring-corporate-600">
					<Icon
						name={link.icon}
						className="size-[19px]"
					/>
				</motion.span>
			)}
			<span className="min-w-0 flex-1">
				<span className="block text-[14.5px] font-semibold leading-snug text-ink">
					{link.label}
				</span>
				{link.desc && (
					<span className="mt-0.5 block truncate text-[12.5px] leading-snug text-steel-500">
						{link.desc}
					</span>
				)}
			</span>
			<ArrowUpRight className="size-4 shrink-0 -translate-x-1 text-steel-300 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:text-corporate-600 group-hover/link:opacity-100" />
		</>
	);

	return (
		<motion.div
			variants={cardVariants}
			whileHover="hover">
			{link.external ?
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					onClick={onNavigate}
					className={className}>
					{inner}
				</a>
			:	<Link
					href={link.href}
					onClick={onNavigate}
					className={className}>
					{inner}
				</Link>
			}
		</motion.div>
	);
}

/* ----------------------------------------------------------------------- */
/* Morphing hamburger                                                       */
/* ----------------------------------------------------------------------- */

function MobileToggle({
	open,
	onClick,
	dark = false,
}: {
	open: boolean;
	onClick: () => void;
	dark?: boolean;
}) {
	// While the full-screen (dark) menu is open, always use the light-on-dark bars.
	const onDark = dark || open;
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={open ? "Close menu" : "Open menu"}
			aria-expanded={open}
			aria-controls="mobile-menu"
			className={cn(
				"relative z-[90] inline-flex size-11 items-center justify-center rounded-full border shadow-soft backdrop-blur transition-colors lg:hidden",
				onDark ?
					"border-white/25 bg-white/10 text-white hover:border-white/50"
				:	"border-steel-200 bg-white/80 text-ink hover:border-corporate-300",
			)}>
			<span className="relative block h-4 w-5">
				<motion.span
					className={cn(
						"absolute left-0 block h-[2px] w-5 rounded-full",
						onDark ? "bg-white" : "bg-ink",
					)}
					animate={open ? { top: 7, rotate: 45 } : { top: 2, rotate: 0 }}
					transition={{ duration: 0.3, ease: EASE }}
					style={{ top: 2 }}
				/>
				<motion.span
					className={cn(
						"absolute left-0 top-[7px] block h-[2px] w-5 rounded-full",
						onDark ? "bg-white" : "bg-ink",
					)}
					animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
					transition={{ duration: 0.2 }}
				/>
				<motion.span
					className={cn(
						"absolute left-0 block h-[2px] w-5 rounded-full",
						onDark ? "bg-white" : "bg-ink",
					)}
					animate={open ? { top: 7, rotate: -45 } : { top: 12, rotate: 0 }}
					transition={{ duration: 0.3, ease: EASE }}
					style={{ top: 12 }}
				/>
			</span>
		</button>
	);
}

/* ----------------------------------------------------------------------- */
/* Full-screen mobile menu                                                  */
/* ----------------------------------------------------------------------- */

const mobileContainer: Variants = {
	hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
	show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const mobileItem: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function MobileMenu({
	open,
	onClose,
	pathname,
}: {
	open: boolean;
	onClose: () => void;
	pathname: string;
}) {
	const reduce = usePrefersReducedMotion();
	const [expanded, setExpanded] = useState<string | null>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const returnFocusRef = useRef<HTMLElement | null>(null);

	// Modal semantics: move focus in, cycle Tab inside the drawer, close on Escape,
	// hand focus back to whatever opened it. The whole subtree is `lg:hidden` and the
	// effect only arms while `open`, so none of it can run against the desktop bar.
	useEffect(() => {
		if (!open) {
			returnFocusRef.current?.focus();
			returnFocusRef.current = null;
			return;
		}
		const node = panelRef.current;
		if (!node) return;

		returnFocusRef.current = document.activeElement as HTMLElement | null;

		const SELECTOR =
			'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const focusables = () =>
			Array.from(node.querySelectorAll<HTMLElement>(SELECTOR)).filter(
				(el) => el.offsetWidth > 0 || el.offsetHeight > 0,
			);

		focusables()[0]?.focus();

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onClose();
				return;
			}
			if (e.key !== "Tab") return;
			const items = focusables();
			if (items.length === 0) return;
			const first = items[0];
			const last = items[items.length - 1];
			const active = document.activeElement;
			if (e.shiftKey) {
				if (active === first || !node.contains(active)) {
					e.preventDefault();
					last.focus();
				}
			} else if (active === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [open, onClose]);

	return (
		<AnimatePresence onExitComplete={() => setExpanded(null)}>
			{open && (
				<motion.div
					id="mobile-menu"
					role="dialog"
					aria-modal="true"
					aria-label="Site menu"
					ref={panelRef}
					// Lenis grabs wheel/touch on the document and would scroll the page
					// behind the drawer instead of the drawer itself; `data-lenis-prevent`
					// hands the gesture back to native scrolling inside this container.
					data-lenis-prevent
					initial={{ clipPath: "circle(0% at calc(100% - 36px) 36px)" }}
					animate={{ clipPath: "circle(145% at calc(100% - 36px) 36px)" }}
					exit={{ clipPath: "circle(0% at calc(100% - 36px) 36px)" }}
					transition={
						reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
					}
					className="fixed inset-0 z-[85] overflow-y-auto overscroll-contain bg-ink lg:hidden">
					{/* animated background */}
					<div className="pointer-events-none absolute inset-0 bg-blueprint [background-size:40px_40px] opacity-[0.14]" />
					<motion.div
						aria-hidden
						className="pointer-events-none absolute -right-24 top-0 size-[460px] rounded-full bg-corporate-600/25 blur-3xl"
						animate={
							reduce ? undefined : (
								{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }
							)
						}
						transition={
							reduce ?
								{ duration: 0 }
							:	{ duration: 8, repeat: Infinity, ease: "easeInOut" }
						}
					/>
					<motion.div
						aria-hidden
						className="pointer-events-none absolute -left-20 bottom-10 size-[380px] rounded-full bg-corporate-500/15 blur-3xl"
						animate={reduce ? undefined : { scale: [1, 1.2, 1] }}
						transition={
							reduce ?
								{ duration: 0 }
							:	{ duration: 10, repeat: Infinity, ease: "easeInOut" }
						}
					/>

					{/* env() keeps the top row clear of the notch and the CTA clear of the
					    home indicator on iOS; both insets are 0 on every other device. */}
					<div className="container-x relative flex min-h-full flex-col pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] pt-[calc(1.5rem_+_env(safe-area-inset-top))]">
						<div className="flex items-center justify-between">
							<Logo className="[&_img]:brightness-0 [&_img]:invert" />
							{/* The header's MobileToggle is z-[90] and paints over this button,
							    ~5px above it at the same x, so their 44px hit areas overlapped and
							    a tap could land on either. `pointer-events-none` cedes every tap to
							    the toggle on top (both call the same close), leaving exactly one
							    touch target; the button stays focusable and Enter/Space still fire
							    it, which is what keeps a close control inside the focus trap. */}
							<button
								type="button"
								onClick={onClose}
								aria-label="Close menu"
								className="pointer-events-none inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
								<span className="relative block size-5">
									<span className="absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 rotate-45 rounded-full bg-white" />
									<span className="absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -rotate-45 rounded-full bg-white" />
								</span>
							</button>
						</div>

						<motion.nav
							variants={mobileContainer}
							initial="hidden"
							animate="show"
							exit="hidden"
							className="mt-8 flex-1">
							{nav.map((group) => {
								const cols =
									group.columns ??
									(group.links ?
										[{ heading: group.label, links: group.links }]
									:	[]);
								const active = isActiveGroup(group, pathname);

								if (cols.length === 0) {
									return (
										<motion.div
											key={group.label}
											variants={mobileItem}>
											<Link
												href={group.href!}
												onClick={onClose}
												className={cn(
													"block border-b border-white/10 py-4 font-display text-2xl font-semibold transition-colors",
													active ? "text-corporate-300" : "text-white",
												)}>
												{group.label}
											</Link>
										</motion.div>
									);
								}

								const isOpen = expanded === group.label;
								return (
									<motion.div
										key={group.label}
										variants={mobileItem}
										className="border-b border-white/10">
										<button
											type="button"
											onClick={() => setExpanded(isOpen ? null : group.label)}
											aria-expanded={isOpen}
											className="flex w-full items-center justify-between gap-3 py-4 text-left font-display text-2xl font-semibold text-white">
											{group.label}
											<ChevronDown
												className={cn(
													"size-5 shrink-0 text-corporate-300 transition-transform duration-300",
													isOpen && "rotate-180",
												)}
											/>
										</button>
										<AnimatePresence initial={false}>
											{isOpen && (
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.35, ease: EASE }}
													className="overflow-hidden">
													<div className="grid grid-cols-1 gap-1 pb-4 sm:grid-cols-2">
														{cols
															.flatMap((c) => c.links)
															.map((link) => {
																const linkClass =
																	"tap-target-h flex items-center gap-3 rounded-xl px-2 py-2.5 text-steel-300 transition-colors hover:bg-white/5 hover:text-white";
																const linkInner = (
																	<>
																		{link.icon && (
																			<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-corporate-200 ring-1 ring-white/10">
																				<Icon
																					name={link.icon}
																					className="size-[18px]"
																				/>
																			</span>
																		)}
																		<span className="text-[15px] font-medium">
																			{link.label}
																		</span>
																	</>
																);
																return link.external ?
																		<a
																			key={link.label}
																			href={link.href}
																			target="_blank"
																			rel="noopener noreferrer"
																			onClick={onClose}
																			className={linkClass}>
																			{linkInner}
																		</a>
																	:	<Link
																			key={link.label}
																			href={link.href}
																			onClick={onClose}
																			className={linkClass}>
																			{linkInner}
																		</Link>;
															})}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								);
							})}
						</motion.nav>

						{/* floating CTA */}
						<motion.div
							variants={mobileItem}
							initial="hidden"
							animate="show"
							className="mt-8">
							<ProposalCta full />
							<a
								href={`tel:${site.primaryPhoneRaw}`}
								className="mt-3 flex items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 text-sm font-medium text-white">
								Call {site.phones[0]}
							</a>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
