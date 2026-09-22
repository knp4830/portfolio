import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  COMPLETE_AT,
  type Direction,
  SCROLL_PER_TURN,
  TIMING,
  type WheelState,
  easeInOut,
  initialWheel,
  riffleDuration,
  riffleLeaves,
  rifflePlan,
  settles,
  wheelIdle,
  wheelStep,
} from "./input.ts";

const BOTH = { forward: true, backward: true };

/**
 * Plays wheel events through the state machine the way the engine does: each
 * event at its time, plus an idle check every frame in between. A completed or
 * snapped-to-complete turn counts as one page turned.
 */
function play(events: { at: number; dy: number }[], until: number, available = BOTH) {
  let state: WheelState = initialWheel();
  const turns: Direction[] = [];
  let next = 0;
  for (let now = 0; now <= until; now += 4) {
    while (next < events.length && events[next].at <= now) {
      const result = wheelStep(state, events[next].dy, events[next].at, available);
      state = result.state;
      if (result.completed) turns.push(result.completed);
      next += 1;
    }
    const idle = wheelIdle(state, now);
    if (idle === "complete") {
      turns.push(state.direction!);
      state = { ...initialWheel(), lockedUntil: now + TIMING.snap + TIMING.lock, lastAt: state.lastAt };
    } else if (idle === "fallback") {
      state = { ...state, direction: null, progress: 0, velocity: 0 };
    }
  }
  return { state, turns };
}

/** A trackpad flick: a fast burst whose deltas decay over about 1.5s of inertia. */
function flick(start: number, first: number, decay = 0.94, frames = 90) {
  return Array.from({ length: frames }, (_, i) => ({ at: start + i * 16, dy: first * decay ** i })).filter((e) => Math.abs(e.dy) >= 0.5);
}

describe("wheel", () => {
  test("one trackpad flick turns exactly one page, however long its inertia runs", () => {
    const events = flick(0, 90);
    const total = events.reduce((sum, e) => sum + e.dy, 0);
    assert.ok(total > 2 * SCROLL_PER_TURN, `the flick scrolls ${Math.round(total)}px, enough for two turns`);
    assert.deepEqual(play(events, 3000).turns, ["forward"]);
  });

  test("two flicks with a pause between turn two pages", () => {
    const events = [...flick(0, 70), ...flick(2500, 70)];
    assert.deepEqual(play(events, 5000).turns, ["forward", "forward"]);
  });

  test("a slow scroll to 30% falls back; to 40% completes", () => {
    const slow = (px: number) => Array.from({ length: 20 }, (_, i) => ({ at: i * 50, dy: px / 20 }));
    assert.deepEqual(play(slow(0.3 * SCROLL_PER_TURN), 2000).turns, []);
    assert.deepEqual(play(slow(0.4 * SCROLL_PER_TURN), 2000).turns, ["forward"]);
  });

  test("scrolling up from rest turns back; scrolling back past zero reverses the turn", () => {
    assert.deepEqual(play(flick(0, -70), 3000).turns, ["backward"]);
    let state = initialWheel();
    state = wheelStep(state, 120, 0, BOTH).state;
    assert.equal(state.direction, "forward");
    state = wheelStep(state, -240, 16, BOTH).state;
    assert.equal(state.direction, "backward");
    assert.ok(Math.abs(state.progress - 120 / SCROLL_PER_TURN) < 1e-9);
  });

  test("no turn past the first or last page", () => {
    assert.deepEqual(play(flick(0, 70), 3000, { forward: false, backward: true }).turns, []);
    assert.deepEqual(play(flick(0, -70), 3000, { forward: true, backward: false }).turns, []);
  });

  test("a half-finished turn never stays stuck: it resolves once the wheel goes quiet", () => {
    const { state } = play([{ at: 0, dy: 100 }], 1000);
    assert.equal(state.progress, 0);
  });
});

describe("snap and riffle", () => {
  test("releases: 30% falls back, 40% completes, a fast flick completes early", () => {
    assert.equal(settles(0.3, 0), false);
    assert.equal(settles(0.4, 0), true);
    assert.equal(settles(COMPLETE_AT, 0), true);
    assert.equal(settles(0.15, 0.01), true);
  });

  test("riffle: one flip per spread up to 6, then 3 and cut", () => {
    assert.deepEqual(rifflePlan(1), { flips: 1, cut: false });
    assert.deepEqual(rifflePlan(-4), { flips: 4, cut: false });
    assert.deepEqual(rifflePlan(9), { flips: 3, cut: true });
  });

  test("riffle: every page turns together, each a beat behind the one in front", () => {
    assert.deepEqual(riffleLeaves(0, 4), [0, 0, 0, 0]);
    assert.deepEqual(riffleLeaves(1, 4), [1, 1, 1, 1]);
    assert.equal(riffleDuration(1), TIMING.riffle);
    assert.equal(riffleDuration(4), TIMING.riffle + 3 * TIMING.riffleLag);
    for (let t = 0.05; t < 1; t += 0.05) {
      const leaves = riffleLeaves(t, 4);
      // The front page always leads…
      for (let i = 1; i < leaves.length; i++) assert.ok(leaves[i - 1] >= leaves[i]);
      // …but not by much: at any moment all the pages are in motion together, fanned, not one by one.
      if (leaves[0] > 0 && leaves[0] < 1) assert.ok(leaves[0] - leaves[1] < 0.2, `t=${t.toFixed(2)}: ${leaves}`);
    }
    // Midway, every page is mid-turn at once.
    assert.ok(riffleLeaves(0.5, 4).every((p) => p > 0.1 && p < 0.9));
  });

  test("ease-in-out runs 0 → 1 symmetrically", () => {
    assert.equal(easeInOut(0), 0);
    assert.equal(easeInOut(1), 1);
    assert.ok(Math.abs(easeInOut(0.5) - 0.5) < 1e-9);
  });
});
