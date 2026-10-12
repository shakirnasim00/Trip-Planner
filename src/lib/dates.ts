/** All trip dates are stored as local-time ISO strings: yyyy-mm-dd */

export function toIso(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function fmt(d: Date, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }): string {
  return d.toLocaleDateString("en-US", opts);
}

export function nightsBetween(start: string, end: string): number {
  return Math.round((parseIso(end).getTime() - parseIso(start).getTime()) / 86_400_000);
}

/** "Oct 15 – 20" or "Oct 28 – Nov 2" */
export function shortRange(start: string, end: string): string {
  const s = parseIso(start);
  const e = parseIso(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) return `${fmt(s)} – ${e.getDate()}`;
  return `${fmt(s)} – ${fmt(e)}`;
}

/** "October 15 – 20, 2026" */
export function longRange(start: string, end: string): string {
  const s = parseIso(start);
  const e = parseIso(end);
  const md: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  if (s.getFullYear() !== e.getFullYear()) {
    return `${fmt(s, { ...md, year: "numeric" })} – ${fmt(e, { ...md, year: "numeric" })}`;
  }
  if (s.getMonth() === e.getMonth()) return `${fmt(s, md)} – ${e.getDate()}, ${e.getFullYear()}`;
  return `${fmt(s, md)} – ${fmt(e, md)}, ${e.getFullYear()}`;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
