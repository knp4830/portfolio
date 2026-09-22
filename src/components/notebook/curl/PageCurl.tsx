"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { type SpreadId, neighbors, pagesOf } from "@/lib/notebook/spreads";
import { type TurnFrame, spreadOf, useTurn } from "./useTurn";

// The desktop page curl, drawn on the real DOM in stage coordinates (the
// 1440×952 scene). All twelve pages are rendered once and kept; each frame gives
// every page a role:
//   this spread's left and right pages, clipped along the fold when they turn;
//   the back of the turning page (the next spread's left page, or the previous
//     spread's right page), pre-mirrored across the spine and reflected across
//     the fold with one matrix() — at a full turn the two mirrors cancel;
//   the pages beneath (next right / previous left), uncovered by the turn;
//   everything else, hidden.
// When a turn lands and the route changes, the roles shift by one spread: the
// page that was the flap *is* the new left page. Nothing is rebuilt, so there's
// nothing to flash.

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
const PAGE_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

const CORNERS: Record<Direction, { corner: Point; mirror: Point }> = {
  forward: { corner: { x: RIGHT.right, y: RIGHT.bottom }, mirror: { x: LEFT.left, y: LEFT.bottom } },
  backward: { corner: { x: LEFT.left, y: LEFT.bottom }, mirror: { x: RIGHT.right, y: RIGHT.bottom } },
};
const PAGE_OF: Record<Direction, Rect> = { forward: RIGHT, backward: LEFT };
const mirrorSpine = (p: Point): Point => ({ x: 2 * SPINE - p.x, y: p.y });
const points = (list: Point[]) => list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
const Z = { beneath: "1", current: "2", flap: "3" } as const;

type TurnLink = { href: string; label: string };

type PageCurlProps = {
  /** All twelve desktop pages, rendered once. */
  pages: { number: number; spread: SpreadId; node: ReactNode }[];
  /** Each spread's corner links. */
  links: Record<SpreadId, { previous?: TurnLink; next?: TurnLink }>;
  /** Accessible name for the corner links' nav. */
  turnLabel: string;
};

/** The pages around the spread on screen: which is which. */
function rolesFor(spread: SpreadId) {
  const { previous, next } = neighbors(spread);
  const [left, right] = pagesOf(spread);
  return {
    left,
    right,
    nextLeft: next && pagesOf(next)[0],
    nextRight: next && pagesOf(next)[1],
    previousLeft: previous && pagesOf(previous)[0],
    previousRight: previous && pagesOf(previous)[1],
  };
}

/** The route marker's tokens (see RouteMarker), e.g. "projects mobile:projects projects:minced". */
function routeTokens() {
  return (document.querySelector("[data-route]")?.getAttribute("data-route") ?? "").split(" ");
}

export function PageCurl({ pages, links, turnLabel }: PageCurlProps) {
  const pathname = usePathname();
  const spread = spreadOf(pathname) ?? "opening";
  const { previous, next } = links[spread];
  // No lifted corner before the first page or after the last; the contents page keeps its dog-ear.
  const restCorners: Record<Direction, boolean> = { backward: !!previous, forward: !!next && spread !== "opening" };

  const root = useRef<HTMLDivElement>(null);
  const wraps = useRef<Record<number, HTMLDivElement | null>>({});
  const shades = useRef<Record<number, HTMLDivElement | null>>({});
  const blankFlap = useRef<HTMLDivElement>(null);
  const blankFlapPage = useRef<HTMLDivElement>(null);
  const blankUnder = useRef<HTMLDivElement>(null);
  const turnFold = useRef<SVGLineElement>(null);
  const restFlaps = { forward: useRef<SVGPolygonElement>(null), backward: useRef<SVGPolygonElement>(null) };
  const restFolds = { forward: useRef<SVGLineElement>(null), backward: useRef<SVGLineElement>(null) };
  const hover = useRef<Record<Direction, number>>({ forward: 0, backward: 0 });
  const corner = useRef<Point | null>(null);
  const current = useRef(spread);
  const rests = useRef(restCorners);
  current.current = spread;
  rests.current = restCorners;

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

  function place(number: number | undefined, role: { visible: boolean; z?: string; current?: boolean }) {
    const wrap = number ? wraps.current[number] : null;
    if (!wrap) return;
    wrap.style.visibility = role.visible ? "visible" : "hidden";
    wrap.style.zIndex = role.z ?? "0";
    wrap.style.transform = "";
    wrap.style.clipPath = "none";
    const shade = shades.current[number!];
    if (shade) shade.style.opacity = "0";
    const inert = !role.current;
    if (wrap.inert !== inert) wrap.inert = inert;
  }

  function draw(frame: TurnFrame) {
    const roles = rolesFor(current.current);
    const landed = frame.direction !== null && frame.progress >= 1;

    // Every page to its role for this spread. Landed: the page under the flap is
    // hidden (its torn edges differ from the flap's), exactly as the next spread draws it.
    for (const n of PAGE_NUMBERS) place(n, { visible: false });
    place(roles.left, { visible: !(landed && frame.direction === "forward"), z: Z.current, current: true });
    place(roles.right, { visible: !(landed && frame.direction === "backward"), z: Z.current, current: true });
    place(roles.nextRight, { visible: true, z: Z.beneath });
    place(roles.previousLeft, { visible: true, z: Z.beneath });
    for (const d of ["forward", "backward"] as const) {
      restFlaps[d].current?.setAttribute("visibility", "hidden");
      restFolds[d].current?.setAttribute("visibility", "hidden");
    }
    blankFlap.current?.style.setProperty("visibility", "hidden");
    blankUnder.current?.style.setProperty("visibility", "hidden");
    turnFold.current?.setAttribute("visibility", "hidden");
    corner.current = null;

    for (const side of ["forward", "backward"] as const) {
      const turning = side === "forward" ? roles.right : roles.left;
      const wrap = wraps.current[turning];
      if (!wrap) continue;
      const page = PAGE_OF[side];
      const { corner: C, mirror: Q } = CORNERS[side];

      if (frame.direction === side) {
        const P = frame.pointer ?? cornerPath(C, Q, frame.progress, ARC * PAGE_HEIGHT);
        corner.current = P;
        const fold = foldLine(C, P);
        if (!fold) continue;
        const { flat, lifted } = splitPage(page, fold);
        wrap.style.clipPath = polygonCss(flat);
        const back = side === "forward" ? roles.nextLeft : roles.previousRight;
        const flap = frame.blank ? blankFlap.current : back ? wraps.current[back] : null;
        if (flap) {
          flap.style.visibility = "visible";
          flap.style.zIndex = Z.flap;
          flap.style.transform = matrixCss(compose(reflectionMatrix(fold), mirrorX(SPINE)));
          flap.style.clipPath = polygonCss(lifted.map(mirrorSpine));
        }
        if (frame.blank && blankFlapPage.current && blankUnder.current) {
          // Riffle: blank pages flip over; the spreads in between aren't shown.
          blankFlapPage.current.style.left = `${side === "forward" ? LEFT.left : RIGHT.left}px`;
          blankUnder.current.style.left = `${page.left}px`;
          blankUnder.current.style.visibility = "visible";
        }
        // The back of the page is shaded paper-back as it lifts, fading out as it
        // lands so the finished turn is exactly the page at rest.
        const shade = back && !frame.blank ? shades.current[back] : null;
        if (shade) shade.style.opacity = String(0.35 * (1 - frame.progress));
        showLine(turnFold.current, fold, page);
      } else if (rests.current[side] && !(frame.direction && frame.blank)) {
        // The resting lifted corner: the curl's rest state, from the same fold math.
        const P = restCorner(C, SPINE, REST_LEGS + HOVER_LIFT * hover.current[side]);
        const fold = foldLine(C, P)!;
        const { flat, lifted } = splitPage(page, fold);
        wrap.style.clipPath = polygonCss(flat);
        const flap = restFlaps[side].current;
        flap?.setAttribute("points", points(foreshorten(lifted.map((p) => reflect(p, fold)), fold, REST_FLAP)));
        flap?.setAttribute("visibility", "visible");
        showLine(restFolds[side].current, fold, page);
      }
    }
  }

  const engine = useTurn({
    spread,
    showing: true,
    platform: "desktop",
    draw,
    corners: (d) => CORNERS[d],
    fadeTarget: () => root.current,
    ribbon: () => root.current?.closest("main")?.querySelector<HTMLElement>("[data-ribbon]") ?? null,
  });

  // Keep the resting state painted as the spread changes (roles, corners).
  useLayoutEffect(() => {
    if (!engine.frame.direction) engine.paint();
  });

  // Decode the neighbouring pages' paper ahead of time, so the first frames of a
  // turn never show a page whose textures are still decoding.
  useEffect(() => {
    const roles = rolesFor(spread);
    for (const n of [roles.nextLeft, roles.nextRight, roles.previousLeft, roles.previousRight]) {
      const wrap = n ? wraps.current[n] : null;
      if (!wrap) continue;
      for (const layer of wrap.querySelectorAll<HTMLElement>("[aria-hidden]")) {
        const match = getComputedStyle(layer).backgroundImage.match(/url\("?([^")]+)"?\)/);
        if (!match) continue;
        const image = new Image();
        image.src = match[1];
        image.decode().catch(() => {});
      }
    }
  }, [spread]);

  // Switching projects slides the new detail in like an index card from under the
  // page edge. Only a switch: arriving on the projects spread doesn't replay it.
  const last = useRef<{ spread: SpreadId; view: string | undefined } | null>(null);
  useEffect(() => {
    const view = routeTokens().find((token) => token.startsWith("projects:"));
    const before = last.current;
    last.current = { spread, view };
    // Announce the selected card.
    for (const card of document.querySelectorAll<HTMLElement>("[data-card]")) {
      if (view === `projects:${card.dataset.card}`) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    }
    if (!before || spread !== "projects" || before.spread !== "projects" || before.view === view || !view) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.current
      ?.querySelector<HTMLElement>(`[data-view="${view}"]`)
      ?.animate([{ translate: "100% 0" }, { translate: "0 0" }], { duration: 200, easing: "ease-out" });
  }, [spread, pathname]);

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
      const direction = engine.frame.direction;
      if (!direction || engine.frame.blank || drag.current || !corner.current || !engine.active()) return;
      const p = toStage(event);
      if (Math.hypot(p.x - corner.current.x, p.y - corner.current.y) > CATCH_RADIUS) return;
      press(direction, event, true);
    };
    const onMove = (event: PointerEvent) => {
      const active = drag.current;
      if (!active) return;
      const p = toStage(event);
      if (!active.started) {
        if (Math.hypot(p.x - active.from.x, p.y - active.from.y) < 4) return;
        if (!engine.drag.start(active.side)) return void (drag.current = null);
        active.started = true;
      }
      const { corner: C, mirror: Q } = CORNERS[active.side];
      const P = constrainCorner(p, C, SPINE_TOP, SPINE_BOTTOM);
      const progress = progressOf(P, C, Q);
      engine.drag.move(P, progress);
      active.samples = [...active.samples, { t: event.timeStamp, progress }].slice(-6);
    };
    const onUp = () => {
      const active = drag.current;
      drag.current = null;
      if (!active?.started) return;
      const [first, lastSample] = [active.samples[0], active.samples[active.samples.length - 1]];
      const velocity =
        first && lastSample && lastSample.t > first.t ? (lastSample.progress - first.progress) / (lastSample.t - first.t) : 0;
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
      key={`${side}-${link.href}`}
      href={link.href}
      aria-label={link.label}
      draggable={false}
      onPointerDown={(event) => press(side, event)}
      onPointerEnter={() => lift(side, 1)}
      onPointerLeave={() => lift(side, 0)}
      className={`pointer-events-auto absolute top-[848px] z-10 size-14 cursor-grab touch-none focus-visible:outline-offset-[-4px] ${
        side === "backward" ? "left-[90px]" : "left-[1294px]"
      }`}
    />
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0">
      <div ref={blankUnder} aria-hidden className="invisible absolute top-[64px] z-[1] h-[840px] w-[630px] bg-paper">
        <div className="ruled absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
      </div>

      {pages.map(({ number, spread: owner, node }) => (
        <div
          key={number}
          ref={(element) => {
            wraps.current[number] = element;
          }}
          data-page-spread={owner}
          className="absolute inset-0 origin-top-left *:pointer-events-auto"
        >
          {node}
          {/* The back of the page, shaded as it turns. */}
          <div
            ref={(element) => {
              shades.current[number] = element;
            }}
            aria-hidden
            className="pointer-events-none! absolute top-[64px] h-[840px] w-[630px] bg-paper-back opacity-0"
            style={{ left: number % 2 === 1 ? LEFT.left : RIGHT.left }}
          />
        </div>
      ))}

      <div ref={blankFlap} aria-hidden className="invisible absolute inset-0 z-[3] origin-top-left">
        <div ref={blankFlapPage} className="absolute top-[64px] h-[840px] w-[630px] bg-paper-back" />
      </div>

      {/* Fold lines and the resting corners' flaps. */}
      <svg aria-hidden width={1440} height={952} className="absolute inset-0 z-[4] overflow-visible">
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
