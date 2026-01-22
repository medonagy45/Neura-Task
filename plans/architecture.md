# Kanban-Style To-Do App Architecture Plan

## Overview

This document outlines the architecture for a MERN stack Kanban application. The app will have two main views: a Kanban Board and a Task Creation Form.

## Technology Stack

- **Frontend**: React (Vite), TypeScript, Redux Toolkit, React Router DOM, Tailwind CSS (for styling - easy implementation).
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB, Mongoose.

## Directory Structure

```
/
├── client/              # Frontend Application
│   ├── src/
│   │   ├── api/         # API Service calls
│   │   ├── components/  # Reusable UI components
│   │   ├── features/    # Feature-based modules
│   │   │   ├── board/   # Kanban Board logic
│   │   │   └── tasks/   # Task management logic
│   │   ├── store/       # Redux Store configuration
│   │   ├── types/       # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── server/              # Backend Application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API Routes
│   │   └── index.ts     # Entry point
│   └── package.json
└── README.md
```

## Data Model (MongoDB)

### Task Schema

```typescript
interface ITask {
  title: string; // Required
  description?: string; // Optional
  dueDate: Date; // Required
  status: "todo" | "in-progress" | "done";
  order: number; // For maintaining order within columns
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

| Method | Endpoint         | Description                | Body (Payload)                            |
| ------ | ---------------- | -------------------------- | ----------------------------------------- |
| GET    | `/api/tasks`     | Fetch all tasks            | -                                         |
| POST   | `/api/tasks`     | Create a new task          | `{ title, description, dueDate, status }` |
| PUT    | `/api/tasks/:id` | Update task details/status | `{ status, ...fields }`                   |
| DELETE | `/api/tasks/:id` | Delete a task (optional)   | -                                         |

## Frontend Architecture

### Routing

- `/`: Main Board View (Kanban)
- `/create`: Task Creation View

### State Management (Redux Toolkit)

- **Store**: `tasks` slice.
- **State Structure**:
  ```typescript
  interface TasksState {
    items: Task[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  }
  ```
- **Actions/Thunks**:
  - `fetchTasks`: GET `/api/tasks`
  - `addNewTask`: POST `/api/tasks`
  - `updateTaskStatus`: PUT `/api/tasks/:id`

### UI Components

- `Board`: Main container.
- `Column`: Represents "To Do", "In Progress", "Done".
- `TaskCard`: Individual task item with "Move" dropdown.
- `TaskForm`: Form for creating tasks with validation.
- `Notification`: For feedback (toast messages).

## Bonus Features (To be implemented after core)

1.  **Drag-and-Drop**: Use `@hello-pangea/dnd` (fork of react-beautiful-dnd) for smooth interactions.
2.  **Authentication**: Simple JWT-based auth or Firebase (if allowed, else custom JWT). For this MERN constraint, custom JWT with `bcrypt` and `jsonwebtoken` is standard.

## Development Phases

1.  **Setup**: Initialize Client (Vite) and Server (Express).
2.  **Backend Core**: Connect DB, create Model, implement CRUD API.
3.  **Frontend Core**: Setup Redux, API client, basic Routing.
4.  **Feature - Create Task**: Form with validation (React Hook Form).
5.  **Feature - Kanban Board**: Display columns, fetch data, implement "Move" dropdown.
6.  **Refinement**: Styling, error handling, loading states.
7.  **Bonus**: Drag & Drop, Auth.
