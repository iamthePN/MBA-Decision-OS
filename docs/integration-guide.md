# Integration Guide

This guide is the operational checklist for getting MBA Decision OS running and optionally connecting external services.

## 1. Prerequisites

Install:

- Node.js 22+
- npm 10+
- Docker Desktop
- Git

Optional:

- Local PostgreSQL 16+ if not using Docker

## 2. Clone / Open The Project

```bash
git clone <your-repo-url>
cd mba-decision-os
```

## 3. Create Environment File

```bash
cp .env.example .env
```

Important variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: app base URL
- `NEXTAUTH_SECRET`: long random secret
- `APP_NAME`: display name
- `APP_URL`: public URL

## 4. Database Integration

### Local PostgreSQL

Set:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mba_decision_os?schema=public"
```

### Docker PostgreSQL

Use the provided `docker-compose.yml`.

## 5. Install Dependencies

```bash
npm install
npm run prisma:generate
```

## 6. Apply The Database Schema

Quick local setup:

```bash
npm run db:push
```

Tracked migration workflow:

```bash
npm run db:migrate -- --name init
```

## 7. Seed Demo Data

```bash
npm run db:seed
```

## 8. Start The App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 9. Docker-First Startup

```bash
docker compose up --build
```

This path is useful when you want PostgreSQL and the Next.js app to come up together.

### Recommended Windows Path

If Docker Desktop is installed but not always running, this is usually the smoothest setup:

```powershell
docker compose up -d postgres
npm run db:push
npm run db:seed
npm run dev
```

This uses Docker only for PostgreSQL while keeping the Next.js app local.

## 10. Admin Login

- Email: `admin@mbadecisionos.dev`
- Password: `Admin@12345`

## 11. Demo Student Login

- Email: `student@mbadecisionos.dev`
- Password: `Student@12345`

## 12. Optional Email Service Integration

Default behavior stores contact messages and logs outbound email actions to the console.

To wire a real provider:

1. Set `ENABLE_EMAIL_NOTIFICATIONS=true`
2. Set `EMAIL_PROVIDER`
3. Add provider credentials in `.env`
4. Replace the stub logic in `src/lib/integrations/email.ts`

## 13. Optional Storage Integration

Default behavior does not use external storage.

To integrate storage:

1. Set `ENABLE_FILE_STORAGE=true`
2. Set `STORAGE_PROVIDER`
3. Add provider credentials in `.env`
4. Extend `src/lib/integrations/storage.ts`
5. Add attachment UX to the application tracker if needed

## 14. Optional Analytics Integration

To integrate analytics:

1. Set `ENABLE_ANALYTICS=true`
2. Set `ANALYTICS_PROVIDER`
3. Add keys in `.env`
4. Extend `src/lib/integrations/analytics.ts`

## 15. Optional AI Summaries Integration

To replace mock summarization:

1. Set `ENABLE_AI_SUMMARIES=true`
2. Set `AI_PROVIDER`
3. Add credentials
4. Replace the fallback in `src/lib/integrations/ai.ts`

## 16. CSV Import Integration

Use `Admin > Colleges` and import a file that follows the example in `docs/college-import-template.csv`.

## 17. Deployment Notes

For production:

- Use a managed PostgreSQL instance
- Set strong auth secrets
- Build with `npm run build`
- Run with `npm run start`
- Prefer committed Prisma migrations once the schema stabilizes


## 18. Windows Docker Troubleshooting

If you see an error like:

- `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`

then Docker Desktop is not fully running yet.

Recovery steps:

1. Open Docker Desktop manually.
2. Wait until the UI shows Docker is running.
3. Verify with `docker info`.
4. Retry `docker compose up -d postgres` or `docker compose up --build`.

If Docker still does not start, check that:

- Docker Desktop Service is running
- WSL 2 / virtualization is enabled
- the current Docker context is healthy
