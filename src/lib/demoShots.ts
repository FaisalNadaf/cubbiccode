/** @format */

/**
 * Generic dashboard screenshots used as stand-ins on work cards we have no real
 * shot of yet, in place of the branded placeholder art.
 *
 * The files ship with a space in the name (`dashboard 1.webp`), so the paths are
 * pre-encoded here — they're handed straight to an <img src>.
 */
export const DEMO_DASHBOARDS = Array.from(
	{ length: 15 },
	(_, i) => `/images/demoDashboard/dashboard%20${i + 1}.webp`,
);

/** Stable string hash — same seed always yields the same offset, so the server
 *  and client render the identical fan and hydration stays clean. */
function seedOffset(seed: string, mod: number): number {
	if (mod <= 0) return 0;
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
	return h % mod;
}

/**
 * Gives every shot-less item a demo dashboard, walking the pool one step at a
 * time so no two cards in the same list land on the same image (the longest
 * list has 9 blanks against a pool of 15).
 *
 * `seed` rotates the starting point: web-application-development and custom-erp
 * render the *same* `webApps` list, so without it the two pages would fan out an
 * identical set of dashboards. Items that already carry a real screenshot are
 * returned untouched.
 */
export function withDemoShots<T extends { image?: string }>(
	items: T[],
	seed: string,
): T[] {
	const start = seedOffset(seed, DEMO_DASHBOARDS.length);
	let taken = 0;

	return items.map((item) =>
		item.image ? item : (
			{
				...item,
				image: DEMO_DASHBOARDS[(start + taken++) % DEMO_DASHBOARDS.length],
			}
		),
	);
}
