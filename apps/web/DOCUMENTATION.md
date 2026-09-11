# 📘 90-Days Computer Science Mastery Platform — Complete Documentation

Welcome to the comprehensive documentation for the **90-Days Computer Science Mastery Platform**. This document covers all platform capabilities, options, system architecture, role-based workflows, and a step-by-step onboarding guide for developers running the application after cloning the repository.

---

## 📑 Table of Contents

1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Step-by-Step Setup Guide (After Cloning)](#2-step-by-step-setup-guide-after-cloning)
3. [User Roles & Access Levels](#3-user-roles--access-levels)
4. [Supported Programming Languages & Categories](#4-supported-programming-languages--categories)
5. [Multi-Tiered Challenge Approval System](#5-multi-tiered-challenge-approval-system)
6. [Organization Curriculum & Restriction System](#6-organization-curriculum--restriction-system)
7. [Application Routes & UI Portals](#7-application-routes--ui-portals)
8. [Backend REST API Reference](#8-backend-rest-api-reference)
9. [Development & Maintenance Commands](#9-development--maintenance-commands)
10. [Troubleshooting & FAQs](#10-troubleshooting--faqs)

---

## 1. System Overview & Architecture

The application is structured as an **Nx Monorepo** providing clean modularity between frontend, backend, shared types, and database management:

```
90-days-CS-mastery/
├── apps/
│   ├── api/                     # NestJS Backend Application
│   │   └── src/
│   │       ├── modules/         # Auth, Admin, Challenges, Organizations, Users, Progress, Mail
│   │       ├── database/        # PrismaService & Database module
│   │       └── config/          # Environment validation & configuration
│   └── web/                     # Next.js 14 App Router Frontend Application
│       └── src/
│           ├── app/             # App Router pages (/ , /challenge/[id], /organization, /admin, etc.)
│           ├── components/      # Reusable layout & UI components
│           ├── features/        # Auth, Organization, Admin feature modules
│           ├── hooks/           # useGuestProgress & UI hooks
│           └── services/        # Axios API clients
├── libs/
│   └── shared/
│       ├── types/               # TypeScript interfaces & domain models
│       ├── constants/           # Languages, categories, status enums
│       ├── contracts/           # API request/response DTO contracts
│       └── utils/               # Solution boilerplate generators, streak calculators
├── prisma/
│   ├── schema.prisma            # Prisma MySQL schema
│   ├── migrations/              # Incremental SQL migration history
│   └── seed.ts                  # 90-day challenges & admin seeder
└── data.json                    # Challenge database dataset
```

### Core Technologies
- **Frontend**: Next.js 14, React 18, TailwindCSS, Monaco/Custom code editor styling, Canvas Confetti.
- **Backend**: NestJS 10, Passport.js (JWT), Class Validator, Swagger / OpenAPI.
- **Database**: MySQL 8.0 with Prisma ORM 5.
- **Monorepo Tooling**: Nx Monorepo workspace.

---

## 2. Step-by-Step Setup Guide (After Cloning)

Follow these exact steps when setting up the project on a new machine:

### Step 2.1: Prerequisites
Ensure your system has the following installed:
- **Node.js**: `v18.18.0` or `v20.x` (`node -v`)
- **npm**: `v9.x` or `v10.x` (`npm -v`)
- **MySQL**: MySQL Server 8.0 running locally on port `3306` (or Docker MySQL container)
- **Git**

### Step 2.2: Clone the Repository
```bash
git clone <repository-url>
cd 90-days-CS-mastery
```

### Step 2.3: Install Dependencies
```bash
npm install
```

### Step 2.4: Configure Environment Variables
Copy the `.env.example` file to create your `.env` in the root directory:
```bash
cp .env.example .env
```

Review and adjust the environment variables in `.env`:
```env
# Database connection string (adjust username, password, host, port, and DB name)
DATABASE_URL="mysql://root:password@127.0.0.1:3306/cs_mastery?schema=public"

# Backend API configuration
PORT=4000
JWT_SECRET="super-secret-jwt-key-change-in-production"

# Frontend configuration
NEXT_PUBLIC_API_URL="http://localhost:4000/api"

# Optional Email / SMTP configuration (for OTP codes; logged to console if unset)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="no-reply@cs-mastery.dev"
```

### Step 2.5: Initialize Database & Run Migrations
Run the migrations to create all database tables:
```bash
# Option A: Apply all pre-built migrations (Recommended)
npx prisma migrate deploy

# Option B: Or use Nx shortcut
npx nx run api:db-deploy
```

### Step 2.6: Generate Prisma Client Types
Regenerate the Prisma client types:
```bash
npx prisma generate
```

### Step 2.7: Seed the Curriculum & Default Accounts
Seed the 90 core algorithmic challenges, standard categories, and initial admin account:
```bash
# Using Nx
npx nx run api:db-seed

# Or directly with ts-node
npx ts-node prisma/seed.ts
```

### Step 2.8: Start the Development Servers
Start both the backend API and frontend web application simultaneously:
```bash
npx nx run-many -t serve --parallel
```

Once running:
- 🖥️ **Web Application**: [http://localhost:3000](http://localhost:3000)
- ⚡ **Backend REST API**: [http://localhost:4000/api](http://localhost:4000/api)
- 📚 **Swagger Interactive Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 3. User Roles & Access Levels

The platform features four distinct user roles, each with designated capabilities:

| Role | Default Credentials / Signup | Access Route | Core Capabilities |
| :--- | :--- | :--- | :--- |
| **GUEST (Unauthenticated)** | No credentials needed | `/` (Days 1–3) | Solves first 3 trial challenges. Day 4+ triggers registration modal. Local guest progress is automatically synced upon registration. |
| **USER (Personal Learner)** | Register at `/register` or join via Org invite | `/` and `/challenge/[id]` | Solves all 90 days, marks challenges complete, maintains streak counters, selects active programming language, submits community bonus challenges. |
| **ORGANIZATION (Team Manager)** | Register at `/register` (Organization tab) | `/organization` | Creates and configures team portals, configures allowed programming languages and CS categories, generates invite links, tracks team member progress, moderates member bonus challenges. |
| **ADMIN (Platform Moderator)** | `admin@example.com` / `admin` | `/admin` | Curates core challenges, inspects user/organization directories, reviews team-approved & independent challenges, publishes challenges globally. |

> 🔒 **Observer Mode**: Organization managers and Admins explore challenges in observer mode to inspect curriculum problem statements and reference solutions without corrupting learner streaks or database completion records.

---

## 4. Supported Programming Languages & Categories

### 10 Core Programming Languages
The platform features first-class support for 10 major programming languages:
1. **TypeScript** (`.ts`)
2. **JavaScript** (`.js`)
3. **Java** (`.java`)
4. **Python** (`.py`)
5. **C++** (`.cpp`)
6. **C** (`.c`)
7. **C#** (`.cs`)
8. **PHP** (`.php`)
9. **Go** (`.go`)
10. **Rust** (`.rs`)

### Dynamic Code Generation
- The challenge editor generates idiomatic boilerplate code, class structures, and function signatures tailored to the selected language using the [`solutions.ts`](libs/shared/utils/src/solutions.ts) utility.
- When an author supplies custom multi-language solutions, they are saved in the `solutions` JSON dictionary on the challenge record.

### 18 Standard Computer Science Categories
The 90-day roadmap is structured across 18 core domains:
- Arrays & Hashing, Two Pointers, Sliding Window, Stack, Binary Search, Linked List, Trees, Tries, Heap / Priority Queue, Backtracking, Graphs, Advanced Graphs, 1-D Dynamic Programming, 2-D Dynamic Programming, Greedy, Intervals, Math & Geometry, Bit Manipulation.

---

## 5. Multi-Tiered Challenge Approval System

The platform implements a multi-stage approval workflow for community-contributed challenges:

```
                  ┌────────────────────────────────────────┐
                  │ Member Submits Bonus Challenge         │
                  └──────────────────┬─────────────────────┘
                                     │
                 Is member part of an organization?
                   /                           \
               YES                              NO
                 ▼                               ▼
       Status: PENDING_ORG              Status: PENDING
                 │                               │
       Organization Manager                      │
       Reviews in /organization                  │
       ┌─────────┴─────────┐                     │
    REJECT              APPROVE                  │
       │                   │                     │
       ▼                   ▼                     │
Status: REJECTED   Status: ORG_APPROVED          │
                   (Visible to all team members) │
                           │                     │
                           └──────────┬──────────┘
                                      ▼
                        Platform Admin Review in /admin
                               ┌──────┴──────┐
                            REJECT        APPROVE
                               │             │
                               ▼             ▼
                        Status: REJECTED  Status: APPROVED (Global)
                                          (Visible to all platform learners)
```

1. **Member Submission (`PENDING_ORG`)**: When a user registered under an organization creates a bonus challenge, it is tagged with their `organizationId` and set to `PENDING_ORG`.
2. **Team Approval (`ORG_APPROVED`)**: The organization manager reviews the submission in `/organization` ➔ **Team Challenges Moderation**.
   - Upon approval, status becomes `ORG_APPROVED`.
   - The challenge is immediately accessible to all learners within that organization on `/bonus-challenges` with a `🏢 Team Challenge` badge.
3. **Global Approval (`APPROVED`)**: All `ORG_APPROVED` challenges (and independent submissions) appear in the `/admin` moderation queue. The Admin can approve them for global publication, making them accessible to every learner on the platform with a `🌐 Global Community` badge.

---

## 6. Organization Curriculum & Restriction System

Organizations can enforce specific technology stacks for their members:

### Registration Configuration
When an organization registers on `/register` (under the **Organization / Team** tab), the manager selects which programming languages will be allowed for their cohort.

### Settings Management
At any time, the organization manager can visit `/organization` ➔ **Curriculum & Languages** tab to:
- Toggle individual programming languages on or off.
- Restrict or enable specific CS topics/categories.
- Save settings instantly to update all team member sessions.

### Member Enforcement
- **Main Roadmap Hub (`/`)**: A member under an organization will see allowed languages enabled in the Language Bar. Disallowed languages display a lock icon (`🔒 Locked by organization policy`) and cannot be selected.
- **Challenge Workspace (`/challenge/[id]`)**: The editor code switcher displays only the organization's approved languages.
- **API Guard**: The backend `PUT /users/preferences` endpoint validates incoming language and category selections against the user's organization policies and returns an HTTP 400 error if a user attempts to select a restricted language.
- **Independent Learners**: Users not associated with an organization have unrestricted access to all 10 languages and all 18 categories.

---

## 7. Application Routes & UI Portals

| Route | Name | Purpose |
| :--- | :--- | :--- |
| `/` | **Roadmap Hub** | The main 90-day curriculum roadmap divided into Phase 1 (1–30), Phase 2 (31–60), and Phase 3 (61–90). Features search, difficulty filters, category filters, and active language selector. |
| `/challenge/[id]` | **Challenge Workspace** | Split-screen interface with problem statement, prerequisites, constraints, and multi-language code editor with solution reveal and copy functionality. |
| `/bonus-challenges` | **Bonus Challenges** | Directory of community and team-approved algorithmic problems with filtering and "My Submissions" tracker. |
| `/challenges/create` | **Create Challenge** | Form for authoring new algorithmic challenges with descriptions, test cases, constraints, and starter solutions. |
| `/organization` | **Organization Portal** | Three dedicated tabs: (1) Team Members & Invites, (2) Team Challenges Moderation, and (3) Curriculum & Languages Settings. |
| `/admin` | **Admin Console** | System dashboard featuring curriculum inspection, challenge creation/editing, user/org directory, and review queue. |
| `/register` | **Registration** | Dual-mode signup supporting personal learners (with optional invite tokens) and organization account setup with curriculum language choices. |
| `/login` | **Authentication** | Email & password login with automated 6-digit OTP email verification modal. |

---

## 8. Backend REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a personal learner account (supports `inviteToken`).
- `POST /api/auth/register-organization` — Register an organization with `allowedLanguages` and `allowedCategories`.
- `POST /api/auth/login` — Sign in with email and password.
- `POST /api/auth/send-verification-code` — Request a 6-digit OTP code.
- `POST /api/auth/verify-code` — Verify email using OTP code.
- `GET /api/auth/profile` — Retrieve current authenticated user profile and organization details.

### Challenges (`/api/challenges`)
- `GET /api/challenges` — List all 90 core curriculum challenges.
- `GET /api/challenges/bonus` — List bonus challenges (global `APPROVED` + organization `ORG_APPROVED`).
- `GET /api/challenges/my-submissions` — List bonus challenges authored by the current user.
- `GET /api/challenges/:id` — Retrieve single challenge details (enforces organization visibility rules).
- `POST /api/challenges` — Submit a new bonus challenge (assigns `PENDING_ORG` or `PENDING`).

### Organizations (`/api/organizations`)
- `GET /api/organizations/overview` — Get organization statistics, member count, and settings.
- `GET /api/organizations/members` — List members in the organization.
- `GET /api/organizations/members/:id/progress` — View a specific member's 90-day progress.
- `DELETE /api/organizations/members/:id` — Remove a member from the organization.
- `GET /api/organizations/invites` — List active invitation tokens.
- `POST /api/organizations/invites` — Create a new invitation link.
- `DELETE /api/organizations/invites/:id` — Revoke an invitation link.
- `POST /api/organizations/join` — Join an organization using an invitation token.
- `GET /api/organizations/challenges` — List challenges submitted by organization members for moderation.
- `PATCH /api/organizations/challenges/:id/review` — Approve (`ORG_APPROVED`) or reject a member challenge.
- `PUT /api/organizations/curriculum` — Update allowed languages and categories for the organization.

### User Preferences (`/api/users`)
- `GET /api/users/preferences` — Get active language, categories, and organization restrictions.
- `PUT /api/users/preferences` — Update active programming language (validated against organization constraints).

### Progress (`/api/progress`)
- `GET /api/progress` — Get user's completed challenge days and streak count.
- `POST /api/progress/toggle/:dayId` — Mark a challenge day as completed or incomplete.
- `POST /api/progress/sync` — Synchronize guest progress into authenticated account.

### Admin (`/api/admin`)
- `GET /api/admin/stats` — Platform statistics (user count, org count, pending review count).
- `GET /api/admin/challenges` — View all challenges with status filters (`PENDING`, `ORG_APPROVED`, `APPROVED`).
- `PATCH /api/admin/challenges/:id/review` — Review and publish challenge globally (`APPROVED` or `REJECTED`).
- `POST /api/admin/challenges` — Create a core or bonus challenge directly.
- `PUT /api/admin/challenges/:id` — Edit an existing challenge.
- `DELETE /api/admin/challenges/:id` — Delete a challenge.
- `GET /api/admin/users` — List and manage users and organizations across the platform.

---

## 9. Development & Maintenance Commands

| Action | Command |
| :--- | :--- |
| **Start Backend & Frontend** | `npx nx run-many -t serve --parallel` |
| **Start Backend Only** | `npx nx serve api` |
| **Start Frontend Only** | `npx nx serve web` |
| **Run Full Production Build** | `npx nx run-many -t build` |
| **Apply Database Migrations** | `npx prisma migrate deploy` |
| **Generate Prisma Client** | `npx prisma generate` |
| **Run Database Seeder** | `npx nx run api:db-seed` |
| **Launch Database GUI Studio** | `npx nx run api:db-studio` |
| **Clear Monorepo Cache** | `npx nx reset` |

---

## 10. Troubleshooting & FAQs

### Q1: I see `Database connection error` when running migrations or starting the API.
- Ensure your MySQL service is running on `127.0.0.1:3306`.
- Verify the credentials in your `.env` file match your MySQL user and password.
- Test connection: `mysql -u root -p -h 127.0.0.1 -P 3306`.

### Q2: Why can't I select Python or C++ as an organization member?
- Your organization manager has configured specific programming languages for your cohort (e.g. only Java and JavaScript).
- Contact your organization manager to update permitted languages under `/organization` ➔ **Curriculum & Languages**.

### Q3: How do I test the full approval lifecycle locally?
1. Register an organization account (e.g., `lead@acme.com`).
2. Generate an invite link from `/organization`.
3. In an Incognito window, visit the invite link and register a learner account (e.g., `coder@acme.com`).
4. As the learner, submit a bonus challenge on `/challenges/create`. The status will show as `Pending Organization Approval`.
5. Switch to the organization window, go to `/organization` ➔ **Team Challenges Moderation**, and click **Approve for Team**. The challenge is now visible to all Acme learners.
6. Log in as `admin@example.com` / `admin`, go to `/admin`, find the challenge under **Pending Review**, and click **Review & Publish**. The challenge is now published globally.

### Q4: Why don't my completion checkboxes work when logged in as Admin or Organization?
- This is intentional: Admin and Organization accounts operate in **Observer Mode** to preview curriculum content and reference solutions without altering student metrics or skewing platform streak analytics. Use a Personal Learner (`USER`) account to track challenge completion.
