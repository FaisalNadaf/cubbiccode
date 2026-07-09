/** @format */

"use client";

/** Loading placeholder shown until a chart has measured its container width. */
export function ChartSkeleton({
	height,
	rounded = "rounded-2xl",
}: {
	height: number;
	rounded?: string;
}) {
	return (
		<div
			aria-hidden
			className={`relative w-full overflow-hidden bg-steel-100/70 ${rounded}`}
			style={{ height }}>
			<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
		</div>
	);
}
