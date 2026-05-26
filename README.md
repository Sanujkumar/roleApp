# RoleApp — Full-Stack RBAC Application

A production-grade Single Page Application with Role-Based Access Control built with **Angular 15**, **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Angular 15, TypeScript, Tailwind CSS |
| Backend    | Node.js, Express.js, TypeScript     |
| Database   | PostgreSQL + Prisma ORM             |
| Auth       | Token-based (in-memory session)     |

---

## Features

- **Authentication** — Login with email/password, token stored in localStorage
- **Role-Based Access Control** — USER and ADMIN roles with route guards
- **Dashboard** — Users see their own records; Admins see all records
- **Admin Panel** — Full CRUD: create, view, update role, delete users
- **Loading States** — 2–3 second artificial API delay with spinners
- **MVC Backend** — Controllers / Services / Routes architecture
- **Error Handling** — try/catch on all API routes with meaningful messages
- **Responsive UI** — Tailwind CSS with dark theme, custom fonts

---

## Project Structure

```
roleapp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # DB schema (User, Record models)
│   │   └── seed.ts              # Seed test data
│   ├── src/
│   │   ├── controllers/         # Business logic layer
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── record.controller.ts
│   │   ├── services/            # Data access layer
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── record.service.ts
│   │   ├── routes/              # API route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── record.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts             # Express entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    └── src/
        └── app/
            ├── components/
            │   ├── login/           # Login page
            │   ├── dashboard/       # Records dashboard
            │   ├── admin/           # Admin user management
            │   └── shared/          # Navbar, Spinner
            ├── guards/
            │   ├── auth.guard.ts    # Blocks unauthenticated users
            │   └── role.guard.ts    # Blocks non-admin users
            ├── services/
            │   ├── auth.service.ts  # Login, session management
            │   ├── user.service.ts  # Centralized HTTP API calls
            │   └── auth.interceptor.ts  # Attaches Bearer token
            ├── models/
            │   └── index.ts         # TypeScript interfaces
            └── app.module.ts
```

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **PostgreSQL** v14+ running locally (or connection string)
- **Angular CLI** — `npm install -g @angular/cli@15`

---

## Setup Instructions

### 1. Clone / Extract the project

```bash
cd roleapp
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your PostgreSQL connection:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/roleapp_db"
PORT=3000
FRONTEND_URL="http://localhost:4200"
```

Create the database in PostgreSQL:

```sql
CREATE DATABASE roleapp_db;
```

Run migrations and seed:

```bash
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

Start the backend:

```bash
npm run dev
# Server runs on http://localhost:3000
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
npm start
# App runs on http://localhost:4200
```   

The Angular dev server automatically proxies `/api` requests to `http://localhost:3000` via `proxy.conf.json`.

---

## API Endpoints

### Auth
| Method | Endpoint         | Description         | Auth Required |
|--------|-----------------|---------------------|---------------|
| POST   | /api/auth/login  | Login               | No            |
| POST   | /api/auth/logout | Logout              | Yes           |
| GET    | /api/auth/me     | Get current user    | Yes           |

### Users (Admin only)
| Method | Endpoint          | Description     |
|--------|------------------|-----------------|
| GET    | /api/users        | Get all users   |
| POST   | /api/users        | Create user     |
| PUT    | /api/users/:id    | Update user     |
| DELETE | /api/users/:id    | Delete user     |

### Records
| Method | Endpoint      | Description                              |
|--------|--------------|------------------------------------------|
| GET    | /api/records  | Get records (own for USER, all for ADMIN)|

---

## Test Credentials (after seeding)

| Role  | Email                | Password    |
|-------|---------------------|-------------|
| ADMIN | admin@example.com   | password123 |
| USER  | alice@example.com   | password123 |
| USER  | bob@example.com     | password123 |

---

## Angular Routes

| Route        | Access       | Description         |
|--------------|-------------|---------------------|
| `/login`     | Public       | Login page          |
| `/dashboard` | Authenticated| Records dashboard   |
| `/admin`     | Admin only   | User management     |

---

## Angular Services

`UserService` (`user.service.ts`) is the centralized service for all HTTP calls:

```typescript
login(email, password)   // POST /api/auth/login
getUsers()               // GET  /api/users
getRecords()             // GET  /api/records
createUser(payload)      // POST /api/users
updateUser(id, payload)  // PUT  /api/users/:id
deleteUser(id)           // DELETE /api/users/:id
```

---

## Environment Variables

### Backend (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/roleapp_db"
PORT=3000
FRONTEND_URL="http://localhost:4200"
```

### Frontend

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // Proxied to backend in dev
};
```

---

## Loading States

All API endpoints include an artificial **2–3 second delay** to demonstrate loading UI:

```typescript
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
await delay(2000 + Math.random() * 1000);
```

The frontend shows spinners during all async operations.

---

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)  // USER | ADMIN
  createdAt DateTime @default(now())
  records   Record[]
}

model Record {
  id        Int          @id @default(autoincrement())
  title     String
  status    RecordStatus  // PENDING | ACTIVE | COMPLETED | ARCHIVED
  createdAt DateTime     @default(now())
  userId    Int
  user      User         @relation(...)
}
```
