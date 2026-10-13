import Link from "next/link";
import Header from "../Header";
import styles from "./TripDetails.module.css";

export default function TripNotFound() {
  return (
    <>
      <Header />
      <main className={styles.details}>
        <div className={styles.notFound}>
          <h1>This trip doesn&apos;t exist</h1>
          <p>It may have been removed, or it was saved in a different browser.</p>
          <Link href="/" className={styles.outlineBtn}>
            Back to your trips
          </Link>
        </div>
      </main>
    </>
  );
}
