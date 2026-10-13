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

export function addDays(iso: string, n: number): string {
  const d = parseIso(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
}

/** Every date of the trip, first to last day inclusive */
export function tripDays(start: string, end: string): string[] {
  return Array.from({ length: nightsBetween(start, end) + 1 }, (_, i) => addDays(start, i));
}

/** 1 → "1st", 22 → "22nd", 13 → "13th" */
export function ordinal(n: number): string {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

/** "HH:MM" → minutes since midnight */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "14:30" → "2:30 PM", "09:00" → "9 AM" */
export function fmtTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const hour = h % 12 || 12;
  return `${hour}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}
