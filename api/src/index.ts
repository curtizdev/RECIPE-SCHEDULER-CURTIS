import express, { Request, Response } from "express";
import cors from "cors";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { scheduleReminder } from "./queue";

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new Database(process.env.SQLITE_PATH || "events.db");
db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  userId TEXT,
  title TEXT,
  eventTime TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS devices (
  userId TEXT PRIMARY KEY,
  pushToken TEXT
);
`);

const isoDateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: "Invalid ISO date string",
});

const eventSchema = z.object({
  title: z.string().min(1),
  eventTime: isoDateString,
  userId: z.string(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  eventTime: isoDateString.optional(),
});

const tokenSchema = z.object({
  userId: z.string(),
  pushToken: z.string(),
});

// Create Event
app.post("/api/events", (req: Request, res: Response): void => {
  const parse = eventSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json(parse.error);
    return;
  }

  const { title, eventTime, userId } = parse.data;
  const id = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    const stmt = db.prepare(
      "INSERT INTO events (id, userId, title, eventTime, createdAt) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(id, userId, title, eventTime, createdAt);

    scheduleReminder({ id, userId, title, eventTime });
    res.status(201).json({ id, userId, title, eventTime, createdAt });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get Events by userId
app.get("/api/events", (req: Request, res: Response): void => {
  const userId = req.query.userId as string;
  if (!userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }

  try {
    const stmt = db.prepare(
      "SELECT * FROM events WHERE userId = ? ORDER BY eventTime ASC"
    );
    const events = stmt.all(userId);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Get all events
app.get("/api/events/all", (req: Request, res: Response) => {
  try {
    const stmt = db.prepare("SELECT * FROM events ORDER BY eventTime ASC");
    const events = stmt.all();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Update Event
app.patch("/api/events/:id", (req: Request, res: Response): void => {
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json(parse.error);
    return;
  }

  const { title, eventTime } = parse.data;
  const id = req.params.id;

  try {
    const select = db.prepare("SELECT * FROM events WHERE id = ?");
    const existing = select.get(id) as
      | {
          id: string;
          userId: string;
          title: string;
          eventTime: string;
          createdAt: string;
        }
      | undefined;
    if (!existing) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const update = db.prepare(
      "UPDATE events SET title = ?, eventTime = ? WHERE id = ?"
    );
    update.run(title || existing.title, eventTime || existing.eventTime, id);

    scheduleReminder({
      id,
      userId: existing.userId,
      title: title || existing.title,
      eventTime: eventTime || existing.eventTime,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Delete Event
app.delete("/api/events/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const del = db.prepare("DELETE FROM events WHERE id = ?");
    const info = del.run(id);
    if (info.changes === 0) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Save Expo Push Token
app.post("/api/devices", (req: Request, res: Response) => {
  const parse = tokenSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json(parse.error);
    return;
  }

  const { userId, pushToken } = parse.data;
  try {
    const stmt = db.prepare(
      "INSERT OR REPLACE INTO devices (userId, pushToken) VALUES (?, ?)"
    );
    stmt.run(userId, pushToken);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
