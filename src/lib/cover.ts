/** Deterministic landscape art for trips without a photo. Same destination → same picture. */

interface Palette {
  sky: [string, string];
  sun: string;
  far: string;
  mid: string;
  near: string;
  base: string;
}

const PALETTES: Palette[] = [
  { sky: ["#7DB9E0", "#DDF0F8"], sun: "#FFFFFF", far: "#9DB6C6", mid: "#5E8A7A", near: "#2F5A4C", base: "#1D8A99" },
  { sky: ["#F4A46B", "#FBE5C8"], sun: "#FFF3DC", far: "#DB9470", mid: "#B4634A", near: "#7A3E35", base: "#C9875F" },
  { sky: ["#9FD3E6", "#F2F7F2"], sun: "#FFFBEA", far: "#A9C3BF", mid: "#6C9A8B", near: "#3D6E5F", base: "#2B7FA3" },
  { sky: ["#F48FA1", "#FFD8BC"], sun: "#FFE9C6", far: "#C77A92", mid: "#8E4E6E", near: "#4E2C4A", base: "#6B4A78" },
  { sky: ["#B9D8C2", "#F3EEDB"], sun: "#FFF5D1", far: "#8FB49A", mid: "#4F7F5E", near: "#284F3A", base: "#3E6B4A" },
  { sky: ["#2E3F6E", "#8193C4"], sun: "#F4F1E4", far: "#5A6A96", mid: "#3A4A74", near: "#1F2A4A", base: "#24406A" },
];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(r: () => number, baseY: number, amp: number, minStep: number, maxStep: number): string {
  let x = -10;
  let up = true;
  const pts = ["M -10 300", `L -10 ${baseY}`];
  while (x < 310) {
    x += minStep + r() * (maxStep - minStep);
    const y = up ? baseY - amp * (0.55 + r() * 0.45) : baseY - amp * r() * 0.3;
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    up = !up;
  }
  pts.push("L 310 300 Z");
  return pts.join(" ");
}

export interface CoverArt {
  palette: Palette;
  sun: { cx: number; cy: number; r: number };
  ridges: { d: string; fill: string }[];
  baseY: number;
  shimmer: { x: number; y: number; w: number; opacity: number }[];
}

export function coverArt(destination: string): CoverArt {
  const seed = hash(destination.toLowerCase());
  const r = seededRandom(seed);
  const palette = PALETTES[seed % PALETTES.length];
  const sun = { cx: 60 + r() * 180, cy: 55 + r() * 45, r: 20 + r() * 14 };
  const water = r() > 0.35;
  const ridges = [
    { d: ridge(r, 175, 85, 35, 70), fill: palette.far },
    { d: ridge(r, 205, 60, 30, 55), fill: palette.mid },
    { d: ridge(r, 232, 34, 22, 40), fill: palette.near },
  ];
  const shimmer = water
    ? Array.from({ length: 5 }, (_, i) => {
        const w = 20 + r() * 50;
        return { x: sun.cx - w / 2 + (r() - 0.5) * 30, y: 236 + i * 11, w, opacity: 0.35 - i * 0.05 };
      })
    : [];
  return { palette, sun, ridges, baseY: water ? 228 : 250, shimmer };
}
