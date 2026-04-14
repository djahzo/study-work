# Day2 Full-Stack Monorepo

A modern full-stack monorepo built with pnpm workspaces, Turborepo, Next.js, Vite, React, shadcn/ui, Tailwind CSS, and Supabase.

## Project Structure

```
day2/
├── apps/
│   ├── web/          # Next.js 15 app (SSR + Server Actions)
│   └── client/       # Vite + React app (SPA)
├── packages/
│   ├── ui/           # Shared shadcn/ui components
│   ├── types/        # Shared TypeScript types + Zod schemas
│   ├── utils/        # Shared utility functions
│   ├── eslint-config/
│   └── typescript-config/
├── supabase/
│   └── schema.sql    # Database schema + RLS policies
├── .github/
│   └── workflows/
│       ├── ci.yml    # Lint, type-check, build on every push/PR
│       └── deploy.yml # Deploy to Vercel on merge to main
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: Next.js 15 (App Router), Vite + React 19
- **UI**: shadcn/ui + Tailwind CSS
- **Backend/DB**: Supabase (Auth, Postgres, Storage, RLS)
- **State**: Zustand (Vite), Server Actions (Next.js)
- **Data fetching**: TanStack Query v5
- **Forms**: react-hook-form + Zod
- **CI/CD**: GitHub Actions + Vercel

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9.15.0

### Installation

```bash
pnpm install
```

### Setup Supabase

1. Create a project at https://supabase.com
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Copy and fill in env files:

```bash
cp apps/web/.env.local.example apps/web/.env.local
cp apps/client/.env.example apps/client/.env.local
```

### Development

```bash
pnpm dev
# Next.js → http://localhost:3000
# Vite    → http://localhost:5173
```

### Build

```bash
pnpm build
```

### Other Commands

```bash
pnpm type-check
pnpm lint
pnpm clean
```

## GitHub Setup

### 1. Initialize and push

```bash
cd C:\Users\jzdai2\Desktop\homework\day2
git init
git add .
git commit -m "feat: initial monorepo setup"
git remote add origin https://github.com/<your-username>/day2.git
git push -u origin main
```

### 2. Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel org/team ID |
| `VERCEL_PROJECT_ID_WEB` | Vercel project ID for `apps/web` |
| `VERCEL_PROJECT_ID_CLIENT` | Vercel project ID for `apps/client` |
| `TURBO_TOKEN` | (Optional) Turborepo remote cache token |
| `TURBO_TEAM` | (Optional) Turborepo team slug |

### 3. CI/CD Workflows

- **`ci.yml`** — runs on every push/PR to `main` or `develop`: type-check → lint → build
- **`deploy.yml`** — runs on merge to `main`: deploys both apps to Vercel

### 4. Vercel Setup (per app)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Link apps/web
cd apps/web && vercel link

# Link apps/client
cd apps/client && vercel link
```

Copy the `orgId` and `projectId` from `.vercel/project.json` into GitHub Secrets.

## Turborepo Remote Cache (Optional)

Speed up CI by caching build outputs across runs:

```bash
npx turbo login
npx turbo link
```

Then add `TURBO_TOKEN` and `TURBO_TEAM` to GitHub Secrets.

## Shared Packages

| Package | Description |
|---------|-------------|
| `@repo/ui` | shadcn/ui components (Button, Card, Dialog, Avatar, …) |
| `@repo/types` | TypeScript interfaces + Zod schemas |
| `@repo/utils` | formatDate, truncate, debounce, … |
| `@repo/typescript-config` | Shared tsconfig presets |
| `@repo/eslint-config` | Shared ESLint config |

## Turborepo Pipeline

See `turbo.json` — parallel execution, smart caching, dependency-aware scheduling.
