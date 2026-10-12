"use client";

import { useEffect, useRef, useState } from "react";
import { shrinkImage } from "@/lib/image";
import { CameraIcon } from "../icons";
import styles from "./PhotoDrop.module.css";

interface Props {
  photo: string | null;
  onChange: (photo: string | null) => void;
  /** Error from outside the component, e.g. storage full on save */
  externalError?: string;
}

export default function PhotoDrop({ photo, onChange, externalError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // A drop that misses the box would otherwise navigate the page to the image
  useEffect(() => {
    const stop = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
    };
  }, []);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image. Try a JPG, PNG or WebP.");
      return;
    }
    setBusy(true);
    try {
      onChange(await shrinkImage(file));
      setError("");
    } catch {
      setError("This photo couldn't be opened. Try a JPG or PNG.");
    } finally {
      setBusy(false);
    }
  }

  const openPicker = () => inputRef.current?.click();
  const cls = [styles.dropzone, dragging && styles.drag, busy && styles.busy, photo && styles.hasPhoto]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        className={cls}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="Trip cover preview" className={styles.preview} />
            <div className={styles.actions}>
              <button className={styles.chip} type="button" onClick={openPicker}>
                Replace
              </button>
              <button className={styles.chip} type="button" onClick={() => onChange(null)}>
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className={styles.empty} onClick={openPicker}>
            <CameraIcon />
            <strong>Drag your photo here</strong>
            <span>JPG, PNG or WebP</span>
            <button className={styles.link} type="button">
              Upload from your device
            </button>
          </div>
        )}
      </div>
      <p className={styles.error} role="alert">
        {externalError || error}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}
