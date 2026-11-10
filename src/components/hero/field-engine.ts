import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { HERO_PREFIX } from "./hero-copy";
import type { HeroShape } from "./hero-store";
import { buildTargets, type Layout, type ShapeKey, type Target } from "./shapes";

/**
 * The hero's dot field. The heading's name is resampled into a few thousand
 * dots that sit exactly where the HTML text was, so the handoff is invisible.
 * From there the dots:
 * - spring back into place after the cursor pushes them away (and lifts them
 *   towards the camera),
 * - morph into other shapes when a highlighted word in the intro is hovered,
 * - shimmer with a slow depth wave and tilt gently with the pointer.
 * Physics runs on the CPU (cheap at this count); three.js only draws points.
 */

export type Field = { setShape(shape: HeroShape | null): void; destroy(): void };

type Options = {
  container: HTMLElement;
  /** The inline element holding the name in the HTML heading. */
  anchor: HTMLElement;
  /** Called once the field is drawn and the HTML name can fade out. */
  onLive(): void;
  /** Called if WebGL dies, so the HTML name can come back. */
  onLost(): void;
};

const FOV = 30;
const SPRING = 0.045;
const DAMPING = 0.84;

const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  uniform vec2 uHalf;
  uniform vec2 uPivot;
  uniform vec2 uTilt;
  uniform float uDot;
  uniform float uPixelRatio;
  uniform float uCamZ;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Positions arrive in container pixels (y down). Tilt them around the
    // name's centre, then move into world space, where 1 unit = 1px at z = 0.
    vec3 q = vec3(position.x - uPivot.x, uPivot.y - position.y, position.z);
    float cy = cos(uTilt.y), sy = sin(uTilt.y);
    q = vec3(cy * q.x + sy * q.z, q.y, -sy * q.x + cy * q.z);
    float cx = cos(uTilt.x), sx = sin(uTilt.x);
    q = vec3(q.x, cx * q.y - sx * q.z, sx * q.y + cx * q.z);
    vec3 world = vec3(q.x + uPivot.x - uHalf.x, q.y + uHalf.y - uPivot.y, q.z);

    vec4 mv = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uDot * aSize * uPixelRatio * (uCamZ / -mv.z);
    vColor = aColor;
    vAlpha = clamp(0.9 + position.z * 0.006, 0.45, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.36, 0.5, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

const shapeKeys: Record<HeroShape, true> = { waterloo: true, code: true, markets: true, ai: true };

function measure(container: HTMLElement, anchor: HTMLElement, monoFamily: string): Layout {
  const box = container.getBoundingClientRect();
  const name = anchor.getBoundingClientRect();
  const column = anchor.closest<HTMLElement>(".column") ?? container;
  const col = column.getBoundingClientRect();
  const colStyle = getComputedStyle(column);
  const style = getComputedStyle(anchor);
  const unit = parseFloat(style.fontSize);
  const padLeft = parseFloat(colStyle.paddingLeft);
  const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  const nameLeft = name.left - box.left;
  const columnLeft = col.left - box.left + padLeft;

  // Each shape starts right after its own phrase. The phrases are drawn over
  // "hey, i'm", so shift by the difference in width between the two. When the
  // name has wrapped onto its own line (phones), shapes start at the column edge.
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) throw new Error("2D canvas unavailable");
  probe.font = font;
  probe.letterSpacing = letterSpacing;
  const width = (text: string) => probe.measureText(`${text} `).width;
  const ownLine = nameLeft - columnLeft < 4;
  const shapeLeft = {} as Record<HeroShape, number>;
  for (const key of Object.keys(shapeKeys) as HeroShape[]) {
    shapeLeft[key] = ownLine ? columnLeft : nameLeft + width(HERO_PREFIX[key]) - width(HERO_PREFIX.name);
  }

  return {
    width: box.width,
    height: box.height,
    unit,
    // Spacing scales with the type, with a floor so phone-sized text still gets a few dots per stroke.
    gap: Math.min(3.2, Math.max(1.6, unit / 46)),
    name: {
      text: anchor.textContent?.trim() ?? "",
      font,
      letterSpacing,
      left: nameLeft,
      top: name.top - box.top,
    },
    column: {
      left: columnLeft,
      width: col.width - padLeft - parseFloat(colStyle.paddingRight),
    },
    shapeLeft,
    centerY: name.top - box.top + name.height / 2,
    monoFamily,
  };
}

export async function createField({ container, anchor, onLive, onLost }: Options): Promise<Field> {
  const monoFamily =
    getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() ||
    "ui-monospace, monospace";
  // The mono font isn't used elsewhere on the page, so make sure it's loaded before drawing "</>".
  await document.fonts.load(`700 64px ${monoFamily}`).catch(() => undefined);

  const renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 500ms ease";
  container.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 6000);
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uHalf: { value: new Vector2() },
      uPivot: { value: new Vector2() },
      uTilt: { value: new Vector2() },
      uDot: { value: 2 },
      uPixelRatio: { value: 1 },
      uCamZ: { value: 1000 },
    },
  });
  let geometry = new BufferGeometry();
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  // Simulation state, rebuilt whenever the layout changes.
  let count = 0;
  let unit = 0;
  let nameLeft = 0;
  let targets = {} as Record<ShapeKey, Target>;
  let pos = new Float32Array(0);
  let vel = new Float32Array(0);
  let col = new Float32Array(0);
  let seed = new Float32Array(0);
  let switchAt = new Float64Array(0);
  let kicked = new Uint8Array(0);
  let current: ShapeKey = "name";
  let previous: ShapeKey = "name";

  const build = () => {
    const layout = measure(container, anchor, monoFamily);
    const built = buildTargets(layout);
    count = built.count;
    targets = built.targets;
    unit = layout.unit;
    nameLeft = layout.name.left;

    pos = new Float32Array(count * 3);
    vel = new Float32Array(count * 3);
    col = new Float32Array(count * 3);
    seed = new Float32Array(count);
    switchAt = new Float64Array(count);
    kicked = new Uint8Array(count).fill(1);
    const home = targets[current];
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = home.xy[i * 2];
      pos[i * 3 + 1] = home.xy[i * 2 + 1];
      col.set(home.rgb.subarray(i * 3, i * 3 + 3), i * 3);
      seed[i] = Math.random();
      sizes[i] = 0.85 + Math.random() * 0.3;
    }
    previous = current;

    geometry.dispose();
    geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(pos, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("aColor", new BufferAttribute(col, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    points.geometry = geometry;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(layout.width, layout.height, false);
    camera.aspect = layout.width / layout.height;
    camera.position.set(0, 0, layout.height / 2 / Math.tan((FOV * Math.PI) / 360));
    camera.updateProjectionMatrix();

    const u = material.uniforms;
    u.uHalf.value.set(layout.width / 2, layout.height / 2);
    u.uPivot.value.set(layout.name.left + anchor.getBoundingClientRect().width / 2, layout.centerY);
    u.uDot.value = layout.gap * 0.95;
    u.uPixelRatio.value = dpr;
    u.uCamZ.value = camera.position.z;
  };

  try {
    build();
  } catch (error) {
    // Nothing to show: release the GPU context instead of leaving a hidden canvas behind.
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
    throw error;
  }

  // Pointer, in viewport coordinates.
  const pointer = { x: 0, y: 0, active: false };
  const onPointer = (e: PointerEvent) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };
  const onRelease = (e?: PointerEvent) => {
    if (!e || e.pointerType === "touch") pointer.active = false;
  };
  const onLeave = () => {
    pointer.active = false;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  window.addEventListener("pointerup", onRelease, { passive: true });
  window.addEventListener("pointercancel", onLeave, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);

  let raf = 0;
  // Set once WebGL is gone, so scrolling back to the hero doesn't restart the loop.
  let lost = false;
  let last = 0;
  let time = 0;
  // Infinity until the crossfade starts, which keeps the intro wave and tilt off until then.
  let liveAt = Infinity;
  const tilt = { x: 0, y: 0 };

  const step = (now: number) => {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    time += dt;
    const k = dt * 60; // 1 at 60fps, so the constants read as "per frame"
    const damp = Math.pow(DAMPING, k);
    const since = now - liveAt;

    const box = container.getBoundingClientRect();
    const mx = pointer.x - box.left;
    const my = pointer.y - box.top;
    const radius = unit * 0.75;
    const r2 = radius * radius;
    const push = pointer.active && mx > -radius && my > -radius && mx < box.width + radius && my < box.height + radius;

    // Tilt towards the pointer, but only once the intro has played.
    const pivot = material.uniforms.uPivot.value as Vector2;
    const wantX = pointer.active && since > 900 ? Math.max(-1, Math.min(1, (my - pivot.y) / window.innerHeight)) * 0.1 : 0;
    const wantY = pointer.active && since > 900 ? Math.max(-1, Math.min(1, (mx - pivot.x) / window.innerWidth)) * 0.16 : 0;
    tilt.x += (wantX - tilt.x) * Math.min(1, 0.05 * k);
    tilt.y += (wantY - tilt.y) * Math.min(1, 0.05 * k);
    (material.uniforms.uTilt.value as Vector2).set(tilt.x, tilt.y);

    const colorEase = Math.min(1, 0.1 * k);
    for (let i = 0; i < count; i++) {
      const i2 = i * 2;
      const i3 = i * 3;
      const switched = now >= switchAt[i];
      const target = targets[switched ? current : previous];
      if (switched && !kicked[i]) {
        // Fling each dot towards the camera as it leaves, so morphs swirl through depth.
        kicked[i] = 1;
        vel[i3] += (seed[i] - 0.5) * 6;
        vel[i3 + 1] += (Math.random() - 0.5) * 6;
        vel[i3 + 2] += 14 + seed[i] * 28;
      }

      const tx = target.xy[i2];
      let ty = target.xy[i2 + 1];
      // Slow depth shimmer across the whole field.
      let tz = Math.sin(tx * 0.016 + time * 1.3) * Math.cos(ty * 0.02 + time * 0.9) * 6;
      if (since < 2200) {
        // Intro: a wave lifts the dots left to right as the field takes over.
        const d = tx - (nameLeft - 80 + since * 0.55);
        const w = Math.exp(-(d * d) / 3200);
        ty -= w * 10;
        tz += w * 34;
      }

      let ax = (tx - pos[i3]) * SPRING;
      let ay = (ty - pos[i3 + 1]) * SPRING;
      let az = (tz - pos[i3 + 2]) * SPRING;

      if (push) {
        const dx = pos[i3] - mx;
        const dy = pos[i3 + 1] - my;
        const dd = dx * dx + dy * dy;
        if (dd < r2) {
          const d = Math.sqrt(dd) + 0.001;
          const f = (1 - d / radius) ** 2 * 2.4;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
          az += f * 1.8;
        }
      }

      vel[i3] = (vel[i3] + ax * k) * damp;
      vel[i3 + 1] = (vel[i3 + 1] + ay * k) * damp;
      vel[i3 + 2] = (vel[i3 + 2] + az * k) * damp;
      pos[i3] += vel[i3] * k;
      pos[i3 + 1] += vel[i3 + 1] * k;
      pos[i3 + 2] += vel[i3 + 2] * k;

      col[i3] += (target.rgb[i3] - col[i3]) * colorEase;
      col[i3 + 1] += (target.rgb[i3 + 1] - col[i3 + 1]) * colorEase;
      col[i3 + 2] += (target.rgb[i3 + 2] - col[i3 + 2]) * colorEase;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aColor.needsUpdate = true;
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    step(now);
    renderer.render(scene, camera);
  };
  const start = () => {
    if (raf || lost) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  // Only animate while the hero is on screen.
  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
  io.observe(container);

  // Re-sample when the layout changes (resize, font swap); dots snap to the new spots.
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let firstResize = true;
  const ro = new ResizeObserver(() => {
    if (firstResize) {
      firstResize = false;
      return;
    }
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      try {
        build();
      } catch {
        // Keep the old layout if sampling fails mid-resize.
      }
    }, 150);
  });
  ro.observe(container);

  const onContextLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(fadeIn);
    stop();
    canvas.style.opacity = "0";
    onLost();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  // Draw the first frame invisibly, then crossfade from the HTML text.
  renderer.render(scene, camera);
  // Kept so destroy() can cancel it: firing after teardown would mark the hero live with no field.
  const fadeIn = requestAnimationFrame((now) => {
    liveAt = now;
    canvas.style.opacity = "1";
    onLive();
  });

  return {
    setShape(shape) {
      const next: ShapeKey = shape ?? "name";
      if (next === current) return;
      previous = current;
      current = next;
      // Stagger the switch left to right (particles are ordered by x), with a little noise.
      const now = performance.now();
      for (let i = 0; i < count; i++) {
        switchAt[i] = now + (i / count) * 260 + seed[i] * 140;
        kicked[i] = 0;
      }
    },
    destroy() {
      cancelAnimationFrame(fadeIn);
      stop();
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
