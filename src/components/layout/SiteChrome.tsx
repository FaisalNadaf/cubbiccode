/**
 * SiteChrome  wraps page content with the global Navbar + Footer, but omits
 * them on the standalone brand "gate" routes (the Cubiccode group companies),
 * which render as full-screen splashes with no site chrome.
 *
 * @format
 */

"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/** Routes that render bare  no navbar / footer. */
const BARE_ROUTES = new Set([
	"/careerjump",
	"/data-analytics",
	"/digital-marketing",
	"/gdg",
]);

export function SiteChrome({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const bare = BARE_ROUTES.has(pathname);

	return (
		<>
			{!bare && <Navbar />}
			<main className="relative">{children}</main>
			{!bare && <Footer />}
		</>
	);
}
