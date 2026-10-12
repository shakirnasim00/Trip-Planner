import { ArrowRight, SearchIcon } from "../icons";
import styles from "./Planner.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function DestinationStep({ value, onChange, onSubmit }: Props) {
  return (
    <div className={styles.search}>
      <SearchIcon className={styles.searchIcon} />
      <input
        autoFocus
        type="text"
        value={value}
        maxLength={60}
        autoComplete="off"
        placeholder="Search destinations"
        aria-label="Destination"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />
      <button className={styles.searchGo} aria-label="Continue" disabled={!value.trim()} onClick={onSubmit}>
        <ArrowRight />
      </button>
    </div>
  );
}
