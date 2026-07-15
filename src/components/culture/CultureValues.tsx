/** @format */

import Image from "next/image";
import { values } from "@/content/company";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * The twelve principles, shown as the printed plates themselves — the same wall
 * that hangs in the Belagavi office, four across and three down.
 *
 * The plates are square (1800×1800) and carry their own dark background, so a
 * square tile with `object-cover` fits them exactly: nothing is cropped and no
 * bands open up around them.
 *
 * The wording lives in `content/company.ts` alongside each plate and goes into
 * the `alt` text, so what the plate says is still available to a screen reader
 * and to a crawler that cannot read a JPEG.
 *
 * Twelve plates ÷ 4 columns is exactly three full rows. A thirteenth value would
 * strand a card on a short row — keep the list a multiple of four.
 */
export function CultureValues() {
	return (
		<RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
			{values.map((v, i) => (
				<RevealItem key={v.title}>
					<figure className="group relative aspect-square overflow-hidden rounded-2xl bg-ink shadow-lift ring-1 ring-white/5 transition-transform duration-300 hover:-translate-y-1">
						<Image
							src={v.plate}
							alt={`${v.title} — ${v.text}`}
							fill
							// 4-up at lg, 2-up at sm, full width below — so the browser never
							// fetches a 1800px plate to paint a 300px tile.
							sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
							priority={i < 4} // the first row is above the fold on a wide screen
							className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						/>
					</figure>
				</RevealItem>
			))}
		</RevealGroup>
	);
}
