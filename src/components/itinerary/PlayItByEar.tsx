import { updateTrip } from "@/lib/tripStore";
import type { Trip } from "@/lib/types";
import Capsule from "./Capsule";
import styles from "./Itinerary.module.css";

/** Plans added as "Not sure when" — they live in the trip's todos, tagged with a kind. */
export default function PlayItByEar({ trip }: { trip: Trip }) {
  const items = trip.todos.filter((t) => t.kind);

  return (
    <section id="play-it-by-ear" className={styles.ear} aria-labelledby="ear-heading">
      <div className={styles.earHead}>
        <h2 id="ear-heading">Play it by Ear</h2>
        <p>Not sure when yet? These are waiting for a spot on the calendar.</p>
      </div>
      {items.length ? (
        <ul className={styles.earList}>
          {items.map((t) => (
            <li key={t.id}>
              <Capsule
                kind={t.kind!}
                title={t.text}
                onRemove={() => updateTrip(trip.id, { todos: trip.todos.filter((x) => x.id !== t.id) })}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.earEmpty}>Anything you add with &ldquo;Not sure when&rdquo; shows up here.</p>
      )}
    </section>
  );
}
