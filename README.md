# 🚀 90-Days Computer Science Challenges Platform

A scalable, production-ready full-stack learning platform for mastering 90 days of Computer Science algorithms, data structures, and system design concepts.

Built as an **Nx Monorepo** featuring a **NestJS REST API** backend, **Next.js 14 App Router** frontend, **Prisma ORM with MySQL**, and cleanly segregated shared libraries.

---

## 🏛️ Monorepo Architecture & Directory Structure

```text
.
├── apps/
│   ├── api/                              # NestJS REST API Backend
│   │   ├── project.json                  # Nx project config (tags: ["scope:api"])
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.ts                   # App entrypoint & Swagger setup (/api/docs)
│   │       ├── app/                      # Root application module
│   │       ├── database/                 # Prisma database access infrastructure
│   │       │   ├── prisma.module.ts
│   │       │   └── prisma.service.ts
│   │       ├── common/                   # Cross-cutting guards, decorators, filters
│   │       └── modules/                  # Flattened NestJS feature modules
│   │           ├── auth/                 # Authentication, JWT & guards
│   │           ├── challenges/           # 90-day challenge curriculum & moderation
│   │           ├── progress/             # User streak & daily completion tracking
│   │           ├── admin/                # Platform management & statistics
│   │           └── mail/                 # Email verification service
│   │
│   └── web/                              # Next.js 14 App Router Frontend
│       ├── project.json                  # Nx project config (tags: ["scope:web"])
│       ├── tsconfig.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── src/
│           ├── app/                      # App router pages & layouts
│           │   ├── (public)/             # Public authentication routes
│           │   ├── (dashboard)/          # Authenticated challenge roadmap hub
│           │   └── admin/                # Admin console & moderation
│           ├── features/                 # Modular feature slices (auth, admin)
│           ├── components/               # UI components & layouts
│           └── services/                 # API client services consuming shared contracts
│
├── libs/
│   └── shared/                           # Nx Shared Libraries (Pure TypeScript)
│       ├── contracts/                    # Request/Response API contracts (tags: ["scope:shared"])
│       ├── types/                        # Domain entities & models (tags: ["scope:shared"])
│       ├── constants/                    # Application constants & enums (tags: ["scope:shared"])
│       └── utils/                        # Shared utility helper functions (tags: ["scope:shared"])
│
├── prisma/
│   ├── schema.prisma                     # MySQL schema definition
│   ├── migrations/                       # Timestamped SQL migrations
│   └── seed.ts                           # Safe, idempotent database seeder
│
├── .env.example                          # Environment template
├── .eslintrc.json                        # Nx module boundary enforcement rules
├── nx.json                               # Nx workspace orchestration config
├── package.json                          # Centralized root dependencies & scripts
├── tsconfig.base.json                    # Monorepo path mapping aliases
└── tsconfig.json                         # Root TypeScript config
```

---

## 📐 Architectural Highlights

1. **Centralized Dependency Management**:
   - Single root `package.json` with `npm` as the package manager.
   - Applications and shared libraries do not maintain fragmented independent `package.json` files.

2. **Prisma Infrastructure Placement**:
   - Prisma client and service live in `apps/api/src/database/` as dedicated database infrastructure, keeping `common/` strictly for cross-cutting decorators, filters, and guards.

3. **Strict Module Boundary & Type Segregation**:
   - `libs/shared/contracts/`: Pure TypeScript interfaces for client-server API contracts (zero `class-validator` runtime dependencies).
   - `apps/api/src/modules/*/dto/`: NestJS-owned validation DTOs decorated with `class-validator` and `@nestjs/swagger` annotations implementing the shared contracts.
   - Nx tags (`scope:api`, `scope:web`, `scope:shared`) enforce architectural boundaries via ESLint.

4. **Modular Frontend Slices**:
   - Next.js UI is organized by feature slices under `apps/web/src/features/` with clean service wrappers and state providers.

---

## 🛠️ Step-by-Step Setup & Running Guide

Follow these steps to set up and run the project from scratch.

### Step 1: Prerequisites

Make sure you have installed:
- **Node.js**: `v18.18+` or `v20+` (`node -v`)
- **npm**: `v9+` or `v10+` (`npm -v`)
- **MySQL**: Server running locally on `127.0.0.1:3306`

---

### Step 2: Configure the `nx` CLI Shortcut

To run `nx` commands directly in your terminal without typing `npx nx`, add an alias to your shell profile:

**For macOS / Linux (zsh):**
```bash
echo 'alias nx="npx nx"' >> ~/.zshrc && source ~/.zshrc
```

*(Alternatively, install globally with `sudo npm install -g nx`, or use `npx nx <command>`)*.

---

### Step 3: Install Dependencies

Install all monorepo dependencies from the root directory:

```bash
npm install
```

---

### Step 4: Environment Configuration

Copy the example environment template to `.env`:

```bash
cp .env.example .env
```

Open `.env` and verify your MySQL credentials and application settings:

```env
# Database Connection (MySQL Prisma URL)
DATABASE_URL="mysql://root:root@127.0.0.1:3306/challenges_90days"

# Backend Server Configuration
PORT=4000

# JWT Authentication Secrets
JWT_SECRET="super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="super-secret-refresh-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Default Admin Seed Account
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="admin"

# Frontend Public API URL
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

---

### Step 5: Database Setup & Seeding

Initialize the MySQL database, apply migrations, and seed initial data using Nx targets:

```bash
# 1. Generate Prisma Client
nx run api:db-generate

# 2. Apply database migrations
nx run api:db-deploy

# 3. Seed default Admin account and challenge roadmap (idempotent)
nx run api:db-seed
```

> 💡 **Tip**: To inspect or edit the database in a browser UI, run:
> ```bash
> nx run api:db-studio
> ```

---

### Step 6: Start the Development Servers

Start both the NestJS API and Next.js Frontend concurrently in parallel:

```bash
nx run-many -t serve --parallel
```

Or start individual services independently:

```bash
# Start NestJS Backend only
nx serve api

# Start Next.js Frontend only
nx serve web
```

---

## 🌐 Application URLs

Once the dev servers are running, access the services at:

| Service | URL | Description |
| :--- | :--- | :--- |
| 🖥️ **Frontend Web App** | **[http://localhost:3000](http://localhost:3000)** | Next.js 14 Roadmap Hub, challenges, and user dashboard |
| ⚡ **Backend REST API** | **[http://localhost:4000/api](http://localhost:4000/api)** | NestJS API root endpoint |
| 📚 **Swagger Documentation** | **[http://localhost:4000/api/docs](http://localhost:4000/api/docs)** | Interactive OpenAPI test console & documentation |
| 🗄️ **Prisma Studio** | **[http://localhost:5555](http://localhost:5555)** | *(When `nx run api:db-studio` is running)* |

---

## 🔑 Default Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin` | Full moderation console, challenge approvals, platform metrics |
| **User** | *Register at `/register`* | *Custom* | 90-day learning curriculum, code submissions, progress tracker |

---

## 📦 Production Build

To compile all applications and shared libraries for production:

```bash
# Build all apps & libs
nx run-many -t build

# Or build individual projects
nx build api    # Compiles NestJS backend to dist/apps/api
nx build web    # Generates Next.js optimized production bundle
```

---

## ⚡ Helpful Nx Monorepo Commands

```bash
# View interactive project dependency graph
nx graph

# Build or test only what has changed since git main branch
nx affected -t build
nx affected -t lint

# Clear Nx local computation cache
nx reset
```

---

## 📄 License

MIT License
