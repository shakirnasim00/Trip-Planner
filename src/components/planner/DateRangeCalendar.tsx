"use client";

import { useMemo, useState } from "react";
import { fmt, nightsBetween, parseIso, startOfToday, toIso } from "@/lib/dates";
import { ChevronLeft, ChevronRight } from "../icons";
import styles from "./Calendar.module.css";

interface Props {
  start: string | null;
  end: string | null;
  notSure: boolean;
  onChange: (start: string | null, end: string | null) => void;
  onNotSureChange: (notSure: boolean) => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DateRangeCalendar({ start, end, notSure, onChange, onNotSureChange }: Props) {
  const today = useMemo(startOfToday, []);
  const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [viewMonth, setViewMonth] = useState(() =>
    start ? new Date(parseIso(start).getFullYear(), parseIso(start).getMonth(), 1) : firstOfThisMonth,
  );
  const [hover, setHover] = useState<string | null>(null);

  // While picking an end date, preview the range up to the hovered day
  const tail = end ?? (start && hover && hover > start ? hover : null);

  function pick(key: string) {
    if (!start || end || key < start) onChange(key, null);
    else if (key > start) onChange(start, key);
  }

  function shiftMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  const yearFmt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  let summary: { title: string; sub: string };
  if (notSure) summary = { title: "No dates yet", sub: "You can add them whenever you're ready" };
  else if (start && end) {
    const n = nightsBetween(start, end);
    summary = { title: `${n} night${n === 1 ? "" : "s"}`, sub: `${fmt(parseIso(start), yearFmt)} – ${fmt(parseIso(end), yearFmt)}` };
  } else if (start) {
    summary = { title: "Select an end date", sub: `Starting ${fmt(parseIso(start), { weekday: "short", month: "short", day: "numeric" })}` };
  } else summary = { title: "Select dates", sub: "Tap a start date, then an end date" };

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.summary} aria-live="polite">
          <strong>{summary.title}</strong>
          <span>{summary.sub}</span>
        </div>
        <button className={styles.toggle} aria-pressed={notSure} onClick={() => onNotSureChange(!notSure)}>
          I&apos;m not sure yet
        </button>
      </div>

      <div className={`${styles.calendar} ${notSure ? styles.off : ""}`} aria-disabled={notSure}>
        <div className={styles.nav}>
          <button
            aria-label="Previous month"
            disabled={viewMonth.getTime() <= firstOfThisMonth.getTime()}
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft />
          </button>
          <button aria-label="Next month" onClick={() => shiftMonth(1)}>
            <ChevronRight />
          </button>
        </div>

        <div className={styles.months} onMouseLeave={() => setHover(null)}>
          {[0, 1].map((offset) => {
            const month = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1);
            const lead = month.getDay();
            const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
            return (
              <div className={styles.month} key={offset}>
                <h3>{fmt(month, { month: "long", year: "numeric" })}</h3>
                <div className={styles.dow}>
                  {WEEKDAYS.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                <div className={styles.days}>
                  {Array.from({ length: lead }, (_, i) => (
                    <span key={`pad-${i}`} />
                  ))}
                  {Array.from({ length: count }, (_, i) => {
                    const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
                    const key = toIso(date);
                    const past = date < today;
                    const isStart = key === start;
                    const isEnd = !!end && key === end;
                    const inRange = !!(start && tail && key > start && key < tail) || (!end && key === tail);
                    const cls = [
                      styles.day,
                      isStart && styles.start,
                      isEnd && styles.end,
                      isStart && !tail && styles.solo,
                      inRange && styles.inRange,
                      date.getTime() === today.getTime() && styles.today,
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <button
                        key={key}
                        className={cls}
                        disabled={past || notSure}
                        aria-pressed={isStart || isEnd}
                        aria-label={fmt(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        onMouseEnter={() => setHover(key)}
                        onClick={() => pick(key)}
                      >
                        <span>{i + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button className={styles.clear} disabled={!start} onClick={() => onChange(null, null)}>
          Clear dates
        </button>
      </div>
    </>
  );
}
