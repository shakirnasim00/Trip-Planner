"use client";

import { useEffect, useRef, useState } from "react";
import { newId } from "@/lib/ids";
import { updateTrip } from "@/lib/tripStore";
import type { Trip } from "@/lib/types";
import { AvatarSilhouette, CloseIcon } from "../icons";
import styles from "./TripDetails.module.css";

interface Props {
  trip: Trip;
  open: boolean;
  onClose: () => void;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteDialog({ trip, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Sync the native <dialog> (which gives us the dimmed backdrop and focus trapping) with `open`
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
      dialog.querySelector("input")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  function handleClose() {
    document.body.style.overflow = "";
    setEmail("");
    setError("");
    onClose();
  }

  function send() {
    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) return setError("Enter a valid email, like name@example.com.");
    if (trip.invites.some((i) => i.email === value)) return setError("That person is already invited.");
    updateTrip(trip.id, { invites: [...trip.invites, { id: newId(), email: value }] });
    setEmail("");
    setError("");
  }

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      aria-labelledby="invite-title"
      onClose={handleClose}
      // Clicking the darkened backdrop closes the card
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
    >
      <div className={styles.modalHead}>
        <button className={styles.modalClose} aria-label="Close" onClick={() => ref.current?.close()}>
          <CloseIcon />
        </button>
        <h2 id="invite-title">Invite people</h2>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.modalLead}>Invite friends to plan {trip.destination} with you.</p>
        <label className={styles.fieldLabel} htmlFor="invite-input">
          Email
        </label>
        <div className={`${styles.addRow} ${styles.inviteForm}`}>
          <input
            id="invite-input"
            type="email"
            autoComplete="off"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className={styles.saveBtn} onClick={send}>
            Send invite
          </button>
        </div>
        <p className={styles.fieldError} role="alert">
          {error}
        </p>
        <p className={styles.inviteNote}>Invites will go out by email once accounts are set up.</p>
        <ul className={styles.inviteList}>
          {trip.invites.map((i) => (
            <li key={i.id} className={styles.inviteRow}>
              <span className={`${styles.avatar} ${styles.pending}`}>
                <AvatarSilhouette />
              </span>
              <span className={styles.inviteEmail}>{i.email}</span>
              <span className={styles.inviteStatus}>Invited</span>
              <button
                className={`${styles.del} ${styles.delVisible}`}
                aria-label={`Remove invite for ${i.email}`}
                onClick={() => updateTrip(trip.id, { invites: trip.invites.filter((x) => x.id !== i.id) })}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
