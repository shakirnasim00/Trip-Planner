import type { Party } from "@/lib/types";
import { PartyIcon } from "../icons";
import styles from "./Planner.module.css";

const OPTIONS: { value: Party; label: string; detail: string }[] = [
  { value: "solo", label: "Solo", detail: "Just me" },
  { value: "duo", label: "Duo", detail: "Me and one other" },
  { value: "group", label: "Group (3+)", detail: "Three or more" },
];

interface Props {
  value: Party | null;
  onChange: (party: Party) => void;
}

export default function PartyStep({ value, onChange }: Props) {
  return (
    <div className={styles.options} role="radiogroup" aria-label="Group size">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          className={styles.option}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
        >
          <PartyIcon party={o.value} />
          <div>
            <strong>{o.label}</strong>
            <small>{o.detail}</small>
          </div>
        </button>
      ))}
    </div>
  );
}
