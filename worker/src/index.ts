// worker/index.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import * as dotenv from "dotenv";
import axios from "axios";
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: +(process.env.REDIS_PORT || 6379),
});

const worker = new Worker(
  "reminders",
  async (job) => {
    const { userId, title, eventTime } = job.data;

    try {
      const pushToken = await getExpoPushTokenForUser(userId);

      if (!pushToken) {
        console.warn(`⚠️ No push token for user ${userId}. Logging instead.`);
        await logNotificationToDB({ userId, title, eventTime });
        return;
      }

      const message = {
        to: pushToken,
        sound: "default",
        title,
        body: `Event at ${new Date(eventTime).toLocaleString()}`,
        data: { title, eventTime },
      };

      await axios.post("https://exp.host/--/api/v2/push/send", message);
      console.log(`📲 Sent push notification to ${userId}`);
    } catch (err) {
      console.error(`❌ Failed to send notification for job ${job.id}:`, err);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed.`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

async function openDB() {
  return open({
    filename: process.env.SQLITE_PATH || "./data.db",
    driver: sqlite3.Database,
  });
}

async function getExpoPushTokenForUser(userId: string): Promise<string | null> {
  const db = await openDB();
  const row = await db.get(
    "SELECT token FROM devices WHERE userId = ?",
    userId
  );
  return row?.token || null;
}

async function logNotificationToDB({
  userId,
  title,
  eventTime,
}: {
  userId: string;
  title: string;
  eventTime: string;
}) {
  const db = await openDB();
  await db.run(
    "INSERT INTO notifications (userId, title, eventTime, createdAt) VALUES (?, ?, ?, datetime('now'))",
    userId,
    title,
    eventTime
  );
  console.log("📝 Logged notification to DB:", { userId, title, eventTime });
}
