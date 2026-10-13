"use client";

import { useEffect, useRef, useState } from "react";
import { fmt, parseIso, toIso, toMinutes } from "@/lib/dates";
import { newId } from "@/lib/ids";
import { updateTrip } from "@/lib/tripStore";
import { PLAN_LABEL, type PlanKind, type Trip } from "@/lib/types";
import { ChevronLeft, CloseIcon, PlanIcon } from "../icons";
import modal from "../trip/TripDetails.module.css";
import styles from "./Itinerary.module.css";

interface Props {
  trip: Trip;
  /** Trip dates in order; empty when the trip has no dates yet */
  days: string[];
  open: boolean;
  onClose: () => void;
  /** Called after saving; `unscheduled` means it went to Play it by Ear instead of the calendar */
  onSaved: (unscheduled: boolean) => void;
}

type When = "day" | "time" | "unsure";

const KINDS: PlanKind[] = ["flight", "stay", "activity", "road"];
const PLACEHOLDER: Record<PlanKind, string> = {
  flight: "e.g. Flight to Paris",
  stay: "e.g. Hotel Le Marais",
  activity: "e.g. Louvre Museum",
  road: "e.g. Drive to Normandy",
};

export default function AddPlanDialog({ trip, days, open, onClose, onSaved }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<PlanKind | null>(null);
  const [back, setBack] = useState(false);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [when, setWhen] = useState<When>("day");
  const [day, setDay] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  const hasDays = days.length > 0;

  // Same native <dialog> pattern as InviteDialog: dimmed backdrop and focus trapping for free
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const today = toIso(new Date());
      setDay(days.includes(today) ? today : (days[0] ?? ""));
      setWhen(hasDays ? "day" : "unsure");
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, days, hasDays]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  function handleClose() {
    document.body.style.overflow = "";
    setKind(null);
    setBack(false);
    setTitle("");
    setCost("");
    setStart("");
    setEnd("");
    setError("");
    onClose();
  }

  function choose(k: PlanKind) {
    setBack(false);
    setKind(k);
  }

  function goBack() {
    setBack(true);
    setKind(null);
    setError("");
  }

  function save() {
    const name = title.trim().replace(/\s+/g, " ");
    if (!kind) return;
    if (!name) return setError(`Give your ${PLAN_LABEL[kind].toLowerCase()} a name.`);
    const price = parseCost(cost);
    if (price === undefined) return setError("Enter a cost between $0 and $1,000,000, or leave it blank.");

    if (when === "unsure") {
      updateTrip(trip.id, { todos: [...trip.todos, { id: newId(), text: name, done: false, kind, cost: price }] });
    } else {
      if (when === "time" && !start) return setError("Pick a start time.");
      if (when === "time" && end && toMinutes(end) <= toMinutes(start)) {
        return setError("The end time needs to be after the start time.");
      }
      const timed = when === "time";
      updateTrip(trip.id, {
        plans: [
          ...trip.plans,
          {
            id: newId(),
            kind,
            title: name,
            day,
            start: timed ? start : null,
            end: timed && end ? end : null,
            cost: price,
          },
        ],
      });
    }
    onSaved(when === "unsure");
    ref.current?.close();
  }

  return (
    <dialog
      ref={ref}
      className={`${modal.modal} ${styles.dialog}`}
      aria-labelledby="add-plan-title"
      onClose={handleClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <div className={modal.modalHead}>
        {kind ? (
          <button className={modal.modalClose} aria-label="Back" onClick={goBack}>
            <ChevronLeft />
          </button>
        ) : (
          <button className={modal.modalClose} aria-label="Close" onClick={() => ref.current?.close()}>
            <CloseIcon />
          </button>
        )}
        <h2 id="add-plan-title">{kind ? `Add ${PLAN_LABEL[kind].toLowerCase()}` : "Add to your trip"}</h2>
      </div>

      {!kind ? (
        <div key="what" className={`${modal.modalBody} ${styles.step} ${back ? styles.fromLeft : ""}`}>
          <h3 className={styles.question}>What do you want to add to your trip plan?</h3>
          <div className={styles.kinds}>
            {KINDS.map((k) => (
              <button key={k} className={`${styles.kindCard} ${styles[k]}`} onClick={() => choose(k)}>
                <span className={styles.kindIcon}>
                  <PlanIcon kind={k} />
                </span>
                {PLAN_LABEL[k]}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div key="when" className={`${modal.modalBody} ${styles.step}`}>
          <div className={styles.nameRow}>
            <div>
              <label className={modal.fieldLabel} htmlFor="plan-title">
                Name
              </label>
              <input
                id="plan-title"
                className={styles.input}
                value={title}
                maxLength={80}
                autoFocus
                autoComplete="off"
                placeholder={PLACEHOLDER[kind]}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && save()}
              />
            </div>
            <div>
              <label className={modal.fieldLabel} htmlFor="plan-cost">
                Cost <em className={styles.optional}>(optional)</em>
              </label>
              <div className={`${modal.money} ${styles.cost}`}>
                <span>$</span>
                <input
                  id="plan-cost"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0"
                  value={cost}
                  onChange={(e) => {
                    setCost(e.target.value.replace(/\$/g, ""));
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && save()}
                />
                <small>CAD</small>
              </div>
            </div>
          </div>

          <h3 className={styles.question}>When?</h3>
          <div className={styles.segments} role="radiogroup" aria-label="When">
            {(
              [
                ["day", "Just a day"],
                ["time", "Date & time"],
                ["unsure", "Not sure when"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="radio"
                aria-checked={when === value}
                disabled={value !== "unsure" && !hasDays}
                onClick={() => {
                  setWhen(value);
                  setError("");
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {when === "unsure" ? (
            <p className={styles.hint}>
              {hasDays
                ? "We'll keep it under Play it by Ear, below your calendar, so you can schedule it later."
                : "Your trip doesn't have dates yet, so we'll keep it under Play it by Ear for now."}
            </p>
          ) : (
            <div className={styles.whenFields} key={when}>
              <div className={styles.dayChips} role="radiogroup" aria-label="Day">
                {days.map((d, i) => (
                  <button key={d} role="radio" aria-checked={day === d} onClick={() => setDay(d)}>
                    <strong>Day {i + 1}</strong>
                    <span>{fmt(parseIso(d), { weekday: "short", month: "short", day: "numeric" })}</span>
                  </button>
                ))}
              </div>
              {when === "time" && (
                <div className={styles.times}>
                  <label>
                    <span className={modal.fieldLabel}>Starts</span>
                    <input
                      type="time"
                      className={styles.input}
                      value={start}
                      onChange={(e) => {
                        setStart(e.target.value);
                        setError("");
                      }}
                    />
                  </label>
                  <label>
                    <span className={modal.fieldLabel}>
                      Ends <em className={styles.optional}>(optional)</em>
                    </span>
                    <input
                      type="time"
                      className={styles.input}
                      value={end}
                      onChange={(e) => {
                        setEnd(e.target.value);
                        setError("");
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          <p className={modal.fieldError} role="alert">
            {error}
          </p>
          <button className={`${modal.saveBtn} ${styles.saveWide}`} onClick={save}>
            {when === "unsure" ? "Add to Play it by Ear" : "Add to itinerary"}
          </button>
        </div>
      )}
    </dialog>
  );
}

/** "$1,250.50" → 1250.5; blank → null; anything invalid → undefined */
function parseCost(input: string): number | null | undefined {
  const raw = input.replace(/[$,\s]/g, "");
  if (raw === "") return null;
  if (!/^\d*\.?\d{0,2}$/.test(raw)) return undefined;
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount > 1_000_000) return undefined;
  return Math.round(amount * 100) / 100;
}
