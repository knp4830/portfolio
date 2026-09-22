"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";
import {
  type Point,
  type Rect,
  constrainCorner,
  cornerPath,
  foldLine,
  foldSegment,
  polygonCss,
  progressOf,
  reflect,
  splitPage,
} from "@/lib/curl/geometry";
import { ARC } from "@/lib/curl/input";
import type { SpreadId } from "@/lib/notebook/spreads";
import { type TurnFrame, useTurn } from "./useTurn";

// The mobile peel. One page is on screen, so the curl works on the part of the
// page in the viewport: its bottom-right corner peels toward the (off-screen)
// spine on the left. The flap is plain paper-back — there's no facing page to
// show — and a blank page lies beneath. Going back is the same curl played in
// reverse: the previous page settles back over this one.
//
// Vertical scrolling is never hijacked. A turn starts only from a horizontal
// swipe, the lifted corner, or pulling past the bottom (next) or top (back) of
// the page. Every listener is passive, so the browser's scrolling is untouched.

/** Movement before a gesture picks a direction. */
const SLOP = 12;
/** Pull past the page's end this far before the peel starts. */
const PULL_START = 24;

type MobileCurlProps = {
  spread: SpreadId;
  next?: { href: string; label: string };
  children: ReactNode;
};

type Gesture = {
  x: number;
  y: number;
  atTop: boolean;
  atBottom: boolean;
  mode: null | "swipe-next" | "swipe-back" | "pull-next" | "pull-back" | "corner";
  samples: { t: number; progress: number }[];
};

export function MobileCurl({ spread, next, children }: MobileCurlProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const under = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const flap = useRef<HTMLDivElement>(null);
  const line = useRef<SVGLineElement>(null);

  /** The page's box, and the part of it on screen. */
  function view(): { box: DOMRect; visible: Rect } {
    const box = wrap.current!.getBoundingClientRect();
    return {
      box,
      visible: { left: box.left, right: box.right, top: Math.max(box.top, 0), bottom: Math.min(box.bottom, innerHeight) },
    };
  }

  /** Both directions share one geometry: C at the visible bottom-right, Q its mirror across the page's left edge. */
  function corners() {
    const { visible } = view();
    return {
      corner: { x: visible.right, y: visible.bottom },
      mirror: { x: 2 * visible.left - visible.right, y: visible.bottom },
    };
  }

  function draw(frame: TurnFrame) {
    const page = wrap.current;
    if (!page || !under.current || !cover.current || !flap.current || !line.current) return;
    page.style.clipPath = "none";
    for (const layer of [under.current, cover.current, flap.current]) layer.style.visibility = "hidden";
    line.current.setAttribute("visibility", "hidden");
    if (!frame.direction) return;

    const { box, visible } = view();
    const { corner, mirror } = corners();
    // Forward: this page peels away. Backward: the previous page comes back, i.e. a forward peel in reverse.
    const peel = frame.direction === "forward" ? frame.progress : 1 - frame.progress;
    const P =
      frame.pointer && frame.direction === "forward"
        ? frame.pointer
        : cornerPath(corner, mirror, peel, ARC * (visible.bottom - visible.top));
    const fold = foldLine(corner, P);
    const { flat, lifted } = fold ? splitPage(visible, fold) : { flat: [], lifted: [] };

    if (frame.direction === "forward") {
      if (!fold) return;
      page.style.clipPath = polygonCss(flat, box.left, box.top);
      Object.assign(under.current.style, {
        visibility: "visible",
        left: `${visible.left}px`,
        top: `${visible.top}px`,
        width: `${visible.right - visible.left}px`,
        height: `${visible.bottom - visible.top}px`,
      });
    } else {
      cover.current.style.visibility = "visible";
      cover.current.style.clipPath = fold
        ? polygonCss(flat)
        : polygonCss([
            { x: visible.left, y: visible.top },
            { x: visible.right, y: visible.top },
            { x: visible.right, y: visible.bottom },
            { x: visible.left, y: visible.bottom },
          ]);
    }
    if (!fold) return;
    flap.current.style.visibility = "visible";
    flap.current.style.clipPath = polygonCss(lifted.map((p) => reflect(p, fold)));
    const segment = foldSegment(visible, fold);
    if (segment) {
      line.current.setAttribute("visibility", "visible");
      line.current.setAttribute("x1", String(segment[0].x));
      line.current.setAttribute("y1", String(segment[0].y));
      line.current.setAttribute("x2", String(segment[1].x));
      line.current.setAttribute("y2", String(segment[1].y));
    }
  }

  const engine = useTurn({ spread, platform: "mobile", draw, corners, fadeTarget: () => wrap.current });

  useEffect(() => {
    const page = wrap.current;
    if (!page) return;
    let gesture: Gesture | null = null;

    const onStart = (event: TouchEvent) => {
      gesture = null;
      if (event.touches.length !== 1 || !engine.active()) return;
      if (document.querySelector('[role="dialog"]')) return;
      const touch = event.touches[0];
      const root = document.documentElement;
      gesture = {
        x: touch.clientX,
        y: touch.clientY,
        atTop: scrollY <= 0,
        atBottom: scrollY + innerHeight >= root.scrollHeight - 2,
        mode: null,
        samples: [],
      };
      if ((event.target as Element).closest("[data-curl-corner]") && engine.drag.start("forward")) gesture.mode = "corner";
    };

    const onMove = (event: TouchEvent) => {
      const current = gesture;
      if (!current) return;
      const touch = event.touches[0];
      const dx = touch.clientX - current.x;
      const dy = touch.clientY - current.y;
      if (!current.mode) {
        let mode: Gesture["mode"] = null;
        if (Math.abs(dx) > SLOP && Math.abs(dx) > 1.5 * Math.abs(dy)) mode = dx < 0 ? "swipe-next" : "swipe-back";
        else if (current.atBottom && dy < -PULL_START && Math.abs(dy) > Math.abs(dx)) mode = "pull-next";
        else if (current.atTop && dy > PULL_START && Math.abs(dy) > Math.abs(dx)) mode = "pull-back";
        if (!mode) return;
        if (!engine.drag.start(mode.endsWith("next") ? "forward" : "backward")) return void (gesture = null);
        current.mode = mode;
      }
      const { visible } = view();
      const width = visible.right - visible.left;
      const height = visible.bottom - visible.top;
      let progress = 0;
      let pointer: Point | null = null;
      switch (current.mode) {
        case "swipe-next":
          progress = -dx / width;
          break;
        case "swipe-back":
          progress = dx / width;
          break;
        case "pull-next":
          progress = (-dy - PULL_START) / (height * 0.5);
          break;
        case "pull-back":
          progress = (dy - PULL_START) / (height * 0.5);
          break;
        case "corner": {
          const { corner, mirror } = corners();
          pointer = constrainCorner(
            { x: touch.clientX, y: touch.clientY },
            corner,
            { x: visible.left, y: visible.top },
            { x: visible.left, y: visible.bottom },
          );
          progress = progressOf(pointer, corner, mirror);
          break;
        }
      }
      progress = Math.min(1, Math.max(0, progress));
      engine.drag.move(pointer, progress);
      current.samples = [...current.samples, { t: event.timeStamp, progress }].slice(-6);
    };

    const onEnd = () => {
      const current = gesture;
      gesture = null;
      if (!current?.mode) return;
      const [first, last] = [current.samples[0], current.samples[current.samples.length - 1]];
      const velocity = first && last && last.t > first.t ? (last.progress - first.progress) / (last.t - first.t) : 0;
      engine.drag.release(velocity);
      if (current.mode === "corner") engine.swallowNextClick();
    };

    page.addEventListener("touchstart", onStart, { passive: true });
    page.addEventListener("touchmove", onMove, { passive: true });
    addEventListener("touchend", onEnd);
    addEventListener("touchcancel", onEnd);
    return () => {
      page.removeEventListener("touchstart", onStart);
      page.removeEventListener("touchmove", onMove);
      removeEventListener("touchend", onEnd);
      removeEventListener("touchcancel", onEnd);
    };
  });

  return (
    <>
      {/* The blank page a forward peel uncovers (fixed: it's the viewport's worth). */}
      <div ref={under} aria-hidden className="invisible fixed bg-paper">
        <div className="ruled absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
      </div>
      <div ref={wrap} className="relative touch-pan-y">
        {children}
        {next && (
          <Link
            href={next.href}
            aria-label={next.label}
            data-curl-corner
            className="absolute right-0 bottom-0 z-10 size-11 touch-none focus-visible:outline-offset-[-4px]"
          >
            {/* The resting lifted corner. */}
            <svg aria-hidden width={30} height={30} viewBox="0 0 30 30" className="absolute right-0 bottom-0">
              <path d="M30 0Q15.5 0.5 6 6Q0.5 15.5 0 30Z" className="fill-paper-back stroke-rule [stroke-width:1]" />
              <path d="M30 0L0 30" className="stroke-fold-dark [stroke-width:1]" />
            </svg>
          </Link>
        )}
      </div>
      {/* Going back: the previous page, settling back over this one. */}
      <div ref={cover} aria-hidden className="invisible fixed inset-0 z-20 bg-paper">
        <div className="ruled absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
      </div>
      <div ref={flap} aria-hidden className="invisible fixed inset-0 z-30 bg-paper-back" />
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-30 size-full overflow-visible">
        <line ref={line} visibility="hidden" className="stroke-fold-dark [stroke-width:1]" />
      </svg>
    </>
  );
}
