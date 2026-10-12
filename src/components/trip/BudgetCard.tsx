"use client";

import { useRef, useState } from "react";
import { nightsBetween } from "@/lib/dates";
import { formatCad } from "@/lib/money";
import { updateTrip } from "@/lib/tripStore";
import type { Trip } from "@/lib/types";
import styles from "./TripDetails.module.css";

export default function BudgetCard({ trip }: { trip: Trip }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const amountRef = useRef<HTMLButtonElement>(null);

  const nights = trip.start && trip.end ? nightsBetween(trip.start, trip.end) : 0;

  function open() {
    setValue(trip.budget ? String(trip.budget) : "");
    setError("");
    setEditing(true);
  }
  function close() {
    setEditing(false);
    requestAnimationFrame(() => amountRef.current?.focus());
  }
  function save() {
    const raw = value.replace(/[^0-9.]/g, "");
    if (raw === "") {
      updateTrip(trip.id, { budget: null });
      return close();
    }
    const amount = Math.round(parseFloat(raw));
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10_000_000) {
      setError("Enter an amount between $1 and $10,000,000.");
      return;
    }
    updateTrip(trip.id, { budget: amount });
    close();
  }

  return (
    <section className={styles.sideCard} aria-label="Budget">
      {editing ? (
        <>
          <label className={styles.fieldLabel} htmlFor="budget-input">
            Total trip budget
          </label>
          <div className={styles.money}>
            <span>$</span>
            <input
              id="budget-input"
              autoFocus
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") close();
              }}
            />
            <small>CAD</small>
          </div>
          <p className={styles.fieldError} role="alert">
            {error}
          </p>
          <div className={styles.formRow}>
            <button className={styles.textBtn} onClick={close}>
              Cancel
            </button>
            <button className={styles.saveBtn} onClick={save}>
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            ref={amountRef}
            className={styles.budgetAmount}
            onClick={open}
            aria-label={trip.budget ? `Budget ${formatCad(trip.budget)} CAD. Edit budget` : undefined}
          >
            {trip.budget ? `${formatCad(trip.budget)} CAD total` : "Add a budget"}
          </button>
          <p className={styles.budgetSub}>
            {!trip.budget
              ? "Set a total so you can plan around it."
              : nights
                ? `About ${formatCad(trip.budget / nights)} per night`
                : "Tap the amount to change it"}
          </p>
        </>
      )}
    </section>
  );
}
