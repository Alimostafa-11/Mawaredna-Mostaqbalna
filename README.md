# مواردنا مستقبلنا — Mawaredna Mostaqbalna

الموقع الرسمي لشركة مواردنا مستقبلنا لجمع وتدوير ومعالجة المخلفات الزراعية ومخلفات
قصب السكر وإنتاج الكمبوست والأسمدة العضوية.

The official website for Mawaredna Mostaqbalna — agricultural and sugarcane
waste collection, processing and recycling into compost and organic fertilisers.

**Arabic is the default language** (`/ar`, RTL). English (`/en`, LTR) is
available from the language switcher in the header.

---

## Stack

| Layer | Choice | Version |
| --- | --- | --- |
| API | NestJS | 12 |
| Database | MongoDB via Mongoose | 9 |
| Frontend | Next.js App Router | 16 |
| UI | HeroUI + Tailwind CSS | 3 / 4 |
| i18n | next-intl | 4 |
| Object storage | Amazon S3 (`@aws-sdk/client-s3` v3) | — |
| Language | TypeScript | 6 |

Everything is on a current, maintained release. Two notes on that:

- **`@nestjs/throttler` is not used.** Its latest release still caps at NestJS 11,
  so rate limiting runs on `express-rate-limit` at the Express layer instead
  (`apps/api/src/common/rate-limit.ts`).
- **ESLint is pinned to 9, not 10.** `eslint-config-next@16` depends on
  `eslint-plugin-react`, which has no ESLint 10 support yet; on ESLint 10 the
  lint run crashes. ESLint 9 is what the Next toolchain currently supports.

---

## Layout

```
.
├── apps/
│   ├── api/                  NestJS API
│   │   └── src/
│   │       ├── common/       Shared CRUD base, DTOs, filters, rate limiting
│   │       ├── config/       Environment validation (zod, fails fast at boot)
│   │       ├── modules/      auth, settings, services, products, projects,
│   │       │                 partners, media, inquiries, calculator, uploads,
│   │       │                 health
│   │       └── seed/         Idempotent seed of the brief's content
│   └── web/                  Next.js site
│       └── src/
│           ├── app/(site)/    Public site, one route per section of the brief
│           ├── app/(admin)/   /dashboard — admin panel (own root layout)
│           ├── app/api/       Login, logout and the authenticated API proxy
│           ├── components/   layout, ui, forms, gallery, dashboard
│           ├── i18n/         Routing, request config, navigation helpers
│           ├── lib/          API clients, types, helpers
│           └── messages/     ar.json (primary) and en.json
└── docker-compose.yml        Mongo + MinIO + API + web for local development
```

---

## Running locally

### With Docker (recommended)

```bash
docker compose up -d --build
docker compose exec api node dist/seed/seed.js
```

| Service | URL |
| --- | --- |
| Website | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |
| API | http://localhost:4000/api/v1 |
| API docs (Swagger) | http://localhost:4000/api/docs |
| MinIO console | http://localhost:9001 (`minioadmin` / `minioadmin`) |

MinIO stands in for S3 locally so uploads can be exercised without an AWS
account.

### Without Docker

You need a MongoDB instance reachable from your machine.

```bash
npm install

cp apps/api/.env.example apps/api/.env      # set MONGODB_URI and JWT_SECRET
cp apps/web/.env.example apps/web/.env.local

npm run seed          # seeds content + the admin account
npm run dev:api       # http://localhost:4000
npm run dev:web       # http://localhost:3000
```

### Scripts

| Command | Effect |
| --- | --- |
| `npm run dev:api` / `npm run dev:web` | Start one app in watch mode |
| `npm run build` | Build both apps |
| `npm run typecheck` | Typecheck both apps |
| `npm run lint` | Lint both apps |
| `npm run seed` | Seed content and the admin account (idempotent) |

---

## Content model

Every editorial field is bilingual — `{ ar, en }`. Arabic is required, English
optional; the site falls back to Arabic when a translation is missing
(`apps/web/src/lib/utils.ts`).

| Collection | Section of the brief |
| --- | --- |
| `settings` | Company identity, vision, mission, goals, contact details |
| `services` | مجالات عمل الشركة |
| `products` | الكمبوست — specs, stages, usage, lab reports, packaging |
| `projects` | المشروعات وسابقة الأعمال |
| `partners` | العملاء والشركاء |
| `media` | معرض الصور والفيديو |
| `inquiries` | All captured leads, including calculator quote requests |
| `admins` | Dashboard accounts |

### What the seed deliberately leaves empty

`npm run seed` loads only what the brief actually specifies: company identity,
vision and mission, the nine lines of work, and the compost product with its
four published specifications.

**Projects, partners and gallery media start empty on purpose.** The brief
requires the commercial register, licences, laboratory reports and written
partner consents to be checked before any of that is published, so those
sections render a "being prepared" placeholder until someone adds records
through the admin API. In the same spirit:

- `partners.isApproved` gates every logo — the public endpoint filters on it.
- `projects.arePartnersApproved` gates partner names on a project.
- The compost page states that final specifications follow the accredited lab
  analyses, and shows a pending note while `labResults` is empty.

---

## The farm calculator

`/calculator` estimates compost requirement from area (feddan), crop and soil,
then offers to send the result as a quote request.

The rate table lives in **`apps/api/src/modules/calculator/calculator.constants.ts`**,
not in the frontend, so the agronomic assumptions can be tuned without a
frontend deploy. Tonnes are converted to cubic metres using the product's own
bulk density (500–600 kg/m³).

> **Review these figures with the company's agronomist before launch.** They are
> conventional planning ranges, and every response carries a disclaimer saying
> the estimate does not replace a soil analysis or a site visit.

---

## API surface

Public `GET` endpoints need no authentication. Writes require a bearer token
from `POST /api/v1/auth/login`.

```
GET  /api/v1/health
GET  /api/v1/settings
GET  /api/v1/services            GET /api/v1/services/:slug
GET  /api/v1/products            GET /api/v1/products/:slug
GET  /api/v1/projects            GET /api/v1/projects/:slug
GET  /api/v1/partners            GET /api/v1/media
GET  /api/v1/calculator/options  POST /api/v1/calculator/estimate
POST /api/v1/inquiries
POST /api/v1/auth/login
GET  /api/v1/media/admin         (admin) gallery list including hidden items
POST /api/v1/uploads/presign     (admin) direct-to-S3 upload URL
```

Full schema: http://localhost:4000/api/docs — this is also the closest thing
to an admin console today (see below). It is served when `ENABLE_SWAGGER=true`,
which defaults to on outside production.

---

## Admin access

The dashboard lives at **/dashboard** — outside the `[locale]` segment, so it
has no localized URLs, no sitemap entry and sends `noindex`.

| Page | What it does |
| --- | --- |
| `/dashboard/login` | Sign in with an admin account |
| `/dashboard` | Lead counts by status and type, plus the latest requests |
| `/dashboard/leads` | Inbox: filter by status, type and free text; expand a lead for the full record; change status and keep internal notes |
| `/dashboard/content` | What is published per collection, and what is held back awaiting approval |
| `/dashboard/media` | Upload gallery photos and videos, optionally name and categorise them, reorder, hide or delete |
| `/dashboard/api` | Run the admin-protected GET endpoints and read the raw JSON |

Seeded credentials are `ADMIN_EMAIL` / `ADMIN_PASSWORD` from the API env
(`admin@mawaredna.com` / `ChangeMe123!` by default — change them).

### How the session works

Login posts to `/bff/auth/login`, a Next route handler that calls the API and
stores the JWT in an **httpOnly cookie**. Page scripts can never read it, which
matters because the dashboard displays customers' names and phone numbers.

Because the token is httpOnly, browser code cannot call the API directly.
Writes go through `/bff/admin/*`, a pass-through that attaches the token
server-side. It grants nothing beyond the signed-in session — the API still
enforces its guard on every route.

### Gallery uploads

`/dashboard/media` is the one content type with a full editor. Files are
staged in the browser, optionally named and categorised, then uploaded one at
a time.

**Nothing on a gallery item is required.** Name and caption may be left blank
in either language, or filled in only in English — a batch shot at a work site
can be published as-is and labelled later. An item with no text renders as just
the photo or video, with no empty caption strip. The other collections
(services, products, projects, partners) still require their Arabic labels;
only the gallery uses the relaxed variant.

The steps:

1. `POST /uploads/presign` returns a short-lived `uploadUrl` and object key
2. The **browser** PUTs the file straight to S3 — the bytes never pass through
   the API or the Next server, so a 200 MB site video costs neither container
   anything
3. For a video, a poster frame is grabbed from the local file with a canvas and
   uploaded alongside it
4. `POST /media` saves the record; if that fails the object is deleted again,
   so a failed publish leaves nothing behind

Deleting a gallery item also deletes its objects from the bucket. Hiding
(`isActive: false`) is the reversible option and is offered first.

Because the browser PUTs directly, **the bucket needs CORS** allowing `PUT` and
the `Content-Type` header from the site's origin. MinIO permits this out of the
box; a real S3 bucket does not until you set it:

```json
[{ "AllowedOrigins": ["https://mawaredna.com"],
   "AllowedMethods": ["PUT"],
   "AllowedHeaders": ["*"],
   "ExposeHeaders": ["ETag"],
   "MaxAgeSeconds": 3000 }]
```

The full walkthrough, including the smoke test that catches a wrong CORS rule,
is in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Accepted formats are JPG, PNG, WebP and AVIF up to 15 MB, and MP4 and WebM up
to 200 MB. Anything else — `.mov` off an iPhone, `.heic` — has to be converted
first, because the gallery renders these files directly in the browser.

### Not in the dashboard yet

Creating and editing services, products, projects and partners still happens
through the API. Use `/dashboard/api` to read, and Swagger at
http://localhost:4000/api/docs for writes:

1. `POST /api/v1/auth/login`, copy `accessToken`
2. Click **Authorize**, paste it
3. Every padlocked endpoint becomes callable

### Lead capture protections

- `express-rate-limit`: 5 requests/minute per IP on `POST /inquiries` and
  `POST /auth/login`; a general limit on everything else.
- A honeypot field: submissions that fill it are dropped and still answered
  `201`, so the bot does not retry with a different shape.
- Login compares against a dummy hash when the account does not exist, so
  response time does not reveal which emails are registered.

---

## Deploying to AWS

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the full walkthrough.

In short: both apps build to standalone Docker images (`apps/*/Dockerfile`,
built from the repository root). The API runs behind an ALB, the site can run
on ECS/App Runner or Amplify, media lives in S3 behind CloudFront, and the
database is either MongoDB Atlas or DocumentDB.

**Do not put explicit AWS keys in the task definition.** Leave
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` unset in AWS and the SDK picks
up the task's IAM role — the S3 client is written for that
(`apps/api/src/modules/uploads/s3.service.ts`).

---

## Before launch — assets still needed from the client

The brief lists these, and the site has a place for each one:

1. Commercial register, tax card, licences and approvals → verify activities,
   then fill `commercialRegisterNo` / `taxCardNo` in settings.
2. High-resolution logo → `settings.logoUrl`.
3. Official address, phone numbers, WhatsApp, email, social links → settings.
4. Real photographs of sites, equipment, compost windrows, turning, the
   finished product, supply, farms and the team → gallery.
5. Laboratory analyses and final technical specifications → the compost
   product's `labResults` and `specifications`.
6. Project and track-record data → projects.
7. Partner and client names and logos, **with written consent** → partners.
8. Target governorates → `settings.servedGovernorates` and the calculator's
   governorate list.

Until each arrives, the matching section shows its placeholder rather than
inventing content.
