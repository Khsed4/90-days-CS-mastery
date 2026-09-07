# 🚀 90-Days Computer Science Challenges Platform

A full-stack learning platform for mastering 90 days of Computer Science algorithms, data structures, and system design concepts. Built with **NestJS**, **Next.js 14 (App Router)**, **Prisma (MySQL)**, and an **Nx Monorepo**.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: `v18.18+` or `v20+`
- **npm**: `v9+` or `v10+`
- **MySQL Server**: Running locally on `127.0.0.1:3306`

---

### 2. Nx CLI Setup

You can run `nx` commands using any of these three approaches:

- **Option A: Global Install (Recommended)**
  ```bash
  npm install -g nx
  ```
- **Option B: Run via `npx` (No installation needed)**
  ```bash
  npx nx <command>
  ```
- **Option C: Add a shell alias (zsh / bash)**
  ```bash
  echo 'alias nx="npx nx"' >> ~/.zshrc && source ~/.zshrc
  ```

---

### 3. Install Project Dependencies
```bash
npm install
```

---

### 4. Configure Environment
```bash
cp .env.example .env
```
Verify your MySQL database credentials in `.env`:
```env
DATABASE_URL="mysql://root:root@127.0.0.1:3306/challenges_90days"
PORT=4000
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

---

### 5. Initialize & Seed Database
```bash
# Generate Prisma Client
nx run api:db-generate

# Apply database migrations
nx run api:db-deploy

# Seed 90-day challenge curriculum & default admin account
nx run api:db-seed
```

---

### 6. Start Development Servers
```bash
# Start both Backend API and Frontend Web in parallel
nx run-many -t serve --parallel
```
*(Or start services individually: `nx serve api` and `nx serve web`)*

---

## 🌐 Application URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| 🖥️ **Frontend Web App** | **[http://localhost:3000](http://localhost:3000)** | Next.js Web Portal (Learners, Organizations, Admins) |
| ⚡ **Backend REST API** | **[http://localhost:4000/api](http://localhost:4000/api)** | NestJS API Root Endpoint |
| 📚 **Swagger Docs** | **[http://localhost:4000/api/docs](http://localhost:4000/api/docs)** | Interactive OpenAPI test console |
| 🗄️ **Prisma Studio** | **[http://localhost:5555](http://localhost:5555)** | Database GUI browser (`nx run api:db-studio`) |

---

## 👥 User Roles & Default Accounts

| Role | Access Route | Permissions & Focus | Default / Sign-up |
| :--- | :--- | :--- | :--- |
| **🛡️ Admin** | `/admin` | Curriculum studio, user/org directory, platform moderation | Email: `admin@example.com`<br>Password: `admin` |
| **🏢 Organization** | `/organization` | Manage cohorts, generate member invite links, view team stats | Register at `/register` ➔ **Organization** tab |
| **👤 Personal Learner** | `/` | Solve 90-day challenges, track streaks, submit bonus problems | Register at `/register` or join via invite link |

> ℹ️ **Note**: Only **Personal Learners (`USER`)** can mark challenges as complete and track streaks. Admins and Organizations explore challenges in observer/preview mode.

---

## 🛠️ Common Commands

| Task | Command |
| :--- | :--- |
| **Start Dev Servers** | `nx run-many -t serve --parallel` |
| **Build for Production** | `nx run-many -t build` |
| **Open Database Studio** | `nx run api:db-studio` |
| **Reset / Re-seed Database** | `nx run api:db-deploy && nx run api:db-seed` |
| **View Project Graph** | `nx graph` |
| **Clear Nx Cache** | `nx reset` |

---

## 📄 License
MIT
