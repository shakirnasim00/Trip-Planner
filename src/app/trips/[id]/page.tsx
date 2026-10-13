"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { ChevronLeft, ItineraryIcon } from "@/components/icons";
import TripCover from "@/components/TripCover";
import BudgetCard from "@/components/trip/BudgetCard";
import ThingsToDo from "@/components/trip/ThingsToDo";
import TripNotFound from "@/components/trip/TripNotFound";
import styles from "@/components/trip/TripDetails.module.css";
import WhosGoing from "@/components/trip/WhosGoing";
import { longRange, nightsBetween } from "@/lib/dates";
import { useHydrated, useTrip } from "@/lib/tripStore";
import { PARTY_LABEL } from "@/lib/types";

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const trip = useTrip(id);
  const hydrated = useHydrated();

  if (!hydrated) return <Header />;
  if (!trip) return <TripNotFound />;

  const hasDates = !!(trip.start && trip.end);
  const nights = hasDates ? nightsBetween(trip.start!, trip.end!) : 0;
  const meta = [`${PARTY_LABEL[trip.party]} trip`, nights ? `${nights} night${nights === 1 ? "" : "s"}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Header />
      <main className={styles.details}>
        <Link href="/" className={styles.crumb}>
          <ChevronLeft />
          Your trips
        </Link>

        <div className={styles.top}>
          <h1 className={styles.title}>Trip to {trip.destination}</h1>
          <Link href={`/trips/${trip.id}/itinerary`} className={styles.outlineBtn}>
            <ItineraryIcon />
            See itinerary
          </Link>
        </div>

        <div className={styles.photo}>
          <TripCover trip={trip} alt={`Cover photo for ${trip.destination}`} />
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <h2 className={styles.dates}>{hasDates ? longRange(trip.start!, trip.end!) : "Dates not set"}</h2>
            <p className={styles.meta}>{meta}</p>
            <WhosGoing trip={trip} />
          </div>

          <aside className={styles.side}>
            <BudgetCard trip={trip} />
            <ThingsToDo trip={trip} />
          </aside>
        </div>
      </main>
    </>
  );
}
