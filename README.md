# 🚀 90-Days Computer Science Mastery Platform

A full-stack learning platform for mastering 90 days of Computer Science algorithms, data structures, and system design concepts. Built with **NestJS**, **Next.js 14 (App Router)**, **Prisma (MySQL)**, and an **Nx Monorepo**.

> 📖 **Full System Documentation**: For a deep dive into all platform features, multi-tiered approval workflows, organization curriculum settings, and the REST API reference, see [DOCUMENTATION.md](DOCUMENTATION.md).

---

## ⚡ Quick Start (For New Users After Cloning)

### 1. Prerequisites
- **Node.js**: `v18.18+` or `v20+`
- **npm**: `v9+` or `v10+`
- **MySQL Server**: Running on `127.0.0.1:3306`

---

### 2. Nx CLI Setup
You can run `nx` commands using any of these options:
- **Global Install (Recommended)**:
  ```bash
  npm install -g nx
  ```
- **Or run via `npx` (No global install needed)**:
  ```bash
  npx nx <command>
  ```

---

### 3. Install Dependencies
```bash
npm install
```

---

### 4. Configure Environment
```bash
cp .env.example .env
```
Ensure your MySQL database credentials in `.env` are correct:
```env
DATABASE_URL="mysql://root:password@127.0.0.1:3306/cs_mastery?schema=public"
PORT=4000
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

---

### 5. Initialize & Seed Database
```bash
# Generate Prisma Client types
npx prisma generate

# Apply database migrations
npx prisma migrate deploy

# Seed 90 core challenges and default admin account
npx nx run api:db-seed
```

---

### 6. Start Development Servers
```bash
# Start both Backend API and Frontend Web in parallel
npx nx run-many -t serve --parallel
```
*(Or start individually: `npx nx serve api` and `npx nx serve web`)*

---

## 🌐 Application URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| 🖥️ **Frontend Web App** | **[http://localhost:3000](http://localhost:3000)** | Next.js Web Portal (Learners, Organizations, Admins) |
| ⚡ **Backend REST API** | **[http://localhost:4000/api](http://localhost:4000/api)** | NestJS API Root Endpoint |
| 📚 **Swagger Docs** | **[http://localhost:4000/api/docs](http://localhost:4000/api/docs)** | Interactive OpenAPI test console |
| 🗄️ **Prisma Studio** | **[http://localhost:5555](http://localhost:5555)** | Database GUI browser (`npx nx run api:db-studio`) |

---

## 👥 Default Accounts & Roles

| Role | Access Route | Default Credentials / Signup |
| :--- | :--- | :--- |
| **🛡️ Platform Admin** | `/admin` | Email: `admin@example.com` <br> Password: `admin` |
| **🏢 Organization Manager** | `/organization` | Register at `/register` ➔ **Organization / Team** tab |
| **👤 Personal Learner** | `/` | Register at `/register` or join via Org invite link |
| **⚡ Guest (No Login)** | `/` | Days 1–3 free trial access with automatic cloud sync upon signup |

---

## 🛠️ Common Commands

| Task | Command |
| :--- | :--- |
| **Start Dev Servers** | `npx nx run-many -t serve --parallel` |
| **Build for Production** | `npx nx run-many -t build` |
| **Run Database Migrations** | `npx prisma migrate deploy` |
| **Generate Prisma Types** | `npx prisma generate` |
| **Run Database Seeder** | `npx nx run api:db-seed` |
| **Open Database Studio** | `npx nx run api:db-studio` |
| **Clear Monorepo Cache** | `npx nx reset` |

---

## 📄 Documentation
See [DOCUMENTATION.md](DOCUMENTATION.md) for full architectural details and guides.
