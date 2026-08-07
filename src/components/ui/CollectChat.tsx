/**
 * CollectChat — loads the Collect.chat bot, late and on every page.
 *
 * The bot has no first-paint value: nobody lands on a page in order to look at
 * a chat bubble. So the launcher is not requested until the visitor does
 * something — a pointer, a key, a touch, a scroll — with a safety timer behind
 * it so a reader who never interacts still gets the bot. That keeps a third-
 * party iframe, a config fetch and a geo lookup off the critical path.
 *
 * `window.CollectId` is set separately in `app/layout.tsx` on a
 * `beforeInteractive` script, and that placement is not stylistic: `launcher.js`
 * reads the global once, at execution time, and never polls or retries. If it
 * is unset at that instant the widget silently never loads — forever. Two
 * scripts on the same strategy have no documented ordering guarantee in Next,
 * so only `beforeInteractive` can promise the global is there first.
 *
 * The bot keeps its own launcher; `FloatingContact`'s "Chat with us" row is a
 * second door into the same bot, and `globals.css` keeps the two off each
 * other's toes in the corner.
 *
 * @format
 */

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { COLLECT_LAUNCHER_SRC } from "@/lib/collectchat";
import { CollectChatDock } from "./CollectChatDock";

/** Long enough to stay off the critical path, short enough that an idle reader still gets a bot. */
const SAFETY_MS = 6000;

const WAKE_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

export function CollectChat() {
	const [armed, setArmed] = useState(false);

	useEffect(() => {
		const arm = () => setArmed(true);
		const timer = window.setTimeout(arm, SAFETY_MS);
		const opts = { once: true, passive: true } as const;

		WAKE_EVENTS.forEach((e) => window.addEventListener(e, arm, opts));
		return () => {
			window.clearTimeout(timer);
			WAKE_EVENTS.forEach((e) => window.removeEventListener(e, arm));
		};
	}, []);

	if (!armed) return null;

	// next/script dedupes by id, so this survives client-side navigation without
	// re-injecting. The widget itself lives in <body>, outside React's tree, and
	// is therefore never torn down by a route change either.
	//
	// The dock rides along behind the same gate: it exists only to take over the
	// launcher's placement, so there is nothing for it to do until the script that
	// creates the launcher has been asked for.
	return (
		<>
			<Script
				id="collectchat-launcher"
				src={COLLECT_LAUNCHER_SRC}
				strategy="lazyOnload"
			/>
			<CollectChatDock />
		</>
	);
}
