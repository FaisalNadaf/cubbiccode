/**
 * CollectChatDock — makes the Collect.chat launcher draggable, and parks it in
 * one of the two bottom corners.
 *
 * The bot ships as a right-edge tab pinned at half the viewport height (their
 * dashboard's "centre" placement, which resolves to
 * `#chat-bot-launcher-container.chat-bot-launcher-center { bottom: 50% !important }`).
 * Mid-screen is the one place a floating control is guaranteed to sit over
 * whatever you are reading. This drags it out of there and docks it bottom-left
 * or bottom-right, and remembers which.
 *
 * Everything here reaches into a third party's DOM, so the rules are:
 *
 *  • Nothing is assumed to exist. `launcher.js` is deferred behind the first
 *    interaction and an ad-blocker or a downed CDN can stop it outright, so the
 *    element is waited for and the whole feature simply never engages if it
 *    never lands. Same contract as lib/collectchat.
 *  • Positioning is written INLINE with `important`. Their own placement rule
 *    carries `!important`, and a stylesheet of ours could only beat that on
 *    specificity — a tie their late-injected sheet would win on order. Inline +
 *    important is the one declaration that outranks it unconditionally.
 *  • Their class list is never touched, only overridden. `chat-bot-launcher-center`
 *    stays exactly where it is; every property it sets is simply out-ranked.
 *    Nothing here can desync from what their bundle believes about itself.
 *  • Their markup is only ever read by id — the three ids below are the entire
 *    contract. If they rename one, the feature stops engaging; it cannot break
 *    the page.
 *
 * @format
 */

"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** The whole of our dependency on their markup. */
const CONTAINER_ID = "chat-bot-launcher-container";
const LAUNCHER_ID = "chat-bot-launcher";
const PANEL_ID = "chat-bot-frame-container";
/** Collect.chat's own left-hand placement class. See `seat`. */
const LEFT_CLASS = "chat-bot-launcher-left";

type Corner = "left" | "right";

const STORE_KEY = "cc-bot-corner";
/** Right by default: the left corner already has our own Connect dome in it. */
const DEFAULT_CORNER: Corner = "right";

/**
 * Docked flush to the side wall, which is how Collect.chat's own edge tab sits
 * (`right: 0`) and what the rounding below is cut for. Any inset here and it
 * stops reading as a tab attached to the screen and starts reading as a button
 * that missed the corner.
 */
const WALL = 0;
/**
 * How far up from the bottom each side sits.
 *
 * The left wall is not empty: our Connect dome is 84px tall and rests 20px up
 * (see ui/FloatingContact). Docking the bot there would drop it straight on top
 * of the dome, so the left seat is raised to clear it with a gap. The right wall
 * is free and keeps the bot's own 20px.
 */
const BOTTOM = { right: 20, left: 20 + 84 + 16 } as const;

/**
 * The launcher's rounding, per wall.
 *
 * Their centre placement cuts the edge that meets the viewport square
 * (`border-radius: 50% 0 0 50%`) so the tab reads as attached to it. That is
 * still what we want — but it is hard-coded for the right-hand wall, so the
 * left seat needs it mirrored or the flat edge faces into the page.
 */
const RADIUS = {
	avatar: { right: "50% 0 0 50%", left: "0 50% 50% 0" },
	pill: { right: "5em 0 0 5em", left: "0 5em 5em 0" },
} as const;

/** Pointer travel, in px, that turns a press into a drag rather than a tap. */
const DRAG_THRESHOLD = 6;
/** Fly-to-corner duration on release. */
const SNAP_MS = 260;
const SNAP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** How long to keep watching for a launcher that may never come. */
const WAIT_MS = 60_000;

function readCorner(): Corner {
	try {
		const stored = localStorage.getItem(STORE_KEY);
		return stored === "left" || stored === "right" ? stored : DEFAULT_CORNER;
	} catch {
		// Private mode / storage disabled. A forgotten position is not a failure.
		return DEFAULT_CORNER;
	}
}

function writeCorner(corner: Corner) {
	try {
		localStorage.setItem(STORE_KEY, corner);
	} catch {
		/* ignore */
	}
}

export function CollectChatDock() {
	useEffect(() => {
		let corner = readCorner();
		let disposed = false;
		let cleanup: (() => void) | null = null;

		/**
		 * Seat the container in `corner`.
		 *
		 * Anchored by side (`left` OR `right`, never a computed x) so the dock
		 * survives rotation, resize and the launcher's own width changing — the
		 * "Chat Now" bubble is part of this box and comes and goes, which would
		 * slide a left-anchored button around on the right-hand side.
		 */
		const seat = (el: HTMLElement, next: Corner) => {
			const s = el.style;
			s.setProperty("top", "auto", "important");
			s.setProperty(
				"bottom",
				`calc(env(safe-area-inset-bottom, 0px) + ${BOTTOM[next]}px)`,
				"important",
			);

			// Collect.chat ships a left-hand placement of its own, and it carries more
			// than the mirrored row: it turns the speech bubble's tail around to point
			// back at the avatar, and moves the bubble's dismiss button to the far
			// side. Both are `::before`/id rules we cannot reach from an inline style,
			// so the class is the only way to get them — and it is their class,
			// describing exactly the state we have put the launcher in.
			el.classList.toggle(LEFT_CLASS, next === "left");

			if (next === "left") {
				s.setProperty("left", `calc(env(safe-area-inset-left, 0px) + ${WALL}px)`, "important");
				s.setProperty("right", "auto", "important");
				// Also asserted inline. The class above sets it too, but only that rule
				// stands between the avatar and the bubble sitting the wrong way round,
				// and the inline copy holds even against their `-center` placement.
				s.setProperty("flex-direction", "row-reverse", "important");
			} else {
				s.setProperty("right", `calc(env(safe-area-inset-right, 0px) + ${WALL}px)`, "important");
				s.setProperty("left", "auto", "important");
				s.setProperty("flex-direction", "row", "important");
			}

			// Turn the flat edge to face whichever wall it is now against.
			const launcher = document.getElementById(LAUNCHER_ID);
			if (launcher) {
				const shape =
					el.classList.contains("chat-bot-avatar-launcher") ? RADIUS.avatar : RADIUS.pill;
				launcher.style.setProperty("border-radius", shape[next], "important");
			}
		};

		/** True while the launcher is sitting exactly where we last put it. */
		const seated = (el: HTMLElement) =>
			el.style.getPropertyPriority("bottom") === "important" &&
			el.classList.contains(LEFT_CLASS) === (corner === "left");

		const wire = (el: HTMLElement) => {
			if (disposed) return;

			el.style.setProperty("touch-action", "none", "important");
			el.style.setProperty("user-select", "none", "important");
			el.style.setProperty("cursor", "grab", "important");
			seat(el, corner);

			let dragging = false;
			let moved = false;
			let pointerId: number | null = null;
			let startX = 0;
			let startY = 0;
			let dx = 0;
			let dy = 0;
			/** Rest rect, captured before the drag transform is applied. */
			let rest: DOMRect | null = null;
			/** Set when a press turned out to be a drag, so its click is swallowed. */
			let suppressClick = false;

			const panelOpen = () => {
				const panel = document.getElementById(PANEL_ID);
				return !!panel && getComputedStyle(panel).display !== "none";
			};

			const onPointerDown = (e: PointerEvent) => {
				if (e.button !== 0 && e.pointerType === "mouse") return;
				// While the conversation is up the launcher sits behind the panel and
				// is not a thing anyone is aiming at.
				if (panelOpen()) return;

				dragging = true;
				moved = false;
				suppressClick = false;
				pointerId = e.pointerId;
				startX = e.clientX;
				startY = e.clientY;
				dx = 0;
				dy = 0;
				rest = el.getBoundingClientRect();
				el.style.setProperty("transition", "none", "important");
			};

			const onPointerMove = (e: PointerEvent) => {
				if (!dragging || e.pointerId !== pointerId || !rest) return;

				const rawX = e.clientX - startX;
				const rawY = e.clientY - startY;

				if (!moved) {
					if (Math.hypot(rawX, rawY) < DRAG_THRESHOLD) return;
					moved = true;
					el.style.setProperty("cursor", "grabbing", "important");
					// Claim the pointer only once this is definitely a drag, so a plain
					// tap keeps its normal event path into their click handler.
					try {
						el.setPointerCapture(e.pointerId);
					} catch {
						/* not capturable — the move listener on window still works */
					}
				}

				// Keep the whole button on screen, whatever the gesture does — and let
				// it reach the walls, since that is where it is going to land.
				const minX = -rest.left;
				const maxX = window.innerWidth - rest.right;
				const minY = -rest.top;
				const maxY = window.innerHeight - rest.bottom;
				dx = Math.min(Math.max(rawX, minX), maxX);
				dy = Math.min(Math.max(rawY, minY), maxY);

				el.style.setProperty("transform", `translate3d(${dx}px, ${dy}px, 0)`, "important");
			};

			const finish = (e: PointerEvent) => {
				if (!dragging || e.pointerId !== pointerId) return;
				dragging = false;
				pointerId = null;
				try {
					el.releasePointerCapture(e.pointerId);
				} catch {
					/* never captured */
				}
				el.style.setProperty("cursor", "grab", "important");

				if (!moved) {
					// A tap. Leave everything alone and let their launcher open the chat.
					el.style.removeProperty("transition");
					return;
				}
				suppressClick = true;

				// Nearest bottom corner, by where the button actually ended up.
				const now = el.getBoundingClientRect();
				const next: Corner =
					now.left + now.width / 2 < window.innerWidth / 2 ? "left" : "right";

				// FLIP, so the flight lands exactly on the seat rather than on a
				// number we computed for it. Re-seat with the transform cleared to
				// learn the true destination (which resolves env() and their own
				// layout for us), then put the button visually back where the finger
				// left it and let a transform transition carry it across.
				el.style.setProperty("transform", "none", "important");
				seat(el, next);
				const target = el.getBoundingClientRect();

				const backX = now.left - target.left;
				const backY = now.top - target.top;

				if (prefersReducedMotion()) {
					el.style.removeProperty("transform");
					el.style.removeProperty("transition");
				} else {
					el.style.setProperty(
						"transform",
						`translate3d(${backX}px, ${backY}px, 0)`,
						"important",
					);
					// Commit that position before the transition exists, or the button
					// animates from the old seat instead of from the finger. Reading a
					// layout property is what forces the flush.
					el.getBoundingClientRect();
					el.style.setProperty(
						"transition",
						`transform ${SNAP_MS}ms ${SNAP_EASE}`,
						"important",
					);
					el.style.setProperty("transform", "translate3d(0, 0, 0)", "important");
					window.setTimeout(() => {
						if (disposed) return;
						el.style.removeProperty("transition");
						el.style.removeProperty("transform");
					}, SNAP_MS + 60);
				}

				if (next !== corner) {
					corner = next;
					writeCorner(next);
				}
			};

			// Capture phase: their click handler is on a descendant, so this is the
			// only place a drag's trailing click can be stopped before it opens the
			// chat. A drag that ends without a click (pointercancel) simply leaves the
			// flag set, and the next pointerdown clears it.
			const onClick = (e: MouseEvent) => {
				if (!suppressClick) return;
				suppressClick = false;
				e.stopPropagation();
				e.preventDefault();
			};

			el.addEventListener("pointerdown", onPointerDown);
			window.addEventListener("pointermove", onPointerMove);
			window.addEventListener("pointerup", finish);
			window.addEventListener("pointercancel", finish);
			el.addEventListener("click", onClick, true);

			// Their bundle rewrites this element's style/class on open, close and
			// resize. Re-seat whenever our anchors have been dropped — compared before
			// writing, so our own writes cannot feed the observer back into itself.
			const guard = new MutationObserver(() => {
				if (dragging || disposed) return;
				if (!seated(el)) seat(el, corner);
			});
			guard.observe(el, { attributes: true, attributeFilter: ["style", "class"] });

			cleanup = () => {
				guard.disconnect();
				el.removeEventListener("pointerdown", onPointerDown);
				window.removeEventListener("pointermove", onPointerMove);
				window.removeEventListener("pointerup", finish);
				window.removeEventListener("pointercancel", finish);
				el.removeEventListener("click", onClick, true);
			};
		};

		// The launcher lands whenever it lands — it is deferred behind the visitor's
		// first interaction and then loaded from a third-party CDN.
		const existing = document.getElementById(CONTAINER_ID);
		let watcher: MutationObserver | null = null;
		let giveUp: number | null = null;

		if (existing) {
			wire(existing);
		} else {
			watcher = new MutationObserver(() => {
				const el = document.getElementById(CONTAINER_ID);
				if (!el) return;
				watcher?.disconnect();
				watcher = null;
				if (giveUp !== null) window.clearTimeout(giveUp);
				wire(el);
			});
			watcher.observe(document.body, { childList: true, subtree: true });
			giveUp = window.setTimeout(() => watcher?.disconnect(), WAIT_MS);
		}

		return () => {
			disposed = true;
			watcher?.disconnect();
			if (giveUp !== null) window.clearTimeout(giveUp);
			cleanup?.();
		};
	}, []);

	return null;
}
