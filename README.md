# Mini Trello App (Real-Time Board Management Tool)

A beautiful, modern, full-stack monorepo starter configuration for a **Mini Trello App** using **React (Vite)** on the frontend and **Node.js (Express & TypeScript)** on the backend.

## 🚀 Features

- **React + TypeScript**: Clean type-safe interactive interface.
- **Express + TypeScript**: Simple, fast backend architecture.
- **Monorepo Workspaces**: Standard npm workspaces to easily manage code in a single repository.

## 🛠️ Setup & Installation

### Local Development

1.  **Install Dependencies** (Installs for both frontend and backend):

    ```bash
    npm run install:all
    ```

2.  **Start Frontend**:

    ```bash
    npm run start:frontend
    ```

    Runs Vite dev server. Open [http://localhost:5173](http://localhost:5173).

3.  **Start Backend**:

    ```bash
    npm run start:backend
    ```

    Runs Express app on port `8000`.

4.  **Run All Tests**:

    ```bash
    npm test
    ```

    ***

## 🏗️ Architecture & Design Patterns

For a deep dive into every architectural decision and design pattern applied across this codebase, see:

📄 **[architecture_analysis.md](architecture_analysis.md)**

This document covers:

- **Backend** — Layered Architecture, Repository Pattern, Dependency Injection, Interface + Implementation, Middleware Pattern, Factory Function, Observer/Socket.io, Singleton
- **Frontend** — Component-Based Architecture (3 layers), Lazy Loading, Custom Hooks, Redux Toolkit (Flux), Interceptor Pattern, Protected Route, Optimistic Update
- A full **data-flow diagram** showing how Frontend ↔ Backend communicate over HTTP and WebSocket

# 🗂️ Mini Trello App

A full-stack, real-time Kanban board application inspired by Trello — built with **Node.js/Express** on the backend and **React/Vite** on the frontend. Features include drag-and-drop task management, GitHub integration, OTP-based authentication, and real-time collaboration via WebSockets.

---

## 📸 Screenshots

<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/2d8ca027-b0d6-4bef-9312-0a8b501718c5" />
<img width="1918" height="908" alt="image" src="https://github.com/user-attachments/assets/6bda20eb-92e2-4047-8c6b-564a53c81586" />
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/795388e6-2781-4223-bd9b-1313937e6da2" />
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/c64ba87d-b60b-4d76-8a5b-c17142468065" />
<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/abe09b7d-4e05-4c4e-afa2-fa48ac82e377" />
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/b469e577-71b8-46fe-9bf0-1b51cd55a4a3" />
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/c3cd80f2-33c8-4049-9d4a-a4b1ea767af8" />
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/bf286f59-259d-4be3-8c57-ebde893dc6b2" />
<img width="1917" height="908" alt="image" src="https://github.com/user-attachments/assets/11f8ab28-7f23-474e-bd9c-0bc9d33d3e75" />
<img width="1900" height="909" alt="image" src="https://github.com/user-attachments/assets/38ab14d4-db66-4926-ab13-330fb7c07ca4" />
---


## 🎥  Video Demo

[Link Video](https://drive.google.com/file/d/10exK-cWW4sOTD7ba48p6tWsop_IOkld7/view?usp=sharing)

---
## 📁 Project Structure

```
mini-trello-app/                   ← Monorepo root (npm workspaces)
├── package.json                   ← Root scripts: start, build, test, lint
├── backend/                       ← Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts               ← Entry point: HTTP server + Socket.io bootstrap
│   │   ├── app.ts                 ← Express app factory (createApp)
│   │   ├── constants/             ← Shared constants (socket events, etc.)
│   │   ├── controllers/           ← HTTP request handlers (Route → Controller)
│   │   │   ├── auth.controller.ts
│   │   │   ├── board.controller.ts
│   │   │   ├── card.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── github_attachment.controller.ts
│   │   ├── services/              ← Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── board.service.ts
│   │   │   ├── card.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── github.service.ts
│   │   │   └── github_attachment.service.ts
│   │   ├── repositories/          ← Data access layer (Firestore abstraction)
│   │   │   ├── index.ts           ← BaseRepository (CRUD generics)
│   │   │   ├── board.repository.ts
│   │   │   ├── card.repository.ts
│   │   │   ├── task.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   └── github_attachment.repository.ts
│   │   ├── models/                ← TypeScript interfaces/types for data entities
│   │   │   ├── board.model.ts
│   │   │   ├── card.model.ts
│   │   │   ├── task.model.ts
│   │   │   └── user.model.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts ← JWT Bearer token verification
│   │   ├── routes/                ← Express Router definitions
│   │   │   ├── auth.route.ts
│   │   │   ├── board.route.ts
│   │   │   ├── card.route.ts
│   │   │   ├── task.route.ts
│   │   │   └── user.route.ts
│   │   ├── socket/
│   │   │   └── socket.ts          ← Socket.io server (board rooms, events)
│   │   ├── libs/                  ← Third-party integrations
│   │   │   ├── firebase/          ← Firestore connection
│   │   │   ├── github/            ← GitHub OAuth helpers
│   │   │   └── nodemailer/        ← Email (OTP, invitations)
│   │   ├── utils/
│   │   │   ├── settings.ts        ← Centralized env config
│   │   │   ├── logger.ts          ← Pino logger
│   │   │   └── auth.ts            ← JWT user extractor helper
│   │   └── docs/                  ← Swagger/OpenAPI setup
│   ├── tests/
│   │   └── app.test.ts            ← Integration tests (Jest + Supertest)
│   ├── .env.example               ← Environment variable template
│   └── package.json
│
└── frontend/                      ← React 19 + Vite + TypeScript
    ├── index.html
    ├── src/
    │   ├── main.tsx               ← React root: Redux Provider + App
    │   ├── App.tsx                ← RouterProvider + Toast notifications
    │   ├── routes/
    │   │   └── index.tsx          ← React Router v7 config (Lazy Loading)
    │   ├── container/             ← Page-level smart components
    │   │   ├── auth/              ← Login, Register, GitHub OAuth callback
    │   │   └── dashboard/         ← Dashboard, BoardView, BoardInviteAccept
    │   ├── components/            ← Reusable UI components
    │   │   ├── Layout.tsx         ← App shell (Header + Sidebar + Outlet)
    │   │   ├── Header.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── ProtectedRoute.tsx ← Auth guard + profile fetch
    │   │   ├── AuthForm.tsx
    │   │   ├── card/              ← Card-related components
    │   │   ├── task/              ← Task items, Add button, GitHub panel
    │   │   └── modal/             ← Modal dialogs
    │   ├── base/                  ← Base UI primitives (Button, Input, Modal…)
    │   │   ├── baseButton/
    │   │   ├── baseInput/
    │   │   ├── baseModal/
    │   │   ├── baseSelect/
    │   │   ├── baseSpinner/
    │   │   ├── baseTooltip/
    │   │   └── baseEditableTitle/
    │   ├── api/                   ← Axios API functions (one file per domain)
    │   │   ├── auth.ts
    │   │   ├── board.ts
    │   │   ├── card.ts
    │   │   ├── task.ts
    │   │   ├── github.ts
    │   │   └── githubAttachment.ts
    │   ├── hooks/                 ← Custom React hooks
    │   │   ├── useBoard.ts        ← Master board state + socket integration
    │   │   ├── useBoardSocket.ts  ← Socket.io room management
    │   │   ├── useGitHubAttachments.ts
    │   │   └── useGitHubPicker.ts
    │   ├── store/                 ← Redux Toolkit global state
    │   │   ├── index.ts           ← configureStore
    │   │   └── userSlice.ts       ← User profile slice
    │   ├── constants/             ← Route names, socket event names
    │   ├── utils/
    │   │   ├── axios.ts           ← Axios instance + interceptors
    │   │   └── socket.ts          ← Socket.io-client singleton
    │   └── style/                 ← Shared CSS/SCSS utilities
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

| Tool                    | Version                   |
| ----------------------- | ------------------------- |
| Node.js                 | ≥ 18                      |
| npm                     | ≥ 9                       |
| Google Cloud / Firebase | Firestore service account |
| GitHub OAuth App        | Client ID + Secret        |
| SMTP server             | For OTP emails            |

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd mini-trello-app
```

### 2. Install all dependencies

```bash
npm install
```

### 3. Configure the backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key

# Firestore
GOOGLE_APPLICATION_CREDENTIALS=./keyfile.json   # or set inline values

# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=http://localhost:5173/auth/github/callback

# SMTP (for OTP emails)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=yourpassword
```

### 4. Run the development servers

**Backend** (runs on port 8000):

```bash
npm run start:backend
```

**Frontend** (runs on port 5173):

```bash
npm run start:frontend
```

### 5. Running tests

```bash
npm test
```

### 6. Build for production

```bash
npm run build:backend    # compiles TypeScript → dist/
npm run build:frontend   # bundles Vite → dist/
```

---

## 🌐 API Documentation

When the backend is running, Swagger UI is available at:

```
http://localhost:8000/api-docs
```

---

## ✨ Key Features

- 📋 **Kanban Boards** — Create boards, columns (cards), and tasks
- 🔄 **Drag & Drop** — Reorder tasks across columns with `@hello-pangea/dnd`
- 🔴 **Real-time Sync** — All board changes broadcast via Socket.io
- 🔐 **OTP Authentication** — Passwordless login via email verification codes
- 🐙 **GitHub Integration** — Link repos to boards; view branches, PRs, issues & commits
- 📨 **Board Invitations** — Invite members via email with accept/decline flow
- 👥 **Member Assignment** — Assign board members to specific tasks
- 🛡️ **JWT Auth Guard** — Protected routes on both API and frontend

---

## 🛠️ Tech Stack

### Backend

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Runtime    | Node.js + TypeScript                         |
| Framework  | Express.js                                   |
| Database   | Google Cloud Firestore                       |
| Auth       | JWT (`jsonwebtoken`)                         |
| Real-time  | Socket.io                                    |
| Email      | Nodemailer                                   |
| GitHub API | Octokit REST                                 |
| Logging    | Pino                                         |
| Testing    | Jest + Supertest                             |
| API Docs   | Swagger (swagger-jsdoc + swagger-ui-express) |

### Frontend

| Layer       | Technology               |
| ----------- | ------------------------ |
| Framework   | React 19 + Vite          |
| Language    | TypeScript               |
| Routing     | React Router v7          |
| State       | Redux Toolkit            |
| HTTP        | Axios                    |
| Real-time   | Socket.io-client         |
| Styling     | Tailwind CSS             |
| Animations  | Framer Motion            |
| Drag & Drop | @hello-pangea/dnd        |
| Forms       | React Hook Form          |
| Testing     | Vitest + Testing Library |
