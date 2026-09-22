// Turn timing and the input rules that decide when a turn completes. Pure: the
// engine feeds in events and timestamps, and gets back the shared turn state.

export type Direction = "forward" | "backward";

/** The one shared turn: which way, and how far (0 = flat, 1 = turned). */
export type Turn = { direction: Direction | null; progress: number };

export const TIMING = {
  /** Click, key, or tap: a full turn (brief: 450ms, ease-in-out). */
  auto: 450,
  /** Snapping a half-finished turn to done or back. */
  snap: 250,
  /** Each page of a contents riffle. */
  riffle: 150,
  /** Wheel quiet time before a half-finished turn snaps. */
  idle: 150,
  /** After a turn completes, wheel input is ignored until it has been quiet this long. */
  lock: 350,
  /** Reduced motion: the crossfade that replaces the curl. */
  crossfade: 200,
} as const;

/** Wheel or trackpad distance for one full turn. */
export const SCROLL_PER_TURN = 600;
/** Released or idle at or past this, a turn completes; below, it falls back. */
export const COMPLETE_AT = 0.35;
/** A flick this fast (progress per ms, toward completion) completes even below COMPLETE_AT. */
export const FLICK = 0.0025;
/** How high the corner arcs mid-turn, as a share of the page height. */
export const ARC = 0.55;

export function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

/** Whether a half-finished turn should complete (true) or fall back (false). */
export function settles(progress: number, velocity: number): boolean {
  return progress >= COMPLETE_AT || (velocity >= FLICK && progress > 0.05);
}

/** Contents jump: one flip per spread up to 6; further than that, riffle 3 and cut. */
export function rifflePlan(distance: number): { flips: number; cut: boolean } {
  const spreads = Math.abs(distance);
  return spreads <= 6 ? { flips: spreads, cut: false } : { flips: 3, cut: true };
}

// ————— Wheel —————

export type WheelState = Turn & {
  /** Wheel events are ignored until this time. */
  lockedUntil: number;
  /** When the last wheel event arrived (for the idle snap and velocity). */
  lastAt: number;
  /** Smoothed progress per ms toward completion of the current direction. */
  velocity: number;
};

export const initialWheel = (): WheelState => ({
  direction: null,
  progress: 0,
  lockedUntil: 0,
  lastAt: Number.NEGATIVE_INFINITY,
  velocity: 0,
});

export type Available = { forward: boolean; backward: boolean };

/**
 * One wheel event. Scrolling down drives a forward turn and up a backward one;
 * scrolling against a turn in progress reverses it, and through 0 it becomes a
 * turn the other way. Reaching 1 completes the turn and locks the wheel: every
 * event during the lock extends it, so a trackpad's inertia tail — which can run
 * for a second or more — is swallowed whole and one flick turns one page.
 */
export function wheelStep(state: WheelState, deltaY: number, now: number, available: Available): {
  state: WheelState;
  completed: Direction | null;
} {
  if (now < state.lockedUntil) {
    return { state: { ...state, lockedUntil: now + TIMING.lock, lastAt: now }, completed: null };
  }

  let signed = (state.direction === "backward" ? -state.progress : state.progress) + deltaY / SCROLL_PER_TURN;
  if (!available.forward) signed = Math.min(signed, 0);
  if (!available.backward) signed = Math.max(signed, 0);
  const direction: Direction | null = signed > 0 ? "forward" : signed < 0 ? "backward" : null;
  const progress = Math.min(1, Math.abs(signed));

  const dt = now - state.lastAt;
  const instant = dt > 0 && dt < 100 ? Math.abs(deltaY) / SCROLL_PER_TURN / dt : 0;
  const toward = direction === "forward" ? deltaY > 0 : deltaY < 0;
  const velocity = toward ? state.velocity * 0.6 + instant * 0.4 : 0;

  if (direction && progress >= 1) {
    return {
      state: { direction: null, progress: 0, lockedUntil: now + TIMING.lock, lastAt: now, velocity: 0 },
      completed: direction,
    };
  }
  return { state: { direction, progress, lockedUntil: state.lockedUntil, lastAt: now, velocity }, completed: null };
}

/**
 * Called on a timer: once the wheel has been quiet for TIMING.idle, a
 * half-finished turn must resolve — never stay stuck mid-page.
 */
export function wheelIdle(state: WheelState, now: number): "complete" | "fallback" | null {
  if (!state.direction || state.progress === 0 || now - state.lastAt < TIMING.idle || now < state.lockedUntil) return null;
  return settles(state.progress, state.velocity) ? "complete" : "fallback";
}
