"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { ChevronLeft } from "@/components/icons";
import styles from "@/components/trip/TripDetails.module.css";
import { useHydrated, useTrip } from "@/lib/tripStore";

/** Placeholder — the day-by-day itinerary gets built here next. */
export default function ItineraryPage() {
  const { id } = useParams<{ id: string }>();
  const trip = useTrip(id);
  const hydrated = useHydrated();

  return (
    <>
      <Header />
      <main className={styles.details}>
        <Link href={trip ? `/trips/${trip.id}` : "/"} className={styles.crumb}>
          <ChevronLeft />
          {trip ? `Trip to ${trip.destination}` : "Your trips"}
        </Link>
        {hydrated && (
          <div className={styles.top}>
            <h1 className={styles.title}>{trip ? `Itinerary for ${trip.destination}` : "Itinerary"}</h1>
          </div>
        )}
      </main>
    </>
  );
}
