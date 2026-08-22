/** Native 2D brand-orb renderer (no iframe). Ported from ThreeUI brand-orbs-v2. */

const TAU = Math.PI * 2;

type Accent = [number, number, number];
type Dot = {
  x: number;
  y: number;
  z: number;
  r: number;
  v: number;
  a?: number;
  c?: Accent;
};
type DrawOpts = { mini: boolean; light: boolean; accent: Accent | null };

const MARK_PATHS: Record<string, string> = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
};

type MarkConfig = {
  key: string;
  n: number;
  nMini: number;
  motion: "diag" | "scan" | "sweep";
  invert?: "circle" | "box";
  recenter?: boolean;
  v: number;
  fit?: number;
  speed?: number;
  accent?: Accent;
};

const MARK_CONFIG: Record<string, MarkConfig> = {
  github: {
    key: "github",
    n: 28,
    nMini: 14,
    motion: "diag",
    invert: "circle",
    recenter: true,
    v: 0.78,
    fit: 0.72,
  },
  linkedin: {
    key: "linkedin",
    n: 28,
    nMini: 14,
    motion: "scan",
    speed: 0.38,
    invert: "box",
    accent: [10, 102, 194],
    v: 0.82,
    fit: 0.78,
  },
};

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function lerp(a: number, b: number, m: number) {
  return a + (b - a) * m;
}

function rscale(size: number) {
  const base = Math.pow(size / 300, 0.6);
  // Homepage orbs are 56px; the engine was tuned for ~300px canvases.
  return size < 80 ? Math.max(1.35, base * 4.6) : base;
}

function proj(yaw: number, tilt: number, cx: number, cy: number, s: number) {
  const st = Math.sin(tilt);
  const ct = Math.cos(tilt);
  const sy = Math.sin(yaw);
  const cyw = Math.cos(yaw);
  return (x: number, y: number, z: number): [number, number, number] => {
    const px = x * cyw + z * sy;
    const pz = -x * sy + z * cyw;
    const py = y * ct - pz * st;
    const z2 = y * st + pz * ct;
    return [cx + px * s, cy - py * s, z2];
  };
}

function paint(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  accent: Accent | null,
  sat: number,
  rMin: number,
  light: boolean,
) {
  dots.sort((a, b) => a.z - b.z);
  for (const d of dots) {
    const al = d.a ?? 1;
    if (al < 0.02) continue;
    const v = clamp01(d.v);
    const g = v * 255;
    const acc = d.c || accent;
    const st = d.c ? 0.95 : sat;
    let r = g;
    let gg = g;
    let b = g;
    if (acc && st) {
      const lift = Math.min(1, v * 1.12);
      r = g * (1 - st) + acc[0] * lift * st;
      gg = g * (1 - st) + acc[1] * lift * st;
      b = g * (1 - st) + acc[2] * lift * st;
    }
    if (v > 0.85) {
      const w = ((v - 0.85) / 0.15) * 0.45;
      r += (255 - r) * w;
      gg += (255 - gg) * w;
      b += (255 - b) * w;
    }
    if (light) {
      // Engine paints bright particles for dark pages. On the white homepage
      // invert luminance in-canvas (no CSS filter) so marks read as ink.
      r = 255 - r;
      gg = 255 - gg;
      b = 255 - b;
      if (acc) {
        const mix = 0.55;
        r = lerp(r, acc[0] * 0.72, mix);
        gg = lerp(gg, acc[1] * 0.72, mix);
        b = lerp(b, acc[2] * 0.86, mix);
      }
    }
    ctx.fillStyle = `rgba(${r | 0},${gg | 0},${b | 0},${al})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, Math.max(rMin, d.r), 0, TAU);
    ctx.fill();
  }
}

const maskCache = new Map<string, Array<[number, number]>>();

function pathDots(
  key: string,
  d: string,
  n: number,
  invert?: "circle" | "box",
  recenter?: boolean,
) {
  const ck = `${key}-${n}-${invert ?? ""}-${recenter ? "rc" : ""}`;
  const cached = maskCache.get(ck);
  if (cached) return cached;

  const px = 200;
  const c = document.createElement("canvas");
  c.width = c.height = px;
  const g = c.getContext("2d");
  const pts: Array<[number, number]> = [];
  if (!g) {
    maskCache.set(ck, pts);
    return pts;
  }
  g.setTransform(px / 24, 0, 0, px / 24, 0, 0);
  g.fillStyle = "#fff";
  g.fill(new Path2D(d));
  const img = g.getImageData(0, 0, px, px).data;
  let x0 = px;
  let x1 = -1;
  let y0 = px;
  let y1 = -1;
  for (let j = 0; j < px; j++) {
    for (let i = 0; i < px; i++) {
      if (img[(j * px + i) * 4 + 3] > 128) {
        if (i < x0) x0 = i;
        if (i > x1) x1 = i;
        if (j < y0) y0 = j;
        if (j > y1) y1 = j;
      }
    }
  }
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const m = Math.max(x1 - x0, y1 - y0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const sx = mx + ((i + 0.5) / n * 2 - 1) * (m / 2);
      const sy = my + ((j + 0.5) / n * 2 - 1) * (m / 2);
      const ix = Math.round(sx);
      const iy = Math.round(sy);
      if (ix < 0 || iy < 0 || ix >= px || iy >= px) continue;
      const on = img[(iy * px + ix) * 4 + 3] > 128;
      const nx = (sx - mx) / (m / 2);
      const ny = (sy - my) / (m / 2);
      if (invert) {
        if (on) continue;
        if (invert === "circle" && Math.hypot(nx, ny) > 0.96) continue;
        if (
          invert === "box" &&
          Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4) > Math.pow(0.9, 4)
        ) {
          continue;
        }
      } else if (!on) {
        continue;
      }
      pts.push([nx, ny]);
    }
  }
  if (recenter && pts.length) {
    let ax0 = 1e9;
    let ax1 = -1e9;
    let ay0 = 1e9;
    let ay1 = -1e9;
    for (const [qx, qy] of pts) {
      if (qx < ax0) ax0 = qx;
      if (qx > ax1) ax1 = qx;
      if (qy < ay0) ay0 = qy;
      if (qy > ay1) ay1 = qy;
    }
    const ox = (ax0 + ax1) / 2;
    const oy = (ay0 + ay1) / 2;
    for (const q of pts) {
      q[0] -= ox;
      q[1] -= oy;
    }
  }
  maskCache.set(ck, pts);
  return pts;
}

function drawSolidLogo(
  ctx: CanvasRenderingContext2D,
  size: number,
  cfg: MarkConfig,
  light: boolean,
) {
  const path = MARK_PATHS[cfg.key];
  if (!path) return;
  const fit = cfg.fit ?? 0.72;
  const scale = (size * fit) / 24;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  if (cfg.key === "linkedin") {
    ctx.fillStyle = light ? "rgb(10,102,194)" : "rgb(80,148,226)";
  } else {
    ctx.fillStyle = light ? "rgb(17,17,17)" : "rgb(236,236,236)";
  }
  ctx.fill(new Path2D(path));
  ctx.restore();
}

function drawMark(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  o: DrawOpts,
  cfg: MarkConfig,
) {
  const path = MARK_PATHS[cfg.key];
  if (!path) return;
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * (cfg.fit ?? 0.88);
  const rs = rscale(size) * (o.mini ? 1.8 : 1);
  const p = proj(0.15 * Math.sin(t * 0.4), 0.13 * Math.sin(t * 0.31), cx, cy, R);
  // On the light homepage, inverted holes read as empty white. Paint the
  // mark itself so GitHub/LinkedIn stay visible.
  const invert = o.light ? undefined : cfg.invert;
  const pts = pathDots(
    cfg.key,
    path,
    o.mini ? cfg.nMini : cfg.n,
    invert,
    invert ? cfg.recenter : false,
  );
  const wave = ((((t * (cfg.speed ?? 0.4)) % 1) + 1) % 1) * 2.4 - 1.2;
  const dots: Dot[] = [];
  for (const [gx, gy] of pts) {
    let crest: number;
    if (cfg.motion === "scan") {
      crest = Math.exp(-Math.pow(gy - wave, 2) / 0.05);
    } else if (cfg.motion === "sweep") {
      const ph = (((Math.atan2(gy, gx) / TAU + 0.5 - t * 0.3) % 1) + 1) % 1;
      crest = Math.exp(-Math.pow(ph - 0.5, 2) / 0.014);
    } else {
      crest = Math.exp(-Math.pow((gx - gy) * 0.5 - wave, 2) / 0.05);
    }
    const [x, y, z] = p(gx, -gy, 0);
    const dep = (z + 1) / 2;
    dots.push({
      x,
      y,
      z,
      r: (0.78 + 0.72 * dep + 0.45 * crest) * rs,
      v: (cfg.v ?? 0.58) + 0.15 * dep + 0.3 * crest,
    });
  }
  paint(
    ctx,
    dots,
    cfg.accent ?? o.accent,
    cfg.accent ? 0.9 : 0,
    size < 80 ? 1.15 : 0.3,
    o.light,
  );
}

function drawFallback(
  ctx: CanvasRenderingContext2D,
  size: number,
  t: number,
  o: DrawOpts,
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = (size / 2) * 0.8;
  const rs = rscale(size) * (o.mini ? 1.8 : 1);
  const p = proj(t * 0.26, 0.35 + 0.08 * Math.sin(t * 0.4), cx, cy, R);
  const dots: Dot[] = [];
  const n = o.mini ? 18 : 42;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + t * 0.2;
    const [x, y, z] = p(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0);
    const dep = (z + 1) / 2;
    dots.push({
      x,
      y,
      z,
      r: (0.8 + 1.1 * dep) * rs,
      v: 0.45 + 0.4 * dep,
    });
  }
  paint(ctx, dots, o.accent, o.accent ? 0.85 : 0, 0.3, o.light);
}

export type NativeOrbControls = {
  variant: string;
  size: number;
  light: boolean;
  getPaused: () => boolean;
  getSpeed: () => number;
};

export function mountNativeOrb(
  canvas: HTMLCanvasElement,
  controls: NativeOrbControls,
): () => void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  let timer = 0;
  let frames = 0;
  let visible = true;
  let running = true;

  const paintFrame = (t: number) => {
    const size = controls.size;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const cfg = MARK_CONFIG[controls.variant];
    const o: DrawOpts = {
      mini: size < 32,
      light: controls.light,
      accent: cfg?.accent ?? null,
    };
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 0.5, 0, TAU);
    ctx.fillStyle = controls.light
      ? "rgba(0,0,0,0.06)"
      : "rgba(255,255,255,0.08)";
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 0.5, 0, TAU);
    ctx.clip();
    if (cfg) {
      drawSolidLogo(ctx, size, cfg, controls.light);
      drawMark(ctx, size, t, o, cfg);
    } else {
      drawFallback(ctx, size, t, o);
    }
    ctx.restore();
  };

  const staticT = controls.variant === "linkedin" ? 1.2 : 1.1;
  paintFrame(staticT);
  if (reduced) {
    return () => {
      running = false;
    };
  }

  const io =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry?.isIntersecting ?? true;
        });
  io?.observe(canvas);

  const tick = () => {
    if (!running) return;
    frames += 1;
    if (
      visible &&
      document.visibilityState !== "hidden" &&
      !controls.getPaused()
    ) {
      paintFrame((performance.now() / 1000) * controls.getSpeed());
    }
    if (!timer) raf = window.requestAnimationFrame(tick);
  };
  raf = window.requestAnimationFrame(tick);
  const watchdog = window.setTimeout(() => {
    if (frames === 0 && running) {
      window.cancelAnimationFrame(raf);
      timer = window.setInterval(tick, 33);
    }
  }, 400);

  return () => {
    running = false;
    window.cancelAnimationFrame(raf);
    window.clearTimeout(watchdog);
    if (timer) window.clearInterval(timer);
    io?.disconnect();
  };
}
