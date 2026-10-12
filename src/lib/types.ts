export type Party = "solo" | "duo" | "group";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
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
  invites: Invite[];
  createdAt: string;
}

export const PARTY_LABEL: Record<Party, string> = {
  solo: "Solo",
  duo: "Duo",
  group: "Group",
};
