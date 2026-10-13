export type Party = "solo" | "duo" | "group";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export type PlanKind = "flight" | "stay" | "activity";

/** Something scheduled on the itinerary. Plans with no day go to the trip's todos instead. */
export interface Plan {
  id: string;
  kind: PlanKind;
  title: string;
  /** ISO date (yyyy-mm-dd) within the trip */
  day: string;
  /** "HH:MM" (24h), or null for an all-day plan */
  start: string | null;
  /** "HH:MM" (24h); null means it shows as one hour long */
  end: string | null;
}

export interface Invite {
  id: string;
  email: string;
}

export interface Trip {
  id: string;
  destination: string;
  /** ISO date (yyyy-mm-dd), or null when the user picked "I'm not sure yet" */
  start: string | null;
  end: string | null;
  party: Party;
  /** Compressed JPEG data URL for now; becomes a storage URL once uploads exist */
  photo: string | null;
  /** Total budget in CAD */
  budget: number | null;
  todos: Todo[];
  plans: Plan[];
  invites: Invite[];
  createdAt: string;
}

export const PARTY_LABEL: Record<Party, string> = {
  solo: "Solo",
  duo: "Duo",
  group: "Group",
};

export const PLAN_LABEL: Record<PlanKind, string> = {
  flight: "Flight",
  stay: "Accommodation",
  activity: "Activity",
};
