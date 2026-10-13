import type { CSSProperties } from "react";
import type { PlanKind } from "@/lib/types";
import { CloseIcon, PlanIcon } from "../icons";
import styles from "./Itinerary.module.css";

interface Props {
  kind: PlanKind;
  title: string;
  /** Grey line under the title, e.g. the time */
  detail?: string;
  onRemove: () => void;
  style?: CSSProperties;
}

/** White rounded capsule for a plan: icon left, bold title, optional grey detail underneath. */
export default function Capsule({ kind, title, detail, onRemove, style }: Props) {
  return (
    <div className={`${styles.capsule} ${styles[kind]}`} style={style}>
      <span className={styles.capsuleIcon}>
        <PlanIcon kind={kind} />
      </span>
      <span className={styles.capsuleText}>
        <strong>{title}</strong>
        {detail && <span>{detail}</span>}
      </span>
      <button className={styles.remove} aria-label={`Remove ${title}`} onClick={onRemove}>
        <CloseIcon />
      </button>
    </div>
  );
}
