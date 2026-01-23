# Neura-Task - Kanban-Style To-Do App

A modern Kanban-style task management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Kanban Board**: Drag-and-drop task management across To Do, In Progress, and Done columns
- **Task Management**: Create, move, and delete tasks
- **User Authentication**: Secure JWT-based authentication with password validation (minimum 6 characters)
- **Real-time Updates**: Optimistic UI updates with automatic reversion on errors
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and React 19

## Tech Stack

### Frontend

- React 19 with TypeScript
- Redux Toolkit for state management
- React Router DOM for navigation
- Tailwind CSS for styling
- Axios for API communication
- React Hook Form for form validation
- date-fns for date formatting
- @hello-pangea/dnd for drag-and-drop
- React Toastify for notifications

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- CORS support for cross-origin requests

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Neura-Task
```

### 2. Install Dependencies

Install all dependencies (root, server, and client):

```bash
npm run install:all
```

Or install separately:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

#### Server Configuration

Copy the example environment file and configure:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/neura-task
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Important**: Generate a secure JWT_SECRET for production:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Client Configuration

Copy the example environment file and configure:

```bash
cd client
cp .env.example .env
```

Edit `client/.env` with your backend URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running locally or you have a MongoDB Atlas connection string.

**Local MongoDB:**

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**MongoDB Atlas:**

Use the connection string provided in your Atlas dashboard for `MONGO_URI`.

### 5. Run the Application

#### Development Mode (Both Server and Client)

```bash
npm start
```

This runs both servers concurrently:

- Server: http://localhost:5000
- Client: http://localhost:5173

#### Run Server Only

```bash
cd server
npm run dev
```

#### Run Client Only

```bash
cd client
npm run dev
```

## Project Structure

```
Neura-Task/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/        # API client configuration
│   │   ├── components/  # Reusable components (empty)
│   │   ├── features/    # Feature-based modules
│   │   │   ├── auth/      # Authentication components and state
│   │   │   ├── board/     # Kanban board component
│   │   │   └── tasks/     # Task management
│   │   ├── store/       # Redux store configuration
│   │   ├── types/       # TypeScript type definitions
│   │   ├── App.tsx      # Main app component
│   │   ├── main.tsx     # Application entry point
│   │   └── index.css    # Global styles
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utility functions
│   │   └── index.ts     # Server entry point
│   ├── .env.example
│   └── package.json
├── plans/                  # Architecture documentation
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description       | Body                     |
| ------ | -------------------- | ----------------- | ------------------------ |
| POST   | `/api/auth/register` | Register new user | `{ username, password }` |
| POST   | `/api/auth/login`    | Login user        | `{ username, password }` |

### Tasks

| Method | Endpoint         | Description                            | Body                                             |
| ------ | ---------------- | -------------------------------------- | ------------------------------------------------ |
| GET    | `/api/tasks`     | Fetch all tasks for authenticated user | -                                                |
| POST   | `/api/tasks`     | Create new task                        | `{ title, description, dueDate, status }`        |
| PUT    | `/api/tasks/:id` | Update task                            | `{ title, description, status, dueDate, order }` |
| DELETE | `/api/tasks/:id` | Delete task                            | -                                                |

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds of 10
- **Password Validation**: Minimum 6 characters required
- **CORS**: Configurable CORS for cross-origin requests
- **Token Expiry**: 1-hour session timeout with automatic logout

## Development Notes

### Hot Module Replacement (HMR)

Both client and server support hot reloading during development.

### TypeScript

Full TypeScript support on both frontend and backend with strict type checking.

### Code Style

The project uses ESLint for code linting. Run:

```bash
cd client
npm run lint
```

## Building for Production

### Build Client

```bash
cd client
npm run build
```

This creates an optimized production build in `client/dist/`.

### Build Server

```bash
cd server
npm run build
```

This compiles TypeScript to JavaScript in `server/dist/`.

## Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection error":

1. Verify MongoDB is running: `mongosh` or connect via MongoDB Compass
2. Check your `MONGO_URI` in `server/.env`
3. Ensure MongoDB is accessible (check firewall/network)

### Port Already in Use

If you see "Port 5000 is already in use":

```bash
# Find the process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Build Errors

If you encounter TypeScript errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## License

ISC

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
