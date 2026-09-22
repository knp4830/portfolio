import { type WheelState, initialWheel } from "@/lib/curl/input";
import type { SpreadId } from "@/lib/notebook/spreads";

// What a page turn needs to remember across a route change. Every spread is its
// own route, so the component that finished a turn unmounts and the next spread
// mounts fresh; module state survives that (it lives as long as the tab does).

export const memory = {
  /** The spread on screen before this one. Null on first load. */
  current: null as SpreadId | null,
  /** Set when a turn navigates, so the arriving spread doesn't replay it. */
  expected: null as SpreadId | null,
  /** Reduced motion: the leaving page faded out, so the arriving one fades in. */
  fadeIn: false,
  /** Wheel state carries over so a trackpad's inertia can't turn the next page too. */
  wheel: initialWheel() as WheelState,
};

/**
 * Called once by the active renderer when a spread mounts. Returns the spread we
 * came from if the route changed some other way than our own turn (browser
 * back/forward, a typed URL), so the turn can be replayed, and whether our own
 * turn brought us here (the ribbon then drops back into place).
 */
export function arrive(spread: SpreadId): { from: SpreadId | null; fadeIn: boolean; turned: boolean } {
  const turned = memory.expected === spread;
  const from = memory.current !== spread && !turned ? memory.current : null;
  const fadeIn = memory.fadeIn;
  memory.current = spread;
  memory.expected = null;
  memory.fadeIn = false;
  return { from, fadeIn, turned };
}
