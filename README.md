# club-directory

**ClubHub** is a Next.js student club directory: browse clubs, favorite them, view a calendar, and (optionally) manage clubs via an admin UI backed by MySQL.

## What it is

A web app (`club-hub/`) for school club discovery and involvement:

- **Dashboard** (`/dashboard`) — landing / overview
- **Clubs** (`/clubs`) — search, filter, view details, favorites
- **Calendar** (`/calendar`) — schedule view
- **Admin** (`/admin`) — club management
- **API** — `/api/clubs`, `/api/favorites` over MySQL (`mysql2`)

If the DB is down, clubs fall back to local JSON data.

Stack: Next.js 16, React 19, TypeScript, Tailwind, Sass, Lucide.

## How to run it

1. **Install deps** (from `club-hub`):

```bash
cd club-hub
npm install
```

2. **(Optional) MySQL** — create DB `club_directory` with the tables described in `club-hub/DATABASE_INTEGRATION.md`, then add `club-hub/.env.local`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=club_directory
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Skip this if you just want the JSON fallback.

3. **Start the app**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

Other scripts: `npm run build` then `npm start` for production; `npm run lint` for linting.
