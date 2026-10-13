# Trip-Planner

Plan trips with the people you're going with. (Working name — rename once we pick one.)

Built with **Next.js 16 (App Router) + TypeScript**, styled with CSS Modules.

## Getting started

Requires Node 20.9+ (Node 22 recommended — see `.nvmrc`).

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type-check without building |

## Pages

| Route | Page |
| --- | --- |
| `/` | Your trips — trip cards and the Plan a New Trip button |
| `/trips/new` | New-trip flow: destination → dates → group size → photo |
| `/trips/[id]` | Trip details — title, photo, dates, who's going, budget, things to do |
| `/trips/[id]/itinerary` | Itinerary — day-by-day calendar, Add activity (flight / accommodation / activity) |

## Project structure

```
src/
  app/                      Routes (App Router)
    globals.css             Design tokens: colours, font, shadows
    page.tsx                Home
    trips/new/page.tsx      New-trip flow
    trips/[id]/page.tsx     Trip details
    trips/[id]/itinerary/   Itinerary (day-by-day calendar)
  components/
    Header.tsx              Top bar (logo + account / Exit)
    TripCard.tsx            Home trip card + Plan a New Trip button
    TripCover.tsx           Trip photo, or generated landscape art
    icons.tsx               All SVG icons
    planner/                New-trip flow steps (calendar, party picker, photo drop)
    trip/                   Trip details sections (budget, things to do, who's going, invite dialog)
    itinerary/              Day calendar + Add activity dialog
  lib/
    tripStore.ts            <- all trip data reads/writes go through here
    types.ts                Trip, Plan, Todo, Invite, Party
    dates.ts, money.ts      Formatting helpers
    image.ts                Shrinks uploaded photos
    cover.ts                Generated cover art
```

## Theming

Brand colours live in `src/app/globals.css`:

```css
--brand: #1F3A68;             /* navy — logo */
--cta: linear-gradient(...);  /* primary buttons */
```

Font is DM Sans, self-hosted via `@fontsource-variable/dm-sans`.

## Data (for now)

Trips are saved in the browser's `localStorage` under `tripplanner.trips`. Photos are
shrunk to 1200px JPEGs and stored inline, so storage fills after roughly 15–30 photo trips.

Every read and write goes through `src/lib/tripStore.ts` (`useTrips`, `useTrip`, `addTrip`,
`updateTrip`, `removeTrip`). Moving to a real backend means replacing that one file.

## Next up

- [x] Itinerary page
- [ ] Edit / drag plans on the itinerary
- [ ] Login / auth
- [ ] Database + API (replace `tripStore.ts`)
- [ ] Photo uploads to file storage (S3 / Cloudinary) instead of inline data
- [ ] Real email invites and profile pictures in Who's going
