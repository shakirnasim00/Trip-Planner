"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { CalendarIcon, ChevronLeft, PlusIcon } from "@/components/icons";
import AddPlanDialog from "@/components/itinerary/AddPlanDialog";
import DayCalendar from "@/components/itinerary/DayCalendar";
import styles from "@/components/itinerary/Itinerary.module.css";
import details from "@/components/trip/TripDetails.module.css";
import TripNotFound from "@/components/trip/TripNotFound";
import { longRange, tripDays } from "@/lib/dates";
import { useHydrated, useTrip } from "@/lib/tripStore";

export default function ItineraryPage() {
  const { id } = useParams<{ id: string }>();
  const trip = useTrip(id);
  const hydrated = useHydrated();
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(false);

  const start = trip?.start;
  const end = trip?.end;
  const days = useMemo(() => (start && end ? tripDays(start, end) : []), [start, end]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!hydrated) return <Header />;
  if (!trip) return <TripNotFound />;

  return (
    <>
      <Header />
      <main className={`${details.details} ${styles.page}`}>
        <Link href={`/trips/${trip.id}`} className={details.crumb}>
          <ChevronLeft />
          Trip to {trip.destination}
        </Link>

        <div className={styles.top}>
          <div>
            <h1 className={details.title}>Itinerary for {trip.destination}</h1>
            <p className={styles.sub}>
              {days.length
                ? `${longRange(days[0], days[days.length - 1])} · ${days.length} day${days.length === 1 ? "" : "s"}`
                : "Dates not set"}
            </p>
          </div>
          <button className={styles.addBtn} onClick={() => setAdding(true)}>
            <PlusIcon />
            Add activity
          </button>
        </div>

        {days.length ? (
          <DayCalendar trip={trip} days={days} />
        ) : (
          <div className={styles.empty}>
            <CalendarIcon />
            <h2>Your days will show up here</h2>
            <p>This trip doesn&apos;t have dates yet. Anything you add for now goes to Things to do on your trip page.</p>
          </div>
        )}
      </main>

      <AddPlanDialog
        trip={trip}
        days={days}
        open={adding}
        onClose={() => setAdding(false)}
        onSaved={(unscheduled) => setToast(unscheduled)}
      />

      <div className={`${styles.toast} ${toast ? styles.toastIn : ""}`} role="status" aria-hidden={!toast}>
        Saved to Things to do
        <Link href={`/trips/${trip.id}`} tabIndex={toast ? 0 : -1}>
          View
        </Link>
      </div>
    </>
  );
}
