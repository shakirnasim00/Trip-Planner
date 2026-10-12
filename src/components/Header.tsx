import Link from "next/link";
import { AccountIcon, LogoMark } from "./icons";
import styles from "./Header.module.css";

interface HeaderProps {
  /** When set, shows an Exit button instead of the account button (used in the new-trip flow). */
  onExit?: () => void;
}

export default function Header({ onExit }: HeaderProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Trip-Planner home">
          <LogoMark />
          tripplanner
        </Link>
        {onExit ? (
          <button className={styles.pill} onClick={onExit}>
            Exit
          </button>
        ) : (
          <button className={styles.avatar} aria-label="Account (sign-in coming soon)">
            <AccountIcon />
          </button>
        )}
      </div>
    </header>
  );
}
