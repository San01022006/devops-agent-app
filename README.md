# Task Manager

A production-ready full-stack Task Manager application built with React, FastAPI, SQLAlchemy, and Docker.

## Tech Stack

**Frontend:** React, Vite, React Router, Axios  
**Backend:** FastAPI, SQLAlchemy, SQLite, JWT Authentication  
**Testing:** Pytest, React Testing Library (Vitest)  
**Containerization:** Docker, Docker Compose

## Features

- User registration and login with JWT authentication
- Create, edit, delete, and manage tasks
- Mark tasks as complete or pending
- Priority levels (low, medium, high)
- Due date tracking
- Dashboard with progress statistics
- Responsive dark-themed UI
- Error handling and form validation

## Project Structure

```
task-manager/
├── backend/
│   ├── app.py              # FastAPI application entry point
│   ├── database.py         # Database connection and session
│   ├── models.py           # SQLAlchemy models (User, Task)
│   ├── schemas.py          # Pydantic schemas for validation
│   ├── auth.py             # JWT authentication utilities
│   ├── routes/
│   │   ├── auth_routes.py  # Authentication endpoints
│   │   └── task_routes.py  # Task management endpoints
│   ├── tests/
│   │   ├── test_auth.py    # Authentication tests
│   │   └── test_tasks.py   # Task CRUD tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── context/        # React context providers
│   │   └── tests/          # Frontend tests
│   ├── package.json
│   └── vite.config.js
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
└── .pipeline.yml           # CI/CD pipeline configuration
```

## Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Development Setup

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:5173.

## API Endpoints

| Method | Endpoint          | Description           | Auth Required |
|--------|-------------------|-----------------------|:------------:|
| POST   | `/register`       | Register a new user   | No           |
| POST   | `/login`          | Login and get JWT     | No           |
| GET    | `/me`             | Get current user      | Yes          |
| GET    | `/tasks`          | List user's tasks     | Yes          |
| POST   | `/tasks`          | Create a new task     | Yes          |
| GET    | `/tasks/{id}`     | Get task details      | Yes          |
| PUT    | `/tasks/{id}`     | Update a task         | Yes          |
| DELETE | `/tasks/{id}`     | Delete a task         | Yes          |
| GET    | `/tasks/dashboard`| Get dashboard stats   | Yes          |
| GET    | `/health`         | Health check          | No           |

## Running Tests

**Backend tests:**

```bash
cd backend
python -m pytest tests/ -v --cov=.
```

**Frontend tests:**

```bash
cd frontend
npm run test -- --run
```

## CI/CD Pipeline

The `.pipeline.yml` file defines the following pipeline steps:

1. **install_dependencies** - Install Python and Node.js dependencies
2. **run_tests** - Execute all backend and frontend tests
3. **build_frontend** - Build the frontend for production
4. **build_docker** - Build Docker images
5. **deploy** - Deploy the application using Docker Compose
