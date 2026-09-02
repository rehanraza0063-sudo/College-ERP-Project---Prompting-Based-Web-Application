# College ERP System

A full-stack Enterprise Resource Planning system for college management built with:

- **Frontend**: React 18 + Vite + React Router + Recharts + Lucide Icons
- **Backend**: Node.js + Express
- **Database**: SQLite (via Prisma ORM)

## Modules

1. **Dashboard** - Statistics, charts, recent admissions
2. **Student Management** - Full CRUD for student records
3. **Faculty Management** - Full CRUD for faculty members
4. **Course Management** - Course catalog with faculty assignments
5. **Examinations** - Grades, results, automatic grade calculation

## Quick Start

On Windows, just run:

```
start.bat
```

This launches both the backend (port 5000) and frontend (port 3000).

Alternatively, start them manually:

**Backend:**
```
cd backend
npm install
npx prisma db push
node prisma/seed.js
node server.js
```

**Frontend (separate terminal):**
```
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Reset Database

To reset with fresh seed data:

```
cd backend
node prisma/seed.js
```
