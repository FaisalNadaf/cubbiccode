/**
 * MagicBento  light-theme, data-driven adaptation.
 * Ported from the original MagicBento (GSAP spotlight / border-glow / particles /
 * tilt / magnetism / click-ripple) but re-skinned for a white/light UI and fed
 * its logos via props instead of a hardcoded list.
 *
 * @format
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";

export interface LogoItem {
	src: string;
	alt: string;
}

export interface MagicBentoProps {
	images: LogoItem[];
	/** Indices rendered as big, full-colour highlight tiles (e.g. a feature row). */
	colorfulIndices?: number[];
	enableStars?: boolean;
	enableSpotlight?: boolean;
	enableBorderGlow?: boolean;
	disableAnimations?: boolean;
	spotlightRadius?: number;
	particleCount?: number;
	enableTilt?: boolean;
	glowColor?: string; // "r, g, b"
	clickEffect?: boolean;
	enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 260;
const DEFAULT_GLOW_COLOR = "27, 110, 194"; // corporate blue (light-friendly)
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (
	x: number,
	y: number,
	color: string = DEFAULT_GLOW_COLOR,
): HTMLDivElement => {
	const el = document.createElement("div");
	el.className = "particle";
	el.style.cssText = `
    position: absolute;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px; top: ${y}px;
  `;
	return el;
};

const calculateSpotlightValues = (radius: number) => ({
	proximity: radius * 0.5,
	fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
	card: HTMLElement,
	mouseX: number,
	mouseY: number,
	glow: number,
	radius: number,
) => {
	const rect = card.getBoundingClientRect();
	const relativeX = ((mouseX - rect.left) / rect.width) * 100;
	const relativeY = ((mouseY - rect.top) / rect.height) * 100;
	card.style.setProperty("--glow-x", `${relativeX}%`);
	card.style.setProperty("--glow-y", `${relativeY}%`);
	card.style.setProperty("--glow-intensity", glow.toString());
	card.style.setProperty("--glow-radius", `${radius}px`);
};

/* ── card with hover particles + tilt/magnetism/click ──────────────────── */

const ParticleCard: React.FC<{
	children: React.ReactNode;
	className?: string;
	disableAnimations?: boolean;
	style?: React.CSSProperties;
	particleCount?: number;
	glowColor?: string;
	enableTilt?: boolean;
	clickEffect?: boolean;
	enableMagnetism?: boolean;
}> = ({
	children,
	className = "",
	disableAnimations = false,
	style,
	particleCount = DEFAULT_PARTICLE_COUNT,
	glowColor = DEFAULT_GLOW_COLOR,
	enableTilt = false,
	clickEffect = true,
	enableMagnetism = true,
}) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const particlesRef = useRef<HTMLDivElement[]>([]);
	const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const isHoveredRef = useRef(false);
	const memoizedParticles = useRef<HTMLDivElement[]>([]);
	const particlesInitialized = useRef(false);
	const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

	const initializeParticles = useCallback(() => {
		if (particlesInitialized.current || !cardRef.current) return;
		const { width, height } = cardRef.current.getBoundingClientRect();
		memoizedParticles.current = Array.from({ length: particleCount }, () =>
			createParticleElement(
				Math.random() * width,
				Math.random() * height,
				glowColor,
			),
		);
		particlesInitialized.current = true;
	}, [particleCount, glowColor]);

	const clearAllParticles = useCallback(() => {
		timeoutsRef.current.forEach(clearTimeout);
		timeoutsRef.current = [];
		magnetismAnimationRef.current?.kill();
		particlesRef.current.forEach((particle) => {
			gsap.to(particle, {
				scale: 0,
				opacity: 0,
				duration: 0.3,
				ease: "back.in(1.7)",
				onComplete: () => particle.parentNode?.removeChild(particle),
			});
		});
		particlesRef.current = [];
	}, []);

	const animateParticles = useCallback(() => {
		if (!cardRef.current || !isHoveredRef.current) return;
		if (!particlesInitialized.current) initializeParticles();

		memoizedParticles.current.forEach((particle, index) => {
			const timeoutId = setTimeout(() => {
				if (!isHoveredRef.current || !cardRef.current) return;
				const clone = particle.cloneNode(true) as HTMLDivElement;
				cardRef.current.appendChild(clone);
				particlesRef.current.push(clone);

				gsap.fromTo(
					clone,
					{ scale: 0, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
				);
				gsap.to(clone, {
					x: (Math.random() - 0.5) * 100,
					y: (Math.random() - 0.5) * 100,
					rotation: Math.random() * 360,
					duration: 2 + Math.random() * 2,
					ease: "none",
					repeat: -1,
					yoyo: true,
				});
				gsap.to(clone, {
					opacity: 0.3,
					duration: 1.5,
					ease: "power2.inOut",
					repeat: -1,
					yoyo: true,
				});
			}, index * 100);
			timeoutsRef.current.push(timeoutId);
		});
	}, [initializeParticles]);

	useEffect(() => {
		if (disableAnimations || !cardRef.current) return;
		const element = cardRef.current;

		const handleMouseEnter = () => {
			isHoveredRef.current = true;
			animateParticles();
			if (enableTilt) {
				gsap.to(element, {
					rotateX: 5,
					rotateY: 5,
					duration: 0.3,
					ease: "power2.out",
					transformPerspective: 1000,
				});
			}
		};
		const handleMouseLeave = () => {
			isHoveredRef.current = false;
			clearAllParticles();
			if (enableTilt) {
				gsap.to(element, {
					rotateX: 0,
					rotateY: 0,
					duration: 0.3,
					ease: "power2.out",
				});
			}
			if (enableMagnetism) {
				gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
			}
		};
		const handleMouseMove = (e: MouseEvent) => {
			if (!enableTilt && !enableMagnetism) return;
			const rect = element.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			if (enableTilt) {
				const rotateX = ((y - centerY) / centerY) * -8;
				const rotateY = ((x - centerX) / centerX) * 8;
				gsap.to(element, {
					rotateX,
					rotateY,
					duration: 0.1,
					ease: "power2.out",
					transformPerspective: 1000,
				});
			}
			if (enableMagnetism) {
				const magnetX = (x - centerX) * 0.04;
				const magnetY = (y - centerY) * 0.04;
				magnetismAnimationRef.current = gsap.to(element, {
					x: magnetX,
					y: magnetY,
					duration: 0.3,
					ease: "power2.out",
				});
			}
		};
		const handleClick = (e: MouseEvent) => {
			if (!clickEffect) return;
			const rect = element.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const maxDistance = Math.max(
				Math.hypot(x, y),
				Math.hypot(x - rect.width, y),
				Math.hypot(x, y - rect.height),
				Math.hypot(x - rect.width, y - rect.height),
			);
			const ripple = document.createElement("div");
			ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px; height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.18) 30%, transparent 70%);
        left: ${x - maxDistance}px; top: ${y - maxDistance}px;
        pointer-events: none; z-index: 1000;
      `;
			element.appendChild(ripple);
			gsap.fromTo(
				ripple,
				{ scale: 0, opacity: 1 },
				{
					scale: 1,
					opacity: 0,
					duration: 0.8,
					ease: "power2.out",
					onComplete: () => ripple.remove(),
				},
			);
		};

		element.addEventListener("mouseenter", handleMouseEnter);
		element.addEventListener("mouseleave", handleMouseLeave);
		element.addEventListener("mousemove", handleMouseMove);
		element.addEventListener("click", handleClick);
		return () => {
			isHoveredRef.current = false;
			element.removeEventListener("mouseenter", handleMouseEnter);
			element.removeEventListener("mouseleave", handleMouseLeave);
			element.removeEventListener("mousemove", handleMouseMove);
			element.removeEventListener("click", handleClick);
			clearAllParticles();
		};
	}, [
		animateParticles,
		clearAllParticles,
		disableAnimations,
		enableTilt,
		enableMagnetism,
		clickEffect,
		glowColor,
	]);

	return (
		<div
			ref={cardRef}
			className={`${className} relative overflow-hidden`}
			style={{ ...style, position: "relative", overflow: "hidden" }}>
			{children}
		</div>
	);
};

/* ── the mouse-following global spotlight ──────────────────────────────── */

const GlobalSpotlight: React.FC<{
	gridRef: React.RefObject<HTMLDivElement | null>;
	disableAnimations?: boolean;
	enabled?: boolean;
	spotlightRadius?: number;
	glowColor?: string;
}> = ({
	gridRef,
	disableAnimations = false,
	enabled = true,
	spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
	glowColor = DEFAULT_GLOW_COLOR,
}) => {
	const spotlightRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (disableAnimations || !gridRef?.current || !enabled) return;

		const spotlight = document.createElement("div");
		spotlight.className = "global-spotlight";
		spotlight.style.cssText = `
      position: fixed;
      width: 760px; height: 760px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.07) 20%,
        rgba(${glowColor}, 0.03) 40%,
        transparent 68%
      );
      z-index: 3; opacity: 0;
      transform: translate(-50%, -50%);
    `;
		document.body.appendChild(spotlight);
		spotlightRef.current = spotlight;

		const handleMouseMove = (e: MouseEvent) => {
			if (!spotlightRef.current || !gridRef.current) return;
			const section = gridRef.current.closest(".bento-section");
			const rect = section?.getBoundingClientRect();
			const inside =
				rect &&
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom;

			const cards = gridRef.current.querySelectorAll(".card");
			if (!inside) {
				gsap.to(spotlightRef.current, {
					opacity: 0,
					duration: 0.3,
					ease: "power2.out",
				});
				cards.forEach((c) =>
					(c as HTMLElement).style.setProperty("--glow-intensity", "0"),
				);
				return;
			}

			const { proximity, fadeDistance } =
				calculateSpotlightValues(spotlightRadius);
			let minDistance = Infinity;
			cards.forEach((card) => {
				const el = card as HTMLElement;
				const r = el.getBoundingClientRect();
				const cx = r.left + r.width / 2;
				const cy = r.top + r.height / 2;
				const distance =
					Math.hypot(e.clientX - cx, e.clientY - cy) -
					Math.max(r.width, r.height) / 2;
				const eff = Math.max(0, distance);
				minDistance = Math.min(minDistance, eff);
				let intensity = 0;
				if (eff <= proximity) intensity = 1;
				else if (eff <= fadeDistance)
					intensity = (fadeDistance - eff) / (fadeDistance - proximity);
				updateCardGlowProperties(
					el,
					e.clientX,
					e.clientY,
					intensity,
					spotlightRadius,
				);
			});

			gsap.to(spotlightRef.current, {
				left: e.clientX,
				top: e.clientY,
				duration: 0.1,
				ease: "power2.out",
			});
			const targetOpacity =
				minDistance <= proximity ? 0.8
				: minDistance <= fadeDistance ?
					((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
				:	0;
			gsap.to(spotlightRef.current, {
				opacity: targetOpacity,
				duration: targetOpacity > 0 ? 0.2 : 0.5,
				ease: "power2.out",
			});
		};

		const handleMouseLeave = () => {
			gridRef.current
				?.querySelectorAll(".card")
				.forEach((c) =>
					(c as HTMLElement).style.setProperty("--glow-intensity", "0"),
				);
			if (spotlightRef.current)
				gsap.to(spotlightRef.current, {
					opacity: 0,
					duration: 0.3,
					ease: "power2.out",
				});
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseleave", handleMouseLeave);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
		};
	}, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

	return null;
};

const useMobileDetection = () => {
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return isMobile;
};

/* ── the grid ──────────────────────────────────────────────────────────── */

export default function MagicBento({
	images,
	enableStars = true,
	enableSpotlight = true,
	enableBorderGlow = true,
	disableAnimations = false,
	spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
	particleCount = DEFAULT_PARTICLE_COUNT,
	enableTilt = false,
	glowColor = DEFAULT_GLOW_COLOR,
	clickEffect = true,
	enableMagnetism = true,
}: MagicBentoProps) {
	const gridRef = useRef<HTMLDivElement>(null);
	const isMobile = useMobileDetection();
	const shouldDisable = disableAnimations || isMobile;

	const baseClassName = `card group relative flex w-full overflow-hidden rounded-[20px] border border-solid transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(27,110,194,0.4)] ${
		enableBorderGlow ? "card--border-glow" : ""
	}`;

	return (
		<>
			<style>
				{`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 220px;
            --glow-color: ${glowColor};
            --border-color: rgba(15, 23, 42, 0.08);
            --card-bg: #ffffff;
          }
          .card-responsive {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
            width: 100%;
            margin: 0 auto;
          }
          @media (min-width: 640px) { .card-responsive { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
          @media (min-width: 1024px) { .card-responsive { grid-template-columns: repeat(5, minmax(0, 1fr)); } }

          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          .card--border-glow:hover {
            box-shadow: 0 8px 30px -12px rgba(27, 110, 194, 0.35), 0 0 24px rgba(${glowColor}, 0.15);
          }
          .particle::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
        `}
			</style>

			{enableSpotlight && (
				<GlobalSpotlight
					gridRef={gridRef}
					disableAnimations={shouldDisable}
					enabled={enableSpotlight}
					spotlightRadius={spotlightRadius}
					glowColor={glowColor}
				/>
			)}

			<div
				className="bento-section relative w-full select-none"
				ref={gridRef}
				style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)" }}>
				<div className="card-responsive">
					{images.map((card, i) => {
						const cardStyle = {
							backgroundColor: "var(--card-bg)",
							borderColor: "var(--border-color)",
							"--glow-x": "50%",
							"--glow-y": "50%",
							"--glow-intensity": "0",
							"--glow-radius": "220px",
						} as React.CSSProperties;

						const cardClass = baseClassName;

						// Every tile: same size, full colour (no grayscale).
						const inner = (
							<div className="aspect-[16/10] w-full">
								<div className="flex h-full w-full items-center justify-center bg-white p-6">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={card.src}
										alt={card.alt}
										loading="lazy"
										className="h-full w-full max-h-[84px] object-contain opacity-100 transition duration-300"
									/>
								</div>
							</div>
						);

						if (enableStars) {
							return (
								<ParticleCard
									key={i}
									className={cardClass}
									style={cardStyle}
									disableAnimations={shouldDisable}
									particleCount={particleCount}
									glowColor={glowColor}
									enableTilt={enableTilt}
									clickEffect={clickEffect}
									enableMagnetism={enableMagnetism}>
									{inner}
								</ParticleCard>
							);
						}

						return (
							<div
								key={i}
								className={cardClass}
								style={cardStyle}>
								{inner}
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
