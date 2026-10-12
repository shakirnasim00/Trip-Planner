"use client";

import { useState } from "react";
import type { Trip } from "@/lib/types";
import { AvatarSilhouette, PlusIcon } from "../icons";
import InviteDialog from "./InviteDialog";
import styles from "./TripDetails.module.css";

const MAX_AVATARS = 4;

export default function WhosGoing({ trip }: { trip: Trip }) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const people = [{ id: "you", label: "You", pending: false }, ...trip.invites.map((i) => ({ id: i.id, label: `${i.email} (invited)`, pending: true }))];
  const shown = people.slice(0, MAX_AVATARS);
  const extra = people.length - shown.length;
  const summary = trip.invites.length ? `You and ${trip.invites.length} invited` : "Just you so far";

  return (
    <section className={styles.section} aria-labelledby="who-heading">
      <h3 id="who-heading">Who&apos;s going</h3>
      <div className={styles.peopleRow}>
        {/* Default avatars for now — these become profile pictures once accounts exist */}
        <div className={styles.avatars} role="img" aria-label={summary}>
          {shown.map((p) => (
            <span key={p.id} className={`${styles.avatar} ${p.pending ? styles.pending : ""}`} title={p.label}>
              <AvatarSilhouette />
            </span>
          ))}
          {extra > 0 && <span className={`${styles.avatar} ${styles.more}`}>+{extra}</span>}
        </div>
        <span className={styles.peopleText}>{summary}</span>
        <button className={styles.inviteBtn} aria-haspopup="dialog" onClick={() => setInviteOpen(true)}>
          <PlusIcon />
          Invite
        </button>
      </div>
      <InviteDialog trip={trip} open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </section>
  );
}
