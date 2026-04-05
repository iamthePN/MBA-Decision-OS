# Architecture

## System Overview

MBA Decision OS is a single Next.js application with three major surfaces:

- Public marketing site
- Student portal
- Admin dashboard

The app uses Prisma with PostgreSQL for all primary data storage and NextAuth credentials authentication for role-based access.

## Runtime Layers

### UI Layer

- `src/app/(marketing)` handles public pages.
- `src/app/(auth)` handles login and registration.
- `src/app/portal` handles student workflows.
- `src/app/admin` handles protected admin workflows.

### API Layer

`src/app/api` contains route handlers for:

- Auth registration
- Contact submissions
- Profile updates
- Application tracker CRUD
- Shortlist actions
- Admin scoring controls
- Admin college CRUD and CSV import
- Content management
- Exports
- Account and password updates

### Data Layer

Prisma models cover:

- User identity and role
- Student profile composition
- Exam and education data
- College catalog and placement data
- Recruiters, sectors, and specializations
- Recommendations, shortlists, and applications
- Contact, pricing, testimonials, settings, and scoring weights

## Recommendation Pipeline

1. A student profile is loaded with exam scores, achievements, work experience, and preferences.
2. Colleges are loaded with exams, recruiters, sectors, specializations, and placement stats.
3. Admin-configurable scoring weights are loaded.
4. The engine computes explainable score families for each college.
5. Ranked recommendations are rendered to the student and optionally stored in the `Recommendation` table.

## College Management Pipeline

1. Admin creates or edits a college record.
2. The upsert helper normalizes related catalogs.
3. Placement stats and join tables are rebuilt for the updated college.
4. Student recommendation pages immediately consume the new data.

## Security Model

- Middleware protects `/portal`, `/admin`, `/login`, and `/register` flows.
- Student pages require authenticated sessions.
- Admin routes require `ADMIN` role.
- Mutation routes validate input with Zod.
- Passwords are stored using `scrypt`-based hashing.
- Basic in-memory rate limiting is applied to public submission routes.

## Extendability

Feature-flagged integration points live in:

- `src/lib/integrations/email.ts`
- `src/lib/integrations/storage.ts`
- `src/lib/integrations/analytics.ts`
- `src/lib/integrations/ai.ts`

These can be replaced without changing the core student experience.
