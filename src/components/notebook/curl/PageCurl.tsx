"use client";

import Link from "next/link";
import { type ReactNode, type PointerEvent as ReactPointerEvent, useEffect, useLayoutEffect, useRef } from "react";
import {
  type Fold,
  type Point,
  type Rect,
  compose,
  constrainCorner,
  cornerPath,
  foldLine,
  foldSegment,
  foreshorten,
  matrixCss,
  mirrorX,
  polygonCss,
  progressOf,
  reflect,
  reflectionMatrix,
  restCorner,
  splitPage,
} from "@/lib/curl/geometry";
import { ARC, type Direction } from "@/lib/curl/input";
import type { SpreadId } from "@/lib/notebook/spreads";
import { type TurnFrame, useTurn } from "./useTurn";

// The desktop page curl, drawn on the real DOM in stage coordinates (the
// 1440×952 scene). A forward turn lifts the right page from its bottom-right
// corner: the page is clipped along the fold, and the part past the fold is
// replaced by a flap showing the next spread's left page — pre-mirrored across
// the spine, then reflected across the fold with one matrix(), so at a full turn
// the two mirrors cancel and the page lands exactly where it belongs. The next
// spread's right page lies underneath. Backward turns are the mirror image.

const SPINE = 720;
const LEFT: Rect = { left: 90, top: 64, right: 720, bottom: 904 };
const RIGHT: Rect = { left: 720, top: 64, right: 1350, bottom: 904 };
const SPINE_TOP = { x: SPINE, y: 64 };
const SPINE_BOTTOM = { x: SPINE, y: 904 };
const PAGE_HEIGHT = 840;
const REST_LEGS = 34;
const HOVER_LIFT = 16;
/** The resting corner's flap lies at 60% of a flat fold, so it reads as lifted paper. */
const REST_FLAP = 0.6;
/** How close to the moving corner a press has to be to catch a turn mid-way. */
const CATCH_RADIUS = 80;

const CORNERS: Record<Direction, { corner: Point; mirror: Point }> = {
  forward: { corner: { x: RIGHT.right, y: RIGHT.bottom }, mirror: { x: LEFT.left, y: LEFT.bottom } },
  backward: { corner: { x: LEFT.left, y: LEFT.bottom }, mirror: { x: RIGHT.right, y: RIGHT.bottom } },
};
const PAGE_OF: Record<Direction, Rect> = { forward: RIGHT, backward: LEFT };
const mirrorSpine = (p: Point): Point => ({ x: 2 * SPINE - p.x, y: p.y });
const points = (list: Point[]) => list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

type TurnLink = { href: string; label: string };

type PageCurlProps = {
  spread: SpreadId;
  left: ReactNode;
  right: ReactNode;
  /** Neighbouring spreads' pages (replicas): the back of the turning page and the page beneath. */
  previousLeft?: ReactNode;
  previousRight?: ReactNode;
  nextLeft?: ReactNode;
  nextRight?: ReactNode;
  previous?: TurnLink;
  next?: TurnLink;
  /** Which grab corners show the lifted rest corner (not on the first/last page; the contents page has its dog-ear). */
  restCorners: Record<Direction, boolean>;
  /** Accessible name for the corner links' nav. */
  turnLabel: string;
};

export function PageCurl(props: PageCurlProps) {
  const { spread, previous, next, restCorners, turnLabel } = props;
  const root = useRef<HTMLDivElement>(null);
  const wraps = { forward: useRef<HTMLDivElement>(null), backward: useRef<HTMLDivElement>(null) };
  const flaps = { forward: useRef<HTMLDivElement>(null), backward: useRef<HTMLDivElement>(null) };
  const shades = { forward: useRef<HTMLDivElement>(null), backward: useRef<HTMLDivElement>(null) };
  const blankFlap = useRef<HTMLDivElement>(null);
  const blankFlapPage = useRef<HTMLDivElement>(null);
  const blankUnder = useRef<HTMLDivElement>(null);
  const turnFold = useRef<SVGLineElement>(null);
  const restFlaps = { forward: useRef<SVGPolygonElement>(null), backward: useRef<SVGPolygonElement>(null) };
  const restFolds = { forward: useRef<SVGLineElement>(null), backward: useRef<SVGLineElement>(null) };
  const hover = useRef<Record<Direction, number>>({ forward: 0, backward: 0 });
  const corner = useRef<Point | null>(null);

  function showLine(line: SVGLineElement | null, fold: Fold, page: Rect) {
    const segment = foldSegment(page, fold);
    if (!line) return;
    if (!segment) return line.setAttribute("visibility", "hidden");
    line.setAttribute("visibility", "visible");
    line.setAttribute("x1", String(segment[0].x));
    line.setAttribute("y1", String(segment[0].y));
    line.setAttribute("x2", String(segment[1].x));
    line.setAttribute("y2", String(segment[1].y));
  }

  function draw(frame: TurnFrame) {
    for (const d of ["forward", "backward"] as const) {
      flaps[d].current?.style.setProperty("visibility", "hidden");
      restFlaps[d].current?.setAttribute("visibility", "hidden");
      restFolds[d].current?.setAttribute("visibility", "hidden");
    }
    blankFlap.current?.style.setProperty("visibility", "hidden");
    // Landed: the page under the flap is fully covered, except where its torn edges
    // differ from the flap's. Hide it so the next route (which doesn't draw it) matches.
    const landed = frame.direction !== null && frame.progress >= 1;
    for (const side of ["forward", "backward"] as const) {
      wraps[side].current?.style.setProperty("visibility", landed && frame.direction !== side ? "hidden" : "visible");
    }
    blankUnder.current?.style.setProperty("visibility", "hidden");
    turnFold.current?.setAttribute("visibility", "hidden");
    corner.current = null;

    for (const side of ["forward", "backward"] as const) {
      const wrap = wraps[side].current;
      if (!wrap) continue;
      const page = PAGE_OF[side];
      const { corner: C, mirror: Q } = CORNERS[side];

      if (frame.direction === side) {
        const P = frame.pointer ?? cornerPath(C, Q, frame.progress, ARC * PAGE_HEIGHT);
        corner.current = P;
        const fold = foldLine(C, P);
        if (!fold) {
          wrap.style.clipPath = "none";
          continue;
        }
        const { flat, lifted } = splitPage(page, fold);
        wrap.style.clipPath = polygonCss(flat);
        const flap = frame.blank ? blankFlap.current : flaps[side].current;
        if (flap) {
          flap.style.visibility = "visible";
          flap.style.transform = matrixCss(compose(reflectionMatrix(fold), mirrorX(SPINE)));
          flap.style.clipPath = polygonCss(lifted.map(mirrorSpine));
        }
        if (frame.blank && blankFlapPage.current && blankUnder.current) {
          // Blank riffle pages: the back sits where the next left (or previous right) page would.
          blankFlapPage.current.style.left = `${side === "forward" ? LEFT.left : RIGHT.left}px`;
          blankUnder.current.style.left = `${page.left}px`;
          blankUnder.current.style.visibility = "visible";
        }
        // The flap's paper-back shade fades out as it lands, so a finished turn
        // looks exactly like the page the next route renders.
        const shade = shades[side].current;
        if (shade) shade.style.opacity = String(0.35 * (1 - frame.progress));
        showLine(turnFold.current, fold, page);
      } else if (restCorners[side] && !(frame.direction && frame.blank)) {
        // The resting lifted corner: the curl's rest state, from the same fold math.
        const P = restCorner(C, SPINE, REST_LEGS + HOVER_LIFT * hover.current[side]);
        const fold = foldLine(C, P)!;
        const { flat, lifted } = splitPage(page, fold);
        wrap.style.clipPath = polygonCss(flat);
        const flap = restFlaps[side].current;
        flap?.setAttribute("points", points(foreshorten(lifted.map((p) => reflect(p, fold)), fold, REST_FLAP)));
        flap?.setAttribute("visibility", "visible");
        showLine(restFolds[side].current, fold, page);
      } else {
        wrap.style.clipPath = "none";
      }
    }
  }

  const engine = useTurn({
    spread,
    platform: "desktop",
    draw,
    corners: (d) => CORNERS[d],
    fadeTarget: () => root.current,
    ribbon: () => root.current?.closest("main")?.querySelector<HTMLElement>("[data-ribbon]") ?? null,
  });

  // Paint the resting corners before the first frame shows.
  useLayoutEffect(() => {
    if (!engine.frame.direction) engine.paint();
  });

  // ————— Pointer: drag a corner, or catch a turn already under way —————
  const drag = useRef<{
    side: Direction;
    from: Point;
    started: boolean;
    samples: { t: number; progress: number }[];
  } | null>(null);

  function toStage(event: { clientX: number; clientY: number }): Point {
    const box = root.current!.getBoundingClientRect();
    const scale = box.width / 1440;
    return { x: (event.clientX - box.left) / scale, y: (event.clientY - box.top) / scale };
  }

  function press(side: Direction, event: PointerEvent | ReactPointerEvent, started = false) {
    if (event.button !== 0 || engine.reduced()) return;
    drag.current = { side, from: toStage(event), started, samples: [] };
    if (started && !engine.drag.start(side)) drag.current = null;
  }

  useEffect(() => {
    const onDown = (event: PointerEvent) => {
      // A turn in motion (wheel or snap) can be caught near its moving corner.
      const direction = engine.frame.direction;
      if (!direction || engine.frame.blank || drag.current || !corner.current || !engine.active()) return;
      const p = toStage(event);
      if (Math.hypot(p.x - corner.current.x, p.y - corner.current.y) > CATCH_RADIUS) return;
      press(direction, event, true);
    };
    const onMove = (event: PointerEvent) => {
      const current = drag.current;
      if (!current) return;
      const p = toStage(event);
      if (!current.started) {
        if (Math.hypot(p.x - current.from.x, p.y - current.from.y) < 4) return;
        if (!engine.drag.start(current.side)) return void (drag.current = null);
        current.started = true;
      }
      const { corner: C, mirror: Q } = CORNERS[current.side];
      const P = constrainCorner(p, C, SPINE_TOP, SPINE_BOTTOM);
      const progress = progressOf(P, C, Q);
      engine.drag.move(P, progress);
      current.samples = [...current.samples, { t: event.timeStamp, progress }].slice(-6);
    };
    const onUp = () => {
      const current = drag.current;
      drag.current = null;
      if (!current?.started) return;
      const [first, last] = [current.samples[0], current.samples[current.samples.length - 1]];
      const velocity = first && last && last.t > first.t ? (last.progress - first.progress) / (last.t - first.t) : 0;
      engine.drag.release(velocity);
      engine.swallowNextClick();
    };
    addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    return () => {
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
    };
  });

  // ————— Hover: the resting corner lifts 16px more to say it can be grabbed —————
  const hoverAnimation = useRef<number | null>(null);
  function lift(side: Direction, to: 0 | 1) {
    if (engine.reduced()) return;
    if (hoverAnimation.current !== null) cancelAnimationFrame(hoverAnimation.current);
    const from = hover.current[side];
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 150);
      hover.current[side] = from + (to - from) * t;
      if (!engine.frame.direction) engine.paint();
      hoverAnimation.current = t < 1 ? requestAnimationFrame(tick) : null;
    };
    hoverAnimation.current = requestAnimationFrame(tick);
  }

  const cornerLink = (side: Direction, link: TurnLink) => (
    <Link
      href={link.href}
      aria-label={link.label}
      draggable={false}
      onPointerDown={(event) => press(side, event)}
      onPointerEnter={() => lift(side, 1)}
      onPointerLeave={() => lift(side, 0)}
      className={`pointer-events-auto absolute top-[848px] size-14 cursor-grab touch-none focus-visible:outline-offset-[-4px] ${
        side === "backward" ? "left-[90px]" : "left-[1294px]"
      }`}
    />
  );

  const shade = (side: Direction, rect: Rect) => (
    <div
      ref={shades[side]}
      className="absolute bg-paper-back"
      style={{ left: rect.left, top: rect.top, width: 630, height: PAGE_HEIGHT }}
    />
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0">
      {/* Beneath: the pages a turn uncovers. */}
      <div aria-hidden inert>
        {props.previousLeft}
        {props.nextRight}
      </div>
      <div ref={blankUnder} aria-hidden className="invisible absolute top-[64px] h-[840px] w-[630px] bg-paper">
        <div className="ruled absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
      </div>

      {/* This spread's pages, each in a wrapper the fold clips. */}
      <div ref={wraps.backward} className="absolute inset-0 *:pointer-events-auto">
        {props.left}
      </div>
      <div ref={wraps.forward} className="absolute inset-0 *:pointer-events-auto">
        {props.right}
      </div>

      {/* The flaps: the back of the turning page. */}
      <div ref={flaps.forward} aria-hidden inert className="invisible absolute inset-0 origin-top-left">
        {props.nextLeft}
        {shade("forward", LEFT)}
      </div>
      <div ref={flaps.backward} aria-hidden inert className="invisible absolute inset-0 origin-top-left">
        {props.previousRight}
        {shade("backward", RIGHT)}
      </div>
      <div ref={blankFlap} aria-hidden className="invisible absolute inset-0 origin-top-left">
        <div ref={blankFlapPage} className="absolute top-[64px] h-[840px] w-[630px] bg-paper-back" />
      </div>

      {/* Fold lines and the resting corners' flaps. */}
      <svg aria-hidden width={1440} height={952} className="absolute inset-0 overflow-visible">
        {(["forward", "backward"] as const).map((side) => (
          <g key={side}>
            <polygon ref={restFlaps[side]} visibility="hidden" className="fill-paper-back stroke-rule [stroke-width:1]" />
            <line ref={restFolds[side]} visibility="hidden" className="stroke-fold-dark [stroke-width:1]" />
          </g>
        ))}
        <line ref={turnFold} visibility="hidden" className="stroke-fold-dark [stroke-width:1]" />
      </svg>

      {/* Grab corners: drag to turn, click or Enter to turn. Plain links without JavaScript. */}
      <nav aria-label={turnLabel}>
        {previous && cornerLink("backward", previous)}
        {next && cornerLink("forward", next)}
      </nav>
    </div>
  );
}
