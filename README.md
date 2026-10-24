# Modern Full-Stack Web App Stack 2026

[![CI](https://github.com/nzmcno/MERN-Learning-Examples/actions/workflows/ci.yml/badge.svg)](https://github.com/nzmcno/MERN-Learning-Examples/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9%20(Strict)-3178c6?style=flat&logo=typescript)
![Hono](https://img.shields.io/badge/Hono-REST%20%26%20RPC-E36002?style=flat&logo=hono)
![Drizzle](https://img.shields.io/badge/Drizzle%20ORM-PostgreSQL-C5F74F?style=flat&logo=drizzle)
![Better Auth](https://img.shields.io/badge/Better%20Auth-Sessions-blue?style=flat)
![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tests-729B1B?style=flat&logo=vitest)
![pnpm](https://img.shields.io/badge/pnpm-Monorepo-F69220?style=flat&logo=pnpm)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> **MERN Evolution (2021 → 2026)**: This repository originally started as a 2021 collection of beginner MERN (MongoDB, Express, React 17 Class components, Node) apps. It has been **completely re-architected into a unified, high-performance TypeScript monorepo** implementing the modern web application stack of 2026.
>
> 📖 *Legacy app logic and schemas are permanently archived in [`docs/LEGACY_APPS_LOGIC.md`](docs/LEGACY_APPS_LOGIC.md).*

---

## 🚀 2026 Tech Stack Overview

| Layer | 2021 Legacy MERN | 2026 Modern Full-Stack Stack | Purpose |
| :--- | :--- | :--- | :--- |
| **Monorepo** | None (Loose directories) | **pnpm Workspaces** | Unified dependencies and scripts |
| **Framework** | React 17 (CRA, Webpack) | **Next.js 16 (App Router)** | SSR, streaming, Turbopack, route optimization |
| **Language** | JavaScript (ES6 / CommonJS) | **TypeScript 5.9 (Strict Mode)** | Full end-to-end compile-time type safety |
| **API Engine** | Express 4 (Untyped routes) | **Hono (Edge REST API)** | Sub-millisecond latency, route handlers, RPC types |
| **Database** | MongoDB Atlas (Mongoose) | **PostgreSQL** | Relational integrity, ACID compliance |
| **ORM** | Mongoose (Schema drift) | **Drizzle ORM** | Type-safe SQL queries, zero runtime overhead |
| **Auth** | Ad-hoc / Unauthenticated | **Better Auth** | Standard session management, credentials & OAuth |
| **Styling** | Bootstrap 4 & Vanilla CSS | **Tailwind CSS v4 + shadcn/ui** | Modern design system, accessible tokens |
| **State** | Class `this.setState` | **TanStack Query + Zustand** | Server cache + client store |
| **Validation** | Manual if-checks | **Zod** | Runtime schema validation across API and forms |
| **Testing** | None | **Vitest** | Fast ESM testing with jsdom |

---

## 📱 Applications Included

The monorepo contains modern, production-grade clones of 3 distinct applications, all sharing the same Hono REST API and Drizzle schema:

```
┌───────────────────────────────────────────────────────────┐
│                      ModernStack Web                      │
├─────────────────┬───────────────────┬─────────────────────┤
│ 🔥 Tinder Clone │ 🎬 TikTok Clone   │ 🏋️ Exercise Tracker │
│  - Swipe Cards  │  - Snap Feed      │  - KPI Dashboard    │
│  - Match Modal  │  - Looping Player │  - User Switcher    │
│  - Instant Chat │  - Heart Bursts   │  - Calorie Counter  │
│  - Card Creator │  - Comments Sheet │  - Category Filters │
│  - Rewind/Boost │  - Video Uploader │  - Activity History │
└─────────────────┴───────────────────┴─────────────────────┘
```

### 1. 🔥 Tinder Clone (`/tinder`)
- **Swipeable Profile Deck**: High-resolution profile cards with gradient overlays, age, verified badge, bio, and interest tags.
- **Swipe Actions**: Rewind (Undo), Dislike (Left), Superlike (Star), Like (Right), and Boost (Lightning).
- **Match Engine**: Immediate match celebration popup when mutual like occurs.
- **Live Chat Drawer**: Matches list with avatars and interactive real-time messaging interface.
- **Card Creator Modal**: Add custom profiles directly into the database.

### 2. 🎬 TikTok Clone (`/tiktok`)
- **Vertical Snap Feed**: Full-screen scrolling video feed with auto-looping HTML5 playback.
- **Interactive Action Bar**: Animated heart burst like counter, comments sheet trigger, bookmark counter, and share action.
- **Audio Vinyl**: Rotating sound vinyl animation with scrolling music marquee.
- **Slide-over Comments**: Real-time comment submission and discussion thread.
- **Video Uploader**: Publish new video clips to the feed with custom captions and hashtags.

### 3. 🏋️ Exercise Tracker 2026 (`/tracker`)
- **Legacy MERN Evolution**: The original `mern-exercise-tracker` rebuilt into a high-performance analytics portal.
- **KPI Metrics**: Active Minutes, Workouts Logged, Estimated Calories burned (~8.5 kcal/min), and Active Day Streaks.
- **Athlete Management**: Multi-user selector and athlete profile creator with daily target goals.
- **Filter & Search**: Instant filter by workout category (Running, Gym, Cycling, Swimming, Yoga, Other) and text search.
- **Full CRUD**: Create, edit, and delete workout logs backed by Hono REST endpoints.

---

## 📂 Repository Structure

```text
.
├── apps/
│   └── web/                   # Next.js 16 + Hono + Drizzle Application
│       ├── src/
│       │   ├── app/           # App Router pages and API routes
│       │   │   ├── (auth)/    # Login & Register (Better Auth)
│       │   │   ├── (dashboard)/ # System diagnostics & telemetry
│       │   │   ├── api/       # Hono REST & Better Auth route handlers
│       │   │   ├── tinder/    # Tinder Clone view
│       │   │   ├── tiktok/    # TikTok Clone view
│       │   │   └── tracker/   # Exercise Tracker view
│       │   ├── components/    # UI design system (Button, Card, Input, Modal, Badge)
│       │   ├── db/            # Drizzle PostgreSQL schema & connection pool
│       │   ├── features/      # Feature-specific components
│       │   ├── lib/           # Auth, storage, redis, api-client, utils
│       │   ├── server/        # Hono sub-routers & repository data access
│       │   ├── stores/        # Zustand client state
│       │   └── types/         # TypeScript interface definitions
│       └── tests/unit/        # Vitest test suites (14 tests)
├── docs/
│   ├── LEGACY_APPS_LOGIC.md   # Archived 2021 specifications
│   └── images/                # Historical screenshots
├── .github/
│   ├── workflows/ci.yml       # GitHub Actions CI pipeline
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── pull_request_template.md
├── package.json               # Root monorepo scripts
├── pnpm-workspace.yaml        # Workspace configuration
└── AGENTS.md                  # Autonomous agent and developer instructions
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v20+ (v22 LTS recommended)
- [pnpm](https://pnpm.io/) v10+ (`corepack enable pnpm` or `npm install -g pnpm`)

### Installation & Run

```bash
# 1. Clone the repository
git clone git@github.com-nzmcno:nzmcno/MERN-Learning-Examples.git
cd MERN-Learning-Examples

# 2. Install monorepo dependencies
pnpm install

# 3. Start local development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Hub Overview**: `http://localhost:3000`
- **Tinder Clone**: `http://localhost:3000/tinder`
- **TikTok Clone**: `http://localhost:3000/tiktok`
- **Exercise Tracker**: `http://localhost:3000/tracker`
- **Diagnostics Dashboard**: `http://localhost:3000/dashboard`
- **Hono Health API**: `http://localhost:3000/api/health`

---

## 🧪 Quality Assurance & Testing

```bash
# Run Vitest test suites (Unit & integration)
pnpm test

# Check TypeScript type safety (Zero errors)
pnpm run type-check

# Run ESLint linter
pnpm run lint

# Build production bundle with Next.js Turbopack
pnpm run build
```

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
