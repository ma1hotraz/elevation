# Elevation Coaching Institute

A production-oriented Next.js website and role-based learning portal backed by Supabase Auth and PostgreSQL.

## What is included

- Public coaching website with responsive navigation, programme sections, testimonials, FAQs, enquiry form, SEO metadata, sitemap, robots rules, and configurable contact/social details.
- Supabase email/password authentication with secure SSR session refresh and password-recovery callback handling.
- Admin, teacher, and student workspaces with clear role-specific navigation.
- Account creation, editing, suspension, deletion, and forced temporary-password change flows.
- Course-scoped resources, answer-release controls, student progress, assessment history, payments, and admissions enquiries.
- PostgreSQL Row Level Security, least-privilege grants, audit logs, durable enquiry rate limiting, hashed request identifiers, and server-only admin operations.
- Unit, integration-style component, browser-flow, lint, type, and production-build checks.

## Technology

- Next.js 16, React 19, TypeScript, Tailwind CSS
- Supabase Auth, PostgreSQL, Realtime, and Row Level Security
- Zod validation
- Vitest, Testing Library, and Playwright

## Local setup

### 1. Install

Use Node.js 20.12 or newer.

```bash
npm install
```

### 2. Create a Supabase project

Create a project, then copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add the project URL, browser-safe publishable key, and server-only secret key. Never expose the secret key in a `NEXT_PUBLIC_` variable.

### 3. Apply the database migration

Run the contents of this file in the Supabase SQL Editor:

```text
supabase/migrations/20260712000000_initial_production_schema.sql
```

Alternatively, with a linked Supabase CLI project:

```bash
supabase db push
```

The migration creates the complete schema, functions, triggers, indexes, grants, RLS policies, rate limiter, audit log, and Realtime publication entries.

### 4. Configure Auth URLs

In **Supabase → Authentication → URL Configuration**:

- Site URL for local development: `http://localhost:3000`
- Add redirect URL: `http://localhost:3000/auth/confirm`
- For production, use your exact HTTPS origin and add `https://your-domain.com/auth/confirm`

The included callback accepts both PKCE `code` callbacks and token-hash recovery links.

For a custom recovery email template, the confirmation link can point to:

```text
{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery
```

### 5. Create the first administrator

Set the three `BOOTSTRAP_ADMIN_*` values in `.env.local`, then run:

```bash
npm run bootstrap:admin
```

After the administrator is created, remove the bootstrap password from local and hosting environment variables.

### 6. Start the app

```bash
npm run dev
```

Open `http://localhost:3000` and use `/portal` for sign-in.

## Role permissions

| Capability | Admin | Teacher | Student |
|---|---:|---:|---:|
| Manage student/teacher accounts | Yes | No | No |
| Manage all payments | Yes | No | View own |
| Review admissions enquiries | Yes | No | No |
| Manage resources | All courses | Assigned courses | View assigned |
| Update student progress/scores | All students | Shared-course students | View own |
| View user profiles | All managed users | Shared-course students | Own profile |
| Update own profile/password | Yes | Yes | Yes |

Authorization is enforced in PostgreSQL RLS and server routes, not only by hidden UI controls.

## Important flows

### Managed account onboarding

1. Admin creates a student or teacher.
2. The server uses Supabase Admin Auth to create the identity.
3. A database RPC atomically saves profile, role, status, courses, initial performance, and audit data.
4. The UI displays a one-time temporary password.
5. The user must replace it on first sign-in.

### Password recovery

A user requests recovery from `/portal`. Supabase sends the email, `/auth/confirm` verifies it, and the user is taken to the protected password-reset view.

### Enquiries

The public form is validated client-side and server-side. The server rejects oversized/non-JSON requests, uses a honeypot, rate-limits by an irreversibly hashed request identifier, and stores valid leads for the admin admissions inbox.

## Validation commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
npm run test:e2e
npm audit
```

Playwright installs its managed browser with:

```bash
npx playwright install chromium
```

## Production deployment

Set these required variables in the hosting platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL` using the final HTTPS origin
- `ENQUIRY_HASH_SALT`

Add the public contact variables you want shown on the site. Do not add the `BOOTSTRAP_ADMIN_*` values after initial setup.

Before launch:

1. Apply the migration to the production Supabase project.
2. Add the production Auth Site URL and `/auth/confirm` redirect.
3. Create the first admin.
4. Test account creation, first-login password change, recovery email, role boundaries, resource publishing, student progress, payment correction/deletion, and enquiry submission using real accounts.
5. Confirm all marketing claims, testimonials, programme details, founder copy, pricing, and contact information with the institute owner.
6. Run `npm run check`, `npm run test:e2e`, and `npm audit` from a clean install.

## Security notes

- The Supabase secret key is imported only by server-only modules.
- Passwords and sessions are never stored in `localStorage`.
- Admin mutations require an authenticated active-admin profile and trusted same-origin requests.
- User-facing URLs allow HTTP/HTTPS only in both application validation and database constraints.
- Public tables are protected by RLS; sensitive admin operations use narrowly scoped service RPCs.
- Security headers disable framing, MIME sniffing, unnecessary browser capabilities, and cross-origin opener/resource access.
- Enquiry IP values are never stored directly.

## Project documents

- `supabase/migrations/20260712000000_initial_production_schema.sql` — complete backend schema.
- `.env.example` — required and optional environment variables.
