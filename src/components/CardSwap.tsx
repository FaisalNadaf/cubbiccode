"use client";

/**
 * CardSwap — animated swapping card stack (adapted from React Bits).
 * https://reactbits.dev  •  Dependency: gsap
 *
 * Base <Card> chrome is intentionally neutral so callers own the look
 * (border / background) via className. Only the structural + 3D transform
 * classes are baked in.
 */

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  /** Fires with the original index of the card entering the front slot. */
  onActiveChange?: (index: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 overflow-hidden rounded-2xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  ),
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  // Shallow z-recede so back cards don't foreshorten into each other — keeps
  // every card's titlebar readable even with a tall stack.
  z: -i * distX * 0.9,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveChange,
  skewAmount = 6,
  easing = "elastic",
  children,
}) => {
  // Keep the latest callback in a ref so the animation effect never goes stale
  // and doesn't need to re-run when the parent re-renders.
  const onActiveRef = useRef(onActiveChange);
  onActiveRef.current = onActiveChange;
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children],
  );
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length],
  );

  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i),
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const moveToFrontRef = useRef<((idx: number) => void) | null>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount),
    );
    onActiveRef.current?.(order.current[0]);

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      // The second card is the one sliding into the front slot — surface it.
      const upcoming = rest[0];
      tl.call(() => onActiveRef.current?.(upcoming), undefined, "promote");
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    let paused = false;

    // Bring an arbitrary card to the front (used on click). Re-slots every card
    // to its new position and restarts the auto-advance timer.
    const moveToFront = (originalIdx: number) => {
      const cur = order.current;
      const k = cur.indexOf(originalIdx);
      if (k <= 0) return; // not found, or already at the front

      const newOrder = [cur[k], ...cur.slice(0, k), ...cur.slice(k + 1)];
      order.current = newOrder;

      tlRef.current?.kill();
      const tl = gsap.timeline();
      tlRef.current = tl;
      newOrder.forEach((idx, pos) => {
        const slot = makeSlot(pos, cardDistance, verticalDistance, newOrder.length);
        const el = refs[idx].current!;
        tl.set(el, { zIndex: slot.zIndex }, 0);
        tl.to(
          el,
          { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
          0,
        );
      });

      onActiveRef.current?.(originalIdx);
      clearInterval(intervalRef.current);
      if (!paused) intervalRef.current = window.setInterval(swap, delay);
    };
    moveToFrontRef.current = moveToFront;

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        paused = true;
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        paused = false;
        tlRef.current?.play();
        clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            moveToFrontRef.current?.(i);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 origin-bottom-right -translate-x-[3%] -translate-y-[2%] transform overflow-visible [perspective:1400px] max-[768px]:translate-x-0 max-[768px]:translate-y-[6%] max-[768px]:scale-[0.72] max-[480px]:translate-x-[2%] max-[480px]:translate-y-[4%] max-[480px]:scale-[0.58]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
