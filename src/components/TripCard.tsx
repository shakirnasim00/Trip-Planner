import Link from "next/link";
import { shortRange } from "@/lib/dates";
import { PARTY_LABEL, type Trip } from "@/lib/types";
import TripCover from "./TripCover";
import { CalendarIcon, CloseIcon, PartyIcon, PlusIcon } from "./icons";
import styles from "./TripCard.module.css";

interface TripCardProps {
  trip: Trip;
  isNew?: boolean;
  onRemove: (id: string) => void;
}

export default function TripCard({ trip, isNew, onRemove }: TripCardProps) {
  return (
    <article className={`${styles.card} ${isNew ? styles.isNew : ""}`}>
      <TripCover trip={trip} className={styles.cover} />
      <div className={styles.glass} />
      <button
        className={styles.remove}
        onClick={() => onRemove(trip.id)}
        aria-label={`Remove ${trip.destination} trip`}
      >
        <CloseIcon />
      </button>
      <div className={styles.body}>
        <h3 className={styles.title}>{trip.destination}</h3>
        <div className={styles.chips}>
          <span className={styles.tag}>
            <CalendarIcon />
            {trip.start && trip.end ? shortRange(trip.start, trip.end) : "Dates not set"}
          </span>
          <span className={styles.tag}>
            <PartyIcon party={trip.party} strokeWidth={2.6} />
            {PARTY_LABEL[trip.party]}
          </span>
        </div>
        <Link href={`/trips/${trip.id}`} className={styles.explore}>
          Explore Trip
        </Link>
      </div>
    </article>
  );
}

export function NewTripButton() {
  return (
    <Link href="/trips/new" className={styles.newTrip}>
      <span className={styles.plus}>
        <PlusIcon />
      </span>
      Plan a New Trip
    </Link>
  );
}

