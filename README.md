# Pedro Cunha Carpintaria — Website Premium Multi-Idioma

A premium, multi-page, multilingual website for **Pedro Cunha Carpintaria** — a
bespoke joinery and furniture atelier. The entire visual identity is derived
from the official logo (`/logo.png`): the warm near-black ink (`#1B1B1B`), the
generous negative space, and the interlocking **P/C monogram** geometry that is
reused across the hero, dividers, cards, hover states, menu, footer and admin.

The aesthetic deliberately reads like an architecture studio / premium furniture
brand (Poliform, Molteni&C, Boffi, Vipp, Reform, Norm Architects) — composition,
typography and white space over photography.

---

## ✦ Features

- **Multilingual** (PT / EN / FR) with fully localized URLs
  (`/pt/catalogo`, `/en/catalog`, `/fr/catalogue`) via `next-intl`.
- **Editorial design system** generated from the logo — colors, spacing,
  the P/C monogram motif (SVG), animated draws, hairline grids.
- **Scroll-aware header** — transparent at top → translucent white + blur +
  hairline border on scroll (Apple / Vipp style).
- **Catalog** & **Projects** — dedicated pages with premium grids, instant
  client-side search / category filters / sorting, and individual detail pages
  with galleries + lightbox.
- **Pages**: Home, Catalog, Projects, About, Materials, Contact (+ localized 404).
- **Admin area** (`/admin`) — bcrypt auth, httpOnly session cookies, dashboard,
  full CRUD for catalog, projects and categories, image uploads, publish toggles.
- **Contact form** — Next.js Server Action + Zod validation + honeypot, stored
  in the database.
- **SEO** — per-locale metadata, OpenGraph, hreflang alternates, canonical URLs,
  `sitemap.xml`, `robots.txt`, JSON-LD structured data.
- **Generated brand assets** — `favicon.ico`, `favicon.svg`, `apple-touch-icon`,
  OG / social-sharing images, all derived from `/logo.png`.
- **Graceful images** — any missing/broken photo degrades to the P/C monogram.
- **Docker** ready, with persistent volumes for the database and uploads.

## ✦ Tech stack

| Layer       | Choice |
|-------------|--------|
| Framework   | Next.js 15 (App Router) · React 19 · TypeScript |
| Styling     | Tailwind CSS · shadcn-style primitives · Framer Motion |
| i18n        | next-intl (localized pathnames) |
| Database    | Prisma · SQLite (dev) · PostgreSQL-ready (prod) |
| Validation  | Zod |
| Auth        | bcrypt · `jose` (signed httpOnly session cookie) |
| Images      | `sharp` (upload optimization + asset generation) |
| Deploy      | Docker · Docker Compose |

---

## ✦ Getting started (local)

### 1. Prerequisites
- Node.js ≥ 18.18 (tested on 20+)
- npm

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Then set the values in `.env` (see [Environment](#-environment) below).
A working `.env` is already included for local development.

### 4. Database (migrations + seed)
```bash
npm run db:migrate     # apply migrations (creates prisma/dev.db)
npm run db:seed        # seed demo categories, catalog & projects
```
> `npm run db:migrate` runs the seed automatically on first run.

### 5. Run
```bash
npm run dev            # http://localhost:3000  → redirects to /pt
```

### 6. Admin
Open **http://localhost:3000/admin**.
Default demo credentials:
```
username: admin
password: carpintaria2026
```
> Change these before going live — see [Admin credentials](#admin-credentials).

---

## ✦ Environment

`.env` keys (see `.env.example`):

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | `file:./dev.db` for SQLite, or a `postgresql://…` URL for prod |
| `NEXT_PUBLIC_SITE_URL` | Public base URL — used for canonical/OG/sitemap |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | **bcrypt** hash of the admin password (see below) |
| `SESSION_SECRET` | Long random string used to sign the session cookie |

### Admin credentials

Generate a bcrypt hash for any password:
```bash
npm run hash -- "your-strong-password"
```
This prints a **ready-to-paste, escaped** line, e.g.:
```env
ADMIN_PASSWORD_HASH="\$2a\$12\$....."
```

> ⚠️ **Important:** bcrypt hashes contain `$`. In a `.env` file the `$` must be
> escaped as `\$` (Next's env loader would otherwise treat `$2a`/`$12` as
> variables). The `npm run hash` command already does this for you.
> In `docker-compose.yml`, the same `$` must instead be doubled to `$$`.

Generate a session secret:
```bash
openssl rand -base64 48
```

---

## ✦ Database

The schema lives in [`prisma/schema.prisma`](prisma/schema.prisma). Content is
trilingual (PT/EN/FR fields) for catalog items, projects and categories.

```bash
npm run db:migrate     # create + apply a migration (dev)
npm run db:push        # push schema without a migration
npm run db:seed        # (re)seed demo content
npm run db:studio      # open Prisma Studio
```

### Switching to PostgreSQL (production)
1. In `prisma/schema.prisma`, set `provider = "postgresql"`.
2. Point `DATABASE_URL` at your Postgres instance.
3. Run `npx prisma migrate deploy`.

---

## ✦ API

Public:
```
GET    /api/catalog?locale=pt&category=&search=&sort=
GET    /api/projects?locale=pt&category=&search=
```
Admin (require a valid session cookie → 401 otherwise):
```
GET    /api/admin/catalog            POST   /api/admin/catalog
PUT    /api/admin/catalog/:id        DELETE /api/admin/catalog/:id
GET    /api/admin/projects           POST   /api/admin/projects
PUT    /api/admin/projects/:id       DELETE /api/admin/projects/:id
GET    /api/admin/categories         POST   /api/admin/categories
PUT    /api/admin/categories/:id     DELETE /api/admin/categories/:id
POST   /api/admin/upload             # multipart, field "files"
```
Uploads are optimized with `sharp` (capped at 2000px, re-encoded to WebP) and
written to `/public/uploads`.

---

## ✦ Brand assets

Favicons and social images are generated from `/logo.png`:
```bash
node scripts/generate-assets.mjs
```
Outputs to `public/` (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`,
`icon-192/512.png`, `og-image.png`, `social-share.png`).

---

## ✦ Run with Docker

The image is a self-contained Next.js **standalone** build. SQLite database and
uploads are persisted on named volumes.

```bash
# build + start
docker compose up --build -d

# the site is now on http://localhost:3000
```

On boot the container runs `prisma migrate deploy` automatically.

**Configure** via `docker-compose.yml` (or a root `.env` that Compose reads):
- `NEXT_PUBLIC_SITE_URL` — your public URL (also used as a build arg)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (remember: `$` → `$$` in Compose),
  `SESSION_SECRET`

Volumes:
- `database` → `/data` (SQLite `prod.db`)
- `uploads`  → `/app/public/uploads`

To seed demo content on first boot, set `SEED_ON_START: "true"` on the `web`
service (requires the build to include dev dependencies).

### PostgreSQL in Docker
Uncomment the `db` service in `docker-compose.yml`, switch the Prisma provider to
`postgresql`, and point `DATABASE_URL` at `postgres://…@db:5432/pedrocunha`.

---

## ✦ Deploy to a VPS

1. Install Docker + Docker Compose on the server.
2. Copy the project (or `git clone`) to the VPS.
3. Set production values:
   ```bash
   export NEXT_PUBLIC_SITE_URL="https://pedrocunha.pt"
   export ADMIN_USERNAME="admin"
   export ADMIN_PASSWORD_HASH='$$2a$$12$$...'   # doubled $ for Compose
   export SESSION_SECRET="$(openssl rand -base64 48)"
   ```
4. Build & run:
   ```bash
   docker compose up --build -d
   ```
5. Put a reverse proxy (Nginx / Caddy / Traefik) in front of port `3000` to
   terminate TLS and forward to the container. Example (Caddy):
   ```
   pedrocunha.pt {
       reverse_proxy localhost:3000
   }
   ```
6. Back up the `database` and `uploads` volumes regularly.

---

## ✦ Project structure

```
prisma/                 schema, migrations, seed
public/                 logo.png, generated icons, /uploads
scripts/                hash-password, generate-assets, docker-entrypoint
src/
  app/
    [locale]/           localized public pages (home, catalog, projects, …)
    admin/              login + protected dashboard & CRUD
    api/                public + admin REST endpoints
    sitemap.ts robots.ts manifest.ts
  components/
    brand/              Logo, Monogram, dividers, fallback
    layout/             Header, Footer, language switcher
    sections/           Hero, Values, Process, previews, CTA
    work/               cards, explorer (filter/search), gallery
    admin/              tables, forms, uploader
    ui/                 button, fields, reveal, safe-image
  i18n/                 routing, navigation, request, segment maps
  lib/                  prisma, auth, session, queries, services, seo, validations
  messages/             pt.json · en.json · fr.json
```

---

## ✦ Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Start the production server |
| `npm run db:migrate` | Create & apply a migration (+ seed) |
| `npm run db:push` | Push schema without migration |
| `npm run db:seed` | Seed demo content |
| `npm run db:studio` | Open Prisma Studio |
| `npm run hash -- "pwd"` | Generate an escaped bcrypt hash for `.env` |

---

© Pedro Cunha Carpintaria. Built with Next.js 15, React 19 and Prisma.
