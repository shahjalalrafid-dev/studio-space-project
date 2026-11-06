# StudioSpace — book creative studios by the hour

A peer-to-peer marketplace where creators discover photography studios, sound
stages, podcast lounges, music suites and art workshops, inspect their specs
and reserve them by the hour — with hosts able to publish, update and remove
their own listings.

Built with **Next.js 16 (App Router + Turbopack)**, **React 19**, **MongoDB
Atlas**, **Better Auth** and **Tailwind CSS v4**, with **Sonner** toasts and
**Swiper** carousels.

---

## Feature overview

| Area | Where | Notes |
| --- | --- | --- |
| Home | `/` | Hero slider, live featured studios, category rail with MongoDB counters, booking steps, host guarantee |
| Explore | `/studios` | Grid of all listings, category filter chips, free-text search, empty states |
| Details | `/studios/[slug]` | Gallery carousel, specs, amenity checklist, host card, reviews, booking modal |
| Add studio | `/add-studio` | **Private** — full create form + imgbb image upload |
| My listings | `/my-listings` | **Private** — table/cards of your spaces, Update + Delete (confirmation modal) |
| Edit studio | `/studios/edit/[id]` | **Private** — pre-filled form, read-only host info |
| My bookings | `/my-bookings` | **Private** — status badges, Cancel while *Pending* |
| Auth | `/login`, `/register` | Better Auth (email/password + Google/GitHub), `?next=` return paths |
| 404 | any unknown URL | Custom studio-set illustration + **Return to Home** |

Loading states are covered by branded `loading.tsx` skeletons on every route,
`<PrivateRoute>` shows a spinner while the session resolves, and every CRUD,
auth and booking action reports through the Sonner toaster.

---

## Routes & API

### Pages

| Route | Access | Data |
| --- | --- | --- |
| `/` | public | `getFeaturedStudios`, `getCategoryCounts`, `getMarketplaceStats` |
| `/studios` | public | `getStudios({ category, search })` |
| `/studios/[slug]` | public | `getStudioByIdOrSlug` + similar studios |
| `/add-studio` | private | `POST /api/studios` |
| `/studios/edit/[id]` | private | `GET /api/studios/[id]` → `PUT /api/studios/[id]` |
| `/my-listings` | private | `GET /api/studios?mine=1` → `DELETE /api/studios/[id]` |
| `/my-bookings` | private | `GET /api/bookings?mine=1` → `PATCH /api/bookings/[id]` |

### API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/studios` | Public listing (`?mine=1` = owner-only) |
| `POST` | `/api/studios` | Create a studio (stamped with the session's `ownerEmail`/`ownerName`) |
| `GET` | `/api/studios/[id]` | Single studio by `_id` **or** `slug` |
| `PUT` | `/api/studios/[id]` | Owner-only update (403 for other accounts) |
| `DELETE` | `/api/studios/[id]` | Owner-only delete (403 for other accounts) |
| `POST` | `/api/bookings` | Create a reservation with `status: "Pending"` |
| `GET` | `/api/bookings?mine=1` | Reservations for the signed-in email |
| `PATCH` | `/api/bookings/[id]` | Cancel a *Pending* booking (owner-only) |
| `POST` | `/api/upload` | Proxy an image file to **imgbb**, returns the hosted URL |
| `*` | `/api/auth/[...all]` | Better Auth handlers |

Every mutating route requires a Better Auth session; ownership is always
re-checked against `ownerEmail` **on the server**, never trusted from the
client.

---

## Data model (MongoDB `studio-space` database)

**`studios`** — `slug`, `title`, `category`, `address` (+`city`/`area`/`country`),
`pricePerHour`, `securityDeposit`, `capacity`, `sizeSqft?`, `image`, `gallery[]`,
`description`, `tags[]`, `amenities[]`, `host{name,verified}`,
`reviewList[]`, `rating`, `reviews`, **`ownerEmail`**, **`ownerName`**,
`createdAt`, `updatedAt`.

**`bookings`** — snapshot of the studio (`studioId`, `studioSlug`,
`studioTitle`, `studioImage`, `pricePerHour`, …) plus `name`, `email`, `phone`,
`date`, `startTime`, `hours`, `guests`, `message`, `totalPrice`,
`status: Pending | Confirmed | Completed | Cancelled`, `createdAt`.

**`user` / `session` / `account` / `verification`** — managed by Better Auth
through `@better-auth/mongo-adapter`.

---

## Environment variables

Create a `.env` in the project root (git-ignored):

```bash
# MongoDB Atlas connection string (database: studio-space)
MONGO_DB_URL=mongodb+srv://USER:PASS@cluster0.mongodb.net/?retryWrites=true&w=majority

# Better Auth
BETTER_AUTH_SECRET=generate-one-with: npx @better-auth/cli secret
BETTER_AUTH_URL=http://localhost:3000

# Optional OAuth (buttons are hidden/disabled gracefully when absent)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Free key from https://imgbb.com/api (powers the "Upload image" button)
IMGBB_API_KEY=
```

> `MONGO_DB_URL` is the only hard requirement. If it is missing the build still
> succeeds — data routes answer with a clear error instead of crashing
> `next build`.

---

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run db:seed      # optional: 13 demo studios (uses --env-file=.env)
npm run build        # production build (Turbopack + type checking)
npm run lint         # eslint
```

Seeded demo documents have no `ownerEmail`, so they never show up under
*My Studio Listings* — listings you create yourself do.

---

## Deploying to Vercel

> **Why a deploy fails here (and how to fix it):**
>
> 1. **Build errors fail the deployment.** `next build` runs a full
>    TypeScript pass; a single `TSxxxx` error (e.g. a missing import in
>    `src/app/studios/[slug]/page.tsx`) aborts the build. Check the
>    *Build Logs* first — the error names the exact file and line.
> 2. **Env vars must be set in Vercel** (Project → Settings → Environment
>    Variables). `.env` is git-ignored, so Vercel never sees it. Set at least
>    `MONGO_DB_URL` and `BETTER_AUTH_SECRET` (plus `BETTER_AUTH_URL` =
>    your production domain, `IMGBB_API_KEY` for uploads, and the OAuth keys
>    if you use them). Re-deploy after adding them.
> 3. **MongoDB Atlas must allow Vercel's IPs.** In Atlas → Network Access add
>    `0.0.0.0/0` (or Vercel's IP ranges). Without this the site builds fine
>    but every page renders the empty state / API returns 500.
> 4. **OAuth callback URLs** must include the production origin
>    (`https://your-app.vercel.app/api/auth/callback/google`).
>
> Checklist: `npm run build` passes locally → env vars set in Vercel →
> Atlas IP allowlisted → redeploy.

Standard flow: push to `main`, import the repo in Vercel, keep the detected
framework preset (Next.js), add the env vars above, deploy.

---

## Project structure

```
src/
  app/                     # App Router pages, API routes, loading/not-found
    api/
      auth/[...all]/       # Better Auth catch-all
      studios/             # CRUD (POST/GET + [id] GET/PUT/DELETE)
      bookings/            # create/list + [id] PATCH (cancel)
      upload/              # imgbb proxy
    add-studio/            # private: create form
    my-listings/           # private: owned listings + delete modal
    my-bookings/           # private: reservations + cancel
    studios/
      page.tsx             # explore grid + search
      [slug]/page.tsx      # details, gallery, reviews, booking modal
      edit/[id]/page.tsx   # private: update form
    not-found.tsx          # custom 404
    loading.tsx            # + per-route skeletons
  components/
    studios/               # StudioCard, StudioForm, StudioGallery,
                           # BookingModal, MyListings, MyBookings,
                           # ConfirmModal, StatusBadge
    routes/PrivateRoute.tsx
    ui/                    # StudioLoader + skeletons, Toaster
    layout/ auth/ home/    # chrome + marketing sections
  context/AuthContext.tsx  # session state for the whole app
  lib/
    mongo.ts               # cached MongoClient (globalThis)
    studios.ts bookings.ts # collections: reads, writes, validation
    auth.ts auth-client.ts # server + browser Better Auth
    site.ts                # nav/footer/category vocabulary
scripts/seed-studios.mjs   # idempotent demo data
```
