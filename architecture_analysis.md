# 🏗️ Architecture Analysis — Mini Trello App

## System Overview

This is a **Monorepo** application consisting of 2 independent workspaces:
- `backend/` — REST API + WebSocket server (Node.js/Express/TypeScript)
- `frontend/` — Single Page Application (React 19/Vite/TypeScript)

---
<img width="994" height="682" alt="image" src="https://github.com/user-attachments/assets/0e9d34f3-2554-4fa2-9d2d-79f2804981eb" />

## 🔵 BACKEND PATTERNS

### 1. Layered Architecture

The backend is organized according to **4 distinct layers**, where each layer only communicates with adjacent layers:

```
HTTP Request
     ↓
┌─────────────┐
│   Routes    │  → Define URLs + assign middleware + invoke Controller
└──────┬──────┘
       ↓
┌─────────────┐
│ Controllers │  → Receive Request, extract data, invoke Service, return Response
└──────┬──────┘
       ↓
┌─────────────┐
│  Services   │  → Business logic: validation, orchestration, send email, emit socket
└──────┬──────┘
       ↓
┌─────────────┐
│Repositories │  → Data access: read/write Firestore
└─────────────┘
```

**Real-world Example — Creating a Task:**

| Layer | File | Responsibility |
|------|------|-------------|
| Route | `task.route.ts` | `router.post("/:cardId/tasks", requireAuth, taskController.createCard)` |
| Controller | `task.controller.ts` | Extract `boardId`, `cardId`, `user` from request → invoke `taskService.createTaskWithInCard()` |
| Service | `task.service.ts` | Verify board/card exists, calculate `order`, invoke `taskRepository.create()`, emit socket event |
| Repository | `task.repository.ts` | Call `getCollection().doc().set(data)` to Firestore |

---

### 2. Repository Pattern

**BaseRepository** (`repositories/index.ts`) is a generic parent class that defines **standard CRUD** for all Firestore collections:

```typescript
export class BaseRepository {
  protected collectionName: string;
  
  async create(data: any): Promise<any>    // Auto-generate ID, add createdAt/updatedAt
  async findById(id: string): Promise<any>
  async findAll(): Promise<any[]>
  async update(id: string, data: any): Promise<any>
  async delete(id: string): Promise<any>
}
```

Child repositories **extend** `BaseRepository` and add custom queries:

```typescript
// BoardRepository — Filter boards by userId (owner or member)
class BoardRepository extends BaseRepository {
  async getAllBoardsCustom(userId: string): Promise<Board[]> {
    return this.getCollection()
      .where(Filter.or(
        Filter.where("ownerId", "==", userId),
        Filter.where(`listMembers.${userId}`, "==", "accepted")
      )).get();
  }
}

// UserRepository — Queries by email, githubId, search
class UserRepository extends BaseRepository {
  async findUserByEmail(email: string): Promise<User | null>
  async findUserByGithubId(githubId: string): Promise<User | null>
  async searchVerifiedUsers(query: string): Promise<User[]>
}
```

> **Benefit:** If switching database from Firestore to PostgreSQL, only the Repository layer needs updating — Service and Controller remain unchanged.

---

### 3. Dependency Injection (DI) — Manual Constructor Injection

The project doesn't use an IoC container (like InversifyJS) but instead uses **Manual DI** through class constructors:

```typescript
// Service injects Repository into itself
export class BoardService implements IBoardService {
  private boardRepository = new BoardRepository();  // ← DI
  private userRepository = new UserRepository();    // ← DI
}

// Controller injects Service into itself
export class BoardController {
  private boardService: IBoardService = new BoardService();  // ← DI
  private githubService = new GitHubService();               // ← DI
}

// Route instantiates Controller and assigns handler
const boardController = new BoardController();  // ← DI at route level
router.get("/", boardController.getAllBoards);
```

> **Why use Interface?** — `private boardService: IBoardService` allows easy **mocking** in unit tests without changing production code.

---

### 4. Interface + Implementation Pattern (Abstraction)

Each Service defines an **Interface** before implementing it:

```typescript
// Define contract (agreement)
export interface IBoardService {
  createBoard(name: string, ownerId: string, description?: string): Promise<Board>;
  getAllBoards(): Promise<Board[]>;
  getBoardById(id: string): Promise<Board | null>;
  // ...
}

// Implement contract
export class BoardService implements IBoardService {
  // ...
}
```

This pattern is consistently applied to: `IAuthService`, `IBoardService`, `ITaskService`, `IGitHubService`.

---

### 5. Middleware Pattern (Express Chain)

`auth.middleware.ts` — **JWT Guard** acts as an Express middleware:

```typescript
export const requireAuth = (req: any, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, settings.JWT_SECRET);
  req.user = decoded;  // Attach user to request object
  next();              // Pass to next handler
};

// Apply per route or entire router:
router.use(requireAuth);  // ← All routes below are protected
```

---

### 6. Factory Function Pattern

`app.ts` exports a **factory function** instead of a singleton:

```typescript
export function createApp(): Express {
  const app = express();
  // ... setup middleware, routes
  return app;
}
```

> **Benefit:** In test files, call `createApp()` to create a fresh instance — avoids side effects between test cases.

---

### 7. Observer Pattern — Real-time via Socket.io

Backend emits events when data changes (after Service processing):

```typescript
// In TaskController, after creating a task:
const io = getIo();
io.to(`board:${boardId}`).emit(SOCKET_EVENTS.TASK_CREATED, responseData);
```

```typescript
// Socket server manages rooms (rooms by boardId):
socket.on(SOCKET_EVENTS.BOARD_JOIN, (boardId: string) => {
  socket.join(`board:${boardId}`);  // Client joins room
});
```

Events: `TASK_CREATED`, `TASK_UPDATED`, `TASK_DELETED`, `CARD_CREATED`, `CARD_UPDATED`, `MEMBER_ASSIGNED`, `MEMBER_REMOVED`.

---

### 8. Singleton Pattern — Settings & Socket Server

```typescript
// settings.ts — Singleton config object
export const settings = {
  PORT: Number(process.env.PORT) || 8000,
  JWT_SECRET: process.env.JWT_SECRET || "...",
};

// socket.ts — Singleton Socket.io server
let io: Server;
export const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
```

---

## 🟢 FRONTEND PATTERNS

### 1. Component-Based Architecture (3 Layers)

UI is organized according to **3 component layers**:

```
┌─────────────────────────────┐
│   Pages / Containers        │  ← Smart: fetch data, manage state
│  (container/dashboard/)     │     BoardView, Dashboard, Auth
├─────────────────────────────┤
│   Feature Components        │  ← Stateful domain components
│  (components/card/, task/)  │     CardItem, TaskItem, GitHubPanel
├─────────────────────────────┤
│   Base UI Primitives        │  ← Dumb/presentational, no domain logic
│  (base/)                    │     BaseButton, BaseInput, BaseModal
└─────────────────────────────┘
```

**Separation of Concerns:**
- `container/` — Aware of API, Redux, routing
- `components/` — Receive props, emit events up to parent
- `base/` — Completely dumb, only render UI

---

### 2. Lazy Loading Pattern

`routes/index.tsx` uses `React.lazy()` combined with dynamic `import()` to **load code only when needed**:

```typescript
// Eager load — always load immediately
import Auth from "../container/auth/Auth.tsx";
import Dashboard from "../container/dashboard/Dashboard.tsx";

// Lazy load — load only when user navigates to that route
const BoardView = lazy(() => import("../container/dashboard/BoardView.tsx"));
const BoardInviteAccept = lazy(() => import("../container/dashboard/BoardInviteAccept.tsx"));
```

> **Why is `BoardView` lazy loaded?** — This is the heaviest component (drag-and-drop, socket, GitHub panel). Lazy loading reduces **initial bundle size**, improves **Time to Interactive** for the Dashboard page.

---

### 3. Custom Hooks Pattern (Separation of Logic)

Logic is completely separated from JSX through custom hooks:

```typescript
// useBoard.ts — Encapsulates entire board state machine:
export function useBoard(boardId, profileId) {
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [tasksMap, setTasksMap] = useState({});

  const fetchData = useCallback(async () => { ... }, [boardId]);
  useEffect(() => { fetchData(); }, [fetchData]);

  useBoardSocket(boardId, { /* socket event handlers */ });

  const handleDragEnd = async (result: DropResult) => { ... };

  return { board, cards, tasksMap, handleDragEnd, ... };
}
```

```typescript
// useBoardSocket.ts — Encapsulates entire socket lifecycle:
export function useBoardSocket(boardId, handlers) {
  useEffect(() => {
    socket.emit(SOCKET_EVENTS.BOARD_JOIN, boardId);
    for (const [event, handler] of entries) socket.on(event, handler);
    
    return () => {
      socket.emit(SOCKET_EVENTS.BOARD_LEAVE, boardId);  // Cleanup
      for (const [event, handler] of entries) socket.off(event, handler);
    };
  }, [boardId]);
}
```

---

### 4. State Management — Redux Toolkit (Flux Pattern)

Redux Toolkit manages **global state** (user profile):

```typescript
// userSlice.ts
const userSlice = createSlice({
  name: "user",
  initialState: { profile: null, loading: false, error: null },
  reducers: {
    setUser(state, action) { state.profile = action.payload; },
    clearUser(state)        { state.profile = null; },
  },
});

// Usage:
const profile = useSelector((state: RootState) => state.user.profile);
dispatch(setUser(data));
```

> **Design Note:** Only `user profile` goes into Redux. Board/card/task state is managed **locally** in the `useBoard` hook because they're only needed on one screen.

---

### 5. Interceptor Pattern — Axios

`utils/axios.ts` configures a **single Axios instance** with interceptors:

```typescript
// Request interceptor: automatically attach JWT token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = ROUTES.LOGIN;  // Auto redirect
    }
    return Promise.reject(new Error(error.response?.data?.error));
  }
);
```

---

### 6. Protected Route Pattern (HOC-like Guard)

`ProtectedRoute.tsx` is a wrapper component that checks authentication:

```typescript
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;

  useEffect(() => {
    getProfile().then(data => dispatch(setUser(data)));
  }, []);

  return <>{children}</>;
};
```

---

### 7. Singleton Pattern — Socket Client

```typescript
// utils/socket.ts — Socket.io client singleton
import { io } from "socket.io-client";
export const socket = io(SOCKET_URL, { autoConnect: false });
```

The entire app uses **the same socket instance**, avoiding multiple connections.

---

### 8. Optimistic Update Pattern

In `useBoard.ts`, drag-and-drop updates the UI **immediately** before the API responds:

```typescript
const handleDragEnd = async (result: DropResult) => {
  // 1. UPDATE UI IMMEDIATELY (optimistic)
  setTasksMap((prev) => ({
    ...prev,
    [sourceCardId]: sourceTasks,
    [destCardId]: destTasks,
  }));

  try {
    // 2. Persist to server
    await reorderTasks(boardId!, payload);
  } catch (e) {
    // 3. If error → REVERT to old state by refetching
    fetchData();
  }
};
```

---

## 📊 Summary of 15 Patterns

| # | Pattern | Where Applied | Purpose |
|---|---------|-------------|----------|
| 1 | **Layered Architecture** | Route → Controller → Service → Repository | Separation of Concerns |
| 2 | **Repository Pattern** | `BaseRepository` + child classes | Decouple data access from business logic |
| 3 | **Dependency Injection** | Service inject Repository; Controller inject Service | Loose coupling, testability |
| 4 | **Interface + Implementation** | `IBoardService`, `ITaskService`, `IAuthService` | Abstraction, mockable |
| 5 | **Middleware Pattern** | `auth.middleware.ts` (JWT guard) | Cross-cutting concern |
| 6 | **Factory Function** | `createApp()` in `app.ts` | Testability (isolated instances) |
| 7 | **Observer / Pub-Sub** | Socket.io: Controller emit → Client subscribe | Real-time communication |
| 8 | **Singleton** | `settings`, `getIo()`, `socket` client | Shared resource, single instance |
| 9 | **Lazy Loading** | `React.lazy()` + dynamic `import()` in routes | Code splitting, performance |
| 10 | **Component-Based Architecture** | Container / Feature / Base 3-layer UI | Reusability, encapsulation |
| 11 | **Custom Hooks** | `useBoard`, `useBoardSocket`, `useGitHubPicker` | Logic reuse, clean JSX |
| 12 | **Flux / Redux** | `Redux Toolkit` + `userSlice` | Predictable global state |
| 13 | **Interceptor Pattern** | Axios request/response interceptors | Centralized auth & error handling |
| 14 | **Protected Route** | `ProtectedRoute.tsx` | Route-level auth guard |
| 15 | **Optimistic Update** | `handleDragEnd` in `useBoard.ts` | Perceived performance |

---

## 🔗 Overall Data Flow

```
                    Frontend                                  Backend
┌────────────────────────────────┐          ┌──────────────────────────────────┐
│                                │          │                                  │
│  React Component               │          │  Express Route                   │
│       ↓                        │  HTTP    │       ↓ requireAuth middleware    │
│  api/board.ts (Axios) ─────────────────→  │  Controller                      │
│       ↑                        │          │       ↓                          │
│  Redux Store / useState        │  JSON    │  Service (business logic)        │
│                                │  ←───────│       ↓                          │
│  useBoardSocket.ts             │          │  Repository                      │
│       ↑↓                       │  WS      │       ↓                          │
│  socket (singleton)  ←────────────────────│  Firestore DB                    │
│                                │  events  │       ↑                          │
│                                │          │  Socket.io emit (after Service)  │
└────────────────────────────────┘          └──────────────────────────────────┘
```
