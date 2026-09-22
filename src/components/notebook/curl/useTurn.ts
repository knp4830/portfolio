"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { type Point, lerp, progressOf } from "@/lib/curl/geometry";
import {
  type Direction,
  TIMING,
  easeInOut,
  easeOut,
  initialWheel,
  rifflePlan,
  settles,
  wheelIdle,
  wheelStep,
} from "@/lib/curl/input";
import { PATHS, SPREADS, type SpreadId, neighbors } from "@/lib/notebook/spreads";
import { arrive, memory } from "./memory";

// The turn driver both renderers share. It owns the one turn state — which way,
// how far, and where the corner is if a pointer holds it — and every input
// writes to it: keys, clicks, the wheel, drags, the contents riffle, and a
// replay after browser back/forward. The renderer only paints frames; this
// decides what the next frame is and when the route changes.

export type TurnFrame = {
  direction: Direction | null;
  /** 0 = flat, 1 = turned. */
  progress: number;
  /** The corner, when a pointer is holding it; otherwise it follows the arc. */
  pointer: Point | null;
  /** Riffle flips show blank paper: the pages in between aren't rendered. */
  blank: boolean;
};

export type TurnOptions = {
  /** The spread this engine turns from right now (desktop: the one on screen; mobile: its own page). */
  spread: SpreadId;
  /** Mobile renders every spread's page; only the one on screen may turn. Desktop: always true. */
  showing: boolean;
  platform: "desktop" | "mobile";
  /** Paint one frame. Runs every animation frame, so it writes styles directly. */
  draw: (frame: TurnFrame) => void;
  /** The corner's rest point C and its mirror Q for a direction, in the renderer's coordinates. */
  corners: (direction: Direction) => { corner: Point; mirror: Point };
  /** What fades out and in when reduced motion replaces the curl. */
  fadeTarget: () => HTMLElement | null;
  /** The ribbon bookmark: it pulls up while a page turns and drops back once it lands. */
  ribbon: () => HTMLElement | null;
};

const REDUCED = "(prefers-reduced-motion: reduce)";
const DESKTOP = "(min-width: 64rem)";
/** Reduced motion: wheel distance that steps one page. */
const REDUCED_STEP = 120;

/** A project sheet is open (they're all rendered; only the open one is displayed). */
export const dialogOpen = () =>
  [...document.querySelectorAll('[role="dialog"]')].some((dialog) => dialog.getClientRects().length > 0);

/** Which spread a same-site path belongs to ("/projects/minced" → projects). */
export function spreadOf(pathname: string): SpreadId | null {
  const segment = pathname.split("/")[1] ?? "";
  if (segment === "") return "opening";
  return (SPREADS as readonly string[]).includes(segment) ? (segment as SpreadId) : null;
}

function createEngine(options: () => TurnOptions, push: (href: string, scroll: boolean) => void) {
  const frame: TurnFrame = { direction: null, progress: 0, pointer: null, blank: false };
  let raf: number | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let leaving = false;
  let reducedWheel = 0;

  const o = options;
  const active = () => matchMedia(DESKTOP).matches === (o().platform === "desktop") && o().showing;
  const reduced = () => matchMedia(REDUCED).matches;
  const around = () => neighbors(o().spread);
  const target = (direction: Direction) => (direction === "forward" ? around().next : around().previous);
  const paint = () => {
    o().draw(frame);
    const ribbon = o().ribbon();
    if (ribbon && !reduced()) ribbon.style.translate = frame.direction ? "0 -100%" : "0 0";
  };
  const set = (patch: Partial<TurnFrame>) => {
    Object.assign(frame, patch);
    paint();
  };
  const rest = () => set({ direction: null, progress: 0, pointer: null, blank: false });

  function stop() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  }

  function animate(duration: number, step: (t: number) => void, done?: () => void) {
    stop();
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      step(t);
      paint();
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        raf = null;
        done?.();
      }
    };
    raf = requestAnimationFrame(tick);
  }

  function navigate(to: SpreadId, href = PATHS[to]) {
    leaving = true;
    stop();
    clearTimeout(idleTimer);
    memory.expected = to;
    // Whatever wheel input is still arriving belongs to the turn that just finished.
    memory.wheel = { ...initialWheel(), lockedUntil: performance.now() + TIMING.lock };
    // Let the landed frame reach the screen before the route swaps. At a full turn
    // the flap is pixel-identical to the page the next route draws, so the swap is
    // invisible — but only if that frame is actually shown first. Pushing in the
    // same frame showed the flap ~45px short of landing, then a jump.
    requestAnimationFrame(() => requestAnimationFrame(() => push(href, o().platform === "mobile")));
  }

  /** Reduced motion: no curl frames at all, just a 200ms crossfade across the route change. */
  function crossfade(to: SpreadId, href = PATHS[to]) {
    leaving = true;
    const element = o().fadeTarget();
    if (element) {
      element.style.transition = `opacity ${TIMING.crossfade / 2}ms ease-out`;
      element.style.opacity = "0";
    }
    memory.fadeIn = true;
    setTimeout(() => navigate(to, href), TIMING.crossfade / 2);
  }

  /** Finish the turn under way — from wherever it is — then change route. */
  function complete(direction: Direction) {
    const to = target(direction);
    if (!to) return fallBack();
    leaving = true;
    const { pointer, progress } = frame;
    const { corner, mirror } = o().corners(direction);
    animate(
      TIMING.snap,
      (t) => {
        const e = easeOut(t);
        if (pointer) {
          frame.pointer = lerp(pointer, mirror, e);
          frame.progress = progressOf(frame.pointer, corner, mirror);
        } else frame.progress = progress + (1 - progress) * e;
      },
      () => navigate(to),
    );
  }

  /** Let a half-finished turn settle back flat. */
  function fallBack() {
    const { direction, pointer, progress } = frame;
    if (!direction || reduced()) return rest();
    const { corner, mirror } = o().corners(direction);
    animate(
      TIMING.snap,
      (t) => {
        const e = easeOut(t);
        if (pointer) {
          frame.pointer = lerp(pointer, corner, e);
          frame.progress = progressOf(frame.pointer, corner, mirror);
        } else frame.progress = progress * (1 - e);
      },
      rest,
    );
  }

  /** Keys, clicks, and links: turn one page, or riffle to a spread further away. */
  function turnTo(to: SpreadId, href = PATHS[to]) {
    const { spread } = o();
    if (leaving || to === spread) return;
    stop();
    clearTimeout(idleTimer);
    if (reduced()) return crossfade(to, href);

    const distance = SPREADS.indexOf(to) - SPREADS.indexOf(spread);
    const direction: Direction = distance > 0 ? "forward" : "backward";
    leaving = true;
    if (Math.abs(distance) === 1) {
      set({ direction, progress: 0, pointer: null, blank: false });
      animate(TIMING.auto, (t) => (frame.progress = easeInOut(t)), () => navigate(to, href));
      return;
    }
    // Riffle: quick blank flips (the pages in between aren't rendered), then the route changes.
    const { flips } = rifflePlan(distance);
    let flip = 0;
    const once = () => {
      set({ direction, progress: 0, pointer: null, blank: true });
      animate(
        TIMING.riffle,
        (t) => (frame.progress = t),
        () => (++flip < flips ? once() : navigate(to, href)),
      );
    };
    once();
  }

  const drag = {
    /** A pointer takes the corner. False if there's nothing to turn to. */
    start(direction: Direction) {
      if (leaving || !target(direction)) return false;
      stop();
      clearTimeout(idleTimer);
      // Reduced motion: follow the gesture without drawing any curl frames.
      if (reduced()) Object.assign(frame, { direction, blank: false });
      else set({ direction, blank: false });
      return true;
    },
    move(pointer: Point | null, progress: number) {
      if (reduced()) Object.assign(frame, { pointer, progress });
      else set({ pointer, progress });
    },
    release(velocity: number) {
      const { direction, progress } = frame;
      if (!direction) return;
      if (settles(progress, velocity)) {
        const to = target(direction);
        if (to && reduced()) {
          rest();
          return crossfade(to);
        }
        complete(direction);
      } else fallBack();
    },
  };

  function onWheel(event: WheelEvent) {
    if (o().platform !== "desktop" || !active() || leaving || event.ctrlKey) return;
    const dy = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
    const now = performance.now();
    if (now < memory.wheel.lockedUntil) {
      memory.wheel = { ...memory.wheel, lockedUntil: now + TIMING.lock, lastAt: now };
      return;
    }
    if (reduced()) {
      // No scrubbing without motion: enough wheel steps one page, with the crossfade.
      reducedWheel += dy;
      if (Math.abs(reducedWheel) < REDUCED_STEP) return;
      const to = target(reducedWheel > 0 ? "forward" : "backward");
      reducedWheel = 0;
      memory.wheel = { ...memory.wheel, lockedUntil: now + TIMING.lock, lastAt: now };
      if (to) crossfade(to);
      return;
    }
    if (frame.pointer) return; // a drag holds the corner
    stop();
    const { previous, next } = around();
    const result = wheelStep(
      { ...memory.wheel, direction: frame.direction, progress: frame.progress },
      dy,
      now,
      { forward: !!next, backward: !!previous },
    );
    memory.wheel = result.state;
    if (result.completed) {
      const to = target(result.completed);
      set({ direction: result.completed, progress: 1, pointer: null, blank: false });
      if (to) navigate(to);
      return;
    }
    set({ direction: result.state.direction, progress: result.state.progress, pointer: null, blank: false });
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      const decision = wheelIdle(memory.wheel, performance.now());
      const direction = frame.direction;
      if (!decision || !direction || frame.pointer) return;
      memory.wheel = { ...memory.wheel, direction: null, progress: 0, velocity: 0 };
      if (decision === "complete") complete(direction);
      else fallBack();
    }, TIMING.idle + 10);
  }

  function onKey(event: KeyboardEvent) {
    if (!active() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const element = event.target as Element | null;
    if (element?.closest?.("input, textarea, select, [contenteditable]") || dialogOpen()) return;
    const to = event.key === "ArrowRight" ? around().next : around().previous;
    if (!to) return;
    event.preventDefault();
    turnTo(to);
  }

  let swallowClick = false;
  /** Links to another spread turn the page (or riffle) before the route changes. */
  function onClick(event: MouseEvent) {
    if (swallowClick) {
      swallowClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (!active() || event.defaultPrevented || event.button !== 0) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!link || link.target === "_blank" || link.hasAttribute("download") || link.closest("[inert]")) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    const to = spreadOf(url.pathname);
    if (!to || to === o().spread) return;
    event.preventDefault();
    event.stopPropagation(); // before Next's <Link> handler navigates without the turn
    turnTo(to, url.pathname + url.hash);
  }

  /**
   * A spread has come on screen: after our own turn (settle), after a crossfade
   * (fade in), or after browser back/forward (replay the turn). The notebook
   * stays mounted across routes, so this also clears the last turn's state.
   */
  function arrived() {
    stop();
    clearTimeout(idleTimer);
    leaving = false;
    Object.assign(frame, { direction: null, progress: 0, pointer: null, blank: false });
    const { from, fadeIn, turned } = arrive(o().spread);
    const ribbon = o().ribbon();
    if (ribbon && !reduced() && (turned || from)) {
      // Arriving mid-turn: the ribbon starts pulled up, then drops back once the page lands.
      ribbon.style.transition = "none";
      ribbon.style.translate = "0 -100%";
      ribbon.getBoundingClientRect();
      ribbon.style.transition = "";
    }
    paint();
    const element = o().fadeTarget();
    if (fadeIn && element) {
      element.style.opacity = "0";
      requestAnimationFrame(() => {
        element.style.transition = `opacity ${TIMING.crossfade / 2}ms ease-in`;
        element.style.opacity = "1";
      });
      return;
    }
    if (!from || reduced()) return;
    const { previous, next } = around();
    const direction: Direction | null = from === next ? "forward" : from === previous ? "backward" : null;
    if (!direction) return;
    // The page we left is still "turned"; play the turn back to rest.
    set({ direction, progress: 1, pointer: null, blank: false });
    animate(TIMING.auto, (t) => (frame.progress = 1 - easeInOut(t)), rest);
  }

  return {
    frame,
    active,
    reduced,
    turnTo,
    drag,
    paint,
    arrived,
    onWheel,
    onKey,
    onClick,
    /** A drag that moved shouldn't also count as a click on the corner link. */
    swallowNextClick: () => (swallowClick = true),
    dispose: () => {
      stop();
      clearTimeout(idleTimer);
    },
  };
}

export type TurnEngine = ReturnType<typeof createEngine>;

export function useTurn(options: TurnOptions): TurnEngine {
  const router = useRouter();
  const latest = useRef(options);
  latest.current = options;
  const engine = useRef<TurnEngine | null>(null);
  engine.current ??= createEngine(
    () => latest.current,
    (href, scroll) => router.push(href, { scroll }),
  );

  // Runs when this engine's spread comes on screen (and on first load). A layout
  // effect, so a replay's first frame is set before the browser paints.
  const { spread, showing } = options;
  useLayoutEffect(() => {
    const turn = engine.current!;
    if (!showing || !turn.active()) return;
    turn.arrived();
    const { previous, next } = neighbors(spread);
    for (const id of [previous, next]) if (id) router.prefetch(PATHS[id]);
  }, [router, spread, showing]);

  useEffect(() => {
    const turn = engine.current!;
    addEventListener("wheel", turn.onWheel, { passive: true });
    addEventListener("keydown", turn.onKey);
    document.addEventListener("click", turn.onClick, true);
    return () => {
      removeEventListener("wheel", turn.onWheel);
      removeEventListener("keydown", turn.onKey);
      document.removeEventListener("click", turn.onClick, true);
      turn.dispose();
    };
  }, []);

  return engine.current;
}
