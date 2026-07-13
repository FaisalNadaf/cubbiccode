/** @format */

import { Button } from "@/components/ui/Button";

export default function NotFound() {
	// `vh` resolves against the *large* viewport on mobile Safari, so 80vh is
	// taller than 80% of what the user can actually see while the URL bar is up.
	// The dvh override is scoped below lg, where that gap exists; on desktop the
	// two units are identical anyway.
	return (
		<section className="relative flex min-h-[80vh] items-center overflow-hidden bg-canvas pt-24 [@media(max-width:1023.98px)]:min-h-[80dvh]">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-radial-fade" />
				<div className="absolute inset-0 bg-grid-steel [background-size:46px_46px] [-webkit-mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
			</div>
			<div className="container-x relative text-center">
				<p className="kicker justify-center">Error 404</p>
				<h1 className="mx-auto mt-5 font-display text-5xl font-bold tracking-tightest text-ink sm:text-6xl md:text-7xl lg:text-8xl">
					Page not found
				</h1>
				<p className="mx-auto mt-5 max-w-md text-lg text-steel-600">
					The page you&apos;re looking for has moved or no longer exists.
					Let&apos;s get you back to building something great.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Button
						href="/"
						arrow>
						Back to home
					</Button>
					<Button
						href="/contact"
						variant="outline">
						Contact us
					</Button>
				</div>
			</div>
		</section>
	);
}
