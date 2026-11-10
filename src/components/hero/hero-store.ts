import { useSyncExternalStore } from "react";

/** Shapes the hero's dot field can morph into, one per highlighted word in the intro. */
export type HeroShape = "waterloo" | "code" | "markets" | "ai";

type HeroState = {
  /** Shape currently shown instead of the name, or null for the name. */
  shape: HeroShape | null;
  /** True once the WebGL field has taken over from the HTML heading. */
  live: boolean;
};

const initial: HeroState = { shape: null, live: false };
let state = initial;
const listeners = new Set<() => void>();

function set(patch: Partial<HeroState>) {
  const next = { ...state, ...patch };
  if (next.shape === state.shape && next.live === state.live) return;
  state = next;
  listeners.forEach((listener) => listener());
}

export function subscribeHero(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getHeroState() {
  return state;
}

export function useHeroState() {
  return useSyncExternalStore(subscribeHero, getHeroState, () => initial);
}

export function setHeroLive(live: boolean) {
  set(live ? { live } : { live, shape: null });
}

// A short grace period on leave, so gliding between two words doesn't flash the name.
let leaveTimer: ReturnType<typeof setTimeout> | undefined;

export function showShape(shape: HeroShape) {
  clearTimeout(leaveTimer);
  set({ shape });
}

export function hideShape(shape: HeroShape) {
  clearTimeout(leaveTimer);
  leaveTimer = setTimeout(() => {
    if (state.shape === shape) set({ shape: null });
  }, 140);
}

export function toggleShape(shape: HeroShape) {
  clearTimeout(leaveTimer);
  set({ shape: state.shape === shape ? null : shape });
}

export function clearShape() {
  clearTimeout(leaveTimer);
  set({ shape: null });
}
