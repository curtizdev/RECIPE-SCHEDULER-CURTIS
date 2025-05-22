# Recipe Scheduler

## Overview

Recipe Scheduler is a Node.js/TypeScript project designed to manage and schedule recipe-related events and notifications. The system is split into two main components:

- **API Server** (`/api`): Handles HTTP requests, event creation, user/device management, and validation.
- **Worker** (`/worker`): Processes background jobs such as sending reminders, using a robust queue system.

## Architecture

The project uses a combination of SQLite for persistent storage and Redis + BullMQ for background job processing. This separation ensures that time-consuming or scheduled tasks (like sending notifications) do not block the main API server, improving scalability and reliability.

### Key Technologies

- **Express.js**: For building the RESTful API.
- **Zod**: For runtime validation of incoming data.
- **SQLite**: Lightweight, file-based database for storing events and device tokens.
- **Redis**: In-memory data structure store, used as a message broker for job queues.
- **BullMQ**: A Node.js library for robust job and message queues, built on top of Redis.
- **dotenv**: For environment variable management.
- **uuid**: For generating unique identifiers.

## Why Redis + BullMQ?

### 1. **Reliability and Scalability**

- **Redis** is a high-performance, in-memory data store that acts as a message broker for BullMQ. It is widely used in production for its speed and reliability.
- **BullMQ** provides a robust job queue system with features like delayed jobs, retries, rate limiting, and job prioritization.
- This combination allows the system to handle a large number of scheduled or background tasks efficiently, without losing jobs even if the worker or API restarts.

### 2. **Separation of Concerns**

- By offloading background tasks (like sending reminders) to a worker process, the API server remains responsive and can scale independently.
- BullMQ’s queue-based architecture makes it easy to add more workers if the load increases.

### 3. **Advanced Scheduling**

- BullMQ supports delayed jobs and repeatable jobs, which is ideal for scheduling reminders or notifications at specific times.
- Jobs can be retried automatically on failure, and failed jobs can be inspected and managed via BullMQ’s UI tools.

### 4. **Observability and Management**

- BullMQ provides tools and events for monitoring job status, failures, and completions.
- Redis makes it easy to inspect the state of the queue and jobs in real time.

## Example Workflow

1. **User creates an event** via the API.
2. **API validates and stores** the event in SQLite.
3. **API schedules a reminder** by adding a job to the BullMQ queue (backed by Redis).
4. **Worker process** listens to the queue and processes jobs at the scheduled time (e.g., sends a push notification).

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Redis server running locally or remotely

### Installation

```bash
git clone https://github.com/yourusername/recipe-scheduler.git
cd recipe-scheduler
npm install
```

### Environment Variables

Create a `.env` file in both `/api` and `/worker` directories with the following (adjust as needed):

```
REDIS_URL=redis://localhost:6379
```

### Running the API

```bash
cd api
npm run build
npm start
```

### Running the Worker

```bash
cd worker
npm run build
npm start
```

### Start Dependencies with Docker Compose

If you have Docker installed, you can quickly start Redis using Docker Compose:

```bash
docker compose up -d
```

> This will start a Redis server in the background.  
> Make sure your `docker-compose.yml` includes a Redis service.

## API Endpoints

- `POST /api/events` — Create a new event
- `GET /api/events?userId=...` — Get events for a user
- `GET /api/events/all` — Get all events
- `PATCH /api/events/:id` — Update an event
- `DELETE /api/events/:id` — Delete an event
- `POST /api/devices` — Register a device push token

## Conclusion

By leveraging **Redis + BullMQ**, Recipe Scheduler achieves a scalable, reliable, and maintainable architecture for handling scheduled and background tasks. This ensures that user experience remains smooth, and the system can grow as demand increases.

---
