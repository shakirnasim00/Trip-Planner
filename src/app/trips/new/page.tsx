"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import DateRangeCalendar from "@/components/planner/DateRangeCalendar";
import DestinationStep from "@/components/planner/DestinationStep";
import PartyStep from "@/components/planner/PartyStep";
import PhotoDrop from "@/components/planner/PhotoDrop";
import styles from "@/components/planner/Planner.module.css";
import { newId } from "@/lib/ids";
import { addTrip } from "@/lib/tripStore";
import type { Party } from "@/lib/types";

interface Draft {
  destination: string;
  start: string | null;
  end: string | null;
  notSure: boolean;
  party: Party | null;
  photo: string | null;
}

const STEPS = [
  { title: "Where will you go?", hint: "A city, a region, a national park — wherever you have in mind." },
  { title: "When were you thinking of going?", hint: "Pick a start and end date. You can change these later." },
  { title: "How many people would you like to go with?", hint: "Choose the one that fits best." },
  { title: "Add a photo for your trip", hint: "It becomes the cover of your trip card. This step is optional." },
];
const LAST = STEPS.length - 1;

export default function NewTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [draft, setDraft] = useState<Draft>({
    destination: "",
    start: null,
    end: null,
    notSure: false,
    party: null,
    photo: null,
  });
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const valid = [
    draft.destination.trim().length > 0,
    draft.notSure || !!(draft.start && draft.end),
    !!draft.party,
    true, // photo is optional
  ][step];

  function goTo(n: number) {
    setLeaving(true);
    window.setTimeout(() => {
      setStep(n);
      setLeaving(false);
      window.scrollTo({ top: 0 });
    }, 260);
  }

  function next() {
    if (!valid || leaving) return;
    if (step < LAST) return goTo(step + 1);
    const id = newId();
    const saved = addTrip({
      id,
      destination: draft.destination.trim().replace(/\s+/g, " "),
      start: draft.notSure ? null : draft.start,
      end: draft.notSure ? null : draft.end,
      party: draft.party!,
      photo: draft.photo,
      budget: null,
      todos: [],
      invites: [],
      createdAt: new Date().toISOString(),
    });
    if (!saved) {
      setSaveError("This browser is out of storage space for photos. Remove the photo, or remove an older trip, then try again.");
      return;
    }
    router.push("/");
  }

  return (
    <>
      <Header onExit={() => router.push("/")} />
      <main className={styles.planner}>
        <div className={`${styles.steps} ${step === 1 ? styles.wide : ""}`}>
          <section key={step} className={`${styles.step} ${leaving ? styles.leaving : ""}`}>
            <h2 className={styles.title}>{STEPS[step].title}</h2>
            <p className={styles.hint}>{STEPS[step].hint}</p>
            <div className={styles.body}>
              {step === 0 && (
                <DestinationStep value={draft.destination} onChange={(destination) => set({ destination })} onSubmit={next} />
              )}
              {step === 1 && (
                <DateRangeCalendar
                  start={draft.start}
                  end={draft.end}
                  notSure={draft.notSure}
                  onChange={(start, end) => set({ start, end })}
                  onNotSureChange={(notSure) => set(notSure ? { notSure, start: null, end: null } : { notSure })}
                />
              )}
              {step === 2 && <PartyStep value={draft.party} onChange={(party) => set({ party })} />}
              {step === 3 && (
                <PhotoDrop
                  photo={draft.photo}
                  onChange={(photo) => {
                    set({ photo });
                    setSaveError("");
                  }}
                  externalError={saveError}
                />
              )}
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <div className={styles.progress} aria-hidden="true">
            {STEPS.map((_, i) => (
              <i key={i} className={i <= step ? styles.done : ""} />
            ))}
          </div>
          <div className={styles.footerRow}>
            <button className={styles.back} disabled={step === 0} onClick={() => goTo(step - 1)}>
              Back
            </button>
            <button className={`${styles.next} ${step === LAST ? styles.final : ""}`} disabled={!valid} onClick={next}>
              {step === LAST ? "Create trip" : "Next"}
            </button>
          </div>
        </footer>
      </main>
    </>
  );
}
