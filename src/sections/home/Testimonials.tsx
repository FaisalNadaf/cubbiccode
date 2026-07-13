/** @format */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowCard } from "@/components/ui/GlowCard";

// Embla API type, derived without importing the core package.
type EmblaApi = NonNullable<ReturnType<typeof useEmblaCarousel>[1]>;

const TWEEN_FACTOR_BASE = 0.42;
const clamp = (n: number, min: number, max: number) =>
	Math.min(Math.max(n, min), max);

export function Testimonials() {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{ loop: true, align: "center", containScroll: false },
		[Autoplay({ delay: 5000, stopOnInteraction: false })],
	);
	const [selected, setSelected] = useState(0);
	const tweenFactor = useRef(0);
	const tweenNodes = useRef<HTMLElement[]>([]);

	const setTweenNodes = useCallback((api: EmblaApi) => {
		tweenNodes.current = api
			.slideNodes()
			.map((node) => node.querySelector(".tween") as HTMLElement);
	}, []);

	const setTweenFactor = useCallback((api: EmblaApi) => {
		tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
	}, []);

	// Coverflow: scale + fade each slide by its distance from centre.
	const tweenCoverflow = useCallback((api: EmblaApi, eventName?: string) => {
		const engine = api.internalEngine();
		const scrollProgress = api.scrollProgress();
		const slidesInView = api.slidesInView();
		const isScroll = eventName === "scroll";

		api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
			let diffToTarget = scrollSnap - scrollProgress;
			const slidesInSnap = engine.slideRegistry[snapIndex];

			slidesInSnap.forEach((slideIndex) => {
				if (isScroll && !slidesInView.includes(slideIndex)) return;

				if (engine.options.loop) {
					engine.slideLooper.loopPoints.forEach((loopItem) => {
						const target = loopItem.target();
						if (slideIndex === loopItem.index && target !== 0) {
							const sign = Math.sign(target);
							if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
							if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
						}
					});
				}

				const raw = diffToTarget * tweenFactor.current; // signed distance from centre
				const dist = Math.abs(raw);
				const scale = clamp(1 - dist * 0.3, 0.82, 1);
				const translate = -raw * 38; // pull neighbours toward centre (% of slide width)
				const opacity = clamp(1 - dist * 0.85, 0.4, 1);
				const node = tweenNodes.current[slideIndex];
				if (node) {
					node.style.transform = `translateX(${translate}%) scale(${scale})`;
					node.style.opacity = `${opacity}`;
					// Centre card paints on top of the overlapping neighbours.
					const parent = node.parentElement;
					if (parent)
						parent.style.zIndex = `${Math.round(clamp(1 - dist, 0, 1) * 100)}`;
				}
			});
		});
	}, []);

	const onSelect = useCallback((api: EmblaApi) => {
		setSelected(api.selectedScrollSnap());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;
		setTweenNodes(emblaApi);
		setTweenFactor(emblaApi);
		tweenCoverflow(emblaApi);
		onSelect(emblaApi);

		emblaApi
			.on("reInit", setTweenNodes)
			.on("reInit", setTweenFactor)
			.on("reInit", tweenCoverflow)
			.on("scroll", tweenCoverflow)
			.on("slideFocus", tweenCoverflow)
			.on("select", onSelect)
			.on("reInit", onSelect);

		return () => {
			emblaApi
				.off("reInit", setTweenNodes)
				.off("reInit", setTweenFactor)
				.off("reInit", tweenCoverflow)
				.off("scroll", tweenCoverflow)
				.off("slideFocus", tweenCoverflow)
				.off("select", onSelect)
				.off("reInit", onSelect);
		};
	}, [emblaApi, setTweenNodes, setTweenFactor, tweenCoverflow, onSelect]);

	return (
		<section className="section relative overflow-hidden bg-canvas-soft">
			<div className="pointer-events-none absolute right-0 top-0 size-[480px] translate-x-1/3 rounded-full bg-corporate-50 blur-3xl" />
			<div className="container-x relative">
				<div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
					<SectionHeading
						kicker="What our clients say"
						title="Worth every rupee in their words"
						intro="Five-star reviews from the founders, doctors and business owners we've built for."
					/>
					<div className="flex gap-3">
						<button
							onClick={() => emblaApi?.scrollPrev()}
							aria-label="Previous"
							className="inline-flex size-12 items-center justify-center rounded-full border border-steel-300 bg-white text-ink transition-colors hover:border-ink">
							<ArrowLeft className="size-5" />
						</button>
						<button
							onClick={() => emblaApi?.scrollNext()}
							aria-label="Next"
							className="inline-flex size-12 items-center justify-center rounded-full border border-steel-300 bg-white text-ink transition-colors hover:border-ink">
							<ArrowRight className="size-5" />
						</button>
					</div>
				</div>

				{/* Coverflow viewport */}
				<div
					className="mt-12 overflow-hidden"
					ref={emblaRef}>
					{/* Embla sets no touch-action of its own and preventDefaults touchmove,
					    so without this its horizontal drag fights native vertical scrolling
					    on iOS. pinch-zoom is kept so the page stays zoomable. */}
					<div className="flex touch-pan-y touch-pinch-zoom">
						{testimonials.map((t, i) => (
							<div
								key={t.name}
								className="relative min-w-0 shrink-0 grow-0 basis-[80%] px-2 sm:basis-[56%] sm:px-2.5 lg:basis-[40%]">
								<div className="tween h-full will-change-transform">
									<GlowCard className="h-full rounded-4xl">
										<figure
											data-active={selected === i}
											className="flex h-full flex-col rounded-4xl border border-steel-200 bg-white p-7 shadow-soft transition-shadow duration-300 data-[active=true]:shadow-lift lg:p-8">
											<div className="flex items-center justify-between">
												<div className="flex gap-0.5">
													{Array.from({ length: t.rating }).map((_, s) => (
														<Star
															key={s}
															className="size-4 fill-amber-400 text-amber-400"
														/>
													))}
												</div>
												<Quote className="size-9 text-steel-200" />
											</div>
											<blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-steel-700">
												“{t.quote}”
											</blockquote>
											<figcaption className="mt-7 flex items-center gap-3 border-t border-steel-100 pt-5">
												<Image
													src={t.photo}
													alt={t.name}
													width={48}
													height={48}
													className="size-12 rounded-full border border-steel-200 object-cover"
												/>
												<div>
													<div className="text-sm font-semibold text-ink">
														{t.name}
													</div>
													<div className="text-[12.5px] text-steel-500">
														{t.role}
													</div>
												</div>
											</figcaption>
										</figure>
									</GlowCard>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Dots */}
				<div className="mt-8 flex justify-center gap-2">
					{testimonials.map((_, i) => (
						<button
							key={i}
							onClick={() => emblaApi?.scrollTo(i)}
							aria-label={`Go to testimonial ${i + 1}`}
							className={`h-1.5 rounded-full transition-all ${
								selected === i ? "w-8 bg-corporate-600" : "w-2.5 bg-steel-300"
							}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
