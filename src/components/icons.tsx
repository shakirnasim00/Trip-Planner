import type { SVGProps } from "react";
import type { Party, PlanKind } from "@/lib/types";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 32 32", "aria-hidden": true } as const;

export const LogoMark = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16 29s9-8.3 9-15.2A9 9 0 0 0 7 13.8C7 20.7 16 29 16 29z" />
    <path d="M11.5 15.5l3-1 1-3.5 1 3.5 3 1-3 1-1 3.5-1-3.5z" fill="currentColor" strokeWidth={1} />
  </svg>
);

export const AccountIcon = (p: P) => (
  <svg {...base} fill="currentColor" {...p}>
    <path d="M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 8a5 5 0 0 0-2 9.58v2.1l-.15.03a11 11 0 0 0-6.94 4.59A13 13 0 0 0 16 29a13 13 0 0 0 9.09-3.7 11 11 0 0 0-6.94-4.59l-.15-.03v-2.1A5 5 0 0 0 16 9zm0-6a13 13 0 0 0-10.49 20.67 13 13 0 0 1 6.5-4.16v-.24a7 7 0 1 1 8 0v.24a13 13 0 0 1 6.5 4.16A13 13 0 0 0 16 3z" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" {...p}>
    <path d="M16 5v22M5 16h22" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" {...p}>
    <path d="M7 7l18 18M25 7 7 25" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 28 8 16 20 4" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m12 4 12 12-12 12" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 16h20M18 8l8 8-8 8" />
  </svg>
);

export const SearchIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={3} {...p}>
    <circle cx="13" cy="13" r="9" />
    <path d="M20 20l9 9" strokeLinecap="round" />
  </svg>
);

export const CalendarIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" {...p}>
    <rect x="4" y="6" width="24" height="22" rx="4" />
    <path d="M4 13h24M11 3v6M21 3v6" />
  </svg>
);

export const ItineraryIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" {...p}>
    <rect x="4" y="6" width="24" height="22" rx="4" />
    <path d="M4 13h24M11 3v6M21 3v6M10 19h5M10 23h9" />
  </svg>
);

export const CameraIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" {...p}>
    <path d="M4 10h5l2.5-4h9L23 10h5v16H4z" />
    <circle cx="16" cy="17.5" r="5" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 17l7 7L26 9" />
  </svg>
);

export const AvatarSilhouette = (p: P) => (
  <svg {...base} fill="currentColor" {...p}>
    <circle cx="16" cy="12.5" r="5.5" />
    <path d="M5 31c0-6.5 4.9-10.5 11-10.5S27 24.5 27 31z" />
  </svg>
);

const SoloIcon = ({ strokeWidth = 2, ...p }: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={strokeWidth} {...p}>
    <circle cx="16" cy="10" r="5" />
    <path d="M6 28c0-5.5 4.5-9 10-9s10 3.5 10 9" />
  </svg>
);

const DuoIcon = ({ strokeWidth = 2, ...p }: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={strokeWidth} {...p}>
    <circle cx="11" cy="11" r="4.5" />
    <circle cx="22" cy="11" r="4.5" />
    <path d="M2 27c0-4.8 4-8 9-8 2.2 0 4.2.6 5.6 1.7M30 27c0-4.8-4-8-8.5-8-4.8 0-8.5 3.2-8.5 8" />
  </svg>
);

const GroupIcon = ({ strokeWidth = 2, ...p }: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={strokeWidth} {...p}>
    <circle cx="16" cy="9" r="4" />
    <circle cx="7" cy="13" r="3.2" />
    <circle cx="25" cy="13" r="3.2" />
    <path d="M9 27c0-4.4 3.1-7.5 7-7.5s7 3.1 7 7.5M1.5 25.5c0-3.5 2.3-6 5.5-6 1.2 0 2.3.3 3.2.9M30.5 25.5c0-3.5-2.3-6-5.5-6-1.2 0-2.3.3-3.2.9" />
  </svg>
);

export const PartyIcon = ({ party, ...p }: P & { party: Party }) => {
  const Icon = { solo: SoloIcon, duo: DuoIcon, group: GroupIcon }[party];
  return <Icon {...p} />;
};

export const FlightIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" {...p}>
    <path d="M16 3c1.2 0 2 1 2 2.5V12l10 6v3l-10-3v6l3 2.5V29l-5-1.5-5 1.5v-2.5l3-2.5v-6L4 21v-3l10-6V5.5C14 4 14.8 3 16 3z" />
  </svg>
);

export const StayIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 7v20M3 21h26v6M29 21v-5a4 4 0 0 0-4-4H14v9" />
    <circle cx="8.5" cy="15.5" r="2.5" />
  </svg>
);

export const ActivityIcon = (p: P) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" {...p}>
    <path d="M4 10a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6z" />
    <path d="M20 9v14" strokeDasharray="2.5 2.5" />
  </svg>
);

export const PlanIcon = ({ kind, ...p }: P & { kind: PlanKind }) => {
  const Icon = { flight: FlightIcon, stay: StayIcon, activity: ActivityIcon }[kind];
  return <Icon {...p} />;
};
