import type { HeroShape } from "./hero-store";

/**
 * Turns the name and each morph shape into dot positions.
 * Every shape is drawn with the 2D canvas API, then sampled on a honeycomb
 * grid: each opaque grid cell becomes a dot, coloured by the pixel under it.
 */

export type ShapeKey = "name" | HeroShape;

/** Per-particle target: x/y in container pixels plus an RGB colour (0–1). */
export type Target = { xy: Float32Array; rgb: Float32Array };

export type Layout = {
  /** Size of the field container, in CSS pixels. */
  width: number;
  height: number;
  /** Distance between neighbouring dots. */
  gap: number;
  /** The heading's font size; every shape is scaled from it. */
  unit: number;
  name: { text: string; font: string; letterSpacing: string; left: number; top: number };
  /** The reading column, used to work out how much room is right of a shape's start. */
  column: { left: number; width: number };
  /** Where each shape starts: just after its own phrase ("i write", "i trade"…). */
  shapeLeft: Record<HeroShape, number>;
  /** Vertical centre of the name's box. Replaced by the centre of its ink once sampled. */
  centerY: number;
  /** Height of the name's ink; shapes are sized from it so they fill the same band. */
  inkHeight?: number;
  monoFamily: string;
};

const INK = "#141414";
const UP = "#13a874";
const DOWN = "#e5484d";

type Draw = (ctx: CanvasRenderingContext2D) => void;
type Points = { xy: number[]; rgb: number[] };

function raster(layout: Layout, gap: number, draw: Draw): Points {
  const w = Math.max(1, Math.ceil(layout.width));
  const h = Math.max(1, Math.ceil(layout.height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  draw(ctx);

  const data = ctx.getImageData(0, 0, w, h).data;
  const xy: number[] = [];
  const rgb: number[] = [];
  const rowHeight = gap * 0.866;
  for (let row = 0, y = rowHeight / 2; y < h; row++, y += rowHeight) {
    for (let x = gap / 2 + (row % 2 ? gap / 2 : 0); x < w; x += gap) {
      const p = ((y | 0) * w + (x | 0)) * 4;
      if (data[p + 3] < 128) continue;
      xy.push(x, y);
      rgb.push(data[p] / 255, data[p + 1] / 255, data[p + 2] / 255);
    }
  }
  return { xy, rgb };
}

/**
 * Maps `points` onto exactly `count` particles. Both lists are ordered left to
 * right, so during a morph each dot travels to the matching slice of the new
 * shape and the change sweeps across instead of scrambling.
 */
function fit(points: Points, count: number, jitter: number): Target {
  const m = points.xy.length / 2;
  const order = Array.from({ length: m }, (_, i) => i).sort(
    (a, b) => points.xy[a * 2] - points.xy[b * 2] || points.xy[a * 2 + 1] - points.xy[b * 2 + 1],
  );
  const xy = new Float32Array(count * 2);
  const rgb = new Float32Array(count * 3);
  const spread = m < count ? jitter : 0;
  for (let i = 0; i < count; i++) {
    const j = order[Math.min(m - 1, Math.floor(((i + 0.5) * m) / count))];
    xy[i * 2] = points.xy[j * 2] + (Math.random() - 0.5) * spread;
    xy[i * 2 + 1] = points.xy[j * 2 + 1] + (Math.random() - 0.5) * spread;
    rgb[i * 3] = points.rgb[j * 3];
    rgb[i * 3 + 1] = points.rgb[j * 3 + 1];
    rgb[i * 3 + 2] = points.rgb[j * 3 + 2];
  }
  return { xy, rgb };
}

const drawName =
  ({ name }: Layout): Draw =>
  (ctx) => {
    ctx.font = name.font;
    ctx.letterSpacing = name.letterSpacing;
    ctx.fillStyle = INK;
    ctx.textBaseline = "alphabetic";
    // An inline element's box is its font's content area, so the baseline sits one ascent down.
    const metrics = ctx.measureText(name.text);
    ctx.fillText(name.text, name.left, name.top + metrics.fontBoundingBoxAscent);
  };

/**
 * Where a shape goes: starting right after its phrase, with whatever width is
 * left in the column, centred on the name's ink.
 */
type Frame = Layout & { inkHeight: number; left: number; room: number };

const shapes: Record<HeroShape, (layout: Frame) => Draw> = {
  // "</>" for coding.
  code: (l) => (ctx) => {
    ctx.font = `700 ${l.inkHeight * 1.65}px ${l.monoFamily}`;
    ctx.letterSpacing = `${-0.04 * l.unit}px`;
    ctx.fillStyle = INK;
    ctx.textBaseline = "middle";
    ctx.fillText("</>", l.left, l.centerY);
  },

  // A candlestick chart that grinds upward, for trading.
  markets: (l) => (ctx) => {
    const closes = [0.12, 0.32, 0.2, 0.46, 0.33, 0.6, 0.47, 0.73, 0.6, 0.85, 0.98];
    const width = Math.min(l.room, l.unit * 3.1);
    const height = l.inkHeight * 1.2;
    const step = width / closes.length;
    const body = step * 0.62;
    const wick = Math.max(l.gap * 1.1, body * 0.16);
    const y = (v: number) => l.centerY + height / 2 - v * height;
    closes.forEach((close, i) => {
      const open = i === 0 ? 0.06 : closes[i - 1];
      const high = Math.max(open, close) + 0.05 + (i % 3) * 0.02;
      const low = Math.min(open, close) - 0.04 - ((i + 1) % 2) * 0.03;
      const x = l.left + step * (i + 0.5);
      ctx.fillStyle = close >= open ? UP : DOWN;
      ctx.fillRect(x - wick / 2, y(high), wick, y(low) - y(high));
      const top = y(Math.max(open, close));
      ctx.fillRect(x - body / 2, top, body, Math.max(l.gap * 1.5, y(Math.min(open, close)) - top));
    });
  },

  // A small neural network, for ai.
  ai: (l) => (ctx) => {
    const layers = [3, 4, 4, 2];
    const width = Math.min(l.room, l.unit * 2.4);
    const r = Math.max(l.gap * 1.6, l.inkHeight * 0.11);
    const height = l.inkHeight * 1.3 - r * 2;
    const nodes = layers.map((count, li) =>
      Array.from({ length: count }, (_, j) => ({
        x: l.left + r + (width - 2 * r) * (li / (layers.length - 1)),
        y: l.centerY + (j - (count - 1) / 2) * (height / (Math.max(...layers) - 1)),
      })),
    );
    ctx.strokeStyle = INK;
    ctx.lineWidth = l.gap * 1.05;
    for (let li = 0; li < nodes.length - 1; li++) {
      for (const a of nodes[li]) {
        for (const b of nodes[li + 1]) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = INK;
    for (const node of nodes.flat()) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // A graduation cap, for the university of waterloo.
  waterloo: (l) => (ctx) => {
    // From the board's tip to the end of the tassel, the cap is 0.88 s tall;
    // it's drawn a bit taller than the letters so it carries the same weight.
    const s = (l.inkHeight * 1.25) / 0.88;
    const bw = s * 1.5;
    const bh = s * 0.5;
    const cx = l.left + bw / 2;
    const top = l.centerY - s * 0.44;
    const board = () => {
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx + bw / 2, top + bh / 2);
      ctx.lineTo(cx, top + bh);
      ctx.lineTo(cx - bw / 2, top + bh / 2);
      ctx.closePath();
    };
    ctx.fillStyle = INK;
    ctx.strokeStyle = INK;

    // Skull cap under the board.
    const capW = bw * 0.56;
    const capTop = top + bh * 0.55;
    const capBottom = top + bh + s * 0.24;
    ctx.beginPath();
    ctx.moveTo(cx - capW / 2, capTop);
    ctx.lineTo(cx - capW / 2, capBottom);
    ctx.quadraticCurveTo(cx, capBottom + s * 0.12, cx + capW / 2, capBottom);
    ctx.lineTo(cx + capW / 2, capTop);
    ctx.closePath();
    ctx.fill();

    // Carve a thin gap so the board reads as a separate piece.
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = l.gap * 2.2;
    board();
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
    board();
    ctx.fill();

    // Tassel hanging off the right side of the board.
    const tx = cx + bw * 0.4;
    const cordEnd = top + bh + s * 0.22;
    ctx.lineWidth = l.gap * 1.2;
    ctx.beginPath();
    ctx.moveTo(tx, top + bh * 0.6);
    ctx.lineTo(tx, cordEnd);
    ctx.stroke();
    ctx.fillRect(tx - l.gap * 1.6, cordEnd, l.gap * 3.2, s * 0.16);
  },
};

/** Samples the name (which sets the particle count) and fits every shape to that count. */
export function buildTargets(layout: Layout) {
  const nameDraw = drawName(layout);
  const namePoints = raster(layout, layout.gap, nameDraw);
  const count = namePoints.xy.length / 2;
  if (count < 50) throw new Error("Heading too small to sample");

  // Centre and size every shape on the name's ink, not its box, so they sit on
  // the same line as "hey, i'm" and stay clear of the intro below.
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 1; i < namePoints.xy.length; i += 2) {
    minY = Math.min(minY, namePoints.xy[i]);
    maxY = Math.max(maxY, namePoints.xy[i]);
  }
  const columnRight = layout.column.left + layout.column.width;
  const targets = { name: fit(namePoints, count, 0) } as Record<ShapeKey, Target>;
  for (const key of Object.keys(shapes) as HeroShape[]) {
    const left = layout.shapeLeft[key];
    const draw = shapes[key]({
      ...layout,
      centerY: (minY + maxY) / 2,
      inkHeight: maxY - minY,
      left,
      room: columnRight - left,
    });
    let points = raster(layout, layout.gap, draw);
    // Resample at a spacing that yields about one dot per particle.
    const m = points.xy.length / 2;
    if (m > 0) points = raster(layout, Math.max(1.5, layout.gap * Math.sqrt(m / count)), draw);
    targets[key] = fit(points, count, layout.gap * 0.5);
  }
  return { count, targets };
}
