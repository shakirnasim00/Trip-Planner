"use client";

import { type CSSProperties, useLayoutEffect, useRef } from "react";
import { fmt, fmtTime, ordinal, parseIso, toIso, toMinutes } from "@/lib/dates";
import { updateTrip } from "@/lib/tripStore";
import type { Plan, Trip } from "@/lib/types";
import Capsule from "./Capsule";
import styles from "./Itinerary.module.css";

interface Props {
  trip: Trip;
  days: string[];
}

// Keep in sync with --hour and .capsule height in Itinerary.module.css
const HOUR = 64;
const CAPSULE = 56;
const GAP = 6;
const HOURS = Array.from({ length: 24 }, (_, h) => h);

/** "Day 1 · October 1st" headings floating over a soft track per day, with plans as capsules at their start time. */
export default function DayCalendar({ trip, days }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const today = toIso(new Date());

  // Open scrolled to an hour before the earliest plan, or 8 AM
  useLayoutEffect(() => {
    const timed = trip.plans.filter((p) => p.start).map((p) => toMinutes(p.start!));
    const first = timed.length ? Math.max(0, Math.floor(Math.min(...timed) / 60) - 1) : 8;
    if (scroller.current) scroller.current.scrollTop = Math.min(first, 8) * HOUR - 12; // keep that hour's label visible
    // Only on first render — don't yank the view around while the user adds plans
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function remove(plan: Plan) {
    updateTrip(trip.id, { plans: trip.plans.filter((p) => p.id !== plan.id) });
  }

  return (
    <div className={styles.scroller} ref={scroller} style={{ "--days": days.length } as CSSProperties}>
      <div className={styles.grid}>
        <div className={styles.corner} />
        {days.map((day, i) => {
          const date = parseIso(day);
          const allDay = trip.plans.filter((p) => p.day === day && !p.start);
          return (
            <div key={day} className={`${styles.dayHead} ${day === today ? styles.isToday : ""}`}>
              <h3>
                Day {i + 1} <span aria-hidden>·</span> {fmt(date, { month: "long" })} {ordinal(date.getDate())}
              </h3>
              <span className={styles.weekday}>{fmt(date, { weekday: "long" })}</span>
              {allDay.length > 0 && (
                <ul className={styles.allDay}>
                  {allDay.map((p) => (
                    <li key={p.id}>
                      <Capsule kind={p.kind} title={p.title} onRemove={() => remove(p)} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <div className={styles.gutter} aria-hidden>
          {HOURS.slice(1).map((h) => (
            <span key={h} style={{ top: h * HOUR }}>
              {fmtTime(`${h}:00`)}
            </span>
          ))}
        </div>
        {days.map((day) => (
          <div key={day} className={styles.track}>
            {stack(trip.plans.filter((p) => p.day === day && p.start)).map(({ plan, top }) => (
              <Capsule
                key={plan.id}
                kind={plan.kind}
                title={plan.title}
                detail={timeLabel(plan)}
                onRemove={() => remove(plan)}
                style={{ top }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function timeLabel(plan: Plan): string | undefined {
  if (!plan.start) return undefined;
  return plan.end ? `${fmtTime(plan.start)} – ${fmtTime(plan.end)}` : fmtTime(plan.start);
}

/** Place each capsule at its start time, nudging it down when it would sit on top of the one before. */
function stack(plans: Plan[]) {
  const sorted = [...plans].sort((a, b) => toMinutes(a.start!) - toMinutes(b.start!));
  let floor = 0;
  return sorted.map((plan) => {
    const top = Math.max((toMinutes(plan.start!) / 60) * HOUR, floor);
    floor = top + CAPSULE + GAP;
    return { plan, top };
  });
}
