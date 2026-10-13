"use client";

import { type CSSProperties, useLayoutEffect, useRef } from "react";
import { fmt, fmtTime, ordinal, parseIso, toIso, toMinutes } from "@/lib/dates";
import { updateTrip } from "@/lib/tripStore";
import type { Plan, Trip } from "@/lib/types";
import { CloseIcon, PlanIcon } from "../icons";
import styles from "./Itinerary.module.css";

interface Props {
  trip: Trip;
  days: string[];
}

const HOUR = 48; // px per hour — keep in sync with --hour in Itinerary.module.css
const HOURS = Array.from({ length: 24 }, (_, h) => h);

/** "Day 1 · October 1st" columns with a scrolling 24-hour grid, like a calendar's multi-day view. */
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
    <div className={styles.calendar}>
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
                      <li key={p.id} className={`${styles.chip} ${styles[p.kind]}`}>
                        <PlanIcon kind={p.kind} />
                        <span>{p.title}</span>
                        <RemoveButton plan={p} onRemove={remove} />
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
            <div key={day} className={styles.dayBody}>
              {layout(trip.plans.filter((p) => p.day === day && p.start)).map(({ plan, lane, lanes }) => {
                const top = (toMinutes(plan.start!) / 60) * HOUR;
                const height = (Math.max(duration(plan), 30) / 60) * HOUR;
                return (
                  <div
                    key={plan.id}
                    className={`${styles.event} ${styles[plan.kind]} ${height < 40 ? styles.short : ""}`}
                    style={{
                      top,
                      height: height - 2,
                      left: `calc(${(lane / lanes) * 100}% + 4px)`,
                      width: `calc(${100 / lanes}% - 8px)`,
                    }}
                  >
                    <strong>
                      <PlanIcon kind={plan.kind} />
                      {plan.title}
                    </strong>
                    <span>
                      {fmtTime(plan.start!)}
                      {plan.end && ` – ${fmtTime(plan.end)}`}
                    </span>
                    <RemoveButton plan={plan} onRemove={remove} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RemoveButton({ plan, onRemove }: { plan: Plan; onRemove: (p: Plan) => void }) {
  return (
    <button className={styles.remove} aria-label={`Remove ${plan.title}`} onClick={() => onRemove(plan)}>
      <CloseIcon />
    </button>
  );
}

/** Minutes long; plans without an end time show as one hour */
function duration(plan: Plan): number {
  if (!plan.end) return 60;
  return toMinutes(plan.end) - toMinutes(plan.start!);
}

/** Side-by-side lanes for plans whose times overlap, the way calendar apps lay them out. */
function layout(plans: Plan[]) {
  const sorted = [...plans].sort((a, b) => toMinutes(a.start!) - toMinutes(b.start!));
  const placed: { plan: Plan; lane: number; lanes: number }[] = [];
  let cluster: typeof placed = [];
  let laneEnds: number[] = [];
  let clusterEnd = -1;

  const flush = () => {
    cluster.forEach((c) => (c.lanes = laneEnds.length));
    placed.push(...cluster);
    cluster = [];
    laneEnds = [];
  };

  for (const plan of sorted) {
    const start = toMinutes(plan.start!);
    const end = start + Math.max(duration(plan), 30);
    if (start >= clusterEnd) flush();
    let lane = laneEnds.findIndex((e) => e <= start);
    if (lane === -1) lane = laneEnds.push(end) - 1;
    else laneEnds[lane] = end;
    cluster.push({ plan, lane, lanes: 0 });
    clusterEnd = Math.max(clusterEnd, end);
  }
  flush();
  return placed;
}
