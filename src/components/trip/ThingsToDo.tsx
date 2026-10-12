"use client";

import { useState } from "react";
import { newId } from "@/lib/ids";
import { updateTrip } from "@/lib/tripStore";
import type { Trip } from "@/lib/types";
import { CheckIcon, CloseIcon } from "../icons";
import styles from "./TripDetails.module.css";

export default function ThingsToDo({ trip }: { trip: Trip }) {
  const [text, setText] = useState("");
  const todos = trip.todos;

  function add() {
    const clean = text.trim().replace(/\s+/g, " ");
    if (!clean) return;
    updateTrip(trip.id, { todos: [...todos, { id: newId(), text: clean, done: false }] });
    setText("");
  }

  return (
    <section className={styles.sideCard} aria-labelledby="todo-heading">
      <h3 id="todo-heading">Things to do</h3>
      {todos.length === 0 && (
        <p className={styles.todoEmpty}>Add the places, food and activities you don&apos;t want to miss.</p>
      )}
      <ul className={styles.todoList}>
        {todos.map((td) => (
          <li key={td.id} className={`${styles.todo} ${td.done ? styles.done : ""}`}>
            <button
              className={styles.check}
              aria-pressed={td.done}
              aria-label={`Mark ${td.text} as ${td.done ? "not done" : "done"}`}
              onClick={() =>
                updateTrip(trip.id, { todos: todos.map((t) => (t.id === td.id ? { ...t, done: !t.done } : t)) })
              }
            >
              <CheckIcon />
            </button>
            <span className={styles.todoText}>{td.text}</span>
            <button
              className={styles.del}
              aria-label={`Remove ${td.text}`}
              onClick={() => updateTrip(trip.id, { todos: todos.filter((t) => t.id !== td.id) })}
            >
              <CloseIcon />
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.addRow}>
        <input
          value={text}
          maxLength={120}
          placeholder="Add something to do"
          aria-label="New thing to do"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className={styles.addBtn} disabled={!text.trim()} onClick={add}>
          Add
        </button>
      </div>
    </section>
  );
}
