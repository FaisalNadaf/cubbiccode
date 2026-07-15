/**
 * Designed & Developed by Faisal Nadaf
 * Email : faisalfnadaf@gmail.com
 *
 * @format
 */

import fs from "node:fs";
import path from "node:path";
import { Move3d } from "lucide-react";
import DomeGallery from "@/components/DomeGallery";
import { PageHero } from "@/components/layout/PageHero";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/content/seo";

export const metadata = buildMetadata(pageSeo.gallery);

/**
 * The sphere is built at build time from two folders under /public/images:
 * `Moments` (the primary store) and the studio photoshoot in `Headerimages`
 * whose frames also serve as page heroes. Drop a new photo into either and it
 * joins the sphere on the next build, with nothing to wire up.
 *
 * Neither folder is purely photographic. `Moments` doubles as the store for the
 * certificate scans and press cuttings the achievements page points at, and
 * `Headerimages` holds section banners, UI screenshots and a promo graphic.
 * Those are not "moments" — a grayscale certificate or a screenshot spinning
 * past on the sphere reads as a mistake — so they are named out below rather
 * than filtered by a guess at the filename.
 */
const NOT_A_PHOTO = new Set([
	// /images/Moments — press cuttings, certificate scans, a backdrop texture.
	"paper.jpg", // Times of India cutting
	"brandcounselling1.jpg",
	"business-excellence-certificate1.jpg",
	"india-excellence-award-certificate1.jpg",
	"EducationalE.jpg",
	"award-bg.jpg", // a backdrop texture, not a moment
	// /images/Headerimages — hero and section banners already shown as headers
	// across the site, UI screenshots, and a promo graphic.
	"ansdjad.JPG", // this page's own hero
	"founders.JPG",
	"culture.JPG",
	"acchiveements.JPG",
	"joinuscareer.JPG",
	"x3.jpg.jpeg",
	"Screenshot 2026-07-14 211158.png",
	"Screenshot 2026-07-14 211433.png",
	"Screenshot 2026-07-14 230346.png",
]);

const PHOTO_EXT = /\.(jpe?g|png|webp|avif)$/i;

// Windows "Name - Copy.ext" duplicates that were left in the folders.
const IS_DUPLICATE = / - Copy\.\w+$/i;

const PHOTO_DIRS = ["Moments", "Headerimages"];

function readPhotos(folder: string): string[] {
	const dir = path.join(process.cwd(), "public", "images", folder);
	return fs
		.readdirSync(dir)
		.filter(
			(f) => PHOTO_EXT.test(f) && !NOT_A_PHOTO.has(f) && !IS_DUPLICATE.test(f),
		)
		.map((f) => `/images/${folder}/${f}`);
}

function getMoments(): string[] {
	// Keyed by filename so a photo that ever lands in both folders is shown once.
	const seen = new Set<string>();
	return PHOTO_DIRS.flatMap(readPhotos)
		.filter((src) => {
			const name = src.slice(src.lastIndexOf("/") + 1).toLowerCase();
			if (seen.has(name)) return false;
			seen.add(name);
			return true;
		})
		.sort();
}

export default function PhotoGalleryPage() {
	const photos = getMoments().map((src) => ({
		src,
		alt: "A moment from life at Cubiccode Digital Media LLP",
	}));

	return (
		<>
			<PageHero
				kicker="Photo gallery"
				title="Nearly a decade, in photographs."
				subtitle="The team, the milestones, the award nights and the community we have built around us  drag the sphere to look around, and click any photo to open it."
				image="/images/Headerimages/ansdjad.JPG"
				imageAlt="The Cubiccode team at work in the studio"
				breadcrumb={[
					{ label: "Home", href: "/" },
					{ label: "Who We Are", href: routes.about },
					{ label: "Photo Gallery" },
				]}
			/>

			{/* The sphere is sized by its parent (`w-full h-full`), so the height has
			    to be given here. `svh`, not `vh`: on mobile Safari `vh` measures the
			    viewport with the URL bar hidden, which would push the sphere's lower
			    third under the browser chrome. `min-h` keeps it usable on a short
			    laptop window, where 92svh alone would squeeze it to a strip. */}
			<section className="relative h-[92svh] min-h-[620px] w-full overflow-hidden bg-ink">
				<h2 className="sr-only">Photographs from life at Cubiccode</h2>

				{/* Depth behind the sphere. Both sit under the dome's own vignette,
				    which fades to `--overlay-blur-color` — set to the same #0B1B3A as
				    `bg-ink`, so the sphere's edges dissolve into the section instead of
				    ending on a visible rim. */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.14] [background-size:40px_40px]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-1/2 size-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corporate-500/20 blur-[120px]"
				/>

				<DomeGallery
					images={photos}
					// `fit` is the sphere's radius as a fraction of its basis, and the
					// default 0.5 built a sphere half the viewport wide — it floated in
					// the middle with dead space either side. Pinned to `width` (rather
					// than `auto`, which switches basis on aspect ratio and makes the
					// sphere jump between portrait and landscape windows) and opened up
					// so the dome runs edge to edge.
					fit={0.85}
					fitBasis="width"
					minRadius={700}
					// The default 0.25 reserved a quarter of the short side as padding
					// around the stage — the other half of the empty margin.
					padFactor={0.06}
					grayscale={false}
					overlayBlurColor="#0B1B3A"
					imageBorderRadius="16px"
					openedImageBorderRadius="20px"
					openedImageWidth="min(560px, 78vw)"
					openedImageHeight="min(560px, 62vh)"
				/>

				{/* The sphere gives no hint that it is draggable, and a visitor who does
				    not try will think it is a static collage. */}
				<div className="pointer-events-none absolute inset-x-0 bottom-6 z-[6] flex justify-center px-6">
					<span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-[13px] font-medium text-white/90 shadow-lift backdrop-blur-md">
						<Move3d className="size-4 text-corporate-200" />
						Drag to spin
						<span
							aria-hidden
							className="h-3.5 w-px bg-white/25"
						/>
						Click a photo to open it
					</span>
				</div>
			</section>
		</>
	);
}
