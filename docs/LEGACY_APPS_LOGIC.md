# Legacy MERN Stack Applications - Architecture & Logic Specification

> **Archive Notice**: This document captures the complete specifications, data models, API contracts, UI components, and business logic of the original 2021 MERN stack projects prior to modernization into the 2026 Next.js + Hono + Drizzle + TypeScript stack.

---

## 1. Project Overview (Original 2021 State)

The original repository was created as a learning collection for traditional MERN (MongoDB, Express, React, Node.js) web applications:
1. **mern-exercise-tracker**: Complete CRUD app with React Class components, Bootstrap 4, Mongoose, and Express routes.
2. **tinder-live**: Profile swipe card interface using Material-UI, `react-tinder-card`, Mongoose, and Express.
3. **tiktok-clone**: An empty placeholder started in April 2021 without implementation.

---

## 2. Legacy App 1: Exercise Tracker (`mern-exercise-tracker`)

### 2.1 Tech Stack (2021)
- **Frontend**: React 17.0.1, `react-router-dom` 5.2.0, React Class components, Bootstrap 4.6.0, `react-datepicker`, Axios 0.21.1.
- **Backend**: Node.js, Express 4.17.1, Mongoose 5.12.0, CORS 2.8.5, dotenv 8.2.0.
- **Database**: MongoDB Atlas via Mongoose schemas.

### 2.2 Data Models & Schema
#### User Schema (`backend/models/user.model.js`)
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  timestamps: true // createdAt, updatedAt
}
```

#### Exercise Schema (`backend/models/exercise.model.js`)
```javascript
{
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  date: { type: Date, required: true },
  timestamps: true // createdAt, updatedAt
}
```

### 2.3 REST API Endpoints
#### User Endpoints (`/users`)
- `GET /users/` - Retrieve all users. Returns `User[]`.
- `POST /users/add` - Body: `{ username: string }`. Creates user. Returns `'User added!'`.
- `GET /users/:id` - Retrieve user by MongoDB `_id`.
- `DELETE /users/:id` - Delete user by `_id`. Returns `'User deleted.'`.
- `POST /users/update/:id` - Body: `{ username: string }`. Updates username. Returns `'User updated!'`.

#### Exercise Endpoints (`/exercises`)
- `GET /exercises/` - Retrieve all exercises. Returns `Exercise[]`.
- `POST /exercises/add` - Body: `{ username: string, description: string, duration: number, date: string | Date }`. Returns `'Exercise added!'`.
- `GET /exercises/:id` - Retrieve exercise by MongoDB `_id`.
- `DELETE /exercises/:id` - Delete exercise by `_id`. Returns `'Exercise deleted.'`.
- `POST /exercises/update/:id` - Body: `{ username, description, duration, date }`. Updates exercise. Returns `'Exercise updated!'`.

### 2.4 Frontend Views & Component Hierarchy
- `Navbar`: Links to `/` (Exercises list), `/create` (Create Exercise), and `/user` (Create User).
- `ExercisesList`: Table listing `username`, `description`, `duration`, `date`, and action column with `Edit` link and `Delete` trigger.
- `CreateExercise`: Form with user `<select>` populated from `/users`, description input, duration number input, DatePicker, and submit button.
- `EditExercise`: Loads exercise by `:id` parameter, populates form, and submits `POST /exercises/update/:id`.
- `CreateUser`: Simple form with username input and submit button to `/users/add`.

---

## 3. Legacy App 2: Tinder Live (`tinder-live`)

### 3.1 Tech Stack (2021)
- **Frontend**: React 17.0.1, Material-UI Icons & Core 4.11.3, `react-tinder-card` 1.3.1, Axios 0.21.1.
- **Backend**: Express 4.17.1, Mongoose 5.12.2, CORS, dotenv.
- **Database**: MongoDB Atlas (`cards` collection).

### 3.2 Data Models & Schema
#### Card Schema (`tinder-backend/dbCards.js`)
```javascript
{
  name: String,
  imgUrl: String
}
```

### 3.3 REST API Endpoints
- `GET /tinder/cards` - Returns all profile cards `Card[]`.
- `POST /tinder/cards` - Body: `{ name: string, imgUrl: string }`. Returns created card (HTTP 201).

### 3.4 Frontend Components & User Interaction
- `Header`: Person profile icon (left), Tinder flame logo (center), Chat/Forum icon (right).
- `TinderCards`: Stack container rendering `react-tinder-card` instances with full-bleed background image and overlaid name headline.
  - Event triggers: `onSwipe(direction, name)` and `onCardLeftScreen(name)`.
- `SwipeButtons`: Floating bottom action bar with 5 buttons:
  - Replay (Amber/Yellow)
  - Left / Dislike (Red cross)
  - Star / Superlike (Blue star)
  - Right / Like (Green heart)
  - Lightning / Boost (Purple lightning)

---

## 4. Legacy App 3: TikTok Clone (`tiktok-clone`)

### 4.1 Original State
- The directory only contained a basic placeholder `README.md` stating `WELCOME TO MY TIKTOK CLONE :)` with no code implemented.

### 4.2 Modern 2026 Requirements for Replacement
- Vertical video feed with full-height swipeable/scrollable cards (snap scroll).
- HTML5 responsive video player with auto-loop, play/pause on tap, and volume mute/unmute control.
- Floating right sidebar:
  - Creator profile avatar with follow button
  - Like button with dynamic counter and heart animation
  - Comment trigger opening slide-over drawer with comment thread and comment input
  - Bookmark / Favorite counter
  - Share modal / native share API
- Bottom caption overlay: Creator handle `@username`, video caption, hashtags, and scrolling song ticker with rotating vinyl disc animation.
- Video upload / creation modal to add new videos to the feed.

---

## 5. Migration Strategy to 2026 Architecture

All 3 apps are unified into a modern pnpm monorepo using the stack:
- **Language**: TypeScript 5+ (Strict mode)
- **Framework**: Next.js 15+ (App Router)
- **API Engine**: Hono mounted within Next.js API route (`/api/[[...route]]`) with full type-safe RPC client
- **Database**: PostgreSQL with Drizzle ORM (with in-memory/embedded fallbacks for zero-setup demo environments)
- **Auth**: Better Auth integration
- **Styling & UI**: Tailwind CSS + shadcn/ui design tokens
- **State**: TanStack Query (server state cache) & Zustand (client state)
- **Validation**: Zod v3 schemas shared between backend and frontend
- **Testing**: Vitest unit/integration test suite
- **Linter/Formatter**: Biome / ESLint
