/** @format */

"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useChartSize } from "./useChartSize";
import { EASE_OUT, smoothPath } from "./theme";

/**
 * Minimal trend sparkline (no axes/labels) for KPI tiles and the aggregate band.
 * `color` is a raw hex so callers pass a light-surface or on-dark step directly.
 * Draws via a deterministic left→right clip wipe (SSR-safe, no getTotalLength).
 */
export function Sparkline({
	data,
	color,
	height = 44,
	strokeWidth = 2,
	fill = true,
}: {
	data: number[];
	color: string;
	height?: number;
	strokeWidth?: number;
	fill?: boolean;
}) {
	const { ref, width, inView } = useChartSize();
	const reduce = useReducedMotion();
	const uid = useId().replace(/:/g, "");

	const n = data.length;
	const padY = 4;
	const min = Math.min(...data);
	const max = Math.max(...data);
	const span = max - min || 1;
	const x = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * width);
	const y = (v: number) => padY + (height - padY * 2) * (1 - (v - min) / span);

	const coords = data.map((v, i) => ({ x: x(i), y: y(v) }));
	const line = smoothPath(coords);
	const area =
		coords.length > 0
			? `${line} L ${coords[n - 1].x} ${height} L ${coords[0].x} ${height} Z`
			: "";
	const last = coords[n - 1];

	return (
		<div
			ref={ref}
			className="w-full"
			style={{ height }}>
			{width > 0 && (
				<svg
					width={width}
					height={height}
					className="block overflow-visible"
					aria-hidden>
					<defs>
						<linearGradient id={`${uid}f`} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={color} stopOpacity={0.24} />
							<stop offset="100%" stopColor={color} stopOpacity={0} />
						</linearGradient>
						<clipPath id={`${uid}c`}>
							<motion.rect
								x={0}
								y={0}
								height={height}
								initial={{ width: reduce ? width : 0 }}
								animate={{ width: inView || reduce ? width : 0 }}
								transition={{ duration: 0.9, ease: EASE_OUT }}
							/>
						</clipPath>
					</defs>
					<g clipPath={`url(#${uid}c)`}>
						{fill && <path d={area} fill={`url(#${uid}f)`} />}
						<path
							d={line}
							fill="none"
							stroke={color}
							strokeWidth={strokeWidth}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						{last && (
							<circle
								cx={last.x}
								cy={last.y}
								r={strokeWidth + 1}
								fill={color}
							/>
						)}
					</g>
				</svg>
			)}
		</div>
	);
}
