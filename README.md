# 🚀 90-Days Computer Science Challenges Platform

An ultra-modern, full-stack learning platform and curriculum tracking system for mastering 90 days of Computer Science algorithms, data structures, and system concepts. Built with a **Domain-Driven Design (DDD) Clean Architecture** in NestJS and a responsive glassmorphic frontend in Next.js 14.

---

## ✨ Key Features

- **🗺️ 90-Day Progressive Curriculum**: Structured 3-phase roadmap with Big-O analysis, algorithmic theory, prerequisites, constraints, and reference solutions in both **Java** and **TypeScript**.
- **🎮 Guest Trial Mode**: New visitors can immediately solve **Days 1, 2, and 3** for free in `localStorage` without creating an account. Completing Day 3 prompts a seamless sign-up barrier with automatic cloud synchronization.
- **✉️ 6-Digit Email OTP Verification**: Secure password authentication paired with 6-digit one-time passcodes (with automatic dev console ASCII fallback if SMTP is unconfigured).
- **⭐ Community Bonus Challenges Hub**: Registered developers can author, solve, and publish custom coding challenges with Java/TypeScript test cases.
- **🛡️ Role-Protected Admin Dashboard (`/admin`)**:
  - Real-time platform analytics (users, completions, pending submissions).
  - Curriculum editor & MySQL CRUD studio.
  - 1-click submission review, approval, and global publishing workflow with rejection feedback notes.
- **🎉 Gamification & Interactive Aesthetics**: Confetti celebration animations on completion, streak counters, code copy-to-clipboard, solution reveal locks, and multi-language support (English, Persian, Pashto).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Monorepo** | npm / npx workspaces |
| **Backend** | NestJS, TypeScript, Passport JWT, MySQL2 pool driver, Nodemailer |
| **Architecture** | Domain-Driven Design (DDD) & Clean Layered Architecture (Controllers -> DTOs -> Services -> Entities -> Repositories) |
| **Database** | MySQL (Docker) with auto-table initialization and migrations |
| **Frontend** | Next.js 14 (App Router), React, Vanilla CSS with Glassmorphism, Canvas Confetti |
| **Package Management** | `npx` / `npm` |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure MySQL is running (e.g. via Docker on port 3306):
```bash
docker run --name mysql-90days -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### 2. Configure Environment Variables
Copy the example environment files:
```bash
# Backend (.env)
cp apps/backend/.env.example apps/backend/.env

# Frontend (.env.local)
cp apps/frontend/.env.example apps/frontend/.env.local
```

### 3. Seed Database (Admin + 90 Challenges)
Seed the Admin user and all 90 Computer Science challenges into MySQL:
```bash
npx ts-node apps/backend/src/seed.ts
```

### 4. Run Development Servers
Run both Backend and Frontend concurrently:
```bash
npm run dev
```

* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)

> **Alternative (Separate Terminals):**
> - **Backend**: `npm run dev:backend` (or `npx nest start --path apps/backend/tsconfig.json --watch`)
> - **Frontend**: `npm run dev:frontend` (or `npx next dev apps/frontend -p 3000`)

---

## 🔑 Default Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin` | Full platform admin, `/admin` portal, moderation & challenge publishing |
| **Guest** | *No account required* | *None* | Days 1–3 free trial access |

---

## 📦 Production Build

```bash
# Build Backend & Frontend
npm run build
```

---

## 📄 License
MIT License
