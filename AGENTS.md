# Agent Guidelines & Repository Architecture

Welcome to the **Modern Full-Stack Web App Stack 2026** monorepo (formerly `MERN-Learning-Examples`).

This repository migrates and modernizes legacy 2021 MERN applications (Exercise Tracker, Tinder Live, and TikTok Clone) into high-performance TypeScript web applications utilizing **Next.js 16 + Hono + PostgreSQL + Drizzle ORM + Better Auth + Tailwind CSS v4**.

---

## 1. Monorepo Structure (`pnpm`)

```text
.
├── apps/
│   └── web/                   # Next.js 16 + Hono + Drizzle Web Application
│       ├── src/
│       │   ├── app/           # App Router pages and API handlers
│       │   │   ├── (auth)/    # Login and register pages
│       │   │   ├── (dashboard)/ # System diagnostics dashboard
│       │   │   ├── api/
│       │   │   │   ├── [[...route]]/route.ts  # Hono REST API engine
│       │   │   │   └── auth/[...all]/route.ts # Better Auth handler
│       │   │   ├── tinder/    # Modern Tinder clone page
│       │   │   ├── tiktok/    # Modern TikTok clone page
│       │   │   └── tracker/   # Modern Exercise Tracker page
│       │   ├── components/    # Reusable UI (shadcn style) & shared components
│       │   ├── db/            # Drizzle ORM schema & connection pool
│       │   ├── features/      # Feature modules (tinder, tiktok, tracker)
│       │   ├── lib/           # Auth, storage, redis, api-client, utils
│       │   ├── server/        # Hono routes, repositories, services
│       │   ├── stores/        # Zustand client state stores
│       │   └── types/         # Strongly-typed domain interfaces
│       └── tests/unit/        # Vitest test suites
├── docs/
│   └── LEGACY_APPS_LOGIC.md   # Complete archive of 2021 MERN specifications
├── package.json               # Root scripts
└── pnpm-workspace.yaml        # Workspace configuration
```

---

## 2. Core Tech Stack & Guidelines

| Layer | Technology | Usage & Conventions |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Client and Server Components with React 19. |
| **Backend API** | Hono | Mounted at `/api/[[...route]]` with `@hono/zod-validator`. |
| **Database & ORM** | PostgreSQL + Drizzle ORM | Schema defined in `src/db/schema/index.ts`. Fallbacks provided for local dev. |
| **Auth** | Better Auth | Session and credential authentication in `src/lib/auth.ts`. |
| **Styling** | Tailwind CSS v4 | Class-variance-authority design tokens. |
| **State** | TanStack Query + Zustand | Server cache + client store in `src/stores/`. |
| **Validation** | Zod | Strictly validate all REST API payloads and forms. |
| **Testing** | Vitest | Fast unit/integration tests running under ESM/jsdom. |
| **Package Manager** | `pnpm` | Workspaces enabled (`apps/*`, `packages/*`). |

---

## 3. Development Workflow & Verification

Always run these four commands before opening a pull request or pushing changes:

```bash
# 1. Run unit & integration test suites (Vitest)
pnpm test

# 2. Strict TypeScript type check
pnpm run type-check

# 3. Code quality & linting (ESLint)
pnpm run lint

# 4. Production Next.js build
pnpm run build
```

---

## 4. Coding Standards for AI & Human Contributors

1. **Type Safety**: Maintain strict TypeScript with no `any`. Export all interfaces from `src/types/`.
2. **API Routes**: Implement REST endpoints in `src/server/api/` using Hono routers and attach them to `app` in `src/server/api/index.ts`.
3. **Client Prerender**: Do not call non-deterministic functions (e.g. `new Date()`) directly at top-level render in Client Components; defer them into effects or event handlers to guarantee clean static optimization.
4. **Modularity**: Place application logic in `src/features/<app-name>/` and keep reusable UI tokens in `src/components/ui/`.
