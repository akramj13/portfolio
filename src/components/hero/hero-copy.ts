import type { HeroShape } from "./hero-store";

/**
 * What the heading says before the name or shape, so every state reads as a
 * sentence: "hey, i'm akram.", "i write </>", "i trade 📈", "i build 🧠",
 * "studying @ 🎓". Keep these short: on phones they share a line with nothing
 * else, and on desktop the shape has to fit after them.
 */
export const HERO_PREFIX: Record<HeroShape | "name", string> = {
  name: "hey, i'm",
  waterloo: "studying @",
  code: "i write",
  markets: "i trade",
  ai: "i build",
};
