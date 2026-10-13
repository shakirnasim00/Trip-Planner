"use client";

/**
 * Trip storage. Everything reads and writes through this module, so swapping
 * localStorage for a real API/database later only means changing this file.
 */
import { useSyncExternalStore } from "react";
import type { Trip } from "./types";

const STORE_KEY = "tripplanner.trips";
const EMPTY: Trip[] = [];

let cache: Trip[] | null = null;
let lastCreatedId: string | null = null;
const listeners = new Set<() => void>();

function normalize(raw: Partial<Trip>): Trip {
  return {
    id: String(raw.id),
    destination: raw.destination ?? "",
    start: raw.start ?? null,
    end: raw.end ?? null,
    party: raw.party ?? "solo",
    photo: raw.photo ?? null,
    budget: raw.budget ?? null,
    todos: raw.todos ?? [],
    plans: raw.plans ?? [],
    invites: raw.invites ?? [],
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

function read(): Trip[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.map(normalize) : [];
  } catch {
    cache = [];
  }
  return cache;
}

/** Returns false when the browser is out of storage space. */
function write(next: Trip[]): boolean {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    return false;
  }
  cache = next;
  listeners.forEach((l) => l());
  return true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTrips(): Trip[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useTrip(id: string | undefined): Trip | undefined {
  return useTrips().find((t) => t.id === id);
}

/** True once the page is running in the browser and saved trips can be read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function addTrip(trip: Trip): boolean {
  const ok = write([trip, ...read()]);
  if (ok) lastCreatedId = trip.id;
  return ok;
}

export function updateTrip(id: string, patch: Partial<Omit<Trip, "id">>): boolean {
  return write(read().map((t) => (t.id === id ? { ...t, ...patch } : t)));
}

export function removeTrip(id: string): void {
  write(read().filter((t) => t.id !== id));
}

/** The trip created most recently in this session, used to animate its card in. */
export function getLastCreatedId() {
  return lastCreatedId;
}
export function clearLastCreatedId() {
  lastCreatedId = null;
}
