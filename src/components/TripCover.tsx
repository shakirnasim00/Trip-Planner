import { useId } from "react";
import { coverArt } from "@/lib/cover";
import type { Trip } from "@/lib/types";

interface TripCoverProps {
  trip: Pick<Trip, "destination" | "photo">;
  className?: string;
  alt?: string;
}

/** The trip's photo, or generated landscape art when there isn't one. */
export default function TripCover({ trip, className, alt = "" }: TripCoverProps) {
  const gradientId = useId();
  if (trip.photo) {
    // Data URLs aren't optimisable by next/image, so a plain <img> is correct here.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={trip.photo} alt={alt} className={className} />;
  }
  const art = coverArt(trip.destination);
  return (
    <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={art.palette.sky[0]} />
          <stop offset="1" stopColor={art.palette.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill={`url(#${gradientId})`} />
      <circle cx={art.sun.cx} cy={art.sun.cy} r={art.sun.r} fill={art.palette.sun} opacity={0.85} />
      {art.ridges.map((r, i) => (
        <path key={i} d={r.d} fill={r.fill} />
      ))}
      <rect y={art.baseY} width="300" height="80" fill={art.palette.base} />
      {art.shimmer.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={s.w} height="2" rx="1" fill="#fff" opacity={s.opacity} />
      ))}
    </svg>
  );
}
