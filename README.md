# Aabhya Foundation — Backend API

Node.js / Express / MongoDB / Cloudinary backend for the AabhyaFoundation React frontend.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys, admin credentials
npm run seed:admin     # creates your first superadmin login
npm run dev            # starts on http://localhost:5000
```

## Folder structure

```
backend/
  config/        mongoose + cloudinary/multer setup
  models/        mongoose schemas
  middleware/    auth (JWT), upload (multer+cloudinary), error handler
  controllers/   route handlers
  routes/        express routers
  utils/         token generation, cloudinary delete helper
  seed/          seedAdmin.js — creates the first admin login
  server.js      app entry point
```

## Auth

All admin (content-management) routes require `Authorization: Bearer <token>`.
Get a token via `POST /api/auth/login` using the admin created by `npm run seed:admin`.

```
POST /api/auth/login        { email, password } -> { token, ... }
GET  /api/auth/me            (private)
POST /api/auth/create-admin  (private, superadmin only) — invite more admins
```

## Resource endpoints

Every content resource follows the same pattern: **public GET for the live site,
private POST/PUT/DELETE for the admin dashboard.**

| Frontend component | Resource | Public | Admin (Bearer token) |
|---|---|---|---|
| `CharityFund.tsx` (video slider) + `PopularCauses.tsx` (image cards) | `Cause` | `GET /api/causes`, `GET /api/causes?featured=true`, `GET /api/causes/:id` | `GET /admin`, `POST`, `PUT /:id`, `DELETE /:id` — multipart fields `image`, `video` |
| `UpcomingEvents.tsx` | `Event` | `GET /api/events` | `GET /admin`, `POST`, `PUT /:id`, `DELETE /:id` — multipart field `image` |
| `TestimonialsSection.tsx` | `Testimonial` | `GET /api/testimonials` | `GET /admin`, `POST`, `PUT /:id`, `DELETE /:id` — multipart field `avatar` |
| `VolunteersSection.tsx` (team grid) | `Volunteer` | `GET /api/volunteers` | `GET /admin`, `POST`, `PUT /:id`, `DELETE /:id` — multipart field `image` |

## Public form submissions

| Frontend component | Endpoint | Notes |
|---|---|---|
| `DonationForm.tsx` ("Get Donate Link") | `POST /api/donations` | Body: `amount, donationType, firstName, lastName, email, causeTitle?`. Creates a Stripe Checkout Session (INR), saves the URL as `paymentLink`, emails it to the donor, and returns it in the response (`{ paymentLink }`) so the frontend can redirect immediately instead of waiting on email. Tries to link `causeTitle` to a `Cause` by title. Admin: `GET/PUT /api/donations`. |
| `ContactSection.tsx` | `POST /api/contact` | Body: `name, email, phone?, subject?, message`. Sends an acknowledgment email to the sender. Admin: `GET /api/contact`, `PUT /:id/read`, `DELETE /:id`. |
| `Footer.tsx` newsletter box | `POST /api/newsletter` | Body: `email`. Admin: `GET /api/newsletter`, `DELETE /:id`. |
| "BECOME A VOLUNTEER" link → `/VolunteerPage` | `POST /api/volunteer-applications` | **Assumed schema** — the actual `VolunteerPage.tsx` file wasn't provided, so this uses `fullName, email, phone, areaOfInterest?, availability?, message?`. Adjust `models/VolunteerApplication.js` once you share that page. Sends an acknowledgment email. Admin: `GET`, `PUT /:id` (status), `DELETE /:id`. |

## Payments (Stripe)

`POST /api/donations` creates a Stripe Checkout Session in INR and stores the
resulting URL on the donation as `paymentLink`. Point the frontend's "Get
Donate Link" button at the returned `paymentLink` (or just let the donor
follow the emailed link).

Webhook: `POST /api/webhooks/stripe` — verifies the Stripe signature and flips
`donation.status` to `completed` on `checkout.session.completed`. Test locally with:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

## Emails (Nodemailer)

Donor/contact/volunteer-applicant confirmations, plus optional admin alerts to
`ADMIN_NOTIFICATION_EMAIL`, are sent via SMTP (`SMTP_HOST/PORT/USER/PASS` in
`.env` — Gmail works with an App Password). Email sends never block or fail
the API response — if SMTP isn't configured, the request still succeeds and
a warning is logged instead.

## Uploads

All image/video uploads go straight to Cloudinary via `multer-storage-cloudinary`
(no local disk writes). Causes accept both an `image` and a `video` field in the
same multipart request since `CharityFund.tsx` uses video and `PopularCauses.tsx`
uses images — send whichever the frontend needs.

Deleting or replacing a record automatically removes the old Cloudinary asset.

## Rate limiting

Public write endpoints (`/api/donations`, `/api/contact`, `/api/newsletter`,
`/api/volunteer-applications`) are rate-limited to 20 requests / 15 min per IP
to reduce spam.

## Not yet included (flag if you want these next)

- Gallery/media model — `Gallery.tsx` page wasn't shared, so no endpoint for it yet.
- Frontend wiring — the React components still use hardcoded arrays; swapping
  them to fetch from these endpoints (and building the admin dashboard UI) is the
  next step.
