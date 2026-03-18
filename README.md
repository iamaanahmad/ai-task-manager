# AI‑Assisted Task Manager API

A simple REST API built with Node.js, Express, and SQLite for managing tasks. This project demonstrates an AI-assisted development workflow, covering features like scaffolding, automated testing, and code structure.

## Features

- **Create, Read, Update** Tasks
- **Track Status**: Tasks can be marked as `pending` or `done`
- **Deadlines**: Tasks can have customized deadlines
- **Unit Tests**: End-to-end API testing using `jest` and `supertest`
- **Database**: SQLite for lightweight, reliable persistence

## Tech Stack

- Node.js
- Express
- SQLite3
- Jest & Supertest

## Project Structure

```
/src
  /db
    database.js      # SQLite connection setup
  /models
    task.js          # DB queries for tasks
  /routes
    tasks.js         # Express routes for task operations
  app.js             # Express app instance
/tests
  task.test.js       # Unit tests
index.js             # Entry point
```

## Setup & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   npm start
   ```

## Testing

Run the included test-suite to verify everything operates expected:
```bash
npm test
```
