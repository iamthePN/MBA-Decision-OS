# MBA Decision OS

From Applications to Outcomes

MBA Decision OS is a full-stack MBA application and decision intelligence platform that helps students choose the best-fit MBA programs using explainable scoring across profile strength, admission probability, ROI, placements, role quality, career trajectory, risk appetite, and long-term financial outcome.

## 1. Project Overview

This repository contains:

- A public marketing site with positioning, pricing, features, and contact capture.
- A student portal for profile building, recommendation discovery, college comparison, ROI simulation, and application tracking.
- A protected admin dashboard for college CRUD, CSV import, scoring-weight management, and content/catalog operations.
- A transparent scoring engine using configurable weighted rules rather than black-box AI.
- Docker, Prisma, PostgreSQL, seed data, exports, and documentation.

## 2. Core Product Positioning

MBA Decision OS is not a college listing site.

It is an outcome-first MBA decision platform built around:

- Profile-fit based decisions, not ranking-only browsing.
- Outcome-first evaluation, not admission-only counseling.
- ROI-focused recommendation logic, not fee-first filtering.
- Candidate-centric modeling, not college-centric marketing.
- Predictive and explainable reasoning, not opaque scoring.
- Dynamic recommendation workflows, not static content pages.

## 3. Features

### Public Website

- Home / landing page
- About page
- Features page
- How It Works page
- Pricing page
- Contact page with saved submissions

### Student Portal

- Dashboard with profile completion, strength, readiness, ROI, recommendations, and warnings
- Profile Builder with academics, exams, work experience, goals, funding, and preferences
- Profile Evaluation with explainable score contributions
- College Discovery with filtering, sorting, and pagination
- College Detail pages with fit, ROI, risk, placements, and profile match
- Recommendation Engine with ranked fit reasons in plain English
- Career Path Simulator / Digital Twin
- Application Tracker with status, deadlines, notes, and fees paid
- Compare Colleges view
- Settings with account updates, password change, theme toggle, and exports
- Printable recommendation report

### Admin Dashboard

- College CRUD
- CSV import for college data
- Scoring weight editor
- User and application visibility
- Testimonial / pricing / contact / catalog management
- Featured college control through the college form

## 4. Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives in `src/components/ui`
- Prisma ORM
- PostgreSQL
- NextAuth credentials auth
- Zod validation
- React Hook Form
- Recharts
- Framer Motion
- Docker + docker-compose
- ESLint + Prettier
- Prisma seed script

## 5. Architecture Summary

### Frontend

- `src/app/(marketing)` contains the public website.
- `src/app/(auth)` contains login and registration.
- `src/app/portal` contains student portal pages.
- `src/app/admin` contains the protected admin dashboard.

### Backend

- Route handlers live under `src/app/api`.
- Prisma handles all persistence.
- `src/lib/scoring` contains the recommendation engine.
- `src/lib/data.ts` contains query orchestration for dashboards and recommendations.
- `src/lib/admin.ts` contains reusable college upsert logic.

### Data Flow

1. Students create an account and complete a profile.
2. Profile data is saved into Prisma models.
3. Recommendation pages load colleges and scoring weights.
4. The scoring engine calculates fit, readiness, ROI, and recommendation output.
5. Students shortlist, compare, simulate, and track applications.
6. Admins tune weights and update data without changing code.

## 6. Folder Structure

```text
.
+- prisma/
¦  +- schema.prisma
¦  +- seed.ts
+- docs/
¦  +- architecture.md
¦  +- integration-guide.md
¦  +- user-guide.md
¦  +- scoring-engine.md
¦  +- college-import-template.csv
+- src/
¦  +- app/
¦  ¦  +- (marketing)/
¦  ¦  +- (auth)/
¦  ¦  +- admin/
¦  ¦  +- portal/
¦  ¦  +- api/
¦  +- components/
¦  ¦  +- admin/
¦  ¦  +- dashboard/
¦  ¦  +- forms/
¦  ¦  +- layout/
¦  ¦  +- ui/
¦  +- lib/
¦  ¦  +- auth/
¦  ¦  +- integrations/
¦  ¦  +- scoring/
¦  +- types/
+- Dockerfile
+- docker-compose.yml
+- package.json
+- .env.example
```

## 7. Database Schema Summary

Key Prisma models:

- `User`
- `StudentProfile`
- `EducationRecord`
- `ExamType`
- `ExamScore`
- `WorkExperience`
- `Achievement`
- `Preference`
- `College`
- `CollegeExamAcceptance`
- `PlacementStat`
- `Recruiter`
- `Sector`
- `CollegeRecruiter`
- `CollegeSector`
- `CollegeSpecialization`
- `Recommendation`
- `Shortlist`
- `Application`
- `ContactMessage`
- `Testimonial`
- `PricingPlan`
- `AdminSetting`
- `ScoringWeight`

See `prisma/schema.prisma` and `docs/architecture.md` for more detail.

## 8. Environment Variables

Copy `.env.example` to `.env` and update values.

Required core values:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APP_NAME`
- `APP_URL`

Optional integrations are feature-flagged:

- Email: `ENABLE_EMAIL_NOTIFICATIONS`, `EMAIL_PROVIDER`, SMTP variables
- Storage: `ENABLE_FILE_STORAGE`, `STORAGE_PROVIDER`, `STORAGE_BUCKET`
- Analytics: `ENABLE_ANALYTICS`, `ANALYTICS_PROVIDER`, `ANALYTICS_WRITE_KEY`
- AI summaries: `ENABLE_AI_SUMMARIES`, `AI_PROVIDER`, `AI_API_KEY`

## 9. Installation Steps

### Prerequisites

- Node.js 22+
- npm 10+
- Docker Desktop
- PostgreSQL 16+ locally, or use Docker

### Local Install

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 10. Docker Setup Steps

```bash
docker compose up --build
```

What Docker does here:

- Starts PostgreSQL
- Builds the app container
- Runs `prisma generate`
- Pushes the schema to the database
- Seeds demo data
- Starts Next.js on port `3000`

Windows note:

- Docker Desktop must be running before `docker compose` commands will work.
- If you see an error mentioning `//./pipe/dockerDesktopLinuxEngine`, the Docker Desktop engine is not running yet.
- On Windows, the simplest path is often to run only PostgreSQL in Docker and run the app locally:

```powershell
docker compose up -d postgres
npm run db:push
npm run db:seed
npm run dev
```

## 11. Database Migration Steps

Quick-start schema sync:

```bash
npm run db:push
```

Tracked migration workflow:

```bash
npm run db:migrate -- --name init
```

This repository favors `db:push` for fastest first-run demo setup. If you are turning this into a long-lived production deployment, create and commit formal Prisma migrations.

## 12. Seed Data Steps

```bash
npm run db:seed
```

Seed coverage includes:

- 20 seeded colleges
- 7 exam types
- multiple specializations
- multiple recruiters
- multiple sectors
- 3 demo students
- 1 demo admin
- pricing plans
- testimonials
- contact messages
- scoring weights
- demo shortlists, applications, and recommendations

## 13. Local Development Steps

```bash
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

## 14. Production Deployment Steps

Recommended production flow:

1. Provision PostgreSQL.
2. Set production environment variables.
3. Install dependencies and build.
4. Run Prisma generate.
5. Run Prisma migrations or `db:push` for a controlled initial setup.
6. Run the seed only if you want demo content in production.
7. Start Next.js with `npm run start`.

```bash
npm install
npm run prisma:generate
npm run build
npm run start
```

## 15. Demo Credentials

### Admin

- Email: `admin@mbadecisionos.dev`
- Password: `Admin@12345`

### Demo Student

- Email: `student@mbadecisionos.dev`
- Password: `Student@12345`

Additional students:

- `ananya@mbadecisionos.dev` / `Student@12345`
- `rahul@mbadecisionos.dev` / `Student@12345`

## 16. How To Use The Student Portal

1. Register or log in with a seeded demo student.
2. Open `Profile Builder` and review or update profile data.
3. Visit `Evaluation` to inspect score contributions.
4. Visit `Recommendations` to review ranked colleges.
5. Use `College Discovery` to filter the catalog.
6. Open a `College Detail` page for explainability and fit context.
7. Add strong options to your shortlist.
8. Use `Compare` to place colleges side by side.
9. Use `Digital Twin` to simulate tuition, earnings, and payback scenarios.
10. Use `Applications` to track deadlines, status, and next steps.
11. Open `Settings` to export CSVs or print the report.

## 17. How To Use The Admin Dashboard

1. Log in as the seeded admin.
2. Open `Colleges` to create, edit, delete, or import college records.
3. Open `Scoring` to tune weight values.
4. Open `Users` to inspect pipeline activity.
5. Open `Content` to manage testimonials, pricing, contact submissions, exams, recruiters, and sectors.
6. Open `Settings` for deployment and integration reminders.

## 18. How To Add / Edit Colleges

- Use `Admin > Colleges`.
- Fill in base college data, fees, salaries, recruiter lists, sectors, and specialization strengths.
- Toggle `Featured` to surface a college on the landing page.
- Use the CSV import action for batch updates.
- Sample import headers are included in `docs/college-import-template.csv`.

## 19. How Scoring Works

High-level score families:

- Profile Strength Score
- Admission Readiness Score
- College Match Score
- ROI Score
- Placement Strength Score
- Career Alignment Score
- Risk Compatibility Score
- Final Recommendation Score

The engine uses weighted rules based on academics, exam performance, work experience, achievements, specialization fit, location fit, budget fit, risk fit, salary outcomes, and payback period.

See `docs/scoring-engine.md`.

## 20. How To Tune ROI Weights

- Open `Admin > Scoring`.
- Adjust keys under the `roi` and `final` groups.
- Save changes.
- Refresh recommendations in the student portal.

## 21. How To Integrate Email

- Enable `ENABLE_EMAIL_NOTIFICATIONS=true`
- Set `EMAIL_PROVIDER`
- Add SMTP or provider credentials
- Replace the console delivery branch in `src/lib/integrations/email.ts` with your provider SDK

## 22. How To Integrate Storage

- Enable `ENABLE_FILE_STORAGE=true`
- Set `STORAGE_PROVIDER`
- Add provider credentials and bucket/container config
- Extend `src/lib/integrations/storage.ts`
- Add file fields to application notes if you want true attachment support

## 23. How To Integrate Analytics

- Enable `ENABLE_ANALYTICS=true`
- Set `ANALYTICS_PROVIDER`
- Add provider keys
- Extend `src/lib/integrations/analytics.ts`

## 24. How To Replace Mock Data With Real Data

1. Replace seeded colleges with validated institutional records.
2. Extend CSV import or build upstream ETL scripts.
3. Update salary, placement, sector, and recruiter data regularly.
4. Replace mock testimonials and pricing with real content.
5. Calibrate scoring weights against actual outcomes.
6. Add historical admissions data if you want more grounded probability modeling.

## 25. Troubleshooting Guide

- `node` not found: install Node.js 22+ and restart your terminal.
- `npm install` fails: confirm Node/npm versions and registry/network access.
- Auth redirects loop: verify `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.
- Prisma connection errors: verify `DATABASE_URL` and PostgreSQL availability.
- Empty app after startup: run `npm run db:seed`.
- CSV import errors: use the template in `docs/college-import-template.csv`.
- `P1001: Can't reach database server at localhost:5432`: PostgreSQL is not running yet. Start your local PostgreSQL service or run `docker compose up -d postgres` first.
- `docker compose` fails with `dockerDesktopLinuxEngine`: Docker Desktop is installed but its service/engine is stopped. Start Docker Desktop, wait until it says it is running, then retry.

## 26. FAQ

### Does the platform require paid APIs?

No. Core features work locally without paid services.

### Is the recommendation engine AI?

It is AI-like in experience, but intentionally uses transparent weighted rules rather than black-box inference.

### Can I deploy this without Docker?

Yes. Use local PostgreSQL and the standard npm scripts.

### Can I plug in a real email or analytics provider later?

Yes. The code is already organized around feature-flagged integration modules.

## 27. Integration And Usage Guides

- Step-by-step integration guide: [docs/integration-guide.md](./docs/integration-guide.md)
- Step-by-step user guide: [docs/user-guide.md](./docs/user-guide.md)
- Architecture summary: [docs/architecture.md](./docs/architecture.md)
- Scoring details: [docs/scoring-engine.md](./docs/scoring-engine.md)

## 28. Key Files To Review First

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/scoring/engine.ts`
- `src/lib/data.ts`
- `src/lib/admin.ts`
- `src/app/portal/page.tsx`
- `src/app/portal/recommendations/page.tsx`
- `src/app/admin/colleges/page.tsx`
- `src/app/api/profile/route.ts`
- `src/app/api/admin/colleges/import/route.ts`


