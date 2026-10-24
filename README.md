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
| **Testing** | None | **Vitest** | Fast ESM testing with jsdom (20 tests passing) |

---

## 📱 Famous Applications Included (6 Modern Web Apps)

All 6 modern web clones share the unified Hono REST API and Drizzle schema within the monorepo:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ModernStack Web Portal                        │
├─────────────────┬───────────────────┬──────────────────────────────────┤
│ 🔥 Tinder Clone │ 🎬 TikTok Clone   │ 🚗 Uber Ride Dispatch            │
│  - Swipe Cards  │  - Snap Feed      │  - Fare Matrix & Ride Tiers      │
│  - Match Modal  │  - Looping Player │  - Interactive Route Map         │
│  - Instant Chat │  - Heart Bursts   │  - Driver Telemetry & Status     │
├─────────────────┼───────────────────┼──────────────────────────────────┤
│ 🏡 Airbnb Stay  │ 𝕏 / Twitter Feed  │ 🏋️ Exercise Tracker 2026         │
│  - Category Bar │  - Timeline Feed  │  - KPI Streaks & Metrics         │
│  - Stay Booking │  - Tweet Composer │  - User Switcher & Goal Tracking │
│  - Host a Home  │  - Like & Retweet │  - Full CRUD Activity History    │
└─────────────────┴───────────────────┴──────────────────────────────────┘
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

### 3. 🚗 Uber Ride Dispatch (`/uber`)
- **Ride Booking**: Pickup & destination autocomplete with popular destination pills.
- **Dynamic Fare Matrix**: Real-time pricing across UberX, Comfort, Uber Black, and Uber Green with capacity & ETA.
- **Simulated Map Canvas**: Visual SVG road map with animated route path, pickup pin, destination pin, and moving driver vehicle.
- **Driver Dispatch & Telemetry**: Driver assignment (car model, license plate, 4.97 rating) with live tracking status.

### 4. 🏡 Airbnb Escapes (`/airbnb`)
- **Category Carousel**: Filter stays by Beachfront, Cabins, Iconic Cities, Amazing Pools, Countryside, and Lakefront.
- **Multi-Photo Listing Cards**: Star ratings, Superhost badges, location summaries, and favorite wishlist toggle.
- **Instant Booking Engine**: Check-in/checkout date range, guest selector, and transparent fee breakdown (nights + cleaning).
- **Host Home Portal**: Publish new architectural properties directly to the Hono API.

### 5. 𝕏 / Twitter Timeline (`/twitter`)
- **3-Column Feed**: Navigation column, live home timeline, and trending sidebar.
- **Tweet Composer**: Textarea with character counter, image attachment support, and instant post creation.
- **Social Interactivity**: Optimistic like/heart toggles, retweet toggles with live counters, reply modals, and share links.
- **Trending & Recommendations**: Realtime trending hashtags (`#NextJS16`, `#HonoEdge`, `#DrizzleORM`) and Who to Follow suggestions.

### 6. 🏋️ Exercise Tracker 2026 (`/tracker`)
- **Legacy MERN Evolution**: The original `mern-exercise-tracker` rebuilt into a high-performance analytics portal.
- **KPI Metrics**: Active Minutes, Workouts Logged, Estimated Calories burned (~8.5 kcal/min), and Active Day Streaks.
- **Athlete Management**: Multi-user selector and athlete profile creator with daily target goals.
- **Filter & Search**: Instant filter by workout category (Running, Gym, Cycling, Swimming, Yoga, Other) and text search.
- **Full CRUD**: Create, edit, and delete workout logs backed by Hono REST endpoints.

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
- **Uber Clone**: `http://localhost:3000/uber`
- **Airbnb Clone**: `http://localhost:3000/airbnb`
- **𝕏 / Twitter Clone**: `http://localhost:3000/twitter`
- **Exercise Tracker**: `http://localhost:3000/tracker`
- **Diagnostics Dashboard**: `http://localhost:3000/dashboard`
- **Hono Health API**: `http://localhost:3000/api/health`

---

## 🧪 Quality Assurance & Testing

```bash
# Run Vitest test suites (20 unit & integration tests)
pnpm test

# Check TypeScript type safety (Zero errors)
pnpm run type-check

# Run ESLint linter (Zero warnings, zero errors)
pnpm run lint

# Build production bundle with Next.js Turbopack (13 routes generated)
pnpm run build
```

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
