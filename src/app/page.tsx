"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import TripCard, { NewTripButton } from "@/components/TripCard";
import { clearLastCreatedId, getLastCreatedId, removeTrip, useHydrated, useTrips } from "@/lib/tripStore";
import styles from "./home.module.css";

export default function HomePage() {
  const trips = useTrips();
  const hydrated = useHydrated();
  const newId = getLastCreatedId();

  // Let the new card animate in once, then forget it
  useEffect(() => {
    const t = window.setTimeout(clearLastCreatedId, 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <Header />
      <main className={styles.home}>
        <h1 className={styles.heading}>Your trips</h1>
        {hydrated && (
          <div className={styles.grid}>
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} isNew={trip.id === newId} onRemove={removeTrip} />
            ))}
            <NewTripButton />
          </div>
        )}
      </main>
    </>
  );
}
