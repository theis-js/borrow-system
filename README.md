# Borrow System

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

A small full‑stack system to log in, view available items, reserve them for a time window, and manage personal loans.

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + MySQL + JWT (jose)
- Orchestration: Docker Compose (backend + MySQL)

## Contents

- Frontend: [frontend/](frontend)
  - Vite/Tailwind config: [frontend/vite.config.ts](frontend/vite.config.ts), [frontend/tailwind.config.js](frontend/tailwind.config.js)
  - App entry: [frontend/src/main.tsx](frontend/src/main.tsx), [frontend/src/App.tsx](frontend/src/App.tsx)
  - UI: [frontend/src/layout/Layout.tsx](frontend/src/layout/Layout.tsx), [frontend/src/components](frontend/src/components)
  - Data/utilities: [frontend/src/utils/fetchData.ts](frontend/src/utils/fetchData.ts), [frontend/src/utils/userHandler.ts](frontend/src/utils/userHandler.ts), [frontend/src/utils/toastify.ts](frontend/src/utils/toastify.ts)
- Backend: [backend/](backend)
  - Server: [backend/server.js](backend/server.js)
  - Routes: [backend/routes/api.js](backend/routes/api.js), [backend/routes/apiV2.js](backend/routes/apiV2.js)
  - DB + services: [backend/services/database.js](backend/services/database.js), [backend/services/tokenService.js](backend/services/tokenService.js)
  - Schema/seed: [backend/scheme.sql](backend/scheme.sql)
- Docs: [docs/](docs)
  - API docs (see below): [docs/backend_API_docs/README.md](docs/backend_API_docs/README.md)

## Features (high‑level)

- Auth via JWT (login -> token cookie) using the backend route in [backend/routes/api.js](backend/routes/api.js).
- After login, the app loads items, loans, and user loans and keeps them in localStorage.
- Choose a date range to fetch borrowable items, select items, and create a loan.
- Manage personal loans list (and delete a loan).

Key frontend utilities:

- [`utils.fetchData.fetchAllData`](frontend/src/utils/fetchData.ts): loads items, loans, and user loans after login.
- [`utils.fetchData.getBorrowableItems`](frontend/src/utils/fetchData.ts): fetches borrowable items for the selected time range.
- [`utils.userHandler.createLoan`](frontend/src/utils/userHandler.ts): creates a new loan for selected items.
- [`utils.userHandler.handleDeleteLoan`](frontend/src/utils/userHandler.ts): deletes a loan and syncs local state.
- [`utils.toastify.myToast`](frontend/src/utils/toastify.ts): toast notifications.

UI flow (main screens):

- Period selection: [frontend/src/components/Form1.tsx](frontend/src/components/Form1.tsx)
- Borrowable items + selection: [frontend/src/components/Form2.tsx](frontend/src/components/Form2.tsx)
- User loans table: [frontend/src/components/Form4.tsx](frontend/src/components/Form4.tsx)

## Quick start

You can run the backend + MySQL via Docker, and run the frontend locally.

### 1) Environment

Root `.env` (used by docker-compose):

```env
DB_PASSWORD=yourStrongPassword
```

Backend `.env` (used by Node in the backend container or local dev):

```env
# DB (only needed for local dev; in Docker these are provided by compose)
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=yourStrongPassword
DB_NAME=borrow_system

# Security
SECRET_KEY=yourVerySecretJwtKey
ADMIN_ID=yourAdminApiKey
```

### 2) Start backend + DB (Docker)

From the repo root:

```sh
docker compose up -d
```

- Backend: http://localhost:8002
- MySQL: localhost:3309 (mapped to container 3306)

Initialize schema and mock data in MySQL:

```sh
# copy schema into the mysql container
docker cp backend/scheme.sql borrow_system-mysql:/scheme.sql

# run it
docker exec -i borrow_system-mysql sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" borrow_system < /scheme.sql'
```

### 3) Run the frontend (local)

```sh
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:8001 (configured in [frontend/vite.config.ts](frontend/vite.config.ts))

The frontend expects the backend on http://localhost:8002 (see fetches in [frontend/src/utils/fetchData.ts](frontend/src/utils/fetchData.ts) and [frontend/src/utils/userHandler.ts](frontend/src/utils/userHandler.ts)).

## Development

- Scripts: see [frontend/package.json](frontend/package.json) and [backend/package.json](backend/package.json)
  - Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`
  - Backend: `npm start`
- Linting: ESLint configured via [frontend/eslint.config.js](frontend/eslint.config.js)
- TypeScript configs: [frontend/tsconfig.app.json](frontend/tsconfig.app.json), [frontend/tsconfig.node.json](frontend/tsconfig.node.json)

## Configuration notes

- Vite/Tailwind integration via [frontend/vite.config.ts](frontend/vite.config.ts) and `@tailwindcss/vite`; CSS entry uses `@import "tailwindcss"` in [frontend/src/index.css](frontend/src/index.css).
- Toasts wired in [frontend/src/main.tsx](frontend/src/main.tsx) with `react-toastify`.
- Local state is stored in `localStorage` keys: `allItems`, `allLoans`, `userLoans`, `borrowableItems`. Cross‑component updates are signaled via window events from [`utils.fetchData`](frontend/src/utils/fetchData.ts).

## API documentation

Do not use this README for API details. Refer to the dedicated API docs:

- Web/API
