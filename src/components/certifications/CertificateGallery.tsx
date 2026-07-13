/** @format */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
	BadgeCheck,
	Maximize2,
	X,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { certificateImages } from "@/content/company";
import { cn } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const total = certificateImages.length;

/**
 * Certificate gallery  a bold card grid where each certificate opens in a
 * lightbox showing the full scan. Keyboard-driven (Esc to close, ←/→ to page),
 * click-outside to dismiss, body-scroll locked while open. Honours reduced
 * motion. Card thumbnails crop to a uniform frame; the modal shows the whole
 * document (object-contain).
 */
export function CertificateGallery() {
	const reduce = useReducedMotion();
	const [index, setIndex] = useState<number | null>(null);
	const [mounted, setMounted] = useState(false);

	const open = index !== null;
	const current = open ? certificateImages[index] : null;

	const close = useCallback(() => setIndex(null), []);
	const prev = useCallback(
		() => setIndex((i) => (i === null ? i : (i - 1 + total) % total)),
		[],
	);
	const next = useCallback(
		() => setIndex((i) => (i === null ? i : (i + 1) % total)),
		[],
	);

	useEffect(() => setMounted(true), []);

	// Keyboard controls + body-scroll lock while the lightbox is open.
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
			else if (e.key === "ArrowLeft") prev();
			else if (e.key === "ArrowRight") next();
		};
		document.addEventListener("keydown", onKey);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		// `overflow: hidden` does not actually hold the page still on either pointer:
		// Lenis drives the document with *programmatic* scrolls, which ignore overflow
		// entirely, and iOS Safari scrolls behind a modal regardless. So swallow the
		// gestures at the source, exactly as the preloader's scroll lock does — a
		// capture-phase listener runs before Lenis's bubble-phase handler, so
		// `preventDefault` blocks native scroll and `stopPropagation` keeps Lenis from
		// ever seeing the event. `passive: false` is what makes `preventDefault`
		// binding on iOS. overflow:hidden stays as the secondary keyboard/scrollbar
		// guard.
		const blockWheel = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
		};
		// Multi-touch is let through so the scan can still be pinch-zoomed.
		const blockTouch = (e: TouchEvent) => {
			if (e.touches.length > 1) return;
			e.preventDefault();
			e.stopPropagation();
		};
		const opts = { capture: true, passive: false } as const;
		window.addEventListener("wheel", blockWheel, opts);
		window.addEventListener("touchmove", blockTouch, opts);

		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
			window.removeEventListener("wheel", blockWheel, opts);
			window.removeEventListener("touchmove", blockTouch, opts);
		};
	}, [open, close, prev, next]);

	return (
		<>
			{/* ── Card grid ── */}
			<div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{certificateImages.map((c, i) => (
					<motion.button
						key={c.src}
						type="button"
						onClick={() => setIndex(i)}
						initial={{ opacity: 0, y: reduce ? 0 : 26 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.55, delay: (i % 4) * 0.08, ease: EASE }}
						className="group relative flex flex-col overflow-hidden rounded-3xl border border-steel-200 bg-white text-left shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-corporate-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft">
						{/* Thumbnail */}
						<div className="relative aspect-[4/5] overflow-hidden bg-canvas-soft">
							<Image
								src={c.src}
								alt={c.title}
								fill
								sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
								className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-transparent" />
							{/* Hover affordance */}
							<div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/35">
								<span className="flex translate-y-2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
									<Maximize2 className="size-4 text-corporate-600" />
									View certificate
								</span>
							</div>
						</div>

						{/* Content */}
						<div className="flex flex-1 flex-col p-5">
							<div className="flex items-center justify-between gap-2">
								<span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-corporate-600">
									{c.agency}
								</span>
								<BadgeCheck className="size-5 shrink-0 text-corporate-600" />
							</div>
							<h3 className="mt-2 text-pretty text-base font-semibold leading-snug text-ink">
								{c.title}
							</h3>
							<p className="mt-2 text-[13px] leading-relaxed text-steel-500 line-clamp-2">
								{c.description}
							</p>
							<div className="mt-4 h-[3px] w-9 rounded-full bg-gradient-to-r from-corporate-600 to-corporate-300 transition-all duration-500 group-hover:w-16" />
						</div>
					</motion.button>
				))}
			</div>

			{/* ── Lightbox ── */}
			{mounted &&
				createPortal(
					<AnimatePresence>
						{open && current && (
							<Lightbox
								key="cert-lightbox"
								current={current}
								index={index as number}
								reduce={!!reduce}
								onClose={close}
								onPrev={prev}
								onNext={next}
							/>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</>
	);
}

function Lightbox({
	current,
	index,
	reduce,
	onClose,
	onPrev,
	onNext,
}: {
	current: (typeof certificateImages)[number];
	index: number;
	reduce: boolean;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
}) {
	const closeRef = useRef<HTMLButtonElement>(null);

	// Move focus into the dialog on open.
	useEffect(() => {
		closeRef.current?.focus();
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-label={`${current.title}  certificate`}
			className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm sm:p-8">
			{/* Prev / Next */}
			<NavButton
				side="left"
				onClick={onPrev}
			/>
			<NavButton
				side="right"
				onClick={onNext}
			/>

			{/* Panel */}
			<motion.div
				initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 14 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 10 }}
				transition={{ duration: 0.3, ease: EASE }}
				onClick={(e) => e.stopPropagation()}
				// `90vh` measures the URL-bar-hidden viewport on mobile Safari, so the
				// panel's footer sits below the fold while the bar is showing. `dvh`
				// tracks the visible viewport; it is scoped under lg (where the two are
				// equal anyway) and leaves `h-[90vh]` standing as the fallback for
				// engines without `dvh`.
				className="relative flex h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl max-lg:h-[90dvh]">
				{/* Header */}
				<div className="flex items-start justify-between gap-4 border-b border-steel-200 px-6 py-4">
					<div className="min-w-0">
						<h3 className="truncate text-lg font-semibold text-ink">
							{current.title}
						</h3>
						<p className="mt-0.5 text-[11.5px] font-semibold uppercase tracking-[0.15em] text-corporate-600">
							{current.agency}
						</p>
					</div>
					<button
						ref={closeRef}
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="flex size-9 shrink-0 items-center justify-center rounded-full border border-steel-200 bg-white text-steel-600 transition-colors hover:bg-canvas-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500">
						<X className="size-5" />
					</button>
				</div>

				{/* Image */}
				<div className="relative min-h-0 w-full flex-1 bg-canvas-soft">
					<Image
						src={current.src}
						alt={current.title}
						fill
						sizes="(min-width: 640px) 576px, 100vw"
						className="object-contain p-4"
					/>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between gap-4 border-t border-steel-200 px-6 py-3">
					<p className="hidden truncate text-[12.5px] leading-relaxed text-steel-500 sm:block">
						{current.description}
					</p>
					<span className="shrink-0 text-[12px] font-semibold tabular-nums text-steel-400">
						{index + 1} / {total}
					</span>
				</div>
			</motion.div>
		</motion.div>
	);
}

function NavButton({
	side,
	onClick,
}: {
	side: "left" | "right";
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			aria-label={side === "left" ? "Previous certificate" : "Next certificate"}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
			className={cn(
				"absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-all hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corporate-500",
				side === "left" ? "left-3 sm:left-6" : "right-3 sm:right-6",
			)}>
			{side === "left" ?
				<ChevronLeft className="size-5" />
			:	<ChevronRight className="size-5" />}
		</button>
	);
}
